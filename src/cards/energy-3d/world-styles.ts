import { css } from 'lit';

/*
 * The look shared by the 3D views (the house, people, countdowns): the stage the canvas fills, the
 * glass labels pinned to the scene, the header over it, and the details panel that opens beside a
 * zoomed-in spot.
 */
export const worldStyles = css`
      ha-card.glass {
        padding: 0;
      }
      .stage {
        position: relative;
        overflow: hidden;
        touch-action: pan-y;
        border-radius: inherit;
      }
      canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        display: block;
        cursor: grab;
        opacity: 0;
        transition: opacity 0.8s var(--ease);
      }
      canvas:active {
        cursor: grabbing;
      }
      .ready canvas {
        opacity: 1;
      }
      .loading {
        position: absolute;
        inset: 30% 30%;
        border-radius: 50%;
        background: radial-gradient(closest-side, var(--hh-accent-soft), transparent);
        animation: pulse 1.6s ease-in-out infinite;
      }
      .ready .loading {
        display: none;
      }
      @keyframes pulse {
        50% {
          opacity: 0.4;
          transform: scale(0.9);
        }
      }
      .overlay {
        position: absolute;
        top: 16px;
        left: 18px;
        right: 18px;
        pointer-events: none;
      }
      .overlay .pill,
      .overlay .weather {
        pointer-events: auto;
      }
      .overlay {
        align-items: flex-start;
      }
      .title {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
      }
      .weather {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        align-self: flex-start;
        padding: 4px 10px 4px 8px;
        border-radius: 999px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        font-size: 12px;
        color: var(--hh-ink-2);
        --mdc-icon-size: 16px;
      }
      .weather b {
        font-weight: 600;
        color: var(--hh-ink);
      }
      .weather svg.wind {
        width: 14px;
        height: 14px;
        transition: transform 0.6s var(--ease);
      }
      .pill .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--hh-ok);
      }
      .tag {
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 4px 11px 4px 4px;
        border-radius: 999px;
        background: var(--hh-glass-strong);
        -webkit-backdrop-filter: blur(14px) saturate(160%);
        backdrop-filter: blur(14px) saturate(160%);
        border: 1px solid var(--hh-stroke);
        box-shadow: var(--hh-shadow);
        text-align: left;
        opacity: 0;
        transition: opacity 0.4s;
        will-change: transform;
      }
      .ready .tag {
        opacity: 1;
      }
      .ready .tag.off {
        opacity: 0;
      }
      .tag[disabled] {
        cursor: default;
      }
      .ic {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: color-mix(in srgb, currentColor 16%, transparent);
      }
      .ic svg.i {
        width: 16px;
        height: 16px;
      }
      .txt {
        display: flex;
        flex-direction: column;
        line-height: 1.1;
      }
      .txt b {
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
      }
      .txt small {
        font-size: 9.5px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--hh-ink-3);
        white-space: nowrap;
      }
      .kinds {
        display: flex;
        gap: 3px;
        margin-left: 2px;
      }
      .kind {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        color: #fff;
        background: var(--c);
        --mdc-icon-size: 13px;
      }
      .compact .kind {
        width: 18px;
        height: 18px;
        --mdc-icon-size: 11px;
      }
      /* While details are open the labels step aside; the scene zooms in beside the panel. */
      .focused .tag {
        opacity: 0 !important;
        pointer-events: none;
      }
      .panel {
        position: absolute;
        top: 60px;
        right: 12px;
        bottom: 12px;
        width: min(48%, 320px);
        display: flex;
        flex-direction: column;
        border-radius: 20px;
        background: color-mix(in srgb, var(--hh-glass-strong) 82%, transparent);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
        backdrop-filter: blur(18px) saturate(160%);
        border: 1px solid var(--hh-stroke);
        box-shadow: var(--hh-shadow);
        overflow: hidden;
        animation: panel-in 0.4s var(--ease) both;
        z-index: 2;
      }
      .compact .panel {
        top: auto;
        left: 10px;
        right: 10px;
        bottom: 10px;
        width: auto;
        height: 56%;
        animation-name: panel-up;
      }
      @keyframes panel-in {
        from {
          opacity: 0;
          transform: translateX(16px);
        }
      }
      @keyframes panel-up {
        from {
          opacity: 0;
          transform: translateY(16px);
        }
      }
      .panel-h {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px 8px 8px;
        border-bottom: 1px solid var(--hh-line);
      }
      .panel-h h4 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
      }
      .back {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        padding: 5px 10px 5px 4px;
        border-radius: 999px;
        font-size: 12.5px;
        font-weight: 600;
        color: var(--hh-accent);
      }
      .back:hover {
        background: var(--hh-accent-soft);
      }
      .back svg.i {
        width: 16px;
        height: 16px;
      }
      .panel-b {
        padding: 6px 14px 14px;
        overflow-y: auto;
        font-size: 13px;
      }
      .row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 10px;
        padding: 7px 0;
        border-bottom: 1px solid var(--hh-line);
      }
      .row span {
        color: var(--hh-ink-2);
      }
      .row b {
        font-weight: 600;
      }
      .note {
        margin: 10px 0 0;
        font-size: 12px;
        color: var(--hh-ink-3);
        line-height: 1.4;
      }
      .note code {
        font-size: 11px;
      }
      .more {
        margin-top: 12px;
        font-size: 12.5px;
        font-weight: 600;
        color: var(--hh-accent);
        padding: 6px 0;
      }
      .pickups {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .pickups li {
        padding: 9px 0;
        border-bottom: 1px solid var(--hh-line);
        display: grid;
        gap: 6px;
      }
      .pickups .when {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }
      .pickups .when b {
        font-weight: 600;
      }
      .pickups .when small {
        font-size: 11.5px;
        color: var(--hh-ink-3);
      }
      .pickups .bin {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12.5px;
        color: var(--hh-ink-2);
      }
      .pickups .kinds {
        margin: 0;
      }
      .compact .tag {
        padding-right: 9px;
        gap: 5px;
      }
      .compact .ic {
        width: 20px;
        height: 20px;
      }
      .compact .ic svg.i {
        width: 13px;
        height: 13px;
      }
      .compact .txt b {
        font-size: 12px;
      }
      .compact .txt small {
        display: none;
      }
      .extras {
        display: grid;
        gap: 8px;
        padding: 0 14px 14px;
      }
      .extras button {
        padding: 10px;
        border-radius: 14px;
        background: var(--hh-glass-strong);
        border: 1px solid var(--hh-stroke);
        text-align: left;
        min-width: 0;
      }
      .extras small {
        display: block;
        font-size: 11px;
        color: var(--hh-ink-3);
      }
      .extras b {
        font-size: 15px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
      }
      /* Inside the home card: no card frame, fill the space below the tabs. */
  ha-card.embedded {
    height: 100%;
    border: none;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    animation: none;
  }
  /* Below the home card's tabs. */
  ha-card.embedded .overlay {
    top: 68px;
  }
  ha-card.embedded .panel {
    top: 112px;
  }
  ha-card.embedded .compact .panel {
    top: auto;
  }
  .seg {
    display: flex;
    gap: 4px;
    padding: 3px;
    margin: 10px 0 4px;
    border-radius: 999px;
    background: var(--hh-line);
  }
  .seg button {
    flex: 1;
    padding: 5px 8px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    color: var(--hh-ink-2);
  }
  .seg button[aria-selected='true'] {
    background: var(--hh-glass-strong);
    color: var(--hh-ink);
    box-shadow: var(--hh-shadow);
  }
  .forecast {
    list-style: none;
    margin: 4px 0 0;
    padding: 0;
  }
  .forecast li {
    display: grid;
    grid-template-columns: 1fr 28px auto 52px;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    border-bottom: 1px solid var(--hh-line);
    font-size: 12.5px;
    --mdc-icon-size: 20px;
  }
  .forecast b {
    font-weight: 600;
  }
  .forecast small {
    color: var(--hh-ink-3);
    text-align: right;
  }
  .forecast .fi {
    color: var(--hh-ink-2);
  }
  /* A card shown inside the details panel (the alarm card): no frame of its own, the panel is the frame. */
  .embedded-card {
    display: block;
  }
  .agenda {
    list-style: none;
    margin: 10px 0 0;
    padding: 0;
  }
  .agenda li {
    display: grid;
    grid-template-columns: 74px 1fr;
    gap: 8px;
    padding: 7px 0;
    border-bottom: 1px solid var(--hh-line);
    font-size: 12.5px;
  }
  .agenda small {
    color: var(--hh-ink-3);
  }
  .progress {
    height: 8px;
    margin-top: 12px;
    border-radius: 999px;
    background: var(--hh-line);
    overflow: hidden;
  }
  .progress i {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--hh-accent);
  }
`;
