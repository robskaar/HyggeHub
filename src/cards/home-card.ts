import { css, html, nothing, type PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import { registerCard, HyggeCard } from '../shared/base-card';
import { base, glass } from '../shared/styles';
import type { CardConfig, HomeAssistant } from '../types';
import type { Countdowns3dCardConfig } from './countdowns-3d-card';
import type { PersonConfig } from './family-card';
import type { People3dCardConfig } from './people-3d-card';
import type { World } from './world-card';
import './energy-3d-card';
import './people-3d-card';
import './countdowns-3d-card';

type Tab = 'house' | 'people' | 'countdowns';

/** Waits for `p`, but no longer than `ms` (a view that never gets ready mustn't hold the tabs). */
const withTimeout = (p: Promise<unknown> | undefined, ms: number) => Promise.race([p ?? Promise.resolve(), new Promise(r => setTimeout(r, ms))]).catch(() => undefined);

export interface HomeCardConfig extends CardConfig {
  /** The house view: everything the 3D energy card takes (grid, solar, car, bins, alarm...). */
  house?: Record<string, unknown>;
  /** The people view: the same people as the family card. */
  people?: PersonConfig[];
  /** More places for the people view's town, beyond the zones and the calendars' places. */
  places?: People3dCardConfig['places'];
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

type ViewEl = HTMLElement & { setConfig(c: unknown): void; hass?: HomeAssistant; intro?: () => void; whenReady?: () => Promise<void> };
type HouseEl = ViewEl & { townScene(): (World & { listen(fn: (l: never[]) => void): void }) | undefined; setTownShown(on: boolean, instant?: boolean): Promise<void> };
type PeopleEl = ViewEl & { attach(world: unknown): void };

/**
 * The whole dashboard as 3D views behind tabs: the house, the people, the countdowns. Meant for a panel
 * view, so it fills the screen. Each view is the matching 3D card, created the first time its tab opens;
 * only the open one is attached, so only one scene draws at a time. The house and the people share one
 * scene: the people's town grows round the house view's island, and their labels sit over it.
 */
export class HyggeHomeCard extends HyggeCard<HomeCardConfig> {
  @state() private tab: Tab = 'house';
  @state() private error = '';
  /** The tab sliding out while the new one slides in, and which way they move. */
  @state() private leaving?: Tab;
  private slideDir = 1;
  /** The people view sits over the house view's scene (both configured), rather than drawing its own. */
  private linked?: Promise<void>;
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
    this.linked = undefined;
  }

  /** The house and the people as one scene: both are configured, and `t` is one of them. */
  private together(t: Tab) {
    return !!this.config.house && !!this.config.people?.length && (t === 'house' || t === 'people');
  }

  /** Which pane a tab is shown in: the house and the people share one. */
  private paneOf(t: Tab) {
    return this.together(t) ? 'home' : t;
  }

  private tabs(c = this.config): Tab[] {
    return (['house', 'people', 'countdowns'] as Tab[]).filter(t => (t === 'house' ? !!c.house : t === 'people' ? !!c.people?.length : !!c.countdowns?.length));
  }

  override getCardSize() {
    return 12;
  }

  // Every hass update goes to the open view (with the house and people together, to both), whatever
  // this card itself would re-render for.
  protected override shouldUpdate(changed: PropertyValues): boolean {
    for (const t of this.together(this.tab) ? (['house', 'people'] as Tab[]) : [this.tab]) {
      const v = this.views.get(t);
      if (v && this.hass) v.hass = this.hass;
    }
    return super.shouldUpdate(changed) || changed.has('tab') || changed.has('error') || changed.has('leaving');
  }

  private view(t: Tab): ViewEl | undefined {
    let el = this.views.get(t);
    if (el) return el;
    const c = this.config;
    el = document.createElement(TABS[t].tag) as ViewEl;
    const conf =
      t === 'house'
        ? { ...c.house, type: `custom:${TABS[t].tag}`, embedded: true, town: !!c.people?.length }
        : t === 'people'
          ? { type: `custom:${TABS[t].tag}`, embedded: true, people: c.people, places: c.places, house: c.house }
          : { type: `custom:${TABS[t].tag}`, embedded: true, countdowns: c.countdowns };
    try {
      el.setConfig(conf);
    } catch (err) {
      this.error = `${this.label(t)}: ${(err as Error).message}`;
      return undefined;
    }
    el.hass = this.hass;
    // The shared scene starts as the tab wants it: with the town, or just the house.
    if (t === 'house' && this.together('house')) void (el as HouseEl).setTownShown(this.tab === 'people', true);
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
    const samePane = this.paneOf(t) === this.paneOf(this.tab);
    // The old pane slides out while the new one slides in; then it is detached (its scene stops). Between
    // the house and the people nothing slides: the same scene shows or hides the town.
    if (!samePane) {
      this.leaving = t === this.leaving ? undefined : this.tab;
      clearTimeout(this.leaveTimer);
      this.leaveTimer = window.setTimeout(() => (this.leaving = undefined), 650);
    }
    this.tab = t;
    this.error = '';
    try {
      localStorage.setItem(STORE, t);
    } catch {
      /* storage blocked */
    }
  }

  /** The people view put over the house view's scene, once that has loaded. */
  private link() {
    const house = this.views.get('house') as HouseEl | undefined;
    const people = this.views.get('people') as PeopleEl | undefined;
    if (!house || !people) return;
    this.linked ??= (async () => {
      await withTimeout(house.whenReady?.(), 15000);
      const scene = house.townScene();
      if (!scene) return;
      people.attach(scene);
    })();
  }

  protected override updated(changed: PropertyValues) {
    super.updated(changed);
    if (this.together(this.tab)) this.link();
    if (!changed.has('tab') || changed.get('tab') === undefined) return;
    const was = changed.get('tab') as Tab;
    const house = this.views.get('house') as HouseEl | undefined;
    if (this.together(this.tab) && house) {
      const toPeople = this.tab === 'people';
      if (this.paneOf(was) === 'home') {
        // House ⇄ people: the town grows round the house, or sinks back into it.
        void this.linked?.then(() => house.setTownShown(toPeople));
      } else {
        // In from another tab: the town as the tab wants it, then the camera's glide (or the town rising).
        void this.linked?.then(async () => {
          await house.setTownShown(false, true);
          if (toPeople) await house.setTownShown(true);
          else house.intro?.();
        });
      }
      return;
    }
    // The new view's camera glides in as it slides into place.
    this.views.get(this.tab)?.intro?.();
  }

  /** What a pane shows: one view, or the house with the people's labels over it. */
  private paneContent(t: Tab) {
    if (this.error && t === this.tab) return html`<p class="err">${this.error}</p>`;
    if (!this.together(t)) return this.view(t) ?? nothing;
    const house = this.view('house');
    const people = this.view('people');
    return html`${house ?? nothing}${people ? html`<div class="over ${this.tab === 'people' ? '' : 'off'}">${people}</div>` : nothing}`;
  }

  protected override render() {
    const tabs = this.tabs();

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
        ${this.leaving ? html`<div class="pane out" aria-hidden="true">${this.paneContent(this.leaving)}</div>` : nothing}
        <div class="pane ${this.leaving ? 'in' : ''}">${this.paneContent(this.tab)}</div>
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
      /* The people's labels and details over the house's scene; hidden on the house tab. */
      .over {
        position: absolute;
        inset: 0;
        pointer-events: none;
        transition: opacity 0.3s;
      }
      .over.off {
        opacity: 0;
        visibility: hidden;
      }
      .pane > .over > * {
        display: block;
        height: 100%;
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
