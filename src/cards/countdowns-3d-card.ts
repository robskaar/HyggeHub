import { css, html, nothing } from 'lit';
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

/**
 * The countdowns as a carousel of themed islands, soonest first. Arrows, dots, swipes and the keyboard
 * move between them; the one in front has its label and opens its details.
 */
export class HyggeCountdowns3dCard extends WorldCard<Countdowns3dCardConfig> {
  protected override tickEvery = 30_000;
  @state() private index = 0;
  private swipeX?: number;

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
