const it = (n) => String(Math.floor(n)).padStart(2, "0"), D = (n) => n?.locale?.language ?? n?.language ?? navigator.language;
function O(n, t) {
  return n.toLocaleTimeString(D(t), { hour: "2-digit", minute: "2-digit" });
}
function hs(n, t) {
  return n.toLocaleDateString(D(t), { weekday: "short", day: "numeric", month: "short" });
}
function Ms(n) {
  if (!n) return "";
  const t = Math.max(0, (Date.now() - new Date(n).getTime()) / 1e3);
  return t < 60 ? "now" : t < 3600 ? `${Math.floor(t / 60)} min` : t < 86400 ? `${Math.floor(t / 3600)} h` : `${Math.floor(t / 86400)} d`;
}
function Cs(n) {
  const t = (n.getTime() - Date.now()) / 1e3, e = Math.abs(t);
  if (e < 60) return t < 0 ? "just now" : "in a moment";
  let s;
  if (e < 3600) s = `${Math.round(e / 60)} min`;
  else if (e < 86400) {
    const i = Math.floor(e / 3600), r = Math.round(e % 3600 / 60);
    s = r ? `${i} h ${r} min` : `${i} h`;
  } else s = `${Math.round(e / 86400)} d`;
  return t < 0 ? `${s} ago` : `in ${s}`;
}
function _e(n) {
  if (typeof n != "string") return 0;
  const t = n.split(":").map(Number);
  return t.some(isNaN) ? 0 : t.reduce((e, s) => e * 60 + s, 0);
}
function R(n) {
  if (!n) return;
  const t = parseFloat(n.state);
  return isNaN(t) ? void 0 : t;
}
function ht(n) {
  const t = R(n);
  if (t === void 0) return;
  const e = String(n.attributes.unit_of_measurement ?? "W").toLowerCase();
  return e === "kw" ? t : e === "mw" ? t * 1e3 : t / 1e3;
}
function ds(n, t) {
  if (!t) return "Unavailable";
  if (n?.formatEntityState) return n.formatEntityState(t);
  const e = t.attributes.unit_of_measurement;
  return e ? `${t.state} ${e}` : t.state;
}
function B(n, t = "") {
  return n?.attributes.friendly_name ?? t;
}
function Es(n) {
  const t = Math.max(0, Math.floor(n / 1e3));
  return { days: Math.floor(t / 86400), hours: Math.floor(t / 3600) % 24, minutes: Math.floor(t / 60) % 60, seconds: t % 60, total: t };
}
const Ss = "0 1px 1px rgba(30,45,55,.04), 0 14px 34px -14px rgba(30,45,55,.22)", Nt = "0 22px 44px -22px rgba(0,0,0,.7)", at = {
  fjord: {
    name: "Fjord",
    description: "Misty blue water",
    dark: !1,
    bg: "#DCE3E5",
    surface: "#EEF2F3",
    ink: "#18242A",
    ink2: "#4C5D66",
    ink3: "#7F909A",
    glass: "rgba(255,255,255,.44)",
    glassStrong: "rgba(255,255,255,.66)",
    glassPress: "rgba(255,255,255,.82)",
    stroke: "rgba(255,255,255,.72)",
    line: "rgba(24,36,42,.09)",
    highlight: "rgba(255,255,255,.6)",
    shadow: Ss,
    blob1: "#9FC0C6",
    blob2: "#C4D4BF",
    blob3: "#EAD9C3",
    blob4: "#B4C0DA",
    accent: "#2F6E86",
    onAccent: "#FFFFFF",
    warm: "#EDA84E",
    onWarm: "#3B2708",
    ok: "#3C7F5F",
    warn: "#B9792A",
    crit: "#AE3F3B",
    particle: "rgba(84,110,124,.5)"
  },
  birch: {
    name: "Birch",
    description: "Pale wood and linen",
    dark: !1,
    bg: "#E9E3D9",
    surface: "#F5F1EA",
    ink: "#2A241C",
    ink2: "#625849",
    ink3: "#958A79",
    glass: "rgba(255,252,246,.48)",
    glassStrong: "rgba(255,252,246,.7)",
    glassPress: "rgba(255,252,246,.86)",
    stroke: "rgba(255,255,255,.75)",
    line: "rgba(42,36,28,.09)",
    highlight: "rgba(255,255,255,.65)",
    shadow: "0 1px 1px rgba(60,45,30,.05), 0 14px 34px -14px rgba(60,45,30,.24)",
    blob1: "#E6CFAE",
    blob2: "#C9D3B8",
    blob3: "#F1E6D4",
    blob4: "#D8BFA6",
    accent: "#7A5A36",
    onAccent: "#FFFFFF",
    warm: "#E59A3E",
    onWarm: "#3A2508",
    ok: "#4E7D4E",
    warn: "#B4761F",
    crit: "#A4443A",
    particle: "rgba(110,90,70,.45)"
  },
  lichen: {
    name: "Lichen",
    description: "Sage and moss",
    dark: !1,
    bg: "#DDE5DC",
    surface: "#EEF3ED",
    ink: "#1C2620",
    ink2: "#4F5F54",
    ink3: "#839287",
    glass: "rgba(250,255,250,.44)",
    glassStrong: "rgba(250,255,250,.66)",
    glassPress: "rgba(250,255,250,.84)",
    stroke: "rgba(255,255,255,.72)",
    line: "rgba(28,38,32,.09)",
    highlight: "rgba(255,255,255,.6)",
    shadow: "0 1px 1px rgba(30,50,40,.04), 0 14px 34px -14px rgba(30,50,40,.22)",
    blob1: "#B6CDB2",
    blob2: "#D7E0C4",
    blob3: "#A9C3BF",
    blob4: "#E5E2CC",
    accent: "#3F6E4F",
    onAccent: "#FFFFFF",
    warm: "#E3A34C",
    onWarm: "#3A2808",
    ok: "#3E7F55",
    warn: "#B27A2A",
    crit: "#A8423E",
    particle: "rgba(80,105,90,.5)"
  },
  polar: {
    name: "Polar night",
    description: "Ink blue, ice accents",
    dark: !0,
    bg: "#091015",
    surface: "#141E24",
    ink: "#E5EDF0",
    ink2: "#A1B1B9",
    ink3: "#6B7D87",
    glass: "rgba(20,32,38,.46)",
    glassStrong: "rgba(32,48,56,.62)",
    glassPress: "rgba(48,68,78,.7)",
    stroke: "rgba(255,255,255,.1)",
    line: "rgba(255,255,255,.07)",
    highlight: "rgba(255,255,255,.07)",
    shadow: Nt,
    blob1: "#1A6A5A",
    blob2: "#37306E",
    blob3: "#0F3149",
    blob4: "#2A6047",
    accent: "#86C3D6",
    onAccent: "#0A1418",
    warm: "#F3BB6A",
    onWarm: "#2E1E06",
    ok: "#6DC196",
    warn: "#E7B25C",
    crit: "#E8756F",
    particle: "rgba(255,255,255,.75)"
  },
  aurora: {
    name: "Aurora",
    description: "Green and violet glow",
    dark: !0,
    bg: "#070D10",
    surface: "#0F1A1D",
    ink: "#E4F0EC",
    ink2: "#9DB5AD",
    ink3: "#66807A",
    glass: "rgba(14,28,30,.42)",
    glassStrong: "rgba(26,46,48,.6)",
    glassPress: "rgba(40,66,66,.7)",
    stroke: "rgba(255,255,255,.1)",
    line: "rgba(255,255,255,.07)",
    highlight: "rgba(255,255,255,.07)",
    shadow: Nt,
    blob1: "#1E8F6E",
    blob2: "#5B3FA0",
    blob3: "#0E3B4A",
    blob4: "#2FAF84",
    accent: "#7EE0B5",
    onAccent: "#06130E",
    warm: "#F1C46E",
    onWarm: "#2C1F06",
    ok: "#74C99A",
    warn: "#EDB65E",
    crit: "#F07E7A",
    particle: "rgba(220,255,240,.75)"
  },
  ember: {
    name: "Ember",
    description: "Sauna coals and amber",
    dark: !0,
    bg: "#110C0A",
    surface: "#1E1613",
    ink: "#F1E7DF",
    ink2: "#BBA899",
    ink3: "#806E61",
    glass: "rgba(36,24,20,.45)",
    glassStrong: "rgba(54,38,32,.6)",
    glassPress: "rgba(74,52,42,.7)",
    stroke: "rgba(255,230,210,.1)",
    line: "rgba(255,230,210,.07)",
    highlight: "rgba(255,240,230,.07)",
    shadow: Nt,
    blob1: "#6E2F1C",
    blob2: "#3A2420",
    blob3: "#8A4A22",
    blob4: "#2A2A3A",
    accent: "#F0A86A",
    onAccent: "#1E120A",
    warm: "#F6C373",
    onWarm: "#2E1D06",
    ok: "#8CC79A",
    warn: "#EDB65E",
    crit: "#F07A6E",
    particle: "rgba(255,235,220,.7)"
  }
}, As = Object.keys(at), Ts = (n) => typeof n == "string" && n in at, se = {
  version: 1,
  day: { theme: "fjord", frost: 22, drift: !0 },
  night: { same: !1, theme: "polar", frost: 26, drift: !0 },
  when: "device",
  from: "22:00",
  to: "07:00",
  motion: !0
}, Ht = "hyggehub_appearance", jt = "hyggehub:appearance:", zs = "https://fonts.googleapis.com/css2?family=Albert+Sans:wght@200;300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap", Ds = '"Albert Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', Me = /^([01]\d|2[0-3]):[0-5]\d$/, Os = (n) => JSON.parse(JSON.stringify(n)), Ls = (n, t) => typeof n == "number" && isFinite(n) ? Math.min(40, Math.max(0, Math.round(n))) : t;
function Ce(n, t) {
  return {
    theme: Ts(n?.theme) ? n.theme : t.theme,
    frost: Ls(n?.frost, t.frost),
    drift: typeof n?.drift == "boolean" ? n.drift : t.drift
  };
}
function kt(n) {
  const t = se, e = n && typeof n == "object" ? n : {};
  return {
    version: 1,
    day: Ce(e.day, t.day),
    night: { ...Ce(e.night, t.night), same: typeof e.night?.same == "boolean" ? e.night.same : t.night.same },
    when: e.when === "sun" || e.when === "schedule" || e.when === "device" ? e.when : t.when,
    from: Me.test(e.from) ? e.from : t.from,
    to: Me.test(e.to) ? e.to : t.to,
    motion: typeof e.motion == "boolean" ? e.motion : t.motion
  };
}
const Ee = (n) => {
  const [t, e] = n.split(":").map(Number);
  return t * 60 + e;
};
function Se(n) {
  const t = (e, s, i, r, a, o) => `radial-gradient(${e} at calc(${s} + var(--hh-d${r}, 0%)) calc(${i} + var(--hh-d${a}, 0%)), ${o} 0%, transparent 70%)`;
  return [
    t("60vmax 60vmax", "6%", "-4%", 1, 2, n.blob1),
    t("52vmax 52vmax", "96%", "16%", 2, 3, n.blob2),
    t("56vmax 46vmax", "42%", "108%", 3, 4, n.blob3),
    t("34vmax 34vmax", "76%", "78%", 4, 1, n.blob4),
    n.bg
  ].join(", ");
}
const Ae = 120, Ps = 1e3;
class Fs extends EventTarget {
  constructor() {
    super(), this.appearance = Os(se), this.preview = "auto", this.loaded = !1, this.signature = "", this.darkMQ = matchMedia("(prefers-color-scheme: dark)"), this.reducedMQ = matchMedia("(prefers-reduced-motion: reduce)"), this.drifting = !1, this.injectGlobals();
    const t = this.readCache("last");
    t && (this.appearance = t), this.darkMQ.addEventListener("change", () => this.apply()), this.reducedMQ.addEventListener("change", () => this.apply(!0)), setInterval(() => this.apply(), 6e4), setInterval(() => this.drift(), Ps), this.apply(!0);
  }
  /** Nudges the backdrop's colour fields one small step along a slow sway, when the user wants it. */
  drift() {
    const t = document.documentElement;
    if (!(!!this.resolved?.look.drift && this.motionOn && !document.hidden)) {
      if (this.drifting) for (const r of [1, 2, 3, 4]) t.style.setProperty(`--hh-d${r}`, "0%");
      this.drifting = !1;
      return;
    }
    this.drifting = !0;
    const s = Date.now() / 1e3 % Ae / Ae * 2 * Math.PI;
    [9 * Math.sin(s), -8 * Math.sin(s + 1.3), 7 * Math.sin(s + 2.6), -10 * Math.sin(s + 4)].forEach((r, a) => t.style.setProperty(`--hh-d${a + 1}`, `${r.toFixed(2)}%`));
  }
  get motionOn() {
    return this.appearance.motion && !this.reducedMQ.matches;
  }
  /** Every HyggeHub card and the panel hand their `hass` here. Cheap when nothing relevant changed. */
  setHass(t) {
    this.hass = t, t.user && t.user.id !== this.userId && (this.userId = t.user.id, this.load()), t.themes !== this.themesRef ? (this.themesRef = t.themes, this.apply(!0), setTimeout(() => this.apply(!0), 60), setTimeout(() => this.apply(!0), 600)) : this.apply();
  }
  /** Replaces the current user's appearance, applies it immediately and saves it (debounced). */
  save(t) {
    this.appearance = kt(t), this.writeCache(), this.apply(!0), this.emit(), clearTimeout(this.saveTimer), this.saveTimer = window.setTimeout(() => {
      this.hass?.callWS({ type: "frontend/set_user_data", key: Ht, value: this.appearance }).catch((e) => {
        console.warn("HyggeHub: could not save appearance", e), this.dispatchEvent(new CustomEvent("save-error", { detail: e }));
      });
    }, 400);
  }
  setPreview(t) {
    this.preview = t, this.apply(!0), this.emit();
  }
  async load() {
    const t = this.hass, e = this.readCache(t.user.id);
    e && (this.appearance = e, this.apply(!0));
    try {
      const s = await t.callWS({ type: "frontend/get_user_data", key: Ht });
      this.appearance = kt(s?.value), this.writeCache();
    } catch (s) {
      console.warn("HyggeHub: could not read appearance, using defaults", s);
    }
    this.loaded = !0, this.apply(!0), this.emit();
    try {
      await this.unsubscribe?.(), this.unsubscribe = await t.connection.subscribeMessage((s) => {
        this.appearance = kt(s?.value), this.writeCache(), this.apply(!0), this.emit();
      }, { type: "frontend/subscribe_user_data", key: Ht });
    } catch {
    }
  }
  resolve() {
    const t = this.appearance;
    let e;
    const s = this.hass?.themes?.darkMode ?? this.darkMQ.matches;
    if (t.when === "sun") {
      const a = this.hass?.states["sun.sun"];
      if (a) {
        const o = a.state === "below_horizon", l = new Date(o ? a.attributes.next_rising : a.attributes.next_setting);
        e = { slot: o ? "night" : "day", reason: o ? `The sun is down, sunrise at ${O(l, this.hass)}` : `The sun is up, sunset at ${O(l, this.hass)}` };
      } else
        e = { slot: s ? "night" : "day", reason: "sun.sun is not available, so this follows your device" };
    } else if (t.when === "schedule") {
      const a = /* @__PURE__ */ new Date(), o = a.getHours() * 60 + a.getMinutes(), l = Ee(t.from), c = Ee(t.to), u = l > c ? o >= l || o < c : o >= l && o < c;
      e = { slot: u ? "night" : "day", reason: u ? `Night hours, ${t.from} to ${t.to}` : `Outside night hours (${t.from} to ${t.to})` };
    } else
      e = { slot: s ? "night" : "day", reason: `Your device is in ${s ? "dark" : "light"} mode` };
    const i = this.preview === "auto" ? e.slot : this.preview, r = i === "night" && !t.night.same ? { theme: t.night.theme, frost: t.night.frost, drift: t.night.drift } : { ...t.day };
    return {
      slot: i,
      autoSlot: e.slot,
      look: r,
      palette: at[r.theme],
      reason: this.preview === "auto" ? e.reason : "Previewing. Nothing is saved until you change a setting.",
      previewing: this.preview !== "auto"
    };
  }
  apply(t = !1) {
    const e = this.resolve();
    this.resolved = e;
    const s = this.motionOn, i = JSON.stringify([e.slot, e.look, s, e.reason]);
    if (!t && i === this.signature) return;
    const r = i !== this.signature;
    this.signature = i;
    const a = e.palette, o = {
      "--hh-bg": a.bg,
      "--hh-surface": a.surface,
      "--hh-ink": a.ink,
      "--hh-ink-2": a.ink2,
      "--hh-ink-3": a.ink3,
      "--hh-glass": a.glass,
      "--hh-glass-strong": a.glassStrong,
      "--hh-glass-press": a.glassPress,
      "--hh-stroke": a.stroke,
      "--hh-line": a.line,
      "--hh-highlight": a.highlight,
      "--hh-shadow": a.shadow,
      "--hh-accent": a.accent,
      "--hh-accent-soft": `color-mix(in srgb, ${a.accent} 16%, transparent)`,
      "--hh-on-accent": a.onAccent,
      "--hh-warm": a.warm,
      "--hh-warm-soft": `color-mix(in srgb, ${a.warm} ${a.dark ? 20 : 24}%, transparent)`,
      "--hh-on-warm": a.onWarm,
      "--hh-ok": a.ok,
      "--hh-warn": a.warn,
      "--hh-crit": a.crit,
      "--hh-particle": a.particle,
      "--hh-blur": `${e.look.frost}px`,
      "--hh-play": s ? "running" : "paused",
      "--hh-font": Ds,
      "--hh-backdrop": Se(a),
      // Home Assistant's own variables, so views, native cards, the sidebar and dialogs match.
      "--lovelace-background": Se(a),
      "--primary-background-color": a.bg,
      "--secondary-background-color": a.surface,
      "--card-background-color": a.surface,
      "--primary-text-color": a.ink,
      "--secondary-text-color": a.ink2,
      "--disabled-text-color": a.ink3,
      "--divider-color": a.line,
      "--primary-color": a.accent,
      "--accent-color": a.accent,
      "--text-primary-color": a.onAccent,
      "--state-icon-color": a.ink2,
      "--ha-card-background": a.glassStrong,
      "--ha-card-border-color": a.stroke,
      "--ha-card-border-radius": "26px",
      "--ha-card-box-shadow": a.shadow,
      "--app-header-background-color": a.bg,
      "--app-header-text-color": a.ink,
      "--sidebar-background-color": a.surface,
      "--sidebar-text-color": a.ink2,
      "--sidebar-icon-color": a.ink2,
      "--sidebar-selected-icon-color": a.accent,
      "--sidebar-selected-text-color": a.accent
    }, l = document.documentElement;
    for (const [u, d] of Object.entries(o)) l.style.getPropertyValue(u) !== d && l.style.setProperty(u, d);
    const c = a.dark ? "dark" : "light";
    l.style.colorScheme !== c && (l.style.colorScheme = c), l.classList.remove("hh-drift"), r && this.emit();
  }
  emit() {
    this.dispatchEvent(new Event("change"));
  }
  injectGlobals() {
    if (!document.getElementById("hyggehub-font")) {
      const t = document.createElement("link");
      t.id = "hyggehub-font", t.rel = "stylesheet", t.href = zs, document.head.appendChild(t);
    }
  }
  // A per-device copy so a reload paints the right look before the websocket answers.
  readCache(t) {
    try {
      const e = localStorage.getItem(jt + t);
      return e ? kt(JSON.parse(e)) : void 0;
    } catch {
      return;
    }
  }
  writeCache() {
    try {
      const t = JSON.stringify(this.appearance);
      localStorage.setItem(jt + "last", t), this.userId && localStorage.setItem(jt + this.userId, t);
    } catch {
    }
  }
}
const Is = "__hyggehubThemeEngine", x = window[Is] ??= new Fs();
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Et = globalThis, ie = Et.ShadowRoot && (Et.ShadyCSS === void 0 || Et.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ae = Symbol(), Te = /* @__PURE__ */ new WeakMap();
let ps = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== ae) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (ie && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Te.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Te.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ns = (n) => new ps(typeof n == "string" ? n : n + "", void 0, ae), E = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((s, i, r) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + n[r + 1], n[0]);
  return new ps(e, n, ae);
}, Hs = (n, t) => {
  if (ie) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = Et.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, n.appendChild(s);
  }
}, ze = ie ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Ns(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: js, defineProperty: Rs, getOwnPropertyDescriptor: Bs, getOwnPropertyNames: Us, getOwnPropertySymbols: Ws, getPrototypeOf: Ys } = Object, Ot = globalThis, De = Ot.trustedTypes, qs = De ? De.emptyScript : "", Gs = Ot.reactiveElementPolyfillSupport, ut = (n, t) => n, At = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? qs : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, ne = (n, t) => !js(n, t), Oe = { attribute: !0, type: String, converter: At, reflect: !1, useDefault: !1, hasChanged: ne };
Symbol.metadata ??= Symbol("metadata"), Ot.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let et = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Oe) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && Rs(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: r } = Bs(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: i, set(a) {
      const o = i?.call(this);
      r?.call(this, a), this.requestUpdate(t, o, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Oe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ut("elementProperties"))) return;
    const t = Ys(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ut("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ut("properties"))) {
      const e = this.properties, s = [...Us(e), ...Ws(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(ze(i));
    } else t !== void 0 && e.push(ze(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Hs(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : At).toAttribute(e, s.type);
      this._$Em = t, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const r = s.getPropertyOptions(i), a = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : At;
      this._$Em = i;
      const o = a.fromAttribute(e, r.type);
      this[i] = o ?? this._$Ej?.get(i) ?? o, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, r) {
    if (t !== void 0) {
      const a = this.constructor;
      if (i === !1 && (r = this[t]), s ??= a.getPropertyOptions(t), !((s.hasChanged ?? ne)(r, e) || s.useDefault && s.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: r }, a) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), r !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [i, r] of this._$Ep) this[i] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, r] of s) {
        const { wrapped: a } = r, o = this[i];
        a !== !0 || this._$AL.has(i) || o === void 0 || this.C(i, void 0, r, o);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
et.elementStyles = [], et.shadowRootOptions = { mode: "open" }, et[ut("elementProperties")] = /* @__PURE__ */ new Map(), et[ut("finalized")] = /* @__PURE__ */ new Map(), Gs?.({ ReactiveElement: et }), (Ot.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const re = globalThis, Le = (n) => n, Tt = re.trustedTypes, Pe = Tt ? Tt.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, us = "$lit$", q = `lit$${Math.random().toFixed(9).slice(2)}$`, gs = "?" + q, Vs = `<${gs}>`, Z = document, gt = () => Z.createComment(""), ft = (n) => n === null || typeof n != "object" && typeof n != "function", oe = Array.isArray, Ks = (n) => oe(n) || typeof n?.[Symbol.iterator] == "function", Rt = `[ 	
\f\r]`, dt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Fe = /-->/g, Ie = />/g, V = RegExp(`>|${Rt}(?:([^\\s"'>=/]+)(${Rt}*=${Rt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ne = /'/g, He = /"/g, fs = /^(?:script|style|textarea|title)$/i, ms = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), h = ms(1), $ = ms(2), J = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), je = /* @__PURE__ */ new WeakMap(), X = Z.createTreeWalker(Z, 129);
function bs(n, t) {
  if (!oe(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Pe !== void 0 ? Pe.createHTML(t) : t;
}
const Qs = (n, t) => {
  const e = n.length - 1, s = [];
  let i, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = dt;
  for (let o = 0; o < e; o++) {
    const l = n[o];
    let c, u, d = -1, p = 0;
    for (; p < l.length && (a.lastIndex = p, u = a.exec(l), u !== null); ) p = a.lastIndex, a === dt ? u[1] === "!--" ? a = Fe : u[1] !== void 0 ? a = Ie : u[2] !== void 0 ? (fs.test(u[2]) && (i = RegExp("</" + u[2], "g")), a = V) : u[3] !== void 0 && (a = V) : a === V ? u[0] === ">" ? (a = i ?? dt, d = -1) : u[1] === void 0 ? d = -2 : (d = a.lastIndex - u[2].length, c = u[1], a = u[3] === void 0 ? V : u[3] === '"' ? He : Ne) : a === He || a === Ne ? a = V : a === Fe || a === Ie ? a = dt : (a = V, i = void 0);
    const f = a === V && n[o + 1].startsWith("/>") ? " " : "";
    r += a === dt ? l + Vs : d >= 0 ? (s.push(c), l.slice(0, d) + us + l.slice(d) + q + f) : l + q + (d === -2 ? o : f);
  }
  return [bs(n, r + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class mt {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let r = 0, a = 0;
    const o = t.length - 1, l = this.parts, [c, u] = Qs(t, e);
    if (this.el = mt.createElement(c, s), X.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = X.nextNode()) !== null && l.length < o; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(us)) {
          const p = u[a++], f = i.getAttribute(d).split(q), m = /([.?@])?(.*)/.exec(p);
          l.push({ type: 1, index: r, name: m[2], strings: f, ctor: m[1] === "." ? Zs : m[1] === "?" ? Js : m[1] === "@" ? ti : Lt }), i.removeAttribute(d);
        } else d.startsWith(q) && (l.push({ type: 6, index: r }), i.removeAttribute(d));
        if (fs.test(i.tagName)) {
          const d = i.textContent.split(q), p = d.length - 1;
          if (p > 0) {
            i.textContent = Tt ? Tt.emptyScript : "";
            for (let f = 0; f < p; f++) i.append(d[f], gt()), X.nextNode(), l.push({ type: 2, index: ++r });
            i.append(d[p], gt());
          }
        }
      } else if (i.nodeType === 8) if (i.data === gs) l.push({ type: 2, index: r });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(q, d + 1)) !== -1; ) l.push({ type: 7, index: r }), d += q.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const s = Z.createElement("template");
    return s.innerHTML = t, s;
  }
}
function rt(n, t, e = n, s) {
  if (t === J) return t;
  let i = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const r = ft(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== r && (i?._$AO?.(!1), r === void 0 ? i = void 0 : (i = new r(n), i._$AT(n, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = i : e._$Cl = i), i !== void 0 && (t = rt(n, i._$AS(n, t.values), i, s)), t;
}
let Xs = class {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = (t?.creationScope ?? Z).importNode(e, !0);
    X.currentNode = i;
    let r = X.nextNode(), a = 0, o = 0, l = s[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let c;
        l.type === 2 ? c = new lt(r, r.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(r, l.name, l.strings, this, t) : l.type === 6 && (c = new ei(r, this, t)), this._$AV.push(c), l = s[++o];
      }
      a !== l?.index && (r = X.nextNode(), a++);
    }
    return X.currentNode = Z, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
};
class lt {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = g, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = rt(this, t, e), ft(t) ? t === g || t == null || t === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : t !== this._$AH && t !== J && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ks(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== g && ft(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Z.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = mt.createElement(bs(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const r = new Xs(i, this), a = r.u(this.options);
      r.p(e), this.T(a), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = je.get(t.strings);
    return e === void 0 && je.set(t.strings, e = new mt(t)), e;
  }
  k(t) {
    oe(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const r of t) i === e.length ? e.push(s = new lt(this.O(gt()), this.O(gt()), this, this.options)) : s = e[i], s._$AI(r), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = Le(t).nextSibling;
      Le(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Lt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, r) {
    this.type = 1, this._$AH = g, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = g;
  }
  _$AI(t, e = this, s, i) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) t = rt(this, t, e, 0), a = !ft(t) || t !== this._$AH && t !== J, a && (this._$AH = t);
    else {
      const o = t;
      let l, c;
      for (t = r[0], l = 0; l < r.length - 1; l++) c = rt(this, o[s + l], e, l), c === J && (c = this._$AH[l]), a ||= !ft(c) || c !== this._$AH[l], c === g ? t = g : t !== g && (t += (c ?? "") + r[l + 1]), this._$AH[l] = c;
    }
    a && !i && this.j(t);
  }
  j(t) {
    t === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Zs extends Lt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === g ? void 0 : t;
  }
}
class Js extends Lt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== g);
  }
}
class ti extends Lt {
  constructor(t, e, s, i, r) {
    super(t, e, s, i, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = rt(this, t, e, 0) ?? g) === J) return;
    const s = this._$AH, i = t === g && s !== g || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== g && (s === g || i);
    i && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ei {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    rt(this, t);
  }
}
const si = { I: lt }, ii = re.litHtmlPolyfillSupport;
ii?.(mt, lt), (re.litHtmlVersions ??= []).push("3.3.3");
const ai = (n, t, e) => {
  const s = e?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const r = e?.renderBefore ?? null;
    s._$litPart$ = i = new lt(t.insertBefore(gt(), r), r, void 0, e ?? {});
  }
  return i._$AI(n), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le = globalThis;
let nt = class extends et {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ai(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return J;
  }
};
nt._$litElement$ = !0, nt.finalized = !0, le.litElementHydrateSupport?.({ LitElement: nt });
const ni = le.litElementPolyfillSupport;
ni?.({ LitElement: nt });
(le.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ri = { attribute: !0, type: String, converter: At, reflect: !1, hasChanged: ne }, oi = (n = ri, t, e) => {
  const { kind: s, metadata: i } = e;
  let r = globalThis.litPropertyMetadata.get(i);
  if (r === void 0 && globalThis.litPropertyMetadata.set(i, r = /* @__PURE__ */ new Map()), s === "setter" && ((n = Object.create(n)).wrapped = !0), r.set(e.name, n), s === "accessor") {
    const { name: a } = e;
    return { set(o) {
      const l = t.get.call(this);
      t.set.call(this, o), this.requestUpdate(a, l, n, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(a, void 0, n, o), o;
    } };
  }
  if (s === "setter") {
    const { name: a } = e;
    return function(o) {
      const l = this[a];
      t.call(this, o), this.requestUpdate(a, l, n, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function xt(n) {
  return (t, e) => typeof e == "object" ? oi(n, t, e) : ((s, i, r) => {
    const a = i.hasOwnProperty(r);
    return i.constructor.createProperty(r, s), a ? Object.getOwnPropertyDescriptor(i, r) : void 0;
  })(n, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function v(n) {
  return xt({ ...n, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const vs = (n, t, e) => (e.configurable = !0, e.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(n, t, e), e);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function wt(n, t) {
  return (e, s, i) => {
    const r = (a) => a.renderRoot?.querySelector(n) ?? null;
    return vs(e, s, { get() {
      return r(this);
    } });
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let li;
function ci(n) {
  return (t, e) => vs(t, e, { get() {
    return (this.renderRoot ?? (li ??= document.createDocumentFragment())).querySelectorAll(n);
  } });
}
var hi = Object.defineProperty, di = Object.getOwnPropertyDescriptor, ys = (n, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? di(t, e) : t, r = n.length - 1, a; r >= 0; r--)
    (a = n[r]) && (i = (s ? a(t, e, i) : a(i)) || i);
  return s && i && hi(t, e, i), i;
};
const ce = class St extends nt {
  constructor() {
    super(...arguments), this.held = !1, this.onScreen = !0;
  }
  /** One observer for every card: off-screen cards pause their animations (via --hh-play). */
  static observer() {
    return St.seen ??= new IntersectionObserver((t) => {
      for (const e of t) {
        const s = e.target;
        s.onScreen = e.isIntersecting, e.isIntersecting ? s.style.removeProperty("--hh-play") : s.style.setProperty("--hh-play", "paused");
      }
    });
  }
  connectedCallback() {
    super.connectedCallback(), St.observer().observe(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), St.observer().unobserve(this);
  }
  set hass(t) {
    const e = this._hass;
    this._hass = t, t && x.setHass(t), this.requestUpdate("hass", e);
  }
  get hass() {
    return this._hass;
  }
  setConfig(t) {
    if (!t || typeof t != "object") throw new Error("Invalid configuration");
    this.validateConfig(t), this.config = t;
  }
  /** Throw an Error with a plain explanation; Home Assistant shows it in place of the card. */
  validateConfig(t) {
  }
  /** Entities whose changes should re-render this card. */
  watchedEntities() {
    return [];
  }
  getCardSize() {
    return 3;
  }
  /** Sections view: a full-width card by default. */
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }
  shouldUpdate(t) {
    if (!this.config) return !1;
    if (!(t.size === 1 && t.has("hass"))) return !0;
    const e = t.get("hass"), s = this.hass;
    return !e || !s || e.locale !== s.locale || e.user !== s.user ? !0 : this.watchedEntities().some((i) => !!i && e.states[i] !== s.states[i]);
  }
  stateOf(t) {
    return t ? this.hass?.states[t] : void 0;
  }
  format(t) {
    return ds(this.hass, this.stateOf(t));
  }
  callService(t, e, s = {}, i) {
    return this.hass.callService(t, e, s, i);
  }
  moreInfo(t) {
    t && this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: t }, bubbles: !0, composed: !0 }));
  }
  // Tap / hold: tap runs the action, holding for half a second opens more-info, like native cards.
  holdStart(t) {
    this.held = !1, clearTimeout(this.holdTimer), this.holdTimer = window.setTimeout(() => {
      this.held = !0, navigator.vibrate?.(10), t();
    }, 500);
  }
  holdEnd() {
    clearTimeout(this.holdTimer);
  }
  tap(t) {
    if (this.held) {
      this.held = !1;
      return;
    }
    t();
  }
};
ys([
  v()
], ce.prototype, "config", 2);
ys([
  xt({ attribute: !1, noAccessor: !0 })
], ce.prototype, "hass", 1);
let L = ce;
function P(n, t, e, s) {
  customElements.get(n) || customElements.define(n, t), window.customCards = window.customCards || [], window.customCards.some((i) => i.type === n) || window.customCards.push({ type: n, name: e, description: s, preview: !0 });
}
const pi = {
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6L6 18",
  plus: "M12 5v14M5 12h14",
  undo: "M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3",
  left: "M19 12H5M11 6l-6 6 6 6",
  chev: "M6 9l6 6 6-6",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  backspace: "M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7zM13 10l4 4M17 10l-4 4",
  shield: "M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6zM9 12l2 2 4-4",
  shieldAlert: "M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6zM12 8v5M12 16h.01",
  lock: "M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM8 11V8a4 4 0 0 1 8 0v3",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 21h4",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z",
  drop: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  moon: "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z",
  sliders: "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M16 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM10 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM18 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
  info: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 8h.01",
  menu: "M4 7h16M4 12h16M4 17h16",
  home: "M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5",
  speaker: "M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM12 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 7h.01"
}, ui = {
  play: "M8 5.5v13l10.5-6.5z",
  pause: "M7 5h3.6v14H7zM13.4 5H17v14h-3.6z",
  next: "M6 6l9 6-9 6zM16.5 6h2v12h-2z",
  prev: "M18 6l-9 6 9 6zM5.5 6h2v12h-2z"
}, y = (n, t = "") => $`<svg class="i ${t}" viewBox="0 0 24 24" aria-hidden="true"><path d=${pi[n]}></path></svg>`, Bt = (n, t = "") => $`<svg class="i fill ${t}" viewBox="0 0 24 24" aria-hidden="true"><path d=${ui[n]}></path></svg>`, I = (n, t = "") => n ? h`<ha-icon class=${t} .icon=${n}></ha-icon>` : g, A = E`
  :host {
    display: block;
    font-family: var(--hh-font, system-ui, sans-serif);
    color: var(--hh-ink, #18242a);
    -webkit-font-smoothing: antialiased;
    --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
    --spring: cubic-bezier(0.34, 1.5, 0.64, 1);
    --mdc-icon-size: 20px;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    animation-play-state: var(--hh-play, running);
  }
  button,
  input,
  textarea {
    font: inherit;
    color: inherit;
  }
  button {
    cursor: pointer;
    border: 0;
    background: none;
    padding: 0;
  }
  :focus-visible {
    outline: 2px solid var(--hh-accent, #2f6e86);
    outline-offset: 2px;
  }
  svg.i {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
    flex: none;
  }
  svg.i.fill {
    fill: currentColor;
    stroke: none;
  }
  .num {
    font-variant-numeric: tabular-nums;
  }
  .muted {
    color: var(--hh-ink-2);
  }
  .faint {
    color: var(--hh-ink-3);
  }
  [hidden] {
    display: none !important;
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition-duration: 0.01ms !important;
    }
  }
`, T = E`
  .glass,
  ha-card.glass {
    background: var(--hh-glass, rgba(255, 255, 255, 0.44));
    -webkit-backdrop-filter: blur(var(--hh-blur, 22px)) saturate(160%);
    backdrop-filter: blur(var(--hh-blur, 22px)) saturate(160%);
    border: 1px solid var(--hh-stroke, rgba(255, 255, 255, 0.72));
    box-shadow: var(--hh-shadow), inset 0 1px 0 var(--hh-highlight, rgba(255, 255, 255, 0.6));
    color: var(--hh-ink);
  }
  ha-card.glass {
    border-radius: 26px;
    padding: 18px;
    position: relative;
    overflow: hidden;
    min-width: 0;
    animation: hh-rise 0.55s var(--ease) both;
  }
  /* Cards settle into place when a dashboard opens: once, and only transform and opacity. */
  @keyframes hh-rise {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
  }
  .card-h {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 14px;
  }
  .card-h h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    background: var(--hh-glass-strong);
    border: 1px solid var(--hh-stroke);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }
  .btn-text {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--hh-accent);
    padding: 6px 8px;
    border-radius: 10px;
  }
  .btn-text:hover {
    background: var(--hh-accent-soft);
  }
  .round {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--hh-glass-strong);
    border: 1px solid var(--hh-stroke);
    transition: transform 0.25s var(--spring), background 0.2s;
  }
  .round:hover {
    background: var(--hh-glass-press);
  }
  .round:active {
    transform: scale(0.92);
  }
  .tick {
    animation: hh-tick 0.45s var(--ease);
  }
  @keyframes hh-tick {
    from {
      transform: translateY(-60%);
      opacity: 0;
    }
  }
  @keyframes hh-spin {
    to {
      transform: rotate(360deg);
    }
  }
`, de = class de extends L {
  static getStubConfig(t) {
    return { people: Object.keys(t?.states ?? {}).filter((e) => e.startsWith("person.")) };
  }
  watchedEntities() {
    return [...this.config.people ?? [], ...(this.config.chips ?? []).map((t) => t.entity)];
  }
  getCardSize() {
    return 2;
  }
  connectedCallback() {
    super.connectedCallback(), this.ticker = window.setInterval(() => this.requestUpdate(), 1e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this.ticker);
  }
  peopleChip() {
    const t = this.config.people ?? [];
    if (!t.length) return g;
    const e = t.map((r) => this.stateOf(r)).filter(Boolean), s = e.filter((r) => r.state === "home"), i = s.length === e.length ? "Everyone home" : s.length === 0 ? "Nobody home" : `${s.length} of ${e.length} home`;
    return h`<span class="pill">
      <span class="avatars">
        ${e.map((r) => {
      const a = r.attributes.entity_picture, o = B(r, "?");
      return h`<span class=${r.state === "home" ? "home" : "away"} title=${o}>${a ? h`<img src=${a} alt="" />` : o.charAt(0)}</span>`;
    })}
      </span>
      ${i}
    </span>`;
  }
  render() {
    const t = /* @__PURE__ */ new Date(), e = t.getHours(), s = e < 5 ? "Good night" : e < 12 ? "Good morning" : e < 18 ? "Good afternoon" : "Good evening", i = this.config.greet_by_name === !1 ? "" : this.hass?.user?.name?.split(" ")[0];
    return h`
      <div class="hero">
        <div>
          <div class="time num">${it(e)}:${it(t.getMinutes())}</div>
          <p class="greet"><b>${s}${i ? `, ${i}` : ""}</b> · ${t.toLocaleDateString(D(this.hass), { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
        <div class="chips">
          ${this.peopleChip()}
          ${(this.config.chips ?? []).map((r) => {
      const a = this.stateOf(r.entity);
      return h`<button class="pill" type="button" @click=${() => this.moreInfo(r.entity)}>
              ${I(r.icon ?? a?.attributes.icon ?? "mdi:information-outline")}
              ${r.name ? h`<span class="faint">${r.name}</span>` : g}${this.format(r.entity)}
            </button>`;
    })}
        </div>
      </div>
    `;
  }
};
de.styles = [
  A,
  T,
  E`
      .hero {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 20px;
        flex-wrap: wrap;
        padding: 18px 4px 8px;
      }
      .time {
        font-weight: 200;
        font-size: clamp(56px, 9vw, 104px);
        line-height: 0.9;
        letter-spacing: -0.04em;
      }
      .greet {
        margin: 10px 0 0;
        font-size: 18px;
        color: var(--hh-ink-2);
      }
      .greet b {
        color: var(--hh-ink);
        font-weight: 600;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        max-width: 560px;
        justify-content: flex-end;
        --mdc-icon-size: 16px;
      }
      .chips .pill {
        padding: 8px 12px;
        font-size: 12.5px;
        -webkit-backdrop-filter: blur(var(--hh-blur));
        backdrop-filter: blur(var(--hh-blur));
      }
      .avatars {
        display: inline-flex;
      }
      .avatars span {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        overflow: hidden;
        font-size: 10px;
        font-weight: 700;
        color: var(--hh-on-accent);
        background: var(--hh-accent);
        border: 2px solid var(--hh-glass-strong);
      }
      .avatars span.away {
        filter: grayscale(1);
        opacity: 0.55;
      }
      .avatars span + span {
        margin-left: -6px;
      }
      .avatars img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      @media (max-width: 560px) {
        .chips {
          justify-content: flex-start;
        }
      }
    `
];
let Vt = de;
P("hyggehub-header-card", Vt, "HyggeHub Header", "The time, a greeting and status chips for the top of a dashboard.");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gi = { CHILD: 2 }, fi = (n) => (...t) => ({ _$litDirective$: n, values: t });
let mi = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, s) {
    this._$Ct = t, this._$AM = e, this._$Ci = s;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: bi } = si, Re = (n) => n, Be = () => document.createComment(""), pt = (n, t, e) => {
  const s = n._$AA.parentNode, i = t === void 0 ? n._$AB : t._$AA;
  if (e === void 0) {
    const r = s.insertBefore(Be(), i), a = s.insertBefore(Be(), i);
    e = new bi(r, a, n, n.options);
  } else {
    const r = e._$AB.nextSibling, a = e._$AM, o = a !== n;
    if (o) {
      let l;
      e._$AQ?.(n), e._$AM = n, e._$AP !== void 0 && (l = n._$AU) !== a._$AU && e._$AP(l);
    }
    if (r !== i || o) {
      let l = e._$AA;
      for (; l !== r; ) {
        const c = Re(l).nextSibling;
        Re(s).insertBefore(l, i), l = c;
      }
    }
  }
  return e;
}, K = (n, t, e = n) => (n._$AI(t, e), n), vi = {}, yi = (n, t = vi) => n._$AH = t, xi = (n) => n._$AH, Ut = (n) => {
  n._$AR(), n._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ue = (n, t, e) => {
  const s = /* @__PURE__ */ new Map();
  for (let i = t; i <= e; i++) s.set(n[i], i);
  return s;
}, Kt = fi(class extends mi {
  constructor(n) {
    if (super(n), n.type !== gi.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(n, t, e) {
    let s;
    e === void 0 ? e = t : t !== void 0 && (s = t);
    const i = [], r = [];
    let a = 0;
    for (const o of n) i[a] = s ? s(o, a) : a, r[a] = e(o, a), a++;
    return { values: r, keys: i };
  }
  render(n, t, e) {
    return this.dt(n, t, e).values;
  }
  update(n, [t, e, s]) {
    const i = xi(n), { values: r, keys: a } = this.dt(t, e, s);
    if (!Array.isArray(i)) return this.ut = a, r;
    const o = this.ut ??= [], l = [];
    let c, u, d = 0, p = i.length - 1, f = 0, m = r.length - 1;
    for (; d <= p && f <= m; ) if (i[d] === null) d++;
    else if (i[p] === null) p--;
    else if (o[d] === a[f]) l[f] = K(i[d], r[f]), d++, f++;
    else if (o[p] === a[m]) l[m] = K(i[p], r[m]), p--, m--;
    else if (o[d] === a[m]) l[m] = K(i[d], r[m]), pt(n, l[m + 1], i[d]), d++, m--;
    else if (o[p] === a[f]) l[f] = K(i[p], r[f]), pt(n, i[d], i[p]), p--, f++;
    else if (c === void 0 && (c = Ue(a, f, m), u = Ue(o, d, p)), c.has(o[d])) if (c.has(o[p])) {
      const w = u.get(a[f]), b = w !== void 0 ? i[w] : null;
      if (b === null) {
        const k = pt(n, i[d]);
        K(k, r[f]), l[f] = k;
      } else l[f] = K(b, r[f]), pt(n, i[d], b), i[w] = null;
      f++;
    } else Ut(i[p]), p--;
    else Ut(i[d]), d++;
    for (; f <= m; ) {
      const w = pt(n, l[m + 1]);
      K(w, r[f]), l[f++] = w;
    }
    for (; d <= p; ) {
      const w = i[d++];
      w !== null && Ut(w);
    }
    return this.ut = a, yi(n, l), J;
  }
});
var wi = Object.defineProperty, Pt = (n, t, e, s) => {
  for (var i = void 0, r = n.length - 1, a; r >= 0; r--)
    (a = n[r]) && (i = a(t, e, i) || i);
  return i && wi(t, e, i), i;
};
const $i = [
  { match: "login attempt|unauthori", icon: "mdi:shield-alert-outline", severity: "crit" },
  { match: "leak|smoke|fire|flood", icon: "mdi:alert-octagon-outline", severity: "crit" },
  { match: "battery", icon: "mdi:battery-alert-variant-outline", severity: "crit" },
  { match: "laundry|washing|wash|dryer", icon: "mdi:washing-machine", severity: "info" },
  { match: "door|window|open", icon: "mdi:door-open", severity: "warn" },
  { match: "update|upgrade", icon: "mdi:package-up", severity: "info" },
  { match: "delivered|parcel|package", icon: "mdi:package-variant-closed", severity: "ok" },
  { match: "done|finished|complete|ready", icon: "mdi:check-circle-outline", severity: "ok" }
], We = { info: "var(--hh-accent)", ok: "var(--hh-ok)", warn: "var(--hh-warn)", crit: "var(--hh-crit)" }, Ye = (n) => n.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`#>]/g, "").replace(/\s+/g, " ").trim(), pe = class pe extends L {
  constructor() {
    super(...arguments), this.notes = {}, this.open = !1, this.loaded = !1, this.leaving = /* @__PURE__ */ new Set();
  }
  static getStubConfig() {
    return { title: "Notifications" };
  }
  getCardSize() {
    return 3;
  }
  connectedCallback() {
    super.connectedCallback(), this.hasUpdated && this.subscribe(), this.ageTimer = window.setInterval(() => this.requestUpdate(), 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.unsub?.then((t) => t()).catch(() => {
    }), this.unsub = void 0, clearInterval(this.ageTimer);
  }
  subscribe() {
    this.unsub || !this.hass || (this.unsub = this.hass.connection.subscribeMessage((t) => {
      const e = t.type === "current" ? {} : { ...this.notes };
      if (t.type === "removed") for (const s of Object.keys(t.notifications)) delete e[s];
      else Object.assign(e, t.notifications);
      this.notes = e, this.loaded = !0;
    }, { type: "persistent_notification/subscribe" }).catch((t) => (console.warn("HyggeHub: notifications unavailable", t), this.loaded = !0, () => {
    })));
  }
  updated(t) {
    super.updated(t), t.has("hass") && this.subscribe();
  }
  get list() {
    return Object.values(this.notes).sort((t, e) => e.created_at.localeCompare(t.created_at));
  }
  lookFor(t) {
    const e = `${t.notification_id} ${t.title ?? ""} ${t.message}`;
    for (const s of [...this.config.rules ?? [], ...$i]) {
      let i = !1;
      try {
        i = new RegExp(s.match, "i").test(e);
      } catch {
        i = e.toLowerCase().includes(s.match.toLowerCase());
      }
      if (i) return { icon: s.icon ?? "mdi:bell-outline", color: We[s.severity ?? "info"] };
    }
    return { icon: "mdi:bell-outline", color: We.info };
  }
  /*
   * Layout is pure CSS: collapsed, every note shares one grid cell (the cell is as tall as the top note,
   * plus room for the peeking edges); open, they're an ordinary column. The card therefore always
   * reports its true height, however Home Assistant resizes or re-parents it.
   *
   * Movement between the two is animated FLIP-style: measure each note, make the change, then play each
   * note from where it was to where it landed.
   */
  async flip(t) {
    const e = [...this.stackEl?.querySelectorAll(".note:not(.leaving)") ?? []], s = new Map(e.map((i) => [i, i.getBoundingClientRect()]));
    if (t(), await this.updateComplete, !!x.motionOn)
      for (const i of e) {
        if (!i.isConnected || i.classList.contains("leaving")) continue;
        const r = s.get(i), a = i.getBoundingClientRect();
        if (!a.width || !r.width) continue;
        const o = r.left + r.width / 2 - (a.left + a.width / 2), l = r.bottom - a.bottom, c = r.width / a.width;
        if (Math.abs(o) < 0.5 && Math.abs(l) < 0.5 && Math.abs(c - 1) < 5e-3) continue;
        const u = getComputedStyle(i).transform;
        i.animate([{ transform: `translate(${o}px, ${l}px) scale(${c})${u === "none" ? "" : ` ${u}`}` }, { transform: u }], {
          duration: 480,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
        });
      }
  }
  toggle() {
    this.flip(() => this.open = !this.open);
  }
  dismiss(t, e, s = 1) {
    this.leaving.has(t) || (e && (e.style.translate = `${s * 115}% 0`, e.style.opacity = "0"), this.flip(() => {
      this.leaving.add(t), this.requestUpdate();
    }), setTimeout(() => {
      this.callService("persistent_notification", "dismiss", { notification_id: t }).catch(() => {
        this.leaving.delete(t), e && (e.style.translate = "", e.style.opacity = ""), this.requestUpdate();
      });
    }, 320));
  }
  clearAll() {
    [...this.stackEl?.querySelectorAll(".note") ?? []].forEach((e, s) => setTimeout(() => this.dismiss(e.dataset.id, e), s * 80));
  }
  onDown(t, e, s) {
    if (t.target.closest("button") || !this.open && s !== 0) return;
    const i = t.currentTarget, r = t.clientX;
    let a = 0, o = !1;
    i.setPointerCapture(t.pointerId);
    const l = (u) => {
      a = u.clientX - r, !o && Math.abs(a) > 6 && (o = !0, i.classList.add("dragging")), o && (i.style.translate = `${a}px 0`, i.style.opacity = String(Math.max(0.15, 1 - Math.abs(a) / 320)));
    }, c = () => {
      if (i.removeEventListener("pointermove", l), i.removeEventListener("pointerup", c), i.removeEventListener("pointercancel", c), i.classList.remove("dragging"), o && Math.abs(a) > 90) return this.dismiss(e.notification_id, i, Math.sign(a));
      i.style.translate = "", i.style.opacity = "", o || this.toggle();
    };
    i.addEventListener("pointermove", l), i.addEventListener("pointerup", c), i.addEventListener("pointercancel", c);
  }
  render() {
    for (const i of this.leaving) this.notes[i] || this.leaving.delete(i);
    const t = this.list, e = t.filter((i) => !this.leaving.has(i.notification_id));
    if (!e.length && this.config.hide_when_empty) return h``;
    let s = 0;
    return h`
      <div class="head">
        <h2>${this.config.title ?? "Notifications"} <span class="faint num">${e.length || ""}</span></h2>
        ${e.length ? h`<div>
              ${e.length > 1 ? h`<button class="btn-text" type="button" @click=${this.toggle}>${this.open ? "Stack" : "Show all"}</button>` : g}
              <button class="btn-text" type="button" @click=${this.clearAll}>Clear</button>
            </div>` : g}
      </div>
      <div class="stack ${this.open ? "open" : ""}" style="--peeks:${Math.min(Math.max(e.length - 1, 0), 2)}" aria-live="polite">
        ${Kt(
      t,
      (i) => i.notification_id,
      (i) => {
        const r = this.lookFor(i), a = this.leaving.has(i.notification_id), o = a ? 0 : Math.min(s++, 3);
        return h`<div
              class="note glass ${a ? "leaving" : ""}"
              data-id=${i.notification_id}
              data-depth=${o}
              tabindex=${o === 0 || this.open ? 0 : -1}
              role="button"
              aria-expanded=${this.open}
              style="--sev:${r.color};z-index:${10 - o}"
              @pointerdown=${(l) => this.onDown(l, i, o)}
              @keydown=${(l) => {
          l.target === l.currentTarget && (l.key === "Enter" || l.key === " " ? (l.preventDefault(), this.toggle()) : (l.key === "Delete" || l.key === "Backspace") && this.dismiss(i.notification_id, l.currentTarget));
        }}
            >
              <div class="ic">${I(r.icon)}</div>
              <div class="body">
                <div class="t"><span>${i.title ? Ye(i.title) : "Home Assistant"}</span><time>${Ms(i.created_at)}</time></div>
                <p>${Ye(i.message)}</p>
                <div class="actions">
                  <button type="button" @click=${(l) => this.dismiss(i.notification_id, l.target.closest(".note"))}>Dismiss</button>
                </div>
              </div>
            </div>`;
      }
    )}
      </div>
      ${!e.length && this.loaded ? h`<div class="empty glass">
            <div class="ic">${y("bell")}</div>
            <div><b>All caught up</b><div class="muted">Nothing needs you right now.</div></div>
          </div>` : g}
      ${e.length ? h`<p class="hint">Tap to ${this.open ? "stack" : "fan out"}, drag sideways to dismiss</p>` : g}
    `;
  }
};
pe.styles = [
  A,
  T,
  E`
      .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 6px;
        min-height: 30px;
        margin-bottom: 8px;
      }
      .head h2 {
        margin: 0;
        font-size: 11.5px;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--hh-ink-2);
      }
      .stack {
        position: relative;
        display: grid;
        gap: 10px;
      }
      /* Collapsed: one shared cell. Notes behind the top one drop their content so they stretch to
         exactly its height, then peek out below it. */
      .stack:not(.open) {
        gap: 0;
        padding-bottom: calc(var(--peeks, 0) * 11px);
      }
      .stack:not(.open) .note {
        grid-area: 1 / 1;
      }
      .stack:not(.open) .note:not([data-depth='0']) > * {
        display: none;
      }
      .stack:not(.open) .note[data-depth='1'] {
        transform: translateY(11px) scale(0.95);
      }
      .stack:not(.open) .note[data-depth='2'] {
        transform: translateY(22px) scale(0.9);
      }
      .stack:not(.open) .note[data-depth='3'] {
        transform: translateY(22px) scale(0.9);
        opacity: 0;
        pointer-events: none;
      }
      .note.leaving {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        pointer-events: none;
      }
      .note {
        position: relative;
        display: flex;
        gap: 12px;
        align-items: flex-start;
        padding: 14px 14px 14px 12px;
        border-radius: 20px;
        cursor: pointer;
        user-select: none;
        touch-action: pan-y;
        transform-origin: 50% 100%;
        transition: opacity 0.4s var(--ease), translate 0.35s var(--ease);
      }
      .note.dragging {
        transition: none;
      }
      .ic {
        width: 38px;
        height: 38px;
        border-radius: 13px;
        display: grid;
        place-items: center;
        flex: none;
        color: var(--sev);
        background: color-mix(in srgb, var(--sev) 16%, transparent);
        transition: opacity 0.3s;
      }
      .body {
        flex: 1;
        min-width: 0;
        transition: opacity 0.3s;
      }
      .t {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        font-weight: 600;
        font-size: 14px;
      }
      .t time {
        font-weight: 400;
        font-size: 12px;
        color: var(--hh-ink-3);
        white-space: nowrap;
      }
      .note p {
        margin: 2px 0 0;
        color: var(--hh-ink-2);
        font-size: 13px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .stack.open .note p {
        -webkit-line-clamp: 8;
      }
      .actions {
        display: flex;
        gap: 6px;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.4s var(--ease), margin 0.4s var(--ease);
      }
      .stack.open .actions {
        max-height: 40px;
        margin-top: 10px;
      }
      .actions button {
        font-size: 12px;
        font-weight: 600;
        padding: 5px 10px;
        border-radius: 9px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
      }
      .empty {
        border-radius: 20px;
        padding: 18px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 12.5px;
      }
      .empty b {
        font-size: 14px;
      }
      .empty .ic {
        --sev: var(--hh-accent);
      }
      .hint {
        margin: 8px 6px 0;
        font-size: 12px;
        color: var(--hh-ink-3);
      }
    `
];
let tt = pe;
Pt([
  v()
], tt.prototype, "notes");
Pt([
  v()
], tt.prototype, "open");
Pt([
  v()
], tt.prototype, "loaded");
Pt([
  wt(".stack")
], tt.prototype, "stackEl");
P("hyggehub-notification-stack-card", tt, "HyggeHub Notification stack", "Home Assistant notifications as a swipeable, stacked pile.");
var ki = Object.defineProperty, xs = (n, t, e, s) => {
  for (var i = void 0, r = n.length - 1, a; r >= 0; r--)
    (a = n[r]) && (i = a(t, e, i) || i);
  return i && ki(t, e, i), i;
};
const _i = /* @__PURE__ */ new Set(["light", "switch", "input_boolean", "fan", "cover"]), Mi = $`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="1.6"></circle><path d="M12 10.4c-.6-4.2.6-6.9 3-6.9 2.6 0 3.5 3.2-1.6 7.7M13.4 13.1c3.4 2.6 4.6 5.3 3.4 7.4-1.3 2.2-4.5 1.4-5.8-5.3M10.6 12.6c-3.9 1.6-6.9 1.3-8-.8-1.3-2.2 1-4.6 7.5-2.4"></path></svg>`, Ci = $`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3.5h18M12 3.5v16"></path><g class="slats"><path d="M5 4v12h14V4M5 8h14M5 12h14"></path></g><circle cx="12" cy="20.5" r=".9"></circle></svg>`, ue = class ue extends L {
  constructor() {
    super(...arguments), this.pending = {}, this.lastSent = 0;
  }
  static getStubConfig(t) {
    return { name: "Living room", icon: "mdi:sofa", entities: Object.keys(t?.states ?? {}).filter((s) => s.startsWith("light.")).slice(0, 3) };
  }
  validateConfig(t) {
    if (!t.name) throw new Error("Give the room a `name`.");
  }
  get ents() {
    return (this.config.entities ?? []).map((t) => {
      const e = typeof t == "string" ? { entity: t } : t;
      return { ...e, kind: e.kind ?? this.detectKind(e.entity) };
    });
  }
  detectKind(t) {
    const e = t.split(".")[0];
    return e === "light" ? "light" : e === "fan" ? "fan" : e === "cover" ? "cover" : e === "switch" && /light|lamp|lampe|lys/i.test(t) ? "light" : _i.has(e) ? "toggle" : "info";
  }
  watchedEntities() {
    return [this.config.temperature, this.config.humidity, this.config.dimmer, ...this.ents.map((t) => t.entity)];
  }
  willUpdate(t) {
    const e = t.get("hass");
    if (e && this.hass && Object.keys(this.pending).length) {
      const s = { ...this.pending };
      for (const i of Object.keys(s)) e.states[i] !== this.hass.states[i] && delete s[i];
      this.pending = s;
    }
  }
  isOn(t, e) {
    if (t in this.pending) return this.pending[t];
    const s = this.stateOf(t)?.state;
    return e === "cover" ? s === "open" || s === "opening" : s === "on";
  }
  toggle(t) {
    if (t.kind === "info") return this.moreInfo(t.entity);
    const e = t.entity.split(".")[0];
    this.pending = { ...this.pending, [t.entity]: !this.isOn(t.entity, t.kind) }, this.callService(e, "toggle", {}, { entity_id: t.entity }).catch(() => this.clearPending(t.entity));
  }
  toggleRoom() {
    const t = this.ents.filter((i) => i.kind === "light");
    if (!t.length) return this.moreInfo(this.config.temperature ?? this.ents[0]?.entity);
    const e = t.some((i) => this.isOn(i.entity, "light")), s = { ...this.pending };
    t.forEach((i) => s[i.entity] = !e), this.pending = s, this.callService("homeassistant", e ? "turn_off" : "turn_on", {}, { entity_id: t.map((i) => i.entity) }).catch(() => this.pending = {});
  }
  clearPending(t) {
    const e = { ...this.pending };
    delete e[t], this.pending = e;
  }
  get brightnessPct() {
    if (this.dragPct !== void 0) return this.dragPct;
    const t = this.stateOf(this.config.dimmer);
    return !t || t.state !== "on" ? 0 : Math.max(1, Math.round((t.attributes.brightness ?? 255) / 2.55));
  }
  onDim(t, e) {
    const s = Number(t.target.value);
    this.dragPct = s;
    const i = () => {
      this.lastSent = Date.now(), this.callService("light", "turn_on", { brightness_pct: s }, { entity_id: this.config.dimmer });
    };
    clearTimeout(this.sendTimer), e ? (i(), this.sendTimer = window.setTimeout(() => this.dragPct = void 0, 1500)) : Date.now() - this.lastSent > 350 ? i() : this.sendTimer = window.setTimeout(i, 350);
  }
  statusLine() {
    const t = this.ents, e = t.filter((i) => i.kind === "light" && this.isOn(i.entity, i.kind)).length, s = [e ? `${e} light${e > 1 ? "s" : ""} on` : "Lights off"];
    for (const i of t) {
      const r = (i.name ?? B(this.stateOf(i.entity), i.entity)).toLowerCase();
      i.kind === "fan" && this.isOn(i.entity, i.kind) && s.push(`${r} running`), i.kind === "cover" && s.push(`${r} ${this.isOn(i.entity, i.kind) ? "open" : "closed"}`);
    }
    return s.join(" · ");
  }
  entityIcon(t, e) {
    return t.icon ? I(t.icon) : t.kind === "light" ? y("bulb") : t.kind === "fan" ? Mi : t.kind === "cover" ? Ci : I(e?.attributes.icon ?? "mdi:toggle-switch-outline");
  }
  render() {
    const t = this.config, e = this.ents, s = e.some((c) => c.kind === "light" && this.isOn(c.entity, c.kind)), i = R(this.stateOf(t.temperature)), r = R(this.stateOf(t.humidity)), a = this.brightnessPct, o = t.dimmer ? a / 100 : 0.7, l = Math.min(Math.max(e.length, 1), 4);
    return h`
      <ha-card class="glass room" data-on=${s} style="--level:${o}">
        <div class="top">
          <button
            class="room-icon"
            type="button"
            aria-pressed=${s}
            aria-label="${t.name} lights"
            @click=${() => this.tap(() => this.toggleRoom())}
            @pointerdown=${() => this.holdStart(() => this.moreInfo(t.temperature ?? e[0]?.entity))}
            @pointerup=${this.holdEnd}
            @pointerleave=${this.holdEnd}
            @pointercancel=${this.holdEnd}
          >
            ${I(t.icon ?? "mdi:home-outline")}
          </button>
          <div class="meta">
            <h3>${t.name}</h3>
            <p class="status">${this.statusLine()}</p>
          </div>
          ${i !== void 0 || r !== void 0 ? h`<button class="climate num" type="button" @click=${() => this.moreInfo(t.temperature ?? t.humidity)}>
                ${i !== void 0 ? h`<b>${i.toFixed(1)}°</b>` : g}
                ${r !== void 0 ? h`<small>${y("drop")}${Math.round(r)}%</small>` : g}
              </button>` : g}
        </div>
        ${e.length ? h`<div class="ents" style="grid-template-columns:repeat(${l},1fr)">
              ${e.map((c) => {
      const u = this.stateOf(c.entity), d = this.isOn(c.entity, c.kind);
      return h`<button
                  class="ent"
                  type="button"
                  data-kind=${c.kind}
                  aria-pressed=${d}
                  ?disabled=${!u}
                  @click=${() => this.tap(() => this.toggle(c))}
                  @pointerdown=${() => this.holdStart(() => this.moreInfo(c.entity))}
                  @pointerup=${this.holdEnd}
                  @pointerleave=${this.holdEnd}
                  @pointercancel=${this.holdEnd}
                  @contextmenu=${(p) => {
        p.preventDefault(), this.moreInfo(c.entity);
      }}
                >
                  ${this.entityIcon(c, u)}<span>${c.name ?? B(u, c.entity)}</span>
                </button>`;
    })}
            </div>` : g}
        ${t.dimmer ? h`<div class="bri" data-on=${a > 0}>
              <div class="bri-fill"></div>
              <div class="bri-label">${y("bulb")}<span class="num">${a > 0 ? `${a}%` : "Off"}</span></div>
              <input
                type="range"
                min="1"
                max="100"
                .value=${String(Math.max(1, a))}
                aria-label="${t.name} brightness"
                @input=${(c) => this.onDim(c, !1)}
                @change=${(c) => this.onDim(c, !0)}
              />
            </div>` : g}
      </ha-card>
    `;
  }
};
ue.styles = [
  A,
  T,
  E`
      .room::before {
        content: '';
        position: absolute;
        width: 260px;
        height: 260px;
        left: -80px;
        top: -110px;
        border-radius: 50%;
        background: radial-gradient(closest-side, var(--hh-warm-soft), transparent);
        opacity: 0;
        transition: opacity 0.6s var(--ease);
        pointer-events: none;
      }
      .room[data-on='true']::before {
        opacity: calc(0.4 + var(--level) * 0.9);
      }
      .top {
        position: relative;
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .room-icon {
        width: 56px;
        height: 56px;
        border-radius: 20px;
        display: grid;
        place-items: center;
        flex: none;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        color: var(--hh-ink-2);
        --mdc-icon-size: 26px;
        transition: background 0.35s, color 0.35s, box-shadow 0.35s, transform 0.3s var(--spring);
      }
      .room-icon:active {
        transform: scale(0.92);
      }
      .room-icon[aria-pressed='true'] {
        background: var(--hh-warm);
        color: var(--hh-on-warm);
        border-color: transparent;
        box-shadow: 0 0 0 6px var(--hh-warm-soft), 0 10px 30px -6px var(--hh-warm);
      }
      .meta {
        flex: 1;
        min-width: 0;
      }
      .meta h3 {
        margin: 0;
        font-size: 17px;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
      .status {
        margin: 2px 0 0;
        font-size: 12.5px;
        color: var(--hh-ink-2);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .climate {
        text-align: right;
        line-height: 1.15;
      }
      .climate b {
        display: block;
        font-size: 22px;
        font-weight: 300;
        letter-spacing: -0.02em;
      }
      .climate small {
        font-size: 12px;
        color: var(--hh-ink-3);
        display: inline-flex;
        align-items: center;
        gap: 2px;
      }
      .climate small svg.i {
        width: 12px;
        height: 12px;
      }
      .ents {
        position: relative;
        display: grid;
        gap: 8px;
        margin-top: 16px;
      }
      .ent {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        padding: 12px 4px 10px;
        border-radius: 16px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        font-size: 11.5px;
        font-weight: 500;
        color: var(--hh-ink-2);
        min-width: 0;
        transition: background 0.3s, color 0.3s, transform 0.25s var(--spring);
        user-select: none;
        -webkit-touch-callout: none;
      }
      .ent:hover {
        background: var(--hh-glass-press);
      }
      .ent:active {
        transform: scale(0.94);
      }
      .ent:disabled {
        opacity: 0.4;
        cursor: default;
      }
      .ent span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }
      .ent[aria-pressed='true'] {
        color: var(--hh-ink);
      }
      .ent[data-kind='light'][aria-pressed='true'] svg,
      .ent[data-kind='light'][aria-pressed='true'] ha-icon,
      .ent[data-kind='toggle'][aria-pressed='true'] ha-icon {
        color: var(--hh-warm);
        filter: drop-shadow(0 0 6px var(--hh-warm));
      }
      .ent[data-kind='fan'][aria-pressed='true'] svg,
      .ent[data-kind='fan'][aria-pressed='true'] ha-icon {
        color: var(--hh-accent);
        animation: hh-spin 1.1s linear infinite;
      }
      .ent[data-kind='cover'] .slats {
        transform-origin: 50% 4px;
        transform: scaleY(0.25);
        transition: transform 0.6s var(--ease);
      }
      .ent[data-kind='cover'][aria-pressed='true'] .slats {
        transform: scaleY(1);
      }
      .ent[data-kind='cover'][aria-pressed='true'] svg,
      .ent[data-kind='cover'][aria-pressed='true'] ha-icon {
        color: var(--hh-accent);
      }

      /* Brightness: a drawn fill that dims with the light; the native range sits invisibly on top. */
      .bri {
        position: relative;
        margin-top: 14px;
        height: 40px;
        border-radius: 14px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        overflow: hidden;
      }
      .bri-fill {
        position: absolute;
        inset: 0 auto 0 0;
        width: calc(var(--level) * 100%);
        background: linear-gradient(90deg, color-mix(in srgb, var(--hh-warm) 55%, var(--hh-glass-strong)), var(--hh-warm));
        filter: brightness(calc(0.35 + var(--level) * 0.65)) saturate(calc(0.45 + var(--level) * 0.55));
        opacity: calc(0.25 + var(--level) * 0.75);
        box-shadow: 0 0 calc(var(--level) * 28px) var(--hh-warm);
        transition: opacity 0.4s, filter 0.2s;
      }
      .bri-fill::after {
        content: '';
        position: absolute;
        right: 7px;
        top: 30%;
        bottom: 30%;
        width: 3px;
        border-radius: 2px;
        background: var(--hh-on-warm);
        opacity: 0.45;
      }
      .bri[data-on='false'] .bri-fill {
        opacity: 0;
      }
      .bri-label {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        font-size: 12.5px;
        font-weight: 600;
        pointer-events: none;
      }
      .bri[data-on='false'] .bri-label {
        color: var(--hh-ink-3);
      }
      .bri-label svg.i {
        width: 17px;
        height: 17px;
        opacity: calc(0.45 + var(--level) * 0.55);
      }
      .bri input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        opacity: 0;
        cursor: ew-resize;
        -webkit-appearance: none;
        appearance: none;
      }
      .bri input::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 1px;
        height: 40px;
      }
      .bri input::-moz-range-thumb {
        width: 1px;
        height: 40px;
        border: 0;
      }
      .bri:has(input:focus-visible) {
        outline: 2px solid var(--hh-accent);
        outline-offset: 2px;
      }
    `
];
let bt = ue;
xs([
  v()
], bt.prototype, "pending");
xs([
  v()
], bt.prototype, "dragPct");
P("hyggehub-room-card", bt, "HyggeHub Room", "A room with its lights, fans, blinds, climate and a dimmer.");
var Ei = Object.defineProperty, G = (n, t, e, s) => {
  for (var i = void 0, r = n.length - 1, a; r >= 0; r--)
    (a = n[r]) && (i = a(t, e, i) || i);
  return i && Ei(t, e, i), i;
};
const z = {
  home: { label: "Home", icon: "mdi:home-outline", desc: "Doors and windows only", feature: 1, service: "alarm_arm_home" },
  away: { label: "Away", icon: "mdi:walk", desc: "Everything, cameras on", feature: 2, service: "alarm_arm_away" },
  night: { label: "Night", icon: "mdi:weather-night", desc: "Ground floor, bedrooms off", feature: 4, service: "alarm_arm_night" },
  vacation: { label: "Holiday", icon: "mdi:bag-suitcase-outline", desc: "Everything, lights on a random schedule", feature: 32, service: "alarm_arm_vacation" },
  custom_bypass: { label: "Custom", icon: "mdi:shield-edit-outline", desc: "Your own selection of zones", feature: 16, service: "alarm_arm_custom_bypass" }
}, qe = ["idle", "mode", "code"], Qt = 46, _t = 2 * Math.PI * Qt, ge = class ge extends L {
  constructor() {
    super(...arguments), this.step = "idle", this.flow = "arm", this.code = "", this.prompt = "", this.busy = !1, this.flash = !1, this.onKey = (t) => {
      this.step !== "code" || this.codeFormat === "text" || (/^[0-9]$/.test(t.key) ? this.press(t.key) : t.key === "Backspace" ? this.press("back") : t.key === "Escape" ? this.press("cancel") : t.key === "Enter" && !this.codeLength && this.press("ok"));
    };
  }
  static getStubConfig(t) {
    return { entity: Object.keys(t?.states ?? {}).find((s) => s.startsWith("alarm_control_panel.")) ?? "alarm_control_panel.home" };
  }
  validateConfig(t) {
    if (!t.entity?.startsWith("alarm_control_panel.")) throw new Error("`entity` must be an alarm_control_panel entity.");
  }
  watchedEntities() {
    return [this.config.entity, ...this.config.sensors ?? []];
  }
  getCardSize() {
    return 6;
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("keydown", this.onKey);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("keydown", this.onKey), clearInterval(this.ticker), this.ticker = void 0;
  }
  get entity() {
    return this.stateOf(this.config.entity);
  }
  get panelState() {
    return this.entity?.state ?? "unavailable";
  }
  get armedMode() {
    const t = this.panelState;
    return t.startsWith("armed_") ? t.slice(6) : void 0;
  }
  get availableModes() {
    if (this.config.modes?.length) return this.config.modes.filter((s) => s in z);
    const t = this.entity?.attributes.supported_features ?? 0, e = Object.keys(z).filter((s) => t & z[s].feature);
    return e.length ? e : ["home", "away", "night"];
  }
  get codeFormat() {
    return this.entity?.attributes.code_format ?? null;
  }
  get codeLength() {
    return this.config.code_length ?? 4;
  }
  needsCode(t) {
    return this.codeFormat ? t === "disarm" || this.entity?.attributes.code_arm_required !== !1 : !1;
  }
  /** Seconds left in an exit/entry delay, or undefined when the card can't know. */
  delayLeft() {
    const t = this.panelState, e = t === "arming" ? this.config.exit_delay : t === "pending" ? this.config.entry_delay : void 0;
    if (!e || !this.entity) return;
    const s = (Date.now() - new Date(this.entity.last_changed).getTime()) / 1e3;
    return { left: Math.max(0, Math.ceil(e - s)), total: e };
  }
  updated(t) {
    super.updated(t);
    const e = !!this.delayLeft() && (this.panelState === "arming" || this.panelState === "pending");
    e && !this.ticker && (this.ticker = window.setInterval(() => this.requestUpdate(), 1e3)), !e && this.ticker && (clearInterval(this.ticker), this.ticker = void 0), t.has("step") && this.step === "code" && this.codeFormat === "text" && this.codeInput?.focus();
  }
  go(t) {
    this.step = t, t === "code" && (this.code = "", this.prompt = this.flow === "arm" && this.mode ? `Enter your code to arm ${z[this.mode].label.toLowerCase()}` : "Enter your code to disarm");
  }
  onOrb() {
    if (!(this.busy || this.panelState === "unavailable"))
      if (this.panelState === "disarmed") {
        this.flow = "arm";
        const t = this.availableModes;
        if (t.length === 1) return this.pickMode(t[0]);
        this.go("mode");
      } else
        this.flow = "disarm", this.needsCode("disarm") ? this.go("code") : this.submit();
  }
  pickMode(t) {
    this.mode = t, this.needsCode("arm") ? this.go("code") : this.submit();
  }
  back() {
    this.go(this.step === "code" && this.flow === "arm" && this.availableModes.length > 1 ? "mode" : "idle");
  }
  press(t) {
    if (!this.busy) {
      if (t === "cancel") return this.back();
      if (t === "back") {
        this.code = this.code.slice(0, -1);
        return;
      }
      if (t === "ok") return void this.submit();
      this.codeLength && this.code.length >= this.codeLength || (this.code += t, this.codeLength && this.code.length === this.codeLength && setTimeout(() => this.submit(), 160));
    }
  }
  async submit() {
    const t = this.flow === "disarm" ? "alarm_disarm" : z[this.mode ?? "away"].service, e = this.needsCode(this.flow) ? { code: this.code } : {};
    this.busy = !0;
    try {
      await this.callService("alarm_control_panel", t, e, { entity_id: this.config.entity }), this.flow === "disarm" && (this.flash = !0), this.code = "", this.go("idle");
    } catch (s) {
      this.code = "", this.prompt = s?.message ? String(s.message) : "Wrong code, try again", this.step !== "code" && this.go("code");
      const i = this.dotsEl;
      i && (i.classList.remove("shake"), i.offsetWidth, i.classList.add("shake"));
    } finally {
      this.busy = !1;
    }
  }
  sensorSummary() {
    const t = this.config.sensors;
    if (!t?.length) return;
    const e = t.filter((i) => this.stateOf(i)?.state === "on");
    if (!e.length) return `All ${t.length} doors and windows closed`;
    const s = B(this.stateOf(e[0]), e[0]);
    return e.length === 1 ? `${s} is open` : `${s} and ${e.length - 1} more are open`;
  }
  renderOrb() {
    const t = this.panelState, e = this.armedMode, s = this.delayLeft(), i = (f) => f ? z[f].label.toLowerCase() : "", r = (f) => this.config.mode_descriptions?.[f] ?? z[f].desc;
    let a, o, l, c, u = "disarmed", d = 0, p = !1;
    return t === "arming" || t === "pending" ? (u = t, o = t === "arming" ? "Arming" : "Disarm now", a = s ? h`<span class="secs num">${s.left}</span><span class="w">${o}</span>` : h`${y("shield")}<span class="w">${o}</span>`, l = t === "arming" ? "Tap to cancel" : "Tap to enter your code", c = t === "arming" ? "Leave now, the exit delay is running" : "Someone came in, the alarm goes off when the delay ends", s ? d = _t * (1 - s.left / s.total) : p = !0) : t === "triggered" ? (u = "triggered", o = "Alarm triggered", a = h`${y("shieldAlert", "pop")}<span class="w">Alarm</span>`, l = "Tap to disarm", c = this.sensorSummary() ?? "The alarm has been triggered") : e ? (u = "armed", o = `Armed ${i(e)}`, a = h`${y("lock", "pop")}<span class="w">${o}</span>`, l = "Tap to disarm", c = z[e] ? r(e) : "") : t === "disarmed" ? (o = "Disarmed", a = h`${y("shield", this.flash ? "pop" : "")}<span class="w">Disarmed</span>`, l = "Tap to arm", c = this.sensorSummary() ?? "Ready to arm") : (u = "unavailable", o = t === "disarming" ? "Disarming" : "Unavailable", a = h`${y("shield")}<span class="w">${o}</span>`, l = "", c = t === "disarming" ? "" : "The alarm panel is not responding"), this.flash = !1, h`
      <button class="orb" type="button" data-visual=${u} ?disabled=${u === "unavailable"} aria-label=${l ? `${o}. ${l}` : o} @click=${this.onOrb}>
        <svg viewBox="0 0 100 100" aria-hidden="true" class=${p ? "spin" : ""}>
          <circle class="bg" cx="50" cy="50" r=${Qt}></circle>
          <circle class="fg" cx="50" cy="50" r=${Qt} style="stroke-dasharray:${p ? `${_t * 0.22} ${_t}` : _t};stroke-dashoffset:${d}"></circle>
        </svg>
        <span class="core">${a}</span>
      </button>
      <div class="hint">${l}</div>
      <div class="detail">${c}</div>
    `;
  }
  render() {
    const t = this.config, e = this.panelState, s = e.startsWith("armed_") ? "armed" : e, i = t.name ?? "Alarm", r = qe.indexOf(this.step), a = (p) => {
      const f = qe.indexOf(p);
      return f < r ? "before" : f > r ? "after" : "";
    }, o = this.codeFormat === "text", l = !this.codeLength, c = this.codeLength || Math.max(4, this.code.length);
    let u;
    this.step === "mode" ? u = "Choose mode" : this.step === "code" ? u = this.flow === "arm" ? "Enter code" : "" : u = this.config.sensors?.length ? `${this.config.sensors.length} sensors ${this.armedMode ? "armed" : "ready"}` : "";
    const d = this.flow === "arm" && this.step !== "idle" && this.availableModes.length > 1 && this.needsCode("arm");
    return h`
      <ha-card class="glass alarm" data-visual=${s}>
        <div class="head">
          <button class="back" type="button" aria-label="Back" ?hidden=${this.step === "idle"} @click=${this.back}>${y("left")}</button>
          <h3>${this.step === "idle" ? i : this.flow === "arm" ? this.step === "code" && this.mode ? `Arm · ${z[this.mode].label}` : "Arm" : "Disarm"}</h3>
          <div class="right">
            <span>${u}</span>
            ${d ? h`<span class="pips"><i class="on"></i><i class=${this.step === "code" ? "on" : ""}></i></span>` : g}
          </div>
        </div>
        <div class="stage">
          <section class="step ${this.step === "idle" ? "on" : ""}" data-pos=${a("idle")} ?inert=${this.step !== "idle"}>${this.renderOrb()}</section>
          <section class="step ${this.step === "mode" ? "on" : ""}" data-pos=${a("mode")} ?inert=${this.step !== "mode"}>
            <div class="modes">
              ${this.availableModes.map(
      (p) => h`<button class="mode" type="button" @click=${() => this.pickMode(p)}>
                  <span class="mi">${I(z[p].icon)}</span><b>${z[p].label}</b><small>${t.mode_descriptions?.[p] ?? z[p].desc}</small>
                </button>`
    )}
            </div>
          </section>
          <section class="step ${this.step === "code" ? "on" : ""}" data-pos=${a("code")} ?inert=${this.step !== "code"}>
            <div class="prompt" role="status">${this.prompt}</div>
            ${o ? h`<form
                  class="text-code"
                  @submit=${(p) => {
      p.preventDefault(), this.submit();
    }}
                >
                  <input class="code-input" type="password" autocomplete="off" aria-label="Code" .value=${this.code} @input=${(p) => this.code = p.target.value} />
                  <button type="submit" class="ok">OK</button>
                </form>` : h`
                  <div class="dots" aria-hidden="true">${Array.from({ length: c }, (p, f) => h`<i class=${f < this.code.length ? "on" : ""}></i>`)}</div>
                  <div class="keypad">
                    ${["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((p) => h`<button class="key num" type="button" @click=${() => this.press(p)}>${p}</button>`)}
                    ${l ? h`<button class="key util" type="button" @click=${() => this.press("ok")}>OK</button>` : h`<button class="key util" type="button" @click=${() => this.press("cancel")}>Cancel</button>`}
                    <button class="key num" type="button" @click=${() => this.press("0")}>0</button>
                    <button class="key util" type="button" aria-label="Delete digit" @click=${() => this.press("back")}>${y("backspace")}</button>
                  </div>
                `}
          </section>
        </div>
      </ha-card>
    `;
  }
};
ge.styles = [
  A,
  T,
  E`
      .alarm {
        --state: var(--hh-ok);
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
    `
];
let N = ge;
G([
  v()
], N.prototype, "step");
G([
  v()
], N.prototype, "flow");
G([
  v()
], N.prototype, "mode");
G([
  v()
], N.prototype, "code");
G([
  v()
], N.prototype, "prompt");
G([
  v()
], N.prototype, "busy");
G([
  wt(".text-code, .dots")
], N.prototype, "dotsEl");
G([
  wt(".code-input")
], N.prototype, "codeInput");
P("hyggehub-alarm-card", N, "HyggeHub Alarm", "A step-by-step alarm panel: tap the state to arm or disarm.");
const Ge = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"], fe = class fe extends L {
  constructor() {
    super(...arguments), this.shown = /* @__PURE__ */ new Map();
  }
  static getStubConfig() {
    return { name: "Lofoten", subtitle: "Flight to Bodø", icon: "mdi:image-filter-hdr", target: `${(/* @__PURE__ */ new Date()).getFullYear()}-12-18T09:40`, style: "ring" };
  }
  validateConfig(t) {
    if (!t.name) throw new Error("Give the countdown a `name`.");
    if (!t.target && !t.entity && !t.weekly) throw new Error("Set `target`, `entity` or `weekly`.");
    if (t.weekly && !Ge.includes(String(t.weekly.day).slice(0, 3).toLowerCase())) throw new Error("`weekly.day` must be a weekday, like `tue`.");
  }
  watchedEntities() {
    return [this.config.entity, this.config.value_entity];
  }
  getCardSize() {
    return this.config.style === "compact" ? 2 : 3;
  }
  getGridOptions() {
    return this.config.style === "compact" ? { columns: 6, min_columns: 4 } : { columns: 12, min_columns: 6 };
  }
  connectedCallback() {
    super.connectedCallback(), this.ticker = window.setInterval(() => this.requestUpdate(), 1e3);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this.ticker);
  }
  resolve() {
    const t = this.config, e = /* @__PURE__ */ new Date(), s = {}, i = this.stateOf(t.entity), r = t.entity?.split(".")[0];
    if (i && r === "timer") {
      const o = _e(i.attributes.duration);
      i.state === "active" && i.attributes.finishes_at ? s.target = new Date(i.attributes.finishes_at) : i.state === "paused" ? s.frozen = _e(i.attributes.remaining) * 1e3 : s.idleText = "Not running";
      const l = s.frozen ?? (s.target ? s.target.getTime() - e.getTime() : o * 1e3);
      o && (s.progress = 1 - l / (o * 1e3));
    } else if (i && r === "input_datetime")
      if (i.attributes.has_date) s.target = new Date(i.attributes.timestamp * 1e3);
      else {
        const o = new Date(e);
        o.setHours(i.attributes.hour ?? 0, i.attributes.minute ?? 0, i.attributes.second ?? 0, 0), o <= e && o.setDate(o.getDate() + 1), s.target = o;
      }
    else if (i && r === "calendar")
      i.attributes.start_time && (s.target = new Date(String(i.attributes.start_time).replace(" ", "T"))), s.subtitle = i.attributes.message, s.target || (s.idleText = "Nothing coming up");
    else if (i) {
      const o = new Date(i.state);
      isNaN(o.getTime()) ? s.idleText = "No time set" : s.target = o;
    } else if (t.entity)
      s.idleText = `${t.entity} is not available`;
    else if (t.weekly) {
      const [o, l] = (t.weekly.time ?? "00:00").split(":").map(Number), c = Ge.indexOf(String(t.weekly.day).slice(0, 3).toLowerCase()), u = new Date(e.getFullYear(), e.getMonth(), e.getDate(), o, l);
      for (; u.getDay() !== c || u <= e; ) u.setDate(u.getDate() + 1);
      s.target = u, s.progress = 1 - (u.getTime() - e.getTime()) / (7 * 864e5);
    } else if (t.target) {
      let o = new Date(t.target);
      t.yearly && (o.setFullYear(e.getFullYear()), o <= e && o.setFullYear(e.getFullYear() + 1)), s.target = isNaN(o.getTime()) ? void 0 : o, s.target || (s.idleText = "`target` is not a date");
    }
    if (s.progress === void 0 && s.target)
      if (t.start) {
        const o = new Date(t.start).getTime();
        s.progress = (e.getTime() - o) / (s.target.getTime() - o);
      } else
        s.progress = 1 - Math.min(s.target.getTime() - e.getTime(), 365 * 864e5) / (365 * 864e5);
    const a = R(this.stateOf(t.value_entity));
    return a !== void 0 && t.value_target && (s.progress = a / t.value_target), s.progress !== void 0 && (s.progress = Math.min(1, Math.max(0, s.progress))), s;
  }
  updated() {
    x.motionOn && this.renderRoot.querySelectorAll("[data-t]").forEach((t) => {
      const e = t.dataset.t, s = t.textContent ?? "";
      this.shown.has(e) && this.shown.get(e) !== s && (t.classList.remove("tick"), t.offsetWidth, t.classList.add("tick")), this.shown.set(e, s);
    });
  }
  whenText(t) {
    if (!t.target) return "";
    const e = hs(t.target, this.hass);
    return t.target.getHours() || t.target.getMinutes() ? `${e}, ${O(t.target, this.hass)}` : e;
  }
  render() {
    const t = this.config, e = this.resolve(), s = e.frozen ?? (e.target ? e.target.getTime() - Date.now() : 0), i = Es(s), r = !e.idleText && s <= 0;
    return t.style === "compact" ? this.renderCompact(e, i, r) : this.renderRing(e, i, r);
  }
  renderRing(t, e, s) {
    const i = this.config, r = 2 * Math.PI * 52, a = [i.subtitle ?? t.subtitle, this.whenText(t)].filter(Boolean).join(" · ");
    return h`
      <ha-card class="glass ring-card" @click=${() => this.moreInfo(i.entity)}>
        <div class="t-ring">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle class="bg" cx="60" cy="60" r="52"></circle>
            <circle class="fg" cx="60" cy="60" r="52" style="stroke-dasharray:${r};stroke-dashoffset:${r * (1 - (t.progress ?? 0))}"></circle>
          </svg>
          <div class="mid">
            ${s || t.idleText ? h`<span class="ic ${i.animation ?? "none"}">${I(i.icon ?? "mdi:timer-sand-complete")}</span>` : e.days > 0 ? h`<b class="num" data-t="d">${e.days}</b><small>${e.days === 1 ? "day" : "days"}</small>` : h`<b class="num" data-t="h">${e.hours}</b><small>${e.hours === 1 ? "hour" : "hours"}</small>`}
          </div>
        </div>
        <div class="txt">
          <h3>${i.name}</h3>
          ${a ? h`<p>${a}</p>` : g}
          ${t.idleText ? h`<p class="idle">${t.idleText}</p>` : s ? h`<p class="now">${i.done_text ?? "It’s time"}</p>` : h`<div class="clock num">
                  ${e.days > 0 ? h`<div><b data-t="ch">${it(e.hours)}</b><small>hrs</small></div>` : g}
                  <div><b data-t="cm">${it(e.minutes)}</b><small>min</small></div>
                  <div><b data-t="cs">${it(e.seconds)}</b><small>sec</small></div>
                </div>`}
          ${this.renderChips()}
        </div>
      </ha-card>
    `;
  }
  renderCompact(t, e, s) {
    const i = this.config, r = R(this.stateOf(i.value_entity)), a = i.value_unit ?? this.stateOf(i.value_entity)?.attributes.unit_of_measurement ?? "";
    let o;
    t.idleText ? o = h`<span class="small-big">${t.idleText}</span>` : s ? o = h`${i.done_text ?? "Ready"}` : e.days >= 1 ? o = h`<span data-t="d">${e.days}</span><small>${e.days === 1 ? "day" : "days"}</small> <span data-t="h">${e.hours}</span><small>h</small>` : e.hours >= 1 ? o = h`<span data-t="h">${e.hours}</span><small>h</small> <span data-t="m">${e.minutes}</span><small>min</small>` : o = h`<span data-t="m">${e.minutes}</span>:<span data-t="s">${it(e.seconds)}</span>`;
    const l = t.progress !== void 0 && (i.value_entity || i.entity?.startsWith("timer.") || i.start);
    return h`
      <ha-card class="glass mini" data-done=${s} @click=${() => this.moreInfo(i.entity ?? i.value_entity)}>
        <div class="lbl"><span class="ic ${t.idleText ? "none" : i.animation ?? "none"}">${I(i.icon ?? "mdi:timer-outline")}</span>${i.name}</div>
        <div class="big num">${o}</div>
        <div class="sub faint num">
          ${r !== void 0 && i.value_target ? a.startsWith("°") ? `${Math.round(r)}° of ${i.value_target}${a}` : `${Math.round(r)} of ${i.value_target}${a ? ` ${a}` : ""}` : i.subtitle ?? t.subtitle ?? this.whenText(t)}
        </div>
        ${l ? h`<div class="bar"><i style="width:${(t.progress ?? 0) * 100}%"></i></div>` : g} ${this.renderChips()}
      </ha-card>
    `;
  }
  renderChips() {
    const t = this.config.chips;
    if (!t?.length) return g;
    const e = (s) => s ? ["accent", "ok", "warn", "crit", "warm"].includes(s) ? `var(--hh-${s})` : s : "var(--hh-accent)";
    return h`<div class="chips">${t.map((s) => h`<span class="chip" style="--c:${e(s.color)}">${s.name}</span>`)}</div>`;
  }
};
fe.styles = [
  A,
  T,
  E`
      .ring-card {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 18px;
        align-items: center;
        cursor: default;
      }
      .ring-card::after {
        content: '';
        position: absolute;
        right: -40px;
        bottom: -30px;
        width: 220px;
        height: 120px;
        background: var(--hh-accent-soft);
        clip-path: polygon(0 100%, 30% 30%, 45% 55%, 62% 10%, 100% 100%);
        pointer-events: none;
      }
      .t-ring {
        width: 118px;
        height: 118px;
        position: relative;
      }
      .t-ring > svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }
      .t-ring circle {
        fill: none;
        stroke-width: 6;
      }
      .t-ring .bg {
        stroke: var(--hh-line);
      }
      .t-ring .fg {
        stroke: var(--hh-accent);
        stroke-linecap: round;
        transition: stroke-dashoffset 1.6s var(--ease);
      }
      .mid {
        position: absolute;
        inset: 0;
        display: grid;
        place-content: center;
        text-align: center;
        overflow: hidden;
      }
      .mid b {
        font-size: 38px;
        font-weight: 200;
        line-height: 1;
        letter-spacing: -0.03em;
        display: inline-block;
      }
      .mid small {
        font-size: 11px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--hh-ink-3);
      }
      .mid .ic {
        --mdc-icon-size: 36px;
        color: var(--hh-accent);
      }
      .txt {
        position: relative;
        z-index: 1;
        min-width: 0;
      }
      .txt h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
      .txt p {
        margin: 2px 0 10px;
        font-size: 12.5px;
        color: var(--hh-ink-2);
      }
      .txt .now {
        font-size: 15px;
        font-weight: 600;
        color: var(--hh-accent);
      }
      .clock {
        display: flex;
        gap: 6px;
      }
      .clock div {
        min-width: 46px;
        padding: 7px 6px 5px;
        border-radius: 12px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        text-align: center;
        overflow: hidden;
      }
      .clock b {
        display: block;
        font-family: 'IBM Plex Mono', ui-monospace, monospace;
        font-size: 17px;
        font-weight: 500;
      }
      .clock small {
        font-size: 10px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--hh-ink-3);
      }
      ha-card.mini {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        height: 100%;
      }
      .lbl {
        display: flex;
        align-items: center;
        gap: 7px;
        font-size: 12.5px;
        font-weight: 600;
        color: var(--hh-ink-2);
      }
      .lbl .ic {
        --mdc-icon-size: 18px;
        display: inline-flex;
        color: var(--hh-warm);
      }
      .big {
        font-size: 28px;
        font-weight: 300;
        letter-spacing: -0.02em;
        line-height: 1.1;
        overflow: hidden;
      }
      .big span {
        display: inline-block;
      }
      .big small {
        font-size: 14px;
        color: var(--hh-ink-3);
        margin-left: 2px;
      }
      .big .small-big {
        font-size: 16px;
        color: var(--hh-ink-3);
      }
      .sub {
        font-size: 12px;
      }
      .bar {
        height: 5px;
        border-radius: 5px;
        background: var(--hh-line);
        overflow: hidden;
      }
      .bar i {
        display: block;
        height: 100%;
        border-radius: 5px;
        background: linear-gradient(90deg, var(--hh-warm), var(--hh-crit));
        transition: width 1s linear;
      }
      .chips {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
        margin-top: 2px;
      }
      .chip {
        font-size: 11px;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 999px;
        background: var(--c);
        color: var(--hh-on-accent);
      }
      .ic.flicker {
        transform-origin: 50% 90%;
        animation: flicker 1.6s ease-in-out infinite;
      }
      .ic.pulse {
        animation: pulse 2s ease-in-out infinite;
      }
      @keyframes flicker {
        25% {
          transform: scale(1.06, 0.94) rotate(-3deg);
        }
        50% {
          transform: scale(0.96, 1.07);
        }
        75% {
          transform: scale(1.03, 0.97) rotate(3deg);
        }
      }
      @keyframes pulse {
        50% {
          transform: scale(1.12);
          opacity: 0.75;
        }
      }
    `
];
let Xt = fe;
P("hyggehub-countdown-card", Xt, "HyggeHub Countdown", "Count down to a date, a weekly event, a timer or a calendar entry.");
var Si = Object.defineProperty, j = (n, t, e, s) => {
  for (var i = void 0, r = n.length - 1, a; r >= 0; r--)
    (a = n[r]) && (i = a(t, e, i) || i);
  return i && Si(t, e, i), i;
};
const me = class me extends L {
  constructor() {
    super(...arguments), this.items = {}, this.failed = {}, this.closed = {}, this.query = {}, this.sel = {}, this.paneIdx = 0, this.noteStatus = "", this.subs = /* @__PURE__ */ new Map(), this.fitQueued = !1;
  }
  static getStubConfig(t) {
    const e = Object.keys(t?.states ?? {}).filter((s) => s.startsWith("todo.")).slice(0, 2).map((s) => ({ entity: s }));
    return { lists: e.length ? e : [{ entity: "todo.shopping_list", name: "Groceries", done_label: "Got it" }] };
  }
  validateConfig(t) {
    if (!Array.isArray(t.lists) || !t.lists.length) throw new Error("Add at least one to-do entity under `lists`.");
    for (const e of t.lists) if (!e.entity?.startsWith("todo.")) throw new Error(`${e.entity ?? "A list"} is not a todo entity.`);
  }
  watchedEntities() {
    return [...this.config.lists.map((t) => t.entity), this.config.note?.entity];
  }
  getCardSize() {
    return 7;
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    for (const t of this.subs.values()) t.then((e) => e()).catch(() => {
    });
    this.subs.clear(), this.resizeObs?.disconnect();
  }
  connectedCallback() {
    super.connectedCallback(), this.hasUpdated && this.subscribe();
  }
  subscribe() {
    if (this.hass)
      for (const t of this.config.lists) {
        if (this.subs.has(t.entity)) continue;
        const e = this.hass.connection.subscribeMessage((s) => this.items = { ...this.items, [t.entity]: s.items }, {
          type: "todo/item/subscribe",
          entity_id: t.entity
        }).catch((s) => (this.failed = { ...this.failed, [t.entity]: s?.message ?? "Could not load this list" }, this.subs.delete(t.entity), () => {
        }));
        this.subs.set(t.entity, e);
      }
  }
  firstUpdated() {
    this.resizeObs = new ResizeObserver(() => this.scheduleFit()), this.panes?.forEach((t) => this.resizeObs.observe(t));
  }
  updated(t) {
    if (super.updated(t), (t.has("hass") || t.has("config")) && this.subscribe(), t.has("config") && (this.resizeObs?.disconnect(), this.panes?.forEach((e) => this.resizeObs?.observe(e))), this.fx) {
      const e = this.renderRoot.querySelector(`.item[data-uid="${CSS.escape(this.fx.uid)}"]`);
      e && x.motionOn && (e.classList.remove("enter", "restored", "pulse"), e.offsetWidth, e.classList.add(...this.fx.cls.split(" "))), this.fx = void 0;
    }
  }
  /** Resize observers must not resize inside their own callback, so the fit waits for the next frame. */
  scheduleFit() {
    this.fitQueued || (this.fitQueued = !0, requestAnimationFrame(() => {
      this.fitQueued = !1, this.fitTrack();
    }));
  }
  fitTrack() {
    const e = this.panes?.[this.paneIdx]?.offsetHeight;
    if (!this.track || !e) return;
    const s = `${e}px`;
    this.track.style.height !== s && (this.track.style.height = s);
  }
  // ---------- item actions (optimistic, then confirmed by the subscription) ----------
  patch(t, e) {
    this.items = { ...this.items, [t]: e([...this.items[t] ?? []]) };
  }
  collapse(t, e) {
    const s = this.renderRoot.querySelector(`.item[data-uid="${CSS.escape(t)}"]`);
    if (!s || !x.motionOn) return e();
    s.style.height = `${s.offsetHeight}px`, s.offsetHeight, s.classList.add("removing"), setTimeout(e, 260);
  }
  setStatus(t, e, s) {
    this.collapse(e.uid, () => {
      this.patch(t, (i) => [{ ...e, status: s }, ...i.filter((r) => r.uid !== e.uid)]), this.fx = { uid: e.uid, cls: s === "needs_action" ? "enter restored" : "enter" }, this.callService("todo", "update_item", { item: e.uid, status: s }, { entity_id: t }).catch(() => this.subsRefresh(t));
    });
  }
  removeItem(t, e) {
    this.collapse(e.uid, () => {
      this.patch(t, (s) => s.filter((i) => i.uid !== e.uid)), this.callService("todo", "remove_item", { item: e.uid }, { entity_id: t }).catch(() => this.subsRefresh(t));
    });
  }
  add(t, e) {
    const s = { uid: `pending-${Date.now()}`, summary: e, status: "needs_action" };
    this.patch(t, (i) => [s, ...i]), this.fx = { uid: s.uid, cls: "enter" }, this.callService("todo", "add_item", { item: e }, { entity_id: t }).catch(() => this.subsRefresh(t));
  }
  /** On a failed call, drop the optimistic state and resubscribe for the server's truth. */
  subsRefresh(t) {
    const e = this.subs.get(t);
    this.subs.delete(t), e?.then((s) => s()).catch(() => {
    }), this.subscribe();
  }
  // ---------- add box: offer completed items back before creating a duplicate ----------
  suggestions(t) {
    const e = (this.query[t] ?? "").trim(), s = e.toLowerCase();
    if (!s) return [];
    const i = this.items[t] ?? [], r = (l) => (l = l.toLowerCase(), l === s ? 0 : l.startsWith(s) ? 1 : l.split(/\s+/).some((c) => c.startsWith(s)) ? 2 : l.includes(s) ? 3 : 9), a = i.filter((l) => l.status === "completed").map((l) => ({ item: l, r: r(l.summary) })).filter((l) => l.r < 9).sort((l, c) => l.r - c.r).slice(0, 4).map((l) => ({ type: "restore", item: l.item, exact: l.r === 0 })), o = i.find((l) => l.status === "needs_action" && l.summary.toLowerCase() === s);
    return o ? a.push({ type: "exists", item: o }) : a.some((l) => l.type === "restore" && l.exact) || a.push({ type: "new", text: e }), a;
  }
  selected(t, e) {
    const s = this.sel[t];
    return s !== void 0 ? s : e[0]?.type === "restore" && e[0].exact ? 0 : -1;
  }
  choose(t, e) {
    this.query = { ...this.query, [t]: "" }, this.sel = { ...this.sel, [t]: void 0 }, e && (e.type === "restore" ? this.setStatus(t, e.item, "needs_action") : e.type === "exists" ? this.fx = { uid: e.item.uid, cls: "pulse" } : this.add(t, e.text));
  }
  onSubmit(t, e) {
    t.preventDefault();
    const s = this.suggestions(e);
    if (!s.length) return;
    const i = this.selected(e, s);
    this.choose(e, i >= 0 ? s[i] : s.find((r) => r.type === "exists") ?? s.find((r) => r.type === "new"));
  }
  onAddKey(t, e) {
    const s = this.suggestions(e);
    if (!s.length) return;
    const i = this.selected(e, s);
    t.key === "ArrowDown" ? (t.preventDefault(), this.sel = { ...this.sel, [e]: (i + 1) % s.length }) : t.key === "ArrowUp" ? (t.preventDefault(), this.sel = { ...this.sel, [e]: i <= 0 ? s.length - 1 : i - 1 }) : t.key === "Escape" && this.choose(e);
  }
  // ---------- swipe a row: right = done / restore, left = delete ----------
  onRowDown(t, e, s) {
    if (t.target.closest("button")) return;
    const i = t.currentTarget, r = i.parentElement, a = t.clientX, o = t.clientY;
    let l = 0, c;
    i.setPointerCapture(t.pointerId);
    const u = (p) => {
      l = p.clientX - a;
      const f = p.clientY - o;
      if (c || (Math.abs(l) > 8 && Math.abs(l) > Math.abs(f) ? (c = "h", i.classList.add("dragging")) : Math.abs(f) > 8 && (c = "v")), c === "h") {
        const m = Math.abs(l), w = Math.sign(l) * Math.min(150, m < 90 ? m : 90 + (m - 90) * 0.35);
        i.style.transform = `translateX(${w}px)`, r.dataset.reveal = l > 0 ? "done" : "del", r.classList.toggle("armed", m > 80);
      }
    }, d = () => {
      i.removeEventListener("pointermove", u), i.removeEventListener("pointerup", d), i.removeEventListener("pointercancel", d), i.classList.remove("dragging"), i.style.transform = "", r.classList.remove("armed"), setTimeout(() => delete r.dataset.reveal, 300), c === "h" && (l > 80 ? this.setStatus(e, s, s.status === "completed" ? "needs_action" : "completed") : l < -80 && this.removeItem(e, s));
    };
    i.addEventListener("pointermove", u), i.addEventListener("pointerup", d), i.addEventListener("pointercancel", d);
  }
  // ---------- panes ----------
  onTrackScroll() {
    const t = this.track, e = t.scrollLeft / t.clientWidth;
    t.parentElement?.style.setProperty("--x", String(e));
    const s = Math.round(e);
    s !== this.paneIdx && (this.paneIdx = s, requestAnimationFrame(() => this.fitTrack()));
  }
  goPane(t) {
    this.track?.scrollTo({ left: t * this.track.clientWidth, behavior: x.motionOn ? "smooth" : "auto" });
  }
  onTrackDown(t) {
    if (t.pointerType !== "mouse" || t.target.closest(".item-fg, input, textarea, button, .suggest")) return;
    const e = this.track, s = t.clientX, i = e.scrollLeft;
    e.setPointerCapture(t.pointerId), e.classList.add("grabbing");
    const r = (o) => e.scrollLeft = i - (o.clientX - s), a = (o) => {
      e.removeEventListener("pointermove", r), e.removeEventListener("pointerup", a), e.classList.remove("grabbing");
      const l = o.clientX - s, c = Math.round(i / e.clientWidth), u = Math.abs(l) > 50 ? c - Math.sign(l) : c;
      this.goPane(Math.max(0, Math.min(this.tabCount - 1, u)));
    };
    e.addEventListener("pointermove", r), e.addEventListener("pointerup", a);
  }
  get tabCount() {
    return this.config.lists.length + (this.config.note ? 1 : 0);
  }
  // ---------- note ----------
  onNote(t) {
    const e = t.target.value;
    this.noteDraft = e, this.noteStatus = "Saving…", clearTimeout(this.noteTimer), this.noteTimer = window.setTimeout(async () => {
      const s = this.config.note.entity;
      try {
        await this.callService(s.split(".")[0], "set_value", { value: e }, { entity_id: s }), this.noteStatus = "Saved";
      } catch (i) {
        this.noteStatus = i?.message ?? "Could not save the note";
      }
    }, 800);
  }
  // ---------- render ----------
  dueChip(t) {
    if (!t) return g;
    const e = new Date(t.length === 10 ? `${t}T00:00:00` : t), s = /* @__PURE__ */ new Date();
    s.setHours(0, 0, 0, 0);
    const i = new Date(e);
    i.setHours(0, 0, 0, 0);
    const r = Math.round((i.getTime() - s.getTime()) / 864e5);
    let a;
    return r < 0 ? a = "Overdue" : r === 0 ? a = "Today" : r === 1 ? a = "Tomorrow" : r < 7 ? a = e.toLocaleDateString(D(this.hass), { weekday: "short" }) : a = hs(e, this.hass), h`<span class="due ${r <= 1 ? "soon" : ""}">${a}</span>`;
  }
  renderItem(t, e, s) {
    const i = e.status === "completed", r = s.done_label ?? "Done", a = e.description?.split(`
`)[0];
    return h`<li class="item ${i ? "done" : ""}" data-uid=${e.uid}>
      <div class="item-bg">
        <span class="bg-done">${y(i ? "undo" : "check")}${i ? "Restore" : r}</span>
        <span class="bg-del">Delete${y("trash")}</span>
      </div>
      <div class="item-fg" @pointerdown=${(o) => this.onRowDown(o, t, e)}>
        <button class="check" type="button" aria-label="${i ? "Restore" : r} ${e.summary}" @click=${() => this.setStatus(t, e, i ? "needs_action" : "completed")}>
          ${y("check")}
        </button>
        <span class="txt">${e.summary}</span>
        ${a ? h`<span class="qty">${a}</span>` : g} ${i ? g : this.dueChip(e.due)}
        <button class="del" type="button" aria-label="Delete ${e.summary}" @click=${() => this.removeItem(t, e)}>${y("x")}</button>
      </div>
    </li>`;
  }
  renderSuggestions(t, e) {
    const s = this.suggestions(t);
    if (!s.length) return g;
    const i = (this.query[t] ?? "").trim().toLowerCase(), r = this.selected(t, s), a = (o) => {
      const l = o.toLowerCase().indexOf(i);
      return l < 0 ? o : h`${o.slice(0, l)}<mark>${o.slice(l, l + i.length)}</mark>${o.slice(l + i.length)}`;
    };
    return h`<div class="suggest" role="listbox" aria-label="Suggestions" @pointerdown=${(o) => o.preventDefault()}>
      ${s.some((o) => o.type === "restore") ? h`<div class="s-h">From ${e.done_label ?? "Done"}</div>` : g}
      ${s.map((o, l) => {
      const c = `sug ${l === r ? "sel" : ""}`, u = () => this.choose(t, o);
      return o.type === "restore" ? h`<button type="button" class=${c} role="option" aria-selected=${l === r} @click=${u}>
            <span class="si">${y("undo")}</span><span class="st"><b>${a(o.item.summary)}</b><small>${o.item.description ?? "Completed earlier"}</small></span><em>Restore</em>
          </button>` : o.type === "exists" ? h`<button type="button" class=${c} role="option" aria-selected=${l === r} @click=${u}>
            <span class="si">${y("check")}</span><span class="st"><b>${o.item.summary}</b><small>Already on the list</small></span><em>Show</em>
          </button>` : h`<button type="button" class=${c} role="option" aria-selected=${l === r} @click=${u}>
          <span class="si">${y("plus")}</span><span class="st"><b>Add “${o.text}”</b><small>As a new item</small></span><em>Add</em>
        </button>`;
    })}
    </div>`;
  }
  renderList(t) {
    const e = t.entity, s = t.name ?? B(this.stateOf(e), e), i = this.items[e], r = i?.filter((c) => c.status === "needs_action") ?? [], a = i?.filter((c) => c.status === "completed") ?? [], o = this.closed[e];
    let l;
    return this.failed[e] ? l = h`<li class="empty-row">${this.failed[e]}</li>` : i ? r.length ? l = Kt(r, (c) => c.uid, (c) => this.renderItem(e, c, t)) : l = h`<li class="empty-row">Nothing left on ${s.toLowerCase()}</li>` : l = h`<li class="empty-row">Loading ${s.toLowerCase()}…</li>`, h`<section class="pane">
      <ul class="items">${l}</ul>
      <form class="add" @submit=${(c) => this.onSubmit(c, e)}>
        <input
          placeholder=${t.placeholder ?? `Add to ${s.toLowerCase()}`}
          autocomplete="off"
          aria-label=${t.placeholder ?? `Add to ${s.toLowerCase()}`}
          .value=${this.query[e] ?? ""}
          @input=${(c) => {
      this.query = { ...this.query, [e]: c.target.value }, this.sel = { ...this.sel, [e]: void 0 };
    }}
          @keydown=${(c) => this.onAddKey(c, e)}
        />
        <button type="submit" aria-label="Add">${y("plus")}</button>
      </form>
      ${this.renderSuggestions(e, t)}
      ${a.length ? h`<div class="done-group ${o ? "closed" : ""}">
            <button class="done-h" type="button" aria-expanded=${!o} @click=${() => this.closed = { ...this.closed, [e]: !o }}>
              ${y("chev")}${t.done_label ?? "Done"} <span class="count num">${a.length}</span><span class="rule"></span>
            </button>
            ${o ? g : h`<ul class="items">${Kt(a, (c) => c.uid, (c) => this.renderItem(e, c, t))}</ul>`}
          </div>` : g}
    </section>`;
  }
  renderNote() {
    const t = this.config.note, e = this.stateOf(t.entity), s = this.noteDraft ?? (e && e.state !== "unknown" && e.state !== "unavailable" ? e.state : ""), i = e?.attributes.max ?? 255;
    return h`<section class="pane note-pad">
      <textarea aria-label=${t.name ?? "Note"} maxlength=${i} .value=${s} @input=${this.onNote} ?disabled=${!e}></textarea>
      <p>
        <span>${e ? this.noteStatus || "Shared with everyone in the home" : `${t.entity} is not available`}</span>
        <span class="num ${s.length > i * 0.9 ? "near" : ""}">${s.length} / ${i}</span>
      </p>
    </section>`;
  }
  render() {
    const t = this.config.lists, e = [
      ...t.map((s) => ({ name: s.name ?? B(this.stateOf(s.entity), s.entity), count: this.items[s.entity]?.filter((i) => i.status === "needs_action").length })),
      ...this.config.note ? [{ name: this.config.note.name ?? "Note", count: void 0 }] : []
    ];
    return h`
      <ha-card class="glass lists" style="--tabs:${e.length}">
        <div class="tabs" role="tablist">
          <div class="tab-ink"></div>
          ${e.map(
      (s, i) => h`<button class="tab" type="button" role="tab" aria-selected=${i === this.paneIdx} @click=${() => this.goPane(i)}>
              ${s.name}${s.count !== void 0 ? h`<span class="count num">${s.count}</span>` : g}
            </button>`
    )}
        </div>
        <div class="track" @scroll=${this.onTrackScroll} @pointerdown=${this.onTrackDown}>
          ${t.map((s) => this.renderList(s))} ${this.config.note ? this.renderNote() : g}
        </div>
        ${e.length > 1 ? h`<div class="pager">${e.map((s, i) => h`<i class=${i === this.paneIdx ? "on" : ""}></i>`)}</div>` : g}
      </ha-card>
    `;
  }
};
me.styles = [
  A,
  T,
  E`
      ha-card.lists {
        padding: 0;
        --x: 0;
      }
      .tabs {
        position: relative;
        display: grid;
        grid-template-columns: repeat(var(--tabs), 1fr);
        margin: 14px 14px 0;
        padding: 4px;
        border-radius: 15px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
      }
      .tab {
        position: relative;
        z-index: 1;
        padding: 8px 4px;
        border-radius: 11px;
        font-size: 13px;
        font-weight: 600;
        color: var(--hh-ink-2);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-width: 0;
        white-space: nowrap;
        transition: color 0.25s;
      }
      .tab[aria-selected='true'] {
        color: var(--hh-ink);
      }
      .tab .count {
        font-size: 11px;
        min-width: 18px;
        padding: 0 5px;
        border-radius: 9px;
        background: var(--hh-accent-soft);
        color: var(--hh-accent);
      }
      .tab-ink {
        position: absolute;
        top: 4px;
        bottom: 4px;
        left: 4px;
        width: calc((100% - 8px) / var(--tabs));
        border-radius: 11px;
        background: var(--hh-glass-press);
        box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.12);
        transform: translateX(calc(var(--x) * 100%));
      }
      .track {
        display: flex;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        overscroll-behavior-x: contain;
        align-items: flex-start;
        cursor: grab;
        transition: height 0.35s var(--ease);
      }
      .track::-webkit-scrollbar {
        display: none;
      }
      .track.grabbing {
        cursor: grabbing;
        scroll-snap-type: none;
      }
      .pane {
        flex: 0 0 100%;
        scroll-snap-align: start;
        padding: 12px 14px 16px;
        min-width: 0;
      }
      .items {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .item {
        position: relative;
        border-radius: 14px;
        overflow: hidden;
        transition: height 0.28s var(--ease), opacity 0.25s, margin 0.28s;
      }
      .item.removing {
        height: 0 !important;
        opacity: 0;
        margin-bottom: -4px;
      }
      .item.enter {
        animation: enter 0.4s var(--ease);
      }
      @keyframes enter {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
      }
      .item.restored .item-fg {
        animation: flash 1.4s var(--ease);
      }
      .item.pulse .item-fg {
        animation: flash 1s var(--ease) 2;
      }
      @keyframes flash {
        0% {
          background: color-mix(in srgb, var(--hh-accent) 30%, var(--hh-glass-strong));
        }
      }
      .item-bg {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        font-size: 12.5px;
        font-weight: 600;
        opacity: 0;
        transition: opacity 0.2s;
      }
      .item[data-reveal] .item-bg {
        opacity: 1;
      }
      .item[data-reveal='done'] .item-bg {
        background: color-mix(in srgb, var(--hh-ok) 22%, transparent);
        color: var(--hh-ok);
      }
      .item[data-reveal='del'] .item-bg {
        background: color-mix(in srgb, var(--hh-crit) 20%, transparent);
        color: var(--hh-crit);
      }
      .item[data-reveal='done'] .bg-del,
      .item[data-reveal='del'] .bg-done {
        visibility: hidden;
      }
      .item-bg span {
        display: flex;
        align-items: center;
        gap: 6px;
        transition: transform 0.2s var(--spring);
      }
      .item.armed .item-bg span {
        transform: scale(1.12);
      }
      .item-fg {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 11px 12px;
        background: var(--hh-glass-strong);
        border: 1px solid transparent;
        border-radius: 14px;
        touch-action: pan-y;
        cursor: grab;
        transition: transform 0.35s var(--spring), background 0.2s;
      }
      .item-fg.dragging {
        transition: none;
        cursor: grabbing;
      }
      .check {
        width: 22px;
        height: 22px;
        border-radius: 8px;
        border: 1.6px solid var(--hh-ink-3);
        display: grid;
        place-items: center;
        flex: none;
        color: transparent;
        transition: background 0.25s, border-color 0.25s, color 0.25s;
      }
      .check svg.i {
        width: 14px;
        height: 14px;
        stroke-width: 2.4;
      }
      .check:hover {
        border-color: var(--hh-ok);
      }
      .item.done .check {
        background: var(--hh-ok);
        border-color: var(--hh-ok);
        color: var(--hh-bg);
      }
      .txt {
        flex: 1;
        min-width: 0;
        font-size: 14px;
        font-weight: 500;
        overflow-wrap: anywhere;
      }
      .item.done .item-fg {
        background: transparent;
        border: 1px dashed var(--hh-line);
      }
      .item.done .txt {
        color: var(--hh-ink-3);
        text-decoration: line-through;
      }
      .qty {
        font-size: 12px;
        color: var(--hh-ink-3);
        white-space: nowrap;
        max-width: 40%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .due {
        font-size: 11px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 999px;
        white-space: nowrap;
        background: var(--hh-glass-press);
        color: var(--hh-ink-2);
      }
      .due.soon {
        background: color-mix(in srgb, var(--hh-warn) 20%, transparent);
        color: var(--hh-warn);
      }
      .del {
        opacity: 0;
        width: 26px;
        height: 26px;
        border-radius: 8px;
        display: grid;
        place-items: center;
        color: var(--hh-ink-3);
        transition: opacity 0.2s;
      }
      .del svg.i {
        width: 15px;
        height: 15px;
      }
      .item-fg:hover .del,
      .del:focus-visible {
        opacity: 1;
      }
      @media (hover: none) {
        .del {
          display: none;
        }
      }
      .empty-row {
        padding: 14px;
        border-radius: 14px;
        text-align: center;
        font-size: 13px;
        color: var(--hh-ink-3);
        border: 1px dashed var(--hh-line);
      }
      .add {
        display: flex;
        gap: 8px;
        margin-top: 10px;
      }
      .add input {
        flex: 1;
        min-width: 0;
        padding: 10px 14px;
        border-radius: 14px;
        border: 1px dashed var(--hh-ink-3);
        background: transparent;
        outline: none;
        transition: border-color 0.2s, background 0.2s;
      }
      .add input:focus {
        border-style: solid;
        border-color: var(--hh-accent);
        background: var(--hh-glass-strong);
      }
      .add input::placeholder {
        color: var(--hh-ink-3);
      }
      .add button {
        width: 42px;
        border-radius: 14px;
        background: var(--hh-accent);
        color: var(--hh-on-accent);
        display: grid;
        place-items: center;
      }
      .suggest {
        margin-top: 6px;
        padding: 6px;
        border-radius: 16px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        display: flex;
        flex-direction: column;
        gap: 2px;
        animation: enter 0.25s var(--ease);
      }
      .s-h {
        font-size: 10.5px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--hh-ink-3);
        padding: 4px 8px 2px;
      }
      .sug {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px;
        border-radius: 11px;
        text-align: left;
        width: 100%;
      }
      .sug:hover,
      .sug.sel {
        background: var(--hh-accent-soft);
      }
      .si {
        width: 28px;
        height: 28px;
        border-radius: 9px;
        display: grid;
        place-items: center;
        flex: none;
        background: var(--hh-glass-press);
        color: var(--hh-ink-2);
      }
      .si svg.i {
        width: 16px;
        height: 16px;
      }
      .st {
        flex: 1;
        min-width: 0;
      }
      .st b {
        display: block;
        font-weight: 600;
        font-size: 13.5px;
      }
      .st b mark {
        background: none;
        color: var(--hh-accent);
        text-decoration: underline;
        text-underline-offset: 2px;
      }
      .st small {
        font-size: 11.5px;
        color: var(--hh-ink-3);
      }
      .sug em {
        font-style: normal;
        font-size: 11.5px;
        font-weight: 600;
        color: var(--hh-accent);
        padding: 3px 8px;
        border-radius: 8px;
        background: var(--hh-accent-soft);
      }
      .sug.sel em {
        background: var(--hh-accent);
        color: var(--hh-on-accent);
      }
      .done-group {
        margin-top: 16px;
      }
      .done-h {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 4px 2px 8px;
        font-size: 11.5px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--hh-ink-3);
      }
      .done-h .count {
        letter-spacing: 0;
        font-size: 11px;
        padding: 0 6px;
        border-radius: 9px;
        background: var(--hh-line);
        color: var(--hh-ink-2);
      }
      .done-h .rule {
        flex: 1;
        height: 1px;
        background: var(--hh-line);
      }
      .done-h svg.i {
        width: 16px;
        height: 16px;
        transition: transform 0.3s var(--ease);
      }
      .done-group.closed .done-h svg.i {
        transform: rotate(-90deg);
      }
      .note-pad textarea {
        width: 100%;
        min-height: 212px;
        resize: vertical;
        border: 0;
        outline: none;
        padding: 14px 16px;
        border-radius: 14px;
        background: var(--hh-glass-strong);
        line-height: 1.6;
        font-size: 14px;
        background-image: repeating-linear-gradient(transparent 0 21.4px, var(--hh-line) 21.4px 22.4px);
        background-position: 0 13px;
        background-attachment: local;
      }
      .note-pad p {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin: 8px 2px 0;
        font-size: 11.5px;
        color: var(--hh-ink-3);
      }
      .note-pad .near {
        color: var(--hh-warn);
      }
      .pager {
        display: flex;
        justify-content: center;
        gap: 6px;
        padding-bottom: 14px;
      }
      .pager i {
        width: 6px;
        height: 6px;
        border-radius: 3px;
        background: var(--hh-ink-3);
        opacity: 0.4;
        transition: width 0.3s var(--ease), opacity 0.3s;
      }
      .pager i.on {
        width: 18px;
        opacity: 1;
        background: var(--hh-accent);
      }
    `
];
let S = me;
j([
  v()
], S.prototype, "items");
j([
  v()
], S.prototype, "failed");
j([
  v()
], S.prototype, "closed");
j([
  v()
], S.prototype, "query");
j([
  v()
], S.prototype, "sel");
j([
  v()
], S.prototype, "paneIdx");
j([
  v()
], S.prototype, "noteDraft");
j([
  v()
], S.prototype, "noteStatus");
j([
  wt(".track")
], S.prototype, "track");
j([
  ci(".pane")
], S.prototype, "panes");
P("hyggehub-lists-card", S, "HyggeHub Lists", "Swipeable to-do lists with a completed group and a shared note.");
var Ai = Object.defineProperty, he = (n, t, e, s) => {
  for (var i = void 0, r = n.length - 1, a; r >= 0; r--)
    (a = n[r]) && (i = a(t, e, i) || i);
  return i && Ai(t, e, i), i;
};
const Ti = {
  "clear-night": "mdi:weather-night",
  cloudy: "mdi:weather-cloudy",
  exceptional: "mdi:alert-circle-outline",
  fog: "mdi:weather-fog",
  hail: "mdi:weather-hail",
  lightning: "mdi:weather-lightning",
  "lightning-rainy": "mdi:weather-lightning-rainy",
  partlycloudy: "mdi:weather-partly-cloudy",
  pouring: "mdi:weather-pouring",
  rainy: "mdi:weather-rainy",
  snowy: "mdi:weather-snowy",
  "snowy-rainy": "mdi:weather-snowy-rainy",
  sunny: "mdi:weather-sunny",
  windy: "mdi:weather-windy",
  "windy-variant": "mdi:weather-windy-variant"
}, zi = {
  "clear-night": "Clear night",
  cloudy: "Cloudy",
  exceptional: "Exceptional",
  fog: "Fog",
  hail: "Hail",
  lightning: "Thunder",
  "lightning-rainy": "Thunder and rain",
  partlycloudy: "Partly cloudy",
  pouring: "Heavy rain",
  rainy: "Rain",
  snowy: "Snow",
  "snowy-rainy": "Sleet",
  sunny: "Sunny",
  windy: "Windy",
  "windy-variant": "Windy and cloudy"
}, Ve = /* @__PURE__ */ new Set(["snowy", "snowy-rainy", "hail"]), Ke = /* @__PURE__ */ new Set(["rainy", "pouring", "lightning-rainy"]), Di = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"], Wt = (n) => typeof n == "number" ? `${Math.round(n)}°`.replace("-", "−") : "–", be = class be extends L {
  constructor() {
    super(...arguments), this.forecast = [], this.forecastKind = "hourly", this.particles = [], this.particleColor = "", this.lastFrame = 0, this.onTheme = () => {
      this.particleColor = getComputedStyle(document.documentElement).getPropertyValue("--hh-particle").trim(), this.syncLoop();
    };
  }
  static getStubConfig(t) {
    return { entity: Object.keys(t?.states ?? {}).find((e) => e.startsWith("weather.")) ?? "weather.home" };
  }
  validateConfig(t) {
    if (!t.entity?.startsWith("weather.")) throw new Error("`entity` must be a weather entity.");
  }
  watchedEntities() {
    return [this.config.entity, this.config.sun ?? "sun.sun"];
  }
  getCardSize() {
    return 4;
  }
  connectedCallback() {
    super.connectedCallback(), x.addEventListener("change", this.onTheme), this.onTheme();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), x.removeEventListener("change", this.onTheme), this.unsub?.then((t) => t()).catch(() => {
    }), this.unsub = void 0, this.subscribedFor = void 0, this.raf && cancelAnimationFrame(this.raf), this.raf = void 0, this.resizeObs?.disconnect(), this.resizeObs = void 0;
  }
  firstUpdated() {
    this.syncLoop();
  }
  updated(t) {
    super.updated(t), this.hass && this.subscribedFor !== this.config.entity && this.subscribe(), t.has("hass") && this.syncLoop();
  }
  subscribe() {
    const t = this.stateOf(this.config.entity);
    if (!t) return;
    this.unsub?.then((i) => i()).catch(() => {
    }), this.subscribedFor = this.config.entity;
    const s = (t.attributes.supported_features ?? 0) & 2 ? "hourly" : "daily";
    this.forecastKind = s, this.unsub = this.hass.connection.subscribeMessage((i) => this.forecast = i.forecast ?? [], {
      type: "weather/subscribe_forecast",
      entity_id: this.config.entity,
      forecast_type: s
    }).catch(() => () => {
    });
  }
  // ---------- falling snow / rain on a canvas behind the content ----------
  get precipitating() {
    const t = this.stateOf(this.config.entity)?.state ?? "";
    return Ve.has(t) || Ke.has(t);
  }
  /**
   * The particle loop runs only while it's snowing or raining and motion is on, at about 30 frames a
   * second. Otherwise the canvas is drawn once (still flakes, or nothing) and left alone.
   */
  syncLoop() {
    const t = this.canvas;
    if (!t) return;
    this.resizeObs || (this.resizeObs = new ResizeObserver(() => {
      this.sizeCanvas(), this.draw();
    }), this.resizeObs.observe(t));
    const e = this.precipitating && x.motionOn;
    if (e && !this.raf) {
      const s = (i) => {
        this.onScreen && i - this.lastFrame > 32 && (this.lastFrame = i, this.draw()), this.raf = requestAnimationFrame(s);
      };
      this.raf = requestAnimationFrame(s);
    } else e || (this.raf && cancelAnimationFrame(this.raf), this.raf = void 0, this.draw());
  }
  sizeCanvas() {
    const t = this.canvas;
    if (!t) return;
    const e = t.clientWidth, s = t.clientHeight, i = devicePixelRatio || 1;
    t.width = e * i, t.height = s * i, t.getContext("2d").setTransform(i, 0, 0, i, 0, 0), this.particles = Array.from({ length: Math.round(e / 6) }, () => this.spawn(e, s, !0));
  }
  spawn(t, e, s) {
    return { x: Math.random() * t, y: s ? Math.random() * e : -10, r: Math.random() * 1.7 + 0.6, s: Math.random() * 0.45 + 0.25, d: Math.random() * 6.28 };
  }
  draw() {
    const t = this.canvas, e = t?.getContext("2d");
    if (!t || !e) return;
    const s = t.clientWidth, i = t.clientHeight;
    e.clearRect(0, 0, s, i);
    const r = this.stateOf(this.config.entity)?.state ?? "", a = Ve.has(r), o = Ke.has(r);
    if (!a && !o) return;
    const l = x.motionOn;
    e.fillStyle = e.strokeStyle = this.particleColor || "rgba(255,255,255,.7)", e.lineWidth = 1.2, e.lineCap = "round";
    for (const c of this.particles)
      l && (a ? (c.y += c.s * 2, c.d += 0.024, c.x += Math.sin(c.d) * 0.5) : (c.y += 12 + c.s * 12, c.x -= 2)), c.y > i + 10 && Object.assign(c, this.spawn(s, i, !1)), c.x < -10 && (c.x = s + 5), e.beginPath(), a ? (e.arc(c.x, c.y, c.r, 0, 6.28), e.fill()) : (e.globalAlpha = 0.55, e.moveTo(c.x, c.y), e.lineTo(c.x - 2, c.y + 9 + c.r * 2), e.stroke(), e.globalAlpha = 1);
  }
  // ---------- render ----------
  daylight() {
    const t = this.stateOf(this.config.sun ?? "sun.sun");
    if (!t) return;
    const e = Date.now(), s = new Date(t.attributes.next_rising).getTime(), i = new Date(t.attributes.next_setting).getTime();
    if (isNaN(s) || isNaN(i)) return;
    let r, a, o;
    t.state === "above_horizon" ? (a = i, r = s - 864e5, o = (e - r) / (a - r)) : (r = s, a = i, o = new Date(s).getDate() === new Date(e).getDate() ? 0 : 1, o === 1 && (r = s - 864e5, a = i - 864e5));
    const l = Math.max(0, a - r);
    return { rise: new Date(r), set: new Date(a), progress: Math.min(1, Math.max(0, o)), hours: Math.floor(l / 36e5), minutes: Math.round(l % 36e5 / 6e4) };
  }
  slotLabel(t, e) {
    const s = new Date(t.datetime);
    return this.forecastKind === "daily" ? e === 0 ? "Today" : s.toLocaleDateString(D(this.hass), { weekday: "short" }) : e === 0 && Math.abs(s.getTime() - Date.now()) < 36e5 ? "Now" : s.toLocaleTimeString(D(this.hass), { hour: "2-digit" });
  }
  render() {
    const t = this.stateOf(this.config.entity);
    if (!t) return h`<ha-card class="glass"><p class="muted">${this.config.entity} is not available.</p></ha-card>`;
    const e = t.attributes, s = t.state, i = e.wind_speed_unit ?? "m/s", r = typeof e.wind_speed == "number" ? `Wind ${Math.round(e.wind_speed)} ${i}${typeof e.wind_bearing == "number" ? ` ${Di[Math.round(e.wind_bearing / 45) % 8]}` : ""}` : "", a = typeof e.apparent_temperature == "number" ? `Feels like ${Wt(e.apparent_temperature)}` : typeof e.humidity == "number" ? `Humidity ${e.humidity}%` : "", o = this.hass?.formatEntityState?.(t) ?? zi[s] ?? s, l = s === "clear-night", c = !["sunny", "clear-night"].includes(s), u = ["sunny", "partlycloudy"].includes(s), d = this.daylight(), p = this.forecast.slice(0, this.config.slots ?? 6);
    return h`
      <ha-card class="glass weather" @click=${() => this.moreInfo(this.config.entity)}>
        <canvas aria-hidden="true"></canvas>
        <div class="main">
          <div>
            <div class="temp num">${Wt(e.temperature)}</div>
            <div class="cond">${o}</div>
            <div class="sub">${[a, r].filter(Boolean).join(" · ")}</div>
          </div>
          <div class="art" aria-hidden="true">
            ${u ? h`<div class="sun"></div>` : g} ${l ? h`<div class="moon"></div>` : g}
            ${c ? h`<div class="cloud"></div>` : g}
          </div>
        </div>
        ${p.length ? h`<div class="slots num" style="grid-template-columns:repeat(${p.length},1fr)">
              ${p.map(
      (f, m) => h`<div>
                  <span class="h">${this.slotLabel(f, m)}</span>${I(Ti[f.condition ?? ""] ?? "mdi:weather-cloudy")}<b>${Wt(f.temperature)}</b>
                </div>`
    )}
            </div>` : g}
        ${d ? h`<div class="daylight">
              <div class="bar"><i style="width:${d.progress * 100}%"></i></div>
              <div class="row num">
                <span>Sunrise ${O(d.rise, this.hass)}</span><span>${d.hours} h ${d.minutes} min daylight</span><span>Sunset ${O(d.set, this.hass)}</span>
              </div>
            </div>` : g}
      </ha-card>
    `;
  }
};
be.styles = [
  A,
  T,
  E`
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
      .slots {
        position: relative;
        display: grid;
        gap: 4px;
        margin-top: 18px;
        padding-top: 14px;
        border-top: 1px solid var(--hh-line);
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
    `
];
let ot = be;
he([
  v()
], ot.prototype, "forecast");
he([
  v()
], ot.prototype, "forecastKind");
he([
  wt("canvas")
], ot.prototype, "canvas");
P("hyggehub-weather-card", ot, "HyggeHub Weather", "Current weather with falling snow or rain, a forecast row and daylight.");
var Oi = Object.defineProperty, ws = (n, t, e, s) => {
  for (var i = void 0, r = n.length - 1, a; r >= 0; r--)
    (a = n[r]) && (i = a(t, e, i) || i);
  return i && Oi(t, e, i), i;
};
const Qe = (n) => `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`, ve = class ve extends L {
  static getStubConfig(t) {
    return { entity: Object.keys(t?.states ?? {}).find((e) => e.startsWith("media_player.")) ?? "media_player.living_room" };
  }
  validateConfig(t) {
    const e = t.entities ?? (t.entity ? [t.entity] : []);
    if (!e.length) throw new Error("Set a speaker as `entity`, or several under `entities`.");
    for (const s of e) {
      const i = typeof s == "string" ? s : s.entity;
      if (!i?.startsWith("media_player.")) throw new Error(`${i ?? "An entry"} is not a media_player entity.`);
    }
  }
  get speakers() {
    const t = this.config;
    return (t.entities ?? (t.entity ? [t.entity] : [])).map((e) => typeof e == "string" ? { entity: e } : e);
  }
  /** The pinned speaker, else the first playing, else the first paused, else the first. */
  get current() {
    const t = this.speakers;
    if (this.pinned && t.some((s) => s.entity === this.pinned)) return this.pinned;
    const e = (s) => this.stateOf(s)?.state;
    return (t.find((s) => e(s.entity) === "playing") ?? t.find((s) => e(s.entity) === "paused") ?? t[0]).entity;
  }
  watchedEntities() {
    return this.speakers.map((t) => t.entity);
  }
  connectedCallback() {
    super.connectedCallback(), this.ticker = window.setInterval(() => {
      this.stateOf(this.current)?.state === "playing" && this.requestUpdate();
    }, 1e3);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this.ticker);
  }
  position() {
    const t = this.stateOf(this.current), e = t?.attributes ?? {}, s = Number(e.media_duration) || 0;
    let i = Number(e.media_position) || 0;
    return t?.state === "playing" && e.media_position_updated_at && (i += (Date.now() - new Date(e.media_position_updated_at).getTime()) / 1e3), { pos: Math.min(i, s || i), dur: s };
  }
  call(t, e = {}) {
    return this.callService("media_player", t, e, { entity_id: this.current });
  }
  onVolume(t, e) {
    const s = Number(t.target.value) / 100;
    this.dragVolume = s, clearTimeout(this.volumeTimer), this.volumeTimer = window.setTimeout(
      () => {
        this.call("volume_set", { volume_level: s }), e && setTimeout(() => this.dragVolume = void 0, 1200);
      },
      e ? 0 : 250
    );
  }
  seek(t) {
    const { dur: e } = this.position();
    if (!e) return;
    const s = t.currentTarget.getBoundingClientRect();
    this.call("media_seek", { seek_position: Math.round((t.clientX - s.left) / s.width * e) });
  }
  render() {
    const t = this.current, e = this.stateOf(t), s = e?.attributes ?? {}, i = this.speakers, r = (b) => b.name ?? B(this.stateOf(b.entity), b.entity), a = this.dragVolume ?? (typeof s.volume_level == "number" ? s.volume_level : void 0), o = e?.state === "playing", l = o || e?.state === "paused", c = s.entity_picture, u = c ? c.startsWith("http") ? c : this.hass?.hassUrl(c) ?? c : void 0, { pos: d, dur: p } = this.position(), f = l ? s.media_title ?? "Playing" : "Nothing playing", m = l ? [s.media_artist, s.media_album_name].filter(Boolean).join(" · ") : e ? "Pick something on your speaker" : `${t} is not available`, w = i.length === 1 && this.config.name ? this.config.name : r(i.find((b) => b.entity === t));
    return h`
      <ha-card class="glass media ${o ? "" : "paused"}">
        <button class="art" type="button" aria-label="More details" @click=${() => this.moreInfo(t)}>
          ${u ? h`<img src=${u} alt="" />` : h`<i></i>`}
          ${o ? h`<span class="eq" aria-hidden="true"><b></b><b></b><b></b><b></b></span>` : g}
        </button>
        <div class="meta">
          <div class="src">${y("speaker")} ${w}</div>
          <b>${f}</b><span>${m}</span>
        </div>
        ${l && p ? h`<div class="progress num">
              <span>${Qe(d)}</span>
              <button class="track" type="button" aria-label="Seek" @click=${this.seek}><i style="width:${d / p * 100}%"></i></button>
              <span>${Qe(p)}</span>
            </div>` : g}
        ${e ? h`<div class="controls">
              <button class="round" type="button" aria-label="Previous track" @click=${() => this.call("media_previous_track")}>${Bt("prev")}</button>
              <button class="round play" type="button" aria-label=${o ? "Pause" : "Play"} @click=${() => this.call("media_play_pause")}>
                ${Bt(o ? "pause" : "play")}
              </button>
              <button class="round" type="button" aria-label="Next track" @click=${() => this.call("media_next_track")}>${Bt("next")}</button>
            </div>` : g}
        ${e && a !== void 0 && this.config.volume !== !1 ? h`<label class="vol" style="--v:${a}">
              <span class="vol-fill"></span>
              <span class="vol-label num"><span>Volume</span><span>${Math.round(a * 100)}%</span></span>
              <input
                type="range"
                min="0"
                max="100"
                .value=${String(Math.round(a * 100))}
                aria-label="Volume"
                @input=${(b) => this.onVolume(b, !1)}
                @change=${(b) => this.onVolume(b, !0)}
              />
            </label>` : g}
        ${i.length > 1 ? h`<div class="speakers">
              ${i.map((b) => {
      const k = this.stateOf(b.entity)?.state;
      return h`<button class="chip" type="button" aria-pressed=${b.entity === t} @click=${() => this.pinned = b.entity}>
                  ${k === "playing" ? h`<span class="live"></span>` : g}${r(b)}
                </button>`;
    })}
            </div>` : g}
      </ha-card>
    `;
  }
};
ve.styles = [
  A,
  T,
  E`
      ha-card.media {
        display: grid;
        grid-template-columns: 76px 1fr;
        gap: 14px;
        align-items: center;
      }
      .art {
        width: 76px;
        height: 76px;
        border-radius: 18px;
        position: relative;
        overflow: hidden;
        background: #1d3a4a;
      }
      .art img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .art i {
        position: absolute;
        inset: -40%;
        background: conic-gradient(from 0deg, #2e8b74, #4b3f8f, #1c4a6b, #7cc4b0, #2e8b74);
        filter: blur(10px);
        animation: hh-spin 14s linear infinite;
      }
      .paused .art i {
        animation-play-state: paused;
      }
      .eq {
        position: absolute;
        left: 10px;
        bottom: 10px;
        display: flex;
        gap: 3px;
        align-items: flex-end;
        height: 22px;
      }
      .eq b {
        width: 4px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.92);
        height: 100%;
        transform-origin: 50% 100%;
        transform: scaleY(0.3);
        animation: eq 1s ease-in-out infinite;
      }
      .eq b:nth-child(2) {
        animation-delay: -0.4s;
      }
      .eq b:nth-child(3) {
        animation-delay: -0.2s;
      }
      .eq b:nth-child(4) {
        animation-delay: -0.7s;
      }
      @keyframes eq {
        0%,
        100% {
          transform: scaleY(0.25);
        }
        50% {
          transform: scaleY(1);
        }
      }
      .meta {
        min-width: 0;
      }
      .meta b {
        display: block;
        font-size: 15px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .meta span {
        font-size: 12.5px;
        color: var(--hh-ink-2);
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .src {
        font-size: 11.5px;
        color: var(--hh-ink-3);
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 4px;
      }
      .src svg.i {
        width: 13px;
        height: 13px;
      }
      .progress {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'IBM Plex Mono', ui-monospace, monospace;
        font-size: 11px;
        color: var(--hh-ink-3);
      }
      .track {
        flex: 1;
        height: 14px;
        display: flex;
        align-items: center;
        position: relative;
      }
      .track::before {
        content: '';
        position: absolute;
        inset: 5px 0;
        border-radius: 4px;
        background: var(--hh-line);
      }
      .track i {
        position: relative;
        display: block;
        height: 4px;
        border-radius: 4px;
        background: var(--hh-ink);
        transition: width 1s linear;
      }
      .controls {
        grid-column: 1 / -1;
        display: flex;
        justify-content: center;
        gap: 14px;
        align-items: center;
      }
      .play {
        width: 52px;
        height: 52px;
        background: var(--hh-ink);
        color: var(--hh-bg);
        border: 0;
      }
      .play:hover {
        background: var(--hh-ink);
      }
      .vol {
        grid-column: 1 / -1;
        position: relative;
        height: 34px;
        border-radius: 12px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        overflow: hidden;
        display: block;
      }
      .vol-fill {
        position: absolute;
        inset: 0 auto 0 0;
        width: calc(var(--v) * 100%);
        background: var(--hh-accent-soft);
      }
      .vol-label {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        font-size: 12px;
        font-weight: 600;
        color: var(--hh-ink-2);
        pointer-events: none;
      }
      .vol input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        opacity: 0;
        cursor: ew-resize;
      }
      .vol:has(input:focus-visible) {
        outline: 2px solid var(--hh-accent);
        outline-offset: 2px;
      }
      .speakers {
        grid-column: 1 / -1;
        display: flex;
        gap: 6px;
        overflow-x: auto;
        scrollbar-width: none;
        padding-bottom: 2px;
      }
      .speakers::-webkit-scrollbar {
        display: none;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex: none;
        padding: 6px 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        color: var(--hh-ink-2);
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        white-space: nowrap;
      }
      .chip[aria-pressed='true'] {
        background: var(--hh-accent);
        color: var(--hh-on-accent);
        border-color: transparent;
      }
      .live {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--hh-ok);
        animation: live 1.6s ease-in-out infinite;
      }
      @keyframes live {
        50% {
          opacity: 0.35;
        }
      }
    `
];
let vt = ve;
ws([
  v()
], vt.prototype, "pinned");
ws([
  v()
], vt.prototype, "dragVolume");
P("hyggehub-media-card", vt, "HyggeHub Media", "Now playing, with artwork, a live equaliser and controls.");
const Li = ["on", "run", "running", "wash", "washing", "main wash", "rinse", "rinsing", "spin", "spinning", "dry", "drying", "active", "in progress"], Pi = ["finished", "end", "done", "complete", "completed"], ye = class ye extends L {
  static getStubConfig() {
    return { name: "Washing machine", entity: "sensor.washer_status", remaining_entity: "sensor.washer_remaining", machine: "washer" };
  }
  validateConfig(t) {
    if (!t.name || !t.entity) throw new Error("Set a `name` and the machine’s status `entity`.");
  }
  watchedEntities() {
    const t = this.config;
    return [t.entity, t.remaining_entity, t.program_entity, t.phase_entity, t.power_entity];
  }
  remainingMinutes() {
    const t = this.stateOf(this.config.remaining_entity);
    if (!t) return;
    if (t.attributes.device_class === "timestamp") {
      const i = new Date(t.state).getTime();
      return isNaN(i) ? void 0 : Math.max(0, (i - Date.now()) / 6e4);
    }
    const e = R(t);
    if (e === void 0) return;
    const s = String(t.attributes.unit_of_measurement ?? "min").toLowerCase();
    return s.startsWith("h") ? e * 60 : s.startsWith("s") ? e / 60 : e;
  }
  render() {
    const t = this.config, e = this.stateOf(t.entity), s = (e?.state ?? "unavailable").toLowerCase(), i = R(this.stateOf(t.power_entity)), r = (t.running_states?.map((k) => k.toLowerCase()) ?? Li).includes(s) || i !== void 0 && i > (t.power_threshold ?? 5), a = Pi.includes(s), o = r ? this.remainingMinutes() : void 0, l = o !== void 0 ? new Date(Date.now() + o * 6e4) : void 0, c = this.stateOf(t.program_entity)?.state, u = t.phases ?? (t.machine === "dryer" ? ["Dry", "Cool down"] : ["Wash", "Rinse", "Spin"]), d = this.stateOf(t.phase_entity)?.state.toLowerCase() ?? "";
    let p = u.findIndex((k) => d.includes(k.toLowerCase()));
    const f = o !== void 0 && t.total_minutes ? Math.min(1, Math.max(0, 1 - o / t.total_minutes)) : void 0;
    p < 0 && r && f !== void 0 && (p = Math.min(u.length - 1, Math.floor(f * u.length)));
    const m = f !== void 0 ? (f * u.length - Math.max(0, p)) * 100 : 50;
    let w;
    r && o !== void 0 ? w = h`<span class="num">${Math.max(1, Math.ceil(o))}</span> min left` : r ? w = h`Running` : a ? w = h`Done` : e ? w = h`Idle` : w = h`Unavailable`;
    const b = [c, r && l ? `done ${O(l, this.hass)}` : a ? "Ready to unload" : ""].filter(Boolean).join(" · ");
    return h`
      <ha-card class="glass">
        <div class="card-h"><h3>${t.name}</h3></div>
        <div class="appliance ${r ? "" : "stopped"} ${t.machine ?? "washer"}" @click=${() => this.moreInfo(t.entity)}>
          <div class="drum" aria-hidden="true">
            ${t.machine === "dryer" ? g : h`<div class="water"></div>`}
            <div class="clothes"></div>
            <div class="shine"></div>
          </div>
          <div class="info">
            <div class="big">${w}</div>
            ${b ? h`<div class="muted detail">${b}</div>` : g}
            ${r || a ? h`<div class="steps">
                    ${u.map((k, ct) => {
      const Ft = a || ct < p ? "done" : ct === p ? "now" : "";
      return h`<span class=${Ft} style=${ct === p && !a ? `--p:${m}%` : ""}></span>`;
    })}
                  </div>
                  <div class="labels">${u.map((k) => h`<span>${k}</span>`)}</div>` : g}
          </div>
        </div>
      </ha-card>
    `;
  }
};
ye.styles = [
  A,
  T,
  E`
      .appliance {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 16px;
        align-items: center;
        cursor: pointer;
      }
      .drum {
        width: 88px;
        height: 88px;
        border-radius: 50%;
        position: relative;
        overflow: hidden;
        background: var(--hh-glass-strong);
        border: 5px solid var(--hh-glass-press);
        box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.12);
      }
      .clothes {
        position: absolute;
        inset: 10px;
        border-radius: 50%;
        background: conic-gradient(from 20deg, var(--hh-accent) 0 18%, transparent 0 34%, var(--hh-warm) 0 46%, transparent 0 62%, var(--hh-ok) 0 74%, transparent 0);
        opacity: 0.55;
        animation: hh-spin 1.4s linear infinite;
      }
      .dryer .clothes {
        animation-duration: 3s;
        opacity: 0.45;
      }
      .water {
        position: absolute;
        left: -30%;
        right: -30%;
        top: 56%;
        bottom: -40%;
        border-radius: 42%;
        background: var(--hh-accent-soft);
        animation: slosh 2.6s ease-in-out infinite;
      }
      .shine {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--hh-highlight), transparent 50%);
      }
      @keyframes slosh {
        50% {
          transform: rotate(14deg) translateY(-4px);
        }
      }
      .stopped .clothes,
      .stopped .water {
        animation-play-state: paused;
      }
      .stopped .water {
        opacity: 0.4;
      }
      .info {
        min-width: 0;
      }
      .big {
        font-size: 26px;
        font-weight: 300;
        letter-spacing: -0.02em;
      }
      .detail {
        font-size: 12.5px;
      }
      .steps {
        display: flex;
        gap: 4px;
        margin: 10px 0 6px;
      }
      .steps span {
        flex: 1;
        height: 4px;
        border-radius: 4px;
        background: var(--hh-line);
      }
      .steps span.done {
        background: var(--hh-accent);
      }
      .steps span.now {
        background: linear-gradient(90deg, var(--hh-accent) var(--p, 50%), var(--hh-line) 0);
      }
      .labels {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: var(--hh-ink-3);
      }
    `
];
let Zt = ye;
P("hyggehub-appliance-card", Zt, "HyggeHub Appliance", "A washing machine or dryer with a spinning drum, time left and phases.");
const F = { x: 270, y: 80 }, Mt = (n) => `${Math.abs(n) < 10 ? Math.abs(n).toFixed(1) : Math.round(Math.abs(n))} kW`, xe = class xe extends L {
  static getStubConfig() {
    return { solar: "sensor.solar_power", grid: "sensor.grid_power", battery: "sensor.battery_power", battery_soc: "sensor.battery_level" };
  }
  validateConfig(t) {
    if (!t.grid) throw new Error("Set at least the `grid` power sensor.");
  }
  watchedEntities() {
    const t = this.config;
    return [t.solar, t.grid, t.grid_export, t.battery, t.battery_soc, t.home, ...(t.extras ?? []).map((e) => e.entity)];
  }
  getCardSize() {
    return 4;
  }
  render() {
    const t = this.config, e = ht(this.stateOf(t.solar)) ?? 0, s = (ht(this.stateOf(t.grid)) ?? 0) - (ht(this.stateOf(t.grid_export)) ?? 0), i = ht(this.stateOf(t.battery)) ?? 0, r = ht(this.stateOf(t.home)) ?? Math.max(0, e + s + i), a = r > 0 ? Math.round(Math.max(0, Math.min(1, 1 - Math.max(s, 0) / r)) * 100) : 100, o = [];
    t.solar && o.push({ key: "solar", label: "Solar", kw: e, y: 0, color: "var(--hh-warm)", reverse: !1 }), t.battery && o.push({ key: "battery", label: "Battery", kw: i, y: 0, color: "var(--hh-ok)", reverse: i < 0 }), o.push({ key: "grid", label: s < 0 ? "Export" : "Grid", kw: s, y: 0, color: "var(--hh-accent)", reverse: s < 0 });
    const l = o.length === 1 ? 0 : 100 / (o.length - 1);
    o.forEach((d, p) => d.y = o.length === 1 ? 80 : 30 + p * l);
    const c = this.stateOf(t.battery_soc)?.state, u = (d) => d === "solar" ? "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" : d === "battery" ? "M8 4h8a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM10 2h4M9 14h6M9 10h6" : "M12 2L7 22M12 2l5 20M7.8 9h8.4M6 15h12M9 15l6-6M15 15L9 9";
    return h`
      <ha-card class="glass">
        <div class="card-h">
          <h3>${t.title ?? "Energy now"}</h3>
          <span class="pill"><span class="dot"></span>Self-sufficient ${a}%</span>
        </div>
        <svg viewBox="0 0 320 160" role="img" aria-label=${o.map((d) => `${d.label} ${Mt(d.kw)}`).join(", ") + `, home ${Mt(r)}`}>
          ${o.map((d) => {
      const p = `M60 ${d.y} C150 ${d.y} 170 ${F.y} ${F.x - 26} ${F.y}`, f = Math.abs(d.kw) > 0.02, m = Math.max(0.6, 3 - Math.abs(d.kw)).toFixed(2);
      return $`
              <path class="base" d=${p}></path>
              ${f ? $`<path class="flow ${d.reverse ? "rev" : ""}" d=${p} style="stroke:${d.color};animation-duration:${m}s"></path>` : g}
              <circle class="node" cx="40" cy=${d.y} r="20"></circle>
              <svg x="30" y=${d.y - 10} width="20" height="20" viewBox="0 0 24 24" class="glyph" style="stroke:${d.color}"><path d=${u(d.key)}></path></svg>
              <text class="label" x="68" y=${d.y - 8}>${Mt(d.kw)}</text>
              <text class="sub" x="68" y=${d.y + 16}>${d.key === "battery" && c ? `${d.label} ${Math.round(Number(c))}%` : d.label}</text>
            `;
    })}
          <circle class="node" cx=${F.x} cy=${F.y} r="26"></circle>
          <svg x=${F.x - 12} y=${F.y - 12} width="24" height="24" viewBox="0 0 24 24" class="glyph" style="stroke:var(--hh-ink)"><path d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5"></path></svg>
          <text class="label" x=${F.x} y=${F.y + 46} text-anchor="middle">${Mt(r)}</text>
          <text class="sub" x=${F.x} y=${F.y + 60} text-anchor="middle">Home</text>
        </svg>
        ${t.extras?.length ? h`<div class="extras num" style="grid-template-columns:repeat(${Math.min(3, t.extras.length)},1fr)">
              ${t.extras.slice(0, 3).map((d) => h`<button type="button" @click=${() => this.moreInfo(d.entity)}><small>${d.name}</small><b>${this.format(d.entity)}</b></button>`)}
            </div>` : g}
      </ha-card>
    `;
  }
};
xe.styles = [
  A,
  T,
  E`
      svg {
        width: 100%;
        height: auto;
        display: block;
        overflow: visible;
      }
      .pill .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--hh-ok);
      }
      .base {
        fill: none;
        stroke: var(--hh-line);
        stroke-width: 2.2;
      }
      .flow {
        fill: none;
        stroke-width: 2.2;
        stroke-linecap: round;
        stroke-dasharray: 1 11;
        animation: flow 1.2s linear infinite;
      }
      .flow.rev {
        animation-direction: reverse;
      }
      @keyframes flow {
        to {
          stroke-dashoffset: -12;
        }
      }
      .node {
        fill: var(--hh-glass-strong);
        stroke: var(--hh-stroke);
      }
      .glyph {
        fill: none;
        stroke-width: 1.6;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .label {
        fill: var(--hh-ink);
        font: 600 13px var(--hh-font);
      }
      .sub {
        fill: var(--hh-ink-3);
        font: 400 11px var(--hh-font);
      }
      .extras {
        display: grid;
        gap: 8px;
        margin-top: 10px;
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
    `
];
let Jt = xe;
P("hyggehub-energy-card", Jt, "HyggeHub Energy", "Live power flowing between solar, battery, grid and the home.");
const Fi = 5 * 6e4, Yt = /* @__PURE__ */ new Map(), Xe = (n) => n.length === 10 ? { d: /* @__PURE__ */ new Date(`${n}T00:00:00`), allDay: !0 } : { d: new Date(n), allDay: !1 };
function $s(n, t, e = !1, s = 7) {
  const i = `${[...t].sort().join(",")}|${s}`, r = Yt.get(i);
  if (r && Date.now() - r.at < (e ? 3e4 : Fi)) return r.events;
  const a = /* @__PURE__ */ new Date();
  a.setHours(0, 0, 0, 0);
  const o = new Date(a.getTime() + s * 864e5), l = n.callWS({
    type: "call_service",
    domain: "calendar",
    service: "get_events",
    target: { entity_id: t },
    service_data: { start_date_time: a.toISOString(), end_date_time: o.toISOString() },
    return_response: !0
  }).then(
    (c) => Object.values(c?.response ?? {}).flatMap((u) => u.events ?? []).map((u) => {
      const d = Xe(u.start);
      return { summary: u.summary ?? "", start: d.d, end: Xe(u.end).d, allDay: d.allDay, location: u.location || void 0, description: u.description || void 0 };
    }).sort((u, d) => u.start.getTime() - d.start.getTime())
  ).catch((c) => (console.warn("HyggeHub: could not read calendars", t, c), Yt.delete(i), []));
  return Yt.set(i, { at: Date.now(), events: l }), l;
}
function Ii(n, t) {
  if (!t) return n;
  const e = t.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return n.filter((s) => {
    const i = `${s.summary} ${s.description ?? ""}`.toLowerCase();
    return e.some((r) => i.includes(r));
  });
}
function te(n, t = /* @__PURE__ */ new Date()) {
  const e = t.getTime(), s = n.filter((r) => r.start.getTime() <= e && r.end.getTime() > e);
  s.sort((r, a) => Number(r.allDay) - Number(a.allDay));
  const i = n.filter((r) => r.start.getTime() > e);
  return { now: s[0], upcoming: i };
}
const ee = (n) => n?.split(/,|\n/)[0].trim(), Ze = {
  brown: "#6b4528",
  "dark-brown": "#3f2a1c",
  "light-brown": "#8f6542",
  blonde: "#d9b26a",
  black: "#231c19",
  red: "#a2502a",
  auburn: "#7e3b22",
  grey: "#a9a6a1"
}, Je = {
  blue: ["#a9d2f2", "#3a6ca6"],
  brown: ["#a7733f", "#4f2f15"],
  hazel: ["#9a6831", "#5f7d3c"],
  "green-brown": ["#9a6831", "#5f7d3c"],
  green: ["#a4d08e", "#3d7744"],
  grey: ["#c7cfd5", "#66747f"]
}, ts = { light: "#f6d6bd", fair: "#efc4a2", medium: "#d9a07a", tan: "#b97a52", deep: "#7d4f35" }, Ni = { woman: "#7fa38f", man: "#40607a", child: "#e0a94a", baby: "#c8d9ea" }, es = (n) => {
  const t = n.replace("#", ""), e = t.length === 3 ? t.split("").map((s) => s + s).join("") : t;
  return [0, 2, 4].map((s) => parseInt(e.slice(s, s + 2), 16) || 0);
}, ks = (n, t, e) => {
  const s = es(n), i = es(t);
  return "#" + s.map((r, a) => Math.round(r + (i[a] - r) * e).toString(16).padStart(2, "0")).join("");
}, Q = (n, t) => ks(n, "#ffffff", t), C = (n, t) => ks(n, "#000000", t), ss = (n, t, e) => n ? t[n.toLowerCase()] ?? (n.startsWith("#") ? n : e) : e, is = {
  woman: {
    head: { cx: 100, cy: 92, rx: 41, ry: 47 },
    eyeY: 97,
    eyeDX: 17,
    sclera: [9.6, 10.6],
    iris: 7.4,
    neck: { y: 122, h: 30, w: 22 },
    body: "M30 204 C30 164 62 146 100 146 C138 146 170 164 170 204 Z",
    mouthY: 118,
    mouthW: 9,
    cheekY: 111,
    hairBack: "M54 96 C46 52 74 30 100 30 C128 30 156 52 146 98 C150 120 156 140 150 160 C138 168 124 164 120 152 C116 142 116 132 118 124 L82 124 C84 132 84 142 80 152 C76 164 62 168 50 160 C44 140 50 120 54 96 Z",
    hairFront: "M59 92 C55 56 78 39 102 39 C127 39 147 56 141 92 C138 77 130 66 118 61 C106 70 86 77 67 81 C63 84 60 88 59 92 Z",
    sheen: "M74 54 Q98 40 126 50",
    brow: 3
  },
  man: {
    head: { cx: 100, cy: 94, rx: 41, ry: 46 },
    eyeY: 98,
    eyeDX: 17,
    sclera: [9.2, 10],
    iris: 7,
    ears: { y: 100, dx: 41, rx: 7, ry: 10 },
    neck: { y: 124, h: 30, w: 26 },
    body: "M24 204 C24 162 58 146 100 146 C142 146 176 162 176 204 Z",
    mouthY: 119,
    mouthW: 9,
    cheekY: 112,
    hairFront: "M59 94 C53 60 72 37 100 35 C125 33 149 50 142 94 C140 81 136 73 130 68 C118 73 100 71 88 64 C80 70 70 77 64 85 C62 88 60 91 59 94 Z",
    sheen: "M76 52 Q100 38 126 48",
    brow: 3.4
  },
  child: {
    head: { cx: 100, cy: 93, rx: 45, ry: 46 },
    eyeY: 99,
    eyeDX: 19.5,
    sclera: [11, 12],
    iris: 8.6,
    ears: { y: 102, dx: 45, rx: 7, ry: 9.5 },
    neck: { y: 128, h: 28, w: 20 },
    body: "M44 204 C44 172 70 154 100 154 C130 154 156 172 156 204 Z",
    mouthY: 121,
    mouthW: 8,
    cheekY: 113,
    hairFront: "M55 94 C50 55 76 36 100 36 C126 36 152 55 145 94 C142 83 138 77 132 73 L128 81 L120 71 L112 79 L104 69 L96 79 L88 71 L80 81 L74 73 C66 79 59 86 55 94 Z",
    sheen: "M74 52 Q100 38 128 50",
    brow: 2.6
  },
  baby: {
    head: { cx: 100, cy: 97, rx: 49, ry: 47 },
    eyeY: 103,
    eyeDX: 21,
    sclera: [12, 12.6],
    iris: 9.6,
    ears: { y: 106, dx: 49, rx: 6, ry: 8 },
    neck: { y: 134, h: 20, w: 24 },
    body: "M50 204 C50 174 73 153 100 153 C127 153 150 174 150 204 Z",
    mouthY: 124,
    mouthW: 6,
    cheekY: 117,
    hairFront: "M60 86 C63 61 81 49 100 49 C120 49 137 61 140 86 C130 72 116 65 100 65 C84 65 70 72 60 86 Z",
    sheen: "M80 58 Q100 50 120 56",
    brow: 1.8
  }
};
function Hi(n = {}, t, e = !1) {
  const s = n.preset && n.preset in is ? n.preset : "man", i = is[s], r = ss(n.skin, ts, ts.fair), a = ss(n.hair, Ze, Ze.brown), o = n.shirt?.startsWith("#") ? n.shirt : Ni[s], l = n.eyes?.toLowerCase() ?? "brown", c = Je[l] ?? (n.eyes?.startsWith("#") ? [Q(n.eyes, 0.45), C(n.eyes, 0.3)] : Je.brown), u = C(r, 0.55), d = i.head, p = (_) => `${t}-${_}`, f = (_) => {
    const M = i.eyeY, [H, W] = i.sclera, Y = i.iris;
    if (e) return $`<path d="M${_ - H} ${M} Q${_} ${M + W * 0.7} ${_ + H} ${M}" fill="none" stroke=${u} stroke-width="2.4" stroke-linecap="round"></path>`;
    const It = _ < 100 ? -1 : 1;
    return $`<g class="eye">
      <ellipse cx=${_} cy=${M} rx=${H} ry=${W} fill="#fdfbf8"></ellipse>
      <ellipse cx=${_} cy=${M - W * 0.55} rx=${H * 0.9} ry=${W * 0.35} fill=${C(r, 0.15)} opacity=".18"></ellipse>
      <circle cx=${_} cy=${M + 0.6} r=${Y} fill="url(#${p("iris")})"></circle>
      <circle cx=${_} cy=${M + 0.6} r=${Y * 0.46} fill="#16110f"></circle>
      <circle cx=${_ - Y * 0.38} cy=${M - Y * 0.38} r=${Y * 0.3} fill="#fff"></circle>
      <circle cx=${_ + Y * 0.32} cy=${M + Y * 0.38} r=${Y * 0.13} fill="#fff" opacity=".85"></circle>
      <path
        d="M${_ - H * 0.98} ${M - W * 0.12} Q${_} ${M - W * 1.22} ${_ + H * 0.98} ${M - W * 0.12}${s === "woman" ? ` M${_ + It * H * 0.9} ${M - W * 0.3} q${It * 2.6} ${-1.2} ${It * 4} ${-3.6}` : ""}"
        fill="none"
        stroke=${C(a, 0.45)}
        stroke-width=${s === "woman" ? 2.4 : s === "baby" ? 1.2 : 1.6}
        stroke-linecap="round"
        opacity=${s === "baby" ? 0.5 : 0.85}
      ></path>
    </g>`;
  }, m = (_) => {
    const M = i.eyeY - i.sclera[1] - (s === "baby" ? 6 : 5), H = i.sclera[0] + 1;
    return $`<path d="M${_ - H} ${M + 1.5} Q${_} ${M - 3.5} ${_ + H} ${M + 0.5}" fill="none" stroke=${C(a, 0.15)} stroke-width=${i.brow} stroke-linecap="round" opacity=${s === "baby" ? 0.45 : 0.9}></path>`;
  }, w = i.eyeY + (s === "baby" ? 10 : 11), b = i.mouthY, k = i.mouthW, ct = s === "baby" ? $`<path d="M${100 - k} ${b} Q100 ${b + 9} ${100 + k} ${b} Q100 ${b + 2} ${100 - k} ${b} Z" fill="#a9474a"></path>
          <path d="M${100 - k * 0.5} ${b + 3.4} Q100 ${b + 6} ${100 + k * 0.5} ${b + 3.4}" fill="none" stroke="#e58a8a" stroke-width="1.6" stroke-linecap="round"></path>` : s === "woman" ? $`<path d="M${100 - k} ${b} Q100 ${b + 8} ${100 + k} ${b} Q100 ${b + 2.6} ${100 - k} ${b} Z" fill="#c4656a"></path>` : $`<path d="M${100 - k} ${b} Q100 ${b + 7} ${100 + k} ${b}" fill="none" stroke=${u} stroke-width="2.8" stroke-linecap="round"></path>`, Ft = s === "woman" ? $`<path d="M84 147 Q100 166 116 147" fill=${C(r, 0.08)}></path>` : s === "baby" ? $`<path d="M76 161 Q100 174 124 161" fill="none" stroke=${Q(o, 0.55)} stroke-width="5" stroke-linecap="round"></path>
            <circle cx="100" cy="176" r="2.2" fill=${Q(o, 0.7)}></circle><circle cx="100" cy="184" r="2.2" fill=${Q(o, 0.7)}></circle>` : $`<path d="M${100 - i.neck.w / 2 - 3} ${i.neck.y + i.neck.h - 4} Q100 ${i.neck.y + i.neck.h + 10} ${100 + i.neck.w / 2 + 3} ${i.neck.y + i.neck.h - 4}" fill="none" stroke=${C(o, 0.22)} stroke-width="4" stroke-linecap="round"></path>`;
  return $`<svg class="avatar" viewBox="20 22 160 160" aria-hidden="true">
    <defs>
      <radialGradient id=${p("skin")} cx="40%" cy="34%" r="72%" fx="36%" fy="28%">
        <stop offset="0" stop-color=${Q(r, 0.28)}></stop>
        <stop offset=".6" stop-color=${r}></stop>
        <stop offset="1" stop-color=${C(r, 0.2)}></stop>
      </radialGradient>
      <linearGradient id=${p("neck")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${C(r, 0.28)}></stop>
        <stop offset=".55" stop-color=${C(r, 0.08)}></stop>
      </linearGradient>
      <radialGradient id=${p("hair")} cx="38%" cy="22%" r="85%" fx="34%" fy="18%">
        <stop offset="0" stop-color=${Q(a, 0.3)}></stop>
        <stop offset=".5" stop-color=${a}></stop>
        <stop offset="1" stop-color=${C(a, 0.35)}></stop>
      </radialGradient>
      <linearGradient id=${p("shirt")} x1=".2" y1="0" x2=".8" y2="1">
        <stop offset="0" stop-color=${Q(o, 0.2)}></stop>
        <stop offset="1" stop-color=${C(o, 0.22)}></stop>
      </linearGradient>
      <radialGradient id=${p("iris")} cx="50%" cy="50%" r="50%">
        <stop offset=".35" stop-color=${c[0]}></stop>
        <stop offset="1" stop-color=${c[1]}></stop>
      </radialGradient>
    </defs>
    <g class="figure">
      ${i.hairBack ? $`<path d=${i.hairBack} fill="url(#${p("hair")})"></path>` : g}
      <path d=${i.body} fill="url(#${p("shirt")})"></path>
      <rect x=${100 - i.neck.w / 2} y=${i.neck.y} width=${i.neck.w} height=${i.neck.h} rx=${i.neck.w / 2.4} fill="url(#${p("neck")})"></rect>
      ${Ft}
      ${i.ears ? $`<ellipse cx=${100 - i.ears.dx} cy=${i.ears.y} rx=${i.ears.rx} ry=${i.ears.ry} fill=${C(r, 0.06)}></ellipse>
            <ellipse cx=${100 + i.ears.dx} cy=${i.ears.y} rx=${i.ears.rx} ry=${i.ears.ry} fill=${C(r, 0.1)}></ellipse>` : g}
      <ellipse cx=${d.cx} cy=${d.cy} rx=${d.rx} ry=${d.ry} fill="url(#${p("skin")})"></ellipse>
      <ellipse cx=${d.cx - d.rx * 0.28} cy=${d.cy - d.ry * 0.38} rx=${d.rx * 0.34} ry=${d.ry * 0.16} fill="#fff" opacity=".16"></ellipse>
      <ellipse cx=${100 - i.eyeDX - 6} cy=${i.cheekY} rx=${s === "baby" ? 9 : 7} ry=${s === "baby" ? 5.5 : 4.2} fill="#ff8a80" opacity=${s === "baby" ? 0.34 : 0.22}></ellipse>
      <ellipse cx=${100 + i.eyeDX + 6} cy=${i.cheekY} rx=${s === "baby" ? 9 : 7} ry=${s === "baby" ? 5.5 : 4.2} fill="#ff8a80" opacity=${s === "baby" ? 0.34 : 0.22}></ellipse>
      ${s === "child" ? $`<g fill=${C(r, 0.35)} opacity=".55"><circle cx="89" cy="111" r="1"></circle><circle cx="93" cy="113" r=".9"></circle><circle cx="107" cy="113" r=".9"></circle><circle cx="111" cy="111" r="1"></circle></g>` : g}
      ${f(100 - i.eyeDX)} ${f(100 + i.eyeDX)} ${m(100 - i.eyeDX)} ${m(100 + i.eyeDX)}
      <path d="M97 ${w} Q100 ${w + 4.5} 103 ${w}" fill="none" stroke=${C(r, 0.28)} stroke-width="2" stroke-linecap="round"></path>
      <ellipse cx="99" cy=${w - 4} rx="2" ry="1.2" fill="#fff" opacity=".35"></ellipse>
      ${ct}
      <path d=${i.hairFront} fill="url(#${p("hair")})"></path>
      ${s === "baby" ? $`<path d="M98 51 C89 45 91 32 102 32 C110 33 111 42 103 44" fill="none" stroke="url(#${p("hair")})" stroke-width="5.5" stroke-linecap="round"></path>` : g}
      <path d=${i.sheen} fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".2"></path>
      ${s === "woman" ? $`<circle cx="60" cy="112" r="2.4" fill="#e8c77a"></circle><circle cx="140" cy="112" r="2.4" fill="#e8c77a"></circle>` : g}
    </g>
  </svg>`;
}
var ji = Object.defineProperty, _s = (n, t, e, s) => {
  for (var i = void 0, r = n.length - 1, a; r >= 0; r--)
    (a = n[r]) && (i = a(t, e, i) || i);
  return i && ji(t, e, i), i;
};
let Ri = 0;
const st = (n) => n.calendar ? [].concat(n.calendar) : [], Bi = (n) => [n.entity, n.battery, n.charging, n.distance, n.sleep, ...st(n), ...(n.stats ?? []).map((t) => t.entity)], as = (n, t) => (/* @__PURE__ */ new Date()).toDateString() === n.toDateString() ? O(n, t) : n.toLocaleDateString(D(t), { weekday: "long" });
function Ui(n, t, e) {
  const s = t.entity ? n?.states[t.entity] : void 0, i = t.sleep ? n?.states[t.sleep] : void 0, r = i?.state === "on", a = e ? te(e).now : void 0;
  let o = "none", l = "", c = s ? `since ${as(new Date(s.last_changed), n)}` : "", u = !1;
  const d = s && s.state !== "unknown" && s.state !== "unavailable" ? s.state : void 0;
  if (d === "home")
    o = "home", l = "Home";
  else if (d && d !== "not_home")
    o = "zone", l = d;
  else if (a) {
    o = "zone", u = !0;
    const m = ee(a.location);
    l = m && m.toLowerCase() !== a.summary.toLowerCase() ? `${a.summary} · ${m}` : a.summary, c = a.allDay ? "all day" : `until ${O(a.end, n)}`;
  } else d === "not_home" ? (o = "away", l = "Away") : t.default_location ? (o = t.default_location.toLowerCase() === "home" ? "home" : "zone", l = o === "home" ? "Home" : t.default_location, c = "") : s && (l = "Location unknown");
  if (!u && o !== "home") {
    const m = t.distance ? n?.states[t.distance] : void 0;
    m && R(m) !== void 0 && d && (l += ` · ${ds(n, m)} away`);
  }
  let p = "";
  if (r) {
    const m = (Date.now() - new Date(i.last_changed).getTime()) / 6e4;
    p = m < 60 ? `${Math.max(1, Math.round(m))} min` : `${Math.floor(m / 60)} h ${Math.round(m % 60)} min`, l = `Asleep · ${p}`;
  }
  r ? c = `since ${as(new Date(i.last_changed), n)}` : o === "none" && (c = "");
  const f = d === "home" && Date.now() - new Date(s.last_changed).getTime() < 10 * 6e4;
  return { presence: o, asleep: r, label: l || "No location", since: c, justArrived: f, sleepFor: p, fromPlan: u };
}
function ns(n, t, e) {
  if (t) return "Now";
  const s = /* @__PURE__ */ new Date(), i = new Date(s.getTime() + 864e5), r = (o, l) => o.toDateString() === l.toDateString(), a = r(n.start, s) ? "" : r(n.start, i) ? "Tomorrow" : n.start.toLocaleDateString(D(e), { weekday: "short" });
  return n.allDay ? a || "Today" : a ? `${a} ${O(n.start, e)}` : O(n.start, e);
}
function rs(n, t) {
  const e = t.battery ? n?.states[t.battery] : void 0, s = R(e);
  if (s === void 0) return;
  const i = t.charging ? n?.states[t.charging]?.state.toLowerCase() : void 0, r = i === "on" || i === "charging" || String(e.attributes.battery_state ?? "").toLowerCase() === "charging";
  return { level: Math.round(s), charging: r };
}
const os = (n, t) => $`<svg class="bat" viewBox="0 0 24 24" aria-hidden="true">
  <rect x="2.5" y="7" width="17" height="10" rx="2.6" fill="none" stroke="currentColor" stroke-width="1.6"></rect>
  <rect x="20.4" y="10" width="2" height="4" rx="1" fill="currentColor"></rect>
  <rect x="4.6" y="9.1" width=${Math.max(0.8, 12.8 * n / 100)} height="5.8" rx="1.3" fill="currentColor"></rect>
  ${t ? $`<path d="M11.6 6.2 8.4 12.4h3.2l-.9 5.4 3.9-6.6h-3.3l1.1-5z" fill="var(--hh-bg)" stroke="currentColor" stroke-width=".9" stroke-linejoin="round"></path>` : g}
</svg>`;
function Wi(n, t, e, s) {
  return h`<span class="pwrap" data-presence=${t.presence} data-arrived=${t.justArrived} style="--breathe-delay:${s}s">
    <span class="portrait">${n.picture ? h`<img src=${n.picture} alt="" />` : Hi(n.avatar, e, t.asleep)}</span>
    ${t.asleep ? h`<span class="zz" aria-hidden="true"><i>z</i><i>z</i><i>z</i></span>` : g}
  </span>`;
}
const Yi = E`
  .pwrap {
    position: relative;
    display: block;
    --ring: var(--hh-line);
  }
  .pwrap[data-presence='home'] {
    --ring: var(--hh-ok);
  }
  .pwrap[data-presence='zone'] {
    --ring: var(--hh-accent);
  }
  .pwrap[data-presence='away'] {
    --ring: var(--hh-ink-3);
  }
  .portrait {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    background: radial-gradient(circle at 35% 25%, var(--hh-glass-press), color-mix(in srgb, var(--hh-accent) 22%, var(--hh-glass-strong)) 70%);
    box-shadow: 0 0 0 3px var(--ring), 0 0 0 7px color-mix(in srgb, var(--ring) 18%, transparent), 0 14px 30px -14px rgba(0, 0, 0, 0.45);
    transition: box-shadow 0.5s;
  }
  .portrait img,
  .portrait .avatar {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
  /* Breathing: the whole drawing rises a hair and settles. */
  .portrait .avatar {
    transform-origin: 50% 100%;
    animation: breathe 5.2s ease-in-out infinite;
    animation-delay: var(--breathe-delay, 0s);
    will-change: transform;
  }
  @keyframes breathe {
    50% {
      transform: translateY(1.2px) scale(1.012);
    }
  }
  .eye {
    transform-box: fill-box;
    transform-origin: center;
    transition: transform 0.07s ease-in;
  }
  .portrait.blinking .eye {
    transform: scaleY(0.08);
  }
  /* Just home: a ring ripples out from the portrait for the first ten minutes. */
  .pwrap[data-arrived='true']::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 2px solid var(--ring);
    animation: ripple 2.4s ease-out infinite;
    pointer-events: none;
    will-change: transform, opacity;
  }
  @keyframes ripple {
    0% {
      transform: scale(1);
      opacity: 0.7;
    }
    100% {
      transform: scale(1.28);
      opacity: 0;
    }
  }
  /* Asleep: three z's float up from the top corner, one after another. */
  .zz {
    position: absolute;
    right: -4px;
    top: -2px;
    width: 24px;
    height: 30px;
    pointer-events: none;
  }
  .zz i {
    position: absolute;
    left: 0;
    bottom: 0;
    font: 700 13px var(--hh-font);
    font-style: normal;
    color: var(--hh-ink-2);
    opacity: 0;
    animation: zz 3.6s ease-in-out infinite;
    will-change: transform, opacity;
  }
  .zz i:nth-child(2) {
    animation-delay: 1.2s;
  }
  .zz i:nth-child(3) {
    animation-delay: 2.4s;
  }
  @keyframes zz {
    0% {
      opacity: 0;
      transform: translate(0, 0) scale(0.7);
    }
    25% {
      opacity: 0.85;
    }
    100% {
      opacity: 0;
      transform: translate(12px, -22px) scale(1.15);
    }
  }
  .where {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--hh-ink-2);
    min-width: 0;
  }
  .where .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex: none;
    background: var(--ring, var(--hh-line));
  }
  [data-presence='home'] .where .dot,
  .where[data-presence='home'] .dot {
    background: var(--hh-ok);
  }
  [data-presence='zone'] .where .dot,
  .where[data-presence='zone'] .dot {
    background: var(--hh-accent);
  }
  [data-presence='away'] .where .dot,
  .where[data-presence='away'] .dot {
    background: var(--hh-ink-3);
  }
  [data-asleep='true'] .where .dot,
  .where[data-asleep='true'] .dot {
    background: var(--hh-warm);
  }
  svg.bat {
    width: 22px;
    height: 22px;
    flex: none;
  }
  .bat-low {
    color: var(--hh-crit);
  }
  .bat-charging {
    color: var(--hh-ok);
  }
`, qi = 25e3, we = class we extends L {
  constructor() {
    super(...arguments), this.events = [], this.opened = /* @__PURE__ */ new Set(), this.avatarId = `hh-fam${++Ri}`, this.closeTimers = /* @__PURE__ */ new Map();
  }
  static getStubConfig(t) {
    return { people: Object.keys(t?.states ?? {}).filter((e) => e.startsWith("person.")).map((e) => ({ entity: e })) };
  }
  validateConfig(t) {
    if (!Array.isArray(t.people) || !t.people.length) throw new Error("List the family under `people`.");
  }
  watchedEntities() {
    return this.config.people.flatMap(Bi);
  }
  getCardSize() {
    return 4;
  }
  connectedCallback() {
    super.connectedCallback(), this.ticker = window.setInterval(() => void this.loadEvents(!1), 6e4), this.blinker = window.setInterval(() => this.blinkSomeone(), 3500);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this.ticker), clearInterval(this.blinker), this.closeTimers.forEach((t) => clearTimeout(t)), this.closeTimers.clear();
  }
  updated(t) {
    if (super.updated(t), !this.hass) return;
    const e = this.config.people, s = e.flatMap(st);
    if (!s.length) return;
    const i = JSON.stringify(e.map((o) => [st(o), o.calendar_match])), r = t.get("hass"), a = !!r && s.some((o) => r.states[o] !== this.hass.states[o]);
    (i !== this.loadedFor || a) && (this.loadedFor = i, this.loadEvents(a));
  }
  async loadEvents(t) {
    const e = this.hass;
    e && (this.events = await Promise.all(
      this.config.people.map((s) => st(s).length ? $s(e, st(s), t).then((i) => Ii(i, s.calendar_match)) : Promise.resolve(void 0))
    ));
  }
  /** Now and then one awake person blinks: a 150 ms class change rather than a never-ending animation. */
  blinkSomeone() {
    if (!x.motionOn || document.hidden) return;
    const t = [...this.renderRoot.querySelectorAll(".member:not(.open) .portrait")].filter((s) => s.querySelector(".eye")), e = t[Math.floor(Math.random() * t.length)];
    e && (e.classList.add("blinking"), setTimeout(() => e.classList.remove("blinking"), 150));
  }
  toggle(t) {
    const e = new Set(this.opened);
    clearTimeout(this.closeTimers.get(t)), e.has(t) ? e.delete(t) : (e.add(t), this.closeTimers.set(
      t,
      window.setTimeout(() => {
        const s = new Set(this.opened);
        s.delete(t), this.opened = s;
      }, qi)
    )), this.opened = e;
  }
  /** "Football · Thu 16:30": the next thing within a day and a half, for the front of the tile. */
  nextUp(t) {
    const e = t ? te(t).upcoming[0] : void 0;
    return !e || e.start.getTime() - Date.now() > 36 * 36e5 ? "" : `${e.summary} · ${ns(e, !1, this.hass)}`;
  }
  statValue(t) {
    const e = this.stateOf(t);
    if (e?.attributes.device_class === "timestamp") {
      const s = new Date(e.state);
      if (!isNaN(s.getTime())) return Cs(s);
    }
    return this.format(t);
  }
  renderDetails(t, e, s, i) {
    const r = rs(this.hass, t), a = r ? r.charging ? "bat-charging" : r.level <= 20 ? "bat-low" : "" : "", o = t.sleep?.startsWith("input_boolean."), { now: l, upcoming: c } = s ? te(s) : { now: void 0, upcoming: [] }, u = [...l ? [{ e: l, isNow: !0 }] : [], ...c.slice(0, t.agenda ?? 2).map((p) => ({ e: p, isNow: !1 }))], d = (p) => p.stopPropagation();
    return h`<div class="d-head">
        <b>${i}</b>
        <span class="where"><span class="dot"></span><span class="lbl">${e.label}</span></span>
        ${e.since ? h`<span class="since">${e.since}</span>` : g}
      </div>
      <div class="d-rows">
        ${t.sleep ? h`<button
              class="row sleep ${e.asleep ? "on" : ""}"
              type="button"
              aria-pressed=${o ? e.asleep : g}
              @pointerdown=${d}
              @click=${(p) => {
      d(p), o ? this.callService("input_boolean", "toggle", {}, { entity_id: t.sleep }) : this.moreInfo(t.sleep);
    }}
            >
              <span class="ri">${I(e.asleep ? "mdi:sleep" : "mdi:white-balance-sunny")}</span>
              <span class="rt"><b>${e.asleep ? `Asleep ${e.sleepFor}` : "Awake"}</b>${o ? h`<small>Tap to change</small>` : g}</span>
            </button>` : g}
        ${u.map(
      ({ e: p, isNow: f }) => h`<div class="row ev ${f ? "now" : ""}">
            <span class="when num">${ns(p, f, this.hass)}</span>
            <span class="rt"><b>${p.summary}</b>${ee(p.location) ? h`<small>${ee(p.location)}</small>` : g}</span>
          </div>`
    )}
        ${st(t).length && s && !u.length ? h`<div class="row nothing">Nothing planned this week</div>` : g}
        ${r ? h`<div class="row">
              <span class="ri ${a}">${os(r.level, r.charging)}</span>
              <span class="rt"><b class="num">${r.level}%</b><small>${r.charging ? "Charging" : t.battery_label ?? "Phone"}</small></span>
            </div>` : g}
        ${(t.stats ?? []).map(
      (p) => h`<div class="row">
            <span class="ri">${I(p.icon ?? this.stateOf(p.entity)?.attributes.icon ?? "mdi:information-outline")}</span>
            <span class="rt"><b>${this.statValue(p.entity)}</b><small>${p.name ?? B(this.stateOf(p.entity), p.entity)}</small></span>
          </div>`
    )}
      </div>`;
  }
  render() {
    const t = this.config.people, e = t.map((a, o) => Ui(this.hass, a, this.events[o])), s = e.filter((a) => a.presence !== "none"), i = s.filter((a) => a.presence === "home").length, r = s.length ? i === s.length ? "Everyone is home" : i === 0 ? "Nobody is home" : `${i} of ${s.length} home` : "";
    return h`<ha-card class="glass family">
      <div class="card-h"><h3>${this.config.title ?? "Family"}</h3>${r ? h`<span class="pill">${r}</span>` : g}</div>
      <div class="people">
        ${t.map((a, o) => {
      const l = e[o], c = rs(this.hass, a), u = a.name ?? B(a.entity ? this.stateOf(a.entity) : void 0, "Someone"), d = c ? c.charging ? "bat-charging" : c.level <= 20 ? "bat-low" : "" : "", p = this.nextUp(this.events[o]), f = this.opened.has(o);
      return h`<div
            class="member ${f ? "open" : ""}"
            role="button"
            tabindex="0"
            aria-expanded=${f}
            aria-label="${u}: ${l.label}. ${f ? "Tap to close details" : "Tap for details"}"
            data-presence=${l.presence}
            data-asleep=${l.asleep}
            @click=${() => this.tap(() => this.toggle(o))}
            @pointerdown=${() => this.holdStart(() => this.moreInfo(a.entity ?? a.sleep))}
            @pointerup=${this.holdEnd}
            @pointerleave=${this.holdEnd}
            @pointercancel=${this.holdEnd}
            @keydown=${(m) => {
        m.target !== m.currentTarget || m.key !== "Enter" && m.key !== " " || (m.preventDefault(), this.toggle(o));
      }}
          >
            <div class="face" aria-hidden=${f}>
              ${Wi(a, l, `${this.avatarId}-${o}`, o * -1.6)}
              <b class="name">${u}</b>
              <span class="where"><span class="dot"></span><span class="lbl">${l.asleep ? "Asleep" : l.label.split(" · ")[0]}</span></span>
              ${p ? h`<span class="next" title=${p}>${p}</span>` : g}
              ${c ? h`<span class="mini-bat num ${d}">${os(c.level, c.charging)}${c.level}%</span>` : g}
            </div>
            <div class="details" aria-hidden=${!f}>${f ? this.renderDetails(a, l, this.events[o], u) : g}</div>
          </div>`;
    })}
      </div>
    </ha-card>`;
  }
};
we.styles = [
  A,
  T,
  Yi,
  E`
      .people {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(128px, 1fr));
        gap: 10px;
      }
      .member {
        position: relative;
        border-radius: 20px;
        min-width: 0;
        cursor: pointer;
        user-select: none;
        -webkit-touch-callout: none;
        transition: background 0.3s;
      }
      .member:hover {
        background: var(--hh-glass-strong);
      }
      .member.open {
        background: var(--hh-glass-strong);
        box-shadow: inset 0 0 0 1px var(--hh-stroke);
      }
      /* The front sets the tile's size; the details sit exactly on top of it and scroll if they must. */
      .face {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        padding: 14px 6px 12px;
        text-align: center;
        transition: opacity 0.3s var(--ease), transform 0.45s var(--ease);
      }
      .member.open .face {
        opacity: 0;
        transform: scale(0.88);
        visibility: hidden;
        transition: opacity 0.25s var(--ease), transform 0.45s var(--ease), visibility 0s 0.3s;
      }
      .details {
        position: absolute;
        inset: 0;
        padding: 12px 10px 10px;
        overflow-y: auto;
        scrollbar-width: none;
        opacity: 0;
        transform: translateY(8px);
        pointer-events: none;
        transition: opacity 0.25s var(--ease), transform 0.4s var(--ease);
        mask-image: linear-gradient(#000 calc(100% - 14px), transparent);
      }
      .details::-webkit-scrollbar {
        display: none;
      }
      .member.open .details {
        opacity: 1;
        transform: none;
        pointer-events: auto;
        transition-delay: 0.08s;
      }
      .face .pwrap {
        width: 80px;
        height: 80px;
        margin-bottom: 6px;
      }
      .face .name {
        font-size: 14.5px;
        font-weight: 600;
      }
      .face .where {
        max-width: 100%;
      }
      .where .lbl {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .next {
        font-size: 11.5px;
        color: var(--hh-ink-3);
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mini-bat {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: var(--hh-ink-3);
      }
      .mini-bat svg.bat {
        width: 18px;
        height: 18px;
      }
      .d-head {
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin-bottom: 8px;
        min-width: 0;
      }
      .d-head b {
        font-size: 15px;
        font-weight: 600;
      }
      .d-head .where {
        font-size: 12px;
        align-items: flex-start;
      }
      .d-head .where .dot {
        margin-top: 5px;
      }
      .d-head .where .lbl {
        white-space: normal;
        overflow-wrap: anywhere;
      }
      .since {
        font-size: 11.5px;
        color: var(--hh-ink-3);
      }
      .d-rows {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .row {
        display: grid;
        grid-template-columns: 26px 1fr;
        gap: 8px;
        align-items: center;
        padding: 5px 6px;
        border-radius: 10px;
        text-align: left;
        width: 100%;
        min-width: 0;
      }
      .ri {
        width: 26px;
        height: 26px;
        border-radius: 8px;
        display: grid;
        place-items: center;
        background: var(--hh-accent-soft);
        color: var(--hh-accent);
        --mdc-icon-size: 15px;
      }
      .ri svg.bat {
        width: 17px;
        height: 17px;
      }
      .ri.bat-low {
        background: color-mix(in srgb, var(--hh-crit) 16%, transparent);
      }
      .ri.bat-charging {
        background: color-mix(in srgb, var(--hh-ok) 16%, transparent);
      }
      .rt {
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      .rt b {
        font-size: 12.5px;
        font-weight: 600;
        overflow-wrap: anywhere;
        line-height: 1.25;
      }
      .rt small {
        font-size: 11px;
        color: var(--hh-ink-3);
        overflow-wrap: anywhere;
      }
      .row.ev {
        grid-template-columns: auto 1fr;
        align-items: baseline;
      }
      .row.ev .when {
        font-size: 11px;
        font-weight: 600;
        color: var(--hh-ink-3);
        white-space: nowrap;
      }
      .row.ev.now {
        background: var(--hh-accent-soft);
      }
      .row.ev.now .when {
        color: var(--hh-accent);
      }
      .row.sleep {
        background: var(--hh-glass-press);
        border: 1px solid var(--hh-stroke);
      }
      .row.sleep.on .ri {
        background: color-mix(in srgb, var(--hh-warm) 18%, transparent);
        color: var(--hh-warm);
      }
      .row.nothing {
        display: block;
        font-size: 11.5px;
        color: var(--hh-ink-3);
      }
    `
];
let yt = we;
_s([
  v()
], yt.prototype, "events");
_s([
  v()
], yt.prototype, "opened");
P("hyggehub-family-card", yt, "HyggeHub Family", "Everyone in the home: tap a person to turn their tile to the details.");
var Gi = Object.defineProperty, Vi = (n, t, e, s) => {
  for (var i = void 0, r = n.length - 1, a; r >= 0; r--)
    (a = n[r]) && (i = a(t, e, i) || i);
  return i && Gi(t, e, i), i;
};
const Ki = [
  { name: "Restaffald", match: "rest|residual|general", color: "#6b777d" },
  { name: "Madaffald", match: "mad|food|bio|organ", color: "#5f8f47" },
  { name: "Papir", match: "papir|paper", color: "#3e72a8" },
  { name: "Pap", match: "\\bpap\\b|karton|cardboard", color: "#9a7552" },
  { name: "Plast", match: "plast|mdk|kartoner|plastic", color: "#8a5fb0" },
  { name: "Glas", match: "glas|glass", color: "#3b8d7c" },
  { name: "Metal", match: "metal|dåse|can", color: "#7f8a93" },
  { name: "Farligt affald", match: "farlig|hazard", color: "#b4423f" },
  { name: "Tekstil", match: "tekstil|textile", color: "#c0793a" },
  { name: "Storskrald", match: "storskrald|bulky", color: "#5a5a5a" },
  { name: "Haveaffald", match: "have|garden|green", color: "#6f9a3b" }
], Ct = ["#4c7f95", "#a0784a", "#7d6aa8", "#5b8f6e"], ls = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"], qt = 63, zt = (n) => new Date(n.getFullYear(), n.getMonth(), n.getDate()), Qi = (n) => `${n.getFullYear()}-${n.getMonth()}-${n.getDate()}`, Gt = (n) => Math.round((zt(n).getTime() - zt(/* @__PURE__ */ new Date()).getTime()) / 864e5), Xi = (n, t) => {
  try {
    return new RegExp(n, "i").test(t);
  } catch {
    return t.toLowerCase().includes(n.toLowerCase());
  }
}, Zi = (n) => $`<svg class="bin" viewBox="0 0 24 24" aria-hidden="true" style="--c:${n}">
  <path class="lid" d="M4.2 5.6h15.6a1 1 0 0 1 1 1v1.6H3.2V6.6a1 1 0 0 1 1-1zM10 5.6V4.4a.6.6 0 0 1 .6-.6h2.8a.6.6 0 0 1 .6.6v1.2"></path>
  <path class="body" d="M5 8.2h14l-1.3 11.6a1.6 1.6 0 0 1-1.6 1.4H7.9a1.6 1.6 0 0 1-1.6-1.4z"></path>
  <path class="shine" d="M8.2 10.5l.7 8"></path>
  <circle class="wheel" cx="8" cy="21.4" r="1.4"></circle><circle class="wheel" cx="16" cy="21.4" r="1.4"></circle>
</svg>`, $e = class $e extends L {
  static getStubConfig(t) {
    const e = Object.keys(t?.states ?? {}).find((s) => s.startsWith("calendar.") && /affald|waste|garbage|renovation/i.test(s));
    return e ? { calendar: e } : { schedule: [{ name: "Restaffald", day: "tue", every_weeks: 2, first: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) }] };
  }
  validateConfig(t) {
    if (!t.calendar && !t.schedule?.length) throw new Error("Set a collection `calendar`, or the rounds under `schedule`.");
    for (const e of t.schedule ?? []) {
      if (!ls.includes(String(e.day).slice(0, 3).toLowerCase())) throw new Error(`"${e.name}": day must be a weekday, like tue.`);
      if (isNaN((/* @__PURE__ */ new Date(`${e.first}T00:00:00`)).getTime())) throw new Error(`"${e.name}": first must be a date, like 2026-10-06.`);
    }
  }
  get calendars() {
    return this.config.calendar ? [].concat(this.config.calendar) : [];
  }
  watchedEntities() {
    return this.calendars;
  }
  connectedCallback() {
    super.connectedCallback(), this.ticker = window.setInterval(() => void this.load(!1), 60 * 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this.ticker);
  }
  updated(t) {
    super.updated(t);
    const e = this.calendars;
    if (!this.hass || !e.length) return;
    const s = t.get("hass"), i = !!s && e.some((a) => s.states[a] !== this.hass.states[a]), r = e.join(",");
    (r !== this.loadedFor || i) && (this.loadedFor = r, this.load(i));
  }
  async load(t) {
    !this.hass || !this.calendars.length || (this.events = await $s(this.hass, this.calendars, t, qt));
  }
  /** Which bins an event is about. Unrecognised text becomes its own bin, so nothing is lost. */
  binsIn(t, e) {
    const s = [...this.config.bins ?? [], ...Ki], i = [];
    for (const r of s)
      i.some((a) => a.name === r.name) || Xi(r.match ?? r.name, t) && i.push({ name: r.name, color: r.color ?? Ct[i.length % Ct.length] });
    return i.length ? i : [{ name: t.trim() || "Collection", color: Ct[e % Ct.length] }];
  }
  pickups() {
    const t = /* @__PURE__ */ new Map(), e = (r, a) => {
      const o = Qi(r), l = t.get(o) ?? { day: zt(r), bins: [] };
      for (const c of a) l.bins.some((u) => u.name === c.name) || l.bins.push(c);
      t.set(o, l);
    };
    if (this.calendars.length) {
      if (!this.events) return;
      this.events.forEach((r, a) => {
        Gt(r.start) < 0 || e(r.start, this.binsIn(`${r.summary} ${r.description ?? ""}`, a));
      });
    }
    const s = zt(/* @__PURE__ */ new Date()), i = new Date(s.getTime() + qt * 864e5);
    return (this.config.schedule ?? []).forEach((r, a) => {
      const o = Math.max(1, r.every_weeks ?? 1) * 7 * 864e5, l = ls.indexOf(String(r.day).slice(0, 3).toLowerCase());
      let c = /* @__PURE__ */ new Date(`${r.first}T00:00:00`);
      for (; c.getDay() !== l; ) c = new Date(c.getTime() + 864e5);
      for (c < s && (c = new Date(c.getTime() + Math.ceil((s.getTime() - c.getTime()) / o) * o)); c <= i; c = new Date(c.getTime() + o)) {
        const u = this.binsIn(r.name, a)[0];
        e(c, [{ name: r.name, color: r.color ?? u.color }]);
      }
    }), [...t.values()].sort((r, a) => r.day.getTime() - a.day.getTime());
  }
  whenLabel(t) {
    const e = Gt(t), s = t.toLocaleDateString(D(this.hass), { weekday: "short", day: "numeric", month: "short" });
    return e === 0 ? { big: "Today", small: s } : e === 1 ? { big: "Tomorrow", small: s } : e < 7 ? { big: t.toLocaleDateString(D(this.hass), { weekday: "long" }), small: `in ${e} days · ${t.toLocaleDateString(D(this.hass), { day: "numeric", month: "short" })}` } : { big: s, small: `in ${e} days` };
  }
  render() {
    const t = this.pickups(), e = t?.[0], s = t?.slice(1, 1 + (this.config.upcoming ?? 3)) ?? [], i = e ? Gt(e.day) : -1, r = i === 1 ? "Put them out tonight" : i === 0 && (/* @__PURE__ */ new Date()).getHours() < 12 ? "Collected today" : "";
    return h`<ha-card class="glass bins" data-soon=${i >= 0 && i <= 1} @click=${() => this.moreInfo(this.calendars[0])}>
      <div class="head">
        <h3>${this.config.title ?? "Bins"}</h3>
        ${r ? h`<span class="nudge">${r}</span>` : g}
      </div>
      ${t === void 0 ? h`<p class="quiet">Reading the collection calendar…</p>` : e ? h`
              <div class="next">
                <div class="glyphs">${e.bins.map((a) => Zi(a.color))}</div>
                <div class="when">
                  <b>${this.whenLabel(e.day).big}</b>
                  <small class="num">${this.whenLabel(e.day).small}</small>
                </div>
              </div>
              <div class="chips">${e.bins.map((a) => h`<span class="chip" style="--c:${a.color}">${a.name}</span>`)}</div>
              ${s.length ? h`<ul class="later">
                    ${s.map(
      (a) => h`<li>
                        <span class="d num">${this.whenLabel(a.day).big === "Tomorrow" ? "Tomorrow" : a.day.toLocaleDateString(D(this.hass), { weekday: "short", day: "numeric", month: "short" })}</span>
                        <span class="dots">${a.bins.map((o) => h`<span class="dot-chip" style="--c:${o.color}"><i></i>${o.name}</span>`)}</span>
                      </li>`
    )}
                  </ul>` : g}
            ` : h`<p class="quiet">No collections in the next ${Math.round(qt / 7)} weeks</p>`}
    </ha-card>`;
  }
};
$e.styles = [
  A,
  T,
  E`
      ha-card.bins {
        cursor: pointer;
      }
      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 12px;
      }
      .head h3 {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
      }
      .nudge {
        font-size: 11.5px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 999px;
        background: var(--hh-warm-soft);
        color: var(--hh-on-warm);
        white-space: nowrap;
      }
      .quiet {
        margin: 0;
        font-size: 13px;
        color: var(--hh-ink-3);
      }
      .next {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .glyphs {
        display: flex;
        align-items: flex-end;
        flex: none;
      }
      .glyphs svg.bin {
        width: 44px;
        height: 44px;
      }
      .glyphs svg.bin + svg.bin {
        margin-left: -12px;
      }
      [data-soon='true'] .glyphs svg.bin {
        animation: hop 2.8s var(--ease) infinite;
      }
      [data-soon='true'] .glyphs svg.bin:nth-child(2) {
        animation-delay: 0.15s;
      }
      [data-soon='true'] .glyphs svg.bin:nth-child(3) {
        animation-delay: 0.3s;
      }
      @keyframes hop {
        0%,
        70%,
        100% {
          transform: none;
        }
        78% {
          transform: translateY(-5px) rotate(-3deg);
        }
        86% {
          transform: translateY(0) rotate(2deg);
        }
      }
      svg.bin .body {
        fill: var(--c);
      }
      svg.bin .lid {
        fill: color-mix(in srgb, var(--c) 70%, #000);
      }
      svg.bin .shine {
        fill: none;
        stroke: rgba(255, 255, 255, 0.35);
        stroke-width: 1.2;
        stroke-linecap: round;
      }
      svg.bin .wheel {
        fill: color-mix(in srgb, var(--c) 45%, #000);
      }
      .when {
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      .when b {
        font-size: 26px;
        font-weight: 300;
        letter-spacing: -0.02em;
        line-height: 1.1;
      }
      .when small {
        font-size: 12px;
        color: var(--hh-ink-3);
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 12px;
      }
      .chip {
        font-size: 12px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 999px;
        background: var(--c);
        color: #fff;
      }
      .later {
        list-style: none;
        margin: 14px 0 0;
        padding: 10px 0 0;
        border-top: 1px solid var(--hh-line);
        display: flex;
        flex-direction: column;
        gap: 7px;
      }
      .later li {
        display: grid;
        grid-template-columns: 92px 1fr;
        gap: 8px;
        align-items: baseline;
        font-size: 12.5px;
      }
      .d {
        color: var(--hh-ink-3);
        font-weight: 600;
        font-size: 12px;
        white-space: nowrap;
      }
      .dots {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 10px;
        min-width: 0;
      }
      .dot-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: var(--hh-ink-2);
        font-weight: 500;
      }
      .dot-chip i {
        width: 8px;
        height: 8px;
        border-radius: 3px;
        background: var(--c);
      }
    `
];
let Dt = $e;
Vi([
  v()
], Dt.prototype, "events");
P("hyggehub-bins-card", Dt, "HyggeHub Bins", "The next bin collection and which bins go out, from a collection calendar or a schedule.");
var Ji = Object.defineProperty, ta = Object.getOwnPropertyDescriptor, $t = (n, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? ta(t, e) : t, r = n.length - 1, a; r >= 0; r--)
    (a = n[r]) && (i = (s ? a(t, e, i) : a(i)) || i);
  return s && i && Ji(t, e, i), i;
};
const ea = (n) => n === 0 ? "Clear" : n < 12 ? "Light" : n < 26 ? "Frosted" : "Heavy", ke = class ke extends nt {
  constructor() {
    super(...arguments), this.narrow = !1, this.embedded = !1, this.tick = 0, this.saveError = "", this.onEngine = () => this.tick++, this.onSaveError = (t) => this.saveError = t.detail?.message ?? "Your changes could not be saved.";
  }
  set hass(t) {
    const e = this._hass;
    this._hass = t, t && x.setHass(t), (!e || e.user !== t?.user || e.states["sun.sun"] !== t?.states["sun.sun"] || e.themes !== t?.themes) && this.requestUpdate("hass", e);
  }
  get hass() {
    return this._hass;
  }
  connectedCallback() {
    super.connectedCallback(), x.addEventListener("change", this.onEngine), x.addEventListener("save-error", this.onSaveError);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), x.removeEventListener("change", this.onEngine), x.removeEventListener("save-error", this.onSaveError), x.preview !== "auto" && x.setPreview("auto");
  }
  update_(t) {
    const e = JSON.parse(JSON.stringify(x.appearance));
    t(e), this.saveError = "", x.save(e);
  }
  slotLook(t) {
    const e = x.appearance;
    return t === "day" ? e.day : e.night;
  }
  renderThemeGrid(t) {
    const e = this.slotLook(t).theme;
    return h`<div class="theme-grid" role="radiogroup" aria-label="${t} theme">
      ${As.map((s) => {
      const i = at[s], r = `background:radial-gradient(circle at 18% 22%,${i.blob1},transparent 62%),radial-gradient(circle at 88% 30%,${i.blob2},transparent 58%),radial-gradient(circle at 50% 120%,${i.blob3},transparent 62%),${i.bg}`;
      return h`<button
          class="theme-opt"
          type="button"
          role="radio"
          aria-checked=${s === e}
          title=${i.description}
          @click=${() => this.update_((a) => a[t].theme = s)}
        >
          <span class="tp" style=${r}>
            <i style="background:${i.glassStrong};border-color:${i.stroke}"></i><u style="background:${i.accent}"></u>
          </span>
          <span class="tn">${i.name}<small>${i.dark ? "Dark" : "Light"}</small></span>
        </button>`;
    })}
    </div>`;
  }
  renderLook(t) {
    const e = this.slotLook(t);
    return h`
      <div class="lbl-row">Theme <span>${at[e.theme].name}</span></div>
      ${this.renderThemeGrid(t)}
      <div class="lbl-row">Frost <span class="num">${ea(e.frost)} · ${e.frost}</span></div>
      <input
        class="frost"
        type="range"
        min="0"
        max="40"
        .value=${String(e.frost)}
        aria-label="${t} frost"
        @input=${(s) => this.update_((i) => i[t].frost = Number(s.target.value))}
      />
      <div class="scale"><span>Clear glass</span><span>Heavy frost</span></div>
      <div class="row">
        <div><b>Moving background</b><small>The colours behind the glass sway slowly</small></div>
        <button class="switch" type="button" role="switch" aria-checked=${e.drift} aria-label="${t} moving background" @click=${() => this.update_((s) => s[t].drift = !s[t].drift)}></button>
      </div>
    `;
  }
  render() {
    this.tick;
    const t = x.appearance, e = x.resolved, s = this.hass?.states["sun.sun"], i = s ? `Today about ${O(new Date(s.attributes.next_setting), this.hass)} to ${O(new Date(s.attributes.next_rising), this.hass)}` : "Needs the sun integration (sun.sun)", r = this.hass?.user?.name ?? "you", a = [
      { key: "device", title: "Follow my device", desc: "Uses the light or dark setting of each phone, tablet and browser" },
      { key: "sun", title: "Follow the sun", desc: `Night from sunset to sunrise. ${i}` },
      { key: "schedule", title: "Fixed times", desc: "The same hours every day" }
    ];
    return h`
      <div class="bar" ?hidden=${this.embedded}>
        ${this.narrow ? h`<button class="round" type="button" aria-label="Open the sidebar" @click=${() => this.dispatchEvent(new Event("hass-toggle-menu", { bubbles: !0, composed: !0 }))}>
              ${y("menu")}
            </button>` : g}
      </div>
      <div class="shell">
        <section class="hero">
          <div>
            <h1>Appearance</h1>
            <p>Your own day and night look. It’s saved to ${r}’s Home Assistant user, so it follows you to every device you sign in on and never changes what anyone else sees.</p>
          </div>
        </section>

        <div class="status glass">
          <div class="si">${y(e.slot === "night" ? "moon" : "sun")}</div>
          <div class="st">
            <b>Showing your ${e.slot} look · ${at[e.look.theme].name}${e.slot === "night" && t.night.same ? " (same as day)" : ""}</b>
            <span>${e.reason}</span>
          </div>
          <div class="seg" role="group" aria-label="Preview">
            ${["auto", "day", "night"].map(
      (o) => h`<button type="button" aria-pressed=${x.preview === o} @click=${() => x.setPreview(o)}>${o === "auto" ? "Auto" : o === "day" ? "Day" : "Night"}</button>`
    )}
          </div>
        </div>
        ${this.saveError ? h`<p class="error" role="alert">${this.saveError}</p>` : g}

        <div class="grid">
          <article class="card glass" data-active=${e.slot === "day"}>
            <div class="card-head">${y("sun")}<h3>Day</h3><span class="pill active"><i></i>Showing now</span></div>
            ${this.renderLook("day")}
          </article>
          <article class="card glass" data-active=${e.slot === "night"}>
            <div class="card-head">
              ${y("moon")}<h3>Night</h3><span class="pill active"><i></i>Showing now</span>
              <label class="push">
                Same as day
                <button class="switch" type="button" role="switch" aria-checked=${t.night.same} @click=${() => this.update_((o) => o.night.same = !o.night.same)}></button>
              </label>
            </div>
            ${t.night.same ? h`<p class="same">Night uses your day look. Turn off “Same as day” to choose another.</p>` : g}
            <div class="body ${t.night.same ? "off" : ""}" ?inert=${t.night.same}>${this.renderLook("night")}</div>
          </article>
        </div>

        <div class="grid">
          <article class="card glass">
            <div class="card-head">${y("moon")}<h3>When night starts</h3></div>
            <div class="opts" role="radiogroup" aria-label="When night starts">
              ${a.map(
      (o) => h`<div>
                  <button class="opt" type="button" role="radio" aria-checked=${t.when === o.key} @click=${() => this.update_((l) => l.when = o.key)}>
                    <span class="radio"></span><span class="ot"><b>${o.title}</b><small>${o.desc}</small></span>
                  </button>
                  ${o.key === "schedule" ? h`<div class="times">
                        <label>From <input type="time" .value=${t.from} ?disabled=${t.when !== "schedule"} @change=${(l) => this.update_((c) => c.from = l.target.value || c.from)} /></label>
                        <label>to <input type="time" .value=${t.to} ?disabled=${t.when !== "schedule"} @change=${(l) => this.update_((c) => c.to = l.target.value || c.to)} /></label>
                      </div>` : g}
                </div>`
    )}
            </div>
          </article>
          <article class="card glass">
            <div class="card-head">${y("sliders")}<h3>Motion</h3></div>
            <div class="row">
              <div><b>Card animations</b><small>Spinning fans, falling snow, the washing drum, the equaliser</small></div>
              <button class="switch" type="button" role="switch" aria-checked=${t.motion} aria-label="Card animations" @click=${() => this.update_((o) => o.motion = !o.motion)}></button>
            </div>
            <div class="row">
              <div><b>Reset my appearance</b><small>Back to Fjord by day and Polar night after dark</small></div>
              <button class="btn-text" type="button" @click=${() => this.update_((o) => Object.assign(o, JSON.parse(JSON.stringify(se))))}>Reset</button>
            </div>
            <p class="note">${y("info")}<span>If a device asks for reduced motion, that always wins. Nothing here changes what other people in the home see.</span></p>
          </article>
        </div>
      </div>
    `;
  }
};
ke.styles = [
  A,
  T,
  E`
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
    `
];
let U = ke;
$t([
  xt({ type: Boolean })
], U.prototype, "narrow", 2);
$t([
  xt({ type: Boolean, reflect: !0 })
], U.prototype, "embedded", 2);
$t([
  v()
], U.prototype, "tick", 2);
$t([
  v()
], U.prototype, "saveError", 2);
$t([
  xt({ attribute: !1, noAccessor: !0 })
], U.prototype, "hass", 1);
customElements.get("hyggehub-appearance-panel") || customElements.define("hyggehub-appearance-panel", U);
class sa extends U {
  constructor() {
    super(), this.embedded = !0;
  }
  setConfig(t) {
  }
  getCardSize() {
    return 12;
  }
  getGridOptions() {
    return { columns: "full" };
  }
}
customElements.get("hyggehub-appearance-card") || customElements.define("hyggehub-appearance-card", sa);
window.customCards = window.customCards || [];
window.customCards.some((n) => n.type === "hyggehub-appearance-card") || window.customCards.push({ type: "hyggehub-appearance-card", name: "HyggeHub Appearance", description: "Your own day and night look, as a card.", preview: !1 });
const ia = "0.1.0", cs = document.querySelector("home-assistant");
cs?.hass && x.setHass(cs.hass);
console.info(`%c HyggeHub %c ${ia} `, "background:#2F6E86;color:#fff;border-radius:4px 0 0 4px;padding:2px 6px", "background:#DCE3E5;color:#18242A;border-radius:0 4px 4px 0;padding:2px 6px");
export {
  ia as VERSION
};
