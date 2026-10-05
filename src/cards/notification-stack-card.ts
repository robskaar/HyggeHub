import { css, html, nothing, type PropertyValues } from 'lit';
import { query, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { registerCard, HyggeCard } from '../shared/base-card';
import { haIcon, icon } from '../shared/icons';
import { relativeAge } from '../shared/format';
import { base, glass } from '../shared/styles';
import type { CardConfig, Unsubscribe } from '../types';

type Severity = 'info' | 'ok' | 'warn' | 'crit';

interface Notification {
  notification_id: string;
  title?: string | null;
  message: string;
  created_at: string;
}

interface Rule {
  /** Case-insensitive text or regular expression tested against the id, title and message. */
  match: string;
  icon?: string;
  severity?: Severity;
}

export interface NotificationStackConfig extends CardConfig {
  title?: string;
  /** Checked before the built-in rules; the first match decides icon and colour. */
  rules?: Rule[];
  hide_when_empty?: boolean;
}

const DEFAULT_RULES: Rule[] = [
  { match: 'login attempt|unauthori', icon: 'mdi:shield-alert-outline', severity: 'crit' },
  { match: 'leak|smoke|fire|flood', icon: 'mdi:alert-octagon-outline', severity: 'crit' },
  { match: 'battery', icon: 'mdi:battery-alert-variant-outline', severity: 'crit' },
  { match: 'laundry|washing|wash|dryer', icon: 'mdi:washing-machine', severity: 'info' },
  { match: 'door|window|open', icon: 'mdi:door-open', severity: 'warn' },
  { match: 'update|upgrade', icon: 'mdi:package-up', severity: 'info' },
  { match: 'delivered|parcel|package', icon: 'mdi:package-variant-closed', severity: 'ok' },
  { match: 'done|finished|complete|ready', icon: 'mdi:check-circle-outline', severity: 'ok' },
];
const SEVERITY_VAR: Record<Severity, string> = { info: 'var(--hh-accent)', ok: 'var(--hh-ok)', warn: 'var(--hh-warn)', crit: 'var(--hh-crit)' };
const PEEK = 11;
const GAP = 10;

const plain = (md: string) =>
  md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export class HyggeNotificationStackCard extends HyggeCard<NotificationStackConfig> {
  @state() private notes: Record<string, Notification> = {};
  @state() private open = false;
  @state() private loaded = false;
  @query('.stack') private stackEl?: HTMLElement;
  private leaving = new Set<string>();
  private unsub?: Promise<Unsubscribe>;
  private ageTimer?: number;

  static getStubConfig() {
    return { title: 'Notifications' };
  }

  override getCardSize() {
    return 3;
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.hasUpdated) this.subscribe();
    this.ageTimer = window.setInterval(() => this.requestUpdate(), 60_000);
    window.addEventListener('resize', this.layout);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.unsub?.then(u => u()).catch(() => {});
    this.unsub = undefined;
    clearInterval(this.ageTimer);
    window.removeEventListener('resize', this.layout);
    this.resizeObs.disconnect();
  }

  private subscribe() {
    if (this.unsub || !this.hass) return;
    this.unsub = this.hass.connection
      .subscribeMessage<{ type: string; notifications: Record<string, Notification> }>(msg => {
        const next = msg.type === 'current' ? {} : { ...this.notes };
        if (msg.type === 'removed') for (const id of Object.keys(msg.notifications)) delete next[id];
        else Object.assign(next, msg.notifications);
        this.notes = next;
        this.loaded = true;
      }, { type: 'persistent_notification/subscribe' })
      .catch(err => {
        console.warn('HyggeHub: notifications unavailable', err);
        this.loaded = true;
        return () => {};
      });
  }

  // Note heights change after the first paint (web fonts arriving, the card resizing), so the stack is
  // re-measured whenever any note changes size rather than only after a render.
  private resizeObs = new ResizeObserver(() => this.layout());

  protected override updated(changed: PropertyValues) {
    super.updated(changed);
    if (changed.has('hass')) this.subscribe();
    this.stackEl?.querySelectorAll('.note').forEach(el => this.resizeObs.observe(el));
    this.layout();
  }

  private get list(): Notification[] {
    return Object.values(this.notes).sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  private lookFor(n: Notification): { icon: string; color: string } {
    const hay = `${n.notification_id} ${n.title ?? ''} ${n.message}`;
    for (const r of [...(this.config.rules ?? []), ...DEFAULT_RULES]) {
      let hit = false;
      try {
        hit = new RegExp(r.match, 'i').test(hay);
      } catch {
        hit = hay.toLowerCase().includes(r.match.toLowerCase());
      }
      if (hit) return { icon: r.icon ?? 'mdi:bell-outline', color: SEVERITY_VAR[r.severity ?? 'info'] };
    }
    return { icon: 'mdi:bell-outline', color: SEVERITY_VAR.info };
  }

  /** Positions every card: a fanned stack when collapsed, a list when open. */
  private layout = () => {
    const stack = this.stackEl;
    if (!stack) return;
    const els = [...stack.querySelectorAll<HTMLElement>('.note')].filter(el => !this.leaving.has(el.dataset.id!));
    if (!els.length) {
      stack.style.height = '0px';
      return;
    }
    const h0 = els[0].offsetHeight;
    let y = 0;
    els.forEach((el, i) => {
      const h = el.offsetHeight;
      el.style.zIndex = String(els.length - i);
      if (this.open) {
        el.style.transform = `translateY(${y}px) scale(1)`;
        el.style.opacity = '1';
        el.dataset.depth = '0';
        y += h + GAP;
      } else {
        const d = Math.min(i, 3);
        el.style.transform = `translateY(${h0 - h + d * PEEK}px) scale(${1 - d * 0.05})`;
        el.style.opacity = i < 3 ? '1' : '0';
        el.dataset.depth = String(d);
      }
    });
    stack.style.height = `${this.open ? y - GAP : h0 + Math.min(els.length - 1, 2) * PEEK}px`;
  };

  private toggle() {
    this.open = !this.open;
    setTimeout(this.layout, 420);
  }

  private dismiss(id: string, el?: HTMLElement, dir = 1) {
    this.leaving.add(id);
    if (el) {
      el.style.translate = `${dir * 115}% 0`;
      el.style.opacity = '0';
    }
    this.layout();
    setTimeout(() => {
      this.callService('persistent_notification', 'dismiss', { notification_id: id }).catch(() => {
        this.leaving.delete(id);
        if (el) el.style.translate = '';
        this.layout();
      });
    }, 320);
  }

  private clearAll() {
    const els = [...(this.stackEl?.querySelectorAll<HTMLElement>('.note') ?? [])];
    els.forEach((el, i) => setTimeout(() => this.dismiss(el.dataset.id!, el), i * 80));
  }

  private onDown(e: PointerEvent, n: Notification, index: number) {
    if ((e.target as HTMLElement).closest('button')) return;
    if (!this.open && index !== 0) return;
    const el = e.currentTarget as HTMLElement;
    const sx = e.clientX;
    let dx = 0;
    let drag = false;
    el.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      dx = ev.clientX - sx;
      if (!drag && Math.abs(dx) > 6) {
        drag = true;
        el.classList.add('dragging');
      }
      if (drag) {
        el.style.translate = `${dx}px 0`;
        el.style.opacity = String(Math.max(0.15, 1 - Math.abs(dx) / 320));
      }
    };
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.classList.remove('dragging');
      if (drag && Math.abs(dx) > 90) return this.dismiss(n.notification_id, el, Math.sign(dx));
      el.style.translate = '';
      if (!drag) this.toggle();
      else this.layout();
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  }

  protected override render() {
    // Dismissed cards stay rendered (flying out) until Home Assistant confirms the removal.
    for (const id of this.leaving) if (!this.notes[id]) this.leaving.delete(id);
    const list = this.list;
    const live = list.filter(n => !this.leaving.has(n.notification_id));
    if (!live.length && this.config.hide_when_empty) return html``;

    return html`
      <div class="head">
        <h2>${this.config.title ?? 'Notifications'} <span class="faint num">${live.length || ''}</span></h2>
        ${live.length
          ? html`<div>
              ${live.length > 1 ? html`<button class="btn-text" type="button" @click=${this.toggle}>${this.open ? 'Stack' : 'Show all'}</button>` : nothing}
              <button class="btn-text" type="button" @click=${this.clearAll}>Clear</button>
            </div>`
          : nothing}
      </div>
      <div class="stack ${this.open ? 'open' : ''}" aria-live="polite">
        ${repeat(
          list,
          n => n.notification_id,
          (n, i) => {
            const s = this.lookFor(n);
            return html`<div
              class="note glass"
              data-id=${n.notification_id}
              tabindex="0"
              role="button"
              aria-expanded=${this.open}
              style="--sev:${s.color}"
              @pointerdown=${(e: PointerEvent) => this.onDown(e, n, i)}
              @keydown=${(e: KeyboardEvent) => {
                if (e.target !== e.currentTarget) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  this.toggle();
                } else if (e.key === 'Delete' || e.key === 'Backspace') this.dismiss(n.notification_id, e.currentTarget as HTMLElement);
              }}
            >
              <div class="ic">${haIcon(s.icon)}</div>
              <div class="body">
                <div class="t"><span>${n.title ? plain(n.title) : 'Home Assistant'}</span><time>${relativeAge(n.created_at)}</time></div>
                <p>${plain(n.message)}</p>
                <div class="actions">
                  <button type="button" @click=${(e: Event) => this.dismiss(n.notification_id, (e.target as HTMLElement).closest('.note') as HTMLElement)}>Dismiss</button>
                </div>
              </div>
            </div>`;
          },
        )}
      </div>
      ${!live.length && this.loaded
        ? html`<div class="empty glass">
            <div class="ic">${icon('bell')}</div>
            <div><b>All caught up</b><div class="muted">Nothing needs you right now.</div></div>
          </div>`
        : nothing}
      ${live.length ? html`<p class="hint">Tap to ${this.open ? 'stack' : 'fan out'}, drag sideways to dismiss</p>` : nothing}
    `;
  }

  static override styles = [
    base,
    glass,
    css`
      .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 6px;
        min-height: 30px;
        margin-bottom: 8px;
      }
      .head h2 {
        margin: 0;
        font-size: 11.5px;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--hh-ink-2);
      }
      .stack {
        position: relative;
        transition: height 0.5s var(--ease);
      }
      .note {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        display: flex;
        gap: 12px;
        align-items: flex-start;
        padding: 14px 14px 14px 12px;
        border-radius: 20px;
        cursor: pointer;
        user-select: none;
        touch-action: pan-y;
        transform-origin: 50% 100%;
        transition: transform 0.5s var(--ease), opacity 0.4s var(--ease), translate 0.35s var(--ease);
      }
      .note.dragging {
        transition: none;
      }
      .ic {
        width: 38px;
        height: 38px;
        border-radius: 13px;
        display: grid;
        place-items: center;
        flex: none;
        color: var(--sev);
        background: color-mix(in srgb, var(--sev) 16%, transparent);
        transition: opacity 0.3s;
      }
      .body {
        flex: 1;
        min-width: 0;
        transition: opacity 0.3s;
      }
      .note:not([data-depth='0']) .body,
      .note:not([data-depth='0']) .ic {
        opacity: 0;
      }
      .t {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        font-weight: 600;
        font-size: 14px;
      }
      .t time {
        font-weight: 400;
        font-size: 12px;
        color: var(--hh-ink-3);
        white-space: nowrap;
      }
      .note p {
        margin: 2px 0 0;
        color: var(--hh-ink-2);
        font-size: 13px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .stack.open .note p {
        -webkit-line-clamp: 8;
      }
      .actions {
        display: flex;
        gap: 6px;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.4s var(--ease), margin 0.4s var(--ease);
      }
      .stack.open .actions {
        max-height: 40px;
        margin-top: 10px;
      }
      .actions button {
        font-size: 12px;
        font-weight: 600;
        padding: 5px 10px;
        border-radius: 9px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
      }
      .empty {
        border-radius: 20px;
        padding: 18px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 12.5px;
      }
      .empty b {
        font-size: 14px;
      }
      .empty .ic {
        --sev: var(--hh-accent);
      }
      .hint {
        margin: 8px 6px 0;
        font-size: 12px;
        color: var(--hh-ink-3);
      }
    `,
  ];
}

registerCard('hyggehub-notification-stack-card', HyggeNotificationStackCard, 'HyggeHub Notification stack', 'Home Assistant notifications as a swipeable, stacked pile.');
