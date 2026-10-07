import { css, html, nothing, svg, type PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import { registerCard, HyggeCard } from '../shared/base-card';
import { haIcon, icon } from '../shared/icons';
import { friendlyName, numeric } from '../shared/format';
import { base, glass } from '../shared/styles';
import type { CardConfig, HassEntity } from '../types';

type Kind = 'light' | 'fan' | 'cover' | 'toggle' | 'info';

interface RoomEntityConfig {
  entity: string;
  name?: string;
  icon?: string;
  /** Override the detected behaviour. `light` entities are what the room icon switches. */
  kind?: Kind;
}

export interface RoomCardConfig extends CardConfig {
  name: string;
  icon?: string;
  temperature?: string;
  humidity?: string;
  entities?: Array<string | RoomEntityConfig>;
  /** A dimmable light whose brightness the slider controls. */
  dimmer?: string;
}

const TOGGLEABLE = new Set(['light', 'switch', 'input_boolean', 'fan', 'cover']);

const fanIcon = svg`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="1.6"></circle><path d="M12 10.4c-.6-4.2.6-6.9 3-6.9 2.6 0 3.5 3.2-1.6 7.7M13.4 13.1c3.4 2.6 4.6 5.3 3.4 7.4-1.3 2.2-4.5 1.4-5.8-5.3M10.6 12.6c-3.9 1.6-6.9 1.3-8-.8-1.3-2.2 1-4.6 7.5-2.4"></path></svg>`;
const blindsIcon = svg`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3.5h18M12 3.5v16"></path><g class="slats"><path d="M5 4v12h14V4M5 8h14M5 12h14"></path></g><circle cx="12" cy="20.5" r=".9"></circle></svg>`;

export class HyggeRoomCard extends HyggeCard<RoomCardConfig> {
  /** Optimistic on/off per entity until Home Assistant reports the new state. */
  @state() private pending: Record<string, boolean> = {};
  @state() private dragPct?: number;
  private sendTimer?: number;
  private lastSent = 0;

  static getStubConfig(hass: any) {
    const lights = Object.keys(hass?.states ?? {}).filter(id => id.startsWith('light.')).slice(0, 3);
    return { name: 'Living room', icon: 'mdi:sofa', entities: lights };
  }

  protected override validateConfig(config: RoomCardConfig) {
    if (!config.name) throw new Error('Give the room a `name`.');
  }

  private get ents(): Array<RoomEntityConfig & { kind: Kind }> {
    return (this.config.entities ?? []).map(e => {
      const c = typeof e === 'string' ? { entity: e } : e;
      return { ...c, kind: c.kind ?? this.detectKind(c.entity) };
    });
  }

  private detectKind(id: string): Kind {
    const domain = id.split('.')[0];
    if (domain === 'light') return 'light';
    if (domain === 'fan') return 'fan';
    if (domain === 'cover') return 'cover';
    if (domain === 'switch' && /light|lamp|lampe|lys/i.test(id)) return 'light';
    if (TOGGLEABLE.has(domain)) return 'toggle';
    return 'info';
  }

  protected override watchedEntities() {
    return [this.config.temperature, this.config.humidity, this.config.dimmer, ...this.ents.map(e => e.entity)];
  }

  protected override willUpdate(changed: PropertyValues) {
    const old = changed.get('hass');
    if (old && this.hass && Object.keys(this.pending).length) {
      const next = { ...this.pending };
      for (const id of Object.keys(next)) if (old.states[id] !== this.hass.states[id]) delete next[id];
      this.pending = next;
    }
  }

  private isOn(id: string, kind: Kind): boolean {
    if (id in this.pending) return this.pending[id];
    const s = this.stateOf(id)?.state;
    return kind === 'cover' ? s === 'open' || s === 'opening' : s === 'on';
  }

  private toggle(e: RoomEntityConfig & { kind: Kind }) {
    if (e.kind === 'info') return this.moreInfo(e.entity);
    const domain = e.entity.split('.')[0];
    this.pending = { ...this.pending, [e.entity]: !this.isOn(e.entity, e.kind) };
    this.callService(domain, 'toggle', {}, { entity_id: e.entity }).catch(() => this.clearPending(e.entity));
  }

  private toggleRoom() {
    const lights = this.ents.filter(e => e.kind === 'light');
    if (!lights.length) return this.moreInfo(this.config.temperature ?? this.ents[0]?.entity);
    const anyOn = lights.some(l => this.isOn(l.entity, 'light'));
    const pending = { ...this.pending };
    lights.forEach(l => (pending[l.entity] = !anyOn));
    this.pending = pending;
    this.callService('homeassistant', anyOn ? 'turn_off' : 'turn_on', {}, { entity_id: lights.map(l => l.entity) }).catch(() => (this.pending = {}));
  }

  private clearPending(id: string) {
    const next = { ...this.pending };
    delete next[id];
    this.pending = next;
  }

  private get brightnessPct(): number {
    if (this.dragPct !== undefined) return this.dragPct;
    const s = this.stateOf(this.config.dimmer);
    if (!s || s.state !== 'on') return 0;
    return Math.max(1, Math.round(((s.attributes.brightness as number) ?? 255) / 2.55));
  }

  private onDim(ev: Event, final: boolean) {
    const pct = Number((ev.target as HTMLInputElement).value);
    this.dragPct = pct;
    const send = () => {
      this.lastSent = Date.now();
      this.callService('light', 'turn_on', { brightness_pct: pct }, { entity_id: this.config.dimmer });
    };
    clearTimeout(this.sendTimer);
    if (final) {
      send();
      // Keep showing the dragged value until Home Assistant reports the new brightness.
      this.sendTimer = window.setTimeout(() => (this.dragPct = undefined), 1500);
    } else if (Date.now() - this.lastSent > 350) send();
    else this.sendTimer = window.setTimeout(send, 350);
  }

  private statusLine(): string {
    const ents = this.ents;
    const lights = ents.filter(e => e.kind === 'light');
    const lightsOn = lights.filter(e => this.isOn(e.entity, e.kind)).length;
    // A room without lights (a hallway with only a door sensor) shouldn't announce "Lights off".
    const parts = lights.length ? [lightsOn ? `${lightsOn} light${lightsOn > 1 ? 's' : ''} on` : 'Lights off'] : [];
    for (const e of ents) {
      const s = this.stateOf(e.entity);
      const name = (e.name ?? friendlyName(s, e.entity)).toLowerCase();
      if (e.kind === 'fan' && this.isOn(e.entity, e.kind)) parts.push(`${name} running`);
      if (e.kind === 'cover') parts.push(`${name} ${this.isOn(e.entity, e.kind) ? 'open' : 'closed'}`);
      if (e.entity.startsWith('binary_sensor.') && ['door', 'window', 'opening', 'garage_door'].includes(String(s?.attributes.device_class)))
        parts.push(`${name} ${s?.state === 'on' ? 'open' : 'closed'}`);
    }
    return parts.join(' · ');
  }

  private entityIcon(e: RoomEntityConfig & { kind: Kind }, s?: HassEntity) {
    if (e.icon) return haIcon(e.icon);
    if (e.kind === 'light') return icon('bulb');
    if (e.kind === 'fan') return fanIcon;
    if (e.kind === 'cover') return blindsIcon;
    return haIcon((s?.attributes.icon as string) ?? 'mdi:toggle-switch-outline');
  }

  protected override render() {
    const c = this.config;
    const ents = this.ents;
    const lightsOn = ents.some(e => e.kind === 'light' && this.isOn(e.entity, e.kind));
    const temp = numeric(this.stateOf(c.temperature));
    const hum = numeric(this.stateOf(c.humidity));
    const pct = this.brightnessPct;
    const level = c.dimmer ? pct / 100 : 0.7;
    const cols = Math.min(Math.max(ents.length, 1), 4);

    return html`
      <ha-card class="glass room" data-on=${lightsOn} style="--level:${level}">
        <div class="top">
          <button
            class="room-icon"
            type="button"
            aria-pressed=${lightsOn}
            aria-label="${c.name} lights"
            @click=${() => this.tap(() => this.toggleRoom())}
            @pointerdown=${() => this.holdStart(() => this.moreInfo(c.temperature ?? ents[0]?.entity))}
            @pointerup=${this.holdEnd}
            @pointerleave=${this.holdEnd}
            @pointercancel=${this.holdEnd}
          >
            ${haIcon(c.icon ?? 'mdi:home-outline')}
          </button>
          <div class="meta">
            <h3>${c.name}</h3>
            <p class="status">${this.statusLine()}</p>
          </div>
          ${temp !== undefined || hum !== undefined
            ? html`<button class="climate num" type="button" @click=${() => this.moreInfo(c.temperature ?? c.humidity)}>
                ${temp !== undefined ? html`<b>${temp.toFixed(1)}°</b>` : nothing}
                ${hum !== undefined ? html`<small>${icon('drop')}${Math.round(hum)}%</small>` : nothing}
              </button>`
            : nothing}
        </div>
        ${ents.length
          ? html`<div class="ents" style="grid-template-columns:repeat(${cols},1fr)">
              ${ents.map(e => {
                const s = this.stateOf(e.entity);
                const on = this.isOn(e.entity, e.kind);
                return html`<button
                  class="ent"
                  type="button"
                  data-kind=${e.kind}
                  aria-pressed=${on}
                  ?disabled=${!s}
                  @click=${() => this.tap(() => this.toggle(e))}
                  @pointerdown=${() => this.holdStart(() => this.moreInfo(e.entity))}
                  @pointerup=${this.holdEnd}
                  @pointerleave=${this.holdEnd}
                  @pointercancel=${this.holdEnd}
                  @contextmenu=${(ev: Event) => {
                    ev.preventDefault();
                    this.moreInfo(e.entity);
                  }}
                >
                  ${this.entityIcon(e, s)}<span>${e.name ?? friendlyName(s, e.entity)}</span>
                </button>`;
              })}
            </div>`
          : nothing}
        ${c.dimmer
          ? html`<div class="bri" data-on=${pct > 0}>
              <div class="bri-fill"></div>
              <div class="bri-label">${icon('bulb')}<span class="num">${pct > 0 ? `${pct}%` : 'Off'}</span></div>
              <input
                type="range"
                min="1"
                max="100"
                .value=${String(Math.max(1, pct))}
                aria-label="${c.name} brightness"
                @input=${(ev: Event) => this.onDim(ev, false)}
                @change=${(ev: Event) => this.onDim(ev, true)}
              />
            </div>`
          : nothing}
      </ha-card>
    `;
  }

  static override styles = [
    base,
    glass,
    css`
      .room::before {
        content: '';
        position: absolute;
        width: 260px;
        height: 260px;
        left: -80px;
        top: -110px;
        border-radius: 50%;
        background: radial-gradient(closest-side, var(--hh-warm-soft), transparent);
        opacity: 0;
        transition: opacity 0.6s var(--ease);
        pointer-events: none;
      }
      .room[data-on='true']::before {
        opacity: calc(0.4 + var(--level) * 0.9);
      }
      .top {
        position: relative;
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .room-icon {
        width: 56px;
        height: 56px;
        border-radius: 20px;
        display: grid;
        place-items: center;
        flex: none;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        color: var(--hh-ink-2);
        --mdc-icon-size: 26px;
        transition: background 0.35s, color 0.35s, box-shadow 0.35s, transform 0.3s var(--spring);
      }
      .room-icon:active {
        transform: scale(0.92);
      }
      .room-icon[aria-pressed='true'] {
        background: var(--hh-warm);
        color: var(--hh-on-warm);
        border-color: transparent;
        box-shadow: 0 0 0 6px var(--hh-warm-soft), 0 10px 30px -6px var(--hh-warm);
      }
      .meta {
        flex: 1;
        min-width: 0;
      }
      .meta h3 {
        margin: 0;
        font-size: 17px;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
      .status {
        margin: 2px 0 0;
        font-size: 12.5px;
        color: var(--hh-ink-2);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .climate {
        text-align: right;
        line-height: 1.15;
      }
      .climate b {
        display: block;
        font-size: 22px;
        font-weight: 300;
        letter-spacing: -0.02em;
      }
      .climate small {
        font-size: 12px;
        color: var(--hh-ink-3);
        display: inline-flex;
        align-items: center;
        gap: 2px;
      }
      .climate small svg.i {
        width: 12px;
        height: 12px;
      }
      .ents {
        position: relative;
        display: grid;
        gap: 8px;
        margin-top: 16px;
      }
      .ent {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        padding: 12px 4px 10px;
        border-radius: 16px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        font-size: 11.5px;
        font-weight: 500;
        color: var(--hh-ink-2);
        min-width: 0;
        transition: background 0.3s, color 0.3s, transform 0.25s var(--spring);
        user-select: none;
        -webkit-touch-callout: none;
      }
      .ent:hover {
        background: var(--hh-glass-press);
      }
      .ent:active {
        transform: scale(0.94);
      }
      .ent:disabled {
        opacity: 0.4;
        cursor: default;
      }
      .ent span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }
      .ent[aria-pressed='true'] {
        color: var(--hh-ink);
      }
      .ent[data-kind='light'][aria-pressed='true'] svg,
      .ent[data-kind='light'][aria-pressed='true'] ha-icon,
      .ent[data-kind='toggle'][aria-pressed='true'] ha-icon {
        color: var(--hh-warm);
        filter: drop-shadow(0 0 6px var(--hh-warm));
      }
      .ent[data-kind='fan'][aria-pressed='true'] svg,
      .ent[data-kind='fan'][aria-pressed='true'] ha-icon {
        color: var(--hh-accent);
        animation: hh-spin 1.1s linear infinite;
      }
      .ent[data-kind='cover'] .slats {
        transform-origin: 50% 4px;
        transform: scaleY(0.25);
        transition: transform 0.6s var(--ease);
      }
      .ent[data-kind='cover'][aria-pressed='true'] .slats {
        transform: scaleY(1);
      }
      .ent[data-kind='cover'][aria-pressed='true'] svg,
      .ent[data-kind='cover'][aria-pressed='true'] ha-icon {
        color: var(--hh-accent);
      }

      /* Brightness: a drawn fill that dims with the light; the native range sits invisibly on top. */
      .bri {
        position: relative;
        margin-top: 14px;
        height: 40px;
        border-radius: 14px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        overflow: hidden;
      }
      .bri-fill {
        position: absolute;
        inset: 0 auto 0 0;
        width: calc(var(--level) * 100%);
        background: linear-gradient(90deg, color-mix(in srgb, var(--hh-warm) 55%, var(--hh-glass-strong)), var(--hh-warm));
        filter: brightness(calc(0.35 + var(--level) * 0.65)) saturate(calc(0.45 + var(--level) * 0.55));
        opacity: calc(0.25 + var(--level) * 0.75);
        box-shadow: 0 0 calc(var(--level) * 28px) var(--hh-warm);
        transition: opacity 0.4s, filter 0.2s;
      }
      .bri-fill::after {
        content: '';
        position: absolute;
        right: 7px;
        top: 30%;
        bottom: 30%;
        width: 3px;
        border-radius: 2px;
        background: var(--hh-on-warm);
        opacity: 0.45;
      }
      .bri[data-on='false'] .bri-fill {
        opacity: 0;
      }
      .bri-label {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        font-size: 12.5px;
        font-weight: 600;
        pointer-events: none;
      }
      .bri[data-on='false'] .bri-label {
        color: var(--hh-ink-3);
      }
      .bri-label svg.i {
        width: 17px;
        height: 17px;
        opacity: calc(0.45 + var(--level) * 0.55);
      }
      .bri input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        opacity: 0;
        cursor: ew-resize;
        -webkit-appearance: none;
        appearance: none;
      }
      .bri input::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 1px;
        height: 40px;
      }
      .bri input::-moz-range-thumb {
        width: 1px;
        height: 40px;
        border: 0;
      }
      .bri:has(input:focus-visible) {
        outline: 2px solid var(--hh-accent);
        outline-offset: 2px;
      }
    `,
  ];
}

registerCard('hyggehub-room-card', HyggeRoomCard, 'HyggeHub Room', 'A room with its lights, fans, blinds, climate and a dimmer.');
