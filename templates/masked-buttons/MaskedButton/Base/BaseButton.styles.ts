import { animations, transitions } from '@/styles/animations'
import styled, { css } from 'styled-components'
import { ButtonShape, ButtonSize, ButtonState } from '../MaskedButton.types'

export const LabelDiv = styled.div`
  position: absolute;
  bottom: calc(150% + 12px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);

  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.baseBlue.light};
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
    background-color: ${({ theme }) => theme.colors.baseBlue.light};
  }
`

export const ButtonContent = styled.span<{ $state: ButtonState }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const IconWrapper = styled.span`
  display: flex;
  align-items: center;

  svg {
    width: 20px;
    height: 20px;
  }
`

const sizeStyles = {
  sm: css`
    height: 100%;
    padding: 6px 10px;
    font-size: 14px;
  `,
  md: css`
    height: 100%;
    padding: 12px 14px;
    font-size: 16px;
  `,
  lg: css`
    height: 100%;
    padding: 16px 20px;
    font-size: 18px;
  `
}

const ButtonShapes = {
  rounded: css`
    border-radius: 18px;
  `,

  circle: css`
    width: 55px;
    height: 55px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    svg,
    span {
      width: 25px;
      height: 25px;
      margin: 0;
    }
  `,

  square: css`
    border-radius: 5px;
  `
}

const stateStyles = {
  loading: css`
    cursor: not-allowed;

    svg {
      ${animations.spin}
      stroke-width: 2;
    }
  `,

  default: css``,

  disabled: css`
    cursor: not-allowed;
    opacity: 0.5;
  `,

  error: css`
    &:hover {
      ${animations.shakeX}
    }
  `
}

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

  ${({ $size = 'md' }) => sizeStyles[$size]}
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
  ${({ $fullWidth }) => $fullWidth && 'justify-content: center;'}
  ${({ $state }) => $state && stateStyles[$state]}
  ${({ $shape }) => $shape && ButtonShapes[$shape]}

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
