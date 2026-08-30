import { continuousAnimations } from '@/styles/MaskedAnimations/animations/continuousAnimations'
import { transitions } from '@/styles/MaskedAnimations/animations/transitions'
import styled, { css } from 'styled-components'
import { ButtonShape, ButtonSize, ButtonState } from '../MaskedButton.types'

/* =========================
   SIZE DO BOTÃO
========================= */

const sizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  sm: css`
    padding: 6px 10px;
    font-size: 14px;
  `,
  md: css`
    padding: 12px 14px;
    font-size: 16px;
  `,
  lg: css`
    padding: 16px 20px;
    font-size: 18px;
  `
}

/* =========================
   TAMANHO DO ÍCONE
========================= */

const iconSizes: Record<ButtonSize, ReturnType<typeof css>> = {
  sm: css`
    width: 16px;
    height: 16px;
  `,
  md: css`
    width: 20px;
    height: 20px;
  `,
  lg: css`
    width: 24px;
    height: 24px;
  `
}

/* =========================
   CIRCLE DINÂMICO
========================= */

const circleSizes: Record<ButtonSize, ReturnType<typeof css>> = {
  sm: css`
    width: 40px;
    height: 40px;
  `,
  md: css`
    width: 55px;
    height: 55px;
  `,
  lg: css`
    width: 70px;
    height: 70px;
  `
}

const getShapeStyles = ($shape?: ButtonShape, $size: ButtonSize = 'md') => {
  if ($shape === 'circle') {
    return css`
      ${circleSizes[$size]}
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;

      .btn-text {
        display: none;
      }
    `
  }

  if ($shape === 'square') {
    return css`
      border-radius: 6px;
    `
  }

  return css`
    border-radius: 18px;
  `
}

/* =========================
   ESTADOS
========================= */

const stateStyles: Record<ButtonState, ReturnType<typeof css>> = {
  loading: css`
    cursor: not-allowed;

    svg {
      ${continuousAnimations.continuousSpin}
      stroke-width: 2;
    }
  `,
  default: css``,
  disabled: css`
    cursor: not-allowed;
  `,
  error: css`
    &:hover {
      ${continuousAnimations.continuousShakeX}
    }
  `
}

/* =========================
   TOOLTIP
========================= */

export const LabelDiv = styled.div`
  position: absolute;
  bottom: calc(155% - 5px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);

  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.baseBlue.dark};
  color: white;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;

  opacity: 0;
  pointer-events: none;
  z-index: 1;

  ${transitions.delay}

  &::before {
    content: '';
    position: absolute;
    top: 87%;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    background-color: ${({ theme }) => theme.colors.baseBlue.dark};
  }
`

/* =========================
   CONTENT
========================= */

export const ButtonContent = styled.span<{ $state: ButtonState }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ $state }) =>
    $state === 'disabled' &&
    css`
      opacity: 0.5;
    `}
`

/* =========================
   ICON WRAPPER
========================= */

export const IconWrapper = styled.span<{ $size?: ButtonSize }>`
  display: flex;
  align-items: center;

  svg {
    ${({ $size = 'md' }) => iconSizes[$size]}
  }
`

/* =========================
   BOTÃO BASE
========================= */

export const BaseButtonContainer = styled.button<{
  $size?: ButtonSize
  $state?: ButtonState
  $fullWidth?: boolean
  $shape?: ButtonShape
}>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  cursor: pointer;
  position: relative;
  text-decoration: none;

  ${({ $size = 'md' }) => sizeStyles[$size]}
  ${({ $fullWidth }) => $fullWidth && 'width: 100%; justify-content: center;'}
  ${({ $state = 'default' }) => stateStyles[$state]}
  ${({ $shape, $size }) => getShapeStyles($shape, $size)}

  ${transitions.fast}

  &:hover ${LabelDiv} {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  &:not(:hover) ${LabelDiv} {
    transition-delay: 0s;
  }

  &:active {
    transform: scale(0.97);
  }
`
