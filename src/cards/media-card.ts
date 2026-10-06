import { css, html, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import { registerCard, HyggeCard } from '../shared/base-card';
import { filledIcon, icon } from '../shared/icons';
import { friendlyName } from '../shared/format';
import { base, glass } from '../shared/styles';
import type { CardConfig } from '../types';

export interface MediaCardConfig extends CardConfig {
  /** One speaker... */
  entity?: string;
  /** ...or several speakers and groups: the card follows whichever is playing, with chips to switch. */
  entities?: Array<string | { entity: string; name?: string }>;
  name?: string;
  /** Show a volume slider. Default true. */
  volume?: boolean;
}

const time = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export class HyggeMediaCard extends HyggeCard<MediaCardConfig> {
  /** A speaker the user tapped; otherwise the card picks the one that's playing. */
  @state() private pinned?: string;
  @state() private dragVolume?: number;
  private ticker?: number;
  private volumeTimer?: number;

  static getStubConfig(hass: any) {
    return { entity: Object.keys(hass?.states ?? {}).find(id => id.startsWith('media_player.')) ?? 'media_player.living_room' };
  }

  protected override validateConfig(c: MediaCardConfig) {
    const list = c.entities ?? (c.entity ? [c.entity] : []);
    if (!list.length) throw new Error('Set a speaker as `entity`, or several under `entities`.');
    for (const e of list) {
      const id = typeof e === 'string' ? e : e.entity;
      if (!id?.startsWith('media_player.')) throw new Error(`${id ?? 'An entry'} is not a media_player entity.`);
    }
  }

  private get speakers(): Array<{ entity: string; name?: string }> {
    const c = this.config;
    return (c.entities ?? (c.entity ? [c.entity] : [])).map(e => (typeof e === 'string' ? { entity: e } : e));
  }

  /** The pinned speaker, else the first playing, else the first paused, else the first. */
  private get current(): string {
    const list = this.speakers;
    if (this.pinned && list.some(s => s.entity === this.pinned)) return this.pinned;
    const st = (id: string) => this.stateOf(id)?.state;
    return (list.find(s => st(s.entity) === 'playing') ?? list.find(s => st(s.entity) === 'paused') ?? list[0]).entity;
  }

  protected override watchedEntities() {
    return this.speakers.map(s => s.entity);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.ticker = window.setInterval(() => {
      if (this.stateOf(this.current)?.state === 'playing') this.requestUpdate();
    }, 1000);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.ticker);
  }

  private position(): { pos: number; dur: number } {
    const s = this.stateOf(this.current);
    const a = s?.attributes ?? {};
    const dur = Number(a.media_duration) || 0;
    let pos = Number(a.media_position) || 0;
    if (s?.state === 'playing' && a.media_position_updated_at) {
      pos += (Date.now() - new Date(a.media_position_updated_at).getTime()) / 1000;
    }
    return { pos: Math.min(pos, dur || pos), dur };
  }

  private call(service: string, data: Record<string, unknown> = {}) {
    return this.callService('media_player', service, data, { entity_id: this.current });
  }

  private onVolume(e: Event, final: boolean) {
    const v = Number((e.target as HTMLInputElement).value) / 100;
    this.dragVolume = v;
    clearTimeout(this.volumeTimer);
    this.volumeTimer = window.setTimeout(
      () => {
        void this.call('volume_set', { volume_level: v });
        if (final) setTimeout(() => (this.dragVolume = undefined), 1200);
      },
      final ? 0 : 250,
    );
  }

  private seek(e: MouseEvent) {
    const { dur } = this.position();
    if (!dur) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    void this.call('media_seek', { seek_position: Math.round(((e.clientX - r.left) / r.width) * dur) });
  }

  protected override render() {
    const id = this.current;
    const s = this.stateOf(id);
    const a = s?.attributes ?? {};
    const speakers = this.speakers;
    const label = (e: { entity: string; name?: string }) => e.name ?? friendlyName(this.stateOf(e.entity), e.entity);
    const volume = this.dragVolume ?? (typeof a.volume_level === 'number' ? a.volume_level : undefined);
    const playing = s?.state === 'playing';
    const active = playing || s?.state === 'paused';
    const pic = a.entity_picture as string | undefined;
    const art = pic ? (pic.startsWith('http') ? pic : this.hass?.hassUrl(pic) ?? pic) : undefined;
    const { pos, dur } = this.position();
    const title = active ? (a.media_title as string) ?? 'Playing' : 'Nothing playing';
    const sub = active ? [a.media_artist, a.media_album_name].filter(Boolean).join(' · ') : s ? 'Pick something on your speaker' : `${id} is not available`;
    const name = speakers.length === 1 && this.config.name ? this.config.name : label(speakers.find(sp => sp.entity === id)!);

    return html`
      <ha-card class="glass media ${playing ? '' : 'paused'}">
        <button class="art" type="button" aria-label="More details" @click=${() => this.moreInfo(id)}>
          ${art ? html`<img src=${art} alt="" />` : html`<i></i>`}
          ${playing ? html`<span class="eq" aria-hidden="true"><b></b><b></b><b></b><b></b></span>` : nothing}
        </button>
        <div class="meta">
          <div class="src">${icon('speaker')} ${name}</div>
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
        ${s && volume !== undefined && this.config.volume !== false
          ? html`<label class="vol" style="--v:${volume}">
              <span class="vol-fill"></span>
              <span class="vol-label num"><span>Volume</span><span>${Math.round(volume * 100)}%</span></span>
              <input
                type="range"
                min="0"
                max="100"
                .value=${String(Math.round(volume * 100))}
                aria-label="Volume"
                @input=${(e: Event) => this.onVolume(e, false)}
                @change=${(e: Event) => this.onVolume(e, true)}
              />
            </label>`
          : nothing}
        ${speakers.length > 1
          ? html`<div class="speakers">
              ${speakers.map(sp => {
                const st = this.stateOf(sp.entity)?.state;
                return html`<button class="chip" type="button" aria-pressed=${sp.entity === id} @click=${() => (this.pinned = sp.entity)}>
                  ${st === 'playing' ? html`<span class="live"></span>` : nothing}${label(sp)}
                </button>`;
              })}
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
      }
      .eq b {
        width: 4px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.92);
        height: 100%;
        transform-origin: 50% 100%;
        transform: scaleY(0.3);
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
          transform: scaleY(0.25);
        }
        50% {
          transform: scaleY(1);
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
      .vol {
        grid-column: 1 / -1;
        position: relative;
        height: 34px;
        border-radius: 12px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        overflow: hidden;
        display: block;
      }
      .vol-fill {
        position: absolute;
        inset: 0 auto 0 0;
        width: calc(var(--v) * 100%);
        background: var(--hh-accent-soft);
      }
      .vol-label {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        font-size: 12px;
        font-weight: 600;
        color: var(--hh-ink-2);
        pointer-events: none;
      }
      .vol input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        opacity: 0;
        cursor: ew-resize;
      }
      .vol:has(input:focus-visible) {
        outline: 2px solid var(--hh-accent);
        outline-offset: 2px;
      }
      .speakers {
        grid-column: 1 / -1;
        display: flex;
        gap: 6px;
        overflow-x: auto;
        scrollbar-width: none;
        padding-bottom: 2px;
      }
      .speakers::-webkit-scrollbar {
        display: none;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex: none;
        padding: 6px 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        color: var(--hh-ink-2);
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        white-space: nowrap;
      }
      .chip[aria-pressed='true'] {
        background: var(--hh-accent);
        color: var(--hh-on-accent);
        border-color: transparent;
      }
      .live {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--hh-ok);
        animation: live 1.6s ease-in-out infinite;
      }
      @keyframes live {
        50% {
          opacity: 0.35;
        }
      }
    `,
  ];
}

registerCard('hyggehub-media-card', HyggeMediaCard, 'HyggeHub Media', 'Now playing, with artwork, a live equaliser and controls.');
