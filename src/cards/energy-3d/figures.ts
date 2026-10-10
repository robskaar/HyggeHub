// The figurines, sculpted the way a figurine maker would: a head with cranium, cheeks, chin, button
// nose and ears in one piece of clay, eye sockets and a smile carved in; hair and beard as pieces of
// their own laid over it; a body with legs, hips, chest and shoulders melted together and the clothes
// painted on; arms that bend at the elbow, with hands. The eyeballs, brows and a closed smile are
// separate smooth parts (see people.ts) so the eyes can look round and blink. See sculpt.ts for the clay.
import type { BufferGeometry } from 'three';
import { chain, clip, cone, ellipsoid, intersect, minus, roundBox, Sculpt, sculpted, shell, sphere, torus, union, type V3 } from './sculpt';
import type { FigureState, Interest } from './people';

const mix = (a: string, b: string, t: number) => {
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

const key = (what: string, p: FigureState, extra: unknown = '') => [what, p.preset, p.hair, p.hairStyle, p.beard, p.skin, p.shirt, p.interests.join('+'), extra].join('|');

/**
 * What makes each face its own: the shape of the jaw and cheeks, the size of the eyes and nose, where
 * the eyes sit, and the smile. Big eyes set low and wide under a high forehead, a button nose and round
 * cheeks read as cute; grown-ups get a longer jaw and smaller eyes than the children.
 */
const FACE = {
  man: { jaw: [0.88, 0.62, 0.8], cheek: 0.33, chin: [0.3, 0.2, 0.3], nose: [0.12, 0.1, 0.11], noseY: -0.17, eye: 0.2, eyeX: 0.37, eyeY: -0.02, smile: 'open', mouthW: 0.22 },
  woman: { jaw: [0.8, 0.6, 0.78], cheek: 0.33, chin: [0.22, 0.17, 0.26], nose: [0.09, 0.08, 0.09], noseY: -0.18, eye: 0.225, eyeX: 0.36, eyeY: -0.02, smile: 'closed', mouthW: 0.18 },
  child: { jaw: [0.88, 0.58, 0.8], cheek: 0.38, chin: null, nose: [0.085, 0.07, 0.085], noseY: -0.2, eye: 0.24, eyeX: 0.37, eyeY: -0.07, smile: 'open', mouthW: 0.24 },
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

  const skinGeo = s.mesh(R * 0.034);

  // Hair, as its own piece over the skull: cut at a hairline that drops towards the nape.
  const hairline = (t: number, high = 0) => clip(shell(skull, r(t)), [0, -1, 0.55], r(0.02 - high), r(0.05));
  const style = baby ? 'baby' : p.hairStyle;
  const hs = new Sculpt();
  const hc = p.hair;
  if (style === 'buzz') {
    // Clipper-short: a close layer with a little more on top at the front, sideburns into the beard.
    hs.add(clip(shell(skull, r(0.035)), [0, -1, 0.55], r(0.0), r(0.14)), hc);
    for (const side of [-1, 1]) hs.add(cone([side * r(0.92), r(0.25), r(0.08)], [side * r(0.9), r(-0.14), r(0.14)], r(0.07), r(0.06)), hc, r(0.04));
  } else if (style === 'short') {
    // Thick and tousled, in soft chunky locks: a full cap, locks swept up and back round the crown,
    // and a fringe falling forward and to the side.
    hs.add(hairline(0.12), hc);
    const crown: Array<[number, number, number]> = [
      [-0.55, 0.75, -0.2], [0.55, 0.75, -0.2], [0, 0.95, -0.35], [-0.35, 0.95, 0.1], [0.35, 0.95, 0.1], [0, 1.0, 0.15], [-0.7, 0.45, -0.55], [0.7, 0.45, -0.55], [0, 0.6, -0.85],
    ];
    for (const [x, y, z] of crown) {
      const n = Math.hypot(x, y, z);
      hs.add(cone([r(x * 0.85), r(y * 0.85), r(z * 0.85)], [r((x / n) * 1.22 + x * 0.1), r((y / n) * 1.22), r((z / n) * 1.18 - 0.2)], r(0.24), r(0.1)), hc, r(0.1));
    }
    for (const x0 of [-0.52, -0.22, 0.08, 0.38]) {
      hs.add(chain([[[r(x0), r(0.85), r(0.5)], r(0.2)], [[r(x0 + 0.12), r(0.66), r(0.86)], r(0.15)], [[r(x0 + 0.24), r(0.5), r(0.9)], r(0.08)]]), hc, r(0.08));
    }
  } else if (style === 'long') {
    // A big side-swept fringe, locks framing the face down to the shoulders, a long fall down the back.
    hs.add(hairline(0.1), hc);
    hs.add(chain([[[r(-0.55), r(0.85), r(0.5)], r(0.24)], [[r(-0.05), r(0.66), r(0.88)], r(0.2)], [[r(0.42), r(0.48), r(0.84)], r(0.14)], [[r(0.72), r(0.2), r(0.6)], r(0.09)]]), hc, r(0.1));
    hs.add(chain([[[r(-0.72), r(0.55), r(0.55)], r(0.16)], [[r(-0.86), r(0.15), r(0.5)], r(0.12)], [[r(-0.84), r(-0.15), r(0.5)], r(0.07)]]), hc, r(0.08));
    for (const side of [-1, 1]) {
      hs.add(chain([[[side * r(0.86), r(0.45), r(0.25)], r(0.26)], [[side * r(1.02), r(-0.4), r(0.15)], r(0.25)], [[side * r(0.98), r(-1.15), r(0.02)], r(0.21)], [[side * r(0.78), r(-1.5), r(0.12)], r(0.12)]]), hc, r(0.12));
    }
    hs.add(clip(ellipsoid([0, r(-0.45), r(-0.45)], [r(1.0), r(1.15), r(0.6)]), [0, -1, 0], r(1.4), r(0.1)), hc, r(0.15));
    for (let i = -2; i <= 2; i++) hs.add(sphere([i * r(0.34), r(-1.42), r(-0.3) - Math.abs(i) * r(0.05)], r(0.2)), hc, r(0.14));
  } else if (style === 'baby') {
    // A fine down of hair and a curl on top (under the hard hat if there is one).
    hs.add(hairline(0.025, 0.12), mix(hc, skin, 0.2));
    if (!p.interests.includes('cars')) hs.add(torus([0, r(1.0), r(0.25)], r(0.13), r(0.055), [1.2, 0, 0.5]), hc, r(0.04));
  }
  const hair = style === 'bald' ? undefined : hs.mesh(R * 0.04);

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

interface Look {
  shirt: string;
  shirtDark: string;
  pants: string;
  shoes: string;
}

const likes = (p: FigureState, i: Interest) => p.interests.includes(i);

/** Legs, hips, body, neck; the clothes painted on. The figure's feet are at the origin. */
export function bodyGeometry(p: FigureState): BufferGeometry {
  if (p.preset === 'baby') return babyBody(p);
  return sculpted(key('body', p), 0.017, () => {
    const b = BODY[p.preset as 'man' | 'woman' | 'child'];
    const s = new Sculpt();
    const L: Look = { shirt: p.shirt, shirtDark: mix(p.shirt, '#000000', 0.22), pants: b.pants, shoes: b.shoes };
    const w = b.torsoW;
    const h = b.torsoH;
    const lw = b.limb;
    const hipX = w * 0.45;
    const top = b.legH;
    const woman = p.preset === 'woman';
    // Legs, a little apart, thigh to calf to ankle.
    for (const side of [-1, 1]) {
      s.add(chain([[[side * hipX, 0.09, 0], lw * 0.66], [[side * hipX, top * 0.48, 0.012], lw * 0.8], [[side * hipX * 0.95, top + 0.03, 0], lw * 1.08]]), L.pants, lw * 0.3);
      s.add(ellipsoid([side * hipX, 0.065, 0.045], [0.075, 0.06, 0.13]), L.shoes, 0.03);
      s.add(roundBox([side * hipX, 0.018, 0.045], [0.072, 0.018, 0.138], 0.015), '#2a2725', 0);
    }
    // Hips, a body and shoulders melted together.
    s.add(ellipsoid([0, top + 0.03, 0], [w * (woman ? 1.0 : 0.95), h * 0.24, w * 0.68]), L.pants, 0.03);
    s.add(ellipsoid([0, top + h * 0.5, 0], [w * (woman ? 0.92 : 1.0), h * 0.55, w * 0.72]), L.shirt, 0.07);
    s.add(ellipsoid([0, top + h * 0.85, -0.01], [w * 1.08, h * 0.2, w * 0.62]), L.shirt, 0.08);
    // A belt where the shirt meets the trousers.
    s.paint(roundBox([0, top + h * 0.15, 0], [1, 0.017, 1], 0), '#3a2b22', 0.003);
    s.add(roundBox([0, top + h * 0.15, w * 0.7], [0.03, 0.022, 0.02], 0.006), '#c9a45a', 0.004);
    // Neck and collar.
    s.add(cone([0, top + h * 0.8, 0], [0, top + h + 0.1, 0], 0.1, 0.09), p.skin, 0.03);
    s.add(torus([0, top + h * 0.97, 0.01], 0.1, 0.02, [-0.3, 0, 0]), L.shirtDark, 0.01);
    if (p.preset === 'man') {
      s.paint(roundBox([0, top + h * 0.6, w * 0.7], [0.017, h * 0.3, 0.1], 0), L.shirtDark, 0.003);
      for (let i = 0; i < 3; i++) s.add(sphere([0, top + h * (0.82 - i * 0.16), w * 0.71], 0.012), '#e6e1d8', 0);
    }
    if (woman) s.paint(roundBox([0, top + h * 0.3, 0], [1, 0.02, 1], 0), L.shirtDark, 0.004);
    if (likes(p, 'cooking')) {
      // An apron over the front, with a red pocket and a strap round the neck.
      const front = roundBox([0, top + h * 0.38, w * 0.62], [w * 0.82, h * 0.52, w * 0.5], 0.03);
      s.paint(front, '#f4f1ea', 0.004);
      s.paint(roundBox([0, top + h * 0.26, w * 0.8], [w * 0.3, h * 0.1, 0.1], 0.01), '#e86a5a', 0.003);
      s.paint(intersect(torus([0, top + h * 0.95, 0.04], w * 0.5, 0.016, [0.3, 0, 0]), roundBox([0, top + h, 0.2], [1, 1, 0.2], 0)), '#f4f1ea', 0.003);
    }
    if (likes(p, 'pokemon')) {
      // A Poké Ball on the front of the T-shirt.
      const y = top + h * 0.52;
      const z = w * 0.72;
      const disc = sphere([0, y, z], w * 0.36);
      s.paint(clip(disc, [0, -1, 0], -y), '#e33b3b', 0.003);
      s.paint(clip(disc, [0, 1, 0], y), '#f4f1ea', 0.003);
      s.paint(intersect(disc, roundBox([0, y, z], [1, 0.011, 1], 0)), '#1f1a17', 0.002);
      s.paint(sphere([0, y, z + 0.01], w * 0.11), '#1f1a17', 0.002);
      s.paint(sphere([0, y, z + 0.01], w * 0.07), '#f4f1ea', 0.002);
    } else if (p.preset === 'child') s.paint(roundBox([0, top + h * 0.55, 0], [1, 0.022, 1], 0), mix(p.shirt, '#ffffff', 0.55), 0.003);
    return s;
  });
}

function babyBody(p: FigureState) {
  return sculpted(key('baby-body', p), 0.015, () => {
    const s = new Sculpt();
    const dungarees = likes(p, 'cars') ? '#5b7fb0' : p.shirt;
    const top = likes(p, 'cars') ? '#f2cf5a' : mix(p.shirt, '#ffffff', 0.5);
    // Sitting: a round body, chubby legs out front in socks.
    s.add(ellipsoid([0, 0.27, 0], [0.24, 0.25, 0.22]), dungarees);
    for (const side of [-1, 1]) {
      s.add(cone([side * 0.11, 0.12, 0.05], [side * 0.12, 0.1, 0.25], 0.09, 0.075), dungarees, 0.05);
      s.add(ellipsoid([side * 0.12, 0.1, 0.31], [0.075, 0.075, 0.09]), '#f4f1ea', 0.02);
    }
    s.add(cone([0, 0.4, 0], [0, 0.55, 0], 0.11, 0.09), p.skin, 0.04);
    // The top showing above the dungarees, the bib and straps over it.
    s.paint(clip(sphere([0, 0.3, 0], 0.5), [0, -1, 0], -0.37), top, 0.004);
    s.paint(roundBox([0, 0.4, 0.2], [0.085, 0.07, 0.1], 0.02), dungarees, 0.003);
    for (const side of [-1, 1]) {
      s.paint(roundBox([side * 0.1, 0.45, 0], [0.025, 0.08, 0.3], 0), dungarees, 0.003);
      s.add(sphere([side * 0.06, 0.44, 0.21], 0.014), '#f2cf5a', 0);
    }
    s.paint(roundBox([0, 0.53, 0], [1, 0.03, 1], 0), p.skin, 0.003);
    return s;
  });
}

/**
 * An arm in two pieces: the upper arm hangs from the shoulder (its origin), the forearm and hand from
 * the elbow (`upper` below). Mirrored by `side`.
 */
export function armGeometry(p: FigureState, side: number): { upper: BufferGeometry; fore: BufferGeometry; len: number } {
  if (p.preset === 'baby') {
    const upper = sculpted(key('baby-arm', p, side), 0.013, () => {
      const top = likes(p, 'cars') ? '#f2cf5a' : mix(p.shirt, '#ffffff', 0.5);
      return new Sculpt().add(cone([0, 0.02, 0], [0, -0.15, 0], 0.065, 0.055), top).add(sphere([0, -0.19, 0.01], 0.066), p.skin, 0.03);
    });
    return { upper, fore: upper, len: 0 };
  }
  const b = BODY[p.preset as 'man' | 'woman' | 'child'];
  const lw = b.limb;
  const len = b.armL * 0.5;
  const shirt = p.shirt;
  const dark = mix(p.shirt, '#000000', 0.22);
  const short = b.sleeves === 'short';
  const upper = sculpted(key('upper', p, side), 0.013, () => {
    const s = new Sculpt();
    s.add(chain([[[0, lw * 0.25, 0], lw * 1.05], [[0, -len, 0], lw * 0.82]]), short ? p.skin : shirt);
    if (short) {
      s.paint(clip(sphere([0, 0, 0], 1), [0, -1, 0], len * 0.5), shirt, 0.003);
      s.add(intersect(shell(cone([0, lw * 0.25, 0], [0, -len, 0], lw * 1.05, lw * 0.82), 0.012), roundBox([0, -len * 0.5, 0], [1, 0.02, 1], 0)), dark, 0.005);
    }
    return s;
  });
  const fore = sculpted(key('fore', p, side), 0.011, () => {
    const s = new Sculpt();
    s.add(cone([0, 0.01, 0], [0, -len, 0], lw * 0.8, lw * 0.64), short ? p.skin : shirt);
    if (!short) s.paint(roundBox([0, -len + 0.025, 0], [1, 0.015, 1], 0), dark, 0.003);
    // A soft hand: palm, four fingers curled a little, a thumb towards the front.
    const y = -len - 0.04;
    s.add(ellipsoid([0, y, 0.008], [lw * 0.8, lw * 1.0, lw * 0.52]), p.skin, lw * 0.3);
    for (let k = 0; k < 4; k++) {
      const x = (k - 1.5) * lw * 0.38;
      s.add(chain([[[x, y - lw * 0.65, 0.008], lw * 0.2], [[x * 1.05, y - lw * 1.2, lw * 0.2], lw * 0.18], [[x, y - lw * 1.3, lw * 0.5], lw * 0.16]]), p.skin, lw * 0.12);
    }
    s.add(chain([[[-side * lw * 0.55, y + lw * 0.2, lw * 0.25], lw * 0.24], [[-side * lw * 0.8, y - lw * 0.35, lw * 0.6], lw * 0.2]]), p.skin, lw * 0.12);
    return s;
  });
  return { upper, fore, len };
}
