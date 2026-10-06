import { svg, nothing, type SVGTemplateResult } from 'lit';

/*
 * Soft-3D cartoon portraits, drawn as SVG from a few traits. Shading comes from radial gradients
 * (light from the upper left), the eyes get a glossy highlight, and the whole figure breathes and
 * blinks through CSS the host card supplies (.figure, .eye, .zz).
 */

export type Preset = 'woman' | 'man' | 'child' | 'baby';

export interface AvatarOptions {
  preset?: Preset;
  /** A name (brown, dark-brown, light-brown, blonde, black, red, auburn, grey) or a hex colour. */
  hair?: string;
  /** A name (blue, brown, hazel / green-brown, green, grey) or a hex colour. */
  eyes?: string;
  /** A name (light, fair, medium, tan, deep) or a hex colour. */
  skin?: string;
  /** Clothing colour, hex. Each preset has its own default. */
  shirt?: string;
}

const HAIR: Record<string, string> = {
  brown: '#6b4528',
  'dark-brown': '#3f2a1c',
  'light-brown': '#8f6542',
  blonde: '#d9b26a',
  black: '#231c19',
  red: '#a2502a',
  auburn: '#7e3b22',
  grey: '#a9a6a1',
};
// Iris colours run from the pupil outwards; hazel is brown near the pupil and green at the rim.
const EYES: Record<string, [string, string]> = {
  blue: ['#a9d2f2', '#3a6ca6'],
  brown: ['#a7733f', '#4f2f15'],
  hazel: ['#9a6831', '#5f7d3c'],
  'green-brown': ['#9a6831', '#5f7d3c'],
  green: ['#a4d08e', '#3d7744'],
  grey: ['#c7cfd5', '#66747f'],
};
const SKIN: Record<string, string> = { light: '#f6d6bd', fair: '#efc4a2', medium: '#d9a07a', tan: '#b97a52', deep: '#7d4f35' };
const SHIRT: Record<Preset, string> = { woman: '#7fa38f', man: '#40607a', child: '#e0a94a', baby: '#c8d9ea' };

const toRgb = (h: string) => {
  const s = h.replace('#', '');
  const f = s.length === 3 ? s.split('').map(c => c + c).join('') : s;
  return [0, 2, 4].map(i => parseInt(f.slice(i, i + 2), 16) || 0);
};
const mix = (a: string, b: string, t: number) => {
  const x = toRgb(a);
  const y = toRgb(b);
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
const light = (c: string, t: number) => mix(c, '#ffffff', t);
const dark = (c: string, t: number) => mix(c, '#000000', t);
const pick = (v: string | undefined, table: Record<string, string>, d: string) => (v ? (table[v.toLowerCase()] ?? (v.startsWith('#') ? v : d)) : d);

interface Shape {
  head: { cx: number; cy: number; rx: number; ry: number };
  eyeY: number;
  eyeDX: number;
  sclera: [number, number];
  iris: number;
  ears?: { y: number; dx: number; rx: number; ry: number };
  neck: { y: number; h: number; w: number };
  body: string;
  mouthY: number;
  mouthW: number;
  cheekY: number;
  hairBack?: string;
  hairFront: string;
  sheen: string;
  brow: number;
}

const SHAPES: Record<Preset, Shape> = {
  woman: {
    head: { cx: 100, cy: 92, rx: 41, ry: 47 },
    eyeY: 97,
    eyeDX: 17,
    sclera: [9.6, 10.6],
    iris: 7.4,
    neck: { y: 122, h: 30, w: 22 },
    body: 'M30 204 C30 164 62 146 100 146 C138 146 170 164 170 204 Z',
    mouthY: 118,
    mouthW: 9,
    cheekY: 111,
    hairBack:
      'M54 96 C46 52 74 30 100 30 C128 30 156 52 146 98 C150 120 156 140 150 160 C138 168 124 164 120 152 C116 142 116 132 118 124 L82 124 C84 132 84 142 80 152 C76 164 62 168 50 160 C44 140 50 120 54 96 Z',
    hairFront: 'M59 92 C55 56 78 39 102 39 C127 39 147 56 141 92 C138 77 130 66 118 61 C106 70 86 77 67 81 C63 84 60 88 59 92 Z',
    sheen: 'M74 54 Q98 40 126 50',
    brow: 3,
  },
  man: {
    head: { cx: 100, cy: 94, rx: 41, ry: 46 },
    eyeY: 98,
    eyeDX: 17,
    sclera: [9.2, 10],
    iris: 7,
    ears: { y: 100, dx: 41, rx: 7, ry: 10 },
    neck: { y: 124, h: 30, w: 26 },
    body: 'M24 204 C24 162 58 146 100 146 C142 146 176 162 176 204 Z',
    mouthY: 119,
    mouthW: 9,
    cheekY: 112,
    hairFront: 'M59 94 C53 60 72 37 100 35 C125 33 149 50 142 94 C140 81 136 73 130 68 C118 73 100 71 88 64 C80 70 70 77 64 85 C62 88 60 91 59 94 Z',
    sheen: 'M76 52 Q100 38 126 48',
    brow: 3.4,
  },
  child: {
    head: { cx: 100, cy: 93, rx: 45, ry: 46 },
    eyeY: 99,
    eyeDX: 19.5,
    sclera: [11, 12],
    iris: 8.6,
    ears: { y: 102, dx: 45, rx: 7, ry: 9.5 },
    neck: { y: 128, h: 28, w: 20 },
    body: 'M44 204 C44 172 70 154 100 154 C130 154 156 172 156 204 Z',
    mouthY: 121,
    mouthW: 8,
    cheekY: 113,
    hairFront:
      'M55 94 C50 55 76 36 100 36 C126 36 152 55 145 94 C142 83 138 77 132 73 L128 81 L120 71 L112 79 L104 69 L96 79 L88 71 L80 81 L74 73 C66 79 59 86 55 94 Z',
    sheen: 'M74 52 Q100 38 128 50',
    brow: 2.6,
  },
  baby: {
    head: { cx: 100, cy: 97, rx: 49, ry: 47 },
    eyeY: 103,
    eyeDX: 21,
    sclera: [12, 12.6],
    iris: 9.6,
    ears: { y: 106, dx: 49, rx: 6, ry: 8 },
    neck: { y: 134, h: 20, w: 24 },
    body: 'M50 204 C50 174 73 153 100 153 C127 153 150 174 150 204 Z',
    mouthY: 124,
    mouthW: 6,
    cheekY: 117,
    hairFront: 'M60 86 C63 61 81 49 100 49 C120 49 137 61 140 86 C130 72 116 65 100 65 C84 65 70 72 60 86 Z',
    sheen: 'M80 58 Q100 50 120 56',
    brow: 1.8,
  },
};

export function renderAvatar(opts: AvatarOptions = {}, id: string, asleep = false): SVGTemplateResult {
  const preset: Preset = opts.preset && opts.preset in SHAPES ? opts.preset : 'man';
  const s = SHAPES[preset];
  const skin = pick(opts.skin, SKIN, SKIN.fair);
  const hair = pick(opts.hair, HAIR, HAIR.brown);
  const shirt = opts.shirt?.startsWith('#') ? opts.shirt : SHIRT[preset];
  const eyeKey = opts.eyes?.toLowerCase() ?? 'brown';
  const iris: [string, string] = EYES[eyeKey] ?? (opts.eyes?.startsWith('#') ? [light(opts.eyes, 0.45), dark(opts.eyes, 0.3)] : EYES.brown);
  const ink = dark(skin, 0.55);
  const h = s.head;
  const u = (n: string) => `${id}-${n}`;

  const eye = (x: number) => {
    const y = s.eyeY;
    const [sx, sy] = s.sclera;
    const r = s.iris;
    if (asleep) return svg`<path d="M${x - sx} ${y} Q${x} ${y + sy * 0.7} ${x + sx} ${y}" fill="none" stroke=${ink} stroke-width="2.4" stroke-linecap="round"></path>`;
    const side = x < 100 ? -1 : 1;
    return svg`<g class="eye">
      <ellipse cx=${x} cy=${y} rx=${sx} ry=${sy} fill="#fdfbf8"></ellipse>
      <ellipse cx=${x} cy=${y - sy * 0.55} rx=${sx * 0.9} ry=${sy * 0.35} fill=${dark(skin, 0.15)} opacity=".18"></ellipse>
      <circle cx=${x} cy=${y + 0.6} r=${r} fill="url(#${u('iris')})"></circle>
      <circle cx=${x} cy=${y + 0.6} r=${r * 0.46} fill="#16110f"></circle>
      <circle cx=${x - r * 0.38} cy=${y - r * 0.38} r=${r * 0.3} fill="#fff"></circle>
      <circle cx=${x + r * 0.32} cy=${y + r * 0.38} r=${r * 0.13} fill="#fff" opacity=".85"></circle>
      <path
        d="M${x - sx * 0.98} ${y - sy * 0.12} Q${x} ${y - sy * 1.22} ${x + sx * 0.98} ${y - sy * 0.12}${preset === 'woman' ? ` M${x + side * sx * 0.9} ${y - sy * 0.3} q${side * 2.6} ${-1.2} ${side * 4} ${-3.6}` : ''}"
        fill="none"
        stroke=${dark(hair, 0.45)}
        stroke-width=${preset === 'woman' ? 2.4 : preset === 'baby' ? 1.2 : 1.6}
        stroke-linecap="round"
        opacity=${preset === 'baby' ? 0.5 : 0.85}
      ></path>
    </g>`;
  };

  const brow = (x: number) => {
    const y = s.eyeY - s.sclera[1] - (preset === 'baby' ? 6 : 5);
    const w = s.sclera[0] + 1;
    return svg`<path d="M${x - w} ${y + 1.5} Q${x} ${y - 3.5} ${x + w} ${y + 0.5}" fill="none" stroke=${dark(hair, 0.15)} stroke-width=${s.brow} stroke-linecap="round" opacity=${preset === 'baby' ? 0.45 : 0.9}></path>`;
  };

  const noseY = s.eyeY + (preset === 'baby' ? 10 : 11);
  const my = s.mouthY;
  const mw = s.mouthW;
  const mouth =
    preset === 'baby'
      ? svg`<path d="M${100 - mw} ${my} Q100 ${my + 9} ${100 + mw} ${my} Q100 ${my + 2} ${100 - mw} ${my} Z" fill="#a9474a"></path>
          <path d="M${100 - mw * 0.5} ${my + 3.4} Q100 ${my + 6} ${100 + mw * 0.5} ${my + 3.4}" fill="none" stroke="#e58a8a" stroke-width="1.6" stroke-linecap="round"></path>`
      : preset === 'woman'
        ? svg`<path d="M${100 - mw} ${my} Q100 ${my + 8} ${100 + mw} ${my} Q100 ${my + 2.6} ${100 - mw} ${my} Z" fill="#c4656a"></path>`
        : svg`<path d="M${100 - mw} ${my} Q100 ${my + 7} ${100 + mw} ${my}" fill="none" stroke=${ink} stroke-width="2.8" stroke-linecap="round"></path>`;

  const collar =
    preset === 'woman'
      ? svg`<path d="M84 147 Q100 166 116 147" fill=${dark(skin, 0.08)}></path>`
      : preset === 'baby'
        ? svg`<path d="M76 161 Q100 174 124 161" fill="none" stroke=${light(shirt, 0.55)} stroke-width="5" stroke-linecap="round"></path>
            <circle cx="100" cy="176" r="2.2" fill=${light(shirt, 0.7)}></circle><circle cx="100" cy="184" r="2.2" fill=${light(shirt, 0.7)}></circle>`
        : svg`<path d="M${100 - s.neck.w / 2 - 3} ${s.neck.y + s.neck.h - 4} Q100 ${s.neck.y + s.neck.h + 10} ${100 + s.neck.w / 2 + 3} ${s.neck.y + s.neck.h - 4}" fill="none" stroke=${dark(shirt, 0.22)} stroke-width="4" stroke-linecap="round"></path>`;

  // Framed as a head-and-shoulders portrait: the viewBox crops in on the face.
  return svg`<svg class="avatar" viewBox="20 22 160 160" aria-hidden="true">
    <defs>
      <radialGradient id=${u('skin')} cx="40%" cy="34%" r="72%" fx="36%" fy="28%">
        <stop offset="0" stop-color=${light(skin, 0.28)}></stop>
        <stop offset=".6" stop-color=${skin}></stop>
        <stop offset="1" stop-color=${dark(skin, 0.2)}></stop>
      </radialGradient>
      <linearGradient id=${u('neck')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${dark(skin, 0.28)}></stop>
        <stop offset=".55" stop-color=${dark(skin, 0.08)}></stop>
      </linearGradient>
      <radialGradient id=${u('hair')} cx="38%" cy="22%" r="85%" fx="34%" fy="18%">
        <stop offset="0" stop-color=${light(hair, 0.3)}></stop>
        <stop offset=".5" stop-color=${hair}></stop>
        <stop offset="1" stop-color=${dark(hair, 0.35)}></stop>
      </radialGradient>
      <linearGradient id=${u('shirt')} x1=".2" y1="0" x2=".8" y2="1">
        <stop offset="0" stop-color=${light(shirt, 0.2)}></stop>
        <stop offset="1" stop-color=${dark(shirt, 0.22)}></stop>
      </linearGradient>
      <radialGradient id=${u('iris')} cx="50%" cy="50%" r="50%">
        <stop offset=".35" stop-color=${iris[0]}></stop>
        <stop offset="1" stop-color=${iris[1]}></stop>
      </radialGradient>
    </defs>
    <g class="figure">
      ${s.hairBack ? svg`<path d=${s.hairBack} fill="url(#${u('hair')})"></path>` : nothing}
      <path d=${s.body} fill="url(#${u('shirt')})"></path>
      <rect x=${100 - s.neck.w / 2} y=${s.neck.y} width=${s.neck.w} height=${s.neck.h} rx=${s.neck.w / 2.4} fill="url(#${u('neck')})"></rect>
      ${collar}
      ${s.ears
        ? svg`<ellipse cx=${100 - s.ears.dx} cy=${s.ears.y} rx=${s.ears.rx} ry=${s.ears.ry} fill=${dark(skin, 0.06)}></ellipse>
            <ellipse cx=${100 + s.ears.dx} cy=${s.ears.y} rx=${s.ears.rx} ry=${s.ears.ry} fill=${dark(skin, 0.1)}></ellipse>`
        : nothing}
      <ellipse cx=${h.cx} cy=${h.cy} rx=${h.rx} ry=${h.ry} fill="url(#${u('skin')})"></ellipse>
      <ellipse cx=${h.cx - h.rx * 0.28} cy=${h.cy - h.ry * 0.38} rx=${h.rx * 0.34} ry=${h.ry * 0.16} fill="#fff" opacity=".16"></ellipse>
      <ellipse cx=${100 - s.eyeDX - 6} cy=${s.cheekY} rx=${preset === 'baby' ? 9 : 7} ry=${preset === 'baby' ? 5.5 : 4.2} fill="#ff8a80" opacity=${preset === 'baby' ? 0.34 : 0.22}></ellipse>
      <ellipse cx=${100 + s.eyeDX + 6} cy=${s.cheekY} rx=${preset === 'baby' ? 9 : 7} ry=${preset === 'baby' ? 5.5 : 4.2} fill="#ff8a80" opacity=${preset === 'baby' ? 0.34 : 0.22}></ellipse>
      ${preset === 'child'
        ? svg`<g fill=${dark(skin, 0.35)} opacity=".55"><circle cx="89" cy="111" r="1"></circle><circle cx="93" cy="113" r=".9"></circle><circle cx="107" cy="113" r=".9"></circle><circle cx="111" cy="111" r="1"></circle></g>`
        : nothing}
      ${eye(100 - s.eyeDX)} ${eye(100 + s.eyeDX)} ${brow(100 - s.eyeDX)} ${brow(100 + s.eyeDX)}
      <path d="M97 ${noseY} Q100 ${noseY + 4.5} 103 ${noseY}" fill="none" stroke=${dark(skin, 0.28)} stroke-width="2" stroke-linecap="round"></path>
      <ellipse cx="99" cy=${noseY - 4} rx="2" ry="1.2" fill="#fff" opacity=".35"></ellipse>
      ${mouth}
      <path d=${s.hairFront} fill="url(#${u('hair')})"></path>
      ${preset === 'baby'
        ? svg`<path d="M98 51 C89 45 91 32 102 32 C110 33 111 42 103 44" fill="none" stroke="url(#${u('hair')})" stroke-width="5.5" stroke-linecap="round"></path>`
        : nothing}
      <path d=${s.sheen} fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".2"></path>
      ${preset === 'woman' ? svg`<circle cx="60" cy="112" r="2.4" fill="#e8c77a"></circle><circle cx="140" cy="112" r="2.4" fill="#e8c77a"></circle>` : nothing}
    </g>
  </svg>`;
}
