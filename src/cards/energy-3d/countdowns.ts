// The countdowns view: one square diorama per countdown, like the people's, dressed for what it counts
// down to, with the countdown written on the things in it rather than in a label: a birthday cake with
// the name iced on it, the age as a topper and the days left on the present's tag; a Christmas tree with
// a signpost and a tag on the presents; a beach towel on a lounger and a surfboard; a signpost and a
// suitcase for a trip; a chalkboard for anything else. Soonest first, in a carousel.
import {
  CanvasTexture,
  ConeGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  OctahedronGeometry,
  PlaneGeometry,
  SRGBColorSpace,
  TorusGeometry,
  type Object3D,
} from 'three';
import { ball, capsule, ClayStage, clay, disc, mergeStatic, part, rbox, type StageLook } from './stage';
import type { Theme } from './themes';

export type { Theme };

export interface IslandState {
  key: string;
  theme: Theme;
  /** 0-1, how much of the wait has passed. */
  progress: number;
  done: boolean;
  name: string;
  /** The description, if the countdown has one. */
  subtitle?: string;
  /** The time left, as a number and its unit ("21" "days"), or the whole of it ("Today!", ""). */
  big: string;
  unit: string;
  /** The day it is, e.g. "Sun 1 Nov". */
  when: string;
  /** For a birthday: how old they turn. */
  age?: number;
}

export interface CountdownsState extends StageLook {
  /** Soonest first. */
  items: IslandState[];
  accent: string;
  /** The diorama in front; the ones either side wait smaller behind it. */
  index: number;
}

interface Island {
  state: IslandState;
  group: Group;
  phase: number;
  /** What the countdown is written on; repainted when its text changes. */
  writing: Array<() => void>;
  wrote: string;
  spin: Object3D[];
  bob: Object3D[];
  flames: Mesh[];
  waves: Object3D[];
  /** Springs: where it is in the carousel, its size, and their speeds. */
  x: number;
  vx: number;
  z: number;
  vz: number;
  s: number;
  vs: number;
}

type Ink = CanvasRenderingContext2D;

const FONT = `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`;

/** Text on a canvas, centred on x by default, shrunk to fit `max` wide. */
function write(g: Ink, text: string, x: number, y: number, size: number, colour: string, opts: { weight?: number; max?: number; align?: CanvasTextAlign } = {}) {
  let s = size;
  g.font = `${opts.weight ?? 700} ${s}px ${FONT}`;
  if (opts.max) {
    while (s > 10 && g.measureText(text).width > opts.max) {
      s -= 2;
      g.font = `${opts.weight ?? 700} ${s}px ${FONT}`;
    }
  }
  g.fillStyle = colour;
  g.textAlign = opts.align ?? 'center';
  g.textBaseline = 'middle';
  g.fillText(text, x, y);
}

function roundRect(g: Ink, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/**
 * A flat surface with writing on it, `w` by `h` in the scene, facing +z: the front of a sign, a tag, a
 * towel. `paint` draws it (W by H canvas pixels); call the returned function to draw it again.
 */
function surface(w: number, h: number, paint: (g: Ink, W: number, H: number) => void) {
  const c = document.createElement('canvas');
  const W = Math.round(Math.min(1024, w * 300));
  const H = Math.round(Math.min(1024, h * 300));
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  const mesh = new Mesh(new PlaneGeometry(w, h), new MeshStandardMaterial({ map: tex, roughness: 0.85, transparent: true }));
  mesh.receiveShadow = true;
  mesh.userData.keep = true;
  const redraw = () => {
    g.clearRect(0, 0, W, H);
    paint(g, W, H);
    tex.needsUpdate = true;
  };
  redraw();
  return { mesh, redraw };
}

/** The ground of each theme's diorama. */
const GROUND: Record<Theme, { top: string; edge: string }> = {
  beach: { top: '#ead7a6', edge: '#c9a46e' },
  gift: { top: '#8dbb67', edge: '#b88a63' },
  christmas: { top: '#f3f6f8', edge: '#b88a63' },
  mountain: { top: '#8dbb67', edge: '#a2958a' },
  generic: { top: '#c49a6c', edge: '#8a6446' },
};

export class CountdownScene extends ClayStage {
  private islands: Island[] = [];
  private signature = '';
  private state?: CountdownsState;

  protected override azimuth = 0;
  protected override elevation = 18;
  // Swipes change the countdown instead of turning the camera.
  protected override allowYaw = false;

  setState(s: CountdownsState) {
    this.state = s;
    const sig = s.items.map(i => `${i.key}|${i.theme}`).join(';');
    if (sig !== this.signature) {
      this.signature = sig;
      this.build(s.items);
    }
    this.islands.forEach((isl, i) => {
      isl.state = s.items[i];
      // Repaint what's written on it when the text changes (the minutes ticking down).
      const text = JSON.stringify(isl.state);
      if (text !== isl.wrote) {
        isl.wrote = text;
        isl.writing.forEach(f => f());
      }
    });
    this.setLook(s);
  }

  private build(items: IslandState[]) {
    this.root.clear();
    this.anchors.clear();
    this.islands = [];
    items.forEach((it, i) => {
      const g = new Group();
      // Start small and off to the side, so the first frame already bounces into place.
      const isl: Island = { state: it, group: g, phase: i * 1.7, writing: [], wrote: '', spin: [], bob: [], flames: [], waves: [], x: (i - (this.state?.index ?? 0)) * 4, vx: 0, z: 0, vz: 0, s: 0, vs: 0 };
      this.diorama(isl);
      isl.wrote = JSON.stringify(it);
      for (const o of [...isl.spin, ...isl.bob, ...isl.flames, ...isl.waves]) o.userData.keep = true;
      mergeStatic(g);
      this.root.add(g);
      this.islands.push(isl);
    });
    // The camera frames the front diorama with a glimpse of its neighbours.
    this.framing.center.set(0, 0.95, 0.2);
    this.framing.radius = 2.25;
    this.layout();
  }

  /** A square base like the people's, then the theme's things on it. */
  private diorama(isl: Island) {
    const g = isl.group;
    const theme = isl.state.theme;
    const ground = GROUND[theme];
    g.add(part(rbox(3.0, 0.46, 3.0, 0.14), clay('#4b4440'), [0, -0.31, 0]));
    g.add(part(rbox(2.94, 0.16, 2.94, 0.08), clay(ground.edge), [0, -0.06, 0]));
    g.add(part(rbox(2.9, 0.08, 2.9, 0.04), clay(ground.top), [0, 0.02, 0]));
    // Writing on things, kept up to date.
    const sign = (w: number, h: number, paint: (g: Ink, W: number, H: number) => void) => {
      const s = surface(w, h, (c, W, H) => paint(c, W, H));
      isl.writing.push(s.redraw);
      return s.mesh;
    };
    const st = () => isl.state;
    const left = () => (st().unit ? `${st().big} ${st().unit}` : st().big);
    const accent = this.state?.accent ?? '#2f6e86';

    switch (theme) {
      case 'gift': {
        // A two-tier birthday cake with the name iced on the front and the age as a topper.
        const cake = new Group();
        cake.position.set(0.15, 0.06, 0.35);
        cake.add(part(disc(0.62, 0.42, 40), clay('#f4dcc8'), [0, 0.21, 0]));
        cake.add(part(new TorusGeometry(0.62, 0.05, 10, 40), clay('#f7eadf'), [0, 0.42, 0], [Math.PI / 2, 0, 0]));
        cake.add(part(disc(0.44, 0.34, 40), clay('#ec9fb0'), [0, 0.6, 0]));
        cake.add(part(new TorusGeometry(0.44, 0.045, 10, 40), clay('#f7d0da'), [0, 0.77, 0], [Math.PI / 2, 0, 0]));
        for (let i = 0; i < 14; i++) {
          const a = (i / 14) * Math.PI * 2;
          cake.add(part(ball(0.045, 8, 6), clay(['#e86a5a', '#f2cf5a', '#5fb3d6', '#8dbb67'][i % 4]), [Math.cos(a) * 0.62, 0.05, Math.sin(a) * 0.62]));
        }
        cake.add(part(disc(0.6, 0.04, 40), clay('#f4f1ea'), [0, 0.0, 0]));
        // The name, iced on a plaque on the front of the bottom tier.
        const plaque = sign(0.82, 0.26, (c, W, H) => {
          roundRect(c, 4, 4, W - 8, H - 8, H / 2 - 4);
          c.fillStyle = '#fff7f0';
          c.fill();
          c.lineWidth = 6;
          c.strokeStyle = '#ec9fb0';
          c.stroke();
          write(c, st().name, W / 2, H / 2 + 2, H * 0.55, '#c2557a', { max: W - 40 });
        });
        plaque.position.set(0, 0.22, 0.64);
        cake.add(plaque);
        // The age as a topper on a stick (or a heart), candles round it.
        const topper = sign(0.5, 0.4, (c, W, H) => {
          const a = st().age;
          write(c, a ? String(a) : '♥', W / 2, H / 2 + 4, H * 0.95, '#f2b632', { weight: 900 });
          c.lineWidth = 8;
          c.strokeStyle = '#b5761e';
          c.strokeText(a ? String(a) : '♥', W / 2, H / 2 + 4);
          write(c, a ? String(a) : '♥', W / 2, H / 2 + 4, H * 0.95, '#f2b632', { weight: 900 });
        });
        topper.position.set(0, 1.2, 0);
        cake.add(topper);
        cake.add(part(disc(0.012, 0.3, 6), clay('#f4f1ea'), [0, 0.92, 0]));
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2 + 0.3;
          const x = Math.cos(a) * 0.3;
          const z = Math.sin(a) * 0.3;
          cake.add(part(disc(0.022, 0.18, 8), clay(['#5fb3d6', '#f4f1ea', '#e86a5a'][i % 3]), [x, 0.86, z]));
          const flame = part(ball(0.035, 8, 6), clay('#ffd27a', { emissive: '#ffb347', emissiveIntensity: 1.6 }), [x, 0.99, z], [0, 0, 0], [1, 1.5, 1]);
          isl.flames.push(flame);
          cake.add(flame);
        }
        g.add(cake);
        // A present with a tag saying how long is left.
        const box = new Group();
        box.position.set(-0.95, 0.06, -0.35);
        box.rotation.y = 0.45;
        box.add(part(rbox(0.7, 0.6, 0.7, 0.05), clay(accent), [0, 0.3, 0]));
        box.add(part(rbox(0.75, 0.12, 0.75, 0.04), clay(accent), [0, 0.62, 0]));
        box.add(part(rbox(0.12, 0.64, 0.76, 0.02), clay('#f4f1ea'), [0, 0.32, 0]));
        box.add(part(rbox(0.76, 0.64, 0.12, 0.02), clay('#f4f1ea'), [0, 0.32, 0]));
        for (const s of [-1, 1]) box.add(part(new TorusGeometry(0.12, 0.04, 8, 20), clay('#f4f1ea'), [s * 0.1, 0.76, 0], [0, s * 0.5, 0]));
        g.add(box);
        const tag = new Group();
        tag.position.set(-0.78, 0.5, 0.12);
        tag.rotation.set(-0.12, 0.15, 0.04);
        tag.add(part(rbox(0.62, 0.42, 0.015, 0.03), clay('#f6efd9'), [0, 0, -0.01]));
        tag.add(part(new TorusGeometry(0.03, 0.008, 6, 12), clay('#c9a45a'), [0, 0.18, 0.005]));
        const tagText = sign(0.6, 0.4, (c, W, H) => {
          write(c, st().big, W / 2, H * 0.36, H * 0.42, '#3a2b22', { weight: 900, max: W - 20 });
          write(c, st().unit || st().when, W / 2, H * 0.72, H * 0.2, '#6b4f3a', { weight: 600, max: W - 20 });
        });
        tagText.position.z = 0.0;
        tag.add(tagText);
        g.add(tag);
        // Balloons on strings, swaying; a banner with the description (or a happy birthday) at the back.
        for (const [x, z, c, h] of [[1.0, -0.6, '#e86a5a', 1.9], [1.25, -0.25, '#5fb3d6', 1.65], [0.8, -0.9, '#f2cf5a', 2.1]] as const) {
          const b = new Group();
          b.position.set(x, 0.06, z);
          b.add(part(disc(0.006, h, 4), clay('#f4f1ea'), [0, h / 2, 0]));
          b.add(part(ball(0.2, 16, 12), clay(c, { roughness: 0.35 }), [0, h + 0.18, 0], [0, 0, 0], [1, 1.15, 1]));
          isl.bob.push(b);
          g.add(b);
        }
        for (const s of [-1, 1]) g.add(part(disc(0.025, 1.5, 8), clay('#9a7556'), [s * 0.95 - 0.2, 0.8, -1.25]));
        const banner = sign(1.85, 0.36, (c, W, H) => {
          roundRect(c, 0, 0, W, H, 18);
          c.fillStyle = '#fff3f6';
          c.fill();
          write(c, st().subtitle ?? (st().age ? `Happy birthday ${st().name}!` : st().name), W / 2, H / 2 + 2, H * 0.48, '#c2557a', { max: W - 40 });
        });
        banner.position.set(-0.2, 1.32, -1.24);
        g.add(banner);
        break;
      }
      case 'christmas': {
        // A decorated tree with a star, presents with a tag under it, a snowman, and a signpost.
        const tree = new Group();
        tree.position.set(-0.55, 0.06, -0.45);
        tree.add(part(disc(0.1, 0.4, 10), clay('#9a7556'), [0, 0.2, 0]));
        [[0.95, 0.9, 0.75], [0.74, 0.8, 1.3], [0.5, 0.7, 1.8]].forEach(([r, h, y]) => tree.add(part(new ConeGeometry(r, h, 14), clay('#43785a'), [0, y, 0])));
        const colours = ['#e86a5a', '#f2cf5a', '#5fb3d6', '#ec9fb0'];
        for (let i = 0; i < 16; i++) {
          const a = i * 2.4;
          const y = 0.55 + (i / 16) * 1.5;
          const r = 0.86 - (i / 16) * 0.58;
          tree.add(part(ball(0.065, 10, 8), clay(colours[i % 4], { emissive: colours[i % 4], emissiveIntensity: 0.3 }), [Math.cos(a) * r, y, Math.sin(a) * r]));
        }
        const star = part(new OctahedronGeometry(0.17), clay('#f2cf5a', { emissive: '#f2cf5a', emissiveIntensity: 0.9 }), [0, 2.27, 0]);
        tree.add(star);
        isl.spin.push(star);
        g.add(tree);
        const gift = new Group();
        gift.position.set(0.25, 0.06, 0.25);
        gift.rotation.y = -0.3;
        gift.add(part(rbox(0.5, 0.42, 0.5, 0.04), clay('#d9473f'), [0, 0.21, 0]));
        gift.add(part(rbox(0.09, 0.44, 0.52, 0.02), clay('#f2cf5a'), [0, 0.22, 0]));
        gift.add(part(rbox(0.52, 0.44, 0.09, 0.02), clay('#f2cf5a'), [0, 0.22, 0]));
        gift.add(part(rbox(0.36, 0.3, 0.36, 0.04), clay('#5fb3d6'), [0.5, 0.15, 0.15]));
        const tag = new Group();
        tag.position.set(0, 0.24, 0.27);
        tag.add(part(rbox(0.42, 0.3, 0.012, 0.03), clay('#f6efd9'), [0, 0, -0.008]));
        tag.add(sign(0.4, 0.28, (c, W, H) => {
          write(c, st().big, W / 2, H * 0.38, H * 0.44, '#8a2b24', { weight: 900, max: W - 16 });
          write(c, st().unit, W / 2, H * 0.76, H * 0.2, '#6b4f3a', { weight: 600 });
        }));
        gift.add(tag);
        g.add(gift);
        // The snowman.
        const snow = clay('#f7f9fb');
        g.add(part(ball(0.3, 18, 14), snow, [-1.05, 0.33, 0.75]));
        g.add(part(ball(0.21, 18, 14), snow, [-1.05, 0.75, 0.75]));
        g.add(part(new ConeGeometry(0.04, 0.16, 8), clay('#f07a2a'), [-1.05, 0.76, 0.98], [Math.PI / 2, 0, 0]));
        for (const s of [-1, 1]) g.add(part(ball(0.022), clay('#1f1a17'), [-1.05 + s * 0.07, 0.82, 0.94]));
        g.add(part(new TorusGeometry(0.17, 0.045, 8, 24), clay('#d9473f'), [-1.05, 0.6, 0.75], [Math.PI / 2, 0, 0]));
        // A wooden signpost: the name on one board, the day on the other.
        const post = new Group();
        post.position.set(0.95, 0.06, 0.2);
        post.rotation.y = -0.25;
        post.add(part(rbox(0.08, 1.5, 0.08, 0.02), clay('#8a6446'), [0, 0.75, 0]));
        post.add(part(rbox(1.0, 0.36, 0.05, 0.03), clay('#a37c54'), [0, 1.25, 0.05]));
        post.add(part(rbox(0.9, 0.26, 0.05, 0.03), clay('#a37c54'), [0, 0.86, 0.05], [0, 0, -0.04]));
        const n1 = sign(0.96, 0.32, (c, W, H) => write(c, st().name, W / 2, H / 2 + 2, H * 0.58, '#f6efd9', { max: W - 30 }));
        n1.position.set(0, 1.25, 0.08);
        post.add(n1);
        const n2 = sign(0.86, 0.22, (c, W, H) => write(c, st().subtitle ?? st().when, W / 2, H / 2 + 2, H * 0.66, '#f6efd9', { weight: 700, max: W - 24 }));
        n2.position.set(0, 0.86, 0.08);
        n2.rotation.z = -0.04;
        post.add(n2);
        post.add(part(rbox(1.04, 0.06, 0.12, 0.03), snow, [0, 1.45, 0.05]));
        g.add(post);
        break;
      }
      case 'beach': {
        // Sea along the back, a palm, a parasol over a lounger with the towel on it (the name and the
        // date printed on the towel), a surfboard in the sand with the days on it, a sandcastle.
        const sea = part(rbox(2.9, 0.06, 0.9, 0.03), clay('#5fb3d6', { roughness: 0.15 }), [0, 0.05, -1.0]);
        g.add(sea);
        const foam = part(rbox(2.9, 0.065, 0.1, 0.03), clay('#f4f9fb'), [0, 0.06, -0.55]);
        g.add(foam);
        isl.waves.push(foam);
        const palm = new Group();
        palm.position.set(-1.05, 0.06, -0.3);
        for (let i = 0; i < 8; i++) palm.add(part(disc(0.11 - i * 0.008, 0.22, 14), clay('#9a7556'), [i * 0.055, 0.11 + i * 0.22, 0], [0, 0, -0.1 - i * 0.02]));
        const crown = new Group();
        crown.position.set(0.44, 1.78, 0);
        for (let i = 0; i < 7; i++) {
          const a = (i / 7) * Math.PI * 2;
          crown.add(part(ball(0.42, 16, 10), clay('#5f9a52'), [Math.cos(a) * 0.4, -0.08, Math.sin(a) * 0.4], [0, -a, -0.5], [1.4, 0.18, 0.45]));
        }
        for (const [x, z] of [[0.08, 0.06], [-0.06, 0.08], [0.02, -0.08]]) crown.add(part(ball(0.08, 12, 10), clay('#6b4528'), [x, -0.12, z]));
        palm.add(crown);
        isl.bob.push(crown);
        g.add(palm);
        // The lounger, tipped back, with the towel.
        const lounger = new Group();
        lounger.position.set(0.05, 0.06, 0.45);
        lounger.add(part(rbox(0.9, 0.05, 0.75, 0.02), clay('#f4f1ea'), [0, 0.22, 0.25]));
        for (const s of [-1, 1]) for (const z of [-0.1, 0.55]) lounger.add(part(disc(0.025, 0.22, 6), clay('#c9ced3'), [s * 0.4, 0.11, z]));
        // The back rest rises from the rear of the seat, leaning back, the towel draped over it.
        const back = new Group();
        back.position.set(0, 0.24, -0.12);
        back.rotation.x = -0.5;
        back.add(part(rbox(0.9, 0.9, 0.05, 0.02), clay('#f4f1ea'), [0, 0.45, 0]));
        const towel = sign(0.82, 0.86, (c, W, H) => {
          const stripes = ['#e86a5a', '#f6efd9', '#5fb3d6', '#f6efd9'];
          for (let i = 0; i < 8; i++) {
            c.fillStyle = stripes[i % 4];
            c.fillRect(0, (i * H) / 8, W, H / 8 + 1);
          }
          roundRect(c, W * 0.08, H * 0.18, W * 0.84, H * 0.64, 24);
          c.fillStyle = 'rgba(255,255,255,0.92)';
          c.fill();
          write(c, st().name, W / 2, H * 0.4, H * 0.2, '#2b6f8a', { weight: 900, max: W * 0.78 });
          write(c, st().when, W / 2, H * 0.62, H * 0.12, '#e86a5a', { weight: 700, max: W * 0.78 });
        });
        towel.position.set(0, 0.45, 0.03);
        back.add(towel);
        lounger.add(back);
        g.add(lounger);
        // A parasol over it.
        g.add(part(capsule(0.025, 1.6), clay('#f2eee6'), [0.75, 0.86, 0.1]));
        g.add(part(new ConeGeometry(0.8, 0.36, 12), clay('#e86a5a'), [0.75, 1.72, 0.1]));
        g.add(part(ball(0.06), clay('#f2eee6'), [0.75, 1.92, 0.1]));
        // A surfboard stuck in the sand with the description (or the days) along it.
        const board = new Group();
        board.position.set(1.15, 0.06, -0.35);
        board.rotation.set(0, -0.5, 0.12);
        board.add(part(ball(0.5, 24, 16), clay('#f2cf5a', { roughness: 0.35 }), [0, 0.62, 0], [0, 0, 0], [0.34, 1.35, 0.06]));
        const text = sign(0.28, 1.1, (c, W, H) => {
          c.save();
          c.translate(W / 2, H / 2);
          c.rotate(-Math.PI / 2);
          write(c, left(), 0, 0, W * 0.62, '#2b6f8a', { weight: 900, max: H * 0.86 });
          c.restore();
        });
        text.position.set(0, 0.62, 0.032);
        board.add(text);
        g.add(board);
        // A sandcastle and a ball.
        g.add(part(disc(0.22, 0.2, 16), clay('#d9bf86'), [-0.7, 0.16, 0.85]));
        g.add(part(disc(0.14, 0.18, 16), clay('#d9bf86'), [-0.7, 0.34, 0.85]));
        g.add(part(disc(0.008, 0.25, 4), clay('#6b4f3a'), [-0.7, 0.55, 0.85]));
        g.add(part(rbox(0.14, 0.09, 0.01, 0.005), clay('#e86a5a'), [-0.63, 0.63, 0.85]));
        g.add(part(ball(0.14), clay('#f2cf5a'), [0.75, 0.2, 1.05]));
        break;
      }
      case 'mountain': {
        // Snow-capped peaks at the back, a plane circling them, a signpost with arrows and a suitcase
        // with a luggage tag in front.
        for (const [x, z, h, r] of [[-0.7, -0.8, 2.0, 0.95], [0.45, -0.9, 1.5, 0.78], [1.15, -0.6, 1.0, 0.55]]) {
          g.add(part(new ConeGeometry(r, h, 10), clay('#8f8a86'), [x, h / 2 + 0.06, z]));
          g.add(part(new ConeGeometry(r * 0.38, h * 0.38, 10), clay('#f3f6f8'), [x, h * 0.81 + 0.06, z]));
        }
        g.add(part(new ConeGeometry(0.26, 0.6, 8), clay('#4f8a5c'), [-1.1, 0.36, 0.5]));
        g.add(part(new ConeGeometry(0.2, 0.46, 8), clay('#4f8a5c'), [-0.85, 0.29, 0.85]));
        const orbit = new Group();
        const plane = new Group();
        plane.position.set(1.4, 2.45, 0);
        plane.add(part(capsule(0.08, 0.5), clay('#f4f1ea'), [0, 0, 0], [Math.PI / 2, 0, 0]));
        plane.add(part(rbox(0.9, 0.03, 0.18, 0.01), clay('#f4f1ea'), [0, 0, 0.02]));
        plane.add(part(rbox(0.3, 0.03, 0.1, 0.01), clay('#e86a5a'), [0, 0.02, -0.3]));
        plane.add(part(rbox(0.03, 0.18, 0.12, 0.01), clay('#e86a5a'), [0, 0.1, -0.3]));
        orbit.add(plane);
        g.add(orbit);
        isl.spin.push(orbit);
        const post = new Group();
        post.position.set(0.0, 0.06, 0.2);
        post.add(part(rbox(0.08, 1.55, 0.08, 0.02), clay('#8a6446'), [0, 0.78, 0]));
        const arrow = (y: number, dir: number, w: number) => {
          const a = new Group();
          a.position.set(dir * (w / 2 - 0.05), y, 0.06);
          a.add(part(rbox(w, 0.3, 0.05, 0.02), clay('#e9e0cc'), [0, 0, 0]));
          a.add(part(new ConeGeometry(0.17, 0.18, 3), clay('#e9e0cc'), [dir * (w / 2 + 0.08), 0, 0], [0, 0, -dir * (Math.PI / 2)], [1, 1, 0.3]));
          post.add(a);
          return a;
        };
        const a1 = arrow(1.3, 1, 1.1);
        const n1 = sign(1.06, 0.28, (c, W, H) => write(c, st().name, W / 2, H / 2 + 2, H * 0.62, '#3a2b22', { max: W - 30 }));
        n1.position.z = 0.03;
        a1.add(n1);
        const a2 = arrow(0.92, -1, 1.0);
        const n2 = sign(0.96, 0.28, (c, W, H) => write(c, left(), W / 2, H / 2 + 2, H * 0.62, '#2b6f8a', { max: W - 30 }));
        n2.position.z = 0.03;
        a2.add(n2);
        g.add(post);
        const bag = new Group();
        bag.position.set(0.85, 0.06, 0.75);
        bag.rotation.y = -0.4;
        bag.add(part(rbox(0.6, 0.48, 0.24, 0.06), clay('#5f8fb8'), [0, 0.3, 0]));
        bag.add(part(new TorusGeometry(0.1, 0.02, 8, 16, Math.PI), clay('#33373b'), [0, 0.55, 0]));
        for (const s of [-1, 1]) bag.add(part(disc(0.04, 0.03, 10), clay('#33373b'), [s * 0.22, 0.04, 0], [Math.PI / 2, 0, 0]));
        const tag = sign(0.36, 0.22, (c, W, H) => {
          roundRect(c, 2, 2, W - 4, H - 4, 14);
          c.fillStyle = '#f6efd9';
          c.fill();
          write(c, st().subtitle ?? st().when, W / 2, H / 2 + 2, H * 0.36, '#3a2b22', { weight: 600, max: W - 20 });
        });
        tag.position.set(0.15, 0.32, 0.13);
        tag.rotation.z = 0.12;
        bag.add(tag);
        g.add(bag);
        break;
      }
      default: {
        // A chalkboard on an easel with everything on it, bunting over it, a plant beside it.
        const easel = new Group();
        easel.position.set(0, 0.06, 0.05);
        easel.rotation.x = -0.12;
        for (const s of [-1, 1]) easel.add(part(rbox(0.07, 1.9, 0.07, 0.02), clay('#8a6446'), [s * 0.7, 0.95, 0], [0, 0, s * -0.08]));
        easel.add(part(rbox(1.7, 1.1, 0.06, 0.04), clay('#6b4f3a'), [0, 1.15, 0.05]));
        const board = sign(1.58, 0.98, (c, W, H) => {
          c.fillStyle = '#2f3b36';
          c.fillRect(0, 0, W, H);
          write(c, st().name, W / 2, H * 0.2, H * 0.14, '#f4f1ea', { max: W - 60 });
          write(c, st().big, W / 2, H * 0.48, H * 0.3, '#f2cf5a', { weight: 900, max: W - 60 });
          write(c, st().unit, W / 2, H * 0.68, H * 0.09, '#f4f1ea', { weight: 600 });
          write(c, st().subtitle ?? st().when, W / 2, H * 0.86, H * 0.075, '#c9d4cf', { weight: 500, max: W - 60 });
          // The progress as a chalk line along the bottom.
          c.strokeStyle = 'rgba(244,241,234,0.35)';
          c.lineWidth = 8;
          c.beginPath();
          c.moveTo(W * 0.12, H * 0.95);
          c.lineTo(W * 0.88, H * 0.95);
          c.stroke();
          c.strokeStyle = '#f2cf5a';
          c.beginPath();
          c.moveTo(W * 0.12, H * 0.95);
          c.lineTo(W * (0.12 + 0.76 * Math.max(0, Math.min(1, st().progress))), H * 0.95);
          c.stroke();
        });
        board.position.set(0, 1.15, 0.085);
        easel.add(board);
        easel.add(part(rbox(1.75, 0.05, 0.14, 0.02), clay('#8a6446'), [0, 0.57, 0.1]));
        g.add(easel);
        const flags = ['#e86a5a', '#f2cf5a', '#5fb3d6', '#8dbb67', '#ec9fb0'];
        for (let i = 0; i < 9; i++) {
          const x = -1.1 + i * 0.275;
          g.add(part(new ConeGeometry(0.09, 0.2, 3), clay(flags[i % 5]), [x, 2.15 - Math.sin((i / 8) * Math.PI) * 0.18, -0.6], [Math.PI, 0, 0], [1, 1, 0.2]));
        }
        g.add(part(cyl(0.18, 0.3), clay('#d07a52'), [-1.05, 0.21, 0.7]));
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          g.add(part(ball(0.16, 12, 8), clay(i % 2 ? '#5f9a52' : '#6fa35e'), [-1.05 + Math.cos(a) * 0.12, 0.5 + (i % 2) * 0.12, 0.7 + Math.sin(a) * 0.12]));
        }
      }
    }
    // Writing that is the same colour on every frame doesn't need to be repainted until it changes.
    isl.writing.forEach(f => f());
  }

  protected override animate(dt: number, t: number, motion: boolean) {
    const index = this.state?.index ?? 0;
    // Springs a little under-damped, so the dioramas overshoot and bounce into their places.
    // Integrated in small steps, so the bounce takes the same time at any frame rate.
    const spring = (x: number, v: number, target: number, k: number, d: number) => {
      if (!motion || dt === 0) return [target, 0];
      let left = Math.min(dt, 0.5);
      while (left > 0) {
        const step = Math.min(left, 1 / 120);
        v += ((target - x) * k - v * d) * step;
        x += v * step;
        left -= step;
      }
      return [x, v];
    };
    this.islands.forEach((isl, i) => {
      const k = i - index;
      const far = Math.abs(k);
      [isl.x, isl.vx] = spring(isl.x, isl.vx, k * 3.9, 70, 11);
      [isl.z, isl.vz] = spring(isl.z, isl.vz, -Math.min(far, 2) * 1.8, 70, 11);
      [isl.s, isl.vs] = spring(isl.s, isl.vs, far === 0 ? 1 : far === 1 ? 0.6 : 0, 110, 9);
      const scale = Math.max(0, isl.s);
      isl.group.visible = scale > 0.02;
      isl.group.scale.setScalar(scale);
      // Each floats on its own rhythm; the neighbours sit a little lower.
      isl.group.position.set(isl.x, Math.sin(t * 0.7 + isl.phase) * 0.05 - (far ? 0.4 : 0), isl.z);
      isl.group.rotation.y = Math.sin(t * 0.25 + isl.phase) * 0.06 - k * 0.3;
      for (const s of isl.spin) s.rotation.y = isl.state.theme === 'mountain' ? t * 0.6 : t * 1.2;
      isl.bob.forEach((b, j) => {
        b.rotation.z = Math.sin(t * 1.3 + j * 1.1 + isl.phase) * 0.05;
        b.rotation.x = Math.sin(t * 1.1 + j * 0.7) * 0.03;
      });
      for (const w of isl.waves) w.position.z = -0.55 + Math.sin(t * 1.2 + isl.phase) * 0.06;
      isl.flames.forEach((f, j) => f.scale.set(1, 1.4 + Math.sin(t * 9 + j * 1.7) * 0.3, 1));
    });
  }
}

const cyl = (r: number, h: number, seg = 20, rb = r) => new CylinderGeometry(r, rb, h, seg);
