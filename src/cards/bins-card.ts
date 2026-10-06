import { css, html, nothing, svg, type PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import { registerCard, HyggeCard } from '../shared/base-card';
import { fetchEvents, type CalEvent } from '../shared/calendar';
import { lang } from '../shared/format';
import { haIcon } from '../shared/icons';
import { base, glass } from '../shared/styles';
import type { CardConfig, HomeAssistant } from '../types';

interface BinType {
  name: string;
  /** Case-insensitive text or regular expression found in the collection event, e.g. "rest|mad". */
  match?: string;
  color?: string;
  /** Any mdi icon, e.g. mdi:bottle-wine-outline. */
  icon?: string;
}

interface ScheduleEntry {
  name: string;
  /** Weekday of collection: mon, tue, wed... */
  day: string;
  /** Every n weeks. Default 1. */
  every_weeks?: number;
  /** Any date this bin was (or will be) collected, "YYYY-MM-DD", to anchor fortnightly and four-weekly rounds. */
  first: string;
  color?: string;
}

export interface BinsCardConfig extends CardConfig {
  title?: string;
  /** A calendar with one event per collection, e.g. from the Affaldshåndtering DK or Waste Collection Schedule integrations. */
  calendar?: string | string[];
  /** Name, keywords and colour for each kind of bin; checked before the built-in Danish and English ones. */
  bins?: BinType[];
  /** Without a calendar: the rounds by hand. */
  schedule?: ScheduleEntry[];
  /** Later collections listed under the next one. Default 3. */
  upcoming?: number;
}

/** One kind of waste found in a collection: its name, colour and icon. */
interface Kind {
  name: string;
  color: string;
  icon: string;
}

/** One physical bin on a collection day, and the kinds of waste it takes. */
interface Pickup {
  day: Date;
  bins: Array<{ name: string; color: string; kinds: Kind[] }>;
}

const DEFAULT_BINS: Required<BinType>[] = [
  { name: 'Restaffald', match: 'rest|residual|general', color: '#6b777d', icon: 'mdi:trash-can-outline' },
  { name: 'Madaffald', match: 'mad|food|bio|organ', color: '#5f8f47', icon: 'mdi:food-apple-outline' },
  { name: 'Papir', match: 'papir|paper', color: '#3e72a8', icon: 'mdi:newspaper-variant-outline' },
  { name: 'Pap', match: '\\bpap\\b|karton|cardboard', color: '#9a7552', icon: 'mdi:package-variant-closed' },
  { name: 'Plast', match: 'plast|mdk|kartoner|plastic', color: '#8a5fb0', icon: 'mdi:bottle-soda-classic-outline' },
  { name: 'Glas', match: 'glas|glass', color: '#3b8d7c', icon: 'mdi:bottle-wine-outline' },
  { name: 'Metal', match: 'metal|dåse|can', color: '#7f8a93', icon: 'mdi:magnet' },
  { name: 'Farligt affald', match: 'farlig|hazard', color: '#b4423f', icon: 'mdi:skull-crossbones-outline' },
  { name: 'Tekstil', match: 'tekstil|textile', color: '#c0793a', icon: 'mdi:tshirt-crew-outline' },
  { name: 'Storskrald', match: 'storskrald|bulky', color: '#5a5a5a', icon: 'mdi:sofa-outline' },
  { name: 'Haveaffald', match: 'have|garden|green', color: '#6f9a3b', icon: 'mdi:leaf' },
];
const FALLBACK = ['#4c7f95', '#a0784a', '#7d6aa8', '#5b8f6e'];
const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const AHEAD_DAYS = 63;

const dayOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const daysFromToday = (d: Date) => Math.round((dayOnly(d).getTime() - dayOnly(new Date()).getTime()) / 864e5);

const test = (pattern: string, text: string) => {
  try {
    return new RegExp(pattern, 'i').test(text);
  } catch {
    return text.toLowerCase().includes(pattern.toLowerCase());
  }
};

/** A little wheelie bin in the bin's colour. */
const binGlyph = (color: string) => svg`<svg class="bin" viewBox="0 0 24 24" aria-hidden="true" style="--c:${color}">
  <path class="lid" d="M4.2 5.6h15.6a1 1 0 0 1 1 1v1.6H3.2V6.6a1 1 0 0 1 1-1zM10 5.6V4.4a.6.6 0 0 1 .6-.6h2.8a.6.6 0 0 1 .6.6v1.2"></path>
  <path class="body" d="M5 8.2h14l-1.3 11.6a1.6 1.6 0 0 1-1.6 1.4H7.9a1.6 1.6 0 0 1-1.6-1.4z"></path>
  <path class="shine" d="M8.2 10.5l.7 8"></path>
  <circle class="wheel" cx="8" cy="21.4" r="1.4"></circle><circle class="wheel" cx="16" cy="21.4" r="1.4"></circle>
</svg>`;

export class HyggeBinsCard extends HyggeCard<BinsCardConfig> {
  @state() private events?: CalEvent[];
  private loadedFor?: string;
  private ticker?: number;

  static getStubConfig(hass: any) {
    const cal = Object.keys(hass?.states ?? {}).find(id => id.startsWith('calendar.') && /affald|waste|garbage|renovation/i.test(id));
    return cal ? { calendar: cal } : { schedule: [{ name: 'Restaffald', day: 'tue', every_weeks: 2, first: new Date().toISOString().slice(0, 10) }] };
  }

  protected override validateConfig(c: BinsCardConfig) {
    if (!c.calendar && !c.schedule?.length) throw new Error('Set a collection `calendar`, or the rounds under `schedule`.');
    for (const s of c.schedule ?? []) {
      if (!WEEKDAYS.includes(String(s.day).slice(0, 3).toLowerCase())) throw new Error(`"${s.name}": day must be a weekday, like tue.`);
      if (isNaN(new Date(`${s.first}T00:00:00`).getTime())) throw new Error(`"${s.name}": first must be a date, like 2026-10-06.`);
    }
  }

  private get calendars(): string[] {
    return this.config.calendar ? ([] as string[]).concat(this.config.calendar) : [];
  }

  protected override watchedEntities() {
    return this.calendars;
  }

  override connectedCallback() {
    super.connectedCallback();
    // Hourly: "tomorrow" becomes "today" with no entity changing. The fetch itself is cached.
    this.ticker = window.setInterval(() => void this.load(false), 60 * 60_000);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.ticker);
  }

  protected override updated(changed: PropertyValues) {
    super.updated(changed);
    const ids = this.calendars;
    if (!this.hass || !ids.length) return;
    const old = changed.get('hass') as HomeAssistant | undefined;
    const changedCal = !!old && ids.some(id => old.states[id] !== this.hass!.states[id]);
    const key = ids.join(',');
    if (key !== this.loadedFor || changedCal) {
      this.loadedFor = key;
      void this.load(changedCal);
    }
  }

  private async load(force: boolean) {
    if (!this.hass || !this.calendars.length) return;
    this.events = await fetchEvents(this.hass, this.calendars, force, AHEAD_DAYS);
  }

  /** The kinds of waste a text names. Unrecognised text becomes its own kind, so nothing is lost. */
  private kindsIn(text: string, fallbackIndex: number): Kind[] {
    const types = [...(this.config.bins ?? []), ...DEFAULT_BINS];
    const found: Kind[] = [];
    for (const t of types) {
      if (found.some(f => f.name === t.name)) continue;
      const builtIn = DEFAULT_BINS.find(d => d.name === t.name);
      if (test(t.match ?? t.name, text))
        found.push({
          name: t.name,
          color: t.color ?? builtIn?.color ?? FALLBACK[found.length % FALLBACK.length],
          icon: t.icon ?? builtIn?.icon ?? 'mdi:trash-can-outline',
        });
    }
    return found.length ? found : [{ name: text.trim() || 'Collection', color: FALLBACK[fallbackIndex % FALLBACK.length], icon: 'mdi:trash-can-outline' }];
  }

  private pickups(): Pickup[] | undefined {
    const byDay = new Map<string, Pickup>();
    const add = (day: Date, bins: Pickup['bins']) => {
      const k = dayKey(day);
      const p = byDay.get(k) ?? { day: dayOnly(day), bins: [] };
      for (const b of bins) if (!p.bins.some(x => x.name === b.name)) p.bins.push(b);
      byDay.set(k, p);
    };
    if (this.calendars.length) {
      if (!this.events) return undefined;
      this.events.forEach((e, i) => {
        if (daysFromToday(e.start) < 0) return;
        const kinds = this.kindsIn(`${e.summary} ${e.description ?? ''}`, i);
        add(e.start, [{ name: e.summary || kinds[0].name, color: kinds[0].color, kinds }]);
      });
    }
    const today = dayOnly(new Date());
    const until = new Date(today.getTime() + AHEAD_DAYS * 864e5);
    (this.config.schedule ?? []).forEach((s, i) => {
      const step = Math.max(1, s.every_weeks ?? 1) * 7 * 864e5;
      const weekday = WEEKDAYS.indexOf(String(s.day).slice(0, 3).toLowerCase());
      let d = new Date(`${s.first}T00:00:00`);
      // Snap the anchor onto the collection weekday, then walk forward round by round.
      while (d.getDay() !== weekday) d = new Date(d.getTime() + 864e5);
      if (d < today) d = new Date(d.getTime() + Math.ceil((today.getTime() - d.getTime()) / step) * step);
      for (; d <= until; d = new Date(d.getTime() + step)) {
        const kinds = this.kindsIn(s.name, i);
        add(d, [{ name: s.name, color: s.color ?? kinds[0].color, kinds }]);
      }
    });
    return [...byDay.values()].sort((a, b) => a.day.getTime() - b.day.getTime());
  }

  private whenLabel(day: Date): { big: string; small: string } {
    const n = daysFromToday(day);
    const date = day.toLocaleDateString(lang(this.hass), { weekday: 'short', day: 'numeric', month: 'short' });
    if (n === 0) return { big: 'Today', small: date };
    if (n === 1) return { big: 'Tomorrow', small: date };
    if (n < 7) return { big: day.toLocaleDateString(lang(this.hass), { weekday: 'long' }), small: `in ${n} days · ${day.toLocaleDateString(lang(this.hass), { day: 'numeric', month: 'short' })}` };
    return { big: date, small: `in ${n} days` };
  }

  protected override render() {
    const pickups = this.pickups();
    const next = pickups?.[0];
    const later = pickups?.slice(1, 1 + (this.config.upcoming ?? 3)) ?? [];
    const n = next ? daysFromToday(next.day) : -1;
    const nudge = n === 1 ? 'Put them out tonight' : n === 0 && new Date().getHours() < 12 ? 'Collected today' : '';

    return html`<ha-card class="glass bins" data-soon=${n >= 0 && n <= 1} @click=${() => this.moreInfo(this.calendars[0])}>
      <div class="head">
        <h3>${this.config.title ?? 'Bins'}</h3>
        ${nudge ? html`<span class="nudge">${nudge}</span>` : nothing}
      </div>
      ${pickups === undefined
        ? html`<p class="quiet">Reading the collection calendar…</p>`
        : !next
          ? html`<p class="quiet">No collections in the next ${Math.round(AHEAD_DAYS / 7)} weeks</p>`
          : html`
              <div class="next">
                <div class="glyphs">${next.bins.map(b => binGlyph(b.color))}</div>
                <div class="when">
                  <b>${this.whenLabel(next.day).big}</b>
                  <small class="num">${this.whenLabel(next.day).small}</small>
                </div>
              </div>
              <div class="kinds">
                ${next.bins.map(
                  b => html`<span class="bin-kinds" role="img" aria-label=${b.name} title=${b.name}>
                    ${b.kinds.map(k => html`<span class="kind" style="--c:${k.color}" title=${k.name}>${haIcon(k.icon)}</span>`)}
                  </span>`,
                )}
              </div>
              ${later.length
                ? html`<ul class="later">
                    ${later.map(
                      p => html`<li>
                        <span class="d num">${this.whenLabel(p.day).big === 'Tomorrow' ? 'Tomorrow' : p.day.toLocaleDateString(lang(this.hass), { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                        <span class="dots">
                          ${p.bins.map(
                            b => html`<span class="bin-kinds small" role="img" aria-label=${b.name} title=${b.name}>
                              ${b.kinds.map(k => html`<span class="kind" style="--c:${k.color}">${haIcon(k.icon)}</span>`)}
                            </span>`,
                          )}
                        </span>
                      </li>`,
                    )}
                  </ul>`
                : nothing}
            `}
    </ha-card>`;
  }

  static override styles = [
    base,
    glass,
    css`
      ha-card.bins {
        cursor: pointer;
      }
      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 12px;
      }
      .head h3 {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
      }
      .nudge {
        font-size: 11.5px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 999px;
        background: var(--hh-warm-soft);
        color: var(--hh-on-warm);
        white-space: nowrap;
      }
      .quiet {
        margin: 0;
        font-size: 13px;
        color: var(--hh-ink-3);
      }
      .next {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .glyphs {
        display: flex;
        align-items: flex-end;
        flex: none;
      }
      .glyphs svg.bin {
        width: 44px;
        height: 44px;
      }
      .glyphs svg.bin + svg.bin {
        margin-left: -12px;
      }
      [data-soon='true'] .glyphs svg.bin {
        animation: hop 2.8s var(--ease) infinite;
      }
      [data-soon='true'] .glyphs svg.bin:nth-child(2) {
        animation-delay: 0.15s;
      }
      [data-soon='true'] .glyphs svg.bin:nth-child(3) {
        animation-delay: 0.3s;
      }
      @keyframes hop {
        0%,
        70%,
        100% {
          transform: none;
        }
        78% {
          transform: translateY(-5px) rotate(-3deg);
        }
        86% {
          transform: translateY(0) rotate(2deg);
        }
      }
      svg.bin .body {
        fill: var(--c);
      }
      svg.bin .lid {
        fill: color-mix(in srgb, var(--c) 70%, #000);
      }
      svg.bin .shine {
        fill: none;
        stroke: rgba(255, 255, 255, 0.35);
        stroke-width: 1.2;
        stroke-linecap: round;
      }
      svg.bin .wheel {
        fill: color-mix(in srgb, var(--c) 45%, #000);
      }
      .when {
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      .when b {
        font-size: 26px;
        font-weight: 300;
        letter-spacing: -0.02em;
        line-height: 1.1;
      }
      .when small {
        font-size: 12px;
        color: var(--hh-ink-3);
      }
      .kinds {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 14px;
      }
      /* One rounded group per physical bin, holding an icon for each kind of waste it takes. */
      .bin-kinds {
        display: inline-flex;
        gap: 4px;
        padding: 4px;
        border-radius: 14px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
      }
      .kind {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        background: var(--c);
        color: #fff;
        --mdc-icon-size: 19px;
      }
      .bin-kinds.small {
        padding: 2px;
        border-radius: 9px;
        gap: 2px;
      }
      .bin-kinds.small .kind {
        width: 22px;
        height: 22px;
        border-radius: 7px;
        --mdc-icon-size: 13px;
      }
      .chip {
        font-size: 12px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 999px;
        background: var(--c);
        color: #fff;
      }
      .later {
        list-style: none;
        margin: 14px 0 0;
        padding: 10px 0 0;
        border-top: 1px solid var(--hh-line);
        display: flex;
        flex-direction: column;
        gap: 7px;
      }
      .later li {
        display: grid;
        grid-template-columns: 92px 1fr;
        gap: 8px;
        align-items: baseline;
        font-size: 12.5px;
      }
      .d {
        color: var(--hh-ink-3);
        font-weight: 600;
        font-size: 12px;
        white-space: nowrap;
      }
      .dots {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 10px;
        min-width: 0;
      }
      .dot-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: var(--hh-ink-2);
        font-weight: 500;
      }
      .dot-chip i {
        width: 8px;
        height: 8px;
        border-radius: 3px;
        background: var(--c);
      }
    `,
  ];
}

registerCard('hyggehub-bins-card', HyggeBinsCard, 'HyggeHub Bins', 'The next bin collection and which bins go out, from a collection calendar or a schedule.');
