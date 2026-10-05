import type { HomeAssistant, Unsubscribe } from '../types';
import { formatTime } from '../shared/format';
import { THEMES, isThemeKey, type Palette, type ThemeKey } from './themes';

/*
 * The theme engine is the one piece of global state in HyggeHub.
 *
 * Each Home Assistant user has their own Appearance: a look for day, a look for night (or "same as day"),
 * and a rule for when night starts. It is stored with the frontend's per-user storage
 * (`frontend/get_user_data` / `frontend/set_user_data`), so it follows the user to every device and never
 * changes what another user sees.
 *
 * The engine writes the resolved palette as CSS custom properties on <html>. Custom properties inherit
 * through shadow roots, so every HyggeHub card - and Home Assistant's own UI, through the handful of HA
 * variables mapped below - picks the look up without re-rendering.
 */

export type Slot = 'day' | 'night';
export type NightRule = 'device' | 'sun' | 'schedule';

export interface Look {
  theme: ThemeKey;
  /** Backdrop blur behind glass, in px (0-40). */
  frost: number;
  /** Whether the backdrop colours drift slowly. */
  drift: boolean;
}

export interface Appearance {
  version: 1;
  day: Look;
  night: Look & { same: boolean };
  when: NightRule;
  /** Fixed-times rule, "HH:MM". */
  from: string;
  to: string;
  /** Card animations: spinning fans, falling snow, the washing drum... */
  motion: boolean;
}

export interface Resolved {
  slot: Slot;
  autoSlot: Slot;
  look: Look;
  palette: Palette;
  reason: string;
  previewing: boolean;
}

export const DEFAULT_APPEARANCE: Appearance = {
  version: 1,
  day: { theme: 'fjord', frost: 22, drift: true },
  night: { same: false, theme: 'polar', frost: 26, drift: true },
  when: 'device',
  from: '22:00',
  to: '07:00',
  motion: true,
};

const STORAGE_KEY = 'hyggehub_appearance';
const CACHE_PREFIX = 'hyggehub:appearance:';
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Albert+Sans:wght@200;300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap';
const FONT_STACK = '"Albert Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
const clampFrost = (v: unknown, d: number) => (typeof v === 'number' && isFinite(v) ? Math.min(40, Math.max(0, Math.round(v))) : d);

function normalizeLook(raw: any, d: Look): Look {
  return {
    theme: isThemeKey(raw?.theme) ? raw.theme : d.theme,
    frost: clampFrost(raw?.frost, d.frost),
    drift: typeof raw?.drift === 'boolean' ? raw.drift : d.drift,
  };
}

/** Accepts anything (stored data from an older version, a hand-edited value) and returns a valid Appearance. */
export function normalizeAppearance(raw: unknown): Appearance {
  const d = DEFAULT_APPEARANCE;
  const r = (raw && typeof raw === 'object' ? raw : {}) as any;
  return {
    version: 1,
    day: normalizeLook(r.day, d.day),
    night: { ...normalizeLook(r.night, d.night), same: typeof r.night?.same === 'boolean' ? r.night.same : d.night.same },
    when: r.when === 'sun' || r.when === 'schedule' || r.when === 'device' ? r.when : d.when,
    from: HHMM.test(r.from) ? r.from : d.from,
    to: HHMM.test(r.to) ? r.to : d.to,
    motion: typeof r.motion === 'boolean' ? r.motion : d.motion,
  };
}

const minutesOf = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const GLOBAL_CSS = `
@property --hh-d1 { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
@property --hh-d2 { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
@property --hh-d3 { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
@property --hh-d4 { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
@keyframes hh-drift {
  from { --hh-d1: 0%; --hh-d2: 0%; --hh-d3: 0%; --hh-d4: 0%; }
  to { --hh-d1: 9%; --hh-d2: -8%; --hh-d3: 7%; --hh-d4: -10%; }
}
html.hh-drift { animation: hh-drift 42s ease-in-out infinite alternate; }
@media (prefers-reduced-motion: reduce) { html.hh-drift { animation: none; } }
`;

/** Four soft colour fields over the base colour. The --hh-d* offsets are animated by `hh-drift`. */
function backdrop(p: Palette): string {
  const field = (size: string, x: string, y: string, dx: number, dy: number, c: string) =>
    `radial-gradient(${size} at calc(${x} + var(--hh-d${dx})) calc(${y} + var(--hh-d${dy})), ${c} 0%, transparent 70%)`;
  return [
    field('60vmax 60vmax', '6%', '-4%', 1, 2, p.blob1),
    field('52vmax 52vmax', '96%', '16%', 2, 3, p.blob2),
    field('56vmax 46vmax', '42%', '108%', 3, 4, p.blob3),
    field('34vmax 34vmax', '76%', '78%', 4, 1, p.blob4),
    p.bg,
  ].join(', ');
}

export class ThemeEngine extends EventTarget {
  appearance: Appearance = clone(DEFAULT_APPEARANCE);
  /** A temporary override used by the Appearance panel's Day/Night preview. Never saved. */
  preview: 'auto' | Slot = 'auto';
  resolved!: Resolved;
  /** True once the signed-in user's stored appearance has been read (or found missing). */
  loaded = false;

  private hass?: HomeAssistant;
  private userId?: string;
  private themesRef?: unknown;
  private signature = '';
  private unsubscribe?: Unsubscribe;
  private saveTimer?: number;
  private readonly darkMQ = matchMedia('(prefers-color-scheme: dark)');
  private readonly reducedMQ = matchMedia('(prefers-reduced-motion: reduce)');

  constructor() {
    super();
    this.injectGlobals();
    const cached = this.readCache('last');
    if (cached) this.appearance = cached;
    this.darkMQ.addEventListener('change', () => this.apply());
    this.reducedMQ.addEventListener('change', () => this.apply(true));
    // Sun and fixed-times rules change with the clock, not with any event.
    setInterval(() => this.apply(), 60_000);
    this.apply(true);
  }

  get motionOn(): boolean {
    return this.appearance.motion && !this.reducedMQ.matches;
  }

  /** Every HyggeHub card and the panel hand their `hass` here. Cheap when nothing relevant changed. */
  setHass(hass: HomeAssistant): void {
    this.hass = hass;
    if (hass.user && hass.user.id !== this.userId) {
      this.userId = hass.user.id;
      void this.load();
    }
    if (hass.themes !== this.themesRef) {
      // Home Assistant rewrites its own theme variables on <html> when its theme or dark mode changes.
      // Re-apply after it has done so, otherwise its values win until the next minute tick.
      this.themesRef = hass.themes;
      this.apply(true);
      setTimeout(() => this.apply(true), 60);
      setTimeout(() => this.apply(true), 600);
    } else {
      this.apply();
    }
  }

  /** Replaces the current user's appearance, applies it immediately and saves it (debounced). */
  save(next: Appearance): void {
    this.appearance = normalizeAppearance(next);
    this.writeCache();
    this.apply(true);
    this.emit();
    clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => {
      this.hass?.callWS({ type: 'frontend/set_user_data', key: STORAGE_KEY, value: this.appearance }).catch(err => {
        console.warn('HyggeHub: could not save appearance', err);
        this.dispatchEvent(new CustomEvent('save-error', { detail: err }));
      });
    }, 400);
  }

  setPreview(preview: 'auto' | Slot): void {
    this.preview = preview;
    this.apply(true);
    this.emit();
  }

  private async load(): Promise<void> {
    const hass = this.hass!;
    const cached = this.readCache(hass.user!.id);
    if (cached) {
      this.appearance = cached;
      this.apply(true);
    }
    try {
      const res = await hass.callWS<{ value: unknown }>({ type: 'frontend/get_user_data', key: STORAGE_KEY });
      this.appearance = normalizeAppearance(res?.value);
      this.writeCache();
    } catch (err) {
      console.warn('HyggeHub: could not read appearance, using defaults', err);
    }
    this.loaded = true;
    this.apply(true);
    this.emit();
    // Live updates when the same user changes their appearance on another device. Older cores lack the
    // subscription; the value read above still applies there.
    try {
      await this.unsubscribe?.();
      this.unsubscribe = await hass.connection.subscribeMessage<{ value: unknown }>(msg => {
        this.appearance = normalizeAppearance(msg?.value);
        this.writeCache();
        this.apply(true);
        this.emit();
      }, { type: 'frontend/subscribe_user_data', key: STORAGE_KEY });
    } catch {
      /* not supported by this Home Assistant version */
    }
  }

  private resolve(): Resolved {
    const a = this.appearance;
    let auto: { slot: Slot; reason: string };
    const deviceDark = this.hass?.themes?.darkMode ?? this.darkMQ.matches;
    if (a.when === 'sun') {
      const sun = this.hass?.states['sun.sun'];
      if (sun) {
        const down = sun.state === 'below_horizon';
        const next = new Date(down ? sun.attributes.next_rising : sun.attributes.next_setting);
        auto = { slot: down ? 'night' : 'day', reason: down ? `The sun is down, sunrise at ${formatTime(next, this.hass)}` : `The sun is up, sunset at ${formatTime(next, this.hass)}` };
      } else {
        auto = { slot: deviceDark ? 'night' : 'day', reason: 'sun.sun is not available, so this follows your device' };
      }
    } else if (a.when === 'schedule') {
      const now = new Date();
      const m = now.getHours() * 60 + now.getMinutes();
      const f = minutesOf(a.from);
      const t = minutesOf(a.to);
      const inside = f > t ? m >= f || m < t : m >= f && m < t;
      auto = { slot: inside ? 'night' : 'day', reason: inside ? `Night hours, ${a.from} to ${a.to}` : `Outside night hours (${a.from} to ${a.to})` };
    } else {
      auto = { slot: deviceDark ? 'night' : 'day', reason: `Your device is in ${deviceDark ? 'dark' : 'light'} mode` };
    }
    const slot = this.preview === 'auto' ? auto.slot : this.preview;
    const look: Look = slot === 'night' && !a.night.same ? { theme: a.night.theme, frost: a.night.frost, drift: a.night.drift } : { ...a.day };
    return {
      slot,
      autoSlot: auto.slot,
      look,
      palette: THEMES[look.theme],
      reason: this.preview === 'auto' ? auto.reason : 'Previewing. Nothing is saved until you change a setting.',
      previewing: this.preview !== 'auto',
    };
  }

  apply(force = false): void {
    const r = this.resolve();
    this.resolved = r;
    const motion = this.motionOn;
    const sig = JSON.stringify([r.slot, r.look, motion, r.reason]);
    if (!force && sig === this.signature) return;
    const changedLook = sig !== this.signature;
    this.signature = sig;

    const p = r.palette;
    const vars: Record<string, string> = {
      '--hh-bg': p.bg,
      '--hh-surface': p.surface,
      '--hh-ink': p.ink,
      '--hh-ink-2': p.ink2,
      '--hh-ink-3': p.ink3,
      '--hh-glass': p.glass,
      '--hh-glass-strong': p.glassStrong,
      '--hh-glass-press': p.glassPress,
      '--hh-stroke': p.stroke,
      '--hh-line': p.line,
      '--hh-highlight': p.highlight,
      '--hh-shadow': p.shadow,
      '--hh-accent': p.accent,
      '--hh-accent-soft': `color-mix(in srgb, ${p.accent} 16%, transparent)`,
      '--hh-on-accent': p.onAccent,
      '--hh-warm': p.warm,
      '--hh-warm-soft': `color-mix(in srgb, ${p.warm} ${p.dark ? 20 : 24}%, transparent)`,
      '--hh-on-warm': p.onWarm,
      '--hh-ok': p.ok,
      '--hh-warn': p.warn,
      '--hh-crit': p.crit,
      '--hh-particle': p.particle,
      '--hh-blur': `${r.look.frost}px`,
      '--hh-play': motion ? 'running' : 'paused',
      '--hh-font': FONT_STACK,
      '--hh-backdrop': backdrop(p),
      // Home Assistant's own variables, so views, native cards, the sidebar and dialogs match.
      '--lovelace-background': backdrop(p),
      '--primary-background-color': p.bg,
      '--secondary-background-color': p.surface,
      '--card-background-color': p.surface,
      '--primary-text-color': p.ink,
      '--secondary-text-color': p.ink2,
      '--disabled-text-color': p.ink3,
      '--divider-color': p.line,
      '--primary-color': p.accent,
      '--accent-color': p.accent,
      '--text-primary-color': p.onAccent,
      '--state-icon-color': p.ink2,
      '--ha-card-background': p.glassStrong,
      '--ha-card-border-color': p.stroke,
      '--ha-card-border-radius': '26px',
      '--ha-card-box-shadow': p.shadow,
      '--app-header-background-color': p.bg,
      '--app-header-text-color': p.ink,
      '--sidebar-background-color': p.surface,
      '--sidebar-text-color': p.ink2,
      '--sidebar-icon-color': p.ink2,
      '--sidebar-selected-icon-color': p.accent,
      '--sidebar-selected-text-color': p.accent,
    };
    const root = document.documentElement;
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
    root.style.colorScheme = p.dark ? 'dark' : 'light';
    root.classList.toggle('hh-drift', r.look.drift && motion);
    if (changedLook) this.emit();
  }

  private emit() {
    this.dispatchEvent(new Event('change'));
  }

  private injectGlobals() {
    if (!document.getElementById('hyggehub-global')) {
      const style = document.createElement('style');
      style.id = 'hyggehub-global';
      style.textContent = GLOBAL_CSS;
      document.head.appendChild(style);
    }
    if (!document.getElementById('hyggehub-font')) {
      const link = document.createElement('link');
      link.id = 'hyggehub-font';
      link.rel = 'stylesheet';
      link.href = FONT_URL;
      document.head.appendChild(link);
    }
  }

  // A per-device copy so a reload paints the right look before the websocket answers.
  private readCache(id: string): Appearance | undefined {
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + id);
      return raw ? normalizeAppearance(JSON.parse(raw)) : undefined;
    } catch {
      return undefined;
    }
  }

  private writeCache() {
    try {
      const raw = JSON.stringify(this.appearance);
      localStorage.setItem(CACHE_PREFIX + 'last', raw);
      if (this.userId) localStorage.setItem(CACHE_PREFIX + this.userId, raw);
    } catch {
      /* storage blocked */
    }
  }
}

const GLOBAL_KEY = '__hyggehubThemeEngine';
export const engine: ThemeEngine = ((window as any)[GLOBAL_KEY] ??= new ThemeEngine());
