import { css, html, nothing, type PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import { registerCard, HyggeCard } from '../shared/base-card';
import { base, glass } from '../shared/styles';
import type { CardConfig, HomeAssistant } from '../types';
import type { Countdowns3dCardConfig } from './countdowns-3d-card';
import type { PersonConfig } from './family-card';
import './energy-3d-card';
import './people-3d-card';
import './countdowns-3d-card';

type Tab = 'house' | 'people' | 'countdowns';

export interface HomeCardConfig extends CardConfig {
  /** The house view: everything the 3D energy card takes (grid, solar, car, bins, alarm...). */
  house?: Record<string, unknown>;
  /** The people view: the same people as the family card. */
  people?: PersonConfig[];
  /** The countdowns view: the same countdowns as the countdown card. */
  countdowns?: Countdowns3dCardConfig['countdowns'];
  /** Tab names, e.g. { house: Hus, people: Personer }. */
  tabs?: Partial<Record<Tab, string>>;
  /** Height as CSS. Default: the whole screen below Home Assistant's header (for a panel view). */
  height?: string;
}

const TABS: Record<Tab, { tag: string; label: string; icon: string }> = {
  house: { tag: 'hyggehub-energy-3d-card', label: 'Home', icon: 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5' },
  people: {
    tag: 'hyggehub-people-3d-card',
    label: 'People',
    icon: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5M14 14.2c3.3-.4 6 1.5 6 4.8',
  },
  countdowns: { tag: 'hyggehub-countdowns-3d-card', label: 'Countdowns', icon: 'M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9' },
};
const STORE = 'hyggehub:home-tab';

type ViewEl = HTMLElement & { setConfig(c: unknown): void; hass?: HomeAssistant; intro?: () => void };

/**
 * The whole dashboard as 3D views behind tabs: the house, the people, the countdowns. Meant for a panel
 * view, so it fills the screen. Each view is the matching 3D card, created the first time its tab opens;
 * only the open one is attached, so only one scene draws at a time.
 */
export class HyggeHomeCard extends HyggeCard<HomeCardConfig> {
  @state() private tab: Tab = 'house';
  @state() private error = '';
  /** The tab sliding out while the new one slides in, and which way they move. */
  @state() private leaving?: Tab;
  private slideDir = 1;
  private leaveTimer?: number;
  private views = new Map<Tab, ViewEl>();

  static getStubConfig() {
    return { house: { grid: 'sensor.grid_power' } };
  }

  protected override validateConfig(c: HomeCardConfig) {
    if (!c.house && !c.people?.length && !c.countdowns?.length) throw new Error('Set at least one of `house`, `people` or `countdowns`.');
    const tabs = this.tabs(c);
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORE);
    } catch {
      /* storage blocked */
    }
    this.tab = tabs.includes(saved as Tab) ? (saved as Tab) : tabs[0];
    // A changed config rebuilds the views.
    this.views.clear();
  }

  private tabs(c = this.config): Tab[] {
    return (['house', 'people', 'countdowns'] as Tab[]).filter(t => (t === 'house' ? !!c.house : t === 'people' ? !!c.people?.length : !!c.countdowns?.length));
  }

  override getCardSize() {
    return 12;
  }

  // Every hass update goes to the open view, whatever this card itself would re-render for.
  protected override shouldUpdate(changed: PropertyValues): boolean {
    const v = this.views.get(this.tab);
    if (v && this.hass) v.hass = this.hass;
    return super.shouldUpdate(changed) || changed.has('tab') || changed.has('error') || changed.has('leaving');
  }

  private view(t: Tab): ViewEl | undefined {
    let el = this.views.get(t);
    if (el) return el;
    const c = this.config;
    el = document.createElement(TABS[t].tag) as ViewEl;
    const conf =
      t === 'house'
        ? { ...c.house, type: `custom:${TABS[t].tag}`, embedded: true }
        : t === 'people'
          ? { type: `custom:${TABS[t].tag}`, embedded: true, people: c.people }
          : { type: `custom:${TABS[t].tag}`, embedded: true, countdowns: c.countdowns };
    try {
      el.setConfig(conf);
    } catch (err) {
      this.error = `${this.label(t)}: ${(err as Error).message}`;
      return undefined;
    }
    el.hass = this.hass;
    this.views.set(t, el);
    return el;
  }

  private label(t: Tab) {
    return this.config.tabs?.[t] ?? TABS[t].label;
  }

  private select(t: Tab) {
    if (t === this.tab) return;
    const order = this.tabs();
    this.slideDir = order.indexOf(t) > order.indexOf(this.tab) ? 1 : -1;
    // The old view slides out while the new one slides in; then it is detached (its scene stops).
    this.leaving = t === this.leaving ? undefined : this.tab;
    clearTimeout(this.leaveTimer);
    this.leaveTimer = window.setTimeout(() => (this.leaving = undefined), 650);
    this.tab = t;
    this.error = '';
    try {
      localStorage.setItem(STORE, t);
    } catch {
      /* storage blocked */
    }
  }

  protected override updated(changed: PropertyValues) {
    super.updated(changed);
    // The new view's camera glides in as it slides into place.
    if (changed.has('tab') && changed.get('tab') !== undefined) this.views.get(this.tab)?.intro?.();
  }

  protected override render() {
    const tabs = this.tabs();
    const el = this.view(this.tab);
    const out = this.leaving ? this.views.get(this.leaving) : undefined;
    const h = this.config.height ?? 'calc(100dvh - var(--header-height, 56px) - env(safe-area-inset-top, 0px))';
    return html`<ha-card class="glass home" style="height:${h}">
      ${tabs.length > 1
        ? html`<nav class="tabs" role="tablist">
            ${tabs.map(
              t => html`<button type="button" role="tab" aria-selected=${t === this.tab} @click=${() => this.select(t)}>
                <svg viewBox="0 0 24 24" class="i"><path d=${TABS[t].icon}></path></svg><span>${this.label(t)}</span>
              </button>`,
            )}
          </nav>`
        : nothing}
      <div class="view" role="tabpanel" style="--dir:${this.slideDir}">
        ${out ? html`<div class="pane out" aria-hidden="true">${out}</div>` : nothing}
        <div class="pane ${this.leaving ? 'in' : ''}">${this.error ? html`<p class="err">${this.error}</p>` : (el ?? nothing)}</div>
      </div>
    </ha-card>`;
  }

  static override styles = [
    base,
    glass,
    css`
      ha-card.home {
        padding: 0;
        position: relative;
        overflow: hidden;
        border-radius: 0;
        border: none;
      }
      .view {
        position: absolute;
        inset: 0;
      }
      .pane {
        position: absolute;
        inset: 0;
      }
      .pane > * {
        display: block;
        height: 100%;
      }
      /* Tab change: the new view glides in from the side it is on, the old one glides away and fades. */
      .pane.in {
        animation: pane-in 0.6s var(--ease) both;
      }
      .pane.out {
        pointer-events: none;
        animation: pane-out 0.6s var(--ease) both;
      }
      @keyframes pane-in {
        from {
          opacity: 0;
          transform: translateX(calc(var(--dir) * 9%)) scale(0.97);
        }
      }
      @keyframes pane-out {
        to {
          opacity: 0;
          transform: translateX(calc(var(--dir) * -9%)) scale(0.97);
        }
      }
      .tabs {
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 5;
        display: flex;
        gap: 4px;
        padding: 4px;
        border-radius: 999px;
        background: var(--hh-glass-strong);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
        backdrop-filter: blur(18px) saturate(160%);
        border: 1px solid var(--hh-stroke);
        box-shadow: var(--hh-shadow);
        max-width: calc(100% - 24px);
      }
      .tabs button {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 600;
        color: var(--hh-ink-2);
        white-space: nowrap;
        transition: background 0.25s, color 0.25s;
      }
      .tabs button[aria-selected='true'] {
        background: var(--hh-accent);
        color: var(--hh-on-accent);
      }
      .tabs svg.i {
        width: 17px;
        height: 17px;
      }
      @media (max-width: 420px) {
        .tabs button {
          padding: 8px 11px;
        }
        .tabs button[aria-selected='false'] span {
          display: none;
        }
      }
      .err {
        margin: 80px 18px 0;
        color: var(--hh-crit);
        font-size: 13px;
      }
    `,
  ];
}

registerCard('hyggehub-home-card', HyggeHomeCard, 'HyggeHub Home', 'The whole home in 3D behind tabs: the house, the people, the countdowns. For a panel view.');
