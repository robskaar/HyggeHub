import { css, html, nothing, type PropertyValues } from 'lit';
import { query, state } from 'lit/decorators.js';
import { registerCard, HyggeCard } from '../shared/base-card';
import { haIcon, icon } from '../shared/icons';
import { friendlyName } from '../shared/format';
import { base, glass } from '../shared/styles';
import type { CardConfig } from '../types';

type Mode = 'home' | 'away' | 'night' | 'vacation' | 'custom_bypass';
type Step = 'idle' | 'mode' | 'code';

export interface AlarmCardConfig extends CardConfig {
  entity: string;
  name?: string;
  /** Which arm modes to offer, in order. Defaults to everything the panel supports. */
  modes?: Mode[];
  /** Digits that complete a code; 0 means "variable length, press OK". */
  code_length?: number;
  /** Seconds of exit delay, so the ring can count down while arming. Without it the ring spins. */
  exit_delay?: number;
  /** Seconds of entry delay, for the same countdown while the panel is pending. */
  entry_delay?: number;
  /** Door and window binary sensors summarised under the orb. */
  sensors?: string[];
  mode_descriptions?: Partial<Record<Mode, string>>;
  /** Set when shown inside another card's panel (the 3D house): no frame of its own, no name while idle. */
  embedded?: boolean;
}

const MODES: Record<Mode, { label: string; icon: string; desc: string; feature: number; service: string }> = {
  home: { label: 'Home', icon: 'mdi:home-outline', desc: 'Doors and windows only', feature: 1, service: 'alarm_arm_home' },
  away: { label: 'Away', icon: 'mdi:walk', desc: 'Everything, cameras on', feature: 2, service: 'alarm_arm_away' },
  night: { label: 'Night', icon: 'mdi:weather-night', desc: 'Ground floor, bedrooms off', feature: 4, service: 'alarm_arm_night' },
  vacation: { label: 'Holiday', icon: 'mdi:bag-suitcase-outline', desc: 'Everything, lights on a random schedule', feature: 32, service: 'alarm_arm_vacation' },
  custom_bypass: { label: 'Custom', icon: 'mdi:shield-edit-outline', desc: 'Your own selection of zones', feature: 16, service: 'alarm_arm_custom_bypass' },
};
const STEPS: Step[] = ['idle', 'mode', 'code'];
const R = 46;
const C = 2 * Math.PI * R;

export class HyggeAlarmCard extends HyggeCard<AlarmCardConfig> {
  @state() private step: Step = 'idle';
  @state() private flow: 'arm' | 'disarm' = 'arm';
  @state() private mode?: Mode;
  @state() private code = '';
  @state() private prompt = '';
  @state() private busy = false;
  /** Plays the "pop" on the shield once, right after a disarm. Not reactive on purpose. */
  private flash = false;
  /** Whatever shakes on a wrong code: the dots, or the text field when the panel uses text codes. */
  @query('.text-code, .dots') private dotsEl?: HTMLElement;
  @query('.code-input') private codeInput?: HTMLInputElement;
  private ticker?: number;

  static getStubConfig(hass: any) {
    const entity = Object.keys(hass?.states ?? {}).find(id => id.startsWith('alarm_control_panel.')) ?? 'alarm_control_panel.home';
    return { entity };
  }

  protected override validateConfig(config: AlarmCardConfig) {
    if (!config.entity?.startsWith('alarm_control_panel.')) throw new Error('`entity` must be an alarm_control_panel entity.');
  }

  protected override watchedEntities() {
    return [this.config.entity, ...(this.config.sensors ?? [])];
  }

  override getCardSize() {
    return 6;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this.onKey);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.onKey);
    clearInterval(this.ticker);
    this.ticker = undefined;
  }

  private get entity() {
    return this.stateOf(this.config.entity);
  }

  private get panelState(): string {
    return this.entity?.state ?? 'unavailable';
  }

  private get armedMode(): Mode | undefined {
    const s = this.panelState;
    return s.startsWith('armed_') ? (s.slice(6) as Mode) : undefined;
  }

  private get availableModes(): Mode[] {
    if (this.config.modes?.length) return this.config.modes.filter(m => m in MODES);
    const features = (this.entity?.attributes.supported_features as number | undefined) ?? 0;
    const supported = (Object.keys(MODES) as Mode[]).filter(m => features & MODES[m].feature);
    return supported.length ? supported : ['home', 'away', 'night'];
  }

  private get codeFormat(): 'number' | 'text' | null {
    return (this.entity?.attributes.code_format as 'number' | 'text' | null | undefined) ?? null;
  }

  private get codeLength(): number {
    return this.config.code_length ?? 4;
  }

  private needsCode(flow: 'arm' | 'disarm'): boolean {
    if (!this.codeFormat) return false;
    return flow === 'disarm' || this.entity?.attributes.code_arm_required !== false;
  }

  /** Seconds left in an exit/entry delay, or undefined when the card can't know. */
  private delayLeft(): { left: number; total: number } | undefined {
    const s = this.panelState;
    const total = s === 'arming' ? this.config.exit_delay : s === 'pending' ? this.config.entry_delay : undefined;
    if (!total || !this.entity) return undefined;
    const elapsed = (Date.now() - new Date(this.entity.last_changed).getTime()) / 1000;
    return { left: Math.max(0, Math.ceil(total - elapsed)), total };
  }

  protected override updated(changed: PropertyValues) {
    super.updated(changed);
    const counting = !!this.delayLeft() && (this.panelState === 'arming' || this.panelState === 'pending');
    if (counting && !this.ticker) this.ticker = window.setInterval(() => this.requestUpdate(), 1000);
    if (!counting && this.ticker) {
      clearInterval(this.ticker);
      this.ticker = undefined;
    }
    if (changed.has('step') && this.step === 'code' && this.codeFormat === 'text') this.codeInput?.focus();
  }

  private go(step: Step) {
    this.step = step;
    if (step === 'code') {
      this.code = '';
      this.prompt =
        this.flow === 'arm' && this.mode ? `Enter your code to arm ${MODES[this.mode].label.toLowerCase()}` : 'Enter your code to disarm';
    }
  }

  private onOrb() {
    if (this.busy || this.panelState === 'unavailable') return;
    if (this.panelState === 'disarmed') {
      this.flow = 'arm';
      const modes = this.availableModes;
      if (modes.length === 1) return this.pickMode(modes[0]);
      this.go('mode');
    } else {
      this.flow = 'disarm';
      if (this.needsCode('disarm')) this.go('code');
      else void this.submit();
    }
  }

  private pickMode(mode: Mode) {
    this.mode = mode;
    if (this.needsCode('arm')) this.go('code');
    else void this.submit();
  }

  private back() {
    this.go(this.step === 'code' && this.flow === 'arm' && this.availableModes.length > 1 ? 'mode' : 'idle');
  }

  private press(key: string) {
    if (this.busy) return;
    if (key === 'cancel') return this.back();
    if (key === 'back') {
      this.code = this.code.slice(0, -1);
      return;
    }
    if (key === 'ok') return void this.submit();
    if (this.codeLength && this.code.length >= this.codeLength) return;
    this.code += key;
    if (this.codeLength && this.code.length === this.codeLength) setTimeout(() => this.submit(), 160);
  }

  private onKey = (e: KeyboardEvent) => {
    if (this.step !== 'code' || this.codeFormat === 'text') return;
    if (/^[0-9]$/.test(e.key)) this.press(e.key);
    else if (e.key === 'Backspace') this.press('back');
    else if (e.key === 'Escape') this.press('cancel');
    else if (e.key === 'Enter' && !this.codeLength) this.press('ok');
  };

  private async submit() {
    const service = this.flow === 'disarm' ? 'alarm_disarm' : MODES[this.mode ?? 'away'].service;
    const data = this.needsCode(this.flow) ? { code: this.code } : {};
    this.busy = true;
    try {
      await this.callService('alarm_control_panel', service, data, { entity_id: this.config.entity });
      if (this.flow === 'disarm') this.flash = true;
      this.code = '';
      this.go('idle');
    } catch (err: any) {
      this.code = '';
      this.prompt = err?.message ? String(err.message) : 'Wrong code, try again';
      if (this.step !== 'code') this.go('code');
      const dots = this.dotsEl;
      if (dots) {
        dots.classList.remove('shake');
        void dots.offsetWidth;
        dots.classList.add('shake');
      }
    } finally {
      this.busy = false;
    }
  }

  private sensorSummary(): string | undefined {
    const ids = this.config.sensors;
    if (!ids?.length) return undefined;
    const open = ids.filter(id => this.stateOf(id)?.state === 'on');
    if (!open.length) return `All ${ids.length} doors and windows closed`;
    const first = friendlyName(this.stateOf(open[0]), open[0]);
    return open.length === 1 ? `${first} is open` : `${first} and ${open.length - 1} more are open`;
  }

  private renderOrb() {
    const s = this.panelState;
    const mode = this.armedMode;
    const delay = this.delayLeft();
    const label = (m?: Mode) => (m ? MODES[m].label.toLowerCase() : '');
    const desc = (m: Mode) => this.config.mode_descriptions?.[m] ?? MODES[m].desc;
    let core;
    let word: string;
    let hint: string;
    let detail: string;
    let visual = 'disarmed';
    let ringOffset = 0;
    let spinning = false;

    if (s === 'arming' || s === 'pending') {
      visual = s;
      word = s === 'arming' ? 'Arming' : 'Disarm now';
      core = delay
        ? html`<span class="secs num">${delay.left}</span><span class="w">${word}</span>`
        : html`${icon('shield')}<span class="w">${word}</span>`;
      hint = s === 'arming' ? 'Tap to cancel' : 'Tap to enter your code';
      detail = s === 'arming' ? 'Leave now, the exit delay is running' : 'Someone came in, the alarm goes off when the delay ends';
      if (delay) ringOffset = C * (1 - delay.left / delay.total);
      else spinning = true;
    } else if (s === 'triggered') {
      visual = 'triggered';
      word = 'Alarm triggered';
      core = html`${icon('shieldAlert', 'pop')}<span class="w">Alarm</span>`;
      hint = 'Tap to disarm';
      detail = this.sensorSummary() ?? 'The alarm has been triggered';
    } else if (mode) {
      visual = 'armed';
      word = `Armed ${label(mode)}`;
      core = html`${icon('lock', 'pop')}<span class="w">${word}</span>`;
      hint = 'Tap to disarm';
      detail = MODES[mode] ? desc(mode) : '';
    } else if (s === 'disarmed') {
      word = 'Disarmed';
      core = html`${icon('shield', this.flash ? 'pop' : '')}<span class="w">Disarmed</span>`;
      hint = 'Tap to arm';
      detail = this.sensorSummary() ?? 'Ready to arm';
    } else {
      visual = 'unavailable';
      word = s === 'disarming' ? 'Disarming' : 'Unavailable';
      core = html`${icon('shield')}<span class="w">${word}</span>`;
      hint = '';
      detail = s === 'disarming' ? '' : 'The alarm panel is not responding';
    }
    this.flash = false;

    return html`
      <button class="orb" type="button" data-visual=${visual} ?disabled=${visual === 'unavailable'} aria-label=${hint ? `${word}. ${hint}` : word} @click=${this.onOrb}>
        <svg viewBox="0 0 100 100" aria-hidden="true" class=${spinning ? 'spin' : ''}>
          <circle class="bg" cx="50" cy="50" r=${R}></circle>
          <circle class="fg" cx="50" cy="50" r=${R} style="stroke-dasharray:${spinning ? `${C * 0.22} ${C}` : C};stroke-dashoffset:${ringOffset}"></circle>
        </svg>
        <span class="core">${core}</span>
      </button>
      <div class="hint">${hint}</div>
      <div class="detail">${detail}</div>
    `;
  }

  protected override render() {
    const c = this.config;
    const s = this.panelState;
    const visual = s.startsWith('armed_') ? 'armed' : s;
    const name = c.name ?? 'Alarm';
    const idx = STEPS.indexOf(this.step);
    const pos = (step: Step) => {
      const j = STEPS.indexOf(step);
      return j < idx ? 'before' : j > idx ? 'after' : '';
    };
    const textCode = this.codeFormat === 'text';
    const variable = !this.codeLength;
    const dots = this.codeLength || Math.max(4, this.code.length);
    let right: string;
    if (this.step === 'mode') right = 'Choose mode';
    else if (this.step === 'code') right = this.flow === 'arm' ? 'Enter code' : '';
    else right = this.config.sensors?.length ? `${this.config.sensors.length} sensors ${this.armedMode ? 'armed' : 'ready'}` : '';
    const showPips = this.flow === 'arm' && this.step !== 'idle' && this.availableModes.length > 1 && this.needsCode('arm');

    return html`
      <ha-card class="glass alarm ${c.embedded ? 'embedded' : ''}" data-visual=${visual}>
        <div class="head">
          <button class="back" type="button" aria-label="Back" ?hidden=${this.step === 'idle'} @click=${this.back}>${icon('left')}</button>
          <h3>${this.step === 'idle' ? (c.embedded ? '' : name) : this.flow === 'arm' ? (this.step === 'code' && this.mode ? `Arm · ${MODES[this.mode].label}` : 'Arm') : 'Disarm'}</h3>
          <div class="right">
            <span>${right}</span>
            ${showPips ? html`<span class="pips"><i class="on"></i><i class=${this.step === 'code' ? 'on' : ''}></i></span>` : nothing}
          </div>
        </div>
        <div class="stage">
          <section class="step ${this.step === 'idle' ? 'on' : ''}" data-pos=${pos('idle')} ?inert=${this.step !== 'idle'}>${this.renderOrb()}</section>
          <section class="step ${this.step === 'mode' ? 'on' : ''}" data-pos=${pos('mode')} ?inert=${this.step !== 'mode'}>
            <div class="modes">
              ${this.availableModes.map(
                m => html`<button class="mode" type="button" @click=${() => this.pickMode(m)}>
                  <span class="mi">${haIcon(MODES[m].icon)}</span><b>${MODES[m].label}</b><small>${c.mode_descriptions?.[m] ?? MODES[m].desc}</small>
                </button>`,
              )}
            </div>
          </section>
          <section class="step ${this.step === 'code' ? 'on' : ''}" data-pos=${pos('code')} ?inert=${this.step !== 'code'}>
            <div class="prompt" role="status">${this.prompt}</div>
            ${textCode
              ? html`<form
                  class="text-code"
                  @submit=${(e: Event) => {
                    e.preventDefault();
                    void this.submit();
                  }}
                >
                  <input class="code-input" type="password" autocomplete="off" aria-label="Code" .value=${this.code} @input=${(e: Event) => (this.code = (e.target as HTMLInputElement).value)} />
                  <button type="submit" class="ok">OK</button>
                </form>`
              : html`
                  <div class="dots" aria-hidden="true">${Array.from({ length: dots }, (_, i) => html`<i class=${i < this.code.length ? 'on' : ''}></i>`)}</div>
                  <div class="keypad">
                    ${['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(k => html`<button class="key num" type="button" @click=${() => this.press(k)}>${k}</button>`)}
                    ${variable
                      ? html`<button class="key util" type="button" @click=${() => this.press('ok')}>OK</button>`
                      : html`<button class="key util" type="button" @click=${() => this.press('cancel')}>Cancel</button>`}
                    <button class="key num" type="button" @click=${() => this.press('0')}>0</button>
                    <button class="key util" type="button" aria-label="Delete digit" @click=${() => this.press('back')}>${icon('backspace')}</button>
                  </div>
                `}
          </section>
        </div>
      </ha-card>
    `;
  }

  static override styles = [
    base,
    glass,
    css`
      .alarm {
        --state: var(--hh-ok);
      }
      /* Inside another card's panel: the panel is the frame. */
      ha-card.embedded {
        background: transparent;
        border: none;
        border-radius: 0;
        box-shadow: none;
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
        padding: 6px 0 0;
        animation: none;
      }
      .alarm[data-visual='arming'],
      .alarm[data-visual='pending'],
      .alarm[data-visual='disarming'] {
        --state: var(--hh-warn);
      }
      .alarm[data-visual='armed'],
      .alarm[data-visual='triggered'] {
        --state: var(--hh-crit);
      }
      .alarm[data-visual='unavailable'] {
        --state: var(--hh-ink-3);
      }
      .head {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 34px;
        margin-bottom: 8px;
      }
      .back {
        width: 34px;
        height: 34px;
        border-radius: 11px;
        display: grid;
        place-items: center;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
      }
      .head h3 {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
      }
      .right {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: var(--hh-ink-3);
      }
      .pips {
        display: flex;
        gap: 4px;
      }
      .pips i {
        width: 16px;
        height: 4px;
        border-radius: 2px;
        background: var(--hh-line);
        transition: background 0.3s;
      }
      .pips i.on {
        background: var(--hh-accent);
      }
      .stage {
        display: grid;
      }
      .step {
        grid-area: 1 / 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        opacity: 0;
        visibility: hidden;
        transform: translateX(28px);
        transition: opacity 0.3s var(--ease), transform 0.45s var(--ease), visibility 0s 0.45s;
      }
      .step[data-pos='before'] {
        transform: translateX(-28px);
      }
      .step.on {
        opacity: 1;
        visibility: visible;
        transform: none;
        transition: opacity 0.35s var(--ease) 0.06s, transform 0.45s var(--ease), visibility 0s;
      }
      .orb {
        width: 184px;
        height: 184px;
        border-radius: 50%;
        position: relative;
        display: grid;
        place-items: center;
        transition: transform 0.3s var(--spring);
      }
      .orb:active {
        transform: scale(0.96);
      }
      .orb > svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }
      .orb > svg.spin {
        animation: hh-spin 1.6s linear infinite;
      }
      .orb circle {
        fill: none;
        stroke-width: 2.6;
      }
      .orb .bg {
        stroke: var(--hh-line);
      }
      .orb .fg {
        stroke: var(--state);
        stroke-linecap: round;
        transition: stroke-dashoffset 1s linear, stroke 0.4s;
      }
      .core {
        width: 144px;
        height: 144px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: var(--state);
        background: color-mix(in srgb, var(--state) 12%, var(--hh-glass-strong));
        border: 1px solid var(--hh-stroke);
        transition: color 0.4s, background 0.4s;
        position: relative;
      }
      /* The armed pulse is a ring that only scales and fades: the graphics chip does that for free,
         where an animated shadow would be repainted every frame. */
      .core::after {
        content: '';
        position: absolute;
        inset: -1px;
        border-radius: 50%;
        border: 2px solid var(--state);
        opacity: 0;
        pointer-events: none;
      }
      .core svg.i {
        width: 36px;
        height: 36px;
        stroke-width: 1.5;
      }
      .core .w {
        font-size: 16px;
        font-weight: 600;
        color: var(--hh-ink);
        letter-spacing: -0.01em;
        text-align: center;
        padding: 0 10px;
      }
      .core .secs {
        font-size: 44px;
        font-weight: 200;
        line-height: 1;
        letter-spacing: -0.03em;
        color: var(--hh-ink);
      }
      .pop {
        animation: pop 0.5s var(--spring);
      }
      @keyframes pop {
        from {
          transform: scale(0.4);
          opacity: 0;
        }
      }
      .orb[data-visual='disarmed'] .core::after {
        animation: breathe-ring 4.5s ease-in-out infinite;
      }
      @keyframes breathe-ring {
        0%,
        100% {
          transform: scale(1);
          opacity: 0;
        }
        50% {
          transform: scale(1.07);
          opacity: 0.35;
        }
      }
      .orb[data-visual='armed'] .core::after {
        animation: pulse 2.4s ease-out infinite;
      }
      .orb[data-visual='triggered'] .core::after {
        animation: pulse 0.9s ease-out infinite;
      }
      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 0.55;
        }
        100% {
          transform: scale(1.3);
          opacity: 0;
        }
      }
      .hint {
        font-size: 13px;
        font-weight: 600;
        color: var(--hh-ink-2);
        min-height: 19px;
      }
      .detail {
        font-size: 12px;
        color: var(--hh-ink-3);
        margin-top: -6px;
        text-align: center;
        min-height: 17px;
      }
      .modes {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      .mode {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        padding: 14px;
        border-radius: 18px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        text-align: left;
        transition: background 0.2s, transform 0.3s var(--spring);
      }
      .mode:hover {
        background: var(--hh-glass-press);
        transform: translateY(-2px);
      }
      .mi {
        width: 36px;
        height: 36px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: color-mix(in srgb, var(--hh-crit) 14%, transparent);
        color: var(--hh-crit);
      }
      .mode b {
        font-size: 14px;
        font-weight: 600;
      }
      .mode small {
        font-size: 11.5px;
        color: var(--hh-ink-3);
        line-height: 1.3;
      }
      .prompt {
        font-size: 13px;
        color: var(--hh-ink-2);
        min-height: 19px;
        text-align: center;
      }
      .dots {
        display: flex;
        justify-content: center;
        gap: 14px;
        height: 12px;
      }
      .dots i {
        width: 11px;
        height: 11px;
        border-radius: 50%;
        border: 1.5px solid var(--hh-ink-3);
        transition: background 0.2s, border-color 0.2s, transform 0.25s var(--spring);
      }
      .dots i.on {
        background: var(--hh-ink);
        border-color: var(--hh-ink);
        transform: scale(1.1);
      }
      .shake {
        animation: shake 0.4s;
      }
      @keyframes shake {
        20%,
        60% {
          transform: translateX(-7px);
        }
        40%,
        80% {
          transform: translateX(7px);
        }
      }
      .keypad {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-top: 4px;
      }
      .key {
        height: 46px;
        border-radius: 15px;
        font-size: 19px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        display: grid;
        place-items: center;
        transition: background 0.15s, transform 0.2s var(--spring);
      }
      .key:hover {
        background: var(--hh-glass-press);
      }
      .key:active {
        transform: scale(0.93);
        background: var(--hh-accent-soft);
      }
      .key.util {
        font-size: 13px;
        font-weight: 600;
        color: var(--hh-ink-2);
        background: transparent;
        border-color: transparent;
      }
      .text-code {
        display: flex;
        gap: 8px;
        width: 100%;
      }
      .text-code input {
        flex: 1;
        min-width: 0;
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid var(--hh-stroke);
        background: var(--hh-glass-strong);
        outline: none;
      }
      .ok {
        padding: 0 18px;
        border-radius: 14px;
        background: var(--hh-accent);
        color: var(--hh-on-accent);
        font-weight: 600;
      }
    `,
  ];
}

registerCard('hyggehub-alarm-card', HyggeAlarmCard, 'HyggeHub Alarm', 'A step-by-step alarm panel: tap the state to arm or disarm.');
