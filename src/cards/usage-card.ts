import { css, html, nothing, type PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import { registerCard, HyggeCard } from '../shared/base-card';
import { haIcon } from '../shared/icons';
import { formatTime, friendlyName, lang } from '../shared/format';
import { base, glass } from '../shared/styles';
import type { CardConfig } from '../types';

type Kind = 'import' | 'export' | 'water' | 'gas' | 'heat' | 'other';
type Period = 'day' | 'week' | 'month';

interface Meter {
  /** A meter with long-term statistics: the running kWh / m³ total the Energy dashboard uses. */
  entity: string;
  name?: string;
  /** What it measures; picks the icon, the colour and how the net line is worked out. */
  kind?: Kind;
  icon?: string;
  color?: string;
}

export interface UsageCardConfig extends CardConfig {
  title?: string;
  meters: Meter[];
  /** The period shown first. Default day. */
  period?: Period;
}

interface Series {
  total?: number;
  buckets: Array<{ start: Date; change: number }>;
  unit: string;
  /** End of the newest bucket that has a reading: meters such as Målerportal report hours late. */
  upTo?: Date;
}

const KIND: Record<Kind, { icon: string; color: string; label: string }> = {
  import: { icon: 'mdi:transmission-tower-import', color: 'var(--hh-accent)', label: 'Electricity in' },
  export: { icon: 'mdi:transmission-tower-export', color: 'var(--hh-ok)', label: 'Electricity out' },
  water: { icon: 'mdi:water-outline', color: '#4a9ad6', label: 'Water' },
  gas: { icon: 'mdi:fire', color: 'var(--hh-warm)', label: 'Gas' },
  heat: { icon: 'mdi:radiator', color: 'var(--hh-crit)', label: 'Heating' },
  other: { icon: 'mdi:gauge', color: 'var(--hh-ink-2)', label: 'Meter' },
};

const guessKind = (id: string, unit: string): Kind => {
  if (/m³|m3|l$|gal/i.test(unit) || /vand|water/i.test(id)) return 'water';
  if (/eksport|export|return|feed/i.test(id)) return 'export';
  if (/gas/i.test(id)) return 'gas';
  if (/varme|heat/i.test(id)) return 'heat';
  return /kwh|wh/i.test(unit) ? 'import' : 'other';
};

/** Water in litres while it's small, m³ beyond; energy with a sensible number of decimals. */
function amount(v: number | undefined, unit: string): { value: string; unit: string } {
  if (v === undefined) return { value: '–', unit };
  if (/m³|m3/.test(unit) && Math.abs(v) < 10) return { value: String(Math.round(v * 1000)), unit: 'L' };
  const digits = Math.abs(v) < 10 ? 2 : Math.abs(v) < 100 ? 1 : 0;
  return { value: v.toFixed(digits), unit };
}

function periodStart(p: Period): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (p === 'week') d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday
  if (p === 'month') d.setDate(1);
  return d;
}

export class HyggeUsageCard extends HyggeCard<UsageCardConfig> {
  @state() private period: Period = 'day';
  @state() private data: Record<string, Series> = {};
  @state() private error = '';
  /** Day view only: today had no readings yet, so the card is showing yesterday. */
  @state() private yesterday = false;
  private windowStart?: Date;
  private loadedKey?: string;
  private ticker?: number;

  static getStubConfig(hass: any) {
    const meters = Object.entries(hass?.states ?? {})
      .filter(([id, s]: [string, any]) => id.startsWith('sensor.') && ['energy', 'water', 'gas'].includes(s.attributes?.device_class))
      .slice(0, 3)
      .map(([entity]) => ({ entity }));
    return { meters };
  }

  protected override validateConfig(c: UsageCardConfig) {
    if (!Array.isArray(c.meters) || !c.meters.length) throw new Error('List your meters under `meters`.');
    if (c.period) this.period = c.period;
  }

  protected override watchedEntities() {
    return this.config.meters.map(m => m.entity);
  }

  override getCardSize() {
    return 3 + this.config.meters.length;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.ticker = window.setInterval(() => void this.load(), 5 * 60_000);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.ticker);
  }

  protected override updated(changed: PropertyValues) {
    super.updated(changed);
    const key = `${this.period}|${this.config.meters.map(m => m.entity).join(',')}`;
    if (this.hass && key !== this.loadedKey) {
      this.loadedKey = key;
      void this.load();
    }
  }

  /** Reads the hourly (or daily) changes from Home Assistant's long-term statistics. */
  private async load() {
    const hass = this.hass;
    if (!hass) return;
    const start = periodStart(this.period);
    try {
      let next = await this.fetch(start, new Date());
      let yesterday = false;
      // Meters like Målerportal deliver a day's readings overnight, so "today" is usually empty until
      // tomorrow. Rather than show nothing, show yesterday and say so.
      if (this.period === 'day' && !Object.values(next).some(s => s.upTo)) {
        const y = new Date(start.getTime() - 864e5);
        next = await this.fetch(y, start);
        yesterday = true;
        this.windowStart = y;
      } else this.windowStart = start;
      this.yesterday = yesterday;
      this.data = next;
      this.error = '';
    } catch (err: any) {
      this.error = err?.message ?? 'Could not read the meter statistics';
    }
  }

  private async fetch(start: Date, end: Date): Promise<Record<string, Series>> {
    const ids = this.config.meters.map(m => m.entity);
    const res = await this.hass!.callWS<Record<string, Array<{ start: number | string; end: number | string; change?: number | null }>>>({
      type: 'recorder/statistics_during_period',
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      statistic_ids: ids,
      period: this.period === 'day' ? 'hour' : 'day',
      types: ['change'],
    });
    const next: Record<string, Series> = {};
    for (const id of ids) {
      const rows = res?.[id] ?? [];
      const buckets = rows.map(r => ({ start: new Date(r.start), change: r.change ?? 0 }));
      const withData = rows.filter(r => (r.change ?? 0) !== 0);
      const last = withData[withData.length - 1];
      next[id] = {
        total: rows.length ? buckets.reduce((a, b) => a + b.change, 0) : undefined,
        buckets,
        unit: String(this.stateOf(id)?.attributes.unit_of_measurement ?? ''),
        upTo: last ? new Date(last.end) : undefined,
      };
    }
    return next;
  }

  private setPeriod(p: Period) {
    if (p === this.period) return;
    this.period = p;
  }

  /** The bars: one per hour (day view) or per day (week and month), always filling the period. */
  private bars(series: Series, color: string) {
    const start = this.windowStart ?? periodStart(this.period);
    const slots = this.period === 'day' ? 24 : this.period === 'week' ? 7 : new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    const step = this.period === 'day' ? 36e5 : 864e5;
    const values = new Array<number>(slots).fill(0);
    for (const b of series.buckets) {
      const i = Math.floor((b.start.getTime() - start.getTime()) / step);
      if (i >= 0 && i < slots) values[i] += Math.max(0, b.change);
    }
    const max = Math.max(...values, 0.0001);
    const nowIndex = this.yesterday ? slots : Math.floor((Date.now() - start.getTime()) / step);
    return html`<div class="bars" style="--c:${color};grid-template-columns:repeat(${slots},1fr)" aria-hidden="true">
      ${values.map((v, i) => html`<i class=${i > nowIndex ? 'future' : ''} style="--h:${Math.max(v > 0 ? 0.06 : 0.02, v / max)}"></i>`)}
    </div>`;
  }

  private axis() {
    if (this.period === 'day') return html`<div class="axis"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>`;
    if (this.period === 'week') {
      const start = periodStart('week');
      return html`<div class="axis">
        ${Array.from({ length: 7 }, (_, i) => new Date(start.getTime() + i * 864e5).toLocaleDateString(lang(this.hass), { weekday: 'narrow' })).map(
          d => html`<span>${d}</span>`,
        )}
      </div>`;
    }
    return html`<div class="axis"><span>1</span><span>10</span><span>20</span><span>${new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()}</span></div>`;
  }

  protected override render() {
    const meters = this.config.meters.map(m => {
      const s = this.data[m.entity];
      const unit = s?.unit ?? String(this.stateOf(m.entity)?.attributes.unit_of_measurement ?? '');
      const kind = m.kind ?? guessKind(m.entity, unit);
      return { ...m, kind, series: s, unit, look: KIND[kind] };
    });
    const imp = meters.filter(m => m.kind === 'import').reduce((a, m) => a + (m.series?.total ?? 0), 0);
    const exp = meters.filter(m => m.kind === 'export').reduce((a, m) => a + (m.series?.total ?? 0), 0);
    const hasBoth = meters.some(m => m.kind === 'import') && meters.some(m => m.kind === 'export');
    const net = imp - exp;
    const upTo = meters
      .map(m => m.series?.upTo)
      .filter((d): d is Date => !!d)
      .sort((a, b) => b.getTime() - a.getTime())[0];
    const periodWord = this.period === 'day' ? (this.yesterday ? 'yesterday' : 'today') : this.period === 'week' ? 'this week' : 'this month';

    return html`<ha-card class="glass usage">
      <div class="head">
        <h3>${this.config.title ?? 'Usage'}</h3>
        <div class="seg" role="group" aria-label="Period">
          ${(['day', 'week', 'month'] as Period[]).map(
            p => html`<button type="button" aria-pressed=${p === this.period} @click=${() => this.setPeriod(p)}>
              ${p === 'day' ? 'Today' : p === 'week' ? 'Week' : 'Month'}
            </button>`,
          )}
        </div>
      </div>
      ${this.error ? html`<p class="quiet">${this.error}</p>` : nothing}
      ${this.period === 'day' && this.yesterday ? html`<p class="note">Showing yesterday. Today's readings arrive overnight.</p>` : nothing}
      <div class="meters">
        ${meters.map(m => {
          const a = amount(m.series?.total, m.unit);
          return html`<button class="meter" type="button" style="--c:${m.color ?? m.look.color}" @click=${() => this.moreInfo(m.entity)}>
            <span class="mi">${haIcon(m.icon ?? m.look.icon)}</span>
            <span class="mt">
              <small>${m.name ?? m.look.label ?? friendlyName(this.stateOf(m.entity), m.entity)}</small>
              <b class="num">${a.value}<em>${a.unit}</em></b>
            </span>
            ${m.series ? this.bars(m.series, m.color ?? m.look.color) : html`<span class="bars-placeholder"></span>`}
          </button>`;
        })}
      </div>
      ${meters.length ? html`<div class="axis-row"><span></span><span></span>${this.axis()}</div>` : nothing}
      <div class="foot">
        ${hasBoth && (imp || exp)
          ? html`<span class="net ${net < 0 ? 'out' : ''}">
              ${net < 0 ? `Net exported ${amount(-net, 'kWh').value} kWh ${periodWord}` : `Net use ${amount(net, 'kWh').value} kWh ${periodWord}`}
            </span>`
          : html`<span></span>`}
        <span class="faint">${upTo ? `Readings up to ${formatTime(upTo, this.hass)}` : Object.keys(this.data).length ? `No readings ${periodWord} yet` : 'Reading the meters…'}</span>
      </div>
    </ha-card>`;
  }

  static override styles = [
    base,
    glass,
    css`
      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 12px;
        flex-wrap: wrap;
      }
      .head h3 {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
      }
      .seg {
        display: inline-flex;
        padding: 3px;
        border-radius: 11px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
      }
      .seg button {
        padding: 5px 10px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        color: var(--hh-ink-2);
        transition: background 0.2s, color 0.2s;
      }
      .seg button[aria-pressed='true'] {
        background: var(--hh-accent);
        color: var(--hh-on-accent);
      }
      .quiet {
        margin: 0 0 10px;
        font-size: 12.5px;
        color: var(--hh-crit);
      }
      .meters {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .meter {
        display: grid;
        grid-template-columns: 38px minmax(0, 1fr) minmax(0, 1.15fr);
        gap: 12px;
        align-items: center;
        padding: 10px 12px;
        border-radius: 16px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        text-align: left;
        min-width: 0;
      }
      .mi {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: color-mix(in srgb, var(--c) 16%, transparent);
        color: var(--c);
      }
      .mt {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .mt small {
        font-size: 11.5px;
        color: var(--hh-ink-3);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mt b {
        font-size: 20px;
        font-weight: 300;
        letter-spacing: -0.02em;
        white-space: nowrap;
      }
      .mt em {
        font-style: normal;
        font-size: 12px;
        font-weight: 500;
        color: var(--hh-ink-3);
        margin-left: 3px;
      }
      .bars {
        display: grid;
        gap: 2px;
        align-items: end;
        height: 34px;
        min-width: 0;
      }
      .bars i {
        display: block;
        height: 100%;
        border-radius: 2px;
        background: var(--c);
        opacity: 0.85;
        transform-origin: 50% 100%;
        transform: scaleY(var(--h));
        transition: transform 0.6s var(--ease);
      }
      .bars i.future {
        opacity: 0.18;
      }
      .axis-row {
        display: grid;
        grid-template-columns: 38px minmax(0, 1fr) minmax(0, 1.15fr);
        gap: 12px;
        padding: 4px 13px 0;
      }
      .note {
        margin: -4px 0 10px;
        font-size: 12px;
        color: var(--hh-ink-3);
      }
      .axis {
        display: flex;
        justify-content: space-between;
        min-width: 0;
        font-size: 10.5px;
        color: var(--hh-ink-3);
      }
      .foot {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 12px;
        font-size: 12px;
      }
      .net {
        font-weight: 600;
        color: var(--hh-ink-2);
      }
      .net.out {
        color: var(--hh-ok);
      }
      @media (max-width: 420px) {
        .axis {
          display: none;
        }
      }
    `,
  ];
}

registerCard('hyggehub-usage-card', HyggeUsageCard, 'HyggeHub Usage', 'Electricity in and out, water and gas for today, this week or this month, from your meters.');
