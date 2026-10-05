import { css } from 'lit';

// Every value comes from the --hh-* tokens the theme engine writes on <html>. The fallbacks are the
// Fjord palette, so a card still reads correctly in the instant before the engine has run.

export const base = css`
  :host {
    display: block;
    font-family: var(--hh-font, system-ui, sans-serif);
    color: var(--hh-ink, #18242a);
    -webkit-font-smoothing: antialiased;
    --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
    --spring: cubic-bezier(0.34, 1.5, 0.64, 1);
    --mdc-icon-size: 20px;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    animation-play-state: var(--hh-play, running);
  }
  button,
  input,
  textarea {
    font: inherit;
    color: inherit;
  }
  button {
    cursor: pointer;
    border: 0;
    background: none;
    padding: 0;
  }
  :focus-visible {
    outline: 2px solid var(--hh-accent, #2f6e86);
    outline-offset: 2px;
  }
  svg.i {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
    flex: none;
  }
  svg.i.fill {
    fill: currentColor;
    stroke: none;
  }
  .num {
    font-variant-numeric: tabular-nums;
  }
  .muted {
    color: var(--hh-ink-2);
  }
  .faint {
    color: var(--hh-ink-3);
  }
  [hidden] {
    display: none !important;
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export const glass = css`
  .glass,
  ha-card.glass {
    background: var(--hh-glass, rgba(255, 255, 255, 0.44));
    -webkit-backdrop-filter: blur(var(--hh-blur, 22px)) saturate(160%);
    backdrop-filter: blur(var(--hh-blur, 22px)) saturate(160%);
    border: 1px solid var(--hh-stroke, rgba(255, 255, 255, 0.72));
    box-shadow: var(--hh-shadow), inset 0 1px 0 var(--hh-highlight, rgba(255, 255, 255, 0.6));
    color: var(--hh-ink);
  }
  ha-card.glass {
    border-radius: 26px;
    padding: 18px;
    position: relative;
    overflow: hidden;
    min-width: 0;
  }
  .card-h {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 14px;
  }
  .card-h h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    background: var(--hh-glass-strong);
    border: 1px solid var(--hh-stroke);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }
  .btn-text {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--hh-accent);
    padding: 6px 8px;
    border-radius: 10px;
  }
  .btn-text:hover {
    background: var(--hh-accent-soft);
  }
  .round {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--hh-glass-strong);
    border: 1px solid var(--hh-stroke);
    transition: transform 0.25s var(--spring), background 0.2s;
  }
  .round:hover {
    background: var(--hh-glass-press);
  }
  .round:active {
    transform: scale(0.92);
  }
  .tick {
    animation: hh-tick 0.45s var(--ease);
  }
  @keyframes hh-tick {
    from {
      transform: translateY(-60%);
      opacity: 0;
    }
  }
  @keyframes hh-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
