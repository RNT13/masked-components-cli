import { transitions } from '@/styles/MaskedAnimations/animations/transitions'
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
 * CONTAINER — todas as cores passam por var(--mc-input-*, fallback do tema)
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
  [data-mc-trigger] {
    width: 100%;
    border-radius: ${({ $radius }) => ($radius ? `${$radius}px` : '18px')};
    border: 2px solid var(--mc-input-border, ${({ theme }) => theme.colors.baseBlue.light08});
    font-family: inherit;
    font-size: ${({ theme }) => theme.fontSize.md};
    font-weight: 800;
    line-height: 1.4;
    color: var(--mc-input-fg, ${({ theme }) => theme.colors.baseBlue.base});
    background-color: var(--mc-input-bg, ${({ theme }) => theme.colors.baseBlue.light40});
    text-align: left;
    ${transitions.slow}

    ${({ $hasToggle }) => $hasToggle && `padding-right: 44px;`}

    &:hover {
      border-color: var(--mc-input-border-hover, ${({ theme }) => theme.colors.baseBlue.base});
    }

    &:focus {
      outline: none;
      background-color: var(--mc-input-bg-focus, ${({ theme }) => theme.colors.baseBlue.light04});
      border-color: var(--mc-input-focus-ring, ${({ theme }) => theme.colors.baseBlue.light});
      box-shadow: 0px 0px 10px 2px
        var(--mc-input-focus-ring, ${({ theme }) => theme.colors.baseBlue.light});
      color: var(--mc-input-fg, ${({ theme }) => theme.colors.baseBlue.base});

      &::placeholder {
        color: var(--mc-input-focus-ring, ${({ theme }) => theme.colors.baseBlue.light});
      }
    }

    &:focus-visible {
      outline: 2px solid var(--mc-input-focus-ring, ${({ theme }) => theme.colors.baseBlue.light});
      outline-offset: 2px;
    }

    &:disabled {
      background-color: var(
        --mc-input-disabled-bg,
        ${({ theme }) => theme.colors.baseBlue.light20}
      );
      cursor: not-allowed;
      opacity: 0.7;
    }

    &.error {
      border-color: var(--mc-input-error-border, ${({ theme }) => theme.colors.baseRed.base});
      background-color: var(--mc-input-error-bg, ${({ theme }) => theme.colors.baseRed.light02});
      color: var(--mc-input-error-fg, ${({ theme }) => theme.colors.baseRed.light20});

      &:focus {
        box-shadow: 0 0 0 3px
          var(--mc-input-error-ring, ${({ theme }) => theme.colors.baseRed.light20});
      }

      &::placeholder {
        color: var(--mc-input-error-fg, ${({ theme }) => theme.colors.baseRed.light20});
      }
    }

    &::placeholder {
      color: var(--mc-input-placeholder, ${({ theme }) => theme.colors.baseBlue.light08});
    }
  }

  input,
  select,
  [data-mc-trigger] {
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
    scrollbar-color: var(--mc-input-fg, ${({ theme }) => theme.colors.baseBlue.base})
      var(--mc-input-disabled-bg, ${({ theme }) => theme.colors.baseBlue.light20});
  }
`

/* ============================================================
 * ERROR
 * ============================================================ */

export const ErrorDiv = styled.div`
  color: var(--mc-input-error-fg, ${({ theme }) => theme.colors.baseRed.dark30});
  font-size: 0.85rem;
  font-weight: 500;
  background-color: var(--mc-input-error-bg, ${({ theme }) => theme.colors.baseRed.light20});
  padding: 6px 12px;
  border-radius: 10px;
`

/* ============================================================
 * LABEL — fica sobre o fundo da PÁGINA (fora do campo), então
 * segue a cor de texto do tema ativo
 * ============================================================ */

export const InputLabel = styled.label<props>`
  width: 100%;
  color: var(
    --mc-input-label-fg,
    ${({ theme }) => theme.colors.textColor ?? theme.colors.baseBlue.dark20}
  );
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
        color: var(--mc-input-error-border, ${({ theme }) => theme.colors.baseRed.base});
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
  color: var(--mc-input-icon-fg, ${({ theme }) => theme.colors.baseBlue.dark});

  svg {
    font-size: 1.5rem;
  }
`
