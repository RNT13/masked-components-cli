import { transitions } from '@/styles/MaskedAnimations/animations/transitions'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import styled, { css } from 'styled-components'

type props = {
  $variant?: string
  $hasToggle?: boolean
  $radius?: number
  $icon?: boolean
  $open?: boolean
  $required?: boolean
}

/* ============================================================
 * CONTAINER — todas as cores passam por var(--mc-input-*, fallback)
 * ============================================================ */

export const MaskedInputContainer = styled.div<props>`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;

  z-index: ${({ $open }) => ($open ? 999 : 1)};

  input,
  textarea,
  select,
  #masked-select-trigger,
  #masked-time-trigger {
    width: 100%;
    border-radius: ${({ $radius }) => ($radius ? `${$radius}px` : '18px')};
    border: 2px solid var(--mc-input-border, ${maskedTheme.colors.baseBlue.light08});
    font-size: ${maskedTheme.fontSize.md};
    font-weight: 800;
    line-height: 1.4;
    color: var(--mc-input-fg, ${maskedTheme.colors.baseBlue.base});
    background-color: var(--mc-input-bg, ${maskedTheme.colors.baseBlue.light40});
    text-align: left;
    ${transitions.slow}

    ${({ $hasToggle }) => $hasToggle && `padding-right: 44px;`}

    input.input-hidden {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }

    &:hover {
      border-color: var(--mc-input-border-hover, ${maskedTheme.colors.baseBlue.base});
    }

    &:focus {
      outline: none;
      background-color: var(--mc-input-bg-focus, ${maskedTheme.colors.baseBlue.light04});
      border-color: var(--mc-input-focus-ring, ${maskedTheme.colors.baseBlue.light});
      box-shadow: 0px 0px 10px 2px var(--mc-input-focus-ring, ${maskedTheme.colors.baseBlue.light});
      color: var(--mc-input-fg, ${maskedTheme.colors.baseBlue.base});

      &::placeholder {
        color: var(--mc-input-focus-ring, ${maskedTheme.colors.baseBlue.light});
      }
    }

    &:disabled {
      background-color: var(--mc-input-disabled-bg, ${maskedTheme.colors.baseBlue.light20});
      cursor: not-allowed;
      opacity: 0.7;
    }

    &.error {
      border-color: var(--mc-input-error-border, ${maskedTheme.colors.baseRed.base});
      background-color: var(--mc-input-error-bg, ${maskedTheme.colors.baseRed.light02});
      color: var(--mc-input-error-fg, ${maskedTheme.colors.baseRed.light20});

      &:focus {
        box-shadow: 0 0 0 3px var(--mc-input-error-ring, ${maskedTheme.colors.baseRed.light20});
      }

      &::placeholder {
        color: var(--mc-input-error-fg, ${maskedTheme.colors.baseRed.light20});
      }
    }

    &::placeholder {
      color: var(--mc-input-placeholder, ${maskedTheme.colors.baseBlue.light08});
    }
  }

  input,
  select,
  #masked-select-trigger,
  #masked-time-trigger {
    min-height: 44px;
    padding: ${({ $icon }) => ($icon ? '0 12px' : '0 12px 0 44px')};
    line-height: 40px;
  }

  textarea {
    padding: ${({ $icon }) => ($icon ? '12px' : '12px 12px 12px 44px')};
    min-height: 96px;
    width: 100%;
    resize: none;
    scrollbar-width: thin;
    scrollbar-color: var(--mc-input-fg, ${maskedTheme.colors.baseBlue.base}) var(--mc-input-disabled-bg, ${maskedTheme.colors.baseBlue.light20});
  }
`

/* ============================================================
 * ERROR
 * ============================================================ */

export const ErrorDiv = styled.div`
  color: var(--mc-input-error-fg, ${maskedTheme.colors.baseRed.dark30});
  font-size: 0.85rem;
  font-weight: 500;
  background-color: var(--mc-input-error-bg, ${maskedTheme.colors.baseRed.light20});
  padding: 6px 12px;
  border-radius: 10px;
`

/* ============================================================
 * LABEL
 * ============================================================ */

export const InputLabel = styled.label<props>`
  width: 100%;
  color: var(--mc-input-label-fg, ${maskedTheme.colors.baseBlue.dark20});
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    font-size: 20px;
  }

  ${({ $required }) =>
    $required &&
    css`
      &::after {
        content: '*';
        color: var(--mc-input-error-border, ${maskedTheme.colors.baseRed.base});
        font-size: 1.2rem;
        font-weight: 700;
      }
    `}
`

export const InputIconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 44px;
  background: none;
  border: none;
  color: var(--mc-input-icon-fg, ${maskedTheme.colors.baseBlue.dark});

  svg {
    font-size: 1.5rem;
  }
`
