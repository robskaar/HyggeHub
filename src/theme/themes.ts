// Complete palettes. A theme is chosen as a whole; there is deliberately no separate accent picker.
// `surface` is the opaque colour used for things that must not be see-through (dialogs, the sidebar).

export interface Palette {
  name: string;
  description: string;
  dark: boolean;
  bg: string;
  surface: string;
  ink: string;
  ink2: string;
  ink3: string;
  glass: string;
  glassStrong: string;
  glassPress: string;
  stroke: string;
  line: string;
  highlight: string;
  shadow: string;
  blob1: string;
  blob2: string;
  blob3: string;
  blob4: string;
  accent: string;
  onAccent: string;
  warm: string;
  onWarm: string;
  ok: string;
  warn: string;
  crit: string;
  particle: string;
}

const LIGHT_SHADOW = '0 1px 1px rgba(30,45,55,.04), 0 14px 34px -14px rgba(30,45,55,.22)';
const DARK_SHADOW = '0 22px 44px -22px rgba(0,0,0,.7)';

export const THEMES = {
  fjord: {
    name: 'Fjord', description: 'Misty blue water', dark: false,
    bg: '#DCE3E5', surface: '#EEF2F3', ink: '#18242A', ink2: '#4C5D66', ink3: '#7F909A',
    glass: 'rgba(255,255,255,.44)', glassStrong: 'rgba(255,255,255,.66)', glassPress: 'rgba(255,255,255,.82)',
    stroke: 'rgba(255,255,255,.72)', line: 'rgba(24,36,42,.09)', highlight: 'rgba(255,255,255,.6)', shadow: LIGHT_SHADOW,
    blob1: '#9FC0C6', blob2: '#C4D4BF', blob3: '#EAD9C3', blob4: '#B4C0DA',
    accent: '#2F6E86', onAccent: '#FFFFFF', warm: '#EDA84E', onWarm: '#3B2708',
    ok: '#3C7F5F', warn: '#B9792A', crit: '#AE3F3B', particle: 'rgba(84,110,124,.5)',
  },
  birch: {
    name: 'Birch', description: 'Pale wood and linen', dark: false,
    bg: '#E9E3D9', surface: '#F5F1EA', ink: '#2A241C', ink2: '#625849', ink3: '#958A79',
    glass: 'rgba(255,252,246,.48)', glassStrong: 'rgba(255,252,246,.7)', glassPress: 'rgba(255,252,246,.86)',
    stroke: 'rgba(255,255,255,.75)', line: 'rgba(42,36,28,.09)', highlight: 'rgba(255,255,255,.65)',
    shadow: '0 1px 1px rgba(60,45,30,.05), 0 14px 34px -14px rgba(60,45,30,.24)',
    blob1: '#E6CFAE', blob2: '#C9D3B8', blob3: '#F1E6D4', blob4: '#D8BFA6',
    accent: '#7A5A36', onAccent: '#FFFFFF', warm: '#E59A3E', onWarm: '#3A2508',
    ok: '#4E7D4E', warn: '#B4761F', crit: '#A4443A', particle: 'rgba(110,90,70,.45)',
  },
  lichen: {
    name: 'Lichen', description: 'Sage and moss', dark: false,
    bg: '#DDE5DC', surface: '#EEF3ED', ink: '#1C2620', ink2: '#4F5F54', ink3: '#839287',
    glass: 'rgba(250,255,250,.44)', glassStrong: 'rgba(250,255,250,.66)', glassPress: 'rgba(250,255,250,.84)',
    stroke: 'rgba(255,255,255,.72)', line: 'rgba(28,38,32,.09)', highlight: 'rgba(255,255,255,.6)',
    shadow: '0 1px 1px rgba(30,50,40,.04), 0 14px 34px -14px rgba(30,50,40,.22)',
    blob1: '#B6CDB2', blob2: '#D7E0C4', blob3: '#A9C3BF', blob4: '#E5E2CC',
    accent: '#3F6E4F', onAccent: '#FFFFFF', warm: '#E3A34C', onWarm: '#3A2808',
    ok: '#3E7F55', warn: '#B27A2A', crit: '#A8423E', particle: 'rgba(80,105,90,.5)',
  },
  polar: {
    name: 'Polar night', description: 'Ink blue, ice accents', dark: true,
    bg: '#091015', surface: '#141E24', ink: '#E5EDF0', ink2: '#A1B1B9', ink3: '#6B7D87',
    glass: 'rgba(20,32,38,.46)', glassStrong: 'rgba(32,48,56,.62)', glassPress: 'rgba(48,68,78,.7)',
    stroke: 'rgba(255,255,255,.1)', line: 'rgba(255,255,255,.07)', highlight: 'rgba(255,255,255,.07)', shadow: DARK_SHADOW,
    blob1: '#1A6A5A', blob2: '#37306E', blob3: '#0F3149', blob4: '#2A6047',
    accent: '#86C3D6', onAccent: '#0A1418', warm: '#F3BB6A', onWarm: '#2E1E06',
    ok: '#6DC196', warn: '#E7B25C', crit: '#E8756F', particle: 'rgba(255,255,255,.75)',
  },
  aurora: {
    name: 'Aurora', description: 'Green and violet glow', dark: true,
    bg: '#070D10', surface: '#0F1A1D', ink: '#E4F0EC', ink2: '#9DB5AD', ink3: '#66807A',
    glass: 'rgba(14,28,30,.42)', glassStrong: 'rgba(26,46,48,.6)', glassPress: 'rgba(40,66,66,.7)',
    stroke: 'rgba(255,255,255,.1)', line: 'rgba(255,255,255,.07)', highlight: 'rgba(255,255,255,.07)', shadow: DARK_SHADOW,
    blob1: '#1E8F6E', blob2: '#5B3FA0', blob3: '#0E3B4A', blob4: '#2FAF84',
    accent: '#7EE0B5', onAccent: '#06130E', warm: '#F1C46E', onWarm: '#2C1F06',
    ok: '#74C99A', warn: '#EDB65E', crit: '#F07E7A', particle: 'rgba(220,255,240,.75)',
  },
  ember: {
    name: 'Ember', description: 'Sauna coals and amber', dark: true,
    bg: '#110C0A', surface: '#1E1613', ink: '#F1E7DF', ink2: '#BBA899', ink3: '#806E61',
    glass: 'rgba(36,24,20,.45)', glassStrong: 'rgba(54,38,32,.6)', glassPress: 'rgba(74,52,42,.7)',
    stroke: 'rgba(255,230,210,.1)', line: 'rgba(255,230,210,.07)', highlight: 'rgba(255,240,230,.07)', shadow: DARK_SHADOW,
    blob1: '#6E2F1C', blob2: '#3A2420', blob3: '#8A4A22', blob4: '#2A2A3A',
    accent: '#F0A86A', onAccent: '#1E120A', warm: '#F6C373', onWarm: '#2E1D06',
    ok: '#8CC79A', warn: '#EDB65E', crit: '#F07A6E', particle: 'rgba(255,235,220,.7)',
  },
} satisfies Record<string, Palette>;

export type ThemeKey = keyof typeof THEMES;
export const THEME_KEYS = Object.keys(THEMES) as ThemeKey[];
export const isThemeKey = (k: unknown): k is ThemeKey => typeof k === 'string' && k in THEMES;
