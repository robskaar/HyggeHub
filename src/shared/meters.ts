import type { HassEntity, HomeAssistant } from '../types';

/*
 * Meters instead of live sensors: the running kWh / m³ totals the Energy dashboard and the usage card
 * use, read from Home Assistant's long-term statistics. Meters such as Målerportal report hours late, so
 * what can be shown is the newest hour with readings, as an average. Shared by the energy cards.
 */

export interface MeterIds {
  /** Electricity bought (kWh). */
  grid?: string;
  /** Electricity sold (kWh). */
  gridExport?: string;
  /** Solar production (kWh), e.g. a production metering point. */
  solar?: string;
  /** Water (m³ or L). */
  water?: string;
}

export interface MeterHour {
  /** The hour the numbers cover. */
  hour: [Date, Date];
  /** Net grid, average kW over the hour: + bought, − sold. */
  grid?: number;
  /** Solar production, average kW. */
  solar?: number;
  /** Home use, average kW: bought + produced − sold. Only when every configured electricity meter has the hour. */
  home?: number;
}

export interface WaterHour {
  hour: [Date, Date];
  /** Litres used in the hour. */
  litres: number;
}

type Row = { start: number | string; end: number | string; change?: number | null };

/** Statistics come in the meter's own unit: to kWh. */
function kwhFactor(e?: HassEntity): number {
  const u = String(e?.attributes.unit_of_measurement ?? 'kWh').toLowerCase();
  return u === 'wh' ? 0.001 : u === 'mwh' ? 1000 : 1;
}

/** Statistics come in the meter's own unit: to litres. */
function litreFactor(e?: HassEntity): number {
  const u = String(e?.attributes.unit_of_measurement ?? 'm³').toLowerCase().replace(/\s/g, '');
  return u === 'l' ? 1 : u === 'gal' ? 3.785 : u === 'ft³' ? 28.317 : 1000;
}

const t = (v: number | string) => new Date(v).getTime();

/** The newest hour of readings from the meters given. Rejects when the statistics can't be read. */
export async function readMeters(hass: HomeAssistant, ids: MeterIds): Promise<{ energy?: MeterHour; water?: WaterHour }> {
  const list = [ids.grid, ids.gridExport, ids.solar, ids.water].filter((x): x is string => !!x);
  if (!list.length) return {};
  const end = new Date();
  const res = await hass.callWS<Record<string, Row[]>>({
    type: 'recorder/statistics_during_period',
    start_time: new Date(end.getTime() - 48 * 36e5).toISOString(),
    end_time: end.toISOString(),
    statistic_ids: list,
    period: 'hour',
    types: ['change'],
  });
  const rows = (id?: string) => (id && res?.[id]) || [];
  // Hours without a reading still have a row, with no change, so "has data" means a change. Bought
  // electricity is never zero for a whole hour, so it marks the newest hour the meter has reported;
  // sold and produced can honestly be zero (at night), so they are read at that same hour.
  const newest = (id?: string) => [...rows(id)].reverse().find(r => (r.change ?? 0) !== 0);
  const at = (id: string | undefined, hour: Row) => {
    const row = rows(id).find(r => t(r.start) === t(hour.start));
    return row ? (row.change ?? 0) * kwhFactor(hass.states[id!]) : undefined;
  };

  const out: { energy?: MeterHour; water?: WaterHour } = {};
  const anchor = newest(ids.grid) ?? newest(ids.gridExport) ?? newest(ids.solar);
  if (anchor) {
    const bought = at(ids.grid, anchor);
    const sold = at(ids.gridExport, anchor);
    const made = at(ids.solar, anchor);
    // Every configured meter has a row for this hour (a missing row would make home use wrong).
    const complete = (!ids.grid || bought !== undefined) && (!ids.gridExport || sold !== undefined) && (!ids.solar || made !== undefined);
    out.energy = {
      hour: [new Date(anchor.start), new Date(anchor.end)],
      // kWh in one hour is the hour's average kW.
      grid: ids.grid || ids.gridExport ? (bought ?? 0) - (sold ?? 0) : undefined,
      solar: ids.solar ? (made ?? 0) : undefined,
      home: ids.grid && complete ? Math.max(0, (bought ?? 0) + (made ?? 0) - (sold ?? 0)) : undefined,
    };
  }
  const w = newest(ids.water);
  if (w) out.water = { hour: [new Date(w.start), new Date(w.end)], litres: (w.change ?? 0) * litreFactor(hass.states[ids.water!]) };
  return out;
}

/** "11–12": the hour a reading covers. */
export const hourSpan = ([from, to]: [Date, Date]) => `${String(from.getHours()).padStart(2, '0')}–${String(to.getHours()).padStart(2, '0')}`;
