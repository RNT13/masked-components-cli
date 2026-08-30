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
 * CONTAINER
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
    border: 2px solid ${maskedTheme.colors.baseBlue.light08};
    font-size: ${maskedTheme.fontSize.md};
    font-weight: 800;
    line-height: 1.4;
    color: ${maskedTheme.colors.baseBlue.base};
    background-color: ${maskedTheme.colors.baseBlue.light40};
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
      border-color: ${maskedTheme.colors.baseBlue.base};
    }

    &:focus {
      outline: none;
      background-color: ${maskedTheme.colors.baseBlue.light04};
      border-color: ${maskedTheme.colors.baseBlue.light};
      box-shadow: 0px 0px 10px 2px ${maskedTheme.colors.baseBlue.light};
      color: ${maskedTheme.colors.baseBlue.base};

      &::placeholder {
        color: ${maskedTheme.colors.baseBlue.light};
      }
    }

    &:disabled {
      background-color: ${maskedTheme.colors.baseBlue.light20};
      cursor: not-allowed;
      opacity: 0.7;
    }

    &.error {
      border-color: ${maskedTheme.colors.baseRed.base};
      background-color: ${maskedTheme.colors.baseRed.light02};
      color: ${maskedTheme.colors.baseRed.light20};

      &:focus {
        box-shadow: 0 0 0 3px ${maskedTheme.colors.baseRed.light20};
      }

      &::placeholder {
        color: ${maskedTheme.colors.baseRed.light20};
      }
    }

    &::placeholder {
      color: ${maskedTheme.colors.baseBlue.light08};
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

  /* ===================== TEXTAREA ===================== */

  textarea {
    padding: ${({ $icon }) => ($icon ? '12px' : '12px 12px 12px 44px')};
    min-height: 96px;
    width: 100%;
    resize: none;
    scrollbar-width: thin;
    scrollbar-color: ${maskedTheme.colors.baseBlue.base} ${maskedTheme.colors.baseBlue.light20};
  }
`

/* ============================================================
 * ERROR
 * ============================================================ */

export const ErrorDiv = styled.div`
  color: ${maskedTheme.colors.baseRed.dark30};
  font-size: 0.85rem;
  font-weight: 500;
  background-color: ${maskedTheme.colors.baseRed.light20};
  padding: 6px 12px;
  border-radius: 10px;
`

/* ============================================================
 * LABEL
 * ============================================================ */

export const InputLabel = styled.label<props>`
  width: 100%;
  color: ${maskedTheme.colors.baseBlue.dark20};
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
        color: ${maskedTheme.colors.baseRed.base};
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
  color: ${maskedTheme.colors.baseBlue.dark};

  svg {
    font-size: 1.5rem;
  }
`
