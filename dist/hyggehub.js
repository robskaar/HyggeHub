const pt = (a) => String(Math.floor(a)).padStart(2, "0"), C = (a) => a?.locale?.language ?? a?.language ?? navigator.language;
function D(a, t) {
  return a.toLocaleTimeString(C(t), { hour: "2-digit", minute: "2-digit" });
}
function Es(a, t) {
  return a.toLocaleDateString(C(t), { weekday: "short", day: "numeric", month: "short" });
}
function Qs(a) {
  if (!a) return "";
  const t = Math.max(0, (Date.now() - new Date(a).getTime()) / 1e3);
  return t < 60 ? "now" : t < 3600 ? `${Math.floor(t / 60)} min` : t < 86400 ? `${Math.floor(t / 3600)} h` : `${Math.floor(t / 86400)} d`;
}
function Zs(a) {
  const t = (a.getTime() - Date.now()) / 1e3, e = Math.abs(t);
  if (e < 60) return t < 0 ? "just now" : "in a moment";
  let s;
  if (e < 3600) s = `${Math.round(e / 60)} min`;
  else if (e < 86400) {
    const i = Math.floor(e / 3600), n = Math.round(e % 3600 / 60);
    s = n ? `${i} h ${n} min` : `${i} h`;
  } else s = `${Math.round(e / 86400)} d`;
  return t < 0 ? `${s} ago` : `in ${s}`;
}
function Ne(a) {
  if (typeof a != "string") return 0;
  const t = a.split(":").map(Number);
  return t.some(isNaN) ? 0 : t.reduce((e, s) => e * 60 + s, 0);
}
function N(a) {
  if (!a) return;
  const t = parseFloat(a.state);
  return isNaN(t) ? void 0 : t;
}
function B(a) {
  const t = N(a);
  if (t === void 0) return;
  const e = String(a.attributes.unit_of_measurement ?? "W").toLowerCase();
  return e === "kw" ? t : e === "mw" ? t * 1e3 : t / 1e3;
}
function As(a, t) {
  if (!t) return "Unavailable";
  if (a?.formatEntityState) return a.formatEntityState(t);
  const e = t.attributes.unit_of_measurement;
  return e ? `${t.state} ${e}` : t.state;
}
function H(a, t = "") {
  return a?.attributes.friendly_name ?? t;
}
function Js(a) {
  const t = Math.max(0, Math.floor(a / 1e3));
  return { days: Math.floor(t / 86400), hours: Math.floor(t / 3600) % 24, minutes: Math.floor(t / 60) % 60, seconds: t % 60, total: t };
}
const ti = "0 1px 1px rgba(30,45,55,.04), 0 14px 34px -14px rgba(30,45,55,.22)", Vt = "0 22px 44px -22px rgba(0,0,0,.7)", gt = {
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
    shadow: ti,
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
    shadow: Vt,
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
    shadow: Vt,
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
    shadow: Vt,
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
}, ei = Object.keys(gt), si = (a) => typeof a == "string" && a in gt, ue = {
  version: 1,
  day: { theme: "fjord", frost: 22, drift: !0 },
  night: { same: !1, theme: "polar", frost: 26, drift: !0 },
  when: "device",
  from: "22:00",
  to: "07:00",
  motion: !0
}, Kt = "hyggehub_appearance", Xt = "hyggehub:appearance:", ii = "https://fonts.googleapis.com/css2?family=Albert+Sans:wght@200;300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap", ai = '"Albert Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', He = /^([01]\d|2[0-3]):[0-5]\d$/, ni = (a) => JSON.parse(JSON.stringify(a)), ri = (a, t) => typeof a == "number" && isFinite(a) ? Math.min(40, Math.max(0, Math.round(a))) : t;
function je(a, t) {
  return {
    theme: si(a?.theme) ? a.theme : t.theme,
    frost: ri(a?.frost, t.frost),
    drift: typeof a?.drift == "boolean" ? a.drift : t.drift
  };
}
function zt(a) {
  const t = ue, e = a && typeof a == "object" ? a : {};
  return {
    version: 1,
    day: je(e.day, t.day),
    night: { ...je(e.night, t.night), same: typeof e.night?.same == "boolean" ? e.night.same : t.night.same },
    when: e.when === "sun" || e.when === "schedule" || e.when === "device" ? e.when : t.when,
    from: He.test(e.from) ? e.from : t.from,
    to: He.test(e.to) ? e.to : t.to,
    motion: typeof e.motion == "boolean" ? e.motion : t.motion
  };
}
const Be = (a) => {
  const [t, e] = a.split(":").map(Number);
  return t * 60 + e;
};
function We(a) {
  const t = (e, s, i, n) => `radial-gradient(${e} at ${s} ${i}, ${n} 0%, transparent 70%)`;
  return [
    t("60vmax 60vmax", "6%", "-4%", a.blob1),
    t("52vmax 52vmax", "96%", "16%", a.blob2),
    t("56vmax 46vmax", "42%", "108%", a.blob3),
    t("34vmax 34vmax", "76%", "78%", a.blob4),
    a.bg
  ].join(", ");
}
class oi extends EventTarget {
  constructor() {
    super(), this.appearance = ni(ue), this.preview = "auto", this.loaded = !1, this.signature = "", this.darkMQ = matchMedia("(prefers-color-scheme: dark)"), this.reducedMQ = matchMedia("(prefers-reduced-motion: reduce)"), this.injectGlobals();
    const t = this.readCache("last");
    t && (this.appearance = t), this.darkMQ.addEventListener("change", () => this.apply()), this.reducedMQ.addEventListener("change", () => this.apply(!0)), setInterval(() => this.apply(), 6e4), this.apply(!0);
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
    this.appearance = zt(t), this.writeCache(), this.apply(!0), this.emit(), clearTimeout(this.saveTimer), this.saveTimer = window.setTimeout(() => {
      this.hass?.callWS({ type: "frontend/set_user_data", key: Kt, value: this.appearance }).catch((e) => {
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
      const s = await t.callWS({ type: "frontend/get_user_data", key: Kt });
      this.appearance = zt(s?.value), this.writeCache();
    } catch (s) {
      console.warn("HyggeHub: could not read appearance, using defaults", s);
    }
    this.loaded = !0, this.apply(!0), this.emit();
    try {
      await this.unsubscribe?.(), this.unsubscribe = await t.connection.subscribeMessage((s) => {
        this.appearance = zt(s?.value), this.writeCache(), this.apply(!0), this.emit();
      }, { type: "frontend/subscribe_user_data", key: Kt });
    } catch {
    }
  }
  resolve() {
    const t = this.appearance;
    let e;
    const s = this.hass?.themes?.darkMode ?? this.darkMQ.matches;
    if (t.when === "sun") {
      const r = this.hass?.states["sun.sun"];
      if (r) {
        const o = r.state === "below_horizon", l = new Date(o ? r.attributes.next_rising : r.attributes.next_setting);
        e = { slot: o ? "night" : "day", reason: o ? `The sun is down, sunrise at ${D(l, this.hass)}` : `The sun is up, sunset at ${D(l, this.hass)}` };
      } else
        e = { slot: s ? "night" : "day", reason: "sun.sun is not available, so this follows your device" };
    } else if (t.when === "schedule") {
      const r = /* @__PURE__ */ new Date(), o = r.getHours() * 60 + r.getMinutes(), l = Be(t.from), c = Be(t.to), p = l > c ? o >= l || o < c : o >= l && o < c;
      e = { slot: p ? "night" : "day", reason: p ? `Night hours, ${t.from} to ${t.to}` : `Outside night hours (${t.from} to ${t.to})` };
    } else
      e = { slot: s ? "night" : "day", reason: `Your device is in ${s ? "dark" : "light"} mode` };
    const i = this.preview === "auto" ? e.slot : this.preview, n = i === "night" && !t.night.same ? { theme: t.night.theme, frost: t.night.frost, drift: t.night.drift } : { ...t.day };
    return {
      slot: i,
      autoSlot: e.slot,
      look: n,
      palette: gt[n.theme],
      reason: this.preview === "auto" ? e.reason : "Previewing. Nothing is saved until you change a setting.",
      previewing: this.preview !== "auto"
    };
  }
  apply(t = !1) {
    const e = this.resolve();
    this.resolved = e;
    const s = this.motionOn, i = JSON.stringify([e.slot, e.look, s, e.reason]);
    if (!t && i === this.signature) return;
    const n = i !== this.signature;
    this.signature = i;
    const r = e.palette, o = {
      "--hh-bg": r.bg,
      "--hh-surface": r.surface,
      "--hh-ink": r.ink,
      "--hh-ink-2": r.ink2,
      "--hh-ink-3": r.ink3,
      "--hh-glass": r.glass,
      "--hh-glass-strong": r.glassStrong,
      "--hh-glass-press": r.glassPress,
      "--hh-stroke": r.stroke,
      "--hh-line": r.line,
      "--hh-highlight": r.highlight,
      "--hh-shadow": r.shadow,
      "--hh-accent": r.accent,
      "--hh-accent-soft": `color-mix(in srgb, ${r.accent} 16%, transparent)`,
      "--hh-on-accent": r.onAccent,
      "--hh-warm": r.warm,
      "--hh-warm-soft": `color-mix(in srgb, ${r.warm} ${r.dark ? 20 : 24}%, transparent)`,
      "--hh-on-warm": r.onWarm,
      "--hh-ok": r.ok,
      "--hh-warn": r.warn,
      "--hh-crit": r.crit,
      "--hh-particle": r.particle,
      "--hh-blur": `${e.look.frost}px`,
      "--hh-play": s ? "running" : "paused",
      "--hh-font": ai,
      "--hh-backdrop": We(r),
      // Home Assistant's own variables, so views, native cards, the sidebar and dialogs match.
      "--lovelace-background": We(r),
      "--primary-background-color": r.bg,
      "--secondary-background-color": r.surface,
      "--card-background-color": r.surface,
      "--primary-text-color": r.ink,
      "--secondary-text-color": r.ink2,
      "--disabled-text-color": r.ink3,
      "--divider-color": r.line,
      "--primary-color": r.accent,
      "--accent-color": r.accent,
      "--text-primary-color": r.onAccent,
      "--state-icon-color": r.ink2,
      "--ha-card-background": r.glassStrong,
      "--ha-card-border-color": r.stroke,
      "--ha-card-border-radius": "26px",
      "--ha-card-box-shadow": r.shadow,
      "--app-header-background-color": r.bg,
      "--app-header-text-color": r.ink,
      "--sidebar-background-color": r.surface,
      "--sidebar-text-color": r.ink2,
      "--sidebar-icon-color": r.ink2,
      "--sidebar-selected-icon-color": r.accent,
      "--sidebar-selected-text-color": r.accent
    }, l = document.documentElement;
    for (const [p, d] of Object.entries(o)) l.style.getPropertyValue(p) !== d && l.style.setProperty(p, d);
    const c = r.dark ? "dark" : "light";
    l.style.colorScheme !== c && (l.style.colorScheme = c), l.classList.remove("hh-drift"), n && this.emit();
  }
  emit() {
    this.dispatchEvent(new Event("change"));
  }
  injectGlobals() {
    if (!document.getElementById("hyggehub-font")) {
      const t = document.createElement("link");
      t.id = "hyggehub-font", t.rel = "stylesheet", t.href = ii, document.head.appendChild(t);
    }
  }
  // A per-device copy so a reload paints the right look before the websocket answers.
  readCache(t) {
    try {
      const e = localStorage.getItem(Xt + t);
      return e ? zt(JSON.parse(e)) : void 0;
    } catch {
      return;
    }
  }
  writeCache() {
    try {
      const t = JSON.stringify(this.appearance);
      localStorage.setItem(Xt + "last", t), this.userId && localStorage.setItem(Xt + this.userId, t);
    } catch {
    }
  }
}
const li = "__hyggehubThemeEngine", x = window[li] ??= new oi();
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ft = globalThis, me = Ft.ShadowRoot && (Ft.ShadyCSS === void 0 || Ft.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, fe = Symbol(), Re = /* @__PURE__ */ new WeakMap();
let zs = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== fe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (me && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Re.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Re.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ci = (a) => new zs(typeof a == "string" ? a : a + "", void 0, fe), E = (a, ...t) => {
  const e = a.length === 1 ? a[0] : t.reduce((s, i, n) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + a[n + 1], a[0]);
  return new zs(e, a, fe);
}, hi = (a, t) => {
  if (me) a.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = Ft.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, a.appendChild(s);
  }
}, Ue = me ? (a) => a : (a) => a instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return ci(e);
})(a) : a;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: di, defineProperty: pi, getOwnPropertyDescriptor: gi, getOwnPropertyNames: ui, getOwnPropertySymbols: mi, getPrototypeOf: fi } = Object, Wt = globalThis, qe = Wt.trustedTypes, bi = qe ? qe.emptyScript : "", vi = Wt.reactiveElementPolyfillSupport, yt = (a, t) => a, Ht = { toAttribute(a, t) {
  switch (t) {
    case Boolean:
      a = a ? bi : null;
      break;
    case Object:
    case Array:
      a = a == null ? a : JSON.stringify(a);
  }
  return a;
}, fromAttribute(a, t) {
  let e = a;
  switch (t) {
    case Boolean:
      e = a !== null;
      break;
    case Number:
      e = a === null ? null : Number(a);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(a);
      } catch {
        e = null;
      }
  }
  return e;
} }, be = (a, t) => !di(a, t), Ye = { attribute: !0, type: String, converter: Ht, reflect: !1, useDefault: !1, hasChanged: be };
Symbol.metadata ??= Symbol("metadata"), Wt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let ct = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Ye) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && pi(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: n } = gi(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: i, set(r) {
      const o = i?.call(this);
      n?.call(this, r), this.requestUpdate(t, o, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Ye;
  }
  static _$Ei() {
    if (this.hasOwnProperty(yt("elementProperties"))) return;
    const t = fi(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(yt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(yt("properties"))) {
      const e = this.properties, s = [...ui(e), ...mi(e)];
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
      for (const i of s) e.unshift(Ue(i));
    } else t !== void 0 && e.push(Ue(t));
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
    return hi(t, this.constructor.elementStyles), t;
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
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : Ht).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const n = s.getPropertyOptions(i), r = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : Ht;
      this._$Em = i;
      const o = r.fromAttribute(e, n.type);
      this[i] = o ?? this._$Ej?.get(i) ?? o, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, n) {
    if (t !== void 0) {
      const r = this.constructor;
      if (i === !1 && (n = this[t]), s ??= r.getPropertyOptions(t), !((s.hasChanged ?? be)(n, e) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: n }, r) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), n !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [i, n] of this._$Ep) this[i] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, n] of s) {
        const { wrapped: r } = n, o = this[i];
        r !== !0 || this._$AL.has(i) || o === void 0 || this.C(i, void 0, n, o);
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
ct.elementStyles = [], ct.shadowRootOptions = { mode: "open" }, ct[yt("elementProperties")] = /* @__PURE__ */ new Map(), ct[yt("finalized")] = /* @__PURE__ */ new Map(), vi?.({ ReactiveElement: ct }), (Wt.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ve = globalThis, Ge = (a) => a, jt = ve.trustedTypes, Ve = jt ? jt.createPolicy("lit-html", { createHTML: (a) => a }) : void 0, Ds = "$lit$", X = `lit$${Math.random().toFixed(9).slice(2)}$`, Ts = "?" + X, yi = `<${Ts}>`, nt = document, xt = () => nt.createComment(""), wt = (a) => a === null || typeof a != "object" && typeof a != "function", ye = Array.isArray, xi = (a) => ye(a) || typeof a?.[Symbol.iterator] == "function", Qt = `[ 	
\f\r]`, bt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ke = /-->/g, Xe = />/g, J = RegExp(`>|${Qt}(?:([^\\s"'>=/]+)(${Qt}*=${Qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Qe = /'/g, Ze = /"/g, Os = /^(?:script|style|textarea|title)$/i, Ls = (a) => (t, ...e) => ({ _$litType$: a, strings: t, values: e }), h = Ls(1), k = Ls(2), Q = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), Je = /* @__PURE__ */ new WeakMap(), at = nt.createTreeWalker(nt, 129);
function Ps(a, t) {
  if (!ye(a) || !a.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ve !== void 0 ? Ve.createHTML(t) : t;
}
const wi = (a, t) => {
  const e = a.length - 1, s = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = bt;
  for (let o = 0; o < e; o++) {
    const l = a[o];
    let c, p, d = -1, u = 0;
    for (; u < l.length && (r.lastIndex = u, p = r.exec(l), p !== null); ) u = r.lastIndex, r === bt ? p[1] === "!--" ? r = Ke : p[1] !== void 0 ? r = Xe : p[2] !== void 0 ? (Os.test(p[2]) && (i = RegExp("</" + p[2], "g")), r = J) : p[3] !== void 0 && (r = J) : r === J ? p[0] === ">" ? (r = i ?? bt, d = -1) : p[1] === void 0 ? d = -2 : (d = r.lastIndex - p[2].length, c = p[1], r = p[3] === void 0 ? J : p[3] === '"' ? Ze : Qe) : r === Ze || r === Qe ? r = J : r === Ke || r === Xe ? r = bt : (r = J, i = void 0);
    const f = r === J && a[o + 1].startsWith("/>") ? " " : "";
    n += r === bt ? l + yi : d >= 0 ? (s.push(c), l.slice(0, d) + Ds + l.slice(d) + X + f) : l + X + (d === -2 ? o : f);
  }
  return [Ps(a, n + (a[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class $t {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let n = 0, r = 0;
    const o = t.length - 1, l = this.parts, [c, p] = wi(t, e);
    if (this.el = $t.createElement(c, s), at.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = at.nextNode()) !== null && l.length < o; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(Ds)) {
          const u = p[r++], f = i.getAttribute(d).split(X), m = /([.?@])?(.*)/.exec(u);
          l.push({ type: 1, index: n, name: m[2], strings: f, ctor: m[1] === "." ? ki : m[1] === "?" ? _i : m[1] === "@" ? Mi : Rt }), i.removeAttribute(d);
        } else d.startsWith(X) && (l.push({ type: 6, index: n }), i.removeAttribute(d));
        if (Os.test(i.tagName)) {
          const d = i.textContent.split(X), u = d.length - 1;
          if (u > 0) {
            i.textContent = jt ? jt.emptyScript : "";
            for (let f = 0; f < u; f++) i.append(d[f], xt()), at.nextNode(), l.push({ type: 2, index: ++n });
            i.append(d[u], xt());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Ts) l.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(X, d + 1)) !== -1; ) l.push({ type: 7, index: n }), d += X.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = nt.createElement("template");
    return s.innerHTML = t, s;
  }
}
function mt(a, t, e = a, s) {
  if (t === Q) return t;
  let i = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const n = wt(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== n && (i?._$AO?.(!1), n === void 0 ? i = void 0 : (i = new n(a), i._$AT(a, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = i : e._$Cl = i), i !== void 0 && (t = mt(a, i._$AS(a, t.values), i, s)), t;
}
let $i = class {
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
    const { el: { content: e }, parts: s } = this._$AD, i = (t?.creationScope ?? nt).importNode(e, !0);
    at.currentNode = i;
    let n = at.nextNode(), r = 0, o = 0, l = s[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let c;
        l.type === 2 ? c = new ft(n, n.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(n, l.name, l.strings, this, t) : l.type === 6 && (c = new Si(n, this, t)), this._$AV.push(c), l = s[++o];
      }
      r !== l?.index && (n = at.nextNode(), r++);
    }
    return at.currentNode = nt, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
};
class ft {
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
    t = mt(this, t, e), wt(t) ? t === g || t == null || t === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : t !== this._$AH && t !== Q && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : xi(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== g && wt(this._$AH) ? this._$AA.nextSibling.data = t : this.T(nt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = $t.createElement(Ps(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const n = new $i(i, this), r = n.u(this.options);
      n.p(e), this.T(r), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = Je.get(t.strings);
    return e === void 0 && Je.set(t.strings, e = new $t(t)), e;
  }
  k(t) {
    ye(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const n of t) i === e.length ? e.push(s = new ft(this.O(xt()), this.O(xt()), this, this.options)) : s = e[i], s._$AI(n), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = Ge(t).nextSibling;
      Ge(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Rt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, n) {
    this.type = 1, this._$AH = g, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = g;
  }
  _$AI(t, e = this, s, i) {
    const n = this.strings;
    let r = !1;
    if (n === void 0) t = mt(this, t, e, 0), r = !wt(t) || t !== this._$AH && t !== Q, r && (this._$AH = t);
    else {
      const o = t;
      let l, c;
      for (t = n[0], l = 0; l < n.length - 1; l++) c = mt(this, o[s + l], e, l), c === Q && (c = this._$AH[l]), r ||= !wt(c) || c !== this._$AH[l], c === g ? t = g : t !== g && (t += (c ?? "") + n[l + 1]), this._$AH[l] = c;
    }
    r && !i && this.j(t);
  }
  j(t) {
    t === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ki extends Rt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === g ? void 0 : t;
  }
}
class _i extends Rt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== g);
  }
}
class Mi extends Rt {
  constructor(t, e, s, i, n) {
    super(t, e, s, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = mt(this, t, e, 0) ?? g) === Q) return;
    const s = this._$AH, i = t === g && s !== g || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== g && (s === g || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Si {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    mt(this, t);
  }
}
const Ci = { I: ft }, Ei = ve.litHtmlPolyfillSupport;
Ei?.($t, ft), (ve.litHtmlVersions ??= []).push("3.3.3");
const Ai = (a, t, e) => {
  const s = e?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = e?.renderBefore ?? null;
    s._$litPart$ = i = new ft(t.insertBefore(xt(), n), n, void 0, e ?? {});
  }
  return i._$AI(a), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xe = globalThis;
let ut = class extends ct {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ai(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Q;
  }
};
ut._$litElement$ = !0, ut.finalized = !0, xe.litElementHydrateSupport?.({ LitElement: ut });
const zi = xe.litElementPolyfillSupport;
zi?.({ LitElement: ut });
(xe.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Di = { attribute: !0, type: String, converter: Ht, reflect: !1, hasChanged: be }, Ti = (a = Di, t, e) => {
  const { kind: s, metadata: i } = e;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), s === "setter" && ((a = Object.create(a)).wrapped = !0), n.set(e.name, a), s === "accessor") {
    const { name: r } = e;
    return { set(o) {
      const l = t.get.call(this);
      t.set.call(this, o), this.requestUpdate(r, l, a, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(r, void 0, a, o), o;
    } };
  }
  if (s === "setter") {
    const { name: r } = e;
    return function(o) {
      const l = this[r];
      t.call(this, o), this.requestUpdate(r, l, a, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function Ct(a) {
  return (t, e) => typeof e == "object" ? Ti(a, t, e) : ((s, i, n) => {
    const r = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), r ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(a, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function y(a) {
  return Ct({ ...a, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fs = (a, t, e) => (e.configurable = !0, e.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(a, t, e), e);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Et(a, t) {
  return (e, s, i) => {
    const n = (r) => r.renderRoot?.querySelector(a) ?? null;
    return Fs(e, s, { get() {
      return n(this);
    } });
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Oi;
function Li(a) {
  return (t, e) => Fs(t, e, { get() {
    return (this.renderRoot ?? (Oi ??= document.createDocumentFragment())).querySelectorAll(a);
  } });
}
var Pi = Object.defineProperty, Fi = Object.getOwnPropertyDescriptor, Is = (a, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? Fi(t, e) : t, n = a.length - 1, r; n >= 0; n--)
    (r = a[n]) && (i = (s ? r(t, e, i) : r(i)) || i);
  return s && i && Pi(t, e, i), i;
};
const we = class It extends ut {
  constructor() {
    super(...arguments), this.held = !1, this.onScreen = !0;
  }
  /** One observer for every card: off-screen cards pause their animations (via --hh-play). */
  static observer() {
    return It.seen ??= new IntersectionObserver((t) => {
      for (const e of t) {
        const s = e.target;
        s.onScreen = e.isIntersecting, e.isIntersecting ? s.style.removeProperty("--hh-play") : s.style.setProperty("--hh-play", "paused");
      }
    });
  }
  connectedCallback() {
    super.connectedCallback(), It.observer().observe(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), It.observer().unobserve(this);
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
    return As(this.hass, this.stateOf(t));
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
Is([
  y()
], we.prototype, "config", 2);
Is([
  Ct({ attribute: !1, noAccessor: !0 })
], we.prototype, "hass", 1);
let P = we;
function F(a, t, e, s) {
  customElements.get(a) || customElements.define(a, t), window.customCards = window.customCards || [], window.customCards.some((i) => i.type === a) || window.customCards.push({ type: a, name: e, description: s, preview: !0 });
}
const Ii = {
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
}, Ni = {
  play: "M8 5.5v13l10.5-6.5z",
  pause: "M7 5h3.6v14H7zM13.4 5H17v14h-3.6z",
  next: "M6 6l9 6-9 6zM16.5 6h2v12h-2z",
  prev: "M18 6l-9 6 9 6zM5.5 6h2v12h-2z"
}, w = (a, t = "") => k`<svg class="i ${t}" viewBox="0 0 24 24" aria-hidden="true"><path d=${Ii[a]}></path></svg>`, Zt = (a, t = "") => k`<svg class="i fill ${t}" viewBox="0 0 24 24" aria-hidden="true"><path d=${Ni[a]}></path></svg>`, _ = (a, t = "") => a ? h`<ha-icon class=${t} .icon=${a}></ha-icon>` : g, T = E`
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
  /* Size the icon box to the glyph, not to a line of text: otherwise iOS Safari gives it the parent's
     line height and the glyph sits high inside a centred chip. */
  ha-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
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
`, O = E`
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
`, _e = class _e extends P {
  static getStubConfig() {
    return { chips: [] };
  }
  watchedEntities() {
    return [...this.config.people ?? [], ...(this.config.chips ?? []).map((t) => t.entity)];
  }
  getCardSize() {
    return this.config.clock ? 2 : 1;
  }
  connectedCallback() {
    super.connectedCallback(), (this.config?.clock || this.config?.greeting) && (this.ticker = window.setInterval(() => this.requestUpdate(), 1e4));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this.ticker);
  }
  peopleChip() {
    const t = (this.config.people ?? []).map((i) => this.stateOf(i)).filter(Boolean);
    if (!t.length) return g;
    const e = t.filter((i) => i.state === "home").length, s = e === t.length ? "All home" : e === 0 ? "No one home" : `${e} of ${t.length} home`;
    return h`<span class="pill">
      <span class="avatars">
        ${t.map((i) => {
      const n = i.attributes.entity_picture, r = H(i, "?");
      return h`<span class=${i.state === "home" ? "home" : "away"} title=${r}>${n ? h`<img src=${n} alt="" />` : r.charAt(0)}</span>`;
    })}
      </span>
      ${s}
    </span>`;
  }
  render() {
    const t = this.config, e = /* @__PURE__ */ new Date(), s = e.getHours(), i = s < 5 ? "Good night" : s < 12 ? "Good morning" : s < 18 ? "Good afternoon" : "Good evening", n = this.hass?.user?.name?.split(" ")[0], r = t.chips ?? [], o = t.clock || t.greeting || t.date;
    return !o && !r.length && !t.people?.length ? (this.style.display = "none", g) : (this.style.display = "", h`
      <div class="hero">
        ${o ? h`<div>
              ${t.clock ? h`<div class="time num">${pt(s)}:${pt(e.getMinutes())}</div>` : g}
              ${t.greeting || t.date ? h`<p class="greet">
                    ${t.greeting ? h`<b>${i}${n ? `, ${n}` : ""}</b>` : g}${t.greeting && t.date ? " · " : ""}${t.date ? e.toLocaleDateString(C(this.hass), { weekday: "long", day: "numeric", month: "long" }) : g}
                  </p>` : g}
            </div>` : g}
        <div class="chips">
          ${this.peopleChip()}
          ${r.map((l) => {
      const c = this.stateOf(l.entity);
      return h`<button class="pill" type="button" @click=${() => this.moreInfo(l.entity)}>
              ${_(l.icon ?? c?.attributes.icon ?? "mdi:information-outline")}
              ${l.name ? h`<span class="faint">${l.name}</span>` : g}${this.format(l.entity)}
            </button>`;
    })}
        </div>
      </div>
    `);
  }
};
_e.styles = [
  T,
  O,
  E`
      .hero {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px 20px;
        flex-wrap: wrap;
        padding: 8px 4px 4px;
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
        margin-left: auto;
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
          margin-left: 0;
        }
      }
    `
];
let re = _e;
F("hyggehub-header-card", re, "HyggeHub Header", "A slim row of status chips; a clock, greeting and date if you want them.");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ns = { ATTRIBUTE: 1, CHILD: 2 }, $e = (a) => (...t) => ({ _$litDirective$: a, values: t });
let ke = class {
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
const { I: Hi } = Ci, ts = (a) => a, es = () => document.createComment(""), vt = (a, t, e) => {
  const s = a._$AA.parentNode, i = t === void 0 ? a._$AB : t._$AA;
  if (e === void 0) {
    const n = s.insertBefore(es(), i), r = s.insertBefore(es(), i);
    e = new Hi(n, r, a, a.options);
  } else {
    const n = e._$AB.nextSibling, r = e._$AM, o = r !== a;
    if (o) {
      let l;
      e._$AQ?.(a), e._$AM = a, e._$AP !== void 0 && (l = a._$AU) !== r._$AU && e._$AP(l);
    }
    if (n !== i || o) {
      let l = e._$AA;
      for (; l !== n; ) {
        const c = ts(l).nextSibling;
        ts(s).insertBefore(l, i), l = c;
      }
    }
  }
  return e;
}, tt = (a, t, e = a) => (a._$AI(t, e), a), ji = {}, Hs = (a, t = ji) => a._$AH = t, Bi = (a) => a._$AH, Jt = (a) => {
  a._$AR(), a._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ss = (a, t, e) => {
  const s = /* @__PURE__ */ new Map();
  for (let i = t; i <= e; i++) s.set(a[i], i);
  return s;
}, oe = $e(class extends ke {
  constructor(a) {
    if (super(a), a.type !== Ns.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(a, t, e) {
    let s;
    e === void 0 ? e = t : t !== void 0 && (s = t);
    const i = [], n = [];
    let r = 0;
    for (const o of a) i[r] = s ? s(o, r) : r, n[r] = e(o, r), r++;
    return { values: n, keys: i };
  }
  render(a, t, e) {
    return this.dt(a, t, e).values;
  }
  update(a, [t, e, s]) {
    const i = Bi(a), { values: n, keys: r } = this.dt(t, e, s);
    if (!Array.isArray(i)) return this.ut = r, n;
    const o = this.ut ??= [], l = [];
    let c, p, d = 0, u = i.length - 1, f = 0, m = n.length - 1;
    for (; d <= u && f <= m; ) if (i[d] === null) d++;
    else if (i[u] === null) u--;
    else if (o[d] === r[f]) l[f] = tt(i[d], n[f]), d++, f++;
    else if (o[u] === r[m]) l[m] = tt(i[u], n[m]), u--, m--;
    else if (o[d] === r[m]) l[m] = tt(i[d], n[m]), vt(a, l[m + 1], i[d]), d++, m--;
    else if (o[u] === r[f]) l[f] = tt(i[u], n[f]), vt(a, i[d], i[u]), u--, f++;
    else if (c === void 0 && (c = ss(r, f, m), p = ss(o, d, u)), c.has(o[d])) if (c.has(o[u])) {
      const b = p.get(r[f]), v = b !== void 0 ? i[b] : null;
      if (v === null) {
        const $ = vt(a, i[d]);
        tt($, n[f]), l[f] = $;
      } else l[f] = tt(v, n[f]), vt(a, i[d], v), i[b] = null;
      f++;
    } else Jt(i[u]), u--;
    else Jt(i[d]), d++;
    for (; f <= m; ) {
      const b = vt(a, l[m + 1]);
      tt(b, n[f]), l[f++] = b;
    }
    for (; d <= u; ) {
      const b = i[d++];
      b !== null && Jt(b);
    }
    return this.ut = r, Hs(a, l), Q;
  }
});
var Wi = Object.defineProperty, Ut = (a, t, e, s) => {
  for (var i = void 0, n = a.length - 1, r; n >= 0; n--)
    (r = a[n]) && (i = r(t, e, i) || i);
  return i && Wi(t, e, i), i;
};
const Ri = [
  { match: "login attempt|unauthori", icon: "mdi:shield-alert-outline", severity: "crit" },
  { match: "leak|smoke|fire|flood", icon: "mdi:alert-octagon-outline", severity: "crit" },
  { match: "battery", icon: "mdi:battery-alert-variant-outline", severity: "crit" },
  { match: "laundry|washing|wash|dryer", icon: "mdi:washing-machine", severity: "info" },
  { match: "door|window|open", icon: "mdi:door-open", severity: "warn" },
  { match: "update|upgrade", icon: "mdi:package-up", severity: "info" },
  { match: "delivered|parcel|package", icon: "mdi:package-variant-closed", severity: "ok" },
  { match: "done|finished|complete|ready", icon: "mdi:check-circle-outline", severity: "ok" }
], is = { info: "var(--hh-accent)", ok: "var(--hh-ok)", warn: "var(--hh-warn)", crit: "var(--hh-crit)" }, as = (a) => a.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`#>]/g, "").replace(/\s+/g, " ").trim(), Me = class Me extends P {
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
    for (const s of [...this.config.rules ?? [], ...Ri]) {
      let i = !1;
      try {
        i = new RegExp(s.match, "i").test(e);
      } catch {
        i = e.toLowerCase().includes(s.match.toLowerCase());
      }
      if (i) return { icon: s.icon ?? "mdi:bell-outline", color: is[s.severity ?? "info"] };
    }
    return { icon: "mdi:bell-outline", color: is.info };
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
        const n = s.get(i), r = i.getBoundingClientRect();
        if (!r.width || !n.width) continue;
        const o = n.left + n.width / 2 - (r.left + r.width / 2), l = n.bottom - r.bottom, c = n.width / r.width;
        if (Math.abs(o) < 0.5 && Math.abs(l) < 0.5 && Math.abs(c - 1) < 5e-3) continue;
        const p = getComputedStyle(i).transform;
        i.animate([{ transform: `translate(${o}px, ${l}px) scale(${c})${p === "none" ? "" : ` ${p}`}` }, { transform: p }], {
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
    const i = t.currentTarget, n = t.clientX;
    let r = 0, o = !1;
    i.setPointerCapture(t.pointerId);
    const l = (p) => {
      r = p.clientX - n, !o && Math.abs(r) > 6 && (o = !0, i.classList.add("dragging")), o && (i.style.translate = `${r}px 0`, i.style.opacity = String(Math.max(0.15, 1 - Math.abs(r) / 320)));
    }, c = () => {
      if (i.removeEventListener("pointermove", l), i.removeEventListener("pointerup", c), i.removeEventListener("pointercancel", c), i.classList.remove("dragging"), o && Math.abs(r) > 90) return this.dismiss(e.notification_id, i, Math.sign(r));
      i.style.translate = "", i.style.opacity = "", o || this.toggle();
    };
    i.addEventListener("pointermove", l), i.addEventListener("pointerup", c), i.addEventListener("pointercancel", c);
  }
  render() {
    for (const n of this.leaving) this.notes[n] || this.leaving.delete(n);
    const t = this.list, e = t.filter((n) => !this.leaving.has(n.notification_id)), s = !e.length && this.config.hide_when_empty !== !1;
    if (this.style.display = s ? "none" : "", s) return h``;
    let i = 0;
    return h`
      <div class="head">
        <h2>${this.config.title ?? "Notifications"} <span class="faint num">${e.length || ""}</span></h2>
        ${e.length ? h`<div>
              ${e.length > 1 ? h`<button class="btn-text" type="button" @click=${this.toggle}>${this.open ? "Stack" : "Show all"}</button>` : g}
              <button class="btn-text" type="button" @click=${this.clearAll}>Clear</button>
            </div>` : g}
      </div>
      <div class="stack ${this.open ? "open" : ""}" style="--peeks:${Math.min(Math.max(e.length - 1, 0), 2)}" aria-live="polite">
        ${oe(
      t,
      (n) => n.notification_id,
      (n) => {
        const r = this.lookFor(n), o = this.leaving.has(n.notification_id), l = o ? 0 : Math.min(i++, 3);
        return h`<div
              class="note glass ${o ? "leaving" : ""}"
              data-id=${n.notification_id}
              data-depth=${l}
              tabindex=${l === 0 || this.open ? 0 : -1}
              role="button"
              aria-expanded=${this.open}
              style="--sev:${r.color};z-index:${10 - l}"
              @pointerdown=${(c) => this.onDown(c, n, l)}
              @keydown=${(c) => {
          c.target === c.currentTarget && (c.key === "Enter" || c.key === " " ? (c.preventDefault(), this.toggle()) : (c.key === "Delete" || c.key === "Backspace") && this.dismiss(n.notification_id, c.currentTarget));
        }}
            >
              <div class="ic">${_(r.icon)}</div>
              <div class="body">
                <div class="t"><span>${n.title ? as(n.title) : "Home Assistant"}</span><time>${Qs(n.created_at)}</time></div>
                <p>${as(n.message)}</p>
                <div class="actions">
                  <button type="button" @click=${(c) => this.dismiss(n.notification_id, c.target.closest(".note"))}>Dismiss</button>
                </div>
              </div>
            </div>`;
      }
    )}
      </div>
      ${!e.length && this.loaded ? h`<div class="empty glass">
            <div class="ic">${w("bell")}</div>
            <div><b>All caught up</b><div class="muted">Nothing needs you right now.</div></div>
          </div>` : g}
      ${e.length ? h`<p class="hint">Tap to ${this.open ? "stack" : "fan out"}, drag sideways to dismiss</p>` : g}
    `;
  }
};
Me.styles = [
  T,
  O,
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
let rt = Me;
Ut([
  y()
], rt.prototype, "notes");
Ut([
  y()
], rt.prototype, "open");
Ut([
  y()
], rt.prototype, "loaded");
Ut([
  Et(".stack")
], rt.prototype, "stackEl");
F("hyggehub-notification-stack-card", rt, "HyggeHub Notification stack", "Home Assistant notifications as a swipeable, stacked pile.");
var Ui = Object.defineProperty, js = (a, t, e, s) => {
  for (var i = void 0, n = a.length - 1, r; n >= 0; n--)
    (r = a[n]) && (i = r(t, e, i) || i);
  return i && Ui(t, e, i), i;
};
const qi = /* @__PURE__ */ new Set(["light", "switch", "input_boolean", "fan", "cover"]), Yi = k`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="1.6"></circle><path d="M12 10.4c-.6-4.2.6-6.9 3-6.9 2.6 0 3.5 3.2-1.6 7.7M13.4 13.1c3.4 2.6 4.6 5.3 3.4 7.4-1.3 2.2-4.5 1.4-5.8-5.3M10.6 12.6c-3.9 1.6-6.9 1.3-8-.8-1.3-2.2 1-4.6 7.5-2.4"></path></svg>`, Gi = k`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3.5h18M12 3.5v16"></path><g class="slats"><path d="M5 4v12h14V4M5 8h14M5 12h14"></path></g><circle cx="12" cy="20.5" r=".9"></circle></svg>`, Se = class Se extends P {
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
    return e === "light" ? "light" : e === "fan" ? "fan" : e === "cover" ? "cover" : e === "switch" && /light|lamp|lampe|lys/i.test(t) ? "light" : qi.has(e) ? "toggle" : "info";
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
    const t = this.ents, e = t.filter((n) => n.kind === "light"), s = e.filter((n) => this.isOn(n.entity, n.kind)).length, i = e.length ? [s ? `${s} light${s > 1 ? "s" : ""} on` : "Lights off"] : [];
    for (const n of t) {
      const r = this.stateOf(n.entity), o = (n.name ?? H(r, n.entity)).toLowerCase();
      n.kind === "fan" && this.isOn(n.entity, n.kind) && i.push(`${o} running`), n.kind === "cover" && i.push(`${o} ${this.isOn(n.entity, n.kind) ? "open" : "closed"}`), n.entity.startsWith("binary_sensor.") && ["door", "window", "opening", "garage_door"].includes(String(r?.attributes.device_class)) && i.push(`${o} ${r?.state === "on" ? "open" : "closed"}`);
    }
    return i.join(" · ");
  }
  entityIcon(t, e) {
    return t.icon ? _(t.icon) : t.kind === "light" ? w("bulb") : t.kind === "fan" ? Yi : t.kind === "cover" ? Gi : _(e?.attributes.icon ?? "mdi:toggle-switch-outline");
  }
  render() {
    const t = this.config, e = this.ents, s = e.some((c) => c.kind === "light" && this.isOn(c.entity, c.kind)), i = N(this.stateOf(t.temperature)), n = N(this.stateOf(t.humidity)), r = this.brightnessPct, o = t.dimmer ? r / 100 : 0.7, l = Math.min(Math.max(e.length, 1), 4);
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
            ${_(t.icon ?? "mdi:home-outline")}
          </button>
          <div class="meta">
            <h3>${t.name}</h3>
            <p class="status">${this.statusLine()}</p>
          </div>
          ${i !== void 0 || n !== void 0 ? h`<button class="climate num" type="button" @click=${() => this.moreInfo(t.temperature ?? t.humidity)}>
                ${i !== void 0 ? h`<b>${i.toFixed(1)}°</b>` : g}
                ${n !== void 0 ? h`<small>${w("drop")}${Math.round(n)}%</small>` : g}
              </button>` : g}
        </div>
        ${e.length ? h`<div class="ents" style="grid-template-columns:repeat(${l},1fr)">
              ${e.map((c) => {
      const p = this.stateOf(c.entity), d = this.isOn(c.entity, c.kind);
      return h`<button
                  class="ent"
                  type="button"
                  data-kind=${c.kind}
                  aria-pressed=${d}
                  ?disabled=${!p}
                  @click=${() => this.tap(() => this.toggle(c))}
                  @pointerdown=${() => this.holdStart(() => this.moreInfo(c.entity))}
                  @pointerup=${this.holdEnd}
                  @pointerleave=${this.holdEnd}
                  @pointercancel=${this.holdEnd}
                  @contextmenu=${(u) => {
        u.preventDefault(), this.moreInfo(c.entity);
      }}
                >
                  ${this.entityIcon(c, p)}<span>${c.name ?? H(p, c.entity)}</span>
                </button>`;
    })}
            </div>` : g}
        ${t.dimmer ? h`<div class="bri" data-on=${r > 0}>
              <div class="bri-fill"></div>
              <div class="bri-label">${w("bulb")}<span class="num">${r > 0 ? `${r}%` : "Off"}</span></div>
              <input
                type="range"
                min="1"
                max="100"
                .value=${String(Math.max(1, r))}
                aria-label="${t.name} brightness"
                @input=${(c) => this.onDim(c, !1)}
                @change=${(c) => this.onDim(c, !0)}
              />
            </div>` : g}
      </ha-card>
    `;
  }
};
Se.styles = [
  T,
  O,
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
let kt = Se;
js([
  y()
], kt.prototype, "pending");
js([
  y()
], kt.prototype, "dragPct");
F("hyggehub-room-card", kt, "HyggeHub Room", "A room with its lights, fans, blinds, climate and a dimmer.");
var Vi = Object.defineProperty, Z = (a, t, e, s) => {
  for (var i = void 0, n = a.length - 1, r; n >= 0; n--)
    (r = a[n]) && (i = r(t, e, i) || i);
  return i && Vi(t, e, i), i;
};
const I = {
  home: { label: "Home", icon: "mdi:home-outline", desc: "Doors and windows only", feature: 1, service: "alarm_arm_home" },
  away: { label: "Away", icon: "mdi:walk", desc: "Everything, cameras on", feature: 2, service: "alarm_arm_away" },
  night: { label: "Night", icon: "mdi:weather-night", desc: "Ground floor, bedrooms off", feature: 4, service: "alarm_arm_night" },
  vacation: { label: "Holiday", icon: "mdi:bag-suitcase-outline", desc: "Everything, lights on a random schedule", feature: 32, service: "alarm_arm_vacation" },
  custom_bypass: { label: "Custom", icon: "mdi:shield-edit-outline", desc: "Your own selection of zones", feature: 16, service: "alarm_arm_custom_bypass" }
}, ns = ["idle", "mode", "code"], le = 46, Dt = 2 * Math.PI * le, Ce = class Ce extends P {
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
    if (this.config.modes?.length) return this.config.modes.filter((s) => s in I);
    const t = this.entity?.attributes.supported_features ?? 0, e = Object.keys(I).filter((s) => t & I[s].feature);
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
    this.step = t, t === "code" && (this.code = "", this.prompt = this.flow === "arm" && this.mode ? `Enter your code to arm ${I[this.mode].label.toLowerCase()}` : "Enter your code to disarm");
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
    const t = this.flow === "disarm" ? "alarm_disarm" : I[this.mode ?? "away"].service, e = this.needsCode(this.flow) ? { code: this.code } : {};
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
    const s = H(this.stateOf(e[0]), e[0]);
    return e.length === 1 ? `${s} is open` : `${s} and ${e.length - 1} more are open`;
  }
  renderOrb() {
    const t = this.panelState, e = this.armedMode, s = this.delayLeft(), i = (f) => f ? I[f].label.toLowerCase() : "", n = (f) => this.config.mode_descriptions?.[f] ?? I[f].desc;
    let r, o, l, c, p = "disarmed", d = 0, u = !1;
    return t === "arming" || t === "pending" ? (p = t, o = t === "arming" ? "Arming" : "Disarm now", r = s ? h`<span class="secs num">${s.left}</span><span class="w">${o}</span>` : h`${w("shield")}<span class="w">${o}</span>`, l = t === "arming" ? "Tap to cancel" : "Tap to enter your code", c = t === "arming" ? "Leave now, the exit delay is running" : "Someone came in, the alarm goes off when the delay ends", s ? d = Dt * (1 - s.left / s.total) : u = !0) : t === "triggered" ? (p = "triggered", o = "Alarm triggered", r = h`${w("shieldAlert", "pop")}<span class="w">Alarm</span>`, l = "Tap to disarm", c = this.sensorSummary() ?? "The alarm has been triggered") : e ? (p = "armed", o = `Armed ${i(e)}`, r = h`${w("lock", "pop")}<span class="w">${o}</span>`, l = "Tap to disarm", c = I[e] ? n(e) : "") : t === "disarmed" ? (o = "Disarmed", r = h`${w("shield", this.flash ? "pop" : "")}<span class="w">Disarmed</span>`, l = "Tap to arm", c = this.sensorSummary() ?? "Ready to arm") : (p = "unavailable", o = t === "disarming" ? "Disarming" : "Unavailable", r = h`${w("shield")}<span class="w">${o}</span>`, l = "", c = t === "disarming" ? "" : "The alarm panel is not responding"), this.flash = !1, h`
      <button class="orb" type="button" data-visual=${p} ?disabled=${p === "unavailable"} aria-label=${l ? `${o}. ${l}` : o} @click=${this.onOrb}>
        <svg viewBox="0 0 100 100" aria-hidden="true" class=${u ? "spin" : ""}>
          <circle class="bg" cx="50" cy="50" r=${le}></circle>
          <circle class="fg" cx="50" cy="50" r=${le} style="stroke-dasharray:${u ? `${Dt * 0.22} ${Dt}` : Dt};stroke-dashoffset:${d}"></circle>
        </svg>
        <span class="core">${r}</span>
      </button>
      <div class="hint">${l}</div>
      <div class="detail">${c}</div>
    `;
  }
  render() {
    const t = this.config, e = this.panelState, s = e.startsWith("armed_") ? "armed" : e, i = t.name ?? "Alarm", n = ns.indexOf(this.step), r = (u) => {
      const f = ns.indexOf(u);
      return f < n ? "before" : f > n ? "after" : "";
    }, o = this.codeFormat === "text", l = !this.codeLength, c = this.codeLength || Math.max(4, this.code.length);
    let p;
    this.step === "mode" ? p = "Choose mode" : this.step === "code" ? p = this.flow === "arm" ? "Enter code" : "" : p = this.config.sensors?.length ? `${this.config.sensors.length} sensors ${this.armedMode ? "armed" : "ready"}` : "";
    const d = this.flow === "arm" && this.step !== "idle" && this.availableModes.length > 1 && this.needsCode("arm");
    return h`
      <ha-card class="glass alarm" data-visual=${s}>
        <div class="head">
          <button class="back" type="button" aria-label="Back" ?hidden=${this.step === "idle"} @click=${this.back}>${w("left")}</button>
          <h3>${this.step === "idle" ? i : this.flow === "arm" ? this.step === "code" && this.mode ? `Arm · ${I[this.mode].label}` : "Arm" : "Disarm"}</h3>
          <div class="right">
            <span>${p}</span>
            ${d ? h`<span class="pips"><i class="on"></i><i class=${this.step === "code" ? "on" : ""}></i></span>` : g}
          </div>
        </div>
        <div class="stage">
          <section class="step ${this.step === "idle" ? "on" : ""}" data-pos=${r("idle")} ?inert=${this.step !== "idle"}>${this.renderOrb()}</section>
          <section class="step ${this.step === "mode" ? "on" : ""}" data-pos=${r("mode")} ?inert=${this.step !== "mode"}>
            <div class="modes">
              ${this.availableModes.map(
      (u) => h`<button class="mode" type="button" @click=${() => this.pickMode(u)}>
                  <span class="mi">${_(I[u].icon)}</span><b>${I[u].label}</b><small>${t.mode_descriptions?.[u] ?? I[u].desc}</small>
                </button>`
    )}
            </div>
          </section>
          <section class="step ${this.step === "code" ? "on" : ""}" data-pos=${r("code")} ?inert=${this.step !== "code"}>
            <div class="prompt" role="status">${this.prompt}</div>
            ${o ? h`<form
                  class="text-code"
                  @submit=${(u) => {
      u.preventDefault(), this.submit();
    }}
                >
                  <input class="code-input" type="password" autocomplete="off" aria-label="Code" .value=${this.code} @input=${(u) => this.code = u.target.value} />
                  <button type="submit" class="ok">OK</button>
                </form>` : h`
                  <div class="dots" aria-hidden="true">${Array.from({ length: c }, (u, f) => h`<i class=${f < this.code.length ? "on" : ""}></i>`)}</div>
                  <div class="keypad">
                    ${["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((u) => h`<button class="key num" type="button" @click=${() => this.press(u)}>${u}</button>`)}
                    ${l ? h`<button class="key util" type="button" @click=${() => this.press("ok")}>OK</button>` : h`<button class="key util" type="button" @click=${() => this.press("cancel")}>Cancel</button>`}
                    <button class="key num" type="button" @click=${() => this.press("0")}>0</button>
                    <button class="key util" type="button" aria-label="Delete digit" @click=${() => this.press("back")}>${w("backspace")}</button>
                  </div>
                `}
          </section>
        </div>
      </ha-card>
    `;
  }
};
Ce.styles = [
  T,
  O,
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
let W = Ce;
Z([
  y()
], W.prototype, "step");
Z([
  y()
], W.prototype, "flow");
Z([
  y()
], W.prototype, "mode");
Z([
  y()
], W.prototype, "code");
Z([
  y()
], W.prototype, "prompt");
Z([
  y()
], W.prototype, "busy");
Z([
  Et(".text-code, .dots")
], W.prototype, "dotsEl");
Z([
  Et(".code-input")
], W.prototype, "codeInput");
F("hyggehub-alarm-card", W, "HyggeHub Alarm", "A step-by-step alarm panel: tap the state to arm or disarm.");
const rs = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"], Ee = class Ee extends P {
  constructor() {
    super(...arguments), this.shown = /* @__PURE__ */ new Map();
  }
  static getStubConfig() {
    return { name: "Lofoten", subtitle: "Flight to Bodø", icon: "mdi:image-filter-hdr", target: `${(/* @__PURE__ */ new Date()).getFullYear()}-12-18T09:40`, style: "ring" };
  }
  validateConfig(t) {
    if (!t.name) throw new Error("Give the countdown a `name`.");
    if (!t.target && !t.entity && !t.weekly) throw new Error("Set `target`, `entity` or `weekly`.");
    if (t.weekly && !rs.includes(String(t.weekly.day).slice(0, 3).toLowerCase())) throw new Error("`weekly.day` must be a weekday, like `tue`.");
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
    const t = this.config, e = /* @__PURE__ */ new Date(), s = {}, i = this.stateOf(t.entity), n = t.entity?.split(".")[0];
    if (i && n === "timer") {
      const o = Ne(i.attributes.duration);
      i.state === "active" && i.attributes.finishes_at ? s.target = new Date(i.attributes.finishes_at) : i.state === "paused" ? s.frozen = Ne(i.attributes.remaining) * 1e3 : s.idleText = "Not running";
      const l = s.frozen ?? (s.target ? s.target.getTime() - e.getTime() : o * 1e3);
      o && (s.progress = 1 - l / (o * 1e3));
    } else if (i && n === "input_datetime")
      if (i.attributes.has_date) s.target = new Date(i.attributes.timestamp * 1e3);
      else {
        const o = new Date(e);
        o.setHours(i.attributes.hour ?? 0, i.attributes.minute ?? 0, i.attributes.second ?? 0, 0), o <= e && o.setDate(o.getDate() + 1), s.target = o;
      }
    else if (i && n === "calendar")
      i.attributes.start_time && (s.target = new Date(String(i.attributes.start_time).replace(" ", "T"))), s.subtitle = i.attributes.message, s.target || (s.idleText = "Nothing coming up");
    else if (i) {
      const o = new Date(i.state);
      isNaN(o.getTime()) ? s.idleText = "No time set" : s.target = o;
    } else if (t.entity)
      s.idleText = `${t.entity} is not available`;
    else if (t.weekly) {
      const [o, l] = (t.weekly.time ?? "00:00").split(":").map(Number), c = rs.indexOf(String(t.weekly.day).slice(0, 3).toLowerCase()), p = new Date(e.getFullYear(), e.getMonth(), e.getDate(), o, l);
      for (; p.getDay() !== c || p <= e; ) p.setDate(p.getDate() + 1);
      s.target = p, s.progress = 1 - (p.getTime() - e.getTime()) / (7 * 864e5);
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
    const r = N(this.stateOf(t.value_entity));
    return r !== void 0 && t.value_target && (s.progress = r / t.value_target), s.progress !== void 0 && (s.progress = Math.min(1, Math.max(0, s.progress))), s;
  }
  updated() {
    x.motionOn && this.renderRoot.querySelectorAll("[data-t]").forEach((t) => {
      const e = t.dataset.t, s = t.textContent ?? "";
      this.shown.has(e) && this.shown.get(e) !== s && (t.classList.remove("tick"), t.offsetWidth, t.classList.add("tick")), this.shown.set(e, s);
    });
  }
  whenText(t) {
    if (!t.target) return "";
    const e = Es(t.target, this.hass);
    return t.target.getHours() || t.target.getMinutes() ? `${e}, ${D(t.target, this.hass)}` : e;
  }
  render() {
    const t = this.config, e = this.resolve(), s = e.frozen ?? (e.target ? e.target.getTime() - Date.now() : 0), i = Js(s), n = !e.idleText && s <= 0;
    return t.style === "compact" ? this.renderCompact(e, i, n) : this.renderRing(e, i, n);
  }
  renderRing(t, e, s) {
    const i = this.config, n = 2 * Math.PI * 52, r = [i.subtitle ?? t.subtitle, this.whenText(t)].filter(Boolean).join(" · ");
    return h`
      <ha-card class="glass ring-card" @click=${() => this.moreInfo(i.entity)}>
        <div class="t-ring">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle class="bg" cx="60" cy="60" r="52"></circle>
            <circle class="fg" cx="60" cy="60" r="52" style="stroke-dasharray:${n};stroke-dashoffset:${n * (1 - (t.progress ?? 0))}"></circle>
          </svg>
          <div class="mid">
            ${s || t.idleText ? h`<span class="ic ${i.animation ?? "none"}">${_(i.icon ?? "mdi:timer-sand-complete")}</span>` : e.days > 0 ? h`<b class="num" data-t="d">${e.days}</b><small>${e.days === 1 ? "day" : "days"}</small>` : h`<b class="num" data-t="h">${e.hours}</b><small>${e.hours === 1 ? "hour" : "hours"}</small>`}
          </div>
        </div>
        <div class="txt">
          <h3>${i.name}</h3>
          ${r ? h`<p>${r}</p>` : g}
          ${t.idleText ? h`<p class="idle">${t.idleText}</p>` : s ? h`<p class="now">${i.done_text ?? "It’s time"}</p>` : h`<div class="clock num">
                  ${e.days > 0 ? h`<div><b data-t="ch">${pt(e.hours)}</b><small>hrs</small></div>` : g}
                  <div><b data-t="cm">${pt(e.minutes)}</b><small>min</small></div>
                  <div><b data-t="cs">${pt(e.seconds)}</b><small>sec</small></div>
                </div>`}
          ${this.renderChips()}
        </div>
      </ha-card>
    `;
  }
  renderCompact(t, e, s) {
    const i = this.config, n = N(this.stateOf(i.value_entity)), r = i.value_unit ?? this.stateOf(i.value_entity)?.attributes.unit_of_measurement ?? "";
    let o;
    t.idleText ? o = h`<span class="small-big">${t.idleText}</span>` : s ? o = h`${i.done_text ?? "Ready"}` : e.days >= 1 ? o = h`<span data-t="d">${e.days}</span><small>${e.days === 1 ? "day" : "days"}</small> <span data-t="h">${e.hours}</span><small>h</small>` : e.hours >= 1 ? o = h`<span data-t="h">${e.hours}</span><small>h</small> <span data-t="m">${e.minutes}</span><small>min</small>` : o = h`<span data-t="m">${e.minutes}</span>:<span data-t="s">${pt(e.seconds)}</span>`;
    const l = t.progress !== void 0 && (i.value_entity || i.entity?.startsWith("timer.") || i.start);
    return h`
      <ha-card class="glass mini" data-done=${s} @click=${() => this.moreInfo(i.entity ?? i.value_entity)}>
        <div class="lbl"><span class="ic ${t.idleText ? "none" : i.animation ?? "none"}">${_(i.icon ?? "mdi:timer-outline")}</span>${i.name}</div>
        <div class="big num">${o}</div>
        <div class="sub faint num">
          ${n !== void 0 && i.value_target ? r.startsWith("°") ? `${Math.round(n)}° of ${i.value_target}${r}` : `${Math.round(n)} of ${i.value_target}${r ? ` ${r}` : ""}` : i.subtitle ?? t.subtitle ?? this.whenText(t)}
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
Ee.styles = [
  T,
  O,
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
let ce = Ee;
F("hyggehub-countdown-card", ce, "HyggeHub Countdown", "Count down to a date, a weekly event, a timer or a calendar entry.");
var Ki = Object.defineProperty, q = (a, t, e, s) => {
  for (var i = void 0, n = a.length - 1, r; n >= 0; n--)
    (r = a[n]) && (i = r(t, e, i) || i);
  return i && Ki(t, e, i), i;
};
const Ae = class Ae extends P {
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
      this.patch(t, (i) => [{ ...e, status: s }, ...i.filter((n) => n.uid !== e.uid)]), this.fx = { uid: e.uid, cls: s === "needs_action" ? "enter restored" : "enter" }, this.callService("todo", "update_item", { item: e.uid, status: s }, { entity_id: t }).catch(() => this.subsRefresh(t));
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
    const i = this.items[t] ?? [], n = (l) => (l = l.toLowerCase(), l === s ? 0 : l.startsWith(s) ? 1 : l.split(/\s+/).some((c) => c.startsWith(s)) ? 2 : l.includes(s) ? 3 : 9), r = i.filter((l) => l.status === "completed").map((l) => ({ item: l, r: n(l.summary) })).filter((l) => l.r < 9).sort((l, c) => l.r - c.r).slice(0, 4).map((l) => ({ type: "restore", item: l.item, exact: l.r === 0 })), o = i.find((l) => l.status === "needs_action" && l.summary.toLowerCase() === s);
    return o ? r.push({ type: "exists", item: o }) : r.some((l) => l.type === "restore" && l.exact) || r.push({ type: "new", text: e }), r;
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
    this.choose(e, i >= 0 ? s[i] : s.find((n) => n.type === "exists") ?? s.find((n) => n.type === "new"));
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
    const i = t.currentTarget, n = i.parentElement, r = t.clientX, o = t.clientY;
    let l = 0, c;
    i.setPointerCapture(t.pointerId);
    const p = (u) => {
      l = u.clientX - r;
      const f = u.clientY - o;
      if (c || (Math.abs(l) > 8 && Math.abs(l) > Math.abs(f) ? (c = "h", i.classList.add("dragging")) : Math.abs(f) > 8 && (c = "v")), c === "h") {
        const m = Math.abs(l), b = Math.sign(l) * Math.min(150, m < 90 ? m : 90 + (m - 90) * 0.35);
        i.style.transform = `translateX(${b}px)`, n.dataset.reveal = l > 0 ? "done" : "del", n.classList.toggle("armed", m > 80);
      }
    }, d = () => {
      i.removeEventListener("pointermove", p), i.removeEventListener("pointerup", d), i.removeEventListener("pointercancel", d), i.classList.remove("dragging"), i.style.transform = "", n.classList.remove("armed"), setTimeout(() => delete n.dataset.reveal, 300), c === "h" && (l > 80 ? this.setStatus(e, s, s.status === "completed" ? "needs_action" : "completed") : l < -80 && this.removeItem(e, s));
    };
    i.addEventListener("pointermove", p), i.addEventListener("pointerup", d), i.addEventListener("pointercancel", d);
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
    const n = (o) => e.scrollLeft = i - (o.clientX - s), r = (o) => {
      e.removeEventListener("pointermove", n), e.removeEventListener("pointerup", r), e.classList.remove("grabbing");
      const l = o.clientX - s, c = Math.round(i / e.clientWidth), p = Math.abs(l) > 50 ? c - Math.sign(l) : c;
      this.goPane(Math.max(0, Math.min(this.tabCount - 1, p)));
    };
    e.addEventListener("pointermove", n), e.addEventListener("pointerup", r);
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
    const n = Math.round((i.getTime() - s.getTime()) / 864e5);
    let r;
    return n < 0 ? r = "Overdue" : n === 0 ? r = "Today" : n === 1 ? r = "Tomorrow" : n < 7 ? r = e.toLocaleDateString(C(this.hass), { weekday: "short" }) : r = Es(e, this.hass), h`<span class="due ${n <= 1 ? "soon" : ""}">${r}</span>`;
  }
  renderItem(t, e, s) {
    const i = e.status === "completed", n = s.done_label ?? "Done", r = e.description?.split(`
`)[0];
    return h`<li class="item ${i ? "done" : ""}" data-uid=${e.uid}>
      <div class="item-bg">
        <span class="bg-done">${w(i ? "undo" : "check")}${i ? "Restore" : n}</span>
        <span class="bg-del">Delete${w("trash")}</span>
      </div>
      <div class="item-fg" @pointerdown=${(o) => this.onRowDown(o, t, e)}>
        <button class="check" type="button" aria-label="${i ? "Restore" : n} ${e.summary}" @click=${() => this.setStatus(t, e, i ? "needs_action" : "completed")}>
          ${w("check")}
        </button>
        <span class="txt">${e.summary}</span>
        ${r ? h`<span class="qty">${r}</span>` : g} ${i ? g : this.dueChip(e.due)}
        <button class="del" type="button" aria-label="Delete ${e.summary}" @click=${() => this.removeItem(t, e)}>${w("x")}</button>
      </div>
    </li>`;
  }
  renderSuggestions(t, e) {
    const s = this.suggestions(t);
    if (!s.length) return g;
    const i = (this.query[t] ?? "").trim().toLowerCase(), n = this.selected(t, s), r = (o) => {
      const l = o.toLowerCase().indexOf(i);
      return l < 0 ? o : h`${o.slice(0, l)}<mark>${o.slice(l, l + i.length)}</mark>${o.slice(l + i.length)}`;
    };
    return h`<div class="suggest" role="listbox" aria-label="Suggestions" @pointerdown=${(o) => o.preventDefault()}>
      ${s.some((o) => o.type === "restore") ? h`<div class="s-h">From ${e.done_label ?? "Done"}</div>` : g}
      ${s.map((o, l) => {
      const c = `sug ${l === n ? "sel" : ""}`, p = () => this.choose(t, o);
      return o.type === "restore" ? h`<button type="button" class=${c} role="option" aria-selected=${l === n} @click=${p}>
            <span class="si">${w("undo")}</span><span class="st"><b>${r(o.item.summary)}</b><small>${o.item.description ?? "Completed earlier"}</small></span><em>Restore</em>
          </button>` : o.type === "exists" ? h`<button type="button" class=${c} role="option" aria-selected=${l === n} @click=${p}>
            <span class="si">${w("check")}</span><span class="st"><b>${o.item.summary}</b><small>Already on the list</small></span><em>Show</em>
          </button>` : h`<button type="button" class=${c} role="option" aria-selected=${l === n} @click=${p}>
          <span class="si">${w("plus")}</span><span class="st"><b>Add “${o.text}”</b><small>As a new item</small></span><em>Add</em>
        </button>`;
    })}
    </div>`;
  }
  renderList(t) {
    const e = t.entity, s = t.name ?? H(this.stateOf(e), e), i = this.items[e], n = i?.filter((c) => c.status === "needs_action") ?? [], r = i?.filter((c) => c.status === "completed") ?? [], o = this.closed[e];
    let l;
    return this.failed[e] ? l = h`<li class="empty-row">${this.failed[e]}</li>` : i ? n.length ? l = oe(n, (c) => c.uid, (c) => this.renderItem(e, c, t)) : l = h`<li class="empty-row">Nothing left on ${s.toLowerCase()}</li>` : l = h`<li class="empty-row">Loading ${s.toLowerCase()}…</li>`, h`<section class="pane">
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
        <button type="submit" aria-label="Add">${w("plus")}</button>
      </form>
      ${this.renderSuggestions(e, t)}
      ${r.length ? h`<div class="done-group ${o ? "closed" : ""}">
            <button class="done-h" type="button" aria-expanded=${!o} @click=${() => this.closed = { ...this.closed, [e]: !o }}>
              ${w("chev")}${t.done_label ?? "Done"} <span class="count num">${r.length}</span><span class="rule"></span>
            </button>
            ${o ? g : h`<ul class="items">${oe(r, (c) => c.uid, (c) => this.renderItem(e, c, t))}</ul>`}
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
      ...t.map((s) => ({ name: s.name ?? H(this.stateOf(s.entity), s.entity), count: this.items[s.entity]?.filter((i) => i.status === "needs_action").length })),
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
Ae.styles = [
  T,
  O,
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
let L = Ae;
q([
  y()
], L.prototype, "items");
q([
  y()
], L.prototype, "failed");
q([
  y()
], L.prototype, "closed");
q([
  y()
], L.prototype, "query");
q([
  y()
], L.prototype, "sel");
q([
  y()
], L.prototype, "paneIdx");
q([
  y()
], L.prototype, "noteDraft");
q([
  y()
], L.prototype, "noteStatus");
q([
  Et(".track")
], L.prototype, "track");
q([
  Li(".pane")
], L.prototype, "panes");
F("hyggehub-lists-card", L, "HyggeHub Lists", "Swipeable to-do lists with a completed group and a shared note.");
var Xi = Object.defineProperty, qt = (a, t, e, s) => {
  for (var i = void 0, n = a.length - 1, r; n >= 0; n--)
    (r = a[n]) && (i = r(t, e, i) || i);
  return i && Xi(t, e, i), i;
};
const Qi = {
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
}, Zi = {
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
}, os = /* @__PURE__ */ new Set(["snowy", "snowy-rainy", "hail"]), ls = /* @__PURE__ */ new Set(["rainy", "pouring", "lightning-rainy"]), Ji = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"], Tt = (a) => typeof a == "number" ? `${Math.round(a)}°`.replace("-", "−") : "–", ze = class ze extends P {
  constructor() {
    super(...arguments), this.forecasts = {}, this.view = "hourly", this.page = 0, this.unsubs = [], this.particles = [], this.particleColor = "", this.lastFrame = 0, this.onTheme = () => {
      this.particleColor = getComputedStyle(document.documentElement).getPropertyValue("--hh-particle").trim(), this.syncLoop();
    };
  }
  static getStubConfig(t) {
    return { entity: Object.keys(t?.states ?? {}).find((e) => e.startsWith("weather.")) ?? "weather.home" };
  }
  validateConfig(t) {
    if (!t.entity?.startsWith("weather.")) throw new Error("`entity` must be a weather entity.");
    t.view && (this.view = t.view);
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
    super.disconnectedCallback(), x.removeEventListener("change", this.onTheme);
    for (const t of this.unsubs) t.then((e) => e()).catch(() => {
    });
    this.unsubs = [], this.subscribedFor = void 0, this.raf && cancelAnimationFrame(this.raf), this.raf = void 0, this.resizeObs?.disconnect(), this.resizeObs = void 0;
  }
  firstUpdated() {
    this.syncLoop();
  }
  updated(t) {
    super.updated(t), this.hass && this.subscribedFor !== this.config.entity && this.subscribe(), t.has("hass") && this.syncLoop();
  }
  /** Both forecasts the integration offers, so switching between hours and days is instant. */
  subscribe() {
    const t = this.stateOf(this.config.entity);
    if (!t) return;
    for (const i of this.unsubs) i.then((n) => n()).catch(() => {
    });
    this.subscribedFor = this.config.entity;
    const e = t.attributes.supported_features ?? 0, s = [...e & 2 ? ["hourly"] : [], ...e & 1 ? ["daily"] : []];
    s.includes(this.view) || (this.view = s[0] ?? "daily"), this.unsubs = s.map(
      (i) => this.hass.connection.subscribeMessage((n) => this.forecasts = { ...this.forecasts, [i]: n.forecast ?? [] }, {
        type: "weather/subscribe_forecast",
        entity_id: this.config.entity,
        forecast_type: i
      }).catch(() => () => {
      })
    );
  }
  setView(t, e) {
    t.stopPropagation(), this.view = e, this.page = 0;
  }
  turn(t, e) {
    t.stopPropagation(), this.page = Math.max(0, this.page + e);
  }
  get placeName() {
    if (this.config.name) return this.config.name;
    const t = this.hass?.config?.location_name;
    if (t && !/^(home|hjem)$/i.test(t)) return t;
    const e = H(this.stateOf(this.config.entity));
    return e && !/^(home|hjem|forecast)/i.test(e) ? e : "";
  }
  // ---------- falling snow / rain on a canvas behind the content ----------
  get precipitating() {
    const t = this.stateOf(this.config.entity)?.state ?? "";
    return os.has(t) || ls.has(t);
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
    const n = this.stateOf(this.config.entity)?.state ?? "", r = os.has(n), o = ls.has(n);
    if (!r && !o) return;
    const l = x.motionOn;
    e.fillStyle = e.strokeStyle = this.particleColor || "rgba(255,255,255,.7)", e.lineWidth = 1.2, e.lineCap = "round";
    for (const c of this.particles)
      l && (r ? (c.y += c.s * 2, c.d += 0.024, c.x += Math.sin(c.d) * 0.5) : (c.y += 12 + c.s * 12, c.x -= 2)), c.y > i + 10 && Object.assign(c, this.spawn(s, i, !1)), c.x < -10 && (c.x = s + 5), e.beginPath(), r ? (e.arc(c.x, c.y, c.r, 0, 6.28), e.fill()) : (e.globalAlpha = 0.55, e.moveTo(c.x, c.y), e.lineTo(c.x - 2, c.y + 9 + c.r * 2), e.stroke(), e.globalAlpha = 1);
  }
  // ---------- render ----------
  daylight() {
    const t = this.stateOf(this.config.sun ?? "sun.sun");
    if (!t) return;
    const e = Date.now(), s = new Date(t.attributes.next_rising).getTime(), i = new Date(t.attributes.next_setting).getTime();
    if (isNaN(s) || isNaN(i)) return;
    let n, r, o;
    t.state === "above_horizon" ? (r = i, n = s - 864e5, o = (e - n) / (r - n)) : (n = s, r = i, o = new Date(s).getDate() === new Date(e).getDate() ? 0 : 1, o === 1 && (n = s - 864e5, r = i - 864e5));
    const l = Math.max(0, r - n);
    return { rise: new Date(n), set: new Date(r), progress: Math.min(1, Math.max(0, o)), hours: Math.floor(l / 36e5), minutes: Math.round(l % 36e5 / 6e4) };
  }
  slotLabel(t) {
    const e = new Date(t.datetime);
    return this.view === "daily" ? (/* @__PURE__ */ new Date()).toDateString() === e.toDateString() ? "Today" : e.toLocaleDateString(C(this.hass), { weekday: "short" }) : Math.abs(e.getTime() - Date.now()) < 30 * 6e4 ? "Now" : e.toLocaleTimeString(C(this.hass), { hour: "2-digit" });
  }
  /** "Today 14–19", "Tomorrow 08–13", "Thu – Tue": what the current page covers. */
  pageLabel(t) {
    if (!t.length) return "";
    const e = new Date(t[0].datetime), s = new Date(t[t.length - 1].datetime), i = C(this.hass);
    if (this.view === "daily") return `${e.toLocaleDateString(i, { weekday: "short", day: "numeric" })} – ${s.toLocaleDateString(i, { weekday: "short", day: "numeric" })}`;
    const n = (o) => {
      const l = Math.round((new Date(o.toDateString()).getTime() - new Date((/* @__PURE__ */ new Date()).toDateString()).getTime()) / 864e5);
      return l === 0 ? "Today" : l === 1 ? "Tomorrow" : o.toLocaleDateString(i, { weekday: "short" });
    }, r = (o) => o.toLocaleTimeString(i, { hour: "2-digit" });
    return n(e) === n(s) ? `${n(e)} ${r(e)}–${r(s)}` : `${n(e)} ${r(e)} – ${n(s)} ${r(s)}`;
  }
  render() {
    const t = this.stateOf(this.config.entity);
    if (!t) return h`<ha-card class="glass"><p class="muted">${this.config.entity} is not available.</p></ha-card>`;
    const e = t.attributes, s = t.state, i = e.wind_speed_unit ?? "m/s", n = typeof e.wind_speed == "number" ? `Wind ${Math.round(e.wind_speed)} ${i}${typeof e.wind_bearing == "number" ? ` ${Ji[Math.round(e.wind_bearing / 45) % 8]}` : ""}` : "", r = typeof e.apparent_temperature == "number" ? `Feels like ${Tt(e.apparent_temperature)}` : typeof e.humidity == "number" ? `Humidity ${e.humidity}%` : "", o = this.hass?.formatEntityState?.(t) ?? Zi[s] ?? s, l = s === "clear-night", c = !["sunny", "clear-night"].includes(s), p = ["sunny", "partlycloudy"].includes(s), d = this.daylight(), u = this.config.slots ?? 6, f = this.forecasts[this.view] ?? [], m = Math.max(1, Math.ceil(f.length / u)), b = Math.min(this.page, m - 1), v = f.slice(b * u, b * u + u), $ = !!this.forecasts.hourly && !!this.forecasts.daily, G = this.placeName;
    return h`
      <ha-card class="glass weather" @click=${() => this.moreInfo(this.config.entity)}>
        <canvas aria-hidden="true"></canvas>
        <div class="top">
          <span class="place">${G ? h`${_("mdi:map-marker-outline")}${G}` : g}</span>
          ${$ ? h`<span class="seg" role="group" aria-label="Forecast">
                <button type="button" aria-pressed=${this.view === "hourly"} @click=${(z) => this.setView(z, "hourly")}>Hours</button>
                <button type="button" aria-pressed=${this.view === "daily"} @click=${(z) => this.setView(z, "daily")}>Days</button>
              </span>` : g}
        </div>
        <div class="main">
          <div>
            <div class="temp num">${Tt(e.temperature)}</div>
            <div class="cond">${o}</div>
            <div class="sub">${[r, n].filter(Boolean).join(" · ")}</div>
          </div>
          <div class="art" aria-hidden="true">
            ${p ? h`<div class="sun"></div>` : g} ${l ? h`<div class="moon"></div>` : g}
            ${c ? h`<div class="cloud"></div>` : g}
          </div>
        </div>
        ${v.length ? h`<div class="pager">
                <button class="pg" type="button" aria-label="Earlier" ?disabled=${b === 0} @click=${(z) => this.turn(z, -1)}>${w("left")}</button>
                <span class="range num">${this.pageLabel(v)}</span>
                <button class="pg next" type="button" aria-label="Later" ?disabled=${b >= m - 1} @click=${(z) => this.turn(z, 1)}>${w("left")}</button>
              </div>
              <div class="slots num" style="grid-template-columns:repeat(${u},1fr)">
                ${v.map(
      (z) => h`<div>
                    <span class="h">${this.slotLabel(z)}</span>${_(Qi[z.condition ?? ""] ?? "mdi:weather-cloudy")}<b>${Tt(z.temperature)}</b>
                    ${this.view === "daily" && typeof z.templow == "number" ? h`<small>${Tt(z.templow)}</small>` : g}
                  </div>`
    )}
              </div>` : g}
        ${d ? h`<div class="daylight">
              <div class="bar"><i style="width:${d.progress * 100}%"></i></div>
              <div class="row num">
                <span>Sunrise ${D(d.rise, this.hass)}</span><span>${d.hours} h ${d.minutes} min daylight</span><span>Sunset ${D(d.set, this.hass)}</span>
              </div>
            </div>` : g}
      </ha-card>
    `;
  }
};
ze.styles = [
  T,
  O,
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
    `
];
let ot = ze;
qt([
  y()
], ot.prototype, "forecasts");
qt([
  y()
], ot.prototype, "view");
qt([
  y()
], ot.prototype, "page");
qt([
  Et("canvas")
], ot.prototype, "canvas");
F("hyggehub-weather-card", ot, "HyggeHub Weather", "Current weather with falling snow or rain, a forecast row and daylight.");
var ta = Object.defineProperty, Bs = (a, t, e, s) => {
  for (var i = void 0, n = a.length - 1, r; n >= 0; n--)
    (r = a[n]) && (i = r(t, e, i) || i);
  return i && ta(t, e, i), i;
};
const cs = (a) => `${Math.floor(a / 60)}:${String(Math.floor(a % 60)).padStart(2, "0")}`, De = class De extends P {
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
    const t = this.current, e = this.stateOf(t), s = e?.attributes ?? {}, i = this.speakers, n = (v) => v.name ?? H(this.stateOf(v.entity), v.entity), r = this.dragVolume ?? (typeof s.volume_level == "number" ? s.volume_level : void 0), o = e?.state === "playing", l = o || e?.state === "paused", c = s.entity_picture, p = c ? c.startsWith("http") ? c : this.hass?.hassUrl(c) ?? c : void 0, { pos: d, dur: u } = this.position(), f = l ? s.media_title ?? "Playing" : "Nothing playing", m = l ? [s.media_artist, s.media_album_name].filter(Boolean).join(" · ") : e ? "Pick something on your speaker" : `${t} is not available`, b = i.length === 1 && this.config.name ? this.config.name : n(i.find((v) => v.entity === t));
    return h`
      <ha-card class="glass media ${o ? "" : "paused"}">
        <button class="art" type="button" aria-label="More details" @click=${() => this.moreInfo(t)}>
          ${p ? h`<img src=${p} alt="" />` : h`<i></i>`}
          ${o ? h`<span class="eq" aria-hidden="true"><b></b><b></b><b></b><b></b></span>` : g}
        </button>
        <div class="meta">
          <div class="src">${w("speaker")} ${b}</div>
          <b>${f}</b><span>${m}</span>
        </div>
        ${l && u ? h`<div class="progress num">
              <span>${cs(d)}</span>
              <button class="track" type="button" aria-label="Seek" @click=${this.seek}><i style="width:${d / u * 100}%"></i></button>
              <span>${cs(u)}</span>
            </div>` : g}
        ${e ? h`<div class="controls">
              <button class="round" type="button" aria-label="Previous track" @click=${() => this.call("media_previous_track")}>${Zt("prev")}</button>
              <button class="round play" type="button" aria-label=${o ? "Pause" : "Play"} @click=${() => this.call("media_play_pause")}>
                ${Zt(o ? "pause" : "play")}
              </button>
              <button class="round" type="button" aria-label="Next track" @click=${() => this.call("media_next_track")}>${Zt("next")}</button>
            </div>` : g}
        ${e && r !== void 0 && this.config.volume !== !1 ? h`<label class="vol" style="--v:${r}">
              <span class="vol-fill"></span>
              <span class="vol-label num"><span>Volume</span><span>${Math.round(r * 100)}%</span></span>
              <input
                type="range"
                min="0"
                max="100"
                .value=${String(Math.round(r * 100))}
                aria-label="Volume"
                @input=${(v) => this.onVolume(v, !1)}
                @change=${(v) => this.onVolume(v, !0)}
              />
            </label>` : g}
        ${i.length > 1 ? h`<div class="speakers">
              ${i.map((v) => {
      const $ = this.stateOf(v.entity)?.state;
      return h`<button class="chip" type="button" aria-pressed=${v.entity === t} @click=${() => this.pinned = v.entity}>
                  ${$ === "playing" ? h`<span class="live"></span>` : g}${n(v)}
                </button>`;
    })}
            </div>` : g}
      </ha-card>
    `;
  }
};
De.styles = [
  T,
  O,
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
let _t = De;
Bs([
  y()
], _t.prototype, "pinned");
Bs([
  y()
], _t.prototype, "dragVolume");
F("hyggehub-media-card", _t, "HyggeHub Media", "Now playing, with artwork, a live equaliser and controls.");
function ea(a) {
  const t = String(a?.attributes.unit_of_measurement ?? "kWh").toLowerCase();
  return t === "wh" ? 1e-3 : t === "mwh" ? 1e3 : 1;
}
function sa(a) {
  const t = String(a?.attributes.unit_of_measurement ?? "m³").toLowerCase().replace(/\s/g, "");
  return t === "l" ? 1 : t === "gal" ? 3.785 : t === "ft³" ? 28.317 : 1e3;
}
const Ot = (a) => new Date(a).getTime();
async function Ws(a, t) {
  const e = [t.grid, t.gridExport, t.solar, t.water].filter((b) => !!b);
  if (!e.length) return {};
  const s = /* @__PURE__ */ new Date(), i = await a.callWS({
    type: "recorder/statistics_during_period",
    start_time: new Date(s.getTime() - 48 * 36e5).toISOString(),
    end_time: s.toISOString(),
    statistic_ids: e,
    period: "hour",
    types: ["change"]
  }), n = (b) => b && i?.[b] || [], r = (b) => [...n(b)].reverse().find((v) => (v.change ?? 0) !== 0), o = (b, v) => {
    const $ = n(b).find((G) => Ot(G.start) === Ot(v.start));
    return $ ? ($.change ?? 0) * ea(a.states[b]) : void 0;
  }, l = {}, c = [t.grid, t.gridExport, t.solar].filter((b) => !!b), p = (b) => n(b)[n(b).length - 1], d = Math.min(...c.map((b) => p(b) ? Ot(p(b).start) : 1 / 0)), f = (t.grid ? [...n(t.grid)].reverse().find((b) => (b.change ?? 0) !== 0 && Ot(b.start) <= d) : void 0) ?? r(t.grid) ?? r(t.gridExport) ?? r(t.solar);
  if (f) {
    const b = o(t.grid, f), v = o(t.gridExport, f), $ = o(t.solar, f), G = (!t.grid || b !== void 0) && (!t.gridExport || v !== void 0) && (!t.solar || $ !== void 0);
    l.energy = {
      hour: [new Date(f.start), new Date(f.end)],
      // kWh in one hour is the hour's average kW.
      grid: t.grid || t.gridExport ? (b ?? 0) - (v ?? 0) : void 0,
      solar: t.solar ? $ ?? 0 : void 0,
      home: t.grid && G ? Math.max(0, (b ?? 0) + ($ ?? 0) - (v ?? 0)) : void 0,
      bought: b,
      sold: v
    };
  }
  const m = r(t.water);
  return m && (l.water = { hour: [new Date(m.start), new Date(m.end)], litres: (m.change ?? 0) * sa(a.states[t.water]) }), l;
}
const ht = ([a, t]) => `${String(a.getHours()).padStart(2, "0")}–${String(t.getHours()).padStart(2, "0")}`;
var ia = Object.defineProperty, aa = (a, t, e, s) => {
  for (var i = void 0, n = a.length - 1, r; n >= 0; n--)
    (r = a[n]) && (i = r(t, e, i) || i);
  return i && ia(t, e, i), i;
};
const j = { x: 270, y: 80 }, Lt = (a) => `${Math.abs(a) < 10 ? Math.abs(a).toFixed(1) : Math.round(Math.abs(a))} kW`, Te = class Te extends P {
  static getStubConfig() {
    return { solar: "sensor.solar_power", grid: "sensor.grid_power", battery: "sensor.battery_power", battery_soc: "sensor.battery_level" };
  }
  validateConfig(t) {
    if (!t.grid && !t.grid_meter) throw new Error("Set the `grid` power sensor, or the `grid_meter` energy meter.");
  }
  watchedEntities() {
    const t = this.config;
    return [t.solar, t.grid, t.grid_export, t.battery, t.battery_soc, t.home, t.grid_meter, t.grid_export_meter, t.solar_meter, ...(t.extras ?? []).map((e) => e.entity)];
  }
  connectedCallback() {
    super.connectedCallback(), this.meterTicker = window.setInterval(() => void this.loadMeters(), 5 * 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this.meterTicker);
  }
  updated(t) {
    super.updated(t);
    const e = this.config, s = e.grid ? "" : [e.grid_meter, e.grid_export_meter, e.solar_meter].join(",");
    this.hass && s && s !== this.metersFor && (this.metersFor = s, this.loadMeters());
  }
  async loadMeters() {
    const t = this.config;
    if (!(!this.hass || t.grid || !t.grid_meter))
      try {
        this.meterHour = (await Ws(this.hass, { grid: t.grid_meter, gridExport: t.grid_export_meter, solar: t.solar_meter })).energy;
      } catch (e) {
        console.warn("HyggeHub: could not read the meter statistics", e);
      }
  }
  getCardSize() {
    return 4;
  }
  render() {
    const t = this.config, e = t.grid ? void 0 : this.meterHour, s = !t.grid, i = s && t.solar_meter ? e?.solar ?? 0 : B(this.stateOf(t.solar)) ?? 0, n = s ? e?.grid ?? 0 : (B(this.stateOf(t.grid)) ?? 0) - (B(this.stateOf(t.grid_export)) ?? 0), r = B(this.stateOf(t.battery)) ?? 0, o = B(this.stateOf(t.home)) ?? (s ? e?.home : Math.max(0, i + n + r)), l = o === void 0 ? void 0 : o > 0 ? Math.round(Math.max(0, Math.min(1, 1 - Math.max(n, 0) / o)) * 100) : 100, c = !!t.solar || s && !!t.solar_meter, p = [];
    c && p.push({ key: "solar", label: "Solar", kw: i, y: 0, color: "var(--hh-warm)", reverse: !1 }), t.battery && p.push({ key: "battery", label: "Battery", kw: r, y: 0, color: "var(--hh-ok)", reverse: r < 0 }), p.push({ key: "grid", label: n < 0 ? "Export" : "Grid", kw: n, y: 0, color: "var(--hh-accent)", reverse: n < 0 });
    const d = p.length === 1 ? 0 : 100 / (p.length - 1);
    p.forEach((m, b) => m.y = p.length === 1 ? 80 : 30 + b * d);
    const u = this.stateOf(t.battery_soc)?.state, f = (m) => m === "solar" ? "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" : m === "battery" ? "M8 4h8a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM10 2h4M9 14h6M9 10h6" : "M12 2L7 22M12 2l5 20M7.8 9h8.4M6 15h12M9 15l6-6M15 15L9 9";
    return h`
      <ha-card class="glass">
        <div class="card-h">
          <h3>${t.title ?? "Energy now"}</h3>
          ${s ? h`<span class="pill">${e ? `Meters ${ht(e.hour)}` : "Reading meters…"}${l !== void 0 ? ` · ${l}% own` : ""}</span>` : h`<span class="pill"><span class="dot"></span>Self-sufficient ${l}%</span>`}
        </div>
        <svg viewBox="0 0 320 160" role="img" aria-label=${p.map((m) => `${m.label} ${Lt(m.kw)}`).join(", ") + `${o !== void 0 ? `, home ${Lt(o)}` : ""}`}>
          ${p.map((m) => {
      const b = `M60 ${m.y} C150 ${m.y} 170 ${j.y} ${j.x - 26} ${j.y}`, v = Math.abs(m.kw) > 0.02, $ = Math.max(0.6, 3 - Math.abs(m.kw)).toFixed(2);
      return k`
              <path class="base" d=${b}></path>
              ${v ? k`<path class="flow ${m.reverse ? "rev" : ""}" d=${b} style="stroke:${m.color};animation-duration:${$}s"></path>` : g}
              <circle class="node" cx="40" cy=${m.y} r="20"></circle>
              <svg x="30" y=${m.y - 10} width="20" height="20" viewBox="0 0 24 24" class="glyph" style="stroke:${m.color}"><path d=${f(m.key)}></path></svg>
              <text class="label" x="68" y=${m.y - 8}>${Lt(m.kw)}</text>
              <text class="sub" x="68" y=${m.y + 16}>${m.key === "battery" && u ? `${m.label} ${Math.round(Number(u))}%` : m.label}</text>
            `;
    })}
          <circle class="node" cx=${j.x} cy=${j.y} r="26"></circle>
          <svg x=${j.x - 12} y=${j.y - 12} width="24" height="24" viewBox="0 0 24 24" class="glyph" style="stroke:var(--hh-ink)"><path d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5"></path></svg>
          <text class="label" x=${j.x} y=${j.y + 46} text-anchor="middle">${o === void 0 ? "–" : Lt(o)}</text>
          <text class="sub" x=${j.x} y=${j.y + 60} text-anchor="middle">Home</text>
        </svg>
        ${t.extras?.length ? h`<div class="extras num" style="grid-template-columns:repeat(${Math.min(3, t.extras.length)},1fr)">
              ${t.extras.slice(0, 3).map((m) => h`<button type="button" @click=${() => this.moreInfo(m.entity)}><small>${m.name}</small><b>${this.format(m.entity)}</b></button>`)}
            </div>` : g}
      </ha-card>
    `;
  }
};
Te.styles = [
  T,
  O,
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
let Bt = Te;
aa([
  y()
], Bt.prototype, "meterHour");
F("hyggehub-energy-card", Bt, "HyggeHub Energy", "Live power flowing between solar, battery, grid and the home.");
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const na = $e(class extends ke {
  constructor(a) {
    if (super(a), a.type !== Ns.ATTRIBUTE || a.name !== "class" || a.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(a) {
    return " " + Object.keys(a).filter((t) => a[t]).join(" ") + " ";
  }
  update(a, [t]) {
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), a.strings !== void 0 && (this.nt = new Set(a.strings.join(" ").split(/\s/).filter((s) => s !== "")));
      for (const s in t) t[s] && !this.nt?.has(s) && this.st.add(s);
      return this.render(t);
    }
    const e = a.element.classList;
    for (const s of this.st) s in t || (e.remove(s), this.st.delete(s));
    for (const s in t) {
      const i = !!t[s];
      i === this.st.has(s) || this.nt?.has(s) || (i ? (e.add(s), this.st.add(s)) : (e.remove(s), this.st.delete(s)));
    }
    return Q;
  }
}), hs = [
  { name: "Restaffald", match: "rest|residual|general", color: "#6b777d", icon: "mdi:trash-can-outline" },
  // "Mad" on its own, not inside "madkarton" or "mad- og drikkekartoner" (those go with plastic).
  { name: "Madaffald", match: "madaffald|\\bmad\\b(?![\\s-]*(&|og)\\s*drikke)|food|bio|organ", color: "#5f8f47", icon: "mdi:food-apple-outline" },
  { name: "Papir", match: "papir|paper", color: "#3e72a8", icon: "mdi:newspaper-variant-outline" },
  { name: "Pap", match: "\\bpap\\b|cardboard", color: "#9a7552", icon: "mdi:package-variant-closed" },
  { name: "Plast", match: "plast|mdk|kartoner|plastic", color: "#8a5fb0", icon: "mdi:bottle-soda-classic-outline" },
  { name: "Glas", match: "glas|glass", color: "#3b8d7c", icon: "mdi:bottle-wine-outline" },
  { name: "Metal", match: "metal|dåse|\\bcans?\\b", color: "#7f8a93", icon: "mdi:magnet" },
  { name: "Farligt affald", match: "farlig|hazard", color: "#b4423f", icon: "mdi:skull-crossbones-outline" },
  { name: "Tekstil", match: "tekstil|textile", color: "#c0793a", icon: "mdi:tshirt-crew-outline" },
  { name: "Storskrald", match: "storskrald|bulky", color: "#5a5a5a", icon: "mdi:sofa-outline" },
  { name: "Haveaffald", match: "have|garden|green", color: "#6f9a3b", icon: "mdi:leaf" }
], Pt = ["#4c7f95", "#a0784a", "#7d6aa8", "#5b8f6e"], Rs = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"], Us = 63, he = (a) => new Date(a.getFullYear(), a.getMonth(), a.getDate()), te = (a, t) => new Date(a.getFullYear(), a.getMonth(), a.getDate() + t), ra = (a) => `${a.getFullYear()}-${a.getMonth()}-${a.getDate()}`, it = (a) => Math.round((he(a).getTime() - he(/* @__PURE__ */ new Date()).getTime()) / 864e5), oa = (a, t) => {
  try {
    return new RegExp(a, "i").test(t);
  } catch {
    return t.toLowerCase().includes(a.toLowerCase());
  }
};
function la(a) {
  if (!a.schedule?.length) throw new Error("Set the collection rounds under `schedule`: name, day, every_weeks and first.");
  for (const t of a.schedule) {
    if (!t.name) throw new Error("Every round in `schedule` needs a `name`.");
    if (!Rs.includes(String(t.day).slice(0, 3).toLowerCase())) throw new Error(`"${t.name}": day must be a weekday, like tue.`);
    if (isNaN((/* @__PURE__ */ new Date(`${t.first}T00:00:00`)).getTime())) throw new Error(`"${t.name}": first must be a date, like 2026-10-06.`);
  }
}
function qs(a, t, e = 0) {
  const s = [...a.bins ?? [], ...hs], i = [];
  for (const n of s) {
    if (i.some((o) => o.name === n.name)) continue;
    const r = hs.find((o) => o.name === n.name);
    oa(n.match ?? n.name, t) && i.push({
      name: n.name,
      color: n.color ?? r?.color ?? Pt[i.length % Pt.length],
      icon: n.icon ?? r?.icon ?? "mdi:trash-can-outline"
    });
  }
  return i.length ? i : [{ name: t.trim() || "Collection", color: Pt[e % Pt.length], icon: "mdi:trash-can-outline" }];
}
const ca = (a) => a.split(/\s+(?:og|and|&|\+)\s+|\s*\|\s*/i).filter(Boolean);
function Nt(a) {
  const t = /* @__PURE__ */ new Map(), e = he(/* @__PURE__ */ new Date()), s = new Date(e.getTime() + Us * 864e5);
  return (a.schedule ?? []).forEach((i, n) => {
    const r = Rs.indexOf(String(i.day).slice(0, 3).toLowerCase()), o = qs(a, i.name, n);
    let l = /* @__PURE__ */ new Date(`${i.first}T00:00:00`);
    for (; l.getDay() !== r; ) l = te(l, 1);
    const c = Math.max(1, i.every_weeks ?? 1) * 7;
    for (l < e && (l = te(l, Math.ceil(Math.round((e.getTime() - l.getTime()) / 864e5) / c) * c)); l <= s; l = te(l, c)) {
      const p = ra(l), d = t.get(p) ?? { day: l, bins: [] };
      d.bins.some((u) => u.name === i.name) || d.bins.push({ name: i.name, color: i.color ?? o[0].color, kinds: o }), t.set(p, d);
    }
  }), [...t.values()].sort((i, n) => i.day.getTime() - n.day.getTime());
}
const ha = (a) => k`<svg class="bin" viewBox="0 0 24 24" aria-hidden="true" style="--c:${a}">
  <path class="lid" d="M4.2 5.6h15.6a1 1 0 0 1 1 1v1.6H3.2V6.6a1 1 0 0 1 1-1zM10 5.6V4.4a.6.6 0 0 1 .6-.6h2.8a.6.6 0 0 1 .6.6v1.2"></path>
  <path class="body" d="M5 8.2h14l-1.3 11.6a1.6 1.6 0 0 1-1.6 1.4H7.9a1.6 1.6 0 0 1-1.6-1.4z"></path>
  <path class="shine" d="M8.2 10.5l.7 8"></path>
  <circle class="wheel" cx="8" cy="21.4" r="1.4"></circle><circle class="wheel" cx="16" cy="21.4" r="1.4"></circle>
</svg>`, ds = (a) => {
  const t = a.replace("#", ""), e = t.length === 3 ? t.split("").map((s) => s + s).join("") : t;
  return [0, 2, 4].map((s) => parseInt(e.slice(s, s + 2), 16) || 0);
}, ps = (a, t, e) => {
  const s = ds(a), i = ds(t);
  return "#" + s.map((n, r) => Math.round(n + (i[r] - n) * e).toString(16).padStart(2, "0")).join("");
}, ee = {
  grey: "#8b9399",
  "moonstone-grey": "#9aa3a8",
  white: "#e9ecee",
  "glacier-white": "#e9ecee",
  black: "#2b2e31",
  blue: "#2f5f8f",
  "dark-blue": "#283c5c",
  red: "#a8332e",
  "kings-red": "#a8332e",
  silver: "#b7bdc2",
  green: "#4c6b52"
};
function Ys(a) {
  return a ? ee[a.toLowerCase()] ?? (a.startsWith("#") ? a : ee["moonstone-grey"]) : ee["moonstone-grey"];
}
function da(a, t, e) {
  const s = ps(a, "#ffffff", 0.35), i = ps(a, "#000000", 0.35), n = (o) => `${t}-${o}`, r = (o) => k`
    <circle cx=${o} cy="85" r="19.5" fill="#1d2023"></circle>
    <circle cx=${o} cy="85" r="12.5" fill="url(#${n("rim")})"></circle>
    <g stroke="#2a2e32" stroke-width="2.4" stroke-linecap="round">
      <path d="M${o} 75.5v19M${o - 9} 82l18 6M${o - 5.6} 92.7l11.2-15.4"></path>
    </g>
    <circle cx=${o} cy="85" r="2.8" fill="#5b636a"></circle>`;
  return k`<svg class="car" viewBox="0 0 248 110" aria-hidden="true">
    <defs>
      <linearGradient id=${n("body")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${s}></stop>
        <stop offset=".45" stop-color=${a}></stop>
        <stop offset="1" stop-color=${i}></stop>
      </linearGradient>
      <linearGradient id=${n("glass")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3b4a55"></stop>
        <stop offset="1" stop-color="#151b20"></stop>
      </linearGradient>
      <radialGradient id=${n("rim")} cx="40%" cy="35%" r="70%">
        <stop offset="0" stop-color="#d9dee2"></stop>
        <stop offset="1" stop-color="#7c858c"></stop>
      </radialGradient>
      <radialGradient id=${n("shadow")} cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#000" stop-opacity=".35"></stop>
        <stop offset="1" stop-color="#000" stop-opacity="0"></stop>
      </radialGradient>
    </defs>
    <ellipse cx="126" cy="104" rx="114" ry="6" fill="url(#${n("shadow")})"></ellipse>
    <path
      d="M14 70C14 60 20 53 32 51L64 46C80 32 100 23 126 22L156 22C176 22 192 30 206 42L220 47C230 50 236 57 236 66L236 78C236 82 233 85 229 85L212 85A23 23 0 0 0 166 85L88 85A23 23 0 0 0 42 85L20 85C16 85 14 82 14 78Z"
      fill="url(#${n("body")})"
    ></path>
    <path d="M18 80.5H40M90 80.5H164M214 80.5H233" stroke="#24282c" stroke-width="7" stroke-linecap="round" opacity=".55"></path>
    <path d="M28 58L222 53" stroke="#fff" stroke-opacity=".28" stroke-width="2" stroke-linecap="round" fill="none"></path>
    <path d="M72 46C88 34 104 27 126 26.5L138 26.5L138 46Z" fill="url(#${n("glass")})"></path>
    <path d="M142 26.5L156 26.5C172 26.5 186 33 198 43L142 46Z" fill="url(#${n("glass")})"></path>
    <path d="M80 41C93 33 106 29.5 122 29" stroke="#fff" stroke-opacity=".25" stroke-width="1.6" stroke-linecap="round" fill="none"></path>
    <rect x="219" y="54" width="16" height="3.2" rx="1.6" fill="#e9f4ff" opacity=".9"></rect>
    <rect x="15" y="56" width="10" height="3.2" rx="1.6" fill="#d23b33" opacity=".85"></rect>
    <path d="M104 63h13M162 62h13" stroke=${i} stroke-width="2" stroke-linecap="round"></path>
    ${r(65)} ${r(189)}
    ${e ? k`<circle cx="38" cy="60" r="4" fill="#7ee0b5"></circle>` : g}
  </svg>`;
}
var pa = Object.defineProperty, Gs = (a, t, e, s) => {
  for (var i = void 0, n = a.length - 1, r; n >= 0; n--)
    (r = a[n]) && (i = r(t, e, i) || i);
  return i && pa(t, e, i), i;
};
const et = {
  grid: "M12 2L7 22M12 2l5 20M7.8 9h8.4M6 15h12",
  solar: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  car: "M5 16V12l2-5h10l2 5v4M5 16h14M3 12h18M7.5 16v2M16.5 16v2M7 13.5h1M16 13.5h1",
  home: "M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5",
  bins: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  water: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"
}, de = "#5ec2f0", ga = { grid: "#4aa8ff", solar: "#ffb13d", car: "#4fdc8c", water: de }, U = (a) => {
  const t = Math.abs(a) * 1e3;
  return t < 1e3 ? `${Math.round(t)} W` : `${(t / 1e3).toFixed(t < 1e4 ? 1 : 0)} kW`;
};
function ua(a) {
  const t = N(a);
  if (t === void 0) return;
  const e = String(a.attributes.unit_of_measurement ?? "L/min").toLowerCase().replace(/\s/g, "");
  return e === "l/h" ? t / 60 : e === "m³/h" || e === "m3/h" ? t * 1e3 / 60 : e === "gal/min" ? t * 3.785 : t;
}
function gs(a) {
  const t = { clouds: 0.25, gloom: 0, rain: 0, snow: 0, fog: 0, lightning: !1, wind: 3 };
  if (!a) return t;
  const e = a.state;
  Object.assign(t, {
    sunny: { clouds: 0.15 },
    "clear-night": { clouds: 0.1 },
    partlycloudy: { clouds: 0.5 },
    cloudy: { clouds: 0.9, gloom: 0.35 },
    fog: { clouds: 0.6, gloom: 0.3, fog: 1 },
    rainy: { clouds: 1, gloom: 0.55, rain: 0.55 },
    pouring: { clouds: 1, gloom: 0.75, rain: 1 },
    lightning: { clouds: 1, gloom: 0.85, lightning: !0 },
    "lightning-rainy": { clouds: 1, gloom: 0.85, rain: 0.8, lightning: !0 },
    snowy: { clouds: 0.85, gloom: 0.3, snow: 0.8 },
    "snowy-rainy": { clouds: 1, gloom: 0.5, snow: 0.45, rain: 0.35 },
    hail: { clouds: 1, gloom: 0.6, rain: 0.5, snow: 0.35 },
    windy: { clouds: 0.45 },
    "windy-variant": { clouds: 0.7, gloom: 0.2 },
    exceptional: { clouds: 0.8, gloom: 0.6 }
  }[e] ?? {});
  const i = Number(a.attributes.wind_speed);
  if (isFinite(i)) {
    const r = String(a.attributes.wind_speed_unit ?? "km/h").toLowerCase();
    t.wind = r === "m/s" ? i : r === "mph" ? i * 0.447 : r === "kn" ? i * 0.514 : i / 3.6;
  }
  (e === "windy" || e === "windy-variant") && (t.wind = Math.max(t.wind, 12)), t.windBearing = ba(a.attributes.wind_bearing);
  const n = Number(a.attributes.temperature);
  return isFinite(n) && (t.temperature = n), t;
}
const ma = {
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
}, fa = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
function ba(a) {
  if (a == null || a === "") return;
  const t = Number(a);
  if (isFinite(t)) return t;
  const e = fa.indexOf(String(a).toUpperCase());
  return e >= 0 ? e * 22.5 : void 0;
}
const se = (a) => !!a && ["on", "true", "charging", "plugged", "connected", "yes"].includes(a.state.toLowerCase()), Oe = class Oe extends P {
  constructor() {
    super(...arguments), this.failed = !1, this.visible = !0, this.onEngine = () => this.pushState(), this.compact = !1;
  }
  static getStubConfig() {
    return { solar: "sensor.solar_power", grid: "sensor.grid_power" };
  }
  validateConfig(t) {
    if (!t.grid && !t.grid_meter) throw new Error("Set the `grid` power sensor, or the `grid_meter` energy meter.");
  }
  watchedEntities() {
    const t = this.config, e = t.car ?? {};
    return [t.solar, t.grid, t.grid_export, t.home, t.water, t.grid_meter, t.grid_export_meter, t.solar_meter, t.water_meter, this.weatherId(), this.sunId(), e.battery, e.charging, e.charging_power, e.plugged, t.driveway_lights, ...(t.extras ?? []).map((s) => s.entity)];
  }
  getCardSize() {
    return 7;
  }
  connectedCallback() {
    super.connectedCallback(), clearTimeout(this.disposeTimer), x.addEventListener("change", this.onEngine), this.island && this.resume(), this.ticker = window.setInterval(() => this.requestUpdate(), 60 * 6e4), this.meterTicker = window.setInterval(() => void this.loadMeters(), 5 * 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), x.removeEventListener("change", this.onEngine), clearInterval(this.ticker), clearInterval(this.meterTicker), this.island?.stop(), this.disposeTimer = window.setTimeout(() => {
      this.resizer?.disconnect(), this.seen?.disconnect(), this.island?.dispose(), this.island = void 0, this.loading = void 0;
    }, 3e4);
  }
  // Both default to what a standard Home Assistant install already has, worked out from the home's
  // location: sun.sun, and the weather entity onboarding creates (Met.no's weather.forecast_home).
  sunId() {
    const t = this.config;
    if (t.lighting !== "theme")
      return t.sun ?? (this.hass?.states["sun.sun"] ? "sun.sun" : void 0);
  }
  weatherId() {
    const t = this.config;
    if (t.weather) return t.weather;
    const e = Object.keys(this.hass?.states ?? {}).filter((s) => s.startsWith("weather."));
    return e.includes("weather.forecast_home") ? "weather.forecast_home" : e.sort()[0];
  }
  // ---------- reading the entities ----------
  /**
   * Live sensors first. Without a live grid sensor the electricity comes from the meters, all from the
   * same hour, so grid, solar and home use agree with each other.
   */
  readings() {
    const t = this.config, e = !!t.grid, s = e ? void 0 : this.meters?.energy, i = e || !t.solar_meter ? B(this.stateOf(t.solar)) ?? 0 : s?.solar ?? 0, n = e ? (B(this.stateOf(t.grid)) ?? 0) - (B(this.stateOf(t.grid_export)) ?? 0) : s?.grid ?? 0, r = B(this.stateOf(t.home)) ?? (e ? Math.max(0, i + n) : s?.home), o = t.water ? void 0 : this.meters?.water, l = t.water ? ua(this.stateOf(t.water)) : o ? o.litres / 60 : void 0;
    return { solar: i, grid: n, home: r, water: l, car: this.carReading(), energyHour: s?.hour, waterHour: o?.hour, metered: !e };
  }
  /** Reads the meters (the newest hour of readings) when the live sensors are missing. */
  async loadMeters() {
    const t = this.config;
    if (!(!this.hass || !this.meterKey()))
      try {
        this.meters = await Ws(this.hass, {
          grid: t.grid ? void 0 : t.grid_meter,
          gridExport: t.grid ? void 0 : t.grid_export_meter,
          solar: t.grid ? void 0 : t.solar_meter,
          water: t.water ? void 0 : t.water_meter
        });
      } catch (e) {
        console.warn("HyggeHub: could not read the meter statistics", e);
      }
  }
  meterKey() {
    const t = this.config;
    return [!t.grid && t.grid_meter, !t.grid && t.grid_export_meter, !t.grid && t.solar_meter, !t.water && t.water_meter].filter(Boolean).join(",");
  }
  carReading() {
    const t = this.config.car;
    if (!t) return null;
    const e = B(this.stateOf(t.charging_power)), s = t.charging ? se(this.stateOf(t.charging)) : (e ?? 0) > 0.05, i = s || se(this.stateOf(t.plugged));
    return { soc: N(this.stateOf(t.battery)), kw: s ? e : void 0, charging: s, plugged: i };
  }
  labels() {
    const t = this.config, e = this.readings(), s = e.grid < -0.02 ? "Exporting" : "Grid", i = (c) => e.metered && !e.energyHour ? "–" : U(c), n = (c) => e.metered && e.energyHour ? `${c} ${ht(e.energyHour)}` : c, r = e.metered && !!t.solar_meter, o = [{ key: "grid", value: i(e.grid), caption: n(s), entity: t.grid ?? t.grid_meter, icon: et.grid, color: "var(--hh-accent)" }];
    if ((t.solar || r) && o.push({
      key: "solar",
      value: r ? i(e.solar) : U(e.solar),
      caption: r ? n("Solar") : "Solar",
      entity: r ? t.solar_meter : t.solar,
      icon: et.solar,
      color: "var(--hh-warm)"
    }), e.home !== void 0 && o.push({ key: "home", value: U(e.home), caption: n("Load"), entity: t.home, icon: et.home, color: "var(--hh-ink)" }), e.car) {
      const c = t.car?.name ?? "Car";
      o.push({
        key: "car",
        value: e.car.soc !== void 0 ? `${Math.round(e.car.soc)}%` : c,
        caption: e.car.charging ? e.car.kw ? `Charging ${U(e.car.kw)}` : "Charging" : e.car.plugged ? "Plugged in" : e.car.soc !== void 0 ? c : "Parked",
        entity: t.car?.battery ?? t.car?.charging,
        icon: et.car,
        color: e.car.charging ? "var(--hh-ok)" : "var(--hh-ink-2)"
      });
    }
    const l = this.nextPickup();
    return l && o.push({
      key: "bins",
      value: l.when,
      caption: l.caption,
      icon: et.bins,
      color: l.kinds[0]?.color ?? "var(--hh-ink-2)",
      kinds: l.kinds
    }), t.water && e.water !== void 0 ? o.push({ key: "water", value: `${e.water < 10 ? e.water.toFixed(1) : Math.round(e.water)} L/min`, caption: "Water", entity: t.water, icon: et.water, color: de }) : !t.water && t.water_meter && o.push({
      key: "water",
      value: e.waterHour && e.water !== void 0 ? `${Math.round(e.water * 60)} L` : "–",
      caption: e.waterHour ? `Water ${ht(e.waterHour)}` : "Water",
      entity: t.water_meter,
      icon: et.water,
      color: de
    }), o;
  }
  sceneState() {
    const t = this.config, e = this.readings(), s = getComputedStyle(this), i = (p, d) => s.getPropertyValue(p).trim() || d, n = (p) => Math.abs(p) > 0.02 ? Math.sign(p) * (1.2 + Math.min(Math.abs(p), 8) * 0.7) : 0, r = {
      grid: n(e.grid),
      solar: t.solar || e.metered && t.solar_meter ? n(Math.max(0, e.solar)) : null,
      // The car's route runs car → house; charging runs it backwards, out to the car.
      car: e.car?.plugged ? e.car.charging ? -n(Math.max(e.car.kw ?? 3.7, 0.1)) : 0 : null,
      water: t.water || t.water_meter ? e.water && e.water > 0.05 ? 0.7 + Math.min(e.water, 20) * 0.08 : 0 : null
    };
    let o = x.resolved?.slot === "night" ? 1 : 0, l;
    const c = this.stateOf(this.sunId());
    if (c) {
      const p = Number(c.attributes.elevation), d = Number(c.attributes.azimuth);
      isFinite(p) ? (o = Math.min(1, Math.max(0, (6 - p) / 12)), isFinite(d) && (l = { elevation: p, azimuth: d })) : o = c.state === "below_horizon" ? 1 : 0;
    }
    return {
      flows: r,
      // The flows keep their own bright colours: they glow, and a dark theme accent would not.
      colors: ga,
      night: o,
      sun: l,
      facing: t.facing ?? 180,
      weather: gs(this.stateOf(this.weatherId())),
      car: e.car ? {
        color: Ys(t.car?.color),
        plugged: e.car.plugged,
        charging: e.car.charging,
        ledColor: e.car.charging ? i("--hh-ok", "#4caf50") : e.car.plugged ? i("--hh-accent", "#2f6e86") : "#8a949b"
      } : null,
      hidden: t.solar || t.solar_meter ? [] : ["solar"],
      bins: this.binRounds(),
      driveLights: t.driveway_lights ? se(this.stateOf(t.driveway_lights)) ? 1 : 0 : o > 0.5 ? 1 : 0,
      motion: x.motionOn,
      fogColor: i("--hh-bg", "#dce3e5")
    };
  }
  // ---------- the scene ----------
  firstUpdated() {
    this.init();
  }
  updated(t) {
    super.updated(t), this.fallback && (this.fallback.hass = this.hass);
    const e = this.meterKey();
    this.hass && e && e !== this.metersFor && (this.metersFor = e, this.loadMeters()), this.pushState();
  }
  /** The next collection: when, what, and whether the bins should be out. */
  nextPickup() {
    if (!this.config.bins?.schedule?.length) return;
    const t = Nt(this.config.bins)[0];
    if (!t) return;
    const e = it(t.day), s = e === 0 ? "Today" : e === 1 ? "Tomorrow" : e < 7 ? t.day.toLocaleDateString(C(this.hass), { weekday: "long" }) : `In ${e} days`, i = t.bins.flatMap((n) => n.kinds).filter((n, r, o) => o.findIndex((l) => l.name === n.name) === r);
    return {
      when: s,
      caption: e === 1 ? "Put out tonight" : e === 0 ? "Collection day" : e < 7 ? `In ${e} days` : t.day.toLocaleDateString(C(this.hass), { day: "numeric", month: "short" }),
      kinds: i
    };
  }
  /** Each round's bin for the model, in schedule order: its two compartments' colours, and whether it is out. */
  binRounds() {
    const t = this.config.bins;
    if (!t?.schedule?.length) return null;
    const e = Nt(t);
    return t.schedule.map((s) => {
      const i = e.find((c) => c.bins.some((p) => p.name === s.name)), n = i?.bins.find((c) => c.name === s.name), r = ca(s.name), o = r.length > 1 ? r.map((c) => qs(t, c)[0].color) : n?.kinds.map((c) => c.color) ?? ["#6b777d"], l = i ? it(i.day) : -1;
      return {
        colors: [o[0], o[1] ?? o[0]],
        // Out at the kerb on collection day, all day.
        out: l === 0
      };
    });
  }
  /** Temperature and wind from the weather entity, with an arrow pointing where the wind blows. */
  weatherChip() {
    const t = this.stateOf(this.weatherId());
    if (!t) return g;
    const e = Number(t.attributes.temperature), s = gs(t), i = String(t.attributes.temperature_unit ?? "°");
    return h`<button type="button" class="weather" @click=${() => this.moreInfo(t.entity_id)}>
      ${_(ma[t.state] ?? "mdi:weather-partly-cloudy")}
      ${isFinite(e) ? h`<b class="num">${Math.round(e)}${i.startsWith("°") ? "°" : ` ${i}`}</b>` : g}
      <span class="num">${Math.round(s.wind)} m/s</span>
      ${s.windBearing !== void 0 ? h`<svg class="i wind" viewBox="0 0 24 24" style="transform:rotate(${s.windBearing + 180}deg)" aria-label="from ${Math.round(s.windBearing)}°"><path d="M12 19V5M6 11l6-6 6 6"></path></svg>` : g}
    </button>`;
  }
  pushState() {
    this.island && this.config && this.island.setState(this.sceneState());
  }
  init() {
    return this.loading ??= (async () => {
      const t = this.renderRoot.querySelector("canvas");
      if (!t) return;
      try {
        const { IslandScene: s, DEFAULT_MODEL: i } = await import("./scene-Bei3n7cF.js"), n = new s(t, (r) => this.placeLabels(r), Math.min(window.devicePixelRatio || 1, 2));
        await n.load(this.config.model ?? i), this.island = n;
      } catch (s) {
        console.warn("HyggeHub: 3D energy card unavailable, showing the flat one", s), this.useFallback();
        return;
      }
      const e = t.parentElement;
      this.resizer = new ResizeObserver(() => {
        this.compact = e.clientWidth < 440, e.classList.toggle("compact", this.compact), this.island?.resize(e.clientWidth, e.clientHeight);
      }), this.resizer.observe(e), this.island.resize(e.clientWidth, e.clientHeight), this.seen = new IntersectionObserver((s) => {
        this.visible = s.some((i) => i.isIntersecting), this.resume();
      }), this.seen.observe(this), this.pushState(), this.resume(), e.classList.add("ready");
    })();
  }
  resume() {
    if (!this.island) {
      this.isConnected && !this.failed && this.init();
      return;
    }
    this.visible && this.isConnected && x.motionOn ? this.island.start() : (this.island.stop(), this.island.renderOnce());
  }
  useFallback() {
    this.failed = !0;
    const t = document.createElement("hyggehub-energy-card");
    t.setConfig({ ...this.config, type: "custom:hyggehub-energy-card" }), t.hass = this.hass, this.fallback = t, this.requestUpdate();
  }
  // ---------- details ----------
  openDetail(t) {
    this.detail = t, this.island?.focus(t, this.compact ? "bottom" : "right");
  }
  closeDetail() {
    this.detail = void 0, this.island?.focus(null);
  }
  detailPanel(t) {
    const e = this.labels().find((n) => n.key === t), s = this.detailBody(t);
    if (!e) return g;
    const i = { grid: "Grid", solar: "Solar", car: this.config.car?.name ?? "Car", home: "Home", water: "Water", bins: "Bins" };
    return h`<div class="panel" role="dialog" aria-label=${i[t]} @keydown=${(n) => n.key === "Escape" && this.closeDetail()}>
      <div class="panel-h">
        <button type="button" class="back" @click=${() => this.closeDetail()}>
          <svg viewBox="0 0 24 24" class="i"><path d="M15 6l-6 6 6 6"></path></svg>Back
        </button>
        <span class="ic" style="color:${e.color}"><svg viewBox="0 0 24 24" class="i"><path d=${e.icon}></path></svg></span>
        <h4>${i[t]}</h4>
      </div>
      <div class="panel-b">${s}</div>
    </div>`;
  }
  detailBody(t) {
    const e = this.config, s = this.readings(), i = e.grid ? void 0 : this.meters?.energy, n = (d) => d === void 0 ? "–" : `${d.toFixed(d < 10 ? 2 : 1)} kWh`, r = (d, u) => h`<div class="row"><span>${d}</span><b class="num">${u}</b></div>`, o = s.metered && s.energyHour ? `Hour ${ht(s.energyHour)}` : "Now", l = s.home !== void 0 && s.home > 0 ? Math.round(Math.max(0, Math.min(1, 1 - Math.max(s.grid, 0) / s.home)) * 100) : void 0, c = (d) => d ? h`<button type="button" class="more" @click=${() => this.moreInfo(d)}>History and settings</button>` : g, p = s.metered ? h`<p class="note">From the meters, which report a few hours late: the newest hour with readings, as an average.</p>` : g;
    switch (t) {
      case "grid":
        return h`${r(o, `${U(s.grid)} ${s.grid < -0.02 ? "out" : "in"}`)}
          ${i ? h`${r("Bought", n(i.bought))}${e.grid_export_meter ? r("Sold", n(i.sold)) : g}` : g}
          ${p}${c(e.grid ?? e.grid_meter)}`;
      case "solar":
        return h`${r(o, U(s.solar))}
          ${i?.solar !== void 0 ? r("Produced", n(i.solar)) : g}
          ${l !== void 0 ? r("Own power used", `${l}%`) : g}
          ${p}${c(e.solar ?? e.solar_meter)}`;
      case "home":
        return h`${r(o, U(s.home ?? 0))}
          ${l !== void 0 ? r("Self-sufficient", `${l}%`) : g}
          ${r("From the grid", U(Math.max(0, s.grid)))}
          ${e.solar || e.solar_meter ? r("From solar", U(Math.max(0, Math.min(s.solar, s.home ?? 0)))) : g}
          ${p}${c(e.home)}`;
      case "water":
        return h`${s.metered || !e.water ? r(s.waterHour ? `Hour ${ht(s.waterHour)}` : "Last hour", s.water !== void 0 ? `${Math.round(s.water * 60)} L` : "–") : r("Now", s.water !== void 0 ? `${s.water.toFixed(1)} L/min` : "–")}
          ${c(e.water ?? e.water_meter)}`;
      case "car": {
        const d = s.car, u = e.car ?? {};
        return !d || d.soc === void 0 && !u.charging && !u.plugged ? h`<p class="note">Parked. Add <code>battery</code>, <code>charging</code>, <code>charging_power</code> and <code>plugged</code> under <code>car:</code> to see the battery and charging here.</p>` : h`${d.soc !== void 0 ? r("Battery", `${Math.round(d.soc)}%`) : g}
          ${r("Status", d.charging ? "Charging" : d.plugged ? "Plugged in" : "Not plugged in")}
          ${d.charging && d.kw ? r("Charging at", U(d.kw)) : g}
          ${c(u.battery ?? u.charging)}`;
      }
      case "bins": {
        const d = e.bins?.schedule?.length ? Nt(e.bins).slice(0, 6) : [], u = (f) => {
          const m = it(f);
          return m === 0 ? "Today" : m === 1 ? "Tomorrow" : f.toLocaleDateString(C(this.hass), { weekday: "long", day: "numeric", month: "short" });
        };
        return h`<ul class="pickups">
          ${d.map(
          (f) => h`<li>
              <div class="when"><b>${u(f.day)}</b><small class="num">${it(f.day) > 1 ? `in ${it(f.day)} days` : ""}</small></div>
              ${f.bins.map(
            (m) => h`<div class="bin">
                  <span class="kinds">${m.kinds.map((b) => h`<span class="kind" style="--c:${b.color}" title=${b.name}>${_(b.icon)}</span>`)}</span>
                  <span>${m.name}</span>
                </div>`
          )}
            </li>`
        )}
        </ul>`;
      }
    }
  }
  placeLabels(t) {
    for (const e of t) {
      const s = this.renderRoot.querySelector(`.tag[data-key="${e.key}"]`);
      s && (s.style.transform = `translate(${e.x}px, ${e.y}px) translate(-50%, -50%)`, s.classList.toggle("off", !e.visible));
    }
  }
  // ---------- render ----------
  render() {
    if (this.fallback) return h`${this.fallback}`;
    const t = this.config, e = this.readings(), s = e.home === void 0 ? void 0 : e.home > 0 ? Math.round(Math.max(0, Math.min(1, 1 - Math.max(e.grid, 0) / e.home)) * 100) : 100, i = this.labels();
    return h`
      <ha-card class="glass">
        <div class=${na({ stage: !0, focused: !!this.detail })} style="height:${t.height ?? 340}px">
          <canvas role="img" aria-label=${i.map((n) => `${n.caption} ${n.value}`).join(", ")}></canvas>
          <div class="loading" aria-hidden="true"></div>
          ${i.map(
      (n) => h`<button type="button" class="tag" data-key=${n.key} @click=${() => this.openDetail(n.key)} aria-haspopup="dialog">
              <span class="ic" style="color:${n.color}"><svg viewBox="0 0 24 24" class="i"><path d=${n.icon}></path></svg></span>
              <span class="txt"><b class="num">${n.value}</b><small>${n.caption}</small></span>
              ${n.kinds?.length ? h`<span class="kinds">${n.kinds.map((r) => h`<span class="kind" style="--c:${r.color}" title=${r.name}>${_(r.icon)}</span>`)}</span>` : g}
            </button>`
    )}
          ${this.detail ? this.detailPanel(this.detail) : g}
        </div>
        <div class="card-h overlay">
          <div class="title">
            <h3>${t.title ?? "Energy"}</h3>
            ${this.weatherChip()}
          </div>
          ${e.metered ? h`<span class="pill">${s !== void 0 ? h`<span class="dot"></span>${s}% own · ` : g}${e.energyHour ? ht(e.energyHour) : "Reading meters…"}</span>` : s !== void 0 ? h`<span class="pill"><span class="dot"></span>Self-sufficient ${s}%</span>` : g}
        </div>
        ${t.extras?.length ? h`<div class="extras num" style="grid-template-columns:repeat(${Math.min(3, t.extras.length)},1fr)">
              ${t.extras.slice(0, 3).map((n) => h`<button type="button" @click=${() => this.moreInfo(n.entity)}><small>${n.name}</small><b>${this.format(n.entity)}</b></button>`)}
            </div>` : g}
      </ha-card>
    `;
  }
};
Oe.styles = [
  T,
  O,
  E`
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
      .overlay .pill,
      .overlay .weather {
        pointer-events: auto;
      }
      .overlay {
        align-items: flex-start;
      }
      .title {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
      }
      .weather {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        align-self: flex-start;
        padding: 4px 10px 4px 8px;
        border-radius: 999px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        font-size: 12px;
        color: var(--hh-ink-2);
        --mdc-icon-size: 16px;
      }
      .weather b {
        font-weight: 600;
        color: var(--hh-ink);
      }
      .weather svg.wind {
        width: 14px;
        height: 14px;
        transition: transform 0.6s var(--ease);
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
      /* While details are open the labels step aside; the scene zooms in beside the panel. */
      .focused .tag {
        opacity: 0 !important;
        pointer-events: none;
      }
      .panel {
        position: absolute;
        top: 60px;
        right: 12px;
        bottom: 12px;
        width: min(48%, 320px);
        display: flex;
        flex-direction: column;
        border-radius: 20px;
        background: color-mix(in srgb, var(--hh-glass-strong) 82%, transparent);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
        backdrop-filter: blur(18px) saturate(160%);
        border: 1px solid var(--hh-stroke);
        box-shadow: var(--hh-shadow);
        overflow: hidden;
        animation: panel-in 0.4s var(--ease) both;
        z-index: 2;
      }
      .compact .panel {
        top: auto;
        left: 10px;
        right: 10px;
        bottom: 10px;
        width: auto;
        height: 56%;
        animation-name: panel-up;
      }
      @keyframes panel-in {
        from {
          opacity: 0;
          transform: translateX(16px);
        }
      }
      @keyframes panel-up {
        from {
          opacity: 0;
          transform: translateY(16px);
        }
      }
      .panel-h {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px 8px 8px;
        border-bottom: 1px solid var(--hh-line);
      }
      .panel-h h4 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
      }
      .back {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        padding: 5px 10px 5px 4px;
        border-radius: 999px;
        font-size: 12.5px;
        font-weight: 600;
        color: var(--hh-accent);
      }
      .back:hover {
        background: var(--hh-accent-soft);
      }
      .back svg.i {
        width: 16px;
        height: 16px;
      }
      .panel-b {
        padding: 6px 14px 14px;
        overflow-y: auto;
        font-size: 13px;
      }
      .row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 10px;
        padding: 7px 0;
        border-bottom: 1px solid var(--hh-line);
      }
      .row span {
        color: var(--hh-ink-2);
      }
      .row b {
        font-weight: 600;
      }
      .note {
        margin: 10px 0 0;
        font-size: 12px;
        color: var(--hh-ink-3);
        line-height: 1.4;
      }
      .note code {
        font-size: 11px;
      }
      .more {
        margin-top: 12px;
        font-size: 12.5px;
        font-weight: 600;
        color: var(--hh-accent);
        padding: 6px 0;
      }
      .pickups {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .pickups li {
        padding: 9px 0;
        border-bottom: 1px solid var(--hh-line);
        display: grid;
        gap: 6px;
      }
      .pickups .when {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }
      .pickups .when b {
        font-weight: 600;
      }
      .pickups .when small {
        font-size: 11.5px;
        color: var(--hh-ink-3);
      }
      .pickups .bin {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12.5px;
        color: var(--hh-ink-2);
      }
      .pickups .kinds {
        margin: 0;
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
    `
];
let Mt = Oe;
Gs([
  y()
], Mt.prototype, "meters");
Gs([
  y()
], Mt.prototype, "detail");
F("hyggehub-energy-3d-card", Mt, "HyggeHub Energy 3D", "A floating island home with live power and water flows, weather and day/night light.");
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const va = $e(class extends ke {
  constructor() {
    super(...arguments), this.key = g;
  }
  render(a, t) {
    return this.key = a, t;
  }
  update(a, [t, e]) {
    return t !== this.key && (Hs(a), this.key = t), e;
  }
}), ya = 5 * 6e4, ie = /* @__PURE__ */ new Map(), us = (a) => a.length === 10 ? { d: /* @__PURE__ */ new Date(`${a}T00:00:00`), allDay: !0 } : { d: new Date(a), allDay: !1 };
function xa(a, t, e = !1, s = 7) {
  const i = `${[...t].sort().join(",")}|${s}`, n = ie.get(i);
  if (n && Date.now() - n.at < (e ? 3e4 : ya)) return n.events;
  const r = /* @__PURE__ */ new Date();
  r.setHours(0, 0, 0, 0);
  const o = new Date(r.getTime() + s * 864e5), l = a.callWS({
    type: "call_service",
    domain: "calendar",
    service: "get_events",
    target: { entity_id: t },
    service_data: { start_date_time: r.toISOString(), end_date_time: o.toISOString() },
    return_response: !0
  }).then(
    (c) => Object.values(c?.response ?? {}).flatMap((p) => p.events ?? []).map((p) => {
      const d = us(p.start);
      return { summary: p.summary ?? "", start: d.d, end: us(p.end).d, allDay: d.allDay, location: p.location || void 0, description: p.description || void 0 };
    }).sort((p, d) => p.start.getTime() - d.start.getTime())
  ).catch((c) => (console.warn("HyggeHub: could not read calendars", t, c), ie.delete(i), []));
  return ie.set(i, { at: Date.now(), events: l }), l;
}
function wa(a, t) {
  if (!t) return a;
  const e = t.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return a.filter((s) => {
    const i = `${s.summary} ${s.description ?? ""}`.toLowerCase();
    return e.some((n) => i.includes(n));
  });
}
function pe(a, t = /* @__PURE__ */ new Date()) {
  const e = t.getTime(), s = a.filter((n) => n.start.getTime() <= e && n.end.getTime() > e);
  s.sort((n, r) => Number(n.allDay) - Number(r.allDay));
  const i = a.filter((n) => n.start.getTime() > e);
  return { now: s[0], upcoming: i };
}
const Vs = (a) => a?.split(/,|\n/)[0].trim(), ms = {
  brown: "#6b4528",
  "dark-brown": "#3f2a1c",
  "light-brown": "#8f6542",
  blonde: "#d9b26a",
  black: "#231c19",
  red: "#a2502a",
  auburn: "#7e3b22",
  grey: "#a9a6a1"
}, fs = {
  blue: ["#a9d2f2", "#3a6ca6"],
  brown: ["#a7733f", "#4f2f15"],
  hazel: ["#9a6831", "#5f7d3c"],
  "green-brown": ["#9a6831", "#5f7d3c"],
  green: ["#a4d08e", "#3d7744"],
  grey: ["#c7cfd5", "#66747f"]
}, bs = { light: "#f6d6bd", fair: "#efc4a2", medium: "#d9a07a", tan: "#b97a52", deep: "#7d4f35" }, $a = { woman: "#7fa38f", man: "#40607a", child: "#e0a94a", baby: "#c8d9ea" }, vs = (a) => {
  const t = a.replace("#", ""), e = t.length === 3 ? t.split("").map((s) => s + s).join("") : t;
  return [0, 2, 4].map((s) => parseInt(e.slice(s, s + 2), 16) || 0);
}, Ks = (a, t, e) => {
  const s = vs(a), i = vs(t);
  return "#" + s.map((n, r) => Math.round(n + (i[r] - n) * e).toString(16).padStart(2, "0")).join("");
}, st = (a, t) => Ks(a, "#ffffff", t), A = (a, t) => Ks(a, "#000000", t), ys = (a, t, e) => a ? t[a.toLowerCase()] ?? (a.startsWith("#") ? a : e) : e, xs = {
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
function ka(a = {}, t, e = !1) {
  const s = a.preset && a.preset in xs ? a.preset : "man", i = xs[s], n = ys(a.skin, bs, bs.fair), r = ys(a.hair, ms, ms.brown), o = a.shirt?.startsWith("#") ? a.shirt : $a[s], l = a.eyes?.toLowerCase() ?? "brown", c = fs[l] ?? (a.eyes?.startsWith("#") ? [st(a.eyes, 0.45), A(a.eyes, 0.3)] : fs.brown), p = A(n, 0.55), d = i.head, u = (M) => `${t}-${M}`, f = (M) => {
    const S = i.eyeY, [R, V] = i.sclera, K = i.iris;
    if (e) return k`<path d="M${M - R} ${S} Q${M} ${S + V * 0.7} ${M + R} ${S}" fill="none" stroke=${p} stroke-width="2.4" stroke-linecap="round"></path>`;
    const Gt = M < 100 ? -1 : 1;
    return k`<g class="eye">
      <ellipse cx=${M} cy=${S} rx=${R} ry=${V} fill="#fdfbf8"></ellipse>
      <ellipse cx=${M} cy=${S - V * 0.55} rx=${R * 0.9} ry=${V * 0.35} fill=${A(n, 0.15)} opacity=".18"></ellipse>
      <circle cx=${M} cy=${S + 0.6} r=${K} fill="url(#${u("iris")})"></circle>
      <circle cx=${M} cy=${S + 0.6} r=${K * 0.46} fill="#16110f"></circle>
      <circle cx=${M - K * 0.38} cy=${S - K * 0.38} r=${K * 0.3} fill="#fff"></circle>
      <circle cx=${M + K * 0.32} cy=${S + K * 0.38} r=${K * 0.13} fill="#fff" opacity=".85"></circle>
      <path
        d="M${M - R * 0.98} ${S - V * 0.12} Q${M} ${S - V * 1.22} ${M + R * 0.98} ${S - V * 0.12}${s === "woman" ? ` M${M + Gt * R * 0.9} ${S - V * 0.3} q${Gt * 2.6} ${-1.2} ${Gt * 4} ${-3.6}` : ""}"
        fill="none"
        stroke=${A(r, 0.45)}
        stroke-width=${s === "woman" ? 2.4 : s === "baby" ? 1.2 : 1.6}
        stroke-linecap="round"
        opacity=${s === "baby" ? 0.5 : 0.85}
      ></path>
    </g>`;
  }, m = (M) => {
    const S = i.eyeY - i.sclera[1] - (s === "baby" ? 6 : 5), R = i.sclera[0] + 1;
    return k`<path d="M${M - R} ${S + 1.5} Q${M} ${S - 3.5} ${M + R} ${S + 0.5}" fill="none" stroke=${A(r, 0.15)} stroke-width=${i.brow} stroke-linecap="round" opacity=${s === "baby" ? 0.45 : 0.9}></path>`;
  }, b = i.eyeY + (s === "baby" ? 10 : 11), v = i.mouthY, $ = i.mouthW, G = s === "baby" ? k`<path d="M${100 - $} ${v} Q100 ${v + 9} ${100 + $} ${v} Q100 ${v + 2} ${100 - $} ${v} Z" fill="#a9474a"></path>
          <path d="M${100 - $ * 0.5} ${v + 3.4} Q100 ${v + 6} ${100 + $ * 0.5} ${v + 3.4}" fill="none" stroke="#e58a8a" stroke-width="1.6" stroke-linecap="round"></path>` : s === "woman" ? k`<path d="M${100 - $} ${v} Q100 ${v + 8} ${100 + $} ${v} Q100 ${v + 2.6} ${100 - $} ${v} Z" fill="#c4656a"></path>` : k`<path d="M${100 - $} ${v} Q100 ${v + 7} ${100 + $} ${v}" fill="none" stroke=${p} stroke-width="2.8" stroke-linecap="round"></path>`, z = s === "woman" ? k`<path d="M84 147 Q100 166 116 147" fill=${A(n, 0.08)}></path>` : s === "baby" ? k`<path d="M76 161 Q100 174 124 161" fill="none" stroke=${st(o, 0.55)} stroke-width="5" stroke-linecap="round"></path>
            <circle cx="100" cy="176" r="2.2" fill=${st(o, 0.7)}></circle><circle cx="100" cy="184" r="2.2" fill=${st(o, 0.7)}></circle>` : k`<path d="M${100 - i.neck.w / 2 - 3} ${i.neck.y + i.neck.h - 4} Q100 ${i.neck.y + i.neck.h + 10} ${100 + i.neck.w / 2 + 3} ${i.neck.y + i.neck.h - 4}" fill="none" stroke=${A(o, 0.22)} stroke-width="4" stroke-linecap="round"></path>`;
  return k`<svg class="avatar" viewBox="20 22 160 160" aria-hidden="true">
    <defs>
      <radialGradient id=${u("skin")} cx="40%" cy="34%" r="72%" fx="36%" fy="28%">
        <stop offset="0" stop-color=${st(n, 0.28)}></stop>
        <stop offset=".6" stop-color=${n}></stop>
        <stop offset="1" stop-color=${A(n, 0.2)}></stop>
      </radialGradient>
      <linearGradient id=${u("neck")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${A(n, 0.28)}></stop>
        <stop offset=".55" stop-color=${A(n, 0.08)}></stop>
      </linearGradient>
      <radialGradient id=${u("hair")} cx="38%" cy="22%" r="85%" fx="34%" fy="18%">
        <stop offset="0" stop-color=${st(r, 0.3)}></stop>
        <stop offset=".5" stop-color=${r}></stop>
        <stop offset="1" stop-color=${A(r, 0.35)}></stop>
      </radialGradient>
      <linearGradient id=${u("shirt")} x1=".2" y1="0" x2=".8" y2="1">
        <stop offset="0" stop-color=${st(o, 0.2)}></stop>
        <stop offset="1" stop-color=${A(o, 0.22)}></stop>
      </linearGradient>
      <radialGradient id=${u("iris")} cx="50%" cy="50%" r="50%">
        <stop offset=".35" stop-color=${c[0]}></stop>
        <stop offset="1" stop-color=${c[1]}></stop>
      </radialGradient>
    </defs>
    <g class="figure">
      ${i.hairBack ? k`<path d=${i.hairBack} fill="url(#${u("hair")})"></path>` : g}
      <path d=${i.body} fill="url(#${u("shirt")})"></path>
      <rect x=${100 - i.neck.w / 2} y=${i.neck.y} width=${i.neck.w} height=${i.neck.h} rx=${i.neck.w / 2.4} fill="url(#${u("neck")})"></rect>
      ${z}
      ${i.ears ? k`<ellipse cx=${100 - i.ears.dx} cy=${i.ears.y} rx=${i.ears.rx} ry=${i.ears.ry} fill=${A(n, 0.06)}></ellipse>
            <ellipse cx=${100 + i.ears.dx} cy=${i.ears.y} rx=${i.ears.rx} ry=${i.ears.ry} fill=${A(n, 0.1)}></ellipse>` : g}
      <ellipse cx=${d.cx} cy=${d.cy} rx=${d.rx} ry=${d.ry} fill="url(#${u("skin")})"></ellipse>
      <ellipse cx=${d.cx - d.rx * 0.28} cy=${d.cy - d.ry * 0.38} rx=${d.rx * 0.34} ry=${d.ry * 0.16} fill="#fff" opacity=".16"></ellipse>
      <ellipse cx=${100 - i.eyeDX - 6} cy=${i.cheekY} rx=${s === "baby" ? 9 : 7} ry=${s === "baby" ? 5.5 : 4.2} fill="#ff8a80" opacity=${s === "baby" ? 0.34 : 0.22}></ellipse>
      <ellipse cx=${100 + i.eyeDX + 6} cy=${i.cheekY} rx=${s === "baby" ? 9 : 7} ry=${s === "baby" ? 5.5 : 4.2} fill="#ff8a80" opacity=${s === "baby" ? 0.34 : 0.22}></ellipse>
      ${s === "child" ? k`<g fill=${A(n, 0.35)} opacity=".55"><circle cx="89" cy="111" r="1"></circle><circle cx="93" cy="113" r=".9"></circle><circle cx="107" cy="113" r=".9"></circle><circle cx="111" cy="111" r="1"></circle></g>` : g}
      ${f(100 - i.eyeDX)} ${f(100 + i.eyeDX)} ${m(100 - i.eyeDX)} ${m(100 + i.eyeDX)}
      <path d="M97 ${b} Q100 ${b + 4.5} 103 ${b}" fill="none" stroke=${A(n, 0.28)} stroke-width="2" stroke-linecap="round"></path>
      <ellipse cx="99" cy=${b - 4} rx="2" ry="1.2" fill="#fff" opacity=".35"></ellipse>
      ${G}
      <path d=${i.hairFront} fill="url(#${u("hair")})"></path>
      ${s === "baby" ? k`<path d="M98 51 C89 45 91 32 102 32 C110 33 111 42 103 44" fill="none" stroke="url(#${u("hair")})" stroke-width="5.5" stroke-linecap="round"></path>` : g}
      <path d=${i.sheen} fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".2"></path>
      ${s === "woman" ? k`<circle cx="60" cy="112" r="2.4" fill="#e8c77a"></circle><circle cx="140" cy="112" r="2.4" fill="#e8c77a"></circle>` : g}
    </g>
  </svg>`;
}
var _a = Object.defineProperty, Xs = (a, t, e, s) => {
  for (var i = void 0, n = a.length - 1, r; n >= 0; n--)
    (r = a[n]) && (i = r(t, e, i) || i);
  return i && _a(t, e, i), i;
};
let Ma = 0;
const dt = (a) => a.calendar ? [].concat(a.calendar) : [], Sa = (a) => [a.entity, a.battery, a.charging, a.distance, a.sleep, ...dt(a), ...(a.stats ?? []).map((t) => t.entity)], ws = (a, t) => (/* @__PURE__ */ new Date()).toDateString() === a.toDateString() ? D(a, t) : a.toLocaleDateString(C(t), { weekday: "long" });
function Ca(a, t, e) {
  const s = t.entity ? a?.states[t.entity] : void 0, i = t.sleep ? a?.states[t.sleep] : void 0, n = i?.state === "on", r = e ? pe(e).now : void 0;
  let o = "none", l = "", c = s ? `since ${ws(new Date(s.last_changed), a)}` : "", p = !1;
  const d = s && s.state !== "unknown" && s.state !== "unavailable" ? s.state : void 0;
  if (d === "home")
    o = "home", l = "Home";
  else if (d && d !== "not_home")
    o = "zone", l = d;
  else if (r) {
    o = "zone", p = !0;
    const m = Vs(r.location);
    l = m && m.toLowerCase() !== r.summary.toLowerCase() ? `${r.summary} · ${m}` : r.summary, c = r.allDay ? "all day" : `until ${D(r.end, a)}`;
  } else d === "not_home" ? (o = "away", l = "Away") : t.default_location ? (o = t.default_location.toLowerCase() === "home" ? "home" : "zone", l = o === "home" ? "Home" : t.default_location, c = "") : s && (l = "Location unknown");
  if (!p && o !== "home") {
    const m = t.distance ? a?.states[t.distance] : void 0;
    m && N(m) !== void 0 && d && (l += ` · ${As(a, m)} away`);
  }
  let u = "";
  if (n) {
    const m = (Date.now() - new Date(i.last_changed).getTime()) / 6e4;
    u = m < 60 ? `${Math.max(1, Math.round(m))} min` : `${Math.floor(m / 60)} h ${Math.round(m % 60)} min`, l = `Asleep · ${u}`;
  }
  n ? c = `since ${ws(new Date(i.last_changed), a)}` : o === "none" && (c = "");
  const f = d === "home" && Date.now() - new Date(s.last_changed).getTime() < 10 * 6e4;
  return { presence: o, asleep: n, label: l || "No location", since: c, justArrived: f, sleepFor: u, fromPlan: p };
}
function $s(a, t, e) {
  if (t) return "Now";
  const s = /* @__PURE__ */ new Date(), i = new Date(s.getTime() + 864e5), n = (o, l) => o.toDateString() === l.toDateString(), r = n(a.start, s) ? "" : n(a.start, i) ? "Tomorrow" : a.start.toLocaleDateString(C(e), { weekday: "short" });
  return a.allDay ? r || "Today" : r ? `${r} ${D(a.start, e)}` : D(a.start, e);
}
function ks(a, t) {
  const e = t.battery ? a?.states[t.battery] : void 0, s = N(e);
  if (s === void 0) return;
  const i = t.charging ? a?.states[t.charging]?.state.toLowerCase() : void 0, n = i === "on" || i === "charging" || String(e.attributes.battery_state ?? "").toLowerCase() === "charging";
  return { level: Math.round(s), charging: n };
}
const _s = (a, t) => k`<svg class="bat" viewBox="0 0 24 24" aria-hidden="true">
  <rect x="2.5" y="7" width="17" height="10" rx="2.6" fill="none" stroke="currentColor" stroke-width="1.6"></rect>
  <rect x="20.4" y="10" width="2" height="4" rx="1" fill="currentColor"></rect>
  <rect x="4.6" y="9.1" width=${Math.max(0.8, 12.8 * a / 100)} height="5.8" rx="1.3" fill="currentColor"></rect>
  ${t ? k`<path d="M11.6 6.2 8.4 12.4h3.2l-.9 5.4 3.9-6.6h-3.3l1.1-5z" fill="var(--hh-bg)" stroke="currentColor" stroke-width=".9" stroke-linejoin="round"></path>` : g}
</svg>`;
function Ms(a, t, e, s) {
  return h`<span class="pwrap" data-presence=${t.presence} data-arrived=${t.justArrived} style="--breathe-delay:${s}s">
    <span class="portrait">${a.picture ? h`<img src=${a.picture} alt="" />` : ka(a.avatar, e, t.asleep)}</span>
    ${t.asleep ? h`<span class="zz" aria-hidden="true"><i>z</i><i>z</i><i>z</i></span>` : g}
  </span>`;
}
const Ea = E`
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
`, Aa = 6e4, za = (a) => [a.battery, a.range, a.charging, a.charging_power, a.time_to_full, a.target, a.plugged, a.location, a.climate, a.lock, a.odometer, ...(a.stats ?? []).map((t) => t.entity)], Ss = (a) => {
  if (!a) return !1;
  const t = a.toLowerCase();
  return t === "on" || t === "true" || t === "charging" || t === "connected" || t === "plugged" || t.includes("charging") && !t.includes("not");
}, Le = class Le extends P {
  constructor() {
    super(...arguments), this.events = [], this.view = { kind: "family" }, this.avatarId = `hh-fam${++Ma}`, this.back = () => {
      clearTimeout(this.backTimer), this.view = { kind: "family" };
    }, this.onKey = (t) => {
      t.key === "Escape" && this.view.kind !== "family" && this.back();
    };
  }
  static getStubConfig(t) {
    return { people: Object.keys(t?.states ?? {}).filter((e) => e.startsWith("person.")).map((e) => ({ entity: e })) };
  }
  validateConfig(t) {
    if (!Array.isArray(t.people) || !t.people.length) throw new Error("List the family under `people`.");
    for (const e of t.cars ?? []) if (!e.battery) throw new Error(`Give ${e.name ?? "the car"} a \`battery\` sensor.`);
  }
  watchedEntities() {
    return [...this.config.people.flatMap(Sa), ...(this.config.cars ?? []).flatMap(za)];
  }
  getCardSize() {
    return 4;
  }
  connectedCallback() {
    super.connectedCallback(), this.ticker = window.setInterval(() => void this.loadEvents(!1), 6e4), this.blinker = window.setInterval(() => this.blinkSomeone(), 3500), this.addEventListener("keydown", this.onKey);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this.ticker), clearInterval(this.blinker), clearTimeout(this.backTimer), this.removeEventListener("keydown", this.onKey);
  }
  updated(t) {
    if (super.updated(t), !this.hass) return;
    const e = this.config.people, s = e.flatMap(dt);
    if (!s.length) return;
    const i = JSON.stringify(e.map((o) => [dt(o), o.calendar_match])), n = t.get("hass"), r = !!n && s.some((o) => n.states[o] !== this.hass.states[o]);
    (i !== this.loadedFor || r) && (this.loadedFor = i, this.loadEvents(r));
  }
  async loadEvents(t) {
    const e = this.hass;
    e && (this.events = await Promise.all(
      this.config.people.map((s) => {
        if (!dt(s).length) return Promise.resolve(void 0);
        const i = dt(s).filter((n) => e.states[n]);
        return i.length ? xa(e, i, t).then((n) => wa(n, s.calendar_match)) : Promise.resolve([]);
      })
    ));
  }
  // ---------- navigation ----------
  open(t) {
    this.view = t, this.armBack();
  }
  /** Back to the family after a minute without a touch, so a wall tablet doesn't stay on one page. */
  armBack() {
    clearTimeout(this.backTimer), this.view.kind !== "family" && (this.backTimer = window.setTimeout(this.back, Aa));
  }
  /** Now and then one awake person blinks: a 150 ms class change rather than a never-ending animation. */
  blinkSomeone() {
    if (!x.motionOn || document.hidden || !this.onScreen) return;
    const t = [...this.renderRoot.querySelectorAll(".portrait")].filter((s) => s.querySelector(".eye")), e = t[Math.floor(Math.random() * t.length)];
    e && (e.classList.add("blinking"), setTimeout(() => e.classList.remove("blinking"), 150));
  }
  // ---------- helpers ----------
  name(t) {
    return t.name ?? H(t.entity ? this.stateOf(t.entity) : void 0, "Someone");
  }
  /** "Football · Thu 16:30": the next thing within a day and a half, for the family view. */
  nextUp(t) {
    const e = t ? pe(t).upcoming[0] : void 0;
    return !e || e.start.getTime() - Date.now() > 36 * 36e5 ? "" : `${e.summary} · ${$s(e, !1, this.hass)}`;
  }
  statValue(t) {
    const e = this.stateOf(t);
    if (e?.attributes.device_class === "timestamp") {
      const s = new Date(e.state);
      if (!isNaN(s.getTime())) return Zs(s);
    }
    return this.format(t);
  }
  car(t) {
    const e = N(this.stateOf(t.battery)), s = Ss(this.stateOf(t.charging)?.state), i = Ss(this.stateOf(t.plugged)?.state) || s, n = B(this.stateOf(t.charging_power)), r = N(this.stateOf(t.target)), o = this.stateOf(t.time_to_full);
    let l;
    if (o)
      if (o.attributes.device_class === "timestamp") {
        const d = new Date(o.state);
        isNaN(d.getTime()) || (l = D(d, this.hass));
      } else {
        const d = N(o), u = String(o.attributes.unit_of_measurement ?? "min").toLowerCase(), f = d === void 0 ? void 0 : u.startsWith("h") ? d * 60 : d;
        f && f > 0 && (l = D(new Date(Date.now() + f * 6e4), this.hass));
      }
    const c = this.stateOf(t.location)?.state, p = !c || c === "unknown" || c === "unavailable" ? "" : c === "home" ? "Parked at home" : c === "not_home" ? "Away" : `At ${c}`;
    return { level: e, charging: s, plugged: i, power: n, target: r, fullAt: l, where: p, colour: Ys(t.color) };
  }
  // ---------- family view ----------
  renderFamily(t) {
    const e = this.config.people;
    return h`<div class="people">
      ${e.map((s, i) => {
      const n = t[i], r = ks(this.hass, s), o = this.name(s), l = r ? r.charging ? "bat-charging" : r.level <= 20 ? "bat-low" : "" : "", c = this.nextUp(this.events[i]);
      return h`<button
          class="member"
          type="button"
          aria-label="${o}: ${n.label}. Show ${o}'s page"
          data-presence=${n.presence}
          data-asleep=${n.asleep}
          @click=${() => this.tap(() => this.open({ kind: "person", i }))}
          @pointerdown=${() => this.holdStart(() => this.moreInfo(s.entity ?? s.sleep))}
          @pointerup=${this.holdEnd}
          @pointerleave=${this.holdEnd}
          @pointercancel=${this.holdEnd}
        >
          ${Ms(s, n, `${this.avatarId}-${i}`, i * -1.6)}
          <b class="name">${o}</b>
          <span class="where"><span class="dot"></span><span class="lbl">${n.asleep ? "Asleep" : n.label.split(" · ")[0]}</span></span>
          ${c ? h`<span class="next" title=${c}>${c}</span>` : g}
          ${r ? h`<span class="mini-bat num ${l}">${_s(r.level, r.charging)}${r.level}%</span>` : g}
        </button>`;
    })}
    </div>`;
  }
  // ---------- person page ----------
  renderPerson(t, e) {
    const s = this.config.people[t], i = this.events[t], n = this.name(s), r = ks(this.hass, s), o = r ? r.charging ? "bat-charging" : r.level <= 20 ? "bat-low" : "" : "", l = s.sleep?.startsWith("input_boolean."), { now: c, upcoming: p } = i ? pe(i) : { now: void 0, upcoming: [] }, d = [...c ? [{ e: c, isNow: !0 }] : [], ...p.slice(0, Math.max(s.agenda ?? 3, 3)).map((m) => ({ e: m, isNow: !1 }))], u = dt(s).length > 0, f = [
      s.sleep ? h`<button
            class="tile big ${e.asleep ? "sleeping" : ""}"
            type="button"
            aria-pressed=${l ? e.asleep : g}
            @click=${() => l ? this.callService("input_boolean", "toggle", {}, { entity_id: s.sleep }) : this.moreInfo(s.sleep)}
          >
            <span class="ti">${_(e.asleep ? "mdi:sleep" : "mdi:white-balance-sunny")}</span>
            <span class="tt"><small>${l ? e.asleep ? "Tap when awake" : "Tap at bedtime" : "Sleep"}</small><b>${e.asleep ? `Asleep ${e.sleepFor}` : "Awake"}</b></span>
          </button>` : g,
      r ? h`<button class="tile" type="button" @click=${() => this.moreInfo(s.battery)}>
            <span class="ti ${o}">${_s(r.level, r.charging)}</span>
            <span class="tt"><small>${r.charging ? "Charging" : s.battery_label ?? "Phone"}</small><b class="num">${r.level}%</b></span>
          </button>` : g,
      ...(s.stats ?? []).map(
        (m) => h`<button class="tile" type="button" @click=${() => this.moreInfo(m.entity)}>
          <span class="ti">${_(m.icon ?? this.stateOf(m.entity)?.attributes.icon ?? "mdi:information-outline")}</span>
          <span class="tt"><small>${m.name ?? H(this.stateOf(m.entity), m.entity)}</small><b>${this.statValue(m.entity)}</b></span>
        </button>`
      )
    ].filter((m) => m !== g);
    return h`<div class="page" data-presence=${e.presence} data-asleep=${e.asleep}>
      <div class="hero">
        <button class="hero-portrait" type="button" aria-label="${n}: details" @click=${() => this.moreInfo(s.entity ?? s.sleep)}>
          ${Ms(s, e, `${this.avatarId}-p${t}`, 0)}
        </button>
        <div class="who">
          <h2>${n}</h2>
          <span class="where"><span class="dot"></span>${e.label}${e.fromPlan ? h`<span class="plan" title="From the calendar">${_("mdi:calendar-clock")}</span>` : g}</span>
          ${e.since ? h`<span class="since">${e.since}</span>` : g}
        </div>
      </div>
      <div class="cols">
        ${u ? h`<section class="block">
              <h4>Plan</h4>
              ${i ? d.length ? h`<div class="agenda">
                      ${d.map(({ e: m, isNow: b }) => {
      const v = Vs(m.location), $ = [b && !m.allDay ? `until ${D(m.end, this.hass)}` : "", v].filter(Boolean).join(" · ");
      return h`<div class="ev ${b ? "now" : ""}" title=${m.location ?? ""}>
                          <span class="when num">${$s(m, b, this.hass)}</span>
                          <span class="what"><b>${m.summary}</b>${$ ? h`<small>${$}</small>` : g}</span>
                        </div>`;
    })}
                    </div>` : h`<p class="nothing">Nothing planned this week</p>` : h`<p class="nothing">Reading the calendar…</p>`}
            </section>` : g}
        ${f.length ? h`<section class="block"><h4>Status</h4><div class="tiles">${f}</div></section>` : g}
      </div>
    </div>`;
  }
  // ---------- car page ----------
  renderCar(t) {
    const e = this.config.cars[t], s = this.car(e), i = s.level ?? 0, n = s.charging ? `Charging${s.power !== void 0 ? ` · ${s.power.toFixed(1)} kW` : ""}` : s.plugged ? "Plugged in, not charging" : s.where || "Parked", r = s.charging && s.fullAt ? `Full at ${s.fullAt}` : s.charging || s.plugged ? s.where : "", o = e.climate ? !["off", "unavailable", "unknown"].includes(this.stateOf(e.climate)?.state ?? "off") : !1, l = this.stateOf(e.lock)?.state, c = l === "locked" || l === "off", p = [
      e.range ? this.tile("mdi:map-marker-distance", "Range", this.format(e.range), e.range) : g,
      e.target ? this.tile("mdi:battery-arrow-up-outline", "Charge limit", this.format(e.target), e.target) : g,
      s.charging && s.fullAt ? this.tile("mdi:clock-outline", "Full at", s.fullAt, e.time_to_full) : g,
      e.plugged ? this.tile(s.plugged ? "mdi:power-plug" : "mdi:power-plug-off-outline", "Cable", s.plugged ? "Plugged in" : "Unplugged", e.plugged) : g,
      e.climate ? h`<button class="tile ${o ? "on" : ""}" type="button" aria-pressed=${o} @click=${() => this.callService("homeassistant", "toggle", {}, { entity_id: e.climate })}>
            <span class="ti">${_("mdi:fan")}</span>
            <span class="tt"><small>Climate</small><b>${o ? "On · tap to stop" : "Off · tap to start"}</b></span>
          </button>` : g,
      e.lock ? this.tile(c ? "mdi:lock-outline" : "mdi:lock-open-variant-outline", "Doors", c ? "Locked" : "Unlocked", e.lock) : g,
      e.odometer ? this.tile("mdi:counter", "Odometer", this.format(e.odometer), e.odometer) : g,
      ...(e.stats ?? []).map((d) => this.tile(d.icon ?? "mdi:information-outline", d.name ?? H(this.stateOf(d.entity), d.entity), this.statValue(d.entity), d.entity))
    ].filter((d) => d !== g);
    return h`<div class="page car-page" data-charging=${s.charging}>
      <div class="hero">
        <div class="car-art">
          ${da(s.colour, `${this.avatarId}-car${t}`, s.charging)}
          ${s.charging ? h`<span class="plug-pulse" aria-hidden="true"></span>` : g}
        </div>
        <div class="who">
          <h2>${e.name}</h2>
          <span class="where car-status"><span class="dot"></span>${n}</span>
          ${r ? h`<span class="since">${r}</span>` : g}
        </div>
      </div>
      <button class="charge" type="button" style="--lvl:${i / 100};--target:${(s.target ?? 100) / 100}" @click=${() => this.moreInfo(e.battery)}>
        <span class="charge-bar ${i <= 20 ? "low" : ""}">
          <i class="fill"></i>
          ${s.charging ? h`<i class="sheen"></i>` : g}
          ${s.target !== void 0 && s.target < 100 ? h`<i class="target"></i>` : g}
        </span>
        <span class="charge-row num">
          <b>${s.level !== void 0 ? `${Math.round(i)}%` : "–"}</b>
          ${e.range ? h`<span>${this.format(e.range)}</span>` : g}
        </span>
      </button>
      ${p.length ? h`<div class="tiles car-tiles">${p}</div>` : g}
    </div>`;
  }
  tile(t, e, s, i) {
    return h`<button class="tile" type="button" @click=${() => this.moreInfo(i)}>
      <span class="ti">${_(t)}</span>
      <span class="tt"><small>${e}</small><b>${s}</b></span>
    </button>`;
  }
  // ---------- frame ----------
  render() {
    const t = this.config.people, e = t.map((p, d) => Ca(this.hass, p, this.events[d])), s = e.filter((p) => p.presence !== "none"), i = s.filter((p) => p.presence === "home").length, n = s.length ? i === s.length ? "All home" : i === 0 ? "No one home" : `${i} of ${s.length} home` : "", r = this.view, o = this.config.cars ?? [], l = r.kind === "person" ? this.name(t[r.i]) : r.kind === "car" ? o[r.i]?.name : "", c = r.kind === "family" ? "family" : `${r.kind}-${r.i}`;
    return h`<ha-card class="glass family" @pointerdown=${() => this.armBack()}>
      <div class="bar">
        ${r.kind === "family" ? h`<h3>${this.config.title ?? "Family"}</h3>
              ${n ? h`<span class="pill">${n}</span>` : g}` : h`<nav class="crumbs" aria-label="Breadcrumb">
              <button class="back" type="button" @click=${this.back}>${w("left")}<span>${this.config.title ?? "Family"}</span></button>
              <span class="sep" aria-hidden="true">›</span>
              <b aria-current="page">${l}</b>
            </nav>`}
        <span class="spacer"></span>
        ${o.map((p, d) => {
      const u = this.car(p);
      return h`<button
            class="car-chip ${r.kind === "car" && r.i === d ? "current" : ""}"
            type="button"
            data-charging=${u.charging}
            aria-label="${p.name}: ${u.level !== void 0 ? `${Math.round(u.level)}%` : "battery unknown"}${u.charging ? ", charging" : ""}"
            @click=${() => this.open({ kind: "car", i: d })}
          >
            ${_("mdi:car-electric-outline")}<span class="num">${u.level !== void 0 ? `${Math.round(u.level)}%` : "–"}</span>
            ${u.charging ? h`<span class="bolt" aria-hidden="true">${_("mdi:lightning-bolt")}</span>` : g}
          </button>`;
    })}
      </div>
      ${va(
      c,
      h`<div class="view">
          ${r.kind === "family" ? this.renderFamily(e) : r.kind === "person" ? this.renderPerson(r.i, e[r.i]) : this.renderCar(r.i)}
        </div>`
    )}
    </ha-card>`;
  }
};
Le.styles = [
  T,
  O,
  Ea,
  E`
      .bar {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 34px;
        margin-bottom: 14px;
      }
      .bar h3 {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
      }
      .spacer {
        flex: 1;
      }
      .crumbs {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        font-size: 14px;
      }
      .back {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 6px 10px 6px 6px;
        border-radius: 11px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        font-weight: 600;
        color: var(--hh-accent);
      }
      .back svg.i {
        width: 17px;
        height: 17px;
      }
      .sep {
        color: var(--hh-ink-3);
      }
      .crumbs b {
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .car-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 6px 11px;
        border-radius: 999px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        font-size: 12.5px;
        font-weight: 600;
        --mdc-icon-size: 17px;
        transition: background 0.2s;
      }
      .car-chip.current {
        background: var(--hh-accent-soft);
        color: var(--hh-accent);
      }
      .car-chip[data-charging='true'] {
        color: var(--hh-ok);
      }
      .bolt {
        display: inline-flex;
        --mdc-icon-size: 14px;
        animation: blink-bolt 1.6s ease-in-out infinite;
      }
      @keyframes blink-bolt {
        50% {
          opacity: 0.35;
        }
      }
      /* Each view slides in when it replaces the last: transform and opacity only. */
      .view {
        animation: view-in 0.38s var(--ease);
      }
      @keyframes view-in {
        from {
          opacity: 0;
          transform: translateX(14px);
        }
      }

      /* family view */
      .people {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
        gap: 10px;
      }
      .member {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        padding: 14px 6px 12px;
        border-radius: 20px;
        min-width: 0;
        user-select: none;
        -webkit-touch-callout: none;
        transition: background 0.2s;
      }
      .member:hover {
        background: var(--hh-glass-strong);
      }
      .member .pwrap {
        width: 80px;
        height: 80px;
        margin-bottom: 6px;
      }
      .member .name {
        font-size: 14.5px;
        font-weight: 600;
      }
      .member .where {
        max-width: 100%;
      }
      .member .where .lbl,
      .next {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }
      .next {
        font-size: 11.5px;
        color: var(--hh-ink-3);
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

      /* person and car pages */
      .hero {
        display: flex;
        align-items: center;
        gap: 18px;
        margin-bottom: 16px;
      }
      .hero-portrait {
        flex: none;
        border-radius: 50%;
      }
      .hero-portrait .pwrap {
        width: 104px;
        height: 104px;
      }
      .who {
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
      }
      .who h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .who .where {
        font-size: 13px;
        align-items: flex-start;
      }
      .who .where .dot {
        margin-top: 5px;
      }
      .plan {
        display: inline-flex;
        color: var(--hh-ink-3);
        --mdc-icon-size: 14px;
      }
      .since {
        font-size: 12px;
        color: var(--hh-ink-3);
      }
      .cols {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
        gap: 16px;
      }
      .block h4 {
        margin: 0 0 8px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--hh-ink-3);
      }
      .agenda {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .ev {
        display: grid;
        grid-template-columns: 92px 1fr;
        gap: 10px;
        align-items: baseline;
        padding: 9px 10px;
        border-radius: 13px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
      }
      .ev.now {
        background: var(--hh-accent-soft);
        border-color: transparent;
      }
      .when {
        font-size: 12px;
        font-weight: 600;
        color: var(--hh-ink-3);
      }
      .ev.now .when {
        color: var(--hh-accent);
      }
      .what {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .what b {
        font-size: 14px;
        font-weight: 600;
        line-height: 1.3;
      }
      .what small {
        font-size: 12px;
        color: var(--hh-ink-3);
        line-height: 1.35;
      }
      .nothing {
        margin: 0;
        font-size: 13px;
        color: var(--hh-ink-3);
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 8px;
      }
      .tile {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 15px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        text-align: left;
        min-width: 0;
        transition: background 0.2s;
      }
      .tile:hover {
        background: var(--hh-glass-press);
      }
      .tile.big {
        grid-column: 1 / -1;
        padding: 14px;
      }
      .ti {
        width: 34px;
        height: 34px;
        border-radius: 11px;
        display: grid;
        place-items: center;
        flex: none;
        background: var(--hh-accent-soft);
        color: var(--hh-accent);
      }
      .ti.bat-low {
        background: color-mix(in srgb, var(--hh-crit) 16%, transparent);
      }
      .ti.bat-charging {
        background: color-mix(in srgb, var(--hh-ok) 16%, transparent);
      }
      .tile.sleeping .ti,
      .tile.on .ti {
        background: color-mix(in srgb, var(--hh-warm) 20%, transparent);
        color: var(--hh-warm);
      }
      .tt {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .tt small {
        font-size: 11.5px;
        color: var(--hh-ink-3);
      }
      .tt b {
        font-size: 14px;
        font-weight: 600;
        line-height: 1.25;
        overflow-wrap: anywhere;
      }

      /* car page */
      .car-art {
        position: relative;
        width: min(46%, 260px);
        flex: none;
      }
      .car-art svg.car {
        width: 100%;
        height: auto;
        display: block;
      }
      .plug-pulse {
        position: absolute;
        left: 15.3%;
        top: 54.5%;
        width: 18px;
        height: 18px;
        margin: -9px 0 0 -9px;
        border-radius: 50%;
        border: 2px solid #7ee0b5;
        animation: plug 1.8s ease-out infinite;
        will-change: transform, opacity;
      }
      @keyframes plug {
        0% {
          transform: scale(0.5);
          opacity: 0.9;
        }
        100% {
          transform: scale(2.2);
          opacity: 0;
        }
      }
      .car-page[data-charging='true'] .car-status .dot {
        background: var(--hh-ok);
      }
      .charge {
        display: block;
        width: 100%;
        text-align: left;
        margin-bottom: 14px;
        --lvl: 0;
        --target: 1;
      }
      .charge-bar {
        position: relative;
        display: block;
        height: 16px;
        border-radius: 999px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        overflow: hidden;
      }
      .fill {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: linear-gradient(90deg, color-mix(in srgb, var(--hh-ok) 70%, var(--hh-accent)), var(--hh-ok));
        transform-origin: 0 50%;
        transform: scaleX(var(--lvl));
        transition: transform 0.8s var(--ease);
      }
      .charge-bar.low .fill {
        background: linear-gradient(90deg, var(--hh-warn), var(--hh-crit));
      }
      /* Charging: a soft light runs along the bar, as a moving layer rather than a redrawn gradient. */
      .sheen {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 30%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
        animation: sheen 2.2s ease-in-out infinite;
        will-change: transform;
      }
      @keyframes sheen {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(calc(var(--lvl) * 333%));
        }
      }
      .target {
        position: absolute;
        top: 2px;
        bottom: 2px;
        left: calc(var(--target) * 100%);
        width: 2px;
        margin-left: -1px;
        border-radius: 1px;
        background: var(--hh-ink-2);
        opacity: 0.6;
      }
      .charge-row {
        display: flex;
        align-items: baseline;
        gap: 12px;
        margin-top: 6px;
        font-size: 13px;
        color: var(--hh-ink-2);
      }
      .charge-row b {
        font-size: 22px;
        font-weight: 300;
        color: var(--hh-ink);
      }
      @media (max-width: 480px) {
        .hero {
          flex-wrap: wrap;
        }
        .car-art {
          width: 100%;
        }
        .ev {
          grid-template-columns: 78px 1fr;
        }
      }
    `
];
let St = Le;
Xs([
  y()
], St.prototype, "events");
Xs([
  y()
], St.prototype, "view");
F("hyggehub-family-card", St, "HyggeHub Family", "Everyone in the home, and the car: tap one for their own page.");
const Pe = class Pe extends P {
  static getStubConfig() {
    const t = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    return {
      schedule: [
        { name: "Rest", day: "tue", every_weeks: 1, first: t },
        { name: "Mad", day: "tue", every_weeks: 1, first: t },
        { name: "Papir/Pap", day: "wed", every_weeks: 4, first: t }
      ]
    };
  }
  validateConfig(t) {
    la(t);
  }
  connectedCallback() {
    super.connectedCallback(), this.ticker = window.setInterval(() => this.requestUpdate(), 60 * 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this.ticker);
  }
  whenLabel(t) {
    const e = it(t), s = t.toLocaleDateString(C(this.hass), { weekday: "short", day: "numeric", month: "short" });
    return e === 0 ? { big: "Today", small: s } : e === 1 ? { big: "Tomorrow", small: s } : e < 7 ? { big: t.toLocaleDateString(C(this.hass), { weekday: "long" }), small: `in ${e} days · ${t.toLocaleDateString(C(this.hass), { day: "numeric", month: "short" })}` } : { big: s, small: `in ${e} days` };
  }
  render() {
    const t = Nt(this.config), e = t[0], s = t.slice(1, 1 + (this.config.upcoming ?? 3)), i = e ? it(e.day) : -1, n = i === 1 ? "Put them out tonight" : i === 0 && (/* @__PURE__ */ new Date()).getHours() < 12 ? "Collected today" : "";
    return h`<ha-card class="glass bins" data-soon=${i >= 0 && i <= 1}>
      <div class="head">
        <h3>${this.config.title ?? "Bins"}</h3>
        ${n ? h`<span class="nudge">${n}</span>` : g}
      </div>
      ${e ? h`
              <div class="next">
                <div class="glyphs">${e.bins.map((r) => ha(r.color))}</div>
                <div class="when">
                  <b>${this.whenLabel(e.day).big}</b>
                  <small class="num">${this.whenLabel(e.day).small}</small>
                </div>
              </div>
              <div class="kinds">
                ${e.bins.map(
      (r) => h`<span class="bin-kinds" role="img" aria-label=${r.name} title=${r.name}>
                    ${r.kinds.map((o) => h`<span class="kind" style="--c:${o.color}" title=${o.name}>${_(o.icon)}</span>`)}
                  </span>`
    )}
              </div>
              ${s.length ? h`<ul class="later">
                    ${s.map(
      (r) => h`<li>
                        <span class="d num">${this.whenLabel(r.day).big === "Tomorrow" ? "Tomorrow" : r.day.toLocaleDateString(C(this.hass), { weekday: "short", day: "numeric", month: "short" })}</span>
                        <span class="dots">
                          ${r.bins.map(
        (o) => h`<span class="bin-kinds small" role="img" aria-label=${o.name} title=${o.name}>
                              ${o.kinds.map((l) => h`<span class="kind" style="--c:${l.color}">${_(l.icon)}</span>`)}
                            </span>`
      )}
                        </span>
                      </li>`
    )}
                  </ul>` : g}
            ` : h`<p class="quiet">No collections in the next ${Math.round(Us / 7)} weeks</p>`}
    </ha-card>`;
  }
};
Pe.styles = [
  T,
  O,
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
      .kinds {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 14px;
      }
      /* One rounded group per physical bin, holding an icon for each kind of waste it takes. */
      .bin-kinds {
        display: inline-flex;
        gap: 4px;
        padding: 4px;
        border-radius: 14px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
      }
      .kind {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        background: var(--c);
        color: #fff;
        --mdc-icon-size: 19px;
      }
      .bin-kinds.small {
        padding: 2px;
        border-radius: 9px;
        gap: 2px;
      }
      .bin-kinds.small .kind {
        width: 22px;
        height: 22px;
        border-radius: 7px;
        --mdc-icon-size: 13px;
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
let ge = Pe;
F("hyggehub-bins-card", ge, "HyggeHub Bins", "The next bin collection and which bins go out, from your collection schedule.");
var Da = Object.defineProperty, Yt = (a, t, e, s) => {
  for (var i = void 0, n = a.length - 1, r; n >= 0; n--)
    (r = a[n]) && (i = r(t, e, i) || i);
  return i && Da(t, e, i), i;
};
const Ta = {
  import: { icon: "mdi:transmission-tower-import", color: "var(--hh-accent)", label: "Electricity in" },
  export: { icon: "mdi:transmission-tower-export", color: "var(--hh-ok)", label: "Electricity out" },
  water: { icon: "mdi:water-outline", color: "#4a9ad6", label: "Water" },
  gas: { icon: "mdi:fire", color: "var(--hh-warm)", label: "Gas" },
  heat: { icon: "mdi:radiator", color: "var(--hh-crit)", label: "Heating" },
  other: { icon: "mdi:gauge", color: "var(--hh-ink-2)", label: "Meter" }
}, Oa = (a, t) => /m³|m3|l$|gal/i.test(t) || /vand|water/i.test(a) ? "water" : /eksport|export|return|feed/i.test(a) ? "export" : /gas/i.test(a) ? "gas" : /varme|heat/i.test(a) ? "heat" : /kwh|wh/i.test(t) ? "import" : "other";
function ae(a, t) {
  if (a === void 0) return { value: "–", unit: t };
  if (/m³|m3/.test(t) && Math.abs(a) < 10) return { value: String(Math.round(a * 1e3)), unit: "L" };
  const e = Math.abs(a) < 10 ? 2 : Math.abs(a) < 100 ? 1 : 0;
  return { value: a.toFixed(e), unit: t };
}
function ne(a) {
  const t = /* @__PURE__ */ new Date();
  return t.setHours(0, 0, 0, 0), a === "week" && t.setDate(t.getDate() - (t.getDay() + 6) % 7), a === "month" && t.setDate(1), t;
}
const Fe = class Fe extends P {
  constructor() {
    super(...arguments), this.period = "day", this.data = {}, this.error = "", this.yesterday = !1;
  }
  static getStubConfig(t) {
    return { meters: Object.entries(t?.states ?? {}).filter(([s, i]) => s.startsWith("sensor.") && ["energy", "water", "gas"].includes(i.attributes?.device_class)).slice(0, 3).map(([s]) => ({ entity: s })) };
  }
  validateConfig(t) {
    if (!Array.isArray(t.meters) || !t.meters.length) throw new Error("List your meters under `meters`.");
    t.period && (this.period = t.period);
  }
  watchedEntities() {
    return this.config.meters.map((t) => t.entity);
  }
  getCardSize() {
    return 3 + this.config.meters.length;
  }
  connectedCallback() {
    super.connectedCallback(), this.ticker = window.setInterval(() => void this.load(), 5 * 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this.ticker);
  }
  updated(t) {
    super.updated(t);
    const e = `${this.period}|${this.config.meters.map((s) => s.entity).join(",")}`;
    this.hass && e !== this.loadedKey && (this.loadedKey = e, this.load());
  }
  /** Reads the hourly (or daily) changes from Home Assistant's long-term statistics. */
  async load() {
    if (!this.hass) return;
    const e = ne(this.period);
    try {
      let s = await this.fetch(e, /* @__PURE__ */ new Date()), i = !1;
      if (this.period === "day" && !Object.values(s).some((n) => n.upTo)) {
        const n = new Date(e.getTime() - 864e5);
        s = await this.fetch(n, e), i = !0, this.windowStart = n;
      } else this.windowStart = e;
      this.yesterday = i, this.data = s, this.error = "";
    } catch (s) {
      this.error = s?.message ?? "Could not read the meter statistics";
    }
  }
  async fetch(t, e) {
    const s = this.config.meters.map((r) => r.entity), i = await this.hass.callWS({
      type: "recorder/statistics_during_period",
      start_time: t.toISOString(),
      end_time: e.toISOString(),
      statistic_ids: s,
      period: this.period === "day" ? "hour" : "day",
      types: ["change"]
    }), n = {};
    for (const r of s) {
      const o = i?.[r] ?? [], l = o.map((d) => ({ start: new Date(d.start), change: d.change ?? 0 })), c = o.filter((d) => (d.change ?? 0) !== 0), p = c[c.length - 1];
      n[r] = {
        total: o.length ? l.reduce((d, u) => d + u.change, 0) : void 0,
        buckets: l,
        unit: String(this.stateOf(r)?.attributes.unit_of_measurement ?? ""),
        upTo: p ? new Date(p.end) : void 0
      };
    }
    return n;
  }
  setPeriod(t) {
    t !== this.period && (this.period = t);
  }
  /** The bars: one per hour (day view) or per day (week and month), always filling the period. */
  bars(t, e) {
    const s = this.windowStart ?? ne(this.period), i = this.period === "day" ? 24 : this.period === "week" ? 7 : new Date(s.getFullYear(), s.getMonth() + 1, 0).getDate(), n = this.period === "day" ? 36e5 : 864e5, r = new Array(i).fill(0);
    for (const c of t.buckets) {
      const p = Math.floor((c.start.getTime() - s.getTime()) / n);
      p >= 0 && p < i && (r[p] += Math.max(0, c.change));
    }
    const o = Math.max(...r, 1e-4), l = this.yesterday ? i : Math.floor((Date.now() - s.getTime()) / n);
    return h`<div class="bars" style="--c:${e};grid-template-columns:repeat(${i},1fr)" aria-hidden="true">
      ${r.map((c, p) => h`<i class=${p > l ? "future" : ""} style="--h:${Math.max(c > 0 ? 0.06 : 0.02, c / o)}"></i>`)}
    </div>`;
  }
  axis() {
    if (this.period === "day") return h`<div class="axis"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>`;
    if (this.period === "week") {
      const t = ne("week");
      return h`<div class="axis">
        ${Array.from({ length: 7 }, (e, s) => new Date(t.getTime() + s * 864e5).toLocaleDateString(C(this.hass), { weekday: "narrow" })).map(
        (e) => h`<span>${e}</span>`
      )}
      </div>`;
    }
    return h`<div class="axis"><span>1</span><span>10</span><span>20</span><span>${new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth() + 1, 0).getDate()}</span></div>`;
  }
  render() {
    const t = this.config.meters.map((l) => {
      const c = this.data[l.entity], p = c?.unit ?? String(this.stateOf(l.entity)?.attributes.unit_of_measurement ?? ""), d = l.kind ?? Oa(l.entity, p);
      return { ...l, kind: d, series: c, unit: p, look: Ta[d] };
    }), e = t.filter((l) => l.kind === "import").reduce((l, c) => l + (c.series?.total ?? 0), 0), s = t.filter((l) => l.kind === "export").reduce((l, c) => l + (c.series?.total ?? 0), 0), i = t.some((l) => l.kind === "import") && t.some((l) => l.kind === "export"), n = e - s, r = t.map((l) => l.series?.upTo).filter((l) => !!l).sort((l, c) => c.getTime() - l.getTime())[0], o = this.period === "day" ? this.yesterday ? "yesterday" : "today" : this.period === "week" ? "this week" : "this month";
    return h`<ha-card class="glass usage">
      <div class="head">
        <h3>${this.config.title ?? "Usage"}</h3>
        <div class="seg" role="group" aria-label="Period">
          ${["day", "week", "month"].map(
      (l) => h`<button type="button" aria-pressed=${l === this.period} @click=${() => this.setPeriod(l)}>
              ${l === "day" ? "Today" : l === "week" ? "Week" : "Month"}
            </button>`
    )}
        </div>
      </div>
      ${this.error ? h`<p class="quiet">${this.error}</p>` : g}
      ${this.period === "day" && this.yesterday ? h`<p class="note">Showing yesterday. Today's readings arrive overnight.</p>` : g}
      <div class="meters">
        ${t.map((l) => {
      const c = ae(l.series?.total, l.unit);
      return h`<button class="meter" type="button" style="--c:${l.color ?? l.look.color}" @click=${() => this.moreInfo(l.entity)}>
            <span class="mi">${_(l.icon ?? l.look.icon)}</span>
            <span class="mt">
              <small>${l.name ?? l.look.label ?? H(this.stateOf(l.entity), l.entity)}</small>
              <b class="num">${c.value}<em>${c.unit}</em></b>
            </span>
            ${l.series ? this.bars(l.series, l.color ?? l.look.color) : h`<span class="bars-placeholder"></span>`}
          </button>`;
    })}
      </div>
      ${t.length ? h`<div class="axis-row"><span></span><span></span>${this.axis()}</div>` : g}
      <div class="foot">
        ${i && (e || s) ? h`<span class="net ${n < 0 ? "out" : ""}">
              ${n < 0 ? `Net exported ${ae(-n, "kWh").value} kWh ${o}` : `Net use ${ae(n, "kWh").value} kWh ${o}`}
            </span>` : h`<span></span>`}
        <span class="faint">${r ? `Readings up to ${D(r, this.hass)}` : Object.keys(this.data).length ? `No readings ${o} yet` : "Reading the meters…"}</span>
      </div>
    </ha-card>`;
  }
};
Fe.styles = [
  T,
  O,
  E`
      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 12px;
        flex-wrap: wrap;
      }
      .head h3 {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
      }
      .seg {
        display: inline-flex;
        padding: 3px;
        border-radius: 11px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
      }
      .seg button {
        padding: 5px 10px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        color: var(--hh-ink-2);
        transition: background 0.2s, color 0.2s;
      }
      .seg button[aria-pressed='true'] {
        background: var(--hh-accent);
        color: var(--hh-on-accent);
      }
      .quiet {
        margin: 0 0 10px;
        font-size: 12.5px;
        color: var(--hh-crit);
      }
      .meters {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .meter {
        display: grid;
        grid-template-columns: 38px minmax(0, 1fr) minmax(0, 1.15fr);
        gap: 12px;
        align-items: center;
        padding: 10px 12px;
        border-radius: 16px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        text-align: left;
        min-width: 0;
      }
      .mi {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: color-mix(in srgb, var(--c) 16%, transparent);
        color: var(--c);
      }
      .mt {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .mt small {
        font-size: 11.5px;
        color: var(--hh-ink-3);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mt b {
        font-size: 20px;
        font-weight: 300;
        letter-spacing: -0.02em;
        white-space: nowrap;
      }
      .mt em {
        font-style: normal;
        font-size: 12px;
        font-weight: 500;
        color: var(--hh-ink-3);
        margin-left: 3px;
      }
      .bars {
        display: grid;
        gap: 2px;
        align-items: end;
        height: 34px;
        min-width: 0;
      }
      .bars i {
        display: block;
        height: 100%;
        border-radius: 2px;
        background: var(--c);
        opacity: 0.85;
        transform-origin: 50% 100%;
        transform: scaleY(var(--h));
        transition: transform 0.6s var(--ease);
      }
      .bars i.future {
        opacity: 0.18;
      }
      .axis-row {
        display: grid;
        grid-template-columns: 38px minmax(0, 1fr) minmax(0, 1.15fr);
        gap: 12px;
        padding: 4px 13px 0;
      }
      .note {
        margin: -4px 0 10px;
        font-size: 12px;
        color: var(--hh-ink-3);
      }
      .axis {
        display: flex;
        justify-content: space-between;
        min-width: 0;
        font-size: 10.5px;
        color: var(--hh-ink-3);
      }
      .foot {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 12px;
        font-size: 12px;
      }
      .net {
        font-weight: 600;
        color: var(--hh-ink-2);
      }
      .net.out {
        color: var(--hh-ok);
      }
      @media (max-width: 420px) {
        .axis {
          display: none;
        }
      }
    `
];
let lt = Fe;
Yt([
  y()
], lt.prototype, "period");
Yt([
  y()
], lt.prototype, "data");
Yt([
  y()
], lt.prototype, "error");
Yt([
  y()
], lt.prototype, "yesterday");
F("hyggehub-usage-card", lt, "HyggeHub Usage", "Electricity in and out, water and gas for today, this week or this month, from your meters.");
var La = Object.defineProperty, Pa = Object.getOwnPropertyDescriptor, At = (a, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? Pa(t, e) : t, n = a.length - 1, r; n >= 0; n--)
    (r = a[n]) && (i = (s ? r(t, e, i) : r(i)) || i);
  return s && i && La(t, e, i), i;
};
const Fa = (a) => a === 0 ? "Clear" : a < 12 ? "Light" : a < 26 ? "Frosted" : "Heavy", Ie = class Ie extends ut {
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
      ${ei.map((s) => {
      const i = gt[s], n = `background:radial-gradient(circle at 18% 22%,${i.blob1},transparent 62%),radial-gradient(circle at 88% 30%,${i.blob2},transparent 58%),radial-gradient(circle at 50% 120%,${i.blob3},transparent 62%),${i.bg}`;
      return h`<button
          class="theme-opt"
          type="button"
          role="radio"
          aria-checked=${s === e}
          title=${i.description}
          @click=${() => this.update_((r) => r[t].theme = s)}
        >
          <span class="tp" style=${n}>
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
      <div class="lbl-row">Theme <span>${gt[e.theme].name}</span></div>
      ${this.renderThemeGrid(t)}
      <div class="lbl-row">Frost <span class="num">${Fa(e.frost)} · ${e.frost}</span></div>
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
    `;
  }
  render() {
    this.tick;
    const t = x.appearance, e = x.resolved, s = this.hass?.states["sun.sun"], i = s ? `Today about ${D(new Date(s.attributes.next_setting), this.hass)} to ${D(new Date(s.attributes.next_rising), this.hass)}` : "Needs the sun integration (sun.sun)", n = this.hass?.user?.name ?? "you", r = [
      { key: "device", title: "Follow my device", desc: "Uses the light or dark setting of each phone, tablet and browser" },
      { key: "sun", title: "Follow the sun", desc: `Night from sunset to sunrise. ${i}` },
      { key: "schedule", title: "Fixed times", desc: "The same hours every day" }
    ];
    return h`
      <div class="bar" ?hidden=${this.embedded}>
        ${this.narrow ? h`<button class="round" type="button" aria-label="Open the sidebar" @click=${() => this.dispatchEvent(new Event("hass-toggle-menu", { bubbles: !0, composed: !0 }))}>
              ${w("menu")}
            </button>` : g}
      </div>
      <div class="shell">
        <section class="hero">
          <div>
            <h1>Appearance</h1>
            <p>Your own day and night look. It’s saved to ${n}’s Home Assistant user, so it follows you to every device you sign in on and never changes what anyone else sees.</p>
          </div>
        </section>

        <div class="status glass">
          <div class="si">${w(e.slot === "night" ? "moon" : "sun")}</div>
          <div class="st">
            <b>Showing your ${e.slot} look · ${gt[e.look.theme].name}${e.slot === "night" && t.night.same ? " (same as day)" : ""}</b>
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
            <div class="card-head">${w("sun")}<h3>Day</h3><span class="pill active"><i></i>Showing now</span></div>
            ${this.renderLook("day")}
          </article>
          <article class="card glass" data-active=${e.slot === "night"}>
            <div class="card-head">
              ${w("moon")}<h3>Night</h3><span class="pill active"><i></i>Showing now</span>
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
            <div class="card-head">${w("moon")}<h3>When night starts</h3></div>
            <div class="opts" role="radiogroup" aria-label="When night starts">
              ${r.map(
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
            <div class="card-head">${w("sliders")}<h3>Motion</h3></div>
            <div class="row">
              <div><b>Card animations</b><small>Spinning fans, falling snow, the equaliser</small></div>
              <button class="switch" type="button" role="switch" aria-checked=${t.motion} aria-label="Card animations" @click=${() => this.update_((o) => o.motion = !o.motion)}></button>
            </div>
            <div class="row">
              <div><b>Reset my appearance</b><small>Back to Fjord by day and Polar night after dark</small></div>
              <button class="btn-text" type="button" @click=${() => this.update_((o) => Object.assign(o, JSON.parse(JSON.stringify(ue))))}>Reset</button>
            </div>
            <p class="note">${w("info")}<span>If a device asks for reduced motion, that always wins. Nothing here changes what other people in the home see.</span></p>
          </article>
        </div>
      </div>
    `;
  }
};
Ie.styles = [
  T,
  O,
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
let Y = Ie;
At([
  Ct({ type: Boolean })
], Y.prototype, "narrow", 2);
At([
  Ct({ type: Boolean, reflect: !0 })
], Y.prototype, "embedded", 2);
At([
  y()
], Y.prototype, "tick", 2);
At([
  y()
], Y.prototype, "saveError", 2);
At([
  Ct({ attribute: !1, noAccessor: !0 })
], Y.prototype, "hass", 1);
customElements.get("hyggehub-appearance-panel") || customElements.define("hyggehub-appearance-panel", Y);
class Ia extends Y {
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
customElements.get("hyggehub-appearance-card") || customElements.define("hyggehub-appearance-card", Ia);
window.customCards = window.customCards || [];
window.customCards.some((a) => a.type === "hyggehub-appearance-card") || window.customCards.push({ type: "hyggehub-appearance-card", name: "HyggeHub Appearance", description: "Your own day and night look, as a card.", preview: !1 });
const Na = "0.1.0", Cs = document.querySelector("home-assistant");
Cs?.hass && x.setHass(Cs.hass);
console.info(`%c HyggeHub %c ${Na} `, "background:#2F6E86;color:#fff;border-radius:4px 0 0 4px;padding:2px 6px", "background:#DCE3E5;color:#18242A;border-radius:0 4px 4px 0;padding:2px 6px");
export {
  Na as VERSION
};
