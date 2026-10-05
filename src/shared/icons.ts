import { html, svg, nothing, type TemplateResult } from 'lit';

// Built-in interface glyphs (navigation, keypad, list actions). Entity icons the user configures go
// through Home Assistant's <ha-icon> instead, so any `mdi:` name works.
const PATHS = {
  check: 'M5 12.5l4.5 4.5L19 7.5',
  x: 'M6 6l12 12M18 6L6 18',
  plus: 'M12 5v14M5 12h14',
  undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3',
  left: 'M19 12H5M11 6l-6 6 6 6',
  chev: 'M6 9l6 6 6-6',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  backspace: 'M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7zM13 10l4 4M17 10l-4 4',
  shield: 'M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6zM9 12l2 2 4-4',
  shieldAlert: 'M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6zM12 8v5M12 16h.01',
  lock: 'M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM8 11V8a4 4 0 0 1 8 0v3',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 21h4',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
  sliders: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M16 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM10 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM18 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 8h.01',
  menu: 'M4 7h16M4 12h16M4 17h16',
  home: 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5',
  speaker: 'M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM12 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 7h.01',
} as const;

const FILLED = {
  play: 'M8 5.5v13l10.5-6.5z',
  pause: 'M7 5h3.6v14H7zM13.4 5H17v14h-3.6z',
  next: 'M6 6l9 6-9 6zM16.5 6h2v12h-2z',
  prev: 'M18 6l-9 6 9 6zM5.5 6h2v12h-2z',
} as const;

export type IconName = keyof typeof PATHS;
export type FilledIconName = keyof typeof FILLED;

export const icon = (name: IconName, cls = ''): TemplateResult =>
  svg`<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d=${PATHS[name]}></path></svg>`;

export const filledIcon = (name: FilledIconName, cls = ''): TemplateResult =>
  svg`<svg class="i fill ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d=${FILLED[name]}></path></svg>`;

/** A configurable Material Design icon via Home Assistant's own element. */
export const haIcon = (name: string | undefined, cls = '') => (name ? html`<ha-icon class=${cls} .icon=${name}></ha-icon>` : nothing);
