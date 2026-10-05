import { css, html, nothing, svg } from 'lit';
import { registerCard, HyggeCard } from '../shared/base-card';
import { powerKw } from '../shared/format';
import { base, glass } from '../shared/styles';
import type { CardConfig } from '../types';

export interface EnergyCardConfig extends CardConfig {
  title?: string;
  /** Solar production power. */
  solar?: string;
  /** Grid power: positive while importing, negative while exporting. */
  grid: string;
  /** Battery power: positive while discharging, negative while charging. */
  battery?: string;
  battery_soc?: string;
  /** Home consumption. Calculated from the others when left out. */
  home?: string;
  /** Up to three extra tiles under the diagram, e.g. solar today or the spot price. */
  extras?: Array<{ name: string; entity: string }>;
}

type Source = { key: 'solar' | 'battery' | 'grid'; label: string; kw: number; y: number; color: string; reverse: boolean };

const HOME = { x: 270, y: 80 };
const kwText = (v: number) => `${Math.abs(v) < 10 ? Math.abs(v).toFixed(1) : Math.round(Math.abs(v))} kW`;

export class HyggeEnergyCard extends HyggeCard<EnergyCardConfig> {
  static getStubConfig() {
    return { solar: 'sensor.solar_power', grid: 'sensor.grid_power', battery: 'sensor.battery_power', battery_soc: 'sensor.battery_level' };
  }

  protected override validateConfig(c: EnergyCardConfig) {
    if (!c.grid) throw new Error('Set at least the `grid` power sensor.');
  }

  protected override watchedEntities() {
    const c = this.config;
    return [c.solar, c.grid, c.battery, c.battery_soc, c.home, ...(c.extras ?? []).map(e => e.entity)];
  }

  override getCardSize() {
    return 4;
  }

  protected override render() {
    const c = this.config;
    const solar = powerKw(this.stateOf(c.solar)) ?? 0;
    const grid = powerKw(this.stateOf(c.grid)) ?? 0;
    const battery = powerKw(this.stateOf(c.battery)) ?? 0;
    const home = powerKw(this.stateOf(c.home)) ?? Math.max(0, solar + grid + battery);
    const selfShare = home > 0 ? Math.round(Math.max(0, Math.min(1, 1 - Math.max(grid, 0) / home)) * 100) : 100;

    const rows: Source[] = [];
    if (c.solar) rows.push({ key: 'solar', label: 'Solar', kw: solar, y: 0, color: 'var(--hh-warm)', reverse: false });
    if (c.battery) rows.push({ key: 'battery', label: 'Battery', kw: battery, y: 0, color: 'var(--hh-ok)', reverse: battery < 0 });
    rows.push({ key: 'grid', label: grid < 0 ? 'Export' : 'Grid', kw: grid, y: 0, color: 'var(--hh-accent)', reverse: grid < 0 });
    const step = rows.length === 1 ? 0 : 100 / (rows.length - 1);
    rows.forEach((r, i) => (r.y = rows.length === 1 ? 80 : 30 + i * step));

    const soc = this.stateOf(c.battery_soc)?.state;
    const nodeIcon = (key: Source['key']) =>
      key === 'solar'
        ? 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'
        : key === 'battery'
          ? 'M8 4h8a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM10 2h4M9 14h6M9 10h6'
          : 'M12 2L7 22M12 2l5 20M7.8 9h8.4M6 15h12M9 15l6-6M15 15L9 9';

    return html`
      <ha-card class="glass">
        <div class="card-h">
          <h3>${c.title ?? 'Energy now'}</h3>
          <span class="pill"><span class="dot"></span>Self-sufficient ${selfShare}%</span>
        </div>
        <svg viewBox="0 0 320 160" role="img" aria-label=${rows.map(r => `${r.label} ${kwText(r.kw)}`).join(', ') + `, home ${kwText(home)}`}>
          ${rows.map(r => {
            const d = `M60 ${r.y} C150 ${r.y} 170 ${HOME.y} ${HOME.x - 26} ${HOME.y}`;
            const active = Math.abs(r.kw) > 0.02;
            const dur = Math.max(0.6, 3 - Math.abs(r.kw)).toFixed(2);
            return svg`
              <path class="base" d=${d}></path>
              ${active ? svg`<path class="flow ${r.reverse ? 'rev' : ''}" d=${d} style="stroke:${r.color};animation-duration:${dur}s"></path>` : nothing}
              <circle class="node" cx="40" cy=${r.y} r="20"></circle>
              <svg x="30" y=${r.y - 10} width="20" height="20" viewBox="0 0 24 24" class="glyph" style="stroke:${r.color}"><path d=${nodeIcon(r.key)}></path></svg>
              <text class="label" x="68" y=${r.y - 8}>${kwText(r.kw)}</text>
              <text class="sub" x="68" y=${r.y + 16}>${r.key === 'battery' && soc ? `${r.label} ${Math.round(Number(soc))}%` : r.label}</text>
            `;
          })}
          <circle class="node" cx=${HOME.x} cy=${HOME.y} r="26"></circle>
          <svg x=${HOME.x - 12} y=${HOME.y - 12} width="24" height="24" viewBox="0 0 24 24" class="glyph" style="stroke:var(--hh-ink)"><path d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5"></path></svg>
          <text class="label" x=${HOME.x} y=${HOME.y + 46} text-anchor="middle">${kwText(home)}</text>
          <text class="sub" x=${HOME.x} y=${HOME.y + 60} text-anchor="middle">Home</text>
        </svg>
        ${c.extras?.length
          ? html`<div class="extras num" style="grid-template-columns:repeat(${Math.min(3, c.extras.length)},1fr)">
              ${c.extras.slice(0, 3).map(e => html`<button type="button" @click=${() => this.moreInfo(e.entity)}><small>${e.name}</small><b>${this.format(e.entity)}</b></button>`)}
            </div>`
          : nothing}
      </ha-card>
    `;
  }

  static override styles = [
    base,
    glass,
    css`
      svg {
        width: 100%;
        height: auto;
        display: block;
        overflow: visible;
      }
      .pill .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--hh-ok);
      }
      .base {
        fill: none;
        stroke: var(--hh-line);
        stroke-width: 2.2;
      }
      .flow {
        fill: none;
        stroke-width: 2.2;
        stroke-linecap: round;
        stroke-dasharray: 1 11;
        animation: flow 1.2s linear infinite;
      }
      .flow.rev {
        animation-direction: reverse;
      }
      @keyframes flow {
        to {
          stroke-dashoffset: -12;
        }
      }
      .node {
        fill: var(--hh-glass-strong);
        stroke: var(--hh-stroke);
      }
      .glyph {
        fill: none;
        stroke-width: 1.6;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .label {
        fill: var(--hh-ink);
        font: 600 13px var(--hh-font);
      }
      .sub {
        fill: var(--hh-ink-3);
        font: 400 11px var(--hh-font);
      }
      .extras {
        display: grid;
        gap: 8px;
        margin-top: 10px;
      }
      .extras button {
        padding: 10px;
        border-radius: 14px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        text-align: left;
        min-width: 0;
      }
      .extras small {
        display: block;
        font-size: 11px;
        color: var(--hh-ink-3);
      }
      .extras b {
        font-size: 15px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
      }
    `,
  ];
}

registerCard('hyggehub-energy-card', HyggeEnergyCard, 'HyggeHub Energy', 'Live power flowing between solar, battery, grid and the home.');
