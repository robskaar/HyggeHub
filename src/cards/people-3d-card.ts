import { css, html, nothing, type PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import { avatarColours } from '../shared/avatar';
import { registerCard } from '../shared/base-card';
import { fetchEvents, forPerson, nowAndNext, shortPlace, type CalEvent } from '../shared/calendar';
import { formatState, friendlyName } from '../shared/format';
import { interestsOf } from '../shared/interests';
import { base, glass } from '../shared/styles';
import { weatherFrom } from './energy-3d-card';
import type { SceneState } from './energy-3d/scene';
import type { PersonConfig } from './family-card';
import { battery, calendars, status, whenText } from './family-card';
import type { StageLabel } from './energy-3d/stage';
import type { PlaceKind, TownBits, TownPlace, TownState } from './energy-3d/town';
import { worldStyles } from './energy-3d/world-styles';
import { WorldCard, type WorldCardConfig, type WorldLabel, type WorldModule } from './world-card';

export interface People3dCardConfig extends WorldCardConfig {
  /** The same people as the family card. */
  people: PersonConfig[];
  /**
   * Places for the town beyond those it finds itself (Home Assistant's zones, and the places in the
   * calendars), e.g. `{ name: Mormor, kind: family }`. Kind: office, school, kindergarten, field,
   * family, shop, garden or generic; guessed from the name when left out.
   */
  places?: Array<{ name: string; kind?: PlaceKind }>;
  /** Weather entity for the rain and snow; default weather.forecast_home, else the first. */
  weather?: string;
  /**
   * The house view's settings (the home card passes them on), so the house in the middle is the house
   * view's own: its model, the bins where they are, its flows running, its car.
   */
  house?: Record<string, unknown>;
}

const PIN = 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 7.5a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4z';
const HOME = 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5';
const MOON = 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z';
const BATTERY = 'M7 6h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM17 10h2v4h-2';
const CAL = 'M5 6h14v13H5zM5 10h14M9 4v4M15 4v4';

/** Each person's colour in town: their trail, their name tag's icon. */
const COLOURS = ['#6b9a5b', '#8a5aa8', '#4f7fb0', '#d9903e', '#c4664f', '#3f9ea0'];

/** What kind of building a place is, from its name (English or Danish). */
const KINDS: Array<[PlaceKind, RegExp]> = [
  ['kindergarten', /vuggestue|børnehave|bornehave|dagpleje|daycare|nursery|kindergarten|mælkebøtte/],
  ['school', /skole|school|sfo|gymnasi|universit|college/],
  ['field', /fodbold|football|soccer|stadion|stadium|padel|tennis|sport|hallen|idræt|svøm|swim|gym\b|fitness/],
  ['family', /mormor|morfar|farmor|farfar|momo|mofa|fafa|bedste|grandma|grandpa|granny|nana|forældre|svigerforældre/],
  ['shop', /netto|føtex|bilka|rema|lidl|aldi|super|shop|store|brugsen|meny|coop|kvickly|spar\b|center/],
  ['garden', /plantorama|planteskole|gartneri|garden|plant/],
  ['office', /arbejde|work|job|kontor|office|firma/],
];
const kindOf = (name: string): PlaceKind => KINDS.find(([, re]) => re.test(name.toLowerCase()))?.[0] ?? 'generic';
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9æøå]+/g, ' ').trim();
/** The house view's card, as the town asks it for the house. */
type HouseCard = HTMLElement & { setConfig(c: unknown): void; hass?: unknown; houseState(): SceneState };
/** "Fodbold" out of "Pelle: Fodbold". */
const what = (summary: string) => summary.replace(/^[^:]{1,24}:\s*/, '');

/**
 * The family in a little town of square plots: the house from the house view in the middle, the places
 * they go (Home Assistant's zones and the places in their calendars) as buildings round it, what they
 * love as little scenes in a park and on a square. Everyone stands where they are and walks there along
 * the roads when they move; a dotted trail shows where they go next. Tapping someone zooms in on them,
 * with their details (and what they love: tap to fly there) along the bottom.
 */
export class HyggePeople3dCard extends WorldCard<People3dCardConfig> {
  @state() private events: Record<number, CalEvent[] | undefined> = {};
  /** Their details as chips along the bottom, so the town stays in view. */
  protected override dock = true;
  /** Several at home stand close together; their names stack rather than cover each other. */
  protected override spreadLabels = true;
  /** The calendar opened from its chip. */
  @state() private calOpen = false;
  private eventsFor?: string;

  static getStubConfig() {
    return { people: [{ entity: 'person.me', avatar: { preset: 'man' } }] };
  }

  protected override validateConfig(c: People3dCardConfig) {
    if (!Array.isArray(c.people) || !c.people.length) throw new Error('List the people under `people`, as on the family card.');
  }

  protected override watchedEntities() {
    return [...this.config.people.flatMap(p => [p.entity, p.battery, p.charging, p.distance, p.sleep, ...calendars(p), ...(p.stats ?? []).map(s => s.entity)]), this.weatherId()];
  }

  protected override updated(changed: PropertyValues) {
    super.updated(changed);
    // Calendars: where each person is when GPS can't say, and where they go next.
    const key = this.config.people.map(p => calendars(p).join(',')).join(';');
    if (this.hass && key !== this.eventsFor) {
      this.eventsFor = key;
      this.config.people.forEach((p, i) => {
        const cals = calendars(p).filter(id => this.hass!.states[id]);
        if (cals.length) void fetchEvents(this.hass!, cals).then(ev => (this.events = { ...this.events, [i]: forPerson(ev, p.calendar_match) }));
      });
    }
  }

  private name(p: PersonConfig) {
    return p.name ?? friendlyName(this.stateOf(p.entity), 'Someone');
  }

  private statusOf(i: number) {
    return status(this.hass, this.config.people[i], this.events[i]);
  }

  private weatherId(): string | undefined {
    if (this.config.weather) return this.config.weather;
    const ids = Object.keys(this.hass?.states ?? {}).filter(id => id.startsWith('weather.'));
    return ids.includes('weather.forecast_home') ? 'weather.forecast_home' : ids.sort()[0];
  }

  // ---------- the town's places, and who is where ----------

  /**
   * Where each person is, where they go next, and the places the town needs: first those people are at
   * or going to, then the configured ones, then the rest of Home Assistant's zones; at most seven.
   */
  private town() {
    const places: TownPlace[] = [];
    const find = (name: string) => {
      const n = norm(name);
      if (n.length < 2) return undefined;
      return places.find(pl => {
        const m = norm(pl.name);
        return m === n || (m.length >= 3 && n.includes(m)) || (n.length >= 3 && m.includes(n));
      });
    };
    // The kind configured for a place counts wherever the place comes from (a zone, a calendar).
    const configured = (name: string) => (this.config.places ?? []).find(pl => pl.kind && norm(pl.name) === norm(name))?.kind;
    const add = (name: string | undefined, kind?: PlaceKind) => {
      if (!name || name.toLowerCase() === 'home' || name === 'not_home') return undefined;
      const hit = find(name);
      if (hit) return hit.key;
      if (places.length >= 7) return undefined;
      const key = `pl-${norm(name).replace(/ /g, '-')}`;
      places.push({ key, name, kind: kind ?? configured(name) ?? kindOf(name) });
      return key;
    };
    const zones = Object.values(this.hass?.states ?? {})
      .filter(e => e.entity_id.startsWith('zone.') && e.entity_id !== 'zone.home')
      .map(e => String(e.attributes.friendly_name ?? e.entity_id.slice(5)));
    const soon = Date.now() + 24 * 3600e3;
    const people = this.config.people.map((p, i) => {
      const st = this.statusOf(i);
      const gps = p.entity ? this.hass?.states[p.entity]?.state : undefined;
      const ev = this.events[i];
      const { now, upcoming } = ev ? nowAndNext(ev) : { now: undefined, upcoming: [] as CalEvent[] };
      let where = 'home';
      if (st.asleep || st.presence === 'home' || st.presence === 'none') where = 'home';
      else if (st.presence === 'away') where = 'away';
      else if (!st.fromPlan && gps) where = add(zones.find(z => norm(z) === norm(gps)) ?? gps) ?? 'away';
      else if (now) where = add(shortPlace(now.location) || what(now.summary)) ?? 'away';
      else if (p.default_location) where = add(p.default_location) ?? 'away';
      const nextEv = upcoming.find(e => e.start.getTime() < soon && shortPlace(e.location));
      return { p, i, st, where, nextEv };
    });
    // Where they go next, if it has a place (it becomes one).
    const nexts = people.map(x => (x.nextEv ? add(shortPlace(x.nextEv.location)) : undefined));
    for (const pl of this.config.places ?? []) add(pl.name, pl.kind);
    for (const z of zones) add(z);
    places.sort((a, b) => a.name.localeCompare(b.name));
    return { places, people, nexts };
  }

  protected override createWorld(mod: WorldModule, canvas: HTMLCanvasElement, onLabels: (l: StageLabel[]) => void, dpr: number) {
    const town = new mod.TownScene(canvas, onLabels, dpr);
    this.townReady = town.load(String(this.config.house?.model ?? mod.DEFAULT_MODEL)).catch(err => console.warn('HyggeHub: the house for the town did not load', err));
    return town;
  }

  private townReady?: Promise<void>;
  /** A house card that is never shown, kept to work out the house as the house view shows it. */
  private houseCard?: HouseCard;

  /** Resolves when the town has its house (a tab switch waits for it, so the change is seamless). */
  override async whenReady() {
    await super.whenReady();
    await this.townReady;
  }

  /** The house as the house view shows it, or a plain one when there are no house settings. */
  private houseState(): SceneState {
    const c = this.config.house;
    if (c && !this.houseCard) {
      const el = document.createElement('hyggehub-energy-3d-card') as HouseCard;
      try {
        el.setConfig({ ...c, type: 'custom:hyggehub-energy-3d-card' });
        this.houseCard = el;
      } catch {
        // Settings the house view rejects: the plain house below.
      }
    }
    if (this.houseCard) {
      this.houseCard.hass = this.hass;
      try {
        return this.houseCard.houseState();
      } catch {
        // Fall through to the plain house.
      }
    }
    const look = this.look();
    const wid = this.weatherId();
    return {
      flows: { grid: null, solar: null, car: null, water: null },
      colors: { grid: '#4aa8ff', solar: '#ffb13d', car: '#4fdc8c', water: '#5ec2f0' },
      night: look.night,
      facing: 180,
      weather: weatherFrom(wid ? this.hass?.states[wid] : undefined),
      car: null,
      hidden: ['solar'],
      bins: null,
      driveLights: look.night > 0.5 ? 1 : 0,
      motion: look.motion,
      fogColor: getComputedStyle(this).getPropertyValue('--hh-bg').trim() || '#dce3e5',
    };
  }

  protected override worldState(): TownState | TownBits {
    const { places, people, nexts } = this.town();
    // (Through a variable: Vite would otherwise take new URL(…, import.meta.url) for an asset to bundle.)
    const here = import.meta.url;
    return {
      // Over the house view's own scene, the house is that card's to draw.
      ...(this.external ? {} : this.houseState()),
      places,
      people: people.map(({ p, i, st, where, nextEv }) => {
        const look = avatarColours(p.avatar);
        const slug = this.name(p).toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '');
        return {
          key: `p${i}`,
          name: this.name(p),
          colour: COLOURS[i % COLOURS.length],
          skin: look.skin,
          hair: look.hair,
          shirt: look.shirt,
          preset: look.preset,
          model: p.model ?? new URL('people/' + slug + '.glb', here).href,
          at: where,
          asleep: st.asleep,
          next: nextEv ? nexts[i] : undefined,
          interests: interestsOf(p.interests),
        };
      }),
    };
  }

  /** Over each person, their name, where they are and their battery; tap for their details. */
  protected override labels(): WorldLabel[] {
    const { places, people } = this.town();
    return people.map(({ p, i, st, where }) => {
      const bat = battery(this.hass, p);
      // At home the house says where they are; the caption is just their battery.
      const placeName = st.asleep ? 'Asleep' : where === 'home' ? '' : where === 'away' ? 'Out' : (places.find(x => x.key === where)?.name ?? st.label);
      return {
        key: `p${i}`,
        value: this.name(p),
        caption: [placeName, bat ? `${bat.level}%${bat.charging ? ' ⚡' : ''}` : ''].filter(Boolean).join(' · ') || 'Home',
        icon: st.asleep ? MOON : where === 'home' ? HOME : PIN,
        color: COLOURS[i % COLOURS.length],
      };
    });
  }

  /** Over each place its name, and what's on there next and for whom. */
  protected override renderStageExtras() {
    const { places, people, nexts } = this.town();
    return html`${places.map(pl => {
      const going = people.filter(x => x.nextEv && nexts[x.i] === pl.key && x.where !== pl.key);
      const first = going[0];
      return html`<div class="tag spot" data-key=${pl.key} aria-hidden="true">
        ${first ? html`<span class="dot" style="background:${COLOURS[first.i % COLOURS.length]}"></span>` : nothing}
        <span class="txt"
          ><b>${pl.name}</b>${first
            ? html`<small>${this.name(first.p)} · ${what(first.nextEv!.summary)} · ${whenText(first.nextEv!, false, this.hass)}${going.length > 1 ? ` +${going.length - 1}` : ''}</small>`
            : nothing}</span
        >
      </div>`;
    })}`;
  }

  protected override openDetail(key: string) {
    this.calOpen = false;
    super.openDetail(key);
  }

  protected override closeDetail() {
    this.calOpen = false;
    super.closeDetail();
  }

  /** Who's home, as a chip like the weather on the house. */
  protected override renderHeaderExtras() {
    const sts = this.config.people.map((_, i) => this.statusOf(i));
    const home = sts.filter(s => s.presence === 'home' || s.asleep).length;
    const n = sts.length;
    const text = home === n ? 'All home' : home === 0 ? 'Nobody home' : `${home} of ${n} home`;
    return html`<span class="weather"><svg viewBox="0 0 24 24" class="i" style="color:${home ? 'var(--hh-ok)' : 'var(--hh-ink-3)'}"><path d=${HOME}></path></svg><b>${text}</b></span>`;
  }

  protected override detailTitle(key: string) {
    return this.name(this.config.people[Number(key.slice(1))]);
  }

  /** Their details as chips: where and since when, battery, their sensors, what's on now and next. */
  protected override detailBody(key: string) {
    const i = Number(key.slice(1));
    const p = this.config.people[i];
    const st = this.statusOf(i);
    const bat = battery(this.hass, p);
    const ev = this.events[i];
    const { now, upcoming } = ev ? nowAndNext(ev) : { now: undefined, upcoming: [] as CalEvent[] };
    const icon = (d: string) => html`<svg viewBox="0 0 24 24" class="i"><path d=${d}></path></svg>`;
    // History of where they've been (their person entity), or else of their phone; only one that exists.
    const history = [p.entity, p.battery].find(id => id && this.hass?.states[id]);
    const next = now ?? upcoming[0];
    const agenda = [...(now ? [now] : []), ...upcoming.slice(0, p.agenda ?? 6)];
    return html`
      <span class="chip">${icon(st.asleep ? MOON : st.presence === 'home' ? HOME : PIN)}${st.asleep ? `Asleep ${st.sleepFor ?? ''}` : st.label}${st.since ? html` <small>${st.since}</small>` : nothing}</span>
      ${bat ? html`<span class="chip">${icon(BATTERY)}<span class="num">${bat.level}%</span>${bat.charging ? html` <small>charging</small>` : nothing}</span>` : nothing}
      ${(p.stats ?? []).map(x => html`<span class="chip">${x.name ?? friendlyName(this.stateOf(x.entity), x.entity)} <b class="num">${formatState(this.hass, this.stateOf(x.entity))}</b></span>`)}
      ${next
        ? html`<button type="button" class="chip" aria-expanded=${this.calOpen} @click=${() => (this.calOpen = !this.calOpen)}>${icon(CAL)}${next.summary} <small>${next === now ? 'now' : whenText(next, false, this.hass)}</small></button>`
        : nothing}
      ${this.calOpen
        ? html`<div class="calpop" role="dialog" aria-label="Calendar">
            <div class="calpop-h"><b>Calendar</b><button type="button" aria-label="Close" @click=${() => (this.calOpen = false)}>✕</button></div>
            <ul class="agenda">
              ${agenda.map(
                e => html`<li class=${e === now ? 'now' : ''}>
                  <small class="num">${whenText(e, e === now, this.hass)}</small>
                  <span>${e.summary}${shortPlace(e.location) ? html`<small class="place">${shortPlace(e.location)}</small>` : nothing}</span>
                </li>`,
              )}
            </ul>
          </div>`
        : nothing}
      ${history ? html`<button type="button" class="chip" @click=${() => this.moreInfo(history)}>History</button>` : nothing}
    `;
  }

  static override styles = [
    base,
    glass,
    worldStyles,
    css`
      /* The places' names: quieter than the people's, and not to be tapped. */
      .tag.spot {
        pointer-events: none;
        padding: 3px 10px;
        gap: 6px;
        background: color-mix(in srgb, var(--hh-glass-strong) 80%, transparent);
        box-shadow: none;
      }
      .ready .tag.spot {
        opacity: 0.92;
      }
      .ready .tag.spot.off {
        opacity: 0;
      }
      .tag.spot b {
        font-size: 11.5px;
      }
      .tag.spot small {
        text-transform: none;
        letter-spacing: 0;
        font-size: 10.5px;
        font-weight: 500;
        color: var(--hh-ink-2);
      }
      .tag.spot .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex: none;
      }
      .calpop {
        position: absolute;
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%);
        width: min(360px, calc(100vw - 48px));
        max-height: 50vh;
        overflow: auto;
        pointer-events: auto;
        padding: 12px 14px;
        border-radius: 20px;
        background: var(--hh-glass-strong);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
        backdrop-filter: blur(18px) saturate(160%);
        border: 1px solid var(--hh-stroke);
        box-shadow: var(--hh-shadow);
        animation: dock-in 0.3s var(--spring, ease) both;
      }
      .calpop-h {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
        font-size: 13px;
      }
      .calpop-h button {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        color: var(--hh-ink-2);
      }
      .agenda li.now span {
        font-weight: 600;
      }
      .agenda .place {
        display: block;
        font-size: 11px;
        color: var(--hh-ink-3);
      }
    `,
  ];
}

registerCard('hyggehub-people-3d-card', HyggePeople3dCard, 'HyggeHub People 3D', 'The family in a little town: their house, the places they go, everyone where they are.');
