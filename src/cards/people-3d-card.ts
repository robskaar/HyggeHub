import { css, html, nothing, type PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import { avatarColours } from '../shared/avatar';
import { registerCard } from '../shared/base-card';
import { fetchEvents, forPerson, nowAndNext, shortPlace, type CalEvent } from '../shared/calendar';
import { formatState, friendlyName } from '../shared/format';
import { interestsOf } from '../shared/interests';
import { base, glass } from '../shared/styles';
import type { PersonConfig } from './family-card';
import { battery, calendars, status, whenText } from './family-card';
import type { Interest, PeopleState } from './energy-3d/people';
import type { StageLabel } from './energy-3d/stage';
import { worldStyles } from './energy-3d/world-styles';
import { WorldCard, type WorldCardConfig, type WorldLabel, type WorldModule } from './world-card';

export interface People3dCardConfig extends WorldCardConfig {
  /** The same people as the family card, plus `interests` for their dioramas. */
  people: PersonConfig[];
}

const PIN = 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 7.5a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4z';
const HOME = 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5';
const MOON = 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z';
const BATTERY = 'M7 6h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM17 10h2v4h-2';
const CAL = 'M5 6h14v13H5zM5 10h14M9 4v4M15 4v4';

/** Each card's colours, like the diorama of the person's first interest: its ground and a sky over it. */
const GROUNDS = {
  wood: { sky: '#f3e4cf', sky2: '#ead2b3', top: '#c49a6c', edge: '#8a6446' },
  grass: { sky: '#e1f0d8', sky2: '#c6e2b8', top: '#8dbb67', edge: '#b88a63' },
  sand: { sky: '#faeed6', sky2: '#f0dcb2', top: '#e8d3a2', edge: '#b88a63' },
};
const groundOf = (i?: Interest) => (i === 'cooking' || i === 'tech' ? GROUNDS.wood : i === 'cars' ? GROUNDS.sand : GROUNDS.grass);

/**
 * The family as a card each: a portrait of their figurine close up, their name, where they are, their
 * phone's battery and what's next in their calendar, in the colours of their diorama. Tapping a card
 * pulls the camera back from their face to show them on their island, with all their details.
 */
export class HyggePeople3dCard extends WorldCard<People3dCardConfig> {
  @state() private events: Record<number, CalEvent[] | undefined> = {};
  /** Inside someone's room, their details are chips along the bottom, so the room stays in view. */
  protected override dock = true;
  /** The calendar opened from the chip in someone's room. */
  @state() private calOpen = false;
  private eventsFor?: string;

  static getStubConfig() {
    return { people: [{ entity: 'person.me', avatar: { preset: 'man' }, interests: ['cooking'] }] };
  }

  protected override validateConfig(c: People3dCardConfig) {
    if (!Array.isArray(c.people) || !c.people.length) throw new Error('List the people under `people`, as on the family card.');
  }

  protected override watchedEntities() {
    return this.config.people.flatMap(p => [p.entity, p.battery, p.charging, p.distance, p.sleep, ...calendars(p), ...(p.stats ?? []).map(s => s.entity)]);
  }

  protected override updated(changed: PropertyValues) {
    super.updated(changed);
    // Calendars: what each person is doing now fills in where GPS can't, and the details list what's next.
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

  protected override createWorld(mod: WorldModule, canvas: HTMLCanvasElement, onLabels: (l: StageLabel[]) => void, dpr: number) {
    return new mod.PeopleScene(canvas, onLabels, dpr);
  }

  protected override worldState(): PeopleState {
    return {
      ...this.look(),
      people: this.config.people.map((p, i) => {
        const st = this.statusOf(i);
        const name = this.name(p).toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '');
        return { key: `p${i}`, ...avatarColours(p.avatar), interests: interestsOf(p.interests), model: p.model, name, home: st.presence === 'home', asleep: st.asleep };
      }),
      cells: () => this.cells(),
    };
  }

  /** Where the cards are on the canvas, for the scene to draw each portrait into. */
  private cells() {
    const canvas = this.renderRoot.querySelector('canvas');
    if (!canvas) return [];
    const c = canvas.getBoundingClientRect();
    return [...this.renderRoot.querySelectorAll<HTMLElement>('.bgs .cell')].map(el => {
      const r = el.getBoundingClientRect();
      return { x: r.left - c.left, y: r.top - c.top, w: r.width, h: r.height };
    });
  }

  /** Opening a card walks into it. */
  protected override openDetail(key: string) {
    this.calOpen = false;
    super.openDetail(key);
  }

  protected override closeDetail() {
    this.calOpen = false;
    super.closeDetail();
  }

  /** No labels in the scene: the cards carry the names. */
  protected override labels(): WorldLabel[] {
    return [];
  }

  /**
   * A card per person, in two layers: the backgrounds (sky, and the ground in layers like the edge of
   * their diorama) under the canvas, where the scene draws their portrait; their name, where they are,
   * battery and what's next over it.
   */
  protected override renderStageExtras() {
    const people = this.config.people;
    const n = people.length;
    const ground = (i: number) => groundOf(interestsOf(people[i].interests)[0]);
    const vars = (i: number) => {
      const g = ground(i);
      return `--i:${i};--sky:${g.sky};--sky2:${g.sky2};--top:${g.top};--edge:${g.edge}`;
    };
    return html`
      <div class="deck" data-n=${Math.min(n, 4)}>
        <div class="grid bgs" aria-hidden="true">
          ${people.map((_, i) => html`<div class="cell" style=${vars(i)}><i class="sheen"></i><i class="mote"></i><i class="mote m2"></i><span class="ground"><b></b><b></b><b></b></span></div>`)}
        </div>
        <div class="grid fgs">
          ${people.map((p, i) => {
            const st = this.statusOf(i);
            const bat = battery(this.hass, p);
            const place = st.asleep ? 'Asleep' : st.label.split(' · ')[0];
            const ev = this.events[i];
            const { now, upcoming } = ev ? nowAndNext(ev) : { now: undefined, upcoming: [] as CalEvent[] };
            const next = now ?? upcoming[0];
            const kind = st.asleep ? 'sleep' : st.presence === 'home' ? 'home' : 'away';
            return html`<button type="button" class="cell ${kind}" style=${vars(i)} aria-haspopup="dialog" @click=${() => this.openDetail(`p${i}`)}>
              <span class="info">
                <span class="line">
                <b class="name">${this.name(p)}</b>
                <span class="meta">
                  <span><svg viewBox="0 0 24 24" class="i"><path d=${PIN}></path></svg>${place}</span>
                  ${bat ? html`<span class=${bat.level <= 20 ? 'low' : ''}><svg viewBox="0 0 24 24" class="i"><path d=${BATTERY}></path></svg><span class="num">${bat.level}%</span>${bat.charging ? '⚡' : ''}</span>` : nothing}
                </span>
                </span>
                ${next ? html`<small class="next"><svg viewBox="0 0 24 24" class="i"><path d=${CAL}></path></svg>${next === now ? 'Now: ' : ''}${next.summary}${next === now ? '' : html` · <span class="num">${whenText(next, false, this.hass)}</span>`}</small>` : nothing}
              </span>
            </button>`;
          })}
        </div>
      </div>
    `;
  }

  /** Who's home, as a chip like the weather on the house. */
  protected override renderHeaderExtras() {
    const sts = this.config.people.map((_, i) => this.statusOf(i));
    const home = sts.filter(s => s.presence === 'home').length;
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
    // History of where they've been (their person entity), or else of their phone; only one that exists
    // (Home Assistant opens nothing for an entity it doesn't have).
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
      /* The canvas sits between the cards' backgrounds and their text. */
      .stage {
        isolation: isolate;
      }
      .deck {
        position: absolute;
        inset: 0;
        container: deck / size;
        pointer-events: none;
      }
      .grid {
        position: absolute;
        inset: 0;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: 1fr;
        gap: 0;
        transition: opacity 0.35s var(--ease) 1.05s;
      }
      .bgs {
        z-index: -1;
      }
      .fgs {
        z-index: 1;
      }
      .deck[data-n='1'] .grid {
        grid-template-columns: 1fr;
      }
      .deck[data-n='3'] .cell:last-child {
        grid-column: span 2;
      }
      @container deck (min-aspect-ratio: 2.3) {
        .deck[data-n='3'] .grid {
          grid-template-columns: repeat(3, 1fr);
        }
        .deck[data-n='4'] .grid {
          grid-template-columns: repeat(4, 1fr);
        }
        .deck[data-n='3'] .cell:last-child {
          grid-column: auto;
        }
      }
      @container deck (max-aspect-ratio: 0.8) {
        .deck[data-n='2'] .grid {
          grid-template-columns: 1fr;
        }
      }
      /* Opened: the cards step back while the person's picture grows to fill the view. */
      /* Inside a room the (faded) cards don't catch taps. */
      .focused .fgs .cell {
        pointer-events: none;
      }
      .focused .grid {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s var(--ease);
      }
      /* The calendar, opened from its chip, over the chips. */
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
      .name .dot {
        display: inline-block;
        width: 9px;
        height: 9px;
        margin: 0 7px 2px 0;
        border-radius: 50%;
        background: var(--hh-ok);
        vertical-align: middle;
      }
      .name .dot.away {
        background: #3ba9d6;
      }
      .name .dot.sleep {
        background: #8f9bd6;
      }
      .cell {
        position: relative;
        border-radius: 0;
        overflow: hidden;
        min-width: 0;
        min-height: 0;
      }
      .bgs .cell {
        background:
          radial-gradient(120% 80% at 50% 18%, rgba(255, 255, 255, 0.55), transparent 60%),
          linear-gradient(180deg, color-mix(in srgb, var(--sky) 88%, var(--hh-glass-strong)), color-mix(in srgb, var(--sky2) 88%, var(--hh-glass-strong)));
      }
      /* The ground at the bottom in layers, like the edge of the diorama: its top, the earth, the base. */
      .ground {
        position: absolute;
        left: -2px;
        right: -2px;
        bottom: -2px;
        height: 24%;
        display: flex;
        flex-direction: column;
      }
      .ground b {
        display: block;
        border-radius: 14px 14px 0 0;
      }
      .ground b:nth-child(1) {
        flex: 1;
        background: linear-gradient(180deg, color-mix(in srgb, var(--top) 85%, #fff), var(--top));
        box-shadow: 0 -6px 18px color-mix(in srgb, var(--top) 40%, transparent);
      }
      .ground b:nth-child(2) {
        height: 18%;
        background: var(--edge);
        border-radius: 0;
      }
      .ground b:nth-child(3) {
        height: 22%;
        background: #4b4440;
        border-radius: 0;
      }
      /* A slow sweep of light across the card, and two motes drifting up. */
      .sheen {
        position: absolute;
        inset: -40%;
        background: linear-gradient(115deg, transparent 42%, rgba(255, 255, 255, 0.35) 50%, transparent 58%);
        transform: translateX(-60%);
      }
      .mote {
        position: absolute;
        left: 18%;
        bottom: 30%;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.9), transparent 70%);
        opacity: 0;
      }
      .mote.m2 {
        left: 78%;
        width: 6px;
        height: 6px;
      }
      @media (prefers-reduced-motion: no-preference) {
        .sheen {
          animation: sweep 9s ease-in-out infinite;
          animation-delay: calc(var(--i) * 1.7s);
        }
        .mote {
          animation: drift 7s ease-in-out infinite;
          animation-delay: calc(var(--i) * 1.3s);
        }
        .mote.m2 {
          animation-delay: calc(var(--i) * 1.3s + 3.2s);
        }
        .cell {
          animation: rise 0.7s var(--spring, ease) both;
          animation-delay: calc(var(--i) * 0.09s);
        }
      }
      @keyframes sweep {
        0%,
        70% {
          transform: translateX(-60%);
        }
        100% {
          transform: translateX(60%);
        }
      }
      @keyframes drift {
        0% {
          opacity: 0;
          transform: translateY(0);
        }
        30% {
          opacity: 0.9;
        }
        100% {
          opacity: 0;
          transform: translateY(-120px);
        }
      }
      @keyframes rise {
        from {
          opacity: 0;
          transform: translateY(18px) scale(0.96);
        }
      }
      /* The text over the portrait. */
      .fgs .cell {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: stretch;
        padding: 12px;
        text-align: left;
        pointer-events: auto;
        color: var(--hh-ink);
        transition: transform 0.35s var(--spring), box-shadow 0.35s;
      }
      .fgs .cell:hover .info,
      .fgs .cell:focus-visible .info {
        background: var(--hh-surface, #fbfaf8);
      }
      .fgs .cell:active {
        transform: scale(0.98);
      }
      .status {
        align-self: flex-start;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 10px 4px 7px;
        border-radius: 999px;
        font-size: 11.5px;
        font-weight: 600;
        background: var(--hh-glass-strong);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
        border: 1px solid var(--hh-stroke);
      }
      .status .i {
        width: 14px;
        height: 14px;
      }
      .home .status .i {
        color: var(--hh-ok);
      }
      .away .status .i {
        color: #3ba9d6;
      }
      .sleep .status .i {
        color: #8f9bd6;
      }
      .info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        align-self: flex-start;
        max-width: 100%;
        padding: 7px 14px 8px;
        border-radius: 16px;
        background: color-mix(in srgb, var(--hh-surface, #fbfaf8) 86%, transparent);
        -webkit-backdrop-filter: blur(14px) saturate(160%);
        backdrop-filter: blur(14px) saturate(160%);
        border: 1px solid var(--hh-stroke);
        box-shadow: var(--hh-shadow);
        min-width: 0;
      }
      .line {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 2px 12px;
      }
      .name {
        font-size: 17px;
        font-weight: 700;
        line-height: 1.1;
      }
      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 12px;
        font-size: 12.5px;
        font-weight: 600;
        color: var(--hh-ink-2);
      }
      .meta > span {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        min-width: 0;
      }
      .meta .i,
      .next .i {
        width: 14px;
        height: 14px;
        flex: none;
        opacity: 0.8;
      }
      .meta .low {
        color: #d9473f;
      }
      .next {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11.5px;
        color: var(--hh-ink-3);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      @container deck (max-width: 520px) {
        .name {
          font-size: 15px;
        }
        .info {
          padding: 8px 10px;
        }
        .meta {
          font-size: 11.5px;
        }
        .next {
          display: none;
        }
        .fgs .cell {
          padding: 8px;
        }
      }
      .sub {
        margin: 14px 0 2px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--hh-ink-3);
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

registerCard('hyggehub-people-3d-card', HyggePeople3dCard, 'HyggeHub People 3D', 'The family as figurines on little dioramas of what they love, with who is home at the top.');
