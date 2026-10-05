import { css, html, nothing } from 'lit';
import { registerCard, HyggeCard } from '../shared/base-card';
import { haIcon } from '../shared/icons';
import { friendlyName, lang, pad } from '../shared/format';
import { base, glass } from '../shared/styles';
import type { CardConfig } from '../types';

export interface HeaderCardConfig extends CardConfig {
  /** person.* entities; the first chip says who is home. */
  people?: string[];
  /** Status chips: any entity, shown with its formatted state. */
  chips?: Array<{ entity: string; icon?: string; name?: string }>;
  /** Greet the signed-in user by first name. Default true. */
  greet_by_name?: boolean;
}

export class HyggeHeaderCard extends HyggeCard<HeaderCardConfig> {
  private ticker?: number;

  static getStubConfig(hass: any) {
    return { people: Object.keys(hass?.states ?? {}).filter(id => id.startsWith('person.')) };
  }

  protected override watchedEntities() {
    return [...(this.config.people ?? []), ...(this.config.chips ?? []).map(c => c.entity)];
  }

  override getCardSize() {
    return 2;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.ticker = window.setInterval(() => this.requestUpdate(), 10_000);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.ticker);
  }

  private peopleChip() {
    const ids = this.config.people ?? [];
    if (!ids.length) return nothing;
    const people = ids.map(id => this.stateOf(id)).filter(Boolean);
    const home = people.filter(p => p!.state === 'home');
    const text = home.length === people.length ? 'Everyone home' : home.length === 0 ? 'Nobody home' : `${home.length} of ${people.length} home`;
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
    const now = new Date();
    const h = now.getHours();
    const greeting = h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    const first = this.config.greet_by_name === false ? '' : this.hass?.user?.name?.split(' ')[0];
    return html`
      <div class="hero">
        <div>
          <div class="time num">${pad(h)}:${pad(now.getMinutes())}</div>
          <p class="greet"><b>${greeting}${first ? `, ${first}` : ''}</b> · ${now.toLocaleDateString(lang(this.hass), { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div class="chips">
          ${this.peopleChip()}
          ${(this.config.chips ?? []).map(c => {
            const s = this.stateOf(c.entity);
            return html`<button class="pill" type="button" @click=${() => this.moreInfo(c.entity)}>
              ${haIcon(c.icon ?? (s?.attributes.icon as string | undefined) ?? 'mdi:information-outline')}
              ${c.name ? html`<span class="faint">${c.name}</span>` : nothing}${this.format(c.entity)}
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
        gap: 20px;
        flex-wrap: wrap;
        padding: 18px 4px 8px;
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
        max-width: 560px;
        justify-content: flex-end;
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
          justify-content: flex-start;
        }
      }
    `,
  ];
}

registerCard('hyggehub-header-card', HyggeHeaderCard, 'HyggeHub Header', 'The time, a greeting and status chips for the top of a dashboard.');
