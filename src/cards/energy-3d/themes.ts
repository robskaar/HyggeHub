// Countdown themes, kept apart from the three.js code so the cards can pick one without loading it.

export type Theme = 'beach' | 'gift' | 'mountain' | 'christmas' | 'generic';

/** Guess a theme from the countdown's icon and name. */
export function themeOf(icon = '', name = ''): Theme {
  const t = `${icon} ${name}`.toLowerCase();
  if (/beach|palm|umbrella-beach|sun|summer|sommer|ferie|holiday|island|pool/.test(t)) return 'beach';
  if (/gift|cake|birthday|fødsel|party|balloon|celebrat|fest/.test(t)) return 'gift';
  if (/pine-tree|christmas|jul|snowflake|santa|string-lights/.test(t)) return 'christmas';
  if (/mountain|hdr|ski|airplane|flight|plane|hiking|travel|rejse|trip|map/.test(t)) return 'mountain';
  return 'generic';
}
