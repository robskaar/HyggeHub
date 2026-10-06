import { LitElement, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { engine } from '../theme/engine';
import type { CardConfig, HassEntity, HomeAssistant } from '../types';
import { formatState } from './format';

/**
 * Shared plumbing for every HyggeHub card: config handling, feeding the theme engine, re-rendering only
 * when an entity the card shows has changed, and Home Assistant's tap / hold conventions.
 */
export abstract class HyggeCard<C extends CardConfig = CardConfig> extends LitElement {
  @state() protected config!: C;

  private _hass?: HomeAssistant;
  private holdTimer?: number;
  private held = false;

  /** False while the card is scrolled out of view; its CSS animations are paused then. */
  protected onScreen = true;
  private static seen?: IntersectionObserver;

  /** One observer for every card: off-screen cards pause their animations (via --hh-play). */
  private static observer(): IntersectionObserver {
    return (HyggeCard.seen ??= new IntersectionObserver(entries => {
      for (const e of entries) {
        const card = e.target as HyggeCard;
        card.onScreen = e.isIntersecting;
        if (e.isIntersecting) card.style.removeProperty('--hh-play');
        else card.style.setProperty('--hh-play', 'paused');
      }
    }));
  }

  override connectedCallback() {
    super.connectedCallback();
    HyggeCard.observer().observe(this);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    HyggeCard.observer().unobserve(this);
  }

  @property({ attribute: false, noAccessor: true })
  set hass(hass: HomeAssistant | undefined) {
    const old = this._hass;
    this._hass = hass;
    if (hass) engine.setHass(hass);
    this.requestUpdate('hass', old);
  }
  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  setConfig(config: C): void {
    if (!config || typeof config !== 'object') throw new Error('Invalid configuration');
    this.validateConfig(config);
    this.config = config;
  }

  /** Throw an Error with a plain explanation; Home Assistant shows it in place of the card. */
  protected validateConfig(_config: C): void {}

  /** Entities whose changes should re-render this card. */
  protected watchedEntities(): Array<string | undefined> {
    return [];
  }

  getCardSize(): number {
    return 3;
  }

  /** Sections view: a full-width card by default. */
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  protected override shouldUpdate(changed: PropertyValues): boolean {
    if (!this.config) return false;
    if (!(changed.size === 1 && changed.has('hass'))) return true;
    const old = changed.get('hass') as HomeAssistant | undefined;
    const now = this.hass;
    if (!old || !now) return true;
    if (old.locale !== now.locale || old.user !== now.user) return true;
    return this.watchedEntities().some(id => !!id && old.states[id] !== now.states[id]);
  }

  protected stateOf(entityId?: string): HassEntity | undefined {
    return entityId ? this.hass?.states[entityId] : undefined;
  }

  protected format(entityId?: string): string {
    return formatState(this.hass, this.stateOf(entityId));
  }

  protected callService(domain: string, service: string, data: Record<string, unknown> = {}, target?: Record<string, unknown>) {
    return this.hass!.callService(domain, service, data, target);
  }

  protected moreInfo(entityId?: string): void {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true }));
  }

  // Tap / hold: tap runs the action, holding for half a second opens more-info, like native cards.
  protected holdStart(onHold: () => void): void {
    this.held = false;
    clearTimeout(this.holdTimer);
    this.holdTimer = window.setTimeout(() => {
      this.held = true;
      navigator.vibrate?.(10);
      onHold();
    }, 500);
  }

  protected holdEnd(): void {
    clearTimeout(this.holdTimer);
  }

  protected tap(action: () => void): void {
    if (this.held) {
      this.held = false;
      return;
    }
    action();
  }
}

/** Registers a card element and its entry in the dashboard's card picker. */
export function registerCard(tag: string, ctor: CustomElementConstructor, name: string, description: string): void {
  if (!customElements.get(tag)) customElements.define(tag, ctor);
  window.customCards = window.customCards || [];
  if (!window.customCards.some(c => c.type === tag)) {
    window.customCards.push({ type: tag, name, description, preview: true });
  }
}
