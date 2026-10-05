import { css, html, nothing } from 'lit';
import { registerCard, HyggeCard } from '../shared/base-card';
import { filledIcon, icon } from '../shared/icons';
import { friendlyName } from '../shared/format';
import { base, glass } from '../shared/styles';
import type { CardConfig } from '../types';

export interface MediaCardConfig extends CardConfig {
  entity: string;
  name?: string;
}

const time = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export class HyggeMediaCard extends HyggeCard<MediaCardConfig> {
  private ticker?: number;

  static getStubConfig(hass: any) {
    return { entity: Object.keys(hass?.states ?? {}).find(id => id.startsWith('media_player.')) ?? 'media_player.living_room' };
  }

  protected override validateConfig(c: MediaCardConfig) {
    if (!c.entity?.startsWith('media_player.')) throw new Error('`entity` must be a media_player entity.');
  }

  protected override watchedEntities() {
    return [this.config.entity];
  }

  override connectedCallback() {
    super.connectedCallback();
    this.ticker = window.setInterval(() => {
      if (this.stateOf(this.config.entity)?.state === 'playing') this.requestUpdate();
    }, 1000);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.ticker);
  }

  private position(): { pos: number; dur: number } {
    const a = this.stateOf(this.config.entity)?.attributes ?? {};
    const dur = Number(a.media_duration) || 0;
    let pos = Number(a.media_position) || 0;
    if (this.stateOf(this.config.entity)?.state === 'playing' && a.media_position_updated_at) {
      pos += (Date.now() - new Date(a.media_position_updated_at).getTime()) / 1000;
    }
    return { pos: Math.min(pos, dur || pos), dur };
  }

  private call(service: string, data: Record<string, unknown> = {}) {
    return this.callService('media_player', service, data, { entity_id: this.config.entity });
  }

  private seek(e: MouseEvent) {
    const { dur } = this.position();
    if (!dur) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    void this.call('media_seek', { seek_position: Math.round(((e.clientX - r.left) / r.width) * dur) });
  }

  protected override render() {
    const s = this.stateOf(this.config.entity);
    const a = s?.attributes ?? {};
    const playing = s?.state === 'playing';
    const active = playing || s?.state === 'paused';
    const pic = a.entity_picture as string | undefined;
    const art = pic ? (pic.startsWith('http') ? pic : this.hass?.hassUrl(pic) ?? pic) : undefined;
    const { pos, dur } = this.position();
    const title = active ? (a.media_title as string) ?? 'Playing' : 'Nothing playing';
    const sub = active ? [a.media_artist, a.media_album_name].filter(Boolean).join(' · ') : s ? 'Pick something on your speaker' : `${this.config.entity} is not available`;

    return html`
      <ha-card class="glass media ${playing ? '' : 'paused'}">
        <button class="art" type="button" aria-label="More details" @click=${() => this.moreInfo(this.config.entity)}>
          ${art ? html`<img src=${art} alt="" />` : html`<i></i>`}
          ${playing ? html`<span class="eq" aria-hidden="true"><b></b><b></b><b></b><b></b></span>` : nothing}
        </button>
        <div class="meta">
          <div class="src">${icon('speaker')} ${this.config.name ?? friendlyName(s, this.config.entity)}</div>
          <b>${title}</b><span>${sub}</span>
        </div>
        ${active && dur
          ? html`<div class="progress num">
              <span>${time(pos)}</span>
              <button class="track" type="button" aria-label="Seek" @click=${this.seek}><i style="width:${(pos / dur) * 100}%"></i></button>
              <span>${time(dur)}</span>
            </div>`
          : nothing}
        ${s
          ? html`<div class="controls">
              <button class="round" type="button" aria-label="Previous track" @click=${() => this.call('media_previous_track')}>${filledIcon('prev')}</button>
              <button class="round play" type="button" aria-label=${playing ? 'Pause' : 'Play'} @click=${() => this.call('media_play_pause')}>
                ${filledIcon(playing ? 'pause' : 'play')}
              </button>
              <button class="round" type="button" aria-label="Next track" @click=${() => this.call('media_next_track')}>${filledIcon('next')}</button>
            </div>`
          : nothing}
      </ha-card>
    `;
  }

  static override styles = [
    base,
    glass,
    css`
      ha-card.media {
        display: grid;
        grid-template-columns: 76px 1fr;
        gap: 14px;
        align-items: center;
      }
      .art {
        width: 76px;
        height: 76px;
        border-radius: 18px;
        position: relative;
        overflow: hidden;
        background: #1d3a4a;
      }
      .art img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .art i {
        position: absolute;
        inset: -40%;
        background: conic-gradient(from 0deg, #2e8b74, #4b3f8f, #1c4a6b, #7cc4b0, #2e8b74);
        filter: blur(10px);
        animation: hh-spin 14s linear infinite;
      }
      .paused .art i {
        animation-play-state: paused;
      }
      .eq {
        position: absolute;
        left: 10px;
        bottom: 10px;
        display: flex;
        gap: 3px;
        align-items: flex-end;
        height: 22px;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
      }
      .eq b {
        width: 4px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.92);
        height: 30%;
        animation: eq 1s ease-in-out infinite;
      }
      .eq b:nth-child(2) {
        animation-delay: -0.4s;
      }
      .eq b:nth-child(3) {
        animation-delay: -0.2s;
      }
      .eq b:nth-child(4) {
        animation-delay: -0.7s;
      }
      @keyframes eq {
        0%,
        100% {
          height: 25%;
        }
        50% {
          height: 100%;
        }
      }
      .meta {
        min-width: 0;
      }
      .meta b {
        display: block;
        font-size: 15px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .meta span {
        font-size: 12.5px;
        color: var(--hh-ink-2);
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .src {
        font-size: 11.5px;
        color: var(--hh-ink-3);
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 4px;
      }
      .src svg.i {
        width: 13px;
        height: 13px;
      }
      .progress {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'IBM Plex Mono', ui-monospace, monospace;
        font-size: 11px;
        color: var(--hh-ink-3);
      }
      .track {
        flex: 1;
        height: 14px;
        display: flex;
        align-items: center;
        position: relative;
      }
      .track::before {
        content: '';
        position: absolute;
        inset: 5px 0;
        border-radius: 4px;
        background: var(--hh-line);
      }
      .track i {
        position: relative;
        display: block;
        height: 4px;
        border-radius: 4px;
        background: var(--hh-ink);
        transition: width 1s linear;
      }
      .controls {
        grid-column: 1 / -1;
        display: flex;
        justify-content: center;
        gap: 14px;
        align-items: center;
      }
      .play {
        width: 52px;
        height: 52px;
        background: var(--hh-ink);
        color: var(--hh-bg);
        border: 0;
      }
      .play:hover {
        background: var(--hh-ink);
      }
    `,
  ];
}

registerCard('hyggehub-media-card', HyggeMediaCard, 'HyggeHub Media', 'Now playing, with artwork, a live equaliser and controls.');
