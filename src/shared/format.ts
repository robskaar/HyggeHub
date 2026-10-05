import type { HassEntity, HomeAssistant } from '../types';

export const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');

export const lang = (hass?: HomeAssistant) => hass?.locale?.language ?? hass?.language ?? navigator.language;

export function formatTime(d: Date, hass?: HomeAssistant): string {
  return d.toLocaleTimeString(lang(hass), { hour: '2-digit', minute: '2-digit' });
}

export function formatDay(d: Date, hass?: HomeAssistant): string {
  return d.toLocaleDateString(lang(hass), { weekday: 'short', day: 'numeric', month: 'short' });
}

/** "now", "4 min", "2 h", "3 d" — the compact age used on notification cards. */
export function relativeAge(iso: string | undefined): string {
  if (!iso) return '';
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'now';
  if (s < 3600) return `${Math.floor(s / 60)} min`;
  if (s < 86400) return `${Math.floor(s / 3600)} h`;
  return `${Math.floor(s / 86400)} d`;
}

/** "12 min ago", "in 2 h 30 min": for timestamp sensors such as a last feed or the next pickup. */
export function relativeTime(d: Date): string {
  const s = (d.getTime() - Date.now()) / 1000;
  const a = Math.abs(s);
  if (a < 60) return s < 0 ? 'just now' : 'in a moment';
  let t: string;
  if (a < 3600) t = `${Math.round(a / 60)} min`;
  else if (a < 86400) {
    const h = Math.floor(a / 3600);
    const m = Math.round((a % 3600) / 60);
    t = m ? `${h} h ${m} min` : `${h} h`;
  } else t = `${Math.round(a / 86400)} d`;
  return s < 0 ? `${t} ago` : `in ${t}`;
}

/** Parses Home Assistant's "H:MM:SS" duration strings (timer attributes). */
export function durationSeconds(value: unknown): number {
  if (typeof value !== 'string') return 0;
  const parts = value.split(':').map(Number);
  if (parts.some(isNaN)) return 0;
  return parts.reduce((acc, p) => acc * 60 + p, 0);
}

export function numeric(entity?: HassEntity): number | undefined {
  if (!entity) return undefined;
  const v = parseFloat(entity.state);
  return isNaN(v) ? undefined : v;
}

/** Power in kW regardless of whether the sensor reports W or kW. */
export function powerKw(entity?: HassEntity): number | undefined {
  const v = numeric(entity);
  if (v === undefined) return undefined;
  const unit = String(entity!.attributes.unit_of_measurement ?? 'W').toLowerCase();
  return unit === 'kw' ? v : unit === 'mw' ? v * 1000 : v / 1000;
}

export function formatState(hass: HomeAssistant | undefined, entity: HassEntity | undefined): string {
  if (!entity) return 'Unavailable';
  if (hass?.formatEntityState) return hass.formatEntityState(entity);
  const unit = entity.attributes.unit_of_measurement;
  return unit ? `${entity.state} ${unit}` : entity.state;
}

export function friendlyName(entity: HassEntity | undefined, fallback = ''): string {
  return (entity?.attributes.friendly_name as string | undefined) ?? fallback;
}

/** Splits a long remaining time into the parts the countdown cards show. */
export function splitDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return { days: Math.floor(total / 86400), hours: Math.floor(total / 3600) % 24, minutes: Math.floor(total / 60) % 60, seconds: total % 60, total };
}
