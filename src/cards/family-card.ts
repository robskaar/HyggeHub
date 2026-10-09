import { css, html, nothing, svg, type PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { registerCard, HyggeCard } from '../shared/base-card';
import { fetchEvents, forPerson, nowAndNext, shortPlace, type CalEvent } from '../shared/calendar';
import { renderAvatar, type AvatarOptions } from '../shared/avatar';
import { haIcon, icon } from '../shared/icons';
import { carColour, renderCar } from '../shared/car';
import { formatState, formatTime, friendlyName, lang, numeric, powerKw, relativeTime } from '../shared/format';
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
  /**
   * What they love, for the 3D people view: props on their diorama and something they hold or wear.
   * cooking, tech, gardening, decor, bugs, pokemon, nature, cars.
   */
  interests?: string[];
  /** A sculpted GLB of them for the 3D people view, e.g. /local/people/robert.glb. */
  model?: string;
}

export interface CarConfig {
  name: string;
  /** Body colour: moonstone-grey, glacier-white, black, blue, dark-blue, red, silver, green, or a hex. */
  color?: string;
  /** Battery level, %. */
  battery: string;
  range?: string;
  /** Whether it's charging: a binary_sensor, or a sensor whose state says "charging". */
  charging?: string;
  /** Charging power, W or kW. */
  charging_power?: string;
  /** Time until full, in minutes, or a timestamp sensor for when it will be. */
  time_to_full?: string;
  /** Charge limit, %. */
  target?: string;
  /** Whether the cable is plugged in. */
  plugged?: string;
  /** device_tracker for where the car is. */
  location?: string;
  /** climate.* or switch.* for pre-heating; its tile toggles it. */
  climate?: string;
  /** lock.* or a binary_sensor for the doors. Shown only; unlock from Home Assistant's own dialog. */
  lock?: string;
  odometer?: string;
  stats?: Array<{ entity: string; name?: string; icon?: string }>;
}

export interface FamilyCardConfig extends CardConfig {
  title?: string;
  people: PersonConfig[];
  /** Cars shown as chips at the top; tapping one opens its page. */
  cars?: CarConfig[];
}

type Presence = 'home' | 'zone' | 'away' | 'none';
let seq = 0;

export const calendars = (p: PersonConfig) => (p.calendar ? ([] as string[]).concat(p.calendar) : []);
const watched = (p: PersonConfig) => [p.entity, p.battery, p.charging, p.distance, p.sleep, ...calendars(p), ...(p.stats ?? []).map(s => s.entity)];

export interface Status {
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
export function status(hass: HomeAssistant | undefined, p: PersonConfig, events?: CalEvent[]): Status {
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
export function whenText(e: CalEvent, isNow: boolean, hass?: HomeAssistant): string {
  if (isNow) return 'Now';
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 864e5);
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const day = sameDay(e.start, today) ? '' : sameDay(e.start, tomorrow) ? 'Tomorrow' : e.start.toLocaleDateString(lang(hass), { weekday: 'short' });
  if (e.allDay) return day || 'Today';
  return day ? `${day} ${formatTime(e.start, hass)}` : formatTime(e.start, hass);
}

export function battery(hass: HomeAssistant | undefined, p: PersonConfig) {
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

/** A page stays open this long without a touch before the card goes back to the family. */
const AUTO_BACK_MS = 60_000;

type View = { kind: 'family' } | { kind: 'person'; i: number } | { kind: 'car'; i: number };

const carWatched = (c: CarConfig) => [c.battery, c.range, c.charging, c.charging_power, c.time_to_full, c.target, c.plugged, c.location, c.climate, c.lock, c.odometer, ...(c.stats ?? []).map(s => s.entity)];

const isOn = (v?: string) => {
  if (!v) return false;
  const s = v.toLowerCase();
  return s === 'on' || s === 'true' || s === 'charging' || s === 'connected' || s === 'plugged' || (s.includes('charging') && !s.includes('not'));
};

/**
 * Everyone in the home on one card. The family view shows each person (and the car, as a chip at the
 * top); tapping one turns the whole card into that person's or the car's page, with a breadcrumb back.
 */
export class HyggeFamilyCard extends HyggeCard<FamilyCardConfig> {
  @state() private events: Array<CalEvent[] | undefined> = [];
  @state() private view: View = { kind: 'family' };
  private avatarId = `hh-fam${++seq}`;
  private loadedFor?: string;
  private ticker?: number;
  private blinker?: number;
  private backTimer?: number;

  static getStubConfig(hass: any) {
    return { people: Object.keys(hass?.states ?? {}).filter(id => id.startsWith('person.')).map(entity => ({ entity })) };
  }

  protected override validateConfig(c: FamilyCardConfig) {
    if (!Array.isArray(c.people) || !c.people.length) throw new Error('List the family under `people`.');
    for (const car of c.cars ?? []) if (!car.battery) throw new Error(`Give ${car.name ?? 'the car'} a \`battery\` sensor.`);
  }

  protected override watchedEntities() {
    return [...this.config.people.flatMap(watched), ...(this.config.cars ?? []).flatMap(carWatched)];
  }

  override getCardSize() {
    return 4;
  }

  override connectedCallback() {
    super.connectedCallback();
    // Once a minute: what's "now" moves on even when no entity changes. The fetch itself is cached.
    this.ticker = window.setInterval(() => void this.loadEvents(false), 60_000);
    this.blinker = window.setInterval(() => this.blinkSomeone(), 3_500);
    this.addEventListener('keydown', this.onKey);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.ticker);
    clearInterval(this.blinker);
    clearTimeout(this.backTimer);
    this.removeEventListener('keydown', this.onKey);
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
      this.config.people.map(p => {
        if (!calendars(p).length) return Promise.resolve(undefined);
        // Only ask for calendars that exist: asking for a missing one makes Home Assistant log an
        // error on every refresh. A configured but missing calendar reads as "nothing planned".
        const present = calendars(p).filter(id => hass.states[id]);
        if (!present.length) return Promise.resolve([] as CalEvent[]);
        return fetchEvents(hass, present, force).then(ev => forPerson(ev, p.calendar_match));
      }),
    );
  }

  // ---------- navigation ----------

  private open(v: View) {
    this.view = v;
    this.armBack();
  }

  private back = () => {
    clearTimeout(this.backTimer);
    this.view = { kind: 'family' };
  };

  /** Back to the family after a minute without a touch, so a wall tablet doesn't stay on one page. */
  private armBack() {
    clearTimeout(this.backTimer);
    if (this.view.kind !== 'family') this.backTimer = window.setTimeout(this.back, AUTO_BACK_MS);
  }

  private onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.view.kind !== 'family') this.back();
  };

  /** Now and then one awake person blinks: a 150 ms class change rather than a never-ending animation. */
  private blinkSomeone() {
    if (!engine.motionOn || document.hidden || !this.onScreen) return;
    const awake = [...this.renderRoot.querySelectorAll<HTMLElement>('.portrait')].filter(p => p.querySelector('.eye'));
    const p = awake[Math.floor(Math.random() * awake.length)];
    if (!p) return;
    p.classList.add('blinking');
    setTimeout(() => p.classList.remove('blinking'), 150);
  }

  // ---------- helpers ----------

  private name(p: PersonConfig) {
    return p.name ?? friendlyName(p.entity ? this.stateOf(p.entity) : undefined, 'Someone');
  }

  /** "Football · Thu 16:30": the next thing within a day and a half, for the family view. */
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

  private car(c: CarConfig) {
    const level = numeric(this.stateOf(c.battery));
    const charging = isOn(this.stateOf(c.charging)?.state);
    const plugged = isOn(this.stateOf(c.plugged)?.state) || charging;
    const power = powerKw(this.stateOf(c.charging_power));
    const target = numeric(this.stateOf(c.target));
    const ttf = this.stateOf(c.time_to_full);
    let fullAt: string | undefined;
    if (ttf) {
      if (ttf.attributes.device_class === 'timestamp') {
        const d = new Date(ttf.state);
        if (!isNaN(d.getTime())) fullAt = formatTime(d, this.hass);
      } else {
        const m = numeric(ttf);
        const unit = String(ttf.attributes.unit_of_measurement ?? 'min').toLowerCase();
        const minutes = m === undefined ? undefined : unit.startsWith('h') ? m * 60 : m;
        if (minutes && minutes > 0) fullAt = formatTime(new Date(Date.now() + minutes * 6e4), this.hass);
      }
    }
    const loc = this.stateOf(c.location)?.state;
    const where = !loc || loc === 'unknown' || loc === 'unavailable' ? '' : loc === 'home' ? 'Parked at home' : loc === 'not_home' ? 'Away' : `At ${loc}`;
    return { level, charging, plugged, power, target, fullAt, where, colour: carColour(c.color) };
  }

  // ---------- family view ----------

  private renderFamily(statuses: Status[]) {
    const people = this.config.people;
    return html`<div class="people">
      ${people.map((p, i) => {
        const st = statuses[i];
        const bat = battery(this.hass, p);
        const name = this.name(p);
        const batCls = bat ? (bat.charging ? 'bat-charging' : bat.level <= 20 ? 'bat-low' : '') : '';
        const next = this.nextUp(this.events[i]);
        return html`<button
          class="member"
          type="button"
          aria-label="${name}: ${st.label}. Show ${name}'s page"
          data-presence=${st.presence}
          data-asleep=${st.asleep}
          @click=${() => this.tap(() => this.open({ kind: 'person', i }))}
          @pointerdown=${() => this.holdStart(() => this.moreInfo(p.entity ?? p.sleep))}
          @pointerup=${this.holdEnd}
          @pointerleave=${this.holdEnd}
          @pointercancel=${this.holdEnd}
        >
          ${portrait(p, st, `${this.avatarId}-${i}`, i * -1.6)}
          <b class="name">${name}</b>
          <span class="where"><span class="dot"></span><span class="lbl">${st.asleep ? 'Asleep' : st.label.split(' · ')[0]}</span></span>
          ${next ? html`<span class="next" title=${next}>${next}</span>` : nothing}
          ${bat ? html`<span class="mini-bat num ${batCls}">${batteryIcon(bat.level, bat.charging)}${bat.level}%</span>` : nothing}
        </button>`;
      })}
    </div>`;
  }

  // ---------- person page ----------

  private renderPerson(i: number, st: Status) {
    const p = this.config.people[i];
    const events = this.events[i];
    const name = this.name(p);
    const bat = battery(this.hass, p);
    const batCls = bat ? (bat.charging ? 'bat-charging' : bat.level <= 20 ? 'bat-low' : '') : '';
    const sleepToggle = p.sleep?.startsWith('input_boolean.');
    const { now, upcoming } = events ? nowAndNext(events) : { now: undefined, upcoming: [] as CalEvent[] };
    const rows = [...(now ? [{ e: now, isNow: true }] : []), ...upcoming.slice(0, Math.max(p.agenda ?? 3, 3)).map(e => ({ e, isNow: false }))];
    const hasPlan = calendars(p).length > 0;
    const tiles = [
      p.sleep
        ? html`<button
            class="tile big ${st.asleep ? 'sleeping' : ''}"
            type="button"
            aria-pressed=${sleepToggle ? st.asleep : nothing}
            @click=${() => (sleepToggle ? this.callService('input_boolean', 'toggle', {}, { entity_id: p.sleep }) : this.moreInfo(p.sleep))}
          >
            <span class="ti">${haIcon(st.asleep ? 'mdi:sleep' : 'mdi:white-balance-sunny')}</span>
            <span class="tt"><small>${sleepToggle ? (st.asleep ? 'Tap when awake' : 'Tap at bedtime') : 'Sleep'}</small><b>${st.asleep ? `Asleep ${st.sleepFor}` : 'Awake'}</b></span>
          </button>`
        : nothing,
      bat
        ? html`<button class="tile" type="button" @click=${() => this.moreInfo(p.battery)}>
            <span class="ti ${batCls}">${batteryIcon(bat.level, bat.charging)}</span>
            <span class="tt"><small>${bat.charging ? 'Charging' : p.battery_label ?? 'Phone'}</small><b class="num">${bat.level}%</b></span>
          </button>`
        : nothing,
      ...(p.stats ?? []).map(
        s => html`<button class="tile" type="button" @click=${() => this.moreInfo(s.entity)}>
          <span class="ti">${haIcon(s.icon ?? (this.stateOf(s.entity)?.attributes.icon as string | undefined) ?? 'mdi:information-outline')}</span>
          <span class="tt"><small>${s.name ?? friendlyName(this.stateOf(s.entity), s.entity)}</small><b>${this.statValue(s.entity)}</b></span>
        </button>`,
      ),
    ].filter(t => t !== nothing);

    return html`<div class="page" data-presence=${st.presence} data-asleep=${st.asleep}>
      <div class="hero">
        <button class="hero-portrait" type="button" aria-label="${name}: details" @click=${() => this.moreInfo(p.entity ?? p.sleep)}>
          ${portrait(p, st, `${this.avatarId}-p${i}`, 0)}
        </button>
        <div class="who">
          <h2>${name}</h2>
          <span class="where"><span class="dot"></span>${st.label}${st.fromPlan ? html`<span class="plan" title="From the calendar">${haIcon('mdi:calendar-clock')}</span>` : nothing}</span>
          ${st.since ? html`<span class="since">${st.since}</span>` : nothing}
        </div>
      </div>
      <div class="cols">
        ${hasPlan
          ? html`<section class="block">
              <h4>Plan</h4>
              ${!events
                ? html`<p class="nothing">Reading the calendar…</p>`
                : rows.length
                  ? html`<div class="agenda">
                      ${rows.map(({ e, isNow }) => {
                        const place = shortPlace(e.location);
                        const detail = [isNow && !e.allDay ? `until ${formatTime(e.end, this.hass)}` : '', place].filter(Boolean).join(' · ');
                        return html`<div class="ev ${isNow ? 'now' : ''}" title=${e.location ?? ''}>
                          <span class="when num">${whenText(e, isNow, this.hass)}</span>
                          <span class="what"><b>${e.summary}</b>${detail ? html`<small>${detail}</small>` : nothing}</span>
                        </div>`;
                      })}
                    </div>`
                  : html`<p class="nothing">Nothing planned this week</p>`}
            </section>`
          : nothing}
        ${tiles.length ? html`<section class="block"><h4>Status</h4><div class="tiles">${tiles}</div></section>` : nothing}
      </div>
    </div>`;
  }

  // ---------- car page ----------

  private renderCar(i: number) {
    const c = this.config.cars![i];
    const s = this.car(c);
    const level = s.level ?? 0;
    const status = s.charging
      ? `Charging${s.power !== undefined ? ` · ${s.power.toFixed(1)} kW` : ''}`
      : s.plugged
        ? 'Plugged in, not charging'
        : s.where || 'Parked';
    const sub = s.charging && s.fullAt ? `Full at ${s.fullAt}` : s.charging || s.plugged ? s.where : '';
    const climateOn = c.climate ? !['off', 'unavailable', 'unknown'].includes(this.stateOf(c.climate)?.state ?? 'off') : false;
    const lockState = this.stateOf(c.lock)?.state;
    const locked = lockState === 'locked' || lockState === 'off';
    const tiles = [
      c.range ? this.tile('mdi:map-marker-distance', 'Range', this.format(c.range), c.range) : nothing,
      c.target ? this.tile('mdi:battery-arrow-up-outline', 'Charge limit', this.format(c.target), c.target) : nothing,
      s.charging && s.fullAt ? this.tile('mdi:clock-outline', 'Full at', s.fullAt, c.time_to_full) : nothing,
      c.plugged ? this.tile(s.plugged ? 'mdi:power-plug' : 'mdi:power-plug-off-outline', 'Cable', s.plugged ? 'Plugged in' : 'Unplugged', c.plugged) : nothing,
      c.climate
        ? html`<button class="tile ${climateOn ? 'on' : ''}" type="button" aria-pressed=${climateOn} @click=${() => this.callService('homeassistant', 'toggle', {}, { entity_id: c.climate })}>
            <span class="ti">${haIcon('mdi:fan')}</span>
            <span class="tt"><small>Climate</small><b>${climateOn ? 'On · tap to stop' : 'Off · tap to start'}</b></span>
          </button>`
        : nothing,
      c.lock ? this.tile(locked ? 'mdi:lock-outline' : 'mdi:lock-open-variant-outline', 'Doors', locked ? 'Locked' : 'Unlocked', c.lock) : nothing,
      c.odometer ? this.tile('mdi:counter', 'Odometer', this.format(c.odometer), c.odometer) : nothing,
      ...(c.stats ?? []).map(st => this.tile(st.icon ?? 'mdi:information-outline', st.name ?? friendlyName(this.stateOf(st.entity), st.entity), this.statValue(st.entity), st.entity)),
    ].filter(t => t !== nothing);

    return html`<div class="page car-page" data-charging=${s.charging}>
      <div class="hero">
        <div class="car-art">
          ${renderCar(s.colour, `${this.avatarId}-car${i}`, s.charging)}
          ${s.charging ? html`<span class="plug-pulse" aria-hidden="true"></span>` : nothing}
        </div>
        <div class="who">
          <h2>${c.name}</h2>
          <span class="where car-status"><span class="dot"></span>${status}</span>
          ${sub ? html`<span class="since">${sub}</span>` : nothing}
        </div>
      </div>
      <button class="charge" type="button" style="--lvl:${level / 100};--target:${(s.target ?? 100) / 100}" @click=${() => this.moreInfo(c.battery)}>
        <span class="charge-bar ${level <= 20 ? 'low' : ''}">
          <i class="fill"></i>
          ${s.charging ? html`<i class="sheen"></i>` : nothing}
          ${s.target !== undefined && s.target < 100 ? html`<i class="target"></i>` : nothing}
        </span>
        <span class="charge-row num">
          <b>${s.level !== undefined ? `${Math.round(level)}%` : '–'}</b>
          ${c.range ? html`<span>${this.format(c.range)}</span>` : nothing}
        </span>
      </button>
      ${tiles.length ? html`<div class="tiles car-tiles">${tiles}</div>` : nothing}
    </div>`;
  }

  private tile(iconName: string, label: string, value: string, entity?: string) {
    return html`<button class="tile" type="button" @click=${() => this.moreInfo(entity)}>
      <span class="ti">${haIcon(iconName)}</span>
      <span class="tt"><small>${label}</small><b>${value}</b></span>
    </button>`;
  }

  // ---------- frame ----------

  protected override render() {
    const people = this.config.people;
    const statuses = people.map((p, i) => status(this.hass, p, this.events[i]));
    const known = statuses.filter(s => s.presence !== 'none');
    const home = known.filter(s => s.presence === 'home').length;
    const summary = !known.length ? '' : home === known.length ? 'All home' : home === 0 ? 'No one home' : `${home} of ${known.length} home`;
    const v = this.view;
    const cars = this.config.cars ?? [];
    const pageName = v.kind === 'person' ? this.name(people[v.i]) : v.kind === 'car' ? cars[v.i]?.name : '';
    const viewKey = v.kind === 'family' ? 'family' : `${v.kind}-${v.i}`;

    return html`<ha-card class="glass family" @pointerdown=${() => this.armBack()}>
      <div class="bar">
        ${v.kind === 'family'
          ? html`<h3>${this.config.title ?? 'Family'}</h3>
              ${summary ? html`<span class="pill">${summary}</span>` : nothing}`
          : html`<nav class="crumbs" aria-label="Breadcrumb">
              <button class="back" type="button" @click=${this.back}>${icon('left')}<span>${this.config.title ?? 'Family'}</span></button>
              <span class="sep" aria-hidden="true">›</span>
              <b aria-current="page">${pageName}</b>
            </nav>`}
        <span class="spacer"></span>
        ${cars.map((c, i) => {
          const s = this.car(c);
          return html`<button
            class="car-chip ${v.kind === 'car' && v.i === i ? 'current' : ''}"
            type="button"
            data-charging=${s.charging}
            aria-label="${c.name}: ${s.level !== undefined ? `${Math.round(s.level)}%` : 'battery unknown'}${s.charging ? ', charging' : ''}"
            @click=${() => this.open({ kind: 'car', i })}
          >
            ${haIcon('mdi:car-electric-outline')}<span class="num">${s.level !== undefined ? `${Math.round(s.level)}%` : '–'}</span>
            ${s.charging ? html`<span class="bolt" aria-hidden="true">${haIcon('mdi:lightning-bolt')}</span>` : nothing}
          </button>`;
        })}
      </div>
      ${keyed(
        viewKey,
        html`<div class="view">
          ${v.kind === 'family' ? this.renderFamily(statuses) : v.kind === 'person' ? this.renderPerson(v.i, statuses[v.i]) : this.renderCar(v.i)}
        </div>`,
      )}
    </ha-card>`;
  }

  static override styles = [
    base,
    glass,
    sharedStyles,
    css`
      .bar {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 34px;
        margin-bottom: 14px;
      }
      .bar h3 {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
      }
      .spacer {
        flex: 1;
      }
      .crumbs {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        font-size: 14px;
      }
      .back {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 6px 10px 6px 6px;
        border-radius: 11px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        font-weight: 600;
        color: var(--hh-accent);
      }
      .back svg.i {
        width: 17px;
        height: 17px;
      }
      .sep {
        color: var(--hh-ink-3);
      }
      .crumbs b {
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .car-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 6px 11px;
        border-radius: 999px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        font-size: 12.5px;
        font-weight: 600;
        --mdc-icon-size: 17px;
        transition: background 0.2s;
      }
      .car-chip.current {
        background: var(--hh-accent-soft);
        color: var(--hh-accent);
      }
      .car-chip[data-charging='true'] {
        color: var(--hh-ok);
      }
      .bolt {
        display: inline-flex;
        --mdc-icon-size: 14px;
        animation: blink-bolt 1.6s ease-in-out infinite;
      }
      @keyframes blink-bolt {
        50% {
          opacity: 0.35;
        }
      }
      /* Each view slides in when it replaces the last: transform and opacity only. */
      .view {
        animation: view-in 0.38s var(--ease);
      }
      @keyframes view-in {
        from {
          opacity: 0;
          transform: translateX(14px);
        }
      }

      /* family view */
      .people {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
        gap: 10px;
      }
      .member {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        padding: 14px 6px 12px;
        border-radius: 20px;
        min-width: 0;
        user-select: none;
        -webkit-touch-callout: none;
        transition: background 0.2s;
      }
      .member:hover {
        background: var(--hh-glass-strong);
      }
      .member .pwrap {
        width: 80px;
        height: 80px;
        margin-bottom: 6px;
      }
      .member .name {
        font-size: 14.5px;
        font-weight: 600;
      }
      .member .where {
        max-width: 100%;
      }
      .member .where .lbl,
      .next {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }
      .next {
        font-size: 11.5px;
        color: var(--hh-ink-3);
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

      /* person and car pages */
      .hero {
        display: flex;
        align-items: center;
        gap: 18px;
        margin-bottom: 16px;
      }
      .hero-portrait {
        flex: none;
        border-radius: 50%;
      }
      .hero-portrait .pwrap {
        width: 104px;
        height: 104px;
      }
      .who {
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
      }
      .who h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .who .where {
        font-size: 13px;
        align-items: flex-start;
      }
      .who .where .dot {
        margin-top: 5px;
      }
      .plan {
        display: inline-flex;
        color: var(--hh-ink-3);
        --mdc-icon-size: 14px;
      }
      .since {
        font-size: 12px;
        color: var(--hh-ink-3);
      }
      .cols {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
        gap: 16px;
      }
      .block h4 {
        margin: 0 0 8px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--hh-ink-3);
      }
      .agenda {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .ev {
        display: grid;
        grid-template-columns: 92px 1fr;
        gap: 10px;
        align-items: baseline;
        padding: 9px 10px;
        border-radius: 13px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
      }
      .ev.now {
        background: var(--hh-accent-soft);
        border-color: transparent;
      }
      .when {
        font-size: 12px;
        font-weight: 600;
        color: var(--hh-ink-3);
      }
      .ev.now .when {
        color: var(--hh-accent);
      }
      .what {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .what b {
        font-size: 14px;
        font-weight: 600;
        line-height: 1.3;
      }
      .what small {
        font-size: 12px;
        color: var(--hh-ink-3);
        line-height: 1.35;
      }
      .nothing {
        margin: 0;
        font-size: 13px;
        color: var(--hh-ink-3);
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 8px;
      }
      .tile {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 15px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        text-align: left;
        min-width: 0;
        transition: background 0.2s;
      }
      .tile:hover {
        background: var(--hh-glass-press);
      }
      .tile.big {
        grid-column: 1 / -1;
        padding: 14px;
      }
      .ti {
        width: 34px;
        height: 34px;
        border-radius: 11px;
        display: grid;
        place-items: center;
        flex: none;
        background: var(--hh-accent-soft);
        color: var(--hh-accent);
      }
      .ti.bat-low {
        background: color-mix(in srgb, var(--hh-crit) 16%, transparent);
      }
      .ti.bat-charging {
        background: color-mix(in srgb, var(--hh-ok) 16%, transparent);
      }
      .tile.sleeping .ti,
      .tile.on .ti {
        background: color-mix(in srgb, var(--hh-warm) 20%, transparent);
        color: var(--hh-warm);
      }
      .tt {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .tt small {
        font-size: 11.5px;
        color: var(--hh-ink-3);
      }
      .tt b {
        font-size: 14px;
        font-weight: 600;
        line-height: 1.25;
        overflow-wrap: anywhere;
      }

      /* car page */
      .car-art {
        position: relative;
        width: min(46%, 260px);
        flex: none;
      }
      .car-art svg.car {
        width: 100%;
        height: auto;
        display: block;
      }
      .plug-pulse {
        position: absolute;
        left: 15.3%;
        top: 54.5%;
        width: 18px;
        height: 18px;
        margin: -9px 0 0 -9px;
        border-radius: 50%;
        border: 2px solid #7ee0b5;
        animation: plug 1.8s ease-out infinite;
        will-change: transform, opacity;
      }
      @keyframes plug {
        0% {
          transform: scale(0.5);
          opacity: 0.9;
        }
        100% {
          transform: scale(2.2);
          opacity: 0;
        }
      }
      .car-page[data-charging='true'] .car-status .dot {
        background: var(--hh-ok);
      }
      .charge {
        display: block;
        width: 100%;
        text-align: left;
        margin-bottom: 14px;
        --lvl: 0;
        --target: 1;
      }
      .charge-bar {
        position: relative;
        display: block;
        height: 16px;
        border-radius: 999px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        overflow: hidden;
      }
      .fill {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: linear-gradient(90deg, color-mix(in srgb, var(--hh-ok) 70%, var(--hh-accent)), var(--hh-ok));
        transform-origin: 0 50%;
        transform: scaleX(var(--lvl));
        transition: transform 0.8s var(--ease);
      }
      .charge-bar.low .fill {
        background: linear-gradient(90deg, var(--hh-warn), var(--hh-crit));
      }
      /* Charging: a soft light runs along the bar, as a moving layer rather than a redrawn gradient. */
      .sheen {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 30%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
        animation: sheen 2.2s ease-in-out infinite;
        will-change: transform;
      }
      @keyframes sheen {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(calc(var(--lvl) * 333%));
        }
      }
      .target {
        position: absolute;
        top: 2px;
        bottom: 2px;
        left: calc(var(--target) * 100%);
        width: 2px;
        margin-left: -1px;
        border-radius: 1px;
        background: var(--hh-ink-2);
        opacity: 0.6;
      }
      .charge-row {
        display: flex;
        align-items: baseline;
        gap: 12px;
        margin-top: 6px;
        font-size: 13px;
        color: var(--hh-ink-2);
      }
      .charge-row b {
        font-size: 22px;
        font-weight: 300;
        color: var(--hh-ink);
      }
      @media (max-width: 480px) {
        .hero {
          flex-wrap: wrap;
        }
        .car-art {
          width: 100%;
        }
        .ev {
          grid-template-columns: 78px 1fr;
        }
      }
    `,
  ];
}

registerCard('hyggehub-family-card', HyggeFamilyCard, 'HyggeHub Family', 'Everyone in the home, and the car: tap one for their own page.');
