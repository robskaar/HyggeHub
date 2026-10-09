import { css, html, nothing } from 'lit';
import { registerCard, HyggeCard } from '../shared/base-card';
import { haIcon } from '../shared/icons';
import { durationSeconds, formatDay, formatTime, numeric, pad, splitDuration } from '../shared/format';
import { base, glass } from '../shared/styles';
import { engine } from '../theme/engine';
import type { CardConfig, HomeAssistant } from '../types';

const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export interface CountdownCardConfig extends CardConfig {
  name: string;
  subtitle?: string;
  icon?: string;
  /** `ring` for a big trip-style countdown, `compact` for a small tile. */
  style?: 'ring' | 'compact';
  /** A fixed moment, e.g. "2026-12-18T09:40". */
  target?: string;
  /** Count down to an entity instead: timer, input_datetime, a timestamp sensor or a calendar. */
  entity?: string;
  /** Repeats every week, e.g. bin day: { day: tue, time: "07:00" }. */
  weekly?: { day: string; time?: string };
  /** Repeat `target` every year (birthdays, anniversaries). */
  yearly?: boolean;
  /** When the wait started, so the ring shows how much of it has passed. */
  start?: string;
  /** A value that rises towards a target while you wait, e.g. a sauna's temperature. */
  value_entity?: string;
  value_target?: number;
  value_unit?: string;
  animation?: 'flicker' | 'pulse' | 'none';
  chips?: Array<{ name: string; color?: string }>;
  done_text?: string;
}

export interface Resolved {
  target?: Date;
  /** Fixed remaining time for a paused timer. */
  frozen?: number;
  progress?: number;
  subtitle?: string;
  idleText?: string;
}

/** When a countdown ends, how far through the wait it is, and what to say when it has nothing to count. */
export function resolveCountdown(hass: HomeAssistant | undefined, c: CountdownCardConfig): Resolved {
  const stateOf = (id?: string) => (id ? hass?.states[id] : undefined);
  const now = new Date();
  const r: Resolved = {};
  const s = stateOf(c.entity);
  const domain = c.entity?.split('.')[0];

  if (s && domain === 'timer') {
    const total = durationSeconds(s.attributes.duration);
    if (s.state === 'active' && s.attributes.finishes_at) r.target = new Date(s.attributes.finishes_at);
    else if (s.state === 'paused') r.frozen = durationSeconds(s.attributes.remaining) * 1000;
    else r.idleText = 'Not running';
    const left = r.frozen ?? (r.target ? r.target.getTime() - now.getTime() : total * 1000);
    if (total) r.progress = 1 - left / (total * 1000);
  } else if (s && domain === 'input_datetime') {
    if (s.attributes.has_date) r.target = new Date((s.attributes.timestamp as number) * 1000);
    else {
      const t = new Date(now);
      t.setHours(s.attributes.hour ?? 0, s.attributes.minute ?? 0, s.attributes.second ?? 0, 0);
      if (t <= now) t.setDate(t.getDate() + 1);
      r.target = t;
    }
  } else if (s && domain === 'calendar') {
    if (s.attributes.start_time) r.target = new Date(String(s.attributes.start_time).replace(' ', 'T'));
    r.subtitle = s.attributes.message as string | undefined;
    if (!r.target) r.idleText = 'Nothing coming up';
  } else if (s) {
    const d = new Date(s.state);
    if (!isNaN(d.getTime())) r.target = d;
    else r.idleText = 'No time set';
  } else if (c.entity) {
    r.idleText = `${c.entity} is not available`;
  } else if (c.weekly) {
    const [h, m] = (c.weekly.time ?? '00:00').split(':').map(Number);
    const day = WEEKDAYS.indexOf(String(c.weekly.day).slice(0, 3).toLowerCase());
    const t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
    while (t.getDay() !== day || t <= now) t.setDate(t.getDate() + 1);
    r.target = t;
    r.progress = 1 - (t.getTime() - now.getTime()) / (7 * 864e5);
  } else if (c.target) {
    // A date without a time ("1994-09-29") is that day here, not midnight UTC.
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(String(c.target).trim());
    const t = new Date(dateOnly ? `${c.target}T00:00:00` : c.target);
    if (c.yearly) {
      t.setFullYear(now.getFullYear());
      // On the day itself a yearly date stays "today" until midnight, then moves on to next year.
      const today = dateOnly && t.toDateString() === now.toDateString();
      if (t <= now && !today) t.setFullYear(now.getFullYear() + 1);
    }
    r.target = isNaN(t.getTime()) ? undefined : t;
    if (!r.target) r.idleText = '`target` is not a date';
  }

  if (r.progress === undefined && r.target) {
    if (c.start) {
      const st = new Date(c.start).getTime();
      r.progress = (now.getTime() - st) / (r.target.getTime() - st);
    } else {
      r.progress = 1 - Math.min(r.target.getTime() - now.getTime(), 365 * 864e5) / (365 * 864e5);
    }
  }
  const v = numeric(stateOf(c.value_entity));
  if (v !== undefined && c.value_target) r.progress = v / c.value_target;
  if (r.progress !== undefined) r.progress = Math.min(1, Math.max(0, r.progress));
  return r;
}

export class HyggeCountdownCard extends HyggeCard<CountdownCardConfig> {
  private ticker?: number;
  private shown = new Map<string, string>();

  static getStubConfig() {
    return { name: 'Lofoten', subtitle: 'Flight to Bodø', icon: 'mdi:image-filter-hdr', target: `${new Date().getFullYear()}-12-18T09:40`, style: 'ring' };
  }

  protected override validateConfig(c: CountdownCardConfig) {
    if (!c.name) throw new Error('Give the countdown a `name`.');
    if (!c.target && !c.entity && !c.weekly) throw new Error('Set `target`, `entity` or `weekly`.');
    if (c.weekly && !WEEKDAYS.includes(String(c.weekly.day).slice(0, 3).toLowerCase())) throw new Error('`weekly.day` must be a weekday, like `tue`.');
  }

  protected override watchedEntities() {
    return [this.config.entity, this.config.value_entity];
  }

  override getCardSize() {
    return this.config.style === 'compact' ? 2 : 3;
  }

  override getGridOptions() {
    return this.config.style === 'compact' ? { columns: 6, min_columns: 4 } : { columns: 12, min_columns: 6 };
  }

  override connectedCallback() {
    super.connectedCallback();
    this.ticker = window.setInterval(() => this.requestUpdate(), 1000);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.ticker);
  }

  private resolve(): Resolved {
    return resolveCountdown(this.hass, this.config);
  }

  protected override updated() {
    // Roll a digit in when it changes, the way a split-flap clock does.
    if (!engine.motionOn) return;
    this.renderRoot.querySelectorAll<HTMLElement>('[data-t]').forEach(el => {
      const key = el.dataset.t!;
      const text = el.textContent ?? '';
      if (this.shown.has(key) && this.shown.get(key) !== text) {
        el.classList.remove('tick');
        void el.offsetWidth;
        el.classList.add('tick');
      }
      this.shown.set(key, text);
    });
  }

  private whenText(r: Resolved): string {
    if (!r.target) return '';
    const day = formatDay(r.target, this.hass);
    const hasTime = r.target.getHours() || r.target.getMinutes();
    return hasTime ? `${day}, ${formatTime(r.target, this.hass)}` : day;
  }

  protected override render() {
    const c = this.config;
    const r = this.resolve();
    const ms = r.frozen ?? (r.target ? r.target.getTime() - Date.now() : 0);
    const d = splitDuration(ms);
    const done = !r.idleText && ms <= 0;
    return c.style === 'compact' ? this.renderCompact(r, d, done) : this.renderRing(r, d, done);
  }

  private renderRing(r: Resolved, d: ReturnType<typeof splitDuration>, done: boolean) {
    const c = this.config;
    const circ = 2 * Math.PI * 52;
    const subtitle = [c.subtitle ?? r.subtitle, this.whenText(r)].filter(Boolean).join(' · ');
    return html`
      <ha-card class="glass ring-card" @click=${() => this.moreInfo(c.entity)}>
        <div class="t-ring">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle class="bg" cx="60" cy="60" r="52"></circle>
            <circle class="fg" cx="60" cy="60" r="52" style="stroke-dasharray:${circ};stroke-dashoffset:${circ * (1 - (r.progress ?? 0))}"></circle>
          </svg>
          <div class="mid">
            ${done || r.idleText
              ? html`<span class="ic ${c.animation ?? 'none'}">${haIcon(c.icon ?? 'mdi:timer-sand-complete')}</span>`
              : d.days > 0
                ? html`<b class="num" data-t="d">${d.days}</b><small>${d.days === 1 ? 'day' : 'days'}</small>`
                : html`<b class="num" data-t="h">${d.hours}</b><small>${d.hours === 1 ? 'hour' : 'hours'}</small>`}
          </div>
        </div>
        <div class="txt">
          <h3>${c.name}</h3>
          ${subtitle ? html`<p>${subtitle}</p>` : nothing}
          ${r.idleText
            ? html`<p class="idle">${r.idleText}</p>`
            : done
              ? html`<p class="now">${c.done_text ?? 'It’s time'}</p>`
              : html`<div class="clock num">
                  ${d.days > 0 ? html`<div><b data-t="ch">${pad(d.hours)}</b><small>hrs</small></div>` : nothing}
                  <div><b data-t="cm">${pad(d.minutes)}</b><small>min</small></div>
                  <div><b data-t="cs">${pad(d.seconds)}</b><small>sec</small></div>
                </div>`}
          ${this.renderChips()}
        </div>
      </ha-card>
    `;
  }

  private renderCompact(r: Resolved, d: ReturnType<typeof splitDuration>, done: boolean) {
    const c = this.config;
    const v = numeric(this.stateOf(c.value_entity));
    const unit = c.value_unit ?? (this.stateOf(c.value_entity)?.attributes.unit_of_measurement as string | undefined) ?? '';
    let big;
    if (r.idleText) big = html`<span class="small-big">${r.idleText}</span>`;
    else if (done) big = html`${c.done_text ?? 'Ready'}`;
    else if (d.days >= 1) big = html`<span data-t="d">${d.days}</span><small>${d.days === 1 ? 'day' : 'days'}</small> <span data-t="h">${d.hours}</span><small>h</small>`;
    else if (d.hours >= 1) big = html`<span data-t="h">${d.hours}</span><small>h</small> <span data-t="m">${d.minutes}</span><small>min</small>`;
    else big = html`<span data-t="m">${d.minutes}</span>:<span data-t="s">${pad(d.seconds)}</span>`;
    const showBar = r.progress !== undefined && (c.value_entity || c.entity?.startsWith('timer.') || c.start);
    return html`
      <ha-card class="glass mini" data-done=${done} @click=${() => this.moreInfo(c.entity ?? c.value_entity)}>
        <div class="lbl"><span class="ic ${r.idleText ? 'none' : c.animation ?? 'none'}">${haIcon(c.icon ?? 'mdi:timer-outline')}</span>${c.name}</div>
        <div class="big num">${big}</div>
        <div class="sub faint num">
          ${v !== undefined && c.value_target
            ? unit.startsWith('°')
              ? `${Math.round(v)}° of ${c.value_target}${unit}`
              : `${Math.round(v)} of ${c.value_target}${unit ? ` ${unit}` : ''}`
            : c.subtitle ?? r.subtitle ?? this.whenText(r)}
        </div>
        ${showBar ? html`<div class="bar"><i style="width:${(r.progress ?? 0) * 100}%"></i></div>` : nothing} ${this.renderChips()}
      </ha-card>
    `;
  }

  private renderChips() {
    const chips = this.config.chips;
    if (!chips?.length) return nothing;
    const color = (c?: string) => (!c ? 'var(--hh-accent)' : ['accent', 'ok', 'warn', 'crit', 'warm'].includes(c) ? `var(--hh-${c})` : c);
    return html`<div class="chips">${chips.map(ch => html`<span class="chip" style="--c:${color(ch.color)}">${ch.name}</span>`)}</div>`;
  }

  static override styles = [
    base,
    glass,
    css`
      .ring-card {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 18px;
        align-items: center;
        cursor: default;
      }
      .ring-card::after {
        content: '';
        position: absolute;
        right: -40px;
        bottom: -30px;
        width: 220px;
        height: 120px;
        background: var(--hh-accent-soft);
        clip-path: polygon(0 100%, 30% 30%, 45% 55%, 62% 10%, 100% 100%);
        pointer-events: none;
      }
      .t-ring {
        width: 118px;
        height: 118px;
        position: relative;
      }
      .t-ring > svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }
      .t-ring circle {
        fill: none;
        stroke-width: 6;
      }
      .t-ring .bg {
        stroke: var(--hh-line);
      }
      .t-ring .fg {
        stroke: var(--hh-accent);
        stroke-linecap: round;
        transition: stroke-dashoffset 1.6s var(--ease);
      }
      .mid {
        position: absolute;
        inset: 0;
        display: grid;
        place-content: center;
        text-align: center;
        overflow: hidden;
      }
      .mid b {
        font-size: 38px;
        font-weight: 200;
        line-height: 1;
        letter-spacing: -0.03em;
        display: inline-block;
      }
      .mid small {
        font-size: 11px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--hh-ink-3);
      }
      .mid .ic {
        --mdc-icon-size: 36px;
        color: var(--hh-accent);
      }
      .txt {
        position: relative;
        z-index: 1;
        min-width: 0;
      }
      .txt h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
      .txt p {
        margin: 2px 0 10px;
        font-size: 12.5px;
        color: var(--hh-ink-2);
      }
      .txt .now {
        font-size: 15px;
        font-weight: 600;
        color: var(--hh-accent);
      }
      .clock {
        display: flex;
        gap: 6px;
      }
      .clock div {
        min-width: 46px;
        padding: 7px 6px 5px;
        border-radius: 12px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        text-align: center;
        overflow: hidden;
      }
      .clock b {
        display: block;
        font-family: 'IBM Plex Mono', ui-monospace, monospace;
        font-size: 17px;
        font-weight: 500;
      }
      .clock small {
        font-size: 10px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--hh-ink-3);
      }
      ha-card.mini {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        height: 100%;
      }
      .lbl {
        display: flex;
        align-items: center;
        gap: 7px;
        font-size: 12.5px;
        font-weight: 600;
        color: var(--hh-ink-2);
      }
      .lbl .ic {
        --mdc-icon-size: 18px;
        display: inline-flex;
        color: var(--hh-warm);
      }
      .big {
        font-size: 28px;
        font-weight: 300;
        letter-spacing: -0.02em;
        line-height: 1.1;
        overflow: hidden;
      }
      .big span {
        display: inline-block;
      }
      .big small {
        font-size: 14px;
        color: var(--hh-ink-3);
        margin-left: 2px;
      }
      .big .small-big {
        font-size: 16px;
        color: var(--hh-ink-3);
      }
      .sub {
        font-size: 12px;
      }
      .bar {
        height: 5px;
        border-radius: 5px;
        background: var(--hh-line);
        overflow: hidden;
      }
      .bar i {
        display: block;
        height: 100%;
        border-radius: 5px;
        background: linear-gradient(90deg, var(--hh-warm), var(--hh-crit));
        transition: width 1s linear;
      }
      .chips {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
        margin-top: 2px;
      }
      .chip {
        font-size: 11px;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 999px;
        background: var(--c);
        color: var(--hh-on-accent);
      }
      .ic.flicker {
        transform-origin: 50% 90%;
        animation: flicker 1.6s ease-in-out infinite;
      }
      .ic.pulse {
        animation: pulse 2s ease-in-out infinite;
      }
      @keyframes flicker {
        25% {
          transform: scale(1.06, 0.94) rotate(-3deg);
        }
        50% {
          transform: scale(0.96, 1.07);
        }
        75% {
          transform: scale(1.03, 0.97) rotate(3deg);
        }
      }
      @keyframes pulse {
        50% {
          transform: scale(1.12);
          opacity: 0.75;
        }
      }
    `,
  ];
}

registerCard('hyggehub-countdown-card', HyggeCountdownCard, 'HyggeHub Countdown', 'Count down to a date, a weekly event, a timer or a calendar entry.');
