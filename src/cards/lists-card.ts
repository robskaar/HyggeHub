import { css, html, nothing, type PropertyValues } from 'lit';
import { query, queryAll, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { registerCard, HyggeCard } from '../shared/base-card';
import { icon } from '../shared/icons';
import { formatDay, friendlyName, lang } from '../shared/format';
import { base, glass } from '../shared/styles';
import type { CardConfig, Unsubscribe } from '../types';
import { engine } from '../theme/engine';

interface TodoItem {
  uid: string;
  summary: string;
  status: 'needs_action' | 'completed';
  due?: string | null;
  description?: string | null;
}

interface ListConfig {
  entity: string;
  name?: string;
  /** Heading of the completed group: "Got it" for shopping, "Done" for tasks. */
  done_label?: string;
  placeholder?: string;
}

export interface ListsCardConfig extends CardConfig {
  lists: ListConfig[];
  /** An input_text or text entity shown as a free-form note tab. */
  note?: { entity: string; name?: string };
}

type Suggestion = { type: 'restore'; item: TodoItem; exact: boolean } | { type: 'exists'; item: TodoItem } | { type: 'new'; text: string };

export class HyggeListsCard extends HyggeCard<ListsCardConfig> {
  @state() private items: Record<string, TodoItem[]> = {};
  @state() private failed: Record<string, string> = {};
  @state() private closed: Record<string, boolean> = {};
  @state() private query: Record<string, string> = {};
  @state() private sel: Record<string, number | undefined> = {};
  @state() private paneIdx = 0;
  @state() private noteDraft?: string;
  @state() private noteStatus = '';
  @query('.track') private track?: HTMLElement;
  @queryAll('.pane') private panes?: NodeListOf<HTMLElement>;

  private subs = new Map<string, Promise<Unsubscribe>>();
  private fx?: { uid: string; cls: string };
  private noteTimer?: number;
  private resizeObs?: ResizeObserver;

  static getStubConfig(hass: any) {
    const lists = Object.keys(hass?.states ?? {})
      .filter(id => id.startsWith('todo.'))
      .slice(0, 2)
      .map(entity => ({ entity }));
    return { lists: lists.length ? lists : [{ entity: 'todo.shopping_list', name: 'Groceries', done_label: 'Got it' }] };
  }

  protected override validateConfig(config: ListsCardConfig) {
    if (!Array.isArray(config.lists) || !config.lists.length) throw new Error('Add at least one to-do entity under `lists`.');
    for (const l of config.lists) if (!l.entity?.startsWith('todo.')) throw new Error(`${l.entity ?? 'A list'} is not a todo entity.`);
  }

  protected override watchedEntities() {
    return [...this.config.lists.map(l => l.entity), this.config.note?.entity];
  }

  override getCardSize() {
    return 7;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    for (const p of this.subs.values()) p.then(u => u()).catch(() => {});
    this.subs.clear();
    this.resizeObs?.disconnect();
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.hasUpdated) this.subscribe();
  }

  private subscribe() {
    if (!this.hass) return;
    for (const l of this.config.lists) {
      if (this.subs.has(l.entity)) continue;
      const p = this.hass.connection
        .subscribeMessage<{ items: TodoItem[] }>(msg => (this.items = { ...this.items, [l.entity]: msg.items }), {
          type: 'todo/item/subscribe',
          entity_id: l.entity,
        })
        .catch(err => {
          this.failed = { ...this.failed, [l.entity]: err?.message ?? 'Could not load this list' };
          this.subs.delete(l.entity);
          return () => {};
        });
      this.subs.set(l.entity, p);
    }
  }

  protected override firstUpdated() {
    this.resizeObs = new ResizeObserver(() => this.scheduleFit());
    this.panes?.forEach(p => this.resizeObs!.observe(p));
  }

  protected override updated(changed: PropertyValues) {
    super.updated(changed);
    if (changed.has('hass') || changed.has('config')) this.subscribe();
    if (changed.has('config')) {
      this.resizeObs?.disconnect();
      this.panes?.forEach(p => this.resizeObs?.observe(p));
    }
    if (this.fx) {
      const el = this.renderRoot.querySelector(`.item[data-uid="${CSS.escape(this.fx.uid)}"]`);
      if (el && engine.motionOn) {
        el.classList.remove('enter', 'restored', 'pulse');
        void (el as HTMLElement).offsetWidth;
        el.classList.add(...this.fx.cls.split(' '));
      }
      this.fx = undefined;
    }
  }

  private fitQueued = false;

  /** Resize observers must not resize inside their own callback, so the fit waits for the next frame. */
  private scheduleFit() {
    if (this.fitQueued) return;
    this.fitQueued = true;
    requestAnimationFrame(() => {
      this.fitQueued = false;
      this.fitTrack();
    });
  }

  private fitTrack() {
    const pane = this.panes?.[this.paneIdx];
    const h = pane?.offsetHeight;
    if (!this.track || !h) return;
    const next = `${h}px`;
    if (this.track.style.height !== next) this.track.style.height = next;
  }

  // ---------- item actions (optimistic, then confirmed by the subscription) ----------

  private patch(entity: string, fn: (items: TodoItem[]) => TodoItem[]) {
    this.items = { ...this.items, [entity]: fn([...(this.items[entity] ?? [])]) };
  }

  private collapse(uid: string, then: () => void) {
    const el = this.renderRoot.querySelector<HTMLElement>(`.item[data-uid="${CSS.escape(uid)}"]`);
    if (!el || !engine.motionOn) return then();
    el.style.height = `${el.offsetHeight}px`;
    void el.offsetHeight;
    el.classList.add('removing');
    setTimeout(then, 260);
  }

  private setStatus(entity: string, item: TodoItem, status: TodoItem['status']) {
    this.collapse(item.uid, () => {
      // Moved items go to the top of their new group.
      this.patch(entity, items => [{ ...item, status }, ...items.filter(i => i.uid !== item.uid)]);
      this.fx = { uid: item.uid, cls: status === 'needs_action' ? 'enter restored' : 'enter' };
      this.callService('todo', 'update_item', { item: item.uid, status }, { entity_id: entity }).catch(() => this.subsRefresh(entity));
    });
  }

  private removeItem(entity: string, item: TodoItem) {
    this.collapse(item.uid, () => {
      this.patch(entity, items => items.filter(i => i.uid !== item.uid));
      this.callService('todo', 'remove_item', { item: item.uid }, { entity_id: entity }).catch(() => this.subsRefresh(entity));
    });
  }

  private add(entity: string, text: string) {
    const temp: TodoItem = { uid: `pending-${Date.now()}`, summary: text, status: 'needs_action' };
    this.patch(entity, items => [temp, ...items]);
    this.fx = { uid: temp.uid, cls: 'enter' };
    this.callService('todo', 'add_item', { item: text }, { entity_id: entity }).catch(() => this.subsRefresh(entity));
  }

  /** On a failed call, drop the optimistic state and resubscribe for the server's truth. */
  private subsRefresh(entity: string) {
    const p = this.subs.get(entity);
    this.subs.delete(entity);
    p?.then(u => u()).catch(() => {});
    this.subscribe();
  }

  // ---------- add box: offer completed items back before creating a duplicate ----------

  private suggestions(entity: string): Suggestion[] {
    const raw = (this.query[entity] ?? '').trim();
    const q = raw.toLowerCase();
    if (!q) return [];
    const items = this.items[entity] ?? [];
    const rank = (t: string) => {
      t = t.toLowerCase();
      if (t === q) return 0;
      if (t.startsWith(q)) return 1;
      if (t.split(/\s+/).some(w => w.startsWith(q))) return 2;
      return t.includes(q) ? 3 : 9;
    };
    const out: Suggestion[] = items
      .filter(i => i.status === 'completed')
      .map(item => ({ item, r: rank(item.summary) }))
      .filter(x => x.r < 9)
      .sort((a, b) => a.r - b.r)
      .slice(0, 4)
      .map(x => ({ type: 'restore' as const, item: x.item, exact: x.r === 0 }));
    const active = items.find(i => i.status === 'needs_action' && i.summary.toLowerCase() === q);
    if (active) out.push({ type: 'exists', item: active });
    else if (!out.some(o => o.type === 'restore' && o.exact)) out.push({ type: 'new', text: raw });
    return out;
  }

  private selected(entity: string, opts: Suggestion[]): number {
    const s = this.sel[entity];
    if (s !== undefined) return s;
    return opts[0]?.type === 'restore' && opts[0].exact ? 0 : -1;
  }

  private choose(entity: string, o?: Suggestion) {
    this.query = { ...this.query, [entity]: '' };
    this.sel = { ...this.sel, [entity]: undefined };
    if (!o) return;
    if (o.type === 'restore') this.setStatus(entity, o.item, 'needs_action');
    else if (o.type === 'exists') this.fx = { uid: o.item.uid, cls: 'pulse' };
    else this.add(entity, o.text);
  }

  private onSubmit(e: Event, entity: string) {
    e.preventDefault();
    const opts = this.suggestions(entity);
    if (!opts.length) return;
    const s = this.selected(entity, opts);
    this.choose(entity, s >= 0 ? opts[s] : opts.find(o => o.type === 'exists') ?? opts.find(o => o.type === 'new'));
  }

  private onAddKey(e: KeyboardEvent, entity: string) {
    const opts = this.suggestions(entity);
    if (!opts.length) return;
    const s = this.selected(entity, opts);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.sel = { ...this.sel, [entity]: (s + 1) % opts.length };
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.sel = { ...this.sel, [entity]: s <= 0 ? opts.length - 1 : s - 1 };
    } else if (e.key === 'Escape') this.choose(entity);
  }

  // ---------- swipe a row: right = done / restore, left = delete ----------

  private onRowDown(e: PointerEvent, entity: string, item: TodoItem) {
    if ((e.target as HTMLElement).closest('button')) return;
    const fg = e.currentTarget as HTMLElement;
    const row = fg.parentElement as HTMLElement;
    const sx = e.clientX;
    const sy = e.clientY;
    let dx = 0;
    let mode: 'h' | 'v' | undefined;
    fg.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (!mode) {
        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
          mode = 'h';
          fg.classList.add('dragging');
        } else if (Math.abs(dy) > 8) mode = 'v';
      }
      if (mode === 'h') {
        const a = Math.abs(dx);
        const lim = Math.sign(dx) * Math.min(150, a < 90 ? a : 90 + (a - 90) * 0.35);
        fg.style.transform = `translateX(${lim}px)`;
        row.dataset.reveal = dx > 0 ? 'done' : 'del';
        row.classList.toggle('armed', a > 80);
      }
    };
    const up = () => {
      fg.removeEventListener('pointermove', move);
      fg.removeEventListener('pointerup', up);
      fg.removeEventListener('pointercancel', up);
      fg.classList.remove('dragging');
      fg.style.transform = '';
      row.classList.remove('armed');
      setTimeout(() => delete row.dataset.reveal, 300);
      if (mode !== 'h') return;
      if (dx > 80) this.setStatus(entity, item, item.status === 'completed' ? 'needs_action' : 'completed');
      else if (dx < -80) this.removeItem(entity, item);
    };
    fg.addEventListener('pointermove', move);
    fg.addEventListener('pointerup', up);
    fg.addEventListener('pointercancel', up);
  }

  // ---------- panes ----------

  private onTrackScroll() {
    const t = this.track!;
    const x = t.scrollLeft / t.clientWidth;
    t.parentElement?.style.setProperty('--x', String(x));
    const i = Math.round(x);
    if (i !== this.paneIdx) {
      this.paneIdx = i;
      requestAnimationFrame(() => this.fitTrack());
    }
  }

  private goPane(i: number) {
    this.track?.scrollTo({ left: i * this.track.clientWidth, behavior: engine.motionOn ? 'smooth' : 'auto' });
  }

  private onTrackDown(e: PointerEvent) {
    if (e.pointerType !== 'mouse' || (e.target as HTMLElement).closest('.item-fg, input, textarea, button, .suggest')) return;
    const t = this.track!;
    const sx = e.clientX;
    const sl = t.scrollLeft;
    t.setPointerCapture(e.pointerId);
    t.classList.add('grabbing');
    const move = (ev: PointerEvent) => (t.scrollLeft = sl - (ev.clientX - sx));
    const up = (ev: PointerEvent) => {
      t.removeEventListener('pointermove', move);
      t.removeEventListener('pointerup', up);
      t.classList.remove('grabbing');
      const dx = ev.clientX - sx;
      const cur = Math.round(sl / t.clientWidth);
      const target = Math.abs(dx) > 50 ? cur - Math.sign(dx) : cur;
      this.goPane(Math.max(0, Math.min(this.tabCount - 1, target)));
    };
    t.addEventListener('pointermove', move);
    t.addEventListener('pointerup', up);
  }

  private get tabCount() {
    return this.config.lists.length + (this.config.note ? 1 : 0);
  }

  // ---------- note ----------

  private onNote(e: Event) {
    const value = (e.target as HTMLTextAreaElement).value;
    this.noteDraft = value;
    this.noteStatus = 'Saving…';
    clearTimeout(this.noteTimer);
    this.noteTimer = window.setTimeout(async () => {
      const id = this.config.note!.entity;
      try {
        await this.callService(id.split('.')[0], 'set_value', { value }, { entity_id: id });
        this.noteStatus = 'Saved';
      } catch (err: any) {
        this.noteStatus = err?.message ?? 'Could not save the note';
      }
    }, 800);
  }

  // ---------- render ----------

  private dueChip(due?: string | null) {
    if (!due) return nothing;
    const d = new Date(due.length === 10 ? `${due}T00:00:00` : due);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = new Date(d);
    day.setHours(0, 0, 0, 0);
    const diff = Math.round((day.getTime() - today.getTime()) / 864e5);
    let text: string;
    if (diff < 0) text = 'Overdue';
    else if (diff === 0) text = 'Today';
    else if (diff === 1) text = 'Tomorrow';
    else if (diff < 7) text = d.toLocaleDateString(lang(this.hass), { weekday: 'short' });
    else text = formatDay(d, this.hass);
    return html`<span class="due ${diff <= 1 ? 'soon' : ''}">${text}</span>`;
  }

  private renderItem(entity: string, item: TodoItem, list: ListConfig) {
    const done = item.status === 'completed';
    const doneLabel = list.done_label ?? 'Done';
    const meta = item.description?.split('\n')[0];
    return html`<li class="item ${done ? 'done' : ''}" data-uid=${item.uid}>
      <div class="item-bg">
        <span class="bg-done">${icon(done ? 'undo' : 'check')}${done ? 'Restore' : doneLabel}</span>
        <span class="bg-del">Delete${icon('trash')}</span>
      </div>
      <div class="item-fg" @pointerdown=${(e: PointerEvent) => this.onRowDown(e, entity, item)}>
        <button class="check" type="button" aria-label="${done ? 'Restore' : doneLabel} ${item.summary}" @click=${() => this.setStatus(entity, item, done ? 'needs_action' : 'completed')}>
          ${icon('check')}
        </button>
        <span class="txt">${item.summary}</span>
        ${meta ? html`<span class="qty">${meta}</span>` : nothing} ${done ? nothing : this.dueChip(item.due)}
        <button class="del" type="button" aria-label="Delete ${item.summary}" @click=${() => this.removeItem(entity, item)}>${icon('x')}</button>
      </div>
    </li>`;
  }

  private renderSuggestions(entity: string, list: ListConfig) {
    const opts = this.suggestions(entity);
    if (!opts.length) return nothing;
    const q = (this.query[entity] ?? '').trim().toLowerCase();
    const s = this.selected(entity, opts);
    const hl = (t: string) => {
      const k = t.toLowerCase().indexOf(q);
      return k < 0 ? t : html`${t.slice(0, k)}<mark>${t.slice(k, k + q.length)}</mark>${t.slice(k + q.length)}`;
    };
    return html`<div class="suggest" role="listbox" aria-label="Suggestions" @pointerdown=${(e: Event) => e.preventDefault()}>
      ${opts.some(o => o.type === 'restore') ? html`<div class="s-h">From ${list.done_label ?? 'Done'}</div>` : nothing}
      ${opts.map((o, k) => {
        const cls = `sug ${k === s ? 'sel' : ''}`;
        const pick = () => this.choose(entity, o);
        if (o.type === 'restore')
          return html`<button type="button" class=${cls} role="option" aria-selected=${k === s} @click=${pick}>
            <span class="si">${icon('undo')}</span><span class="st"><b>${hl(o.item.summary)}</b><small>${o.item.description ?? 'Completed earlier'}</small></span><em>Restore</em>
          </button>`;
        if (o.type === 'exists')
          return html`<button type="button" class=${cls} role="option" aria-selected=${k === s} @click=${pick}>
            <span class="si">${icon('check')}</span><span class="st"><b>${o.item.summary}</b><small>Already on the list</small></span><em>Show</em>
          </button>`;
        return html`<button type="button" class=${cls} role="option" aria-selected=${k === s} @click=${pick}>
          <span class="si">${icon('plus')}</span><span class="st"><b>Add “${o.text}”</b><small>As a new item</small></span><em>Add</em>
        </button>`;
      })}
    </div>`;
  }

  private renderList(list: ListConfig) {
    const entity = list.entity;
    const name = list.name ?? friendlyName(this.stateOf(entity), entity);
    const all = this.items[entity];
    const active = all?.filter(i => i.status === 'needs_action') ?? [];
    const done = all?.filter(i => i.status === 'completed') ?? [];
    const closed = this.closed[entity];
    let body;
    if (this.failed[entity]) body = html`<li class="empty-row">${this.failed[entity]}</li>`;
    else if (!all) body = html`<li class="empty-row">Loading ${name.toLowerCase()}…</li>`;
    else if (!active.length) body = html`<li class="empty-row">Nothing left on ${name.toLowerCase()}</li>`;
    else body = repeat(active, i => i.uid, i => this.renderItem(entity, i, list));

    return html`<section class="pane">
      <ul class="items">${body}</ul>
      <form class="add" @submit=${(e: Event) => this.onSubmit(e, entity)}>
        <input
          placeholder=${list.placeholder ?? `Add to ${name.toLowerCase()}`}
          autocomplete="off"
          aria-label=${list.placeholder ?? `Add to ${name.toLowerCase()}`}
          .value=${this.query[entity] ?? ''}
          @input=${(e: Event) => {
            this.query = { ...this.query, [entity]: (e.target as HTMLInputElement).value };
            this.sel = { ...this.sel, [entity]: undefined };
          }}
          @keydown=${(e: KeyboardEvent) => this.onAddKey(e, entity)}
        />
        <button type="submit" aria-label="Add">${icon('plus')}</button>
      </form>
      ${this.renderSuggestions(entity, list)}
      ${done.length
        ? html`<div class="done-group ${closed ? 'closed' : ''}">
            <button class="done-h" type="button" aria-expanded=${!closed} @click=${() => (this.closed = { ...this.closed, [entity]: !closed })}>
              ${icon('chev')}${list.done_label ?? 'Done'} <span class="count num">${done.length}</span><span class="rule"></span>
            </button>
            ${closed ? nothing : html`<ul class="items">${repeat(done, i => i.uid, i => this.renderItem(entity, i, list))}</ul>`}
          </div>`
        : nothing}
    </section>`;
  }

  private renderNote() {
    const note = this.config.note!;
    const s = this.stateOf(note.entity);
    const value = this.noteDraft ?? (s && s.state !== 'unknown' && s.state !== 'unavailable' ? s.state : '');
    const max = (s?.attributes.max as number | undefined) ?? 255;
    return html`<section class="pane note-pad">
      <textarea aria-label=${note.name ?? 'Note'} maxlength=${max} .value=${value} @input=${this.onNote} ?disabled=${!s}></textarea>
      <p>
        <span>${s ? this.noteStatus || 'Shared with everyone in the home' : `${note.entity} is not available`}</span>
        <span class="num ${value.length > max * 0.9 ? 'near' : ''}">${value.length} / ${max}</span>
      </p>
    </section>`;
  }

  protected override render() {
    const lists = this.config.lists;
    const tabs = [
      ...lists.map(l => ({ name: l.name ?? friendlyName(this.stateOf(l.entity), l.entity), count: this.items[l.entity]?.filter(i => i.status === 'needs_action').length })),
      ...(this.config.note ? [{ name: this.config.note.name ?? 'Note', count: undefined }] : []),
    ];
    return html`
      <ha-card class="glass lists" style="--tabs:${tabs.length}">
        <div class="tabs" role="tablist">
          <div class="tab-ink"></div>
          ${tabs.map(
            (t, i) => html`<button class="tab" type="button" role="tab" aria-selected=${i === this.paneIdx} @click=${() => this.goPane(i)}>
              ${t.name}${t.count !== undefined ? html`<span class="count num">${t.count}</span>` : nothing}
            </button>`,
          )}
        </div>
        <div class="track" @scroll=${this.onTrackScroll} @pointerdown=${this.onTrackDown}>
          ${lists.map(l => this.renderList(l))} ${this.config.note ? this.renderNote() : nothing}
        </div>
        ${tabs.length > 1 ? html`<div class="pager">${tabs.map((_, i) => html`<i class=${i === this.paneIdx ? 'on' : ''}></i>`)}</div>` : nothing}
      </ha-card>
    `;
  }

  static override styles = [
    base,
    glass,
    css`
      ha-card.lists {
        padding: 0;
        --x: 0;
      }
      .tabs {
        position: relative;
        display: grid;
        grid-template-columns: repeat(var(--tabs), 1fr);
        margin: 14px 14px 0;
        padding: 4px;
        border-radius: 15px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
      }
      .tab {
        position: relative;
        z-index: 1;
        padding: 8px 4px;
        border-radius: 11px;
        font-size: 13px;
        font-weight: 600;
        color: var(--hh-ink-2);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-width: 0;
        white-space: nowrap;
        transition: color 0.25s;
      }
      .tab[aria-selected='true'] {
        color: var(--hh-ink);
      }
      .tab .count {
        font-size: 11px;
        min-width: 18px;
        padding: 0 5px;
        border-radius: 9px;
        background: var(--hh-accent-soft);
        color: var(--hh-accent);
      }
      .tab-ink {
        position: absolute;
        top: 4px;
        bottom: 4px;
        left: 4px;
        width: calc((100% - 8px) / var(--tabs));
        border-radius: 11px;
        background: var(--hh-glass-press);
        box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.12);
        transform: translateX(calc(var(--x) * 100%));
      }
      .track {
        display: flex;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        overscroll-behavior-x: contain;
        align-items: flex-start;
        cursor: grab;
        transition: height 0.35s var(--ease);
      }
      .track::-webkit-scrollbar {
        display: none;
      }
      .track.grabbing {
        cursor: grabbing;
        scroll-snap-type: none;
      }
      .pane {
        flex: 0 0 100%;
        scroll-snap-align: start;
        padding: 12px 14px 16px;
        min-width: 0;
      }
      .items {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .item {
        position: relative;
        border-radius: 14px;
        overflow: hidden;
        transition: height 0.28s var(--ease), opacity 0.25s, margin 0.28s;
      }
      .item.removing {
        height: 0 !important;
        opacity: 0;
        margin-bottom: -4px;
      }
      .item.enter {
        animation: enter 0.4s var(--ease);
      }
      @keyframes enter {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
      }
      .item.restored .item-fg {
        animation: flash 1.4s var(--ease);
      }
      .item.pulse .item-fg {
        animation: flash 1s var(--ease) 2;
      }
      @keyframes flash {
        0% {
          background: color-mix(in srgb, var(--hh-accent) 30%, var(--hh-glass-strong));
        }
      }
      .item-bg {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        font-size: 12.5px;
        font-weight: 600;
        opacity: 0;
        transition: opacity 0.2s;
      }
      .item[data-reveal] .item-bg {
        opacity: 1;
      }
      .item[data-reveal='done'] .item-bg {
        background: color-mix(in srgb, var(--hh-ok) 22%, transparent);
        color: var(--hh-ok);
      }
      .item[data-reveal='del'] .item-bg {
        background: color-mix(in srgb, var(--hh-crit) 20%, transparent);
        color: var(--hh-crit);
      }
      .item[data-reveal='done'] .bg-del,
      .item[data-reveal='del'] .bg-done {
        visibility: hidden;
      }
      .item-bg span {
        display: flex;
        align-items: center;
        gap: 6px;
        transition: transform 0.2s var(--spring);
      }
      .item.armed .item-bg span {
        transform: scale(1.12);
      }
      .item-fg {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 11px 12px;
        background: var(--hh-glass-strong);
        border: 1px solid transparent;
        border-radius: 14px;
        touch-action: pan-y;
        cursor: grab;
        transition: transform 0.35s var(--spring), background 0.2s;
      }
      .item-fg.dragging {
        transition: none;
        cursor: grabbing;
      }
      .check {
        width: 22px;
        height: 22px;
        border-radius: 8px;
        border: 1.6px solid var(--hh-ink-3);
        display: grid;
        place-items: center;
        flex: none;
        color: transparent;
        transition: background 0.25s, border-color 0.25s, color 0.25s;
      }
      .check svg.i {
        width: 14px;
        height: 14px;
        stroke-width: 2.4;
      }
      .check:hover {
        border-color: var(--hh-ok);
      }
      .item.done .check {
        background: var(--hh-ok);
        border-color: var(--hh-ok);
        color: var(--hh-bg);
      }
      .txt {
        flex: 1;
        min-width: 0;
        font-size: 14px;
        font-weight: 500;
        overflow-wrap: anywhere;
      }
      .item.done .item-fg {
        background: transparent;
        border: 1px dashed var(--hh-line);
      }
      .item.done .txt {
        color: var(--hh-ink-3);
        text-decoration: line-through;
      }
      .qty {
        font-size: 12px;
        color: var(--hh-ink-3);
        white-space: nowrap;
        max-width: 40%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .due {
        font-size: 11px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 999px;
        white-space: nowrap;
        background: var(--hh-glass-press);
        color: var(--hh-ink-2);
      }
      .due.soon {
        background: color-mix(in srgb, var(--hh-warn) 20%, transparent);
        color: var(--hh-warn);
      }
      .del {
        opacity: 0;
        width: 26px;
        height: 26px;
        border-radius: 8px;
        display: grid;
        place-items: center;
        color: var(--hh-ink-3);
        transition: opacity 0.2s;
      }
      .del svg.i {
        width: 15px;
        height: 15px;
      }
      .item-fg:hover .del,
      .del:focus-visible {
        opacity: 1;
      }
      @media (hover: none) {
        .del {
          display: none;
        }
      }
      .empty-row {
        padding: 14px;
        border-radius: 14px;
        text-align: center;
        font-size: 13px;
        color: var(--hh-ink-3);
        border: 1px dashed var(--hh-line);
      }
      .add {
        display: flex;
        gap: 8px;
        margin-top: 10px;
      }
      .add input {
        flex: 1;
        min-width: 0;
        padding: 10px 14px;
        border-radius: 14px;
        border: 1px dashed var(--hh-ink-3);
        background: transparent;
        outline: none;
        transition: border-color 0.2s, background 0.2s;
      }
      .add input:focus {
        border-style: solid;
        border-color: var(--hh-accent);
        background: var(--hh-glass-strong);
      }
      .add input::placeholder {
        color: var(--hh-ink-3);
      }
      .add button {
        width: 42px;
        border-radius: 14px;
        background: var(--hh-accent);
        color: var(--hh-on-accent);
        display: grid;
        place-items: center;
      }
      .suggest {
        margin-top: 6px;
        padding: 6px;
        border-radius: 16px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        display: flex;
        flex-direction: column;
        gap: 2px;
        animation: enter 0.25s var(--ease);
      }
      .s-h {
        font-size: 10.5px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--hh-ink-3);
        padding: 4px 8px 2px;
      }
      .sug {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px;
        border-radius: 11px;
        text-align: left;
        width: 100%;
      }
      .sug:hover,
      .sug.sel {
        background: var(--hh-accent-soft);
      }
      .si {
        width: 28px;
        height: 28px;
        border-radius: 9px;
        display: grid;
        place-items: center;
        flex: none;
        background: var(--hh-glass-press);
        color: var(--hh-ink-2);
      }
      .si svg.i {
        width: 16px;
        height: 16px;
      }
      .st {
        flex: 1;
        min-width: 0;
      }
      .st b {
        display: block;
        font-weight: 600;
        font-size: 13.5px;
      }
      .st b mark {
        background: none;
        color: var(--hh-accent);
        text-decoration: underline;
        text-underline-offset: 2px;
      }
      .st small {
        font-size: 11.5px;
        color: var(--hh-ink-3);
      }
      .sug em {
        font-style: normal;
        font-size: 11.5px;
        font-weight: 600;
        color: var(--hh-accent);
        padding: 3px 8px;
        border-radius: 8px;
        background: var(--hh-accent-soft);
      }
      .sug.sel em {
        background: var(--hh-accent);
        color: var(--hh-on-accent);
      }
      .done-group {
        margin-top: 16px;
      }
      .done-h {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 4px 2px 8px;
        font-size: 11.5px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--hh-ink-3);
      }
      .done-h .count {
        letter-spacing: 0;
        font-size: 11px;
        padding: 0 6px;
        border-radius: 9px;
        background: var(--hh-line);
        color: var(--hh-ink-2);
      }
      .done-h .rule {
        flex: 1;
        height: 1px;
        background: var(--hh-line);
      }
      .done-h svg.i {
        width: 16px;
        height: 16px;
        transition: transform 0.3s var(--ease);
      }
      .done-group.closed .done-h svg.i {
        transform: rotate(-90deg);
      }
      .note-pad textarea {
        width: 100%;
        min-height: 212px;
        resize: vertical;
        border: 0;
        outline: none;
        padding: 14px 16px;
        border-radius: 14px;
        background: var(--hh-glass-strong);
        line-height: 1.6;
        font-size: 14px;
        background-image: repeating-linear-gradient(transparent 0 21.4px, var(--hh-line) 21.4px 22.4px);
        background-position: 0 13px;
        background-attachment: local;
      }
      .note-pad p {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin: 8px 2px 0;
        font-size: 11.5px;
        color: var(--hh-ink-3);
      }
      .note-pad .near {
        color: var(--hh-warn);
      }
      .pager {
        display: flex;
        justify-content: center;
        gap: 6px;
        padding-bottom: 14px;
      }
      .pager i {
        width: 6px;
        height: 6px;
        border-radius: 3px;
        background: var(--hh-ink-3);
        opacity: 0.4;
        transition: width 0.3s var(--ease), opacity 0.3s;
      }
      .pager i.on {
        width: 18px;
        opacity: 1;
        background: var(--hh-accent);
      }
    `,
  ];
}

registerCard('hyggehub-lists-card', HyggeListsCard, 'HyggeHub Lists', 'Swipeable to-do lists with a completed group and a shared note.');
