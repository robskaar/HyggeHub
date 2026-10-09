import { css, html, LitElement, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { engine, DEFAULT_APPEARANCE, type Appearance, type Look, type NightRule, type Slot } from '../theme/engine';
import { THEMES, THEME_KEYS, type ThemeKey } from '../theme/themes';
import { icon } from '../shared/icons';
import { formatTime } from '../shared/format';
import { base, glass } from '../shared/styles';
import type { HomeAssistant } from '../types';

const frostWord = (v: number) => (v === 0 ? 'Clear' : v < 12 ? 'Light' : v < 26 ? 'Frosted' : 'Heavy');

/**
 * The Appearance sidebar panel. Everything here is per user: it edits the signed-in user's stored
 * Appearance through the theme engine and never touches anyone else's.
 */
export class HyggeAppearancePanel extends LitElement {
  @property({ type: Boolean }) narrow = false;
  /** Shown inside a dashboard (the card) rather than as its own sidebar panel. */
  @property({ type: Boolean, reflect: true }) embedded = false;
  @state() private tick = 0;
  @state() private saveError = '';
  private _hass?: HomeAssistant;

  @property({ attribute: false, noAccessor: true })
  set hass(hass: HomeAssistant | undefined) {
    const old = this._hass;
    this._hass = hass;
    if (hass) engine.setHass(hass);
    // The panel only cares about the user, sun times and dark mode, not every state change.
    if (!old || old.user !== hass?.user || old.states['sun.sun'] !== hass?.states['sun.sun'] || old.themes !== hass?.themes) this.requestUpdate('hass', old);
  }
  get hass() {
    return this._hass;
  }

  private onEngine = () => this.tick++;
  private onSaveError = (e: Event) => (this.saveError = (e as CustomEvent).detail?.message ?? 'Your changes could not be saved.');

  override connectedCallback() {
    super.connectedCallback();
    engine.addEventListener('change', this.onEngine);
    engine.addEventListener('save-error', this.onSaveError);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    engine.removeEventListener('change', this.onEngine);
    engine.removeEventListener('save-error', this.onSaveError);
    if (engine.preview !== 'auto') engine.setPreview('auto');
  }

  private update_(fn: (a: Appearance) => void) {
    const next: Appearance = JSON.parse(JSON.stringify(engine.appearance));
    fn(next);
    this.saveError = '';
    engine.save(next);
  }

  private slotLook(slot: Slot): Look {
    const a = engine.appearance;
    return slot === 'day' ? a.day : a.night;
  }

  private renderThemeGrid(slot: Slot) {
    const current = this.slotLook(slot).theme;
    return html`<div class="theme-grid" role="radiogroup" aria-label="${slot} theme">
      ${THEME_KEYS.map(k => {
        const t = THEMES[k];
        const preview = `background:radial-gradient(circle at 18% 22%,${t.blob1},transparent 62%),radial-gradient(circle at 88% 30%,${t.blob2},transparent 58%),radial-gradient(circle at 50% 120%,${t.blob3},transparent 62%),${t.bg}`;
        return html`<button
          class="theme-opt"
          type="button"
          role="radio"
          aria-checked=${k === current}
          title=${t.description}
          @click=${() => this.update_(a => (a[slot].theme = k as ThemeKey))}
        >
          <span class="tp" style=${preview}>
            <i style="background:${t.glassStrong};border-color:${t.stroke}"></i><u style="background:${t.accent}"></u>
          </span>
          <span class="tn">${t.name}<small>${t.dark ? 'Dark' : 'Light'}</small></span>
        </button>`;
      })}
    </div>`;
  }

  private renderLook(slot: Slot) {
    const look = this.slotLook(slot);
    return html`
      <div class="lbl-row">Theme <span>${THEMES[look.theme].name}</span></div>
      ${this.renderThemeGrid(slot)}
      <div class="lbl-row">Frost <span class="num">${frostWord(look.frost)} · ${look.frost}</span></div>
      <input
        class="frost"
        type="range"
        min="0"
        max="40"
        .value=${String(look.frost)}
        aria-label="${slot} frost"
        @input=${(e: Event) => this.update_(a => (a[slot].frost = Number((e.target as HTMLInputElement).value)))}
      />
      <div class="scale"><span>Clear glass</span><span>Heavy frost</span></div>
    `;
  }

  protected override render() {
    void this.tick;
    const a = engine.appearance;
    const r = engine.resolved;
    const sun = this.hass?.states['sun.sun'];
    const sunText = sun
      ? `Today about ${formatTime(new Date(sun.attributes.next_setting), this.hass)} to ${formatTime(new Date(sun.attributes.next_rising), this.hass)}`
      : 'Needs the sun integration (sun.sun)';
    const name = this.hass?.user?.name ?? 'you';
    const rules: Array<{ key: NightRule; title: string; desc: string }> = [
      { key: 'device', title: 'Follow my device', desc: 'Uses the light or dark setting of each phone, tablet and browser' },
      { key: 'sun', title: 'Follow the sun', desc: `Night from sunset to sunrise. ${sunText}` },
      { key: 'schedule', title: 'Fixed times', desc: 'The same hours every day' },
    ];

    return html`
      <div class="bar" ?hidden=${this.embedded}>
        ${this.narrow
          ? html`<button class="round" type="button" aria-label="Open the sidebar" @click=${() => this.dispatchEvent(new Event('hass-toggle-menu', { bubbles: true, composed: true }))}>
              ${icon('menu')}
            </button>`
          : nothing}
      </div>
      <div class="shell">
        <section class="hero">
          <div>
            <h1>Appearance</h1>
            <p>Your own day and night look. It’s saved to ${name}’s Home Assistant user, so it follows you to every device you sign in on and never changes what anyone else sees.</p>
          </div>
        </section>

        <div class="status glass">
          <div class="si">${icon(r.slot === 'night' ? 'moon' : 'sun')}</div>
          <div class="st">
            <b>Showing your ${r.slot} look · ${THEMES[r.look.theme].name}${r.slot === 'night' && a.night.same ? ' (same as day)' : ''}</b>
            <span>${r.reason}</span>
          </div>
          <div class="seg" role="group" aria-label="Preview">
            ${(['auto', 'day', 'night'] as const).map(
              p => html`<button type="button" aria-pressed=${engine.preview === p} @click=${() => engine.setPreview(p)}>${p === 'auto' ? 'Auto' : p === 'day' ? 'Day' : 'Night'}</button>`,
            )}
          </div>
        </div>
        ${this.saveError ? html`<p class="error" role="alert">${this.saveError}</p>` : nothing}

        <div class="grid">
          <article class="card glass" data-active=${r.slot === 'day'}>
            <div class="card-head">${icon('sun')}<h3>Day</h3><span class="pill active"><i></i>Showing now</span></div>
            ${this.renderLook('day')}
          </article>
          <article class="card glass" data-active=${r.slot === 'night'}>
            <div class="card-head">
              ${icon('moon')}<h3>Night</h3><span class="pill active"><i></i>Showing now</span>
              <label class="push">
                Same as day
                <button class="switch" type="button" role="switch" aria-checked=${a.night.same} @click=${() => this.update_(x => (x.night.same = !x.night.same))}></button>
              </label>
            </div>
            ${a.night.same ? html`<p class="same">Night uses your day look. Turn off “Same as day” to choose another.</p>` : nothing}
            <div class="body ${a.night.same ? 'off' : ''}" ?inert=${a.night.same}>${this.renderLook('night')}</div>
          </article>
        </div>

        <div class="grid">
          <article class="card glass">
            <div class="card-head">${icon('moon')}<h3>When night starts</h3></div>
            <div class="opts" role="radiogroup" aria-label="When night starts">
              ${rules.map(
                rule => html`<div>
                  <button class="opt" type="button" role="radio" aria-checked=${a.when === rule.key} @click=${() => this.update_(x => (x.when = rule.key))}>
                    <span class="radio"></span><span class="ot"><b>${rule.title}</b><small>${rule.desc}</small></span>
                  </button>
                  ${rule.key === 'schedule'
                    ? html`<div class="times">
                        <label>From <input type="time" .value=${a.from} ?disabled=${a.when !== 'schedule'} @change=${(e: Event) => this.update_(x => (x.from = (e.target as HTMLInputElement).value || x.from))} /></label>
                        <label>to <input type="time" .value=${a.to} ?disabled=${a.when !== 'schedule'} @change=${(e: Event) => this.update_(x => (x.to = (e.target as HTMLInputElement).value || x.to))} /></label>
                      </div>`
                    : nothing}
                </div>`,
              )}
            </div>
          </article>
          <article class="card glass">
            <div class="card-head">${icon('sliders')}<h3>Motion</h3></div>
            <div class="row">
              <div><b>Card animations</b><small>Spinning fans, falling snow, the equaliser</small></div>
              <button class="switch" type="button" role="switch" aria-checked=${a.motion} aria-label="Card animations" @click=${() => this.update_(x => (x.motion = !x.motion))}></button>
            </div>
            <div class="row">
              <div><b>Reset my appearance</b><small>Back to Fjord by day and Polar night after dark</small></div>
              <button class="btn-text" type="button" @click=${() => this.update_(x => Object.assign(x, JSON.parse(JSON.stringify(DEFAULT_APPEARANCE))))}>Reset</button>
            </div>
            <p class="note">${icon('info')}<span>If a device asks for reduced motion, that always wins. Nothing here changes what other people in the home see.</span></p>
          </article>
        </div>
      </div>
    `;
  }

  static override styles = [
    base,
    glass,
    css`
      :host {
        min-height: 100vh;
        background: var(--hh-backdrop, var(--primary-background-color));
        background-attachment: fixed;
      }
      :host([embedded]) {
        min-height: 0;
        background: none;
      }
      :host([embedded]) .shell {
        padding-top: 24px;
      }
      .bar {
        height: 56px;
        display: flex;
        align-items: center;
        padding: 0 12px;
      }
      .shell {
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 24px 56px;
      }
      .hero {
        padding: 0 0 22px;
      }
      h1 {
        margin: 0;
        font-weight: 300;
        font-size: clamp(36px, 5vw, 52px);
        letter-spacing: -0.03em;
        line-height: 1;
      }
      .hero p {
        margin: 12px 0 0;
        max-width: 60ch;
        color: var(--hh-ink-2);
        font-size: 14.5px;
        line-height: 1.5;
      }
      .status {
        display: flex;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
        padding: 14px 18px;
        border-radius: 20px;
        margin-bottom: 18px;
      }
      .si {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: var(--hh-accent-soft);
        color: var(--hh-accent);
      }
      .st {
        flex: 1;
        min-width: 200px;
      }
      .st b {
        display: block;
        font-size: 14.5px;
      }
      .st span {
        font-size: 12.5px;
        color: var(--hh-ink-2);
      }
      .error {
        color: var(--hh-crit);
        font-size: 13px;
        margin: -8px 4px 14px;
      }
      .seg {
        display: inline-flex;
        padding: 3px;
        border-radius: 12px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
      }
      .seg button {
        padding: 6px 12px;
        border-radius: 9px;
        font-size: 12.5px;
        font-weight: 600;
        color: var(--hh-ink-2);
        transition: background 0.2s, color 0.2s;
      }
      .seg button[aria-pressed='true'] {
        background: var(--hh-accent);
        color: var(--hh-on-accent);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr));
        gap: 18px;
        margin-bottom: 18px;
        align-items: start;
      }
      .card {
        border-radius: 26px;
        padding: 20px;
        min-width: 0;
      }
      .card-head {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }
      .card-head h3 {
        margin: 0;
        font-size: 17px;
        font-weight: 600;
      }
      .active {
        display: none;
      }
      .active i {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--hh-ok);
      }
      .card[data-active='true'] .active {
        display: inline-flex;
      }
      .push {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 12.5px;
        font-weight: 600;
        color: var(--hh-ink-2);
      }
      .body {
        transition: opacity 0.3s;
      }
      .body.off {
        opacity: 0.35;
        pointer-events: none;
      }
      .same {
        font-size: 12.5px;
        color: var(--hh-ink-2);
        margin: -6px 0 12px;
      }
      .lbl-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin: 18px 0 8px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--hh-ink-3);
      }
      .lbl-row:first-child {
        margin-top: 0;
      }
      .lbl-row span {
        letter-spacing: 0;
        text-transform: none;
        font-weight: 500;
        color: var(--hh-ink-2);
      }
      .theme-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
        gap: 8px;
      }
      .theme-opt {
        display: flex;
        flex-direction: column;
        gap: 7px;
        padding: 6px 6px 8px;
        border-radius: 16px;
        border: 1px solid var(--hh-stroke);
        background: var(--hh-glass-strong);
        text-align: left;
        transition: transform 0.25s var(--spring), box-shadow 0.2s;
      }
      .theme-opt:hover {
        transform: translateY(-2px);
      }
      .theme-opt[aria-checked='true'] {
        box-shadow: 0 0 0 2px var(--hh-accent);
      }
      .tp {
        height: 62px;
        border-radius: 11px;
        position: relative;
        overflow: hidden;
      }
      .tp i {
        position: absolute;
        left: 9px;
        right: 30%;
        bottom: 9px;
        height: 22px;
        border-radius: 7px;
        border: 1px solid;
      }
      .tp u {
        position: absolute;
        right: 9px;
        top: 9px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
      .tn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 3px;
        font-size: 12.5px;
        font-weight: 600;
      }
      .tn small {
        font-size: 10.5px;
        font-weight: 500;
        color: var(--hh-ink-3);
      }
      .frost {
        width: 100%;
        accent-color: var(--hh-accent);
      }
      .scale {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: var(--hh-ink-3);
        margin-top: 2px;
      }
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        padding: 12px 0;
        border-top: 1px solid var(--hh-line);
      }
      .card-head + .row {
        border-top: 0;
      }
      .scale + .row {
        margin-top: 12px;
      }
      .row b {
        display: block;
        font-size: 14px;
        font-weight: 600;
      }
      .row small {
        font-size: 12px;
        color: var(--hh-ink-3);
      }
      .switch {
        width: 46px;
        height: 28px;
        border-radius: 14px;
        flex: none;
        position: relative;
        background: var(--hh-line);
        border: 1px solid var(--hh-stroke);
        transition: background 0.25s;
      }
      .switch::after {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--hh-glass-press);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s var(--spring), background 0.25s;
      }
      .switch[aria-checked='true'] {
        background: var(--hh-accent);
      }
      .switch[aria-checked='true']::after {
        transform: translateX(18px);
        background: var(--hh-on-accent);
      }
      .opts {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .opt {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        border-radius: 16px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        text-align: left;
        width: 100%;
        transition: box-shadow 0.2s;
      }
      .opt[aria-checked='true'] {
        box-shadow: 0 0 0 2px var(--hh-accent);
      }
      .radio {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 1.6px solid var(--hh-ink-3);
        flex: none;
        display: grid;
        place-items: center;
      }
      .opt[aria-checked='true'] .radio {
        border-color: var(--hh-accent);
      }
      .opt[aria-checked='true'] .radio::after {
        content: '';
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--hh-accent);
      }
      .ot {
        flex: 1;
        min-width: 0;
      }
      .ot b {
        display: block;
        font-size: 14px;
        font-weight: 600;
      }
      .ot small {
        font-size: 12px;
        color: var(--hh-ink-3);
      }
      .times {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 8px 0 0 30px;
        font-size: 12.5px;
        color: var(--hh-ink-2);
        flex-wrap: wrap;
      }
      .times input {
        margin-left: 6px;
        padding: 6px 10px;
        border-radius: 10px;
        border: 1px solid var(--hh-stroke);
        background: var(--hh-glass-press);
        font-variant-numeric: tabular-nums;
      }
      .times input:disabled {
        opacity: 0.5;
      }
      .note {
        font-size: 12px;
        color: var(--hh-ink-3);
        margin: 14px 0 0;
        display: flex;
        gap: 8px;
        align-items: flex-start;
      }
      .note svg.i {
        width: 16px;
        height: 16px;
        margin-top: 1px;
      }
      @media (max-width: 600px) {
        .shell {
          padding: 0 16px 40px;
        }
      }
    `,
  ];
}

if (!customElements.get('hyggehub-appearance-panel')) customElements.define('hyggehub-appearance-panel', HyggeAppearancePanel);

/**
 * The same page as a dashboard card, for installs that can't edit configuration.yaml: make a dashboard
 * called "Appearance", shown in the sidebar, with one panel view holding this card.
 */
export class HyggeAppearanceCard extends HyggeAppearancePanel {
  constructor() {
    super();
    this.embedded = true;
  }

  setConfig(_config: unknown) {}

  getCardSize() {
    return 12;
  }

  getGridOptions() {
    return { columns: 'full' };
  }
}

if (!customElements.get('hyggehub-appearance-card')) customElements.define('hyggehub-appearance-card', HyggeAppearanceCard);
window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === 'hyggehub-appearance-card')) {
  window.customCards.push({ type: 'hyggehub-appearance-card', name: 'HyggeHub Appearance', description: 'Your own day and night look, as a card.', preview: false });
}
