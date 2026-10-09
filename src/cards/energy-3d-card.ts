import { css, html, nothing, type PropertyValues } from 'lit';
import { registerCard, HyggeCard } from '../shared/base-card';
import { compartments, daysFromToday, kindsIn, pickups, type BinsSource, type Kind } from '../shared/bins';
import { haIcon } from '../shared/icons';
import { lang, numeric, powerKw } from '../shared/format';
import { carColour } from '../shared/car';
import { base, glass } from '../shared/styles';
import { engine } from '../theme/engine';
import type { CardConfig, HassEntity } from '../types';
import type { EnergyCardConfig } from './energy-card';
import type { FlowKey, IslandScene, LabelKey, LabelPosition, SceneState, Weather } from './energy-3d/scene';
import './energy-card';

export interface Energy3dCardConfig extends CardConfig, Pick<EnergyCardConfig, 'title' | 'solar' | 'grid' | 'grid_export' | 'home' | 'extras'> {
  /** Water flow sensor (L/min, L/h or m³/h). Draws the water line from the meter. */
  water?: string;
  /**
   * Weather entity: clouds, rain, snow, fog, lightning, wind and chimney smoke follow it. Defaults to
   * weather.forecast_home (Met.no, set up by onboarding), else the first weather entity.
   */
  weather?: string;
  /** The car parked by the house: shown with its battery, and a charge cable and flow while charging. */
  car?: {
    name?: string;
    /** Battery level sensor (%). */
    battery?: string;
    /** On while charging (binary_sensor, or a sensor whose state is "charging"). */
    charging?: string;
    /** Charging power sensor (W or kW); also counts as charging when above 50 W. */
    charging_power?: string;
    /** On while the cable is connected. */
    plugged?: string;
    /** A named colour (see the family card) or a hex value. */
    color?: string;
  };
  /**
   * Waste collection, the same keys as the bins card (`schedule`, optional `bins`): the bins by the
   * sidewalk show a countdown and what is collected, and roll out to the kerb on collection day.
   */
  bins?: BinsSource;
  /** The driveway bollards: a light, switch or any on/off entity. Without it they come on at dusk. */
  driveway_lights?: string;
  /** Compass bearing (degrees) the front door faces, so sunlight comes from the right side. Default 180, south. */
  facing?: number;
  /** Sun entity for the light. Defaults to sun.sun when it exists. */
  sun?: string;
  /** `sun` (default): light follows the sun's elevation. `theme`: day or night follows the HyggeHub look. */
  lighting?: 'sun' | 'theme';
  /** URL of a GLB to show instead of the bundled island, e.g. /local/my-house.glb. */
  model?: string;
  /** Height of the scene in px. */
  height?: number;
}

type Label = { key: LabelKey; value: string; caption: string; entity?: string; icon: string; color: string; kinds?: Kind[] };

const ICONS: Record<LabelKey, string> = {
  grid: 'M12 2L7 22M12 2l5 20M7.8 9h8.4M6 15h12',
  solar: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  car: 'M5 16V12l2-5h10l2 5v4M5 16h14M3 12h18M7.5 16v2M16.5 16v2M7 13.5h1M16 13.5h1',
  home: 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5',
  bins: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  water: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
};

const WATER = '#5ec2f0';
const FLOW_COLORS: Record<FlowKey, string> = { grid: '#4aa8ff', solar: '#ffb13d', car: '#4fdc8c', water: WATER };

const watts = (kw: number) => {
  const w = Math.abs(kw) * 1000;
  return w < 1000 ? `${Math.round(w)} W` : `${(w / 1000).toFixed(w < 10000 ? 1 : 0)} kW`;
};

/** Water flow in L/min, whatever the sensor's unit. */
function litresPerMinute(e?: HassEntity): number | undefined {
  const v = numeric(e);
  if (v === undefined) return undefined;
  const u = String(e!.attributes.unit_of_measurement ?? 'L/min').toLowerCase().replace(/\s/g, '');
  if (u === 'l/h') return v / 60;
  if (u === 'm³/h' || u === 'm3/h') return (v * 1000) / 60;
  if (u === 'gal/min') return v * 3.785;
  return v;
}

/** Home Assistant weather state and attributes to what the scene draws. */
function weatherFrom(e?: HassEntity): Weather {
  const w: Weather = { clouds: 0.25, gloom: 0, rain: 0, snow: 0, fog: 0, lightning: false, wind: 3 };
  if (!e) return w;
  const s = e.state;
  const table: Record<string, Partial<Weather>> = {
    sunny: { clouds: 0.15 },
    'clear-night': { clouds: 0.1 },
    partlycloudy: { clouds: 0.5 },
    cloudy: { clouds: 0.9, gloom: 0.35 },
    fog: { clouds: 0.6, gloom: 0.3, fog: 1 },
    rainy: { clouds: 1, gloom: 0.55, rain: 0.55 },
    pouring: { clouds: 1, gloom: 0.75, rain: 1 },
    lightning: { clouds: 1, gloom: 0.85, lightning: true },
    'lightning-rainy': { clouds: 1, gloom: 0.85, rain: 0.8, lightning: true },
    snowy: { clouds: 0.85, gloom: 0.3, snow: 0.8 },
    'snowy-rainy': { clouds: 1, gloom: 0.5, snow: 0.45, rain: 0.35 },
    hail: { clouds: 1, gloom: 0.6, rain: 0.5, snow: 0.35 },
    windy: { clouds: 0.45 },
    'windy-variant': { clouds: 0.7, gloom: 0.2 },
    exceptional: { clouds: 0.8, gloom: 0.6 },
  };
  Object.assign(w, table[s] ?? {});
  const speed = Number(e.attributes.wind_speed);
  if (isFinite(speed)) {
    const unit = String(e.attributes.wind_speed_unit ?? 'km/h').toLowerCase();
    w.wind = unit === 'm/s' ? speed : unit === 'mph' ? speed * 0.447 : unit === 'kn' ? speed * 0.514 : speed / 3.6;
  }
  if (s === 'windy' || s === 'windy-variant') w.wind = Math.max(w.wind, 12);
  w.windBearing = bearing(e.attributes.wind_bearing);
  const temp = Number(e.attributes.temperature);
  if (isFinite(temp)) w.temperature = temp;
  return w;
}

/** HA reports wind bearing as degrees, or as a compass point on some integrations. */
const POINTS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
function bearing(v: unknown): number | undefined {
  if (v === null || v === undefined || v === '') return undefined;
  const n = Number(v);
  if (isFinite(n)) return n;
  const i = POINTS.indexOf(String(v).toUpperCase());
  return i >= 0 ? i * 22.5 : undefined;
}

const on = (e?: HassEntity) => !!e && ['on', 'true', 'charging', 'plugged', 'connected', 'yes'].includes(e.state.toLowerCase());

export class HyggeEnergy3dCard extends HyggeCard<Energy3dCardConfig> {
  static getStubConfig() {
    return { solar: 'sensor.solar_power', grid: 'sensor.grid_power' };
  }

  private island?: IslandScene;
  private loading?: Promise<void>;
  private fallback?: HTMLElement & { setConfig(c: unknown): void; hass?: unknown };
  private failed = false;
  private visible = true;
  private disposeTimer?: number;
  private resizer?: ResizeObserver;
  private seen?: IntersectionObserver;
  private onEngine = () => this.pushState();
  private ticker?: number;

  protected override validateConfig(c: Energy3dCardConfig) {
    if (!c.grid) throw new Error('Set at least the `grid` power sensor.');
  }

  protected override watchedEntities() {
    const c = this.config;
    const car = c.car ?? {};
    return [c.solar, c.grid, c.grid_export, c.home, c.water, this.weatherId(), this.sunId(), car.battery, car.charging, car.charging_power, car.plugged, c.driveway_lights, ...(c.extras ?? []).map(e => e.entity)];
  }

  override getCardSize() {
    return 7;
  }

  override connectedCallback() {
    super.connectedCallback();
    clearTimeout(this.disposeTimer);
    engine.addEventListener('change', this.onEngine);
    if (this.island) this.resume();
    // Hourly: "tomorrow" becomes "today", and the bins go out and come back, with no entity changing.
    this.ticker = window.setInterval(() => this.requestUpdate(), 60 * 60_000);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    engine.removeEventListener('change', this.onEngine);
    clearInterval(this.ticker);
    this.island?.stop();
    // Home Assistant detaches cards when switching views and may bring them straight back. Keep the
    // WebGL context for a while, but not forever: browsers allow only a handful at once.
    this.disposeTimer = window.setTimeout(() => {
      this.resizer?.disconnect();
      this.seen?.disconnect();
      this.island?.dispose();
      this.island = undefined;
      this.loading = undefined;
    }, 30_000);
  }

  // Both default to what a standard Home Assistant install already has, worked out from the home's
  // location: sun.sun, and the weather entity onboarding creates (Met.no's weather.forecast_home).
  private sunId(): string | undefined {
    const c = this.config;
    if (c.lighting === 'theme') return undefined;
    return c.sun ?? (this.hass?.states['sun.sun'] ? 'sun.sun' : undefined);
  }

  private weatherId(): string | undefined {
    const c = this.config;
    if (c.weather) return c.weather;
    const ids = Object.keys(this.hass?.states ?? {}).filter(id => id.startsWith('weather.'));
    return ids.includes('weather.forecast_home') ? 'weather.forecast_home' : ids.sort()[0];
  }

  // ---------- reading the entities ----------

  private readings() {
    const c = this.config;
    const solar = powerKw(this.stateOf(c.solar)) ?? 0;
    const grid = (powerKw(this.stateOf(c.grid)) ?? 0) - (powerKw(this.stateOf(c.grid_export)) ?? 0);
    const home = powerKw(this.stateOf(c.home)) ?? Math.max(0, solar + grid);
    const water = litresPerMinute(this.stateOf(c.water));
    return { solar, grid, home, water, car: this.carReading() };
  }

  private carReading() {
    const car = this.config.car;
    if (!car) return null;
    const kw = powerKw(this.stateOf(car.charging_power));
    const charging = car.charging ? on(this.stateOf(car.charging)) : (kw ?? 0) > 0.05;
    const plugged = charging || on(this.stateOf(car.plugged));
    return { soc: numeric(this.stateOf(car.battery)), kw: charging ? kw : undefined, charging, plugged };
  }

  private labels(): Label[] {
    const c = this.config;
    const r = this.readings();
    const out: Label[] = [
      { key: 'grid', value: watts(r.grid), caption: r.grid < -0.02 ? 'Exporting' : 'Grid', entity: c.grid, icon: ICONS.grid, color: 'var(--hh-accent)' },
    ];
    if (c.solar) out.push({ key: 'solar', value: watts(r.solar), caption: 'Solar', entity: c.solar, icon: ICONS.solar, color: 'var(--hh-warm)' });
    out.push({ key: 'home', value: watts(r.home), caption: 'Load', entity: c.home, icon: ICONS.home, color: 'var(--hh-ink)' });
    if (r.car) {
      const name = c.car?.name ?? 'Car';
      out.push({
        key: 'car',
        value: r.car.soc !== undefined ? `${Math.round(r.car.soc)}%` : name,
        caption: r.car.charging ? (r.car.kw ? `Charging ${watts(r.car.kw)}` : 'Charging') : r.car.plugged ? 'Plugged in' : name,
        entity: c.car?.battery ?? c.car?.charging,
        icon: ICONS.car,
        color: r.car.charging ? 'var(--hh-ok)' : 'var(--hh-ink-2)',
      });
    }
    const pickup = this.nextPickup();
    if (pickup)
      out.push({
        key: 'bins',
        value: pickup.when,
        caption: pickup.caption,
        icon: ICONS.bins,
        color: pickup.kinds[0]?.color ?? 'var(--hh-ink-2)',
        kinds: pickup.kinds,
      });
    if (c.water && r.water !== undefined) out.push({ key: 'water', value: `${r.water < 10 ? r.water.toFixed(1) : Math.round(r.water)} L/min`, caption: 'Water', entity: c.water, icon: ICONS.water, color: WATER });
    return out;
  }

  private sceneState(): SceneState {
    const c = this.config;
    const r = this.readings();
    const css = getComputedStyle(this);
    const v = (name: string, d: string) => css.getPropertyValue(name).trim() || d;
    const speed = (kw: number) => (Math.abs(kw) > 0.02 ? Math.sign(kw) * (1.2 + Math.min(Math.abs(kw), 8) * 0.7) : 0);

    const flows: Record<FlowKey, number | null> = {
      grid: speed(r.grid),
      solar: c.solar ? speed(Math.max(0, r.solar)) : null,
      // The car's route runs car → house; charging runs it backwards, out to the car.
      car: !r.car?.plugged ? null : r.car.charging ? -speed(Math.max(r.car.kw ?? 3.7, 0.1)) : 0,
      water: c.water ? (r.water && r.water > 0.05 ? 0.7 + Math.min(r.water, 20) * 0.08 : 0) : null,
    };

    let night = engine.resolved?.slot === 'night' ? 1 : 0;
    let sun: SceneState['sun'];
    const sunE = this.stateOf(this.sunId());
    if (sunE) {
      const el = Number(sunE.attributes.elevation);
      const az = Number(sunE.attributes.azimuth);
      if (isFinite(el)) {
        // Full day above 6°, full night below -6°, dusk in between.
        night = Math.min(1, Math.max(0, (6 - el) / 12));
        if (isFinite(az)) sun = { elevation: el, azimuth: az };
      } else night = sunE.state === 'below_horizon' ? 1 : 0;
    }

    return {
      flows,
      // The flows keep their own bright colours: they glow, and a dark theme accent would not.
      colors: FLOW_COLORS,
      night,
      sun,
      facing: c.facing ?? 180,
      weather: weatherFrom(this.stateOf(this.weatherId())),
      car: r.car
        ? {
            color: carColour(c.car?.color),
            plugged: r.car.plugged,
            charging: r.car.charging,
            ledColor: r.car.charging ? v('--hh-ok', '#4caf50') : r.car.plugged ? v('--hh-accent', '#2f6e86') : '#8a949b',
          }
        : null,
      hidden: c.solar ? [] : ['solar'],
      bins: this.binRounds(),
      driveLights: c.driveway_lights ? (on(this.stateOf(c.driveway_lights)) ? 1 : 0) : night > 0.5 ? 1 : 0,
      motion: engine.motionOn,
      fogColor: v('--hh-bg', '#dce3e5'),
    };
  }

  // ---------- the scene ----------

  protected override firstUpdated() {
    void this.init();
  }

  protected override updated(changed: PropertyValues) {
    super.updated(changed);
    if (this.fallback) this.fallback.hass = this.hass;
    this.pushState();
  }

  /** The next collection: when, what, and whether the bins should be out. */
  private nextPickup() {
    if (!this.config.bins?.schedule?.length) return undefined;
    const next = pickups(this.config.bins)[0];
    if (!next) return undefined;
    const n = daysFromToday(next.day);
    const when =
      n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : n < 7 ? next.day.toLocaleDateString(lang(this.hass), { weekday: 'long' }) : `In ${n} days`;
    const kinds = next.bins.flatMap(b => b.kinds).filter((k, i, all) => all.findIndex(x => x.name === k.name) === i);
    return {
      when,
      caption: n === 1 ? 'Put out tonight' : n === 0 ? 'Collection day' : n < 7 ? `In ${n} days` : next.day.toLocaleDateString(lang(this.hass), { day: 'numeric', month: 'short' }),
      kinds,
    };
  }

  /** Each round's bin for the model, in schedule order: its two compartments' colours, and whether it is out. */
  private binRounds(): SceneState['bins'] {
    const src = this.config.bins;
    if (!src?.schedule?.length) return null;
    const all = pickups(src);
    return src.schedule.map(round => {
      const next = all.find(p => p.bins.some(b => b.name === round.name));
      const bin = next?.bins.find(b => b.name === round.name);
      // Each compartment takes the colour of the first waste it names ("Papir/Pap og Glas": paper, glass);
      // a name without compartments spreads its kinds over the two lids.
      const parts = compartments(round.name);
      const colors = parts.length > 1 ? parts.map(part => kindsIn(src, part)[0].color) : (bin?.kinds.map(k => k.color) ?? ['#6b777d']);
      const n = next ? daysFromToday(next.day) : -1;
      return {
        colors: [colors[0], colors[1] ?? colors[0]],
        // Out the evening before and through the morning of collection day.
        out: (n === 1 && new Date().getHours() >= 17) || (n === 0 && new Date().getHours() < 14),
      };
    });
  }

  private pushState() {
    if (this.island && this.config) this.island.setState(this.sceneState());
  }

  private init(): Promise<void> {
    return (this.loading ??= (async () => {
      const canvas = this.renderRoot.querySelector('canvas');
      if (!canvas) return;
      try {
        const { IslandScene, DEFAULT_MODEL } = await import('./energy-3d/scene');
        const island = new IslandScene(canvas, l => this.placeLabels(l), Math.min(window.devicePixelRatio || 1, 2));
        await island.load(this.config.model ?? DEFAULT_MODEL);
        this.island = island;
      } catch (err) {
        console.warn('HyggeHub: 3D energy card unavailable, showing the flat one', err);
        this.useFallback();
        return;
      }
      const stage = canvas.parentElement!;
      this.resizer = new ResizeObserver(() => {
        // Narrow cards (phones, a third of a tablet) drop the captions so the labels cover less of the scene.
        stage.classList.toggle('compact', stage.clientWidth < 440);
        this.island?.resize(stage.clientWidth, stage.clientHeight);
      });
      this.resizer.observe(stage);
      this.island.resize(stage.clientWidth, stage.clientHeight);
      this.seen = new IntersectionObserver(entries => {
        this.visible = entries.some(e => e.isIntersecting);
        this.resume();
      });
      this.seen.observe(this);
      this.pushState();
      this.resume();
      stage.classList.add('ready');
    })());
  }

  private resume() {
    if (!this.island) {
      if (this.isConnected && !this.failed) void this.init();
      return;
    }
    if (this.visible && this.isConnected && engine.motionOn) this.island.start();
    else {
      this.island.stop();
      this.island.renderOnce();
    }
  }

  private useFallback() {
    this.failed = true;
    const el = document.createElement('hyggehub-energy-card') as NonNullable<typeof this.fallback>;
    el.setConfig({ ...this.config, type: 'custom:hyggehub-energy-card' });
    el.hass = this.hass;
    this.fallback = el;
    this.requestUpdate();
  }

  private placeLabels(labels: LabelPosition[]) {
    for (const l of labels) {
      const el = this.renderRoot.querySelector<HTMLElement>(`.tag[data-key="${l.key}"]`);
      if (!el) continue;
      el.style.transform = `translate(${l.x}px, ${l.y}px) translate(-50%, -50%)`;
      el.classList.toggle('off', !l.visible);
    }
  }

  // ---------- render ----------

  protected override render() {
    if (this.fallback) return html`${this.fallback}`;
    const c = this.config;
    const r = this.readings();
    const selfShare = r.home > 0 ? Math.round(Math.max(0, Math.min(1, 1 - Math.max(r.grid, 0) / r.home)) * 100) : 100;
    const labels = this.labels();
    return html`
      <ha-card class="glass">
        <div class="stage" style="height:${c.height ?? 340}px">
          <canvas role="img" aria-label=${labels.map(l => `${l.caption} ${l.value}`).join(', ')}></canvas>
          <div class="loading" aria-hidden="true"></div>
          ${labels.map(
            l => html`<button type="button" class="tag" data-key=${l.key} @click=${() => this.moreInfo(l.entity)} ?disabled=${!l.entity}>
              <span class="ic" style="color:${l.color}"><svg viewBox="0 0 24 24" class="i"><path d=${l.icon}></path></svg></span>
              <span class="txt"><b class="num">${l.value}</b><small>${l.caption}</small></span>
              ${l.kinds?.length
                ? html`<span class="kinds">${l.kinds.map(k => html`<span class="kind" style="--c:${k.color}" title=${k.name}>${haIcon(k.icon)}</span>`)}</span>`
                : nothing}
            </button>`,
          )}
        </div>
        <div class="card-h overlay">
          <h3>${c.title ?? 'Energy'}</h3>
          <span class="pill"><span class="dot"></span>Self-sufficient ${selfShare}%</span>
        </div>
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
      ha-card.glass {
        padding: 0;
      }
      .stage {
        position: relative;
        overflow: hidden;
        touch-action: pan-y;
        border-radius: inherit;
      }
      canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        display: block;
        cursor: grab;
        opacity: 0;
        transition: opacity 0.8s var(--ease);
      }
      canvas:active {
        cursor: grabbing;
      }
      .ready canvas {
        opacity: 1;
      }
      .loading {
        position: absolute;
        inset: 30% 30%;
        border-radius: 50%;
        background: radial-gradient(closest-side, var(--hh-accent-soft), transparent);
        animation: pulse 1.6s ease-in-out infinite;
      }
      .ready .loading {
        display: none;
      }
      @keyframes pulse {
        50% {
          opacity: 0.4;
          transform: scale(0.9);
        }
      }
      .overlay {
        position: absolute;
        top: 16px;
        left: 18px;
        right: 18px;
        pointer-events: none;
      }
      .overlay .pill {
        pointer-events: auto;
      }
      .pill .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--hh-ok);
      }
      .tag {
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 4px 11px 4px 4px;
        border-radius: 999px;
        background: var(--hh-glass-strong);
        -webkit-backdrop-filter: blur(14px) saturate(160%);
        backdrop-filter: blur(14px) saturate(160%);
        border: 1px solid var(--hh-stroke);
        box-shadow: var(--hh-shadow);
        text-align: left;
        opacity: 0;
        transition: opacity 0.4s;
        will-change: transform;
      }
      .ready .tag {
        opacity: 1;
      }
      .ready .tag.off {
        opacity: 0;
      }
      .tag[disabled] {
        cursor: default;
      }
      .ic {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: color-mix(in srgb, currentColor 16%, transparent);
      }
      .ic svg.i {
        width: 16px;
        height: 16px;
      }
      .txt {
        display: flex;
        flex-direction: column;
        line-height: 1.1;
      }
      .txt b {
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
      }
      .txt small {
        font-size: 9.5px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--hh-ink-3);
        white-space: nowrap;
      }
      .kinds {
        display: flex;
        gap: 3px;
        margin-left: 2px;
      }
      .kind {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        color: #fff;
        background: var(--c);
        --mdc-icon-size: 13px;
      }
      .compact .kind {
        width: 18px;
        height: 18px;
        --mdc-icon-size: 11px;
      }
      .compact .tag {
        padding-right: 9px;
        gap: 5px;
      }
      .compact .ic {
        width: 20px;
        height: 20px;
      }
      .compact .ic svg.i {
        width: 13px;
        height: 13px;
      }
      .compact .txt b {
        font-size: 12px;
      }
      .compact .txt small {
        display: none;
      }
      .extras {
        display: grid;
        gap: 8px;
        padding: 0 14px 14px;
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

registerCard('hyggehub-energy-3d-card', HyggeEnergy3dCard, 'HyggeHub Energy 3D', 'A floating island home with live power and water flows, weather and day/night light.');
