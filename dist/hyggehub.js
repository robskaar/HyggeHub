const mt = (r) => String(Math.floor(r)).padStart(2, "0"), C = (r) => r?.locale?.language ?? r?.language ?? navigator.language;
function D(r, t) {
  return r.toLocaleTimeString(C(t), { hour: "2-digit", minute: "2-digit" });
}
function ft(r, t) {
  return r.toLocaleDateString(C(t), { weekday: "short", day: "numeric", month: "short" });
}
function Ei(r) {
  if (!r) return "";
  const t = Math.max(0, (Date.now() - new Date(r).getTime()) / 1e3);
  return t < 60 ? "now" : t < 3600 ? `${Math.floor(t / 60)} min` : t < 86400 ? `${Math.floor(t / 3600)} h` : `${Math.floor(t / 86400)} d`;
}
function Ai(r) {
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
function cs(r) {
  if (typeof r != "string") return 0;
  const t = r.split(":").map(Number);
  return t.some(isNaN) ? 0 : t.reduce((e, s) => e * 60 + s, 0);
}
function H(r) {
  if (!r) return;
  const t = parseFloat(r.state);
  return isNaN(t) ? void 0 : t;
}
function j(r) {
  const t = H(r);
  if (t === void 0) return;
  const e = String(r.attributes.unit_of_measurement ?? "W").toLowerCase();
  return e === "kw" ? t : e === "mw" ? t * 1e3 : t / 1e3;
}
function De(r, t) {
  if (!t) return "Unavailable";
  if (r?.formatEntityState) return r.formatEntityState(t);
  const e = t.attributes.unit_of_measurement;
  return e ? `${t.state} ${e}` : t.state;
}
function I(r, t = "") {
  return r?.attributes.friendly_name ?? t;
}
function Js(r) {
  const t = Math.max(0, Math.floor(r / 1e3));
  return { days: Math.floor(t / 86400), hours: Math.floor(t / 3600) % 24, minutes: Math.floor(t / 60) % 60, seconds: t % 60, total: t };
}
const zi = "0 1px 1px rgba(30,45,55,.04), 0 14px 34px -14px rgba(30,45,55,.22)", ce = "0 22px 44px -22px rgba(0,0,0,.7)", bt = {
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
    shadow: zi,
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
    shadow: ce,
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
    shadow: ce,
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
    shadow: ce,
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
}, Ti = Object.keys(bt), Di = (r) => typeof r == "string" && r in bt, Oe = {
  version: 1,
  day: { theme: "fjord", frost: 22, drift: !0 },
  night: { same: !1, theme: "polar", frost: 26, drift: !0 },
  when: "device",
  from: "22:00",
  to: "07:00",
  motion: !0
}, he = "hyggehub_appearance", de = "hyggehub:appearance:", Oi = "https://fonts.googleapis.com/css2?family=Albert+Sans:wght@200;300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap", Li = '"Albert Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', hs = /^([01]\d|2[0-3]):[0-5]\d$/, Pi = (r) => JSON.parse(JSON.stringify(r)), Ii = (r, t) => typeof r == "number" && isFinite(r) ? Math.min(40, Math.max(0, Math.round(r))) : t;
function ds(r, t) {
  return {
    theme: Di(r?.theme) ? r.theme : t.theme,
    frost: Ii(r?.frost, t.frost),
    drift: typeof r?.drift == "boolean" ? r.drift : t.drift
  };
}
function Nt(r) {
  const t = Oe, e = r && typeof r == "object" ? r : {};
  return {
    version: 1,
    day: ds(e.day, t.day),
    night: { ...ds(e.night, t.night), same: typeof e.night?.same == "boolean" ? e.night.same : t.night.same },
    when: e.when === "sun" || e.when === "schedule" || e.when === "device" ? e.when : t.when,
    from: hs.test(e.from) ? e.from : t.from,
    to: hs.test(e.to) ? e.to : t.to,
    motion: typeof e.motion == "boolean" ? e.motion : t.motion
  };
}
const ps = (r) => {
  const [t, e] = r.split(":").map(Number);
  return t * 60 + e;
};
function gs(r) {
  const t = (e, s, i, a) => `radial-gradient(${e} at ${s} ${i}, ${a} 0%, transparent 70%)`;
  return [
    t("60vmax 60vmax", "6%", "-4%", r.blob1),
    t("52vmax 52vmax", "96%", "16%", r.blob2),
    t("56vmax 46vmax", "42%", "108%", r.blob3),
    t("34vmax 34vmax", "76%", "78%", r.blob4),
    r.bg
  ].join(", ");
}
class Fi extends EventTarget {
  constructor() {
    super(), this.appearance = Pi(Oe), this.preview = "auto", this.loaded = !1, this.signature = "", this.darkMQ = matchMedia("(prefers-color-scheme: dark)"), this.reducedMQ = matchMedia("(prefers-reduced-motion: reduce)"), this.injectGlobals();
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
    this.appearance = Nt(t), this.writeCache(), this.apply(!0), this.emit(), clearTimeout(this.saveTimer), this.saveTimer = window.setTimeout(() => {
      this.hass?.callWS({ type: "frontend/set_user_data", key: he, value: this.appearance }).catch((e) => {
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
      const s = await t.callWS({ type: "frontend/get_user_data", key: he });
      this.appearance = Nt(s?.value), this.writeCache();
    } catch (s) {
      console.warn("HyggeHub: could not read appearance, using defaults", s);
    }
    this.loaded = !0, this.apply(!0), this.emit();
    try {
      await this.unsubscribe?.(), this.unsubscribe = await t.connection.subscribeMessage((s) => {
        this.appearance = Nt(s?.value), this.writeCache(), this.apply(!0), this.emit();
      }, { type: "frontend/subscribe_user_data", key: he });
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
        const l = n.state === "below_horizon", o = new Date(l ? n.attributes.next_rising : n.attributes.next_setting);
        e = { slot: l ? "night" : "day", reason: l ? `The sun is down, sunrise at ${D(o, this.hass)}` : `The sun is up, sunset at ${D(o, this.hass)}` };
      } else
        e = { slot: s ? "night" : "day", reason: "sun.sun is not available, so this follows your device" };
    } else if (t.when === "schedule") {
      const n = /* @__PURE__ */ new Date(), l = n.getHours() * 60 + n.getMinutes(), o = ps(t.from), h = ps(t.to), g = o > h ? l >= o || l < h : l >= o && l < h;
      e = { slot: g ? "night" : "day", reason: g ? `Night hours, ${t.from} to ${t.to}` : `Outside night hours (${t.from} to ${t.to})` };
    } else
      e = { slot: s ? "night" : "day", reason: `Your device is in ${s ? "dark" : "light"} mode` };
    const i = this.preview === "auto" ? e.slot : this.preview, a = i === "night" && !t.night.same ? { theme: t.night.theme, frost: t.night.frost, drift: t.night.drift } : { ...t.day };
    return {
      slot: i,
      autoSlot: e.slot,
      look: a,
      palette: bt[a.theme],
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
    const n = e.palette, l = {
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
      "--hh-font": Li,
      "--hh-backdrop": gs(n),
      // Home Assistant's own variables, so views, native cards, the sidebar and dialogs match.
      "--lovelace-background": gs(n),
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
    }, o = document.documentElement;
    for (const [g, d] of Object.entries(l)) o.style.getPropertyValue(g) !== d && o.style.setProperty(g, d);
    const h = n.dark ? "dark" : "light";
    o.style.colorScheme !== h && (o.style.colorScheme = h), o.classList.remove("hh-drift"), a && this.emit();
  }
  emit() {
    this.dispatchEvent(new Event("change"));
  }
  injectGlobals() {
    if (!document.getElementById("hyggehub-font")) {
      const t = document.createElement("link");
      t.id = "hyggehub-font", t.rel = "stylesheet", t.href = Oi, document.head.appendChild(t);
    }
  }
  // A per-device copy so a reload paints the right look before the websocket answers.
  readCache(t) {
    try {
      const e = localStorage.getItem(de + t);
      return e ? Nt(JSON.parse(e)) : void 0;
    } catch {
      return;
    }
  }
  writeCache() {
    try {
      const t = JSON.stringify(this.appearance);
      localStorage.setItem(de + "last", t), this.userId && localStorage.setItem(de + this.userId, t);
    } catch {
    }
  }
}
const Ni = "__hyggehubThemeEngine", x = window[Ni] ??= new Fi();
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ut = globalThis, Le = Ut.ShadowRoot && (Ut.ShadyCSS === void 0 || Ut.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Pe = Symbol(), us = /* @__PURE__ */ new WeakMap();
let ti = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== Pe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Le && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = us.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && us.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Hi = (r) => new ti(typeof r == "string" ? r : r + "", void 0, Pe), S = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, a) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[a + 1], r[0]);
  return new ti(e, r, Pe);
}, Bi = (r, t) => {
  if (Le) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = Ut.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, ms = Le ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Hi(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ji, defineProperty: Ri, getOwnPropertyDescriptor: Wi, getOwnPropertyNames: Ui, getOwnPropertySymbols: Yi, getPrototypeOf: qi } = Object, se = globalThis, fs = se.trustedTypes, Vi = fs ? fs.emptyScript : "", Gi = se.reactiveElementPolyfillSupport, _t = (r, t) => r, Vt = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? Vi : null;
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
} }, Ie = (r, t) => !ji(r, t), bs = { attribute: !0, type: String, converter: Vt, reflect: !1, useDefault: !1, hasChanged: Ie };
Symbol.metadata ??= Symbol("metadata"), se.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let gt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = bs) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && Ri(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: a } = Wi(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: i, set(n) {
      const l = i?.call(this);
      a?.call(this, n), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? bs;
  }
  static _$Ei() {
    if (this.hasOwnProperty(_t("elementProperties"))) return;
    const t = qi(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(_t("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(_t("properties"))) {
      const e = this.properties, s = [...Ui(e), ...Yi(e)];
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
      for (const i of s) e.unshift(ms(i));
    } else t !== void 0 && e.push(ms(t));
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
    return Bi(t, this.constructor.elementStyles), t;
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
      const a = (s.converter?.toAttribute !== void 0 ? s.converter : Vt).toAttribute(e, s.type);
      this._$Em = t, a == null ? this.removeAttribute(i) : this.setAttribute(i, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const a = s.getPropertyOptions(i), n = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : Vt;
      this._$Em = i;
      const l = n.fromAttribute(e, a.type);
      this[i] = l ?? this._$Ej?.get(i) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, a) {
    if (t !== void 0) {
      const n = this.constructor;
      if (i === !1 && (a = this[t]), s ??= n.getPropertyOptions(t), !((s.hasChanged ?? Ie)(a, e) || s.useDefault && s.reflect && a === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, s)))) return;
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
        const { wrapped: n } = a, l = this[i];
        n !== !0 || this._$AL.has(i) || l === void 0 || this.C(i, void 0, a, l);
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
gt.elementStyles = [], gt.shadowRootOptions = { mode: "open" }, gt[_t("elementProperties")] = /* @__PURE__ */ new Map(), gt[_t("finalized")] = /* @__PURE__ */ new Map(), Gi?.({ ReactiveElement: gt }), (se.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fe = globalThis, vs = (r) => r, Gt = Fe.trustedTypes, ys = Gt ? Gt.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, ei = "$lit$", Z = `lit$${Math.random().toFixed(9).slice(2)}$`, si = "?" + Z, Xi = `<${si}>`, ot = document, Ct = () => ot.createComment(""), Et = (r) => r === null || typeof r != "object" && typeof r != "function", Ne = Array.isArray, Ki = (r) => Ne(r) || typeof r?.[Symbol.iterator] == "function", pe = `[ 	
\f\r]`, $t = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, xs = /-->/g, ws = />/g, et = RegExp(`>|${pe}(?:([^\\s"'>=/]+)(${pe}*=${pe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), $s = /'/g, ks = /"/g, ii = /^(?:script|style|textarea|title)$/i, ai = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), c = ai(1), k = ai(2), J = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), _s = /* @__PURE__ */ new WeakMap(), nt = ot.createTreeWalker(ot, 129);
function ni(r, t) {
  if (!Ne(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ys !== void 0 ? ys.createHTML(t) : t;
}
const Qi = (r, t) => {
  const e = r.length - 1, s = [];
  let i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = $t;
  for (let l = 0; l < e; l++) {
    const o = r[l];
    let h, g, d = -1, u = 0;
    for (; u < o.length && (n.lastIndex = u, g = n.exec(o), g !== null); ) u = n.lastIndex, n === $t ? g[1] === "!--" ? n = xs : g[1] !== void 0 ? n = ws : g[2] !== void 0 ? (ii.test(g[2]) && (i = RegExp("</" + g[2], "g")), n = et) : g[3] !== void 0 && (n = et) : n === et ? g[0] === ">" ? (n = i ?? $t, d = -1) : g[1] === void 0 ? d = -2 : (d = n.lastIndex - g[2].length, h = g[1], n = g[3] === void 0 ? et : g[3] === '"' ? ks : $s) : n === ks || n === $s ? n = et : n === xs || n === ws ? n = $t : (n = et, i = void 0);
    const f = n === et && r[l + 1].startsWith("/>") ? " " : "";
    a += n === $t ? o + Xi : d >= 0 ? (s.push(h), o.slice(0, d) + ei + o.slice(d) + Z + f) : o + Z + (d === -2 ? l : f);
  }
  return [ni(r, a + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class At {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let a = 0, n = 0;
    const l = t.length - 1, o = this.parts, [h, g] = Qi(t, e);
    if (this.el = At.createElement(h, s), nt.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = nt.nextNode()) !== null && o.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(ei)) {
          const u = g[n++], f = i.getAttribute(d).split(Z), m = /([.?@])?(.*)/.exec(u);
          o.push({ type: 1, index: a, name: m[2], strings: f, ctor: m[1] === "." ? Ji : m[1] === "?" ? ta : m[1] === "@" ? ea : ie }), i.removeAttribute(d);
        } else d.startsWith(Z) && (o.push({ type: 6, index: a }), i.removeAttribute(d));
        if (ii.test(i.tagName)) {
          const d = i.textContent.split(Z), u = d.length - 1;
          if (u > 0) {
            i.textContent = Gt ? Gt.emptyScript : "";
            for (let f = 0; f < u; f++) i.append(d[f], Ct()), nt.nextNode(), o.push({ type: 2, index: ++a });
            i.append(d[u], Ct());
          }
        }
      } else if (i.nodeType === 8) if (i.data === si) o.push({ type: 2, index: a });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(Z, d + 1)) !== -1; ) o.push({ type: 7, index: a }), d += Z.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const s = ot.createElement("template");
    return s.innerHTML = t, s;
  }
}
function yt(r, t, e = r, s) {
  if (t === J) return t;
  let i = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const a = Et(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = i : e._$Cl = i), i !== void 0 && (t = yt(r, i._$AS(r, t.values), i, s)), t;
}
let Zi = class {
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
    const { el: { content: e }, parts: s } = this._$AD, i = (t?.creationScope ?? ot).importNode(e, !0);
    nt.currentNode = i;
    let a = nt.nextNode(), n = 0, l = 0, o = s[0];
    for (; o !== void 0; ) {
      if (n === o.index) {
        let h;
        o.type === 2 ? h = new wt(a, a.nextSibling, this, t) : o.type === 1 ? h = new o.ctor(a, o.name, o.strings, this, t) : o.type === 6 && (h = new sa(a, this, t)), this._$AV.push(h), o = s[++l];
      }
      n !== o?.index && (a = nt.nextNode(), n++);
    }
    return nt.currentNode = ot, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
};
class wt {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
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
    t = yt(this, t, e), Et(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== J && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ki(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && Et(this._$AH) ? this._$AA.nextSibling.data = t : this.T(ot.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = At.createElement(ni(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const a = new Zi(i, this), n = a.u(this.options);
      a.p(e), this.T(n), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = _s.get(t.strings);
    return e === void 0 && _s.set(t.strings, e = new At(t)), e;
  }
  k(t) {
    Ne(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const a of t) i === e.length ? e.push(s = new wt(this.O(Ct()), this.O(Ct()), this, this.options)) : s = e[i], s._$AI(a), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = vs(t).nextSibling;
      vs(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class ie {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, a) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = a, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(t, e = this, s, i) {
    const a = this.strings;
    let n = !1;
    if (a === void 0) t = yt(this, t, e, 0), n = !Et(t) || t !== this._$AH && t !== J, n && (this._$AH = t);
    else {
      const l = t;
      let o, h;
      for (t = a[0], o = 0; o < a.length - 1; o++) h = yt(this, l[s + o], e, o), h === J && (h = this._$AH[o]), n ||= !Et(h) || h !== this._$AH[o], h === p ? t = p : t !== p && (t += (h ?? "") + a[o + 1]), this._$AH[o] = h;
    }
    n && !i && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ji extends ie {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class ta extends ie {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class ea extends ie {
  constructor(t, e, s, i, a) {
    super(t, e, s, i, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = yt(this, t, e, 0) ?? p) === J) return;
    const s = this._$AH, i = t === p && s !== p || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, a = t !== p && (s === p || i);
    i && this.element.removeEventListener(this.name, this, s), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class sa {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    yt(this, t);
  }
}
const ia = { I: wt }, aa = Fe.litHtmlPolyfillSupport;
aa?.(At, wt), (Fe.litHtmlVersions ??= []).push("3.3.3");
const na = (r, t, e) => {
  const s = e?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const a = e?.renderBefore ?? null;
    s._$litPart$ = i = new wt(t.insertBefore(Ct(), a), a, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const He = globalThis;
let vt = class extends gt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = na(e, this.renderRoot, this.renderOptions);
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
vt._$litElement$ = !0, vt.finalized = !0, He.litElementHydrateSupport?.({ LitElement: vt });
const ra = He.litElementPolyfillSupport;
ra?.({ LitElement: vt });
(He.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oa = { attribute: !0, type: String, converter: Vt, reflect: !1, hasChanged: Ie }, la = (r = oa, t, e) => {
  const { kind: s, metadata: i } = e;
  let a = globalThis.litPropertyMetadata.get(i);
  if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), a.set(e.name, r), s === "accessor") {
    const { name: n } = e;
    return { set(l) {
      const o = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(n, o, r, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(n, void 0, r, l), l;
    } };
  }
  if (s === "setter") {
    const { name: n } = e;
    return function(l) {
      const o = this[n];
      t.call(this, l), this.requestUpdate(n, o, r, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function Pt(r) {
  return (t, e) => typeof e == "object" ? la(r, t, e) : ((s, i, a) => {
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
  return Pt({ ...r, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ri = (r, t, e) => (e.configurable = !0, e.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(r, t, e), e);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function It(r, t) {
  return (e, s, i) => {
    const a = (n) => n.renderRoot?.querySelector(r) ?? null;
    return ri(e, s, { get() {
      return a(this);
    } });
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let ca;
function ha(r) {
  return (t, e) => ri(t, e, { get() {
    return (this.renderRoot ?? (ca ??= document.createDocumentFragment())).querySelectorAll(r);
  } });
}
var da = Object.defineProperty, pa = Object.getOwnPropertyDescriptor, oi = (r, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? pa(t, e) : t, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = (s ? n(t, e, i) : n(i)) || i);
  return s && i && da(t, e, i), i;
};
const Be = class Yt extends vt {
  constructor() {
    super(...arguments), this.held = !1, this.onScreen = !0;
  }
  /** One observer for every card: off-screen cards pause their animations (via --hh-play). */
  static observer() {
    return Yt.seen ??= new IntersectionObserver((t) => {
      for (const e of t) {
        const s = e.target;
        s.onScreen = e.isIntersecting, e.isIntersecting ? s.style.removeProperty("--hh-play") : s.style.setProperty("--hh-play", "paused");
      }
    });
  }
  connectedCallback() {
    super.connectedCallback(), Yt.observer().observe(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), Yt.observer().unobserve(this);
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
    return De(this.hass, this.stateOf(t));
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
oi([
  y()
], Be.prototype, "config", 2);
oi([
  Pt({ attribute: !1, noAccessor: !0 })
], Be.prototype, "hass", 1);
let P = Be;
function O(r, t, e, s) {
  customElements.get(r) || customElements.define(r, t), window.customCards = window.customCards || [], window.customCards.some((i) => i.type === r) || window.customCards.push({ type: r, name: e, description: s, preview: !0 });
}
const ga = {
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
}, ua = {
  play: "M8 5.5v13l10.5-6.5z",
  pause: "M7 5h3.6v14H7zM13.4 5H17v14h-3.6z",
  next: "M6 6l9 6-9 6zM16.5 6h2v12h-2z",
  prev: "M18 6l-9 6 9 6zM5.5 6h2v12h-2z"
}, w = (r, t = "") => k`<svg class="i ${t}" viewBox="0 0 24 24" aria-hidden="true"><path d=${ga[r]}></path></svg>`, ge = (r, t = "") => k`<svg class="i fill ${t}" viewBox="0 0 24 24" aria-hidden="true"><path d=${ua[r]}></path></svg>`, _ = (r, t = "") => r ? c`<ha-icon class=${t} .icon=${r}></ha-icon>` : p, A = S`
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
`, z = S`
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
`, Ve = class Ve extends P {
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
    if (!t.length) return p;
    const e = t.filter((i) => i.state === "home").length, s = e === t.length ? "All home" : e === 0 ? "No one home" : `${e} of ${t.length} home`;
    return c`<span class="pill">
      <span class="avatars">
        ${t.map((i) => {
      const a = i.attributes.entity_picture, n = I(i, "?");
      return c`<span class=${i.state === "home" ? "home" : "away"} title=${n}>${a ? c`<img src=${a} alt="" />` : n.charAt(0)}</span>`;
    })}
      </span>
      ${s}
    </span>`;
  }
  render() {
    const t = this.config, e = /* @__PURE__ */ new Date(), s = e.getHours(), i = s < 5 ? "Good night" : s < 12 ? "Good morning" : s < 18 ? "Good afternoon" : "Good evening", a = this.hass?.user?.name?.split(" ")[0], n = t.chips ?? [], l = t.clock || t.greeting || t.date;
    return !l && !n.length && !t.people?.length ? (this.style.display = "none", p) : (this.style.display = "", c`
      <div class="hero">
        ${l ? c`<div>
              ${t.clock ? c`<div class="time num">${mt(s)}:${mt(e.getMinutes())}</div>` : p}
              ${t.greeting || t.date ? c`<p class="greet">
                    ${t.greeting ? c`<b>${i}${a ? `, ${a}` : ""}</b>` : p}${t.greeting && t.date ? " · " : ""}${t.date ? e.toLocaleDateString(C(this.hass), { weekday: "long", day: "numeric", month: "long" }) : p}
                  </p>` : p}
            </div>` : p}
        <div class="chips">
          ${this.peopleChip()}
          ${n.map((o) => {
      const h = this.stateOf(o.entity);
      return c`<button class="pill" type="button" @click=${() => this.moreInfo(o.entity)}>
              ${_(o.icon ?? h?.attributes.icon ?? "mdi:information-outline")}
              ${o.name ? c`<span class="faint">${o.name}</span>` : p}${this.format(o.entity)}
            </button>`;
    })}
        </div>
      </div>
    `);
  }
};
Ve.styles = [
  A,
  z,
  S`
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
let Me = Ve;
O("hyggehub-header-card", Me, "HyggeHub Header", "A slim row of status chips; a clock, greeting and date if you want them.");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const li = { ATTRIBUTE: 1, CHILD: 2 }, je = (r) => (...t) => ({ _$litDirective$: r, values: t });
let Re = class {
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
const { I: ma } = ia, Ms = (r) => r, Ss = () => document.createComment(""), kt = (r, t, e) => {
  const s = r._$AA.parentNode, i = t === void 0 ? r._$AB : t._$AA;
  if (e === void 0) {
    const a = s.insertBefore(Ss(), i), n = s.insertBefore(Ss(), i);
    e = new ma(a, n, r, r.options);
  } else {
    const a = e._$AB.nextSibling, n = e._$AM, l = n !== r;
    if (l) {
      let o;
      e._$AQ?.(r), e._$AM = r, e._$AP !== void 0 && (o = r._$AU) !== n._$AU && e._$AP(o);
    }
    if (a !== i || l) {
      let o = e._$AA;
      for (; o !== a; ) {
        const h = Ms(o).nextSibling;
        Ms(s).insertBefore(o, i), o = h;
      }
    }
  }
  return e;
}, st = (r, t, e = r) => (r._$AI(t, e), r), fa = {}, ci = (r, t = fa) => r._$AH = t, ba = (r) => r._$AH, ue = (r) => {
  r._$AR(), r._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Cs = (r, t, e) => {
  const s = /* @__PURE__ */ new Map();
  for (let i = t; i <= e; i++) s.set(r[i], i);
  return s;
}, Se = je(class extends Re {
  constructor(r) {
    if (super(r), r.type !== li.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(r, t, e) {
    let s;
    e === void 0 ? e = t : t !== void 0 && (s = t);
    const i = [], a = [];
    let n = 0;
    for (const l of r) i[n] = s ? s(l, n) : n, a[n] = e(l, n), n++;
    return { values: a, keys: i };
  }
  render(r, t, e) {
    return this.dt(r, t, e).values;
  }
  update(r, [t, e, s]) {
    const i = ba(r), { values: a, keys: n } = this.dt(t, e, s);
    if (!Array.isArray(i)) return this.ut = n, a;
    const l = this.ut ??= [], o = [];
    let h, g, d = 0, u = i.length - 1, f = 0, m = a.length - 1;
    for (; d <= u && f <= m; ) if (i[d] === null) d++;
    else if (i[u] === null) u--;
    else if (l[d] === n[f]) o[f] = st(i[d], a[f]), d++, f++;
    else if (l[u] === n[m]) o[m] = st(i[u], a[m]), u--, m--;
    else if (l[d] === n[m]) o[m] = st(i[d], a[m]), kt(r, o[m + 1], i[d]), d++, m--;
    else if (l[u] === n[f]) o[f] = st(i[u], a[f]), kt(r, i[d], i[u]), u--, f++;
    else if (h === void 0 && (h = Cs(n, f, m), g = Cs(l, d, u)), h.has(l[d])) if (h.has(l[u])) {
      const b = g.get(n[f]), v = b !== void 0 ? i[b] : null;
      if (v === null) {
        const $ = kt(r, i[d]);
        st($, a[f]), o[f] = $;
      } else o[f] = st(v, a[f]), kt(r, i[d], v), i[b] = null;
      f++;
    } else ue(i[u]), u--;
    else ue(i[d]), d++;
    for (; f <= m; ) {
      const b = kt(r, o[m + 1]);
      st(b, a[f]), o[f++] = b;
    }
    for (; d <= u; ) {
      const b = i[d++];
      b !== null && ue(b);
    }
    return this.ut = n, ci(r, o), J;
  }
});
var va = Object.defineProperty, ae = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && va(t, e, i), i;
};
const ya = [
  { match: "login attempt|unauthori", icon: "mdi:shield-alert-outline", severity: "crit" },
  { match: "leak|smoke|fire|flood", icon: "mdi:alert-octagon-outline", severity: "crit" },
  { match: "battery", icon: "mdi:battery-alert-variant-outline", severity: "crit" },
  { match: "laundry|washing|wash|dryer", icon: "mdi:washing-machine", severity: "info" },
  { match: "door|window|open", icon: "mdi:door-open", severity: "warn" },
  { match: "update|upgrade", icon: "mdi:package-up", severity: "info" },
  { match: "delivered|parcel|package", icon: "mdi:package-variant-closed", severity: "ok" },
  { match: "done|finished|complete|ready", icon: "mdi:check-circle-outline", severity: "ok" }
], Es = { info: "var(--hh-accent)", ok: "var(--hh-ok)", warn: "var(--hh-warn)", crit: "var(--hh-crit)" }, As = (r) => r.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`#>]/g, "").replace(/\s+/g, " ").trim(), Ge = class Ge extends P {
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
    for (const s of [...this.config.rules ?? [], ...ya]) {
      let i = !1;
      try {
        i = new RegExp(s.match, "i").test(e);
      } catch {
        i = e.toLowerCase().includes(s.match.toLowerCase());
      }
      if (i) return { icon: s.icon ?? "mdi:bell-outline", color: Es[s.severity ?? "info"] };
    }
    return { icon: "mdi:bell-outline", color: Es.info };
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
        const a = s.get(i), n = i.getBoundingClientRect();
        if (!n.width || !a.width) continue;
        const l = a.left + a.width / 2 - (n.left + n.width / 2), o = a.bottom - n.bottom, h = a.width / n.width;
        if (Math.abs(l) < 0.5 && Math.abs(o) < 0.5 && Math.abs(h - 1) < 5e-3) continue;
        const g = getComputedStyle(i).transform;
        i.animate([{ transform: `translate(${l}px, ${o}px) scale(${h})${g === "none" ? "" : ` ${g}`}` }, { transform: g }], {
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
    let n = 0, l = !1;
    i.setPointerCapture(t.pointerId);
    const o = (g) => {
      n = g.clientX - a, !l && Math.abs(n) > 6 && (l = !0, i.classList.add("dragging")), l && (i.style.translate = `${n}px 0`, i.style.opacity = String(Math.max(0.15, 1 - Math.abs(n) / 320)));
    }, h = () => {
      if (i.removeEventListener("pointermove", o), i.removeEventListener("pointerup", h), i.removeEventListener("pointercancel", h), i.classList.remove("dragging"), l && Math.abs(n) > 90) return this.dismiss(e.notification_id, i, Math.sign(n));
      i.style.translate = "", i.style.opacity = "", l || this.toggle();
    };
    i.addEventListener("pointermove", o), i.addEventListener("pointerup", h), i.addEventListener("pointercancel", h);
  }
  render() {
    for (const a of this.leaving) this.notes[a] || this.leaving.delete(a);
    const t = this.list, e = t.filter((a) => !this.leaving.has(a.notification_id)), s = !e.length && this.config.hide_when_empty !== !1;
    if (this.style.display = s ? "none" : "", s) return c``;
    let i = 0;
    return c`
      <div class="head">
        <h2>${this.config.title ?? "Notifications"} <span class="faint num">${e.length || ""}</span></h2>
        ${e.length ? c`<div>
              ${e.length > 1 ? c`<button class="btn-text" type="button" @click=${this.toggle}>${this.open ? "Stack" : "Show all"}</button>` : p}
              <button class="btn-text" type="button" @click=${this.clearAll}>Clear</button>
            </div>` : p}
      </div>
      <div class="stack ${this.open ? "open" : ""}" style="--peeks:${Math.min(Math.max(e.length - 1, 0), 2)}" aria-live="polite">
        ${Se(
      t,
      (a) => a.notification_id,
      (a) => {
        const n = this.lookFor(a), l = this.leaving.has(a.notification_id), o = l ? 0 : Math.min(i++, 3);
        return c`<div
              class="note glass ${l ? "leaving" : ""}"
              data-id=${a.notification_id}
              data-depth=${o}
              tabindex=${o === 0 || this.open ? 0 : -1}
              role="button"
              aria-expanded=${this.open}
              style="--sev:${n.color};z-index:${10 - o}"
              @pointerdown=${(h) => this.onDown(h, a, o)}
              @keydown=${(h) => {
          h.target === h.currentTarget && (h.key === "Enter" || h.key === " " ? (h.preventDefault(), this.toggle()) : (h.key === "Delete" || h.key === "Backspace") && this.dismiss(a.notification_id, h.currentTarget));
        }}
            >
              <div class="ic">${_(n.icon)}</div>
              <div class="body">
                <div class="t"><span>${a.title ? As(a.title) : "Home Assistant"}</span><time>${Ei(a.created_at)}</time></div>
                <p>${As(a.message)}</p>
                <div class="actions">
                  <button type="button" @click=${(h) => this.dismiss(a.notification_id, h.target.closest(".note"))}>Dismiss</button>
                </div>
              </div>
            </div>`;
      }
    )}
      </div>
      ${!e.length && this.loaded ? c`<div class="empty glass">
            <div class="ic">${w("bell")}</div>
            <div><b>All caught up</b><div class="muted">Nothing needs you right now.</div></div>
          </div>` : p}
      ${e.length ? c`<p class="hint">Tap to ${this.open ? "stack" : "fan out"}, drag sideways to dismiss</p>` : p}
    `;
  }
};
Ge.styles = [
  A,
  z,
  S`
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
let lt = Ge;
ae([
  y()
], lt.prototype, "notes");
ae([
  y()
], lt.prototype, "open");
ae([
  y()
], lt.prototype, "loaded");
ae([
  It(".stack")
], lt.prototype, "stackEl");
O("hyggehub-notification-stack-card", lt, "HyggeHub Notification stack", "Home Assistant notifications as a swipeable, stacked pile.");
var xa = Object.defineProperty, hi = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && xa(t, e, i), i;
};
const wa = /* @__PURE__ */ new Set(["light", "switch", "input_boolean", "fan", "cover"]), $a = k`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="1.6"></circle><path d="M12 10.4c-.6-4.2.6-6.9 3-6.9 2.6 0 3.5 3.2-1.6 7.7M13.4 13.1c3.4 2.6 4.6 5.3 3.4 7.4-1.3 2.2-4.5 1.4-5.8-5.3M10.6 12.6c-3.9 1.6-6.9 1.3-8-.8-1.3-2.2 1-4.6 7.5-2.4"></path></svg>`, ka = k`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3.5h18M12 3.5v16"></path><g class="slats"><path d="M5 4v12h14V4M5 8h14M5 12h14"></path></g><circle cx="12" cy="20.5" r=".9"></circle></svg>`, Xe = class Xe extends P {
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
    return e === "light" ? "light" : e === "fan" ? "fan" : e === "cover" ? "cover" : e === "switch" && /light|lamp|lampe|lys/i.test(t) ? "light" : wa.has(e) ? "toggle" : "info";
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
      const n = this.stateOf(a.entity), l = (a.name ?? I(n, a.entity)).toLowerCase();
      a.kind === "fan" && this.isOn(a.entity, a.kind) && i.push(`${l} running`), a.kind === "cover" && i.push(`${l} ${this.isOn(a.entity, a.kind) ? "open" : "closed"}`), a.entity.startsWith("binary_sensor.") && ["door", "window", "opening", "garage_door"].includes(String(n?.attributes.device_class)) && i.push(`${l} ${n?.state === "on" ? "open" : "closed"}`);
    }
    return i.join(" · ");
  }
  entityIcon(t, e) {
    return t.icon ? _(t.icon) : t.kind === "light" ? w("bulb") : t.kind === "fan" ? $a : t.kind === "cover" ? ka : _(e?.attributes.icon ?? "mdi:toggle-switch-outline");
  }
  render() {
    const t = this.config, e = this.ents, s = e.some((h) => h.kind === "light" && this.isOn(h.entity, h.kind)), i = H(this.stateOf(t.temperature)), a = H(this.stateOf(t.humidity)), n = this.brightnessPct, l = t.dimmer ? n / 100 : 0.7, o = Math.min(Math.max(e.length, 1), 4);
    return c`
      <ha-card class="glass room" data-on=${s} style="--level:${l}">
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
          ${i !== void 0 || a !== void 0 ? c`<button class="climate num" type="button" @click=${() => this.moreInfo(t.temperature ?? t.humidity)}>
                ${i !== void 0 ? c`<b>${i.toFixed(1)}°</b>` : p}
                ${a !== void 0 ? c`<small>${w("drop")}${Math.round(a)}%</small>` : p}
              </button>` : p}
        </div>
        ${e.length ? c`<div class="ents" style="grid-template-columns:repeat(${o},1fr)">
              ${e.map((h) => {
      const g = this.stateOf(h.entity), d = this.isOn(h.entity, h.kind);
      return c`<button
                  class="ent"
                  type="button"
                  data-kind=${h.kind}
                  aria-pressed=${d}
                  ?disabled=${!g}
                  @click=${() => this.tap(() => this.toggle(h))}
                  @pointerdown=${() => this.holdStart(() => this.moreInfo(h.entity))}
                  @pointerup=${this.holdEnd}
                  @pointerleave=${this.holdEnd}
                  @pointercancel=${this.holdEnd}
                  @contextmenu=${(u) => {
        u.preventDefault(), this.moreInfo(h.entity);
      }}
                >
                  ${this.entityIcon(h, g)}<span>${h.name ?? I(g, h.entity)}</span>
                </button>`;
    })}
            </div>` : p}
        ${t.dimmer ? c`<div class="bri" data-on=${n > 0}>
              <div class="bri-fill"></div>
              <div class="bri-label">${w("bulb")}<span class="num">${n > 0 ? `${n}%` : "Off"}</span></div>
              <input
                type="range"
                min="1"
                max="100"
                .value=${String(Math.max(1, n))}
                aria-label="${t.name} brightness"
                @input=${(h) => this.onDim(h, !1)}
                @change=${(h) => this.onDim(h, !0)}
              />
            </div>` : p}
      </ha-card>
    `;
  }
};
Xe.styles = [
  A,
  z,
  S`
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
let zt = Xe;
hi([
  y()
], zt.prototype, "pending");
hi([
  y()
], zt.prototype, "dragPct");
O("hyggehub-room-card", zt, "HyggeHub Room", "A room with its lights, fans, blinds, climate and a dimmer.");
var _a = Object.defineProperty, tt = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && _a(t, e, i), i;
};
const N = {
  home: { label: "Home", icon: "mdi:home-outline", desc: "Doors and windows only", feature: 1, service: "alarm_arm_home" },
  away: { label: "Away", icon: "mdi:walk", desc: "Everything, cameras on", feature: 2, service: "alarm_arm_away" },
  night: { label: "Night", icon: "mdi:weather-night", desc: "Ground floor, bedrooms off", feature: 4, service: "alarm_arm_night" },
  vacation: { label: "Holiday", icon: "mdi:bag-suitcase-outline", desc: "Everything, lights on a random schedule", feature: 32, service: "alarm_arm_vacation" },
  custom_bypass: { label: "Custom", icon: "mdi:shield-edit-outline", desc: "Your own selection of zones", feature: 16, service: "alarm_arm_custom_bypass" }
}, zs = ["idle", "mode", "code"], Ce = 46, Ht = 2 * Math.PI * Ce, Ke = class Ke extends P {
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
    if (this.config.modes?.length) return this.config.modes.filter((s) => s in N);
    const t = this.entity?.attributes.supported_features ?? 0, e = Object.keys(N).filter((s) => t & N[s].feature);
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
    this.step = t, t === "code" && (this.code = "", this.prompt = this.flow === "arm" && this.mode ? `Enter your code to arm ${N[this.mode].label.toLowerCase()}` : "Enter your code to disarm");
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
    const t = this.flow === "disarm" ? "alarm_disarm" : N[this.mode ?? "away"].service, e = this.needsCode(this.flow) ? { code: this.code } : {};
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
    const s = I(this.stateOf(e[0]), e[0]);
    return e.length === 1 ? `${s} is open` : `${s} and ${e.length - 1} more are open`;
  }
  renderOrb() {
    const t = this.panelState, e = this.armedMode, s = this.delayLeft(), i = (f) => f ? N[f].label.toLowerCase() : "", a = (f) => this.config.mode_descriptions?.[f] ?? N[f].desc;
    let n, l, o, h, g = "disarmed", d = 0, u = !1;
    return t === "arming" || t === "pending" ? (g = t, l = t === "arming" ? "Arming" : "Disarm now", n = s ? c`<span class="secs num">${s.left}</span><span class="w">${l}</span>` : c`${w("shield")}<span class="w">${l}</span>`, o = t === "arming" ? "Tap to cancel" : "Tap to enter your code", h = t === "arming" ? "Leave now, the exit delay is running" : "Someone came in, the alarm goes off when the delay ends", s ? d = Ht * (1 - s.left / s.total) : u = !0) : t === "triggered" ? (g = "triggered", l = "Alarm triggered", n = c`${w("shieldAlert", "pop")}<span class="w">Alarm</span>`, o = "Tap to disarm", h = this.sensorSummary() ?? "The alarm has been triggered") : e ? (g = "armed", l = `Armed ${i(e)}`, n = c`${w("lock", "pop")}<span class="w">${l}</span>`, o = "Tap to disarm", h = N[e] ? a(e) : "") : t === "disarmed" ? (l = "Disarmed", n = c`${w("shield", this.flash ? "pop" : "")}<span class="w">Disarmed</span>`, o = "Tap to arm", h = this.sensorSummary() ?? "Ready to arm") : (g = "unavailable", l = t === "disarming" ? "Disarming" : "Unavailable", n = c`${w("shield")}<span class="w">${l}</span>`, o = "", h = t === "disarming" ? "" : "The alarm panel is not responding"), this.flash = !1, c`
      <button class="orb" type="button" data-visual=${g} ?disabled=${g === "unavailable"} aria-label=${o ? `${l}. ${o}` : l} @click=${this.onOrb}>
        <svg viewBox="0 0 100 100" aria-hidden="true" class=${u ? "spin" : ""}>
          <circle class="bg" cx="50" cy="50" r=${Ce}></circle>
          <circle class="fg" cx="50" cy="50" r=${Ce} style="stroke-dasharray:${u ? `${Ht * 0.22} ${Ht}` : Ht};stroke-dashoffset:${d}"></circle>
        </svg>
        <span class="core">${n}</span>
      </button>
      <div class="hint">${o}</div>
      <div class="detail">${h}</div>
    `;
  }
  render() {
    const t = this.config, e = this.panelState, s = e.startsWith("armed_") ? "armed" : e, i = t.name ?? "Alarm", a = zs.indexOf(this.step), n = (u) => {
      const f = zs.indexOf(u);
      return f < a ? "before" : f > a ? "after" : "";
    }, l = this.codeFormat === "text", o = !this.codeLength, h = this.codeLength || Math.max(4, this.code.length);
    let g;
    this.step === "mode" ? g = "Choose mode" : this.step === "code" ? g = this.flow === "arm" ? "Enter code" : "" : g = this.config.sensors?.length ? `${this.config.sensors.length} sensors ${this.armedMode ? "armed" : "ready"}` : "";
    const d = this.flow === "arm" && this.step !== "idle" && this.availableModes.length > 1 && this.needsCode("arm");
    return c`
      <ha-card class="glass alarm ${t.embedded ? "embedded" : ""}" data-visual=${s}>
        <div class="head">
          <button class="back" type="button" aria-label="Back" ?hidden=${this.step === "idle"} @click=${this.back}>${w("left")}</button>
          <h3>${this.step === "idle" ? t.embedded ? "" : i : this.flow === "arm" ? this.step === "code" && this.mode ? `Arm · ${N[this.mode].label}` : "Arm" : "Disarm"}</h3>
          <div class="right">
            <span>${g}</span>
            ${d ? c`<span class="pips"><i class="on"></i><i class=${this.step === "code" ? "on" : ""}></i></span>` : p}
          </div>
        </div>
        <div class="stage">
          <section class="step ${this.step === "idle" ? "on" : ""}" data-pos=${n("idle")} ?inert=${this.step !== "idle"}>${this.renderOrb()}</section>
          <section class="step ${this.step === "mode" ? "on" : ""}" data-pos=${n("mode")} ?inert=${this.step !== "mode"}>
            <div class="modes">
              ${this.availableModes.map(
      (u) => c`<button class="mode" type="button" @click=${() => this.pickMode(u)}>
                  <span class="mi">${_(N[u].icon)}</span><b>${N[u].label}</b><small>${t.mode_descriptions?.[u] ?? N[u].desc}</small>
                </button>`
    )}
            </div>
          </section>
          <section class="step ${this.step === "code" ? "on" : ""}" data-pos=${n("code")} ?inert=${this.step !== "code"}>
            <div class="prompt" role="status">${this.prompt}</div>
            ${l ? c`<form
                  class="text-code"
                  @submit=${(u) => {
      u.preventDefault(), this.submit();
    }}
                >
                  <input class="code-input" type="password" autocomplete="off" aria-label="Code" .value=${this.code} @input=${(u) => this.code = u.target.value} />
                  <button type="submit" class="ok">OK</button>
                </form>` : c`
                  <div class="dots" aria-hidden="true">${Array.from({ length: h }, (u, f) => c`<i class=${f < this.code.length ? "on" : ""}></i>`)}</div>
                  <div class="keypad">
                    ${["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((u) => c`<button class="key num" type="button" @click=${() => this.press(u)}>${u}</button>`)}
                    ${o ? c`<button class="key util" type="button" @click=${() => this.press("ok")}>OK</button>` : c`<button class="key util" type="button" @click=${() => this.press("cancel")}>Cancel</button>`}
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
Ke.styles = [
  A,
  z,
  S`
      .alarm {
        --state: var(--hh-ok);
      }
      /* Inside another card's panel: the panel is the frame. */
      ha-card.embedded {
        background: transparent;
        border: none;
        border-radius: 0;
        box-shadow: none;
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
        padding: 6px 0 0;
        animation: none;
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
let R = Ke;
tt([
  y()
], R.prototype, "step");
tt([
  y()
], R.prototype, "flow");
tt([
  y()
], R.prototype, "mode");
tt([
  y()
], R.prototype, "code");
tt([
  y()
], R.prototype, "prompt");
tt([
  y()
], R.prototype, "busy");
tt([
  It(".text-code, .dots")
], R.prototype, "dotsEl");
tt([
  It(".code-input")
], R.prototype, "codeInput");
O("hyggehub-alarm-card", R, "HyggeHub Alarm", "A step-by-step alarm panel: tap the state to arm or disarm.");
const di = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
function pi(r, t) {
  const e = (o) => o ? r?.states[o] : void 0, s = /* @__PURE__ */ new Date(), i = {}, a = e(t.entity), n = t.entity?.split(".")[0];
  if (a && n === "timer") {
    const o = cs(a.attributes.duration);
    a.state === "active" && a.attributes.finishes_at ? i.target = new Date(a.attributes.finishes_at) : a.state === "paused" ? i.frozen = cs(a.attributes.remaining) * 1e3 : i.idleText = "Not running";
    const h = i.frozen ?? (i.target ? i.target.getTime() - s.getTime() : o * 1e3);
    o && (i.progress = 1 - h / (o * 1e3));
  } else if (a && n === "input_datetime")
    if (a.attributes.has_date) i.target = new Date(a.attributes.timestamp * 1e3);
    else {
      const o = new Date(s);
      o.setHours(a.attributes.hour ?? 0, a.attributes.minute ?? 0, a.attributes.second ?? 0, 0), o <= s && o.setDate(o.getDate() + 1), i.target = o;
    }
  else if (a && n === "calendar")
    a.attributes.start_time && (i.target = new Date(String(a.attributes.start_time).replace(" ", "T"))), i.subtitle = a.attributes.message, i.target || (i.idleText = "Nothing coming up");
  else if (a) {
    const o = new Date(a.state);
    isNaN(o.getTime()) ? i.idleText = "No time set" : i.target = o;
  } else if (t.entity)
    i.idleText = `${t.entity} is not available`;
  else if (t.weekly) {
    const [o, h] = (t.weekly.time ?? "00:00").split(":").map(Number), g = di.indexOf(String(t.weekly.day).slice(0, 3).toLowerCase()), d = new Date(s.getFullYear(), s.getMonth(), s.getDate(), o, h);
    for (; d.getDay() !== g || d <= s; ) d.setDate(d.getDate() + 1);
    i.target = d, i.progress = 1 - (d.getTime() - s.getTime()) / (7 * 864e5);
  } else if (t.target) {
    const o = /^\d{4}-\d{2}-\d{2}$/.test(String(t.target).trim()), h = new Date(o ? `${t.target}T00:00:00` : t.target);
    if (t.yearly) {
      h.setFullYear(s.getFullYear());
      const g = o && h.toDateString() === s.toDateString();
      h <= s && !g && h.setFullYear(s.getFullYear() + 1);
    }
    i.target = isNaN(h.getTime()) ? void 0 : h, i.target || (i.idleText = "`target` is not a date");
  }
  if (i.progress === void 0 && i.target)
    if (t.start) {
      const o = new Date(t.start).getTime();
      i.progress = (s.getTime() - o) / (i.target.getTime() - o);
    } else
      i.progress = 1 - Math.min(i.target.getTime() - s.getTime(), 365 * 864e5) / (365 * 864e5);
  const l = H(e(t.value_entity));
  return l !== void 0 && t.value_target && (i.progress = l / t.value_target), i.progress !== void 0 && (i.progress = Math.min(1, Math.max(0, i.progress))), i;
}
const Qe = class Qe extends P {
  constructor() {
    super(...arguments), this.shown = /* @__PURE__ */ new Map();
  }
  static getStubConfig() {
    return { name: "Lofoten", subtitle: "Flight to Bodø", icon: "mdi:image-filter-hdr", target: `${(/* @__PURE__ */ new Date()).getFullYear()}-12-18T09:40`, style: "ring" };
  }
  validateConfig(t) {
    if (!t.name) throw new Error("Give the countdown a `name`.");
    if (!t.target && !t.entity && !t.weekly) throw new Error("Set `target`, `entity` or `weekly`.");
    if (t.weekly && !di.includes(String(t.weekly.day).slice(0, 3).toLowerCase())) throw new Error("`weekly.day` must be a weekday, like `tue`.");
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
    return pi(this.hass, this.config);
  }
  updated() {
    x.motionOn && this.renderRoot.querySelectorAll("[data-t]").forEach((t) => {
      const e = t.dataset.t, s = t.textContent ?? "";
      this.shown.has(e) && this.shown.get(e) !== s && (t.classList.remove("tick"), t.offsetWidth, t.classList.add("tick")), this.shown.set(e, s);
    });
  }
  whenText(t) {
    if (!t.target) return "";
    const e = ft(t.target, this.hass);
    return t.target.getHours() || t.target.getMinutes() ? `${e}, ${D(t.target, this.hass)}` : e;
  }
  render() {
    const t = this.config, e = this.resolve(), s = e.frozen ?? (e.target ? e.target.getTime() - Date.now() : 0), i = Js(s), a = !e.idleText && s <= 0;
    return t.style === "compact" ? this.renderCompact(e, i, a) : this.renderRing(e, i, a);
  }
  renderRing(t, e, s) {
    const i = this.config, a = 2 * Math.PI * 52, n = [i.subtitle ?? t.subtitle, this.whenText(t)].filter(Boolean).join(" · ");
    return c`
      <ha-card class="glass ring-card" @click=${() => this.moreInfo(i.entity)}>
        <div class="t-ring">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle class="bg" cx="60" cy="60" r="52"></circle>
            <circle class="fg" cx="60" cy="60" r="52" style="stroke-dasharray:${a};stroke-dashoffset:${a * (1 - (t.progress ?? 0))}"></circle>
          </svg>
          <div class="mid">
            ${s || t.idleText ? c`<span class="ic ${i.animation ?? "none"}">${_(i.icon ?? "mdi:timer-sand-complete")}</span>` : e.days > 0 ? c`<b class="num" data-t="d">${e.days}</b><small>${e.days === 1 ? "day" : "days"}</small>` : c`<b class="num" data-t="h">${e.hours}</b><small>${e.hours === 1 ? "hour" : "hours"}</small>`}
          </div>
        </div>
        <div class="txt">
          <h3>${i.name}</h3>
          ${n ? c`<p>${n}</p>` : p}
          ${t.idleText ? c`<p class="idle">${t.idleText}</p>` : s ? c`<p class="now">${i.done_text ?? "It’s time"}</p>` : c`<div class="clock num">
                  ${e.days > 0 ? c`<div><b data-t="ch">${mt(e.hours)}</b><small>hrs</small></div>` : p}
                  <div><b data-t="cm">${mt(e.minutes)}</b><small>min</small></div>
                  <div><b data-t="cs">${mt(e.seconds)}</b><small>sec</small></div>
                </div>`}
          ${this.renderChips()}
        </div>
      </ha-card>
    `;
  }
  renderCompact(t, e, s) {
    const i = this.config, a = H(this.stateOf(i.value_entity)), n = i.value_unit ?? this.stateOf(i.value_entity)?.attributes.unit_of_measurement ?? "";
    let l;
    t.idleText ? l = c`<span class="small-big">${t.idleText}</span>` : s ? l = c`${i.done_text ?? "Ready"}` : e.days >= 1 ? l = c`<span data-t="d">${e.days}</span><small>${e.days === 1 ? "day" : "days"}</small> <span data-t="h">${e.hours}</span><small>h</small>` : e.hours >= 1 ? l = c`<span data-t="h">${e.hours}</span><small>h</small> <span data-t="m">${e.minutes}</span><small>min</small>` : l = c`<span data-t="m">${e.minutes}</span>:<span data-t="s">${mt(e.seconds)}</span>`;
    const o = t.progress !== void 0 && (i.value_entity || i.entity?.startsWith("timer.") || i.start);
    return c`
      <ha-card class="glass mini" data-done=${s} @click=${() => this.moreInfo(i.entity ?? i.value_entity)}>
        <div class="lbl"><span class="ic ${t.idleText ? "none" : i.animation ?? "none"}">${_(i.icon ?? "mdi:timer-outline")}</span>${i.name}</div>
        <div class="big num">${l}</div>
        <div class="sub faint num">
          ${a !== void 0 && i.value_target ? n.startsWith("°") ? `${Math.round(a)}° of ${i.value_target}${n}` : `${Math.round(a)} of ${i.value_target}${n ? ` ${n}` : ""}` : i.subtitle ?? t.subtitle ?? this.whenText(t)}
        </div>
        ${o ? c`<div class="bar"><i style="width:${(t.progress ?? 0) * 100}%"></i></div>` : p} ${this.renderChips()}
      </ha-card>
    `;
  }
  renderChips() {
    const t = this.config.chips;
    if (!t?.length) return p;
    const e = (s) => s ? ["accent", "ok", "warn", "crit", "warm"].includes(s) ? `var(--hh-${s})` : s : "var(--hh-accent)";
    return c`<div class="chips">${t.map((s) => c`<span class="chip" style="--c:${e(s.color)}">${s.name}</span>`)}</div>`;
  }
};
Qe.styles = [
  A,
  z,
  S`
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
let Ee = Qe;
O("hyggehub-countdown-card", Ee, "HyggeHub Countdown", "Count down to a date, a weekly event, a timer or a calendar entry.");
var Ma = Object.defineProperty, Y = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && Ma(t, e, i), i;
};
const Ze = class Ze extends P {
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
    const i = this.items[t] ?? [], a = (o) => (o = o.toLowerCase(), o === s ? 0 : o.startsWith(s) ? 1 : o.split(/\s+/).some((h) => h.startsWith(s)) ? 2 : o.includes(s) ? 3 : 9), n = i.filter((o) => o.status === "completed").map((o) => ({ item: o, r: a(o.summary) })).filter((o) => o.r < 9).sort((o, h) => o.r - h.r).slice(0, 4).map((o) => ({ type: "restore", item: o.item, exact: o.r === 0 })), l = i.find((o) => o.status === "needs_action" && o.summary.toLowerCase() === s);
    return l ? n.push({ type: "exists", item: l }) : n.some((o) => o.type === "restore" && o.exact) || n.push({ type: "new", text: e }), n;
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
    const i = t.currentTarget, a = i.parentElement, n = t.clientX, l = t.clientY;
    let o = 0, h;
    i.setPointerCapture(t.pointerId);
    const g = (u) => {
      o = u.clientX - n;
      const f = u.clientY - l;
      if (h || (Math.abs(o) > 8 && Math.abs(o) > Math.abs(f) ? (h = "h", i.classList.add("dragging")) : Math.abs(f) > 8 && (h = "v")), h === "h") {
        const m = Math.abs(o), b = Math.sign(o) * Math.min(150, m < 90 ? m : 90 + (m - 90) * 0.35);
        i.style.transform = `translateX(${b}px)`, a.dataset.reveal = o > 0 ? "done" : "del", a.classList.toggle("armed", m > 80);
      }
    }, d = () => {
      i.removeEventListener("pointermove", g), i.removeEventListener("pointerup", d), i.removeEventListener("pointercancel", d), i.classList.remove("dragging"), i.style.transform = "", a.classList.remove("armed"), setTimeout(() => delete a.dataset.reveal, 300), h === "h" && (o > 80 ? this.setStatus(e, s, s.status === "completed" ? "needs_action" : "completed") : o < -80 && this.removeItem(e, s));
    };
    i.addEventListener("pointermove", g), i.addEventListener("pointerup", d), i.addEventListener("pointercancel", d);
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
    const a = (l) => e.scrollLeft = i - (l.clientX - s), n = (l) => {
      e.removeEventListener("pointermove", a), e.removeEventListener("pointerup", n), e.classList.remove("grabbing");
      const o = l.clientX - s, h = Math.round(i / e.clientWidth), g = Math.abs(o) > 50 ? h - Math.sign(o) : h;
      this.goPane(Math.max(0, Math.min(this.tabCount - 1, g)));
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
    if (!t) return p;
    const e = new Date(t.length === 10 ? `${t}T00:00:00` : t), s = /* @__PURE__ */ new Date();
    s.setHours(0, 0, 0, 0);
    const i = new Date(e);
    i.setHours(0, 0, 0, 0);
    const a = Math.round((i.getTime() - s.getTime()) / 864e5);
    let n;
    return a < 0 ? n = "Overdue" : a === 0 ? n = "Today" : a === 1 ? n = "Tomorrow" : a < 7 ? n = e.toLocaleDateString(C(this.hass), { weekday: "short" }) : n = ft(e, this.hass), c`<span class="due ${a <= 1 ? "soon" : ""}">${n}</span>`;
  }
  renderItem(t, e, s) {
    const i = e.status === "completed", a = s.done_label ?? "Done", n = e.description?.split(`
`)[0];
    return c`<li class="item ${i ? "done" : ""}" data-uid=${e.uid}>
      <div class="item-bg">
        <span class="bg-done">${w(i ? "undo" : "check")}${i ? "Restore" : a}</span>
        <span class="bg-del">Delete${w("trash")}</span>
      </div>
      <div class="item-fg" @pointerdown=${(l) => this.onRowDown(l, t, e)}>
        <button class="check" type="button" aria-label="${i ? "Restore" : a} ${e.summary}" @click=${() => this.setStatus(t, e, i ? "needs_action" : "completed")}>
          ${w("check")}
        </button>
        <span class="txt">${e.summary}</span>
        ${n ? c`<span class="qty">${n}</span>` : p} ${i ? p : this.dueChip(e.due)}
        <button class="del" type="button" aria-label="Delete ${e.summary}" @click=${() => this.removeItem(t, e)}>${w("x")}</button>
      </div>
    </li>`;
  }
  renderSuggestions(t, e) {
    const s = this.suggestions(t);
    if (!s.length) return p;
    const i = (this.query[t] ?? "").trim().toLowerCase(), a = this.selected(t, s), n = (l) => {
      const o = l.toLowerCase().indexOf(i);
      return o < 0 ? l : c`${l.slice(0, o)}<mark>${l.slice(o, o + i.length)}</mark>${l.slice(o + i.length)}`;
    };
    return c`<div class="suggest" role="listbox" aria-label="Suggestions" @pointerdown=${(l) => l.preventDefault()}>
      ${s.some((l) => l.type === "restore") ? c`<div class="s-h">From ${e.done_label ?? "Done"}</div>` : p}
      ${s.map((l, o) => {
      const h = `sug ${o === a ? "sel" : ""}`, g = () => this.choose(t, l);
      return l.type === "restore" ? c`<button type="button" class=${h} role="option" aria-selected=${o === a} @click=${g}>
            <span class="si">${w("undo")}</span><span class="st"><b>${n(l.item.summary)}</b><small>${l.item.description ?? "Completed earlier"}</small></span><em>Restore</em>
          </button>` : l.type === "exists" ? c`<button type="button" class=${h} role="option" aria-selected=${o === a} @click=${g}>
            <span class="si">${w("check")}</span><span class="st"><b>${l.item.summary}</b><small>Already on the list</small></span><em>Show</em>
          </button>` : c`<button type="button" class=${h} role="option" aria-selected=${o === a} @click=${g}>
          <span class="si">${w("plus")}</span><span class="st"><b>Add “${l.text}”</b><small>As a new item</small></span><em>Add</em>
        </button>`;
    })}
    </div>`;
  }
  renderList(t) {
    const e = t.entity, s = t.name ?? I(this.stateOf(e), e), i = this.items[e], a = i?.filter((h) => h.status === "needs_action") ?? [], n = i?.filter((h) => h.status === "completed") ?? [], l = this.closed[e];
    let o;
    return this.failed[e] ? o = c`<li class="empty-row">${this.failed[e]}</li>` : i ? a.length ? o = Se(a, (h) => h.uid, (h) => this.renderItem(e, h, t)) : o = c`<li class="empty-row">Nothing left on ${s.toLowerCase()}</li>` : o = c`<li class="empty-row">Loading ${s.toLowerCase()}…</li>`, c`<section class="pane">
      <ul class="items">${o}</ul>
      <form class="add" @submit=${(h) => this.onSubmit(h, e)}>
        <input
          placeholder=${t.placeholder ?? `Add to ${s.toLowerCase()}`}
          autocomplete="off"
          aria-label=${t.placeholder ?? `Add to ${s.toLowerCase()}`}
          .value=${this.query[e] ?? ""}
          @input=${(h) => {
      this.query = { ...this.query, [e]: h.target.value }, this.sel = { ...this.sel, [e]: void 0 };
    }}
          @keydown=${(h) => this.onAddKey(h, e)}
        />
        <button type="submit" aria-label="Add">${w("plus")}</button>
      </form>
      ${this.renderSuggestions(e, t)}
      ${n.length ? c`<div class="done-group ${l ? "closed" : ""}">
            <button class="done-h" type="button" aria-expanded=${!l} @click=${() => this.closed = { ...this.closed, [e]: !l }}>
              ${w("chev")}${t.done_label ?? "Done"} <span class="count num">${n.length}</span><span class="rule"></span>
            </button>
            ${l ? p : c`<ul class="items">${Se(n, (h) => h.uid, (h) => this.renderItem(e, h, t))}</ul>`}
          </div>` : p}
    </section>`;
  }
  renderNote() {
    const t = this.config.note, e = this.stateOf(t.entity), s = this.noteDraft ?? (e && e.state !== "unknown" && e.state !== "unavailable" ? e.state : ""), i = e?.attributes.max ?? 255;
    return c`<section class="pane note-pad">
      <textarea aria-label=${t.name ?? "Note"} maxlength=${i} .value=${s} @input=${this.onNote} ?disabled=${!e}></textarea>
      <p>
        <span>${e ? this.noteStatus || "Shared with everyone in the home" : `${t.entity} is not available`}</span>
        <span class="num ${s.length > i * 0.9 ? "near" : ""}">${s.length} / ${i}</span>
      </p>
    </section>`;
  }
  render() {
    const t = this.config.lists, e = [
      ...t.map((s) => ({ name: s.name ?? I(this.stateOf(s.entity), s.entity), count: this.items[s.entity]?.filter((i) => i.status === "needs_action").length })),
      ...this.config.note ? [{ name: this.config.note.name ?? "Note", count: void 0 }] : []
    ];
    return c`
      <ha-card class="glass lists" style="--tabs:${e.length}">
        <div class="tabs" role="tablist">
          <div class="tab-ink"></div>
          ${e.map(
      (s, i) => c`<button class="tab" type="button" role="tab" aria-selected=${i === this.paneIdx} @click=${() => this.goPane(i)}>
              ${s.name}${s.count !== void 0 ? c`<span class="count num">${s.count}</span>` : p}
            </button>`
    )}
        </div>
        <div class="track" @scroll=${this.onTrackScroll} @pointerdown=${this.onTrackDown}>
          ${t.map((s) => this.renderList(s))} ${this.config.note ? this.renderNote() : p}
        </div>
        ${e.length > 1 ? c`<div class="pager">${e.map((s, i) => c`<i class=${i === this.paneIdx ? "on" : ""}></i>`)}</div>` : p}
      </ha-card>
    `;
  }
};
Ze.styles = [
  A,
  z,
  S`
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
let F = Ze;
Y([
  y()
], F.prototype, "items");
Y([
  y()
], F.prototype, "failed");
Y([
  y()
], F.prototype, "closed");
Y([
  y()
], F.prototype, "query");
Y([
  y()
], F.prototype, "sel");
Y([
  y()
], F.prototype, "paneIdx");
Y([
  y()
], F.prototype, "noteDraft");
Y([
  y()
], F.prototype, "noteStatus");
Y([
  It(".track")
], F.prototype, "track");
Y([
  ha(".pane")
], F.prototype, "panes");
O("hyggehub-lists-card", F, "HyggeHub Lists", "Swipeable to-do lists with a completed group and a shared note.");
var Sa = Object.defineProperty, ne = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && Sa(t, e, i), i;
};
const Ca = {
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
}, Ea = {
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
}, Ts = /* @__PURE__ */ new Set(["snowy", "snowy-rainy", "hail"]), Ds = /* @__PURE__ */ new Set(["rainy", "pouring", "lightning-rainy"]), Aa = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"], Bt = (r) => typeof r == "number" ? `${Math.round(r)}°`.replace("-", "−") : "–", Je = class Je extends P {
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
    const e = I(this.stateOf(this.config.entity));
    return e && !/^(home|hjem|forecast)/i.test(e) ? e : "";
  }
  // ---------- falling snow / rain on a canvas behind the content ----------
  get precipitating() {
    const t = this.stateOf(this.config.entity)?.state ?? "";
    return Ts.has(t) || Ds.has(t);
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
    const a = this.stateOf(this.config.entity)?.state ?? "", n = Ts.has(a), l = Ds.has(a);
    if (!n && !l) return;
    const o = x.motionOn;
    e.fillStyle = e.strokeStyle = this.particleColor || "rgba(255,255,255,.7)", e.lineWidth = 1.2, e.lineCap = "round";
    for (const h of this.particles)
      o && (n ? (h.y += h.s * 2, h.d += 0.024, h.x += Math.sin(h.d) * 0.5) : (h.y += 12 + h.s * 12, h.x -= 2)), h.y > i + 10 && Object.assign(h, this.spawn(s, i, !1)), h.x < -10 && (h.x = s + 5), e.beginPath(), n ? (e.arc(h.x, h.y, h.r, 0, 6.28), e.fill()) : (e.globalAlpha = 0.55, e.moveTo(h.x, h.y), e.lineTo(h.x - 2, h.y + 9 + h.r * 2), e.stroke(), e.globalAlpha = 1);
  }
  // ---------- render ----------
  daylight() {
    const t = this.stateOf(this.config.sun ?? "sun.sun");
    if (!t) return;
    const e = Date.now(), s = new Date(t.attributes.next_rising).getTime(), i = new Date(t.attributes.next_setting).getTime();
    if (isNaN(s) || isNaN(i)) return;
    let a, n, l;
    t.state === "above_horizon" ? (n = i, a = s - 864e5, l = (e - a) / (n - a)) : (a = s, n = i, l = new Date(s).getDate() === new Date(e).getDate() ? 0 : 1, l === 1 && (a = s - 864e5, n = i - 864e5));
    const o = Math.max(0, n - a);
    return { rise: new Date(a), set: new Date(n), progress: Math.min(1, Math.max(0, l)), hours: Math.floor(o / 36e5), minutes: Math.round(o % 36e5 / 6e4) };
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
    const a = (l) => {
      const o = Math.round((new Date(l.toDateString()).getTime() - new Date((/* @__PURE__ */ new Date()).toDateString()).getTime()) / 864e5);
      return o === 0 ? "Today" : o === 1 ? "Tomorrow" : l.toLocaleDateString(i, { weekday: "short" });
    }, n = (l) => l.toLocaleTimeString(i, { hour: "2-digit" });
    return a(e) === a(s) ? `${a(e)} ${n(e)}–${n(s)}` : `${a(e)} ${n(e)} – ${a(s)} ${n(s)}`;
  }
  render() {
    const t = this.stateOf(this.config.entity);
    if (!t) return c`<ha-card class="glass"><p class="muted">${this.config.entity} is not available.</p></ha-card>`;
    const e = t.attributes, s = t.state, i = e.wind_speed_unit ?? "m/s", a = typeof e.wind_speed == "number" ? `Wind ${Math.round(e.wind_speed)} ${i}${typeof e.wind_bearing == "number" ? ` ${Aa[Math.round(e.wind_bearing / 45) % 8]}` : ""}` : "", n = typeof e.apparent_temperature == "number" ? `Feels like ${Bt(e.apparent_temperature)}` : typeof e.humidity == "number" ? `Humidity ${e.humidity}%` : "", l = this.hass?.formatEntityState?.(t) ?? Ea[s] ?? s, o = s === "clear-night", h = !["sunny", "clear-night"].includes(s), g = ["sunny", "partlycloudy"].includes(s), d = this.daylight(), u = this.config.slots ?? 6, f = this.forecasts[this.view] ?? [], m = Math.max(1, Math.ceil(f.length / u)), b = Math.min(this.page, m - 1), v = f.slice(b * u, b * u + u), $ = !!this.forecasts.hourly && !!this.forecasts.daily, G = this.placeName;
    return c`
      <ha-card class="glass weather" @click=${() => this.moreInfo(this.config.entity)}>
        <canvas aria-hidden="true"></canvas>
        <div class="top">
          <span class="place">${G ? c`${_("mdi:map-marker-outline")}${G}` : p}</span>
          ${$ ? c`<span class="seg" role="group" aria-label="Forecast">
                <button type="button" aria-pressed=${this.view === "hourly"} @click=${(L) => this.setView(L, "hourly")}>Hours</button>
                <button type="button" aria-pressed=${this.view === "daily"} @click=${(L) => this.setView(L, "daily")}>Days</button>
              </span>` : p}
        </div>
        <div class="main">
          <div>
            <div class="temp num">${Bt(e.temperature)}</div>
            <div class="cond">${l}</div>
            <div class="sub">${[n, a].filter(Boolean).join(" · ")}</div>
          </div>
          <div class="art" aria-hidden="true">
            ${g ? c`<div class="sun"></div>` : p} ${o ? c`<div class="moon"></div>` : p}
            ${h ? c`<div class="cloud"></div>` : p}
          </div>
        </div>
        ${v.length ? c`<div class="pager">
                <button class="pg" type="button" aria-label="Earlier" ?disabled=${b === 0} @click=${(L) => this.turn(L, -1)}>${w("left")}</button>
                <span class="range num">${this.pageLabel(v)}</span>
                <button class="pg next" type="button" aria-label="Later" ?disabled=${b >= m - 1} @click=${(L) => this.turn(L, 1)}>${w("left")}</button>
              </div>
              <div class="slots num" style="grid-template-columns:repeat(${u},1fr)">
                ${v.map(
      (L) => c`<div>
                    <span class="h">${this.slotLabel(L)}</span>${_(Ca[L.condition ?? ""] ?? "mdi:weather-cloudy")}<b>${Bt(L.temperature)}</b>
                    ${this.view === "daily" && typeof L.templow == "number" ? c`<small>${Bt(L.templow)}</small>` : p}
                  </div>`
    )}
              </div>` : p}
        ${d ? c`<div class="daylight">
              <div class="bar"><i style="width:${d.progress * 100}%"></i></div>
              <div class="row num">
                <span>Sunrise ${D(d.rise, this.hass)}</span><span>${d.hours} h ${d.minutes} min daylight</span><span>Sunset ${D(d.set, this.hass)}</span>
              </div>
            </div>` : p}
      </ha-card>
    `;
  }
};
Je.styles = [
  A,
  z,
  S`
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
let ct = Je;
ne([
  y()
], ct.prototype, "forecasts");
ne([
  y()
], ct.prototype, "view");
ne([
  y()
], ct.prototype, "page");
ne([
  It("canvas")
], ct.prototype, "canvas");
O("hyggehub-weather-card", ct, "HyggeHub Weather", "Current weather with falling snow or rain, a forecast row and daylight.");
var za = Object.defineProperty, gi = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && za(t, e, i), i;
};
const Os = (r) => `${Math.floor(r / 60)}:${String(Math.floor(r % 60)).padStart(2, "0")}`, ts = class ts extends P {
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
    const t = this.current, e = this.stateOf(t), s = e?.attributes ?? {}, i = this.speakers, a = (v) => v.name ?? I(this.stateOf(v.entity), v.entity), n = this.dragVolume ?? (typeof s.volume_level == "number" ? s.volume_level : void 0), l = e?.state === "playing", o = l || e?.state === "paused", h = s.entity_picture, g = h ? h.startsWith("http") ? h : this.hass?.hassUrl(h) ?? h : void 0, { pos: d, dur: u } = this.position(), f = o ? s.media_title ?? "Playing" : "Nothing playing", m = o ? [s.media_artist, s.media_album_name].filter(Boolean).join(" · ") : e ? "Pick something on your speaker" : `${t} is not available`, b = i.length === 1 && this.config.name ? this.config.name : a(i.find((v) => v.entity === t));
    return c`
      <ha-card class="glass media ${l ? "" : "paused"}">
        <button class="art" type="button" aria-label="More details" @click=${() => this.moreInfo(t)}>
          ${g ? c`<img src=${g} alt="" />` : c`<i></i>`}
          ${l ? c`<span class="eq" aria-hidden="true"><b></b><b></b><b></b><b></b></span>` : p}
        </button>
        <div class="meta">
          <div class="src">${w("speaker")} ${b}</div>
          <b>${f}</b><span>${m}</span>
        </div>
        ${o && u ? c`<div class="progress num">
              <span>${Os(d)}</span>
              <button class="track" type="button" aria-label="Seek" @click=${this.seek}><i style="width:${d / u * 100}%"></i></button>
              <span>${Os(u)}</span>
            </div>` : p}
        ${e ? c`<div class="controls">
              <button class="round" type="button" aria-label="Previous track" @click=${() => this.call("media_previous_track")}>${ge("prev")}</button>
              <button class="round play" type="button" aria-label=${l ? "Pause" : "Play"} @click=${() => this.call("media_play_pause")}>
                ${ge(l ? "pause" : "play")}
              </button>
              <button class="round" type="button" aria-label="Next track" @click=${() => this.call("media_next_track")}>${ge("next")}</button>
            </div>` : p}
        ${e && n !== void 0 && this.config.volume !== !1 ? c`<label class="vol" style="--v:${n}">
              <span class="vol-fill"></span>
              <span class="vol-label num"><span>Volume</span><span>${Math.round(n * 100)}%</span></span>
              <input
                type="range"
                min="0"
                max="100"
                .value=${String(Math.round(n * 100))}
                aria-label="Volume"
                @input=${(v) => this.onVolume(v, !1)}
                @change=${(v) => this.onVolume(v, !0)}
              />
            </label>` : p}
        ${i.length > 1 ? c`<div class="speakers">
              ${i.map((v) => {
      const $ = this.stateOf(v.entity)?.state;
      return c`<button class="chip" type="button" aria-pressed=${v.entity === t} @click=${() => this.pinned = v.entity}>
                  ${$ === "playing" ? c`<span class="live"></span>` : p}${a(v)}
                </button>`;
    })}
            </div>` : p}
      </ha-card>
    `;
  }
};
ts.styles = [
  A,
  z,
  S`
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
let Tt = ts;
gi([
  y()
], Tt.prototype, "pinned");
gi([
  y()
], Tt.prototype, "dragVolume");
O("hyggehub-media-card", Tt, "HyggeHub Media", "Now playing, with artwork, a live equaliser and controls.");
function Ta(r) {
  const t = String(r?.attributes.unit_of_measurement ?? "kWh").toLowerCase();
  return t === "wh" ? 1e-3 : t === "mwh" ? 1e3 : 1;
}
function Da(r) {
  const t = String(r?.attributes.unit_of_measurement ?? "m³").toLowerCase().replace(/\s/g, "");
  return t === "l" ? 1 : t === "gal" ? 3.785 : t === "ft³" ? 28.317 : 1e3;
}
const jt = (r) => new Date(r).getTime();
async function ui(r, t) {
  const e = [t.grid, t.gridExport, t.solar, t.water].filter((b) => !!b);
  if (!e.length) return {};
  const s = /* @__PURE__ */ new Date(), i = await r.callWS({
    type: "recorder/statistics_during_period",
    start_time: new Date(s.getTime() - 48 * 36e5).toISOString(),
    end_time: s.toISOString(),
    statistic_ids: e,
    period: "hour",
    types: ["change"]
  }), a = (b) => b && i?.[b] || [], n = (b) => [...a(b)].reverse().find((v) => (v.change ?? 0) !== 0), l = (b, v) => {
    const $ = a(b).find((G) => jt(G.start) === jt(v.start));
    return $ ? ($.change ?? 0) * Ta(r.states[b]) : void 0;
  }, o = {}, h = [t.grid, t.gridExport, t.solar].filter((b) => !!b), g = (b) => a(b)[a(b).length - 1], d = Math.min(...h.map((b) => g(b) ? jt(g(b).start) : 1 / 0)), f = (t.grid ? [...a(t.grid)].reverse().find((b) => (b.change ?? 0) !== 0 && jt(b.start) <= d) : void 0) ?? n(t.grid) ?? n(t.gridExport) ?? n(t.solar);
  if (f) {
    const b = l(t.grid, f), v = l(t.gridExport, f), $ = l(t.solar, f), G = (!t.grid || b !== void 0) && (!t.gridExport || v !== void 0) && (!t.solar || $ !== void 0);
    o.energy = {
      hour: [new Date(f.start), new Date(f.end)],
      // kWh in one hour is the hour's average kW.
      grid: t.grid || t.gridExport ? (b ?? 0) - (v ?? 0) : void 0,
      solar: t.solar ? $ ?? 0 : void 0,
      home: t.grid && G ? Math.max(0, (b ?? 0) + ($ ?? 0) - (v ?? 0)) : void 0,
      bought: b,
      sold: v
    };
  }
  const m = n(t.water);
  return m && (o.water = { hour: [new Date(m.start), new Date(m.end)], litres: (m.change ?? 0) * Da(r.states[t.water]) }), o;
}
const ut = ([r, t]) => `${String(r.getHours()).padStart(2, "0")}–${String(t.getHours()).padStart(2, "0")}`;
var Oa = Object.defineProperty, La = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && Oa(t, e, i), i;
};
const B = { x: 270, y: 80 }, Rt = (r) => `${Math.abs(r) < 10 ? Math.abs(r).toFixed(1) : Math.round(Math.abs(r))} kW`, es = class es extends P {
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
        this.meterHour = (await ui(this.hass, { grid: t.grid_meter, gridExport: t.grid_export_meter, solar: t.solar_meter })).energy;
      } catch (e) {
        console.warn("HyggeHub: could not read the meter statistics", e);
      }
  }
  getCardSize() {
    return 4;
  }
  render() {
    const t = this.config, e = t.grid ? void 0 : this.meterHour, s = !t.grid, i = s && t.solar_meter ? e?.solar ?? 0 : j(this.stateOf(t.solar)) ?? 0, a = s ? e?.grid ?? 0 : (j(this.stateOf(t.grid)) ?? 0) - (j(this.stateOf(t.grid_export)) ?? 0), n = j(this.stateOf(t.battery)) ?? 0, l = j(this.stateOf(t.home)) ?? (s ? e?.home : Math.max(0, i + a + n)), o = l === void 0 ? void 0 : l > 0 ? Math.round(Math.max(0, Math.min(1, 1 - Math.max(a, 0) / l)) * 100) : 100, h = !!t.solar || s && !!t.solar_meter, g = [];
    h && g.push({ key: "solar", label: "Solar", kw: i, y: 0, color: "var(--hh-warm)", reverse: !1 }), t.battery && g.push({ key: "battery", label: "Battery", kw: n, y: 0, color: "var(--hh-ok)", reverse: n < 0 }), g.push({ key: "grid", label: a < 0 ? "Export" : "Grid", kw: a, y: 0, color: "var(--hh-accent)", reverse: a < 0 });
    const d = g.length === 1 ? 0 : 100 / (g.length - 1);
    g.forEach((m, b) => m.y = g.length === 1 ? 80 : 30 + b * d);
    const u = this.stateOf(t.battery_soc)?.state, f = (m) => m === "solar" ? "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" : m === "battery" ? "M8 4h8a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM10 2h4M9 14h6M9 10h6" : "M12 2L7 22M12 2l5 20M7.8 9h8.4M6 15h12M9 15l6-6M15 15L9 9";
    return c`
      <ha-card class="glass">
        <div class="card-h">
          <h3>${t.title ?? "Energy now"}</h3>
          ${s ? c`<span class="pill">${e ? `Meters ${ut(e.hour)}` : "Reading meters…"}${o !== void 0 ? ` · ${o}% own` : ""}</span>` : c`<span class="pill"><span class="dot"></span>Self-sufficient ${o}%</span>`}
        </div>
        <svg viewBox="0 0 320 160" role="img" aria-label=${g.map((m) => `${m.label} ${Rt(m.kw)}`).join(", ") + `${l !== void 0 ? `, home ${Rt(l)}` : ""}`}>
          ${g.map((m) => {
      const b = `M60 ${m.y} C150 ${m.y} 170 ${B.y} ${B.x - 26} ${B.y}`, v = Math.abs(m.kw) > 0.02, $ = Math.max(0.6, 3 - Math.abs(m.kw)).toFixed(2);
      return k`
              <path class="base" d=${b}></path>
              ${v ? k`<path class="flow ${m.reverse ? "rev" : ""}" d=${b} style="stroke:${m.color};animation-duration:${$}s"></path>` : p}
              <circle class="node" cx="40" cy=${m.y} r="20"></circle>
              <svg x="30" y=${m.y - 10} width="20" height="20" viewBox="0 0 24 24" class="glyph" style="stroke:${m.color}"><path d=${f(m.key)}></path></svg>
              <text class="label" x="68" y=${m.y - 8}>${Rt(m.kw)}</text>
              <text class="sub" x="68" y=${m.y + 16}>${m.key === "battery" && u ? `${m.label} ${Math.round(Number(u))}%` : m.label}</text>
            `;
    })}
          <circle class="node" cx=${B.x} cy=${B.y} r="26"></circle>
          <svg x=${B.x - 12} y=${B.y - 12} width="24" height="24" viewBox="0 0 24 24" class="glyph" style="stroke:var(--hh-ink)"><path d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5"></path></svg>
          <text class="label" x=${B.x} y=${B.y + 46} text-anchor="middle">${l === void 0 ? "–" : Rt(l)}</text>
          <text class="sub" x=${B.x} y=${B.y + 60} text-anchor="middle">Home</text>
        </svg>
        ${t.extras?.length ? c`<div class="extras num" style="grid-template-columns:repeat(${Math.min(3, t.extras.length)},1fr)">
              ${t.extras.slice(0, 3).map((m) => c`<button type="button" @click=${() => this.moreInfo(m.entity)}><small>${m.name}</small><b>${this.format(m.entity)}</b></button>`)}
            </div>` : p}
      </ha-card>
    `;
  }
};
es.styles = [
  A,
  z,
  S`
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
let Xt = es;
La([
  y()
], Xt.prototype, "meterHour");
O("hyggehub-energy-card", Xt, "HyggeHub Energy", "Live power flowing between solar, battery, grid and the home.");
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Kt = je(class extends Re {
  constructor(r) {
    if (super(r), r.type !== li.ATTRIBUTE || r.name !== "class" || r.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(r) {
    return " " + Object.keys(r).filter((t) => r[t]).join(" ") + " ";
  }
  update(r, [t]) {
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), r.strings !== void 0 && (this.nt = new Set(r.strings.join(" ").split(/\s/).filter((s) => s !== "")));
      for (const s in t) t[s] && !this.nt?.has(s) && this.st.add(s);
      return this.render(t);
    }
    const e = r.element.classList;
    for (const s of this.st) s in t || (e.remove(s), this.st.delete(s));
    for (const s in t) {
      const i = !!t[s];
      i === this.st.has(s) || this.nt?.has(s) || (i ? (e.add(s), this.st.add(s)) : (e.remove(s), this.st.delete(s)));
    }
    return J;
  }
}), Ls = [
  { name: "Restaffald", match: "rest|residual|general", color: "#6b777d", icon: "mdi:trash-can-outline" },
  // "Mad" on its own, not inside "madkarton" or "mad- og drikkekartoner" (those go with plastic).
  { name: "Madaffald", match: "madaffald|\\bmad\\b(?![\\s-]*(&|og)\\s*drikke)|food|bio|organ", color: "#5f8f47", icon: "mdi:food-apple-outline" },
  // Pap before Papir: a shared paper compartment ("Papir/Pap") is shown with the cardboard icon.
  { name: "Pap", match: "\\bpap\\b|cardboard", color: "#9a7552", icon: "mdi:package-variant-closed" },
  { name: "Papir", match: "papir|paper", color: "#3e72a8", icon: "mdi:newspaper-variant-outline" },
  { name: "Plast", match: "plast|mdk|kartoner|plastic", color: "#8a5fb0", icon: "mdi:bottle-soda-classic-outline" },
  { name: "Glas", match: "glas|glass", color: "#3b8d7c", icon: "mdi:bottle-wine-outline" },
  { name: "Metal", match: "metal|dåse|\\bcans?\\b", color: "#7f8a93", icon: "mdi:magnet" },
  { name: "Farligt affald", match: "farlig|hazard", color: "#b4423f", icon: "mdi:skull-crossbones-outline" },
  { name: "Tekstil", match: "tekstil|textile", color: "#c0793a", icon: "mdi:tshirt-crew-outline" },
  { name: "Storskrald", match: "storskrald|bulky", color: "#5a5a5a", icon: "mdi:sofa-outline" },
  { name: "Haveaffald", match: "have|garden|green", color: "#6f9a3b", icon: "mdi:leaf" }
], Wt = ["#4c7f95", "#a0784a", "#7d6aa8", "#5b8f6e"], mi = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"], fi = 63, Ae = (r) => new Date(r.getFullYear(), r.getMonth(), r.getDate()), me = (r, t) => new Date(r.getFullYear(), r.getMonth(), r.getDate() + t), Pa = (r) => `${r.getFullYear()}-${r.getMonth()}-${r.getDate()}`, at = (r) => Math.round((Ae(r).getTime() - Ae(/* @__PURE__ */ new Date()).getTime()) / 864e5), Ia = (r, t) => {
  try {
    return new RegExp(r, "i").test(t);
  } catch {
    return t.toLowerCase().includes(r.toLowerCase());
  }
};
function Fa(r) {
  if (!r.schedule?.length) throw new Error("Set the collection rounds under `schedule`: name, day, every_weeks and first.");
  for (const t of r.schedule) {
    if (!t.name) throw new Error("Every round in `schedule` needs a `name`.");
    if (!mi.includes(String(t.day).slice(0, 3).toLowerCase())) throw new Error(`"${t.name}": day must be a weekday, like tue.`);
    if (isNaN((/* @__PURE__ */ new Date(`${t.first}T00:00:00`)).getTime())) throw new Error(`"${t.name}": first must be a date, like 2026-10-06.`);
  }
}
function bi(r, t, e = 0) {
  const s = [...r.bins ?? [], ...Ls], i = [];
  for (const a of s) {
    if (i.some((l) => l.name === a.name)) continue;
    const n = Ls.find((l) => l.name === a.name);
    Ia(a.match ?? a.name, t) && i.push({
      name: a.name,
      color: a.color ?? n?.color ?? Wt[i.length % Wt.length],
      icon: a.icon ?? n?.icon ?? "mdi:trash-can-outline"
    });
  }
  return i.length ? i : [{ name: t.trim() || "Collection", color: Wt[e % Wt.length], icon: "mdi:trash-can-outline" }];
}
const vi = (r) => r.split(/\s+(?:og|and|&|\+)\s+|\s*\|\s*/i).filter(Boolean);
function qt(r) {
  const t = /* @__PURE__ */ new Map(), e = Ae(/* @__PURE__ */ new Date()), s = new Date(e.getTime() + fi * 864e5);
  return (r.schedule ?? []).forEach((i, a) => {
    const n = mi.indexOf(String(i.day).slice(0, 3).toLowerCase()), l = vi(i.name).map((g) => bi(r, g, a)[0]);
    let o = /* @__PURE__ */ new Date(`${i.first}T00:00:00`);
    for (; o.getDay() !== n; ) o = me(o, 1);
    const h = Math.max(1, i.every_weeks ?? 1) * 7;
    for (o < e && (o = me(o, Math.ceil(Math.round((e.getTime() - o.getTime()) / 864e5) / h) * h)); o <= s; o = me(o, h)) {
      const g = Pa(o), d = t.get(g) ?? { day: o, bins: [] };
      d.bins.some((u) => u.name === i.name) || d.bins.push({ name: i.name, color: i.color ?? l[0].color, kinds: l }), t.set(g, d);
    }
  }), [...t.values()].sort((i, a) => i.day.getTime() - a.day.getTime());
}
const Na = (r) => k`<svg class="bin" viewBox="0 0 24 24" aria-hidden="true" style="--c:${r}">
  <path class="lid" d="M4.2 5.6h15.6a1 1 0 0 1 1 1v1.6H3.2V6.6a1 1 0 0 1 1-1zM10 5.6V4.4a.6.6 0 0 1 .6-.6h2.8a.6.6 0 0 1 .6.6v1.2"></path>
  <path class="body" d="M5 8.2h14l-1.3 11.6a1.6 1.6 0 0 1-1.6 1.4H7.9a1.6 1.6 0 0 1-1.6-1.4z"></path>
  <path class="shine" d="M8.2 10.5l.7 8"></path>
  <circle class="wheel" cx="8" cy="21.4" r="1.4"></circle><circle class="wheel" cx="16" cy="21.4" r="1.4"></circle>
</svg>`, Ps = (r) => {
  const t = r.replace("#", ""), e = t.length === 3 ? t.split("").map((s) => s + s).join("") : t;
  return [0, 2, 4].map((s) => parseInt(e.slice(s, s + 2), 16) || 0);
}, Is = (r, t, e) => {
  const s = Ps(r), i = Ps(t);
  return "#" + s.map((a, n) => Math.round(a + (i[n] - a) * e).toString(16).padStart(2, "0")).join("");
}, fe = {
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
function yi(r) {
  return r ? fe[r.toLowerCase()] ?? (r.startsWith("#") ? r : fe["moonstone-grey"]) : fe["moonstone-grey"];
}
function Ha(r, t, e) {
  const s = Is(r, "#ffffff", 0.35), i = Is(r, "#000000", 0.35), a = (l) => `${t}-${l}`, n = (l) => k`
    <circle cx=${l} cy="85" r="19.5" fill="#1d2023"></circle>
    <circle cx=${l} cy="85" r="12.5" fill="url(#${a("rim")})"></circle>
    <g stroke="#2a2e32" stroke-width="2.4" stroke-linecap="round">
      <path d="M${l} 75.5v19M${l - 9} 82l18 6M${l - 5.6} 92.7l11.2-15.4"></path>
    </g>
    <circle cx=${l} cy="85" r="2.8" fill="#5b636a"></circle>`;
  return k`<svg class="car" viewBox="0 0 248 110" aria-hidden="true">
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
    ${e ? k`<circle cx="38" cy="60" r="4" fill="#7ee0b5"></circle>` : p}
  </svg>`;
}
const We = S`
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
      /* Details as chips along the bottom. */
      .dock {
        position: absolute;
        left: 12px;
        right: 12px;
        bottom: 14px;
        z-index: 3;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 6px;
        pointer-events: none;
        animation: dock-in 0.5s var(--spring, ease) both;
        animation-delay: 0.45s;
      }
      .dock .chip {
        pointer-events: auto;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        max-width: 100%;
        padding: 7px 13px 7px 10px;
        border-radius: 999px;
        font-size: 12.5px;
        font-weight: 600;
        color: var(--hh-ink);
        background: var(--hh-glass-strong);
        -webkit-backdrop-filter: blur(14px) saturate(160%);
        backdrop-filter: blur(14px) saturate(160%);
        border: 1px solid var(--hh-stroke);
        box-shadow: var(--hh-shadow);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .dock .chip .i {
        width: 15px;
        height: 15px;
        flex: none;
        opacity: 0.8;
      }
      .dock .chip small {
        font-weight: 500;
        color: var(--hh-ink-3);
      }
      /* Back, where the title and chips are while the details are closed. */
      .dock-back {
        position: absolute;
        top: 16px;
        left: 18px;
        z-index: 4;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 7px 14px 7px 8px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 600;
        background: var(--hh-accent);
        color: var(--hh-on-accent);
        box-shadow: var(--hh-shadow);
        animation: dock-in 0.4s var(--spring, ease) both;
        animation-delay: 0.6s;
      }
      .dock-back .i {
        width: 16px;
        height: 16px;
      }
      /* The header steps aside for Back: hidden, and not catching taps (its chips would). */
      ha-card.docked .stage.focused ~ .overlay {
        visibility: hidden;
      }
      @keyframes dock-in {
        from {
          opacity: 0;
          transform: translateY(14px);
        }
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
      /* Inside the home card: no card frame, fill the space below the tabs. */
  ha-card.embedded {
    height: 100%;
    border: none;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    animation: none;
  }
  /* Below the home card's tabs. */
  ha-card.embedded .overlay {
    top: 68px;
  }
  ha-card.embedded .dock-back {
    top: 66px;
  }
  ha-card.embedded .panel {
    top: 112px;
  }
  ha-card.embedded .compact .panel {
    top: auto;
  }
  .seg {
    display: flex;
    gap: 4px;
    padding: 3px;
    margin: 10px 0 4px;
    border-radius: 999px;
    background: var(--hh-line);
  }
  .seg button {
    flex: 1;
    padding: 5px 8px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    color: var(--hh-ink-2);
  }
  .seg button[aria-selected='true'] {
    background: var(--hh-glass-strong);
    color: var(--hh-ink);
    box-shadow: var(--hh-shadow);
  }
  .forecast {
    list-style: none;
    margin: 4px 0 0;
    padding: 0;
  }
  .forecast li {
    display: grid;
    grid-template-columns: 1fr 28px auto 52px;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    border-bottom: 1px solid var(--hh-line);
    font-size: 12.5px;
    --mdc-icon-size: 20px;
  }
  .forecast b {
    font-weight: 600;
  }
  .forecast small {
    color: var(--hh-ink-3);
    text-align: right;
  }
  .forecast .fi {
    color: var(--hh-ink-2);
  }
  /* A card shown inside the details panel (the alarm card): no frame of its own, the panel is the frame. */
  .embedded-card {
    display: block;
  }
  .agenda {
    list-style: none;
    margin: 10px 0 0;
    padding: 0;
  }
  .agenda li {
    display: grid;
    grid-template-columns: 74px 1fr;
    gap: 8px;
    padding: 7px 0;
    border-bottom: 1px solid var(--hh-line);
    font-size: 12.5px;
  }
  .agenda small {
    color: var(--hh-ink-3);
  }
  .progress {
    height: 8px;
    margin-top: 12px;
    border-radius: 999px;
    background: var(--hh-line);
    overflow: hidden;
  }
  .progress i {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--hh-accent);
  }
`;
var Ba = Object.defineProperty, re = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && Ba(t, e, i), i;
};
const Q = {
  grid: "M12 2L7 22M12 2l5 20M7.8 9h8.4M6 15h12",
  solar: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  car: "M5 16V12l2-5h10l2 5v4M5 16h14M3 12h18M7.5 16v2M16.5 16v2M7 13.5h1M16 13.5h1",
  home: "M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5",
  bins: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  alarm: "M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z",
  water: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"
}, ze = "#5ec2f0", ja = { grid: "#4aa8ff", solar: "#ffb13d", car: "#4fdc8c", water: ze }, U = (r) => {
  const t = Math.abs(r) * 1e3;
  return t < 1e3 ? `${Math.round(t)} W` : `${(t / 1e3).toFixed(t < 1e4 ? 1 : 0)} kW`;
};
function Ra(r) {
  const t = H(r);
  if (t === void 0) return;
  const e = String(r.attributes.unit_of_measurement ?? "L/min").toLowerCase().replace(/\s/g, "");
  return e === "l/h" ? t / 60 : e === "m³/h" || e === "m3/h" ? t * 1e3 / 60 : e === "gal/min" ? t * 3.785 : t;
}
function be(r) {
  const t = { clouds: 0.25, gloom: 0, rain: 0, snow: 0, fog: 0, lightning: !1, wind: 3 };
  if (!r) return t;
  const e = r.state;
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
  const i = Number(r.attributes.wind_speed);
  if (isFinite(i)) {
    const n = String(r.attributes.wind_speed_unit ?? "km/h").toLowerCase();
    t.wind = n === "m/s" ? i : n === "mph" ? i * 0.447 : n === "kn" ? i * 0.514 : i / 3.6;
  }
  (e === "windy" || e === "windy-variant") && (t.wind = Math.max(t.wind, 12)), t.windBearing = Ya(r.attributes.wind_bearing);
  const a = Number(r.attributes.temperature);
  return isFinite(a) && (t.temperature = a), t;
}
const Wa = {
  disarmed: "Disarmed",
  armed_home: "Armed home",
  armed_away: "Armed away",
  armed_night: "Armed night",
  armed_vacation: "Armed holiday",
  armed_custom_bypass: "Armed custom",
  arming: "Arming",
  pending: "Pending",
  disarming: "Disarming",
  triggered: "Triggered"
}, ve = {
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
}, Ua = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
function Ya(r) {
  if (r == null || r === "") return;
  const t = Number(r);
  if (isFinite(t)) return t;
  const e = Ua.indexOf(String(r).toUpperCase());
  return e >= 0 ? e * 22.5 : void 0;
}
const ye = (r) => !!r && ["on", "true", "charging", "plugged", "connected", "yes"].includes(r.state.toLowerCase()), ss = class ss extends P {
  constructor() {
    super(...arguments), this.failed = !1, this.visible = !0, this.onEngine = () => this.pushState(), this.forecast = {}, this.forecastView = "hourly", this.forecastUnsubs = [], this.compact = !1;
  }
  static getStubConfig() {
    return { solar: "sensor.solar_power", grid: "sensor.grid_power" };
  }
  validateConfig(t) {
    if (!t.grid && !t.grid_meter) throw new Error("Set the `grid` power sensor, or the `grid_meter` energy meter.");
  }
  watchedEntities() {
    const t = this.config, e = t.car ?? {};
    return [t.solar, t.grid, t.grid_export, t.home, t.water, t.grid_meter, t.grid_export_meter, t.solar_meter, t.water_meter, this.weatherId(), this.sunId(), e.battery, e.charging, e.charging_power, e.plugged, t.driveway_lights, this.alarmId(), ...typeof t.alarm == "object" ? t.alarm.sensors ?? [] : [], ...(t.extras ?? []).map((s) => s.entity)];
  }
  getCardSize() {
    return 7;
  }
  connectedCallback() {
    super.connectedCallback(), clearTimeout(this.disposeTimer), x.addEventListener("change", this.onEngine), this.island && this.resume(), this.ticker = window.setInterval(() => this.requestUpdate(), 60 * 6e4), this.meterTicker = window.setInterval(() => void this.loadMeters(), 5 * 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), x.removeEventListener("change", this.onEngine), clearInterval(this.ticker), clearInterval(this.meterTicker), this.unsubscribeForecast(), this.island?.stop(), this.disposeTimer = window.setTimeout(() => {
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
    const t = this.config, e = !!t.grid, s = e ? void 0 : this.meters?.energy, i = e || !t.solar_meter ? j(this.stateOf(t.solar)) ?? 0 : s?.solar ?? 0, a = e ? (j(this.stateOf(t.grid)) ?? 0) - (j(this.stateOf(t.grid_export)) ?? 0) : s?.grid ?? 0, n = j(this.stateOf(t.home)) ?? (e ? Math.max(0, i + a) : s?.home), l = t.water ? void 0 : this.meters?.water, o = t.water ? Ra(this.stateOf(t.water)) : l ? l.litres / 60 : void 0;
    return { solar: i, grid: a, home: n, water: o, car: this.carReading(), energyHour: s?.hour, waterHour: l?.hour, metered: !e };
  }
  /** Reads the meters (the newest hour of readings) when the live sensors are missing. */
  async loadMeters() {
    const t = this.config;
    if (!(!this.hass || !this.meterKey()))
      try {
        this.meters = await ui(this.hass, {
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
    const e = j(this.stateOf(t.charging_power)), s = t.charging ? ye(this.stateOf(t.charging)) : (e ?? 0) > 0.05, i = s || ye(this.stateOf(t.plugged));
    return { soc: H(this.stateOf(t.battery)), kw: s ? e : void 0, charging: s, plugged: i };
  }
  labels() {
    const t = this.config, e = this.readings(), s = e.grid < -0.02 ? "Exporting" : "Grid", i = (g) => e.metered && !e.energyHour ? "–" : U(g), a = (g) => e.metered && e.energyHour ? `${g} ${ut(e.energyHour)}` : g, n = e.metered && !!t.solar_meter, l = [{ key: "grid", value: i(e.grid), caption: a(s), entity: t.grid ?? t.grid_meter, icon: Q.grid, color: "var(--hh-accent)" }];
    if ((t.solar || n) && l.push({
      key: "solar",
      value: n ? i(e.solar) : U(e.solar),
      caption: n ? a("Solar") : "Solar",
      entity: n ? t.solar_meter : t.solar,
      icon: Q.solar,
      color: "var(--hh-warm)"
    }), e.home !== void 0 && l.push({ key: "home", value: U(e.home), caption: a("Load"), entity: t.home, icon: Q.home, color: "var(--hh-ink)" }), e.car) {
      const g = t.car?.name ?? "Car";
      l.push({
        key: "car",
        value: e.car.soc !== void 0 ? `${Math.round(e.car.soc)}%` : g,
        caption: e.car.charging ? e.car.kw ? `Charging ${U(e.car.kw)}` : "Charging" : e.car.plugged ? "Plugged in" : e.car.soc !== void 0 ? g : "Parked",
        entity: t.car?.battery ?? t.car?.charging,
        icon: Q.car,
        color: e.car.charging ? "var(--hh-ok)" : "var(--hh-ink-2)"
      });
    }
    const o = this.nextPickup();
    o && l.push({
      key: "bins",
      value: o.when,
      caption: o.caption,
      icon: Q.bins,
      color: o.kinds[0]?.color ?? "var(--hh-ink-2)",
      kinds: o.kinds
    });
    const h = this.stateOf(this.alarmId());
    return h && l.push({
      key: "alarm",
      value: Wa[h.state] ?? h.state,
      caption: "Alarm",
      entity: this.alarmId(),
      icon: Q.alarm,
      color: h.state === "triggered" ? "var(--hh-crit)" : h.state.startsWith("armed") ? "var(--hh-accent)" : h.state === "disarmed" ? "var(--hh-ok)" : "var(--hh-warn)"
    }), t.water && e.water !== void 0 ? l.push({ key: "water", value: `${e.water < 10 ? e.water.toFixed(1) : Math.round(e.water)} L/min`, caption: "Water", entity: t.water, icon: Q.water, color: ze }) : !t.water && t.water_meter && l.push({
      key: "water",
      value: e.waterHour && e.water !== void 0 ? `${Math.round(e.water * 60)} L` : "–",
      caption: e.waterHour ? `Water ${ut(e.waterHour)}` : "Water",
      entity: t.water_meter,
      icon: Q.water,
      color: ze
    }), l;
  }
  sceneState() {
    const t = this.config, e = this.readings(), s = getComputedStyle(this), i = (g, d) => s.getPropertyValue(g).trim() || d, a = (g) => Math.abs(g) > 0.02 ? Math.sign(g) * (1.2 + Math.min(Math.abs(g), 8) * 0.7) : 0, n = {
      grid: a(e.grid),
      solar: t.solar || e.metered && t.solar_meter ? a(Math.max(0, e.solar)) : null,
      // The car's route runs car → house; charging runs it backwards, out to the car.
      car: e.car?.plugged ? e.car.charging ? -a(Math.max(e.car.kw ?? 3.7, 0.1)) : 0 : null,
      water: t.water || t.water_meter ? e.water && e.water > 0.05 ? 0.7 + Math.min(e.water, 20) * 0.08 : 0 : null
    };
    let l = x.resolved?.slot === "night" ? 1 : 0, o;
    const h = this.stateOf(this.sunId());
    if (h) {
      const g = Number(h.attributes.elevation), d = Number(h.attributes.azimuth);
      isFinite(g) ? (l = Math.min(1, Math.max(0, (6 - g) / 12)), isFinite(d) && (o = { elevation: g, azimuth: d })) : l = h.state === "below_horizon" ? 1 : 0;
    }
    return {
      flows: n,
      // The flows keep their own bright colours: they glow, and a dark theme accent would not.
      colors: ja,
      night: l,
      sun: o,
      facing: t.facing ?? 180,
      weather: be(this.stateOf(this.weatherId())),
      car: e.car ? {
        color: yi(t.car?.color),
        plugged: e.car.plugged,
        charging: e.car.charging,
        ledColor: e.car.charging ? i("--hh-ok", "#4caf50") : e.car.plugged ? i("--hh-accent", "#2f6e86") : "#8a949b"
      } : null,
      hidden: t.solar || t.solar_meter ? [] : ["solar"],
      bins: this.binRounds(),
      driveLights: t.driveway_lights ? ye(this.stateOf(t.driveway_lights)) ? 1 : 0 : l > 0.5 ? 1 : 0,
      motion: x.motionOn,
      fogColor: i("--hh-bg", "#dce3e5")
    };
  }
  // ---------- the scene ----------
  firstUpdated() {
    this.init();
  }
  updated(t) {
    super.updated(t), this.fallback && (this.fallback.hass = this.hass), this.alarmCard && (this.alarmCard.hass = this.hass);
    const e = this.meterKey();
    this.hass && e && e !== this.metersFor && (this.metersFor = e, this.loadMeters()), this.pushState();
  }
  /** The next collection: when, what, and whether the bins should be out. */
  nextPickup() {
    if (!this.config.bins?.schedule?.length) return;
    const t = qt(this.config.bins)[0];
    if (!t) return;
    const e = at(t.day), s = e === 0 ? "Today" : e === 1 ? "Tomorrow" : e < 7 ? t.day.toLocaleDateString(C(this.hass), { weekday: "long" }) : `In ${e} days`, i = t.bins.flatMap((a) => a.kinds).filter((a, n, l) => l.findIndex((o) => o.name === a.name) === n);
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
    const e = qt(t);
    return t.schedule.map((s) => {
      const i = e.find((o) => o.bins.some((h) => h.name === s.name)), n = i?.bins.find((o) => o.name === s.name)?.kinds.map((o) => o.color) ?? vi(s.name).map((o) => bi(t, o)[0].color), l = i ? at(i.day) : -1;
      return {
        colors: [n[0], n[1] ?? n[0]],
        // Out at the kerb on collection day, all day.
        out: l === 0
      };
    });
  }
  /** Temperature and wind from the weather entity, with an arrow pointing where the wind blows. */
  weatherChip() {
    const t = this.stateOf(this.weatherId());
    if (!t) return p;
    const e = Number(t.attributes.temperature), s = be(t), i = String(t.attributes.temperature_unit ?? "°");
    return c`<button type="button" class="weather" @click=${() => this.openDetail("weather")}>
      ${_(ve[t.state] ?? "mdi:weather-partly-cloudy")}
      ${isFinite(e) ? c`<b class="num">${Math.round(e)}${i.startsWith("°") ? "°" : ` ${i}`}</b>` : p}
      <span class="num">${Math.round(s.wind)} m/s</span>
      ${s.windBearing !== void 0 ? c`<svg class="i wind" viewBox="0 0 24 24" style="transform:rotate(${s.windBearing + 180}deg)" aria-label="from ${Math.round(s.windBearing)}°"><path d="M12 19V5M6 11l6-6 6 6"></path></svg>` : p}
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
        const { IslandScene: s, DEFAULT_MODEL: i } = await import("./worlds-BIQMvPkH.js"), a = new s(t, (n) => this.placeLabels(n), Math.min(window.devicePixelRatio || 1, 2));
        await a.load(this.config.model ?? i), this.island = a;
      } catch (s) {
        console.warn("HyggeHub: 3D energy card unavailable, showing the flat one", s), this.useFallback();
        return;
      }
      const e = t.parentElement;
      this.resizer = new ResizeObserver(() => {
        this.compact = e.clientWidth < 440, e.classList.toggle("compact", this.compact), this.island?.resize(e.clientWidth, e.clientHeight);
      }), this.resizer.observe(e), this.island.resize(e.clientWidth, e.clientHeight), this.seen = new IntersectionObserver((s) => {
        this.visible = s.some((i) => i.isIntersecting), this.resume();
      }), this.seen.observe(this), this.pushState(), this.resume(), this.island.intro(), e.classList.add("ready");
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
  /** The camera glides in, as when the house tab opens. */
  intro() {
    this.island?.intro();
  }
  // ---------- details ----------
  openDetail(t) {
    this.detail = t, t === "weather" ? (this.subscribeForecast(), this.island?.focus(null)) : this.island?.focus(t, this.compact ? "bottom" : "right");
  }
  closeDetail() {
    this.detail = void 0, this.island?.focus(null), this.unsubscribeForecast();
  }
  /** Both forecasts the integration offers, so switching hours and days is instant. */
  subscribeForecast() {
    const t = this.weatherId(), e = this.stateOf(t);
    if (!e || !this.hass) return;
    this.unsubscribeForecast();
    const s = e.attributes.supported_features ?? 0, i = [...s & 2 ? ["hourly"] : [], ...s & 1 ? ["daily"] : []];
    i.includes(this.forecastView) || (this.forecastView = i[0] ?? "daily"), this.forecastUnsubs = i.map(
      (a) => this.hass.connection.subscribeMessage((n) => this.forecast = { ...this.forecast, [a]: n.forecast ?? [] }, {
        type: "weather/subscribe_forecast",
        entity_id: t,
        forecast_type: a
      }).catch(() => () => {
      })
    );
  }
  unsubscribeForecast() {
    for (const t of this.forecastUnsubs) t.then((e) => e()).catch(() => {
    });
    this.forecastUnsubs = [];
  }
  detailPanel(t) {
    const e = t === "weather" ? this.stateOf(this.weatherId()) : void 0, s = t === "weather" ? void 0 : this.labels().find((n) => n.key === t);
    if (!s && !e) return p;
    const i = t === "weather" ? this.weatherBody() : this.detailBody(t), a = { grid: "Grid", solar: "Solar", car: this.config.car?.name ?? "Car", home: "Home", water: "Water", bins: "Bins", alarm: "Alarm", weather: "Weather" };
    return c`<div class="panel" role="dialog" aria-label=${a[t]} @keydown=${(n) => n.key === "Escape" && this.closeDetail()}>
      <div class="panel-h">
        <button type="button" class="back" @click=${() => this.closeDetail()}>
          <svg viewBox="0 0 24 24" class="i"><path d="M15 6l-6 6 6 6"></path></svg>Back
        </button>
        ${s ? c`<span class="ic" style="color:${s.color}"><svg viewBox="0 0 24 24" class="i"><path d=${s.icon}></path></svg></span>` : c`<span class="ic" style="color:var(--hh-accent)">${_(ve[e.state] ?? "mdi:weather-partly-cloudy")}</span>`}
        <h4>${a[t]}</h4>
      </div>
      <div class="panel-b">${i}</div>
    </div>`;
  }
  /** Now, then the hourly or daily forecast, switched with the two buttons at the top. */
  weatherBody() {
    const t = this.stateOf(this.weatherId());
    if (!t) return p;
    const e = this.forecast[this.forecastView] ?? [], s = String(t.attributes.temperature_unit ?? "°"), i = (o) => o === void 0 || !isFinite(o) ? "–" : `${Math.round(o)}${s.startsWith("°") ? "°" : s}`, a = be(t), n = !!this.forecast.hourly && !!this.forecast.daily, l = (o) => {
      const h = new Date(o.datetime);
      return this.forecastView === "hourly" ? h.toLocaleTimeString(C(this.hass), { hour: "2-digit", minute: "2-digit" }) : h.toLocaleDateString(C(this.hass), { weekday: "short", day: "numeric" });
    };
    return c`
      <div class="row"><span>Now</span><b class="num">${i(Number(t.attributes.temperature))} · ${Math.round(a.wind)} m/s</b></div>
      ${n ? c`<div class="seg" role="tablist">
            ${["hourly", "daily"].map(
      (o) => c`<button type="button" role="tab" aria-selected=${this.forecastView === o} @click=${() => this.forecastView = o}>${o === "hourly" ? "Hours" : "Days"}</button>`
    )}
          </div>` : p}
      ${e.length ? c`<ul class="forecast">
            ${e.slice(0, this.forecastView === "hourly" ? 24 : 10).map(
      (o) => c`<li>
                <span class="num">${l(o)}</span>
                <span class="fi">${_(ve[o.condition ?? ""] ?? "mdi:weather-partly-cloudy")}</span>
                <b class="num">${i(o.temperature)}${o.templow !== void 0 ? c`<small> / ${i(o.templow)}</small>` : p}</b>
                <small class="num">${o.precipitation ? `${o.precipitation} mm` : ""}</small>
              </li>`
    )}
          </ul>` : c`<p class="note">Reading the forecast…</p>`}
      <button type="button" class="more" @click=${() => this.moreInfo(t.entity_id)}>History and settings</button>
    `;
  }
  alarmId() {
    const t = this.config.alarm;
    return typeof t == "string" ? t : t?.entity;
  }
  /** The alarm card itself, frameless, so arming looks and works exactly as it does on the dashboard. */
  alarmBody() {
    const t = this.config.alarm;
    if (!t) return p;
    if (!this.alarmCard) {
      const e = document.createElement("hyggehub-alarm-card");
      try {
        e.setConfig({ type: "custom:hyggehub-alarm-card", ...typeof t == "string" ? { entity: t } : t, embedded: !0 });
      } catch (s) {
        return c`<p class="note">${s.message}</p>`;
      }
      e.classList.add("embedded-card"), this.alarmCard = e;
    }
    return this.alarmCard.hass = this.hass, c`${this.alarmCard}`;
  }
  detailBody(t) {
    const e = this.config, s = this.readings(), i = e.grid ? void 0 : this.meters?.energy, a = (d) => d === void 0 ? "–" : `${d.toFixed(d < 10 ? 2 : 1)} kWh`, n = (d, u) => c`<div class="row"><span>${d}</span><b class="num">${u}</b></div>`, l = s.metered && s.energyHour ? `Hour ${ut(s.energyHour)}` : "Now", o = s.home !== void 0 && s.home > 0 ? Math.round(Math.max(0, Math.min(1, 1 - Math.max(s.grid, 0) / s.home)) * 100) : void 0, h = (d) => d ? c`<button type="button" class="more" @click=${() => this.moreInfo(d)}>History and settings</button>` : p, g = s.metered ? c`<p class="note">From the meters, which report a few hours late: the newest hour with readings, as an average.</p>` : p;
    switch (t) {
      case "grid":
        return c`${n(l, `${U(s.grid)} ${s.grid < -0.02 ? "out" : "in"}`)}
          ${i ? c`${n("Bought", a(i.bought))}${e.grid_export_meter ? n("Sold", a(i.sold)) : p}` : p}
          ${g}${h(e.grid ?? e.grid_meter)}`;
      case "solar":
        return c`${n(l, U(s.solar))}
          ${i?.solar !== void 0 ? n("Produced", a(i.solar)) : p}
          ${o !== void 0 ? n("Own power used", `${o}%`) : p}
          ${g}${h(e.solar ?? e.solar_meter)}`;
      case "home":
        return c`${n(l, U(s.home ?? 0))}
          ${o !== void 0 ? n("Self-sufficient", `${o}%`) : p}
          ${n("From the grid", U(Math.max(0, s.grid)))}
          ${e.solar || e.solar_meter ? n("From solar", U(Math.max(0, Math.min(s.solar, s.home ?? 0)))) : p}
          ${g}${h(e.home)}`;
      case "water":
        return c`${s.metered || !e.water ? n(s.waterHour ? `Hour ${ut(s.waterHour)}` : "Last hour", s.water !== void 0 ? `${Math.round(s.water * 60)} L` : "–") : n("Now", s.water !== void 0 ? `${s.water.toFixed(1)} L/min` : "–")}
          ${h(e.water ?? e.water_meter)}`;
      case "car": {
        const d = s.car, u = e.car ?? {};
        return !d || d.soc === void 0 && !u.charging && !u.plugged ? c`<p class="note">Parked. Add <code>battery</code>, <code>charging</code>, <code>charging_power</code> and <code>plugged</code> under <code>car:</code> to see the battery and charging here.</p>` : c`${d.soc !== void 0 ? n("Battery", `${Math.round(d.soc)}%`) : p}
          ${n("Status", d.charging ? "Charging" : d.plugged ? "Plugged in" : "Not plugged in")}
          ${d.charging && d.kw ? n("Charging at", U(d.kw)) : p}
          ${h(u.battery ?? u.charging)}`;
      }
      case "alarm":
        return this.alarmBody();
      case "bins": {
        const d = e.bins?.schedule?.length ? qt(e.bins).slice(0, 6) : [], u = (f) => {
          const m = at(f);
          return m === 0 ? "Today" : m === 1 ? "Tomorrow" : f.toLocaleDateString(C(this.hass), { weekday: "long", day: "numeric", month: "short" });
        };
        return c`<ul class="pickups">
          ${d.map(
          (f) => c`<li>
              <div class="when"><b>${u(f.day)}</b><small class="num">${at(f.day) > 1 ? `in ${at(f.day)} days` : ""}</small></div>
              ${f.bins.map(
            (m) => c`<div class="bin">
                  <span class="kinds">${m.kinds.map((b) => c`<span class="kind" style="--c:${b.color}" title=${b.name}>${_(b.icon)}</span>`)}</span>
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
    if (this.fallback) return c`${this.fallback}`;
    const t = this.config, e = this.readings(), s = e.home === void 0 ? void 0 : e.home > 0 ? Math.round(Math.max(0, Math.min(1, 1 - Math.max(e.grid, 0) / e.home)) * 100) : 100, i = this.labels();
    return c`
      <ha-card class=${Kt({ glass: !0, embedded: !!t.embedded })}>
        <div class=${Kt({ stage: !0, focused: !!this.detail })} style=${t.embedded ? "height:100%" : `height:${t.height ?? 340}px`}>
          <canvas role="img" aria-label=${i.map((a) => `${a.caption} ${a.value}`).join(", ")}></canvas>
          <div class="loading" aria-hidden="true"></div>
          ${i.map(
      (a) => c`<button type="button" class="tag" data-key=${a.key} @click=${() => this.openDetail(a.key)} aria-haspopup="dialog">
              <span class="ic" style="color:${a.color}"><svg viewBox="0 0 24 24" class="i"><path d=${a.icon}></path></svg></span>
              <span class="txt"><b class="num">${a.value}</b><small>${a.caption}</small></span>
              ${a.kinds?.length ? c`<span class="kinds">${a.kinds.map((n) => c`<span class="kind" style="--c:${n.color}" title=${n.name}>${_(n.icon)}</span>`)}</span>` : p}
            </button>`
    )}
          ${this.detail ? this.detailPanel(this.detail) : p}
        </div>
        <div class="card-h overlay">
          <div class="title">
            ${t.embedded ? p : c`<h3>${t.title ?? "Energy"}</h3>`}
            ${this.weatherChip()}
          </div>
          ${e.metered ? c`<span class="pill">${s !== void 0 ? c`<span class="dot"></span>${s}% own · ` : p}${e.energyHour ? ut(e.energyHour) : "Reading meters…"}</span>` : s !== void 0 ? c`<span class="pill"><span class="dot"></span>Self-sufficient ${s}%</span>` : p}
        </div>
        ${t.extras?.length ? c`<div class="extras num" style="grid-template-columns:repeat(${Math.min(3, t.extras.length)},1fr)">
              ${t.extras.slice(0, 3).map((a) => c`<button type="button" @click=${() => this.moreInfo(a.entity)}><small>${a.name}</small><b>${this.format(a.entity)}</b></button>`)}
            </div>` : p}
      </ha-card>
    `;
  }
};
ss.styles = [A, z, We];
let ht = ss;
re([
  y()
], ht.prototype, "meters");
re([
  y()
], ht.prototype, "detail");
re([
  y()
], ht.prototype, "forecast");
re([
  y()
], ht.prototype, "forecastView");
O("hyggehub-energy-3d-card", ht, "HyggeHub Energy 3D", "A floating island home with live power and water flows, weather and day/night light.");
const Qt = {
  brown: "#6b4528",
  "dark-brown": "#3f2a1c",
  "light-brown": "#8f6542",
  blonde: "#d9b26a",
  black: "#231c19",
  red: "#a2502a",
  auburn: "#7e3b22",
  grey: "#a9a6a1"
}, Mt = {
  blue: ["#a9d2f2", "#3a6ca6"],
  brown: ["#a7733f", "#4f2f15"],
  hazel: ["#9a6831", "#5f7d3c"],
  "green-brown": ["#9a6831", "#5f7d3c"],
  green: ["#a4d08e", "#3d7744"],
  grey: ["#c7cfd5", "#66747f"]
}, Zt = { light: "#f6d6bd", fair: "#efc4a2", medium: "#d9a07a", tan: "#b97a52", deep: "#7d4f35" }, xi = { woman: "#7fa38f", man: "#40607a", child: "#e0a94a", baby: "#c8d9ea" };
function qa(r = {}) {
  const t = r.preset ?? "man", e = r.eyes ? Mt[r.eyes.toLowerCase()] ?? (r.eyes.startsWith("#") ? [r.eyes, r.eyes] : Mt.brown) : Mt.brown, s = e[1], i = e[0];
  return {
    preset: t,
    hair: Jt(r.hair, Qt, Qt.brown),
    skin: Jt(r.skin, Zt, Zt.fair),
    shirt: r.shirt ?? xi[t],
    eyes: s,
    eyesInner: i,
    hairStyle: r.hair_style ?? (t === "woman" ? "long" : "short"),
    beard: r.beard
  };
}
const Fs = (r) => {
  const t = r.replace("#", ""), e = t.length === 3 ? t.split("").map((s) => s + s).join("") : t;
  return [0, 2, 4].map((s) => parseInt(e.slice(s, s + 2), 16) || 0);
}, wi = (r, t, e) => {
  const s = Fs(r), i = Fs(t);
  return "#" + s.map((a, n) => Math.round(a + (i[n] - a) * e).toString(16).padStart(2, "0")).join("");
}, it = (r, t) => wi(r, "#ffffff", t), T = (r, t) => wi(r, "#000000", t), Jt = (r, t, e) => r ? t[r.toLowerCase()] ?? (r.startsWith("#") ? r : e) : e, Ns = {
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
function Va(r = {}, t, e = !1) {
  const s = r.preset && r.preset in Ns ? r.preset : "man", i = Ns[s], a = Jt(r.skin, Zt, Zt.fair), n = Jt(r.hair, Qt, Qt.brown), l = r.shirt?.startsWith("#") ? r.shirt : xi[s], o = r.eyes?.toLowerCase() ?? "brown", h = Mt[o] ?? (r.eyes?.startsWith("#") ? [it(r.eyes, 0.45), T(r.eyes, 0.3)] : Mt.brown), g = T(a, 0.55), d = i.head, u = (M) => `${t}-${M}`, f = (M) => {
    const E = i.eyeY, [W, X] = i.sclera, K = i.iris;
    if (e) return k`<path d="M${M - W} ${E} Q${M} ${E + X * 0.7} ${M + W} ${E}" fill="none" stroke=${g} stroke-width="2.4" stroke-linecap="round"></path>`;
    const le = M < 100 ? -1 : 1;
    return k`<g class="eye">
      <ellipse cx=${M} cy=${E} rx=${W} ry=${X} fill="#fdfbf8"></ellipse>
      <ellipse cx=${M} cy=${E - X * 0.55} rx=${W * 0.9} ry=${X * 0.35} fill=${T(a, 0.15)} opacity=".18"></ellipse>
      <circle cx=${M} cy=${E + 0.6} r=${K} fill="url(#${u("iris")})"></circle>
      <circle cx=${M} cy=${E + 0.6} r=${K * 0.46} fill="#16110f"></circle>
      <circle cx=${M - K * 0.38} cy=${E - K * 0.38} r=${K * 0.3} fill="#fff"></circle>
      <circle cx=${M + K * 0.32} cy=${E + K * 0.38} r=${K * 0.13} fill="#fff" opacity=".85"></circle>
      <path
        d="M${M - W * 0.98} ${E - X * 0.12} Q${M} ${E - X * 1.22} ${M + W * 0.98} ${E - X * 0.12}${s === "woman" ? ` M${M + le * W * 0.9} ${E - X * 0.3} q${le * 2.6} ${-1.2} ${le * 4} ${-3.6}` : ""}"
        fill="none"
        stroke=${T(n, 0.45)}
        stroke-width=${s === "woman" ? 2.4 : s === "baby" ? 1.2 : 1.6}
        stroke-linecap="round"
        opacity=${s === "baby" ? 0.5 : 0.85}
      ></path>
    </g>`;
  }, m = (M) => {
    const E = i.eyeY - i.sclera[1] - (s === "baby" ? 6 : 5), W = i.sclera[0] + 1;
    return k`<path d="M${M - W} ${E + 1.5} Q${M} ${E - 3.5} ${M + W} ${E + 0.5}" fill="none" stroke=${T(n, 0.15)} stroke-width=${i.brow} stroke-linecap="round" opacity=${s === "baby" ? 0.45 : 0.9}></path>`;
  }, b = i.eyeY + (s === "baby" ? 10 : 11), v = i.mouthY, $ = i.mouthW, G = s === "baby" ? k`<path d="M${100 - $} ${v} Q100 ${v + 9} ${100 + $} ${v} Q100 ${v + 2} ${100 - $} ${v} Z" fill="#a9474a"></path>
          <path d="M${100 - $ * 0.5} ${v + 3.4} Q100 ${v + 6} ${100 + $ * 0.5} ${v + 3.4}" fill="none" stroke="#e58a8a" stroke-width="1.6" stroke-linecap="round"></path>` : s === "woman" ? k`<path d="M${100 - $} ${v} Q100 ${v + 8} ${100 + $} ${v} Q100 ${v + 2.6} ${100 - $} ${v} Z" fill="#c4656a"></path>` : k`<path d="M${100 - $} ${v} Q100 ${v + 7} ${100 + $} ${v}" fill="none" stroke=${g} stroke-width="2.8" stroke-linecap="round"></path>`, L = s === "woman" ? k`<path d="M84 147 Q100 166 116 147" fill=${T(a, 0.08)}></path>` : s === "baby" ? k`<path d="M76 161 Q100 174 124 161" fill="none" stroke=${it(l, 0.55)} stroke-width="5" stroke-linecap="round"></path>
            <circle cx="100" cy="176" r="2.2" fill=${it(l, 0.7)}></circle><circle cx="100" cy="184" r="2.2" fill=${it(l, 0.7)}></circle>` : k`<path d="M${100 - i.neck.w / 2 - 3} ${i.neck.y + i.neck.h - 4} Q100 ${i.neck.y + i.neck.h + 10} ${100 + i.neck.w / 2 + 3} ${i.neck.y + i.neck.h - 4}" fill="none" stroke=${T(l, 0.22)} stroke-width="4" stroke-linecap="round"></path>`;
  return k`<svg class="avatar" viewBox="20 22 160 160" aria-hidden="true">
    <defs>
      <radialGradient id=${u("skin")} cx="40%" cy="34%" r="72%" fx="36%" fy="28%">
        <stop offset="0" stop-color=${it(a, 0.28)}></stop>
        <stop offset=".6" stop-color=${a}></stop>
        <stop offset="1" stop-color=${T(a, 0.2)}></stop>
      </radialGradient>
      <linearGradient id=${u("neck")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${T(a, 0.28)}></stop>
        <stop offset=".55" stop-color=${T(a, 0.08)}></stop>
      </linearGradient>
      <radialGradient id=${u("hair")} cx="38%" cy="22%" r="85%" fx="34%" fy="18%">
        <stop offset="0" stop-color=${it(n, 0.3)}></stop>
        <stop offset=".5" stop-color=${n}></stop>
        <stop offset="1" stop-color=${T(n, 0.35)}></stop>
      </radialGradient>
      <linearGradient id=${u("shirt")} x1=".2" y1="0" x2=".8" y2="1">
        <stop offset="0" stop-color=${it(l, 0.2)}></stop>
        <stop offset="1" stop-color=${T(l, 0.22)}></stop>
      </linearGradient>
      <radialGradient id=${u("iris")} cx="50%" cy="50%" r="50%">
        <stop offset=".35" stop-color=${h[0]}></stop>
        <stop offset="1" stop-color=${h[1]}></stop>
      </radialGradient>
    </defs>
    <g class="figure">
      ${i.hairBack ? k`<path d=${i.hairBack} fill="url(#${u("hair")})"></path>` : p}
      <path d=${i.body} fill="url(#${u("shirt")})"></path>
      <rect x=${100 - i.neck.w / 2} y=${i.neck.y} width=${i.neck.w} height=${i.neck.h} rx=${i.neck.w / 2.4} fill="url(#${u("neck")})"></rect>
      ${L}
      ${i.ears ? k`<ellipse cx=${100 - i.ears.dx} cy=${i.ears.y} rx=${i.ears.rx} ry=${i.ears.ry} fill=${T(a, 0.06)}></ellipse>
            <ellipse cx=${100 + i.ears.dx} cy=${i.ears.y} rx=${i.ears.rx} ry=${i.ears.ry} fill=${T(a, 0.1)}></ellipse>` : p}
      <ellipse cx=${d.cx} cy=${d.cy} rx=${d.rx} ry=${d.ry} fill="url(#${u("skin")})"></ellipse>
      <ellipse cx=${d.cx - d.rx * 0.28} cy=${d.cy - d.ry * 0.38} rx=${d.rx * 0.34} ry=${d.ry * 0.16} fill="#fff" opacity=".16"></ellipse>
      <ellipse cx=${100 - i.eyeDX - 6} cy=${i.cheekY} rx=${s === "baby" ? 9 : 7} ry=${s === "baby" ? 5.5 : 4.2} fill="#ff8a80" opacity=${s === "baby" ? 0.34 : 0.22}></ellipse>
      <ellipse cx=${100 + i.eyeDX + 6} cy=${i.cheekY} rx=${s === "baby" ? 9 : 7} ry=${s === "baby" ? 5.5 : 4.2} fill="#ff8a80" opacity=${s === "baby" ? 0.34 : 0.22}></ellipse>
      ${s === "child" ? k`<g fill=${T(a, 0.35)} opacity=".55"><circle cx="89" cy="111" r="1"></circle><circle cx="93" cy="113" r=".9"></circle><circle cx="107" cy="113" r=".9"></circle><circle cx="111" cy="111" r="1"></circle></g>` : p}
      ${f(100 - i.eyeDX)} ${f(100 + i.eyeDX)} ${m(100 - i.eyeDX)} ${m(100 + i.eyeDX)}
      <path d="M97 ${b} Q100 ${b + 4.5} 103 ${b}" fill="none" stroke=${T(a, 0.28)} stroke-width="2" stroke-linecap="round"></path>
      <ellipse cx="99" cy=${b - 4} rx="2" ry="1.2" fill="#fff" opacity=".35"></ellipse>
      ${G}
      <path d=${i.hairFront} fill="url(#${u("hair")})"></path>
      ${s === "baby" ? k`<path d="M98 51 C89 45 91 32 102 32 C110 33 111 42 103 44" fill="none" stroke="url(#${u("hair")})" stroke-width="5.5" stroke-linecap="round"></path>` : p}
      <path d=${i.sheen} fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".2"></path>
      ${s === "woman" ? k`<circle cx="60" cy="112" r="2.4" fill="#e8c77a"></circle><circle cx="140" cy="112" r="2.4" fill="#e8c77a"></circle>` : p}
    </g>
  </svg>`;
}
const Ga = 5 * 6e4, xe = /* @__PURE__ */ new Map(), Hs = (r) => r.length === 10 ? { d: /* @__PURE__ */ new Date(`${r}T00:00:00`), allDay: !0 } : { d: new Date(r), allDay: !1 };
function $i(r, t, e = !1, s = 7) {
  const i = `${[...t].sort().join(",")}|${s}`, a = xe.get(i);
  if (a && Date.now() - a.at < (e ? 3e4 : Ga)) return a.events;
  const n = /* @__PURE__ */ new Date();
  n.setHours(0, 0, 0, 0);
  const l = new Date(n.getTime() + s * 864e5), o = r.callWS({
    type: "call_service",
    domain: "calendar",
    service: "get_events",
    target: { entity_id: t },
    service_data: { start_date_time: n.toISOString(), end_date_time: l.toISOString() },
    return_response: !0
  }).then(
    (h) => Object.values(h?.response ?? {}).flatMap((g) => g.events ?? []).map((g) => {
      const d = Hs(g.start);
      return { summary: g.summary ?? "", start: d.d, end: Hs(g.end).d, allDay: d.allDay, location: g.location || void 0, description: g.description || void 0 };
    }).sort((g, d) => g.start.getTime() - d.start.getTime())
  ).catch((h) => (console.warn("HyggeHub: could not read calendars", t, h), xe.delete(i), []));
  return xe.set(i, { at: Date.now(), events: o }), o;
}
function ki(r, t) {
  if (!t) return r;
  const e = t.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return r.filter((s) => {
    const i = `${s.summary} ${s.description ?? ""}`.toLowerCase();
    return e.some((a) => i.includes(a));
  });
}
function Dt(r, t = /* @__PURE__ */ new Date()) {
  const e = t.getTime(), s = r.filter((a) => a.start.getTime() <= e && a.end.getTime() > e);
  s.sort((a, n) => Number(a.allDay) - Number(n.allDay));
  const i = r.filter((a) => a.start.getTime() > e);
  return { now: s[0], upcoming: i };
}
const te = (r) => r?.split(/,|\n/)[0].trim(), Bs = {
  cooking: /cook|kitchen|food|bak|mad|køkken/,
  tech: /tech|gadget|computer|code|drone|it\b|nørd/,
  gardening: /garden|plant|have\b|flower|blomst/,
  decor: /decor|interior|furnish|home|bolig|indretning|design/,
  bugs: /bug|insect|beetle|butterfl|insekt|kryb/,
  pokemon: /pok[eé]mon/,
  nature: /nature|natur|forest|skov|outdoor/,
  cars: /car|digger|bobcat|excavat|truck|construct|bil|gravko|maskin|tractor|traktor/
}, js = (r = []) => r.map((t) => t.toLowerCase()).flatMap((t) => Object.keys(Bs).filter((e) => Bs[e].test(t))).filter((t, e, s) => s.indexOf(t) === e);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Xa = je(class extends Re {
  constructor() {
    super(...arguments), this.key = p;
  }
  render(r, t) {
    return this.key = r, t;
  }
  update(r, [t, e]) {
    return t !== this.key && (ci(r), this.key = t), e;
  }
});
var Ka = Object.defineProperty, _i = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && Ka(t, e, i), i;
};
let Qa = 0;
const q = (r) => r.calendar ? [].concat(r.calendar) : [], Za = (r) => [r.entity, r.battery, r.charging, r.distance, r.sleep, ...q(r), ...(r.stats ?? []).map((t) => t.entity)], Rs = (r, t) => (/* @__PURE__ */ new Date()).toDateString() === r.toDateString() ? D(r, t) : r.toLocaleDateString(C(t), { weekday: "long" });
function Mi(r, t, e) {
  const s = t.entity ? r?.states[t.entity] : void 0, i = t.sleep ? r?.states[t.sleep] : void 0, a = i?.state === "on", n = e ? Dt(e).now : void 0;
  let l = "none", o = "", h = s ? `since ${Rs(new Date(s.last_changed), r)}` : "", g = !1;
  const d = s && s.state !== "unknown" && s.state !== "unavailable" ? s.state : void 0;
  if (d === "home")
    l = "home", o = "Home";
  else if (d && d !== "not_home")
    l = "zone", o = d;
  else if (n) {
    l = "zone", g = !0;
    const m = te(n.location);
    o = m && m.toLowerCase() !== n.summary.toLowerCase() ? `${n.summary} · ${m}` : n.summary, h = n.allDay ? "all day" : `until ${D(n.end, r)}`;
  } else d === "not_home" ? (l = "away", o = "Away") : t.default_location ? (l = t.default_location.toLowerCase() === "home" ? "home" : "zone", o = l === "home" ? "Home" : t.default_location, h = "") : s && (o = "Location unknown");
  if (!g && l !== "home") {
    const m = t.distance ? r?.states[t.distance] : void 0;
    m && H(m) !== void 0 && d && (o += ` · ${De(r, m)} away`);
  }
  let u = "";
  if (a) {
    const m = (Date.now() - new Date(i.last_changed).getTime()) / 6e4;
    u = m < 60 ? `${Math.max(1, Math.round(m))} min` : `${Math.floor(m / 60)} h ${Math.round(m % 60)} min`, o = `Asleep · ${u}`;
  }
  a ? h = `since ${Rs(new Date(i.last_changed), r)}` : l === "none" && (h = "");
  const f = d === "home" && Date.now() - new Date(s.last_changed).getTime() < 10 * 6e4;
  return { presence: l, asleep: a, label: o || "No location", since: h, justArrived: f, sleepFor: u, fromPlan: g };
}
function St(r, t, e) {
  if (t) return "Now";
  const s = /* @__PURE__ */ new Date(), i = new Date(s.getTime() + 864e5), a = (l, o) => l.toDateString() === o.toDateString(), n = a(r.start, s) ? "" : a(r.start, i) ? "Tomorrow" : r.start.toLocaleDateString(C(e), { weekday: "short" });
  return r.allDay ? n || "Today" : n ? `${n} ${D(r.start, e)}` : D(r.start, e);
}
function ee(r, t) {
  const e = t.battery ? r?.states[t.battery] : void 0, s = H(e);
  if (s === void 0) return;
  const i = t.charging ? r?.states[t.charging]?.state.toLowerCase() : void 0, a = i === "on" || i === "charging" || String(e.attributes.battery_state ?? "").toLowerCase() === "charging";
  return { level: Math.round(s), charging: a };
}
const Ws = (r, t) => k`<svg class="bat" viewBox="0 0 24 24" aria-hidden="true">
  <rect x="2.5" y="7" width="17" height="10" rx="2.6" fill="none" stroke="currentColor" stroke-width="1.6"></rect>
  <rect x="20.4" y="10" width="2" height="4" rx="1" fill="currentColor"></rect>
  <rect x="4.6" y="9.1" width=${Math.max(0.8, 12.8 * r / 100)} height="5.8" rx="1.3" fill="currentColor"></rect>
  ${t ? k`<path d="M11.6 6.2 8.4 12.4h3.2l-.9 5.4 3.9-6.6h-3.3l1.1-5z" fill="var(--hh-bg)" stroke="currentColor" stroke-width=".9" stroke-linejoin="round"></path>` : p}
</svg>`;
function Us(r, t, e, s) {
  return c`<span class="pwrap" data-presence=${t.presence} data-arrived=${t.justArrived} style="--breathe-delay:${s}s">
    <span class="portrait">${r.picture ? c`<img src=${r.picture} alt="" />` : Va(r.avatar, e, t.asleep)}</span>
    ${t.asleep ? c`<span class="zz" aria-hidden="true"><i>z</i><i>z</i><i>z</i></span>` : p}
  </span>`;
}
const Ja = S`
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
`, tn = 6e4, en = (r) => [r.battery, r.range, r.charging, r.charging_power, r.time_to_full, r.target, r.plugged, r.location, r.climate, r.lock, r.odometer, ...(r.stats ?? []).map((t) => t.entity)], Ys = (r) => {
  if (!r) return !1;
  const t = r.toLowerCase();
  return t === "on" || t === "true" || t === "charging" || t === "connected" || t === "plugged" || t.includes("charging") && !t.includes("not");
}, is = class is extends P {
  constructor() {
    super(...arguments), this.events = [], this.view = { kind: "family" }, this.avatarId = `hh-fam${++Qa}`, this.back = () => {
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
    return [...this.config.people.flatMap(Za), ...(this.config.cars ?? []).flatMap(en)];
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
    const e = this.config.people, s = e.flatMap(q);
    if (!s.length) return;
    const i = JSON.stringify(e.map((l) => [q(l), l.calendar_match])), a = t.get("hass"), n = !!a && s.some((l) => a.states[l] !== this.hass.states[l]);
    (i !== this.loadedFor || n) && (this.loadedFor = i, this.loadEvents(n));
  }
  async loadEvents(t) {
    const e = this.hass;
    e && (this.events = await Promise.all(
      this.config.people.map((s) => {
        if (!q(s).length) return Promise.resolve(void 0);
        const i = q(s).filter((a) => e.states[a]);
        return i.length ? $i(e, i, t).then((a) => ki(a, s.calendar_match)) : Promise.resolve([]);
      })
    ));
  }
  // ---------- navigation ----------
  open(t) {
    this.view = t, this.armBack();
  }
  /** Back to the family after a minute without a touch, so a wall tablet doesn't stay on one page. */
  armBack() {
    clearTimeout(this.backTimer), this.view.kind !== "family" && (this.backTimer = window.setTimeout(this.back, tn));
  }
  /** Now and then one awake person blinks: a 150 ms class change rather than a never-ending animation. */
  blinkSomeone() {
    if (!x.motionOn || document.hidden || !this.onScreen) return;
    const t = [...this.renderRoot.querySelectorAll(".portrait")].filter((s) => s.querySelector(".eye")), e = t[Math.floor(Math.random() * t.length)];
    e && (e.classList.add("blinking"), setTimeout(() => e.classList.remove("blinking"), 150));
  }
  // ---------- helpers ----------
  name(t) {
    return t.name ?? I(t.entity ? this.stateOf(t.entity) : void 0, "Someone");
  }
  /** "Football · Thu 16:30": the next thing within a day and a half, for the family view. */
  nextUp(t) {
    const e = t ? Dt(t).upcoming[0] : void 0;
    return !e || e.start.getTime() - Date.now() > 36 * 36e5 ? "" : `${e.summary} · ${St(e, !1, this.hass)}`;
  }
  statValue(t) {
    const e = this.stateOf(t);
    if (e?.attributes.device_class === "timestamp") {
      const s = new Date(e.state);
      if (!isNaN(s.getTime())) return Ai(s);
    }
    return this.format(t);
  }
  car(t) {
    const e = H(this.stateOf(t.battery)), s = Ys(this.stateOf(t.charging)?.state), i = Ys(this.stateOf(t.plugged)?.state) || s, a = j(this.stateOf(t.charging_power)), n = H(this.stateOf(t.target)), l = this.stateOf(t.time_to_full);
    let o;
    if (l)
      if (l.attributes.device_class === "timestamp") {
        const d = new Date(l.state);
        isNaN(d.getTime()) || (o = D(d, this.hass));
      } else {
        const d = H(l), u = String(l.attributes.unit_of_measurement ?? "min").toLowerCase(), f = d === void 0 ? void 0 : u.startsWith("h") ? d * 60 : d;
        f && f > 0 && (o = D(new Date(Date.now() + f * 6e4), this.hass));
      }
    const h = this.stateOf(t.location)?.state, g = !h || h === "unknown" || h === "unavailable" ? "" : h === "home" ? "Parked at home" : h === "not_home" ? "Away" : `At ${h}`;
    return { level: e, charging: s, plugged: i, power: a, target: n, fullAt: o, where: g, colour: yi(t.color) };
  }
  // ---------- family view ----------
  renderFamily(t) {
    const e = this.config.people;
    return c`<div class="people">
      ${e.map((s, i) => {
      const a = t[i], n = ee(this.hass, s), l = this.name(s), o = n ? n.charging ? "bat-charging" : n.level <= 20 ? "bat-low" : "" : "", h = this.nextUp(this.events[i]);
      return c`<button
          class="member"
          type="button"
          aria-label="${l}: ${a.label}. Show ${l}'s page"
          data-presence=${a.presence}
          data-asleep=${a.asleep}
          @click=${() => this.tap(() => this.open({ kind: "person", i }))}
          @pointerdown=${() => this.holdStart(() => this.moreInfo(s.entity ?? s.sleep))}
          @pointerup=${this.holdEnd}
          @pointerleave=${this.holdEnd}
          @pointercancel=${this.holdEnd}
        >
          ${Us(s, a, `${this.avatarId}-${i}`, i * -1.6)}
          <b class="name">${l}</b>
          <span class="where"><span class="dot"></span><span class="lbl">${a.asleep ? "Asleep" : a.label.split(" · ")[0]}</span></span>
          ${h ? c`<span class="next" title=${h}>${h}</span>` : p}
          ${n ? c`<span class="mini-bat num ${o}">${Ws(n.level, n.charging)}${n.level}%</span>` : p}
        </button>`;
    })}
    </div>`;
  }
  // ---------- person page ----------
  renderPerson(t, e) {
    const s = this.config.people[t], i = this.events[t], a = this.name(s), n = ee(this.hass, s), l = n ? n.charging ? "bat-charging" : n.level <= 20 ? "bat-low" : "" : "", o = s.sleep?.startsWith("input_boolean."), { now: h, upcoming: g } = i ? Dt(i) : { now: void 0, upcoming: [] }, d = [...h ? [{ e: h, isNow: !0 }] : [], ...g.slice(0, Math.max(s.agenda ?? 3, 3)).map((m) => ({ e: m, isNow: !1 }))], u = q(s).length > 0, f = [
      s.sleep ? c`<button
            class="tile big ${e.asleep ? "sleeping" : ""}"
            type="button"
            aria-pressed=${o ? e.asleep : p}
            @click=${() => o ? this.callService("input_boolean", "toggle", {}, { entity_id: s.sleep }) : this.moreInfo(s.sleep)}
          >
            <span class="ti">${_(e.asleep ? "mdi:sleep" : "mdi:white-balance-sunny")}</span>
            <span class="tt"><small>${o ? e.asleep ? "Tap when awake" : "Tap at bedtime" : "Sleep"}</small><b>${e.asleep ? `Asleep ${e.sleepFor}` : "Awake"}</b></span>
          </button>` : p,
      n ? c`<button class="tile" type="button" @click=${() => this.moreInfo(s.battery)}>
            <span class="ti ${l}">${Ws(n.level, n.charging)}</span>
            <span class="tt"><small>${n.charging ? "Charging" : s.battery_label ?? "Phone"}</small><b class="num">${n.level}%</b></span>
          </button>` : p,
      ...(s.stats ?? []).map(
        (m) => c`<button class="tile" type="button" @click=${() => this.moreInfo(m.entity)}>
          <span class="ti">${_(m.icon ?? this.stateOf(m.entity)?.attributes.icon ?? "mdi:information-outline")}</span>
          <span class="tt"><small>${m.name ?? I(this.stateOf(m.entity), m.entity)}</small><b>${this.statValue(m.entity)}</b></span>
        </button>`
      )
    ].filter((m) => m !== p);
    return c`<div class="page" data-presence=${e.presence} data-asleep=${e.asleep}>
      <div class="hero">
        <button class="hero-portrait" type="button" aria-label="${a}: details" @click=${() => this.moreInfo(s.entity ?? s.sleep)}>
          ${Us(s, e, `${this.avatarId}-p${t}`, 0)}
        </button>
        <div class="who">
          <h2>${a}</h2>
          <span class="where"><span class="dot"></span>${e.label}${e.fromPlan ? c`<span class="plan" title="From the calendar">${_("mdi:calendar-clock")}</span>` : p}</span>
          ${e.since ? c`<span class="since">${e.since}</span>` : p}
        </div>
      </div>
      <div class="cols">
        ${u ? c`<section class="block">
              <h4>Plan</h4>
              ${i ? d.length ? c`<div class="agenda">
                      ${d.map(({ e: m, isNow: b }) => {
      const v = te(m.location), $ = [b && !m.allDay ? `until ${D(m.end, this.hass)}` : "", v].filter(Boolean).join(" · ");
      return c`<div class="ev ${b ? "now" : ""}" title=${m.location ?? ""}>
                          <span class="when num">${St(m, b, this.hass)}</span>
                          <span class="what"><b>${m.summary}</b>${$ ? c`<small>${$}</small>` : p}</span>
                        </div>`;
    })}
                    </div>` : c`<p class="nothing">Nothing planned this week</p>` : c`<p class="nothing">Reading the calendar…</p>`}
            </section>` : p}
        ${f.length ? c`<section class="block"><h4>Status</h4><div class="tiles">${f}</div></section>` : p}
      </div>
    </div>`;
  }
  // ---------- car page ----------
  renderCar(t) {
    const e = this.config.cars[t], s = this.car(e), i = s.level ?? 0, a = s.charging ? `Charging${s.power !== void 0 ? ` · ${s.power.toFixed(1)} kW` : ""}` : s.plugged ? "Plugged in, not charging" : s.where || "Parked", n = s.charging && s.fullAt ? `Full at ${s.fullAt}` : s.charging || s.plugged ? s.where : "", l = e.climate ? !["off", "unavailable", "unknown"].includes(this.stateOf(e.climate)?.state ?? "off") : !1, o = this.stateOf(e.lock)?.state, h = o === "locked" || o === "off", g = [
      e.range ? this.tile("mdi:map-marker-distance", "Range", this.format(e.range), e.range) : p,
      e.target ? this.tile("mdi:battery-arrow-up-outline", "Charge limit", this.format(e.target), e.target) : p,
      s.charging && s.fullAt ? this.tile("mdi:clock-outline", "Full at", s.fullAt, e.time_to_full) : p,
      e.plugged ? this.tile(s.plugged ? "mdi:power-plug" : "mdi:power-plug-off-outline", "Cable", s.plugged ? "Plugged in" : "Unplugged", e.plugged) : p,
      e.climate ? c`<button class="tile ${l ? "on" : ""}" type="button" aria-pressed=${l} @click=${() => this.callService("homeassistant", "toggle", {}, { entity_id: e.climate })}>
            <span class="ti">${_("mdi:fan")}</span>
            <span class="tt"><small>Climate</small><b>${l ? "On · tap to stop" : "Off · tap to start"}</b></span>
          </button>` : p,
      e.lock ? this.tile(h ? "mdi:lock-outline" : "mdi:lock-open-variant-outline", "Doors", h ? "Locked" : "Unlocked", e.lock) : p,
      e.odometer ? this.tile("mdi:counter", "Odometer", this.format(e.odometer), e.odometer) : p,
      ...(e.stats ?? []).map((d) => this.tile(d.icon ?? "mdi:information-outline", d.name ?? I(this.stateOf(d.entity), d.entity), this.statValue(d.entity), d.entity))
    ].filter((d) => d !== p);
    return c`<div class="page car-page" data-charging=${s.charging}>
      <div class="hero">
        <div class="car-art">
          ${Ha(s.colour, `${this.avatarId}-car${t}`, s.charging)}
          ${s.charging ? c`<span class="plug-pulse" aria-hidden="true"></span>` : p}
        </div>
        <div class="who">
          <h2>${e.name}</h2>
          <span class="where car-status"><span class="dot"></span>${a}</span>
          ${n ? c`<span class="since">${n}</span>` : p}
        </div>
      </div>
      <button class="charge" type="button" style="--lvl:${i / 100};--target:${(s.target ?? 100) / 100}" @click=${() => this.moreInfo(e.battery)}>
        <span class="charge-bar ${i <= 20 ? "low" : ""}">
          <i class="fill"></i>
          ${s.charging ? c`<i class="sheen"></i>` : p}
          ${s.target !== void 0 && s.target < 100 ? c`<i class="target"></i>` : p}
        </span>
        <span class="charge-row num">
          <b>${s.level !== void 0 ? `${Math.round(i)}%` : "–"}</b>
          ${e.range ? c`<span>${this.format(e.range)}</span>` : p}
        </span>
      </button>
      ${g.length ? c`<div class="tiles car-tiles">${g}</div>` : p}
    </div>`;
  }
  tile(t, e, s, i) {
    return c`<button class="tile" type="button" @click=${() => this.moreInfo(i)}>
      <span class="ti">${_(t)}</span>
      <span class="tt"><small>${e}</small><b>${s}</b></span>
    </button>`;
  }
  // ---------- frame ----------
  render() {
    const t = this.config.people, e = t.map((g, d) => Mi(this.hass, g, this.events[d])), s = e.filter((g) => g.presence !== "none"), i = s.filter((g) => g.presence === "home").length, a = s.length ? i === s.length ? "All home" : i === 0 ? "No one home" : `${i} of ${s.length} home` : "", n = this.view, l = this.config.cars ?? [], o = n.kind === "person" ? this.name(t[n.i]) : n.kind === "car" ? l[n.i]?.name : "", h = n.kind === "family" ? "family" : `${n.kind}-${n.i}`;
    return c`<ha-card class="glass family" @pointerdown=${() => this.armBack()}>
      <div class="bar">
        ${n.kind === "family" ? c`<h3>${this.config.title ?? "Family"}</h3>
              ${a ? c`<span class="pill">${a}</span>` : p}` : c`<nav class="crumbs" aria-label="Breadcrumb">
              <button class="back" type="button" @click=${this.back}>${w("left")}<span>${this.config.title ?? "Family"}</span></button>
              <span class="sep" aria-hidden="true">›</span>
              <b aria-current="page">${o}</b>
            </nav>`}
        <span class="spacer"></span>
        ${l.map((g, d) => {
      const u = this.car(g);
      return c`<button
            class="car-chip ${n.kind === "car" && n.i === d ? "current" : ""}"
            type="button"
            data-charging=${u.charging}
            aria-label="${g.name}: ${u.level !== void 0 ? `${Math.round(u.level)}%` : "battery unknown"}${u.charging ? ", charging" : ""}"
            @click=${() => this.open({ kind: "car", i: d })}
          >
            ${_("mdi:car-electric-outline")}<span class="num">${u.level !== void 0 ? `${Math.round(u.level)}%` : "–"}</span>
            ${u.charging ? c`<span class="bolt" aria-hidden="true">${_("mdi:lightning-bolt")}</span>` : p}
          </button>`;
    })}
      </div>
      ${Xa(
      h,
      c`<div class="view">
          ${n.kind === "family" ? this.renderFamily(e) : n.kind === "person" ? this.renderPerson(n.i, e[n.i]) : this.renderCar(n.i)}
        </div>`
    )}
    </ha-card>`;
  }
};
is.styles = [
  A,
  z,
  Ja,
  S`
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
let Ot = is;
_i([
  y()
], Ot.prototype, "events");
_i([
  y()
], Ot.prototype, "view");
O("hyggehub-family-card", Ot, "HyggeHub Family", "Everyone in the home, and the car: tap one for their own page.");
var sn = Object.defineProperty, an = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && sn(t, e, i), i;
};
class Ue extends P {
  constructor() {
    super(...arguments), this.failed = !1, this.visible = !0, this.compact = !1, this.onEngine = () => this.push(), this.hidden3d = !1, this.dock = !1, this.tickEvery = 6e4;
  }
  getCardSize() {
    return 7;
  }
  connectedCallback() {
    super.connectedCallback(), clearTimeout(this.disposeTimer), x.addEventListener("change", this.onEngine), this.ticker = window.setInterval(() => this.requestUpdate(), this.tickEvery), this.world && this.resume();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), x.removeEventListener("change", this.onEngine), clearInterval(this.ticker), this.world?.stop(), this.disposeTimer = window.setTimeout(() => {
      this.resizer?.disconnect(), this.seen?.disconnect(), this.world?.dispose(), this.world = void 0, this.loading = void 0;
    }, 3e4);
  }
  firstUpdated() {
    this.init();
  }
  updated(t) {
    super.updated(t), this.push();
  }
  /** Light and motion as the house uses them: night from the sun, else from the HyggeHub look. */
  look() {
    const t = this.hass?.states["sun.sun"], e = Number(t?.attributes.elevation);
    return { night: isFinite(e) ? Math.min(1, Math.max(0, (6 - e) / 12)) : t ? t.state === "below_horizon" ? 1 : 0 : x.resolved?.slot === "night" ? 1 : 0, motion: x.motionOn };
  }
  push() {
    this.world && this.config && this.world.setState(this.worldState());
  }
  init() {
    return this.loading ??= (async () => {
      const t = this.renderRoot.querySelector("canvas");
      if (!t) return;
      try {
        const s = await import("./worlds-BIQMvPkH.js");
        this.world = this.createWorld(s, t, (i) => this.placeLabels(i), Math.min(window.devicePixelRatio || 1, 2));
      } catch (s) {
        console.warn("HyggeHub: 3D view unavailable", s), this.failed = !0, this.requestUpdate();
        return;
      }
      const e = t.parentElement;
      this.resizer = new ResizeObserver(() => {
        this.compact = e.clientWidth < 440, e.classList.toggle("compact", this.compact), this.world?.resize(e.clientWidth, e.clientHeight);
      }), this.resizer.observe(e), this.seen = new IntersectionObserver((s) => {
        this.visible = s.some((i) => i.isIntersecting), this.resume();
      }), this.seen.observe(this), this.push(), this.world.resize(e.clientWidth, e.clientHeight), this.resume(), this.world.intro(), e.classList.add("ready");
    })();
  }
  resume() {
    if (!this.world) {
      this.isConnected && !this.failed && this.init();
      return;
    }
    this.hidden3d ? this.world.stop() : this.visible && this.isConnected && x.motionOn ? this.world.start() : (this.world.stop(), this.world.renderOnce());
  }
  placeLabels(t) {
    for (const e of t) {
      const s = this.renderRoot.querySelector(`.tag[data-key="${CSS.escape(e.key)}"]`);
      s && (s.style.transform = `translate(${e.x}px, ${e.y}px) translate(-50%, -50%)`, s.classList.toggle("off", !e.visible));
    }
  }
  /** Stop drawing the scene while something else covers it, and pick up again after. */
  hide3d(t) {
    t !== this.hidden3d && (this.hidden3d = t, this.resume(), t || this.world?.intro());
  }
  openDetail(t) {
    this.detail = t, this.world?.focus(t, this.compact ? "bottom" : "right");
  }
  closeDetail() {
    this.detail = void 0, this.world?.focus(null);
  }
  /** Over the scene's top-left, under the title. */
  renderHeaderExtras() {
    return p;
  }
  /** Inside the stage, under the labels: a view's own controls (the countdowns' arrows and dots). */
  renderStageExtras() {
    return p;
  }
  /** The camera glides in, as when the view's tab opens. */
  intro() {
    this.world?.intro();
  }
  glyph(t) {
    return t.startsWith("mdi:") ? _(t) : c`<svg viewBox="0 0 24 24" class="i"><path d=${t}></path></svg>`;
  }
  render() {
    const t = this.config;
    if (this.failed) return c`<ha-card class="glass"><p class="note" style="padding:18px">3D needs WebGL, which this browser doesn't offer.</p></ha-card>`;
    const e = this.labels(), s = this.detail ? e.find((i) => i.key === this.detail) : void 0;
    return c`
      <ha-card class=${Kt({ glass: !0, embedded: !!t.embedded, docked: this.dock })}>
        <div class=${Kt({ stage: !0, focused: !!this.detail })} style=${t.embedded ? "height:100%" : `height:${t.height ?? 380}px`}>
          <canvas role="img" aria-label=${e.map((i) => `${i.caption} ${i.value}`).join(", ")}></canvas>
          <div class="loading" aria-hidden="true"></div>
          ${this.renderStageExtras()}
          ${e.map(
      (i) => c`<button type="button" class="tag" data-key=${i.key} @click=${() => this.openDetail(i.key)} aria-haspopup="dialog">
              <span class="ic" style="color:${i.color}">${this.glyph(i.icon)}</span>
              <span class="txt"><b class="num">${i.value}</b><small>${i.caption}</small></span>
              ${i.chips?.length ? c`<span class="kinds">${i.chips.map((a) => c`<span class="kind" style="--c:${a.color}" title=${a.name}>${_(a.icon)}</span>`)}</span>` : p}
            </button>`
    )}
          ${this.detail && this.dock ? c`<button type="button" class="dock-back" @click=${() => this.closeDetail()}><svg viewBox="0 0 24 24" class="i"><path d="M15 6l-6 6 6 6"></path></svg><b>Back</b></button>
                <div class="dock" role="dialog" aria-label=${this.detailTitle(this.detail)} @keydown=${(i) => i.key === "Escape" && this.closeDetail()}>${this.detailBody(this.detail)}</div>` : this.detail ? c`<div class="panel" role="dialog" aria-label=${this.detailTitle(this.detail)} @keydown=${(i) => i.key === "Escape" && this.closeDetail()}>
                <div class="panel-h">
                  <button type="button" class="back" @click=${() => this.closeDetail()}><svg viewBox="0 0 24 24" class="i"><path d="M15 6l-6 6 6 6"></path></svg>Back</button>
                  ${s ? c`<span class="ic" style="color:${s.color}">${this.glyph(s.icon)}</span>` : p}
                  <h4>${this.detailTitle(this.detail)}</h4>
                </div>
                <div class="panel-b">${this.detailBody(this.detail)}</div>
              </div>` : p}
        </div>
        <div class="card-h overlay">
          <div class="title">
            ${t.embedded ? p : c`<h3>${t.title ?? ""}</h3>`}
            ${this.renderHeaderExtras()}
          </div>
        </div>
      </ha-card>
    `;
  }
}
an([
  y()
], Ue.prototype, "detail");
var nn = Object.defineProperty, Si = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && nn(t, e, i), i;
};
const qs = "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 7.5a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4z", Vs = "M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5", rn = "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z", Gs = "M7 6h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM17 10h2v4h-2", Xs = "M5 6h14v13H5zM5 10h14M9 4v4M15 4v4", we = {
  wood: { sky: "#f3e4cf", sky2: "#ead2b3", top: "#c49a6c", edge: "#8a6446" },
  grass: { sky: "#e1f0d8", sky2: "#c6e2b8", top: "#8dbb67", edge: "#b88a63" },
  sand: { sky: "#faeed6", sky2: "#f0dcb2", top: "#e8d3a2", edge: "#b88a63" }
}, on = (r) => r === "cooking" || r === "tech" ? we.wood : r === "cars" ? we.sand : we.grass, as = class as extends Ue {
  constructor() {
    super(...arguments), this.events = {}, this.dock = !0, this.calOpen = !1;
  }
  static getStubConfig() {
    return { people: [{ entity: "person.me", avatar: { preset: "man" }, interests: ["cooking"] }] };
  }
  validateConfig(t) {
    if (!Array.isArray(t.people) || !t.people.length) throw new Error("List the people under `people`, as on the family card.");
  }
  watchedEntities() {
    return this.config.people.flatMap((t) => [t.entity, t.battery, t.charging, t.distance, t.sleep, ...q(t), ...(t.stats ?? []).map((e) => e.entity)]);
  }
  updated(t) {
    super.updated(t);
    const e = this.config.people.map((s) => q(s).join(",")).join(";");
    this.hass && e !== this.eventsFor && (this.eventsFor = e, this.config.people.forEach((s, i) => {
      const a = q(s).filter((n) => this.hass.states[n]);
      a.length && $i(this.hass, a).then((n) => this.events = { ...this.events, [i]: ki(n, s.calendar_match) });
    }));
  }
  name(t) {
    return t.name ?? I(this.stateOf(t.entity), "Someone");
  }
  statusOf(t) {
    return Mi(this.hass, this.config.people[t], this.events[t]);
  }
  createWorld(t, e, s, i) {
    return new t.PeopleScene(e, s, i);
  }
  worldState() {
    return {
      ...this.look(),
      people: this.config.people.map((t, e) => {
        const s = this.statusOf(e), i = this.name(t).toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "");
        return { key: `p${e}`, ...qa(t.avatar), interests: js(t.interests), model: t.model, name: i, home: s.presence === "home", asleep: s.asleep };
      }),
      cells: () => this.cells()
    };
  }
  /** Where the cards are on the canvas, for the scene to draw each portrait into. */
  cells() {
    const t = this.renderRoot.querySelector("canvas");
    if (!t) return [];
    const e = t.getBoundingClientRect();
    return [...this.renderRoot.querySelectorAll(".bgs .cell")].map((s) => {
      const i = s.getBoundingClientRect();
      return { x: i.left - e.left, y: i.top - e.top, w: i.width, h: i.height };
    });
  }
  /** Opening a card walks into it. */
  openDetail(t) {
    this.calOpen = !1, super.openDetail(t);
  }
  closeDetail() {
    this.calOpen = !1, super.closeDetail();
  }
  /** No labels in the scene: the cards carry the names. */
  labels() {
    return [];
  }
  /**
   * A card per person, in two layers: the backgrounds (sky, and the ground in layers like the edge of
   * their diorama) under the canvas, where the scene draws their portrait; their name, where they are,
   * battery and what's next over it.
   */
  renderStageExtras() {
    const t = this.config.people, e = t.length, s = (a) => on(js(t[a].interests)[0]), i = (a) => {
      const n = s(a);
      return `--i:${a};--sky:${n.sky};--sky2:${n.sky2};--top:${n.top};--edge:${n.edge}`;
    };
    return c`
      <div class="deck" data-n=${Math.min(e, 4)}>
        <div class="grid bgs" aria-hidden="true">
          ${t.map((a, n) => c`<div class="cell" style=${i(n)}><i class="sheen"></i><i class="mote"></i><i class="mote m2"></i><span class="ground"><b></b><b></b><b></b></span></div>`)}
        </div>
        <div class="grid fgs">
          ${t.map((a, n) => {
      const l = this.statusOf(n), o = ee(this.hass, a), h = l.asleep ? "Asleep" : l.label.split(" · ")[0], g = this.events[n], { now: d, upcoming: u } = g ? Dt(g) : { now: void 0, upcoming: [] }, f = d ?? u[0], m = l.asleep ? "sleep" : l.presence === "home" ? "home" : "away";
      return c`<button type="button" class="cell ${m}" style=${i(n)} aria-haspopup="dialog" @click=${() => this.openDetail(`p${n}`)}>
              <span class="info">
                <span class="line">
                <b class="name">${this.name(a)}</b>
                <span class="meta">
                  <span><svg viewBox="0 0 24 24" class="i"><path d=${qs}></path></svg>${h}</span>
                  ${o ? c`<span class=${o.level <= 20 ? "low" : ""}><svg viewBox="0 0 24 24" class="i"><path d=${Gs}></path></svg><span class="num">${o.level}%</span>${o.charging ? "⚡" : ""}</span>` : p}
                </span>
                </span>
                ${f ? c`<small class="next"><svg viewBox="0 0 24 24" class="i"><path d=${Xs}></path></svg>${f === d ? "Now: " : ""}${f.summary}${f === d ? "" : c` · <span class="num">${St(f, !1, this.hass)}</span>`}</small>` : p}
              </span>
            </button>`;
    })}
        </div>
      </div>
    `;
  }
  /** Who's home, as a chip like the weather on the house. */
  renderHeaderExtras() {
    const t = this.config.people.map((a, n) => this.statusOf(n)), e = t.filter((a) => a.presence === "home").length, s = t.length, i = e === s ? "All home" : e === 0 ? "Nobody home" : `${e} of ${s} home`;
    return c`<span class="weather"><svg viewBox="0 0 24 24" class="i" style="color:${e ? "var(--hh-ok)" : "var(--hh-ink-3)"}"><path d=${Vs}></path></svg><b>${i}</b></span>`;
  }
  detailTitle(t) {
    return this.name(this.config.people[Number(t.slice(1))]);
  }
  /** Their details as chips: where and since when, battery, their sensors, what's on now and next. */
  detailBody(t) {
    const e = Number(t.slice(1)), s = this.config.people[e], i = this.statusOf(e), a = ee(this.hass, s), n = this.events[e], { now: l, upcoming: o } = n ? Dt(n) : { now: void 0, upcoming: [] }, h = (f) => c`<svg viewBox="0 0 24 24" class="i"><path d=${f}></path></svg>`, g = [s.entity, s.battery].find((f) => f && this.hass?.states[f]), d = l ?? o[0], u = [...l ? [l] : [], ...o.slice(0, s.agenda ?? 6)];
    return c`
      <span class="chip">${h(i.asleep ? rn : i.presence === "home" ? Vs : qs)}${i.asleep ? `Asleep ${i.sleepFor ?? ""}` : i.label}${i.since ? c` <small>${i.since}</small>` : p}</span>
      ${a ? c`<span class="chip">${h(Gs)}<span class="num">${a.level}%</span>${a.charging ? c` <small>charging</small>` : p}</span>` : p}
      ${(s.stats ?? []).map((f) => c`<span class="chip">${f.name ?? I(this.stateOf(f.entity), f.entity)} <b class="num">${De(this.hass, this.stateOf(f.entity))}</b></span>`)}
      ${d ? c`<button type="button" class="chip" aria-expanded=${this.calOpen} @click=${() => this.calOpen = !this.calOpen}>${h(Xs)}${d.summary} <small>${d === l ? "now" : St(d, !1, this.hass)}</small></button>` : p}
      ${this.calOpen ? c`<div class="calpop" role="dialog" aria-label="Calendar">
            <div class="calpop-h"><b>Calendar</b><button type="button" aria-label="Close" @click=${() => this.calOpen = !1}>✕</button></div>
            <ul class="agenda">
              ${u.map(
      (f) => c`<li class=${f === l ? "now" : ""}>
                  <small class="num">${St(f, f === l, this.hass)}</small>
                  <span>${f.summary}${te(f.location) ? c`<small class="place">${te(f.location)}</small>` : p}</span>
                </li>`
    )}
            </ul>
          </div>` : p}
      ${g ? c`<button type="button" class="chip" @click=${() => this.moreInfo(g)}>History</button>` : p}
    `;
  }
};
as.styles = [
  A,
  z,
  We,
  S`
      /* The canvas sits between the cards' backgrounds and their text. */
      .stage {
        isolation: isolate;
      }
      .deck {
        position: absolute;
        inset: 0;
        container: deck / size;
        pointer-events: none;
      }
      .grid {
        position: absolute;
        inset: 0;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: 1fr;
        gap: 0;
        transition: opacity 0.35s var(--ease) 1.05s;
      }
      .bgs {
        z-index: -1;
      }
      .fgs {
        z-index: 1;
      }
      .deck[data-n='1'] .grid {
        grid-template-columns: 1fr;
      }
      .deck[data-n='3'] .cell:last-child {
        grid-column: span 2;
      }
      @container deck (min-aspect-ratio: 2.3) {
        .deck[data-n='3'] .grid {
          grid-template-columns: repeat(3, 1fr);
        }
        .deck[data-n='4'] .grid {
          grid-template-columns: repeat(4, 1fr);
        }
        .deck[data-n='3'] .cell:last-child {
          grid-column: auto;
        }
      }
      @container deck (max-aspect-ratio: 0.8) {
        .deck[data-n='2'] .grid {
          grid-template-columns: 1fr;
        }
      }
      /* Opened: the cards step back while the person's picture grows to fill the view. */
      /* Inside a room the (faded) cards don't catch taps. */
      .focused .fgs .cell {
        pointer-events: none;
      }
      .focused .grid {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s var(--ease);
      }
      /* The calendar, opened from its chip, over the chips. */
      .calpop {
        position: absolute;
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%);
        width: min(360px, calc(100vw - 48px));
        max-height: 50vh;
        overflow: auto;
        pointer-events: auto;
        padding: 12px 14px;
        border-radius: 20px;
        background: var(--hh-glass-strong);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
        backdrop-filter: blur(18px) saturate(160%);
        border: 1px solid var(--hh-stroke);
        box-shadow: var(--hh-shadow);
        animation: dock-in 0.3s var(--spring, ease) both;
      }
      .calpop-h {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
        font-size: 13px;
      }
      .calpop-h button {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        color: var(--hh-ink-2);
      }
      .name .dot {
        display: inline-block;
        width: 9px;
        height: 9px;
        margin: 0 7px 2px 0;
        border-radius: 50%;
        background: var(--hh-ok);
        vertical-align: middle;
      }
      .name .dot.away {
        background: #3ba9d6;
      }
      .name .dot.sleep {
        background: #8f9bd6;
      }
      .cell {
        position: relative;
        border-radius: 0;
        overflow: hidden;
        min-width: 0;
        min-height: 0;
      }
      .bgs .cell {
        background:
          radial-gradient(120% 80% at 50% 18%, rgba(255, 255, 255, 0.55), transparent 60%),
          linear-gradient(180deg, color-mix(in srgb, var(--sky) 88%, var(--hh-glass-strong)), color-mix(in srgb, var(--sky2) 88%, var(--hh-glass-strong)));
      }
      /* The ground at the bottom in layers, like the edge of the diorama: its top, the earth, the base. */
      .ground {
        position: absolute;
        left: -2px;
        right: -2px;
        bottom: -2px;
        height: 24%;
        display: flex;
        flex-direction: column;
      }
      .ground b {
        display: block;
        border-radius: 14px 14px 0 0;
      }
      .ground b:nth-child(1) {
        flex: 1;
        background: linear-gradient(180deg, color-mix(in srgb, var(--top) 85%, #fff), var(--top));
        box-shadow: 0 -6px 18px color-mix(in srgb, var(--top) 40%, transparent);
      }
      .ground b:nth-child(2) {
        height: 18%;
        background: var(--edge);
        border-radius: 0;
      }
      .ground b:nth-child(3) {
        height: 22%;
        background: #4b4440;
        border-radius: 0;
      }
      /* A slow sweep of light across the card, and two motes drifting up. */
      .sheen {
        position: absolute;
        inset: -40%;
        background: linear-gradient(115deg, transparent 42%, rgba(255, 255, 255, 0.35) 50%, transparent 58%);
        transform: translateX(-60%);
      }
      .mote {
        position: absolute;
        left: 18%;
        bottom: 30%;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.9), transparent 70%);
        opacity: 0;
      }
      .mote.m2 {
        left: 78%;
        width: 6px;
        height: 6px;
      }
      @media (prefers-reduced-motion: no-preference) {
        .sheen {
          animation: sweep 9s ease-in-out infinite;
          animation-delay: calc(var(--i) * 1.7s);
        }
        .mote {
          animation: drift 7s ease-in-out infinite;
          animation-delay: calc(var(--i) * 1.3s);
        }
        .mote.m2 {
          animation-delay: calc(var(--i) * 1.3s + 3.2s);
        }
        .cell {
          animation: rise 0.7s var(--spring, ease) both;
          animation-delay: calc(var(--i) * 0.09s);
        }
      }
      @keyframes sweep {
        0%,
        70% {
          transform: translateX(-60%);
        }
        100% {
          transform: translateX(60%);
        }
      }
      @keyframes drift {
        0% {
          opacity: 0;
          transform: translateY(0);
        }
        30% {
          opacity: 0.9;
        }
        100% {
          opacity: 0;
          transform: translateY(-120px);
        }
      }
      @keyframes rise {
        from {
          opacity: 0;
          transform: translateY(18px) scale(0.96);
        }
      }
      /* The text over the portrait. */
      .fgs .cell {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: stretch;
        padding: 12px;
        text-align: left;
        pointer-events: auto;
        color: var(--hh-ink);
        transition: transform 0.35s var(--spring), box-shadow 0.35s;
      }
      .fgs .cell:hover .info,
      .fgs .cell:focus-visible .info {
        background: var(--hh-surface, #fbfaf8);
      }
      .fgs .cell:active {
        transform: scale(0.98);
      }
      .status {
        align-self: flex-start;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 10px 4px 7px;
        border-radius: 999px;
        font-size: 11.5px;
        font-weight: 600;
        background: var(--hh-glass-strong);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
        border: 1px solid var(--hh-stroke);
      }
      .status .i {
        width: 14px;
        height: 14px;
      }
      .home .status .i {
        color: var(--hh-ok);
      }
      .away .status .i {
        color: #3ba9d6;
      }
      .sleep .status .i {
        color: #8f9bd6;
      }
      .info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        align-self: flex-start;
        max-width: 100%;
        padding: 7px 14px 8px;
        border-radius: 16px;
        background: color-mix(in srgb, var(--hh-surface, #fbfaf8) 86%, transparent);
        -webkit-backdrop-filter: blur(14px) saturate(160%);
        backdrop-filter: blur(14px) saturate(160%);
        border: 1px solid var(--hh-stroke);
        box-shadow: var(--hh-shadow);
        min-width: 0;
      }
      .line {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 2px 12px;
      }
      .name {
        font-size: 17px;
        font-weight: 700;
        line-height: 1.1;
      }
      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 12px;
        font-size: 12.5px;
        font-weight: 600;
        color: var(--hh-ink-2);
      }
      .meta > span {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        min-width: 0;
      }
      .meta .i,
      .next .i {
        width: 14px;
        height: 14px;
        flex: none;
        opacity: 0.8;
      }
      .meta .low {
        color: #d9473f;
      }
      .next {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11.5px;
        color: var(--hh-ink-3);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      @container deck (max-width: 520px) {
        .name {
          font-size: 15px;
        }
        .info {
          padding: 8px 10px;
        }
        .meta {
          font-size: 11.5px;
        }
        .next {
          display: none;
        }
        .fgs .cell {
          padding: 8px;
        }
      }
      .sub {
        margin: 14px 0 2px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--hh-ink-3);
      }
      .agenda li.now span {
        font-weight: 600;
      }
      .agenda .place {
        display: block;
        font-size: 11px;
        color: var(--hh-ink-3);
      }
    `
];
let Lt = as;
Si([
  y()
], Lt.prototype, "events");
Si([
  y()
], Lt.prototype, "calOpen");
O("hyggehub-people-3d-card", Lt, "HyggeHub People 3D", "The family as figurines on little dioramas of what they love, with who is home at the top.");
function $e(r = "", t = "") {
  const e = `${r} ${t}`.toLowerCase();
  return /beach|palm|umbrella-beach|sun|summer|sommer|ferie|holiday|island|pool/.test(e) ? "beach" : /gift|cake|birthday|fødsel|party|balloon|celebrat|fest/.test(e) ? "gift" : /pine-tree|christmas|jul|snowflake|santa|string-lights/.test(e) ? "christmas" : /mountain|hdr|ski|airplane|flight|plane|hiking|travel|rejse|trip|map/.test(e) ? "mountain" : "generic";
}
var ln = Object.defineProperty, Ci = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && ln(t, e, i), i;
};
const cn = "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2", hn = "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM4 7.5l8 4.5 8-4.5M12 12v9", dn = "M3 12h18M7 12a2 2 0 1 0 0 .01M14 12a2 2 0 1 0 0 .01M7 8V6M14 16v2", Ks = "hyggehub-countdowns-view", pn = {
  beach: "#f0a04b",
  gift: "#e2668c",
  christmas: "#d9473f",
  mountain: "#4f9fb3",
  generic: "var(--hh-accent)"
}, gn = (r) => {
  const t = r / 864e5;
  return t < 1 ? "" : t < 14 ? `${Math.round(t)} d` : t < 60 ? `${Math.round(t / 7)} wk` : `${Math.round(t / 30.4)} mo`;
};
var rt;
const Ye = (rt = class extends Ue {
  constructor() {
    super(...arguments), this.tickEvery = 3e4, this.index = 0, this.view = rt.savedView(), this.onKey = (t) => {
      t.key === "ArrowRight" && this.go(1), t.key === "ArrowLeft" && this.go(-1);
    };
  }
  static savedView() {
    try {
      return localStorage.getItem(Ks) === "timeline" ? "timeline" : "world";
    } catch {
      return "world";
    }
  }
  /** From the timeline: the diorama of countdown `i`. */
  show(t) {
    const e = this.ordered().findIndex((s) => s.i === t);
    e >= 0 && (this.index = e), this.setView("world");
  }
  setView(t) {
    this.detail && this.closeDetail(), this.view = t;
    try {
      localStorage.setItem(Ks, t);
    } catch {
    }
  }
  updated(t) {
    super.updated(t), this.hide3d(this.view === "timeline");
  }
  /** The switch between the islands and the timeline, beside the title. */
  renderHeaderExtras() {
    const t = (e, s, i) => c`<button type="button" role="tab" aria-selected=${this.view === e} @click=${() => this.setView(e)}><svg viewBox="0 0 24 24" class="i"><path d=${s}></path></svg>${i}</button>`;
    return c`<span class="viewseg" role="tablist" aria-label="View">${t("world", hn, "3D")}${t("timeline", dn, "Timeline")}</span>`;
  }
  static getStubConfig() {
    return { countdowns: [{ name: "Summer holiday", icon: "mdi:beach", target: `${(/* @__PURE__ */ new Date()).getFullYear() + 1}-07-01T08:00` }] };
  }
  validateConfig(t) {
    if (!Array.isArray(t.countdowns) || !t.countdowns.length) throw new Error("List the countdowns under `countdowns`, as on the countdown card.");
    for (const e of t.countdowns) {
      if (!e.name) throw new Error("Give every countdown a `name`.");
      if (!e.target && !e.entity && !e.weekly) throw new Error(`"${e.name}": set \`target\`, \`entity\` or \`weekly\`.`);
    }
  }
  watchedEntities() {
    return this.config.countdowns.flatMap((t) => [t.entity, t.value_entity]);
  }
  resolveOne(t) {
    const e = { type: "countdown", ...this.config.countdowns[t] }, s = pi(this.hass, e), i = s.frozen ?? (s.target ? s.target.getTime() - Date.now() : 1 / 0), a = !s.idleText && i <= 0, n = e.yearly && e.target ? new Date(String(e.target)).getFullYear() : NaN, l = s.target && isFinite(n) && $e(e.icon, e.name) === "gift" ? s.target.getFullYear() - n : void 0;
    return { i: t, d: e, r: s, ms: i, left: Js(Math.max(0, i)), done: a, age: l && l > 0 ? l : void 0 };
  }
  /** Soonest first: today's, then the coming ones by date, then those without a date. */
  ordered() {
    return this.config.countdowns.map((t, e) => this.resolveOne(e)).sort((t, e) => t.ms - e.ms);
  }
  current() {
    const t = this.ordered();
    return { all: t, at: Math.min(this.index, t.length - 1) };
  }
  go(t) {
    const e = this.config.countdowns.length, s = Math.max(0, Math.min(e - 1, this.current().at + t));
    s !== this.index && (this.detail && this.closeDetail(), this.index = s);
  }
  /** The time left as a big number and its unit, to write on things: "21" "days", "3:20" "hours", "Today!". */
  bigAndUnit(t) {
    return t.r.idleText ? [t.r.idleText, ""] : t.done ? [t.d.done_text ?? "Today!", ""] : t.left.days >= 1 ? [String(t.left.days), t.left.days === 1 ? "day" : "days"] : t.left.hours >= 1 ? [`${t.left.hours}:${String(t.left.minutes).padStart(2, "0")}`, "hours"] : [String(t.left.minutes), "min"];
  }
  /** "123 days", "1 day", "3 h 20 min", "Today". */
  remaining(t) {
    return t.r.idleText ? t.r.idleText : t.done ? "Today" : t.left.days >= 1 ? `${t.left.days} ${t.left.days === 1 ? "day" : "days"}` : t.left.hours ? `${t.left.hours} h ${t.left.minutes} min` : `${t.left.minutes} min`;
  }
  createWorld(t, e, s, i) {
    return new t.CountdownScene(e, s, i);
  }
  worldState() {
    const t = getComputedStyle(this), { all: e, at: s } = this.current();
    return {
      ...this.look(),
      accent: t.getPropertyValue("--hh-accent").trim() || "#2f6e86",
      index: s,
      items: e.map((i) => {
        const [a, n] = this.bigAndUnit(i);
        return {
          key: `c${i.i}`,
          theme: $e(i.d.icon, i.d.name),
          progress: i.r.progress ?? 0,
          done: i.done,
          name: i.d.name,
          subtitle: i.d.subtitle ?? i.r.subtitle,
          big: a,
          unit: n,
          when: i.r.target ? ft(i.r.target, this.hass) : "",
          age: i.age
        };
      })
    };
  }
  labels() {
    return [];
  }
  detailTitle(t) {
    return this.config.countdowns[Number(t.slice(1))].name;
  }
  detailBody(t) {
    const e = this.resolveOne(Number(t.slice(1))), { d: s, r: i, left: a, done: n } = e, l = (h, g) => c`<div class="row"><span>${h}</span><b class="num">${g}</b></div>`, o = i.target ? `${ft(i.target, this.hass)}${i.target.getHours() || i.target.getMinutes() ? `, ${D(i.target, this.hass)}` : ""}` : "–";
    return c`
      ${s.subtitle || i.subtitle ? c`<p class="note" style="margin:6px 0 4px">${s.subtitle ?? i.subtitle}</p>` : p}
      ${l("When", o)}
      ${e.age ? l("Turns", e.age) : p}
      ${s.yearly ? l("Repeats", "Every year") : p}
      ${i.idleText ? l("Status", i.idleText) : n ? l("Status", s.done_text ?? "Today!") : c`${l("Days", a.days)}${l("Hours", a.hours)}${l("Minutes", a.minutes)}`}
      ${i.progress !== void 0 ? c`<div class="progress" role="img" aria-label="${Math.round(i.progress * 100)}% of the wait has passed"><i style="width:${Math.round(i.progress * 100)}%"></i></div>` : p}
      ${s.entity ? c`<button type="button" class="more" @click=${() => this.moreInfo(s.entity)}>History and settings</button>` : p}
    `;
  }
  /** Arrows either side, dots below, and a layer that turns horizontal swipes into next and previous. */
  renderStageExtras() {
    if (this.view === "timeline") return this.renderTimeline();
    const { all: t, at: e } = this.current();
    return t.length < 2 ? p : c`
      <div
        class="swipe"
        @pointerdown=${(s) => this.swipeX = s.clientX}
        @pointerup=${(s) => {
      if (this.swipeX === void 0) return;
      const i = s.clientX - this.swipeX;
      this.swipeX = void 0, Math.abs(i) > 40 && this.go(i < 0 ? 1 : -1);
    }}
        @pointercancel=${() => this.swipeX = void 0}
      ></div>
      <button type="button" class="nav prev" aria-label="Previous" ?disabled=${e === 0} @click=${() => this.go(-1)}>
        <svg viewBox="0 0 24 24" class="i"><path d="M15 6l-6 6 6 6"></path></svg>
      </button>
      <button type="button" class="nav next" aria-label="Next" ?disabled=${e === t.length - 1} @click=${() => this.go(1)}>
        <svg viewBox="0 0 24 24" class="i"><path d="M9 6l6 6-6 6"></path></svg>
      </button>
      <div class="dots" role="tablist" aria-label="Countdowns">
        ${t.map(
      (s, i) => c`<button type="button" role="tab" aria-selected=${i === e} aria-label=${s.d.name} @click=${() => {
        this.detail && this.closeDetail(), this.index = i;
      }}></button>`
    )}
      </div>
    `;
  }
  /**
   * Everything coming up along one line, starting from now. The stretch between two stops grows with
   * the time between them (by its square root, so next week and next summer both fit), and says how
   * long it is. Horizontal on a wide card, down the side on a narrow one; tap a stop for its details.
   */
  renderTimeline() {
    const t = this.ordered(), e = t.filter((n) => isFinite(n.ms)), s = t.filter((n) => !isFinite(n.ms));
    let i = 0;
    const a = [...e, ...s].map((n, l) => {
      const o = isFinite(n.ms) ? Math.max(0, n.ms) : i, h = Math.max(0, o - i);
      return i = o, { x: n, k: l, gap: h };
    });
    return c`
      <div class="timeline">
        <div class="track" style="--n:${a.length}">
          <div class="now"><span class="pulse"></span><b>Now</b><small>${ft(/* @__PURE__ */ new Date(), this.hass)}</small></div>
          ${a.map(({ x: n, k: l, gap: o }) => {
      const h = pn[$e(n.d.icon, n.d.name)], g = n.r.target ? ft(n.r.target, this.hass) : "", d = Math.max(0.35, Math.sqrt(o / 864e5) / 3);
      return c`
              <div class="gap" style="flex-grow:${d.toFixed(2)};--d:${l}"><i></i><small>${gn(o)}</small></div>
              <button
                type="button"
                class="stop ${l % 2 ? "b" : "a"} ${n.done ? "today" : ""}"
                style="--c:${h};--d:${l}"
                @click=${() => this.show(n.i)}
              >
                <span class="dot">${this.glyph(n.d.icon ?? cn)}</span>
                <span class="card">
                  <small>${g}</small>
                  <b>${n.d.name}</b>
                  <em class="num">${n.done ? "Today" : n.r.idleText ? n.r.idleText : `in ${this.remaining(n)}`}</em>
                  ${n.age ? c`<small>Turns ${n.age}</small>` : p}
                  ${n.r.progress !== void 0 && !n.done ? c`<span class="bar"><i style="width:${Math.round(n.r.progress * 100)}%"></i></span>` : p}
                </span>
              </button>
            `;
    })}
          <div class="gap end"><i></i></div>
        </div>
      </div>
    `;
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("keydown", this.onKey);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("keydown", this.onKey);
  }
}, rt.styles = [
  A,
  z,
  We,
  S`
      .overlay {
        z-index: 3;
      }
      .overlay .viewseg {
        pointer-events: auto;
      }
      .viewseg {
        display: inline-flex;
        gap: 2px;
        padding: 3px;
        border-radius: 999px;
        background: var(--hh-glass-strong);
        -webkit-backdrop-filter: blur(14px) saturate(160%);
        backdrop-filter: blur(14px) saturate(160%);
        border: 1px solid var(--hh-stroke);
        box-shadow: var(--hh-shadow);
        align-self: flex-start;
      }
      .viewseg button {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 5px 11px 5px 9px;
        border-radius: 999px;
        font-size: 12.5px;
        font-weight: 600;
        color: var(--hh-ink-2);
        transition: background 0.25s, color 0.25s;
      }
      .viewseg button[aria-selected='true'] {
        background: var(--hh-accent);
        color: var(--hh-on-accent);
      }
      .viewseg .i {
        width: 15px;
        height: 15px;
      }

      /* ---------- the timeline ---------- */
      .stage:has(.timeline) canvas,
      .stage:has(.timeline) .loading {
        visibility: hidden;
      }
      .timeline {
        position: absolute;
        inset: 0;
        z-index: 1;
        container-type: inline-size;
        overflow: auto;
        scrollbar-width: none;
        padding: 120px 40px 40px;
        box-sizing: border-box;
        display: flex;
      }
      ha-card:not(.embedded) .timeline {
        padding-top: 90px;
      }
      .track {
        flex: 1;
        display: flex;
        align-items: center;
        min-width: calc(var(--n) * 150px + 120px);
        min-height: 300px;
      }
      .now {
        flex: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        position: relative;
        font-size: 13px;
        color: var(--hh-ink);
      }
      .now small {
        color: var(--hh-ink-3);
        font-size: 11px;
      }
      .pulse {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--hh-accent);
        box-shadow: 0 0 0 6px color-mix(in srgb, var(--hh-accent) 22%, transparent);
      }
      .gap {
        position: relative;
        min-width: 70px;
        align-self: stretch;
        display: grid;
        place-items: center;
      }
      .gap i {
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 4px;
        margin-top: -2px;
        border-radius: 4px;
        background: linear-gradient(90deg, color-mix(in srgb, var(--hh-accent) 70%, transparent), color-mix(in srgb, var(--hh-ink-3) 45%, transparent));
        transform-origin: left center;
      }
      .gap.end i {
        background: linear-gradient(90deg, color-mix(in srgb, var(--hh-ink-3) 45%, transparent), transparent);
      }
      .gap.end {
        flex: 0 0 60px;
      }
      .gap small {
        position: relative;
        margin-top: 28px;
        font-size: 10.5px;
        font-weight: 600;
        letter-spacing: 0.04em;
        color: var(--hh-ink-3);
      }
      .stop {
        flex: none;
        position: relative;
        z-index: 2;
        width: 0;
        align-self: stretch;
      }
      .dot {
        position: absolute;
        left: -22px;
        top: calc(50% - 22px);
        z-index: 1;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: var(--c);
        color: #fff;
        --mdc-icon-size: 22px;
        box-shadow: 0 6px 16px color-mix(in srgb, var(--c) 45%, transparent), inset 0 -3px 0 rgba(0, 0, 0, 0.12);
        border: 3px solid var(--hh-glass-strong);
        transition: transform 0.3s var(--spring);
      }
      .dot .i {
        width: 22px;
        height: 22px;
      }
      .stop:hover .dot,
      .stop:focus-visible .dot {
        transform: scale(1.12);
      }
      .card {
        position: absolute;
        left: 50%;
        width: 150px;
        margin-left: -75px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 9px 10px 10px;
        border-radius: 16px;
        text-align: center;
        background: var(--hh-glass-strong);
        -webkit-backdrop-filter: blur(14px) saturate(160%);
        backdrop-filter: blur(14px) saturate(160%);
        border: 1px solid var(--hh-stroke);
        box-shadow: var(--hh-shadow);
      }
      .card::before {
        content: '';
        position: absolute;
        left: 50%;
        width: 2px;
        height: 18px;
        margin-left: -1px;
        background: color-mix(in srgb, var(--c) 60%, transparent);
      }
      .stop.a .card {
        bottom: calc(50% + 40px);
      }
      .stop.a .card::before {
        top: 100%;
      }
      .stop.b .card {
        top: calc(50% + 40px);
      }
      .stop.b .card::before {
        bottom: 100%;
      }
      .card small {
        font-size: 11px;
        color: var(--hh-ink-3);
      }
      .card b {
        font-size: 13.5px;
        font-weight: 600;
        color: var(--hh-ink);
        line-height: 1.2;
      }
      .card em {
        font-style: normal;
        font-size: 15px;
        font-weight: 700;
        color: var(--c);
      }
      .card .bar {
        width: 100%;
        height: 4px;
        margin-top: 4px;
        border-radius: 4px;
        background: var(--hh-line);
        overflow: hidden;
      }
      .card .bar i {
        display: block;
        height: 100%;
        border-radius: 4px;
        background: var(--c);
      }
      .stop.today .dot::after {
        content: '';
        position: absolute;
        inset: -8px;
        border-radius: 50%;
        border: 2px solid var(--c);
        opacity: 0.6;
      }
      @media (prefers-reduced-motion: no-preference) {
        .gap i {
          animation: draw 0.6s var(--ease, ease) both;
          animation-delay: calc(var(--d, 0) * 0.12s);
        }
        .stop {
          animation: pop 0.5s var(--spring, ease) both;
          animation-delay: calc(var(--d, 0) * 0.12s + 0.2s);
        }
        .pulse,
        .stop.today .dot::after {
          animation: beat 2s ease-in-out infinite;
        }
      }
      @keyframes draw {
        from {
          transform: scaleX(0);
        }
      }
      @keyframes pop {
        from {
          opacity: 0;
          transform: scale(0.6);
        }
      }
      @keyframes beat {
        50% {
          box-shadow: 0 0 0 11px color-mix(in srgb, var(--hh-accent) 0%, transparent);
          transform: scale(1.08);
        }
      }

      /* Narrow: down the side, the cards to the right of the line. */
      @container (max-width: 560px) {
        .track {
          flex-direction: column;
          align-items: stretch;
          min-width: 0;
          min-height: calc(var(--n) * 96px + 80px);
        }
        .now {
          flex-direction: row;
          align-self: flex-start;
          gap: 10px;
          padding-left: 14px;
        }
        .gap {
          min-width: 0;
          min-height: 34px;
          place-items: center start;
        }
        .gap i {
          left: 21px;
          right: auto;
          top: 0;
          bottom: 0;
          width: 4px;
          height: auto;
          margin: 0 0 0 -2px;
          background: linear-gradient(180deg, color-mix(in srgb, var(--hh-accent) 70%, transparent), color-mix(in srgb, var(--hh-ink-3) 45%, transparent));
          transform-origin: center top;
        }
        .gap.end {
          flex: 0 0 40px;
        }
        .gap.end i {
          background: linear-gradient(180deg, color-mix(in srgb, var(--hh-ink-3) 45%, transparent), transparent);
        }
        .gap small {
          margin: 0 0 0 36px;
        }
        .stop {
          width: auto;
          height: 0;
          align-self: stretch;
        }
        .dot {
          left: -1px;
          top: -22px;
        }
        .stop.a .card,
        .stop.b .card {
          top: 50%;
          bottom: auto;
          left: 62px;
          right: 4px;
          width: auto;
          margin: 0;
          transform: translateY(-50%);
          align-items: flex-start;
          text-align: left;
        }
        .card::before {
          display: none;
        }
        .timeline {
          padding: 120px 18px 30px;
        }
        .gap i {
          animation-name: drawY;
        }
      }
      @keyframes drawY {
        from {
          transform: scaleY(0);
        }
      }
      .swipe {
        position: absolute;
        inset: 0;
        touch-action: pan-y;
      }
      .nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: var(--hh-glass-strong);
        -webkit-backdrop-filter: blur(14px) saturate(160%);
        backdrop-filter: blur(14px) saturate(160%);
        border: 1px solid var(--hh-stroke);
        box-shadow: var(--hh-shadow);
        color: var(--hh-ink);
        transition: opacity 0.25s, transform 0.25s var(--spring);
      }
      .nav:active {
        transform: translateY(-50%) scale(0.92);
      }
      .nav[disabled] {
        opacity: 0;
        pointer-events: none;
      }
      .prev {
        left: 14px;
      }
      .next {
        right: 14px;
      }
      .focused .nav,
      .focused .dots {
        opacity: 0;
        pointer-events: none;
      }
      .dots {
        position: absolute;
        bottom: 18px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;
        display: flex;
        gap: 8px;
        padding: 7px 10px;
        border-radius: 999px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        transition: opacity 0.25s;
      }
      .dots button {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: var(--hh-ink-3);
        opacity: 0.45;
        transition: width 0.3s var(--ease), opacity 0.3s, background 0.3s;
      }
      .dots button[aria-selected='true'] {
        width: 22px;
        opacity: 1;
        background: var(--hh-accent);
      }
    `
], rt);
Ci([
  y()
], Ye.prototype, "index");
Ci([
  y()
], Ye.prototype, "view");
let un = Ye;
O("hyggehub-countdowns-3d-card", un, "HyggeHub Countdowns 3D", "The countdowns as a carousel of floating islands dressed for the occasion, soonest first.");
var mn = Object.defineProperty, qe = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && mn(t, e, i), i;
};
const pt = {
  house: { tag: "hyggehub-energy-3d-card", label: "Home", icon: "M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5" },
  people: {
    tag: "hyggehub-people-3d-card",
    label: "People",
    icon: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5M14 14.2c3.3-.4 6 1.5 6 4.8"
  },
  countdowns: { tag: "hyggehub-countdowns-3d-card", label: "Countdowns", icon: "M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9" }
}, Qs = "hyggehub:home-tab", ns = class ns extends P {
  constructor() {
    super(...arguments), this.tab = "house", this.error = "", this.slideDir = 1, this.views = /* @__PURE__ */ new Map();
  }
  static getStubConfig() {
    return { house: { grid: "sensor.grid_power" } };
  }
  validateConfig(t) {
    if (!t.house && !t.people?.length && !t.countdowns?.length) throw new Error("Set at least one of `house`, `people` or `countdowns`.");
    const e = this.tabs(t);
    let s = null;
    try {
      s = localStorage.getItem(Qs);
    } catch {
    }
    this.tab = e.includes(s) ? s : e[0], this.views.clear();
  }
  tabs(t = this.config) {
    return ["house", "people", "countdowns"].filter((e) => e === "house" ? !!t.house : e === "people" ? !!t.people?.length : !!t.countdowns?.length);
  }
  getCardSize() {
    return 12;
  }
  // Every hass update goes to the open view, whatever this card itself would re-render for.
  shouldUpdate(t) {
    const e = this.views.get(this.tab);
    return e && this.hass && (e.hass = this.hass), super.shouldUpdate(t) || t.has("tab") || t.has("error") || t.has("leaving");
  }
  view(t) {
    let e = this.views.get(t);
    if (e) return e;
    const s = this.config;
    e = document.createElement(pt[t].tag);
    const i = t === "house" ? { ...s.house, type: `custom:${pt[t].tag}`, embedded: !0 } : t === "people" ? { type: `custom:${pt[t].tag}`, embedded: !0, people: s.people } : { type: `custom:${pt[t].tag}`, embedded: !0, countdowns: s.countdowns };
    try {
      e.setConfig(i);
    } catch (a) {
      this.error = `${this.label(t)}: ${a.message}`;
      return;
    }
    return e.hass = this.hass, this.views.set(t, e), e;
  }
  label(t) {
    return this.config.tabs?.[t] ?? pt[t].label;
  }
  select(t) {
    if (t === this.tab) return;
    const e = this.tabs();
    this.slideDir = e.indexOf(t) > e.indexOf(this.tab) ? 1 : -1, this.leaving = t === this.leaving ? void 0 : this.tab, clearTimeout(this.leaveTimer), this.leaveTimer = window.setTimeout(() => this.leaving = void 0, 650), this.tab = t, this.error = "";
    try {
      localStorage.setItem(Qs, t);
    } catch {
    }
  }
  updated(t) {
    super.updated(t), t.has("tab") && t.get("tab") !== void 0 && this.views.get(this.tab)?.intro?.();
  }
  render() {
    const t = this.tabs(), e = this.view(this.tab), s = this.leaving ? this.views.get(this.leaving) : void 0, i = this.config.height ?? "calc(100dvh - var(--header-height, 56px) - env(safe-area-inset-top, 0px))";
    return c`<ha-card class="glass home" style="height:${i}">
      ${t.length > 1 ? c`<nav class="tabs" role="tablist">
            ${t.map(
      (a) => c`<button type="button" role="tab" aria-selected=${a === this.tab} @click=${() => this.select(a)}>
                <svg viewBox="0 0 24 24" class="i"><path d=${pt[a].icon}></path></svg><span>${this.label(a)}</span>
              </button>`
    )}
          </nav>` : p}
      <div class="view" role="tabpanel" style="--dir:${this.slideDir}">
        ${s ? c`<div class="pane out" aria-hidden="true">${s}</div>` : p}
        <div class="pane ${this.leaving ? "in" : ""}">${this.error ? c`<p class="err">${this.error}</p>` : e ?? p}</div>
      </div>
    </ha-card>`;
  }
};
ns.styles = [
  A,
  z,
  S`
      ha-card.home {
        padding: 0;
        position: relative;
        overflow: hidden;
        border-radius: 0;
        border: none;
      }
      .view {
        position: absolute;
        inset: 0;
      }
      .pane {
        position: absolute;
        inset: 0;
      }
      .pane > * {
        display: block;
        height: 100%;
      }
      /* Tab change: the new view glides in from the side it is on, the old one glides away and fades. */
      .pane.in {
        animation: pane-in 0.6s var(--ease) both;
      }
      .pane.out {
        pointer-events: none;
        animation: pane-out 0.6s var(--ease) both;
      }
      @keyframes pane-in {
        from {
          opacity: 0;
          transform: translateX(calc(var(--dir) * 9%)) scale(0.97);
        }
      }
      @keyframes pane-out {
        to {
          opacity: 0;
          transform: translateX(calc(var(--dir) * -9%)) scale(0.97);
        }
      }
      .tabs {
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 5;
        display: flex;
        gap: 4px;
        padding: 4px;
        border-radius: 999px;
        background: var(--hh-glass-strong);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
        backdrop-filter: blur(18px) saturate(160%);
        border: 1px solid var(--hh-stroke);
        box-shadow: var(--hh-shadow);
        max-width: calc(100% - 24px);
      }
      .tabs button {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 600;
        color: var(--hh-ink-2);
        white-space: nowrap;
        transition: background 0.25s, color 0.25s;
      }
      .tabs button[aria-selected='true'] {
        background: var(--hh-accent);
        color: var(--hh-on-accent);
      }
      .tabs svg.i {
        width: 17px;
        height: 17px;
      }
      @media (max-width: 420px) {
        .tabs button {
          padding: 8px 11px;
        }
        .tabs button[aria-selected='false'] span {
          display: none;
        }
      }
      .err {
        margin: 80px 18px 0;
        color: var(--hh-crit);
        font-size: 13px;
      }
    `
];
let xt = ns;
qe([
  y()
], xt.prototype, "tab");
qe([
  y()
], xt.prototype, "error");
qe([
  y()
], xt.prototype, "leaving");
O("hyggehub-home-card", xt, "HyggeHub Home", "The whole home in 3D behind tabs: the house, the people, the countdowns. For a panel view.");
const rs = class rs extends P {
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
    Fa(t);
  }
  connectedCallback() {
    super.connectedCallback(), this.ticker = window.setInterval(() => this.requestUpdate(), 60 * 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this.ticker);
  }
  whenLabel(t) {
    const e = at(t), s = t.toLocaleDateString(C(this.hass), { weekday: "short", day: "numeric", month: "short" });
    return e === 0 ? { big: "Today", small: s } : e === 1 ? { big: "Tomorrow", small: s } : e < 7 ? { big: t.toLocaleDateString(C(this.hass), { weekday: "long" }), small: `in ${e} days · ${t.toLocaleDateString(C(this.hass), { day: "numeric", month: "short" })}` } : { big: s, small: `in ${e} days` };
  }
  render() {
    const t = qt(this.config), e = t[0], s = t.slice(1, 1 + (this.config.upcoming ?? 3)), i = e ? at(e.day) : -1, a = i === 1 ? "Put them out tonight" : i === 0 && (/* @__PURE__ */ new Date()).getHours() < 12 ? "Collected today" : "";
    return c`<ha-card class="glass bins" data-soon=${i >= 0 && i <= 1}>
      <div class="head">
        <h3>${this.config.title ?? "Bins"}</h3>
        ${a ? c`<span class="nudge">${a}</span>` : p}
      </div>
      ${e ? c`
              <div class="next">
                <div class="glyphs">${e.bins.map((n) => Na(n.color))}</div>
                <div class="when">
                  <b>${this.whenLabel(e.day).big}</b>
                  <small class="num">${this.whenLabel(e.day).small}</small>
                </div>
              </div>
              <div class="kinds">
                ${e.bins.map(
      (n) => c`<span class="bin-kinds" role="img" aria-label=${n.name} title=${n.name}>
                    ${n.kinds.map((l) => c`<span class="kind" style="--c:${l.color}" title=${l.name}>${_(l.icon)}</span>`)}
                  </span>`
    )}
              </div>
              ${s.length ? c`<ul class="later">
                    ${s.map(
      (n) => c`<li>
                        <span class="d num">${this.whenLabel(n.day).big === "Tomorrow" ? "Tomorrow" : n.day.toLocaleDateString(C(this.hass), { weekday: "short", day: "numeric", month: "short" })}</span>
                        <span class="dots">
                          ${n.bins.map(
        (l) => c`<span class="bin-kinds small" role="img" aria-label=${l.name} title=${l.name}>
                              ${l.kinds.map((o) => c`<span class="kind" style="--c:${o.color}">${_(o.icon)}</span>`)}
                            </span>`
      )}
                        </span>
                      </li>`
    )}
                  </ul>` : p}
            ` : c`<p class="quiet">No collections in the next ${Math.round(fi / 7)} weeks</p>`}
    </ha-card>`;
  }
};
rs.styles = [
  A,
  z,
  S`
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
let Te = rs;
O("hyggehub-bins-card", Te, "HyggeHub Bins", "The next bin collection and which bins go out, from your collection schedule.");
var fn = Object.defineProperty, oe = (r, t, e, s) => {
  for (var i = void 0, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = n(t, e, i) || i);
  return i && fn(t, e, i), i;
};
const bn = {
  import: { icon: "mdi:transmission-tower-import", color: "var(--hh-accent)", label: "Electricity in" },
  export: { icon: "mdi:transmission-tower-export", color: "var(--hh-ok)", label: "Electricity out" },
  water: { icon: "mdi:water-outline", color: "#4a9ad6", label: "Water" },
  gas: { icon: "mdi:fire", color: "var(--hh-warm)", label: "Gas" },
  heat: { icon: "mdi:radiator", color: "var(--hh-crit)", label: "Heating" },
  other: { icon: "mdi:gauge", color: "var(--hh-ink-2)", label: "Meter" }
}, vn = (r, t) => /m³|m3|l$|gal/i.test(t) || /vand|water/i.test(r) ? "water" : /eksport|export|return|feed/i.test(r) ? "export" : /gas/i.test(r) ? "gas" : /varme|heat/i.test(r) ? "heat" : /kwh|wh/i.test(t) ? "import" : "other";
function ke(r, t) {
  if (r === void 0) return { value: "–", unit: t };
  if (/m³|m3/.test(t) && Math.abs(r) < 10) return { value: String(Math.round(r * 1e3)), unit: "L" };
  const e = Math.abs(r) < 10 ? 2 : Math.abs(r) < 100 ? 1 : 0;
  return { value: r.toFixed(e), unit: t };
}
function _e(r) {
  const t = /* @__PURE__ */ new Date();
  return t.setHours(0, 0, 0, 0), r === "week" && t.setDate(t.getDate() - (t.getDay() + 6) % 7), r === "month" && t.setDate(1), t;
}
const os = class os extends P {
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
    const e = _e(this.period);
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
      const l = i?.[n] ?? [], o = l.map((d) => ({ start: new Date(d.start), change: d.change ?? 0 })), h = l.filter((d) => (d.change ?? 0) !== 0), g = h[h.length - 1];
      a[n] = {
        total: l.length ? o.reduce((d, u) => d + u.change, 0) : void 0,
        buckets: o,
        unit: String(this.stateOf(n)?.attributes.unit_of_measurement ?? ""),
        upTo: g ? new Date(g.end) : void 0
      };
    }
    return a;
  }
  setPeriod(t) {
    t !== this.period && (this.period = t);
  }
  /** The bars: one per hour (day view) or per day (week and month), always filling the period. */
  bars(t, e) {
    const s = this.windowStart ?? _e(this.period), i = this.period === "day" ? 24 : this.period === "week" ? 7 : new Date(s.getFullYear(), s.getMonth() + 1, 0).getDate(), a = this.period === "day" ? 36e5 : 864e5, n = new Array(i).fill(0);
    for (const h of t.buckets) {
      const g = Math.floor((h.start.getTime() - s.getTime()) / a);
      g >= 0 && g < i && (n[g] += Math.max(0, h.change));
    }
    const l = Math.max(...n, 1e-4), o = this.yesterday ? i : Math.floor((Date.now() - s.getTime()) / a);
    return c`<div class="bars" style="--c:${e};grid-template-columns:repeat(${i},1fr)" aria-hidden="true">
      ${n.map((h, g) => c`<i class=${g > o ? "future" : ""} style="--h:${Math.max(h > 0 ? 0.06 : 0.02, h / l)}"></i>`)}
    </div>`;
  }
  axis() {
    if (this.period === "day") return c`<div class="axis"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>`;
    if (this.period === "week") {
      const t = _e("week");
      return c`<div class="axis">
        ${Array.from({ length: 7 }, (e, s) => new Date(t.getTime() + s * 864e5).toLocaleDateString(C(this.hass), { weekday: "narrow" })).map(
        (e) => c`<span>${e}</span>`
      )}
      </div>`;
    }
    return c`<div class="axis"><span>1</span><span>10</span><span>20</span><span>${new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth() + 1, 0).getDate()}</span></div>`;
  }
  render() {
    const t = this.config.meters.map((o) => {
      const h = this.data[o.entity], g = h?.unit ?? String(this.stateOf(o.entity)?.attributes.unit_of_measurement ?? ""), d = o.kind ?? vn(o.entity, g);
      return { ...o, kind: d, series: h, unit: g, look: bn[d] };
    }), e = t.filter((o) => o.kind === "import").reduce((o, h) => o + (h.series?.total ?? 0), 0), s = t.filter((o) => o.kind === "export").reduce((o, h) => o + (h.series?.total ?? 0), 0), i = t.some((o) => o.kind === "import") && t.some((o) => o.kind === "export"), a = e - s, n = t.map((o) => o.series?.upTo).filter((o) => !!o).sort((o, h) => h.getTime() - o.getTime())[0], l = this.period === "day" ? this.yesterday ? "yesterday" : "today" : this.period === "week" ? "this week" : "this month";
    return c`<ha-card class="glass usage">
      <div class="head">
        <h3>${this.config.title ?? "Usage"}</h3>
        <div class="seg" role="group" aria-label="Period">
          ${["day", "week", "month"].map(
      (o) => c`<button type="button" aria-pressed=${o === this.period} @click=${() => this.setPeriod(o)}>
              ${o === "day" ? "Today" : o === "week" ? "Week" : "Month"}
            </button>`
    )}
        </div>
      </div>
      ${this.error ? c`<p class="quiet">${this.error}</p>` : p}
      ${this.period === "day" && this.yesterday ? c`<p class="note">Showing yesterday. Today's readings arrive overnight.</p>` : p}
      <div class="meters">
        ${t.map((o) => {
      const h = ke(o.series?.total, o.unit);
      return c`<button class="meter" type="button" style="--c:${o.color ?? o.look.color}" @click=${() => this.moreInfo(o.entity)}>
            <span class="mi">${_(o.icon ?? o.look.icon)}</span>
            <span class="mt">
              <small>${o.name ?? o.look.label ?? I(this.stateOf(o.entity), o.entity)}</small>
              <b class="num">${h.value}<em>${h.unit}</em></b>
            </span>
            ${o.series ? this.bars(o.series, o.color ?? o.look.color) : c`<span class="bars-placeholder"></span>`}
          </button>`;
    })}
      </div>
      ${t.length ? c`<div class="axis-row"><span></span><span></span>${this.axis()}</div>` : p}
      <div class="foot">
        ${i && (e || s) ? c`<span class="net ${a < 0 ? "out" : ""}">
              ${a < 0 ? `Net exported ${ke(-a, "kWh").value} kWh ${l}` : `Net use ${ke(a, "kWh").value} kWh ${l}`}
            </span>` : c`<span></span>`}
        <span class="faint">${n ? `Readings up to ${D(n, this.hass)}` : Object.keys(this.data).length ? `No readings ${l} yet` : "Reading the meters…"}</span>
      </div>
    </ha-card>`;
  }
};
os.styles = [
  A,
  z,
  S`
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
let dt = os;
oe([
  y()
], dt.prototype, "period");
oe([
  y()
], dt.prototype, "data");
oe([
  y()
], dt.prototype, "error");
oe([
  y()
], dt.prototype, "yesterday");
O("hyggehub-usage-card", dt, "HyggeHub Usage", "Electricity in and out, water and gas for today, this week or this month, from your meters.");
var yn = Object.defineProperty, xn = Object.getOwnPropertyDescriptor, Ft = (r, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? xn(t, e) : t, a = r.length - 1, n; a >= 0; a--)
    (n = r[a]) && (i = (s ? n(t, e, i) : n(i)) || i);
  return s && i && yn(t, e, i), i;
};
const wn = (r) => r === 0 ? "Clear" : r < 12 ? "Light" : r < 26 ? "Frosted" : "Heavy", ls = class ls extends vt {
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
    return c`<div class="theme-grid" role="radiogroup" aria-label="${t} theme">
      ${Ti.map((s) => {
      const i = bt[s], a = `background:radial-gradient(circle at 18% 22%,${i.blob1},transparent 62%),radial-gradient(circle at 88% 30%,${i.blob2},transparent 58%),radial-gradient(circle at 50% 120%,${i.blob3},transparent 62%),${i.bg}`;
      return c`<button
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
    return c`
      <div class="lbl-row">Theme <span>${bt[e.theme].name}</span></div>
      ${this.renderThemeGrid(t)}
      <div class="lbl-row">Frost <span class="num">${wn(e.frost)} · ${e.frost}</span></div>
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
    const t = x.appearance, e = x.resolved, s = this.hass?.states["sun.sun"], i = s ? `Today about ${D(new Date(s.attributes.next_setting), this.hass)} to ${D(new Date(s.attributes.next_rising), this.hass)}` : "Needs the sun integration (sun.sun)", a = this.hass?.user?.name ?? "you", n = [
      { key: "device", title: "Follow my device", desc: "Uses the light or dark setting of each phone, tablet and browser" },
      { key: "sun", title: "Follow the sun", desc: `Night from sunset to sunrise. ${i}` },
      { key: "schedule", title: "Fixed times", desc: "The same hours every day" }
    ];
    return c`
      <div class="bar" ?hidden=${this.embedded}>
        ${this.narrow ? c`<button class="round" type="button" aria-label="Open the sidebar" @click=${() => this.dispatchEvent(new Event("hass-toggle-menu", { bubbles: !0, composed: !0 }))}>
              ${w("menu")}
            </button>` : p}
      </div>
      <div class="shell">
        <section class="hero">
          <div>
            <h1>Appearance</h1>
            <p>Your own day and night look. It’s saved to ${a}’s Home Assistant user, so it follows you to every device you sign in on and never changes what anyone else sees.</p>
          </div>
        </section>

        <div class="status glass">
          <div class="si">${w(e.slot === "night" ? "moon" : "sun")}</div>
          <div class="st">
            <b>Showing your ${e.slot} look · ${bt[e.look.theme].name}${e.slot === "night" && t.night.same ? " (same as day)" : ""}</b>
            <span>${e.reason}</span>
          </div>
          <div class="seg" role="group" aria-label="Preview">
            ${["auto", "day", "night"].map(
      (l) => c`<button type="button" aria-pressed=${x.preview === l} @click=${() => x.setPreview(l)}>${l === "auto" ? "Auto" : l === "day" ? "Day" : "Night"}</button>`
    )}
          </div>
        </div>
        ${this.saveError ? c`<p class="error" role="alert">${this.saveError}</p>` : p}

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
                <button class="switch" type="button" role="switch" aria-checked=${t.night.same} @click=${() => this.update_((l) => l.night.same = !l.night.same)}></button>
              </label>
            </div>
            ${t.night.same ? c`<p class="same">Night uses your day look. Turn off “Same as day” to choose another.</p>` : p}
            <div class="body ${t.night.same ? "off" : ""}" ?inert=${t.night.same}>${this.renderLook("night")}</div>
          </article>
        </div>

        <div class="grid">
          <article class="card glass">
            <div class="card-head">${w("moon")}<h3>When night starts</h3></div>
            <div class="opts" role="radiogroup" aria-label="When night starts">
              ${n.map(
      (l) => c`<div>
                  <button class="opt" type="button" role="radio" aria-checked=${t.when === l.key} @click=${() => this.update_((o) => o.when = l.key)}>
                    <span class="radio"></span><span class="ot"><b>${l.title}</b><small>${l.desc}</small></span>
                  </button>
                  ${l.key === "schedule" ? c`<div class="times">
                        <label>From <input type="time" .value=${t.from} ?disabled=${t.when !== "schedule"} @change=${(o) => this.update_((h) => h.from = o.target.value || h.from)} /></label>
                        <label>to <input type="time" .value=${t.to} ?disabled=${t.when !== "schedule"} @change=${(o) => this.update_((h) => h.to = o.target.value || h.to)} /></label>
                      </div>` : p}
                </div>`
    )}
            </div>
          </article>
          <article class="card glass">
            <div class="card-head">${w("sliders")}<h3>Motion</h3></div>
            <div class="row">
              <div><b>Card animations</b><small>Spinning fans, falling snow, the equaliser</small></div>
              <button class="switch" type="button" role="switch" aria-checked=${t.motion} aria-label="Card animations" @click=${() => this.update_((l) => l.motion = !l.motion)}></button>
            </div>
            <div class="row">
              <div><b>Reset my appearance</b><small>Back to Fjord by day and Polar night after dark</small></div>
              <button class="btn-text" type="button" @click=${() => this.update_((l) => Object.assign(l, JSON.parse(JSON.stringify(Oe))))}>Reset</button>
            </div>
            <p class="note">${w("info")}<span>If a device asks for reduced motion, that always wins. Nothing here changes what other people in the home see.</span></p>
          </article>
        </div>
      </div>
    `;
  }
};
ls.styles = [
  A,
  z,
  S`
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
let V = ls;
Ft([
  Pt({ type: Boolean })
], V.prototype, "narrow", 2);
Ft([
  Pt({ type: Boolean, reflect: !0 })
], V.prototype, "embedded", 2);
Ft([
  y()
], V.prototype, "tick", 2);
Ft([
  y()
], V.prototype, "saveError", 2);
Ft([
  Pt({ attribute: !1, noAccessor: !0 })
], V.prototype, "hass", 1);
customElements.get("hyggehub-appearance-panel") || customElements.define("hyggehub-appearance-panel", V);
class $n extends V {
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
customElements.get("hyggehub-appearance-card") || customElements.define("hyggehub-appearance-card", $n);
window.customCards = window.customCards || [];
window.customCards.some((r) => r.type === "hyggehub-appearance-card") || window.customCards.push({ type: "hyggehub-appearance-card", name: "HyggeHub Appearance", description: "Your own day and night look, as a card.", preview: !1 });
const kn = "0.1.0", Zs = document.querySelector("home-assistant");
Zs?.hass && x.setHass(Zs.hass);
console.info(`%c HyggeHub %c ${kn} `, "background:#2F6E86;color:#fff;border-radius:4px 0 0 4px;padding:2px 6px", "background:#DCE3E5;color:#18242A;border-radius:0 4px 4px 0;padding:2px 6px");
export {
  kn as VERSION
};
