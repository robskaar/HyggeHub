// The people view as a little town round the house, built into the house view's own scene: with both
// views on the home card it is one scene, the town shown or hidden as the tab changes. Round the island,
// square plots with roads between:
// a plot for each place the family goes (their zones in Home Assistant and the places in their
// calendars), woods and meadows for the rest, and here and there something one of them loves (a Pokéball
// statue, a digger at work, a vegetable patch...). When the view opens the camera starts just as the house
// view has it and the plots rise into place round the house while it pulls back; closing, they sink again.
//
// Each person stands where they are; when that changes they walk there along the roads. A dotted trail in
// their colour leads to where they go next, with a pin bobbing there.
import {
  AdditiveBlending,
  Box3,
  BufferGeometry,
  CanvasTexture,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  Material,
  Matrix4,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  Shape,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TorusGeometry,
  Vector3,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { Interest } from '../../shared/interests';
import { IslandScene, type LabelPosition, type SceneState } from './scene';
import { ball, capsule, clay, disc, part, rbox } from './stage';

export type PlaceKind = 'office' | 'school' | 'kindergarten' | 'field' | 'family' | 'shop' | 'garden' | 'generic';

export interface TownPlace {
  key: string;
  name: string;
  kind: PlaceKind;
}

export interface TownPerson {
  key: string;
  name: string;
  /** Their own colour: their trail and their pin. */
  colour: string;
  skin: string;
  hair: string;
  shirt: string;
  preset: 'man' | 'woman' | 'child' | 'baby';
  /** URL of their modelled figure, if they have one. */
  model?: string;
  /** 'home', 'away' (out, no known place), or a place's key. */
  at: string;
  asleep: boolean;
  /** Where they go next (a place's key). */
  next?: string;
  interests: Interest[];
}

/** The town round the house: its places and people. */
export interface TownBits {
  places: TownPlace[];
  people: TownPerson[];
}

/** The house as the house view shows it, and the town round it (for a people view with its own scene). */
export interface TownState extends SceneState, TownBits {}

// ---------- layout ----------
// The town is laid out in its own units (a plot is 7.6 × 6.4) and scaled up to sit round the house
// view's island, which is the middle plot.

/** One plot of the grid, roads included (half a road along each of its edges). */
const CW = 7.6;
const CD = 6.4;
/** The seam between two plots (it reads as the line down the middle of the road). */
const GAP = 0.1;
/** The road along each edge of a plot. */
const STRIP = 0.5;
/** Plots' grass is this much above the road. */
const GROUND_Y = 0.02;
/** Town units to the island's: the island is drawn at 1/0.6 of the town's scale. */
const K = 1 / 0.6;
/** The island's middle, in town units. */
const ISLAND_Z = -0.48;
/** The places' buildings, a little larger than they are drawn. */
const BUILD_SCALE = 1.45;
const WALK_SPEED = 1.7;

const ROAD = '#cfc6b6';
const GRASS = '#8cba68';
const BASE = '#5c5249';

const easeOutBack = (x: number) => 1 + 2.4 * Math.pow(x - 1, 3) + 1.4 * Math.pow(x - 1, 2);
const smooth = (x: number) => x * x * (3 - 2 * x);

// ---------- small helpers ----------

/** A prism with a triangular end (a gable roof): `w` wide, `h` high, `d` deep, centred on its base. */
function prism(w: number, h: number, d: number, bevel = 0.03) {
  const s = new Shape();
  s.moveTo(-w / 2, 0);
  s.lineTo(w / 2, 0);
  s.lineTo(0, h);
  s.closePath();
  const g = new ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 2 });
  g.translate(0, 0, -d / 2);
  return g;
}

const FONT = `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`;

/** A flat board with writing, `w` by `h`, facing +z. */
function writing(w: number, h: number, paint: (g: CanvasRenderingContext2D, W: number, H: number) => void) {
  const c = document.createElement('canvas');
  const W = Math.round(Math.min(1024, w * 320));
  const H = Math.round(Math.min(1024, h * 320));
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  paint(g, W, H);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  const mesh = new Mesh(new PlaneGeometry(w, h), new MeshStandardMaterial({ map: tex, roughness: 0.9, transparent: true }));
  mesh.userData.keep = true;
  return mesh;
}

/** A soft round sprite texture (smoke, glow) or a "z" (sleep), drawn once each. */
const sprites = new Map<string, CanvasTexture>();
function spriteTexture(kind: 'z' | 'puff' | 'glow') {
  let tex = sprites.get(kind);
  if (!tex) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    if (kind === 'z') {
      g.font = `bold 48px ${FONT}`;
      g.fillStyle = '#ffffff';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('z', 32, 34);
    } else {
      const grad = g.createRadialGradient(32, 32, 2, 32, 32, 30);
      grad.addColorStop(0, kind === 'glow' ? 'rgba(255,214,150,0.9)' : 'rgba(255,255,255,0.9)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, 64, 64);
    }
    tex = new CanvasTexture(c);
    sprites.set(kind, tex);
  }
  return tex;
}

/** A material of its own (not the shared clay), for anything that changes: blinking, glowing, both sides. */
const own = (color: string, extra: Partial<{ emissive: string; emissiveIntensity: number; roughness: number; side: typeof DoubleSide }> = {}) =>
  new MeshStandardMaterial({ color, roughness: extra.roughness ?? 0.85, emissive: extra.emissive ?? '#000000', emissiveIntensity: extra.emissiveIntensity ?? 1, ...(extra.side ? { side: extra.side } : {}) });

/** Marks a part that moves, so baking leaves it (and all in it) as it is. */
function anim<T extends Object3D>(o: T) {
  o.userData.anim = true;
  return o;
}

/** Plain clay, by how rough and metallic it is, its colour in the vertices (see `bake`). */
const painted = new Map<string, MeshStandardMaterial>();
function paintedClay(roughness: number, metalness: number) {
  const key = `${roughness}|${metalness}`;
  let m = painted.get(key);
  if (!m) painted.set(key, (m = new MeshStandardMaterial({ vertexColors: true, roughness, metalness })));
  return m;
}

/**
 * Everything that doesn't move in `root`, however deep, baked into a few meshes: plain clay of every
 * colour into one (the colour goes into the vertices), anything that glows or is see-through into one
 * per material. A plot is then a handful of draw calls instead of hundreds. Moving parts (`anim`) and
 * parts that change on their own (`keep`) stay as they are.
 */
function bake(root: Object3D) {
  root.updateMatrixWorld(true);
  const inv = root.matrixWorld.clone().invert();
  const byMat = new Map<Material, BufferGeometry[]>();
  const plain = (m: Material): m is MeshStandardMaterial => {
    const sm = m as MeshStandardMaterial;
    return !!sm.isMeshStandardMaterial && !sm.map && !sm.transparent && !sm.vertexColors && sm.emissive.getHex() === 0 && sm.side !== DoubleSide;
  };
  const done: Mesh[] = [];
  const walk = (o: Object3D) => {
    for (const c of o.children) {
      if (c.userData.anim) {
        bake(c);
        continue;
      }
      const m = c as Mesh;
      if (m.isMesh && !m.userData.keep && !Array.isArray(m.material)) {
        let g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
        for (const name of Object.keys(g.attributes)) if (name !== 'position' && name !== 'normal') g.deleteAttribute(name);
        if (!g.attributes.normal) g.computeVertexNormals();
        g = g.applyMatrix4(new Matrix4().multiplyMatrices(inv, m.matrixWorld));
        let mat = m.material;
        if (plain(mat)) {
          const n = g.attributes.position.count;
          const col = new Float32Array(n * 3);
          for (let k = 0; k < n; k++) col.set([mat.color.r, mat.color.g, mat.color.b], k * 3);
          g.setAttribute('color', new Float32BufferAttribute(col, 3));
          mat = paintedClay(mat.roughness, mat.metalness);
        }
        const list = byMat.get(mat) ?? [];
        list.push(g);
        byMat.set(mat, list);
        done.push(m);
      }
      walk(c);
    }
  };
  walk(root);
  for (const [mat, geos] of byMat) {
    const merged = mergeGeometries(geos);
    geos.forEach(g => g.dispose());
    if (!merged) continue;
    const mesh = new Mesh(merged, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
  }
  for (const m of done) m.removeFromParent();
}

// ---------- the grid ----------

interface Cell {
  i: number;
  j: number;
}

interface Plot {
  cell: Cell;
  group: Group;
  /** Seconds into the opening when it starts to rise. */
  delay: number;
  /** 0 below, 1 in place. */
  p: number;
  /** The way its front faces (towards the house), and so the road it opens on. */
  door: Vector3;
  anchors: Object3D[];
}

/** Where someone stands, and how they get from there onto the roads. */
interface Spot {
  pos: Vector3;
  exit: Vector3;
  /** The road crossings either side of the exit (the same twice when it is a crossing). */
  ends: [number, number];
  plot?: Plot;
}

/** A free corner of a plot where something one of them loves can go: its middle, the way it faces, its size. */
interface Slot {
  plot: Plot;
  kind: PlaceKind | 'wild';
  at: Vector3;
  turn: number;
  scale: number;
}

/** Which places suit each interest best (else the woods and meadows, else anywhere). */
const SUITS: Record<Interest, Array<PlaceKind | 'wild'>> = {
  tech: ['office', 'school'],
  decor: ['shop', 'family', 'generic'],
  gardening: ['family', 'garden'],
  cooking: ['family', 'generic'],
  pokemon: ['school', 'kindergarten', 'wild'],
  cars: ['kindergarten', 'wild'],
  bugs: ['wild', 'kindergarten'],
  nature: ['wild'],
};

// ---------- the people ----------

interface Walker {
  state: TownPerson;
  group: Group;
  body: Object3D;
  head?: Object3D;
  eyes: Object3D[];
  arms: Object3D[];
  height: number;
  label: Object3D;
  zs: Sprite[];
  /** Where they are (or are heading). */
  at: string;
  spot?: Spot;
  route: Vector3[];
  routeS: number;
  routeLen: number;
  heading: number;
  phase: number;
  blink: number;
  nextBlink: number;
  look: number;
  lookTarget: number;
  nextLook: number;
  wave: number;
  trail: Group;
  trailKey: string;
  /** Opening: when they drop in (once their plot is down). */
  drop: number;
}

export class TownScene extends IslandScene {
  private town = new Group();
  private townState?: TownBits;
  /** Whether the town is showing (false: just the house, as the house view). */
  private shown = true;
  /** The town's own labels (the house's are the house view's). */
  private townKeys = new Set<string>();
  private signature = '';
  private cols = 3;
  private readonly rows = 3;
  private xs: number[] = [];
  private zs: number[] = [];
  private plots: Plot[] = [];
  private placePlots = new Map<string, Plot>();
  private home?: Plot;
  private corner?: Plot;
  private walkers: Walker[] = [];
  /** Things that move on their own: Pikachu hopping, the digger digging, butterflies... */
  private motions: Array<(t: number, dt: number) => void> = [];
  private windows = own('#f6e2b2', { emissive: '#ffbf5e', emissiveIntensity: 0, roughness: 0.4 });
  private bulbs = own('#fff3d6', { emissive: '#ffcf7a', emissiveIntensity: 0, roughness: 0.3 });
  private lampGlows: Sprite[] = [];
  /** The opening: seconds since it began; -1 waiting for the house. Closing runs it backwards. */
  private opening = -1;
  private closing?: () => void;
  private openEnd = 0;
  private houseReady = false;
  private framedAt = -1;
  /** How far the town reaches from the middle, for its shadows. */
  private reach = 30;
  private homeFrame = { center: new Vector3(0, 0.8, 0), radius: 6 };
  private townFrame = { center: new Vector3(), radius: 20 };
  /** Resolves once the house has loaded (the view then looks just like the house view). */
  readonly ready: Promise<void>;
  private markReady!: () => void;

  constructor(canvas: HTMLCanvasElement, onLabels: (l: LabelPosition[]) => void, pixelRatio: number) {
    super(canvas, onLabels, pixelRatio);
    this.ready = new Promise(r => (this.markReady = r));
    this.town.scale.setScalar(K);
    this.town.position.z = -ISLAND_Z * K;
    this.root.add(this.town);
    this.focusDistance = 7.5 * K;
    this.focusElevation = 30;
    this.sun.shadow.mapSize.set(2048, 2048);
  }

  override async load(url: string) {
    await super.load(url);
    this.homeFrame.center.copy(this.framing.center);
    this.homeFrame.radius = this.framing.radius;
    this.houseReady = true;
    if (this.townState) this.setState(this.townState);
    if (this.opening === -1) this.opening = 0;
    this.markReady();
    if (!this.motionOn()) this.renderOnce();
    else this.animateFor(this.openEnd + 0.5);
  }

  /** The house (from the house view), the town (from the people view), or both (a people view on its own). */
  override setState(s: SceneState | TownBits | TownState) {
    if ('flows' in s) super.setState(s);
    if (!('places' in s)) return;
    this.townState = { places: s.places, people: s.people };
    if (!this.houseReady) return;
    const sig = [
      s.places.map(p => `${p.key}:${p.kind}:${p.name}`).join(','),
      s.people.map(p => `${p.key}:${p.model ?? ''}:${p.preset}:${p.shirt}:${p.colour}:${p.interests.join('+')}`).join(','),
    ].join('|');
    if (sig !== this.signature) {
      this.signature = sig;
      this.build(this.townState);
    }
    this.place(this.townState);
  }

  /**
   * Shows the town round the house (the plots rise, the people drop in) or hides it again (they leave, the
   * plots sink, the camera goes back to the house view's picture). `instant`: no animation.
   */
  /** Marks this scene as one that can show a town (for a card holding it as a plain island). */
  readonly reachTown = true;

  showTown(on: boolean, instant = false): Promise<void> {
    if (on) {
      this.shown = true;
      this.closing = undefined;
      if (instant || !this.motionOn()) {
        this.opening = this.houseReady ? 1e6 : -1;
        this.renderOnce();
      } else this.intro();
      return Promise.resolve();
    }
    if (!this.shown) return Promise.resolve();
    if (instant) {
      this.shown = false;
      this.closing = undefined;
      this.opening = 0;
      this.renderOnce();
      return Promise.resolve();
    }
    return this.outro().then(() => {
      this.shown = false;
    });
  }

  private motionOn() {
    return this.state?.motion !== false;
  }

  /** The view opening (a tab switch): the plots rise round the house again; just the house: its glide in. */
  override intro() {
    if (!this.shown) return super.intro();
    if (!this.motionOn()) return;
    this.closing = undefined;
    this.opening = this.houseReady ? 0 : -1;
    for (const w of this.walkers) w.drop = 0;
    this.animateFor(this.openEnd + 0.5);
  }

  /**
   * The view closing (back to the house tab): the people leave, the plots sink, and the camera goes back to
   * the house view's picture. Resolves when it is done.
   */
  outro(): Promise<void> {
    if (!this.motionOn() || !this.houseReady) {
      this.opening = 0;
      this.framedAt = -1;
      this.renderOnce();
      return Promise.resolve();
    }
    this.focus(null);
    this.opening = Math.min(this.opening, this.openEnd);
    const done = new Promise<void>(r => (this.closing = r));
    this.animateFor(this.openEnd + 0.5);
    return done;
  }

  // ---------- building the town ----------

  private build(s: TownBits) {
    this.town.clear();
    for (const key of this.townKeys) this.anchors.delete(key);
    this.townKeys.clear();
    this.plots = [];
    this.placePlots.clear();
    this.walkers = [];
    this.motions = [];
    this.lampGlows = [];

    // Places at the back and the sides (facing the house), woods and meadows in what is left.
    this.cols = s.places.length > 8 ? 5 : 3;
    const halfW = (this.cols * CW) / 2;
    const halfD = (this.rows * CD) / 2;
    // Road lines: the seams between plots, and the outer roads along the middle of the edge strips.
    const inset = GAP / 2 + STRIP / 2;
    this.xs = Array.from({ length: this.cols + 1 }, (_, k) => -halfW + k * CW + (k === 0 ? inset : k === this.cols ? -inset : 0));
    this.zs = Array.from({ length: this.rows + 1 }, (_, k) => -halfD + k * CD + (k === 0 ? inset : k === this.rows ? -inset : 0));

    const order: Cell[] = (
      this.cols === 3
        ? [[0, -1], [-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1], [0, 1]]
        : [[0, -1], [-1, -1], [1, -1], [-2, -1], [2, -1], [-1, 0], [1, 0], [-2, 0], [2, 0], [-2, 1], [2, 1], [-1, 1], [1, 1], [0, 1]]
    ).map(([i, j]) => ({ i, j }));
    const free = [...order];

    this.home = this.plot({ i: 0, j: 0 }, 0.05);
    const slots: Slot[] = [];
    let familyHouses = 0;
    s.places.slice(0, order.length).forEach(pl => {
      const plot = this.plot(free.shift()!);
      this.placePlot(plot, pl, pl.kind === 'family' ? familyHouses++ : 0, slots);
      this.placePlots.set(pl.key, plot);
    });
    const wild = free.map((c, n) => ({ plot: this.plot(c), n }));
    for (const { plot } of wild) {
      for (const [x, z] of [[-1.75, -1.25], [1.75, -1.25], [1.6, 1.3]] as Array<[number, number]>) slots.push({ plot, kind: 'wild', at: new Vector3(x, 0, z), turn: 0, scale: 0.85 });
    }

    // What they love, each where it suits best.
    const loves = (['tech', 'decor', 'gardening', 'cooking', 'pokemon', 'cars', 'bugs', 'nature'] as Interest[]).filter(k => s.people.some(p => p.interests.includes(k)));
    const used: Slot[] = [];
    for (const k of loves) {
      const open = slots.filter(sl => !used.includes(sl));
      const slot = SUITS[k].map(kind => open.find(sl => sl.kind === kind)).find(Boolean) ?? open.find(sl => sl.kind === 'wild') ?? open[0];
      if (!slot) continue;
      used.push(slot);
      const v = new Group();
      v.position.copy(slot.at);
      v.rotation.y = slot.turn;
      v.scale.setScalar(slot.scale);
      this.vignette(k, v);
      slot.plot.group.add(v);
    }
    // The woods and meadows round whatever stands on them.
    wild.forEach(({ plot, n }) => this.fillerPlot(plot, n, used.filter(sl => sl.plot === plot).map(sl => sl.at)));

    this.corner = this.plots.find(p => p.cell.i === (this.cols - 1) / 2 && p.cell.j === 1);
    if (this.corner) this.busStop(this.corner);
    this.lamps();
    // Fewer draw calls: the static parts of every plot become a few meshes.
    for (const plot of this.plots) bake(plot.group);

    s.people.forEach((p, i) => this.walkers.push(this.walker(p, i)));

    // The whole town's framing, in the island's units (the house's is the house view's own).
    this.town.updateMatrixWorld(true);
    this.townFrame.center.copy(this.town.localToWorld(new Vector3(0.5, 0, 1.0)));
    this.townFrame.radius = Math.hypot(halfW, halfD) * 0.84 * K;
    this.reach = (Math.hypot(halfW, halfD) + 1.5) * K;
    this.openEnd = Math.max(...this.plots.map(p => p.delay)) + 1.6;
    if (!this.motionOn()) this.opening = 1e6;
    this.framedAt = -1;
    this.place(s, true);
  }

  /** A plot at a grid cell, its slab and the delay before it rises, by how far out it is. */
  private plot(cell: Cell, delay?: number): Plot {
    const group = new Group();
    group.position.set(cell.i * CW, 0, cell.j * CD);
    const w = CW - GAP;
    const d = CD - GAP;
    // Road on top, the earth below in the house island's colours, the grass raised a little like a lawn.
    // Under the house the road is a little lower, so the island's own lawn doesn't flicker against it.
    group.add(part(rbox(w, 0.14, d, 0.05), clay(ROAD), [0, cell.i || cell.j ? -0.07 : -0.12, 0]));
    // (Under the house a shallower base, so it stays hidden under the island as it slides out.)
    if (cell.i || cell.j) group.add(part(rbox(w - 0.1, 0.72, d - 0.1, 0.14), clay(BASE), [0, -0.5, 0]));
    else group.add(part(rbox(w - 0.1, 0.6, d - 0.1, 0.14), clay(BASE), [0, -0.44, 0]));
    if (cell.i || cell.j) group.add(part(rbox(w - STRIP * 2, 0.06, d - STRIP * 2, 0.03), clay(GRASS), [0, GROUND_Y - 0.03, 0]));
    this.town.add(group);
    const ring = Math.max(Math.abs(cell.i), Math.abs(cell.j)) + 0.35 * (Math.abs(cell.i) + Math.abs(cell.j));
    const seed = Math.sin(cell.i * 12.9898 + cell.j * 78.233) * 43758.5453;
    const plot: Plot = {
      cell,
      group,
      delay: delay ?? 0.35 + ring * 0.24 + (seed - Math.floor(seed)) * 0.14,
      p: 0,
      door: new Vector3(0, 0, 1),
      anchors: [],
    };
    this.plots.push(plot);
    return plot;
  }

  /** A seeded random number generator, so a plot looks the same each time it is built. */
  private rnd(seed: number) {
    let x = Math.max(1, Math.abs(Math.floor(seed * 7919)) % 2147483647);
    return () => (x = (x * 16807) % 2147483647) / 2147483647;
  }

  // ---------- the places ----------

  /**
   * A place's plot: its building at the back facing the house, a path to the road, trees behind, and its
   * two front corners free for something one of them loves.
   */
  private placePlot(plot: Plot, pl: TownPlace, variant: number, slots: Slot[]) {
    const { i, j } = plot.cell;
    plot.door = j !== 0 ? new Vector3(0, 0, -Math.sign(j)) : new Vector3(-Math.sign(i), 0, 0);
    const d = plot.door;
    const deep = (d.z ? CD : CW) / 2 - STRIP;
    const turn = Math.atan2(d.x, d.z);
    const b = new Group();
    b.position.copy(d).multiplyScalar(-0.75);
    b.rotation.y = turn;
    b.scale.setScalar(BUILD_SCALE);
    this.building(pl, b, variant);
    plot.group.add(b);
    // A path from its door to the road.
    const len = deep - 0.9;
    const path = new Vector3().copy(d).multiplyScalar(deep - len / 2);
    plot.group.add(part(rbox(d.z ? 0.7 : len, 0.03, d.z ? len : 0.7, 0.01), clay('#d9cfbd'), [path.x, GROUND_Y + 0.005, path.z]));
    // Its name (and what's on there) over its roof.
    plot.group.updateMatrixWorld(true);
    const top = (new Box3().setFromObject(b).max.y - plot.group.getWorldPosition(new Vector3()).y) / K;
    const label = new Object3D();
    label.position.set(b.position.x, top + 0.5, b.position.z);
    plot.group.add(label);
    this.anchors.set(pl.key, label);
    this.townKeys.add(pl.key);
    plot.anchors.push(label);
    // Trees in the back corners, a bush either side of the path.
    const rnd = this.rnd(i * 31 + j * 17 + 101);
    const side = new Vector3(d.z, 0, -d.x);
    const across = (d.z ? CW : CD) / 2 - STRIP - 0.6;
    for (const sgn of [-1, 1]) {
      this.tree(plot.group, new Vector3().addScaledVector(side, sgn * (across - rnd() * 0.3)).addScaledVector(d, -(deep - 0.8) + rnd() * 0.5), 0.95 + rnd() * 0.4, rnd() < 0.3);
      const bush = new Vector3().addScaledVector(side, sgn * 1.1).addScaledVector(d, deep - 0.7);
      plot.group.add(part(ball(0.22 + rnd() * 0.12, 12, 8), clay('#6fa35e'), [bush.x, GROUND_Y + 0.1, bush.z], [0, 0, 0], [1.3, 0.8, 1]));
      slots.push({ plot, kind: pl.kind, at: new Vector3().addScaledVector(side, sgn * (across - 0.55)).addScaledVector(d, deep - 1.25), turn, scale: 0.62 });
    }
  }

  /** A building for a place, by its kind; its front (+z) faces the house. */
  private building(p: TownPlace, b: Group, variant: number) {
    const y = GROUND_Y;
    const win = (x: number, wy: number, z: number, w = 0.28, hh = 0.26) => {
      b.add(part(rbox(w + 0.07, hh + 0.07, 0.04, 0.015), clay('#f4f1ea'), [x, wy, z]));
      b.add(part(rbox(w, hh, 0.045, 0.01), this.windows, [x, wy, z + 0.006]));
    };
    const sideWin = (sx: number, wy: number, z: number) => {
      b.add(part(rbox(0.04, 0.31, 0.35, 0.015), clay('#f4f1ea'), [sx, wy, z]));
      b.add(part(rbox(0.045, 0.24, 0.28, 0.01), this.windows, [sx * 1.006, wy, z]));
    };
    switch (p.kind) {
      case 'office': {
        // A block of offices: windows all round, a flat roof with a plant room.
        b.add(part(rbox(1.6, 1.9, 1.2, 0.06), clay('#d7dde3'), [0, y + 0.95, 0]));
        b.add(part(rbox(1.66, 0.1, 1.26, 0.04), clay('#7d8a99'), [0, y + 1.93, 0]));
        b.add(part(rbox(0.5, 0.22, 0.4, 0.03), clay('#9aa5b1'), [0.3, y + 2.08, -0.15]));
        for (const r of [0.55, 0.95, 1.35, 1.72]) {
          for (const x of [-0.5, 0, 0.5]) {
            win(x, y + r, 0.6, 0.3, 0.24);
            b.add(part(rbox(0.37, 0.31, 0.04, 0.015), clay('#f4f1ea'), [x, y + r, -0.6]));
            b.add(part(rbox(0.3, 0.24, 0.045, 0.01), this.windows, [x, y + r, -0.606]));
          }
          for (const z of [-0.3, 0.3]) for (const sx of [-0.8, 0.8]) sideWin(sx, y + r, z);
        }
        b.add(part(rbox(0.42, 0.5, 0.05, 0.03), clay('#3d4a5c'), [0, y + 0.25, 0.61]));
        break;
      }
      case 'school': {
        // A red-brick school with a gabled roof and a little clock tower.
        b.add(part(rbox(2.1, 0.95, 1.2, 0.06), clay('#c4664f'), [0, y + 0.48, 0]));
        b.add(part(prism(2.3, 0.6, 1.4), clay('#3f4a57'), [0, y + 0.95, 0]));
        b.add(part(rbox(0.42, 0.5, 0.42, 0.04), clay('#c4664f'), [0, y + 1.35, 0.1]));
        b.add(part(new ConeGeometry(0.36, 0.42, 4), clay('#3f4a57'), [0, y + 1.82, 0.1], [0, Math.PI / 4, 0]));
        b.add(part(disc(0.14, 0.03, 24), clay('#f4f1ea'), [0, y + 1.38, 0.32], [Math.PI / 2, 0, 0]));
        b.add(part(rbox(0.015, 0.1, 0.01, 0.003), clay('#2b2b2b'), [0, y + 1.42, 0.34]));
        for (const x of [-0.7, -0.35, 0.35, 0.7]) win(x, y + 0.55, 0.6);
        for (const sx of [-1.05, 1.05]) sideWin(sx, y + 0.55, 0);
        b.add(part(rbox(0.36, 0.5, 0.05, 0.03), clay('#5d3b2a'), [0, y + 0.25, 0.61]));
        break;
      }
      case 'kindergarten': {
        // A small pastel house with a round red roof, round windows, a slide and a sandpit beside.
        b.add(part(rbox(1.5, 0.75, 1.1, 0.08), clay('#f4d58d'), [0, y + 0.38, 0]));
        b.add(part(new CylinderGeometry(0.62, 0.62, 1.7, 24, 1, false, 0, Math.PI), clay('#e8746a'), [0, y + 0.75, 0], [0, 0, Math.PI / 2]));
        for (const x of [-0.42, 0.42]) {
          b.add(part(new TorusGeometry(0.13, 0.03, 8, 24), clay('#f4f1ea'), [x, y + 0.45, 0.56]));
          b.add(part(disc(0.11, 0.03, 24), this.windows, [x, y + 0.45, 0.555], [Math.PI / 2, 0, 0]));
        }
        b.add(part(rbox(0.3, 0.45, 0.05, 0.08), clay('#5fa8b8'), [0, y + 0.23, 0.56]));
        b.add(part(rbox(0.22, 0.04, 0.9, 0.02), clay('#5fa8b8'), [1.25, y + 0.3, 0.35], [0.55, 0, 0]));
        b.add(part(rbox(0.26, 0.6, 0.08, 0.02), clay('#f2b632'), [1.25, y + 0.3, -0.08]));
        b.add(part(rbox(0.7, 0.1, 0.55, 0.04), clay('#c49a6c'), [-1.2, y + 0.05, 0.45]));
        b.add(part(rbox(0.6, 0.08, 0.45, 0.04), clay('#ead7a6'), [-1.2, y + 0.07, 0.45]));
        b.add(part(new ConeGeometry(0.05, 0.12, 12), clay('#e86a5a'), [-1.1, y + 0.17, 0.4], [Math.PI, 0, 0]));
        break;
      }
      case 'field': {
        // A pitch with its lines and two goals.
        b.add(part(rbox(2.6, 0.04, 1.7, 0.02), clay('#6fae5b'), [0, y + 0.02, 0]));
        const line = clay('#f4f1ea');
        for (const z of [0.78, -0.78]) b.add(part(rbox(2.4, 0.045, 0.03, 0.01), line, [0, y + 0.025, z]));
        for (const x of [-1.2, 0, 1.2]) b.add(part(rbox(0.03, 0.045, 1.56, 0.01), line, [x, y + 0.025, 0]));
        b.add(part(new TorusGeometry(0.25, 0.015, 6, 32), line, [0, y + 0.045, 0], [Math.PI / 2, 0, 0]));
        for (const s of [-1, 1]) {
          const goal = new Group();
          goal.position.set(s * 1.18, y, 0);
          for (const z of [-0.28, 0.28]) goal.add(part(capsule(0.025, 0.36), line, [0, 0.2, z]));
          goal.add(part(capsule(0.025, 0.56), line, [0, 0.4, 0], [Math.PI / 2, 0, 0]));
          b.add(goal);
        }
        b.add(part(ball(0.07, 14, 10), clay('#f4f1ea'), [0.3, y + 0.1, 0.2]));
        break;
      }
      case 'family': {
        if (variant % 2 === 0) {
          // A red-brick villa with a tiled roof, flower boxes and a round window under the gable.
          b.add(part(rbox(1.6, 0.9, 1.2, 0.06), clay('#c4664f'), [0, y + 0.45, 0]));
          b.add(part(prism(1.8, 0.85, 1.4), clay('#7a3a2e'), [0, y + 0.9, 0]));
          b.add(part(rbox(0.18, 0.45, 0.18, 0.03), clay('#8a4a3a'), [-0.45, y + 1.45, -0.2]));
          for (const x of [-0.45, 0.45]) {
            win(x, y + 0.55, 0.6);
            b.add(part(rbox(0.36, 0.08, 0.1, 0.02), clay('#f4f1ea'), [x, y + 0.37, 0.64]));
            for (let k = 0; k < 4; k++) b.add(part(ball(0.035, 8, 6), clay(k % 2 ? '#ec7fa0' : '#f2cf5a'), [x - 0.13 + k * 0.085, y + 0.43, 0.66]));
          }
          for (const sx of [-0.81, 0.81]) sideWin(sx, y + 0.55, 0);
          b.add(part(rbox(0.3, 0.5, 0.05, 0.08), clay('#f4f1ea'), [0, y + 0.25, 0.61]));
          b.add(part(new TorusGeometry(0.1, 0.025, 8, 20), clay('#f4f1ea'), [0, y + 1.15, 0.66]));
          b.add(part(disc(0.08, 0.02, 20), this.windows, [0, y + 1.15, 0.66], [Math.PI / 2, 0, 0]));
        } else {
          // A Danish farmhouse: yellow walls with black timbers, a deep thatched roof.
          b.add(part(rbox(2.3, 0.8, 1.1, 0.04), clay('#f0cf72'), [0, y + 0.4, 0]));
          const timber = clay('#2f2a26');
          for (let k = 0; k <= 6; k++) b.add(part(rbox(0.05, 0.8, 0.03, 0.01), timber, [-1.12 + k * 0.373, y + 0.4, 0.56]));
          b.add(part(rbox(2.3, 0.05, 0.03, 0.01), timber, [0, y + 0.42, 0.56]));
          b.add(part(prism(2.7, 0.95, 1.6, 0.12), clay('#a9844a', { roughness: 1 }), [0, y + 0.78, 0]));
          for (const x of [-0.75, -0.18, 0.75]) win(x, y + 0.48, 0.58, 0.26, 0.24);
          b.add(part(rbox(0.32, 0.55, 0.05, 0.03), clay('#3f6b4a'), [0.25, y + 0.28, 0.58]));
          for (const sx of [-1.16, 1.16]) sideWin(sx, y + 0.48, 0);
          b.add(part(rbox(0.16, 0.35, 0.16, 0.03), clay('#f4f1ea'), [0.6, y + 1.55, -0.15]));
        }
        break;
      }
      case 'shop': {
        // A shop with a striped awning and a big window.
        b.add(part(rbox(1.7, 1.0, 1.1, 0.06), clay('#ebe3d4'), [0, y + 0.5, 0]));
        b.add(part(rbox(1.8, 0.12, 1.2, 0.04), clay('#8c98a6'), [0, y + 1.02, 0]));
        for (let i = 0; i < 6; i++) b.add(part(rbox(0.3, 0.05, 0.42, 0.015), clay(i % 2 ? '#f4f1ea' : '#d9473f'), [-0.75 + i * 0.3, y + 0.8, 0.72], [0.5, 0, 0]));
        win(-0.35, y + 0.45, 0.56, 0.7, 0.45);
        b.add(part(rbox(0.36, 0.55, 0.05, 0.03), clay('#3d4a5c'), [0.5, y + 0.28, 0.56]));
        break;
      }
      case 'garden': {
        // A greenhouse full of plants.
        const glass = new MeshStandardMaterial({ color: '#d6eef5', transparent: true, opacity: 0.35, roughness: 0.1, depthWrite: false });
        b.add(part(rbox(1.7, 0.75, 1.2, 0.02), glass, [0, y + 0.38, 0]));
        b.add(part(prism(1.75, 0.45, 1.25), glass, [0, y + 0.75, 0]));
        for (const x of [-0.85, 0, 0.85]) for (const z of [-0.6, 0.6]) b.add(part(rbox(0.04, 0.75, 0.04, 0.01), clay('#f4f1ea'), [x, y + 0.38, z]));
        for (let i = 0; i < 8; i++) b.add(part(ball(0.16, 12, 10), clay(i % 2 ? '#5f9a52' : '#7fae5f'), [-0.6 + (i % 4) * 0.4, y + 0.2, i < 4 ? -0.3 : 0.25], [0, 0, 0], [1, 1.3, 1]));
        break;
      }
      default: {
        // A house with a flag.
        b.add(part(rbox(1.4, 0.85, 1.1, 0.06), clay('#d9c7e8'), [0, y + 0.43, 0]));
        b.add(part(prism(1.6, 0.6, 1.3), clay('#5b5470'), [0, y + 0.85, 0]));
        win(-0.38, y + 0.5, 0.56);
        win(0.38, y + 0.5, 0.56);
        b.add(part(rbox(0.3, 0.48, 0.05, 0.03), clay('#5d3b2a'), [0, y + 0.24, 0.56]));
        b.add(part(disc(0.02, 1.1, 8), clay('#f4f1ea'), [0.9, y + 0.55, 0.3]));
        const flag = anim(new Group());
        flag.position.set(0.9, y + 1.0, 0.3);
        flag.add(part(rbox(0.36, 0.22, 0.02, 0.01), clay('#d9473f'), [0.18, 0, 0]));
        b.add(flag);
        this.motions.push(t => (flag.rotation.y = Math.sin(t * 2.1) * 0.25));
      }
    }
  }

  // ---------- what they love ----------

  /** One interest as a little scene, about 2.8 × 2.2, facing +z. */
  private vignette(kind: Interest, v: Group) {
    const y = GROUND_Y;
    switch (kind) {
      case 'pokemon': {
        // A Pokéball statue on a plinth that rocks now and then, and Pikachu hopping beside it.
        v.add(part(rbox(0.95, 0.3, 0.95, 0.06), clay('#c2bdb2'), [-0.45, y + 0.15, -0.2]));
        const r = 0.42;
        const pb = anim(new Group());
        pb.position.set(-0.45, y + 0.3, -0.2);
        pb.add(part(new SphereGeometry(r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), clay('#e5483d', { roughness: 0.4 }), [0, r, 0]));
        pb.add(part(new SphereGeometry(r, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), clay('#f4f1ea', { roughness: 0.4 }), [0, r, 0]));
        pb.add(part(new TorusGeometry(r, 0.035, 8, 48), clay('#2b2b2b'), [0, r, 0], [Math.PI / 2, 0, 0]));
        pb.add(part(disc(0.13, 0.08, 24), clay('#2b2b2b'), [0, r, r - 0.02], [Math.PI / 2, 0, 0]));
        pb.add(part(disc(0.085, 0.1, 24), clay('#f4f1ea'), [0, r, r], [Math.PI / 2, 0, 0]));
        v.add(pb);
        this.motions.push(t => {
          const k = t % 6;
          pb.rotation.z = k < 1.2 ? Math.sin(k * Math.PI * 3.3) * 0.16 * (1.2 - k) : 0;
        });
        const pika = anim(new Group());
        pika.position.set(0.6, y, 0.25);
        pika.rotation.y = -0.4;
        const yel = clay('#f6d13a', { roughness: 0.6 });
        const blk = clay('#2b2b2b');
        pika.add(part(ball(0.17, 18, 14), yel, [0, 0.19, 0], [0, 0, 0], [1, 1.15, 0.9]));
        pika.add(part(ball(0.17, 18, 14), yel, [0, 0.47, 0.01]));
        for (const s of [-1, 1]) {
          const ear = new Group();
          ear.position.set(s * 0.09, 0.58, 0);
          ear.rotation.z = -s * 0.42;
          ear.add(part(new ConeGeometry(0.055, 0.26, 12), yel, [0, 0.13, 0]));
          ear.add(part(new ConeGeometry(0.024, 0.08, 12), blk, [0, 0.235, 0]));
          pika.add(ear);
          pika.add(part(ball(0.04, 10, 8), clay('#e5483d'), [s * 0.1, 0.43, 0.13]));
          pika.add(part(ball(0.026, 10, 8), blk, [s * 0.065, 0.51, 0.15]));
          pika.add(part(ball(0.045, 10, 8), yel, [s * 0.13, 0.25, 0.1]));
          pika.add(part(ball(0.05, 10, 8), yel, [s * 0.08, 0.04, 0.05], [0, 0, 0], [1, 0.6, 1.3]));
        }
        // The lightning-bolt tail.
        pika.add(part(rbox(0.07, 0.2, 0.03, 0.01), clay('#8a5a3a'), [0.05, 0.16, -0.18], [0, 0, -0.6]));
        pika.add(part(rbox(0.08, 0.2, 0.03, 0.01), yel, [0.13, 0.3, -0.2], [0, 0, 0.7]));
        pika.add(part(rbox(0.16, 0.24, 0.03, 0.01), yel, [0.2, 0.47, -0.21], [0, 0, -0.5]));
        v.add(pika);
        this.motions.push(t => {
          const k = t % 3.2;
          pika.position.y = y + (k < 0.9 ? Math.abs(Math.sin(k * Math.PI * 2.2)) * 0.16 : 0);
        });
        break;
      }
      case 'cars': {
        // A building site: a sand heap, cones, and a yellow digger at work.
        v.add(part(new ConeGeometry(0.75, 0.55, 22), clay('#e0c48a'), [-0.75, y + 0.27, -0.35], [0, 0, 0], [1, 1, 0.85]));
        v.add(part(rbox(1.0, 0.04, 0.8, 0.02), clay('#b79a6b'), [0.4, y + 0.02, 0.1]));
        const dig = new Group();
        dig.position.set(0.45, y, 0.05);
        dig.rotation.y = -0.6;
        const yellow = clay('#f2b632', { roughness: 0.55 });
        const dark = clay('#33363b');
        for (const z of [-0.22, 0.22]) dig.add(part(rbox(0.8, 0.18, 0.18, 0.08), dark, [0, 0.09, z]));
        const turret = anim(new Group());
        turret.position.y = 0.2;
        turret.add(part(rbox(0.66, 0.26, 0.5, 0.05), yellow, [0.05, 0.13, 0]));
        turret.add(part(rbox(0.3, 0.36, 0.42, 0.05), yellow, [0.18, 0.44, 0]));
        turret.add(part(rbox(0.31, 0.22, 0.36, 0.03), clay('#3a4652', { roughness: 0.2 }), [0.18, 0.48, 0]));
        turret.add(part(rbox(0.14, 0.12, 0.44, 0.03), dark, [0.36, 0.1, 0]));
        const boom = new Group();
        boom.position.set(-0.15, 0.3, 0);
        boom.add(part(rbox(0.62, 0.1, 0.1, 0.04), yellow, [-0.3, 0, 0]));
        const stick = new Group();
        stick.position.set(-0.6, 0, 0);
        stick.add(part(rbox(0.08, 0.46, 0.08, 0.03), yellow, [0, -0.22, 0]));
        stick.add(part(rbox(0.2, 0.14, 0.22, 0.04), dark, [-0.05, -0.47, 0]));
        boom.add(stick);
        turret.add(boom);
        dig.add(turret);
        v.add(dig);
        this.motions.push(t => {
          boom.rotation.z = -0.55 + Math.sin(t * 1.1) * 0.22;
          stick.rotation.z = 0.35 + Math.sin(t * 1.1 + 1.2) * 0.4;
          turret.rotation.y = Math.sin(t * 0.35) * 0.5;
        });
        for (const [x, z] of [[-1.2, 0.6], [-0.85, 0.85], [1.15, -0.7]] as Array<[number, number]>) {
          v.add(part(new ConeGeometry(0.07, 0.24, 14), clay('#f07a2c'), [x, y + 0.12, z]));
          v.add(part(new CylinderGeometry(0.04, 0.05, 0.05, 14), clay('#f4f1ea'), [x, y + 0.13, z]));
        }
        break;
      }
      case 'cooking': {
        // A kettle barbecue with smoke, and a picnic table laid with a checked cloth.
        const blk = clay('#2b2b2b', { roughness: 0.5 });
        const grill = new Group();
        grill.position.set(-0.8, y, -0.25);
        for (let k = 0; k < 3; k++) {
          const a = (k / 3) * Math.PI * 2;
          grill.add(part(capsule(0.018, 0.45), blk, [Math.cos(a) * 0.15, 0.25, Math.sin(a) * 0.15], [Math.sin(a) * 0.25, 0, -Math.cos(a) * 0.25]));
        }
        grill.add(part(new SphereGeometry(0.28, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), blk, [0, 0.56, 0]));
        grill.add(part(new SphereGeometry(0.28, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), blk, [0, 0.62, -0.12], [-0.6, 0, 0]));
        for (let k = 0; k < 3; k++) grill.add(part(capsule(0.025, 0.16), clay('#a5522f'), [-0.08 + k * 0.08, 0.58, 0.05], [0, 0, Math.PI / 2]));
        v.add(grill);
        const puffs: Sprite[] = [];
        for (let k = 0; k < 4; k++) {
          const s = new Sprite(new SpriteMaterial({ map: spriteTexture('puff'), transparent: true, depthWrite: false, opacity: 0 }));
          v.add(s);
          puffs.push(s);
        }
        this.motions.push(t => {
          puffs.forEach((s, k) => {
            const a = (t * 0.35 + k / 4) % 1;
            s.position.set(-0.8 + a * 0.2, y + 0.7 + a * 1.1, -0.2);
            s.scale.setScalar(0.15 + a * 0.4);
            (s.material as SpriteMaterial).opacity = Math.sin(a * Math.PI) * 0.5;
          });
        });
        const wood = clay('#a37c54');
        const tb = new Group();
        tb.position.set(0.45, y, 0.2);
        tb.add(part(rbox(1.2, 0.05, 0.55, 0.02), wood, [0, 0.5, 0]));
        for (const z of [-0.45, 0.45]) tb.add(part(rbox(1.2, 0.05, 0.2, 0.02), wood, [0, 0.28, z]));
        for (const x of [-0.45, 0.45]) tb.add(part(rbox(0.06, 0.5, 0.9, 0.02), wood, [x, 0.25, 0]));
        tb.add(part(rbox(1.0, 0.012, 0.46, 0.004), clay('#e0574c'), [0, 0.53, 0]));
        for (let k = 0; k < 4; k++) tb.add(part(rbox(0.05, 0.014, 0.46, 0.003), clay('#f4f1ea'), [-0.4 + k * 0.27, 0.532, 0]));
        for (const x of [-0.3, 0.3]) tb.add(part(disc(0.1, 0.02, 20), clay('#f4f1ea'), [x, 0.55, 0.05]));
        tb.add(part(new SphereGeometry(0.1, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), clay('#5fa8b8'), [0, 0.64, -0.05]));
        tb.add(part(ball(0.05, 10, 8), clay('#e5483d'), [0.02, 0.6, -0.05]));
        tb.add(part(ball(0.05, 10, 8), clay('#7fae5f'), [-0.04, 0.61, -0.03]));
        v.add(tb);
        break;
      }
      case 'tech': {
        // A radio mast with a blinking light, a satellite dish slowly turning, a cabinet of blinking lights.
        const steel = clay('#9aa5b1', { roughness: 0.5, metalness: 0.4 });
        v.add(part(new CylinderGeometry(0.03, 0.09, 2.3, 8), steel, [-0.9, y + 1.15, -0.4]));
        for (let k = 1; k < 5; k++) v.add(part(rbox(0.32 - k * 0.05, 0.03, 0.03, 0.01), steel, [-0.9, y + k * 0.45, -0.4]));
        const red = own('#ff4a3d', { emissive: '#ff2a1d', emissiveIntensity: 1 });
        const tip = part(ball(0.06, 12, 10), red, [-0.9, y + 2.33, -0.4]);
        v.add(tip);
        this.motions.push(t => (red.emissiveIntensity = t % 1.4 < 0.5 ? 2.5 : 0.2));
        const dish = anim(new Group());
        dish.position.set(0.35, y, -0.3);
        dish.add(part(disc(0.05, 0.5, 10), steel, [0, 0.25, 0]));
        const head = new Group();
        head.position.y = 0.55;
        head.rotation.x = -0.9;
        head.add(part(new SphereGeometry(0.42, 28, 10, 0, Math.PI * 2, Math.PI - 0.75, 0.75), clay('#f4f1ea', { roughness: 0.4 }), [0, 0.42 * Math.cos(0.75) + 0.02, 0]));
        head.add(part(capsule(0.015, 0.36), steel, [0, 0.2, 0]));
        head.add(part(ball(0.04, 10, 8), clay('#3d4a5c'), [0, 0.4, 0]));
        dish.add(head);
        v.add(dish);
        this.motions.push(t => (dish.rotation.y = t * 0.25));
        v.add(part(rbox(0.45, 0.8, 0.38, 0.03), clay('#2f353d'), [0.95, y + 0.4, 0.45]));
        const leds = [own('#58c27a', { emissive: '#58c27a' }), own('#7fd1ff', { emissive: '#7fd1ff' })];
        for (let r = 0; r < 4; r++)
          for (let c = 0; c < 3; c++) {
            const led = part(ball(0.022, 8, 6), leds[(r + c) % 2], [0.83 + c * 0.11, y + 0.2 + r * 0.16, 0.65]);
            v.add(led);
          }
        this.motions.push(t => {
          leds[0].emissiveIntensity = Math.sin(t * 7) > 0 ? 2 : 0.3;
          leds[1].emissiveIntensity = Math.sin(t * 5.3 + 1) > 0 ? 2 : 0.3;
        });
        break;
      }
      case 'gardening': {
        // Raised beds of cabbages and carrots, sunflowers nodding, a watering can.
        const wood = clay('#a37c54');
        const soil = clay('#6b4a33');
        for (const x of [-0.6, 0.55]) {
          v.add(part(rbox(1.0, 0.26, 0.55, 0.03), wood, [x, y + 0.13, -0.4]));
          v.add(part(rbox(0.9, 0.04, 0.45, 0.02), soil, [x, y + 0.26, -0.4]));
        }
        for (let k = 0; k < 4; k++) v.add(part(ball(0.1, 12, 10), clay(k % 2 ? '#6fae5b' : '#86c06a'), [-0.92 + k * 0.21, y + 0.32, -0.4], [0, 0, 0], [1, 0.8, 1]));
        for (let k = 0; k < 5; k++) {
          v.add(part(new ConeGeometry(0.035, 0.1, 10), clay('#f07a2c'), [0.25 + k * 0.15, y + 0.29, -0.4], [Math.PI, 0, 0]));
          v.add(part(new ConeGeometry(0.04, 0.14, 6), clay('#5f9a52'), [0.25 + k * 0.15, y + 0.39, -0.4]));
        }
        for (let k = 0; k < 3; k++) {
          const f = anim(new Group());
          f.position.set(-0.9 + k * 0.32, y, 0.35);
          f.add(part(capsule(0.02, 0.85 + k * 0.1), clay('#5f9a52'), [0, 0.45, 0]));
          const head = new Group();
          head.position.y = 0.92 + k * 0.1;
          head.add(part(disc(0.15, 0.03, 16), clay('#f6c533'), [0, 0, 0.02], [Math.PI / 2, 0, 0]));
          head.add(part(disc(0.07, 0.04, 16), clay('#6b4a33'), [0, 0, 0.04], [Math.PI / 2, 0, 0]));
          f.add(head);
          v.add(f);
          this.motions.push(t => (f.rotation.z = Math.sin(t * 1.3 + k) * 0.05));
        }
        const can = new Group();
        can.position.set(0.7, y, 0.4);
        can.rotation.y = -0.6;
        can.add(part(new CylinderGeometry(0.12, 0.13, 0.24, 18), clay('#4f9a6a', { roughness: 0.5 }), [0, 0.12, 0]));
        can.add(part(capsule(0.018, 0.24), clay('#4f9a6a'), [0.18, 0.2, 0], [0, 0, -1.0]));
        can.add(part(new TorusGeometry(0.08, 0.015, 6, 16, Math.PI), clay('#4f9a6a'), [-0.05, 0.25, 0]));
        v.add(can);
        break;
      }
      case 'decor': {
        // A flea-market stall of interior finds under a striped awning: lamps, vases, a mirror, a chair,
        // a rug hung over the side, a lantern lit at night.
        const wood = clay('#a37c54');
        for (const x of [-0.85, 0.85]) for (const z of [-0.35, 0.25]) v.add(part(rbox(0.06, 1.35, 0.06, 0.015), wood, [x, y + 0.68, z]));
        v.add(part(rbox(1.8, 0.06, 0.7, 0.02), wood, [0, y + 0.55, -0.05]));
        for (let k = 0; k < 6; k++) v.add(part(rbox(0.31, 0.04, 0.85, 0.01), clay(k % 2 ? '#f4f1ea' : '#4f8f8a'), [-0.78 + k * 0.31, y + 1.38, -0.05], [0.18, 0, 0]));
        // On the table.
        v.add(part(new CylinderGeometry(0.06, 0.09, 0.26, 16), clay('#e8a87c', { roughness: 0.4 }), [-0.6, y + 0.71, -0.1]));
        v.add(part(new CylinderGeometry(0.05, 0.05, 0.18, 16), clay('#7fb6e8', { roughness: 0.3 }), [-0.4, y + 0.67, 0.05]));
        v.add(part(ball(0.08, 14, 10), clay('#f2cf5a', { roughness: 0.4 }), [-0.22, y + 0.66, -0.12], [0, 0, 0], [1, 1.2, 1]));
        // A table lamp with a pleated shade.
        v.add(part(disc(0.015, 0.3, 8), clay('#c9a25a', { metalness: 0.5 }), [0.1, y + 0.73, -0.1]));
        v.add(part(new CylinderGeometry(0.08, 0.14, 0.14, 16, 1, true), own('#f4e3c3', { emissive: '#ffcf7a', emissiveIntensity: 0, side: DoubleSide }), [0.1, y + 0.9, -0.1]));
        v.add(part(ball(0.035, 8, 6), this.bulbs, [0.1, y + 0.86, -0.1]));
        // A round mirror in a gold frame, leant on the table.
        v.add(part(new TorusGeometry(0.17, 0.025, 8, 28), clay('#c9a25a', { metalness: 0.6, roughness: 0.4 }), [0.5, y + 0.78, -0.25], [-0.15, 0, 0]));
        v.add(part(disc(0.16, 0.01, 28), clay('#cfe3ee', { metalness: 0.7, roughness: 0.1 }), [0.5, y + 0.78, -0.26], [Math.PI / 2 - 0.15, 0, 0]));
        // A rug hung over the front.
        v.add(part(rbox(0.8, 0.45, 0.02, 0.005), clay('#c96f4a'), [0.3, y + 0.33, 0.31]));
        v.add(part(rbox(0.62, 0.3, 0.025, 0.004), clay('#e8c9a6'), [0.3, y + 0.33, 0.315]));
        // A painted chair beside the stall, and a basket of throws.
        const chair = new Group();
        chair.position.set(1.25, y, 0.3);
        chair.rotation.y = -0.5;
        const paint = clay('#7d9bb8');
        chair.add(part(rbox(0.36, 0.04, 0.34, 0.01), paint, [0, 0.3, 0]));
        chair.add(part(rbox(0.36, 0.38, 0.04, 0.01), paint, [0, 0.5, -0.16]));
        for (const [x, z] of [[-0.15, -0.14], [0.15, -0.14], [-0.15, 0.14], [0.15, 0.14]] as Array<[number, number]>) chair.add(part(rbox(0.03, 0.3, 0.03, 0.005), paint, [x, 0.15, z]));
        v.add(chair);
        v.add(part(new CylinderGeometry(0.17, 0.14, 0.24, 16), clay('#c9a26a'), [-1.2, y + 0.12, 0.25]));
        for (let k = 0; k < 3; k++) v.add(part(capsule(0.06, 0.14), clay(['#e8e2d6', '#c96f4a', '#f2cf5a'][k]), [-1.26 + k * 0.07, y + 0.28, 0.25], [0.3, 0, 0.4 - k * 0.3]));
        break;
      }
      case 'bugs': {
        // A bug hotel full of logs and cones, a giant ladybird on a leaf, butterflies about.
        const hotel = new Group();
        hotel.position.set(-0.7, y, -0.4);
        hotel.add(part(rbox(0.85, 0.95, 0.32, 0.03), clay('#b98c5f'), [0, 0.48, 0]));
        hotel.add(part(prism(1.0, 0.35, 0.4), clay('#6b4a33'), [0, 0.95, 0]));
        for (let r = 0; r < 3; r++)
          for (let c = 0; c < 3; c++) {
            const x = -0.27 + c * 0.27;
            const yy = 0.2 + r * 0.28;
            if ((r + c) % 2) for (let k = 0; k < 3; k++) hotel.add(part(disc(0.04, 0.08, 10), clay('#d9b98a'), [x - 0.06 + k * 0.06, yy, 0.13], [Math.PI / 2, 0, 0]));
            else hotel.add(part(new ConeGeometry(0.06, 0.16, 8), clay('#7a5236'), [x, yy, 0.12], [Math.PI / 2, 0, 0]));
          }
        v.add(hotel);
        v.add(part(ball(0.4, 16, 10), clay('#6fae5b'), [0.55, y + 0.05, 0.2], [0, 0.4, 0], [1.3, 0.12, 0.8]));
        const bug = new Group();
        bug.position.set(0.55, y + 0.09, 0.2);
        bug.rotation.y = 0.6;
        bug.add(part(new SphereGeometry(0.25, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), clay('#e5483d', { roughness: 0.35 }), [0, 0, 0], [0, 0, 0], [1, 0.75, 1.2]));
        bug.add(part(ball(0.12, 12, 10), clay('#2b2b2b'), [0, 0.04, 0.3]));
        bug.add(part(rbox(0.015, 0.02, 0.5, 0.005), clay('#2b2b2b'), [0, 0.19, 0]));
        for (const [x, z] of [[0.1, 0.1], [-0.1, 0.1], [0.12, -0.12], [-0.12, -0.12], [0, -0.25]] as Array<[number, number]>)
          bug.add(part(ball(0.045, 10, 8), clay('#2b2b2b'), [x, 0.15 - Math.abs(z) * 0.2, z], [0, 0, 0], [1, 0.4, 1]));
        v.add(bug);
        this.butterflies(v, new Vector3(0, y + 0.9, 0), 3);
        for (let k = 0; k < 6; k++) v.add(part(ball(0.04, 8, 6), clay(['#ec7fa0', '#f2cf5a', '#c99ae0'][k % 3]), [-0.2 + (k % 3) * 0.18, y + 0.08, 0.6 + Math.floor(k / 3) * 0.12]));
        break;
      }
      case 'nature': {
        // A pond with lily pads, ducks going round, reeds and stones; a pine behind.
        v.add(part(new CylinderGeometry(0.9, 0.9, 0.04, 36), own('#5aa7d6', { roughness: 0.15 }), [0, y + 0.01, 0], [0, 0, 0], [1.25, 1, 0.85]));
        for (let k = 0; k < 14; k++) {
          const a = (k / 14) * Math.PI * 2;
          v.add(part(ball(0.09 + (k % 3) * 0.02, 10, 8), clay('#b5afa4'), [Math.cos(a) * 1.15, y + 0.04, Math.sin(a) * 0.78], [0, 0, 0], [1.2, 0.6, 1]));
        }
        for (const [x, z] of [[-0.35, 0.2], [0.4, -0.25], [0.15, 0.35]] as Array<[number, number]>) v.add(part(disc(0.11, 0.015, 16), clay('#5f9a52'), [x, y + 0.035, z]));
        v.add(part(ball(0.04, 8, 6), clay('#ec7fa0'), [0.4, y + 0.06, -0.25]));
        for (let k = 0; k < 5; k++) {
          v.add(part(capsule(0.012, 0.5), clay('#6b8f4e'), [-1.0 + k * 0.06, y + 0.28, -0.45 - (k % 2) * 0.06]));
          v.add(part(capsule(0.03, 0.08), clay('#7a5236'), [-1.0 + k * 0.06, y + 0.55, -0.45 - (k % 2) * 0.06]));
        }
        const ducks = anim(new Group());
        ducks.position.set(0, y + 0.03, 0);
        for (let k = 0; k < 2; k++) {
          const d = new Group();
          const a = k * Math.PI;
          d.position.set(Math.cos(a) * 0.55, 0, Math.sin(a) * 0.38);
          d.rotation.y = -a;
          d.add(part(ball(0.09, 12, 10), clay(k ? '#f2cf5a' : '#f4f1ea'), [0, 0.05, 0], [0, 0, 0], [1, 0.7, 1.4]));
          d.add(part(ball(0.055, 10, 8), clay(k ? '#f2cf5a' : '#4f8a5c'), [0, 0.13, 0.1]));
          d.add(part(new ConeGeometry(0.02, 0.06, 8), clay('#f07a2c'), [0, 0.12, 0.17], [Math.PI / 2, 0, 0]));
          ducks.add(d);
        }
        v.add(ducks);
        this.motions.push(t => (ducks.rotation.y = -t * 0.35));
        this.tree(v, new Vector3(0.95, 0, -0.65), 1.0, true);
        break;
      }
    }
  }

  /** Butterflies fluttering round a point. */
  private butterflies(g: Group, centre: Vector3, n: number) {
    for (let k = 0; k < n; k++) {
      const b = anim(new Group());
      const mat = own(['#f2b632', '#7fb6e8', '#ec7fa0'][k % 3], { side: DoubleSide });
      for (const s of [-1, 1]) {
        const w = new Mesh(new PlaneGeometry(0.12, 0.1), mat);
        w.geometry.translate(s * 0.06, 0, 0);
        w.rotation.x = -Math.PI / 2;
        const hinge = anim(new Group());
        hinge.add(w);
        hinge.userData.s = s;
        b.add(hinge);
      }
      g.add(b);
      const ph = k * 2.1;
      this.motions.push(t => {
        const a = t * 0.8 + ph;
        b.position.set(centre.x + Math.cos(a) * (0.6 + k * 0.15), centre.y + Math.sin(t * 2 + ph) * 0.15 + k * 0.12, centre.z + Math.sin(a) * 0.45);
        b.rotation.y = -a;
        for (const h of b.children) h.rotation.z = h.userData.s * Math.sin(t * 18 + ph) * 0.9;
      });
    }
  }

  // ---------- filling the rest ----------

  /** Woods, or a meadow with Dannebrog on a pole and a bench, round what stands at `taken`. */
  private fillerPlot(plot: Plot, n: number, taken: Vector3[]) {
    const rnd = this.rnd(plot.cell.i * 23 + plot.cell.j * 41 + 7 + n);
    const w = CW / 2 - STRIP - 0.5;
    const d = CD / 2 - STRIP - 0.5;
    const clear = (at: Vector3, r: number) => taken.every(t => Math.hypot(t.x - at.x, t.z - at.z) > r);
    const anywhere = (r: number) => {
      for (let k = 0; k < 20; k++) {
        const at = new Vector3((rnd() * 2 - 1) * w, 0, (rnd() * 2 - 1) * d);
        if (clear(at, r)) return at;
      }
      return undefined;
    };
    if (n % 2 === 0) {
      for (let k = 0; k < 11; k++) {
        const at = anywhere(1.5);
        if (at) this.tree(plot.group, at, 0.9 + rnd() * 0.5, rnd() < 0.5);
      }
      for (let k = 0; k < 4; k++) {
        const at = anywhere(1.3);
        if (!at) continue;
        plot.group.add(part(disc(0.03, 0.1, 8), clay('#f4f1ea'), [at.x, GROUND_Y + 0.05, at.z]));
        plot.group.add(part(new SphereGeometry(0.08, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), clay('#e5483d'), [at.x, GROUND_Y + 0.09, at.z]));
      }
      for (let k = 0; k < 3; k++) {
        const at = anywhere(1.3);
        if (at) plot.group.add(part(ball(0.18 + rnd() * 0.12, 10, 8), clay('#a9a397'), [at.x, GROUND_Y + 0.06, at.z], [0, rnd() * 3, 0], [1.3, 0.7, 1]));
      }
    } else {
      const flagAt = clear(new Vector3(-1.4, 0, 1.4), 1.4) ? new Vector3(-1.4, 0, 1.4) : new Vector3(0, 0, 0);
      const pole = new Group();
      pole.position.set(flagAt.x, GROUND_Y, flagAt.z);
      pole.add(part(disc(0.035, 2.4, 10), clay('#f4f1ea'), [0, 1.2, 0]));
      pole.add(part(ball(0.06, 10, 8), clay('#f2cf5a', { metalness: 0.5 }), [0, 2.43, 0]));
      const flag = anim(new Group());
      flag.position.set(0, 2.15, 0);
      flag.add(part(rbox(0.75, 0.5, 0.02, 0.005), clay('#c8102e'), [0.4, 0, 0]));
      flag.add(part(rbox(0.75, 0.08, 0.025, 0.003), clay('#f4f1ea'), [0.4, 0, 0]));
      flag.add(part(rbox(0.08, 0.5, 0.025, 0.003), clay('#f4f1ea'), [0.3, 0, 0]));
      pole.add(flag);
      plot.group.add(pole);
      this.motions.push(t => (flag.rotation.y = Math.sin(t * 1.7) * 0.3 - 0.2));
      const seat = anywhere(1.4);
      if (seat) this.bench(plot.group, seat, Math.PI);
      for (let k = 0; k < 4; k++) {
        const at = anywhere(1.5);
        if (at) this.tree(plot.group, at, 0.9 + rnd() * 0.4, false);
      }
      for (let k = 0; k < 9; k++) {
        const at = anywhere(1.2);
        if (!at) continue;
        for (let f = 0; f < 5; f++) {
          const a = f * 1.3;
          plot.group.add(part(ball(0.04, 8, 6), clay(['#ec7fa0', '#f2cf5a', '#c99ae0', '#f4f1ea'][(k + f) % 4]), [at.x + Math.cos(a) * 0.15, GROUND_Y + 0.06, at.z + Math.sin(a) * 0.15]));
        }
      }
      for (let k = 0; k < 3; k++) {
        const at = anywhere(1.3);
        if (at) plot.group.add(part(ball(0.25, 12, 8), clay('#6fa35e'), [at.x, GROUND_Y + 0.1, at.z], [0, 0, 0], [1.3, 0.8, 1]));
      }
    }
  }

  private tree(g: Group, at: Vector3, s: number, pine: boolean) {
    const t = new Group();
    t.position.set(at.x, GROUND_Y, at.z);
    if (pine) {
      t.add(part(disc(0.07 * s, 0.3 * s, 8), clay('#8a6446'), [0, 0.15 * s, 0]));
      for (const [r, h, y] of [[0.5, 0.65, 0.55], [0.38, 0.6, 0.9], [0.24, 0.5, 1.2]]) t.add(part(new ConeGeometry(r * s, h * s, 10), clay('#43785a'), [0, y * s, 0]));
    } else {
      t.add(part(disc(0.08 * s, 0.6 * s, 8), clay('#8a6446'), [0, 0.3 * s, 0]));
      t.add(part(ball(0.42 * s, 14, 10), clay(at.x > 0 ? '#5f9a52' : '#4f8a5c'), [0, 0.83 * s, 0]));
      t.add(part(ball(0.3 * s, 12, 8), clay('#6fae5b'), [0.18 * s, 1.1 * s, 0.06]));
    }
    g.add(t);
  }

  private bench(g: Group, at: Vector3, turn: number) {
    const b = new Group();
    b.position.set(at.x, GROUND_Y, at.z);
    b.rotation.y = turn;
    const wood = clay('#a37c54');
    b.add(part(rbox(0.8, 0.05, 0.26, 0.02), wood, [0, 0.25, 0]));
    b.add(part(rbox(0.8, 0.2, 0.04, 0.02), wood, [0, 0.42, -0.13]));
    for (const x of [-0.35, 0.35]) b.add(part(rbox(0.05, 0.25, 0.26, 0.01), clay('#3d3f44'), [x, 0.12, 0]));
    g.add(b);
  }

  /** Street lamps on the plots' corners, lit at night. */
  private lamps() {
    for (const plot of this.plots) {
      const lamp = new Group();
      lamp.position.set(-CW / 2 + 0.35, 0, CD / 2 - 0.35);
      lamp.add(part(disc(0.035, 1.1, 8), clay('#3d3f44'), [0, 0.55, 0]));
      lamp.add(part(ball(0.09, 12, 10), this.bulbs, [0, 1.15, 0]));
      const glow = new Sprite(new SpriteMaterial({ map: spriteTexture('glow'), transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0 }));
      glow.position.set(0, 1.15, 0);
      glow.scale.setScalar(1.4);
      lamp.add(glow);
      this.lampGlows.push(glow);
      // The house's own corner lamp shows only once the road round it is out.
      if (plot.cell.i === 0 && plot.cell.j === 0) anim(lamp).userData.lamp = true;
      plot.group.add(lamp);
    }
  }

  /**
   * The way out of town: a bus stop on the front road, at the corner plot's edge. Anyone out somewhere the
   * town doesn't know waits there.
   */
  private busStop(plot: Plot) {
    const g = new Group();
    // On the corner plot's front verge, facing the road.
    g.position.set(CW / 2 - 1.7, 0, CD / 2 - STRIP - 0.32);
    const frame = clay('#3d4a5c');
    const glass = new MeshStandardMaterial({ color: '#d6eef5', transparent: true, opacity: 0.35, roughness: 0.1, depthWrite: false });
    g.add(part(rbox(1.3, 0.05, 0.5, 0.02), frame, [0, GROUND_Y + 1.02, -0.02]));
    for (const x of [-0.6, 0.6]) g.add(part(rbox(0.04, 1.0, 0.04, 0.01), frame, [x, GROUND_Y + 0.5, -0.18]));
    g.add(part(rbox(1.2, 0.9, 0.02, 0.01), glass, [0, GROUND_Y + 0.52, -0.2]));
    g.add(part(rbox(0.9, 0.04, 0.22, 0.01), clay('#a37c54'), [0, GROUND_Y + 0.28, -0.08]));
    for (const x of [-0.38, 0.38]) g.add(part(rbox(0.04, 0.26, 0.04, 0.01), frame, [x, GROUND_Y + 0.13, -0.08]));
    // The stop's sign on its pole, with a bus on it.
    const sign = new Group();
    sign.position.set(0.95, GROUND_Y, 0.05);
    sign.add(part(disc(0.025, 1.3, 8), clay('#9aa5b1'), [0, 0.65, 0]));
    sign.add(part(disc(0.17, 0.04, 24), clay('#f2b632'), [0, 1.3, 0], [Math.PI / 2, 0, 0]));
    const bus = writing(0.26, 0.26, (c, W, H) => {
      c.fillStyle = '#2b2b2b';
      c.beginPath();
      c.roundRect(W * 0.18, H * 0.22, W * 0.64, H * 0.46, W * 0.08);
      c.fill();
      c.fillStyle = '#f2b632';
      c.fillRect(W * 0.26, H * 0.3, W * 0.48, H * 0.16);
      c.fillStyle = '#2b2b2b';
      for (const x of [0.32, 0.68]) {
        c.beginPath();
        c.arc(W * x, H * 0.72, W * 0.07, 0, Math.PI * 2);
        c.fill();
      }
    });
    bus.position.set(0, 1.3, 0.025);
    sign.add(bus);
    g.add(sign);
    plot.group.add(g);
  }

  // ---------- the people ----------

  private walker(p: TownPerson, i: number): Walker {
    const group = new Group();
    const body = new Group();
    group.add(body);
    const height = p.preset === 'baby' ? 0.62 : p.preset === 'child' ? 0.88 : 1.05;
    // A simple clay figure while (or if) their modelled one isn't there.
    body.add(part(capsule(height * 0.17, height * 0.28), clay(p.shirt), [0, height * 0.33, 0]));
    body.add(part(ball(height * 0.24, 20, 16), clay(p.skin), [0, height * 0.75, 0]));
    body.add(part(new SphereGeometry(height * 0.25, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), clay(p.hair), [0, height * 0.77, -0.01]));
    this.town.add(group);
    const zs: Sprite[] = [];
    for (let k = 0; k < 3; k++) {
      const z = new Sprite(new SpriteMaterial({ map: spriteTexture('z'), transparent: true, depthWrite: false }));
      z.visible = false;
      this.town.add(z);
      zs.push(z);
    }
    const label = new Object3D();
    this.town.add(label);
    this.anchors.set(p.key, label);
    this.townKeys.add(p.key);
    const trail = new Group();
    this.town.add(trail);
    const w: Walker = {
      state: p,
      group,
      body,
      eyes: [],
      arms: [],
      height,
      label,
      zs,
      at: '',
      route: [],
      routeS: 0,
      routeLen: 0,
      heading: 0,
      phase: i * 1.7,
      blink: 0,
      nextBlink: 1 + Math.random() * 3,
      look: 0,
      lookTarget: 0,
      nextLook: 2,
      wave: 0,
      trail,
      trailKey: '',
      drop: 0,
    };
    if (p.model) this.loadModel(p.model, w);
    return w;
  }

  /** Their modelled figure in place of the clay one, its moving parts found by name. */
  private loadModel(url: string, w: Walker) {
    new GLTFLoader().loadAsync(url).then(
      gltf => {
        const model = gltf.scene;
        const box = new Box3().setFromObject(model);
        const size = box.getSize(new Vector3());
        const k = (w.height * 1.05) / Math.max(0.001, size.y);
        model.scale.setScalar(k);
        model.position.set(-((box.min.x + box.max.x) / 2) * k, -box.min.y * k, -((box.min.z + box.max.z) / 2) * k);
        model.traverse(o => {
          const m = o as Mesh;
          if (!m.isMesh) return;
          m.castShadow = true;
          m.receiveShadow = true;
          for (const mat of Array.isArray(m.material) ? m.material : [m.material]) {
            const sm = mat as MeshStandardMaterial;
            if (sm.name !== 'headskin') sm.vertexColors = false;
            sm.needsUpdate = true;
          }
        });
        w.body.clear();
        w.body.add(model);
        w.head = model.getObjectByName('head') ?? undefined;
        w.eyes = ['eye_l', 'eye_r'].map(n => model.getObjectByName(n)).filter((o): o is Object3D => !!o);
        w.arms = ['arm_l', 'arm_r'].map(n => model.getObjectByName(n)).filter((o): o is Object3D => !!o);
        if (!this.running) this.renderOnce();
      },
      () => {
        // No modelled figure: the clay one stays.
      },
    );
  }

  // ---------- where everyone is, and the roads between ----------

  private node(a: number, b: number) {
    return a * (this.rows + 1) + b;
  }

  private nodePos(id: number) {
    return new Vector3(this.xs[Math.floor(id / (this.rows + 1))], 0, this.zs[id % (this.rows + 1)]);
  }

  /** The point a person stands at (the n-th of `count` there), and their way onto the roads. */
  private spotAt(where: string, n: number, count: number, asleep: boolean): Spot {
    const off = n - (count - 1) / 2;
    const mid = (this.cols - 1) / 2;
    if (where === 'away') {
      const c = this.cols - 1;
      const stop = (this.corner?.group.position.x ?? 0) + CW / 2 - 1.7;
      const pos = new Vector3(stop + off * 0.55, 0, this.zs[this.rows] - 0.12);
      return { pos, exit: new Vector3(pos.x, 0, this.zs[this.rows]), ends: [this.node(c, this.rows), this.node(c + 1, this.rows)], plot: this.corner };
    }
    const plot = this.placePlots.get(where);
    if (!plot) {
      // Home: on the pavement in front of the house (asleep: indoors), and from there onto the road.
      const pos = asleep ? new Vector3(0.1, 0, -0.5) : new Vector3(0.35 + off * 0.65, 0, 2.45);
      return { pos, exit: new Vector3(pos.x, 0, this.zs[2]), ends: [this.node(mid, 2), this.node(mid + 1, 2)], plot: this.home };
    }
    const d = plot.door;
    const deep = (d.z ? CD : CW) / 2 - STRIP;
    const side = new Vector3(d.z, 0, -d.x);
    const pos = plot.group.position.clone().setY(0).addScaledVector(d, deep - 0.55).addScaledVector(side, off * 0.7);
    const c = plot.cell.i + mid;
    const r = plot.cell.j + 1;
    if (d.z > 0) return { pos, exit: new Vector3(pos.x, 0, this.zs[r + 1]), ends: [this.node(c, r + 1), this.node(c + 1, r + 1)], plot };
    if (d.z < 0) return { pos, exit: new Vector3(pos.x, 0, this.zs[r]), ends: [this.node(c, r), this.node(c + 1, r)], plot };
    if (d.x > 0) return { pos, exit: new Vector3(this.xs[c + 1], 0, pos.z), ends: [this.node(c + 1, r), this.node(c + 1, r + 1)], plot };
    return { pos, exit: new Vector3(this.xs[c], 0, pos.z), ends: [this.node(c, r), this.node(c, r + 1)], plot };
  }

  /** The shortest way along the roads from one spot to another. */
  private routeBetween(a: Spot, b: Spot): Vector3[] {
    if (a.ends[0] === b.ends[0] && a.ends[1] === b.ends[1]) return [a.pos.clone(), a.exit.clone(), b.exit.clone(), b.pos.clone()];
    const N = (this.cols + 1) * (this.rows + 1);
    const A = N;
    const B = N + 1;
    const pos = (id: number) => (id === A ? a.exit : id === B ? b.exit : this.nodePos(id));
    const near = (id: number): number[] => {
      if (id === A) return [...new Set(a.ends)];
      const ai = Math.floor(id / (this.rows + 1));
      const bi = id % (this.rows + 1);
      const out: number[] = [];
      if (ai > 0) out.push(this.node(ai - 1, bi));
      if (ai < this.cols) out.push(this.node(ai + 1, bi));
      if (bi > 0) out.push(this.node(ai, bi - 1));
      if (bi < this.rows) out.push(this.node(ai, bi + 1));
      if (b.ends.includes(id)) out.push(B);
      return out;
    };
    const dist = new Array<number>(N + 2).fill(Infinity);
    const prev = new Array<number>(N + 2).fill(-1);
    const done = new Set<number>();
    dist[A] = 0;
    for (;;) {
      let u = -1;
      for (let k = 0; k < N + 2; k++) if (!done.has(k) && dist[k] < Infinity && (u < 0 || dist[k] < dist[u])) u = k;
      if (u < 0 || u === B) break;
      done.add(u);
      for (const v of near(u)) {
        const d = dist[u] + pos(u).distanceTo(pos(v));
        if (d < dist[v]) {
          dist[v] = d;
          prev[v] = u;
        }
      }
    }
    const ids: number[] = [];
    for (let u = B; u >= 0; u = prev[u]) ids.unshift(u);
    return [a.pos.clone(), ...ids.map(id => pos(id).clone()), b.pos.clone()];
  }

  /** Everyone to where they are now: walking there if they've moved, straight there the first time. */
  private place(s: TownBits, jump = false) {
    const whereOf = (p: TownPerson) => (this.placePlots.has(p.at) || p.at === 'away' ? p.at : 'home');
    const keyOf = (p: TownPerson) => (whereOf(p) === 'home' && p.asleep ? 'home-asleep' : whereOf(p));
    const groups = new Map<string, TownPerson[]>();
    for (const p of s.people) groups.set(keyOf(p), [...(groups.get(keyOf(p)) ?? []), p]);
    for (const w of this.walkers) {
      const p = s.people.find(x => x.key === w.state.key) ?? w.state;
      w.state = p;
      const where = whereOf(p);
      const list = groups.get(keyOf(p)) ?? [p];
      const spot = this.spotAt(where, Math.max(0, list.indexOf(p)), list.length, where === 'home' && p.asleep);
      if (jump || !w.spot || !this.motionOn()) {
        w.group.position.copy(spot.pos);
        w.route = [];
        w.heading = 0;
      } else if (where !== w.at || spot.pos.distanceTo(w.spot.pos) > 0.05) {
        w.route = this.routeBetween({ ...w.spot, pos: w.group.position.clone().setY(0) }, spot);
        w.routeLen = 0;
        for (let k = 1; k < w.route.length; k++) w.routeLen += w.route[k].distanceTo(w.route[k - 1]);
        w.routeS = 0;
      }
      w.at = where;
      w.spot = spot;
      this.setTrail(w);
    }
  }

  /** A dotted trail in their colour from where they are to where they go next, a pin bobbing there. */
  private setTrail(w: Walker) {
    const n = w.state.next;
    const key = n && this.placePlots.has(n) && n !== w.at ? `${w.at}>${n}` : '';
    if (key === w.trailKey) return;
    w.trailKey = key;
    w.trail.clear();
    if (!key || !n || !w.spot) return;
    const end = this.spotAt(n, 0, 1, false);
    const route = this.routeBetween(w.spot, end);
    // Each person's trail in a lane of its own, so two along the same road don't overlap.
    const lane = ((this.walkers.indexOf(w) % 4) - 1.5) * 0.1;
    for (let k = 1; k < route.length - 1; k++) route[k].add(new Vector3(lane, 0, lane));
    const mat = own(w.state.colour, { emissive: w.state.colour, emissiveIntensity: 0.5, roughness: 0.5 });
    const geo = new SphereGeometry(0.05, 10, 8);
    let next = 0.5;
    let walked = 0;
    for (let k = 1; k < route.length; k++) {
      const a = route[k - 1];
      const b = route[k];
      const len = a.distanceTo(b);
      while (next <= walked + len) {
        const dot = new Mesh(geo, mat);
        dot.position.copy(a).lerp(b, len > 0 ? (next - walked) / len : 0).setY(0.06);
        dot.userData.s = w.trail.children.length;
        w.trail.add(dot);
        next += 0.32;
      }
      walked += len;
    }
    const pin = new Group();
    pin.position.copy(end.pos).setY(0.9);
    pin.userData.pin = true;
    pin.add(part(new ConeGeometry(0.11, 0.28, 16), mat, [0, 0.14, 0], [Math.PI, 0, 0]));
    pin.add(part(ball(0.14, 16, 12), mat, [0, 0.35, 0]));
    pin.add(part(ball(0.055, 10, 8), clay('#ffffff'), [0, 0.37, 0.11]));
    w.trail.add(pin);
  }

  // ---------- camera ----------

  /** From the house view's picture to the whole town as the plots come up; on a phone, from higher up. */
  protected override layout() {
    const portrait = this.width / Math.max(1, this.height) < 0.8;
    const e = this.openEase();
    this.framing.center.lerpVectors(this.homeFrame.center, this.townFrame.center, e);
    this.framing.radius = MathUtils.lerp(this.homeFrame.radius, this.townFrame.radius * (portrait ? 0.8 : 1), e);
    this.elevation = MathUtils.lerp(27, portrait ? 58 : 38, e);
    // Rain and snow over the whole town; shadows reaching as far as it does; with just the house, as the
    // house view has them.
    const spread = MathUtils.lerp(1, 2.6, e);
    this.rain.scale.set(spread, 1, spread);
    this.snow.scale.set(spread, 1, spread);
    const r = MathUtils.lerp(9, this.reach, e);
    const sc = this.sun.shadow.camera;
    sc.left = sc.bottom = -r;
    sc.right = sc.top = r;
    sc.far = MathUtils.lerp(60, 120, e);
    sc.updateProjectionMatrix();
    this.sunDistance = MathUtils.lerp(25, 60, e);
    super.layout();
  }

  private openEase() {
    if (this.opening < 0 || !this.houseReady) return 0;
    return smooth(MathUtils.clamp((this.opening - 0.2) / 1.9, 0, 1));
  }

  // ---------- focus ----------

  override focus(key: string | null, side: 'right' | 'bottom' | 'centre' = 'right') {
    const w = this.walkers.find(x => x.state.key === key);
    if (!w) return super.focus(key, side);
    this.town.localToWorld(this.focusPoint.copy(w.group.position).setY(w.height * 0.6));
    this.focusOn = true;
    this.focusSide = side;
    w.wave = 2.4;
    if (!this.running) this.animateFor(1.2);
  }

  // ---------- motion ----------

  protected override animate(dt: number, t: number, motion: boolean) {
    if (!this.houseReady || !this.townState) return;
    const n = this.eased.night;
    // The opening: the plots rise round the house, the people drop in, then their trails show. Closing,
    // the same backwards and quicker: the people go first.
    if (!this.shown && !this.closing) this.opening = 0;
    else if (!this.motionOn() && !this.closing) this.opening = 1e6;
    if (this.closing) {
      this.opening = Math.min(this.opening, this.openEnd) - dt * 1.6;
      if (this.opening <= 0 || !this.motionOn()) {
        this.opening = 0;
        const done = this.closing;
        this.closing = undefined;
        done();
      }
    } else if (this.shown && this.opening >= 0 && this.opening < this.openEnd + 1) this.opening += dt;
    // The camera follows the opening (and settles once it is over).
    if (this.openEase() !== this.framedAt) {
      this.framedAt = this.openEase();
      this.layout();
    }
    const T = this.opening;
    for (const plot of this.plots) {
      const p = T < 0 ? 0 : MathUtils.clamp((T - plot.delay) / 0.75, 0, 1);
      plot.p = p;
      plot.group.visible = p > 0;
      if (plot === this.home) {
        // The road round the house doesn't rise: it slides out from under the island, and back under it.
        const k = MathUtils.lerp(0.82, 1, smooth(p));
        plot.group.scale.set(k, 1, k);
        for (const c of plot.group.children) if (c.userData.lamp) c.visible = p >= 1;
        for (const a of plot.anchors) a.userData.hidden = p < 1;
        continue;
      }
      plot.group.position.y = p >= 1 ? 0 : -4.5 * (1 - easeOutBack(p));
      plot.group.rotation.z = p >= 1 || plot === this.home ? 0 : (1 - p) * 0.25 * Math.sign(plot.cell.i || 1);
      for (const a of plot.anchors) a.userData.hidden = p < 1;
    }
    for (const w of this.walkers) {
      const landed = !this.closing && T >= 0 && (!w.spot?.plot || w.spot.plot.p >= 1);
      if (landed && !w.drop) w.drop = Math.max(T, 0.001);
      if (!landed) w.drop = 0;
      const q = !this.motionOn() ? 1 : w.drop ? MathUtils.clamp((T - w.drop) / 0.45, 0, 1) : 0;
      w.group.visible = q > 0;
      w.group.position.y = q < 1 ? (1 - easeOutBack(q)) * 2.2 : 0;
      w.label.userData.hidden = q < 1;
      w.trail.visible = !this.closing && T >= this.openEnd;
    }

    this.windows.emissiveIntensity = MathUtils.clamp((n - 0.15) * 2.2, 0, 1.6);
    this.bulbs.emissiveIntensity = MathUtils.clamp((n - 0.2) * 3, 0, 2.2);
    for (const g of this.lampGlows) (g.material as SpriteMaterial).opacity = MathUtils.clamp((n - 0.25) * 1.4, 0, 0.9);
    if (motion) for (const m of this.motions) m(t, dt);

    for (const w of this.walkers) {
      let walking = false;
      if (w.route.length > 1 && motion) {
        w.routeS = Math.min(w.routeLen, w.routeS + dt * WALK_SPEED);
        let d = w.routeS;
        for (let k = 1; k < w.route.length; k++) {
          const a = w.route[k - 1];
          const b = w.route[k];
          const len = a.distanceTo(b);
          if (d <= len || k === w.route.length - 1) {
            const f = len > 0 ? Math.min(1, d / len) : 1;
            const y = w.group.position.y;
            w.group.position.copy(a).lerp(b, f).setY(y);
            if (len > 0.01) w.heading = Math.atan2(b.x - a.x, b.z - a.z);
            break;
          }
          d -= len;
        }
        walking = w.routeS < w.routeLen;
        if (!walking) w.route = [];
      }
      const asleep = w.state.asleep;
      const indoors = asleep && w.at === 'home';
      w.body.visible = !indoors;
      // Facing where they walk; standing, turned towards us.
      const want = walking ? w.heading : MathUtils.degToRad(34) * 0.6;
      const diff = MathUtils.euclideanModulo(want - w.group.rotation.y + Math.PI, Math.PI * 2) - Math.PI;
      w.group.rotation.y += diff * (motion ? 1 - Math.exp(-dt * 8) : 1);
      w.body.position.y = walking ? Math.abs(Math.sin(t * 10 + w.phase)) * 0.05 : 0;
      w.body.rotation.z = walking ? Math.sin(t * 10 + w.phase) * 0.05 : Math.sin(t * 0.5 + w.phase) * 0.02;
      // Arms swing walking, wave when tapped.
      if (motion) w.wave = Math.max(0, w.wave - dt);
      const lift = MathUtils.smoothstep(w.wave, 0, 0.35) * (w.wave > 0 ? 1 : 0);
      w.arms.forEach((a, k) => {
        const side = k === 0 ? 1 : -1;
        a.rotation.x = walking ? Math.sin(t * 10 + w.phase + k * Math.PI) * 0.5 : 0;
        a.rotation.z = k === 0 ? side * (MathUtils.lerp(0, 2.5, lift) + (lift ? Math.sin(t * 9) * 0.3 : 0)) : 0;
      });
      // Head looks about; eyes blink, shut when asleep.
      if (motion) {
        w.nextLook -= dt;
        if (w.nextLook <= 0) {
          w.lookTarget = (Math.random() - 0.5) * 0.9;
          w.nextLook = 2 + Math.random() * 4;
        }
        w.nextBlink -= dt;
        if (w.nextBlink <= 0) {
          w.blink = 0.13;
          w.nextBlink = 2.5 + Math.random() * 4;
        }
        w.blink = Math.max(0, w.blink - dt);
      }
      w.look += (w.lookTarget - w.look) * (1 - Math.exp(-dt * 3));
      if (w.head) w.head.rotation.y = asleep ? 0 : w.look;
      for (const e of w.eyes) e.scale.y = asleep || w.blink > 0 ? 0.12 : 1;
      // Asleep: z's (from the bedroom window when indoors).
      w.zs.forEach((z, j) => {
        z.visible = asleep && w.group.visible;
        const a = (t * 0.35 + j / 3 + w.phase) % 1;
        const base = indoors ? new Vector3(-0.35, 1.45, 0.25) : w.group.position.clone().add(new Vector3(0.15, w.height, 0));
        z.position.set(base.x + a * 0.3, base.y + a * 0.7, base.z);
        z.scale.setScalar(0.16 + a * 0.2);
        (z.material as SpriteMaterial).opacity = Math.sin(a * Math.PI) * 0.9;
      });
      // Their name floats over them (over the house when they're asleep inside).
      if (indoors) w.label.position.set(0.3, 3.0, -0.4);
      else w.label.position.copy(w.group.position).setY(w.height + 0.6);
      // The trail: dots pulse in turn, running towards where they go; the pin bobs and turns.
      w.trail.children.forEach(d => {
        if (d.userData.pin) {
          d.position.y = 0.9 + Math.sin(t * 2.2 + w.phase) * 0.08;
          d.rotation.y = t * 1.2;
          return;
        }
        const k = d.userData.s as number;
        d.scale.setScalar(0.75 + 0.45 * Math.max(0, Math.sin(k * 0.6 - t * 4)));
      });
    }
  }
}
