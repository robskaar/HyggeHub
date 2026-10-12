// The people view: each person as a cartoon figurine (big head, big eyes, a smile of their own) on a
// small square diorama dressed with what they love: a kitchen and gadgets, a garden and a cosy corner,
// bugs and nature, diggers in a sandbox. It starts as a card per person with a portrait close on their
// face; opening one pulls the camera back to show them on their island. Who is away shows as a
// hologram; asleep: eyes shut and z's.
import {
  AdditiveBlending,
  AlwaysStencilFunc,
  EqualStencilFunc,
  KeepStencilOp,
  ReplaceStencilOp,
  Scene,
  Vector4,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  ConeGeometry,
  CylinderGeometry,
  AnimationMixer,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  OctahedronGeometry,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  DirectionalLight,
  HemisphereLight,
  WebGLRenderTarget,
  ShaderMaterial,
  PlaneGeometry,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Box3,
  Vector3,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { armParts, BODY, bodyParts, CHARMANDER_EYES, charmanderGeometry, headParts, MEWTWO_EYES, mewtwoGeometry, mix, type Piece } from './figures';
import type { V3 } from './sculpt';
import { ball, capsule, ClayStage, clay, disc, mergeStatic, part, rbox, type StageLook } from './stage';

export type Preset = 'woman' | 'man' | 'child' | 'baby';

/** What a person loves; each brings props to their diorama and sometimes something they hold or wear. */
export type Interest = 'cooking' | 'tech' | 'gardening' | 'decor' | 'bugs' | 'pokemon' | 'nature' | 'cars';

export interface FigureState {
  key: string;
  preset: Preset;
  hair: string;
  hairStyle: 'buzz' | 'short' | 'long' | 'bald';
  beard?: 'short' | 'full';
  skin: string;
  shirt: string;
  /** Iris rim and the colour near the pupil (hazel: green rim, brown centre). */
  eyes: string;
  eyesInner: string;
  interests: Interest[];
  /** A sculpted GLB to show instead of the built figure (its "idle" animation plays if it has one). */
  model?: string;
  /** Their name, lower case, for finding their modelled figure (people/<name>.glb beside the bundle). */
  name?: string;
  home: boolean;
  asleep: boolean;
}

export interface PeopleState extends StageLook {
  people: FigureState[];
  /**
   * Where each person's card is on the canvas, in CSS pixels from its top left: the scene draws their
   * portrait into it. Measured by the card each frame, so it follows its layout.
   */
  cells?: () => Array<{ x: number; y: number; w: number; h: number } | undefined>;
}

interface Arm {
  shoulder: Group;
  elbow: Group;
  hand: Group;
  side: number;
}

interface Figure {
  state: FigureState;
  /** Their place in the family, and so their card. */
  index: number;
  /** The whole diorama: base, props, figure. */
  stand: Group;
  figure: Group;
  body: Group;
  head: Group;
  chest: Object3D;
  eyes: Group[];
  arms: Arm[];
  own: MeshStandardMaterial[];
  zs: Sprite[];
  /** The glowing disc a hologram stands on, shown while they're away. */
  pad: Object3D;
  holo: boolean;
  phase: number;
  nextBlink: number;
  blink: number;
  look: number;
  lookTarget: number;
  nextLook: number;
  wave: number;
  // Little things that move on the diorama.
  spin: Object3D[];
  flap: Object3D[];
  hover: Object3D[];
  steam: Sprite[];
  mixer?: AnimationMixer;
  /** A modelled figure's eyes (squashed to blink) and the point of its face (for the portrait). */
  modelEyes?: Object3D[];
  modelled?: boolean;
  /** A modelled figure's head radius, for framing its portrait. */
  modelR?: number;
  faceAt?: Object3D;
}



/** How long stepping through a card into someone's room takes, in seconds (the card's CSS matches). */
export const PORTAL_S = 1.25;


type Rect = { x: number; y: number; w: number; h: number };
const clipRect = (a: Rect, b: Rect): Rect => {
  const x = Math.max(a.x, b.x);
  const y = Math.max(a.y, b.y);
  return { x, y, w: Math.max(1, Math.min(a.x + a.w, b.x + b.w) - x), h: Math.max(1, Math.min(a.y + a.h, b.y + b.h) - y) };
};

/** A rounded rectangle on the screen, in device pixels from the bottom left. */
const ROUNDED = `
  uniform vec4 uRect;
  uniform float uR;
  float rounded(vec2 p) {
    vec2 c = uRect.xy + uRect.zw * 0.5;
    vec2 q = abs(p - c) - uRect.zw * 0.5 + uR;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uR;
  }`;
const SCREEN = `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`;

/** Marks a card's rounded shape in the stencil buffer; the person is then drawn only inside it. */
const holoMask = new ShaderMaterial({
  uniforms: { uRect: { value: new Vector4() }, uR: { value: 0 } },
  vertexShader: SCREEN,
  fragmentShader: `${ROUNDED}
    void main() {
      if (rounded(gl_FragCoord.xy) > 0.0) discard;
      gl_FragColor = vec4(0.0);
    }`,
  colorWrite: false,
  depthWrite: false,
  depthTest: false,
  stencilWrite: true,
  stencilRef: 1,
  stencilFunc: AlwaysStencilFunc,
  stencilZPass: ReplaceStencilOp,
});

const screenScene = (m: ShaderMaterial) => {
  const s = new Scene();
  const q = new Mesh(new PlaneGeometry(2, 2), m);
  q.frustumCulled = false;
  s.add(q);
  return s;
};
const maskScene = screenScene(holoMask);

/** Draw `root` only where the stencil is marked (or everywhere again). */
function stencil(root: Object3D, on: boolean) {
  root.traverse(o => {
    const mats = (o as Mesh).material;
    if (!mats) return;
    for (const m of Array.isArray(mats) ? mats : [mats]) {
      m.stencilWrite = on;
      m.stencilRef = 1;
      m.stencilFunc = on ? EqualStencilFunc : AlwaysStencilFunc;
      m.stencilZPass = KeepStencilOp;
    }
  });
}

/**
 * Someone who is away shows as a hologram of themselves: see-through blue light, brighter at the edges,
 * with scan lines drifting up it and a flicker. Additive, so overlapping parts simply glow brighter.
 */
const holoUniforms = { uTime: { value: 0 }, uColor: { value: new Color('#5ad6ff') } };
const hologram = new ShaderMaterial({
  uniforms: holoUniforms,
  vertexShader: `
    varying vec3 vN;
    varying vec3 vV;
    varying float vY;
    void main() {
      vec4 wp = modelMatrix * vec4(position, 1.0);
      vY = wp.y;
      vec4 mv = viewMatrix * wp;
      vV = -mv.xyz;
      vN = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec3 vN;
    varying vec3 vV;
    varying float vY;
    void main() {
      float rim = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 1.7);
      float scan = smoothstep(0.35, 0.5, fract(vY * 46.0 - uTime * 1.2)) * 0.22;
      float sweep = exp(-pow((fract(vY * 0.55 - uTime * 0.35) - 0.5) * 9.0, 2.0)) * 0.55;
      float flicker = 0.88 + 0.12 * sin(uTime * 31.0) * sin(uTime * 7.3);
      gl_FragColor = vec4(uColor * (0.12 + rim * 1.15 + scan + sweep) * flicker, 1.0);
    }`,
  transparent: true,
  blending: AdditiveBlending,
  depthWrite: false,
});

/** A soft round sprite (steam) or a "z" (sleep), drawn once each. */
const sprites = new Map<string, CanvasTexture>();
function spriteTexture(kind: 'z' | 'puff') {
  let tex = sprites.get(kind);
  if (!tex) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    if (kind === 'z') {
      g.font = 'bold 48px system-ui, sans-serif';
      g.fillStyle = '#ffffff';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('z', 32, 34);
    } else {
      const grad = g.createRadialGradient(32, 32, 2, 32, 32, 30);
      grad.addColorStop(0, 'rgba(255,255,255,0.9)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, 64, 64);
    }
    tex = new CanvasTexture(c);
    sprites.set(kind, tex);
  }
  return tex;
}

/** Part of a sphere: theta from the top (0) down, phi around (front is phi = π/2). */
const cap = (r: number, thetaLength: number, thetaStart = 0, phiStart = 0, phiLength = Math.PI * 2) => new SphereGeometry(r, 28, 16, phiStart, phiLength, thetaStart, thetaLength);
const cyl = (r: number, h: number, seg = 20, rb = r) => new CylinderGeometry(r, rb, h, seg);
/** Which ground a diorama gets, from the person's first interest. */
const GROUND: Record<Interest, { top: string; edge: string; kind: 'wood' | 'grass' | 'sand' }> = {
  cooking: { top: '#c49a6c', edge: '#8a6446', kind: 'wood' },
  tech: { top: '#c49a6c', edge: '#8a6446', kind: 'wood' },
  gardening: { top: '#8dbb67', edge: '#b88a63', kind: 'grass' },
  decor: { top: '#8dbb67', edge: '#b88a63', kind: 'grass' },
  bugs: { top: '#8dbb67', edge: '#b88a63', kind: 'grass' },
  pokemon: { top: '#8dbb67', edge: '#b88a63', kind: 'grass' },
  nature: { top: '#8dbb67', edge: '#b88a63', kind: 'grass' },
  cars: { top: '#e8d3a2', edge: '#b88a63', kind: 'sand' },
};

const SLOTS: Array<[number, number]> = [
  [-0.66, -0.52],
  [0.66, -0.52],
  [-0.72, 0.5],
  [0.72, 0.5],
];

export class PeopleScene extends ClayStage {
  private figures: Figure[] = [];
  private signature = '';
  private state?: PeopleState;
  private screens = clay('#3b6fb8', { emissive: '#7fb2ff', emissiveIntensity: 0.6, roughness: 0.3 });
  /** The person opened from their card, and how far the zoom from their face out to their island is. */
  private openKey: string | null = null;
  private openTarget = 0;
  private openT = 0;
  private readonly cam = new PerspectiveCamera(24, 1, 0.1, 100);

  protected override allowYaw = false;

  setState(s: PeopleState) {
    this.state = s;
    const sig = s.people.map(p => [p.key, p.preset, p.hair, p.hairStyle, p.beard, p.skin, p.shirt, p.eyes, p.interests.join('+'), p.model, p.name].join('|')).join(';');
    if (sig !== this.signature) {
      this.signature = sig;
      this.build(s.people);
    }
    this.figures.forEach(f => {
      const p = s.people[f.index];
      f.state = p;
      this.setHologram(f, !p.home);
      f.zs.forEach(z => (z.visible = p.asleep));
    });
    this.setLook(s);
  }

  /** Away: swap every part of the figure for hologram light (and back when they're home). */
  private setHologram(f: Figure, on: boolean) {
    if (f.holo === on) return;
    f.holo = on;
    f.figure.traverse(o => {
      const m = o as Mesh;
      if (!m.isMesh) return;
      if (on) {
        m.userData.orig ??= m.material;
        m.material = hologram;
        m.castShadow = false;
      } else if (m.userData.orig) {
        m.material = m.userData.orig;
        m.castShadow = true;
      }
    });
    f.pad.visible = on;
  }

  /**
   * Open a person from their card: their part of the canvas grows to fill it while the camera pulls back
   * from their face to show them standing on their island; null goes back to the cards.
   */
  override focus(key: string | null) {
    if (key) this.openKey = key;
    this.openTarget = key ? 1 : 0;
    const f = this.figures.find(x => x.state.key === key);
    if (f) f.wave = 2.6;
    if (!this.look.motion) this.openT = this.openTarget;
    this.animateFor(PORTAL_S + 0.3);
  }

  private building = 0;
  private modelUrls = new Map<string, string | undefined>();

  /**
   * One person at a time, a moment apart: sculpting a figure takes a fraction of a second, and this way
   * the page stays responsive and the portraits appear one after another.
   */
  private build(people: FigureState[]) {
    const run = ++this.building;
    this.root.clear();
    this.anchors.clear();
    this.figures = [];
    // Who has a modelled figure (people/<name>.glb beside the bundle, or their own model): they get only
    // that; anyone else gets a sculpted figurine.
    const here = import.meta.url;
    const urls = people.map(p => p.model ?? (p.name ? new URL('people/' + p.name + '.glb', here).href : undefined));
    void Promise.all(urls.map(u => (u ? fetch(u, { method: 'HEAD' }).then(r => (r.ok ? u : undefined), () => undefined) : Promise.resolve(undefined)))).then(found =>
      people.forEach((p, index) =>
        setTimeout(() => {
          if (run !== this.building) return;
          this.modelUrls.set(p.key, found[index]);
          this.add(this.state?.people[index] ?? p, index);
          if (!this.look.motion) this.renderOnce();
        }, index * 30),
      ),
    );
  }

  private add(p: FigureState, index: number) {
    const stand = new Group();
    const f = this.diorama(p, stand);
    f.index = index;
    // Hundreds of little clay parts become a few dozen meshes: one per material per moving group.
    f.chest.userData.keep = true;
    f.spin.forEach(r => (r.userData.keep = true));
    mergeStatic(stand);
    // Each stands at the centre of its own picture; only one is drawn at a time.
    stand.visible = false;
    this.root.add(stand);
    this.figures.push(f);
    f.holo = false;
    this.setState(this.state!);
  }

  /**
   * Every person into their own card, the cards tiling the view like windows in a wall. Opening one is
   * walking through it: one camera, which starts where that card's window fills exactly its card, moves
   * forward through the window into the room. The window grows by perspective as the camera nears it,
   * faster and faster, the room behind it opens up more slowly (it is further away), and the other
   * windows in the same wall slide away past the edges. Closing walks back out. Each picture is cut to
   * its window (a mask in the stencil buffer).
   */
  protected override draw() {
    const r = this.renderer;
    const W = this.width;
    const H = this.height;
    const pr = r.getPixelRatio();
    const cells = this.state?.cells?.() ?? [];
    const t = this.openT;
    const e = t * t * (3 - 2 * t);
    r.autoClear = false;
    r.setScissorTest(false);
    r.setViewport(0, 0, W, H);
    r.clear(true, true, true);
    const full = { x: 0, y: 0, w: W, h: H };
    const open = this.figures.find(f => f.state.key === this.openKey);
    const openCell = open ? cells[open.index] : undefined;
    // Where the walk is: the opened card's camera, part way through its window.
    const walk = open && openCell && e > 0 ? this.portalCam(open, openCell, e) : undefined;
    const draw = (f: Figure, mask: Rect | null) => {
      r.setScissorTest(false);
      r.clear(false, true, true);
      if (mask) {
        holoMask.uniforms.uRect.value.set(mask.x * pr, (H - mask.y - mask.h) * pr, mask.w * pr, mask.h * pr);
        holoMask.uniforms.uR.value = 0;
        r.render(maskScene, this.cam);
        stencil(f.stand, true);
        const b = clipRect(mask, full);
        r.setScissorTest(true);
        r.setScissor(b.x, H - b.y - b.h, b.w, b.h);
      }
      for (const g of this.figures) g.stand.visible = g === f;
      r.render(this.scene, this.cam);
      if (mask) stencil(f.stand, false);
      r.setScissorTest(false);
    };
    for (const f of this.figures) {
      if (f === open && walk) continue;
      const cell = cells[f.index];
      if (!cell || cell.w < 2 || cell.h < 2) continue;
      // The other windows, seen from where the camera has walked to.
      const rect = walk ? walk.see(cell) : cell;
      if (!rect || rect.x >= W || rect.y >= H || rect.x + rect.w <= 0 || rect.y + rect.h <= 0) continue;
      this.portalCam(f, rect, 0);
      draw(f, rect);
    }
    if (open && openCell && walk) {
      this.portalCam(open, openCell, e);
      draw(open, walk.window());
    }
    for (const g of this.figures) g.stand.visible = false;
    r.setViewport(0, 0, W, H);
  }

  /**
   * The camera for one person's card `cell`, `u` of the way through its window (0: outside, the window
   * filling the card exactly and their face in it; 1: inside the room). Returns how to see the window
   * and the wall it is in from there.
   */
  private portalCam(f: Figure, cell: Rect, u: number) {
    const W = this.width;
    const H = this.height;
    const baby = f.state.preset === 'baby';
    const R = f.modelR ?? (baby ? 0.3 : BODY[f.state.preset as Exclude<Preset, 'baby'>].headR);
    const face = new Vector3();
    (f.faceAt ?? f.head).getWorldPosition(face);
    face.y -= R * 0.55;
    // The window stands in front of the room; outside it, the camera looks straight at it.
    const zw = 2.0;
    const D = 2.6;
    const far = D + zw - face.z;
    const f0 = Math.min((cell.h * far) / (R * 4.6), (cell.w * far) / (R * 3.4));
    const sway = Math.sin(this.time * 0.3 + f.phase) * 0.05 * (1 - u);
    const c0 = new Vector3(face.x + sway, face.y + 0.04, zw + D);
    const pp0x = cell.x + cell.w / 2;
    const pp0y = cell.y + cell.h / 2;
    // Inside: just within the room's front, the whole room round them, the room a little above the
    // chips along the bottom.
    const c1 = new Vector3(0.1, baby ? 1.05 : 1.25, 1.65);
    const f1 = H / 2 / Math.tan(MathUtils.degToRad(34));
    const aim = new Vector3(0, baby ? 0.62 : 0.8, -0.5);
    const d1 = c1.z - aim.z;
    const pp1x = W / 2 - (f1 * (aim.x - c1.x)) / d1;
    const pp1y = H * 0.44 + (f1 * (aim.y - c1.y)) / d1;
    const cam = c0.clone().lerp(c1, u);
    const fl = Math.exp(MathUtils.lerp(Math.log(f0), Math.log(f1), u));
    const ppx = MathUtils.lerp(pp0x, pp1x, u);
    const ppy = MathUtils.lerp(pp0y, pp1y, u);
    const c = this.cam;
    c.position.copy(cam);
    c.quaternion.identity();
    c.aspect = W / H;
    c.fov = MathUtils.radToDeg(2 * Math.atan(H / 2 / fl));
    c.setViewOffset(W, H, W / 2 - ppx, H / 2 - ppy, W, H);
    c.near = 0.05;
    c.far = 40;
    c.updateProjectionMatrix();
    // A point of the wall (where it showed on the screen from outside) as seen from here now.
    const dz = cam.z - zw;
    const wall = (sx: number, sy: number): [number, number] => {
      const X = c0.x + ((sx - pp0x) * D) / f0;
      const Y = c0.y - ((sy - pp0y) * D) / f0;
      return [ppx + (fl * (X - cam.x)) / dz, ppy - (fl * (Y - cam.y)) / dz];
    };
    const see = (rect: Rect): Rect | null => {
      if (dz < 0.03) return null;
      const [x0, y0] = wall(rect.x, rect.y);
      const [x1, y1] = wall(rect.x + rect.w, rect.y + rect.h);
      return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    };
    return { see, window: () => see(cell) };
  }

  // ---------- the diorama ----------

  private diorama(p: FigureState, stand: Group): Figure {
    const ground = GROUND[p.interests[0] ?? 'nature'];
    // Their ground (boards, grass, sand) as a raised patch on the room's floor.
    stand.add(part(rbox(2.24, 0.06, 2.24, 0.03), clay(ground.edge), [0, 0.0, 0]));
    stand.add(part(rbox(2.2, 0.08, 2.2, 0.04), clay(ground.top), [0, 0.02, 0]));
    if (ground.kind === 'wood') for (let i = -3; i <= 3; i++) stand.add(part(rbox(0.012, 0.081, 2.18, 0.004), clay('#a37c54'), [i * 0.3, 0.02, 0]));
    if (ground.kind === 'grass') for (let i = 0; i < 18; i++) stand.add(part(new ConeGeometry(0.025, 0.12, 5), clay(i % 2 ? '#6fa35e' : '#7fae5f'), [Math.sin(i * 7.3) * 0.95, 0.11, Math.cos(i * 3.1) * 0.95], [0.2 * Math.sin(i), 0, 0.2 * Math.cos(i)]));
    if (ground.kind === 'sand') {
      for (const s of [-1, 1]) {
        stand.add(part(rbox(2.24, 0.14, 0.1, 0.03), clay('#c49a6c'), [0, 0.1, s * 1.08]));
        stand.add(part(rbox(0.1, 0.14, 2.24, 0.03), clay('#c49a6c'), [s * 1.08, 0.1, 0]));
      }
    }

    this.room(p, stand);
    const f = this.figure(p);
    f.stand = stand;
    f.figure.position.set(0, 0.06, -0.02);
    stand.add(f.figure);
    stand.add(f.pad);
    const url = this.modelUrls.get(p.key);
    if (url) this.loadModel(url, f);

    // Props for each interest, two slots each where there is room.
    const slots = [...SLOTS];
    const take = () => slots.shift();
    for (const interest of p.interests.slice(0, 3)) this.props(interest, stand, f, take);
    this.furnish(p, stand, f);
    return f;
  }

  /**
   * The room round the diorama, open at the front like a doll's house: a back wall, two side walls and a
   * ceiling, dressed for what they love. A kitchen with tiles, a shelf of jars and a pendant lamp; a
   * greenhouse of windows and hanging plants; a child's room with bunting and posters; a nursery with a
   * hazard stripe and a digger mobile. The shell doesn't cast shadows, so the sun still lights the floor.
   */
  private room(p: FigureState, g: Group) {
    const first = p.interests[0] ?? 'nature';
    const kind = first === 'cooking' || first === 'tech' ? 'kitchen' : first === 'gardening' || first === 'decor' ? 'greenhouse' : first === 'cars' ? 'site' : 'kids';
    const wall = { kitchen: '#efe2cf', greenhouse: '#dfe9d6', kids: '#d6e6f5', site: '#f6ecc8' }[kind];
    const trimC = { kitchen: '#c49a6c', greenhouse: '#9a7556', kids: '#f4f1ea', site: '#e0a020' }[kind];
    const shell = new Group();
    shell.add(part(rbox(2.36, 2.3, 0.1, 0.03), clay(wall), [0, 1.17, -1.13]));
    for (const s of [-1, 1]) shell.add(part(rbox(0.1, 2.3, 2.36, 0.03), clay(wall), [s * 1.13, 1.17, 0]));
    shell.add(part(rbox(2.36, 0.1, 2.36, 0.03), clay(mix(wall, '#ffffff', 0.4)), [0, 2.35, 0]));
    // ...and on past the front a little, so standing just inside it the room is all round.
    for (const s of [-1, 1]) shell.add(part(rbox(0.1, 2.3, 0.8, 0.03), clay(wall), [s * 1.13, 1.17, 1.55]));
    shell.add(part(rbox(2.36, 0.1, 0.8, 0.03), clay(mix(wall, '#ffffff', 0.4)), [0, 2.35, 1.55]));
    // Skirting along the bottom of the walls, a moulding along the top.
    shell.add(part(rbox(2.2, 0.1, 0.03, 0.01), clay(trimC), [0, 0.11, -1.07]));
    shell.add(part(rbox(2.2, 0.05, 0.03, 0.01), clay(trimC), [0, 2.27, -1.07]));
    for (const s of [-1, 1]) {
      shell.add(part(rbox(0.03, 0.1, 2.2, 0.01), clay(trimC), [s * 1.07, 0.11, 0]));
      shell.add(part(rbox(0.03, 0.05, 2.2, 0.01), clay(trimC), [s * 1.07, 2.27, 0]));
    }
    const sky = clay('#bfe3f7', { emissive: '#bfe3f7', emissiveIntensity: 0.55, roughness: 0.2 });
    const addWindow = (x: number, y: number, w: number, h: number, z = -1.075, side = 0) => {
      const win = new Group();
      if (side) {
        win.position.set(side * 1.075, y, x);
        win.rotation.y = -side * (Math.PI / 2);
      } else win.position.set(x, y, z);
      win.add(part(rbox(w + 0.08, h + 0.08, 0.04, 0.015), clay('#f4f1ea'), [0, 0, 0]));
      win.add(part(rbox(w, h, 0.02, 0.005), sky, [0, 0, 0.015]));
      win.add(part(rbox(0.025, h, 0.03, 0.005), clay('#f4f1ea'), [0, 0, 0.02]));
      win.add(part(rbox(w, 0.025, 0.03, 0.005), clay('#f4f1ea'), [0, 0, 0.02]));
      win.add(part(rbox(w + 0.16, 0.04, 0.1, 0.01), clay('#f4f1ea'), [0, -h / 2 - 0.05, 0.04]));
      shell.add(win);
    };
    const frame = (x: number, y: number, w: number, h: number, colour: string, side: number) => {
      const f = new Group();
      f.position.set(side * 1.075, y, x);
      f.rotation.y = -side * (Math.PI / 2);
      f.add(part(rbox(w + 0.06, h + 0.06, 0.03, 0.01), clay('#6b4f3a'), [0, 0, 0]));
      f.add(part(rbox(w, h, 0.02, 0.005), clay(colour), [0, 0, 0.012]));
      shell.add(f);
      return f;
    };
    const lamp = (x: number, z: number, glow: string) => {
      shell.add(part(cyl(0.008, 0.35, 6), clay('#33373b'), [x, 2.12, z]));
      shell.add(part(cyl(0.05, 0.16, 20, 0.2), clay(trimC), [x, 1.9, z]));
      const bulb = clay(glow, { emissive: glow, emissiveIntensity: 1.2, roughness: 0.3 });
      bulb.userData.lamp = true;
      shell.add(part(ball(0.06, 12, 10), bulb, [x, 1.83, z]));
    };
    switch (kind) {
      case 'kitchen': {
        addWindow(0.35, 1.4, 0.7, 0.55);
        // Tiles behind the stove, a shelf of jars, a clock and a picture.
        for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) shell.add(part(rbox(0.11, 0.11, 0.02, 0.01), clay((i + j) % 2 ? '#f4f1ea' : '#7fa7c9'), [-0.92 + i * 0.12, 0.7 + j * 0.12, -1.07]));
        shell.add(part(rbox(0.6, 0.04, 0.16, 0.01), clay('#9a7556'), [-0.55, 1.45, -1.0]));
        ['#e86a5a', '#f2cf5a', '#5fa8b8', '#8dbb67'].forEach((c, i) => {
          shell.add(part(cyl(0.05, 0.12, 14), clay('#e9f1f4', { roughness: 0.2 }), [-0.78 + i * 0.15, 1.53, -1.0]));
          shell.add(part(cyl(0.045, 0.07, 14), clay(c), [-0.78 + i * 0.15, 1.51, -1.0]));
        });
        const clock = new Group();
        clock.position.set(-1.075, 1.6, 0.2);
        clock.rotation.y = Math.PI / 2;
        clock.add(part(cyl(0.16, 0.03, 28), clay('#f4f1ea'), [0, 0, 0], [Math.PI / 2, 0, 0]));
        clock.add(part(new TorusGeometry(0.16, 0.02, 8, 28), clay('#33373b'), [0, 0, 0.01]));
        clock.add(part(rbox(0.012, 0.1, 0.01, 0.003), clay('#33373b'), [0, 0.04, 0.02]));
        clock.add(part(rbox(0.07, 0.012, 0.01, 0.003), clay('#33373b'), [0.03, 0, 0.02]));
        shell.add(clock);
        frame(-0.2, 1.4, 0.5, 0.36, '#f2a65a', 1);
        lamp(0, -0.1, '#ffd9a0');
        break;
      }
      case 'greenhouse': {
        // Big windows all round, plants hanging from the ceiling and climbing the walls.
        for (const x of [-0.62, 0, 0.62]) addWindow(x, 1.35, 0.48, 1.0);
        for (const s of [-1, 1]) addWindow(-0.3, 1.35, 0.9, 0.9, 0, s);
        for (const [x, z] of [[-0.6, -0.55], [0.62, -0.3]]) {
          for (const k of [-1, 0, 1]) shell.add(part(cyl(0.004, 0.42, 4), clay('#6b4f3a'), [x + k * 0.04, 2.08, z]));
          shell.add(part(cyl(0.11, 0.13, 18, 0.08), clay('#d07a52'), [x, 1.8, z]));
          for (let i = 0; i < 7; i++) {
            const a = (i / 7) * Math.PI * 2;
            shell.add(part(ball(0.06, 10, 8), clay(i % 2 ? '#5f9a52' : '#6fa35e'), [x + Math.cos(a) * 0.12, 1.72 - (i % 3) * 0.1, z + Math.sin(a) * 0.12], [0, 0, 0], [0.8, 1.3, 0.8]));
          }
        }
        for (let i = 0; i < 9; i++) shell.add(part(ball(0.05, 10, 8), clay('#5f9a52'), [-1.06, 0.3 + i * 0.2, 0.75 + Math.sin(i * 1.7) * 0.08], [0, 0, 0], [0.4, 1, 1]));
        lamp(0, 0.1, '#fff1cf');
        break;
      }
      case 'kids': {
        addWindow(0.4, 1.45, 0.6, 0.5);
        // Bunting along the back wall, posters of what they love, a star lamp.
        const flags = ['#e86a5a', '#f2cf5a', '#5fb3d6', '#8dbb67', '#ec9fb0', '#c99ae0'];
        for (let i = 0; i < 11; i++) {
          const x = -0.95 + i * 0.19;
          const y = 2.08 - Math.sin((i / 10) * Math.PI) * 0.16;
          shell.add(part(new ConeGeometry(0.07, 0.15, 3), clay(flags[i % flags.length]), [x, y - 0.06, -1.06], [Math.PI, 0, 0], [1, 1, 0.2]));
        }
        if (p.interests.includes('bugs')) {
          const f = frame(0.35, 1.35, 0.5, 0.4, '#f6efd9', 1);
          for (const s of [-1, 1]) f.add(part(ball(0.09, 12, 8), clay(s < 0 ? '#f2a65a' : '#e86a5a'), [s * 0.08, 0.02, 0.03], [0, 0, s * 0.4], [1, 1.3, 0.25]));
          f.add(part(capsule(0.015, 0.12), clay('#33373b'), [0, 0, 0.04]));
        }
        shell.add(part(new OctahedronGeometry(0.1), clay('#f2cf5a', { emissive: '#f2cf5a', emissiveIntensity: 0.6 }), [0, 2.1, 0], [0, 0, 0], [1, 1.2, 0.5]));
        shell.add(part(cyl(0.006, 0.2, 4), clay('#33373b'), [0, 2.24, 0]));
        break;
      }
      case 'site': {
        addWindow(-0.45, 1.45, 0.55, 0.45);
        // A hazard stripe round the walls, a mobile of diggers, stars on the wall.
        for (let i = 0; i < 12; i++) shell.add(part(rbox(0.18, 0.08, 0.02, 0.005), clay(i % 2 ? '#2b2b2b' : '#f2b632'), [-1.0 + i * 0.182, 0.62, -1.07]));
        for (let i = 0; i < 12; i++) for (const s of [-1, 1]) shell.add(part(rbox(0.02, 0.08, 0.18, 0.005), clay(i % 2 ? '#2b2b2b' : '#f2b632'), [s * 1.07, 0.62, -1.0 + i * 0.182]));
        const mobile = new Group();
        mobile.position.set(0.25, 2.3, 0.05);
        mobile.add(part(rbox(0.6, 0.02, 0.02, 0.005), clay('#9a7556'), [0, -0.12, 0]));
        mobile.add(part(cyl(0.004, 0.12, 4), clay('#33373b'), [0, -0.06, 0]));
        for (const s of [-1, 1]) {
          mobile.add(part(cyl(0.004, 0.2, 4), clay('#33373b'), [s * 0.28, -0.22, 0]));
          mobile.add(part(rbox(0.14, 0.08, 0.09, 0.02), clay(s < 0 ? '#f2b632' : '#e86a5a'), [s * 0.28, -0.36, 0]));
          mobile.add(part(rbox(0.07, 0.06, 0.08, 0.015), clay('#33373b'), [s * 0.28 + 0.02, -0.29, 0]));
        }
        shell.add(mobile);
        for (const [x, y] of [[0.5, 1.7], [0.8, 1.3], [0.3, 1.15], [0.85, 1.85]]) shell.add(part(new OctahedronGeometry(0.06), clay('#f2cf5a', { emissive: '#f2cf5a', emissiveIntensity: 0.4 }), [x, y, -1.07], [0, 0, 0], [1, 1, 0.3]));
        lamp(-0.3, 0.2, '#ffe2a8');
        break;
      }
    }
    shell.traverse(o => ((o as Mesh).castShadow = false));
    // Built small, then made room-sized round the figure.
    shell.scale.setScalar(1.62);
    g.add(shell);
    const floor = { kitchen: '#b98b5f', greenhouse: '#c98b6a', kids: '#cdd6e6', site: '#d8ccb0' }[kind];
    g.add(part(rbox(3.86, 0.06, 5.2, 0.02), clay(floor), [0, -0.04, 0.67]));
    if (kind === 'kitchen') for (let i = -6; i <= 6; i++) g.add(part(rbox(0.012, 0.061, 5.18, 0.004), clay('#9a6f48'), [i * 0.3, -0.04, 0.67]));
    if (kind === 'greenhouse') for (let i = -6; i <= 6; i++) for (const d of [0]) g.add(part(rbox(3.84, 0.061, 0.012, 0.004), clay('#a86f52'), [d, -0.04, i * 0.3]));
    (g.children[g.children.length - 1] as Mesh).receiveShadow = true;
  }

  /**
   * Furniture along the room's walls, so what they love stands where it would at home: a kitchen run
   * with the stove and sink, a desk with the laptop and a screen, a child's bed with a Charmander on it,
   * a Mewtwo poster, a Staryu lamp, a terrarium of creepy-crawlies. (Stand coordinates: the room's walls
   * are at x ±1.83 and z -1.75; the figure is at the middle.)
   */
  private furnish(p: FigureState, g: Group, f: Figure) {
    const likes = (i: Interest) => p.interests.includes(i);
    const floorY = -0.01;
    if (likes('cooking')) {
      // A run of base cabinets along the back wall: doors, a worktop, a hob with a steaming pot, a sink,
      // a chopping board; wall cupboards over it.
      const k = new Group();
      k.position.set(-0.75, floorY, -1.47);
      k.add(part(rbox(1.9, 0.68, 0.56, 0.03), clay('#f4f1ea'), [0, 0.34, 0]));
      for (let i = 0; i < 4; i++) {
        k.add(part(rbox(0.44, 0.58, 0.02, 0.02), clay('#e9e4da'), [-0.71 + i * 0.475, 0.33, 0.285]));
        k.add(part(rbox(0.1, 0.018, 0.02, 0.008), clay('#9aa1a7', { metalness: 0.5, roughness: 0.3 }), [-0.71 + i * 0.475, 0.56, 0.3]));
      }
      k.add(part(rbox(1.96, 0.05, 0.6, 0.015), clay('#45494f'), [0, 0.705, 0.01]));
      for (const [dx, dz] of [[-0.12, -0.08], [0.12, -0.08], [-0.12, 0.12], [0.12, 0.12]]) k.add(part(new TorusGeometry(0.07, 0.012, 6, 20), clay('#2a2c30'), [-0.55 + dx, 0.735, dz], [Math.PI / 2, 0, 0]));
      k.add(part(cyl(0.12, 0.16, 24), clay('#c9ced3', { metalness: 0.4, roughness: 0.35 }), [-0.67, 0.81, -0.08]));
      k.add(part(cyl(0.125, 0.03, 24), clay('#9aa1a7', { metalness: 0.4 }), [-0.67, 0.9, -0.08]));
      k.add(part(ball(0.022), clay('#33373b'), [-0.67, 0.93, -0.08]));
      for (let i = 0; i < 4; i++) {
        const puff = new Sprite(new SpriteMaterial({ map: spriteTexture('puff'), transparent: true, depthWrite: false, opacity: 0.6 }));
        puff.position.set(-0.67, 0.97, -0.08);
        puff.userData.phase = i / 4;
        puff.userData.base = 0.95;
        k.add(puff);
        f.steam.push(puff);
      }
      k.add(part(rbox(0.46, 0.04, 0.34, 0.02), clay('#c9ced3', { metalness: 0.5, roughness: 0.25 }), [0.45, 0.715, 0]));
      k.add(part(rbox(0.4, 0.04, 0.28, 0.02), clay('#9aa1a7', { metalness: 0.5, roughness: 0.3 }), [0.45, 0.71, 0]));
      k.add(part(capsule(0.014, 0.18), clay('#c9ced3', { metalness: 0.6 }), [0.45, 0.83, -0.2], [0.6, 0, 0]));
      k.add(part(rbox(0.3, 0.025, 0.2, 0.01), clay('#c49a6c'), [0.0, 0.74, 0.06]));
      k.add(part(capsule(0.025, 0.1), clay('#e8893a'), [-0.04, 0.775, 0.06], [0, 0, Math.PI / 2]));
      k.add(part(ball(0.04), clay('#d9473f'), [0.08, 0.78, 0.05]));
      k.add(part(rbox(1.9, 0.5, 0.34, 0.03), clay('#f4f1ea'), [0, 1.62, -0.11]));
      for (let i = 0; i < 4; i++) k.add(part(rbox(0.1, 0.018, 0.02, 0.008), clay('#9aa1a7', { metalness: 0.5 }), [-0.71 + i * 0.475, 1.42, 0.07]));
      g.add(k);
    }
    if (likes('tech')) {
      // A desk against the right-hand wall: the laptop open on it, a screen, a lamp, a chair; the drone
      // hovering over it.
      const d = new Group();
      d.position.set(1.45, floorY, -0.45);
      d.rotation.y = -Math.PI / 2;
      d.add(part(rbox(1.1, 0.05, 0.55, 0.02), clay('#c49a6c'), [0, 0.66, 0]));
      for (const s of [-1, 1]) d.add(part(rbox(0.05, 0.64, 0.5, 0.02), clay('#8a6446'), [s * 0.5, 0.32, 0]));
      const lap = new Group();
      lap.position.set(-0.15, 0.685, 0.06);
      lap.add(part(rbox(0.36, 0.025, 0.25, 0.01), clay('#c9ced3', { metalness: 0.3, roughness: 0.4 }), [0, 0.012, 0]));
      lap.add(part(rbox(0.36, 0.24, 0.02, 0.01), clay('#c9ced3', { metalness: 0.3, roughness: 0.4 }), [0, 0.13, -0.12], [-0.2, 0, 0]));
      lap.add(part(rbox(0.32, 0.2, 0.005, 0.004), this.screens, [0, 0.13, -0.108], [-0.2, 0, 0]));
      d.add(lap);
      d.add(part(rbox(0.5, 0.3, 0.03, 0.02), clay('#2a2c30'), [0.25, 1.02, -0.18]));
      d.add(part(rbox(0.46, 0.26, 0.005, 0.01), this.screens, [0.25, 1.02, -0.163]));
      d.add(part(cyl(0.02, 0.15, 8), clay('#2a2c30'), [0.25, 0.77, -0.2]));
      d.add(part(rbox(0.16, 0.015, 0.1, 0.005), clay('#2a2c30'), [0.25, 0.69, -0.2]));
      d.add(part(cyl(0.05, 0.02, 14), clay('#33373b'), [-0.43, 0.695, -0.15]));
      d.add(part(capsule(0.012, 0.3), clay('#33373b'), [-0.43, 0.85, -0.15]));
      const shade = clay('#f2cf5a', { emissive: '#ffd27a', emissiveIntensity: 0.6 });
      d.add(part(new ConeGeometry(0.08, 0.1, 16, 1, true), shade, [-0.38, 1.02, -0.08], [0.6, 0, 0]));
      // The chair, pushed in a little.
      const chair = new Group();
      chair.position.set(0.0, 0, 0.55);
      chair.rotation.y = 0.25;
      chair.add(part(rbox(0.42, 0.06, 0.4, 0.03), clay('#3d4a5c'), [0, 0.44, 0]));
      chair.add(part(rbox(0.42, 0.42, 0.05, 0.03), clay('#3d4a5c'), [0, 0.7, 0.18]));
      chair.add(part(cyl(0.025, 0.4, 8), clay('#9aa1a7', { metalness: 0.5 }), [0, 0.22, 0]));
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        chair.add(part(rbox(0.22, 0.025, 0.04, 0.01), clay('#33373b'), [Math.cos(a) * 0.1, 0.03, Math.sin(a) * 0.1], [0, -a, 0]));
      }
      d.add(chair);
      const drone = new Group();
      drone.position.set(0.1, 1.45, 0.1);
      drone.add(part(rbox(0.14, 0.04, 0.14, 0.02), clay('#33373b'), [0, 0, 0]));
      for (const [dx, dz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        drone.add(part(capsule(0.012, 0.09), clay('#33373b'), [dx * 0.06, 0, dz * 0.06], [0, Math.atan2(dz, dx), Math.PI / 2]));
        const rotor = part(rbox(0.12, 0.004, 0.02, 0.002), clay('#c9ced3'), [dx * 0.1, 0.03, dz * 0.1]);
        drone.add(rotor);
        f.spin.push(rotor);
      }
      drone.add(part(ball(0.015), clay('#58c27a', { emissive: '#58c27a', emissiveIntensity: 1 }), [0, -0.01, 0.075]));
      d.add(drone);
      f.hover.push(drone);
      g.add(d);
    }
    if (likes('pokemon')) {
      // A bed along the left wall with a Poké Ball duvet and a Charmander on the pillow; a Staryu lamp
      // on the bedside table; a Mewtwo poster over the bed.
      const bed = new Group();
      bed.position.set(-1.38, floorY, -0.55);
      bed.add(part(rbox(0.82, 0.3, 1.5, 0.05), clay('#c49a6c'), [0, 0.2, 0]));
      bed.add(part(rbox(0.86, 0.6, 0.08, 0.04), clay('#a37c54'), [0, 0.38, -0.76]));
      bed.add(part(rbox(0.76, 0.14, 1.42, 0.06), clay('#f4f1ea'), [0, 0.42, 0]));
      bed.add(part(rbox(0.8, 0.08, 0.9, 0.04), clay('#e33b3b'), [0, 0.51, 0.24]));
      bed.add(part(rbox(0.8, 0.081, 0.06, 0.02), clay('#1f1a17'), [0, 0.51, 0.24]));
      bed.add(part(cyl(0.09, 0.02, 20), clay('#1f1a17'), [0, 0.555, 0.24]));
      bed.add(part(cyl(0.055, 0.025, 20), clay('#f4f1ea'), [0, 0.56, 0.24]));
      bed.add(part(rbox(0.5, 0.12, 0.28, 0.06), clay('#f6efd9'), [0, 0.56, -0.52]));
      const charm = this.charmander();
      charm.position.set(0.05, 0.6, -0.3);
      charm.rotation.y = 0.9;
      bed.add(charm);
      g.add(bed);
      const table = new Group();
      table.position.set(-0.72, floorY, -1.45);
      table.add(part(rbox(0.4, 0.45, 0.4, 0.03), clay('#f4f1ea'), [0, 0.225, 0]));
      table.add(part(rbox(0.3, 0.015, 0.02, 0.008), clay('#9aa1a7'), [0.2, 0.3, 0], [0, Math.PI / 2, 0]));
      const lamp = this.staryu();
      lamp.position.set(0, 0.47, 0);
      lamp.rotation.y = 0.2;
      table.add(lamp);
      g.add(table);
      const shelf = new Group();
      shelf.position.set(0.6, 1.05, -1.6);
      shelf.add(part(rbox(0.7, 0.04, 0.26, 0.015), clay('#f4f1ea'), [0, 0, 0]));
      for (const sx of [-1, 1]) shelf.add(part(rbox(0.03, 0.12, 0.2, 0.01), clay('#c9ced3'), [sx * 0.28, -0.07, -0.02]));
      const fig = this.mewtwo();
      fig.position.set(0, 0.03, 0.03);
      fig.rotation.y = -0.25;
      shelf.add(fig);
      g.add(shelf);
      const poster = this.mewtwoPoster();
      poster.position.set(-1.05, 1.5, -1.72);
      poster.scale.setScalar(1.25);
      g.add(poster);
    }
    if (likes('bugs')) {
      // A terrarium on a low cabinet by the right-hand wall: soil, stones, a twig and leaves, a beetle, a
      // caterpillar and a snail.
      const t = new Group();
      t.position.set(1.42, floorY, -0.7);
      t.rotation.y = -Math.PI / 2;
      t.add(part(rbox(0.9, 0.5, 0.45, 0.03), clay('#c49a6c'), [0, 0.25, 0]));
      t.add(part(rbox(0.86, 0.06, 0.42, 0.02), clay('#6b4f3a'), [0, 0.54, 0]));
      t.add(part(rbox(0.8, 0.07, 0.38, 0.02), clay('#5b4130'), [0, 0.6, 0]));
      t.add(part(ball(0.07, 12, 8), clay('#9b958c'), [-0.25, 0.65, 0.05], [0, 0, 0], [1.3, 0.6, 1]));
      t.add(part(ball(0.05, 12, 8), clay('#8a847b'), [0.28, 0.64, -0.08], [0, 0, 0], [1.2, 0.6, 1]));
      t.add(part(capsule(0.018, 0.55), clay('#8a6446'), [0.02, 0.76, -0.05], [0, 0, 1.2]));
      for (let i = 0; i < 6; i++) t.add(part(ball(0.06, 10, 8), clay(i % 2 ? '#5f9a52' : '#7fae5f'), [-0.3 + i * 0.12, 0.66 + (i % 3) * 0.06, -0.12 + (i % 2) * 0.05], [0, i, 0.3], [1.2, 0.3, 0.7]));
      const beetle = new Group();
      beetle.position.set(0.12, 0.66, 0.08);
      beetle.add(part(cap(0.05, Math.PI / 2), clay('#2f7d6a', { roughness: 0.25, metalness: 0.4 }), [0, 0, 0], [0, 0, 0], [1.3, 0.8, 1]));
      beetle.add(part(ball(0.025), clay('#1f1a17'), [0.065, 0.005, 0]));
      t.add(beetle);
      for (let i = 0; i < 5; i++) t.add(part(ball(0.025 - i * 0.002, 10, 8), clay(i === 0 ? '#9ccf5a' : '#7fbf4a'), [-0.12 - i * 0.04, 0.665 + Math.sin(i * 1.4) * 0.012, 0.1]));
      t.add(part(new TorusGeometry(0.03, 0.016, 8, 16), clay('#c49a6c'), [0.3, 0.68, 0.1]));
      t.add(part(capsule(0.012, 0.06), clay('#d9c3a0'), [0.33, 0.66, 0.1], [0, 0, Math.PI / 2]));
      // The glass, and its frame.
      const glass = new MeshStandardMaterial({ color: '#d6eef5', roughness: 0.05, transparent: true, opacity: 0.22, depthWrite: false });
      t.add(part(rbox(0.86, 0.42, 0.42, 0.02), glass, [0, 0.76, 0]));
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) t.add(part(rbox(0.02, 0.42, 0.02, 0.005), clay('#33373b'), [sx * 0.43, 0.76, sz * 0.21]));
      t.add(part(rbox(0.88, 0.025, 0.44, 0.008), clay('#33373b'), [0, 0.975, 0]));
      g.add(t);
    }
  }

  /** A shiny cartoon eye: a dark oval with a big highlight and a small one. */
  private eye(at: V3, r: number, colour: string, turn: number) {
    const e = new Group();
    e.position.set(...at);
    e.rotation.y = turn;
    e.add(part(ball(r, 18, 14), clay(colour, { roughness: 0.12 }), [0, 0, 0], [0, 0, 0], [0.8, 1.15, 0.5]));
    e.add(part(ball(r * 0.36, 10, 8), clay('#ffffff', { emissive: '#ffffff', emissiveIntensity: 0.7 }), [r * 0.25, r * 0.4, r * 0.38]));
    e.add(part(ball(r * 0.15, 8, 6), clay('#ffffff', { emissive: '#ffffff', emissiveIntensity: 0.7 }), [-r * 0.25, -r * 0.35, r * 0.4]));
    return e;
  }

  /** A Charmander plush: sculpted soft (see figures.ts), with big shiny eyes, white claws and a flame on its tail. */
  private charmander() {
    const c = new Group();
    const body = part(charmanderGeometry(), new MeshStandardMaterial({ vertexColors: true, roughness: 0.92 }));
    body.userData.keep = true;
    c.add(body);
    CHARMANDER_EYES.forEach((at, i) => c.add(this.eye(at, 0.042, '#1b2a50', (i ? 1 : -1) * 0.4)));
    for (const side of [-1, 1]) c.add(part(ball(0.006, 8, 6), clay('#5a2a1a'), [side * 0.022, 0.33, 0.172]));
    c.add(part(new TorusGeometry(0.05, 0.005, 6, 20, Math.PI * 0.8), clay('#5a2a1a'), [0, 0.312, 0.168], [0.25, 0, Math.PI * 1.1]));
    const claw = clay('#f6f1e6');
    for (const side of [-1, 1]) {
      for (let k = -1; k <= 1; k++) {
        c.add(part(new ConeGeometry(0.008, 0.022, 6), claw, [side * 0.145 + k * 0.012, 0.125, 0.105], [Math.PI / 2, 0, 0]));
        c.add(part(new ConeGeometry(0.01, 0.026, 6), claw, [side * 0.075 + k * 0.022, 0.06, 0.2], [Math.PI / 2, 0, 0]));
      }
    }
    const flame = new Group();
    flame.position.set(0, 0.3, -0.27);
    flame.add(part(new ConeGeometry(0.055, 0.15, 14), clay('#f2862a', { emissive: '#ff7a1a', emissiveIntensity: 1.3 }), [0, 0.06, 0]));
    for (const side of [-1, 1]) flame.add(part(new ConeGeometry(0.03, 0.1, 10), clay('#f2862a', { emissive: '#ff7a1a', emissiveIntensity: 1.3 }), [side * 0.03, 0.04, 0], [0, 0, side * -0.5]));
    flame.add(part(new ConeGeometry(0.03, 0.09, 12), clay('#ffe27a', { emissive: '#ffd34a', emissiveIntensity: 1.6 }), [0, 0.04, 0.014]));
    c.add(flame);
    c.scale.setScalar(1.15);
    return c;
  }

  /** A Mewtwo figure on its stand, holding a glowing ball of psychic energy. */
  private mewtwo() {
    const m = new Group();
    const body = part(mewtwoGeometry(), new MeshStandardMaterial({ vertexColors: true, roughness: 0.55 }));
    body.userData.keep = true;
    m.add(body);
    MEWTWO_EYES.forEach((at, i) => m.add(this.eye(at, 0.016, '#6a2fa0', (i ? 1 : -1) * 0.3)));
    m.add(part(ball(0.05, 20, 14), clay('#9fd8ff', { emissive: '#7fc4ff', emissiveIntensity: 1.6, roughness: 0.2 }), [0, 0.5, 0.2]));
    m.add(part(cyl(0.2, 0.03, 32), clay('#2e1b47'), [0, -0.015, 0.02]));
    m.scale.setScalar(0.5);
    return m;
  }

  /** A Staryu lamp: a five-armed tan star with a red gem in the middle that glows, on a little stand. */
  private staryu() {
    const s = new Group();
    s.add(part(cyl(0.07, 0.03, 18), clay('#f4f1ea'), [0, 0.015, 0]));
    s.add(part(cyl(0.012, 0.08, 8), clay('#f4f1ea'), [0, 0.07, 0]));
    const star = new Group();
    star.position.y = 0.26;
    const tan = clay('#d9a85e', { roughness: 0.7 });
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + Math.PI / 2;
      star.add(part(new ConeGeometry(0.06, 0.17, 10), tan, [Math.cos(a) * 0.1, Math.sin(a) * 0.1, 0], [0, 0, a - Math.PI / 2], [1, 1, 0.5]));
    }
    star.add(part(cyl(0.07, 0.05, 20), tan, [0, 0, 0], [Math.PI / 2, 0, 0]));
    star.add(part(new TorusGeometry(0.045, 0.012, 8, 20), clay('#f2cf5a', { metalness: 0.4, roughness: 0.3 }), [0, 0, 0.028]));
    const gem = part(new OctahedronGeometry(0.035), clay('#ff4a4a', { emissive: '#ff2a2a', emissiveIntensity: 1.4, roughness: 0.15 }), [0, 0, 0.035]);
    star.add(gem);
    s.add(star);
    s.userData.gem = gem;
    return s;
  }

  /**
   * A Mewtwo poster: the figure from the shelf, photographed in a dramatic light against a starry purple
   * sky (rendered once into a texture), its name in gold along the bottom.
   */
  private mewtwoPoster() {
    const g = new Group();
    const W = 600;
    const H = 800;
    // The sky behind it.
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const x = c.getContext('2d')!;
    const sky = x.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#1d1238');
    sky.addColorStop(1, '#4b2a73');
    x.fillStyle = sky;
    x.fillRect(0, 0, W, H);
    for (let i = 0; i < 70; i++) {
      x.fillStyle = `rgba(255,255,255,${0.3 + ((i * 37) % 7) / 10})`;
      x.beginPath();
      x.arc((i * 137) % W, (i * 89) % (H * 0.85), 1 + (i % 3), 0, Math.PI * 2);
      x.fill();
    }
    const halo = x.createRadialGradient(W / 2, H * 0.45, 20, W / 2, H * 0.45, 300);
    halo.addColorStop(0, 'rgba(190,140,255,0.6)');
    halo.addColorStop(1, 'rgba(190,140,255,0)');
    x.fillStyle = halo;
    x.fillRect(0, 0, W, H);
    const bg = new CanvasTexture(c);
    bg.colorSpace = SRGBColorSpace;
    // The figure, lit from the front-left with a purple rim from behind.
    const shot = new Scene();
    shot.background = bg;
    const fig = this.mewtwo();
    fig.rotation.y = -0.35;
    shot.add(fig);
    shot.add(new HemisphereLight('#e8dcff', '#2b1d4f', 1.2));
    const key = new DirectionalLight('#ffffff', 2.4);
    key.position.set(-1, 1.5, 2);
    const rim = new DirectionalLight('#c08aff', 3);
    rim.position.set(1.5, 1, -2);
    shot.add(key, rim);
    // Framed to its size: all of it, a little above the middle (the name goes along the bottom).
    const box = new Box3().setFromObject(fig);
    const size = box.getSize(new Vector3());
    const mid = box.getCenter(new Vector3());
    const cam = new PerspectiveCamera(28, W / H, 0.01, 100);
    const dist = (size.y * 0.68) / Math.tan(MathUtils.degToRad(14));
    cam.position.set(mid.x, mid.y - size.y * 0.06, mid.z + dist);
    cam.lookAt(mid.x, mid.y - size.y * 0.12, mid.z);
    const rt = new WebGLRenderTarget(W, H, { samples: 4 });
    const r = this.renderer;
    const was = r.getRenderTarget();
    r.setRenderTarget(rt);
    r.setScissorTest(false);
    r.clear();
    r.render(shot, cam);
    r.setRenderTarget(was);
    // Its name over it.
    const t = document.createElement('canvas');
    t.width = W;
    t.height = H;
    const tx = t.getContext('2d')!;
    tx.font = `900 76px system-ui, sans-serif`;
    tx.textAlign = 'center';
    tx.lineWidth = 12;
    tx.strokeStyle = '#1d1238';
    tx.strokeText('MEWTWO', W / 2, H - 38);
    const gold = tx.createLinearGradient(0, H - 100, 0, H - 30);
    gold.addColorStop(0, '#ffe27a');
    gold.addColorStop(1, '#f2a83a');
    tx.fillStyle = gold;
    tx.fillText('MEWTWO', W / 2, H - 38);
    tx.font = `700 26px system-ui, sans-serif`;
    tx.fillStyle = 'rgba(255,255,255,0.7)';
    tx.fillText('#150', W - 50, 44);
    const text = new CanvasTexture(t);
    text.colorSpace = SRGBColorSpace;
    g.add(part(rbox(0.66, 0.86, 0.02, 0.01), clay('#f4f1ea'), [0, 0, 0]));
    g.add(part(new PlaneGeometry(0.6, 0.8), new MeshStandardMaterial({ map: rt.texture, roughness: 0.6 }), [0, 0, 0.012]));
    g.add(part(new PlaneGeometry(0.6, 0.8), new MeshStandardMaterial({ map: text, transparent: true, roughness: 0.6 }), [0, 0, 0.013]));
    return g;
  }

  private props(interest: Interest, g: Group, f: Figure, take: () => [number, number] | undefined) {
    const at = (fn: (x: number, z: number) => void) => {
      const s = take();
      if (s) fn(s[0], s[1]);
    };
    switch (interest) {
      case 'cooking':
      case 'tech':
        // (Furniture along the walls: see furnish.)
        break;
      case 'gardening':
        // A raised bed of flowers, and a watering can.
        at((x, z) => {
          g.add(part(rbox(0.66, 0.2, 0.4, 0.03), clay('#9a7556'), [x, 0.14, z]));
          g.add(part(rbox(0.6, 0.06, 0.34, 0.02), clay('#6b4f3a'), [x, 0.24, z]));
          const colours = ['#ec9fb0', '#f2cf5a', '#c99ae0', '#f4f1ea', '#e86a5a'];
          for (let i = 0; i < 8; i++) {
            const fx = x - 0.24 + (i % 4) * 0.16;
            const fz = z - 0.08 + Math.floor(i / 4) * 0.16;
            g.add(part(cyl(0.008, 0.16, 6), clay('#5f9a52'), [fx, 0.34, fz]));
            for (let k = 0; k < 5; k++) {
              const a = (k / 5) * Math.PI * 2;
              g.add(part(ball(0.025, 10, 8), clay(colours[i % 5]), [fx + Math.cos(a) * 0.028, 0.43, fz + Math.sin(a) * 0.028], [0, 0, 0], [1, 0.6, 1]));
            }
            g.add(part(ball(0.018, 8, 6), clay('#f2cf5a'), [fx, 0.44, fz]));
          }
        });
        at((x, z) => {
          const can = new Group();
          can.position.set(x, 0.07, z);
          can.rotation.y = 0.6;
          can.add(part(cyl(0.11, 0.2, 24, 0.12), clay('#5fa8b8', { metalness: 0.2, roughness: 0.5 }), [0, 0.1, 0]));
          can.add(part(capsule(0.018, 0.22), clay('#5fa8b8'), [0.15, 0.17, 0], [0, 0, -0.8]));
          can.add(part(cyl(0.035, 0.025, 12, 0.02), clay('#4b8f9e'), [0.24, 0.26, 0], [0, 0, -0.8]));
          can.add(part(new TorusGeometry(0.07, 0.015, 8, 20, Math.PI), clay('#4b8f9e'), [-0.02, 0.2, 0], [0, 0, 0]));
          g.add(can);
        });
        break;
      case 'decor':
        // A monstera in a pot on a little rug, and a floor lamp that glows at night.
        at((x, z) => {
          g.add(part(cyl(0.13, 0.22, 24, 0.1), clay('#e6e1d8'), [x, 0.18, z]));
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            g.add(part(cyl(0.008, 0.25, 6), clay('#4f8a5c'), [x + Math.cos(a) * 0.04, 0.4, z + Math.sin(a) * 0.04], [Math.sin(a) * 0.3, 0, Math.cos(a) * 0.3]));
            g.add(part(ball(0.12, 16, 10), clay(i % 2 ? '#4f8a5c' : '#5f9a52'), [x + Math.cos(a) * 0.16, 0.55 + (i % 2) * 0.06, z + Math.sin(a) * 0.16], [0.4, -a, 0], [1, 0.12, 0.7]));
          }
        });
        at((x, z) => {
          g.add(part(disc(0.36, 0.015, 32), clay('#d9b4a0'), [x, 0.07, z]));
          g.add(part(cyl(0.12, 0.02, 20), clay('#33373b'), [x, 0.08, z]));
          g.add(part(cyl(0.012, 0.75, 8), clay('#33373b'), [x, 0.45, z]));
          const shade = clay('#f4e6c8', { emissive: '#ffc983', emissiveIntensity: 0 });
          shade.userData.lamp = true;
          g.add(part(cyl(0.09, 0.14, 20, 0.14), shade, [x, 0.86, z]));
        });
        break;
      case 'bugs':
        // A log with a ladybird, and a butterfly fluttering round.
        at((x, z) => {
          g.add(part(cyl(0.11, 0.6, 16), clay('#8a6446'), [x, 0.17, z], [0, 0.4, Math.PI / 2]));
          g.add(part(disc(0.1, 0.01, 16), clay('#c49a6c'), [x + Math.cos(0.4) * 0.3, 0.17, z - Math.sin(0.4) * 0.3], [0, 0.4, Math.PI / 2]));
          const bug = new Group();
          bug.position.set(x - 0.05, 0.29, z);
          bug.add(part(cap(0.05, Math.PI / 2), clay('#d9473f', { roughness: 0.4 }), [0, 0, 0]));
          bug.add(part(ball(0.022), clay('#1f1a17'), [0.045, 0.005, 0]));
          for (const [dx, dz] of [[-0.015, 0.025], [0.01, -0.025], [-0.025, -0.01]]) bug.add(part(ball(0.009), clay('#1f1a17'), [dx, 0.035, dz]));
          g.add(bug);
        });
        at((x, z) => {
          const fly = new Group();
          fly.position.set(x, 0.7, z);
          fly.add(part(capsule(0.012, 0.05), clay('#33373b'), [0, 0, 0], [Math.PI / 2, 0, 0]));
          for (const side of [-1, 1]) {
            const wing = new Group();
            wing.add(part(new PlaneGeometry(0.11, 0.09), new MeshStandardMaterial({ color: '#f2a65a', side: DoubleSide, roughness: 0.6 }), [side * 0.055, 0, 0]));
            wing.add(part(ball(0.012), clay('#33373b'), [side * 0.07, 0.01, 0.001], [0, 0, 0], [1, 1, 0.2]));
            wing.rotation.x = -Math.PI / 2;
            wing.userData.side = side;
            fly.add(wing);
            f.flap.push(wing);
          }
          g.add(fly);
          f.hover.push(fly);
        });
        break;
      case 'pokemon':
        // A Poké Ball in the grass.
        at((x, z) => {
          const pb = new Group();
          pb.position.set(x, 0.17, z);
          pb.rotation.set(0.25, 0.6, 0);
          pb.add(part(cap(0.1, Math.PI / 2), clay('#e33b3b', { roughness: 0.35 })));
          pb.add(part(cap(0.1, Math.PI / 2, Math.PI / 2), clay('#f4f1ea', { roughness: 0.35 })));
          pb.add(part(new TorusGeometry(0.1, 0.012, 8, 32), clay('#1f1a17'), [0, 0, 0], [Math.PI / 2, 0, 0]));
          pb.add(part(cyl(0.03, 0.02, 16), clay('#1f1a17'), [0, 0, 0.095], [Math.PI / 2, 0, 0]));
          pb.add(part(cyl(0.018, 0.024, 16), clay('#f4f1ea'), [0, 0, 0.1], [Math.PI / 2, 0, 0]));
          g.add(pb);
        });
        break;
      case 'nature':
        // Mushrooms and a little bush.
        at((x, z) => {
          for (const [dx, dz, s] of [[0, 0, 1], [0.13, 0.08, 0.7], [-0.1, 0.1, 0.55]]) {
            g.add(part(cyl(0.025 * s, 0.12 * s, 10), clay('#f4ead8'), [x + dx, 0.07 + 0.06 * s, z + dz]));
            g.add(part(cap(0.08 * s, Math.PI / 2), clay('#d9473f'), [x + dx, 0.07 + 0.12 * s, z + dz], [0, 0, 0], [1, 0.8, 1]));
            for (let k = 0; k < 3; k++) g.add(part(ball(0.012 * s), clay('#f4f1ea'), [x + dx + Math.cos(k * 2.1) * 0.04 * s, 0.07 + 0.17 * s, z + dz + Math.sin(k * 2.1) * 0.04 * s]));
          }
          g.add(part(ball(0.16), clay('#6fa35e'), [x - 0.08, 0.15, z - 0.18], [0, 0, 0], [1.2, 0.8, 1]));
        });
        break;
      case 'cars':
        // A yellow skid steer with its bucket, and a couple of cones; sand piles round about.
        at((x, z) => {
          const bob = new Group();
          bob.position.set(x, 0.07, z);
          bob.rotation.y = x > 0 ? -0.7 : 0.7;
          const yellow = clay('#f2b632', { roughness: 0.5 });
          const black = clay('#25272a');
          bob.add(part(rbox(0.36, 0.16, 0.42, 0.04), yellow, [0, 0.16, 0]));
          bob.add(part(rbox(0.3, 0.2, 0.26, 0.03), black, [0, 0.33, -0.04]));
          bob.add(part(rbox(0.32, 0.03, 0.3, 0.015), yellow, [0, 0.44, -0.04]));
          bob.add(part(rbox(0.24, 0.14, 0.01, 0.005), clay('#9fc6d9', { roughness: 0.15 }), [0, 0.33, 0.095]));
          for (const sx of [-1, 1]) {
            for (const sz of [-1, 1]) bob.add(part(cyl(0.075, 0.06, 18), black, [sx * 0.2, 0.075, sz * 0.13], [0, 0, Math.PI / 2]));
            bob.add(part(rbox(0.03, 0.04, 0.32, 0.01), yellow, [sx * 0.17, 0.26, 0.12], [-0.4, 0, 0]));
          }
          bob.add(part(rbox(0.42, 0.12, 0.12, 0.02), clay('#5c6268', { metalness: 0.3 }), [0, 0.1, 0.3]));
          g.add(bob);
        });
        at((x, z) => {
          for (const [dx, dz] of [[0, 0], [0.18, 0.1]]) {
            g.add(part(new ConeGeometry(0.06, 0.18, 16), clay('#f07a2a'), [x + dx, 0.16, z + dz]));
            g.add(part(cyl(0.048, 0.03, 16, 0.054), clay('#f4f1ea'), [x + dx, 0.16, z + dz]));
            g.add(part(rbox(0.14, 0.02, 0.14, 0.01), clay('#f07a2a'), [x + dx, 0.075, z + dz]));
          }
          g.add(part(cap(0.2, Math.PI / 2), clay('#dcc48f'), [x - 0.12, 0.06, z - 0.05], [0, 0, 0], [1, 0.45, 1]));
        });
        break;
    }
  }

  /** Swap the built figure for a sculpted GLB once it has loaded, scaled to the same height. */
  private loadModel(url: string, f: Figure) {
    new GLTFLoader().loadAsync(url).then(
      gltf => {
        const model = gltf.scene;
        const box = new Box3().setFromObject(model);
        const size = box.getSize(new Vector3());
        const height = f.state.preset === 'baby' ? 1.0 : f.state.preset === 'child' ? 1.45 : 1.7;
        const k = height / Math.max(0.001, size.y);
        model.scale.setScalar(k);
        model.position.set(-((box.min.x + box.max.x) / 2) * k, -box.min.y * k, -((box.min.z + box.max.z) / 2) * k);
        model.traverse(o => {
          const m = o as Mesh;
          if (!m.isMesh) return;
          m.castShadow = true;
          m.receiveShadow = true;
          // Only the painted skin takes its colours from the vertices.
          for (const mat of Array.isArray(m.material) ? m.material : [m.material]) {
            const sm = mat as MeshStandardMaterial;
            if (sm.name !== 'headskin') sm.vertexColors = false;
            sm.needsUpdate = true;
            f.own.push(sm);
          }
        });
        f.body.visible = false;
        f.figure.add(model);
        // Its moving parts, by name: the head turns and nods, the eyes blink, the arms swing and wave.
        const head = model.getObjectByName('head');
        if (head) {
          f.head = head as Group;
          const face = new Object3D();
          face.position.set(0, 0.32, 0);
          head.add(face);
          f.faceAt = face;
          for (const z of f.zs) {
            head.add(z);
            z.scale.multiplyScalar(1 / k);
          }
        }
        f.eyes = [];
        f.modelEyes = ['eye_l', 'eye_r'].map(n => model.getObjectByName(n)).filter((o): o is Object3D => !!o);
        const arms = ['arm_l', 'arm_r'].map(n => model.getObjectByName(n)).filter((o): o is Object3D => !!o);
        if (arms.length) f.arms = arms.map(a => ({ shoulder: a as Group, elbow: new Group(), hand: new Group(), side: Math.sign(a.position.x) || 1 }));
        f.modelled = true;
        f.modelR = 0.5 * k;
        const clip = gltf.animations.find(c => /idle/i.test(c.name)) ?? gltf.animations[0];
        if (clip) {
          f.mixer = new AnimationMixer(model);
          f.mixer.clipAction(clip).play();
        }
        if (!this.look.motion) this.renderOnce();
      },
      () => {
        // No modelled figure for them: the sculpted one stays.
      },
    );
  }

  // ---------- the figurine ----------

  private figure(p: FigureState): Figure {
    if (this.modelUrls.get(p.key)) return this.emptyFigure(p);
    const own: MeshStandardMaterial[] = [];
    const m = (color: string, roughness = 0.75, extra: Partial<{ metalness: number }> = {}) => {
      const mat = new MeshStandardMaterial({ color, roughness, metalness: extra.metalness ?? 0 });
      own.push(mat);
      return mat;
    };
    const likes = (i: Interest) => p.interests.includes(i);
    // The head's skin: its colours (blush, the inside of the mouth) are in its vertices.
    const sculpt = new MeshPhysicalMaterial({ vertexColors: true, roughness: 0.52, sheen: 0.6, sheenRoughness: 0.5, sheenColor: new Color('#ffb4a2') });
    own.push(sculpt);
    // Every other piece in its own material: cloth with a soft sheen, smooth skin, rubber soles.
    const mats = new Map<string, MeshStandardMaterial>();
    const stuff = (pc: Piece) => {
      const k = pc.colour + pc.stuff;
      let mat = mats.get(k);
      if (!mat) {
        mat =
          pc.stuff === 'cloth'
            ? new MeshPhysicalMaterial({ color: pc.colour, roughness: 0.86, sheen: 1, sheenRoughness: 0.45, sheenColor: new Color(pc.colour).lerp(new Color('#ffffff'), 0.55) })
            : pc.stuff === 'skin'
              ? new MeshPhysicalMaterial({ color: pc.colour, roughness: 0.52, sheen: 0.6, sheenRoughness: 0.5, sheenColor: new Color('#ffb4a2') })
              : new MeshStandardMaterial({ color: pc.colour, roughness: 0.6 });
        own.push(mat);
        mats.set(k, mat);
      }
      return mat;
    };
    const pieces = (g: Group, list: Piece[]) => {
      for (const pc of list) {
        const mesh = part(pc.geo, stuff(pc));
        mesh.userData.keep = true;
        g.add(mesh);
      }
    };
    const figure = new Group();
    const body = new Group();
    figure.add(body);
    const arms: Arm[] = [];
    let head: Group;
    // The body, which breathes; buttons and a badge on it.
    const torso = new Group();
    const bp = bodyParts(p);
    pieces(torso, bp.pieces);
    for (const d of bp.dots) torso.add(part(ball(d.r, 14, 10), m(d.colour, 0.4), d.at, [0, 0, 0], d.flat ? [1, 1, 0.45] : [1, 1, 1]));
    if (bp.badge) {
      const { at, r } = bp.badge;
      const pb = new Group();
      pb.position.set(...at);
      pb.add(part(new CylinderGeometry(r, r, 0.012, 32, 1, false, Math.PI / 2, Math.PI), m('#e33b3b', 0.4), [0, 0, 0], [Math.PI / 2, 0, 0]));
      pb.add(part(new CylinderGeometry(r, r, 0.012, 32, 1, false, -Math.PI / 2, Math.PI), m('#f4f1ea', 0.4), [0, 0, 0], [Math.PI / 2, 0, 0]));
      pb.add(part(rbox(r * 2, r * 0.14, 0.016, 0.004), m('#1f1a17'), [0, 0, 0.002]));
      pb.add(part(new CylinderGeometry(r * 0.3, r * 0.3, 0.02, 20), m('#1f1a17'), [0, 0, 0.004], [Math.PI / 2, 0, 0]));
      pb.add(part(new CylinderGeometry(r * 0.18, r * 0.18, 0.024, 20), m('#f4f1ea', 0.3), [0, 0, 0.006], [Math.PI / 2, 0, 0]));
      torso.add(pb);
    }
    body.add(torso);
    const chest = torso;

    if (p.preset === 'baby') {
      // Sitting, arms reaching out a little.
      for (const side of [-1, 1]) {
        const shoulder = new Group();
        shoulder.position.set(side * 0.21, 0.38, 0.02);
        shoulder.rotation.z = side * 0.6;
        pieces(shoulder, armParts(p, side).upper);
        const elbow = new Group();
        elbow.position.set(0, -0.16, 0);
        const hand = new Group();
        elbow.add(hand);
        shoulder.add(elbow);
        body.add(shoulder);
        arms.push({ shoulder, elbow, hand, side });
      }
      head = this.head(p, 0.3, sculpt, own);
      head.position.set(0, 0.72, 0.02);
      body.add(head);
      // A little yellow hard hat for the one who loves diggers.
      if (likes('cars')) {
        const hat = m('#f2b632', 0.45);
        head.add(part(cap(0.33, Math.PI * 0.48), hat, [0, 0.05, -0.01], [-0.25, 0, 0]));
        head.add(part(cyl(0.36, 0.025, 32), hat, [0, 0.07, 0.03], [-0.25, 0, 0], [1, 1, 1.05]));
        head.add(part(rbox(0.05, 0.03, 0.4, 0.01), m('#e0a020', 0.45), [0, 0.37, -0.05], [-0.25, 0, 0]));
      }
    } else {
      const b = BODY[p.preset];
      // Arms: the upper arm from the shoulder, the forearm and hand from the elbow.
      for (const side of [-1, 1]) {
        const g = armParts(p, side);
        const shoulder = new Group();
        shoulder.position.set(side * b.torsoW * 0.92, b.legH + b.torsoH * 0.84, 0);
        pieces(shoulder, g.upper);
        const elbow = new Group();
        elbow.position.set(0, -g.len, 0);
        elbow.rotation.x = -0.25;
        pieces(elbow, g.fore);
        const hand = new Group();
        hand.position.set(0, -g.len - 0.03, 0.01);
        elbow.add(hand);
        shoulder.add(elbow);
        body.add(shoulder);
        arms.push({ shoulder, elbow, hand, side });
      }
      // Something in the right hand, gripped in the fist and sticking out to the side, a little up.
      const held = new Group();
      held.position.set(0.02, -0.04, 0.015);
      held.rotation.z = -1.2;
      arms.find(a => a.side > 0)!.hand.add(held);
      if (likes('cooking')) {
        // A wooden spoon.
        held.add(part(capsule(0.012, 0.17), m('#a37c54'), [0, 0.05, 0]));
        held.add(part(ball(0.035, 14, 10), m('#a37c54'), [0, 0.17, 0], [0, 0, 0], [1, 1.3, 0.4]));
      } else if (likes('gardening')) {
        held.add(part(cyl(0.008, 0.24, 6), m('#5f9a52'), [0, 0.06, 0]));
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2;
          held.add(part(ball(0.03, 10, 8), m('#ec9fb0'), [Math.cos(a) * 0.035, 0.19, Math.sin(a) * 0.035], [0, 0, 0], [1, 0.6, 1]));
        }
        held.add(part(ball(0.022, 8, 6), m('#f2cf5a'), [0, 0.2, 0]));
      } else if (likes('bugs')) {
        // A magnifying glass.
        held.add(part(capsule(0.015, 0.09), m('#8a6446'), [0, 0.02, 0]));
        held.add(part(new TorusGeometry(0.06, 0.012, 8, 24), m('#33373b'), [0, 0.14, 0]));
        held.add(part(cyl(0.055, 0.006, 24), new MeshStandardMaterial({ color: '#cfe8f5', transparent: true, opacity: 0.5, roughness: 0.1 }), [0, 0.14, 0], [Math.PI / 2, 0, 0]));
      }
      head = this.head(p, b.headR, sculpt, own);
      head.position.set(0, b.legH + b.torsoH + 0.04 + b.headR * 0.9, 0);
      body.add(head);
    }

    const zs: Sprite[] = [];
    for (let i = 0; i < 3; i++) {
      const z = new Sprite(new SpriteMaterial({ map: spriteTexture('z'), color: '#ffffff', transparent: true, depthWrite: false }));
      z.visible = false;
      head.add(z);
      zs.push(z);
    }
    const eyes = head.children.filter(c => c.userData.eye) as Group[];
    // A hologram's pad: a glowing disc at their feet and a faint beam of light up from it.
    const pad = new Group();
    const glow = (color: string, opacity: number) => new MeshBasicMaterial({ color, transparent: true, opacity, blending: AdditiveBlending, depthWrite: false, side: DoubleSide });
    pad.add(part(new CylinderGeometry(0.4, 0.42, 0.025, 48), glow('#5ad6ff', 0.7), [0, 0.07, -0.02]));
    pad.add(part(new TorusGeometry(0.44, 0.012, 8, 64), glow('#bff1ff', 0.9), [0, 0.085, -0.02], [Math.PI / 2, 0, 0]));
    pad.add(part(new CylinderGeometry(0.3, 0.42, p.preset === 'baby' ? 1.1 : 1.8, 40, 1, true), glow('#2a7fa0', 0.09), [0, p.preset === 'baby' ? 0.62 : 0.97, -0.02]));
    pad.traverse(o => ((o as Mesh).castShadow = false));
    pad.visible = false;
    return {
      state: p,
      index: 0,
      stand: new Group(),
      pad,
      holo: false,
      figure,
      body,
      head,
      chest,
      eyes,
      arms,
      own,
      zs,
      phase: Math.random() * 6,
      nextBlink: 1 + Math.random() * 4,
      blink: 0,
      look: 0,
      lookTarget: 0,
      nextLook: 2 + Math.random() * 3,
      wave: 0,
      spin: [],
      flap: [],
      hover: [],
      steam: [],
    };
  }

  /** The frame of a figure whose body is a loaded model (see loadModel). */
  private emptyFigure(p: FigureState): Figure {
    const figure = new Group();
    const body = new Group();
    const head = new Group();
    figure.add(body);
    body.add(head);
    const zs: Sprite[] = [];
    for (let i = 0; i < 3; i++) {
      const z = new Sprite(new SpriteMaterial({ map: spriteTexture('z'), color: '#ffffff', transparent: true, depthWrite: false }));
      z.visible = false;
      head.add(z);
      zs.push(z);
    }
    const pad = new Group();
    const glow = (color: string, opacity: number) => new MeshBasicMaterial({ color, transparent: true, opacity, blending: AdditiveBlending, depthWrite: false, side: DoubleSide });
    pad.add(part(new CylinderGeometry(0.4, 0.42, 0.025, 48), glow('#5ad6ff', 0.7), [0, 0.07, -0.02]));
    pad.add(part(new TorusGeometry(0.44, 0.012, 8, 64), glow('#bff1ff', 0.9), [0, 0.085, -0.02], [Math.PI / 2, 0, 0]));
    pad.add(part(new CylinderGeometry(0.3, 0.42, p.preset === 'baby' ? 1.1 : 1.8, 40, 1, true), glow('#2a7fa0', 0.09), [0, p.preset === 'baby' ? 0.62 : 0.97, -0.02]));
    pad.traverse(o => ((o as Mesh).castShadow = false));
    pad.visible = false;
    return { state: p, index: 0, stand: new Group(), pad, holo: false, figure, body, head, chest: new Object3D(), eyes: [], arms: [], own: [], zs, phase: Math.random() * 6, nextBlink: 1 + Math.random() * 4, blink: 0, look: 0, lookTarget: 0, nextLook: 2 + Math.random() * 3, wave: 0, spin: [], flap: [], hover: [], steam: [] };
  }

  /**
   * The sculpted head and its features: eyeballs in their sockets (a white ball with a ringed iris, a
   * pupil and a catchlight, turning to look round) under a skin-coloured lid that blinks; brows and a
   * closed smile as smooth lines on the face; hair and beard laid over.
   */
  private head(p: FigureState, R: number, sculpt: MeshStandardMaterial, own: MeshStandardMaterial[]) {
    const m = (color: string | Color, roughness = 0.45) => {
      const mat = new MeshStandardMaterial({ color, roughness });
      own.push(mat);
      return mat;
    };
    const parts = headParts(p, R);
    const h = new Group();
    const keep = (mesh: Mesh) => {
      mesh.userData.keep = true;
      h.add(mesh);
    };
    keep(part(parts.skin, sculpt));
    if (parts.hair) {
      const hairMat = new MeshPhysicalMaterial({ color: p.hair, roughness: 0.42, sheen: 0.8, sheenRoughness: 0.35, sheenColor: new Color(p.hair).lerp(new Color('#ffffff'), 0.5) });
      own.push(hairMat);
      keep(part(parts.hair, hairMat));
    }
    if (parts.beard) keep(part(parts.beard, m(new Color(p.hair).multiplyScalar(0.8), 0.75)));

    const woman = p.preset === 'woman';
    const r = parts.eyeR;
    const white = m('#fbfaf7', 0.12);
    const limbal = m(new Color(p.eyes).multiplyScalar(0.45), 0.2);
    const iris = m(p.eyes, 0.2);
    const inner = m(p.eyesInner, 0.2);
    const pupil = m('#0d0a09', 0.1);
    const shine = new MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.8, roughness: 0.1 });
    own.push(shine);
    const lidSkin = m(p.skin, 0.62);
    const lash = m('#2a1d18', 0.6);
    // A cap of a sphere facing forward (+z): an iris or pupil on the eyeball's surface.
    const disc = (radius: number, angle: number, mat: MeshStandardMaterial) => part(new SphereGeometry(radius, 32, 10, 0, Math.PI * 2, 0, angle), mat, [0, 0, 0], [Math.PI / 2, 0, 0]);
    parts.eyes.forEach((at, i) => {
      const side = i === 0 ? -1 : 1;
      const e = new Group();
      e.userData.eye = true;
      e.position.set(...at);
      e.rotation.y = side * 0.06;
      const ballG = new Group();
      ballG.add(part(new SphereGeometry(r, 28, 20), white));
      ballG.add(disc(r * 1.002, 0.74, limbal));
      ballG.add(disc(r * 1.004, 0.66, iris));
      ballG.add(disc(r * 1.006, 0.42, inner));
      ballG.add(disc(r * 1.008, 0.3, pupil));
      e.add(ballG);
      // Catchlights stay put while the eye turns, as a window's reflection would.
      const glints = new Group();
      glints.add(part(ball(r * 0.2, 14, 10), shine, [r * 0.3, r * 0.34, r * 0.86]));
      glints.add(part(ball(r * 0.08, 10, 8), shine, [-r * 0.26, -r * 0.3, r * 0.9]));
      e.add(glints);
      e.userData.glints = glints;
      // The upper lid: the top half of a skin-coloured shell, tipped back to show the eye; a lash line
      // along its edge (fuller, with a flick at the corner, for her).
      const lid = new Group();
      lid.add(part(new SphereGeometry(r * 1.07, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2), lidSkin));
      lid.add(part(new TorusGeometry(r * 1.08, r * (woman ? 0.09 : 0.065), 8, 32, Math.PI), lash, [0, 0, 0], [Math.PI / 2, 0, 0]));
      if (woman) for (const k of [0.25, 0.45]) lid.add(part(capsule(r * 0.04, r * 0.22), lash, [side * Math.cos(k) * r * 1.12, r * 0.12, Math.sin(k) * r * 1.12], [0, 0, -side * 0.9]));
      e.add(lid);
      // Shut: a soft curve of lashes across the closed lid.
      const sleep = part(new TorusGeometry(r * 0.62, r * 0.07, 8, 24, Math.PI), lash, [0, r * 0.2, r * 1.0], [0, 0, Math.PI]);
      sleep.visible = false;
      e.add(sleep);
      e.userData.sleep = sleep;
      e.userData.ball = ballG;
      e.userData.lid = lid;
      h.add(e);
    });

    // Brows and a closed smile: smooth lines lying on the face.
    const line = (pts: V3[], radius: number, mat: MeshStandardMaterial) => {
      const curve = new CatmullRomCurve3(pts.map(v => new Vector3(...v)));
      h.add(part(new TubeGeometry(curve, 24, radius, 8, false), mat));
      for (const end of [pts[0], pts[pts.length - 1]]) h.add(part(ball(radius, 10, 8), mat, end));
    };
    const brow = m(new Color(p.hair).multiplyScalar(0.6), 0.8);
    for (const b of parts.brows) line(b, parts.browR, brow);
    if (parts.smile) line(parts.smile, R * 0.024, m('#6b2f2b', 0.5));
    return h;
  }

  // ---------- motion ----------

  protected override animate(dt: number, t: number, motion: boolean) {
    const s = this.state;
    const n = s?.night ?? 0;
    this.screens.emissiveIntensity = 0.5 + n * 1.2;
    if (!this.look.motion) this.openT = this.openTarget;
    else if (this.openT < this.openTarget) this.openT = Math.min(this.openTarget, this.openT + dt / PORTAL_S);
    else if (this.openT > this.openTarget) this.openT = Math.max(this.openTarget, this.openT - dt / PORTAL_S);
    if (this.openT === 0 && this.openTarget === 0) this.openKey = null;
    holoUniforms.uTime.value = performance.now() / 1000;
    this.figures.forEach(f => {
      f.stand.position.y = Math.sin(t * 0.7 + f.phase) * 0.02;
      f.stand.rotation.y = Math.sin(t * 0.3 + f.phase) * 0.03;
      for (const o of f.pad.children) o.scale.setScalar(1 + Math.sin(performance.now() / 260) * 0.015);

      if (motion) f.mixer?.update(dt);
      const asleep = f.state.asleep;
      const breathe = Math.sin(t * (asleep ? 1.2 : 2.1) + f.phase);
      f.chest.scale.y = 1 + breathe * 0.01;
      f.body.position.y = asleep ? 0 : Math.abs(Math.sin(t * 1.05 + f.phase)) * 0.008;
      f.body.rotation.z = asleep ? 0 : Math.sin(t * 0.45 + f.phase) * 0.03;
      if (motion) {
        f.nextLook -= dt;
        if (f.nextLook <= 0) {
          f.lookTarget = (Math.random() - 0.5) * 0.8;
          f.nextLook = 2.5 + Math.random() * 4;
        }
      }
      if (f.wave > 0) f.lookTarget = 0;
      f.look += (f.lookTarget - f.look) * (1 - Math.exp(-dt * 2.5));
      f.head.rotation.y = asleep ? 0 : f.look;
      f.head.rotation.z = asleep ? 0.3 : Math.sin(t * 0.6 + f.phase) * 0.05;
      f.head.rotation.x = asleep ? 0.2 : Math.sin(t * 0.4 + f.phase) * 0.03;
      if (motion) {
        f.nextBlink -= dt;
        if (f.nextBlink <= 0) {
          f.blink = 0.13;
          f.nextBlink = 2.5 + Math.random() * 4;
        }
        f.blink = Math.max(0, f.blink - dt);
      }
      // Lids: open, tipped back; shut, rolled down over the eye. The eyes lead where the head turns.
      const shut = asleep || f.blink > 0;
      const gaze = asleep ? 0 : MathUtils.clamp((f.lookTarget - f.look) * 1.4 + f.lookTarget * 0.3, -0.45, 0.45);
      for (const e of f.modelEyes ?? []) e.scale.y = shut ? 0.12 : 1;
      for (const e of f.eyes) {
        (e.userData.lid as Object3D).rotation.x = shut ? 1.5 : -0.95;
        (e.userData.sleep as Object3D).visible = shut;
        (e.userData.glints as Object3D).visible = !shut;
        const b = e.userData.ball as Object3D;
        b.rotation.y = gaze;
        b.rotation.x = -0.1;
      }
      // Waving with the right hand (and whatever is in it).
      if (motion) f.wave = Math.max(0, f.wave - dt);
      const lift = MathUtils.smoothstep(f.wave, 0, 0.35) * (f.wave > 0 ? 1 : 0);
      for (const a of f.arms) {
        const rest = a.side * (f.modelled ? 0.06 : f.state.preset === 'baby' ? 0.6 : 0.16) + (asleep ? 0 : Math.sin(t * 0.9 + f.phase + a.side) * 0.04);
        if (a.side > 0) {
          a.shoulder.rotation.z = MathUtils.lerp(rest, 2.6, lift);
          a.elbow.rotation.z = lift * Math.sin(t * 9) * 0.5;
        } else a.shoulder.rotation.z = rest;
      }
      f.zs.forEach((z, j) => {
        const a = (t * 0.35 + j / 3) % 1;
        z.position.set(0.25 + a * 0.25, 0.35 + a * 0.6, 0.1);
        z.scale.setScalar(0.12 + a * 0.16);
        (z.material as SpriteMaterial).opacity = Math.sin(a * Math.PI) * 0.9;
      });
      // The diorama's little motions: rotors, wings, hovering, steam, the lamp at night.
      for (const r of f.spin) r.rotation.y = t * 40;
      for (const w of f.flap) w.rotation.z = Math.sin(t * 14) * 0.9 * w.userData.side;
      f.hover.forEach((o, j) => {
        o.userData.base ??= o.position.clone();
        const b = o.userData.base;
        o.position.set(b.x + Math.sin(t * 0.8 + j) * 0.08, b.y + Math.sin(t * 1.6 + j) * 0.05, b.z + Math.cos(t * 0.8 + j) * 0.08);
      });
      f.steam.forEach(pf => {
        const a = (t * 0.4 + pf.userData.phase) % 1;
        pf.position.y = (pf.userData.base ?? 0.82) + a * 0.4;
        pf.scale.setScalar(0.08 + a * 0.18);
        (pf.material as SpriteMaterial).opacity = Math.sin(a * Math.PI) * 0.55;
      });
      f.stand.traverse(o => {
        const mat = (o as Mesh).material as MeshStandardMaterial | undefined;
        if (mat?.userData?.lamp) mat.emissiveIntensity = MathUtils.clamp((n - 0.2) * 3, 0, 2);
      });
    });
  }
}
