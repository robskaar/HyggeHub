import { html, nothing, type PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { registerCard, HyggeCard } from '../shared/base-card';
import { compartments, daysFromToday, kindsIn, pickups, type BinsSource, type Kind } from '../shared/bins';
import { haIcon } from '../shared/icons';
import { lang, numeric, powerKw } from '../shared/format';
import { hourSpan, readMeters, type MeterHour, type WaterHour } from '../shared/meters';
import { carColour } from '../shared/car';
import { base, glass } from '../shared/styles';
import { worldStyles } from './energy-3d/world-styles';
import { engine } from '../theme/engine';
import type { CardConfig, HassEntity } from '../types';
import type { EnergyCardConfig } from './energy-card';
import type { FlowKey, IslandScene, LabelKey, LabelPosition, SceneState, Weather } from './energy-3d/scene';
import './energy-card';
import './alarm-card';
import type { AlarmCardConfig } from './alarm-card';

export interface Energy3dCardConfig extends CardConfig, Pick<EnergyCardConfig, 'title' | 'solar' | 'grid' | 'grid_export' | 'home' | 'extras'> {
  /** Water flow sensor (L/min, L/h or m³/h). Draws the water line from the meter. */
  water?: string;
  /**
   * Without a live `grid` power sensor: meters (kWh, with long-term statistics, as on the usage card).
   * The card shows the newest hour with readings as averages, e.g. "380 W · Grid 11–12". With bought,
   * sold and produced all metered it also works out home use. A live `grid` sensor wins when both are set;
   * then `solar` should be live too, since an hour-old meter and a live sensor don't add up.
   */
  grid_meter?: string;
  grid_export_meter?: string;
  /** Solar production meter (kWh), e.g. a separate production metering point. */
  solar_meter?: string;
  /** Without a live `water` flow sensor: the water meter (m³ or L), read the same way. */
  water_meter?: string;
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
  /**
   * Alarm panel: its state shows at the front door, and tapping it opens the alarm card to arm or disarm.
   * The entity alone, or the alarm card's own settings (entity, modes, exit_delay, sensors...).
   */
  alarm?: string | (Partial<AlarmCardConfig> & { entity: string });
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
  /** Set by the home card: fill the space given, no card chrome or title. */
  embedded?: boolean;
}

type EmbeddedCard = HTMLElement & { setConfig(c: unknown): void; hass?: unknown };

type Label = { key: LabelKey; value: string; caption: string; entity?: string; icon: string; color: string; kinds?: Kind[] };

const ICONS: Record<LabelKey, string> = {
  grid: 'M12 2L7 22M12 2l5 20M7.8 9h8.4M6 15h12',
  solar: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  car: 'M5 16V12l2-5h10l2 5v4M5 16h14M3 12h18M7.5 16v2M16.5 16v2M7 13.5h1M16 13.5h1',
  home: 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5',
  bins: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  alarm: 'M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z',
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

const ALARM_STATES: Record<string, string> = {
  disarmed: 'Disarmed',
  armed_home: 'Armed home',
  armed_away: 'Armed away',
  armed_night: 'Armed night',
  armed_vacation: 'Armed holiday',
  armed_custom_bypass: 'Armed custom',
  arming: 'Arming',
  pending: 'Pending',
  disarming: 'Disarming',
  triggered: 'Triggered',
};

type Forecast = { datetime: string; condition?: string; temperature?: number; templow?: number; precipitation?: number; wind_speed?: number };

const WEATHER_ICONS: Record<string, string> = {
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
  /** The newest hour of meter readings, when the card reads meters instead of live sensors. */
  @state() private meters?: { energy?: MeterHour; water?: WaterHour };
  private metersFor?: string;
  /** The label whose details are open over the scene. */
  @state() private detail?: LabelKey | 'weather';
  @state() private forecast: { hourly?: Forecast[]; daily?: Forecast[] } = {};
  @state() private forecastView: 'hourly' | 'daily' = 'hourly';
  /** The alarm card shown in the alarm details, made once and kept. */
  private alarmCard?: EmbeddedCard;
  private forecastUnsubs: Array<Promise<() => void>> = [];
  private compact = false;
  private meterTicker?: number;

  protected override validateConfig(c: Energy3dCardConfig) {
    if (!c.grid && !c.grid_meter) throw new Error('Set the `grid` power sensor, or the `grid_meter` energy meter.');
  }

  protected override watchedEntities() {
    const c = this.config;
    const car = c.car ?? {};
    return [c.solar, c.grid, c.grid_export, c.home, c.water, c.grid_meter, c.grid_export_meter, c.solar_meter, c.water_meter, this.weatherId(), this.sunId(), car.battery, car.charging, car.charging_power, car.plugged, c.driveway_lights, this.alarmId(), ...(typeof c.alarm === 'object' ? (c.alarm.sensors ?? []) : []), ...(c.extras ?? []).map(e => e.entity)];
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
    // Meters report late and in batches; look for new readings every few minutes.
    this.meterTicker = window.setInterval(() => void this.loadMeters(), 5 * 60_000);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    engine.removeEventListener('change', this.onEngine);
    clearInterval(this.ticker);
    clearInterval(this.meterTicker);
    this.unsubscribeForecast();
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

  /**
   * Live sensors first. Without a live grid sensor the electricity comes from the meters, all from the
   * same hour, so grid, solar and home use agree with each other.
   */
  private readings() {
    const c = this.config;
    const live = !!c.grid;
    const e = live ? undefined : this.meters?.energy;
    const solar = live || !c.solar_meter ? (powerKw(this.stateOf(c.solar)) ?? 0) : (e?.solar ?? 0);
    const grid = live ? (powerKw(this.stateOf(c.grid)) ?? 0) - (powerKw(this.stateOf(c.grid_export)) ?? 0) : (e?.grid ?? 0);
    const home = powerKw(this.stateOf(c.home)) ?? (live ? Math.max(0, solar + grid) : e?.home);
    const w = c.water ? undefined : this.meters?.water;
    const water = c.water ? litresPerMinute(this.stateOf(c.water)) : w ? w.litres / 60 : undefined;
    return { solar, grid, home, water, car: this.carReading(), energyHour: e?.hour, waterHour: w?.hour, metered: !live };
  }

  /** Reads the meters (the newest hour of readings) when the live sensors are missing. */
  private async loadMeters() {
    const c = this.config;
    if (!this.hass || !this.meterKey()) return;
    try {
      this.meters = await readMeters(this.hass, {
        grid: c.grid ? undefined : c.grid_meter,
        gridExport: c.grid ? undefined : c.grid_export_meter,
        solar: c.grid ? undefined : c.solar_meter,
        water: c.water ? undefined : c.water_meter,
      });
    } catch (err) {
      console.warn('HyggeHub: could not read the meter statistics', err);
    }
  }

  private meterKey(): string {
    const c = this.config;
    return [!c.grid && c.grid_meter, !c.grid && c.grid_export_meter, !c.grid && c.solar_meter, !c.water && c.water_meter].filter(Boolean).join(',');
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
    const gridName = r.grid < -0.02 ? 'Exporting' : 'Grid';
    // From meters: the hour's average, and which hour it was. Before the first reading: a dash.
    const hourly = (kw: number) => (r.metered && !r.energyHour ? '–' : watts(kw));
    const at = (name: string) => (r.metered && r.energyHour ? `${name} ${hourSpan(r.energyHour)}` : name);
    const solarMetered = r.metered && !!c.solar_meter;
    const out: Label[] = [{ key: 'grid', value: hourly(r.grid), caption: at(gridName), entity: c.grid ?? c.grid_meter, icon: ICONS.grid, color: 'var(--hh-accent)' }];
    if (c.solar || solarMetered)
      out.push({
        key: 'solar',
        value: solarMetered ? hourly(r.solar) : watts(r.solar),
        caption: solarMetered ? at('Solar') : 'Solar',
        entity: solarMetered ? c.solar_meter : c.solar,
        icon: ICONS.solar,
        color: 'var(--hh-warm)',
      });
    if (r.home !== undefined) out.push({ key: 'home', value: watts(r.home), caption: at('Load'), entity: c.home, icon: ICONS.home, color: 'var(--hh-ink)' });
    if (r.car) {
      const name = c.car?.name ?? 'Car';
      out.push({
        key: 'car',
        value: r.car.soc !== undefined ? `${Math.round(r.car.soc)}%` : name,
        caption: r.car.charging ? (r.car.kw ? `Charging ${watts(r.car.kw)}` : 'Charging') : r.car.plugged ? 'Plugged in' : r.car.soc !== undefined ? name : 'Parked',
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
    const alarm = this.stateOf(this.alarmId());
    if (alarm)
      out.push({
        key: 'alarm',
        value: ALARM_STATES[alarm.state] ?? alarm.state,
        caption: 'Alarm',
        entity: this.alarmId(),
        icon: ICONS.alarm,
        color:
          alarm.state === 'triggered'
            ? 'var(--hh-crit)'
            : alarm.state.startsWith('armed')
              ? 'var(--hh-accent)'
              : alarm.state === 'disarmed'
                ? 'var(--hh-ok)'
                : 'var(--hh-warn)',
      });
    if (c.water && r.water !== undefined) out.push({ key: 'water', value: `${r.water < 10 ? r.water.toFixed(1) : Math.round(r.water)} L/min`, caption: 'Water', entity: c.water, icon: ICONS.water, color: WATER });
    // From the water meter: the litres used in the newest hour with a reading.
    else if (!c.water && c.water_meter)
      out.push({
        key: 'water',
        value: r.waterHour && r.water !== undefined ? `${Math.round(r.water * 60)} L` : '–',
        caption: r.waterHour ? `Water ${hourSpan(r.waterHour)}` : 'Water',
        entity: c.water_meter,
        icon: ICONS.water,
        color: WATER,
      });
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
      solar: c.solar || (r.metered && c.solar_meter) ? speed(Math.max(0, r.solar)) : null,
      // The car's route runs car → house; charging runs it backwards, out to the car.
      car: !r.car?.plugged ? null : r.car.charging ? -speed(Math.max(r.car.kw ?? 3.7, 0.1)) : 0,
      water: c.water || c.water_meter ? (r.water && r.water > 0.05 ? 0.7 + Math.min(r.water, 20) * 0.08 : 0) : null,
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
      hidden: c.solar || c.solar_meter ? [] : ['solar'],
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
    if (this.alarmCard) this.alarmCard.hass = this.hass;
    const key = this.meterKey();
    if (this.hass && key && key !== this.metersFor) {
      this.metersFor = key;
      void this.loadMeters();
    }
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
      // One kind per compartment, so the two lids take their two colours.
      const colors = bin?.kinds.map(k => k.color) ?? compartments(round.name).map(part => kindsIn(src, part)[0].color);
      const n = next ? daysFromToday(next.day) : -1;
      return {
        colors: [colors[0], colors[1] ?? colors[0]],
        // Out at the kerb on collection day, all day.
        out: n === 0,
      };
    });
  }

  /** Temperature and wind from the weather entity, with an arrow pointing where the wind blows. */
  private weatherChip() {
    const e = this.stateOf(this.weatherId());
    if (!e) return nothing;
    const temp = Number(e.attributes.temperature);
    const w = weatherFrom(e);
    const unit = String(e.attributes.temperature_unit ?? '°');
    return html`<button type="button" class="weather" @click=${() => this.openDetail('weather')}>
      ${haIcon(WEATHER_ICONS[e.state] ?? 'mdi:weather-partly-cloudy')}
      ${isFinite(temp) ? html`<b class="num">${Math.round(temp)}${unit.startsWith('°') ? '°' : ` ${unit}`}</b>` : nothing}
      <span class="num">${Math.round(w.wind)} m/s</span>
      ${w.windBearing !== undefined
        ? html`<svg class="i wind" viewBox="0 0 24 24" style="transform:rotate(${w.windBearing + 180}deg)" aria-label="from ${Math.round(w.windBearing)}°"><path d="M12 19V5M6 11l6-6 6 6"></path></svg>`
        : nothing}
    </button>`;
  }

  private pushState() {
    if (this.island && this.config) this.island.setState(this.sceneState());
  }

  private init(): Promise<void> {
    return (this.loading ??= (async () => {
      const canvas = this.renderRoot.querySelector('canvas');
      if (!canvas) return;
      try {
        const { IslandScene, DEFAULT_MODEL } = await import('./energy-3d/worlds');
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
        this.compact = stage.clientWidth < 440;
        stage.classList.toggle('compact', this.compact);
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
      this.island.intro();
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
    // The flat energy card reads the same live sensors or meters.
    const el = document.createElement('hyggehub-energy-card') as NonNullable<typeof this.fallback>;
    el.setConfig({ ...this.config, type: 'custom:hyggehub-energy-card' });
    el.hass = this.hass;
    this.fallback = el;
    this.requestUpdate();
  }

  /** The camera glides in, as when the house tab opens. */
  intro() {
    this.island?.intro();
  }

  // ---------- details ----------

  private openDetail(key: LabelKey | 'weather') {
    this.detail = key;
    if (key === 'weather') {
      this.subscribeForecast();
      this.island?.focus(null);
    } else this.island?.focus(key, this.compact ? 'bottom' : 'right');
  }

  private closeDetail() {
    this.detail = undefined;
    this.island?.focus(null);
    this.unsubscribeForecast();
  }

  /** Both forecasts the integration offers, so switching hours and days is instant. */
  private subscribeForecast() {
    const id = this.weatherId();
    const s = this.stateOf(id);
    if (!s || !this.hass) return;
    this.unsubscribeForecast();
    const features = (s.attributes.supported_features as number | undefined) ?? 0;
    const kinds = [...(features & 2 ? (['hourly'] as const) : []), ...(features & 1 ? (['daily'] as const) : [])];
    if (!kinds.includes(this.forecastView as never)) this.forecastView = kinds[0] ?? 'daily';
    this.forecastUnsubs = kinds.map(kind =>
      this.hass!.connection.subscribeMessage<{ forecast: Forecast[] }>(msg => (this.forecast = { ...this.forecast, [kind]: msg.forecast ?? [] }), {
        type: 'weather/subscribe_forecast',
        entity_id: id,
        forecast_type: kind,
      }).catch(() => () => {}) as Promise<() => void>,
    );
  }

  private unsubscribeForecast() {
    for (const u of this.forecastUnsubs) u.then(f => f()).catch(() => {});
    this.forecastUnsubs = [];
  }

  private detailPanel(key: LabelKey | 'weather') {
    const w = key === 'weather' ? this.stateOf(this.weatherId()) : undefined;
    const label = key === 'weather' ? undefined : this.labels().find(l => l.key === key);
    if (!label && !w) return nothing;
    const body = key === 'weather' ? this.weatherBody() : this.detailBody(key);
    const titles: Record<LabelKey | 'weather', string> = { grid: 'Grid', solar: 'Solar', car: this.config.car?.name ?? 'Car', home: 'Home', water: 'Water', bins: 'Bins', alarm: 'Alarm', weather: 'Weather' };
    return html`<div class="panel" role="dialog" aria-label=${titles[key]} @keydown=${(e: KeyboardEvent) => e.key === 'Escape' && this.closeDetail()}>
      <div class="panel-h">
        <button type="button" class="back" @click=${() => this.closeDetail()}>
          <svg viewBox="0 0 24 24" class="i"><path d="M15 6l-6 6 6 6"></path></svg>Back
        </button>
        ${label
          ? html`<span class="ic" style="color:${label.color}"><svg viewBox="0 0 24 24" class="i"><path d=${label.icon}></path></svg></span>`
          : html`<span class="ic" style="color:var(--hh-accent)">${haIcon(WEATHER_ICONS[w!.state] ?? 'mdi:weather-partly-cloudy')}</span>`}
        <h4>${titles[key]}</h4>
      </div>
      <div class="panel-b">${body}</div>
    </div>`;
  }

  /** Now, then the hourly or daily forecast, switched with the two buttons at the top. */
  private weatherBody() {
    const e = this.stateOf(this.weatherId());
    if (!e) return nothing;
    const list = this.forecast[this.forecastView] ?? [];
    const unit = String(e.attributes.temperature_unit ?? '°');
    const deg = (v?: number) => (v === undefined || !isFinite(v) ? '–' : `${Math.round(v)}${unit.startsWith('°') ? '°' : unit}`);
    const w = weatherFrom(e);
    const both = !!this.forecast.hourly && !!this.forecast.daily;
    const label = (f: Forecast) => {
      const d = new Date(f.datetime);
      return this.forecastView === 'hourly'
        ? d.toLocaleTimeString(lang(this.hass), { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString(lang(this.hass), { weekday: 'short', day: 'numeric' });
    };
    return html`
      <div class="row"><span>Now</span><b class="num">${deg(Number(e.attributes.temperature))} · ${Math.round(w.wind)} m/s</b></div>
      ${both
        ? html`<div class="seg" role="tablist">
            ${(['hourly', 'daily'] as const).map(
              v => html`<button type="button" role="tab" aria-selected=${this.forecastView === v} @click=${() => (this.forecastView = v)}>${v === 'hourly' ? 'Hours' : 'Days'}</button>`,
            )}
          </div>`
        : nothing}
      ${list.length
        ? html`<ul class="forecast">
            ${list.slice(0, this.forecastView === 'hourly' ? 24 : 10).map(
              f => html`<li>
                <span class="num">${label(f)}</span>
                <span class="fi">${haIcon(WEATHER_ICONS[f.condition ?? ''] ?? 'mdi:weather-partly-cloudy')}</span>
                <b class="num">${deg(f.temperature)}${f.templow !== undefined ? html`<small> / ${deg(f.templow)}</small>` : nothing}</b>
                <small class="num">${f.precipitation ? `${f.precipitation} mm` : ''}</small>
              </li>`,
            )}
          </ul>`
        : html`<p class="note">Reading the forecast…</p>`}
      <button type="button" class="more" @click=${() => this.moreInfo(e.entity_id)}>History and settings</button>
    `;
  }

  private alarmId(): string | undefined {
    const a = this.config.alarm;
    return typeof a === 'string' ? a : a?.entity;
  }

  /** The alarm card itself, frameless, so arming looks and works exactly as it does on the dashboard. */
  private alarmBody() {
    const a = this.config.alarm;
    if (!a) return nothing;
    if (!this.alarmCard) {
      const el = document.createElement('hyggehub-alarm-card') as EmbeddedCard;
      try {
        el.setConfig({ type: 'custom:hyggehub-alarm-card', ...(typeof a === 'string' ? { entity: a } : a), embedded: true });
      } catch (err) {
        return html`<p class="note">${(err as Error).message}</p>`;
      }
      el.classList.add('embedded-card');
      this.alarmCard = el;
    }
    this.alarmCard.hass = this.hass;
    return html`${this.alarmCard}`;
  }

  private detailBody(key: LabelKey) {
    const c = this.config;
    const r = this.readings();
    const e = c.grid ? undefined : this.meters?.energy;
    const kwh = (v?: number) => (v === undefined ? '–' : `${v.toFixed(v < 10 ? 2 : 1)} kWh`);
    const row = (name: string, value: unknown) => html`<div class="row"><span>${name}</span><b class="num">${value}</b></div>`;
    const when = r.metered && r.energyHour ? `Hour ${hourSpan(r.energyHour)}` : 'Now';
    const share = r.home !== undefined && r.home > 0 ? Math.round(Math.max(0, Math.min(1, 1 - Math.max(r.grid, 0) / r.home)) * 100) : undefined;
    const history = (entity?: string) => (entity ? html`<button type="button" class="more" @click=${() => this.moreInfo(entity)}>History and settings</button>` : nothing);
    const metered = r.metered ? html`<p class="note">From the meters, which report a few hours late: the newest hour with readings, as an average.</p>` : nothing;

    switch (key) {
      case 'grid':
        return html`${row(when, `${watts(r.grid)} ${r.grid < -0.02 ? 'out' : 'in'}`)}
          ${e ? html`${row('Bought', kwh(e.bought))}${c.grid_export_meter ? row('Sold', kwh(e.sold)) : nothing}` : nothing}
          ${metered}${history(c.grid ?? c.grid_meter)}`;
      case 'solar':
        return html`${row(when, watts(r.solar))}
          ${e?.solar !== undefined ? row('Produced', kwh(e.solar)) : nothing}
          ${share !== undefined ? row('Own power used', `${share}%`) : nothing}
          ${metered}${history(c.solar ?? c.solar_meter)}`;
      case 'home':
        return html`${row(when, watts(r.home ?? 0))}
          ${share !== undefined ? row('Self-sufficient', `${share}%`) : nothing}
          ${row('From the grid', watts(Math.max(0, r.grid)))}
          ${c.solar || c.solar_meter ? row('From solar', watts(Math.max(0, Math.min(r.solar, r.home ?? 0)))) : nothing}
          ${metered}${history(c.home)}`;
      case 'water':
        return html`${r.metered || !c.water
          ? row(r.waterHour ? `Hour ${hourSpan(r.waterHour)}` : 'Last hour', r.water !== undefined ? `${Math.round(r.water * 60)} L` : '–')
          : row('Now', r.water !== undefined ? `${r.water.toFixed(1)} L/min` : '–')}
          ${history(c.water ?? c.water_meter)}`;
      case 'car': {
        const car = r.car;
        const cc = c.car ?? {};
        if (!car || (car.soc === undefined && !cc.charging && !cc.plugged))
          return html`<p class="note">Parked. Add <code>battery</code>, <code>charging</code>, <code>charging_power</code> and <code>plugged</code> under <code>car:</code> to see the battery and charging here.</p>`;
        return html`${car.soc !== undefined ? row('Battery', `${Math.round(car.soc)}%`) : nothing}
          ${row('Status', car.charging ? 'Charging' : car.plugged ? 'Plugged in' : 'Not plugged in')}
          ${car.charging && car.kw ? row('Charging at', watts(car.kw)) : nothing}
          ${history(cc.battery ?? cc.charging)}`;
      }
      case 'alarm':
        return this.alarmBody();
      case 'bins': {
        const all = c.bins?.schedule?.length ? pickups(c.bins).slice(0, 6) : [];
        const day = (d: Date) => {
          const n = daysFromToday(d);
          return n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : d.toLocaleDateString(lang(this.hass), { weekday: 'long', day: 'numeric', month: 'short' });
        };
        return html`<ul class="pickups">
          ${all.map(
            p => html`<li>
              <div class="when"><b>${day(p.day)}</b><small class="num">${daysFromToday(p.day) > 1 ? `in ${daysFromToday(p.day)} days` : ''}</small></div>
              ${p.bins.map(
                b => html`<div class="bin">
                  <span class="kinds">${b.kinds.map(k => html`<span class="kind" style="--c:${k.color}" title=${k.name}>${haIcon(k.icon)}</span>`)}</span>
                  <span>${b.name}</span>
                </div>`,
              )}
            </li>`,
          )}
        </ul>`;
      }
    }
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
    const selfShare = r.home === undefined ? undefined : r.home > 0 ? Math.round(Math.max(0, Math.min(1, 1 - Math.max(r.grid, 0) / r.home)) * 100) : 100;
    const labels = this.labels();
    return html`
      <ha-card class=${classMap({ glass: true, embedded: !!c.embedded })}>
        <div class=${classMap({ stage: true, focused: !!this.detail })} style=${c.embedded ? 'height:100%' : `height:${c.height ?? 340}px`}>
          <canvas role="img" aria-label=${labels.map(l => `${l.caption} ${l.value}`).join(', ')}></canvas>
          <div class="loading" aria-hidden="true"></div>
          ${labels.map(
            l => html`<button type="button" class="tag" data-key=${l.key} @click=${() => this.openDetail(l.key)} aria-haspopup="dialog">
              <span class="ic" style="color:${l.color}"><svg viewBox="0 0 24 24" class="i"><path d=${l.icon}></path></svg></span>
              <span class="txt"><b class="num">${l.value}</b><small>${l.caption}</small></span>
              ${l.kinds?.length
                ? html`<span class="kinds">${l.kinds.map(k => html`<span class="kind" style="--c:${k.color}" title=${k.name}>${haIcon(k.icon)}</span>`)}</span>`
                : nothing}
            </button>`,
          )}
          ${this.detail ? this.detailPanel(this.detail) : nothing}
        </div>
        <div class="card-h overlay">
          <div class="title">
            ${c.embedded ? nothing : html`<h3>${c.title ?? 'Energy'}</h3>`}
            ${this.weatherChip()}
          </div>
          ${r.metered
            ? html`<span class="pill">${selfShare !== undefined ? html`<span class="dot"></span>${selfShare}% own · ` : nothing}${r.energyHour ? hourSpan(r.energyHour) : 'Reading meters…'}</span>`
            : selfShare !== undefined
              ? html`<span class="pill"><span class="dot"></span>Self-sufficient ${selfShare}%</span>`
              : nothing}
        </div>
        ${c.extras?.length
          ? html`<div class="extras num" style="grid-template-columns:repeat(${Math.min(3, c.extras.length)},1fr)">
              ${c.extras.slice(0, 3).map(e => html`<button type="button" @click=${() => this.moreInfo(e.entity)}><small>${e.name}</small><b>${this.format(e.entity)}</b></button>`)}
            </div>`
          : nothing}
      </ha-card>
    `;
  }

  static override styles = [base, glass, worldStyles];

}

registerCard('hyggehub-energy-3d-card', HyggeEnergy3dCard, 'HyggeHub Energy 3D', 'A floating island home with live power and water flows, weather and day/night light.');
