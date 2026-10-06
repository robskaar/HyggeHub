import type { HomeAssistant } from '../types';

/*
 * Upcoming events from Home Assistant calendar entities (Google Calendar, Local Calendar, CalDAV...).
 * Fetched through the `calendar.get_events` action, and cached per set of calendars so several cards
 * reading the same calendars make one request between them.
 */

export interface CalEvent {
  summary: string;
  start: Date;
  end: Date;
  allDay: boolean;
  location?: string;
  description?: string;
}

interface Raw {
  summary: string;
  start: string;
  end: string;
  location?: string | null;
  description?: string | null;
}

const TTL = 5 * 60_000;
const AHEAD_DAYS = 7;
const cache = new Map<string, { at: number; events: Promise<CalEvent[]> }>();

const parse = (v: string): { d: Date; allDay: boolean } =>
  v.length === 10 ? { d: new Date(`${v}T00:00:00`), allDay: true } : { d: new Date(v), allDay: false };

/** Events from now-ish through the next week, oldest first. Errors resolve to an empty list. */
export function fetchEvents(hass: HomeAssistant, calendars: string[], force = false): Promise<CalEvent[]> {
  const key = [...calendars].sort().join(',');
  const hit = cache.get(key);
  // A forced refresh within half a minute of the last one reuses it: several cards see the same change.
  if (hit && Date.now() - hit.at < (force ? 30_000 : TTL)) return hit.events;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start.getTime() + AHEAD_DAYS * 864e5);
  const events = hass
    .callWS<{ response: Record<string, { events: Raw[] }> }>({
      type: 'call_service',
      domain: 'calendar',
      service: 'get_events',
      target: { entity_id: calendars },
      service_data: { start_date_time: start.toISOString(), end_date_time: end.toISOString() },
      return_response: true,
    })
    .then(res =>
      Object.values(res?.response ?? {})
        .flatMap(c => c.events ?? [])
        .map(e => {
          const s = parse(e.start);
          return { summary: e.summary ?? '', start: s.d, end: parse(e.end).d, allDay: s.allDay, location: e.location || undefined, description: e.description || undefined };
        })
        .sort((a, b) => a.start.getTime() - b.start.getTime()),
    )
    .catch(err => {
      console.warn('HyggeHub: could not read calendars', calendars, err);
      cache.delete(key);
      return [] as CalEvent[];
    });
  cache.set(key, { at: Date.now(), events });
  return events;
}

/** Keeps the events that belong to one person, when several people share a calendar. */
export function forPerson(events: CalEvent[], match?: string): CalEvent[] {
  if (!match) return events;
  const words = match
    .split(',')
    .map(w => w.trim().toLowerCase())
    .filter(Boolean);
  return events.filter(e => {
    const hay = `${e.summary} ${e.description ?? ''}`.toLowerCase();
    return words.some(w => hay.includes(w));
  });
}

export function nowAndNext(events: CalEvent[], at = new Date()) {
  const t = at.getTime();
  const current = events.filter(e => e.start.getTime() <= t && e.end.getTime() > t);
  // A timed event happening now beats an all-day one (school beats "Autumn holiday").
  current.sort((a, b) => Number(a.allDay) - Number(b.allDay));
  const upcoming = events.filter(e => e.start.getTime() > t);
  return { now: current[0], upcoming };
}

/** "Lily's house" out of "Lily's house, 12 Oak Avenue". */
export const shortPlace = (location?: string) => location?.split(/,|\n/)[0].trim();
