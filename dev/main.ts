// A stand-in Home Assistant for developing the cards: realistic entities, services that change them,
// and the websocket subscriptions the cards use (notifications, to-do items, forecasts, user data).
import * as mdi from '@mdi/js';
import type { HassEntity, HomeAssistant } from '../src/types';
import '../src/hyggehub';

// ---------- the two frontend elements the cards borrow from Home Assistant ----------

class MockHaCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = '<style>:host{display:block}</style><slot></slot>';
  }
}
class MockHaIcon extends HTMLElement {
  private _icon = '';
  set icon(v: string) {
    this._icon = v;
    this.paint();
  }
  get icon() {
    return this._icon;
  }
  connectedCallback() {
    this.paint();
  }
  private paint() {
    const key = 'mdi' + this._icon.replace(/^mdi:/, '').replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());
    const d = (mdi as Record<string, string>)[key] ?? mdi.mdiHelpCircleOutline;
    this.style.display = 'inline-flex';
    this.innerHTML = `<svg viewBox="0 0 24 24" style="width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px);fill:currentColor"><path d="${d}"/></svg>`;
  }
}
customElements.define('ha-card', MockHaCard);
customElements.define('ha-icon', MockHaIcon);

// ---------- entities ----------

const now = Date.now();
const iso = (ms: number) => new Date(ms).toISOString();
const ent = (entity_id: string, state: string, attributes: Record<string, any> = {}): HassEntity => ({
  entity_id,
  state,
  attributes: { friendly_name: entity_id.split('.')[1].replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()), ...attributes },
  last_changed: iso(now),
  last_updated: iso(now),
});

const states: Record<string, HassEntity> = {};
const put = (e: HassEntity) => (states[e.entity_id] = e);
[
  ent('sun.sun', 'above_horizon', { next_rising: iso(now + 20 * 36e5), next_setting: iso(now + 6 * 36e5) }),
  ent('person.alex', 'home', { friendly_name: 'Alex' }),
  { ...ent('person.sam', 'Work', { friendly_name: 'Sam' }), last_changed: iso(now - 3 * 36e5) },
  { ...ent('device_tracker.noah_watch', 'not_home', { friendly_name: 'Noah' }), last_changed: iso(now - 90 * 6e4) },
  ent('sensor.noah_watch_battery', '57', { unit_of_measurement: '%', device_class: 'battery' }),
  ent('calendar.alex', 'off', { friendly_name: 'Alex' }),
  ent('calendar.sam', 'on', { friendly_name: 'Sam', message: 'Work' }),
  ent('calendar.noah', 'on', { friendly_name: 'Noah', message: 'School' }),
  ent('calendar.ella', 'off', { friendly_name: 'Ella' }),
  ent('lock.front_door', 'locked', { friendly_name: 'Front door' }),
  ent('sensor.indoor_temperature', '21.2', { unit_of_measurement: '°C', friendly_name: 'Inside' }),
  ent('light.living_floor_lamp', 'on', { brightness: 173, friendly_name: 'Floor lamp' }),
  ent('light.living_pendant', 'on', { brightness: 200, friendly_name: 'Pendant' }),
  ent('light.living_shelf', 'off', { friendly_name: 'Shelf' }),
  ent('cover.living_blinds', 'open', { friendly_name: 'Blinds' }),
  ent('sensor.living_temperature', '21.4', { unit_of_measurement: '°C' }),
  ent('sensor.living_humidity', '42', { unit_of_measurement: '%' }),
  ent('light.bedroom_bedside', 'off', { friendly_name: 'Bedside' }),
  ent('light.bedroom_ceiling', 'off', { friendly_name: 'Ceiling' }),
  ent('fan.bedroom', 'on', { friendly_name: 'Fan' }),
  ent('cover.bedroom_blinds', 'closed', { friendly_name: 'Blinds' }),
  ent('sensor.bedroom_temperature', '18.6', { unit_of_measurement: '°C' }),
  ent('sensor.bedroom_humidity', '48', { unit_of_measurement: '%' }),
  ent('light.kitchen_island', 'on', { friendly_name: 'Island', brightness: 255 }),
  ent('light.kitchen_spots', 'off', { friendly_name: 'Spots' }),
  ent('fan.kitchen_hood', 'off', { friendly_name: 'Hood' }),
  ent('switch.kitchen_cabinet_lights', 'off', { friendly_name: 'Cabinets' }),
  ent('sensor.kitchen_temperature', '22.1', { unit_of_measurement: '°C' }),
  ent('sensor.kitchen_humidity', '39', { unit_of_measurement: '%' }),
  ent('alarm_control_panel.home', 'disarmed', { friendly_name: 'Home alarm', code_format: 'number', code_arm_required: true, supported_features: 1 | 2 | 4 | 32 }),
  ...['front_door', 'terrace_door', 'back_door', 'kitchen_window', 'living_window', 'bedroom_window', 'bathroom_window'].map(id =>
    ent(`binary_sensor.${id}`, 'off', { device_class: id.includes('door') ? 'door' : 'window' }),
  ),
  ent('sensor.id5_battery', '78', { unit_of_measurement: '%', device_class: 'battery' }),
  ent('sensor.id5_range', '312', { unit_of_measurement: 'km', friendly_name: 'Range' }),
  ent('binary_sensor.id5_charging', 'on', { device_class: 'battery_charging' }),
  ent('sensor.id5_charging_power', '7.2', { unit_of_measurement: 'kW' }),
  ent('sensor.id5_time_to_full', '45', { unit_of_measurement: 'min' }),
  ent('sensor.id5_target', '80', { unit_of_measurement: '%' }),
  ent('binary_sensor.id5_plugged', 'on', { device_class: 'plug' }),
  ent('device_tracker.id5', 'home'),
  ent('climate.id5', 'off', { friendly_name: 'Climate' }),
  ent('lock.id5', 'locked'),
  ent('sensor.id5_odometer', '23410', { unit_of_measurement: 'km' }),
  ent('sensor.el_import', '18234.5', { unit_of_measurement: 'kWh', device_class: 'energy', state_class: 'total_increasing' }),
  ent('sensor.el_export', '6120.2', { unit_of_measurement: 'kWh', device_class: 'energy', state_class: 'total_increasing' }),
  ent('sensor.water', '412.33', { unit_of_measurement: 'm³', device_class: 'water', state_class: 'total_increasing' }),
  ent('weather.home', 'snowy', { temperature: -2, apparent_temperature: -6, wind_speed: 4, wind_speed_unit: 'm/s', wind_bearing: 315, humidity: 86, supported_features: 3 }),
  ent('media_player.living_room_speaker', 'playing', {
    friendly_name: 'Living room speaker',
    media_title: 'Hoppípolla',
    media_artist: 'Sigur Rós',
    media_album_name: 'Takk…',
    media_duration: 268,
    media_position: 102,
    media_position_updated_at: iso(now),
    volume_level: 0.42,
  }),
  ent('sensor.washer_status', 'spin', { friendly_name: 'Washer' }),
  ent('sensor.washer_remaining', '12', { unit_of_measurement: 'min' }),
  ent('sensor.washer_program', 'Cottons 40° · 1200 rpm'),
  ent('sensor.solar_power', '1820', { unit_of_measurement: 'W' }),
  ent('sensor.grid_power', '410', { unit_of_measurement: 'W' }),
  ent('sensor.grid_export_power', '0', { unit_of_measurement: 'W' }),
  ent('sensor.water_today', '214', { unit_of_measurement: 'L', friendly_name: 'Water today' }),
  ent('media_player.kitchen_speaker', 'idle', { friendly_name: 'Kitchen speaker', volume_level: 0.35 }),
  ent('media_player.everywhere', 'off', { friendly_name: 'Everywhere' }),
  ent('sensor.battery_power', '-300', { unit_of_measurement: 'W' }),
  ent('sensor.battery_level', '64', { unit_of_measurement: '%' }),
  ent('sensor.solar_energy_today', '6.4', { unit_of_measurement: 'kWh' }),
  ent('sensor.spot_price', '1.12', { unit_of_measurement: '€/kWh' }),
  ent('timer.sauna', 'active', { duration: '0:18:00', finishes_at: iso(now + 18 * 6e4), friendly_name: 'Sauna' }),
  ent('sensor.sauna_temperature', '62', { unit_of_measurement: '°C' }),
  ent('todo.shopping_list', '5', { friendly_name: 'Groceries' }),
  ent('todo.chores', '3', { friendly_name: 'To do' }),
  ent('sensor.alex_phone_battery', '82', { unit_of_measurement: '%', device_class: 'battery' }),
  ent('binary_sensor.alex_phone_charging', 'off'),
  ent('sensor.alex_steps', '6412', { unit_of_measurement: 'steps', friendly_name: 'Steps today' }),
  ent('sensor.sam_phone_battery', '34', { unit_of_measurement: '%', device_class: 'battery' }),
  ent('binary_sensor.sam_phone_charging', 'on'),
  ent('sensor.sam_distance', '4.2', { unit_of_measurement: 'km' }),
  ent('sensor.sam_eta_home', iso(now + 38 * 6e4), { device_class: 'timestamp', friendly_name: 'Home in' }),
  ent('sensor.noah_pickup', iso(now + 5 * 36e5 + 20 * 6e4), { device_class: 'timestamp', friendly_name: 'Pickup' }),
  ent('sensor.noah_room_temperature', '20.8', { unit_of_measurement: '°C', friendly_name: 'Bedroom' }),
  { ...ent('input_boolean.ella_asleep', 'on', { friendly_name: 'Ella asleep' }), last_changed: iso(now - 47 * 6e4) },
  ent('sensor.nursery_temperature', '21.0', { unit_of_measurement: '°C', friendly_name: 'Nursery' }),
  ent('input_text.quick_note', 'Firewood delivery Thursday after 14:00. Guest Wi-Fi password is on the fridge.', { max: 255, friendly_name: 'Note' }),
].forEach(put);

// ---------- websocket-side data ----------

type Item = { uid: string; summary: string; status: 'needs_action' | 'completed'; due?: string; description?: string };
let uid = 0;
const it = (summary: string, status: Item['status'], extra: Partial<Item> = {}): Item => ({ uid: String(++uid), summary, status, ...extra });
const day = (n: number) => new Date(now + n * 864e5).toISOString().slice(0, 10);
const todos: Record<string, Item[]> = {
  'todo.shopping_list': [
    it('Oat milk', 'needs_action', { description: '2 L' }),
    it('Dark rye bread', 'needs_action'),
    it('Smoked salmon', 'needs_action', { description: '300 g' }),
    it('Lingonberry jam', 'needs_action', { description: '1 jar' }),
    it('Cardamom buns', 'needs_action', { description: '6 pcs' }),
    it('Milk', 'completed', { description: '1 L' }),
    it('Coffee beans', 'completed', { description: '500 g' }),
    it('Butter', 'completed', { description: '250 g' }),
    it('Eggs', 'completed', { description: '10' }),
  ],
  'todo.chores': [
    it('Book winter tyre swap', 'needs_action', { due: day(1) }),
    it('Change ventilation filter', 'needs_action', { due: day(4) }),
    it('Bleed the radiators', 'needs_action', { due: day(20) }),
    it('Order firewood', 'completed'),
    it('Clean the gutters', 'completed'),
  ],
};
const notifications: Record<string, any> = {
  laundry: { notification_id: 'laundry', title: 'Laundry is done', message: 'Cottons 40° finished in the utility room. Unload within 30 min to avoid creases.', created_at: iso(now - 2 * 6e4) },
  terrace: { notification_id: 'terrace', title: 'Terrace door open', message: "It's −2° outside and the living room heat pump is running.", created_at: iso(now - 8 * 6e4) },
  parcel: { notification_id: 'parcel', title: 'Parcel delivered', message: 'Left in the porch locker, compartment 2.', created_at: iso(now - 34 * 6e4) },
  battery: { notification_id: 'battery', title: 'Battery low', message: 'Hallway motion sensor is at 9%. It takes a CR2450 cell.', created_at: iso(now - 65 * 6e4) },
};
const conds = ['snowy', 'snowy', 'cloudy', 'cloudy', 'partlycloudy', 'sunny', 'sunny', 'partlycloudy'];
const forecast = Array.from({ length: 30 }, (_, i) => ({ datetime: iso(now + i * 36e5), condition: conds[i % conds.length], temperature: -2 + Math.round(3 * Math.sin(i / 4)) }));
const dailyConds = ['snowy', 'cloudy', 'partlycloudy', 'sunny', 'rainy', 'cloudy', 'sunny', 'partlycloudy', 'rainy', 'snowy'];
const daily = dailyConds.map((c, i) => ({ datetime: iso(now + i * 864e5), condition: c, temperature: 1 + (i % 4), templow: -4 + (i % 3) }));

const subs = new Map<string, Set<(m: any) => void>>();
const emit = (key: string, msg: any) => subs.get(key)?.forEach(cb => cb(msg));
const userKey = () => `hyggehub-dev:userdata:${user.id}`;

// ---------- hass ----------

const USERS = [
  { id: 'u-alex', name: 'Alex', is_admin: true },
  { id: 'u-sam', name: 'Sam', is_admin: false },
];
let user = USERS[0];
const darkMQ = matchMedia('(prefers-color-scheme: dark)');
let themes = { darkMode: darkMQ.matches, theme: 'default' };
darkMQ.addEventListener('change', () => {
  themes = { ...themes, darkMode: darkMQ.matches };
  publish();
});

function set(id: string, state: string, attrs: Record<string, any> = {}) {
  const old = states[id];
  states[id] = { ...old, state, attributes: { ...old.attributes, ...attrs }, last_changed: old.state !== state ? iso(Date.now()) : old.last_changed, last_updated: iso(Date.now()) };
}

const fail = (message: string) => Promise.reject(Object.assign(new Error(message), { code: 'invalid_code' }));

async function callService(domain: string, service: string, data: Record<string, any> = {}, target: Record<string, any> = {}): Promise<unknown> {
  const ids: string[] = ([] as string[]).concat(target.entity_id ?? data.entity_id ?? []);
  const flip = (id: string) => {
    const s = states[id];
    if (id.startsWith('cover.')) set(id, s.state === 'open' ? 'closed' : 'open');
    else set(id, s.state === 'on' ? 'off' : 'on');
  };
  await new Promise(r => setTimeout(r, 120));
  if (service === 'toggle') ids.forEach(flip);
  else if (domain === 'homeassistant' && (service === 'turn_on' || service === 'turn_off')) ids.forEach(id => set(id, service === 'turn_on' ? 'on' : 'off'));
  else if (domain === 'light' && service === 'turn_on') ids.forEach(id => set(id, 'on', data.brightness_pct ? { brightness: Math.round(data.brightness_pct * 2.55) } : {}));
  else if (domain === 'alarm_control_panel') {
    const id = ids[0];
    if (data.code !== '1234') return fail('Wrong code, try again');
    if (service === 'alarm_disarm') set(id, 'disarmed');
    else {
      const mode = service.replace('alarm_arm_', '');
      set(id, 'arming');
      setTimeout(() => {
        if (states[id].state === 'arming') {
          set(id, `armed_${mode}`);
          publish();
        }
      }, 10_000);
    }
  } else if (domain === 'todo') {
    const list = todos[ids[0]];
    if (service === 'add_item') list.unshift(it(data.item, 'needs_action'));
    if (service === 'update_item') {
      const i = list.findIndex(x => x.uid === data.item || x.summary === data.item);
      if (i > -1) {
        const [item] = list.splice(i, 1);
        list.unshift({ ...item, status: data.status ?? item.status });
      }
    }
    if (service === 'remove_item') todos[ids[0]] = list.filter(x => x.uid !== data.item);
    emit(`todo:${ids[0]}`, { items: todos[ids[0]] });
  } else if (domain === 'persistent_notification' && service === 'dismiss') {
    const n = notifications[data.notification_id];
    delete notifications[data.notification_id];
    emit('notifications', { type: 'removed', notifications: { [data.notification_id]: n } });
  } else if (domain === 'media_player') {
    const id = ids[0];
    const s = states[id];
    if (service === 'media_play_pause') {
      const pos = s.state === 'playing' ? s.attributes.media_position + (Date.now() - new Date(s.attributes.media_position_updated_at).getTime()) / 1000 : s.attributes.media_position;
      set(id, s.state === 'playing' ? 'paused' : 'playing', { media_position: pos, media_position_updated_at: iso(Date.now()) });
    }
    if (service === 'volume_set') set(id, s.state, { volume_level: data.volume_level });
    if (service === 'media_seek') set(id, s.state, { media_position: data.seek_position, media_position_updated_at: iso(Date.now()) });
    if (service === 'media_next_track' || service === 'media_previous_track') set(id, s.state, { media_position: 0, media_position_updated_at: iso(Date.now()) });
  } else if (service === 'set_value') ids.forEach(id => set(id, data.value));
  publish();
  return undefined;
}

const connection = {
  async subscribeMessage<T>(cb: (m: T) => void, msg: Record<string, any>) {
    let key = '';
    if (msg.type === 'persistent_notification/subscribe') {
      key = 'notifications';
      setTimeout(() => cb({ type: 'current', notifications: { ...notifications } } as T), 50);
    } else if (msg.type === 'todo/item/subscribe') {
      key = `todo:${msg.entity_id}`;
      setTimeout(() => cb({ items: todos[msg.entity_id] ?? [] } as T), 80);
    } else if (msg.type === 'weather/subscribe_forecast') {
      key = 'forecast';
      setTimeout(() => cb({ type: msg.forecast_type, forecast: msg.forecast_type === 'daily' ? daily : forecast } as T), 60);
    } else if (msg.type === 'frontend/subscribe_user_data') {
      key = `userdata:${user.id}`;
    } else throw new Error(`Mock does not handle ${msg.type}`);
    if (!subs.has(key)) subs.set(key, new Set());
    subs.get(key)!.add(cb as any);
    return () => void subs.get(key)!.delete(cb as any);
  },
};

// Google-calendar-like events, laid out around "now" so the page always has something current.
const at = (dayOffset: number, hh: number, mm = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hh, mm, 0, 0);
  return d.toISOString();
};
const rel = (minutes: number) => iso(now + minutes * 6e4);
const calendarEvents: Record<string, Array<{ summary: string; start: string; end: string; location?: string }>> = {
  'calendar.alex': [
    { summary: 'Padel with Tom', start: rel(9 * 60), end: rel(10.5 * 60), location: 'Padel club, 3 Park Lane' },
    { summary: 'Dentist', start: at(1, 8, 15), end: at(1, 9), location: 'Smile Dental, 20 Main Street' },
  ],
  'calendar.sam': [
    { summary: 'Work', start: rel(-3 * 60), end: rel(5 * 60), location: 'Office, 9 Quay Street' },
    { summary: 'Yoga', start: rel(10 * 60), end: rel(11 * 60), location: 'Studio Nord, 4 Harbour Street' },
  ],
  'calendar.noah': [
    { summary: 'School', start: rel(-90), end: rel(4.5 * 60), location: 'Northside School, 1 School Road' },
    { summary: 'Football', start: rel(7 * 60), end: rel(8 * 60), location: 'Riverside Sports Park, Mill Road' },
    { summary: 'Playdate at Lily’s', start: at(1, 14, 30), end: at(1, 17), location: 'Lily’s house, 12 Oak Avenue' },
  ],
  // Like the Affaldshåndtering DK integration's calendar: one event per collection, saying what goes.
  'calendar.affald': [
    { summary: 'Mad- og restaffald', start: at(1, 7), end: at(1, 15) },
    { summary: 'Papir og plast/MDK', start: at(8, 7), end: at(8, 15) },
    { summary: 'Mad- og restaffald', start: at(15, 7), end: at(15, 15) },
    { summary: 'Glas, metal og tekstil', start: at(22, 7), end: at(22, 15) },
    { summary: 'Mad- og restaffald', start: at(29, 7), end: at(29, 15) },
  ],
  'calendar.ella': [
    { summary: '1-year check-up', start: rel(6 * 60), end: rel(6.5 * 60), location: 'Health centre, 8 Elm Street' },
    { summary: 'Nursery', start: at(1, 7, 30), end: at(1, 15), location: 'Sunflower Nursery' },
  ],
};

async function callWS<T>(msg: Record<string, any>): Promise<T> {
  if (msg.type === 'recorder/statistics_during_period') {
    const start = new Date(msg.start_time).getTime();
    const end = new Date(msg.end_time).getTime();
    const step = msg.period === 'hour' ? 36e5 : 864e5;
    // Readings arrive late (like Målerportal): nothing for the last three hours.
    const until = end - 3 * 36e5;
    const shape: Record<string, (t: Date) => number> = {
      'sensor.el_import': t => (msg.period === 'hour' ? 0.25 + (t.getHours() >= 17 && t.getHours() <= 21 ? 0.9 : 0) + (t.getHours() < 6 ? 0.15 : 0) : 9 + (t.getDate() % 4)),
      'sensor.el_export': t => (msg.period === 'hour' ? Math.max(0, Math.sin(((t.getHours() - 6) / 12) * Math.PI)) * 1.6 : 6 + (t.getDate() % 3) * 2),
      'sensor.water': t => (msg.period === 'hour' ? ([7, 8, 18, 19, 20].includes(t.getHours()) ? 0.035 : 0.004) : 0.22 + (t.getDate() % 3) * 0.04),
    };
    const out: Record<string, Array<{ start: number; end: number; change: number }>> = {};
    for (const id of msg.statistic_ids as string[]) {
      out[id] = [];
      for (let t = start; t < until; t += step) out[id].push({ start: t, end: t + step, change: +(shape[id]?.(new Date(t)) ?? 0).toFixed(3) });
    }
    return out as T;
  }
  if (msg.type === 'call_service' && msg.domain === 'calendar' && msg.service === 'get_events') {
    const ids: string[] = [].concat(msg.target.entity_id);
    return { response: Object.fromEntries(ids.map(id => [id, { events: calendarEvents[id] ?? [] }])) } as T;
  }
  if (msg.type === 'frontend/get_user_data') {
    const raw = localStorage.getItem(userKey());
    return { value: raw ? JSON.parse(raw) : null } as T;
  }
  if (msg.type === 'frontend/set_user_data') {
    localStorage.setItem(userKey(), JSON.stringify(msg.value));
    return {} as T;
  }
  throw new Error(`Mock does not handle ${msg.type}`);
}

let hass!: HomeAssistant;
const consumers: Array<HTMLElement & { hass?: HomeAssistant }> = [];

function publish() {
  hass = {
    states: { ...states },
    user,
    themes,
    language: 'en-GB',
    locale: { language: 'en-GB' },
    connection,
    callService,
    callWS,
    hassUrl: (p = '') => p,
    config: { location_name: 'Northside' },
  };
  consumers.forEach(c => (c.hass = hass));
}

// ---------- the dashboard ----------

function card(tag: string, config: Record<string, unknown>, parent: string) {
  const el = document.createElement(tag) as HTMLElement & { setConfig(c: unknown): void; hass?: HomeAssistant };
  el.setConfig({ type: `custom:${tag}`, ...config });
  el.hass = hass;
  consumers.push(el);
  document.getElementById(parent)!.appendChild(el);
}

publish();
card('hyggehub-header-card', { chips: [{ entity: 'lock.front_door', icon: 'mdi:lock-outline' }, { entity: 'sensor.indoor_temperature', icon: 'mdi:thermometer' }] }, 'header');
const family = [
  {
    entity: 'person.alex',
    avatar: { preset: 'man', hair: 'brown', eyes: 'hazel' },
    battery: 'sensor.alex_phone_battery',
    charging: 'binary_sensor.alex_phone_charging',
    calendar: 'calendar.alex',
    stats: [{ entity: 'sensor.alex_steps', name: 'Steps today', icon: 'mdi:shoe-print' }],
  },
  {
    entity: 'person.sam',
    avatar: { preset: 'woman', hair: 'brown', eyes: 'blue' },
    battery: 'sensor.sam_phone_battery',
    charging: 'binary_sensor.sam_phone_charging',
    distance: 'sensor.sam_distance',
    calendar: 'calendar.sam',
    stats: [{ entity: 'sensor.sam_eta_home', name: 'Home', icon: 'mdi:car-outline' }],
  },
  {
    entity: 'device_tracker.noah_watch',
    name: 'Noah',
    avatar: { preset: 'child', hair: 'brown', eyes: 'brown' },
    battery: 'sensor.noah_watch_battery',
    battery_label: 'Watch',
    calendar: 'calendar.noah',
    stats: [{ entity: 'sensor.noah_room_temperature', name: 'Bedroom', icon: 'mdi:thermometer' }],
  },
  {
    name: 'Ella',
    avatar: { preset: 'baby', hair: 'brown', eyes: 'blue' },
    sleep: 'input_boolean.ella_asleep',
    calendar: 'calendar.ella',
    default_location: 'home',
    stats: [
      { entity: 'sensor.nursery_temperature', name: 'Nursery', icon: 'mdi:thermometer' },
    ],
  },
];
card(
  'hyggehub-family-card',
  {
    people: family,
    cars: [
      {
        name: 'ID.5',
        color: 'moonstone-grey',
        battery: 'sensor.id5_battery',
        range: 'sensor.id5_range',
        charging: 'binary_sensor.id5_charging',
        charging_power: 'sensor.id5_charging_power',
        time_to_full: 'sensor.id5_time_to_full',
        target: 'sensor.id5_target',
        plugged: 'binary_sensor.id5_plugged',
        location: 'device_tracker.id5',
        climate: 'climate.id5',
        lock: 'lock.id5',
        odometer: 'sensor.id5_odometer',
      },
    ],
  },
  'family',
);
card('hyggehub-notification-stack-card', {}, 'top-notes');
card('hyggehub-weather-card', { entity: 'weather.home' }, 'col-now');
card(
  'hyggehub-usage-card',
  {
    meters: [
      { entity: 'sensor.el_import', kind: 'import' },
      { entity: 'sensor.el_export', kind: 'export' },
      { entity: 'sensor.water', kind: 'water' },
    ],
  },
  'col-now',
);
card(
  'hyggehub-room-card',
  {
    name: 'Living room',
    icon: 'mdi:sofa-outline',
    temperature: 'sensor.living_temperature',
    humidity: 'sensor.living_humidity',
    dimmer: 'light.living_floor_lamp',
    entities: ['light.living_floor_lamp', 'light.living_pendant', 'cover.living_blinds', 'light.living_shelf'],
  },
  'col-rooms',
);
card(
  'hyggehub-room-card',
  { name: 'Bedroom', icon: 'mdi:bed-outline', temperature: 'sensor.bedroom_temperature', humidity: 'sensor.bedroom_humidity', entities: ['light.bedroom_bedside', 'light.bedroom_ceiling', 'fan.bedroom', 'cover.bedroom_blinds'] },
  'col-rooms',
);
card(
  'hyggehub-room-card',
  {
    name: 'Kitchen',
    icon: 'mdi:pot-steam-outline',
    temperature: 'sensor.kitchen_temperature',
    humidity: 'sensor.kitchen_humidity',
    entities: ['light.kitchen_island', 'light.kitchen_spots', { entity: 'fan.kitchen_hood', icon: 'mdi:stove' }, { entity: 'switch.kitchen_cabinet_lights', kind: 'light' }],
  },
  'col-rooms',
);
card('hyggehub-media-card', { entities: ['media_player.living_room_speaker', 'media_player.kitchen_speaker', { entity: 'media_player.everywhere', name: 'Everywhere' }] }, 'col-rooms');
card(
  'hyggehub-alarm-card',
  {
    entity: 'alarm_control_panel.home',
    exit_delay: 10,
    sensors: ['binary_sensor.front_door', 'binary_sensor.terrace_door', 'binary_sensor.back_door', 'binary_sensor.kitchen_window', 'binary_sensor.living_window', 'binary_sensor.bedroom_window', 'binary_sensor.bathroom_window'],
  },
  'col-security',
);
card('hyggehub-appliance-card', { name: 'Washing machine', entity: 'sensor.washer_status', remaining_entity: 'sensor.washer_remaining', total_minutes: 95, program_entity: 'sensor.washer_program' }, 'col-security');
card('hyggehub-countdown-card', { name: 'Lofoten', subtitle: 'Flight to Bodø', icon: 'mdi:image-filter-hdr', target: `${new Date().getFullYear()}-12-18T09:40`, start: `${new Date().getFullYear()}-08-20` }, 'plans-ring');
card('hyggehub-countdown-card', { name: 'Sauna', style: 'compact', icon: 'mdi:fire', animation: 'flicker', entity: 'timer.sauna', value_entity: 'sensor.sauna_temperature', value_target: 80, done_text: 'Ready' }, 'pair');
card('hyggehub-bins-card', { calendar: 'calendar.affald' }, 'plans-ring');
card(
  'hyggehub-lists-card',
  { lists: [{ entity: 'todo.shopping_list', name: 'Groceries', done_label: 'Got it' }, { entity: 'todo.chores', name: 'To do', done_label: 'Done', placeholder: 'Add a task' }], note: { entity: 'input_text.quick_note', name: 'Note' } },
  'plans-lists',
);

// ---------- the Appearance panel and the user switch ----------

const panel = document.createElement('hyggehub-appearance-panel') as HTMLElement & { hass?: HomeAssistant; narrow?: boolean };
panel.hass = hass;
consumers.push(panel);
document.getElementById('panel')!.appendChild(panel);

const showView = (v: string) => {
  document.getElementById('dash')!.hidden = v !== 'dash';
  document.getElementById('panel')!.hidden = v !== 'panel';
  document.querySelectorAll<HTMLButtonElement>('.rail [data-view]').forEach(b => b.toggleAttribute('aria-current', b.dataset.view === v));
  document.querySelectorAll<HTMLButtonElement>('.rail [aria-current]').forEach(b => b.setAttribute('aria-current', 'page'));
  scrollTo(0, 0);
};
document.querySelectorAll<HTMLButtonElement>('.rail [data-view]').forEach(b => b.addEventListener('click', () => showView(b.dataset.view!)));
if (location.hash === '#appearance') showView('panel');

document.getElementById('who')!.addEventListener('click', e => {
  user = user === USERS[0] ? USERS[1] : USERS[0];
  (e.target as HTMLElement).textContent = user.name;
  publish();
});

// Small live changes so the dashboard feels connected.
setInterval(() => {
  set('sensor.solar_power', String(Math.round(1820 + (Math.random() - 0.5) * 200)));
  set('sensor.sauna_temperature', String(Math.min(80, Number(states['sensor.sauna_temperature'].state) + 1)));
  publish();
}, 4000);
setInterval(() => {
  const r = Number(states['sensor.washer_remaining'].state);
  if (r > 0) {
    set('sensor.washer_remaining', String(r - 1));
    publish();
  }
}, 60_000);

// Dev-only: #open-notes fans the notification stack out after load, for screenshots of the open state.
if (location.hash === '#open-notes') {
  setTimeout(() => {
    const card = document.querySelector('hyggehub-notification-stack-card');
    (card?.shadowRoot?.querySelector('.head .btn-text') as HTMLButtonElement | null)?.click();
  }, 1500);
}

// Dev-only: any hash containing "notes" hides the people sections so the notifications are on screen.
if (location.hash.includes('notes')) ['family', 'header'].forEach(id => (document.getElementById(id)!.style.display = 'none'));

// Dev-only: #open-person / #open-car open those pages of the family card, for screenshots.
if (location.hash === '#open-person' || location.hash === '#open-car') {
  setTimeout(() => {
    const root = document.querySelector('hyggehub-family-card')?.shadowRoot;
    const target = location.hash === '#open-car' ? root?.querySelector<HTMLElement>('.car-chip') : root?.querySelectorAll<HTMLElement>('.member')[2];
    target?.click();
  }, 1500);
}
// Dev-only: #open-family turns the first two family members to their details, for screenshots.
if (location.hash === '#open-family') {
  setTimeout(() => {
    const members = document.querySelector('hyggehub-family-card')?.shadowRoot?.querySelectorAll<HTMLElement>('.member');
    members?.[1]?.click();
    members?.[2]?.click();
  }, 1500);
}
