import { svg, nothing, type SVGTemplateResult } from 'lit';

/*
 * A soft-3D side view of an electric crossover (an ID.5-like coupé roofline), drawn like the portraits:
 * shaded body, glass, rims and the front light bar. While charging, the port glows and a ring pulses
 * from it; those are separate elements animated with transform and opacity only (see the card's CSS).
 */

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

/** Named VW-ish colours, or any hex. */
const COLOURS: Record<string, string> = {
  grey: '#8b9399',
  'moonstone-grey': '#9aa3a8',
  white: '#e9ecee',
  'glacier-white': '#e9ecee',
  black: '#2b2e31',
  blue: '#2f5f8f',
  'dark-blue': '#283c5c',
  red: '#a8332e',
  'kings-red': '#a8332e',
  silver: '#b7bdc2',
  green: '#4c6b52',
};

export function carColour(name?: string): string {
  if (!name) return COLOURS['moonstone-grey'];
  return COLOURS[name.toLowerCase()] ?? (name.startsWith('#') ? name : COLOURS['moonstone-grey']);
}

export function renderCar(colour: string, id: string, charging: boolean): SVGTemplateResult {
  const light = mix(colour, '#ffffff', 0.35);
  const dark = mix(colour, '#000000', 0.35);
  const u = (n: string) => `${id}-${n}`;
  const wheel = (cx: number) => svg`
    <circle cx=${cx} cy="85" r="19.5" fill="#1d2023"></circle>
    <circle cx=${cx} cy="85" r="12.5" fill="url(#${u('rim')})"></circle>
    <g stroke="#2a2e32" stroke-width="2.4" stroke-linecap="round">
      <path d="M${cx} 75.5v19M${cx - 9} 82l18 6M${cx - 5.6} 92.7l11.2-15.4"></path>
    </g>
    <circle cx=${cx} cy="85" r="2.8" fill="#5b636a"></circle>`;
  return svg`<svg class="car" viewBox="0 0 248 110" aria-hidden="true">
    <defs>
      <linearGradient id=${u('body')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${light}></stop>
        <stop offset=".45" stop-color=${colour}></stop>
        <stop offset="1" stop-color=${dark}></stop>
      </linearGradient>
      <linearGradient id=${u('glass')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3b4a55"></stop>
        <stop offset="1" stop-color="#151b20"></stop>
      </linearGradient>
      <radialGradient id=${u('rim')} cx="40%" cy="35%" r="70%">
        <stop offset="0" stop-color="#d9dee2"></stop>
        <stop offset="1" stop-color="#7c858c"></stop>
      </radialGradient>
      <radialGradient id=${u('shadow')} cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#000" stop-opacity=".35"></stop>
        <stop offset="1" stop-color="#000" stop-opacity="0"></stop>
      </radialGradient>
    </defs>
    <ellipse cx="126" cy="104" rx="114" ry="6" fill="url(#${u('shadow')})"></ellipse>
    <path
      d="M14 70C14 60 20 53 32 51L64 46C80 32 100 23 126 22L156 22C176 22 192 30 206 42L220 47C230 50 236 57 236 66L236 78C236 82 233 85 229 85L212 85A23 23 0 0 0 166 85L88 85A23 23 0 0 0 42 85L20 85C16 85 14 82 14 78Z"
      fill="url(#${u('body')})"
    ></path>
    <path d="M18 80.5H40M90 80.5H164M214 80.5H233" stroke="#24282c" stroke-width="7" stroke-linecap="round" opacity=".55"></path>
    <path d="M28 58L222 53" stroke="#fff" stroke-opacity=".28" stroke-width="2" stroke-linecap="round" fill="none"></path>
    <path d="M72 46C88 34 104 27 126 26.5L138 26.5L138 46Z" fill="url(#${u('glass')})"></path>
    <path d="M142 26.5L156 26.5C172 26.5 186 33 198 43L142 46Z" fill="url(#${u('glass')})"></path>
    <path d="M80 41C93 33 106 29.5 122 29" stroke="#fff" stroke-opacity=".25" stroke-width="1.6" stroke-linecap="round" fill="none"></path>
    <rect x="219" y="54" width="16" height="3.2" rx="1.6" fill="#e9f4ff" opacity=".9"></rect>
    <rect x="15" y="56" width="10" height="3.2" rx="1.6" fill="#d23b33" opacity=".85"></rect>
    <path d="M104 63h13M162 62h13" stroke=${dark} stroke-width="2" stroke-linecap="round"></path>
    ${wheel(65)} ${wheel(189)}
    ${charging ? svg`<circle cx="38" cy="60" r="4" fill="#7ee0b5"></circle>` : nothing}
  </svg>`;
}
