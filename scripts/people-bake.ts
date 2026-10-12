// The part of `npm run people` that runs the figure code: every person in scripts/people.json is
// sculpted exactly as the card would sculpt them, and everything made is handed back for writing out.
// (Bundled by scripts/build-people.mjs; not part of the card.)
import { avatarColours } from '../src/shared/avatar';
import { interestsOf } from '../src/shared/interests';
import type { FigureState } from '../src/cards/energy-3d/people';
import { allHeads, armParts, BODY, bodyParts, charmanderGeometry, headParts, mewtwoGeometry, SHAPES_VERSION } from '../src/cards/energy-3d/figures';
import { allSculpted } from '../src/cards/energy-3d/sculpt';

export function bake(people: Array<{ avatar?: Record<string, unknown>; interests?: string[] }>) {
  for (const p of people) {
    const st = { key: 'p', ...avatarColours(p.avatar as never), interests: interestsOf(p.interests), home: true, asleep: false } as FigureState;
    const R = st.preset === 'baby' ? 0.3 : BODY[st.preset].headR;
    headParts(st, R);
    bodyParts(st);
    armParts(st, -1);
    armParts(st, 1);
  }
  charmanderGeometry();
  mewtwoGeometry();
  return { version: SHAPES_VERSION, meshes: allSculpted(), heads: allHeads() };
}
