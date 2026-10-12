// The figurines, sculpted the way a figurine maker would: a head with cranium, cheeks, chin, button
// nose and ears in one piece of clay, eye sockets and a smile carved in; hair and beard as pieces of
// their own laid over it; a body with legs, hips, chest and shoulders melted together and the clothes
// painted on; arms that bend at the elbow, with hands. The eyeballs, brows and a closed smile are
// separate smooth parts (see people.ts) so the eyes can look round and blink. See sculpt.ts for the clay.
import { CatmullRomCurve3, Euler, MathUtils, Matrix4, Vector3, type BufferGeometry } from 'three';
import { chain, clip, cone, ellipsoid, intersect, minus, roundBox, Sculpt, sculpted, shell, sphere, torus, union, type Shape, type V3 } from './sculpt';
import type { FigureState, Interest } from './people';

export const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const x = p(a.length === 7 ? a : '#888888');
  const y = p(b.length === 7 ? b : '#888888');
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
};

/** Chibi proportions: a big head on a small body. */
export const BODY = {
  man: { headR: 0.34, legH: 0.32, torsoH: 0.42, torsoW: 0.22, limb: 0.075, armL: 0.4, pants: '#3d4a5c', shoes: '#5a4636', sleeves: 'long' },
  woman: { headR: 0.33, legH: 0.31, torsoH: 0.39, torsoW: 0.19, limb: 0.066, armL: 0.37, pants: '#4b4f63', shoes: '#c98e7b', sleeves: 'long' },
  child: { headR: 0.31, legH: 0.22, torsoH: 0.3, torsoW: 0.16, limb: 0.06, armL: 0.28, pants: '#4a6a8a', shoes: '#f4f1ea', sleeves: 'short' },
} as const;

const MOUTH = '#6b2a2a';
const TONGUE = '#ec8f95';
const BLUSH = '#f2998a';

/**
 * Bumped whenever the figures' shapes change, so meshes baked by an older version are not used (their
 * keys no longer match and the figure is sculpted afresh until it is baked again).
 */
export const SHAPES_VERSION = 7;

const key = (what: string, p: FigureState, extra: unknown = '') => [SHAPES_VERSION, what, p.preset, p.hair, p.hairStyle, p.beard, p.skin, p.shirt, p.interests.join('+'), extra].join('|');

/**
 * What makes each face its own: the shape of the jaw and cheeks, the size of the eyes and nose, where
 * the eyes sit, and the smile. Big eyes set low and wide under a high forehead, a button nose and round
 * cheeks read as cute; grown-ups get a longer jaw and smaller eyes than the children.
 */
const FACE = {
  man: { jaw: [0.88, 0.62, 0.8], cheek: 0.33, chin: [0.3, 0.2, 0.3], nose: [0.12, 0.1, 0.11], noseY: -0.17, eye: 0.2, eyeX: 0.37, eyeY: -0.02, smile: 'closed', mouthW: 0.2 },
  woman: { jaw: [0.8, 0.6, 0.78], cheek: 0.33, chin: [0.22, 0.17, 0.26], nose: [0.09, 0.08, 0.09], noseY: -0.18, eye: 0.225, eyeX: 0.36, eyeY: -0.02, smile: 'closed', mouthW: 0.18 },
  child: { jaw: [0.88, 0.58, 0.8], cheek: 0.38, chin: null, nose: [0.085, 0.07, 0.085], noseY: -0.2, eye: 0.24, eyeX: 0.37, eyeY: -0.07, smile: 'closed', mouthW: 0.2 },
  baby: { jaw: [0.95, 0.56, 0.82], cheek: 0.42, chin: null, nose: [0.08, 0.065, 0.08], noseY: -0.22, eye: 0.235, eyeX: 0.36, eyeY: -0.12, smile: 'small', mouthW: 0.14 },
} as const;

export interface HeadParts {
  skin: BufferGeometry;
  hair?: BufferGeometry;
  beard?: BufferGeometry;
  /** Eye centres and their radius; the eyeballs sit in sockets carved for them. */
  eyes: V3[];
  eyeR: number;
  /** Lines drawn on the face, as points on its surface: the brows, and a closed smile. */
  brows: V3[][];
  browR: number;
  smile?: V3[];
}

const heads = new Map<string, HeadParts>();

/** Heads baked ahead of time, by key, for `headParts` to use. */
export function preloadHead(k: string, h: HeadParts) {
  heads.set(k, h);
}

/** Every head made so far, by key (for baking). */
export function allHeads(): ReadonlyMap<string, HeadParts> {
  return heads;
}

/**
 * Where hair grows on a head of radius R, as a shape to paint the scalp with: everything above a
 * natural hairline. It runs round over the forehead (`front` radians down from the top), dips at the
 * temples, comes down in front of the ears as sideburns, goes up and round behind them, and sits low at
 * the nape. (Distance is measured as arc along the skull, near enough for painting.)
 */
function scalp(R: number, front: number): Shape {
  const cx = 0;
  const cy = R * 0.06;
  const cz = -R * 0.04;
  // The hairline's angle down from the top, by angle round the head (0 front, ±π the back).
  const line = (phi: number) => {
    const a = Math.abs(phi);
    const pts: Array<[number, number]> = [
      [0, front],
      [0.55, front + 0.08],
      [0.95, front + 0.3],
      [1.3, 1.55],
      [1.42, 1.85],
      [1.6, 1.55],
      [2.1, 1.75],
      [2.6, 2.05],
      [Math.PI, 2.12],
    ];
    for (let i = 1; i < pts.length; i++) {
      if (a <= pts[i][0]) {
        const t = (a - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]);
        const s = t * t * (3 - 2 * t);
        return pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * s;
      }
    }
    return pts[pts.length - 1][1];
  };
  return {
    d: (x, y, z) => {
      const dx = x - cx;
      const dy = y - cy;
      const dz = z - cz;
      const len = Math.hypot(dx, dy, dz) || 1;
      const theta = Math.acos(Math.max(-1, Math.min(1, dy / len)));
      const phi = Math.atan2(dx, dz);
      return (theta - line(phi)) * R;
    },
    c: [cx, cy, cz],
    r: R * 1.4,
  };
}


/**
 * A lock of hair as a sculptor shapes one: a wide, flat, tapering ribbon of clay lying along a curve
 * over the head (through `ctrl`), wider in the middle, ending in a soft point. Its width runs through
 * `widths` (start, middle, end) across it and it is `thick` deep; it lies flat against the head round
 * `centre`. Built from flattened lozenges along the curve melted into one.
 */
function lock(ctrl: V3[], widths: [number, number, number], thick: number, centre: V3): Shape {
  const curve = new CatmullRomCurve3(ctrl.map(v => new Vector3(...v)), false, 'centripetal');
  const n = 8;
  const len = curve.getLength();
  const parts: Shape[] = [];
  const c = new Vector3(...centre);
  const m = new Matrix4();
  const e = new Euler();
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n;
    const p = curve.getPointAt(u);
    const tan = curve.getTangentAt(u);
    const out = p.clone().sub(c).normalize();
    const across = new Vector3().crossVectors(tan, out).normalize();
    const up = new Vector3().crossVectors(across, tan).normalize();
    m.makeBasis(across, up, tan);
    e.setFromRotationMatrix(m);
    const w = u < 0.45 ? MathUtils.lerp(widths[0], widths[1], u / 0.45) : MathUtils.lerp(widths[1], widths[2], (u - 0.45) / 0.55);
    const t = thick * (1 - 0.55 * u);
    parts.push(ellipsoid([p.x, p.y, p.z], [Math.max(w, t), t, (len / n) * 1.5], [e.x, e.y, e.z]));
  }
  const k = thick * 1.4;
  const mid = curve.getPointAt(0.5);
  return {
    d: (x, y, z) => {
      let d = 1e9;
      for (const s of parts) {
        // A lozenge too far off to change anything is skipped (its bounding sphere says so).
        const lb = Math.sqrt((x - s.c[0]) ** 2 + (y - s.c[1]) ** 2 + (z - s.c[2]) ** 2) - s.r;
        if (lb >= d + k) continue;
        const ds = s.d(x, y, z);
        const h = Math.max(0, Math.min(1, 0.5 + (0.5 * (ds - d)) / k));
        d = ds + (d - ds) * h - k * h * (1 - h);
      }
      return d;
    },
    c: [mid.x, mid.y, mid.z],
    r: len / 2 + Math.max(...widths) + thick,
  };
}


/**
 * A point over the skull of a head of radius R: `theta` down from the top, `phi` round from the front
 * (towards +x), lifted `lift` × R off it. For laying locks of hair over the head.
 */
function onSkull(theta: number, phi: number, lift: number, R: number): V3 {
  const k = 1 + lift;
  return [Math.sin(theta) * Math.sin(phi) * R * k, R * 0.06 + Math.cos(theta) * R * 0.98 * k, -R * 0.04 + Math.sin(theta) * Math.cos(phi) * R * 0.96 * k];
}

/** The head round its centre (R is the skull's radius): skin, hair and beard as separate pieces. */
export function headParts(p: FigureState, R: number): HeadParts {
  const k = key('head2', p, R);
  let h = heads.get(k);
  if (!h) {
    h = buildHead(p, R);
    heads.set(k, h);
  }
  return h;
}

function buildHead(p: FigureState, R: number): HeadParts {
  const F = FACE[p.preset];
  const baby = p.preset === 'baby';
  const woman = p.preset === 'woman';
  const r = (v: number) => v * R;
  const skin = p.skin;
  const s = new Sculpt();

  // A big round cranium, cheeks and a jaw below it, a chin; one piece of clay.
  const skull = ellipsoid([0, r(0.06), r(-0.04)], [r(1.0), r(0.98), r(0.96)]);
  const jaw = ellipsoid([0, r(-0.36), r(0.1)], [r(F.jaw[0]), r(F.jaw[1]), r(F.jaw[2])]);
  s.add(skull, skin);
  s.add(jaw, skin, r(0.25));
  for (const side of [-1, 1]) s.add(sphere([side * r(0.47), r(-0.36), r(0.46)], r(F.cheek)), skin, r(0.2));
  if (F.chin) s.add(ellipsoid([0, r(-0.7), r(0.38)], [r(F.chin[0]), r(F.chin[1]), r(F.chin[2])]), skin, r(0.18));
  // Ears, with a hollow.
  for (const side of [-1, 1]) {
    s.add(ellipsoid([side * r(0.95), r(-0.12), r(-0.04)], [r(0.13), r(0.22), r(0.17)], [0, side * 0.4, 0]), skin, r(0.06));
    s.sub(sphere([side * r(1.05), r(-0.12), r(0.02)], r(0.08)), r(0.03));
  }
  const front = (x: number, y: number) => s.onSurface([r(x), r(y), r(1.6)]);

  // A button nose, a little rosy at the tip.
  const noseAt = front(0, F.noseY);
  s.add(ellipsoid([0, noseAt[1], noseAt[2] + r(F.nose[2] * 0.25)], [r(F.nose[0]), r(F.nose[1]), r(F.nose[2])]), skin, r(0.08));
  s.paint(sphere([0, noseAt[1], noseAt[2] + r(F.nose[2] * 1.2)], r(F.nose[0] * 0.9)), mix(skin, BLUSH, 0.35), r(0.08));
  // Round rosy cheeks.
  for (const side of [-1, 1]) s.paint(ellipsoid(front(side * 0.52, -0.32), [r(0.17), r(0.11), r(0.12)]), mix(skin, BLUSH, 0.7), r(0.1));

  // Sockets for the eyeballs: the ball shows a little over half its front.
  const eyeR = r(F.eye);
  const eyes: V3[] = [-1, 1].map(side => {
    const at = front(side * F.eyeX, F.eyeY);
    return [at[0], at[1], at[2] - eyeR * 0.5] as V3;
  });
  for (const c of eyes) s.sub(sphere(c, eyeR * 1.05), r(0.05));

  // The mouth: an open smile carved as a crescent, the top edge curving up at the corners, with a
  // tongue; or a closed smile, drawn as a line (see `smile`).
  let smile: V3[] | undefined;
  const mouthAt = front(0, F.smile === 'small' ? -0.45 : -0.42);
  if (F.smile === 'closed') {
    // Soft lips round the smile: a little fuller lower lip, a rosier colour.
    s.add(ellipsoid([0, mouthAt[1] - r(0.04), mouthAt[2] - r(0.03)], [r(0.14), r(0.045), r(0.06)]), skin, r(0.05));
    s.paint(ellipsoid([0, mouthAt[1] - r(0.01), mouthAt[2]], [r(0.2), r(0.07), r(0.1)]), mix(skin, '#d9776f', 0.45), r(0.04));
    smile = [];
    for (let i = 0; i <= 8; i++) {
      const x = (i / 8 - 0.5) * 2 * F.mouthW;
      smile.push(s.onSurface([r(x), r(-0.42 + 1.9 * x * x), r(1.6)], 0));
    }
  } else {
    const w = F.mouthW;
    const h = F.smile === 'small' ? 0.1 : p.preset === 'child' ? 0.17 : 0.15;
    const [, my, mz] = mouthAt;
    const lower = ellipsoid([0, my, mz], [r(w), r(h), r(0.32)]);
    const upper = ellipsoid([0, my + r(h * 1.1), mz], [r(w * 1.55), r(h * 1.45), r(0.6)]);
    s.sub(minus(lower, upper), r(0.03), MOUTH);
    s.add(ellipsoid([0, my - r(h * 0.55), mz - r(0.1)], [r(w * 0.55), r(h * 0.4), r(0.12)]), TONGUE, r(0.03));
  }

  // Brows: arched, set just over the eyes, a little higher and finer for her, raised for the children.
  const lift = woman ? 0.2 : p.preset === 'child' ? 0.19 : 0.16;
  const brows = baby
    ? []
    : [-1, 1].map(side => {
        const ey = F.eyeY + F.eye;
        const pts: Array<[number, number]> = [
          [0.14, ey + lift + 0.02],
          [0.3, ey + lift + 0.06],
          [0.46, ey + lift + 0.05],
          [0.58, ey + lift - 0.01],
        ];
        return pts.map(([x, y]) => s.onSurface([side * r(x), r(y), r(1.6)], 0));
      });

  // The scalp, painted the hair's colour up to a natural hairline with a soft edge: under longer hair
  // it fills between the locks; a buzz cut is just this, short stubble a touch lighter than the hair.
  if (!baby && p.hairStyle !== 'bald') {
    const tone = p.hairStyle === 'buzz' ? mix(p.hair, skin, 0.06) : mix(p.hair, '#000000', 0.12);
    s.paint(scalp(R, p.hairStyle === 'long' ? 0.82 : 0.9), tone, r(0.05));
  }
  const skinGeo = s.mesh(R * 0.031);

  // Hair, as its own piece over the skull: cut at a hairline that drops towards the nape.
  const hairline = (t: number, high = 0) => clip(shell(skull, r(t)), [0, -1, 0.55], r(0.02 - high), r(0.05));
  const style = baby ? 'baby' : p.hairStyle;
  const hs = new Sculpt();
  const hc = p.hair;
  if (style === 'buzz') {
    // (Painted on the skin as stubble; see above.)
  } else if (style === 'short') {
    // Thick and tousled, in a few big smooth locks like a sculpted figurine's: a fringe of wide locks
    // swept forward and to one side, curling at their tips; locks over the ears; locks down the back of
    // the head. Between them the painted scalp shows, not skin.
    const head: V3 = [0, r(0.06), r(-0.04)];
    const L = (ctrl: V3[], w: [number, number, number], t: number) => hs.add(lock(ctrl, w.map(r) as [number, number, number], r(t), head), hc, r(0.012));
    for (let k = 0; k < 4; k++) {
      const phi = -0.75 + k * 0.42;
      L([onSkull(0.1, phi * 0.4, 0.02, R), onSkull(0.55, phi + 0.12, 0.14, R), onSkull(0.92, phi + 0.38, 0.15, R), onSkull(1.08, phi + 0.62, 0.09, R)], [0.2, 0.3, 0.05], 0.12);
    }
    for (const side of [-1, 1]) {
      for (const k of [0, 1]) {
        const phi = side * (1.3 + k * 0.5);
        L([onSkull(0.3, phi * 0.5, 0.02, R), onSkull(0.95, phi, 0.1, R), onSkull(1.42, phi + side * 0.2, 0.05, R)], [0.2, 0.28, 0.05], 0.11);
      }
    }
    for (const phi of [Math.PI - 0.55, Math.PI, Math.PI + 0.55]) {
      L([onSkull(0.25, phi, 0.02, R), onSkull(0.95, phi, 0.1, R), onSkull(1.72, phi, 0.04, R)], [0.25, 0.3, 0.06], 0.11);
    }
  } else if (style === 'long') {
    // Long and smooth, parted on one side: a big fringe swept across the forehead, wide locks from the
    // parting over the top, curtains of hair down either side to the shoulders that curl out at the
    // ends, a long mass down the back. Between them the painted scalp shows, not skin.
    const head: V3 = [0, r(0.06), r(-0.04)];
    const L = (ctrl: V3[], w: [number, number, number], t: number) => hs.add(lock(ctrl, w.map(r) as [number, number, number], r(t), head), hc, r(0.012));
    L([onSkull(0.22, 0.35, 0.06, R), onSkull(0.62, -0.25, 0.13, R), onSkull(0.98, -0.95, 0.12, R), onSkull(1.3, -1.35, 0.09, R)], [0.3, 0.42, 0.1], 0.12);
    L([onSkull(0.25, 0.5, 0.05, R), onSkull(0.66, 0.8, 0.1, R), onSkull(1.05, 1.0, 0.1, R)], [0.26, 0.32, 0.08], 0.1);
    for (const phi of [-1.7, -2.3, 1.55, 2.15, 2.75, -2.85]) {
      // Each from its own point along the parting, so they don't bunch where they start.
      const start = Math.abs(phi) > 2.4 ? onSkull(0.3, 2.9, 0.03, R) : onSkull(0.2, phi > 0 ? 0.6 : 0.2, 0.03, R);
      L([start, onSkull(0.8, phi, 0.09, R), onSkull(1.45, phi * 1.02, 0.09, R)], [0.3, 0.38, 0.32], 0.11);
    }
    for (const side of [-1, 1]) {
      for (const k of [0, 1]) {
        const z = 0.22 - k * 0.3;
        L(
          [
            onSkull(1.25, side * (1.45 + k * 0.3), 0.14, R),
            [side * r(1.06), r(-0.45), r(z)],
            [side * r(1.0), r(-1.15), r(z - 0.06)],
            [side * r(1.2), r(-1.5), r(z + 0.06)],
          ],
          [0.3, 0.32, 0.08],
          0.13,
        );
      }
    }
    hs.add(clip(ellipsoid([0, r(-0.45), r(-0.5)], [r(0.98), r(1.15), r(0.55)]), [0, -1, 0], r(1.4), r(0.1)), hc, r(0.12));
    for (const x of [-0.4, 0, 0.4]) L([[r(x), r(0.2), r(-1.0)], [r(x * 1.1), r(-0.6), r(-1.02)], [r(x * 1.2), r(-1.45), r(-0.75)]], [0.24, 0.3, 0.08], 0.12);
  } else if (style === 'baby') {
    // A fine down of hair and a curl on top (under the hard hat if there is one).
    hs.add(hairline(0.025, 0.12), mix(hc, skin, 0.2));
    if (!p.interests.includes('cars')) hs.add(torus([0, r(1.0), r(0.25)], r(0.13), r(0.055), [1.2, 0, 0.5]), hc, r(0.04));
  }
  const hair = style === 'bald' || style === 'buzz' ? undefined : hs.mesh(R * 0.038);

  // Beard: a close layer round the jaw and chin up into the sideburns, leaving the mouth clear, and a
  // moustache over it.
  let beard: BufferGeometry | undefined;
  if (p.beard && !baby) {
    const bs = new Sculpt();
    const t = p.beard === 'full' ? 0.1 : 0.055;
    const jawline = union(jaw, ellipsoid([0, r(-0.7), r(0.38)], [r(0.3), r(0.2), r(0.3)]));
    bs.add(clip(clip(shell(jawline, r(t)), [0, 1, 0.3], r(-0.14), r(0.06)), [0, 0, -1], r(0.12), r(0.05)), hc);
    for (const side of [-1, 1]) bs.add(cone([side * r(0.88), r(0.1), r(0.1)], [side * r(0.78), r(-0.3), r(0.36)], r(0.07), r(0.08)), hc, r(0.06));
    const [, my, mz] = mouthAt;
    bs.sub(ellipsoid([0, my + r(0.02), mz], [r(F.mouthW + 0.06), r(0.2), r(0.4)]), r(0.04));
    bs.add(chain([[[r(-0.3), my + r(0.04), mz - r(0.12)], r(0.05)], [[r(-0.12), my + r(0.11), mz + r(0.02)], r(0.065)], [[r(0.12), my + r(0.11), mz + r(0.02)], r(0.065)], [[r(0.3), my + r(0.04), mz - r(0.12)], r(0.05)]]), hc, r(0.04));
    beard = bs.mesh(R * 0.035);
  }

  return { skin: skinGeo, hair, beard, eyes, eyeR, brows, browR: r(woman ? 0.03 : p.preset === 'child' ? 0.036 : 0.042), smile };
}

const likes = (p: FigureState, i: Interest) => p.interests.includes(i);

/** What a piece is made of, for its material: cloth has a soft sheen, skin is smoother, soles are rubber. */
export type Stuff = 'skin' | 'cloth' | 'rubber';

/** One piece of the figure in one colour, sculpted on its own so its edges are clean. */
export interface Piece {
  geo: BufferGeometry;
  colour: string;
  stuff: Stuff;
}

/** Small round things set on the clothes: buttons, a badge. Smooth parts, too fine for the clay. */
export interface Dot {
  at: V3;
  r: number;
  colour: string;
  /** Flattened against the body (a button) rather than round. */
  flat?: boolean;
}

export interface BodyParts {
  /** The body with the legs; it breathes. */
  pieces: Piece[];
  dots: Dot[];
  /** A Poké Ball on the T-shirt: where, and how big. */
  badge?: { at: V3; r: number };
}

const piece = (k: string, colour: string, stuff: Stuff, cell: number, build: (s: Sculpt) => void): Piece => ({
  geo: sculpted(k, cell, () => {
    const s = new Sculpt();
    build(s);
    return s;
  }),
  colour,
  stuff,
});

/** A band of `s`'s surface between two heights, `t` thick: a belt, a hem, a cuff. */
const band = (s: Shape, y: number, half: number, t: number) => intersect(shell(s, t), roundBox([0, y, 0], [2, half, 2], 0));

/**
 * The body, in pieces the way a figurine's clothes are made: trousers (shorts for a child, with bare
 * legs and white socks), a shirt over the hips, a collar and hems in a darker shade, chunky shoes on
 * their soles, a neck. The figure's feet are at the origin.
 */
export function bodyParts(p: FigureState): BodyParts {
  if (p.preset === 'baby') return babyParts(p);
  const b = BODY[p.preset];
  const k = (what: string) => key(what, p);
  const w = b.torsoW;
  const h = b.torsoH;
  const lw = b.limb * 1.08;
  const hipX = w * 0.46;
  const top = b.legH;
  const woman = p.preset === 'woman';
  const child = p.preset === 'child';
  const trim = mix(p.shirt, '#000000', 0.22);
  const pieces: Piece[] = [];
  const dots: Dot[] = [];

  const hips = ellipsoid([0, top + 0.04, 0], [w * (woman ? 1.0 : 0.97), h * 0.27, w * 0.7]);
  const chest = ellipsoid([0, top + h * 0.5, 0], [w * (woman ? 0.93 : 1.0), h * 0.56, w * 0.74]);
  const shoulders = ellipsoid([0, top + h * 0.84, -0.01], [w * 1.1, h * 0.22, w * 0.64]);
  const legLow = child ? top * 0.52 : 0.1;

  // Trousers: hips and legs in one, a turn-up at the bottom. A child's stop above the knee.
  pieces.push(
    piece(k('pants'), b.pants, 'cloth', 0.009, s => {
      s.add(hips, b.pants);
      for (const side of [-1, 1]) {
        s.add(chain([[[side * hipX, legLow, 0.005], lw * (child ? 1.02 : 0.8)], [[side * hipX, top * 0.55, 0.01], lw * 0.9], [[side * hipX * 0.95, top + 0.03, 0], lw * 1.12]]), b.pants, lw * 0.35);
        s.add(torus([side * hipX, legLow + 0.012, 0.005], lw * (child ? 1.0 : 0.8), 0.014), b.pants, 0.012);
      }
    }),
  );
  if (child) {
    // Bare legs below the shorts, white socks with a stripe.
    pieces.push(piece(k('legs'), p.skin, 'skin', 0.008, s => { for (const side of [-1, 1]) s.add(cone([side * hipX, 0.14, 0.005], [side * hipX, legLow + 0.02, 0.005], lw * 0.62, lw * 0.7), p.skin); }));
    pieces.push(piece(k('socks'), '#f6f4ef', 'cloth', 0.007, s => { for (const side of [-1, 1]) s.add(cone([side * hipX, 0.07, 0.01], [side * hipX, 0.17, 0.005], lw * 0.72, lw * 0.68), '#f6f4ef'); }));
    pieces.push(piece(k('stripe'), '#5b8fd6', 'cloth', 0.006, s => { for (const side of [-1, 1]) s.add(intersect(shell(cone([side * hipX, 0.07, 0.01], [side * hipX, 0.17, 0.005], lw * 0.72, lw * 0.68), 0.005), roundBox([0, 0.145, 0], [2, 0.011, 2], 0)), '#5b8fd6'); }));
  }

  // Chunky rounded shoes on thick soles.
  const shoe = (side: number) => union(ellipsoid([side * hipX, 0.075, 0.035], [0.088, 0.072, 0.13]), ellipsoid([side * hipX, 0.065, 0.11], [0.082, 0.058, 0.07]));
  pieces.push(piece(k('shoes'), b.shoes, 'cloth', 0.007, s => { for (const side of [-1, 1]) s.add(shoe(side), b.shoes); }));
  pieces.push(
    piece(k('soles'), woman || child ? '#f4f1ea' : '#2e2a27', 'rubber', 0.007, s => {
      for (const side of [-1, 1]) s.add(clip(shell(shoe(side), 0.012), [0, 1, 0], 0.03, 0.004), '#000');
    }),
  );

  // The shirt over the hips, with its hem a touch wider.
  const torso = union(chest, shoulders);
  pieces.push(
    piece(k('shirt'), p.shirt, 'cloth', 0.009, s => {
      s.add(chest, p.shirt);
      s.add(shoulders, p.shirt, 0.08);
      if (woman) s.add(band(chest, top + h * 0.06, 0.03, 0.012), p.shirt, 0.01);
    }),
  );
  // Neck, a collar (or a round neckline) and the shirt's trim.
  pieces.push(piece(k('neck'), p.skin, 'skin', 0.008, s => s.add(cone([0, top + h * 0.78, 0], [0, top + h + 0.1, 0], 0.095, 0.085), p.skin)));
  pieces.push(
    piece(k('trim'), trim, 'cloth', 0.007, s => {
      s.add(torus([0, top + h * 0.97, 0.012], 0.1, woman ? 0.016 : 0.022, [-0.3, 0, 0]), trim);
      if (woman) s.add(band(chest, top + h * 0.03, 0.02, 0.016), trim);
      if (p.preset === 'man') s.add(intersect(shell(chest, 0.006), roundBox([0, top + h * 0.6, w * 0.7], [0.018, h * 0.3, 0.1], 0)), trim);
      if (child) s.add(band(chest, top + h * 0.01, 0.018, 0.012), trim);
    }),
  );
  // A belt where the shirt meets the trousers (not under a sweater).
  if (!woman) {
    const y = top + h * 0.13;
    pieces.push(piece(k('belt'), '#3a2b22', 'cloth', 0.007, s => s.add(band(hips, y, 0.018, 0.012), '#3a2b22')));
    dots.push({ at: [0, y, w * 0.68 + 0.012], r: 0.02, colour: '#c9a45a', flat: true });
  }
  if (p.preset === 'man') for (let i = 0; i < 3; i++) dots.push({ at: [0, top + h * (0.8 - i * 0.17), w * 0.745], r: 0.013, colour: '#e6e1d8', flat: true });

  if (likes(p, 'cooking')) {
    // An apron over the front, a red pocket on it and a strap round the neck.
    const front = roundBox([0, top + h * 0.36, w * 0.62], [w * 0.84, h * 0.5, w * 0.5], 0.03);
    pieces.push(
      piece(k('apron'), '#f4f1ea', 'cloth', 0.008, s => {
        s.add(intersect(shell(union(torso, hips), 0.016), front), '#f4f1ea');
        s.add(intersect(torus([0, top + h * 0.96, 0.03], w * 0.52, 0.014, [0.35, 0, 0]), roundBox([0, top + h, 0.25], [1, 1, 0.25], 0)), '#f4f1ea');
      }),
    );
    pieces.push(piece(k('pocket'), '#e86a5a', 'cloth', 0.007, s => s.add(intersect(shell(union(torso, hips), 0.026), roundBox([0, top + h * 0.24, w * 0.8], [w * 0.32, h * 0.1, 0.12], 0.01)), '#e86a5a')));
  }
  return { pieces, dots, badge: likes(p, 'pokemon') ? { at: [0, top + h * 0.55, w * 0.74], r: w * 0.32 } : undefined };
}

function babyParts(p: FigureState): BodyParts {
  const k = (what: string) => key(what, p);
  const dungarees = likes(p, 'cars') ? '#5b7fb0' : p.shirt;
  const top = likes(p, 'cars') ? '#f2cf5a' : mix(p.shirt, '#ffffff', 0.5);
  const belly = ellipsoid([0, 0.27, 0], [0.24, 0.25, 0.22]);
  const pieces: Piece[] = [
    // Sitting: a round body in a top, dungarees over it with a bib and straps, chubby legs in socks.
    piece(k('baby-top'), top, 'cloth', 0.009, s => s.add(belly, top)),
    piece(k('baby-dungarees'), dungarees, 'cloth', 0.008, s => {
      s.add(clip(shell(belly, 0.012), [0, 1, 0], 0.36, 0.01), dungarees);
      s.add(intersect(shell(belly, 0.014), roundBox([0, 0.4, 0.2], [0.085, 0.08, 0.12], 0.02)), dungarees);
      for (const side of [-1, 1]) {
        s.add(intersect(shell(belly, 0.012), roundBox([side * 0.1, 0.44, 0], [0.024, 0.1, 0.3], 0)), dungarees);
        s.add(cone([side * 0.11, 0.12, 0.05], [side * 0.12, 0.1, 0.25], 0.09, 0.077), dungarees, 0.05);
      }
    }),
    piece(k('baby-socks'), '#f6f4ef', 'cloth', 0.007, s => { for (const side of [-1, 1]) s.add(ellipsoid([side * 0.12, 0.1, 0.31], [0.077, 0.077, 0.092]), '#f6f4ef'); }),
    piece(k('baby-neck'), p.skin, 'skin', 0.008, s => s.add(cone([0, 0.42, 0], [0, 0.56, 0], 0.11, 0.09), p.skin)),
  ];
  const dots: Dot[] = [-1, 1].map(side => ({ at: [side * 0.06, 0.45, 0.225] as V3, r: 0.016, colour: '#f2cf5a', flat: true }));
  return { pieces, dots };
}

/**
 * An arm in two pieces: the upper arm hangs from the shoulder (its origin), the forearm and hand from
 * the elbow (`len` below). Sleeves are their own pieces over the skin, with a cuff or hem. Mirrored by
 * `side`.
 */
export function armParts(p: FigureState, side: number): { upper: Piece[]; fore: Piece[]; len: number } {
  const k = (what: string) => key(what, p, side);
  if (p.preset === 'baby') {
    const top = likes(p, 'cars') ? '#f2cf5a' : mix(p.shirt, '#ffffff', 0.5);
    return {
      upper: [
        piece(k('baby-sleeve'), top, 'cloth', 0.008, s => s.add(cone([0, 0.02, 0], [0, -0.15, 0], 0.066, 0.056), top)),
        piece(k('baby-hand'), p.skin, 'skin', 0.006, s => s.add(sphere([0, -0.19, 0.01], 0.064), p.skin).add(sphere([-side * 0.045, -0.17, 0.04], 0.026), p.skin, 0.02)),
      ],
      fore: [],
      len: 0,
    };
  }
  const b = BODY[p.preset];
  const lw = b.limb;
  const len = b.armL * 0.5;
  const trim = mix(p.shirt, '#000000', 0.22);
  const short = b.sleeves === 'short';
  const upperArm = cone([0, lw * 0.25, 0], [0, -len, 0], lw * 1.04, lw * 0.82);
  const upper: Piece[] = short
    ? [
        piece(k('arm-skin'), p.skin, 'skin', 0.007, s => s.add(cone([0, lw * 0.1, 0], [0, -len, 0], lw * 0.92, lw * 0.76), p.skin)),
        piece(k('sleeve-short'), p.shirt, 'cloth', 0.007, s => s.add(clip(upperArm, [0, -1, 0], len * 0.55, 0.01), p.shirt)),
        piece(k('sleeve-hem'), trim, 'cloth', 0.006, s => s.add(intersect(shell(upperArm, 0.008), roundBox([0, -len * 0.55 + 0.012, 0], [1, 0.012, 1], 0)), trim)),
      ]
    : [piece(k('sleeve-upper'), p.shirt, 'cloth', 0.008, s => s.add(upperArm, p.shirt))];
  const foreArm = cone([0, 0.01, 0], [0, -len + 0.01, 0], lw * 0.8, lw * 0.66);
  const fore: Piece[] = [];
  if (short) fore.push(piece(k('fore-skin'), p.skin, 'skin', 0.007, s => s.add(foreArm, p.skin)));
  else {
    fore.push(piece(k('sleeve-fore'), p.shirt, 'cloth', 0.008, s => s.add(foreArm, p.shirt)));
    fore.push(piece(k('cuff'), trim, 'cloth', 0.006, s => s.add(intersect(shell(foreArm, 0.008), roundBox([0, -len + 0.03, 0], [1, 0.016, 1], 0)), trim)));
  }
  // A soft mitten of a hand: palm, four fingers curled a little, a thumb towards the front.
  fore.push(
    piece(k('hand'), p.skin, 'skin', 0.0055, s => {
      const y = -len - 0.035;
      s.add(cone([0, -len + 0.03, 0], [0, y + 0.01, 0.005], lw * 0.6, lw * 0.62), p.skin);
      s.add(ellipsoid([0, y, 0.008], [lw * 0.82, lw * 0.98, lw * 0.55]), p.skin, lw * 0.3);
      for (let i = 0; i < 4; i++) {
        const x = (i - 1.5) * lw * 0.38;
        s.add(chain([[[x, y - lw * 0.6, 0.008], lw * 0.21], [[x * 1.05, y - lw * 1.15, lw * 0.18], lw * 0.19], [[x, y - lw * 1.28, lw * 0.46], lw * 0.17]]), p.skin, lw * 0.12);
      }
      s.add(chain([[[-side * lw * 0.55, y + lw * 0.2, lw * 0.25], lw * 0.25], [[-side * lw * 0.8, y - lw * 0.35, lw * 0.6], lw * 0.21]]), p.skin, lw * 0.12);
    }),
  );
  return { upper, fore, len };
}

/**
 * A Charmander plush, sitting, sculpted soft like a stuffed toy: a big round head with a broad rounded
 * muzzle and an open smile, a pear of a body with a cream belly, stubby arms, legs out in front with
 * cream soles, and a thick tail curling up behind (eyes, claws and the flame are parts). About 0.45
 * tall; the seat at y 0.
 */
export function charmanderGeometry(): BufferGeometry {
  return sculpted('charmander-2', 0.005, () => {
    const s = new Sculpt();
    const orange = '#f8853a';
    const cream = '#fcd98e';
    s.add(ellipsoid([0, 0.14, 0], [0.115, 0.135, 0.105]), orange);
    s.add(ellipsoid([0, 0.345, 0.015], [0.148, 0.135, 0.135]), orange, 0.05);
    s.add(ellipsoid([0, 0.31, 0.09], [0.1, 0.075, 0.08]), orange, 0.06);
    for (const side of [-1, 1]) {
      s.add(cone([side * 0.09, 0.2, 0.02], [side * 0.14, 0.13, 0.08], 0.036, 0.03), orange, 0.025);
      s.add(cone([side * 0.065, 0.06, 0.03], [side * 0.075, 0.045, 0.14], 0.056, 0.05), orange, 0.04);
    }
    s.add(chain([[[0, 0.07, -0.08], 0.055], [[0, 0.07, -0.19], 0.045], [[0, 0.15, -0.26], 0.035], [[0, 0.26, -0.27], 0.026]]), orange, 0.04);
    s.paint(ellipsoid([0, 0.13, 0.085], [0.078, 0.11, 0.06]), cream, 0.008);
    for (const side of [-1, 1]) s.paint(sphere([side * 0.075, 0.045, 0.19], 0.047), cream, 0.006);
    // The open smile, a crescent with its corners turned up.
    const lower = ellipsoid([0, 0.29, 0.165], [0.065, 0.035, 0.06]);
    const upper = ellipsoid([0, 0.305, 0.165], [0.1, 0.045, 0.1]);
    s.sub(minus(lower, upper), 0.004, '#9b2f24');
    return s;
  });
}

/** Where the Charmander plush's eyes go (its head's front, either side). */
export const CHARMANDER_EYES: V3[] = [-1, 1].map(s => [s * 0.064, 0.378, 0.128] as V3);

/**
 * A Mewtwo figure, about a metre tall before it is scaled to stand on a shelf: pale grey-lilac with a
 * purple belly and a long thick purple tail curling round to the front, big thighs and slim shins, a
 * narrow waist under a broad chest, the tube from the back of its head down to its shoulders, horn-like
 * ears, three-fingered hands held together in front of it.
 */
export function mewtwoGeometry(): BufferGeometry {
  return sculpted('mewtwo', 0.008, () => {
    const s = new Sculpt();
    const pale = '#e4dbee';
    const purple = '#9c62cc';
    for (const side of [-1, 1]) {
      s.add(ellipsoid([side * 0.1, 0.03, 0.04], [0.055, 0.03, 0.09]), pale);
      s.add(cone([side * 0.1, 0.05, 0], [side * 0.11, 0.22, 0], 0.035, 0.046), pale, 0.02);
      s.add(ellipsoid([side * 0.1, 0.32, 0], [0.072, 0.12, 0.08]), pale, 0.03);
    }
    s.add(ellipsoid([0, 0.42, 0], [0.13, 0.1, 0.09]), purple, 0.04);
    s.add(cone([0, 0.47, 0], [0, 0.6, 0], 0.07, 0.09), pale, 0.04);
    s.add(ellipsoid([0, 0.62, 0], [0.145, 0.085, 0.085]), pale, 0.05);
    s.add(cone([0, 0.68, 0], [0, 0.78, 0.01], 0.034, 0.028), pale, 0.02);
    s.add(ellipsoid([0, 0.845, 0.02], [0.075, 0.068, 0.072]), pale, 0.02);
    s.add(ellipsoid([0, 0.815, 0.06], [0.05, 0.04, 0.05]), pale, 0.03);
    for (const side of [-1, 1]) s.add(cone([side * 0.04, 0.89, 0], [side * 0.075, 0.975, -0.015], 0.025, 0.011), pale, 0.015);
    s.add(chain([[[0, 0.85, -0.05], 0.022], [[0, 0.8, -0.13], 0.02], [[0, 0.69, -0.1], 0.02]]), pale, 0.015);
    // Arms held forward, the hands together in front of the chest.
    for (const side of [-1, 1]) {
      s.add(chain([[[side * 0.15, 0.65, 0], 0.035], [[side * 0.17, 0.54, 0.05], 0.03], [[side * 0.06, 0.5, 0.13], 0.025]]), pale, 0.02);
      s.add(sphere([side * 0.045, 0.495, 0.14], 0.028), pale, 0.015);
      for (let k = 0; k < 3; k++) s.add(sphere([side * (0.03 - k * 0.012), 0.47 + k * 0.022, 0.165], 0.013), pale, 0.006);
    }
    // The tail, from the small of the back round to the front.
    s.add(chain([[[0, 0.42, -0.08], 0.06], [[0.12, 0.3, -0.2], 0.056], [[0.24, 0.17, -0.12], 0.046], [[0.29, 0.11, 0.05], 0.035], [[0.25, 0.13, 0.17], 0.024]]), purple, 0.03);
    return s;
  });
}

/** Mewtwo's eyes. */
export const MEWTWO_EYES: V3[] = [-1, 1].map(s => [s * 0.03, 0.852, 0.088] as V3);
