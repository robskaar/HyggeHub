// The figurines, sculpted: a head with skull, cheeks, chin, nose and ears in one piece of clay, the
// hair and beard modelled as masses over it and an open grin carved in; a body with legs, hips, chest
// and shoulders melted together and the clothes painted on; arms that bend at the elbow, with hands.
// Eyes stay separate glossy parts so they can blink. See sculpt.ts for how the clay works.
import type { BufferGeometry } from 'three';
import { chain, clip, cone, ellipsoid, intersect, roundBox, Sculpt, sculpted, shell, sphere, torus, union, type V3 } from './sculpt';
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

const MOUTH = '#5a2323';
const TEETH = '#fbf8f4';
const TONGUE = '#e8838a';
const BLUSH = '#ef9a8a';

const key = (what: string, p: FigureState, extra: unknown = '') => [what, p.preset, p.hair, p.hairStyle, p.beard, p.skin, p.shirt, p.interests.join('+'), extra].join('|');

/** Where the eyes go on a head of radius R (the head's own coordinates). */
export const eyeSpot = (R: number, side: number): V3 => [side * R * 0.36, -R * 0.03, R * 0.8];

/** The head, hair and beard included, round its centre; R is the skull's radius. */
export function headGeometry(p: FigureState, R: number): BufferGeometry {
  return sculpted(key('head', p, R), R * 0.04, () => {
    const s = new Sculpt();
    const baby = p.preset === 'baby';
    const woman = p.preset === 'woman';
    const skin = p.skin;
    const hair = p.hair;
    const hairDark = mix(hair, '#000000', 0.3);
    const r = (v: number) => v * R;

    // Skull, a jaw and cheeks below it, a chin; all one piece.
    const skull = ellipsoid([0, r(0.02), r(-0.03)], [r(1.0), r(0.97), r(0.95)]);
    const jaw = ellipsoid([0, r(-0.34), r(0.12)], [r(baby ? 0.9 : 0.8), r(0.62), r(0.78)]);
    s.add(skull, skin);
    s.add(jaw, skin, r(0.2));
    for (const side of [-1, 1]) s.add(sphere([side * r(0.46), r(-0.32), r(0.5)], r(baby ? 0.42 : 0.36)), skin, r(0.15));
    if (!baby) s.add(ellipsoid([0, r(-0.68), r(0.42)], [r(woman ? 0.26 : 0.3), r(0.2), r(0.3)]), skin, r(0.15));
    // A soft brow over the eyes.
    if (!baby) s.add(ellipsoid([0, r(0.24), r(0.6)], [r(0.72), r(0.16), r(0.3)]), skin, r(0.18));
    // Nose: a small rounded one (a button for the little ones).
    s.add(ellipsoid([0, r(-0.13), r(0.9)], baby || p.preset === 'child' ? [r(0.09), r(0.07), r(0.09)] : [r(0.11), r(0.11), r(0.12)]), skin, r(0.08));
    // Ears, with a hollow.
    for (const side of [-1, 1]) {
      s.add(ellipsoid([side * r(0.96), r(-0.1), r(-0.02)], [r(0.12), r(0.22), r(0.16)], [0, side * 0.35, 0]), skin, r(0.06));
      s.sub(sphere([side * r(1.06), r(-0.1), r(0.03)], r(0.08)), r(0.03));
    }
    // Sockets the eyes sit in.
    for (const side of [-1, 1]) {
      const [x, y] = eyeSpot(R, side);
      s.sub(ellipsoid([x, y, r(0.95)], [r(0.21), r(0.24), r(0.14)]), r(0.06));
    }

    // Hair: a mass over the skull, cut at a hairline that drops towards the nape.
    const hairline = (t: number, lift = 0) => clip(shell(skull, r(t)), [0, -1, 0.55], r(0.05 - lift), r(0.05));
    const style = baby ? 'baby' : p.hairStyle;
    if (style === 'buzz') {
      // Clipper-short: a close layer, a neat line, sideburns down into the beard.
      const buzz = mix(hair, skin, 0.12);
      s.add(hairline(0.035), buzz, r(0.02));
      for (const side of [-1, 1]) s.add(cone([side * r(0.9), r(0.12), r(0.1)], [side * r(0.88), r(-0.2), r(0.2)], r(0.07), r(0.06)), buzz, r(0.03));
    } else if (style === 'short') {
      // Thick, tousled: a full cap, clumps pointing out round the crown, a fringe falling forward.
      s.add(hairline(0.1), hair, r(0.05));
      const dirs: Array<[number, number]> = [];
      for (let i = 0; i < 9; i++) dirs.push([0.55, (i / 9) * Math.PI * 2 + 0.3]);
      for (let i = 0; i < 5; i++) dirs.push([0.2, (i / 5) * Math.PI * 2]);
      dirs.forEach(([tilt, around], i) => {
        const d: V3 = [Math.sin(tilt) * Math.sin(around), Math.cos(tilt), Math.sin(tilt) * Math.cos(around)];
        if (d[2] > 0.35 && d[1] < 0.9) return; // not over the face
        const base: V3 = [d[0] * r(0.8), d[1] * r(0.8) + r(0.02), d[2] * r(0.8) - r(0.03)];
        const tip: V3 = [d[0] * r(1.3), d[1] * r(1.22) + r(0.02), d[2] * r(1.25) - r(0.12)];
        s.add(cone(base, tip, r(0.26), r(0.07)), i % 2 ? hair : mix(hair, '#000000', 0.08), r(0.07));
      });
      for (const x of [-0.42, -0.14, 0.16, 0.44]) s.add(cone([r(x), r(0.72), r(0.45)], [r(x * 1.15), r(0.42), r(0.95)], r(0.17), r(0.06)), hair, r(0.06));
    } else if (style === 'long') {
      // A side-swept fringe, locks framing the face, and a long fall down the back to the shoulders.
      s.add(hairline(0.09), hair, r(0.05));
      s.add(ellipsoid([r(0.18), r(0.62), r(0.6)], [r(0.72), r(0.26), r(0.32)], [0.5, 0, -0.35]), hair, r(0.1));
      s.add(ellipsoid([r(0.6), r(0.36), r(0.68)], [r(0.2), r(0.32), r(0.18)], [0.3, 0, -0.5]), hair, r(0.08));
      s.add(clip(ellipsoid([0, r(-0.5), r(-0.42)], [r(0.98), r(1.1), r(0.58)]), [0, -1, 0], r(1.55), r(0.1)), hair, r(0.15));
      for (const side of [-1, 1]) {
        s.add(chain([[[side * r(0.86), r(0.4), r(0.32)], r(0.24)], [[side * r(1.0), r(-0.35), r(0.25)], r(0.25)], [[side * r(0.98), r(-1.25), r(0.12)], r(0.2)], [[side * r(0.86), r(-1.55), r(0.16)], r(0.12)]]), hair, r(0.1));
      }
      for (let k = -2; k <= 2; k++) s.add(sphere([k * r(0.34), r(-1.52), r(-0.25) - Math.abs(k) * r(0.05)], r(0.2)), hairDark, r(0.12));
    } else if (style === 'baby') {
      // A fine down of hair and a curl on top.
      s.add(hairline(0.02, 0.15), mix(hair, skin, 0.25), r(0.02));
      if (!p.interests.includes('cars')) s.add(torus([0, r(0.98), r(0.22)], r(0.12), r(0.05), [1.2, 0, 0.5]), hair, r(0.03));
    }

    // Beard: a layer round the jaw and chin up into the sideburns, with a moustache.
    if (p.beard && !baby) {
      const beard = mix(hair, '#000000', 0.18);
      const t = p.beard === 'full' ? 0.1 : 0.05;
      const jawline = union(jaw, ellipsoid([0, r(-0.68), r(0.42)], [r(0.3), r(0.2), r(0.3)]));
      s.add(clip(clip(shell(jawline, r(t)), [0, 1, 0.25], r(-0.12), r(0.06)), [0, 0, -1], r(0.1), r(0.05)), beard, r(0.03));
      for (const side of [-1, 1]) s.add(cone([side * r(0.84), r(0.05), r(0.12)], [side * r(0.72), r(-0.35), r(0.42)], r(0.07), r(0.08)), beard, r(0.05));
      s.add(chain([[[r(-0.3), r(-0.34), r(0.8)], r(0.045)], [[0, r(-0.27), r(0.96)], r(0.06)], [[r(0.3), r(-0.34), r(0.8)], r(0.045)]]), beard, r(0.03));
    }

    // Blush.
    for (const side of [-1, 1]) s.paint(sphere([side * r(0.56), r(-0.32), r(0.82)], r(0.12)), BLUSH, r(0.1));

    // The open grin: a D carved into the face, teeth along the top, a tongue at the bottom.
    const grin = clip(ellipsoid([0, r(-0.38), r(0.92)], [r(baby ? 0.24 : 0.3), r(0.22), r(0.3)]), [0, 1, 0], r(-0.36), r(0.03));
    s.sub(grin, r(0.03), MOUTH);
    if (!baby) s.add(roundBox([0, r(-0.4), r(0.74)], [r(0.24), r(0.045), r(0.12)], r(0.02)), TEETH, 0);
    s.add(ellipsoid([0, r(-0.55), r(0.72)], [r(0.17), r(0.07), r(0.16)]), TONGUE, r(0.02));
    return s;
  });
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
