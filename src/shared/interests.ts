// What a person loves, from the words they use for it (English or Danish). In the people view's town
// each one is a little scene of its own (a Pokéball statue, a digger at work, a vegetable patch...).

export type Interest = 'cooking' | 'tech' | 'gardening' | 'decor' | 'bugs' | 'pokemon' | 'nature' | 'cars';

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
