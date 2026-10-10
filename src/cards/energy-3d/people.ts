// The people view: each person as a stylised clay figurine (big head, big eyes, an open smile) standing
// on a small square diorama dressed with what they love: a kitchen and gadgets, a garden and a cosy corner,
// bugs and nature, diggers in a sandbox. The dioramas stand side by side (two rows on a narrow screen);
// tapping a name zooms in on that person. Who is away is faded; asleep: eyes shut and z's.
import {
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
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  TorusGeometry,
  TubeGeometry,
  Box3,
  Vector3,
  type BufferGeometry,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { armGeometry, BODY, bodyGeometry, headParts } from './figures';
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
  home: boolean;
  asleep: boolean;
}

export interface PeopleState extends StageLook {
  people: FigureState[];
}

interface Arm {
  shoulder: Group;
  elbow: Group;
  hand: Group;
  side: number;
}

interface Figure {
  state: FigureState;
  /** Their place in the family, and so in the row. */
  index: number;
  /** The whole diorama: base, props, figure. Moves in the carousel. */
  stand: Group;
  figure: Group;
  body: Group;
  head: Group;
  chest: Object3D;
  eyes: Group[];
  arms: Arm[];
  own: MeshStandardMaterial[];
  zs: Sprite[];
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
  /** Where the diorama stands. */
  spot: Vector3;
}

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

  protected override azimuth = 0;
  protected override elevation = 12;
  protected override allowYaw = false;

  setState(s: PeopleState) {
    this.state = s;
    const sig = s.people.map(p => [p.key, p.preset, p.hair, p.hairStyle, p.beard, p.skin, p.shirt, p.eyes, p.interests.join('+'), p.model].join('|')).join(';');
    if (sig !== this.signature) {
      this.signature = sig;
      this.build(s.people);
    }
    this.figures.forEach(f => {
      const p = s.people[f.index];
      f.state = p;
      // Away: the figure is faded (its diorama stays), so who is home reads at a glance.
      for (const m of f.own) {
        m.transparent = !p.home;
        m.opacity = p.home ? 1 : 0.45;
        m.depthWrite = p.home;
      }
      f.zs.forEach(z => (z.visible = p.asleep));
    });
    this.setLook(s);
  }

  protected override onFocus(key: string | null) {
    const f = this.figures.find(x => x.state.key === key);
    if (f) f.wave = 2.6;
  }

  /** Zoom in on the person, not the label over them. */
  protected override focusAt(key: string, node: Object3D, out: Vector3) {
    const f = this.figures.find(x => x.state.key === key);
    if (!f) return super.focusAt(key, node, out);
    f.stand.updateWorldMatrix(true, false);
    out.set(0, f.state.preset === 'baby' ? 0.55 : 0.85, 0);
    f.stand.localToWorld(out);
  }

  private building = 0;

  /**
   * One person at a time, a moment apart: sculpting a figure takes a fraction of a second, and this way
   * the page stays responsive and the dioramas appear one after another.
   */
  private build(people: FigureState[]) {
    const run = ++this.building;
    this.root.clear();
    this.anchors.clear();
    this.figures = [];
    // Names float where everyone will stand until they are there.
    for (const p of people) {
      const label = new Object3D();
      this.root.add(label);
      this.anchors.set(p.key, label);
    }
    this.layout();
    people.forEach((p, index) =>
      setTimeout(() => {
        if (run !== this.building) return;
        this.add(this.state?.people[index] ?? p, index);
        if (!this.look.motion) this.renderOnce();
      }, index * 30),
    );
  }

  private add(p: FigureState, index: number) {
    {
      const stand = new Group();
      const f = this.diorama(p, stand);
      f.index = index;
      // Hundreds of little clay parts become a few dozen meshes: one per material per moving group.
      f.chest.userData.keep = true;
      f.spin.forEach(r => (r.userData.keep = true));
      mergeStatic(stand);
      this.root.add(stand);
      this.figures.push(f);
      this.setState(this.state!);
      // The name goes over their head.
      const top = new Box3().setFromObject(f.figure).max.y;
      const label = this.anchors.get(p.key)!;
      this.root.remove(label);
      stand.add(label);
      label.position.set(0, top + 0.32, 0);
      this.layout();
    }
  }

  /**
   * Everyone side by side, in one row when there is room and two (the back row shifted so nobody is
   * hidden) on a narrow screen; framed to fit.
   */
  protected override layout() {
    super.layout();
    const n = this.state?.people.length ?? 0;
    if (!n) return;
    const aspect = this.camera.aspect;
    const rows = n > 2 && aspect < 1.3 ? 2 : 1;
    const perRow = Math.ceil(n / rows);
    const gap = 2.7;
    const spots = Array.from({ length: n }, (_, i) => {
      const row = Math.floor(i / perRow);
      const col = i % perRow;
      const inRow = Math.min(perRow, n - row * perRow);
      const shift = rows > 1 ? (row === 0 ? -0.55 : 0.55) : 0;
      return new Vector3((col - (inRow - 1) / 2) * gap + shift, 0, rows > 1 ? (row === 0 ? -2.1 : 2.1) : 0);
    });
    for (const f of this.figures) f.spot.copy(spots[f.index]);
    this.state?.people.forEach((p, i) => {
      const label = this.anchors.get(p.key);
      if (label?.parent === this.root) label.position.copy(spots[i]).setY(1.9);
    });
    this.elevation = rows > 1 ? 30 : 12;
    // Fit the width and the height of what is there.
    const halfW = ((perRow - 1) * gap) / 2 + 1.35 + (rows > 1 ? 0.55 : 0);
    const halfH = rows > 1 ? 2.6 : 1.35;
    this.framing.center.set(0, rows > 1 ? 0.4 : 0.75, 0);
    const vfov = MathUtils.degToRad(this.camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
    this.camDistance = Math.max(halfW / Math.tan(hfov / 2), halfH / Math.tan(vfov / 2)) + (rows > 1 ? 2 : 1.2);
    this.camera.near = 0.3;
    this.camera.far = this.camDistance + 80;
    this.camera.updateProjectionMatrix();
    this.focusDistance = aspect < 0.8 ? 7.2 : 6;
  }

  // ---------- the diorama ----------

  private diorama(p: FigureState, stand: Group): Figure {
    const ground = GROUND[p.interests[0] ?? 'nature'];
    // A thick square base with a soft edge, like a figurine stand: a coloured top over a darker side.
    stand.add(part(rbox(2.3, 0.42, 2.3, 0.12), clay('#4b4440'), [0, -0.3, 0]));
    stand.add(part(rbox(2.24, 0.16, 2.24, 0.08), clay(ground.edge), [0, -0.06, 0]));
    stand.add(part(rbox(2.2, 0.08, 2.2, 0.04), clay(ground.top), [0, 0.02, 0]));
    if (ground.kind === 'wood') for (let i = -3; i <= 3; i++) stand.add(part(rbox(0.012, 0.081, 2.18, 0.004), clay('#a37c54'), [i * 0.3, 0.02, 0]));
    if (ground.kind === 'grass') for (let i = 0; i < 18; i++) stand.add(part(new ConeGeometry(0.025, 0.12, 5), clay(i % 2 ? '#6fa35e' : '#7fae5f'), [Math.sin(i * 7.3) * 0.95, 0.11, Math.cos(i * 3.1) * 0.95], [0.2 * Math.sin(i), 0, 0.2 * Math.cos(i)]));
    if (ground.kind === 'sand') {
      for (const s of [-1, 1]) {
        stand.add(part(rbox(2.24, 0.14, 0.1, 0.03), clay('#c49a6c'), [0, 0.1, s * 1.08]));
        stand.add(part(rbox(0.1, 0.14, 2.24, 0.03), clay('#c49a6c'), [s * 1.08, 0.1, 0]));
      }
    }

    const f = this.figure(p);
    f.stand = stand;
    f.figure.position.set(0, 0.06, -0.02);
    stand.add(f.figure);
    if (p.model) this.loadModel(p.model, f);

    // Props for each interest, two slots each where there is room.
    const slots = [...SLOTS];
    const take = () => slots.shift();
    for (const interest of p.interests.slice(0, 3)) this.props(interest, stand, f, take);
    return f;
  }

  private props(interest: Interest, g: Group, f: Figure, take: () => [number, number] | undefined) {
    const at = (fn: (x: number, z: number) => void) => {
      const s = take();
      if (s) fn(s[0], s[1]);
    };
    switch (interest) {
      case 'cooking':
        // A little kitchen island: a stove with a steaming pot, and a board with vegetables.
        at((x, z) => {
          g.add(part(rbox(0.62, 0.5, 0.42, 0.04), clay('#f4f1ea'), [x, 0.3, z]));
          g.add(part(rbox(0.66, 0.05, 0.46, 0.02), clay('#45494f'), [x, 0.57, z]));
          for (const d of [-0.14, 0.14]) g.add(part(rbox(0.12, 0.08, 0.02, 0.01), clay('#c9ced3'), [x + d, 0.36, z + 0.215]));
          g.add(part(cyl(0.13, 0.16, 24), clay('#c9ced3', { metalness: 0.4, roughness: 0.35 }), [x - 0.1, 0.68, z]));
          g.add(part(cyl(0.135, 0.03, 24), clay('#9aa1a7', { metalness: 0.4 }), [x - 0.1, 0.77, z]));
          g.add(part(ball(0.025), clay('#33373b'), [x - 0.1, 0.8, z]));
          for (let i = 0; i < 4; i++) {
            const puff = new Sprite(new SpriteMaterial({ map: spriteTexture('puff'), transparent: true, depthWrite: false, opacity: 0.6 }));
            puff.position.set(x - 0.1, 0.85, z);
            puff.userData.phase = i / 4;
            g.add(puff);
            f.steam.push(puff);
          }
          g.add(part(rbox(0.2, 0.025, 0.14, 0.01), clay('#c49a6c'), [x + 0.18, 0.61, z + 0.05]));
          g.add(part(capsule(0.025, 0.08), clay('#e8893a'), [x + 0.15, 0.645, z + 0.05], [0, 0, Math.PI / 2]));
          g.add(part(ball(0.035), clay('#d9473f'), [x + 0.24, 0.65, z + 0.04]));
        });
        break;
      case 'tech':
        // A laptop with a glowing screen, and a small drone hovering over it.
        at((x, z) => {
          const lap = new Group();
          lap.position.set(x, 0.07, z);
          lap.rotation.y = x > 0 ? -0.5 : 0.5;
          lap.add(part(rbox(0.36, 0.025, 0.25, 0.01), clay('#c9ced3', { metalness: 0.3, roughness: 0.4 }), [0, 0.012, 0]));
          lap.add(part(rbox(0.36, 0.24, 0.02, 0.01), clay('#c9ced3', { metalness: 0.3, roughness: 0.4 }), [0, 0.13, -0.12], [-0.2, 0, 0]));
          lap.add(part(rbox(0.32, 0.2, 0.005, 0.004), this.screens, [0, 0.13, -0.108], [-0.2, 0, 0]));
          g.add(lap);
          const drone = new Group();
          drone.position.set(x, 0.85, z);
          drone.add(part(rbox(0.14, 0.04, 0.14, 0.02), clay('#33373b'), [0, 0, 0]));
          for (const [dx, dz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
            drone.add(part(capsule(0.012, 0.09), clay('#33373b'), [dx * 0.06, 0, dz * 0.06], [0, Math.atan2(dz, dx), Math.PI / 2]));
            const rotor = part(rbox(0.12, 0.004, 0.02, 0.002), clay('#c9ced3'), [dx * 0.1, 0.03, dz * 0.1]);
            drone.add(rotor);
            f.spin.push(rotor);
          }
          drone.add(part(ball(0.015), clay('#58c27a', { emissive: '#58c27a', emissiveIntensity: 1 }), [0, -0.01, 0.075]));
          g.add(drone);
          f.hover.push(drone);
        });
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
        const height = f.state.preset === 'baby' ? 0.95 : f.state.preset === 'child' ? 1.3 : 1.6;
        const k = height / Math.max(0.001, size.y);
        model.scale.setScalar(k);
        model.position.set(-((box.min.x + box.max.x) / 2) * k, -box.min.y * k, -((box.min.z + box.max.z) / 2) * k);
        model.traverse(o => {
          const m = o as Mesh;
          if (m.isMesh) {
            m.castShadow = true;
            m.receiveShadow = true;
          }
        });
        f.body.visible = false;
        f.figure.add(model);
        const clip = gltf.animations.find(c => /idle/i.test(c.name)) ?? gltf.animations[0];
        if (clip) {
          f.mixer = new AnimationMixer(model);
          f.mixer.clipAction(clip).play();
        }
      },
      err => console.warn('HyggeHub: could not load the model for', f.state.key, err),
    );
  }

  // ---------- the figurine ----------

  private figure(p: FigureState): Figure {
    const own: MeshStandardMaterial[] = [];
    const m = (color: string, roughness = 0.75, extra: Partial<{ metalness: number }> = {}) => {
      const mat = new MeshStandardMaterial({ color, roughness, metalness: extra.metalness ?? 0 });
      own.push(mat);
      return mat;
    };
    const likes = (i: Interest) => p.interests.includes(i);
    // The sculpted clay: one material, the colours in the vertices.
    const sculpt = new MeshStandardMaterial({ vertexColors: true, roughness: 0.66 });
    own.push(sculpt);
    const piece = (geo: BufferGeometry) => {
      const mesh = part(geo, sculpt);
      mesh.userData.keep = true;
      return mesh;
    };
    const figure = new Group();
    const body = new Group();
    figure.add(body);
    const arms: Arm[] = [];
    let head: Group;
    const chest = piece(bodyGeometry(p));
    body.add(chest);

    if (p.preset === 'baby') {
      // Sitting, arms reaching out a little.
      for (const side of [-1, 1]) {
        const shoulder = new Group();
        shoulder.position.set(side * 0.21, 0.38, 0.02);
        shoulder.rotation.z = side * 0.6;
        shoulder.add(piece(armGeometry(p, side).upper));
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
        const g = armGeometry(p, side);
        const shoulder = new Group();
        shoulder.position.set(side * b.torsoW * 0.92, b.legH + b.torsoH * 0.84, 0);
        shoulder.add(piece(g.upper));
        const elbow = new Group();
        elbow.position.set(0, -g.len, 0);
        elbow.rotation.x = -0.25;
        elbow.add(piece(g.fore));
        const hand = new Group();
        hand.position.set(0, -g.len - 0.03, 0.01);
        elbow.add(hand);
        shoulder.add(elbow);
        body.add(shoulder);
        arms.push({ shoulder, elbow, hand, side });
      }
      // Something in the right hand.
      const right = arms.find(a => a.side > 0)!.hand;
      if (likes('cooking')) {
        right.add(part(capsule(0.014, 0.16), m('#5a4636'), [0, -0.04, 0.03], [0.4, 0, 0]));
        right.add(part(rbox(0.09, 0.012, 0.11, 0.006), m('#c9ced3', 0.35, { metalness: 0.6 }), [0, -0.1, 0.13], [0.4 + Math.PI / 2, 0, 0]));
      } else if (likes('gardening')) {
        right.add(part(cyl(0.008, 0.22, 6), m('#5f9a52'), [0, 0.07, 0.03]));
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2;
          right.add(part(ball(0.03, 10, 8), m('#ec9fb0'), [Math.cos(a) * 0.035, 0.19, 0.03 + Math.sin(a) * 0.035], [0, 0, 0], [1, 0.6, 1]));
        }
        right.add(part(ball(0.022, 8, 6), m('#f2cf5a'), [0, 0.2, 0.03]));
      } else if (likes('bugs')) {
        right.add(part(capsule(0.015, 0.1), m('#8a6446'), [0, 0.03, 0.03]));
        right.add(part(new TorusGeometry(0.06, 0.012, 8, 24), m('#33373b'), [0, 0.15, 0.03]));
        right.add(part(cyl(0.055, 0.006, 24), new MeshStandardMaterial({ color: '#cfe8f5', transparent: true, opacity: 0.5, roughness: 0.1 }), [0, 0.15, 0.03], [Math.PI / 2, 0, 0]));
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
    return {
      state: p,
      index: 0,
      stand: new Group(),
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
      spot: new Vector3(),
    };
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
    if (parts.hair) keep(part(parts.hair, m(p.hair, 0.55)));
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
    this.figures.forEach(f => {
      f.stand.position.set(f.spot.x, f.spot.y + Math.sin(t * 0.7 + f.phase) * 0.02, f.spot.z);
      f.stand.rotation.y = Math.sin(t * 0.3 + f.phase) * 0.03 - f.spot.x * 0.03;

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
        const rest = a.side * (f.state.preset === 'baby' ? 0.6 : 0.16) + (asleep ? 0 : Math.sin(t * 0.9 + f.phase + a.side) * 0.04);
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
        pf.position.y = 0.82 + a * 0.4;
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
