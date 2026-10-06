import { css, html, nothing } from 'lit';
import { registerCard, HyggeCard } from '../shared/base-card';
import { haIcon } from '../shared/icons';
import { friendlyName, lang, pad } from '../shared/format';
import { base, glass } from '../shared/styles';
import type { CardConfig } from '../types';

export interface HeaderCardConfig extends CardConfig {
  /** person.* entities for a "who's home" chip. */
  people?: string[];
  /** Status chips: any entity, shown with its formatted state. */
  chips?: Array<{ entity: string; icon?: string; name?: string }>;
  /** Off by default: phones show the time and you know your own name and the day. */
  clock?: boolean;
  greeting?: boolean;
  date?: boolean;
}

/** A slim row of status chips for the top of a dashboard; optionally a clock, greeting and date. */
export class HyggeHeaderCard extends HyggeCard<HeaderCardConfig> {
  private ticker?: number;

  static getStubConfig() {
    return { chips: [] };
  }

  protected override watchedEntities() {
    return [...(this.config.people ?? []), ...(this.config.chips ?? []).map(c => c.entity)];
  }

  override getCardSize() {
    return this.config.clock ? 2 : 1;
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.config?.clock || this.config?.greeting) this.ticker = window.setInterval(() => this.requestUpdate(), 10_000);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.ticker);
  }

  private peopleChip() {
    const people = (this.config.people ?? []).map(id => this.stateOf(id)).filter(Boolean);
    if (!people.length) return nothing;
    const home = people.filter(p => p!.state === 'home').length;
    const text = home === people.length ? 'All home' : home === 0 ? 'No one home' : `${home} of ${people.length} home`;
    return html`<span class="pill">
      <span class="avatars">
        ${people.map(p => {
          const pic = p!.attributes.entity_picture as string | undefined;
          const name = friendlyName(p, '?');
          return html`<span class=${p!.state === 'home' ? 'home' : 'away'} title=${name}>${pic ? html`<img src=${pic} alt="" />` : name.charAt(0)}</span>`;
        })}
      </span>
      ${text}
    </span>`;
  }

  protected override render() {
    const c = this.config;
    const now = new Date();
    const h = now.getHours();
    const greeting = h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    const first = this.hass?.user?.name?.split(' ')[0];
    const chips = c.chips ?? [];
    const hasText = c.clock || c.greeting || c.date;
    if (!hasText && !chips.length && !c.people?.length) {
      this.style.display = 'none';
      return nothing;
    }
    this.style.display = '';
    return html`
      <div class="hero">
        ${hasText
          ? html`<div>
              ${c.clock ? html`<div class="time num">${pad(h)}:${pad(now.getMinutes())}</div>` : nothing}
              ${c.greeting || c.date
                ? html`<p class="greet">
                    ${c.greeting ? html`<b>${greeting}${first ? `, ${first}` : ''}</b>` : nothing}${c.greeting && c.date ? ' · ' : ''}${c.date
                      ? now.toLocaleDateString(lang(this.hass), { weekday: 'long', day: 'numeric', month: 'long' })
                      : nothing}
                  </p>`
                : nothing}
            </div>`
          : nothing}
        <div class="chips">
          ${this.peopleChip()}
          ${chips.map(ch => {
            const s = this.stateOf(ch.entity);
            return html`<button class="pill" type="button" @click=${() => this.moreInfo(ch.entity)}>
              ${haIcon(ch.icon ?? (s?.attributes.icon as string | undefined) ?? 'mdi:information-outline')}
              ${ch.name ? html`<span class="faint">${ch.name}</span>` : nothing}${this.format(ch.entity)}
            </button>`;
          })}
        </div>
      </div>
    `;
  }

  static override styles = [
    base,
    glass,
    css`
      .hero {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px 20px;
        flex-wrap: wrap;
        padding: 8px 4px 4px;
      }
      .time {
        font-weight: 200;
        font-size: clamp(56px, 9vw, 104px);
        line-height: 0.9;
        letter-spacing: -0.04em;
      }
      .greet {
        margin: 10px 0 0;
        font-size: 18px;
        color: var(--hh-ink-2);
      }
      .greet b {
        color: var(--hh-ink);
        font-weight: 600;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-left: auto;
        --mdc-icon-size: 16px;
      }
      .chips .pill {
        padding: 8px 12px;
        font-size: 12.5px;
        -webkit-backdrop-filter: blur(var(--hh-blur));
        backdrop-filter: blur(var(--hh-blur));
      }
      .avatars {
        display: inline-flex;
      }
      .avatars span {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        overflow: hidden;
        font-size: 10px;
        font-weight: 700;
        color: var(--hh-on-accent);
        background: var(--hh-accent);
        border: 2px solid var(--hh-glass-strong);
      }
      .avatars span.away {
        filter: grayscale(1);
        opacity: 0.55;
      }
      .avatars span + span {
        margin-left: -6px;
      }
      .avatars img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      @media (max-width: 560px) {
        .chips {
          margin-left: 0;
        }
      }
    `,
  ];
}

registerCard('hyggehub-header-card', HyggeHeaderCard, 'HyggeHub Header', 'A slim row of status chips; a clock, greeting and date if you want them.');
