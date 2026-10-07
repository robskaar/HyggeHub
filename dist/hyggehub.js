const lt = (r) => String(Math.floor(r)).padStart(2, "0"), z = (r) => r?.locale?.language ?? r?.language ?? navigator.language;
function D(r, t) {
  return r.toLocaleTimeString(z(t), { hour: "2-digit", minute: "2-digit" });
}
function ys(r, t) {
  return r.toLocaleDateString(z(t), { weekday: "short", day: "numeric", month: "short" });
}
function Ns(r) {
  if (!r) return "";
  const t = Math.max(0, (Date.now() - new Date(r).getTime()) / 1e3);
  return t < 60 ? "now" : t < 3600 ? `${Math.floor(t / 60)} min` : t < 86400 ? `${Math.floor(t / 3600)} h` : `${Math.floor(t / 86400)} d`;
}
function js(r) {
  const t = (r.getTime() - Date.now()) / 1e3, e = Math.abs(t);
  if (e < 60) return t < 0 ? "just now" : "in a moment";
  let s;
  if (e < 3600) s = `${Math.round(e / 60)} min`;
  else if (e < 86400) {
    const i = Math.floor(e / 3600), a = Math.round(e % 3600 / 60);
    s = a ? `${i} h ${a} min` : `${i} h`;
  } else s = `${Math.round(e / 86400)} d`;
  return t < 0 ? `${s} ago` : `in ${s}`;
}
function Ee(r) {
  if (typeof r != "string") return 0;
  const t = r.split(":").map(Number);
  return t.some(isNaN) ? 0 : t.reduce((e, s) => e * 60 + s, 0);
}
function N(r) {
  if (!r) return;
  const t = parseFloat(r.state);
  return isNaN(t) ? void 0 : t;
}
function nt(r) {
  const t = N(r);
  if (t === void 0) return;
  const e = String(r.attributes.unit_of_measurement ?? "W").toLowerCase();
  return e === "kw" ? t : e === "mw" ? t * 1e3 : t / 1e3;
}
function xs(r, t) {
  if (!t) return "Unavailable";
  if (r?.formatEntityState) return r.formatEntityState(t);
  const e = t.attributes.unit_of_measurement;
  return e ? `${t.state} ${e}` : t.state;
}
function j(r, t = "") {
  return r?.attributes.friendly_name ?? t;
}
function Hs(r) {
  const t = Math.max(0, Math.floor(r / 1e3));
  return { days: Math.floor(t / 86400), hours: Math.floor(t / 3600) % 24, minutes: Math.floor(t / 60) % 60, seconds: t % 60, total: t };
}
const Bs = "0 1px 1px rgba(30,45,55,.04), 0 14px 34px -14px rgba(30,45,55,.22)", Rt = "0 22px 44px -22px rgba(0,0,0,.7)", ct = {
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
    shadow: Bs,
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
    shadow: Rt,
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
    shadow: Rt,
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
    shadow: Rt,
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
}, Rs = Object.keys(ct), Ws = (r) => typeof r == "string" && r in ct, oe = {
  version: 1,
  day: { theme: "fjord", frost: 22, drift: !0 },
  night: { same: !1, theme: "polar", frost: 26, drift: !0 },
  when: "device",
  from: "22:00",
  to: "07:00",
  motion: !0
}, Wt = "hyggehub_appearance", Ut = "hyggehub:appearance:", Us = "https://fonts.googleapis.com/css2?family=Albert+Sans:wght@200;300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap", Ys = '"Albert Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', De = /^([01]\d|2[0-3]):[0-5]\d$/, qs = (r) => JSON.parse(JSON.stringify(r)), Gs = (r, t) => typeof r == "number" && isFinite(r) ? Math.min(40, Math.max(0, Math.round(r))) : t;
function ze(r, t) {
  return {
    theme: Ws(r?.theme) ? r.theme : t.theme,
    frost: Gs(r?.frost, t.frost),
    drift: typeof r?.drift == "boolean" ? r.drift : t.drift
  };
}
function Mt(r) {
  const t = oe, e = r && typeof r == "object" ? r : {};
  return {
    version: 1,
    day: ze(e.day, t.day),
    night: { ...ze(e.night, t.night), same: typeof e.night?.same == "boolean" ? e.night.same : t.night.same },
    when: e.when === "sun" || e.when === "schedule" || e.when === "device" ? e.when : t.when,
    from: De.test(e.from) ? e.from : t.from,
    to: De.test(e.to) ? e.to : t.to,
    motion: typeof e.motion == "boolean" ? e.motion : t.motion
  };
}
const Te = (r) => {
  const [t, e] = r.split(":").map(Number);
  return t * 60 + e;
};
function Oe(r) {
  const t = (e, s, i, a) => `radial-gradient(${e} at ${s} ${i}, ${a} 0%, transparent 70%)`;
  return [
    t("60vmax 60vmax", "6%", "-4%", r.blob1),
    t("52vmax 52vmax", "96%", "16%", r.blob2),
    t("56vmax 46vmax", "42%", "108%", r.blob3),
    t("34vmax 34vmax", "76%", "78%", r.blob4),
    r.bg
  ].join(", ");
}
class Vs extends EventTarget {
  constructor() {
    super(), this.appearance = qs(oe), this.preview = "auto", this.loaded = !1, this.signature = "", this.darkMQ = matchMedia("(prefers-color-scheme: dark)"), this.reducedMQ = matchMedia("(prefers-reduced-motion: reduce)"), this.injectGlobals();
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
    this.appearance = Mt(t), this.writeCache(), this.apply(!0), this.emit(), clearTimeout(this.saveTimer), this.saveTimer = window.setTimeout(() => {
      this.hass?.callWS({ type: "frontend/set_user_data", key: Wt, value: this.appearance }).catch((e) => {
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
      const s = await t.callWS({ type: "frontend/get_user_data", key: Wt });
      this.appearance = Mt(s?.value), this.writeCache();
    } catch (s) {
      console.warn("HyggeHub: could not read appearance, using defaults", s);
    }
    this.loaded = !0, this.apply(!0), this.emit();
    try {
      await this.unsubscribe?.(), this.unsubscribe = await t.connection.subscribeMessage((s) => {
        this.appearance = Mt(s?.value), this.writeCache(), this.apply(!0), this.emit();
      }, { type: "frontend/subscribe_user_data", key: Wt });
    } catch {
    }
  }
  resolve() {
    const t = this.appearance;
    let e;
    const s = this.hass?.themes?.darkMode ?? this.darkMQ.matches;
    if (t.when === "sun") {
      const n = this.hass?.states["sun.sun"];
      if (n) {
        const o = n.state === "below_horizon", l = new Date(o ? n.attributes.next_rising : n.attributes.next_setting);
        e = { slot: o ? "night" : "day", reason: o ? `The sun is down, sunrise at ${D(l, this.hass)}` : `The sun is up, sunset at ${D(l, this.hass)}` };
      } else
        e = { slot: s ? "night" : "day", reason: "sun.sun is not available, so this follows your device" };
    } else if (t.when === "schedule") {
      const n = /* @__PURE__ */ new Date(), o = n.getHours() * 60 + n.getMinutes(), l = Te(t.from), c = Te(t.to), p = l > c ? o >= l || o < c : o >= l && o < c;
      e = { slot: p ? "night" : "day", reason: p ? `Night hours, ${t.from} to ${t.to}` : `Outside night hours (${t.from} to ${t.to})` };
    } else
      e = { slot: s ? "night" : "day", reason: `Your device is in ${s ? "dark" : "light"} mode` };
    const i = this.preview === "auto" ? e.slot : this.preview, a = i === "night" && !t.night.same ? { theme: t.night.theme, frost: t.night.frost, drift: t.night.drift } : { ...t.day };
    return {
      slot: i,
      autoSlot: e.slot,
      look: a,
      palette: ct[a.theme],
      reason: this.preview === "auto" ? e.reason : "Previewing. Nothing is saved until you change a setting.",
      previewing: this.preview !== "auto"
    };
  }
  apply(t = !1) {
    const e = this.resolve();
    this.resolved = e;
    const s = this.motionOn, i = JSON.stringify([e.slot, e.look, s, e.reason]);
    if (!t && i === this.signature) return;
    const a = i !== this.signature;
    this.signature = i;
    const n = e.palette, o = {
      "--hh-bg": n.bg,
      "--hh-surface": n.surface,
      "--hh-ink": n.ink,
      "--hh-ink-2": n.ink2,
      "--hh-ink-3": n.ink3,
      "--hh-glass": n.glass,
      "--hh-glass-strong": n.glassStrong,
      "--hh-glass-press": n.glassPress,
      "--hh-stroke": n.stroke,
      "--hh-line": n.line,
      "--hh-highlight": n.highlight,
      "--hh-shadow": n.shadow,
      "--hh-accent": n.accent,
      "--hh-accent-soft": `color-mix(in srgb, ${n.accent} 16%, transparent)`,
      "--hh-on-accent": n.onAccent,
      "--hh-warm": n.warm,
      "--hh-warm-soft": `color-mix(in srgb, ${n.warm} ${n.dark ? 20 : 24}%, transparent)`,
      "--hh-on-warm": n.onWarm,
      "--hh-ok": n.ok,
      "--hh-warn": n.warn,
      "--hh-crit": n.crit,
      "--hh-particle": n.particle,
      "--hh-blur": `${e.look.frost}px`,
      "--hh-play": s ? "running" : "paused",
      "--hh-font": Ys,
      "--hh-backdrop": Oe(n),
      // Home Assistant's own variables, so views, native cards, the sidebar and dialogs match.
      "--lovelace-background": Oe(n),
      "--primary-background-color": n.bg,
      "--secondary-background-color": n.surface,
      "--card-background-color": n.surface,
      "--primary-text-color": n.ink,
      "--secondary-text-color": n.ink2,
      "--disabled-text-color": n.ink3,
      "--divider-color": n.line,
      "--primary-color": n.accent,
      "--accent-color": n.accent,
      "--text-primary-color": n.onAccent,
      "--state-icon-color": n.ink2,
      "--ha-card-background": n.glassStrong,
      "--ha-card-border-color": n.stroke,
      "--ha-card-border-radius": "26px",
      "--ha-card-box-shadow": n.shadow,
      "--app-header-background-color": n.bg,
      "--app-header-text-color": n.ink,
      "--sidebar-background-color": n.surface,
      "--sidebar-text-color": n.ink2,
      "--sidebar-icon-color": n.ink2,
      "--sidebar-selected-icon-color": n.accent,
      "--sidebar-selected-text-color": n.accent
    }, l = document.documentElement;
    for (const [p, d] of Object.entries(o)) l.style.getPropertyValue(p) !== d && l.style.setProperty(p, d);
    const c = n.dark ? "dark" : "light";
    l.style.colorScheme !== c && (l.style.colorScheme = c), l.classList.remove("hh-drift"), a && this.emit();
  }
  emit() {
    this.dispatchEvent(new Event("change"));
  }
  injectGlobals() {
    if (!document.getElementById("hyggehub-font")) {
      const t = document.createElement("link");
      t.id = "hyggehub-font", t.rel = "stylesheet", t.href = Us, document.head.appendChild(t);
    }
  }
  // A per-device copy so a reload paints the right look before the websocket answers.
  readCache(t) {
    try {
      const e = localStorage.getItem(Ut + t);
      return e ? Mt(JSON.parse(e)) : void 0;
    } catch {
      return;
    }
  }
  writeCache() {
    try {
      const t = JSON.stringify(this.appearance);
      localStorage.setItem(Ut + "last", t), this.userId && localStorage.setItem(Ut + this.userId, t);
    } catch {
    }
  }
}
const Ks = "__hyggehubThemeEngine", k = window[Ks] ??= new Vs();
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Dt = globalThis, le = Dt.ShadowRoot && (Dt.ShadyCSS === void 0 || Dt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ce = Symbol(), Le = /* @__PURE__ */ new WeakMap();
let ws = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== ce) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (le && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Le.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Le.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Xs = (r) => new ws(typeof r == "string" ? r : r + "", void 0, ce), A = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, a) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[a + 1], r[0]);
  return new ws(e, r, ce);
}, Qs = (r, t) => {
  if (le) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = Dt.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, Pe = le ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Xs(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Zs, defineProperty: Js, getOwnPropertyDescriptor: ti, getOwnPropertyNames: ei, getOwnPropertySymbols: si, getPrototypeOf: ii } = Object, Ft = globalThis, Fe = Ft.trustedTypes, ai = Fe ? Fe.emptyScript : "", ni = Ft.reactiveElementPolyfillSupport, mt = (r, t) => r, Tt = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? ai : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, he = (r, t) => !Zs(r, t), Ie = { attribute: !0, type: String, converter: Tt, reflect: !1, useDefault: !1, hasChanged: he };
Symbol.metadata ??= Symbol("metadata"), Ft.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let rt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Ie) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && Js(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: a } = ti(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: i, set(n) {
      const o = i?.call(this);
      a?.call(this, n), this.requestUpdate(t, o, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Ie;
  }
  static _$Ei() {
    if (this.hasOwnProperty(mt("elementProperties"))) return;
    const t = ii(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(mt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(mt("properties"))) {
      const e = this.properties, s = [...ei(e), ...si(e)];
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
      for (const i of s) e.unshift(Pe(i));
    } else t !== void 0 && e.push(Pe(t));
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
    return Qs(t, this.constructor.elementStyles), t;
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
      const a = (s.converter?.toAttribute !== void 0 ? s.converter : Tt).toAttribute(e, s.type);
      this._$Em = t, a == null ? this.removeAttribute(i) : this.setAttribute(i, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const a = s.getPropertyOptions(i), n = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : Tt;
      this._$Em = i;
      const o = n.fromAttribute(e, a.type);
      this[i] = o ?? this._$Ej?.get(i) ?? o, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, a) {
    if (t !== void 0) {
      const n = this.constructor;
      if (i === !1 && (a = this[t]), s ??= n.getPropertyOptions(t), !((s.hasChanged ?? he)(a, e) || s.useDefault && s.reflect && a === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: a }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), a !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [i, a] of this._$Ep) this[i] = a;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, a] of s) {
        const { wrapped: n } = a, o = this[i];
        n !== !0 || this._$AL.has(i) || o === void 0 || this.C(i, void 0, a, o);
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
rt.elementStyles = [], rt.shadowRootOptions = { mode: "open" }, rt[mt("elementProperties")] = /* @__PURE__ */ new Map(), rt[mt("finalized")] = /* @__PURE__ */ new Map(), ni?.({ ReactiveElement: rt }), (Ft.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const de = globalThis, Ne = (r) => r, Ot = de.trustedTypes, je = Ot ? Ot.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, $s = "$lit$", V = `lit$${Math.random().toFixed(9).slice(2)}$`, ks = "?" + V, ri = `<${ks}>`, tt = document, ft = () => tt.createComment(""), bt = (r) => r === null || typeof r != "object" && typeof r != "function", pe = Array.isArray, oi = (r) => pe(r) || typeof r?.[Symbol.iterator] == "function", Yt = `[ 	
\f\r]`, ut = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, He = /-->/g, Be = />/g, X = RegExp(`>|${Yt}(?:([^\\s"'>=/]+)(${Yt}*=${Yt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Re = /'/g, We = /"/g, _s = /^(?:script|style|textarea|title)$/i, Ms = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), h = Ms(1), $ = Ms(2), et = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), Ue = /* @__PURE__ */ new WeakMap(), J = tt.createTreeWalker(tt, 129);
function Cs(r, t) {
  if (!pe(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return je !== void 0 ? je.createHTML(t) : t;
}
const li = (r, t) => {
  const e = r.length - 1, s = [];
  let i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = ut;
  for (let o = 0; o < e; o++) {
    const l = r[o];
    let c, p, d = -1, g = 0;
    for (; g < l.length && (n.lastIndex = g, p = n.exec(l), p !== null); ) g = n.lastIndex, n === ut ? p[1] === "!--" ? n = He : p[1] !== void 0 ? n = Be : p[2] !== void 0 ? (_s.test(p[2]) && (i = RegExp("</" + p[2], "g")), n = X) : p[3] !== void 0 && (n = X) : n === X ? p[0] === ">" ? (n = i ?? ut, d = -1) : p[1] === void 0 ? d = -2 : (d = n.lastIndex - p[2].length, c = p[1], n = p[3] === void 0 ? X : p[3] === '"' ? We : Re) : n === We || n === Re ? n = X : n === He || n === Be ? n = ut : (n = X, i = void 0);
    const f = n === X && r[o + 1].startsWith("/>") ? " " : "";
    a += n === ut ? l + ri : d >= 0 ? (s.push(c), l.slice(0, d) + $s + l.slice(d) + V + f) : l + V + (d === -2 ? o : f);
  }
  return [Cs(r, a + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class vt {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let a = 0, n = 0;
    const o = t.length - 1, l = this.parts, [c, p] = li(t, e);
    if (this.el = vt.createElement(c, s), J.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = J.nextNode()) !== null && l.length < o; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith($s)) {
          const g = p[n++], f = i.getAttribute(d).split(V), m = /([.?@])?(.*)/.exec(g);
          l.push({ type: 1, index: a, name: m[2], strings: f, ctor: m[1] === "." ? hi : m[1] === "?" ? di : m[1] === "@" ? pi : It }), i.removeAttribute(d);
        } else d.startsWith(V) && (l.push({ type: 6, index: a }), i.removeAttribute(d));
        if (_s.test(i.tagName)) {
          const d = i.textContent.split(V), g = d.length - 1;
          if (g > 0) {
            i.textContent = Ot ? Ot.emptyScript : "";
            for (let f = 0; f < g; f++) i.append(d[f], ft()), J.nextNode(), l.push({ type: 2, index: ++a });
            i.append(d[g], ft());
          }
        }
      } else if (i.nodeType === 8) if (i.data === ks) l.push({ type: 2, index: a });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(V, d + 1)) !== -1; ) l.push({ type: 7, index: a }), d += V.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const s = tt.createElement("template");
    return s.innerHTML = t, s;
  }
}
function dt(r, t, e = r, s) {
  if (t === et) return t;
  let i = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const a = bt(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = i : e._$Cl = i), i !== void 0 && (t = dt(r, i._$AS(r, t.values), i, s)), t;
}
let ci = class {
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
    const { el: { content: e }, parts: s } = this._$AD, i = (t?.creationScope ?? tt).importNode(e, !0);
    J.currentNode = i;
    let a = J.nextNode(), n = 0, o = 0, l = s[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let c;
        l.type === 2 ? c = new pt(a, a.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(a, l.name, l.strings, this, t) : l.type === 6 && (c = new ui(a, this, t)), this._$AV.push(c), l = s[++o];
      }
      n !== l?.index && (a = J.nextNode(), n++);
    }
    return J.currentNode = tt, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
};
class pt {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
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
    t = dt(this, t, e), bt(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== et && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : oi(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && bt(this._$AH) ? this._$AA.nextSibling.data = t : this.T(tt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = vt.createElement(Cs(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const a = new ci(i, this), n = a.u(this.options);
      a.p(e), this.T(n), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = Ue.get(t.strings);
    return e === void 0 && Ue.set(t.strings, e = new vt(t)), e;
  }
  k(t) {
    pe(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const a of t) i === e.length ? e.push(s = new pt(this.O(ft()), this.O(ft()), this, this.options)) : s = e[i], s._$AI(a), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = Ne(t).nextSibling;
      Ne(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class It {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, a) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = a, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = u;
  }
  _$AI(t, e = this, s, i) {
    const a = this.strings;
    let n = !1;
    if (a === void 0) t = dt(this, t, e, 0), n = !bt(t) || t !== this._$AH && t !== et, n && (this._$AH = t);
    else {
      const o = t;
      let l, c;
      for (t = a[0], l = 0; l < a.length - 1; l++) c = dt(this, o[s + l], e, l), c === et && (c = this._$AH[l]), n ||= !bt(c) || c !== this._$AH[l], c === u ? t = u : t !== u && (t += (c ?? "") + a[l + 1]), this._$AH[l] = c;
    }
    n && !i && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class hi extends It {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class di extends It {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class pi extends It {
  constructor(t, e, s, i, a) {
    super(t, e, s, i, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = dt(this, t, e, 0) ?? u) === et) return;
    const s = this._$AH, i = t === u && s !== u || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, a = t !== u && (s === u || i);
    i && this.element.removeEventListener(this.name, this, s), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ui {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    dt(this, t);
  }
}
const gi = { I: pt }, mi = de.litHtmlPolyfillSupport;
mi?.(vt, pt), (de.litHtmlVersions ??= []).push("3.3.3");
const fi = (r, t, e) => {
  const s = e?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const a = e?.renderBefore ?? null;
    s._$litPart$ = i = new pt(t.insertBefore(ft(), a), a, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ue = globalThis;
let ht = class extends rt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = fi(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return et;
  }
};
ht._$litElement$ = !0, ht.finalized = !0, ue.litElementHydrateSupport?.({ LitElement: ht });
const bi = ue.litElementPolyfillSupport;
bi?.({ LitElement: ht });
(ue.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const vi = { attribute: !0, type: String, converter: Tt, reflect: !1, hasChanged: he }, yi = (r = vi, t, e) => {
  const { kind: s, metadata: i } = e;
  let a = globalThis.litPropertyMetadata.get(i);
  if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), a.set(e.name, r), s === "accessor") {
    const { name: n } = e;
    return { set(o) {
      const l = t.get.call(this);
      t.set.call(this, o), this.requestUpdate(n, l, r, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(n, void 0, r, o), o;
    } };
  }
  if (s === "setter") {
    const { name: n } = e;
    return function(o) {
      const l = this[n];
      t.call(this, o), this.requestUpdate(n, l, r, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function $t(r) {
  return (t, e) => typeof e == "object" ? yi(r, t, e) : ((s, i, a) => {
    const n = i.hasOwnProperty(a);
    return i.constructor.createProperty(a, s), n ? Object.getOwnPropertyDescriptor(i, a) : void 0;
  })(r, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function y(r) {
  return $t({ ...r, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ss = (r, t, e) => (e.configurable = !0, e.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(r, t, e), e);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function kt(r, t) {
  return (e, s, i) => {
    const a = (n) => n.renderRoot?.querySelector(r) ?? null;
    return Ss(e, s, { get() {
      return a(this);
    } });
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let xi;
function wi(r) {
  return (t, e) => Ss(t, e, { get() {
    return (this.renderRoot ?? (xi ??= document.createDocumentFragment())).querySelectorAll(r);
  } });
}
var $i = Object.defineProperty, ki = Object.getOwnPropertyDescriptor, As = (r, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? ki(t, e) : t, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = (s ? n(t, e, i) : n(i)) || i);
  return s && i && $i(t, e, i), i;
};
const ge = class zt extends ht {
  constructor() {
    super(...arguments), this.held = !1, this.onScreen = !0;
  }
  /** One observer for every card: off-screen cards pause their animations (via --hh-play). */
  static observer() {
    return zt.seen ??= new IntersectionObserver((t) => {
      for (const e of t) {
        const s = e.target;
        s.onScreen = e.isIntersecting, e.isIntersecting ? s.style.removeProperty("--hh-play") : s.style.setProperty("--hh-play", "paused");
      }
    });
  }
  connectedCallback() {
    super.connectedCallback(), zt.observer().observe(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), zt.observer().unobserve(this);
  }
  set hass(t) {
    const e = this._hass;
    this._hass = t, t && k.setHass(t), this.requestUpdate("hass", e);
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
    return xs(this.hass, this.stateOf(t));
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
As([
  y()
], ge.prototype, "config", 2);
As([
  $t({ attribute: !1, noAccessor: !0 })
], ge.prototype, "hass", 1);
let P = ge;
function F(r, t, e, s) {
  customElements.get(r) || customElements.define(r, t), window.customCards = window.customCards || [], window.customCards.some((i) => i.type === r) || window.customCards.push({ type: r, name: e, description: s, preview: !0 });
}
const _i = {
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
}, Mi = {
  play: "M8 5.5v13l10.5-6.5z",
  pause: "M7 5h3.6v14H7zM13.4 5H17v14h-3.6z",
  next: "M6 6l9 6-9 6zM16.5 6h2v12h-2z",
  prev: "M18 6l-9 6 9 6zM5.5 6h2v12h-2z"
}, x = (r, t = "") => $`<svg class="i ${t}" viewBox="0 0 24 24" aria-hidden="true"><path d=${_i[r]}></path></svg>`, qt = (r, t = "") => $`<svg class="i fill ${t}" viewBox="0 0 24 24" aria-hidden="true"><path d=${Mi[r]}></path></svg>`, M = (r, t = "") => r ? h`<ha-icon class=${t} .icon=${r}></ha-icon>` : u, T = A`
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
`, O = A`
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
`, me = class me extends P {
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
    if (!t.length) return u;
    const e = t.filter((i) => i.state === "home").length, s = e === t.length ? "All home" : e === 0 ? "No one home" : `${e} of ${t.length} home`;
    return h`<span class="pill">
      <span class="avatars">
        ${t.map((i) => {
      const a = i.attributes.entity_picture, n = j(i, "?");
      return h`<span class=${i.state === "home" ? "home" : "away"} title=${n}>${a ? h`<img src=${a} alt="" />` : n.charAt(0)}</span>`;
    })}
      </span>
      ${s}
    </span>`;
  }
  render() {
    const t = this.config, e = /* @__PURE__ */ new Date(), s = e.getHours(), i = s < 5 ? "Good night" : s < 12 ? "Good morning" : s < 18 ? "Good afternoon" : "Good evening", a = this.hass?.user?.name?.split(" ")[0], n = t.chips ?? [], o = t.clock || t.greeting || t.date;
    return !o && !n.length && !t.people?.length ? (this.style.display = "none", u) : (this.style.display = "", h`
      <div class="hero">
        ${o ? h`<div>
              ${t.clock ? h`<div class="time num">${lt(s)}:${lt(e.getMinutes())}</div>` : u}
              ${t.greeting || t.date ? h`<p class="greet">
                    ${t.greeting ? h`<b>${i}${a ? `, ${a}` : ""}</b>` : u}${t.greeting && t.date ? " · " : ""}${t.date ? e.toLocaleDateString(z(this.hass), { weekday: "long", day: "numeric", month: "long" }) : u}
                  </p>` : u}
            </div>` : u}
        <div class="chips">
          ${this.peopleChip()}
          ${n.map((l) => {
      const c = this.stateOf(l.entity);
      return h`<button class="pill" type="button" @click=${() => this.moreInfo(l.entity)}>
              ${M(l.icon ?? c?.attributes.icon ?? "mdi:information-outline")}
              ${l.name ? h`<span class="faint">${l.name}</span>` : u}${this.format(l.entity)}
            </button>`;
    })}
        </div>
      </div>
    `);
  }
};
me.styles = [
  T,
  O,
  A`
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
let te = me;
F("hyggehub-header-card", te, "HyggeHub Header", "A slim row of status chips; a clock, greeting and date if you want them.");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ci = { CHILD: 2 }, Es = (r) => (...t) => ({ _$litDirective$: r, values: t });
let Ds = class {
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
const { I: Si } = gi, Ye = (r) => r, qe = () => document.createComment(""), gt = (r, t, e) => {
  const s = r._$AA.parentNode, i = t === void 0 ? r._$AB : t._$AA;
  if (e === void 0) {
    const a = s.insertBefore(qe(), i), n = s.insertBefore(qe(), i);
    e = new Si(a, n, r, r.options);
  } else {
    const a = e._$AB.nextSibling, n = e._$AM, o = n !== r;
    if (o) {
      let l;
      e._$AQ?.(r), e._$AM = r, e._$AP !== void 0 && (l = r._$AU) !== n._$AU && e._$AP(l);
    }
    if (a !== i || o) {
      let l = e._$AA;
      for (; l !== a; ) {
        const c = Ye(l).nextSibling;
        Ye(s).insertBefore(l, i), l = c;
      }
    }
  }
  return e;
}, Q = (r, t, e = r) => (r._$AI(t, e), r), Ai = {}, zs = (r, t = Ai) => r._$AH = t, Ei = (r) => r._$AH, Gt = (r) => {
  r._$AR(), r._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ge = (r, t, e) => {
  const s = /* @__PURE__ */ new Map();
  for (let i = t; i <= e; i++) s.set(r[i], i);
  return s;
}, ee = Es(class extends Ds {
  constructor(r) {
    if (super(r), r.type !== Ci.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(r, t, e) {
    let s;
    e === void 0 ? e = t : t !== void 0 && (s = t);
    const i = [], a = [];
    let n = 0;
    for (const o of r) i[n] = s ? s(o, n) : n, a[n] = e(o, n), n++;
    return { values: a, keys: i };
  }
  render(r, t, e) {
    return this.dt(r, t, e).values;
  }
  update(r, [t, e, s]) {
    const i = Ei(r), { values: a, keys: n } = this.dt(t, e, s);
    if (!Array.isArray(i)) return this.ut = n, a;
    const o = this.ut ??= [], l = [];
    let c, p, d = 0, g = i.length - 1, f = 0, m = a.length - 1;
    for (; d <= g && f <= m; ) if (i[d] === null) d++;
    else if (i[g] === null) g--;
    else if (o[d] === n[f]) l[f] = Q(i[d], a[f]), d++, f++;
    else if (o[g] === n[m]) l[m] = Q(i[g], a[m]), g--, m--;
    else if (o[d] === n[m]) l[m] = Q(i[d], a[m]), gt(r, l[m + 1], i[d]), d++, m--;
    else if (o[g] === n[f]) l[f] = Q(i[g], a[f]), gt(r, i[d], i[g]), g--, f++;
    else if (c === void 0 && (c = Ge(n, f, m), p = Ge(o, d, g)), c.has(o[d])) if (c.has(o[g])) {
      const v = p.get(n[f]), b = v !== void 0 ? i[v] : null;
      if (b === null) {
        const w = gt(r, i[d]);
        Q(w, a[f]), l[f] = w;
      } else l[f] = Q(b, a[f]), gt(r, i[d], b), i[v] = null;
      f++;
    } else Gt(i[g]), g--;
    else Gt(i[d]), d++;
    for (; f <= m; ) {
      const v = gt(r, l[m + 1]);
      Q(v, a[f]), l[f++] = v;
    }
    for (; d <= g; ) {
      const v = i[d++];
      v !== null && Gt(v);
    }
    return this.ut = n, zs(r, l), et;
  }
});
var Di = Object.defineProperty, Nt = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && Di(t, e, i), i;
};
const zi = [
  { match: "login attempt|unauthori", icon: "mdi:shield-alert-outline", severity: "crit" },
  { match: "leak|smoke|fire|flood", icon: "mdi:alert-octagon-outline", severity: "crit" },
  { match: "battery", icon: "mdi:battery-alert-variant-outline", severity: "crit" },
  { match: "laundry|washing|wash|dryer", icon: "mdi:washing-machine", severity: "info" },
  { match: "door|window|open", icon: "mdi:door-open", severity: "warn" },
  { match: "update|upgrade", icon: "mdi:package-up", severity: "info" },
  { match: "delivered|parcel|package", icon: "mdi:package-variant-closed", severity: "ok" },
  { match: "done|finished|complete|ready", icon: "mdi:check-circle-outline", severity: "ok" }
], Ve = { info: "var(--hh-accent)", ok: "var(--hh-ok)", warn: "var(--hh-warn)", crit: "var(--hh-crit)" }, Ke = (r) => r.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`#>]/g, "").replace(/\s+/g, " ").trim(), fe = class fe extends P {
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
    for (const s of [...this.config.rules ?? [], ...zi]) {
      let i = !1;
      try {
        i = new RegExp(s.match, "i").test(e);
      } catch {
        i = e.toLowerCase().includes(s.match.toLowerCase());
      }
      if (i) return { icon: s.icon ?? "mdi:bell-outline", color: Ve[s.severity ?? "info"] };
    }
    return { icon: "mdi:bell-outline", color: Ve.info };
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
    if (t(), await this.updateComplete, !!k.motionOn)
      for (const i of e) {
        if (!i.isConnected || i.classList.contains("leaving")) continue;
        const a = s.get(i), n = i.getBoundingClientRect();
        if (!n.width || !a.width) continue;
        const o = a.left + a.width / 2 - (n.left + n.width / 2), l = a.bottom - n.bottom, c = a.width / n.width;
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
    const i = t.currentTarget, a = t.clientX;
    let n = 0, o = !1;
    i.setPointerCapture(t.pointerId);
    const l = (p) => {
      n = p.clientX - a, !o && Math.abs(n) > 6 && (o = !0, i.classList.add("dragging")), o && (i.style.translate = `${n}px 0`, i.style.opacity = String(Math.max(0.15, 1 - Math.abs(n) / 320)));
    }, c = () => {
      if (i.removeEventListener("pointermove", l), i.removeEventListener("pointerup", c), i.removeEventListener("pointercancel", c), i.classList.remove("dragging"), o && Math.abs(n) > 90) return this.dismiss(e.notification_id, i, Math.sign(n));
      i.style.translate = "", i.style.opacity = "", o || this.toggle();
    };
    i.addEventListener("pointermove", l), i.addEventListener("pointerup", c), i.addEventListener("pointercancel", c);
  }
  render() {
    for (const a of this.leaving) this.notes[a] || this.leaving.delete(a);
    const t = this.list, e = t.filter((a) => !this.leaving.has(a.notification_id)), s = !e.length && this.config.hide_when_empty !== !1;
    if (this.style.display = s ? "none" : "", s) return h``;
    let i = 0;
    return h`
      <div class="head">
        <h2>${this.config.title ?? "Notifications"} <span class="faint num">${e.length || ""}</span></h2>
        ${e.length ? h`<div>
              ${e.length > 1 ? h`<button class="btn-text" type="button" @click=${this.toggle}>${this.open ? "Stack" : "Show all"}</button>` : u}
              <button class="btn-text" type="button" @click=${this.clearAll}>Clear</button>
            </div>` : u}
      </div>
      <div class="stack ${this.open ? "open" : ""}" style="--peeks:${Math.min(Math.max(e.length - 1, 0), 2)}" aria-live="polite">
        ${ee(
      t,
      (a) => a.notification_id,
      (a) => {
        const n = this.lookFor(a), o = this.leaving.has(a.notification_id), l = o ? 0 : Math.min(i++, 3);
        return h`<div
              class="note glass ${o ? "leaving" : ""}"
              data-id=${a.notification_id}
              data-depth=${l}
              tabindex=${l === 0 || this.open ? 0 : -1}
              role="button"
              aria-expanded=${this.open}
              style="--sev:${n.color};z-index:${10 - l}"
              @pointerdown=${(c) => this.onDown(c, a, l)}
              @keydown=${(c) => {
          c.target === c.currentTarget && (c.key === "Enter" || c.key === " " ? (c.preventDefault(), this.toggle()) : (c.key === "Delete" || c.key === "Backspace") && this.dismiss(a.notification_id, c.currentTarget));
        }}
            >
              <div class="ic">${M(n.icon)}</div>
              <div class="body">
                <div class="t"><span>${a.title ? Ke(a.title) : "Home Assistant"}</span><time>${Ns(a.created_at)}</time></div>
                <p>${Ke(a.message)}</p>
                <div class="actions">
                  <button type="button" @click=${(c) => this.dismiss(a.notification_id, c.target.closest(".note"))}>Dismiss</button>
                </div>
              </div>
            </div>`;
      }
    )}
      </div>
      ${!e.length && this.loaded ? h`<div class="empty glass">
            <div class="ic">${x("bell")}</div>
            <div><b>All caught up</b><div class="muted">Nothing needs you right now.</div></div>
          </div>` : u}
      ${e.length ? h`<p class="hint">Tap to ${this.open ? "stack" : "fan out"}, drag sideways to dismiss</p>` : u}
    `;
  }
};
fe.styles = [
  T,
  O,
  A`
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
let st = fe;
Nt([
  y()
], st.prototype, "notes");
Nt([
  y()
], st.prototype, "open");
Nt([
  y()
], st.prototype, "loaded");
Nt([
  kt(".stack")
], st.prototype, "stackEl");
F("hyggehub-notification-stack-card", st, "HyggeHub Notification stack", "Home Assistant notifications as a swipeable, stacked pile.");
var Ti = Object.defineProperty, Ts = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && Ti(t, e, i), i;
};
const Oi = /* @__PURE__ */ new Set(["light", "switch", "input_boolean", "fan", "cover"]), Li = $`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="1.6"></circle><path d="M12 10.4c-.6-4.2.6-6.9 3-6.9 2.6 0 3.5 3.2-1.6 7.7M13.4 13.1c3.4 2.6 4.6 5.3 3.4 7.4-1.3 2.2-4.5 1.4-5.8-5.3M10.6 12.6c-3.9 1.6-6.9 1.3-8-.8-1.3-2.2 1-4.6 7.5-2.4"></path></svg>`, Pi = $`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3.5h18M12 3.5v16"></path><g class="slats"><path d="M5 4v12h14V4M5 8h14M5 12h14"></path></g><circle cx="12" cy="20.5" r=".9"></circle></svg>`, be = class be extends P {
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
    return e === "light" ? "light" : e === "fan" ? "fan" : e === "cover" ? "cover" : e === "switch" && /light|lamp|lampe|lys/i.test(t) ? "light" : Oi.has(e) ? "toggle" : "info";
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
    const t = this.ents, e = t.filter((a) => a.kind === "light"), s = e.filter((a) => this.isOn(a.entity, a.kind)).length, i = e.length ? [s ? `${s} light${s > 1 ? "s" : ""} on` : "Lights off"] : [];
    for (const a of t) {
      const n = this.stateOf(a.entity), o = (a.name ?? j(n, a.entity)).toLowerCase();
      a.kind === "fan" && this.isOn(a.entity, a.kind) && i.push(`${o} running`), a.kind === "cover" && i.push(`${o} ${this.isOn(a.entity, a.kind) ? "open" : "closed"}`), a.entity.startsWith("binary_sensor.") && ["door", "window", "opening", "garage_door"].includes(String(n?.attributes.device_class)) && i.push(`${o} ${n?.state === "on" ? "open" : "closed"}`);
    }
    return i.join(" · ");
  }
  entityIcon(t, e) {
    return t.icon ? M(t.icon) : t.kind === "light" ? x("bulb") : t.kind === "fan" ? Li : t.kind === "cover" ? Pi : M(e?.attributes.icon ?? "mdi:toggle-switch-outline");
  }
  render() {
    const t = this.config, e = this.ents, s = e.some((c) => c.kind === "light" && this.isOn(c.entity, c.kind)), i = N(this.stateOf(t.temperature)), a = N(this.stateOf(t.humidity)), n = this.brightnessPct, o = t.dimmer ? n / 100 : 0.7, l = Math.min(Math.max(e.length, 1), 4);
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
            ${M(t.icon ?? "mdi:home-outline")}
          </button>
          <div class="meta">
            <h3>${t.name}</h3>
            <p class="status">${this.statusLine()}</p>
          </div>
          ${i !== void 0 || a !== void 0 ? h`<button class="climate num" type="button" @click=${() => this.moreInfo(t.temperature ?? t.humidity)}>
                ${i !== void 0 ? h`<b>${i.toFixed(1)}°</b>` : u}
                ${a !== void 0 ? h`<small>${x("drop")}${Math.round(a)}%</small>` : u}
              </button>` : u}
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
                  @contextmenu=${(g) => {
        g.preventDefault(), this.moreInfo(c.entity);
      }}
                >
                  ${this.entityIcon(c, p)}<span>${c.name ?? j(p, c.entity)}</span>
                </button>`;
    })}
            </div>` : u}
        ${t.dimmer ? h`<div class="bri" data-on=${n > 0}>
              <div class="bri-fill"></div>
              <div class="bri-label">${x("bulb")}<span class="num">${n > 0 ? `${n}%` : "Off"}</span></div>
              <input
                type="range"
                min="1"
                max="100"
                .value=${String(Math.max(1, n))}
                aria-label="${t.name} brightness"
                @input=${(c) => this.onDim(c, !1)}
                @change=${(c) => this.onDim(c, !0)}
              />
            </div>` : u}
      </ha-card>
    `;
  }
};
be.styles = [
  T,
  O,
  A`
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
let yt = be;
Ts([
  y()
], yt.prototype, "pending");
Ts([
  y()
], yt.prototype, "dragPct");
F("hyggehub-room-card", yt, "HyggeHub Room", "A room with its lights, fans, blinds, climate and a dimmer.");
var Fi = Object.defineProperty, K = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && Fi(t, e, i), i;
};
const I = {
  home: { label: "Home", icon: "mdi:home-outline", desc: "Doors and windows only", feature: 1, service: "alarm_arm_home" },
  away: { label: "Away", icon: "mdi:walk", desc: "Everything, cameras on", feature: 2, service: "alarm_arm_away" },
  night: { label: "Night", icon: "mdi:weather-night", desc: "Ground floor, bedrooms off", feature: 4, service: "alarm_arm_night" },
  vacation: { label: "Holiday", icon: "mdi:bag-suitcase-outline", desc: "Everything, lights on a random schedule", feature: 32, service: "alarm_arm_vacation" },
  custom_bypass: { label: "Custom", icon: "mdi:shield-edit-outline", desc: "Your own selection of zones", feature: 16, service: "alarm_arm_custom_bypass" }
}, Xe = ["idle", "mode", "code"], se = 46, Ct = 2 * Math.PI * se, ve = class ve extends P {
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
    const s = j(this.stateOf(e[0]), e[0]);
    return e.length === 1 ? `${s} is open` : `${s} and ${e.length - 1} more are open`;
  }
  renderOrb() {
    const t = this.panelState, e = this.armedMode, s = this.delayLeft(), i = (f) => f ? I[f].label.toLowerCase() : "", a = (f) => this.config.mode_descriptions?.[f] ?? I[f].desc;
    let n, o, l, c, p = "disarmed", d = 0, g = !1;
    return t === "arming" || t === "pending" ? (p = t, o = t === "arming" ? "Arming" : "Disarm now", n = s ? h`<span class="secs num">${s.left}</span><span class="w">${o}</span>` : h`${x("shield")}<span class="w">${o}</span>`, l = t === "arming" ? "Tap to cancel" : "Tap to enter your code", c = t === "arming" ? "Leave now, the exit delay is running" : "Someone came in, the alarm goes off when the delay ends", s ? d = Ct * (1 - s.left / s.total) : g = !0) : t === "triggered" ? (p = "triggered", o = "Alarm triggered", n = h`${x("shieldAlert", "pop")}<span class="w">Alarm</span>`, l = "Tap to disarm", c = this.sensorSummary() ?? "The alarm has been triggered") : e ? (p = "armed", o = `Armed ${i(e)}`, n = h`${x("lock", "pop")}<span class="w">${o}</span>`, l = "Tap to disarm", c = I[e] ? a(e) : "") : t === "disarmed" ? (o = "Disarmed", n = h`${x("shield", this.flash ? "pop" : "")}<span class="w">Disarmed</span>`, l = "Tap to arm", c = this.sensorSummary() ?? "Ready to arm") : (p = "unavailable", o = t === "disarming" ? "Disarming" : "Unavailable", n = h`${x("shield")}<span class="w">${o}</span>`, l = "", c = t === "disarming" ? "" : "The alarm panel is not responding"), this.flash = !1, h`
      <button class="orb" type="button" data-visual=${p} ?disabled=${p === "unavailable"} aria-label=${l ? `${o}. ${l}` : o} @click=${this.onOrb}>
        <svg viewBox="0 0 100 100" aria-hidden="true" class=${g ? "spin" : ""}>
          <circle class="bg" cx="50" cy="50" r=${se}></circle>
          <circle class="fg" cx="50" cy="50" r=${se} style="stroke-dasharray:${g ? `${Ct * 0.22} ${Ct}` : Ct};stroke-dashoffset:${d}"></circle>
        </svg>
        <span class="core">${n}</span>
      </button>
      <div class="hint">${l}</div>
      <div class="detail">${c}</div>
    `;
  }
  render() {
    const t = this.config, e = this.panelState, s = e.startsWith("armed_") ? "armed" : e, i = t.name ?? "Alarm", a = Xe.indexOf(this.step), n = (g) => {
      const f = Xe.indexOf(g);
      return f < a ? "before" : f > a ? "after" : "";
    }, o = this.codeFormat === "text", l = !this.codeLength, c = this.codeLength || Math.max(4, this.code.length);
    let p;
    this.step === "mode" ? p = "Choose mode" : this.step === "code" ? p = this.flow === "arm" ? "Enter code" : "" : p = this.config.sensors?.length ? `${this.config.sensors.length} sensors ${this.armedMode ? "armed" : "ready"}` : "";
    const d = this.flow === "arm" && this.step !== "idle" && this.availableModes.length > 1 && this.needsCode("arm");
    return h`
      <ha-card class="glass alarm" data-visual=${s}>
        <div class="head">
          <button class="back" type="button" aria-label="Back" ?hidden=${this.step === "idle"} @click=${this.back}>${x("left")}</button>
          <h3>${this.step === "idle" ? i : this.flow === "arm" ? this.step === "code" && this.mode ? `Arm · ${I[this.mode].label}` : "Arm" : "Disarm"}</h3>
          <div class="right">
            <span>${p}</span>
            ${d ? h`<span class="pips"><i class="on"></i><i class=${this.step === "code" ? "on" : ""}></i></span>` : u}
          </div>
        </div>
        <div class="stage">
          <section class="step ${this.step === "idle" ? "on" : ""}" data-pos=${n("idle")} ?inert=${this.step !== "idle"}>${this.renderOrb()}</section>
          <section class="step ${this.step === "mode" ? "on" : ""}" data-pos=${n("mode")} ?inert=${this.step !== "mode"}>
            <div class="modes">
              ${this.availableModes.map(
      (g) => h`<button class="mode" type="button" @click=${() => this.pickMode(g)}>
                  <span class="mi">${M(I[g].icon)}</span><b>${I[g].label}</b><small>${t.mode_descriptions?.[g] ?? I[g].desc}</small>
                </button>`
    )}
            </div>
          </section>
          <section class="step ${this.step === "code" ? "on" : ""}" data-pos=${n("code")} ?inert=${this.step !== "code"}>
            <div class="prompt" role="status">${this.prompt}</div>
            ${o ? h`<form
                  class="text-code"
                  @submit=${(g) => {
      g.preventDefault(), this.submit();
    }}
                >
                  <input class="code-input" type="password" autocomplete="off" aria-label="Code" .value=${this.code} @input=${(g) => this.code = g.target.value} />
                  <button type="submit" class="ok">OK</button>
                </form>` : h`
                  <div class="dots" aria-hidden="true">${Array.from({ length: c }, (g, f) => h`<i class=${f < this.code.length ? "on" : ""}></i>`)}</div>
                  <div class="keypad">
                    ${["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((g) => h`<button class="key num" type="button" @click=${() => this.press(g)}>${g}</button>`)}
                    ${l ? h`<button class="key util" type="button" @click=${() => this.press("ok")}>OK</button>` : h`<button class="key util" type="button" @click=${() => this.press("cancel")}>Cancel</button>`}
                    <button class="key num" type="button" @click=${() => this.press("0")}>0</button>
                    <button class="key util" type="button" aria-label="Delete digit" @click=${() => this.press("back")}>${x("backspace")}</button>
                  </div>
                `}
          </section>
        </div>
      </ha-card>
    `;
  }
};
ve.styles = [
  T,
  O,
  A`
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
let B = ve;
K([
  y()
], B.prototype, "step");
K([
  y()
], B.prototype, "flow");
K([
  y()
], B.prototype, "mode");
K([
  y()
], B.prototype, "code");
K([
  y()
], B.prototype, "prompt");
K([
  y()
], B.prototype, "busy");
K([
  kt(".text-code, .dots")
], B.prototype, "dotsEl");
K([
  kt(".code-input")
], B.prototype, "codeInput");
F("hyggehub-alarm-card", B, "HyggeHub Alarm", "A step-by-step alarm panel: tap the state to arm or disarm.");
const Qe = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"], ye = class ye extends P {
  constructor() {
    super(...arguments), this.shown = /* @__PURE__ */ new Map();
  }
  static getStubConfig() {
    return { name: "Lofoten", subtitle: "Flight to Bodø", icon: "mdi:image-filter-hdr", target: `${(/* @__PURE__ */ new Date()).getFullYear()}-12-18T09:40`, style: "ring" };
  }
  validateConfig(t) {
    if (!t.name) throw new Error("Give the countdown a `name`.");
    if (!t.target && !t.entity && !t.weekly) throw new Error("Set `target`, `entity` or `weekly`.");
    if (t.weekly && !Qe.includes(String(t.weekly.day).slice(0, 3).toLowerCase())) throw new Error("`weekly.day` must be a weekday, like `tue`.");
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
    const t = this.config, e = /* @__PURE__ */ new Date(), s = {}, i = this.stateOf(t.entity), a = t.entity?.split(".")[0];
    if (i && a === "timer") {
      const o = Ee(i.attributes.duration);
      i.state === "active" && i.attributes.finishes_at ? s.target = new Date(i.attributes.finishes_at) : i.state === "paused" ? s.frozen = Ee(i.attributes.remaining) * 1e3 : s.idleText = "Not running";
      const l = s.frozen ?? (s.target ? s.target.getTime() - e.getTime() : o * 1e3);
      o && (s.progress = 1 - l / (o * 1e3));
    } else if (i && a === "input_datetime")
      if (i.attributes.has_date) s.target = new Date(i.attributes.timestamp * 1e3);
      else {
        const o = new Date(e);
        o.setHours(i.attributes.hour ?? 0, i.attributes.minute ?? 0, i.attributes.second ?? 0, 0), o <= e && o.setDate(o.getDate() + 1), s.target = o;
      }
    else if (i && a === "calendar")
      i.attributes.start_time && (s.target = new Date(String(i.attributes.start_time).replace(" ", "T"))), s.subtitle = i.attributes.message, s.target || (s.idleText = "Nothing coming up");
    else if (i) {
      const o = new Date(i.state);
      isNaN(o.getTime()) ? s.idleText = "No time set" : s.target = o;
    } else if (t.entity)
      s.idleText = `${t.entity} is not available`;
    else if (t.weekly) {
      const [o, l] = (t.weekly.time ?? "00:00").split(":").map(Number), c = Qe.indexOf(String(t.weekly.day).slice(0, 3).toLowerCase()), p = new Date(e.getFullYear(), e.getMonth(), e.getDate(), o, l);
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
    const n = N(this.stateOf(t.value_entity));
    return n !== void 0 && t.value_target && (s.progress = n / t.value_target), s.progress !== void 0 && (s.progress = Math.min(1, Math.max(0, s.progress))), s;
  }
  updated() {
    k.motionOn && this.renderRoot.querySelectorAll("[data-t]").forEach((t) => {
      const e = t.dataset.t, s = t.textContent ?? "";
      this.shown.has(e) && this.shown.get(e) !== s && (t.classList.remove("tick"), t.offsetWidth, t.classList.add("tick")), this.shown.set(e, s);
    });
  }
  whenText(t) {
    if (!t.target) return "";
    const e = ys(t.target, this.hass);
    return t.target.getHours() || t.target.getMinutes() ? `${e}, ${D(t.target, this.hass)}` : e;
  }
  render() {
    const t = this.config, e = this.resolve(), s = e.frozen ?? (e.target ? e.target.getTime() - Date.now() : 0), i = Hs(s), a = !e.idleText && s <= 0;
    return t.style === "compact" ? this.renderCompact(e, i, a) : this.renderRing(e, i, a);
  }
  renderRing(t, e, s) {
    const i = this.config, a = 2 * Math.PI * 52, n = [i.subtitle ?? t.subtitle, this.whenText(t)].filter(Boolean).join(" · ");
    return h`
      <ha-card class="glass ring-card" @click=${() => this.moreInfo(i.entity)}>
        <div class="t-ring">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle class="bg" cx="60" cy="60" r="52"></circle>
            <circle class="fg" cx="60" cy="60" r="52" style="stroke-dasharray:${a};stroke-dashoffset:${a * (1 - (t.progress ?? 0))}"></circle>
          </svg>
          <div class="mid">
            ${s || t.idleText ? h`<span class="ic ${i.animation ?? "none"}">${M(i.icon ?? "mdi:timer-sand-complete")}</span>` : e.days > 0 ? h`<b class="num" data-t="d">${e.days}</b><small>${e.days === 1 ? "day" : "days"}</small>` : h`<b class="num" data-t="h">${e.hours}</b><small>${e.hours === 1 ? "hour" : "hours"}</small>`}
          </div>
        </div>
        <div class="txt">
          <h3>${i.name}</h3>
          ${n ? h`<p>${n}</p>` : u}
          ${t.idleText ? h`<p class="idle">${t.idleText}</p>` : s ? h`<p class="now">${i.done_text ?? "It’s time"}</p>` : h`<div class="clock num">
                  ${e.days > 0 ? h`<div><b data-t="ch">${lt(e.hours)}</b><small>hrs</small></div>` : u}
                  <div><b data-t="cm">${lt(e.minutes)}</b><small>min</small></div>
                  <div><b data-t="cs">${lt(e.seconds)}</b><small>sec</small></div>
                </div>`}
          ${this.renderChips()}
        </div>
      </ha-card>
    `;
  }
  renderCompact(t, e, s) {
    const i = this.config, a = N(this.stateOf(i.value_entity)), n = i.value_unit ?? this.stateOf(i.value_entity)?.attributes.unit_of_measurement ?? "";
    let o;
    t.idleText ? o = h`<span class="small-big">${t.idleText}</span>` : s ? o = h`${i.done_text ?? "Ready"}` : e.days >= 1 ? o = h`<span data-t="d">${e.days}</span><small>${e.days === 1 ? "day" : "days"}</small> <span data-t="h">${e.hours}</span><small>h</small>` : e.hours >= 1 ? o = h`<span data-t="h">${e.hours}</span><small>h</small> <span data-t="m">${e.minutes}</span><small>min</small>` : o = h`<span data-t="m">${e.minutes}</span>:<span data-t="s">${lt(e.seconds)}</span>`;
    const l = t.progress !== void 0 && (i.value_entity || i.entity?.startsWith("timer.") || i.start);
    return h`
      <ha-card class="glass mini" data-done=${s} @click=${() => this.moreInfo(i.entity ?? i.value_entity)}>
        <div class="lbl"><span class="ic ${t.idleText ? "none" : i.animation ?? "none"}">${M(i.icon ?? "mdi:timer-outline")}</span>${i.name}</div>
        <div class="big num">${o}</div>
        <div class="sub faint num">
          ${a !== void 0 && i.value_target ? n.startsWith("°") ? `${Math.round(a)}° of ${i.value_target}${n}` : `${Math.round(a)} of ${i.value_target}${n ? ` ${n}` : ""}` : i.subtitle ?? t.subtitle ?? this.whenText(t)}
        </div>
        ${l ? h`<div class="bar"><i style="width:${(t.progress ?? 0) * 100}%"></i></div>` : u} ${this.renderChips()}
      </ha-card>
    `;
  }
  renderChips() {
    const t = this.config.chips;
    if (!t?.length) return u;
    const e = (s) => s ? ["accent", "ok", "warn", "crit", "warm"].includes(s) ? `var(--hh-${s})` : s : "var(--hh-accent)";
    return h`<div class="chips">${t.map((s) => h`<span class="chip" style="--c:${e(s.color)}">${s.name}</span>`)}</div>`;
  }
};
ye.styles = [
  T,
  O,
  A`
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
let ie = ye;
F("hyggehub-countdown-card", ie, "HyggeHub Countdown", "Count down to a date, a weekly event, a timer or a calendar entry.");
var Ii = Object.defineProperty, W = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && Ii(t, e, i), i;
};
const xe = class xe extends P {
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
      e && k.motionOn && (e.classList.remove("enter", "restored", "pulse"), e.offsetWidth, e.classList.add(...this.fx.cls.split(" "))), this.fx = void 0;
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
    if (!s || !k.motionOn) return e();
    s.style.height = `${s.offsetHeight}px`, s.offsetHeight, s.classList.add("removing"), setTimeout(e, 260);
  }
  setStatus(t, e, s) {
    this.collapse(e.uid, () => {
      this.patch(t, (i) => [{ ...e, status: s }, ...i.filter((a) => a.uid !== e.uid)]), this.fx = { uid: e.uid, cls: s === "needs_action" ? "enter restored" : "enter" }, this.callService("todo", "update_item", { item: e.uid, status: s }, { entity_id: t }).catch(() => this.subsRefresh(t));
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
    const i = this.items[t] ?? [], a = (l) => (l = l.toLowerCase(), l === s ? 0 : l.startsWith(s) ? 1 : l.split(/\s+/).some((c) => c.startsWith(s)) ? 2 : l.includes(s) ? 3 : 9), n = i.filter((l) => l.status === "completed").map((l) => ({ item: l, r: a(l.summary) })).filter((l) => l.r < 9).sort((l, c) => l.r - c.r).slice(0, 4).map((l) => ({ type: "restore", item: l.item, exact: l.r === 0 })), o = i.find((l) => l.status === "needs_action" && l.summary.toLowerCase() === s);
    return o ? n.push({ type: "exists", item: o }) : n.some((l) => l.type === "restore" && l.exact) || n.push({ type: "new", text: e }), n;
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
    this.choose(e, i >= 0 ? s[i] : s.find((a) => a.type === "exists") ?? s.find((a) => a.type === "new"));
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
    const i = t.currentTarget, a = i.parentElement, n = t.clientX, o = t.clientY;
    let l = 0, c;
    i.setPointerCapture(t.pointerId);
    const p = (g) => {
      l = g.clientX - n;
      const f = g.clientY - o;
      if (c || (Math.abs(l) > 8 && Math.abs(l) > Math.abs(f) ? (c = "h", i.classList.add("dragging")) : Math.abs(f) > 8 && (c = "v")), c === "h") {
        const m = Math.abs(l), v = Math.sign(l) * Math.min(150, m < 90 ? m : 90 + (m - 90) * 0.35);
        i.style.transform = `translateX(${v}px)`, a.dataset.reveal = l > 0 ? "done" : "del", a.classList.toggle("armed", m > 80);
      }
    }, d = () => {
      i.removeEventListener("pointermove", p), i.removeEventListener("pointerup", d), i.removeEventListener("pointercancel", d), i.classList.remove("dragging"), i.style.transform = "", a.classList.remove("armed"), setTimeout(() => delete a.dataset.reveal, 300), c === "h" && (l > 80 ? this.setStatus(e, s, s.status === "completed" ? "needs_action" : "completed") : l < -80 && this.removeItem(e, s));
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
    this.track?.scrollTo({ left: t * this.track.clientWidth, behavior: k.motionOn ? "smooth" : "auto" });
  }
  onTrackDown(t) {
    if (t.pointerType !== "mouse" || t.target.closest(".item-fg, input, textarea, button, .suggest")) return;
    const e = this.track, s = t.clientX, i = e.scrollLeft;
    e.setPointerCapture(t.pointerId), e.classList.add("grabbing");
    const a = (o) => e.scrollLeft = i - (o.clientX - s), n = (o) => {
      e.removeEventListener("pointermove", a), e.removeEventListener("pointerup", n), e.classList.remove("grabbing");
      const l = o.clientX - s, c = Math.round(i / e.clientWidth), p = Math.abs(l) > 50 ? c - Math.sign(l) : c;
      this.goPane(Math.max(0, Math.min(this.tabCount - 1, p)));
    };
    e.addEventListener("pointermove", a), e.addEventListener("pointerup", n);
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
    if (!t) return u;
    const e = new Date(t.length === 10 ? `${t}T00:00:00` : t), s = /* @__PURE__ */ new Date();
    s.setHours(0, 0, 0, 0);
    const i = new Date(e);
    i.setHours(0, 0, 0, 0);
    const a = Math.round((i.getTime() - s.getTime()) / 864e5);
    let n;
    return a < 0 ? n = "Overdue" : a === 0 ? n = "Today" : a === 1 ? n = "Tomorrow" : a < 7 ? n = e.toLocaleDateString(z(this.hass), { weekday: "short" }) : n = ys(e, this.hass), h`<span class="due ${a <= 1 ? "soon" : ""}">${n}</span>`;
  }
  renderItem(t, e, s) {
    const i = e.status === "completed", a = s.done_label ?? "Done", n = e.description?.split(`
`)[0];
    return h`<li class="item ${i ? "done" : ""}" data-uid=${e.uid}>
      <div class="item-bg">
        <span class="bg-done">${x(i ? "undo" : "check")}${i ? "Restore" : a}</span>
        <span class="bg-del">Delete${x("trash")}</span>
      </div>
      <div class="item-fg" @pointerdown=${(o) => this.onRowDown(o, t, e)}>
        <button class="check" type="button" aria-label="${i ? "Restore" : a} ${e.summary}" @click=${() => this.setStatus(t, e, i ? "needs_action" : "completed")}>
          ${x("check")}
        </button>
        <span class="txt">${e.summary}</span>
        ${n ? h`<span class="qty">${n}</span>` : u} ${i ? u : this.dueChip(e.due)}
        <button class="del" type="button" aria-label="Delete ${e.summary}" @click=${() => this.removeItem(t, e)}>${x("x")}</button>
      </div>
    </li>`;
  }
  renderSuggestions(t, e) {
    const s = this.suggestions(t);
    if (!s.length) return u;
    const i = (this.query[t] ?? "").trim().toLowerCase(), a = this.selected(t, s), n = (o) => {
      const l = o.toLowerCase().indexOf(i);
      return l < 0 ? o : h`${o.slice(0, l)}<mark>${o.slice(l, l + i.length)}</mark>${o.slice(l + i.length)}`;
    };
    return h`<div class="suggest" role="listbox" aria-label="Suggestions" @pointerdown=${(o) => o.preventDefault()}>
      ${s.some((o) => o.type === "restore") ? h`<div class="s-h">From ${e.done_label ?? "Done"}</div>` : u}
      ${s.map((o, l) => {
      const c = `sug ${l === a ? "sel" : ""}`, p = () => this.choose(t, o);
      return o.type === "restore" ? h`<button type="button" class=${c} role="option" aria-selected=${l === a} @click=${p}>
            <span class="si">${x("undo")}</span><span class="st"><b>${n(o.item.summary)}</b><small>${o.item.description ?? "Completed earlier"}</small></span><em>Restore</em>
          </button>` : o.type === "exists" ? h`<button type="button" class=${c} role="option" aria-selected=${l === a} @click=${p}>
            <span class="si">${x("check")}</span><span class="st"><b>${o.item.summary}</b><small>Already on the list</small></span><em>Show</em>
          </button>` : h`<button type="button" class=${c} role="option" aria-selected=${l === a} @click=${p}>
          <span class="si">${x("plus")}</span><span class="st"><b>Add “${o.text}”</b><small>As a new item</small></span><em>Add</em>
        </button>`;
    })}
    </div>`;
  }
  renderList(t) {
    const e = t.entity, s = t.name ?? j(this.stateOf(e), e), i = this.items[e], a = i?.filter((c) => c.status === "needs_action") ?? [], n = i?.filter((c) => c.status === "completed") ?? [], o = this.closed[e];
    let l;
    return this.failed[e] ? l = h`<li class="empty-row">${this.failed[e]}</li>` : i ? a.length ? l = ee(a, (c) => c.uid, (c) => this.renderItem(e, c, t)) : l = h`<li class="empty-row">Nothing left on ${s.toLowerCase()}</li>` : l = h`<li class="empty-row">Loading ${s.toLowerCase()}…</li>`, h`<section class="pane">
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
        <button type="submit" aria-label="Add">${x("plus")}</button>
      </form>
      ${this.renderSuggestions(e, t)}
      ${n.length ? h`<div class="done-group ${o ? "closed" : ""}">
            <button class="done-h" type="button" aria-expanded=${!o} @click=${() => this.closed = { ...this.closed, [e]: !o }}>
              ${x("chev")}${t.done_label ?? "Done"} <span class="count num">${n.length}</span><span class="rule"></span>
            </button>
            ${o ? u : h`<ul class="items">${ee(n, (c) => c.uid, (c) => this.renderItem(e, c, t))}</ul>`}
          </div>` : u}
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
      ...t.map((s) => ({ name: s.name ?? j(this.stateOf(s.entity), s.entity), count: this.items[s.entity]?.filter((i) => i.status === "needs_action").length })),
      ...this.config.note ? [{ name: this.config.note.name ?? "Note", count: void 0 }] : []
    ];
    return h`
      <ha-card class="glass lists" style="--tabs:${e.length}">
        <div class="tabs" role="tablist">
          <div class="tab-ink"></div>
          ${e.map(
      (s, i) => h`<button class="tab" type="button" role="tab" aria-selected=${i === this.paneIdx} @click=${() => this.goPane(i)}>
              ${s.name}${s.count !== void 0 ? h`<span class="count num">${s.count}</span>` : u}
            </button>`
    )}
        </div>
        <div class="track" @scroll=${this.onTrackScroll} @pointerdown=${this.onTrackDown}>
          ${t.map((s) => this.renderList(s))} ${this.config.note ? this.renderNote() : u}
        </div>
        ${e.length > 1 ? h`<div class="pager">${e.map((s, i) => h`<i class=${i === this.paneIdx ? "on" : ""}></i>`)}</div>` : u}
      </ha-card>
    `;
  }
};
xe.styles = [
  T,
  O,
  A`
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
let L = xe;
W([
  y()
], L.prototype, "items");
W([
  y()
], L.prototype, "failed");
W([
  y()
], L.prototype, "closed");
W([
  y()
], L.prototype, "query");
W([
  y()
], L.prototype, "sel");
W([
  y()
], L.prototype, "paneIdx");
W([
  y()
], L.prototype, "noteDraft");
W([
  y()
], L.prototype, "noteStatus");
W([
  kt(".track")
], L.prototype, "track");
W([
  wi(".pane")
], L.prototype, "panes");
F("hyggehub-lists-card", L, "HyggeHub Lists", "Swipeable to-do lists with a completed group and a shared note.");
var Ni = Object.defineProperty, jt = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && Ni(t, e, i), i;
};
const ji = {
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
}, Hi = {
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
}, Ze = /* @__PURE__ */ new Set(["snowy", "snowy-rainy", "hail"]), Je = /* @__PURE__ */ new Set(["rainy", "pouring", "lightning-rainy"]), Bi = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"], St = (r) => typeof r == "number" ? `${Math.round(r)}°`.replace("-", "−") : "–", we = class we extends P {
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
    super.connectedCallback(), k.addEventListener("change", this.onTheme), this.onTheme();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), k.removeEventListener("change", this.onTheme);
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
    for (const i of this.unsubs) i.then((a) => a()).catch(() => {
    });
    this.subscribedFor = this.config.entity;
    const e = t.attributes.supported_features ?? 0, s = [...e & 2 ? ["hourly"] : [], ...e & 1 ? ["daily"] : []];
    s.includes(this.view) || (this.view = s[0] ?? "daily"), this.unsubs = s.map(
      (i) => this.hass.connection.subscribeMessage((a) => this.forecasts = { ...this.forecasts, [i]: a.forecast ?? [] }, {
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
    const e = j(this.stateOf(this.config.entity));
    return e && !/^(home|hjem|forecast)/i.test(e) ? e : "";
  }
  // ---------- falling snow / rain on a canvas behind the content ----------
  get precipitating() {
    const t = this.stateOf(this.config.entity)?.state ?? "";
    return Ze.has(t) || Je.has(t);
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
    const e = this.precipitating && k.motionOn;
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
    const a = this.stateOf(this.config.entity)?.state ?? "", n = Ze.has(a), o = Je.has(a);
    if (!n && !o) return;
    const l = k.motionOn;
    e.fillStyle = e.strokeStyle = this.particleColor || "rgba(255,255,255,.7)", e.lineWidth = 1.2, e.lineCap = "round";
    for (const c of this.particles)
      l && (n ? (c.y += c.s * 2, c.d += 0.024, c.x += Math.sin(c.d) * 0.5) : (c.y += 12 + c.s * 12, c.x -= 2)), c.y > i + 10 && Object.assign(c, this.spawn(s, i, !1)), c.x < -10 && (c.x = s + 5), e.beginPath(), n ? (e.arc(c.x, c.y, c.r, 0, 6.28), e.fill()) : (e.globalAlpha = 0.55, e.moveTo(c.x, c.y), e.lineTo(c.x - 2, c.y + 9 + c.r * 2), e.stroke(), e.globalAlpha = 1);
  }
  // ---------- render ----------
  daylight() {
    const t = this.stateOf(this.config.sun ?? "sun.sun");
    if (!t) return;
    const e = Date.now(), s = new Date(t.attributes.next_rising).getTime(), i = new Date(t.attributes.next_setting).getTime();
    if (isNaN(s) || isNaN(i)) return;
    let a, n, o;
    t.state === "above_horizon" ? (n = i, a = s - 864e5, o = (e - a) / (n - a)) : (a = s, n = i, o = new Date(s).getDate() === new Date(e).getDate() ? 0 : 1, o === 1 && (a = s - 864e5, n = i - 864e5));
    const l = Math.max(0, n - a);
    return { rise: new Date(a), set: new Date(n), progress: Math.min(1, Math.max(0, o)), hours: Math.floor(l / 36e5), minutes: Math.round(l % 36e5 / 6e4) };
  }
  slotLabel(t) {
    const e = new Date(t.datetime);
    return this.view === "daily" ? (/* @__PURE__ */ new Date()).toDateString() === e.toDateString() ? "Today" : e.toLocaleDateString(z(this.hass), { weekday: "short" }) : Math.abs(e.getTime() - Date.now()) < 30 * 6e4 ? "Now" : e.toLocaleTimeString(z(this.hass), { hour: "2-digit" });
  }
  /** "Today 14–19", "Tomorrow 08–13", "Thu – Tue": what the current page covers. */
  pageLabel(t) {
    if (!t.length) return "";
    const e = new Date(t[0].datetime), s = new Date(t[t.length - 1].datetime), i = z(this.hass);
    if (this.view === "daily") return `${e.toLocaleDateString(i, { weekday: "short", day: "numeric" })} – ${s.toLocaleDateString(i, { weekday: "short", day: "numeric" })}`;
    const a = (o) => {
      const l = Math.round((new Date(o.toDateString()).getTime() - new Date((/* @__PURE__ */ new Date()).toDateString()).getTime()) / 864e5);
      return l === 0 ? "Today" : l === 1 ? "Tomorrow" : o.toLocaleDateString(i, { weekday: "short" });
    }, n = (o) => o.toLocaleTimeString(i, { hour: "2-digit" });
    return a(e) === a(s) ? `${a(e)} ${n(e)}–${n(s)}` : `${a(e)} ${n(e)} – ${a(s)} ${n(s)}`;
  }
  render() {
    const t = this.stateOf(this.config.entity);
    if (!t) return h`<ha-card class="glass"><p class="muted">${this.config.entity} is not available.</p></ha-card>`;
    const e = t.attributes, s = t.state, i = e.wind_speed_unit ?? "m/s", a = typeof e.wind_speed == "number" ? `Wind ${Math.round(e.wind_speed)} ${i}${typeof e.wind_bearing == "number" ? ` ${Bi[Math.round(e.wind_bearing / 45) % 8]}` : ""}` : "", n = typeof e.apparent_temperature == "number" ? `Feels like ${St(e.apparent_temperature)}` : typeof e.humidity == "number" ? `Humidity ${e.humidity}%` : "", o = this.hass?.formatEntityState?.(t) ?? Hi[s] ?? s, l = s === "clear-night", c = !["sunny", "clear-night"].includes(s), p = ["sunny", "partlycloudy"].includes(s), d = this.daylight(), g = this.config.slots ?? 6, f = this.forecasts[this.view] ?? [], m = Math.max(1, Math.ceil(f.length / g)), v = Math.min(this.page, m - 1), b = f.slice(v * g, v * g + g), w = !!this.forecasts.hourly && !!this.forecasts.daily, Y = this.placeName;
    return h`
      <ha-card class="glass weather" @click=${() => this.moreInfo(this.config.entity)}>
        <canvas aria-hidden="true"></canvas>
        <div class="top">
          <span class="place">${Y ? h`${M("mdi:map-marker-outline")}${Y}` : u}</span>
          ${w ? h`<span class="seg" role="group" aria-label="Forecast">
                <button type="button" aria-pressed=${this.view === "hourly"} @click=${(C) => this.setView(C, "hourly")}>Hours</button>
                <button type="button" aria-pressed=${this.view === "daily"} @click=${(C) => this.setView(C, "daily")}>Days</button>
              </span>` : u}
        </div>
        <div class="main">
          <div>
            <div class="temp num">${St(e.temperature)}</div>
            <div class="cond">${o}</div>
            <div class="sub">${[n, a].filter(Boolean).join(" · ")}</div>
          </div>
          <div class="art" aria-hidden="true">
            ${p ? h`<div class="sun"></div>` : u} ${l ? h`<div class="moon"></div>` : u}
            ${c ? h`<div class="cloud"></div>` : u}
          </div>
        </div>
        ${b.length ? h`<div class="pager">
                <button class="pg" type="button" aria-label="Earlier" ?disabled=${v === 0} @click=${(C) => this.turn(C, -1)}>${x("left")}</button>
                <span class="range num">${this.pageLabel(b)}</span>
                <button class="pg next" type="button" aria-label="Later" ?disabled=${v >= m - 1} @click=${(C) => this.turn(C, 1)}>${x("left")}</button>
              </div>
              <div class="slots num" style="grid-template-columns:repeat(${g},1fr)">
                ${b.map(
      (C) => h`<div>
                    <span class="h">${this.slotLabel(C)}</span>${M(ji[C.condition ?? ""] ?? "mdi:weather-cloudy")}<b>${St(C.temperature)}</b>
                    ${this.view === "daily" && typeof C.templow == "number" ? h`<small>${St(C.templow)}</small>` : u}
                  </div>`
    )}
              </div>` : u}
        ${d ? h`<div class="daylight">
              <div class="bar"><i style="width:${d.progress * 100}%"></i></div>
              <div class="row num">
                <span>Sunrise ${D(d.rise, this.hass)}</span><span>${d.hours} h ${d.minutes} min daylight</span><span>Sunset ${D(d.set, this.hass)}</span>
              </div>
            </div>` : u}
      </ha-card>
    `;
  }
};
we.styles = [
  T,
  O,
  A`
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
let it = we;
jt([
  y()
], it.prototype, "forecasts");
jt([
  y()
], it.prototype, "view");
jt([
  y()
], it.prototype, "page");
jt([
  kt("canvas")
], it.prototype, "canvas");
F("hyggehub-weather-card", it, "HyggeHub Weather", "Current weather with falling snow or rain, a forecast row and daylight.");
var Ri = Object.defineProperty, Os = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && Ri(t, e, i), i;
};
const ts = (r) => `${Math.floor(r / 60)}:${String(Math.floor(r % 60)).padStart(2, "0")}`, $e = class $e extends P {
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
    const t = this.current, e = this.stateOf(t), s = e?.attributes ?? {}, i = this.speakers, a = (b) => b.name ?? j(this.stateOf(b.entity), b.entity), n = this.dragVolume ?? (typeof s.volume_level == "number" ? s.volume_level : void 0), o = e?.state === "playing", l = o || e?.state === "paused", c = s.entity_picture, p = c ? c.startsWith("http") ? c : this.hass?.hassUrl(c) ?? c : void 0, { pos: d, dur: g } = this.position(), f = l ? s.media_title ?? "Playing" : "Nothing playing", m = l ? [s.media_artist, s.media_album_name].filter(Boolean).join(" · ") : e ? "Pick something on your speaker" : `${t} is not available`, v = i.length === 1 && this.config.name ? this.config.name : a(i.find((b) => b.entity === t));
    return h`
      <ha-card class="glass media ${o ? "" : "paused"}">
        <button class="art" type="button" aria-label="More details" @click=${() => this.moreInfo(t)}>
          ${p ? h`<img src=${p} alt="" />` : h`<i></i>`}
          ${o ? h`<span class="eq" aria-hidden="true"><b></b><b></b><b></b><b></b></span>` : u}
        </button>
        <div class="meta">
          <div class="src">${x("speaker")} ${v}</div>
          <b>${f}</b><span>${m}</span>
        </div>
        ${l && g ? h`<div class="progress num">
              <span>${ts(d)}</span>
              <button class="track" type="button" aria-label="Seek" @click=${this.seek}><i style="width:${d / g * 100}%"></i></button>
              <span>${ts(g)}</span>
            </div>` : u}
        ${e ? h`<div class="controls">
              <button class="round" type="button" aria-label="Previous track" @click=${() => this.call("media_previous_track")}>${qt("prev")}</button>
              <button class="round play" type="button" aria-label=${o ? "Pause" : "Play"} @click=${() => this.call("media_play_pause")}>
                ${qt(o ? "pause" : "play")}
              </button>
              <button class="round" type="button" aria-label="Next track" @click=${() => this.call("media_next_track")}>${qt("next")}</button>
            </div>` : u}
        ${e && n !== void 0 && this.config.volume !== !1 ? h`<label class="vol" style="--v:${n}">
              <span class="vol-fill"></span>
              <span class="vol-label num"><span>Volume</span><span>${Math.round(n * 100)}%</span></span>
              <input
                type="range"
                min="0"
                max="100"
                .value=${String(Math.round(n * 100))}
                aria-label="Volume"
                @input=${(b) => this.onVolume(b, !1)}
                @change=${(b) => this.onVolume(b, !0)}
              />
            </label>` : u}
        ${i.length > 1 ? h`<div class="speakers">
              ${i.map((b) => {
      const w = this.stateOf(b.entity)?.state;
      return h`<button class="chip" type="button" aria-pressed=${b.entity === t} @click=${() => this.pinned = b.entity}>
                  ${w === "playing" ? h`<span class="live"></span>` : u}${a(b)}
                </button>`;
    })}
            </div>` : u}
      </ha-card>
    `;
  }
};
$e.styles = [
  T,
  O,
  A`
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
let xt = $e;
Os([
  y()
], xt.prototype, "pinned");
Os([
  y()
], xt.prototype, "dragVolume");
F("hyggehub-media-card", xt, "HyggeHub Media", "Now playing, with artwork, a live equaliser and controls.");
const Wi = ["on", "run", "running", "wash", "washing", "main wash", "rinse", "rinsing", "spin", "spinning", "dry", "drying", "active", "in progress"], Ui = ["finished", "end", "done", "complete", "completed"], ke = class ke extends P {
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
    const e = N(t);
    if (e === void 0) return;
    const s = String(t.attributes.unit_of_measurement ?? "min").toLowerCase();
    return s.startsWith("h") ? e * 60 : s.startsWith("s") ? e / 60 : e;
  }
  render() {
    const t = this.config, e = this.stateOf(t.entity), s = (e?.state ?? "unavailable").toLowerCase(), i = N(this.stateOf(t.power_entity)), a = (t.running_states?.map((w) => w.toLowerCase()) ?? Wi).includes(s) || i !== void 0 && i > (t.power_threshold ?? 5), n = Ui.includes(s), o = a ? this.remainingMinutes() : void 0, l = o !== void 0 ? new Date(Date.now() + o * 6e4) : void 0, c = this.stateOf(t.program_entity)?.state, p = t.phases ?? (t.machine === "dryer" ? ["Dry", "Cool down"] : ["Wash", "Rinse", "Spin"]), d = this.stateOf(t.phase_entity)?.state.toLowerCase() ?? "";
    let g = p.findIndex((w) => d.includes(w.toLowerCase()));
    const f = o !== void 0 && t.total_minutes ? Math.min(1, Math.max(0, 1 - o / t.total_minutes)) : void 0;
    g < 0 && a && f !== void 0 && (g = Math.min(p.length - 1, Math.floor(f * p.length)));
    const m = f !== void 0 ? (f * p.length - Math.max(0, g)) * 100 : 50;
    let v;
    a && o !== void 0 ? v = h`<span class="num">${Math.max(1, Math.ceil(o))}</span> min left` : a ? v = h`Running` : n ? v = h`Done` : e ? v = h`Idle` : v = h`Unavailable`;
    const b = [c, a && l ? `done ${D(l, this.hass)}` : n ? "Ready to unload" : ""].filter(Boolean).join(" · ");
    return h`
      <ha-card class="glass">
        <div class="card-h"><h3>${t.name}</h3></div>
        <div class="appliance ${a ? "" : "stopped"} ${t.machine ?? "washer"}" @click=${() => this.moreInfo(t.entity)}>
          <div class="drum" aria-hidden="true">
            ${t.machine === "dryer" ? u : h`<div class="water"></div>`}
            <div class="clothes"></div>
            <div class="shine"></div>
          </div>
          <div class="info">
            <div class="big">${v}</div>
            ${b ? h`<div class="muted detail">${b}</div>` : u}
            ${a || n ? h`<div class="steps">
                    ${p.map((w, Y) => {
      const C = n || Y < g ? "done" : Y === g ? "now" : "";
      return h`<span class=${C} style=${Y === g && !n ? `--p:${m}%` : ""}></span>`;
    })}
                  </div>
                  <div class="labels">${p.map((w) => h`<span>${w}</span>`)}</div>` : u}
          </div>
        </div>
      </ha-card>
    `;
  }
};
ke.styles = [
  T,
  O,
  A`
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
let ae = ke;
F("hyggehub-appliance-card", ae, "HyggeHub Appliance", "A washing machine or dryer with a spinning drum, time left and phases.");
const H = { x: 270, y: 80 }, At = (r) => `${Math.abs(r) < 10 ? Math.abs(r).toFixed(1) : Math.round(Math.abs(r))} kW`, _e = class _e extends P {
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
    const t = this.config, e = nt(this.stateOf(t.solar)) ?? 0, s = (nt(this.stateOf(t.grid)) ?? 0) - (nt(this.stateOf(t.grid_export)) ?? 0), i = nt(this.stateOf(t.battery)) ?? 0, a = nt(this.stateOf(t.home)) ?? Math.max(0, e + s + i), n = a > 0 ? Math.round(Math.max(0, Math.min(1, 1 - Math.max(s, 0) / a)) * 100) : 100, o = [];
    t.solar && o.push({ key: "solar", label: "Solar", kw: e, y: 0, color: "var(--hh-warm)", reverse: !1 }), t.battery && o.push({ key: "battery", label: "Battery", kw: i, y: 0, color: "var(--hh-ok)", reverse: i < 0 }), o.push({ key: "grid", label: s < 0 ? "Export" : "Grid", kw: s, y: 0, color: "var(--hh-accent)", reverse: s < 0 });
    const l = o.length === 1 ? 0 : 100 / (o.length - 1);
    o.forEach((d, g) => d.y = o.length === 1 ? 80 : 30 + g * l);
    const c = this.stateOf(t.battery_soc)?.state, p = (d) => d === "solar" ? "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" : d === "battery" ? "M8 4h8a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM10 2h4M9 14h6M9 10h6" : "M12 2L7 22M12 2l5 20M7.8 9h8.4M6 15h12M9 15l6-6M15 15L9 9";
    return h`
      <ha-card class="glass">
        <div class="card-h">
          <h3>${t.title ?? "Energy now"}</h3>
          <span class="pill"><span class="dot"></span>Self-sufficient ${n}%</span>
        </div>
        <svg viewBox="0 0 320 160" role="img" aria-label=${o.map((d) => `${d.label} ${At(d.kw)}`).join(", ") + `, home ${At(a)}`}>
          ${o.map((d) => {
      const g = `M60 ${d.y} C150 ${d.y} 170 ${H.y} ${H.x - 26} ${H.y}`, f = Math.abs(d.kw) > 0.02, m = Math.max(0.6, 3 - Math.abs(d.kw)).toFixed(2);
      return $`
              <path class="base" d=${g}></path>
              ${f ? $`<path class="flow ${d.reverse ? "rev" : ""}" d=${g} style="stroke:${d.color};animation-duration:${m}s"></path>` : u}
              <circle class="node" cx="40" cy=${d.y} r="20"></circle>
              <svg x="30" y=${d.y - 10} width="20" height="20" viewBox="0 0 24 24" class="glyph" style="stroke:${d.color}"><path d=${p(d.key)}></path></svg>
              <text class="label" x="68" y=${d.y - 8}>${At(d.kw)}</text>
              <text class="sub" x="68" y=${d.y + 16}>${d.key === "battery" && c ? `${d.label} ${Math.round(Number(c))}%` : d.label}</text>
            `;
    })}
          <circle class="node" cx=${H.x} cy=${H.y} r="26"></circle>
          <svg x=${H.x - 12} y=${H.y - 12} width="24" height="24" viewBox="0 0 24 24" class="glyph" style="stroke:var(--hh-ink)"><path d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5"></path></svg>
          <text class="label" x=${H.x} y=${H.y + 46} text-anchor="middle">${At(a)}</text>
          <text class="sub" x=${H.x} y=${H.y + 60} text-anchor="middle">Home</text>
        </svg>
        ${t.extras?.length ? h`<div class="extras num" style="grid-template-columns:repeat(${Math.min(3, t.extras.length)},1fr)">
              ${t.extras.slice(0, 3).map((d) => h`<button type="button" @click=${() => this.moreInfo(d.entity)}><small>${d.name}</small><b>${this.format(d.entity)}</b></button>`)}
            </div>` : u}
      </ha-card>
    `;
  }
};
_e.styles = [
  T,
  O,
  A`
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
let ne = _e;
F("hyggehub-energy-card", ne, "HyggeHub Energy", "Live power flowing between solar, battery, grid and the home.");
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Yi = Es(class extends Ds {
  constructor() {
    super(...arguments), this.key = u;
  }
  render(r, t) {
    return this.key = r, t;
  }
  update(r, [t, e]) {
    return t !== this.key && (zs(r), this.key = t), e;
  }
}), qi = 5 * 6e4, Vt = /* @__PURE__ */ new Map(), es = (r) => r.length === 10 ? { d: /* @__PURE__ */ new Date(`${r}T00:00:00`), allDay: !0 } : { d: new Date(r), allDay: !1 };
function Ls(r, t, e = !1, s = 7) {
  const i = `${[...t].sort().join(",")}|${s}`, a = Vt.get(i);
  if (a && Date.now() - a.at < (e ? 3e4 : qi)) return a.events;
  const n = /* @__PURE__ */ new Date();
  n.setHours(0, 0, 0, 0);
  const o = new Date(n.getTime() + s * 864e5), l = r.callWS({
    type: "call_service",
    domain: "calendar",
    service: "get_events",
    target: { entity_id: t },
    service_data: { start_date_time: n.toISOString(), end_date_time: o.toISOString() },
    return_response: !0
  }).then(
    (c) => Object.values(c?.response ?? {}).flatMap((p) => p.events ?? []).map((p) => {
      const d = es(p.start);
      return { summary: p.summary ?? "", start: d.d, end: es(p.end).d, allDay: d.allDay, location: p.location || void 0, description: p.description || void 0 };
    }).sort((p, d) => p.start.getTime() - d.start.getTime())
  ).catch((c) => (console.warn("HyggeHub: could not read calendars", t, c), Vt.delete(i), []));
  return Vt.set(i, { at: Date.now(), events: l }), l;
}
function Gi(r, t) {
  if (!t) return r;
  const e = t.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return r.filter((s) => {
    const i = `${s.summary} ${s.description ?? ""}`.toLowerCase();
    return e.some((a) => i.includes(a));
  });
}
function re(r, t = /* @__PURE__ */ new Date()) {
  const e = t.getTime(), s = r.filter((a) => a.start.getTime() <= e && a.end.getTime() > e);
  s.sort((a, n) => Number(a.allDay) - Number(n.allDay));
  const i = r.filter((a) => a.start.getTime() > e);
  return { now: s[0], upcoming: i };
}
const Ps = (r) => r?.split(/,|\n/)[0].trim(), ss = {
  brown: "#6b4528",
  "dark-brown": "#3f2a1c",
  "light-brown": "#8f6542",
  blonde: "#d9b26a",
  black: "#231c19",
  red: "#a2502a",
  auburn: "#7e3b22",
  grey: "#a9a6a1"
}, is = {
  blue: ["#a9d2f2", "#3a6ca6"],
  brown: ["#a7733f", "#4f2f15"],
  hazel: ["#9a6831", "#5f7d3c"],
  "green-brown": ["#9a6831", "#5f7d3c"],
  green: ["#a4d08e", "#3d7744"],
  grey: ["#c7cfd5", "#66747f"]
}, as = { light: "#f6d6bd", fair: "#efc4a2", medium: "#d9a07a", tan: "#b97a52", deep: "#7d4f35" }, Vi = { woman: "#7fa38f", man: "#40607a", child: "#e0a94a", baby: "#c8d9ea" }, ns = (r) => {
  const t = r.replace("#", ""), e = t.length === 3 ? t.split("").map((s) => s + s).join("") : t;
  return [0, 2, 4].map((s) => parseInt(e.slice(s, s + 2), 16) || 0);
}, Fs = (r, t, e) => {
  const s = ns(r), i = ns(t);
  return "#" + s.map((a, n) => Math.round(a + (i[n] - a) * e).toString(16).padStart(2, "0")).join("");
}, Z = (r, t) => Fs(r, "#ffffff", t), E = (r, t) => Fs(r, "#000000", t), rs = (r, t, e) => r ? t[r.toLowerCase()] ?? (r.startsWith("#") ? r : e) : e, os = {
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
function Ki(r = {}, t, e = !1) {
  const s = r.preset && r.preset in os ? r.preset : "man", i = os[s], a = rs(r.skin, as, as.fair), n = rs(r.hair, ss, ss.brown), o = r.shirt?.startsWith("#") ? r.shirt : Vi[s], l = r.eyes?.toLowerCase() ?? "brown", c = is[l] ?? (r.eyes?.startsWith("#") ? [Z(r.eyes, 0.45), E(r.eyes, 0.3)] : is.brown), p = E(a, 0.55), d = i.head, g = (_) => `${t}-${_}`, f = (_) => {
    const S = i.eyeY, [R, q] = i.sclera, G = i.iris;
    if (e) return $`<path d="M${_ - R} ${S} Q${_} ${S + q * 0.7} ${_ + R} ${S}" fill="none" stroke=${p} stroke-width="2.4" stroke-linecap="round"></path>`;
    const Bt = _ < 100 ? -1 : 1;
    return $`<g class="eye">
      <ellipse cx=${_} cy=${S} rx=${R} ry=${q} fill="#fdfbf8"></ellipse>
      <ellipse cx=${_} cy=${S - q * 0.55} rx=${R * 0.9} ry=${q * 0.35} fill=${E(a, 0.15)} opacity=".18"></ellipse>
      <circle cx=${_} cy=${S + 0.6} r=${G} fill="url(#${g("iris")})"></circle>
      <circle cx=${_} cy=${S + 0.6} r=${G * 0.46} fill="#16110f"></circle>
      <circle cx=${_ - G * 0.38} cy=${S - G * 0.38} r=${G * 0.3} fill="#fff"></circle>
      <circle cx=${_ + G * 0.32} cy=${S + G * 0.38} r=${G * 0.13} fill="#fff" opacity=".85"></circle>
      <path
        d="M${_ - R * 0.98} ${S - q * 0.12} Q${_} ${S - q * 1.22} ${_ + R * 0.98} ${S - q * 0.12}${s === "woman" ? ` M${_ + Bt * R * 0.9} ${S - q * 0.3} q${Bt * 2.6} ${-1.2} ${Bt * 4} ${-3.6}` : ""}"
        fill="none"
        stroke=${E(n, 0.45)}
        stroke-width=${s === "woman" ? 2.4 : s === "baby" ? 1.2 : 1.6}
        stroke-linecap="round"
        opacity=${s === "baby" ? 0.5 : 0.85}
      ></path>
    </g>`;
  }, m = (_) => {
    const S = i.eyeY - i.sclera[1] - (s === "baby" ? 6 : 5), R = i.sclera[0] + 1;
    return $`<path d="M${_ - R} ${S + 1.5} Q${_} ${S - 3.5} ${_ + R} ${S + 0.5}" fill="none" stroke=${E(n, 0.15)} stroke-width=${i.brow} stroke-linecap="round" opacity=${s === "baby" ? 0.45 : 0.9}></path>`;
  }, v = i.eyeY + (s === "baby" ? 10 : 11), b = i.mouthY, w = i.mouthW, Y = s === "baby" ? $`<path d="M${100 - w} ${b} Q100 ${b + 9} ${100 + w} ${b} Q100 ${b + 2} ${100 - w} ${b} Z" fill="#a9474a"></path>
          <path d="M${100 - w * 0.5} ${b + 3.4} Q100 ${b + 6} ${100 + w * 0.5} ${b + 3.4}" fill="none" stroke="#e58a8a" stroke-width="1.6" stroke-linecap="round"></path>` : s === "woman" ? $`<path d="M${100 - w} ${b} Q100 ${b + 8} ${100 + w} ${b} Q100 ${b + 2.6} ${100 - w} ${b} Z" fill="#c4656a"></path>` : $`<path d="M${100 - w} ${b} Q100 ${b + 7} ${100 + w} ${b}" fill="none" stroke=${p} stroke-width="2.8" stroke-linecap="round"></path>`, C = s === "woman" ? $`<path d="M84 147 Q100 166 116 147" fill=${E(a, 0.08)}></path>` : s === "baby" ? $`<path d="M76 161 Q100 174 124 161" fill="none" stroke=${Z(o, 0.55)} stroke-width="5" stroke-linecap="round"></path>
            <circle cx="100" cy="176" r="2.2" fill=${Z(o, 0.7)}></circle><circle cx="100" cy="184" r="2.2" fill=${Z(o, 0.7)}></circle>` : $`<path d="M${100 - i.neck.w / 2 - 3} ${i.neck.y + i.neck.h - 4} Q100 ${i.neck.y + i.neck.h + 10} ${100 + i.neck.w / 2 + 3} ${i.neck.y + i.neck.h - 4}" fill="none" stroke=${E(o, 0.22)} stroke-width="4" stroke-linecap="round"></path>`;
  return $`<svg class="avatar" viewBox="20 22 160 160" aria-hidden="true">
    <defs>
      <radialGradient id=${g("skin")} cx="40%" cy="34%" r="72%" fx="36%" fy="28%">
        <stop offset="0" stop-color=${Z(a, 0.28)}></stop>
        <stop offset=".6" stop-color=${a}></stop>
        <stop offset="1" stop-color=${E(a, 0.2)}></stop>
      </radialGradient>
      <linearGradient id=${g("neck")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${E(a, 0.28)}></stop>
        <stop offset=".55" stop-color=${E(a, 0.08)}></stop>
      </linearGradient>
      <radialGradient id=${g("hair")} cx="38%" cy="22%" r="85%" fx="34%" fy="18%">
        <stop offset="0" stop-color=${Z(n, 0.3)}></stop>
        <stop offset=".5" stop-color=${n}></stop>
        <stop offset="1" stop-color=${E(n, 0.35)}></stop>
      </radialGradient>
      <linearGradient id=${g("shirt")} x1=".2" y1="0" x2=".8" y2="1">
        <stop offset="0" stop-color=${Z(o, 0.2)}></stop>
        <stop offset="1" stop-color=${E(o, 0.22)}></stop>
      </linearGradient>
      <radialGradient id=${g("iris")} cx="50%" cy="50%" r="50%">
        <stop offset=".35" stop-color=${c[0]}></stop>
        <stop offset="1" stop-color=${c[1]}></stop>
      </radialGradient>
    </defs>
    <g class="figure">
      ${i.hairBack ? $`<path d=${i.hairBack} fill="url(#${g("hair")})"></path>` : u}
      <path d=${i.body} fill="url(#${g("shirt")})"></path>
      <rect x=${100 - i.neck.w / 2} y=${i.neck.y} width=${i.neck.w} height=${i.neck.h} rx=${i.neck.w / 2.4} fill="url(#${g("neck")})"></rect>
      ${C}
      ${i.ears ? $`<ellipse cx=${100 - i.ears.dx} cy=${i.ears.y} rx=${i.ears.rx} ry=${i.ears.ry} fill=${E(a, 0.06)}></ellipse>
            <ellipse cx=${100 + i.ears.dx} cy=${i.ears.y} rx=${i.ears.rx} ry=${i.ears.ry} fill=${E(a, 0.1)}></ellipse>` : u}
      <ellipse cx=${d.cx} cy=${d.cy} rx=${d.rx} ry=${d.ry} fill="url(#${g("skin")})"></ellipse>
      <ellipse cx=${d.cx - d.rx * 0.28} cy=${d.cy - d.ry * 0.38} rx=${d.rx * 0.34} ry=${d.ry * 0.16} fill="#fff" opacity=".16"></ellipse>
      <ellipse cx=${100 - i.eyeDX - 6} cy=${i.cheekY} rx=${s === "baby" ? 9 : 7} ry=${s === "baby" ? 5.5 : 4.2} fill="#ff8a80" opacity=${s === "baby" ? 0.34 : 0.22}></ellipse>
      <ellipse cx=${100 + i.eyeDX + 6} cy=${i.cheekY} rx=${s === "baby" ? 9 : 7} ry=${s === "baby" ? 5.5 : 4.2} fill="#ff8a80" opacity=${s === "baby" ? 0.34 : 0.22}></ellipse>
      ${s === "child" ? $`<g fill=${E(a, 0.35)} opacity=".55"><circle cx="89" cy="111" r="1"></circle><circle cx="93" cy="113" r=".9"></circle><circle cx="107" cy="113" r=".9"></circle><circle cx="111" cy="111" r="1"></circle></g>` : u}
      ${f(100 - i.eyeDX)} ${f(100 + i.eyeDX)} ${m(100 - i.eyeDX)} ${m(100 + i.eyeDX)}
      <path d="M97 ${v} Q100 ${v + 4.5} 103 ${v}" fill="none" stroke=${E(a, 0.28)} stroke-width="2" stroke-linecap="round"></path>
      <ellipse cx="99" cy=${v - 4} rx="2" ry="1.2" fill="#fff" opacity=".35"></ellipse>
      ${Y}
      <path d=${i.hairFront} fill="url(#${g("hair")})"></path>
      ${s === "baby" ? $`<path d="M98 51 C89 45 91 32 102 32 C110 33 111 42 103 44" fill="none" stroke="url(#${g("hair")})" stroke-width="5.5" stroke-linecap="round"></path>` : u}
      <path d=${i.sheen} fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".2"></path>
      ${s === "woman" ? $`<circle cx="60" cy="112" r="2.4" fill="#e8c77a"></circle><circle cx="140" cy="112" r="2.4" fill="#e8c77a"></circle>` : u}
    </g>
  </svg>`;
}
const ls = (r) => {
  const t = r.replace("#", ""), e = t.length === 3 ? t.split("").map((s) => s + s).join("") : t;
  return [0, 2, 4].map((s) => parseInt(e.slice(s, s + 2), 16) || 0);
}, cs = (r, t, e) => {
  const s = ls(r), i = ls(t);
  return "#" + s.map((a, n) => Math.round(a + (i[n] - a) * e).toString(16).padStart(2, "0")).join("");
}, Kt = {
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
function Xi(r) {
  return r ? Kt[r.toLowerCase()] ?? (r.startsWith("#") ? r : Kt["moonstone-grey"]) : Kt["moonstone-grey"];
}
function Qi(r, t, e) {
  const s = cs(r, "#ffffff", 0.35), i = cs(r, "#000000", 0.35), a = (o) => `${t}-${o}`, n = (o) => $`
    <circle cx=${o} cy="85" r="19.5" fill="#1d2023"></circle>
    <circle cx=${o} cy="85" r="12.5" fill="url(#${a("rim")})"></circle>
    <g stroke="#2a2e32" stroke-width="2.4" stroke-linecap="round">
      <path d="M${o} 75.5v19M${o - 9} 82l18 6M${o - 5.6} 92.7l11.2-15.4"></path>
    </g>
    <circle cx=${o} cy="85" r="2.8" fill="#5b636a"></circle>`;
  return $`<svg class="car" viewBox="0 0 248 110" aria-hidden="true">
    <defs>
      <linearGradient id=${a("body")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${s}></stop>
        <stop offset=".45" stop-color=${r}></stop>
        <stop offset="1" stop-color=${i}></stop>
      </linearGradient>
      <linearGradient id=${a("glass")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3b4a55"></stop>
        <stop offset="1" stop-color="#151b20"></stop>
      </linearGradient>
      <radialGradient id=${a("rim")} cx="40%" cy="35%" r="70%">
        <stop offset="0" stop-color="#d9dee2"></stop>
        <stop offset="1" stop-color="#7c858c"></stop>
      </radialGradient>
      <radialGradient id=${a("shadow")} cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#000" stop-opacity=".35"></stop>
        <stop offset="1" stop-color="#000" stop-opacity="0"></stop>
      </radialGradient>
    </defs>
    <ellipse cx="126" cy="104" rx="114" ry="6" fill="url(#${a("shadow")})"></ellipse>
    <path
      d="M14 70C14 60 20 53 32 51L64 46C80 32 100 23 126 22L156 22C176 22 192 30 206 42L220 47C230 50 236 57 236 66L236 78C236 82 233 85 229 85L212 85A23 23 0 0 0 166 85L88 85A23 23 0 0 0 42 85L20 85C16 85 14 82 14 78Z"
      fill="url(#${a("body")})"
    ></path>
    <path d="M18 80.5H40M90 80.5H164M214 80.5H233" stroke="#24282c" stroke-width="7" stroke-linecap="round" opacity=".55"></path>
    <path d="M28 58L222 53" stroke="#fff" stroke-opacity=".28" stroke-width="2" stroke-linecap="round" fill="none"></path>
    <path d="M72 46C88 34 104 27 126 26.5L138 26.5L138 46Z" fill="url(#${a("glass")})"></path>
    <path d="M142 26.5L156 26.5C172 26.5 186 33 198 43L142 46Z" fill="url(#${a("glass")})"></path>
    <path d="M80 41C93 33 106 29.5 122 29" stroke="#fff" stroke-opacity=".25" stroke-width="1.6" stroke-linecap="round" fill="none"></path>
    <rect x="219" y="54" width="16" height="3.2" rx="1.6" fill="#e9f4ff" opacity=".9"></rect>
    <rect x="15" y="56" width="10" height="3.2" rx="1.6" fill="#d23b33" opacity=".85"></rect>
    <path d="M104 63h13M162 62h13" stroke=${i} stroke-width="2" stroke-linecap="round"></path>
    ${n(65)} ${n(189)}
    ${e ? $`<circle cx="38" cy="60" r="4" fill="#7ee0b5"></circle>` : u}
  </svg>`;
}
var Zi = Object.defineProperty, Is = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && Zi(t, e, i), i;
};
let Ji = 0;
const ot = (r) => r.calendar ? [].concat(r.calendar) : [], ta = (r) => [r.entity, r.battery, r.charging, r.distance, r.sleep, ...ot(r), ...(r.stats ?? []).map((t) => t.entity)], hs = (r, t) => (/* @__PURE__ */ new Date()).toDateString() === r.toDateString() ? D(r, t) : r.toLocaleDateString(z(t), { weekday: "long" });
function ea(r, t, e) {
  const s = t.entity ? r?.states[t.entity] : void 0, i = t.sleep ? r?.states[t.sleep] : void 0, a = i?.state === "on", n = e ? re(e).now : void 0;
  let o = "none", l = "", c = s ? `since ${hs(new Date(s.last_changed), r)}` : "", p = !1;
  const d = s && s.state !== "unknown" && s.state !== "unavailable" ? s.state : void 0;
  if (d === "home")
    o = "home", l = "Home";
  else if (d && d !== "not_home")
    o = "zone", l = d;
  else if (n) {
    o = "zone", p = !0;
    const m = Ps(n.location);
    l = m && m.toLowerCase() !== n.summary.toLowerCase() ? `${n.summary} · ${m}` : n.summary, c = n.allDay ? "all day" : `until ${D(n.end, r)}`;
  } else d === "not_home" ? (o = "away", l = "Away") : t.default_location ? (o = t.default_location.toLowerCase() === "home" ? "home" : "zone", l = o === "home" ? "Home" : t.default_location, c = "") : s && (l = "Location unknown");
  if (!p && o !== "home") {
    const m = t.distance ? r?.states[t.distance] : void 0;
    m && N(m) !== void 0 && d && (l += ` · ${xs(r, m)} away`);
  }
  let g = "";
  if (a) {
    const m = (Date.now() - new Date(i.last_changed).getTime()) / 6e4;
    g = m < 60 ? `${Math.max(1, Math.round(m))} min` : `${Math.floor(m / 60)} h ${Math.round(m % 60)} min`, l = `Asleep · ${g}`;
  }
  a ? c = `since ${hs(new Date(i.last_changed), r)}` : o === "none" && (c = "");
  const f = d === "home" && Date.now() - new Date(s.last_changed).getTime() < 10 * 6e4;
  return { presence: o, asleep: a, label: l || "No location", since: c, justArrived: f, sleepFor: g, fromPlan: p };
}
function ds(r, t, e) {
  if (t) return "Now";
  const s = /* @__PURE__ */ new Date(), i = new Date(s.getTime() + 864e5), a = (o, l) => o.toDateString() === l.toDateString(), n = a(r.start, s) ? "" : a(r.start, i) ? "Tomorrow" : r.start.toLocaleDateString(z(e), { weekday: "short" });
  return r.allDay ? n || "Today" : n ? `${n} ${D(r.start, e)}` : D(r.start, e);
}
function ps(r, t) {
  const e = t.battery ? r?.states[t.battery] : void 0, s = N(e);
  if (s === void 0) return;
  const i = t.charging ? r?.states[t.charging]?.state.toLowerCase() : void 0, a = i === "on" || i === "charging" || String(e.attributes.battery_state ?? "").toLowerCase() === "charging";
  return { level: Math.round(s), charging: a };
}
const us = (r, t) => $`<svg class="bat" viewBox="0 0 24 24" aria-hidden="true">
  <rect x="2.5" y="7" width="17" height="10" rx="2.6" fill="none" stroke="currentColor" stroke-width="1.6"></rect>
  <rect x="20.4" y="10" width="2" height="4" rx="1" fill="currentColor"></rect>
  <rect x="4.6" y="9.1" width=${Math.max(0.8, 12.8 * r / 100)} height="5.8" rx="1.3" fill="currentColor"></rect>
  ${t ? $`<path d="M11.6 6.2 8.4 12.4h3.2l-.9 5.4 3.9-6.6h-3.3l1.1-5z" fill="var(--hh-bg)" stroke="currentColor" stroke-width=".9" stroke-linejoin="round"></path>` : u}
</svg>`;
function gs(r, t, e, s) {
  return h`<span class="pwrap" data-presence=${t.presence} data-arrived=${t.justArrived} style="--breathe-delay:${s}s">
    <span class="portrait">${r.picture ? h`<img src=${r.picture} alt="" />` : Ki(r.avatar, e, t.asleep)}</span>
    ${t.asleep ? h`<span class="zz" aria-hidden="true"><i>z</i><i>z</i><i>z</i></span>` : u}
  </span>`;
}
const sa = A`
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
`, ia = 6e4, aa = (r) => [r.battery, r.range, r.charging, r.charging_power, r.time_to_full, r.target, r.plugged, r.location, r.climate, r.lock, r.odometer, ...(r.stats ?? []).map((t) => t.entity)], ms = (r) => {
  if (!r) return !1;
  const t = r.toLowerCase();
  return t === "on" || t === "true" || t === "charging" || t === "connected" || t === "plugged" || t.includes("charging") && !t.includes("not");
}, Me = class Me extends P {
  constructor() {
    super(...arguments), this.events = [], this.view = { kind: "family" }, this.avatarId = `hh-fam${++Ji}`, this.back = () => {
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
    return [...this.config.people.flatMap(ta), ...(this.config.cars ?? []).flatMap(aa)];
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
    const e = this.config.people, s = e.flatMap(ot);
    if (!s.length) return;
    const i = JSON.stringify(e.map((o) => [ot(o), o.calendar_match])), a = t.get("hass"), n = !!a && s.some((o) => a.states[o] !== this.hass.states[o]);
    (i !== this.loadedFor || n) && (this.loadedFor = i, this.loadEvents(n));
  }
  async loadEvents(t) {
    const e = this.hass;
    e && (this.events = await Promise.all(
      this.config.people.map((s) => ot(s).length ? Ls(e, ot(s), t).then((i) => Gi(i, s.calendar_match)) : Promise.resolve(void 0))
    ));
  }
  // ---------- navigation ----------
  open(t) {
    this.view = t, this.armBack();
  }
  /** Back to the family after a minute without a touch, so a wall tablet doesn't stay on one page. */
  armBack() {
    clearTimeout(this.backTimer), this.view.kind !== "family" && (this.backTimer = window.setTimeout(this.back, ia));
  }
  /** Now and then one awake person blinks: a 150 ms class change rather than a never-ending animation. */
  blinkSomeone() {
    if (!k.motionOn || document.hidden || !this.onScreen) return;
    const t = [...this.renderRoot.querySelectorAll(".portrait")].filter((s) => s.querySelector(".eye")), e = t[Math.floor(Math.random() * t.length)];
    e && (e.classList.add("blinking"), setTimeout(() => e.classList.remove("blinking"), 150));
  }
  // ---------- helpers ----------
  name(t) {
    return t.name ?? j(t.entity ? this.stateOf(t.entity) : void 0, "Someone");
  }
  /** "Football · Thu 16:30": the next thing within a day and a half, for the family view. */
  nextUp(t) {
    const e = t ? re(t).upcoming[0] : void 0;
    return !e || e.start.getTime() - Date.now() > 36 * 36e5 ? "" : `${e.summary} · ${ds(e, !1, this.hass)}`;
  }
  statValue(t) {
    const e = this.stateOf(t);
    if (e?.attributes.device_class === "timestamp") {
      const s = new Date(e.state);
      if (!isNaN(s.getTime())) return js(s);
    }
    return this.format(t);
  }
  car(t) {
    const e = N(this.stateOf(t.battery)), s = ms(this.stateOf(t.charging)?.state), i = ms(this.stateOf(t.plugged)?.state) || s, a = nt(this.stateOf(t.charging_power)), n = N(this.stateOf(t.target)), o = this.stateOf(t.time_to_full);
    let l;
    if (o)
      if (o.attributes.device_class === "timestamp") {
        const d = new Date(o.state);
        isNaN(d.getTime()) || (l = D(d, this.hass));
      } else {
        const d = N(o), g = String(o.attributes.unit_of_measurement ?? "min").toLowerCase(), f = d === void 0 ? void 0 : g.startsWith("h") ? d * 60 : d;
        f && f > 0 && (l = D(new Date(Date.now() + f * 6e4), this.hass));
      }
    const c = this.stateOf(t.location)?.state, p = !c || c === "unknown" || c === "unavailable" ? "" : c === "home" ? "Parked at home" : c === "not_home" ? "Away" : `At ${c}`;
    return { level: e, charging: s, plugged: i, power: a, target: n, fullAt: l, where: p, colour: Xi(t.color) };
  }
  // ---------- family view ----------
  renderFamily(t) {
    const e = this.config.people;
    return h`<div class="people">
      ${e.map((s, i) => {
      const a = t[i], n = ps(this.hass, s), o = this.name(s), l = n ? n.charging ? "bat-charging" : n.level <= 20 ? "bat-low" : "" : "", c = this.nextUp(this.events[i]);
      return h`<button
          class="member"
          type="button"
          aria-label="${o}: ${a.label}. Show ${o}'s page"
          data-presence=${a.presence}
          data-asleep=${a.asleep}
          @click=${() => this.tap(() => this.open({ kind: "person", i }))}
          @pointerdown=${() => this.holdStart(() => this.moreInfo(s.entity ?? s.sleep))}
          @pointerup=${this.holdEnd}
          @pointerleave=${this.holdEnd}
          @pointercancel=${this.holdEnd}
        >
          ${gs(s, a, `${this.avatarId}-${i}`, i * -1.6)}
          <b class="name">${o}</b>
          <span class="where"><span class="dot"></span><span class="lbl">${a.asleep ? "Asleep" : a.label.split(" · ")[0]}</span></span>
          ${c ? h`<span class="next" title=${c}>${c}</span>` : u}
          ${n ? h`<span class="mini-bat num ${l}">${us(n.level, n.charging)}${n.level}%</span>` : u}
        </button>`;
    })}
    </div>`;
  }
  // ---------- person page ----------
  renderPerson(t, e) {
    const s = this.config.people[t], i = this.events[t], a = this.name(s), n = ps(this.hass, s), o = n ? n.charging ? "bat-charging" : n.level <= 20 ? "bat-low" : "" : "", l = s.sleep?.startsWith("input_boolean."), { now: c, upcoming: p } = i ? re(i) : { now: void 0, upcoming: [] }, d = [...c ? [{ e: c, isNow: !0 }] : [], ...p.slice(0, Math.max(s.agenda ?? 3, 3)).map((m) => ({ e: m, isNow: !1 }))], g = ot(s).length > 0, f = [
      s.sleep ? h`<button
            class="tile big ${e.asleep ? "sleeping" : ""}"
            type="button"
            aria-pressed=${l ? e.asleep : u}
            @click=${() => l ? this.callService("input_boolean", "toggle", {}, { entity_id: s.sleep }) : this.moreInfo(s.sleep)}
          >
            <span class="ti">${M(e.asleep ? "mdi:sleep" : "mdi:white-balance-sunny")}</span>
            <span class="tt"><small>${l ? e.asleep ? "Tap when awake" : "Tap at bedtime" : "Sleep"}</small><b>${e.asleep ? `Asleep ${e.sleepFor}` : "Awake"}</b></span>
          </button>` : u,
      n ? h`<button class="tile" type="button" @click=${() => this.moreInfo(s.battery)}>
            <span class="ti ${o}">${us(n.level, n.charging)}</span>
            <span class="tt"><small>${n.charging ? "Charging" : s.battery_label ?? "Phone"}</small><b class="num">${n.level}%</b></span>
          </button>` : u,
      ...(s.stats ?? []).map(
        (m) => h`<button class="tile" type="button" @click=${() => this.moreInfo(m.entity)}>
          <span class="ti">${M(m.icon ?? this.stateOf(m.entity)?.attributes.icon ?? "mdi:information-outline")}</span>
          <span class="tt"><small>${m.name ?? j(this.stateOf(m.entity), m.entity)}</small><b>${this.statValue(m.entity)}</b></span>
        </button>`
      )
    ].filter((m) => m !== u);
    return h`<div class="page" data-presence=${e.presence} data-asleep=${e.asleep}>
      <div class="hero">
        <button class="hero-portrait" type="button" aria-label="${a}: details" @click=${() => this.moreInfo(s.entity ?? s.sleep)}>
          ${gs(s, e, `${this.avatarId}-p${t}`, 0)}
        </button>
        <div class="who">
          <h2>${a}</h2>
          <span class="where"><span class="dot"></span>${e.label}${e.fromPlan ? h`<span class="plan" title="From the calendar">${M("mdi:calendar-clock")}</span>` : u}</span>
          ${e.since ? h`<span class="since">${e.since}</span>` : u}
        </div>
      </div>
      <div class="cols">
        ${g ? h`<section class="block">
              <h4>Plan</h4>
              ${i ? d.length ? h`<div class="agenda">
                      ${d.map(({ e: m, isNow: v }) => {
      const b = Ps(m.location), w = [v && !m.allDay ? `until ${D(m.end, this.hass)}` : "", b].filter(Boolean).join(" · ");
      return h`<div class="ev ${v ? "now" : ""}" title=${m.location ?? ""}>
                          <span class="when num">${ds(m, v, this.hass)}</span>
                          <span class="what"><b>${m.summary}</b>${w ? h`<small>${w}</small>` : u}</span>
                        </div>`;
    })}
                    </div>` : h`<p class="nothing">Nothing planned this week</p>` : h`<p class="nothing">Reading the calendar…</p>`}
            </section>` : u}
        ${f.length ? h`<section class="block"><h4>Status</h4><div class="tiles">${f}</div></section>` : u}
      </div>
    </div>`;
  }
  // ---------- car page ----------
  renderCar(t) {
    const e = this.config.cars[t], s = this.car(e), i = s.level ?? 0, a = s.charging ? `Charging${s.power !== void 0 ? ` · ${s.power.toFixed(1)} kW` : ""}` : s.plugged ? "Plugged in, not charging" : s.where || "Parked", n = s.charging && s.fullAt ? `Full at ${s.fullAt}` : s.charging || s.plugged ? s.where : "", o = e.climate ? !["off", "unavailable", "unknown"].includes(this.stateOf(e.climate)?.state ?? "off") : !1, l = this.stateOf(e.lock)?.state, c = l === "locked" || l === "off", p = [
      e.range ? this.tile("mdi:map-marker-distance", "Range", this.format(e.range), e.range) : u,
      e.target ? this.tile("mdi:battery-arrow-up-outline", "Charge limit", this.format(e.target), e.target) : u,
      s.charging && s.fullAt ? this.tile("mdi:clock-outline", "Full at", s.fullAt, e.time_to_full) : u,
      e.plugged ? this.tile(s.plugged ? "mdi:power-plug" : "mdi:power-plug-off-outline", "Cable", s.plugged ? "Plugged in" : "Unplugged", e.plugged) : u,
      e.climate ? h`<button class="tile ${o ? "on" : ""}" type="button" aria-pressed=${o} @click=${() => this.callService("homeassistant", "toggle", {}, { entity_id: e.climate })}>
            <span class="ti">${M("mdi:fan")}</span>
            <span class="tt"><small>Climate</small><b>${o ? "On · tap to stop" : "Off · tap to start"}</b></span>
          </button>` : u,
      e.lock ? this.tile(c ? "mdi:lock-outline" : "mdi:lock-open-variant-outline", "Doors", c ? "Locked" : "Unlocked", e.lock) : u,
      e.odometer ? this.tile("mdi:counter", "Odometer", this.format(e.odometer), e.odometer) : u,
      ...(e.stats ?? []).map((d) => this.tile(d.icon ?? "mdi:information-outline", d.name ?? j(this.stateOf(d.entity), d.entity), this.statValue(d.entity), d.entity))
    ].filter((d) => d !== u);
    return h`<div class="page car-page" data-charging=${s.charging}>
      <div class="hero">
        <div class="car-art">
          ${Qi(s.colour, `${this.avatarId}-car${t}`, s.charging)}
          ${s.charging ? h`<span class="plug-pulse" aria-hidden="true"></span>` : u}
        </div>
        <div class="who">
          <h2>${e.name}</h2>
          <span class="where car-status"><span class="dot"></span>${a}</span>
          ${n ? h`<span class="since">${n}</span>` : u}
        </div>
      </div>
      <button class="charge" type="button" style="--lvl:${i / 100};--target:${(s.target ?? 100) / 100}" @click=${() => this.moreInfo(e.battery)}>
        <span class="charge-bar ${i <= 20 ? "low" : ""}">
          <i class="fill"></i>
          ${s.charging ? h`<i class="sheen"></i>` : u}
          ${s.target !== void 0 && s.target < 100 ? h`<i class="target"></i>` : u}
        </span>
        <span class="charge-row num">
          <b>${s.level !== void 0 ? `${Math.round(i)}%` : "–"}</b>
          ${e.range ? h`<span>${this.format(e.range)}</span>` : u}
        </span>
      </button>
      ${p.length ? h`<div class="tiles car-tiles">${p}</div>` : u}
    </div>`;
  }
  tile(t, e, s, i) {
    return h`<button class="tile" type="button" @click=${() => this.moreInfo(i)}>
      <span class="ti">${M(t)}</span>
      <span class="tt"><small>${e}</small><b>${s}</b></span>
    </button>`;
  }
  // ---------- frame ----------
  render() {
    const t = this.config.people, e = t.map((p, d) => ea(this.hass, p, this.events[d])), s = e.filter((p) => p.presence !== "none"), i = s.filter((p) => p.presence === "home").length, a = s.length ? i === s.length ? "All home" : i === 0 ? "No one home" : `${i} of ${s.length} home` : "", n = this.view, o = this.config.cars ?? [], l = n.kind === "person" ? this.name(t[n.i]) : n.kind === "car" ? o[n.i]?.name : "", c = n.kind === "family" ? "family" : `${n.kind}-${n.i}`;
    return h`<ha-card class="glass family" @pointerdown=${() => this.armBack()}>
      <div class="bar">
        ${n.kind === "family" ? h`<h3>${this.config.title ?? "Family"}</h3>
              ${a ? h`<span class="pill">${a}</span>` : u}` : h`<nav class="crumbs" aria-label="Breadcrumb">
              <button class="back" type="button" @click=${this.back}>${x("left")}<span>${this.config.title ?? "Family"}</span></button>
              <span class="sep" aria-hidden="true">›</span>
              <b aria-current="page">${l}</b>
            </nav>`}
        <span class="spacer"></span>
        ${o.map((p, d) => {
      const g = this.car(p);
      return h`<button
            class="car-chip ${n.kind === "car" && n.i === d ? "current" : ""}"
            type="button"
            data-charging=${g.charging}
            aria-label="${p.name}: ${g.level !== void 0 ? `${Math.round(g.level)}%` : "battery unknown"}${g.charging ? ", charging" : ""}"
            @click=${() => this.open({ kind: "car", i: d })}
          >
            ${M("mdi:car-electric-outline")}<span class="num">${g.level !== void 0 ? `${Math.round(g.level)}%` : "–"}</span>
            ${g.charging ? h`<span class="bolt" aria-hidden="true">${M("mdi:lightning-bolt")}</span>` : u}
          </button>`;
    })}
      </div>
      ${Yi(
      c,
      h`<div class="view">
          ${n.kind === "family" ? this.renderFamily(e) : n.kind === "person" ? this.renderPerson(n.i, e[n.i]) : this.renderCar(n.i)}
        </div>`
    )}
    </ha-card>`;
  }
};
Me.styles = [
  T,
  O,
  sa,
  A`
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
let wt = Me;
Is([
  y()
], wt.prototype, "events");
Is([
  y()
], wt.prototype, "view");
F("hyggehub-family-card", wt, "HyggeHub Family", "Everyone in the home, and the car: tap one for their own page.");
var na = Object.defineProperty, ra = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && na(t, e, i), i;
};
const fs = [
  { name: "Restaffald", match: "rest|residual|general", color: "#6b777d", icon: "mdi:trash-can-outline" },
  { name: "Madaffald", match: "mad|food|bio|organ", color: "#5f8f47", icon: "mdi:food-apple-outline" },
  { name: "Papir", match: "papir|paper", color: "#3e72a8", icon: "mdi:newspaper-variant-outline" },
  { name: "Pap", match: "\\bpap\\b|karton|cardboard", color: "#9a7552", icon: "mdi:package-variant-closed" },
  { name: "Plast", match: "plast|mdk|kartoner|plastic", color: "#8a5fb0", icon: "mdi:bottle-soda-classic-outline" },
  { name: "Glas", match: "glas|glass", color: "#3b8d7c", icon: "mdi:bottle-wine-outline" },
  { name: "Metal", match: "metal|dåse|can", color: "#7f8a93", icon: "mdi:magnet" },
  { name: "Farligt affald", match: "farlig|hazard", color: "#b4423f", icon: "mdi:skull-crossbones-outline" },
  { name: "Tekstil", match: "tekstil|textile", color: "#c0793a", icon: "mdi:tshirt-crew-outline" },
  { name: "Storskrald", match: "storskrald|bulky", color: "#5a5a5a", icon: "mdi:sofa-outline" },
  { name: "Haveaffald", match: "have|garden|green", color: "#6f9a3b", icon: "mdi:leaf" }
], Et = ["#4c7f95", "#a0784a", "#7d6aa8", "#5b8f6e"], bs = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"], Xt = 63, Lt = (r) => new Date(r.getFullYear(), r.getMonth(), r.getDate()), oa = (r) => `${r.getFullYear()}-${r.getMonth()}-${r.getDate()}`, Qt = (r) => Math.round((Lt(r).getTime() - Lt(/* @__PURE__ */ new Date()).getTime()) / 864e5), la = (r, t) => {
  try {
    return new RegExp(r, "i").test(t);
  } catch {
    return t.toLowerCase().includes(r.toLowerCase());
  }
}, ca = (r) => $`<svg class="bin" viewBox="0 0 24 24" aria-hidden="true" style="--c:${r}">
  <path class="lid" d="M4.2 5.6h15.6a1 1 0 0 1 1 1v1.6H3.2V6.6a1 1 0 0 1 1-1zM10 5.6V4.4a.6.6 0 0 1 .6-.6h2.8a.6.6 0 0 1 .6.6v1.2"></path>
  <path class="body" d="M5 8.2h14l-1.3 11.6a1.6 1.6 0 0 1-1.6 1.4H7.9a1.6 1.6 0 0 1-1.6-1.4z"></path>
  <path class="shine" d="M8.2 10.5l.7 8"></path>
  <circle class="wheel" cx="8" cy="21.4" r="1.4"></circle><circle class="wheel" cx="16" cy="21.4" r="1.4"></circle>
</svg>`, Ce = class Ce extends P {
  static getStubConfig(t) {
    const e = Object.keys(t?.states ?? {}).find((s) => s.startsWith("calendar.") && /affald|waste|garbage|renovation/i.test(s));
    return e ? { calendar: e } : { schedule: [{ name: "Restaffald", day: "tue", every_weeks: 2, first: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) }] };
  }
  validateConfig(t) {
    if (!t.calendar && !t.schedule?.length) throw new Error("Set a collection `calendar`, or the rounds under `schedule`.");
    for (const e of t.schedule ?? []) {
      if (!bs.includes(String(e.day).slice(0, 3).toLowerCase())) throw new Error(`"${e.name}": day must be a weekday, like tue.`);
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
    const s = t.get("hass"), i = !!s && e.some((n) => s.states[n] !== this.hass.states[n]), a = e.join(",");
    (a !== this.loadedFor || i) && (this.loadedFor = a, this.load(i));
  }
  async load(t) {
    !this.hass || !this.calendars.length || (this.events = await Ls(this.hass, this.calendars, t, Xt));
  }
  /** The kinds of waste a text names. Unrecognised text becomes its own kind, so nothing is lost. */
  kindsIn(t, e) {
    const s = [...this.config.bins ?? [], ...fs], i = [];
    for (const a of s) {
      if (i.some((o) => o.name === a.name)) continue;
      const n = fs.find((o) => o.name === a.name);
      la(a.match ?? a.name, t) && i.push({
        name: a.name,
        color: a.color ?? n?.color ?? Et[i.length % Et.length],
        icon: a.icon ?? n?.icon ?? "mdi:trash-can-outline"
      });
    }
    return i.length ? i : [{ name: t.trim() || "Collection", color: Et[e % Et.length], icon: "mdi:trash-can-outline" }];
  }
  pickups() {
    const t = /* @__PURE__ */ new Map(), e = (a, n) => {
      const o = oa(a), l = t.get(o) ?? { day: Lt(a), bins: [] };
      for (const c of n) l.bins.some((p) => p.name === c.name) || l.bins.push(c);
      t.set(o, l);
    };
    if (this.calendars.length) {
      if (!this.events) return;
      this.events.forEach((a, n) => {
        if (Qt(a.start) < 0) return;
        const o = this.kindsIn(`${a.summary} ${a.description ?? ""}`, n);
        e(a.start, [{ name: a.summary || o[0].name, color: o[0].color, kinds: o }]);
      });
    }
    const s = Lt(/* @__PURE__ */ new Date()), i = new Date(s.getTime() + Xt * 864e5);
    return (this.config.schedule ?? []).forEach((a, n) => {
      const o = Math.max(1, a.every_weeks ?? 1) * 7 * 864e5, l = bs.indexOf(String(a.day).slice(0, 3).toLowerCase());
      let c = /* @__PURE__ */ new Date(`${a.first}T00:00:00`);
      for (; c.getDay() !== l; ) c = new Date(c.getTime() + 864e5);
      for (c < s && (c = new Date(c.getTime() + Math.ceil((s.getTime() - c.getTime()) / o) * o)); c <= i; c = new Date(c.getTime() + o)) {
        const p = this.kindsIn(a.name, n);
        e(c, [{ name: a.name, color: a.color ?? p[0].color, kinds: p }]);
      }
    }), [...t.values()].sort((a, n) => a.day.getTime() - n.day.getTime());
  }
  whenLabel(t) {
    const e = Qt(t), s = t.toLocaleDateString(z(this.hass), { weekday: "short", day: "numeric", month: "short" });
    return e === 0 ? { big: "Today", small: s } : e === 1 ? { big: "Tomorrow", small: s } : e < 7 ? { big: t.toLocaleDateString(z(this.hass), { weekday: "long" }), small: `in ${e} days · ${t.toLocaleDateString(z(this.hass), { day: "numeric", month: "short" })}` } : { big: s, small: `in ${e} days` };
  }
  render() {
    const t = this.pickups(), e = t?.[0], s = t?.slice(1, 1 + (this.config.upcoming ?? 3)) ?? [], i = e ? Qt(e.day) : -1, a = i === 1 ? "Put them out tonight" : i === 0 && (/* @__PURE__ */ new Date()).getHours() < 12 ? "Collected today" : "";
    return h`<ha-card class="glass bins" data-soon=${i >= 0 && i <= 1} @click=${() => this.moreInfo(this.calendars[0])}>
      <div class="head">
        <h3>${this.config.title ?? "Bins"}</h3>
        ${a ? h`<span class="nudge">${a}</span>` : u}
      </div>
      ${t === void 0 ? h`<p class="quiet">Reading the collection calendar…</p>` : e ? h`
              <div class="next">
                <div class="glyphs">${e.bins.map((n) => ca(n.color))}</div>
                <div class="when">
                  <b>${this.whenLabel(e.day).big}</b>
                  <small class="num">${this.whenLabel(e.day).small}</small>
                </div>
              </div>
              <div class="kinds">
                ${e.bins.map(
      (n) => h`<span class="bin-kinds" role="img" aria-label=${n.name} title=${n.name}>
                    ${n.kinds.map((o) => h`<span class="kind" style="--c:${o.color}" title=${o.name}>${M(o.icon)}</span>`)}
                  </span>`
    )}
              </div>
              ${s.length ? h`<ul class="later">
                    ${s.map(
      (n) => h`<li>
                        <span class="d num">${this.whenLabel(n.day).big === "Tomorrow" ? "Tomorrow" : n.day.toLocaleDateString(z(this.hass), { weekday: "short", day: "numeric", month: "short" })}</span>
                        <span class="dots">
                          ${n.bins.map(
        (o) => h`<span class="bin-kinds small" role="img" aria-label=${o.name} title=${o.name}>
                              ${o.kinds.map((l) => h`<span class="kind" style="--c:${l.color}">${M(l.icon)}</span>`)}
                            </span>`
      )}
                        </span>
                      </li>`
    )}
                  </ul>` : u}
            ` : h`<p class="quiet">No collections in the next ${Math.round(Xt / 7)} weeks</p>`}
    </ha-card>`;
  }
};
Ce.styles = [
  T,
  O,
  A`
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
let Pt = Ce;
ra([
  y()
], Pt.prototype, "events");
F("hyggehub-bins-card", Pt, "HyggeHub Bins", "The next bin collection and which bins go out, from a collection calendar or a schedule.");
var ha = Object.defineProperty, Ht = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && ha(t, e, i), i;
};
const da = {
  import: { icon: "mdi:transmission-tower-import", color: "var(--hh-accent)", label: "Electricity in" },
  export: { icon: "mdi:transmission-tower-export", color: "var(--hh-ok)", label: "Electricity out" },
  water: { icon: "mdi:water-outline", color: "#4a9ad6", label: "Water" },
  gas: { icon: "mdi:fire", color: "var(--hh-warm)", label: "Gas" },
  heat: { icon: "mdi:radiator", color: "var(--hh-crit)", label: "Heating" },
  other: { icon: "mdi:gauge", color: "var(--hh-ink-2)", label: "Meter" }
}, pa = (r, t) => /m³|m3|l$|gal/i.test(t) || /vand|water/i.test(r) ? "water" : /eksport|export|return|feed/i.test(r) ? "export" : /gas/i.test(r) ? "gas" : /varme|heat/i.test(r) ? "heat" : /kwh|wh/i.test(t) ? "import" : "other";
function Zt(r, t) {
  if (r === void 0) return { value: "–", unit: t };
  if (/m³|m3/.test(t) && Math.abs(r) < 10) return { value: String(Math.round(r * 1e3)), unit: "L" };
  const e = Math.abs(r) < 10 ? 2 : Math.abs(r) < 100 ? 1 : 0;
  return { value: r.toFixed(e), unit: t };
}
function Jt(r) {
  const t = /* @__PURE__ */ new Date();
  return t.setHours(0, 0, 0, 0), r === "week" && t.setDate(t.getDate() - (t.getDay() + 6) % 7), r === "month" && t.setDate(1), t;
}
const Se = class Se extends P {
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
    const e = Jt(this.period);
    try {
      let s = await this.fetch(e, /* @__PURE__ */ new Date()), i = !1;
      if (this.period === "day" && !Object.values(s).some((a) => a.upTo)) {
        const a = new Date(e.getTime() - 864e5);
        s = await this.fetch(a, e), i = !0, this.windowStart = a;
      } else this.windowStart = e;
      this.yesterday = i, this.data = s, this.error = "";
    } catch (s) {
      this.error = s?.message ?? "Could not read the meter statistics";
    }
  }
  async fetch(t, e) {
    const s = this.config.meters.map((n) => n.entity), i = await this.hass.callWS({
      type: "recorder/statistics_during_period",
      start_time: t.toISOString(),
      end_time: e.toISOString(),
      statistic_ids: s,
      period: this.period === "day" ? "hour" : "day",
      types: ["change"]
    }), a = {};
    for (const n of s) {
      const o = i?.[n] ?? [], l = o.map((d) => ({ start: new Date(d.start), change: d.change ?? 0 })), c = o.filter((d) => (d.change ?? 0) !== 0), p = c[c.length - 1];
      a[n] = {
        total: o.length ? l.reduce((d, g) => d + g.change, 0) : void 0,
        buckets: l,
        unit: String(this.stateOf(n)?.attributes.unit_of_measurement ?? ""),
        upTo: p ? new Date(p.end) : void 0
      };
    }
    return a;
  }
  setPeriod(t) {
    t !== this.period && (this.period = t);
  }
  /** The bars: one per hour (day view) or per day (week and month), always filling the period. */
  bars(t, e) {
    const s = this.windowStart ?? Jt(this.period), i = this.period === "day" ? 24 : this.period === "week" ? 7 : new Date(s.getFullYear(), s.getMonth() + 1, 0).getDate(), a = this.period === "day" ? 36e5 : 864e5, n = new Array(i).fill(0);
    for (const c of t.buckets) {
      const p = Math.floor((c.start.getTime() - s.getTime()) / a);
      p >= 0 && p < i && (n[p] += Math.max(0, c.change));
    }
    const o = Math.max(...n, 1e-4), l = this.yesterday ? i : Math.floor((Date.now() - s.getTime()) / a);
    return h`<div class="bars" style="--c:${e};grid-template-columns:repeat(${i},1fr)" aria-hidden="true">
      ${n.map((c, p) => h`<i class=${p > l ? "future" : ""} style="--h:${Math.max(c > 0 ? 0.06 : 0.02, c / o)}"></i>`)}
    </div>`;
  }
  axis() {
    if (this.period === "day") return h`<div class="axis"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>`;
    if (this.period === "week") {
      const t = Jt("week");
      return h`<div class="axis">
        ${Array.from({ length: 7 }, (e, s) => new Date(t.getTime() + s * 864e5).toLocaleDateString(z(this.hass), { weekday: "narrow" })).map(
        (e) => h`<span>${e}</span>`
      )}
      </div>`;
    }
    return h`<div class="axis"><span>1</span><span>10</span><span>20</span><span>${new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth() + 1, 0).getDate()}</span></div>`;
  }
  render() {
    const t = this.config.meters.map((l) => {
      const c = this.data[l.entity], p = c?.unit ?? String(this.stateOf(l.entity)?.attributes.unit_of_measurement ?? ""), d = l.kind ?? pa(l.entity, p);
      return { ...l, kind: d, series: c, unit: p, look: da[d] };
    }), e = t.filter((l) => l.kind === "import").reduce((l, c) => l + (c.series?.total ?? 0), 0), s = t.filter((l) => l.kind === "export").reduce((l, c) => l + (c.series?.total ?? 0), 0), i = t.some((l) => l.kind === "import") && t.some((l) => l.kind === "export"), a = e - s, n = t.map((l) => l.series?.upTo).filter((l) => !!l).sort((l, c) => c.getTime() - l.getTime())[0], o = this.period === "day" ? this.yesterday ? "yesterday" : "today" : this.period === "week" ? "this week" : "this month";
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
      ${this.error ? h`<p class="quiet">${this.error}</p>` : u}
      ${this.period === "day" && this.yesterday ? h`<p class="note">Showing yesterday. Today's readings arrive overnight.</p>` : u}
      <div class="meters">
        ${t.map((l) => {
      const c = Zt(l.series?.total, l.unit);
      return h`<button class="meter" type="button" style="--c:${l.color ?? l.look.color}" @click=${() => this.moreInfo(l.entity)}>
            <span class="mi">${M(l.icon ?? l.look.icon)}</span>
            <span class="mt">
              <small>${l.name ?? l.look.label ?? j(this.stateOf(l.entity), l.entity)}</small>
              <b class="num">${c.value}<em>${c.unit}</em></b>
            </span>
            ${l.series ? this.bars(l.series, l.color ?? l.look.color) : h`<span class="bars-placeholder"></span>`}
          </button>`;
    })}
      </div>
      ${t.length ? h`<div class="axis-row"><span></span><span></span>${this.axis()}</div>` : u}
      <div class="foot">
        ${i && (e || s) ? h`<span class="net ${a < 0 ? "out" : ""}">
              ${a < 0 ? `Net exported ${Zt(-a, "kWh").value} kWh ${o}` : `Net use ${Zt(a, "kWh").value} kWh ${o}`}
            </span>` : h`<span></span>`}
        <span class="faint">${n ? `Readings up to ${D(n, this.hass)}` : Object.keys(this.data).length ? `No readings ${o} yet` : "Reading the meters…"}</span>
      </div>
    </ha-card>`;
  }
};
Se.styles = [
  T,
  O,
  A`
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
let at = Se;
Ht([
  y()
], at.prototype, "period");
Ht([
  y()
], at.prototype, "data");
Ht([
  y()
], at.prototype, "error");
Ht([
  y()
], at.prototype, "yesterday");
F("hyggehub-usage-card", at, "HyggeHub Usage", "Electricity in and out, water and gas for today, this week or this month, from your meters.");
var ua = Object.defineProperty, ga = Object.getOwnPropertyDescriptor, _t = (r, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? ga(t, e) : t, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = (s ? n(t, e, i) : n(i)) || i);
  return s && i && ua(t, e, i), i;
};
const ma = (r) => r === 0 ? "Clear" : r < 12 ? "Light" : r < 26 ? "Frosted" : "Heavy", Ae = class Ae extends ht {
  constructor() {
    super(...arguments), this.narrow = !1, this.embedded = !1, this.tick = 0, this.saveError = "", this.onEngine = () => this.tick++, this.onSaveError = (t) => this.saveError = t.detail?.message ?? "Your changes could not be saved.";
  }
  set hass(t) {
    const e = this._hass;
    this._hass = t, t && k.setHass(t), (!e || e.user !== t?.user || e.states["sun.sun"] !== t?.states["sun.sun"] || e.themes !== t?.themes) && this.requestUpdate("hass", e);
  }
  get hass() {
    return this._hass;
  }
  connectedCallback() {
    super.connectedCallback(), k.addEventListener("change", this.onEngine), k.addEventListener("save-error", this.onSaveError);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), k.removeEventListener("change", this.onEngine), k.removeEventListener("save-error", this.onSaveError), k.preview !== "auto" && k.setPreview("auto");
  }
  update_(t) {
    const e = JSON.parse(JSON.stringify(k.appearance));
    t(e), this.saveError = "", k.save(e);
  }
  slotLook(t) {
    const e = k.appearance;
    return t === "day" ? e.day : e.night;
  }
  renderThemeGrid(t) {
    const e = this.slotLook(t).theme;
    return h`<div class="theme-grid" role="radiogroup" aria-label="${t} theme">
      ${Rs.map((s) => {
      const i = ct[s], a = `background:radial-gradient(circle at 18% 22%,${i.blob1},transparent 62%),radial-gradient(circle at 88% 30%,${i.blob2},transparent 58%),radial-gradient(circle at 50% 120%,${i.blob3},transparent 62%),${i.bg}`;
      return h`<button
          class="theme-opt"
          type="button"
          role="radio"
          aria-checked=${s === e}
          title=${i.description}
          @click=${() => this.update_((n) => n[t].theme = s)}
        >
          <span class="tp" style=${a}>
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
      <div class="lbl-row">Theme <span>${ct[e.theme].name}</span></div>
      ${this.renderThemeGrid(t)}
      <div class="lbl-row">Frost <span class="num">${ma(e.frost)} · ${e.frost}</span></div>
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
    const t = k.appearance, e = k.resolved, s = this.hass?.states["sun.sun"], i = s ? `Today about ${D(new Date(s.attributes.next_setting), this.hass)} to ${D(new Date(s.attributes.next_rising), this.hass)}` : "Needs the sun integration (sun.sun)", a = this.hass?.user?.name ?? "you", n = [
      { key: "device", title: "Follow my device", desc: "Uses the light or dark setting of each phone, tablet and browser" },
      { key: "sun", title: "Follow the sun", desc: `Night from sunset to sunrise. ${i}` },
      { key: "schedule", title: "Fixed times", desc: "The same hours every day" }
    ];
    return h`
      <div class="bar" ?hidden=${this.embedded}>
        ${this.narrow ? h`<button class="round" type="button" aria-label="Open the sidebar" @click=${() => this.dispatchEvent(new Event("hass-toggle-menu", { bubbles: !0, composed: !0 }))}>
              ${x("menu")}
            </button>` : u}
      </div>
      <div class="shell">
        <section class="hero">
          <div>
            <h1>Appearance</h1>
            <p>Your own day and night look. It’s saved to ${a}’s Home Assistant user, so it follows you to every device you sign in on and never changes what anyone else sees.</p>
          </div>
        </section>

        <div class="status glass">
          <div class="si">${x(e.slot === "night" ? "moon" : "sun")}</div>
          <div class="st">
            <b>Showing your ${e.slot} look · ${ct[e.look.theme].name}${e.slot === "night" && t.night.same ? " (same as day)" : ""}</b>
            <span>${e.reason}</span>
          </div>
          <div class="seg" role="group" aria-label="Preview">
            ${["auto", "day", "night"].map(
      (o) => h`<button type="button" aria-pressed=${k.preview === o} @click=${() => k.setPreview(o)}>${o === "auto" ? "Auto" : o === "day" ? "Day" : "Night"}</button>`
    )}
          </div>
        </div>
        ${this.saveError ? h`<p class="error" role="alert">${this.saveError}</p>` : u}

        <div class="grid">
          <article class="card glass" data-active=${e.slot === "day"}>
            <div class="card-head">${x("sun")}<h3>Day</h3><span class="pill active"><i></i>Showing now</span></div>
            ${this.renderLook("day")}
          </article>
          <article class="card glass" data-active=${e.slot === "night"}>
            <div class="card-head">
              ${x("moon")}<h3>Night</h3><span class="pill active"><i></i>Showing now</span>
              <label class="push">
                Same as day
                <button class="switch" type="button" role="switch" aria-checked=${t.night.same} @click=${() => this.update_((o) => o.night.same = !o.night.same)}></button>
              </label>
            </div>
            ${t.night.same ? h`<p class="same">Night uses your day look. Turn off “Same as day” to choose another.</p>` : u}
            <div class="body ${t.night.same ? "off" : ""}" ?inert=${t.night.same}>${this.renderLook("night")}</div>
          </article>
        </div>

        <div class="grid">
          <article class="card glass">
            <div class="card-head">${x("moon")}<h3>When night starts</h3></div>
            <div class="opts" role="radiogroup" aria-label="When night starts">
              ${n.map(
      (o) => h`<div>
                  <button class="opt" type="button" role="radio" aria-checked=${t.when === o.key} @click=${() => this.update_((l) => l.when = o.key)}>
                    <span class="radio"></span><span class="ot"><b>${o.title}</b><small>${o.desc}</small></span>
                  </button>
                  ${o.key === "schedule" ? h`<div class="times">
                        <label>From <input type="time" .value=${t.from} ?disabled=${t.when !== "schedule"} @change=${(l) => this.update_((c) => c.from = l.target.value || c.from)} /></label>
                        <label>to <input type="time" .value=${t.to} ?disabled=${t.when !== "schedule"} @change=${(l) => this.update_((c) => c.to = l.target.value || c.to)} /></label>
                      </div>` : u}
                </div>`
    )}
            </div>
          </article>
          <article class="card glass">
            <div class="card-head">${x("sliders")}<h3>Motion</h3></div>
            <div class="row">
              <div><b>Card animations</b><small>Spinning fans, falling snow, the washing drum, the equaliser</small></div>
              <button class="switch" type="button" role="switch" aria-checked=${t.motion} aria-label="Card animations" @click=${() => this.update_((o) => o.motion = !o.motion)}></button>
            </div>
            <div class="row">
              <div><b>Reset my appearance</b><small>Back to Fjord by day and Polar night after dark</small></div>
              <button class="btn-text" type="button" @click=${() => this.update_((o) => Object.assign(o, JSON.parse(JSON.stringify(oe))))}>Reset</button>
            </div>
            <p class="note">${x("info")}<span>If a device asks for reduced motion, that always wins. Nothing here changes what other people in the home see.</span></p>
          </article>
        </div>
      </div>
    `;
  }
};
Ae.styles = [
  T,
  O,
  A`
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
let U = Ae;
_t([
  $t({ type: Boolean })
], U.prototype, "narrow", 2);
_t([
  $t({ type: Boolean, reflect: !0 })
], U.prototype, "embedded", 2);
_t([
  y()
], U.prototype, "tick", 2);
_t([
  y()
], U.prototype, "saveError", 2);
_t([
  $t({ attribute: !1, noAccessor: !0 })
], U.prototype, "hass", 1);
customElements.get("hyggehub-appearance-panel") || customElements.define("hyggehub-appearance-panel", U);
class fa extends U {
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
customElements.get("hyggehub-appearance-card") || customElements.define("hyggehub-appearance-card", fa);
window.customCards = window.customCards || [];
window.customCards.some((r) => r.type === "hyggehub-appearance-card") || window.customCards.push({ type: "hyggehub-appearance-card", name: "HyggeHub Appearance", description: "Your own day and night look, as a card.", preview: !1 });
const ba = "0.1.0", vs = document.querySelector("home-assistant");
vs?.hass && k.setHass(vs.hass);
console.info(`%c HyggeHub %c ${ba} `, "background:#2F6E86;color:#fff;border-radius:4px 0 0 4px;padding:2px 6px", "background:#DCE3E5;color:#18242A;border-radius:0 4px 4px 0;padding:2px 6px");
export {
  ba as VERSION
};
