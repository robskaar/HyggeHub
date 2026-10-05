import { css, html, nothing } from 'lit';
import { registerCard, HyggeCard } from '../shared/base-card';
import { formatTime, numeric } from '../shared/format';
import { base, glass } from '../shared/styles';
import type { CardConfig } from '../types';

export interface ApplianceCardConfig extends CardConfig {
  name: string;
  /** The machine's status: a sensor ("running", "spin"...) or a binary_sensor / switch. */
  entity: string;
  machine?: 'washer' | 'dryer';
  /** States of `entity` that mean "running". */
  running_states?: string[];
  /** Minutes left, or a timestamp sensor for when it finishes. */
  remaining_entity?: string;
  /** Total programme length in minutes, so the bar can show how far along it is. */
  total_minutes?: number;
  program_entity?: string;
  /** The current phase (wash / rinse / spin) and the phases to draw. */
  phase_entity?: string;
  phases?: string[];
  /** A power sensor and the watts above which the machine counts as running. */
  power_entity?: string;
  power_threshold?: number;
}

const RUNNING = ['on', 'run', 'running', 'wash', 'washing', 'main wash', 'rinse', 'rinsing', 'spin', 'spinning', 'dry', 'drying', 'active', 'in progress'];
const DONE = ['finished', 'end', 'done', 'complete', 'completed'];

export class HyggeApplianceCard extends HyggeCard<ApplianceCardConfig> {
  static getStubConfig() {
    return { name: 'Washing machine', entity: 'sensor.washer_status', remaining_entity: 'sensor.washer_remaining', machine: 'washer' };
  }

  protected override validateConfig(c: ApplianceCardConfig) {
    if (!c.name || !c.entity) throw new Error('Set a `name` and the machine’s status `entity`.');
  }

  protected override watchedEntities() {
    const c = this.config;
    return [c.entity, c.remaining_entity, c.program_entity, c.phase_entity, c.power_entity];
  }

  private remainingMinutes(): number | undefined {
    const s = this.stateOf(this.config.remaining_entity);
    if (!s) return undefined;
    if (s.attributes.device_class === 'timestamp') {
      const t = new Date(s.state).getTime();
      return isNaN(t) ? undefined : Math.max(0, (t - Date.now()) / 6e4);
    }
    const v = numeric(s);
    if (v === undefined) return undefined;
    const unit = String(s.attributes.unit_of_measurement ?? 'min').toLowerCase();
    return unit.startsWith('h') ? v * 60 : unit.startsWith('s') ? v / 60 : v;
  }

  protected override render() {
    const c = this.config;
    const s = this.stateOf(c.entity);
    const state = (s?.state ?? 'unavailable').toLowerCase();
    const power = numeric(this.stateOf(c.power_entity));
    const running = (c.running_states?.map(x => x.toLowerCase()) ?? RUNNING).includes(state) || (power !== undefined && power > (c.power_threshold ?? 5));
    const done = DONE.includes(state);
    const left = running ? this.remainingMinutes() : undefined;
    const finish = left !== undefined ? new Date(Date.now() + left * 6e4) : undefined;
    const program = this.stateOf(c.program_entity)?.state;
    const phases = c.phases ?? (c.machine === 'dryer' ? ['Dry', 'Cool down'] : ['Wash', 'Rinse', 'Spin']);
    const phaseState = this.stateOf(c.phase_entity)?.state.toLowerCase() ?? '';
    let current = phases.findIndex(p => phaseState.includes(p.toLowerCase()));
    const fraction = left !== undefined && c.total_minutes ? Math.min(1, Math.max(0, 1 - left / c.total_minutes)) : undefined;
    if (current < 0 && running && fraction !== undefined) current = Math.min(phases.length - 1, Math.floor(fraction * phases.length));
    const inPhase = fraction !== undefined ? (fraction * phases.length - Math.max(0, current)) * 100 : 50;

    let headline;
    if (running && left !== undefined) headline = html`<span class="num">${Math.max(1, Math.ceil(left))}</span> min left`;
    else if (running) headline = html`Running`;
    else if (done) headline = html`Done`;
    else if (!s) headline = html`Unavailable`;
    else headline = html`Idle`;

    const detail = [program, running && finish ? `done ${formatTime(finish, this.hass)}` : done ? 'Ready to unload' : ''].filter(Boolean).join(' · ');

    return html`
      <ha-card class="glass">
        <div class="card-h"><h3>${c.name}</h3></div>
        <div class="appliance ${running ? '' : 'stopped'} ${c.machine ?? 'washer'}" @click=${() => this.moreInfo(c.entity)}>
          <div class="drum" aria-hidden="true">
            ${c.machine === 'dryer' ? nothing : html`<div class="water"></div>`}
            <div class="clothes"></div>
            <div class="shine"></div>
          </div>
          <div class="info">
            <div class="big">${headline}</div>
            ${detail ? html`<div class="muted detail">${detail}</div>` : nothing}
            ${running || done
              ? html`<div class="steps">
                    ${phases.map((_, i) => {
                      const cls = done || i < current ? 'done' : i === current ? 'now' : '';
                      return html`<span class=${cls} style=${i === current && !done ? `--p:${inPhase}%` : ''}></span>`;
                    })}
                  </div>
                  <div class="labels">${phases.map(p => html`<span>${p}</span>`)}</div>`
              : nothing}
          </div>
        </div>
      </ha-card>
    `;
  }

  static override styles = [
    base,
    glass,
    css`
      .appliance {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 16px;
        align-items: center;
        cursor: pointer;
      }
      .drum {
        width: 88px;
        height: 88px;
        border-radius: 50%;
        position: relative;
        overflow: hidden;
        background: var(--hh-glass-strong);
        border: 5px solid var(--hh-glass-press);
        box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.12);
      }
      .clothes {
        position: absolute;
        inset: 10px;
        border-radius: 50%;
        background: conic-gradient(from 20deg, var(--hh-accent) 0 18%, transparent 0 34%, var(--hh-warm) 0 46%, transparent 0 62%, var(--hh-ok) 0 74%, transparent 0);
        opacity: 0.55;
        animation: hh-spin 1.4s linear infinite;
      }
      .dryer .clothes {
        animation-duration: 3s;
        opacity: 0.45;
      }
      .water {
        position: absolute;
        left: -30%;
        right: -30%;
        top: 56%;
        bottom: -40%;
        border-radius: 42%;
        background: var(--hh-accent-soft);
        animation: slosh 2.6s ease-in-out infinite;
      }
      .shine {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--hh-highlight), transparent 50%);
      }
      @keyframes slosh {
        50% {
          transform: rotate(14deg) translateY(-4px);
        }
      }
      .stopped .clothes,
      .stopped .water {
        animation-play-state: paused;
      }
      .stopped .water {
        opacity: 0.4;
      }
      .info {
        min-width: 0;
      }
      .big {
        font-size: 26px;
        font-weight: 300;
        letter-spacing: -0.02em;
      }
      .detail {
        font-size: 12.5px;
      }
      .steps {
        display: flex;
        gap: 4px;
        margin: 10px 0 6px;
      }
      .steps span {
        flex: 1;
        height: 4px;
        border-radius: 4px;
        background: var(--hh-line);
      }
      .steps span.done {
        background: var(--hh-accent);
      }
      .steps span.now {
        background: linear-gradient(90deg, var(--hh-accent) var(--p, 50%), var(--hh-line) 0);
      }
      .labels {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: var(--hh-ink-3);
      }
    `,
  ];
}

registerCard('hyggehub-appliance-card', HyggeApplianceCard, 'HyggeHub Appliance', 'A washing machine or dryer with a spinning drum, time left and phases.');
