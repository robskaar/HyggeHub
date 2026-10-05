import { css, html, nothing, svg, type PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import { registerCard, HyggeCard } from '../shared/base-card';
import { fetchEvents, forPerson, nowAndNext, shortPlace, type CalEvent } from '../shared/calendar';
import { renderAvatar, type AvatarOptions } from '../shared/avatar';
import { haIcon } from '../shared/icons';
import { formatState, formatTime, friendlyName, lang, numeric, relativeTime } from '../shared/format';
import { base, glass } from '../shared/styles';
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
   * GPS can't (no tracker, or the tracker only says "away"), and the full card lists what's next.
   */
  calendar?: string | string[];
  /** On a shared family calendar, only events mentioning these words count, e.g. "Noah". */
  calendar_match?: string;
  /** Where they are when nothing else says, e.g. `home` for a toddler with no tracker. */
  default_location?: string;
  /** How many upcoming events the full card lists. Default 2. */
  agenda?: number;
}

export interface PersonCardConfig extends CardConfig, PersonConfig {
  style?: 'full' | 'compact';
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

/** The portrait in its ring. Shared by the person and family cards. */
function portrait(p: PersonConfig, st: Status, id: string, delay: number) {
  return html`<span class="portrait" data-presence=${st.presence} data-arrived=${st.justArrived} style="--blink-delay:${delay}s">
    ${p.picture ? html`<img src=${p.picture} alt="" />` : renderAvatar(p.avatar, id, st.asleep)}
  </span>`;
}

const sharedStyles = css`
  .portrait {
    position: relative;
    display: block;
    border-radius: 50%;
    overflow: hidden;
    background: radial-gradient(circle at 35% 25%, var(--hh-glass-press), color-mix(in srgb, var(--hh-accent) 22%, var(--hh-glass-strong)) 70%);
    box-shadow: 0 0 0 3px var(--ring), 0 0 0 7px color-mix(in srgb, var(--ring) 18%, transparent), 0 14px 30px -14px rgba(0, 0, 0, 0.45);
    transition: box-shadow 0.5s;
    --ring: var(--hh-line);
  }
  .portrait[data-presence='home'] {
    --ring: var(--hh-ok);
  }
  .portrait[data-presence='zone'] {
    --ring: var(--hh-accent);
  }
  .portrait[data-presence='away'] {
    --ring: var(--hh-ink-3);
  }
  .portrait[data-arrived='true'] {
    animation: arrived 2.2s ease-out infinite;
  }
  @keyframes arrived {
    0% {
      box-shadow: 0 0 0 3px var(--ring), 0 0 0 3px color-mix(in srgb, var(--ring) 50%, transparent);
    }
    100% {
      box-shadow: 0 0 0 3px var(--ring), 0 0 0 16px transparent;
    }
  }
  .portrait img,
  .portrait .avatar {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
  .figure {
    transform-box: fill-box;
    transform-origin: 50% 100%;
    animation: breathe 4.8s ease-in-out infinite;
  }
  @keyframes breathe {
    50% {
      transform: translateY(1.5px) scale(1.008);
    }
  }
  .eye {
    transform-box: fill-box;
    transform-origin: center;
    animation: blink 6.5s infinite;
    animation-delay: var(--blink-delay, 0s);
  }
  @keyframes blink {
    0%,
    93%,
    100% {
      transform: scaleY(1);
    }
    95% {
      transform: scaleY(0.08);
    }
  }
  .zz text {
    font: 700 15px var(--hh-font);
    fill: var(--hh-ink-2);
    transform-box: fill-box;
    animation: zz 3.2s ease-in-out infinite;
    opacity: 0;
  }
  .zz text:nth-child(2) {
    animation-delay: 0.8s;
  }
  .zz text:nth-child(3) {
    animation-delay: 1.6s;
  }
  @keyframes zz {
    0% {
      opacity: 0;
      transform: translate(0, 6px) scale(0.7);
    }
    30% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(6px, -10px) scale(1.1);
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

/** Calendar plumbing shared by the person and family cards: load on first sight, on change, and each minute. */
abstract class PeopleCard<C extends CardConfig> extends HyggeCard<C> {
  @state() protected events: Array<CalEvent[] | undefined> = [];
  private loadedFor?: string;
  private ticker?: number;

  protected abstract people(): PersonConfig[];

  override connectedCallback() {
    super.connectedCallback();
    // Once a minute: what's "now" moves on even when no entity changes. The fetch itself is cached.
    this.ticker = window.setInterval(() => void this.loadEvents(false), 60_000);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.ticker);
  }

  protected override updated(changed: PropertyValues) {
    super.updated(changed);
    if (!this.hass) return;
    const people = this.people();
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
      this.people().map(p => (calendars(p).length ? fetchEvents(hass, calendars(p), force).then(ev => forPerson(ev, p.calendar_match)) : Promise.resolve(undefined))),
    );
  }

  /** "Football · Thu 16:30": the next thing within a day and a half, for the small layouts. */
  protected nextUp(events?: CalEvent[]): string {
    const next = events ? nowAndNext(events).upcoming[0] : undefined;
    if (!next || next.start.getTime() - Date.now() > 36 * 36e5) return '';
    return `${next.summary} · ${whenText(next, false, this.hass)}`;
  }
}

export class HyggePersonCard extends PeopleCard<PersonCardConfig> {
  private avatarId = `hh-av${++seq}`;
  /** Each portrait blinks on its own rhythm rather than in unison. */
  private blinkDelay = -(seq % 5) * 1.3;

  static getStubConfig(hass: any) {
    return { entity: Object.keys(hass?.states ?? {}).find(id => id.startsWith('person.')) ?? 'person.me', avatar: { preset: 'man', hair: 'brown', eyes: 'hazel' } };
  }

  protected override validateConfig(c: PersonCardConfig) {
    if (!c.entity && !c.name) throw new Error('Set a person `entity`, or at least a `name`.');
  }

  protected override watchedEntities() {
    return watched(this.config);
  }

  protected people() {
    return [this.config];
  }

  override getCardSize() {
    return this.config.style === 'compact' ? 3 : 4;
  }

  override getGridOptions() {
    return this.config.style === 'compact' ? { columns: 3, min_columns: 3 } : { columns: 12, min_columns: 6 };
  }

  private statValue(entityId: string) {
    const s = this.stateOf(entityId);
    if (s?.attributes.device_class === 'timestamp') {
      const d = new Date(s.state);
      if (!isNaN(d.getTime())) return relativeTime(d);
    }
    return this.format(entityId);
  }

  private renderAgenda(events?: CalEvent[]) {
    const ids = calendars(this.config);
    if (!ids.length || !events) return nothing;
    const { now, upcoming } = nowAndNext(events);
    const rows = [...(now ? [{ e: now, isNow: true }] : []), ...upcoming.slice(0, this.config.agenda ?? 2).map(e => ({ e, isNow: false }))];
    if (!rows.length) return html`<div class="agenda"><p class="nothing">Nothing planned this week</p></div>`;
    return html`<div class="agenda">
      ${rows.map(({ e, isNow }) => {
        const detail = [isNow && !e.allDay ? `until ${formatTime(e.end, this.hass)}` : '', shortPlace(e.location)].filter(Boolean).join(' · ');
        return html`<button class="ev ${isNow ? 'now' : ''}" type="button" @click=${() => this.moreInfo(ids[0])}>
          <span class="when num">${whenText(e, isNow, this.hass)}</span>
          <span class="what"><b>${e.summary}</b>${detail ? html`<small>${detail}</small>` : nothing}</span>
        </button>`;
      })}
    </div>`;
  }

  protected override render() {
    const c = this.config;
    const events = this.events[0];
    const st = status(this.hass, c, events);
    const bat = battery(this.hass, c);
    const name = c.name ?? friendlyName(this.stateOf(c.entity), 'Someone');
    const batCls = bat ? (bat.charging ? 'bat-charging' : bat.level <= 20 ? 'bat-low' : '') : '';

    if (c.style === 'compact') {
      const next = this.nextUp(events);
      return html`<ha-card class="glass compact" data-presence=${st.presence} data-asleep=${st.asleep} @click=${() => this.moreInfo(c.entity)}>
        ${portrait(c, st, this.avatarId, this.blinkDelay)}
        <b class="name">${name}</b>
        <span class="where"><span class="dot"></span><span class="lbl">${st.asleep ? 'Asleep' : st.label.split(' · ')[0]}</span></span>
        ${next ? html`<span class="next">${next}</span>` : nothing}
        ${bat ? html`<span class="mini-bat num ${batCls}">${batteryIcon(bat.level, bat.charging)}${bat.level}%</span>` : nothing}
      </ha-card>`;
    }

    // A toggle helper as the sleep entity makes the tile a button: tap at bedtime, tap when they wake.
    const sleepToggle = c.sleep?.startsWith('input_boolean.');
    const tiles = [
      c.sleep
        ? html`<button
            class="tile ${st.asleep ? 'sleeping' : ''}"
            type="button"
            aria-pressed=${sleepToggle ? st.asleep : nothing}
            @click=${() => (sleepToggle ? this.callService('input_boolean', 'toggle', {}, { entity_id: c.sleep }) : this.moreInfo(c.sleep))}
          >
            <span class="ti">${haIcon(st.asleep ? 'mdi:sleep' : 'mdi:white-balance-sunny')}</span>
            <span class="tt">
              <small>Sleep</small>
              <b>${st.asleep ? `Asleep ${st.sleepFor}` : 'Awake'}</b>
            </span>
          </button>`
        : nothing,
      bat
        ? html`<button class="tile" type="button" @click=${() => this.moreInfo(c.battery)}>
            <span class="ti ${batCls}">${batteryIcon(bat.level, bat.charging)}</span>
            <span class="tt"><small>${bat.charging ? html`<em>Charging</em>` : c.battery_label ?? 'Phone'}</small><b class="num">${bat.level}%</b></span>
          </button>`
        : nothing,
      ...(c.stats ?? []).map(
        s => html`<button class="tile" type="button" @click=${() => this.moreInfo(s.entity)}>
          <span class="ti">${haIcon(s.icon ?? (this.stateOf(s.entity)?.attributes.icon as string | undefined) ?? 'mdi:information-outline')}</span>
          <span class="tt"><small>${s.name ?? friendlyName(this.stateOf(s.entity), s.entity)}</small><b>${this.statValue(s.entity)}</b></span>
        </button>`,
      ),
    ].filter(t => t !== nothing);

    return html`<ha-card class="glass full" data-presence=${st.presence} data-asleep=${st.asleep}>
      <div class="top">
        <button class="pbtn" type="button" aria-label="${name}: ${st.label}" @click=${() => this.moreInfo(c.entity ?? c.sleep)}>${portrait(c, st, this.avatarId, this.blinkDelay)}</button>
        <div class="who">
          <h3>${name}</h3>
          <span class="where"><span class="dot"></span>${st.label}${st.fromPlan ? html`<span class="plan" title="From the calendar">${haIcon('mdi:calendar-clock')}</span>` : nothing}</span>
          ${st.since ? html`<span class="since">${st.since}</span>` : nothing}
        </div>
      </div>
      ${this.renderAgenda(events)} ${tiles.length ? html`<div class="tiles">${tiles}</div>` : nothing}
    </ha-card>`;
  }

  static override styles = [
    base,
    glass,
    sharedStyles,
    css`
      .top {
        display: flex;
        align-items: center;
        gap: 18px;
      }
      .pbtn {
        flex: none;
        border-radius: 50%;
      }
      .full .portrait {
        width: 104px;
        height: 104px;
      }
      .who {
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
      }
      .who h3 {
        margin: 0;
        font-size: 22px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .since {
        font-size: 12px;
        color: var(--hh-ink-3);
      }
      .where .plan {
        display: inline-flex;
        color: var(--hh-ink-3);
        --mdc-icon-size: 14px;
      }
      .agenda {
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin-top: 14px;
        padding-top: 10px;
        border-top: 1px solid var(--hh-line);
      }
      .ev {
        display: grid;
        grid-template-columns: 84px 1fr;
        gap: 10px;
        align-items: baseline;
        padding: 7px 8px;
        border-radius: 12px;
        text-align: left;
        width: 100%;
      }
      .ev:hover {
        background: var(--hh-glass-strong);
      }
      .ev.now {
        background: var(--hh-accent-soft);
      }
      .when {
        font-size: 12px;
        font-weight: 600;
        color: var(--hh-ink-3);
        white-space: nowrap;
      }
      .ev.now .when {
        color: var(--hh-accent);
      }
      .what {
        min-width: 0;
      }
      .what b {
        display: block;
        font-size: 13.5px;
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .what small {
        display: block;
        font-size: 12px;
        color: var(--hh-ink-3);
        overflow-wrap: anywhere;
      }
      .nothing {
        margin: 4px 8px;
        font-size: 12.5px;
        color: var(--hh-ink-3);
      }
      .next {
        font-size: 11.5px;
        color: var(--hh-ink-3);
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 8px;
        margin-top: 16px;
      }
      .tile {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 16px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        text-align: left;
        min-width: 0;
        transition: background 0.2s;
      }
      .tile:hover {
        background: var(--hh-glass-press);
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
      .tile.sleeping .ti {
        background: color-mix(in srgb, var(--hh-warm) 18%, transparent);
        color: var(--hh-warm);
      }
      .ti.bat-low {
        background: color-mix(in srgb, var(--hh-crit) 16%, transparent);
        color: var(--hh-crit);
      }
      .ti.bat-charging {
        background: color-mix(in srgb, var(--hh-ok) 16%, transparent);
        color: var(--hh-ok);
      }
      .tt {
        min-width: 0;
      }
      .tt small {
        display: block;
        font-size: 11px;
        color: var(--hh-ink-3);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .tt b {
        display: block;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.25;
        overflow-wrap: anywhere;
      }
      .tt em {
        font-style: normal;
        font-size: 11px;
        font-weight: 600;
        color: var(--hh-ok);
      }
      ha-card.compact {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        text-align: center;
        padding: 18px 12px 14px;
        cursor: pointer;
        height: 100%;
      }
      .compact .portrait {
        width: 84px;
        height: 84px;
        margin-bottom: 6px;
      }
      .compact .name {
        font-size: 15px;
        font-weight: 600;
      }
      .compact .where .lbl {
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
    `,
  ];
}

/** Everyone in the home on one card, for the top of a dashboard. */
export class HyggeFamilyCard extends PeopleCard<FamilyCardConfig> {
  private avatarId = `hh-fam${++seq}`;

  static getStubConfig(hass: any) {
    return { people: Object.keys(hass?.states ?? {}).filter(id => id.startsWith('person.')).map(entity => ({ entity })) };
  }

  protected override validateConfig(c: FamilyCardConfig) {
    if (!Array.isArray(c.people) || !c.people.length) throw new Error('List the family under `people`.');
  }

  protected override watchedEntities() {
    return this.config.people.flatMap(watched);
  }

  protected people() {
    return this.config.people;
  }

  override getCardSize() {
    return 3;
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
          return html`<button class="member" type="button" data-presence=${st.presence} data-asleep=${st.asleep} @click=${() => this.moreInfo(p.entity ?? p.sleep)}>
            ${portrait(p, st, `${this.avatarId}-${i}`, i * -1.6)}
            <b>${name}</b>
            <span class="where"><span class="dot"></span><span class="lbl">${st.asleep ? 'Asleep' : st.label.split(' · ')[0]}</span></span>
            ${next ? html`<span class="next" title=${next}>${next}</span>` : nothing}
            ${bat ? html`<span class="mini-bat num ${batCls}">${batteryIcon(bat.level, bat.charging)}${bat.level}%</span>` : nothing}
          </button>`;
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
        grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
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
        transition: background 0.2s;
      }
      .member:hover {
        background: var(--hh-glass-strong);
      }
      .member .portrait {
        width: 80px;
        height: 80px;
        margin-bottom: 6px;
      }
      .member b {
        font-size: 14.5px;
        font-weight: 600;
      }
      .member .where {
        max-width: 100%;
      }
      .next {
        font-size: 11.5px;
        color: var(--hh-ink-3);
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .member .where .lbl {
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
    `,
  ];
}

registerCard('hyggehub-person-card', HyggePersonCard, 'HyggeHub Person', 'A family member with a drawn portrait, where they are, phone battery and stats.');
registerCard('hyggehub-family-card', HyggeFamilyCard, 'HyggeHub Family', 'Everyone in the home with their portraits, location and phone battery.');
