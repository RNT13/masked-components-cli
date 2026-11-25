import { transitions } from '@/styles/MaskedAnimations/animations/transitions'
import { keyframes, styled } from 'styled-components'

type Props = {
  $isChecked?: boolean
  $isLoading?: boolean
  $hasError?: boolean
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
  flex-wrap: wrap;
`

export const HiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
`

export const CheckboxLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.baseBlack?.light40 ?? '#4b5563'};
  user-select: none;
  cursor: pointer;
`

export const CheckboxBox = styled.label<Props>`
  position: relative;
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
    ${({ theme, $isChecked, $hasError }) =>
      $hasError
        ? `var(--mc-input-error, ${theme.colors.baseRed?.base ?? '#dc2626'})`
        : $isChecked
          ? `var(--mc-switch-border-on, ${theme.colors.baseBlue.base})`
          : `var(--mc-switch-border-off, ${theme.colors?.borderColor ?? theme.colors?.baseBlack?.light20 ?? '#9ca3af'})`};

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

  &:has(${HiddenInput}:focus-visible) {
    outline: 2px solid var(--mc-switch-ring-focus, ${({ theme }) => theme.colors.baseBlue.base});
    outline-offset: 2px;
  }

  &:has(${HiddenInput}:not(:disabled)):hover {
    border-color: var(--mc-switch-border-on, ${({ theme }) => theme.colors.baseBlue.base});
    transform: scale(1.05);
  }

  &:has(${HiddenInput}:not(:disabled)):active {
    transform: scale(0.95);
  }

  &:has(${HiddenInput}:disabled) {
    cursor: not-allowed;
    opacity: 0.5;
  }
`
