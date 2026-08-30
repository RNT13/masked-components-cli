import { css } from 'styled-components'

/* ======================================================
   🔹 2. TRANSITIONS (Design System)
====================================================== */

export const transitions = {
  fast: css`
    transition:
      all 0.2s ease,
      transform 0.2s ease,
      opacity 0.2s ease,
      background-color 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease;
  `,
  default: css`
    transition:
      all 0.35s ease,
      transform 0.35s ease,
      opacity 0.35s ease,
      background-color 0.35s ease,
      color 0.35s ease,
      box-shadow 0.35s ease;
  `,
  slow: css`
    transition:
      all 0.5s ease,
      transform 0.5s ease,
      opacity 0.5s ease,
      background-color 0.5s ease,
      color 0.5s ease,
      box-shadow 0.5s ease;
  `,
  drawer: css`
    transition:
      max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.5s ease,
      transform 0.5s ease;
  `,
  delay: css`
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
    transition-delay: 0.5s;
  `,
  premium: css`
    transition:
      max-height 0.45s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  `,

  bounce: css`
    transition:
      max-height 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.15),
      opacity 0.5s ease,
      transform 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.15);
  `
}

/* ======================================================
   🔹 3. HELPERS BASE
====================================================== */

export const overlayBase = css`
  position: relative;
  overflow: hidden;
`
