import { css, html, nothing } from 'lit';
import { registerCard, HyggeCard } from '../shared/base-card';
import { AHEAD_DAYS, binGlyph, daysFromToday, pickups, validateBins, type BinsSource } from '../shared/bins';
import { lang } from '../shared/format';
import { haIcon } from '../shared/icons';
import { base, glass } from '../shared/styles';
import type { CardConfig } from '../types';

export interface BinsCardConfig extends CardConfig, BinsSource {
  title?: string;
  /** Later collections listed under the next one. Default 3. */
  upcoming?: number;
}

export class HyggeBinsCard extends HyggeCard<BinsCardConfig> {
  private ticker?: number;

  static getStubConfig() {
    const first = new Date().toISOString().slice(0, 10);
    return {
      schedule: [
        { name: 'Rest', day: 'tue', every_weeks: 1, first },
        { name: 'Mad', day: 'tue', every_weeks: 1, first },
        { name: 'Papir/Pap', day: 'wed', every_weeks: 4, first },
      ],
    };
  }

  protected override validateConfig(c: BinsCardConfig) {
    validateBins(c);
  }

  override connectedCallback() {
    super.connectedCallback();
    // Hourly: "tomorrow" becomes "today" with no entity changing.
    this.ticker = window.setInterval(() => this.requestUpdate(), 60 * 60_000);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.ticker);
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
    const all = pickups(this.config);
    const next = all[0];
    const later = all.slice(1, 1 + (this.config.upcoming ?? 3));
    const n = next ? daysFromToday(next.day) : -1;
    const nudge = n === 1 ? 'Put them out tonight' : n === 0 && new Date().getHours() < 12 ? 'Collected today' : '';

    return html`<ha-card class="glass bins" data-soon=${n >= 0 && n <= 1}>
      <div class="head">
        <h3>${this.config.title ?? 'Bins'}</h3>
        ${nudge ? html`<span class="nudge">${nudge}</span>` : nothing}
      </div>
      ${!next
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

registerCard('hyggehub-bins-card', HyggeBinsCard, 'HyggeHub Bins', 'The next bin collection and which bins go out, from your collection schedule.');
