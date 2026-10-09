// Dev page for the 3D energy card: the card at two widths against a small mock `hass`, with controls
// for every input the scene reacts to.
import * as mdi from '@mdi/js';
import type { HassEntity, HomeAssistant } from '../src/types';
import { engine } from '../src/theme/engine';
import '../src/cards/energy-3d-card';

class MockHaCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = '<style>:host{display:block}</style><slot></slot>';
  }
}
if (!customElements.get('ha-card')) customElements.define('ha-card', MockHaCard);
class MockHaIcon extends HTMLElement {
  set icon(v: string) {
    const key = 'mdi' + v.replace(/^mdi:/, '').replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());
    const d = (mdi as Record<string, string>)[key] ?? mdi.mdiHelpCircleOutline;
    this.style.display = 'inline-flex';
    this.innerHTML = `<svg viewBox="0 0 24 24" style="width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px);fill:currentColor"><path d="${d}"/></svg>`;
  }
}
if (!customElements.get('ha-icon')) customElements.define('ha-icon', MockHaIcon);

// Collections: the next Rest/Mad round is `binsIn` days from now.
let binsIn = 1;
const day = (n: number) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
};
const WEEKDAY = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const weekday = (n: number) => WEEKDAY[new Date(Date.now() + n * 864e5).getDay()];
// Like the real rounds: Rest/Mad fortnightly, Papir/Pap/Glas and Plast/Metal four-weekly, alternating.
const schedule = () => ({
  schedule: [
    { name: 'Rest og Mad', day: weekday(binsIn), every_weeks: 2, first: day(binsIn) },
    { name: 'Papir/Pap og Glas', day: weekday(binsIn + 4), every_weeks: 4, first: day(binsIn + 4) },
    { name: 'Plast og Metal', day: weekday(binsIn + 18), every_weeks: 4, first: day(binsIn + 18) },
  ],
});

const now = new Date().toISOString();
const ent = (entity_id: string, state: string, attributes: Record<string, any> = {}): HassEntity => ({ entity_id, state, attributes, last_changed: now, last_updated: now });

const states: Record<string, HassEntity> = {};
const put = (e: HassEntity) => (states[e.entity_id] = e);
[
  ent('sensor.solar_power', '1820', { unit_of_measurement: 'W' }),
  ent('sensor.grid_power', '410', { unit_of_measurement: 'W' }),
  ent('sensor.id5_battery', '64', { unit_of_measurement: '%' }),
  ent('sensor.id5_charging_power', '7200', { unit_of_measurement: 'W' }),
  ent('binary_sensor.id5_charging', 'on'),
  ent('binary_sensor.id5_plugged', 'on'),
  ent('sensor.water_flow', '0', { unit_of_measurement: 'L/min' }),
  ent('sensor.el_energi_dashboard', '18234.5', { unit_of_measurement: 'kWh', device_class: 'energy' }),
  ent('sensor.el_eksport_energi_dashboard', '6120.2', { unit_of_measurement: 'kWh', device_class: 'energy' }),
  ent('sensor.koldt_vand_energi_dashboard', '412.3', { unit_of_measurement: 'm³', device_class: 'water' }),
  ent('sensor.virtuel_el_eksport_energi_dashboard', '9120.4', { unit_of_measurement: 'kWh', device_class: 'energy' }),
  ent('weather.forecast_home', 'partlycloudy', { temperature: 6, wind_speed: 4, wind_speed_unit: 'm/s', wind_bearing: 270 }),
  ent('light.driveway', 'off'),
  ent('sun.sun', 'above_horizon', { elevation: 32, azimuth: 160 }),
  ent('sensor.solar_energy_today', '6.4', { unit_of_measurement: 'kWh' }),
  ent('sensor.spot_price', '1.12', { unit_of_measurement: 'kr/kWh' }),
].forEach(put);

// Hourly meter readings like Målerportal's: in kWh and m³, arriving a few hours late.
function statistics(msg: { start_time: string; end_time: string; statistic_ids: string[] }) {
  const lag = 3 * 36e5;
  const start = new Date(msg.start_time).getTime();
  const end = Math.floor((new Date(msg.end_time).getTime() - lag) / 36e5) * 36e5;
  const out: Record<string, Array<{ start: number; end: number; change: number }>> = {};
  for (const id of msg.statistic_ids) {
    out[id] = [];
    for (let t = Math.ceil(start / 36e5) * 36e5; t < end; t += 36e5) {
      const h = new Date(t).getHours();
      // Solar production peaks at noon; export is what the house doesn't use of it.
      const made = Math.max(0, Math.sin(((h - 6) / 14) * Math.PI)) * 2.4;
      const used = 0.35 + (h % 4) * 0.1;
      const change = id.includes('vand') ? 0.012 + (h % 3) * 0.01 : id.includes('virtuel') ? made : id.includes('eksport') ? Math.max(0, made - used) : Math.max(0.05, used - made);
      out[id].push({ start: t, end: t + 36e5, change });
    }
  }
  return out as any;
}

const consumers: Array<HTMLElement & { hass?: HomeAssistant }> = [];
function publish() {
  const hass = {
    states: { ...states },
    user: { id: 'dev', name: 'Dev', is_admin: true },
    themes: { darkMode: false },
    language: 'en-GB',
    locale: { language: 'en-GB' },
    connection: { subscribeMessage: async () => () => {} },
    callService: async () => ({}),
    callWS: async (msg: any) => (msg.type === 'recorder/statistics_during_period' ? statistics(msg) : ({ value: null } as any)),
    hassUrl: (p = '') => p,
  } as HomeAssistant;
  consumers.forEach(c => (c.hass = hass));
}
const set = (id: string, state: string, attrs: Record<string, any> = {}) => {
  states[id] = { ...states[id], state, attributes: { ...states[id].attributes, ...attrs } };
  publish();
};

const config = {
  type: 'custom:hyggehub-energy-3d-card',
  solar: 'sensor.solar_power',
  grid: 'sensor.grid_power',
  water: 'sensor.water_flow',
  // No weather: the card picks weather.forecast_home by itself, as on a standard install.
  driveway_lights: 'light.driveway',
  bins: schedule(),
  car: {
    name: 'ID.5',
    battery: 'sensor.id5_battery',
    charging: 'binary_sensor.id5_charging',
    charging_power: 'sensor.id5_charging_power',
    plugged: 'binary_sensor.id5_plugged',
    color: 'white',
  },
};
function mount(parent: string, extra: Record<string, unknown> = {}) {
  const el = document.createElement('hyggehub-energy-3d-card') as HTMLElement & { setConfig(c: unknown): void; hass?: HomeAssistant };
  el.setConfig({ ...config, ...extra });
  consumers.push(el);
  document.getElementById(parent)!.appendChild(el);
}
publish();
mount('wide', { height: 420, extras: [{ name: 'Solar today', entity: 'sensor.solar_energy_today' }, { name: 'Spot price', entity: 'sensor.spot_price' }] });
mount('narrow', { height: 300, title: 'Phone width' });
// Meters only, like a home with Målerportal and no live power sensor.
mount('narrow', {
  height: 300,
  title: 'Meters only',
  grid: undefined,
  solar: undefined,
  water: undefined,
  grid_meter: 'sensor.el_energi_dashboard',
  grid_export_meter: 'sensor.el_eksport_energi_dashboard',
  solar_meter: 'sensor.virtuel_el_eksport_energi_dashboard',
  water_meter: 'sensor.koldt_vand_energi_dashboard',
});
publish();

// ---------- controls ----------

const box = document.getElementById('controls')!;
const h = (t: string) => box.insertAdjacentHTML('beforeend', `<h2>${t}</h2>`);
function slider(label: string, min: number, max: number, step: number, value: number, fmt: (v: number) => string, on: (v: number) => void) {
  const l = document.createElement('label');
  l.innerHTML = `<span>${label}<b></b></span><input type="range" min="${min}" max="${max}" step="${step}" value="${value}">`;
  const input = l.querySelector('input')!;
  const out = l.querySelector('b')!;
  const apply = () => {
    out.textContent = fmt(Number(input.value));
    on(Number(input.value));
  };
  input.addEventListener('input', apply);
  out.textContent = fmt(value);
  box.appendChild(l);
}
function buttons(items: Array<[string, () => void]>) {
  const row = document.createElement('div');
  row.className = 'row';
  for (const [t, f] of items) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = t;
    b.addEventListener('click', f);
    row.appendChild(b);
  }
  box.appendChild(row);
}

const W = (v: number) => `${v} W`;
h('Power');
slider('Solar', 0, 8000, 10, 1820, W, v => set('sensor.solar_power', String(v)));
slider('Grid (− export)', -5000, 5000, 10, 410, W, v => set('sensor.grid_power', String(v)));
slider('Water', 0, 20, 0.1, 0, v => `${v} L/min`, v => set('sensor.water_flow', String(v)));

h('Car');
slider('Car battery', 0, 100, 1, 64, v => `${v}%`, v => set('sensor.id5_battery', String(v)));
slider('Charging power', 0, 11000, 100, 7200, W, v => {
  set('sensor.id5_charging_power', String(v));
  set('binary_sensor.id5_charging', v > 0 ? 'on' : 'off');
});
buttons([
  ['Charging', () => (set('binary_sensor.id5_plugged', 'on'), set('binary_sensor.id5_charging', 'on'), set('sensor.id5_charging_power', '7200'))],
  ['Plugged', () => (set('binary_sensor.id5_plugged', 'on'), set('binary_sensor.id5_charging', 'off'), set('sensor.id5_charging_power', '0'))],
  ['Unplugged', () => (set('binary_sensor.id5_plugged', 'off'), set('binary_sensor.id5_charging', 'off'), set('sensor.id5_charging_power', '0'))],
]);

h('Outside');
buttons([
  ['Driveway lights on', () => set('light.driveway', 'on')],
  ['Off', () => set('light.driveway', 'off')],
]);

h('Bins');
// A new schedule means a new config, as when the dashboard is edited.
const binsDay = (n: number) => () => {
  binsIn = n;
  document.querySelectorAll<HTMLElement & { setConfig(c: unknown): void }>('hyggehub-energy-3d-card').forEach(el =>
    el.setConfig({ ...(el as any).config, bins: schedule() }),
  );
};
buttons([
  ['Today', binsDay(0)],
  ['Tomorrow', binsDay(1)],
  ['In 4 days', binsDay(4)],
]);

h('Sky');
slider('Sun elevation', -20, 60, 1, 32, v => `${v}°`, v => set('sun.sun', v > 0 ? 'above_horizon' : 'below_horizon', { elevation: v }));
slider('Sun azimuth', 60, 300, 1, 160, v => `${v}°`, v => set('sun.sun', states['sun.sun'].state, { azimuth: v }));
slider('Wind from', 0, 359, 1, 270, v => `${v}°`, v => set('weather.forecast_home', states['weather.forecast_home'].state, { wind_bearing: v }));
slider('Wind', 0, 25, 0.5, 4, v => `${v} m/s`, v => set('weather.forecast_home', states['weather.forecast_home'].state, { wind_speed: v }));
slider('Temperature', -15, 30, 1, 6, v => `${v}°C`, v => set('weather.forecast_home', states['weather.forecast_home'].state, { temperature: v }));
const weathers = ['sunny', 'partlycloudy', 'cloudy', 'fog', 'rainy', 'pouring', 'lightning-rainy', 'snowy', 'windy'];
buttons(weathers.slice(0, 3).map(w => [w, () => set('weather.forecast_home', w)]));
buttons(weathers.slice(3, 6).map(w => [w, () => set('weather.forecast_home', w)]));
buttons(weathers.slice(6).map(w => [w, () => set('weather.forecast_home', w)]));

h('Theme');
buttons([
  ['Day look', () => engine.setPreview('day')],
  ['Night look', () => engine.setPreview('night')],
  ['Auto', () => engine.setPreview('auto')],
]);

// #night / #storm / #snow presets, for screenshots.
const presets: Record<string, () => void> = {
  '#night': () => {
    set('sun.sun', 'below_horizon', { elevation: -15 });
    engine.setPreview('night');
  },
  '#dusk': () => set('sun.sun', 'above_horizon', { elevation: 1, azimuth: 250 }),
  '#storm': () => set('weather.forecast_home', 'lightning-rainy', { wind_speed: 14 }),
  '#rain': () => set('weather.forecast_home', 'rainy'),
  '#windy': () => set('weather.forecast_home', 'windy', { wind_speed: 14 }),
  '#lights': () => set('light.driveway', 'on'),
  '#snow': () => set('weather.forecast_home', 'snowy', { temperature: -4 }),
};
location.hash
  .split(/(?=#)/)
  .filter(Boolean)
  .forEach(k => presets[k]?.());
