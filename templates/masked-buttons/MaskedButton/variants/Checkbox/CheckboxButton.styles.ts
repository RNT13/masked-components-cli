import { transitions } from '@/styles/MaskedAnimations/animations/transitions'
import { keyframes, styled } from 'styled-components'

type Props = {
  $isChecked?: boolean
  $isLoading?: boolean
}

const spin = keyframes`  
  to { transform: rotate(360deg); }  
`

export const CheckboxWrapper = styled.div<{
  $position: 'left' | 'right' | 'center'
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ $position }) => $position};
  gap: 8px;
`

export const CheckboxLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.baseBlack.light40};
  user-select: none;
`

export const CheckboxBox = styled.button<Props>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 22px;
  height: 22px;
  padding: 0;
  border-radius: 6px;
  cursor: pointer;

  background-color: ${({ theme, $isChecked }) =>
    $isChecked ? `var(--mc-switch-track-on, ${theme.colors.baseBlue.base})` : 'transparent'};
  border: 2px solid
    ${({ theme, $isChecked }) =>
      $isChecked
        ? `var(--mc-switch-border-on, ${theme.colors.baseBlue.base})`
        : `var(--mc-switch-border-off, ${theme.colors.baseBlack.base})`};

  ${transitions.fast}

  svg {
    width: 14px;
    height: 14px;
    color: var(--mc-switch-knob-bg, ${({ theme }) => theme.colors.baseBlue.light40});

    ${({ $isLoading }) =>
      $isLoading &&
      `  
      animation: ${spin} 0.8s linear infinite;  
    `}
  }

  &:focus-visible {
    outline: 2px solid var(--mc-switch-ring-focus, ${({ theme }) => theme.colors.baseBlue.base});
    outline-offset: 2px;
  }

  &:hover:not(:disabled) {
    border-color: var(--mc-switch-border-on, ${({ theme }) => theme.colors.baseBlue.base});
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`
