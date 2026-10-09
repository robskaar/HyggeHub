// Dev page for the 3D energy card: the card at two widths against a small mock `hass`, with controls
// for every input the scene reacts to.
import * as mdi from '@mdi/js';
import type { HassEntity, HomeAssistant } from '../src/types';
import { engine } from '../src/theme/engine';
import '../src/cards/energy-3d-card';
import '../src/cards/home-card';

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
  ent('weather.forecast_home', 'partlycloudy', { temperature: 6, wind_speed: 4, wind_speed_unit: 'm/s', wind_bearing: 270, supported_features: 3 }),
  ent('light.driveway', 'off'),
  ent('alarm_control_panel.home', 'disarmed', { friendly_name: 'Alarm', code_format: 'number', code_arm_required: true, supported_features: 1 | 2 | 4 }),
  ent('person.alex', 'home', { friendly_name: 'Alex' }),
  ent('calendar.familien', 'off', { friendly_name: 'Familien' }),
  ent('person.sam', 'home', { friendly_name: 'Sam' }),
  ent('sensor.alex_phone_battery', '82', { unit_of_measurement: '%' }),
  ent('sensor.sam_phone_battery', '34', { unit_of_measurement: '%' }),
  ent('input_boolean.ella_asleep', 'on', { friendly_name: 'Ella asleep' }),
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

// A shared family calendar; each person's `calendar_match` picks their events out of it.
function familyEvents() {
  const at = (d: number, h: number, m = 0) => {
    const t = new Date();
    t.setDate(t.getDate() + d);
    t.setHours(h, m, 0, 0);
    return t.toISOString();
  };
  return [
    { summary: 'Robert: Padel', start: at(0, 19), end: at(0, 20, 30), location: 'Padelhuset, Sønderborg' },
    { summary: 'Mette: Planteskole', start: at(1, 10), end: at(1, 11), location: 'Plantorama' },
    { summary: 'Pelle: Fodbold', start: at(1, 16), end: at(1, 17), location: 'Stadion' },
    { summary: 'Hjalte: Vuggestue', start: at(1, 7, 30), end: at(1, 15), location: 'Mælkebøtten' },
    { summary: 'Family: Middag hos mormor', start: at(2, 17), end: at(2, 20), location: 'Mormor' },
  ];
}

const consumers: Array<HTMLElement & { hass?: HomeAssistant }> = [];
function publish() {
  const hass = {
    states: { ...states },
    user: { id: 'dev', name: 'Dev', is_admin: true },
    themes: { darkMode: false },
    language: 'en-GB',
    locale: { language: 'en-GB' },
    connection: {
      // Weather forecasts: 24 hours and 7 days of made-up but plausible weather.
      subscribeMessage: async (cb: (m: unknown) => void, msg: any) => {
        if (msg.type === 'weather/subscribe_forecast') {
          const hourly = msg.forecast_type === 'hourly';
          const conds = ['sunny', 'partlycloudy', 'cloudy', 'rainy', 'partlycloudy', 'sunny', 'snowy'];
          const forecast = Array.from({ length: hourly ? 24 : 7 }, (_, i) => ({
            datetime: new Date(Date.now() + (i + 1) * (hourly ? 36e5 : 864e5)).toISOString(),
            condition: conds[(i + (hourly ? Math.floor(i / 4) : 0)) % conds.length],
            temperature: Math.round(6 + Math.sin(i / (hourly ? 4 : 1.5)) * 4),
            templow: hourly ? undefined : Math.round(1 + Math.sin(i / 1.5) * 3),
            precipitation: i % 3 === 1 ? 1.2 : 0,
          }));
          setTimeout(() => cb({ forecast }), 50);
        }
        return () => {};
      },
    },
    callService: async () => ({}),
    callWS: async (msg: any) => {
      if (msg.type === 'recorder/statistics_during_period') return statistics(msg);
      if (msg.type === 'call_service' && msg.service === 'get_events') return { response: { 'calendar.familien': { events: familyEvents() } } } as any;
      return { value: null } as any;
    },
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
  alarm: 'alarm_control_panel.home',
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
const homeMode = location.hash.includes('home');
if (homeMode) {
  const tab = /#tab-(\w+)/.exec(location.hash)?.[1];
  if (tab) localStorage.setItem('hyggehub:home-tab', tab);
  document.querySelector<HTMLElement>('.wrap')!.style.display = 'block';
  document.querySelector<HTMLElement>('.wrap')!.style.padding = '0';
  document.querySelector<HTMLElement>('.wrap')!.style.maxWidth = 'none';
  document.querySelector<HTMLElement>('.cards')!.style.display = 'block';
  document.getElementById('controls')!.style.display = 'none';
  const home = document.createElement('hyggehub-home-card') as HTMLElement & { setConfig(c: unknown): void; hass?: HomeAssistant };
  home.setConfig({
    type: 'custom:hyggehub-home-card',
    height: '100vh',
    tabs: { house: 'Hus', people: 'Personer', countdowns: 'Countdowns' },
    house: config,
    people: [
      { entity: 'person.alex', name: 'Robert', avatar: { preset: 'man', hair: 'brown', hair_style: 'buzz', beard: 'short', eyes: 'green-brown' }, battery: 'sensor.alex_phone_battery', interests: ['cooking', 'tech'], calendar: 'calendar.familien', calendar_match: 'Robert, Family' },
      { entity: 'person.sam', name: 'Mette', avatar: { preset: 'woman', hair: 'brown', hair_style: 'long', eyes: 'blue' }, battery: 'sensor.sam_phone_battery', interests: ['gardening', 'decor'], calendar: 'calendar.familien', calendar_match: 'Mette, Family' },
      { name: 'Pelle', avatar: { preset: 'child', hair: 'brown', eyes: 'brown' }, default_location: 'home', interests: ['bugs', 'pokemon', 'nature'], calendar: 'calendar.familien', calendar_match: 'Pelle, Family' },
      { name: 'Hjalte', avatar: { preset: 'baby', hair: 'brown', eyes: 'blue' }, default_location: 'home', sleep: 'input_boolean.ella_asleep', interests: ['cars'], calendar: 'calendar.familien', calendar_match: 'Hjalte, Family' },
    ],
    countdowns: [
      { name: 'Sommerferie', icon: 'mdi:beach', target: '2027-07-01T08:00', start: '2026-08-15' },
      { name: 'Juleaften', icon: 'mdi:pine-tree', target: '2026-12-24', yearly: true },
      { name: 'Robert', icon: 'mdi:cake-variant', target: '1994-09-29', yearly: true },
      { name: 'Mette', icon: 'mdi:cake-variant', target: '1995-11-01', yearly: true },
      { name: 'Pelle', icon: 'mdi:cake-variant', target: '2021-03-12', yearly: true },
      { name: 'Hjalte', icon: 'mdi:cake-variant', target: '2025-08-20', yearly: true },
    ],
  });
  consumers.push(home);
  document.getElementById('wide')!.appendChild(home);
}
if (!homeMode) mount('wide', { height: 420, extras: [{ name: 'Solar today', entity: 'sensor.solar_energy_today' }, { name: 'Spot price', entity: 'sensor.spot_price' }] });
if (!homeMode) mount('narrow', { height: 300, title: 'Phone width' });
// Meters only, like a home with Målerportal and no live power sensor.
if (!homeMode) mount('narrow', {
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

// Dev-only: #open-bins, #open-grid... taps that label on every card once the scene has loaded, for
// screenshots of the details overlay.
const open = /#open-(\w+)/.exec(location.hash)?.[1];
if (open)
  setTimeout(() => {
    const inHome = document.querySelector('hyggehub-home-card')?.shadowRoot?.querySelectorAll('.view > * > *') ?? [];
    [...document.querySelectorAll('hyggehub-energy-3d-card'), ...inHome].forEach(card =>
      card.shadowRoot?.querySelector<HTMLButtonElement>(open === 'weather' ? '.weather' : `.tag[data-key="${open}"]`)?.click(),
    );
  }, 3500);
// Dev-only: #chip-2 picks the third person (or countdown) in a carousel, for screenshots.
const chip = /#chip-(\d+)/.exec(location.hash)?.[1];
if (chip)
  setTimeout(() => {
    const inHome = document.querySelector('hyggehub-home-card')?.shadowRoot?.querySelectorAll('.view > * > *') ?? [];
    [...inHome].forEach(card =>
      card.shadowRoot?.querySelectorAll<HTMLButtonElement>('.summary button, .dots button')[Number(chip)]?.click(),
    );
  }, 3500);
// Dev-only: #still turns animation off (as the Appearance panel's motion switch does), so screenshots
// show each scene in its settled state instead of mid-bounce.
if (location.hash.includes('still')) {
  // Again after the mock hass has loaded the saved appearance over it.
  const still = () => {
    (engine as any).appearance.motion = false;
    engine.apply(true);
  };
  still();
  [300, 1000, 2500].forEach(ms => setTimeout(still, ms));
}
