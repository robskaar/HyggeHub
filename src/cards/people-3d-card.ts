import { css, html, nothing, type PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import { avatarColours } from '../shared/avatar';
import { registerCard } from '../shared/base-card';
import { fetchEvents, forPerson, nowAndNext, shortPlace, type CalEvent } from '../shared/calendar';
import { formatState, friendlyName } from '../shared/format';
import { base, glass } from '../shared/styles';
import type { PersonConfig } from './family-card';
import { battery, calendars, status, whenText } from './family-card';
import type { Interest, PeopleState } from './energy-3d/people';
import type { StageLabel } from './energy-3d/stage';
import { worldStyles } from './energy-3d/world-styles';
import { WorldCard, type WorldCardConfig, type WorldLabel, type WorldModule } from './world-card';

export interface People3dCardConfig extends WorldCardConfig {
  /** The same people as the family card, plus `interests` for their dioramas. */
  people: PersonConfig[];
}

const PIN = 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 7.5a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4z';
const HOME = 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5';
const MOON = 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z';

/** Interests by the words people use for them. */
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
const interestsOf = (words: string[] = []): Interest[] =>
  words.map(w => w.toLowerCase()).flatMap(w => (Object.keys(INTEREST_WORDS) as Interest[]).filter(k => INTEREST_WORDS[k].test(w))).filter((k, i, all) => all.indexOf(k) === i);

/**
 * The family as figurines on little dioramas of what they love, side by side, each with their name,
 * where they are and their phone's battery over their head. Tapping one zooms in on them with details.
 */
export class HyggePeople3dCard extends WorldCard<People3dCardConfig> {
  @state() private events: Record<number, CalEvent[] | undefined> = {};
  private eventsFor?: string;

  static getStubConfig() {
    return { people: [{ entity: 'person.me', avatar: { preset: 'man' }, interests: ['cooking'] }] };
  }

  protected override validateConfig(c: People3dCardConfig) {
    if (!Array.isArray(c.people) || !c.people.length) throw new Error('List the people under `people`, as on the family card.');
  }

  protected override watchedEntities() {
    return this.config.people.flatMap(p => [p.entity, p.battery, p.charging, p.distance, p.sleep, ...calendars(p), ...(p.stats ?? []).map(s => s.entity)]);
  }

  protected override updated(changed: PropertyValues) {
    super.updated(changed);
    // Calendars: what each person is doing now fills in where GPS can't, and the details list what's next.
    const key = this.config.people.map(p => calendars(p).join(',')).join(';');
    if (this.hass && key !== this.eventsFor) {
      this.eventsFor = key;
      this.config.people.forEach((p, i) => {
        const cals = calendars(p).filter(id => this.hass!.states[id]);
        if (cals.length) void fetchEvents(this.hass!, cals).then(ev => (this.events = { ...this.events, [i]: forPerson(ev, p.calendar_match) }));
      });
    }
  }

  private name(p: PersonConfig) {
    return p.name ?? friendlyName(this.stateOf(p.entity), 'Someone');
  }

  private statusOf(i: number) {
    return status(this.hass, this.config.people[i], this.events[i]);
  }

  protected override createWorld(mod: WorldModule, canvas: HTMLCanvasElement, onLabels: (l: StageLabel[]) => void, dpr: number) {
    return new mod.PeopleScene(canvas, onLabels, dpr);
  }

  protected override worldState(): PeopleState {
    return {
      ...this.look(),
      people: this.config.people.map((p, i) => {
        const st = this.statusOf(i);
        return { key: `p${i}`, ...avatarColours(p.avatar), interests: interestsOf(p.interests), model: p.model, home: st.presence === 'home', asleep: st.asleep };
      }),
    };
  }

  /** Everyone's name over their head, with where they are and their battery; tap for details. */
  protected override labels(): WorldLabel[] {
    return this.config.people.map((p, i) => {
      const st = this.statusOf(i);
      const bat = battery(this.hass, p);
      const place = st.asleep ? 'Asleep' : st.label.split(' · ')[0];
      return {
        key: `p${i}`,
        value: this.name(p),
        caption: [place, bat ? `${bat.level}%${bat.charging ? ' ⚡' : ''}` : ''].filter(Boolean).join(' · '),
        icon: st.asleep ? MOON : st.presence === 'home' ? HOME : PIN,
        color: st.presence === 'home' ? 'var(--hh-ok)' : 'var(--hh-ink-2)',
      };
    });
  }

  /** Who's home, as a chip like the weather on the house. */
  protected override renderHeaderExtras() {
    const sts = this.config.people.map((_, i) => this.statusOf(i));
    const home = sts.filter(s => s.presence === 'home').length;
    const n = sts.length;
    const text = home === n ? 'All home' : home === 0 ? 'Nobody home' : `${home} of ${n} home`;
    return html`<span class="weather"><svg viewBox="0 0 24 24" class="i" style="color:${home ? 'var(--hh-ok)' : 'var(--hh-ink-3)'}"><path d=${HOME}></path></svg><b>${text}</b></span>`;
  }

  protected override detailTitle(key: string) {
    return this.name(this.config.people[Number(key.slice(1))]);
  }

  protected override detailBody(key: string) {
    const i = Number(key.slice(1));
    const p = this.config.people[i];
    const st = this.statusOf(i);
    const bat = battery(this.hass, p);
    const ev = this.events[i];
    const { now, upcoming } = ev ? nowAndNext(ev) : { now: undefined, upcoming: [] as CalEvent[] };
    const row = (name: string, value: unknown) => html`<div class="row"><span>${name}</span><b class="num">${value}</b></div>`;
    const agenda = [...(now ? [now] : []), ...upcoming.slice(0, p.agenda ?? 3)];
    return html`
      ${row(st.asleep ? 'Asleep' : 'Where', st.asleep ? st.sleepFor : st.label)}
      ${st.since ? row(st.since.startsWith('until') ? 'Until' : 'Since', st.since.replace(/^(since|until) /, '')) : nothing}
      ${bat ? row(p.battery_label ?? 'Phone', `${bat.level}%${bat.charging ? ' · charging' : ''}`) : nothing}
      ${(p.stats ?? []).map(s => row(s.name ?? friendlyName(this.stateOf(s.entity), s.entity), formatState(this.hass, this.stateOf(s.entity))))}
      ${calendars(p).length
        ? html`<h5 class="sub">Calendar</h5>
            ${agenda.length
              ? html`<ul class="agenda">
                  ${agenda.map(
                    e => html`<li class=${e === now ? 'now' : ''}>
                      <small class="num">${whenText(e, e === now, this.hass)}</small>
                      <span>${e.summary}${shortPlace(e.location) ? html`<small class="place">${shortPlace(e.location)}</small>` : nothing}</span>
                    </li>`,
                  )}
                </ul>`
              : html`<p class="note">Nothing coming up.</p>`}`
        : nothing}
      ${p.entity ? html`<button type="button" class="more" @click=${() => this.moreInfo(p.entity)}>History and settings</button>` : nothing}
    `;
  }

  static override styles = [
    base,
    glass,
    worldStyles,
    css`
      .sub {
        margin: 14px 0 2px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--hh-ink-3);
      }
      .agenda li.now span {
        font-weight: 600;
      }
      .agenda .place {
        display: block;
        font-size: 11px;
        color: var(--hh-ink-3);
      }
    `,
  ];
}

registerCard('hyggehub-people-3d-card', HyggePeople3dCard, 'HyggeHub People 3D', 'The family as figurines on little dioramas of what they love, with who is home at the top.');
