import { css, html, nothing, type PropertyValues } from 'lit';
import { query, state } from 'lit/decorators.js';
import { registerCard, HyggeCard } from '../shared/base-card';
import { haIcon, icon } from '../shared/icons';
import { formatTime, friendlyName, lang } from '../shared/format';
import { base, glass } from '../shared/styles';
import { engine } from '../theme/engine';
import type { CardConfig, Unsubscribe } from '../types';

interface Forecast {
  datetime: string;
  condition?: string;
  temperature?: number;
  templow?: number;
}

export interface WeatherCardConfig extends CardConfig {
  entity: string;
  /** The place shown at the top, e.g. "Sønderborg". Defaults to Home Assistant's location name. */
  name?: string;
  /** How many forecast slots fit on one page; arrows page through the rest. Default 6. */
  slots?: number;
  /** Which view opens first when the integration has both. Default hourly. */
  view?: 'hourly' | 'daily';
  sun?: string;
}

type View = 'hourly' | 'daily';

const ICONS: Record<string, string> = {
  'clear-night': 'mdi:weather-night',
  cloudy: 'mdi:weather-cloudy',
  exceptional: 'mdi:alert-circle-outline',
  fog: 'mdi:weather-fog',
  hail: 'mdi:weather-hail',
  lightning: 'mdi:weather-lightning',
  'lightning-rainy': 'mdi:weather-lightning-rainy',
  partlycloudy: 'mdi:weather-partly-cloudy',
  pouring: 'mdi:weather-pouring',
  rainy: 'mdi:weather-rainy',
  snowy: 'mdi:weather-snowy',
  'snowy-rainy': 'mdi:weather-snowy-rainy',
  sunny: 'mdi:weather-sunny',
  windy: 'mdi:weather-windy',
  'windy-variant': 'mdi:weather-windy-variant',
};
const LABELS: Record<string, string> = {
  'clear-night': 'Clear night', cloudy: 'Cloudy', exceptional: 'Exceptional', fog: 'Fog', hail: 'Hail', lightning: 'Thunder',
  'lightning-rainy': 'Thunder and rain', partlycloudy: 'Partly cloudy', pouring: 'Heavy rain', rainy: 'Rain', snowy: 'Snow',
  'snowy-rainy': 'Sleet', sunny: 'Sunny', windy: 'Windy', 'windy-variant': 'Windy and cloudy',
};
const SNOW = new Set(['snowy', 'snowy-rainy', 'hail']);
const RAIN = new Set(['rainy', 'pouring', 'lightning-rainy']);
const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

const deg = (t: unknown) => (typeof t === 'number' ? `${Math.round(t)}°`.replace('-', '−') : '–');

interface Particle {
  x: number;
  y: number;
  r: number;
  s: number;
  d: number;
}

export class HyggeWeatherCard extends HyggeCard<WeatherCardConfig> {
  @state() private forecasts: Partial<Record<View, Forecast[]>> = {};
  @state() private view: View = 'hourly';
  @state() private page = 0;
  @query('canvas') private canvas?: HTMLCanvasElement;
  private unsubs: Array<Promise<Unsubscribe>> = [];
  private subscribedFor?: string;
  private raf?: number;
  private particles: Particle[] = [];
  private particleColor = '';
  private lastFrame = 0;
  private resizeObs?: ResizeObserver;

  static getStubConfig(hass: any) {
    return { entity: Object.keys(hass?.states ?? {}).find(id => id.startsWith('weather.')) ?? 'weather.home' };
  }

  protected override validateConfig(c: WeatherCardConfig) {
    if (!c.entity?.startsWith('weather.')) throw new Error('`entity` must be a weather entity.');
    if (c.view) this.view = c.view;
  }

  protected override watchedEntities() {
    return [this.config.entity, this.config.sun ?? 'sun.sun'];
  }

  override getCardSize() {
    return 4;
  }

  private onTheme = () => {
    this.particleColor = getComputedStyle(document.documentElement).getPropertyValue('--hh-particle').trim();
    this.syncLoop();
  };

  override connectedCallback() {
    super.connectedCallback();
    engine.addEventListener('change', this.onTheme);
    this.onTheme();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    engine.removeEventListener('change', this.onTheme);
    for (const u of this.unsubs) u.then(f => f()).catch(() => {});
    this.unsubs = [];
    this.subscribedFor = undefined;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = undefined;
    this.resizeObs?.disconnect();
    this.resizeObs = undefined;
  }

  protected override firstUpdated() {
    this.syncLoop();
  }

  protected override updated(changed: PropertyValues) {
    super.updated(changed);
    if (this.hass && this.subscribedFor !== this.config.entity) this.subscribe();
    if (changed.has('hass')) this.syncLoop();
  }

  /** Both forecasts the integration offers, so switching between hours and days is instant. */
  private subscribe() {
    const s = this.stateOf(this.config.entity);
    if (!s) return;
    for (const u of this.unsubs) u.then(f => f()).catch(() => {});
    this.subscribedFor = this.config.entity;
    const features = (s.attributes.supported_features as number | undefined) ?? 0;
    const kinds: View[] = [...(features & 2 ? ['hourly' as View] : []), ...(features & 1 ? ['daily' as View] : [])];
    if (!kinds.includes(this.view)) this.view = kinds[0] ?? 'daily';
    this.unsubs = kinds.map(kind =>
      this.hass!.connection.subscribeMessage<{ forecast: Forecast[] }>(msg => (this.forecasts = { ...this.forecasts, [kind]: msg.forecast ?? [] }), {
        type: 'weather/subscribe_forecast',
        entity_id: this.config.entity,
        forecast_type: kind,
      }).catch(() => () => {}),
    );
  }

  private setView(e: Event, v: View) {
    e.stopPropagation();
    this.view = v;
    this.page = 0;
  }

  private turn(e: Event, delta: number) {
    e.stopPropagation();
    this.page = Math.max(0, this.page + delta);
  }

  private get placeName(): string {
    if (this.config.name) return this.config.name;
    const fromHA = this.hass?.config?.location_name;
    if (fromHA && !/^(home|hjem)$/i.test(fromHA)) return fromHA;
    const fn = friendlyName(this.stateOf(this.config.entity));
    return fn && !/^(home|hjem|forecast)/i.test(fn) ? fn : '';
  }

  // ---------- falling snow / rain on a canvas behind the content ----------

  private get precipitating(): boolean {
    const cond = this.stateOf(this.config.entity)?.state ?? '';
    return SNOW.has(cond) || RAIN.has(cond);
  }

  /**
   * The particle loop runs only while it's snowing or raining and motion is on, at about 30 frames a
   * second. Otherwise the canvas is drawn once (still flakes, or nothing) and left alone.
   */
  private syncLoop() {
    const cv = this.canvas;
    if (!cv) return;
    if (!this.resizeObs) {
      this.resizeObs = new ResizeObserver(() => {
        this.sizeCanvas();
        this.draw();
      });
      this.resizeObs.observe(cv);
    }
    const run = this.precipitating && engine.motionOn;
    if (run && !this.raf) {
      const frame = (t: number) => {
        if (this.onScreen && t - this.lastFrame > 32) {
          this.lastFrame = t;
          this.draw();
        }
        this.raf = requestAnimationFrame(frame);
      };
      this.raf = requestAnimationFrame(frame);
    } else if (!run) {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = undefined;
      this.draw();
    }
  }

  private sizeCanvas() {
    const cv = this.canvas;
    if (!cv) return;
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    const dpr = devicePixelRatio || 1;
    cv.width = w * dpr;
    cv.height = h * dpr;
    cv.getContext('2d')!.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.particles = Array.from({ length: Math.round(w / 6) }, () => this.spawn(w, h, true));
  }

  private spawn(w: number, h: number, anywhere: boolean): Particle {
    return { x: Math.random() * w, y: anywhere ? Math.random() * h : -10, r: Math.random() * 1.7 + 0.6, s: Math.random() * 0.45 + 0.25, d: Math.random() * 6.28 };
  }

  private draw() {
    const cv = this.canvas;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    ctx.clearRect(0, 0, w, h);
    const cond = this.stateOf(this.config.entity)?.state ?? '';
    const snow = SNOW.has(cond);
    const rain = RAIN.has(cond);
    if (!snow && !rain) return;
    const move = engine.motionOn;
    ctx.fillStyle = ctx.strokeStyle = this.particleColor || 'rgba(255,255,255,.7)';
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    for (const p of this.particles) {
      if (move) {
        if (snow) {
          p.y += p.s * 2;
          p.d += 0.024;
          p.x += Math.sin(p.d) * 0.5;
        } else {
          p.y += 12 + p.s * 12;
          p.x -= 2;
        }
      }
      if (p.y > h + 10) Object.assign(p, this.spawn(w, h, false));
      if (p.x < -10) p.x = w + 5;
      ctx.beginPath();
      if (snow) {
        ctx.arc(p.x, p.y, p.r, 0, 6.28);
        ctx.fill();
      } else {
        ctx.globalAlpha = 0.55;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - 2, p.y + 9 + p.r * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }

  // ---------- render ----------

  private daylight() {
    const sun = this.stateOf(this.config.sun ?? 'sun.sun');
    if (!sun) return undefined;
    const now = Date.now();
    const nextRise = new Date(sun.attributes.next_rising).getTime();
    const nextSet = new Date(sun.attributes.next_setting).getTime();
    if (isNaN(nextRise) || isNaN(nextSet)) return undefined;
    let rise: number;
    let set: number;
    let progress: number;
    if (sun.state === 'above_horizon') {
      set = nextSet;
      rise = nextRise - 864e5;
      progress = (now - rise) / (set - rise);
    } else {
      rise = nextRise;
      set = nextSet;
      // Before sunrise the bar is empty; after sunset (next sunrise is tomorrow) it is full.
      progress = new Date(nextRise).getDate() === new Date(now).getDate() ? 0 : 1;
      if (progress === 1) {
        rise = nextRise - 864e5;
        set = nextSet - 864e5;
      }
    }
    const len = Math.max(0, set - rise);
    return { rise: new Date(rise), set: new Date(set), progress: Math.min(1, Math.max(0, progress)), hours: Math.floor(len / 36e5), minutes: Math.round((len % 36e5) / 6e4) };
  }

  private slotLabel(f: Forecast) {
    const d = new Date(f.datetime);
    if (this.view === 'daily') {
      const today = new Date().toDateString() === d.toDateString();
      return today ? 'Today' : d.toLocaleDateString(lang(this.hass), { weekday: 'short' });
    }
    return Math.abs(d.getTime() - Date.now()) < 30 * 6e4 ? 'Now' : d.toLocaleTimeString(lang(this.hass), { hour: '2-digit' });
  }

  /** "Today 14–19", "Tomorrow 08–13", "Thu – Tue": what the current page covers. */
  private pageLabel(list: Forecast[]): string {
    if (!list.length) return '';
    const first = new Date(list[0].datetime);
    const last = new Date(list[list.length - 1].datetime);
    const l = lang(this.hass);
    if (this.view === 'daily') return `${first.toLocaleDateString(l, { weekday: 'short', day: 'numeric' })} – ${last.toLocaleDateString(l, { weekday: 'short', day: 'numeric' })}`;
    const day = (d: Date) => {
      const diff = Math.round((new Date(d.toDateString()).getTime() - new Date(new Date().toDateString()).getTime()) / 864e5);
      return diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : d.toLocaleDateString(l, { weekday: 'short' });
    };
    const hh = (d: Date) => d.toLocaleTimeString(l, { hour: '2-digit' });
    return day(first) === day(last) ? `${day(first)} ${hh(first)}–${hh(last)}` : `${day(first)} ${hh(first)} – ${day(last)} ${hh(last)}`;
  }

  protected override render() {
    const s = this.stateOf(this.config.entity);
    if (!s) return html`<ha-card class="glass"><p class="muted">${this.config.entity} is not available.</p></ha-card>`;
    const a = s.attributes;
    const cond = s.state;
    const unit = (a.wind_speed_unit as string | undefined) ?? 'm/s';
    const wind = typeof a.wind_speed === 'number' ? `Wind ${Math.round(a.wind_speed)} ${unit}${typeof a.wind_bearing === 'number' ? ` ${COMPASS[Math.round(a.wind_bearing / 45) % 8]}` : ''}` : '';
    const feels = typeof a.apparent_temperature === 'number' ? `Feels like ${deg(a.apparent_temperature)}` : typeof a.humidity === 'number' ? `Humidity ${a.humidity}%` : '';
    const label = this.hass?.formatEntityState?.(s) ?? LABELS[cond] ?? cond;
    const night = cond === 'clear-night';
    const cloudy = !['sunny', 'clear-night'].includes(cond);
    const sunny = ['sunny', 'partlycloudy'].includes(cond);
    const day = this.daylight();
    const per = this.config.slots ?? 6;
    const all = this.forecasts[this.view] ?? [];
    const pages = Math.max(1, Math.ceil(all.length / per));
    const page = Math.min(this.page, pages - 1);
    const slots = all.slice(page * per, page * per + per);
    const both = !!this.forecasts.hourly && !!this.forecasts.daily;
    const place = this.placeName;

    return html`
      <ha-card class="glass weather" @click=${() => this.moreInfo(this.config.entity)}>
        <canvas aria-hidden="true"></canvas>
        <div class="top">
          <span class="place">${place ? html`${haIcon('mdi:map-marker-outline')}${place}` : nothing}</span>
          ${both
            ? html`<span class="seg" role="group" aria-label="Forecast">
                <button type="button" aria-pressed=${this.view === 'hourly'} @click=${(e: Event) => this.setView(e, 'hourly')}>Hours</button>
                <button type="button" aria-pressed=${this.view === 'daily'} @click=${(e: Event) => this.setView(e, 'daily')}>Days</button>
              </span>`
            : nothing}
        </div>
        <div class="main">
          <div>
            <div class="temp num">${deg(a.temperature)}</div>
            <div class="cond">${label}</div>
            <div class="sub">${[feels, wind].filter(Boolean).join(' · ')}</div>
          </div>
          <div class="art" aria-hidden="true">
            ${sunny ? html`<div class="sun"></div>` : nothing} ${night ? html`<div class="moon"></div>` : nothing}
            ${cloudy ? html`<div class="cloud"></div>` : nothing}
          </div>
        </div>
        ${slots.length
          ? html`<div class="pager">
                <button class="pg" type="button" aria-label="Earlier" ?disabled=${page === 0} @click=${(e: Event) => this.turn(e, -1)}>${icon('left')}</button>
                <span class="range num">${this.pageLabel(slots)}</span>
                <button class="pg next" type="button" aria-label="Later" ?disabled=${page >= pages - 1} @click=${(e: Event) => this.turn(e, 1)}>${icon('left')}</button>
              </div>
              <div class="slots num" style="grid-template-columns:repeat(${per},1fr)">
                ${slots.map(
                  f => html`<div>
                    <span class="h">${this.slotLabel(f)}</span>${haIcon(ICONS[f.condition ?? ''] ?? 'mdi:weather-cloudy')}<b>${deg(f.temperature)}</b>
                    ${this.view === 'daily' && typeof f.templow === 'number' ? html`<small>${deg(f.templow)}</small>` : nothing}
                  </div>`,
                )}
              </div>`
          : nothing}
        ${day
          ? html`<div class="daylight">
              <div class="bar"><i style="width:${day.progress * 100}%"></i></div>
              <div class="row num">
                <span>Sunrise ${formatTime(day.rise, this.hass)}</span><span>${day.hours} h ${day.minutes} min daylight</span><span>Sunset ${formatTime(day.set, this.hass)}</span>
              </div>
            </div>`
          : nothing}
      </ha-card>
    `;
  }

  static override styles = [
    base,
    glass,
    css`
      ha-card.weather {
        padding: 20px;
        cursor: pointer;
      }
      canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
      .main {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 10px;
      }
      .temp {
        font-size: 64px;
        font-weight: 200;
        line-height: 1;
        letter-spacing: -0.04em;
      }
      .cond {
        font-size: 15px;
        font-weight: 600;
        margin-top: 6px;
      }
      .sub {
        font-size: 12.5px;
        color: var(--hh-ink-2);
      }
      .art {
        width: 64px;
        height: 64px;
        position: relative;
        flex: none;
      }
      .cloud {
        position: absolute;
        inset: auto 0 8px 0;
        height: 30px;
        border-radius: 30px;
        background: var(--hh-glass-press);
        box-shadow: inset 0 1px 0 var(--hh-highlight);
        animation: float 6s ease-in-out infinite;
      }
      .cloud::before,
      .cloud::after {
        content: '';
        position: absolute;
        border-radius: 50%;
        background: inherit;
      }
      .cloud::before {
        width: 30px;
        height: 30px;
        left: 8px;
        top: -14px;
      }
      .cloud::after {
        width: 24px;
        height: 24px;
        left: 28px;
        top: -9px;
      }
      .sun {
        position: absolute;
        right: 2px;
        top: 4px;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: var(--hh-warm);
        box-shadow: 0 0 24px var(--hh-warm);
        animation: breathe 5s ease-in-out infinite;
      }
      .moon {
        position: absolute;
        right: 10px;
        top: 8px;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        box-shadow: -8px 6px 0 0 var(--hh-warm);
        transform: rotate(-20deg);
        animation: breathe 6s ease-in-out infinite;
      }
      @keyframes float {
        50% {
          transform: translateX(4px);
        }
      }
      @keyframes breathe {
        50% {
          transform: scale(1.08);
          opacity: 0.85;
        }
      }
      .top {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 6px;
        min-height: 28px;
      }
      .place {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        font-weight: 600;
        color: var(--hh-ink-2);
        --mdc-icon-size: 16px;
      }
      .seg {
        display: inline-flex;
        padding: 3px;
        border-radius: 11px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
      }
      .seg button {
        padding: 4px 10px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        color: var(--hh-ink-2);
      }
      .seg button[aria-pressed='true'] {
        background: var(--hh-accent);
        color: var(--hh-on-accent);
      }
      .pager {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid var(--hh-line);
      }
      .range {
        font-size: 12px;
        font-weight: 600;
        color: var(--hh-ink-2);
      }
      .pg {
        width: 30px;
        height: 30px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        transition: opacity 0.2s, transform 0.2s var(--spring);
      }
      .pg svg.i {
        width: 16px;
        height: 16px;
      }
      .pg.next svg.i {
        transform: scaleX(-1);
      }
      .pg:active:not(:disabled) {
        transform: scale(0.92);
      }
      .pg:disabled {
        opacity: 0.3;
        cursor: default;
      }
      .slots small {
        font-size: 11px;
        color: var(--hh-ink-3);
        margin-top: -4px;
      }
      .slots {
        position: relative;
        display: grid;
        gap: 4px;
        margin-top: 10px;
        text-align: center;
        font-size: 12px;
        --mdc-icon-size: 18px;
      }
      .slots div {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        min-width: 0;
      }
      .slots .h {
        color: var(--hh-ink-3);
        white-space: nowrap;
      }
      .slots b {
        font-weight: 600;
      }
      .slots ha-icon {
        color: var(--hh-ink-2);
      }
      .daylight {
        position: relative;
        margin-top: 14px;
      }
      .bar {
        height: 6px;
        border-radius: 6px;
        background: var(--hh-line);
        overflow: hidden;
      }
      .bar i {
        display: block;
        height: 100%;
        border-radius: 6px;
        background: linear-gradient(90deg, var(--hh-warm-soft), var(--hh-warm));
      }
      .row {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        font-size: 11.5px;
        color: var(--hh-ink-3);
        margin-top: 6px;
        flex-wrap: wrap;
      }
    `,
  ];
}

registerCard('hyggehub-weather-card', HyggeWeatherCard, 'HyggeHub Weather', 'Current weather with falling snow or rain, a forecast row and daylight.');
