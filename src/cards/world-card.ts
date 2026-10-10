import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { HyggeCard } from '../shared/base-card';
import { haIcon } from '../shared/icons';
import { engine } from '../theme/engine';
import type { CardConfig } from '../types';
import type { StageLabel } from './energy-3d/stage';

/** The three.js side of a view, as the card drives it (see energy-3d/stage.ts). */
export interface World {
  setState(s: unknown): void;
  start(): void;
  stop(): void;
  renderOnce(): void;
  resize(w: number, h: number): void;
  focus(key: string | null, side?: 'right' | 'bottom'): void;
  intro(): void;
  dispose(): void;
}

export type WorldModule = typeof import('./energy-3d/worlds');

export interface WorldLabel {
  key: string;
  value: string;
  caption: string;
  /** An SVG path, or an mdi: icon. */
  icon: string;
  color: string;
  /** Small coloured icons after the text, e.g. the kinds of waste. */
  chips?: Array<{ icon: string; color: string; name: string }>;
}

export interface WorldCardConfig extends CardConfig {
  title?: string;
  /** Scene height in px. Inside the home card it fills the space below the tabs. */
  height?: number;
  /** Set by the home card: fill the space given, no card chrome. */
  embedded?: boolean;
}

/**
 * A card that is one 3D view: a canvas with labels pinned to the scene, and a details panel that opens
 * beside the spot it zooms in on when a label is tapped. Subclasses say which scene, what state it gets,
 * the labels, and what the details show.
 */
export abstract class WorldCard<C extends WorldCardConfig> extends HyggeCard<C> {
  @state() protected detail?: string;
  protected world?: World;
  private loading?: Promise<void>;
  private failed = false;
  private visible = true;
  private compact = false;
  private disposeTimer?: number;
  private resizer?: ResizeObserver;
  private seen?: IntersectionObserver;
  private ticker?: number;
  private onEngine = () => this.push();
  /** True while the card shows something else in place of the scene (the countdowns' timeline). */
  private hidden3d = false;

  protected abstract createWorld(mod: WorldModule, canvas: HTMLCanvasElement, onLabels: (l: StageLabel[]) => void, pixelRatio: number): World;
  protected abstract worldState(): unknown;
  protected abstract labels(): WorldLabel[];
  protected abstract detailTitle(key: string): string;
  protected abstract detailBody(key: string): TemplateResult | typeof nothing;
  /** Re-render this often while shown, e.g. every second for a countdown. Default: once a minute. */
  protected tickEvery = 60_000;

  override getCardSize() {
    return 7;
  }

  override connectedCallback() {
    super.connectedCallback();
    clearTimeout(this.disposeTimer);
    engine.addEventListener('change', this.onEngine);
    this.ticker = window.setInterval(() => this.requestUpdate(), this.tickEvery);
    if (this.world) this.resume();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    engine.removeEventListener('change', this.onEngine);
    clearInterval(this.ticker);
    this.world?.stop();
    // Keep the WebGL context briefly (Home Assistant re-attaches cards when switching views), not forever.
    this.disposeTimer = window.setTimeout(() => {
      this.resizer?.disconnect();
      this.seen?.disconnect();
      this.world?.dispose();
      this.world = undefined;
      this.loading = undefined;
    }, 30_000);
  }

  protected override firstUpdated() {
    void this.init();
  }

  protected override updated(changed: PropertyValues) {
    super.updated(changed);
    this.push();
  }

  /** Light and motion as the house uses them: night from the sun, else from the HyggeHub look. */
  protected look() {
    const sun = this.hass?.states['sun.sun'];
    const el = Number(sun?.attributes.elevation);
    const night = isFinite(el) ? Math.min(1, Math.max(0, (6 - el) / 12)) : sun ? (sun.state === 'below_horizon' ? 1 : 0) : engine.resolved?.slot === 'night' ? 1 : 0;
    return { night, motion: engine.motionOn };
  }

  protected push() {
    if (this.world && this.config) this.world.setState(this.worldState());
  }

  private init(): Promise<void> {
    return (this.loading ??= (async () => {
      const canvas = this.renderRoot.querySelector('canvas');
      if (!canvas) return;
      try {
        const mod = await import('./energy-3d/worlds');
        this.world = this.createWorld(mod, canvas, l => this.placeLabels(l), Math.min(window.devicePixelRatio || 1, 2));
      } catch (err) {
        console.warn('HyggeHub: 3D view unavailable', err);
        this.failed = true;
        this.requestUpdate();
        return;
      }
      const stage = canvas.parentElement!;
      this.resizer = new ResizeObserver(() => {
        this.compact = stage.clientWidth < 440;
        stage.classList.toggle('compact', this.compact);
        this.world?.resize(stage.clientWidth, stage.clientHeight);
      });
      this.resizer.observe(stage);
      this.seen = new IntersectionObserver(entries => {
        this.visible = entries.some(e => e.isIntersecting);
        this.resume();
      });
      this.seen.observe(this);
      this.push();
      this.world.resize(stage.clientWidth, stage.clientHeight);
      this.resume();
      this.world.intro();
      stage.classList.add('ready');
    })());
  }

  private resume() {
    if (!this.world) {
      if (this.isConnected && !this.failed) void this.init();
      return;
    }
    if (this.hidden3d) this.world.stop();
    else if (this.visible && this.isConnected && engine.motionOn) this.world.start();
    else {
      this.world.stop();
      this.world.renderOnce();
    }
  }

  private placeLabels(labels: StageLabel[]) {
    for (const l of labels) {
      const el = this.renderRoot.querySelector<HTMLElement>(`.tag[data-key="${CSS.escape(l.key)}"]`);
      if (!el) continue;
      el.style.transform = `translate(${l.x}px, ${l.y}px) translate(-50%, -50%)`;
      el.classList.toggle('off', !l.visible);
    }
  }

  /** Stop drawing the scene while something else covers it, and pick up again after. */
  protected hide3d(hidden: boolean) {
    if (hidden === this.hidden3d) return;
    this.hidden3d = hidden;
    this.resume();
    if (!hidden) this.world?.intro();
  }

  protected openDetail(key: string) {
    this.detail = key;
    this.world?.focus(key, this.compact ? 'bottom' : 'right');
  }

  protected closeDetail() {
    this.detail = undefined;
    this.world?.focus(null);
  }

  /** Over the scene's top-left, under the title. */
  protected renderHeaderExtras(): TemplateResult | typeof nothing {
    return nothing;
  }

  /** Inside the stage, under the labels: a view's own controls (the countdowns' arrows and dots). */
  protected renderStageExtras(): TemplateResult | typeof nothing {
    return nothing;
  }

  /** The camera glides in, as when the view's tab opens. */
  intro() {
    this.world?.intro();
  }

  protected glyph(icon: string) {
    return icon.startsWith('mdi:') ? haIcon(icon) : html`<svg viewBox="0 0 24 24" class="i"><path d=${icon}></path></svg>`;
  }

  protected override render() {
    const c = this.config;
    if (this.failed) return html`<ha-card class="glass"><p class="note" style="padding:18px">3D needs WebGL, which this browser doesn't offer.</p></ha-card>`;
    const labels = this.labels();
    const detail = this.detail ? labels.find(l => l.key === this.detail) : undefined;
    return html`
      <ha-card class=${classMap({ glass: true, embedded: !!c.embedded })}>
        <div class=${classMap({ stage: true, focused: !!this.detail })} style=${c.embedded ? 'height:100%' : `height:${c.height ?? 380}px`}>
          <canvas role="img" aria-label=${labels.map(l => `${l.caption} ${l.value}`).join(', ')}></canvas>
          <div class="loading" aria-hidden="true"></div>
          ${this.renderStageExtras()}
          ${labels.map(
            l => html`<button type="button" class="tag" data-key=${l.key} @click=${() => this.openDetail(l.key)} aria-haspopup="dialog">
              <span class="ic" style="color:${l.color}">${this.glyph(l.icon)}</span>
              <span class="txt"><b class="num">${l.value}</b><small>${l.caption}</small></span>
              ${l.chips?.length ? html`<span class="kinds">${l.chips.map(k => html`<span class="kind" style="--c:${k.color}" title=${k.name}>${haIcon(k.icon)}</span>`)}</span>` : nothing}
            </button>`,
          )}
          ${this.detail
            ? html`<div class="panel" role="dialog" aria-label=${this.detailTitle(this.detail)} @keydown=${(e: KeyboardEvent) => e.key === 'Escape' && this.closeDetail()}>
                <div class="panel-h">
                  <button type="button" class="back" @click=${() => this.closeDetail()}><svg viewBox="0 0 24 24" class="i"><path d="M15 6l-6 6 6 6"></path></svg>Back</button>
                  ${detail ? html`<span class="ic" style="color:${detail.color}">${this.glyph(detail.icon)}</span>` : nothing}
                  <h4>${this.detailTitle(this.detail)}</h4>
                </div>
                <div class="panel-b">${this.detailBody(this.detail)}</div>
              </div>`
            : nothing}
        </div>
        <div class="card-h overlay">
          <div class="title">
            ${c.embedded ? nothing : html`<h3>${c.title ?? ''}</h3>`}
            ${this.renderHeaderExtras()}
          </div>
        </div>
      </ha-card>
    `;
  }
}
