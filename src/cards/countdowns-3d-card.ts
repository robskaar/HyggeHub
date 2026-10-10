import { css, html, nothing, type PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import { registerCard } from '../shared/base-card';
import { formatDay, formatTime, splitDuration } from '../shared/format';
import { base, glass } from '../shared/styles';
import { resolveCountdown, type CountdownCardConfig } from './countdown-card';
import type { CountdownsState } from './energy-3d/countdowns';
import type { StageLabel } from './energy-3d/stage';
import { themeOf } from './energy-3d/themes';
import { worldStyles } from './energy-3d/world-styles';
import { WorldCard, type WorldCardConfig, type WorldLabel, type WorldModule } from './world-card';

type Countdown = Pick<CountdownCardConfig, 'name' | 'subtitle' | 'icon' | 'target' | 'entity' | 'weekly' | 'yearly' | 'start' | 'value_entity' | 'value_target' | 'done_text'>;

export interface Countdowns3dCardConfig extends WorldCardConfig {
  /**
   * The same countdowns as the countdown card (name, icon, target / entity / weekly, yearly, start...).
   * A `yearly` one (birthdays, Christmas Eve) shows once, for its next date, and comes round again after.
   */
  countdowns: Countdown[];
}

const CLOCK = 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2';
const CUBE = 'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM4 7.5l8 4.5 8-4.5M12 12v9';
const LINE = 'M3 12h18M7 12a2 2 0 1 0 0 .01M14 12a2 2 0 1 0 0 .01M7 8V6M14 16v2';
const VIEW_KEY = 'hyggehub-countdowns-view';

/** Each theme's colour on the timeline. */
const COLOURS: Record<ReturnType<typeof themeOf>, string> = {
  beach: '#f0a04b',
  gift: '#e2668c',
  christmas: '#d9473f',
  mountain: '#4f9fb3',
  generic: 'var(--hh-accent)',
};

/** "2 wk", "5 mo": the time between two stops on the timeline. */
const span = (ms: number) => {
  const d = ms / 86_400_000;
  if (d < 1) return '';
  if (d < 14) return `${Math.round(d)} d`;
  if (d < 60) return `${Math.round(d / 7)} wk`;
  return `${Math.round(d / 30.4)} mo`;
};

/**
 * The countdowns as a carousel of themed islands, soonest first. Arrows, dots, swipes and the keyboard
 * move between them; the one in front has its label and opens its details. A chip switches to a
 * timeline instead: everything coming up along one line from now, spaced by how far off it is.
 */
export class HyggeCountdowns3dCard extends WorldCard<Countdowns3dCardConfig> {
  protected override tickEvery = 30_000;
  @state() private index = 0;
  @state() private view: 'world' | 'timeline' = HyggeCountdowns3dCard.savedView();
  private swipeX?: number;

  private static savedView(): 'world' | 'timeline' {
    try {
      return localStorage.getItem(VIEW_KEY) === 'timeline' ? 'timeline' : 'world';
    } catch {
      return 'world';
    }
  }

  private setView(v: 'world' | 'timeline') {
    if (this.detail) this.closeDetail();
    this.view = v;
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      /* private mode: just not remembered */
    }
  }

  protected override updated(changed: PropertyValues) {
    super.updated(changed);
    this.hide3d(this.view === 'timeline');
  }

  /** The switch between the islands and the timeline, beside the title. */
  protected override renderHeaderExtras() {
    const opt = (v: 'world' | 'timeline', icon: string, label: string) =>
      html`<button type="button" role="tab" aria-selected=${this.view === v} @click=${() => this.setView(v)}><svg viewBox="0 0 24 24" class="i"><path d=${icon}></path></svg>${label}</button>`;
    return html`<span class="viewseg" role="tablist" aria-label="View">${opt('world', CUBE, '3D')}${opt('timeline', LINE, 'Timeline')}</span>`;
  }

  static getStubConfig() {
    return { countdowns: [{ name: 'Summer holiday', icon: 'mdi:beach', target: `${new Date().getFullYear() + 1}-07-01T08:00` }] };
  }

  protected override validateConfig(c: Countdowns3dCardConfig) {
    if (!Array.isArray(c.countdowns) || !c.countdowns.length) throw new Error('List the countdowns under `countdowns`, as on the countdown card.');
    for (const d of c.countdowns) {
      if (!d.name) throw new Error('Give every countdown a `name`.');
      if (!d.target && !d.entity && !d.weekly) throw new Error(`"${d.name}": set \`target\`, \`entity\` or \`weekly\`.`);
    }
  }

  protected override watchedEntities() {
    return this.config.countdowns.flatMap(d => [d.entity, d.value_entity]);
  }

  private resolveOne(i: number) {
    const d = { type: 'countdown', ...this.config.countdowns[i] } as CountdownCardConfig;
    const r = resolveCountdown(this.hass, d);
    const ms = r.frozen ?? (r.target ? r.target.getTime() - Date.now() : Infinity);
    const done = !r.idleText && ms <= 0;
    // Birthdays: a yearly date in a past year says how old they turn.
    const born = d.yearly && d.target ? new Date(String(d.target)).getFullYear() : NaN;
    const age = r.target && isFinite(born) && themeOf(d.icon, d.name) === 'gift' ? r.target.getFullYear() - born : undefined;
    return { i, d, r, ms, left: splitDuration(Math.max(0, ms)), done, age: age && age > 0 ? age : undefined };
  }

  /** Soonest first: today's, then the coming ones by date, then those without a date. */
  private ordered() {
    return this.config.countdowns.map((_, i) => this.resolveOne(i)).sort((a, b) => a.ms - b.ms);
  }

  private current() {
    const all = this.ordered();
    return { all, at: Math.min(this.index, all.length - 1) };
  }

  private go(step: number) {
    const n = this.config.countdowns.length;
    const next = Math.max(0, Math.min(n - 1, this.current().at + step));
    if (next === this.index) return;
    if (this.detail) this.closeDetail();
    this.index = next;
  }

  /** "123 days", "1 day", "3 h 20 min", "Today". */
  private remaining(x: ReturnType<HyggeCountdowns3dCard['resolveOne']>) {
    if (x.r.idleText) return x.r.idleText;
    if (x.done) return 'Today';
    if (x.left.days >= 1) return `${x.left.days} ${x.left.days === 1 ? 'day' : 'days'}`;
    return x.left.hours ? `${x.left.hours} h ${x.left.minutes} min` : `${x.left.minutes} min`;
  }

  protected override createWorld(mod: WorldModule, canvas: HTMLCanvasElement, onLabels: (l: StageLabel[]) => void, dpr: number) {
    return new mod.CountdownScene(canvas, onLabels, dpr);
  }

  protected override worldState(): CountdownsState {
    const css = getComputedStyle(this);
    const { all, at } = this.current();
    return {
      ...this.look(),
      accent: css.getPropertyValue('--hh-accent').trim() || '#2f6e86',
      index: at,
      items: all.map(x => ({ key: `c${x.i}`, theme: themeOf(x.d.icon, x.d.name), progress: x.r.progress ?? 0, done: x.done })),
    };
  }

  protected override labels(): WorldLabel[] {
    if (this.view === 'timeline') return [];
    const { all, at } = this.current();
    const x = all[at];
    if (!x) return [];
    return [
      {
        key: `c${x.i}`,
        value: this.remaining(x),
        caption: x.age ? `${x.d.name} · turns ${x.age}` : x.d.name,
        icon: x.d.icon ?? CLOCK,
        color: 'var(--hh-accent)',
      },
    ];
  }

  protected override detailTitle(key: string) {
    return this.config.countdowns[Number(key.slice(1))].name;
  }

  protected override detailBody(key: string) {
    const x = this.resolveOne(Number(key.slice(1)));
    const { d, r, left, done } = x;
    const row = (name: string, value: unknown) => html`<div class="row"><span>${name}</span><b class="num">${value}</b></div>`;
    const when = r.target ? `${formatDay(r.target, this.hass)}${r.target.getHours() || r.target.getMinutes() ? `, ${formatTime(r.target, this.hass)}` : ''}` : '–';
    return html`
      ${d.subtitle || r.subtitle ? html`<p class="note" style="margin:6px 0 4px">${d.subtitle ?? r.subtitle}</p>` : nothing}
      ${row('When', when)}
      ${x.age ? row('Turns', x.age) : nothing}
      ${d.yearly ? row('Repeats', 'Every year') : nothing}
      ${r.idleText
        ? row('Status', r.idleText)
        : done
          ? row('Status', d.done_text ?? 'Today!')
          : html`${row('Days', left.days)}${row('Hours', left.hours)}${row('Minutes', left.minutes)}`}
      ${r.progress !== undefined ? html`<div class="progress" role="img" aria-label="${Math.round(r.progress * 100)}% of the wait has passed"><i style="width:${Math.round(r.progress * 100)}%"></i></div>` : nothing}
      ${d.entity ? html`<button type="button" class="more" @click=${() => this.moreInfo(d.entity)}>History and settings</button>` : nothing}
    `;
  }

  /** Arrows either side, dots below, and a layer that turns horizontal swipes into next and previous. */
  protected override renderStageExtras() {
    if (this.view === 'timeline') return this.renderTimeline();
    const { all, at } = this.current();
    if (all.length < 2) return nothing;
    return html`
      <div
        class="swipe"
        @pointerdown=${(e: PointerEvent) => (this.swipeX = e.clientX)}
        @pointerup=${(e: PointerEvent) => {
          if (this.swipeX === undefined) return;
          const dx = e.clientX - this.swipeX;
          this.swipeX = undefined;
          if (Math.abs(dx) > 40) this.go(dx < 0 ? 1 : -1);
        }}
        @pointercancel=${() => (this.swipeX = undefined)}
      ></div>
      <button type="button" class="nav prev" aria-label="Previous" ?disabled=${at === 0} @click=${() => this.go(-1)}>
        <svg viewBox="0 0 24 24" class="i"><path d="M15 6l-6 6 6 6"></path></svg>
      </button>
      <button type="button" class="nav next" aria-label="Next" ?disabled=${at === all.length - 1} @click=${() => this.go(1)}>
        <svg viewBox="0 0 24 24" class="i"><path d="M9 6l6 6-6 6"></path></svg>
      </button>
      <div class="dots" role="tablist" aria-label="Countdowns">
        ${all.map(
          (x, k) => html`<button type="button" role="tab" aria-selected=${k === at} aria-label=${x.d.name} @click=${() => {
            if (this.detail) this.closeDetail();
            this.index = k;
          }}></button>`,
        )}
      </div>
    `;
  }

  /**
   * Everything coming up along one line, starting from now. The stretch between two stops grows with
   * the time between them (by its square root, so next week and next summer both fit), and says how
   * long it is. Horizontal on a wide card, down the side on a narrow one; tap a stop for its details.
   */
  private renderTimeline() {
    const all = this.ordered();
    const dated = all.filter(x => isFinite(x.ms));
    const rest = all.filter(x => !isFinite(x.ms));
    let prev = 0;
    const stops = [...dated, ...rest].map((x, k) => {
      const ms = isFinite(x.ms) ? Math.max(0, x.ms) : prev;
      const gap = Math.max(0, ms - prev);
      prev = ms;
      return { x, k, gap };
    });
    return html`
      <div class="timeline">
        <div class="track" style="--n:${stops.length}">
          <div class="now"><span class="pulse"></span><b>Now</b><small>${formatDay(new Date(), this.hass)}</small></div>
          ${stops.map(({ x, k, gap }) => {
            const colour = COLOURS[themeOf(x.d.icon, x.d.name)];
            const when = x.r.target ? formatDay(x.r.target, this.hass) : '';
            const grow = Math.max(0.35, Math.sqrt(gap / 86_400_000) / 3);
            return html`
              <div class="gap" style="flex-grow:${grow.toFixed(2)};--d:${k}"><i></i><small>${span(gap)}</small></div>
              <button
                type="button"
                class="stop ${k % 2 ? 'b' : 'a'} ${x.done ? 'today' : ''}"
                style="--c:${colour};--d:${k}"
                aria-haspopup="dialog"
                @click=${() => this.openDetail(`c${x.i}`)}
              >
                <span class="dot">${this.glyph(x.d.icon ?? CLOCK)}</span>
                <span class="card">
                  <small>${when}</small>
                  <b>${x.d.name}</b>
                  <em class="num">${x.done ? 'Today' : x.r.idleText ? x.r.idleText : `in ${this.remaining(x)}`}</em>
                  ${x.age ? html`<small>Turns ${x.age}</small>` : nothing}
                  ${x.r.progress !== undefined && !x.done ? html`<span class="bar"><i style="width:${Math.round(x.r.progress * 100)}%"></i></span>` : nothing}
                </span>
              </button>
            `;
          })}
          <div class="gap end"><i></i></div>
        </div>
      </div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this.onKey);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.onKey);
  }

  private onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') this.go(1);
    if (e.key === 'ArrowLeft') this.go(-1);
  };

  static override styles = [
    base,
    glass,
    worldStyles,
    css`
      .overlay .viewseg {
        pointer-events: auto;
      }
      .viewseg {
        display: inline-flex;
        gap: 2px;
        padding: 3px;
        border-radius: 999px;
        background: var(--hh-glass-strong);
        -webkit-backdrop-filter: blur(14px) saturate(160%);
        backdrop-filter: blur(14px) saturate(160%);
        border: 1px solid var(--hh-stroke);
        box-shadow: var(--hh-shadow);
        align-self: flex-start;
      }
      .viewseg button {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 5px 11px 5px 9px;
        border-radius: 999px;
        font-size: 12.5px;
        font-weight: 600;
        color: var(--hh-ink-2);
        transition: background 0.25s, color 0.25s;
      }
      .viewseg button[aria-selected='true'] {
        background: var(--hh-accent);
        color: var(--hh-on-accent);
      }
      .viewseg .i {
        width: 15px;
        height: 15px;
      }

      /* ---------- the timeline ---------- */
      .stage:has(.timeline) canvas,
      .stage:has(.timeline) .loading {
        visibility: hidden;
      }
      .timeline {
        position: absolute;
        inset: 0;
        z-index: 1;
        container-type: inline-size;
        overflow: auto;
        scrollbar-width: none;
        padding: 120px 40px 40px;
        box-sizing: border-box;
        display: flex;
      }
      ha-card:not(.embedded) .timeline {
        padding-top: 90px;
      }
      .track {
        flex: 1;
        display: flex;
        align-items: center;
        min-width: calc(var(--n) * 150px + 120px);
        min-height: 300px;
      }
      .now {
        flex: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        position: relative;
        font-size: 13px;
        color: var(--hh-ink);
      }
      .now small {
        color: var(--hh-ink-3);
        font-size: 11px;
      }
      .pulse {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--hh-accent);
        box-shadow: 0 0 0 6px color-mix(in srgb, var(--hh-accent) 22%, transparent);
      }
      .gap {
        position: relative;
        min-width: 70px;
        align-self: stretch;
        display: grid;
        place-items: center;
      }
      .gap i {
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 4px;
        margin-top: -2px;
        border-radius: 4px;
        background: linear-gradient(90deg, color-mix(in srgb, var(--hh-accent) 70%, transparent), color-mix(in srgb, var(--hh-ink-3) 45%, transparent));
        transform-origin: left center;
      }
      .gap.end i {
        background: linear-gradient(90deg, color-mix(in srgb, var(--hh-ink-3) 45%, transparent), transparent);
      }
      .gap.end {
        flex: 0 0 60px;
      }
      .gap small {
        position: relative;
        margin-top: 28px;
        font-size: 10.5px;
        font-weight: 600;
        letter-spacing: 0.04em;
        color: var(--hh-ink-3);
      }
      .stop {
        flex: none;
        position: relative;
        z-index: 2;
        width: 0;
        align-self: stretch;
        display: grid;
        place-items: center;
      }
      .dot {
        position: relative;
        z-index: 1;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: var(--c);
        color: #fff;
        --mdc-icon-size: 22px;
        box-shadow: 0 6px 16px color-mix(in srgb, var(--c) 45%, transparent), inset 0 -3px 0 rgba(0, 0, 0, 0.12);
        border: 3px solid var(--hh-glass-strong);
        transition: transform 0.3s var(--spring);
      }
      .dot .i {
        width: 22px;
        height: 22px;
      }
      .stop:hover .dot,
      .stop:focus-visible .dot {
        transform: scale(1.12);
      }
      .card {
        position: absolute;
        left: 50%;
        width: 150px;
        margin-left: -75px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 9px 10px 10px;
        border-radius: 16px;
        text-align: center;
        background: var(--hh-glass-strong);
        -webkit-backdrop-filter: blur(14px) saturate(160%);
        backdrop-filter: blur(14px) saturate(160%);
        border: 1px solid var(--hh-stroke);
        box-shadow: var(--hh-shadow);
      }
      .card::before {
        content: '';
        position: absolute;
        left: 50%;
        width: 2px;
        height: 18px;
        margin-left: -1px;
        background: color-mix(in srgb, var(--c) 60%, transparent);
      }
      .stop.a .card {
        bottom: calc(50% + 40px);
      }
      .stop.a .card::before {
        top: 100%;
      }
      .stop.b .card {
        top: calc(50% + 40px);
      }
      .stop.b .card::before {
        bottom: 100%;
      }
      .card small {
        font-size: 11px;
        color: var(--hh-ink-3);
      }
      .card b {
        font-size: 13.5px;
        font-weight: 600;
        color: var(--hh-ink);
        line-height: 1.2;
      }
      .card em {
        font-style: normal;
        font-size: 15px;
        font-weight: 700;
        color: var(--c);
      }
      .card .bar {
        width: 100%;
        height: 4px;
        margin-top: 4px;
        border-radius: 4px;
        background: var(--hh-line);
        overflow: hidden;
      }
      .card .bar i {
        display: block;
        height: 100%;
        border-radius: 4px;
        background: var(--c);
      }
      .stop.today .dot::after {
        content: '';
        position: absolute;
        inset: -8px;
        border-radius: 50%;
        border: 2px solid var(--c);
        opacity: 0.6;
      }
      @media (prefers-reduced-motion: no-preference) {
        .gap i {
          animation: draw 0.6s var(--ease, ease) both;
          animation-delay: calc(var(--d, 0) * 0.12s);
        }
        .stop {
          animation: pop 0.5s var(--spring, ease) both;
          animation-delay: calc(var(--d, 0) * 0.12s + 0.2s);
        }
        .pulse,
        .stop.today .dot::after {
          animation: beat 2s ease-in-out infinite;
        }
      }
      @keyframes draw {
        from {
          transform: scaleX(0);
        }
      }
      @keyframes pop {
        from {
          opacity: 0;
          transform: scale(0.6);
        }
      }
      @keyframes beat {
        50% {
          box-shadow: 0 0 0 11px color-mix(in srgb, var(--hh-accent) 0%, transparent);
          transform: scale(1.08);
        }
      }

      /* Narrow: down the side, the cards to the right of the line. */
      @container (max-width: 560px) {
        .track {
          flex-direction: column;
          align-items: stretch;
          min-width: 0;
          min-height: calc(var(--n) * 96px + 80px);
        }
        .now {
          flex-direction: row;
          align-self: flex-start;
          gap: 10px;
          padding-left: 14px;
        }
        .gap {
          min-width: 0;
          min-height: 34px;
          place-items: center start;
        }
        .gap i {
          left: 21px;
          right: auto;
          top: 0;
          bottom: 0;
          width: 4px;
          height: auto;
          margin: 0 0 0 -2px;
          background: linear-gradient(180deg, color-mix(in srgb, var(--hh-accent) 70%, transparent), color-mix(in srgb, var(--hh-ink-3) 45%, transparent));
          transform-origin: center top;
        }
        .gap.end {
          flex: 0 0 40px;
        }
        .gap.end i {
          background: linear-gradient(180deg, color-mix(in srgb, var(--hh-ink-3) 45%, transparent), transparent);
        }
        .gap small {
          margin: 0 0 0 36px;
        }
        .stop {
          width: auto;
          height: 0;
          align-self: stretch;
          place-items: center start;
        }
        .dot {
          margin-left: -1px;
        }
        .stop.a .card,
        .stop.b .card {
          top: 50%;
          bottom: auto;
          left: 62px;
          right: 4px;
          width: auto;
          margin: 0;
          transform: translateY(-50%);
          align-items: flex-start;
          text-align: left;
        }
        .card::before {
          display: none;
        }
        .timeline {
          padding: 120px 18px 30px;
        }
        .gap i {
          animation-name: drawY;
        }
      }
      @keyframes drawY {
        from {
          transform: scaleY(0);
        }
      }
      .swipe {
        position: absolute;
        inset: 0;
        touch-action: pan-y;
      }
      .nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: var(--hh-glass-strong);
        -webkit-backdrop-filter: blur(14px) saturate(160%);
        backdrop-filter: blur(14px) saturate(160%);
        border: 1px solid var(--hh-stroke);
        box-shadow: var(--hh-shadow);
        color: var(--hh-ink);
        transition: opacity 0.25s, transform 0.25s var(--spring);
      }
      .nav:active {
        transform: translateY(-50%) scale(0.92);
      }
      .nav[disabled] {
        opacity: 0;
        pointer-events: none;
      }
      .prev {
        left: 14px;
      }
      .next {
        right: 14px;
      }
      .focused .nav,
      .focused .dots {
        opacity: 0;
        pointer-events: none;
      }
      .dots {
        position: absolute;
        bottom: 18px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;
        display: flex;
        gap: 8px;
        padding: 7px 10px;
        border-radius: 999px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        transition: opacity 0.25s;
      }
      .dots button {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: var(--hh-ink-3);
        opacity: 0.45;
        transition: width 0.3s var(--ease), opacity 0.3s, background 0.3s;
      }
      .dots button[aria-selected='true'] {
        width: 22px;
        opacity: 1;
        background: var(--hh-accent);
      }
    `,
  ];
}

registerCard('hyggehub-countdowns-3d-card', HyggeCountdowns3dCard, 'HyggeHub Countdowns 3D', 'The countdowns as a carousel of floating islands dressed for the occasion, soonest first.');
