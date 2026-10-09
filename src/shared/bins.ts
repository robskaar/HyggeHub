import { svg } from 'lit';

/*
 * Waste collection from a hand-written schedule: each round has a weekday, how often it comes and one
 * date it was (or will be) collected. Shared by the bins card and the 3D energy card.
 */

export interface BinType {
  name: string;
  /** Case-insensitive text or regular expression found in a round's name, e.g. "rest|mad". */
  match?: string;
  color?: string;
  /** Any mdi icon, e.g. mdi:bottle-wine-outline. */
  icon?: string;
}

export interface ScheduleEntry {
  /** The bin, e.g. "Rest" or "Papir/Pap". Its words decide the waste icons. */
  name: string;
  /** Weekday of collection: mon, tue, wed... */
  day: string;
  /** Every n weeks. Default 1. */
  every_weeks?: number;
  /** Any date this bin was (or will be) collected, "YYYY-MM-DD", to anchor fortnightly and four-weekly rounds. */
  first: string;
  color?: string;
}

/** The collection rounds: the same keys in the bins card and the 3D card's `bins:`. */
export interface BinsSource {
  /** One entry per bin. */
  schedule?: ScheduleEntry[];
  /** Name, keywords, colour and icon for each kind of waste; checked before the built-in Danish and English ones. */
  bins?: BinType[];
}

/** One kind of waste in a bin: its name, colour and icon. */
export interface Kind {
  name: string;
  color: string;
  icon: string;
}

/** One collection day and the bins going out. */
export interface Pickup {
  day: Date;
  bins: Array<{ name: string; color: string; kinds: Kind[] }>;
}

const DEFAULT_BINS: Required<BinType>[] = [
  { name: 'Restaffald', match: 'rest|residual|general', color: '#6b777d', icon: 'mdi:trash-can-outline' },
  // "Mad" on its own, not inside "madkarton" or "mad- og drikkekartoner" (those go with plastic).
  { name: 'Madaffald', match: 'madaffald|\\bmad\\b(?![\\s-]*(&|og)\\s*drikke)|food|bio|organ', color: '#5f8f47', icon: 'mdi:food-apple-outline' },
  // Pap before Papir: a shared paper compartment ("Papir/Pap") is shown with the cardboard icon.
  { name: 'Pap', match: '\\bpap\\b|cardboard', color: '#9a7552', icon: 'mdi:package-variant-closed' },
  { name: 'Papir', match: 'papir|paper', color: '#3e72a8', icon: 'mdi:newspaper-variant-outline' },
  { name: 'Plast', match: 'plast|mdk|kartoner|plastic', color: '#8a5fb0', icon: 'mdi:bottle-soda-classic-outline' },
  { name: 'Glas', match: 'glas|glass', color: '#3b8d7c', icon: 'mdi:bottle-wine-outline' },
  { name: 'Metal', match: 'metal|dåse|\\bcans?\\b', color: '#7f8a93', icon: 'mdi:magnet' },
  { name: 'Farligt affald', match: 'farlig|hazard', color: '#b4423f', icon: 'mdi:skull-crossbones-outline' },
  { name: 'Tekstil', match: 'tekstil|textile', color: '#c0793a', icon: 'mdi:tshirt-crew-outline' },
  { name: 'Storskrald', match: 'storskrald|bulky', color: '#5a5a5a', icon: 'mdi:sofa-outline' },
  { name: 'Haveaffald', match: 'have|garden|green', color: '#6f9a3b', icon: 'mdi:leaf' },
];
const FALLBACK = ['#4c7f95', '#a0784a', '#7d6aa8', '#5b8f6e'];
export const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
/** How far ahead collections are worked out. */
export const AHEAD_DAYS = 63;

export const dayOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
/** Calendar days later, at local midnight, whatever daylight saving does in between. */
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
export const daysFromToday = (d: Date) => Math.round((dayOnly(d).getTime() - dayOnly(new Date()).getTime()) / 864e5);

const test = (pattern: string, text: string) => {
  try {
    return new RegExp(pattern, 'i').test(text);
  } catch {
    return text.toLowerCase().includes(pattern.toLowerCase());
  }
};

/** Throws a plain explanation Home Assistant shows in place of the card. */
export function validateBins(src: BinsSource): void {
  if (!src.schedule?.length) throw new Error('Set the collection rounds under `schedule`: name, day, every_weeks and first.');
  for (const s of src.schedule) {
    if (!s.name) throw new Error('Every round in `schedule` needs a `name`.');
    if (!WEEKDAYS.includes(String(s.day).slice(0, 3).toLowerCase())) throw new Error(`"${s.name}": day must be a weekday, like tue.`);
    if (isNaN(new Date(`${s.first}T00:00:00`).getTime())) throw new Error(`"${s.name}": first must be a date, like 2026-10-06.`);
  }
}

/** The kinds of waste a name mentions. An unrecognised name becomes its own kind, so nothing is lost. */
export function kindsIn(src: BinsSource, text: string, fallbackIndex = 0): Kind[] {
  const types = [...(src.bins ?? []), ...DEFAULT_BINS];
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

/**
 * A two-compartment bin's compartments, from its name: "Papir/Pap og Glas" is Papir/Pap in one and Glas in
 * the other ("og", "and", "&", "+" or "|" separate them). A name without a separator is one compartment.
 */
export const compartments = (name: string): string[] => name.split(/\s+(?:og|and|&|\+)\s+|\s*\|\s*/i).filter(Boolean);

/** Upcoming collections, soonest first. Rounds on the same day come out together, one bin each. */
export function pickups(src: BinsSource): Pickup[] {
  const byDay = new Map<string, Pickup>();
  const today = dayOnly(new Date());
  const until = new Date(today.getTime() + AHEAD_DAYS * 864e5);
  (src.schedule ?? []).forEach((s, i) => {
    const weekday = WEEKDAYS.indexOf(String(s.day).slice(0, 3).toLowerCase());
    // One icon per compartment: "Papir/Pap og Glas" is two compartments, so two icons, each the first
    // kind its part names. A name without "og" is one compartment and one icon.
    const kinds = compartments(s.name).map(part => kindsIn(src, part, i)[0]);
    let d = new Date(`${s.first}T00:00:00`);
    // Snap the anchor onto the collection weekday, then walk forward round by round.
    while (d.getDay() !== weekday) d = addDays(d, 1);
    // Count in calendar days, not 24-hour steps: across a daylight-saving change a 24-hour step lands
    // at 23:00 the day before, and the round would show a day early.
    const stepDays = Math.max(1, s.every_weeks ?? 1) * 7;
    if (d < today) d = addDays(d, Math.ceil(Math.round((today.getTime() - d.getTime()) / 864e5) / stepDays) * stepDays);
    for (; d <= until; d = addDays(d, stepDays)) {
      const k = dayKey(d);
      const p = byDay.get(k) ?? { day: d, bins: [] };
      if (!p.bins.some(b => b.name === s.name)) p.bins.push({ name: s.name, color: s.color ?? kinds[0].color, kinds });
      byDay.set(k, p);
    }
  });
  return [...byDay.values()].sort((a, b) => a.day.getTime() - b.day.getTime());
}


/** A little wheelie bin in the bin's colour. */
export const binGlyph = (color: string) => svg`<svg class="bin" viewBox="0 0 24 24" aria-hidden="true" style="--c:${color}">
  <path class="lid" d="M4.2 5.6h15.6a1 1 0 0 1 1 1v1.6H3.2V6.6a1 1 0 0 1 1-1zM10 5.6V4.4a.6.6 0 0 1 .6-.6h2.8a.6.6 0 0 1 .6.6v1.2"></path>
  <path class="body" d="M5 8.2h14l-1.3 11.6a1.6 1.6 0 0 1-1.6 1.4H7.9a1.6 1.6 0 0 1-1.6-1.4z"></path>
  <path class="shine" d="M8.2 10.5l.7 8"></path>
  <circle class="wheel" cx="8" cy="21.4" r="1.4"></circle><circle class="wheel" cx="16" cy="21.4" r="1.4"></circle>
</svg>`;
