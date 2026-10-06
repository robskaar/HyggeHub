import { css, html, nothing, svg, type PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import { registerCard, HyggeCard } from '../shared/base-card';
import { fetchEvents, forPerson, nowAndNext, shortPlace, type CalEvent } from '../shared/calendar';
import { renderAvatar, type AvatarOptions } from '../shared/avatar';
import { haIcon } from '../shared/icons';
import { formatState, formatTime, friendlyName, lang, numeric, relativeTime } from '../shared/format';
import { base, glass } from '../shared/styles';
import { engine } from '../theme/engine';
import type { CardConfig, HomeAssistant } from '../types';

export interface PersonConfig {
  /** person.* (or device_tracker.*) for where they are. Optional, e.g. for a baby. */
  entity?: string;
  name?: string;
  /** Drawn portrait: preset woman | man | child | baby, plus hair, eyes, skin and shirt colours. */
  avatar?: AvatarOptions;
  /** A real image instead of the drawn portrait, e.g. /local/avatars/me.png. */
  picture?: string;
  /** Phone battery level sensor, and whatever says it is charging (binary_sensor or a "charging" state). */
  battery?: string;
  charging?: string;
  /** What the battery belongs to. Default "Phone"; "Watch" for a GPS watch. */
  battery_label?: string;
  /** Distance from home, e.g. a proximity sensor. Shown while they're away. */
  distance?: string;
  /** When this is on, the portrait closes its eyes and the status reads "Asleep". */
  sleep?: string;
  /** Anything else worth a tile: steps, next pickup, room temperature... */
  stats?: Array<{ entity: string; name?: string; icon?: string }>;
  /**
   * Their calendar(s), e.g. a Google calendar per child. The event happening now supplies the place when
   * GPS can't (no tracker, or the tracker only says "away"), and the details side lists what's next.
   */
  calendar?: string | string[];
  /** On a shared family calendar, only events mentioning these words count, e.g. "Noah". */
  calendar_match?: string;
  /** Where they are when nothing else says, e.g. `home` for a toddler with no tracker. */
  default_location?: string;
  /** How many upcoming events the details side lists. Default 2. */
  agenda?: number;
}

export interface FamilyCardConfig extends CardConfig {
  title?: string;
  people: PersonConfig[];
}

type Presence = 'home' | 'zone' | 'away' | 'none';
let seq = 0;

const calendars = (p: PersonConfig) => (p.calendar ? ([] as string[]).concat(p.calendar) : []);
const watched = (p: PersonConfig) => [p.entity, p.battery, p.charging, p.distance, p.sleep, ...calendars(p), ...(p.stats ?? []).map(s => s.entity)];

interface Status {
  presence: Presence;
  asleep: boolean;
  label: string;
  since: string;
  justArrived: boolean;
  /** "47 min" / "1 h 20 min" while asleep. */
  sleepFor: string;
  /** The place came from the calendar rather than GPS. */
  fromPlan: boolean;
}

const dayTime = (d: Date, hass?: HomeAssistant) => {
  const today = new Date().toDateString() === d.toDateString();
  return today ? formatTime(d, hass) : d.toLocaleDateString(lang(hass), { weekday: 'long' });
};

/**
 * Where someone is. GPS wins whenever it knows a place (home or a named zone). When it only knows
 * "away", or there is no tracker, the calendar event happening now supplies the place.
 */
function status(hass: HomeAssistant | undefined, p: PersonConfig, events?: CalEvent[]): Status {
  const s = p.entity ? hass?.states[p.entity] : undefined;
  const sleepState = p.sleep ? hass?.states[p.sleep] : undefined;
  const asleep = sleepState?.state === 'on';
  const planned = events ? nowAndNext(events).now : undefined;
  let presence: Presence = 'none';
  let label = '';
  let since = s ? `since ${dayTime(new Date(s.last_changed), hass)}` : '';
  let fromPlan = false;
  const gps = s && s.state !== 'unknown' && s.state !== 'unavailable' ? s.state : undefined;

  if (gps === 'home') {
    presence = 'home';
    label = 'Home';
  } else if (gps && gps !== 'not_home') {
    presence = 'zone';
    label = gps;
  } else if (planned) {
    presence = 'zone';
    fromPlan = true;
    const place = shortPlace(planned.location);
    label = place && place.toLowerCase() !== planned.summary.toLowerCase() ? `${planned.summary} · ${place}` : planned.summary;
    since = planned.allDay ? 'all day' : `until ${formatTime(planned.end, hass)}`;
  } else if (gps === 'not_home') {
    presence = 'away';
    label = 'Away';
  } else if (p.default_location) {
    presence = p.default_location.toLowerCase() === 'home' ? 'home' : 'zone';
    label = presence === 'home' ? 'Home' : p.default_location;
    since = '';
  } else if (s) {
    label = 'Location unknown';
  }
  if (!fromPlan && presence !== 'home') {
    const dist = p.distance ? hass?.states[p.distance] : undefined;
    if (dist && numeric(dist) !== undefined && gps) label += ` · ${formatState(hass, dist)} away`;
  }
  let sleepFor = '';
  if (asleep) {
    const mins = (Date.now() - new Date(sleepState!.last_changed).getTime()) / 6e4;
    sleepFor = mins < 60 ? `${Math.max(1, Math.round(mins))} min` : `${Math.floor(mins / 60)} h ${Math.round(mins % 60)} min`;
    label = `Asleep · ${sleepFor}`;
  }
  if (asleep) since = `since ${dayTime(new Date(sleepState!.last_changed), hass)}`;
  else if (presence === 'none') since = '';
  const justArrived = gps === 'home' && Date.now() - new Date(s!.last_changed).getTime() < 10 * 6e4;
  return { presence, asleep, label: label || 'No location', since, justArrived, sleepFor, fromPlan };
}

/** "Now", "16:30", "Tomorrow 08:00", "Thu 14:30", or "All day". */
function whenText(e: CalEvent, isNow: boolean, hass?: HomeAssistant): string {
  if (isNow) return 'Now';
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 864e5);
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const day = sameDay(e.start, today) ? '' : sameDay(e.start, tomorrow) ? 'Tomorrow' : e.start.toLocaleDateString(lang(hass), { weekday: 'short' });
  if (e.allDay) return day || 'Today';
  return day ? `${day} ${formatTime(e.start, hass)}` : formatTime(e.start, hass);
}

function battery(hass: HomeAssistant | undefined, p: PersonConfig) {
  const s = p.battery ? hass?.states[p.battery] : undefined;
  const level = numeric(s);
  if (level === undefined) return undefined;
  const c = p.charging ? hass?.states[p.charging]?.state.toLowerCase() : undefined;
  const charging = c === 'on' || c === 'charging' || String(s!.attributes.battery_state ?? '').toLowerCase() === 'charging';
  return { level: Math.round(level), charging };
}

const batteryIcon = (level: number, charging: boolean) => svg`<svg class="bat" viewBox="0 0 24 24" aria-hidden="true">
  <rect x="2.5" y="7" width="17" height="10" rx="2.6" fill="none" stroke="currentColor" stroke-width="1.6"></rect>
  <rect x="20.4" y="10" width="2" height="4" rx="1" fill="currentColor"></rect>
  <rect x="4.6" y="9.1" width=${Math.max(0.8, (12.8 * level) / 100)} height="5.8" rx="1.3" fill="currentColor"></rect>
  ${charging ? svg`<path d="M11.6 6.2 8.4 12.4h3.2l-.9 5.4 3.9-6.6h-3.3l1.1-5z" fill="var(--hh-bg)" stroke="currentColor" stroke-width=".9" stroke-linejoin="round"></path>` : nothing}
</svg>`;

/** The portrait in its ring. The front of a member tile. */
function portrait(p: PersonConfig, st: Status, id: string, delay: number) {
  return html`<span class="pwrap" data-presence=${st.presence} data-arrived=${st.justArrived} style="--breathe-delay:${delay}s">
    <span class="portrait">${p.picture ? html`<img src=${p.picture} alt="" />` : renderAvatar(p.avatar, id, st.asleep)}</span>
    ${st.asleep ? html`<span class="zz" aria-hidden="true"><i>z</i><i>z</i><i>z</i></span>` : nothing}
  </span>`;
}

/*
 * Animation rule for everything below: only transform and opacity, and only on whole elements (the
 * drawing, a ring, a floating letter). Those run on the graphics chip without repainting anything.
 * Animating inside the SVG drawing, or a shadow, repaints every frame; on phones that added up to the
 * app's page being killed and reloaded. Blinks are a brief class change driven by the card (blinkSomeone).
 */
const sharedStyles = css`
  .pwrap {
    position: relative;
    display: block;
    --ring: var(--hh-line);
  }
  .pwrap[data-presence='home'] {
    --ring: var(--hh-ok);
  }
  .pwrap[data-presence='zone'] {
    --ring: var(--hh-accent);
  }
  .pwrap[data-presence='away'] {
    --ring: var(--hh-ink-3);
  }
  .portrait {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    background: radial-gradient(circle at 35% 25%, var(--hh-glass-press), color-mix(in srgb, var(--hh-accent) 22%, var(--hh-glass-strong)) 70%);
    box-shadow: 0 0 0 3px var(--ring), 0 0 0 7px color-mix(in srgb, var(--ring) 18%, transparent), 0 14px 30px -14px rgba(0, 0, 0, 0.45);
    transition: box-shadow 0.5s;
  }
  .portrait img,
  .portrait .avatar {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
  /* Breathing: the whole drawing rises a hair and settles. */
  .portrait .avatar {
    transform-origin: 50% 100%;
    animation: breathe 5.2s ease-in-out infinite;
    animation-delay: var(--breathe-delay, 0s);
    will-change: transform;
  }
  @keyframes breathe {
    50% {
      transform: translateY(1.2px) scale(1.012);
    }
  }
  .eye {
    transform-box: fill-box;
    transform-origin: center;
    transition: transform 0.07s ease-in;
  }
  .portrait.blinking .eye {
    transform: scaleY(0.08);
  }
  /* Just home: a ring ripples out from the portrait for the first ten minutes. */
  .pwrap[data-arrived='true']::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 2px solid var(--ring);
    animation: ripple 2.4s ease-out infinite;
    pointer-events: none;
    will-change: transform, opacity;
  }
  @keyframes ripple {
    0% {
      transform: scale(1);
      opacity: 0.7;
    }
    100% {
      transform: scale(1.28);
      opacity: 0;
    }
  }
  /* Asleep: three z's float up from the top corner, one after another. */
  .zz {
    position: absolute;
    right: -4px;
    top: -2px;
    width: 24px;
    height: 30px;
    pointer-events: none;
  }
  .zz i {
    position: absolute;
    left: 0;
    bottom: 0;
    font: 700 13px var(--hh-font);
    font-style: normal;
    color: var(--hh-ink-2);
    opacity: 0;
    animation: zz 3.6s ease-in-out infinite;
    will-change: transform, opacity;
  }
  .zz i:nth-child(2) {
    animation-delay: 1.2s;
  }
  .zz i:nth-child(3) {
    animation-delay: 2.4s;
  }
  @keyframes zz {
    0% {
      opacity: 0;
      transform: translate(0, 0) scale(0.7);
    }
    25% {
      opacity: 0.85;
    }
    100% {
      opacity: 0;
      transform: translate(12px, -22px) scale(1.15);
    }
  }
  .where {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--hh-ink-2);
    min-width: 0;
  }
  .where .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex: none;
    background: var(--ring, var(--hh-line));
  }
  [data-presence='home'] .where .dot,
  .where[data-presence='home'] .dot {
    background: var(--hh-ok);
  }
  [data-presence='zone'] .where .dot,
  .where[data-presence='zone'] .dot {
    background: var(--hh-accent);
  }
  [data-presence='away'] .where .dot,
  .where[data-presence='away'] .dot {
    background: var(--hh-ink-3);
  }
  [data-asleep='true'] .where .dot,
  .where[data-asleep='true'] .dot {
    background: var(--hh-warm);
  }
  svg.bat {
    width: 22px;
    height: 22px;
    flex: none;
  }
  .bat-low {
    color: var(--hh-crit);
  }
  .bat-charging {
    color: var(--hh-ok);
  }
`;

/** How long a member's details stay open before the portrait comes back on its own. */
const AUTO_CLOSE_MS = 25_000;

/**
 * Everyone in the home on one card. Each member is a two-sided tile: the front shows the portrait,
 * where they are and what's next; tapping it turns to the details (whereabouts and since when, the
 * agenda, battery, sleep, extra stats) in exactly the same space, so the card never changes size.
 */
export class HyggeFamilyCard extends HyggeCard<FamilyCardConfig> {
  @state() private events: Array<CalEvent[] | undefined> = [];
  @state() private opened = new Set<number>();
  private avatarId = `hh-fam${++seq}`;
  private loadedFor?: string;
  private ticker?: number;
  private blinker?: number;
  private closeTimers = new Map<number, number>();

  static getStubConfig(hass: any) {
    return { people: Object.keys(hass?.states ?? {}).filter(id => id.startsWith('person.')).map(entity => ({ entity })) };
  }

  protected override validateConfig(c: FamilyCardConfig) {
    if (!Array.isArray(c.people) || !c.people.length) throw new Error('List the family under `people`.');
  }

  protected override watchedEntities() {
    return this.config.people.flatMap(watched);
  }

  override getCardSize() {
    return 4;
  }

  override connectedCallback() {
    super.connectedCallback();
    // Once a minute: what's "now" moves on even when no entity changes. The fetch itself is cached.
    this.ticker = window.setInterval(() => void this.loadEvents(false), 60_000);
    this.blinker = window.setInterval(() => this.blinkSomeone(), 3_500);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.ticker);
    clearInterval(this.blinker);
    this.closeTimers.forEach(t => clearTimeout(t));
    this.closeTimers.clear();
  }

  protected override updated(changed: PropertyValues) {
    super.updated(changed);
    if (!this.hass) return;
    const people = this.config.people;
    const ids = people.flatMap(calendars);
    if (!ids.length) return;
    const key = JSON.stringify(people.map(p => [calendars(p), p.calendar_match]));
    const old = changed.get('hass') as HomeAssistant | undefined;
    // A calendar entity changes state when one of its events starts or ends: a good moment to re-read.
    const calendarChanged = !!old && ids.some(id => old.states[id] !== this.hass!.states[id]);
    if (key !== this.loadedFor || calendarChanged) {
      this.loadedFor = key;
      void this.loadEvents(calendarChanged);
    }
  }

  private async loadEvents(force: boolean) {
    const hass = this.hass;
    if (!hass) return;
    this.events = await Promise.all(
      this.config.people.map(p => (calendars(p).length ? fetchEvents(hass, calendars(p), force).then(ev => forPerson(ev, p.calendar_match)) : Promise.resolve(undefined))),
    );
  }

  /** Now and then one awake person blinks: a 150 ms class change rather than a never-ending animation. */
  private blinkSomeone() {
    if (!engine.motionOn || document.hidden) return;
    const awake = [...this.renderRoot.querySelectorAll<HTMLElement>('.member:not(.open) .portrait')].filter(p => p.querySelector('.eye'));
    const p = awake[Math.floor(Math.random() * awake.length)];
    if (!p) return;
    p.classList.add('blinking');
    setTimeout(() => p.classList.remove('blinking'), 150);
  }

  private toggle(i: number) {
    const next = new Set(this.opened);
    clearTimeout(this.closeTimers.get(i));
    if (next.has(i)) next.delete(i);
    else {
      next.add(i);
      this.closeTimers.set(
        i,
        window.setTimeout(() => {
          const s = new Set(this.opened);
          s.delete(i);
          this.opened = s;
        }, AUTO_CLOSE_MS),
      );
    }
    this.opened = next;
  }

  /** "Football · Thu 16:30": the next thing within a day and a half, for the front of the tile. */
  private nextUp(events?: CalEvent[]): string {
    const next = events ? nowAndNext(events).upcoming[0] : undefined;
    if (!next || next.start.getTime() - Date.now() > 36 * 36e5) return '';
    return `${next.summary} · ${whenText(next, false, this.hass)}`;
  }

  private statValue(entityId: string) {
    const s = this.stateOf(entityId);
    if (s?.attributes.device_class === 'timestamp') {
      const d = new Date(s.state);
      if (!isNaN(d.getTime())) return relativeTime(d);
    }
    return this.format(entityId);
  }

  private renderDetails(p: PersonConfig, st: Status, events: CalEvent[] | undefined, name: string) {
    const bat = battery(this.hass, p);
    const batCls = bat ? (bat.charging ? 'bat-charging' : bat.level <= 20 ? 'bat-low' : '') : '';
    const sleepToggle = p.sleep?.startsWith('input_boolean.');
    const { now, upcoming } = events ? nowAndNext(events) : { now: undefined, upcoming: [] as CalEvent[] };
    const agenda = [...(now ? [{ e: now, isNow: true }] : []), ...upcoming.slice(0, p.agenda ?? 2).map(e => ({ e, isNow: false }))];
    const stop = (e: Event) => e.stopPropagation();

    return html`<div class="d-head">
        <b>${name}</b>
        <span class="where"><span class="dot"></span><span class="lbl">${st.label}</span></span>
        ${st.since ? html`<span class="since">${st.since}</span>` : nothing}
      </div>
      <div class="d-rows">
        ${p.sleep
          ? html`<button
              class="row sleep ${st.asleep ? 'on' : ''}"
              type="button"
              aria-pressed=${sleepToggle ? st.asleep : nothing}
              @pointerdown=${stop}
              @click=${(e: Event) => {
                stop(e);
                if (sleepToggle) void this.callService('input_boolean', 'toggle', {}, { entity_id: p.sleep });
                else this.moreInfo(p.sleep);
              }}
            >
              <span class="ri">${haIcon(st.asleep ? 'mdi:sleep' : 'mdi:white-balance-sunny')}</span>
              <span class="rt"><b>${st.asleep ? `Asleep ${st.sleepFor}` : 'Awake'}</b>${sleepToggle ? html`<small>Tap to change</small>` : nothing}</span>
            </button>`
          : nothing}
        ${agenda.map(
          ({ e, isNow }) => html`<div class="row ev ${isNow ? 'now' : ''}">
            <span class="when num">${whenText(e, isNow, this.hass)}</span>
            <span class="rt"><b>${e.summary}</b>${shortPlace(e.location) ? html`<small>${shortPlace(e.location)}</small>` : nothing}</span>
          </div>`,
        )}
        ${calendars(p).length && events && !agenda.length ? html`<div class="row nothing">Nothing planned this week</div>` : nothing}
        ${bat
          ? html`<div class="row">
              <span class="ri ${batCls}">${batteryIcon(bat.level, bat.charging)}</span>
              <span class="rt"><b class="num">${bat.level}%</b><small>${bat.charging ? 'Charging' : p.battery_label ?? 'Phone'}</small></span>
            </div>`
          : nothing}
        ${(p.stats ?? []).map(
          s => html`<div class="row">
            <span class="ri">${haIcon(s.icon ?? (this.stateOf(s.entity)?.attributes.icon as string | undefined) ?? 'mdi:information-outline')}</span>
            <span class="rt"><b>${this.statValue(s.entity)}</b><small>${s.name ?? friendlyName(this.stateOf(s.entity), s.entity)}</small></span>
          </div>`,
        )}
      </div>`;
  }

  protected override render() {
    const people = this.config.people;
    const statuses = people.map((p, i) => status(this.hass, p, this.events[i]));
    const known = statuses.filter(s => s.presence !== 'none');
    const home = known.filter(s => s.presence === 'home').length;
    const summary = !known.length ? '' : home === known.length ? 'Everyone is home' : home === 0 ? 'Nobody is home' : `${home} of ${known.length} home`;
    return html`<ha-card class="glass family">
      <div class="card-h"><h3>${this.config.title ?? 'Family'}</h3>${summary ? html`<span class="pill">${summary}</span>` : nothing}</div>
      <div class="people">
        ${people.map((p, i) => {
          const st = statuses[i];
          const bat = battery(this.hass, p);
          const name = p.name ?? friendlyName(p.entity ? this.stateOf(p.entity) : undefined, 'Someone');
          const batCls = bat ? (bat.charging ? 'bat-charging' : bat.level <= 20 ? 'bat-low' : '') : '';
          const next = this.nextUp(this.events[i]);
          const open = this.opened.has(i);
          return html`<div
            class="member ${open ? 'open' : ''}"
            role="button"
            tabindex="0"
            aria-expanded=${open}
            aria-label="${name}: ${st.label}. ${open ? 'Tap to close details' : 'Tap for details'}"
            data-presence=${st.presence}
            data-asleep=${st.asleep}
            @click=${() => this.tap(() => this.toggle(i))}
            @pointerdown=${() => this.holdStart(() => this.moreInfo(p.entity ?? p.sleep))}
            @pointerup=${this.holdEnd}
            @pointerleave=${this.holdEnd}
            @pointercancel=${this.holdEnd}
            @keydown=${(e: KeyboardEvent) => {
              if (e.target !== e.currentTarget || (e.key !== 'Enter' && e.key !== ' ')) return;
              e.preventDefault();
              this.toggle(i);
            }}
          >
            <div class="face" aria-hidden=${open}>
              ${portrait(p, st, `${this.avatarId}-${i}`, i * -1.6)}
              <b class="name">${name}</b>
              <span class="where"><span class="dot"></span><span class="lbl">${st.asleep ? 'Asleep' : st.label.split(' · ')[0]}</span></span>
              ${next ? html`<span class="next" title=${next}>${next}</span>` : nothing}
              ${bat ? html`<span class="mini-bat num ${batCls}">${batteryIcon(bat.level, bat.charging)}${bat.level}%</span>` : nothing}
            </div>
            <div class="details" aria-hidden=${!open}>${open ? this.renderDetails(p, st, this.events[i], name) : nothing}</div>
          </div>`;
        })}
      </div>
    </ha-card>`;
  }

  static override styles = [
    base,
    glass,
    sharedStyles,
    css`
      .people {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(128px, 1fr));
        gap: 10px;
      }
      .member {
        position: relative;
        border-radius: 20px;
        min-width: 0;
        cursor: pointer;
        user-select: none;
        -webkit-touch-callout: none;
        transition: background 0.3s;
      }
      .member:hover {
        background: var(--hh-glass-strong);
      }
      .member.open {
        background: var(--hh-glass-strong);
        box-shadow: inset 0 0 0 1px var(--hh-stroke);
      }
      /* The front sets the tile's size; the details sit exactly on top of it and scroll if they must. */
      .face {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        padding: 14px 6px 12px;
        text-align: center;
        transition: opacity 0.3s var(--ease), transform 0.45s var(--ease);
      }
      .member.open .face {
        opacity: 0;
        transform: scale(0.88);
        visibility: hidden;
        transition: opacity 0.25s var(--ease), transform 0.45s var(--ease), visibility 0s 0.3s;
      }
      .details {
        position: absolute;
        inset: 0;
        padding: 12px 10px 10px;
        overflow-y: auto;
        scrollbar-width: none;
        opacity: 0;
        transform: translateY(8px);
        pointer-events: none;
        transition: opacity 0.25s var(--ease), transform 0.4s var(--ease);
        mask-image: linear-gradient(#000 calc(100% - 14px), transparent);
      }
      .details::-webkit-scrollbar {
        display: none;
      }
      .member.open .details {
        opacity: 1;
        transform: none;
        pointer-events: auto;
        transition-delay: 0.08s;
      }
      .face .pwrap {
        width: 80px;
        height: 80px;
        margin-bottom: 6px;
      }
      .face .name {
        font-size: 14.5px;
        font-weight: 600;
      }
      .face .where {
        max-width: 100%;
      }
      .where .lbl {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .next {
        font-size: 11.5px;
        color: var(--hh-ink-3);
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mini-bat {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: var(--hh-ink-3);
      }
      .mini-bat svg.bat {
        width: 18px;
        height: 18px;
      }
      .d-head {
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin-bottom: 8px;
        min-width: 0;
      }
      .d-head b {
        font-size: 15px;
        font-weight: 600;
      }
      .d-head .where {
        font-size: 12px;
        align-items: flex-start;
      }
      .d-head .where .dot {
        margin-top: 5px;
      }
      .d-head .where .lbl {
        white-space: normal;
        overflow-wrap: anywhere;
      }
      .since {
        font-size: 11.5px;
        color: var(--hh-ink-3);
      }
      .d-rows {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .row {
        display: grid;
        grid-template-columns: 26px 1fr;
        gap: 8px;
        align-items: center;
        padding: 5px 6px;
        border-radius: 10px;
        text-align: left;
        width: 100%;
        min-width: 0;
      }
      .ri {
        width: 26px;
        height: 26px;
        border-radius: 8px;
        display: grid;
        place-items: center;
        background: var(--hh-accent-soft);
        color: var(--hh-accent);
        --mdc-icon-size: 15px;
      }
      .ri svg.bat {
        width: 17px;
        height: 17px;
      }
      .ri.bat-low {
        background: color-mix(in srgb, var(--hh-crit) 16%, transparent);
      }
      .ri.bat-charging {
        background: color-mix(in srgb, var(--hh-ok) 16%, transparent);
      }
      .rt {
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      .rt b {
        font-size: 12.5px;
        font-weight: 600;
        overflow-wrap: anywhere;
        line-height: 1.25;
      }
      .rt small {
        font-size: 11px;
        color: var(--hh-ink-3);
        overflow-wrap: anywhere;
      }
      .row.ev {
        grid-template-columns: auto 1fr;
        align-items: baseline;
      }
      .row.ev .when {
        font-size: 11px;
        font-weight: 600;
        color: var(--hh-ink-3);
        white-space: nowrap;
      }
      .row.ev.now {
        background: var(--hh-accent-soft);
      }
      .row.ev.now .when {
        color: var(--hh-accent);
      }
      .row.sleep {
        background: var(--hh-glass-press);
        border: 1px solid var(--hh-stroke);
      }
      .row.sleep.on .ri {
        background: color-mix(in srgb, var(--hh-warm) 18%, transparent);
        color: var(--hh-warm);
      }
      .row.nothing {
        display: block;
        font-size: 11.5px;
        color: var(--hh-ink-3);
      }
    `,
  ];
}

registerCard('hyggehub-family-card', HyggeFamilyCard, 'HyggeHub Family', 'Everyone in the home: tap a person to turn their tile to the details.');
