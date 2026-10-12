// What a person loves, from the words they use for it (English or Danish). Shared by the people card and
// the script that bakes the family's figurines (scripts/build-people.mjs), so both read them the same.
import type { Interest } from '../cards/energy-3d/people';

const INTEREST_WORDS: Record<Interest, RegExp> = {
  cooking: /cook|kitchen|food|bak|mad|køkken/,
  tech: /tech|gadget|computer|code|drone|it\b|nørd/,
  gardening: /garden|plant|have\b|flower|blomst/,
  decor: /decor|interior|furnish|home|bolig|indretning|design/,
  bugs: /bug|insect|beetle|butterfl|insekt|kryb/,
  pokemon: /pok[eé]mon/,
  nature: /nature|natur|forest|skov|outdoor/,
  cars: /car|digger|bobcat|excavat|truck|construct|bil|gravko|maskin|tractor|traktor/,
};

export const interestsOf = (words: string[] = []): Interest[] =>
  words.map(w => w.toLowerCase()).flatMap(w => (Object.keys(INTEREST_WORDS) as Interest[]).filter(k => INTEREST_WORDS[k].test(w))).filter((k, i, all) => all.indexOf(k) === i);
