import { transitions } from '@/styles/MaskedAnimations/animations/transitions'
import { styled } from 'styled-components'

export const SwitchWrapper = styled.div<{
  $position: 'left' | 'right' | 'center'
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ $position }) => $position};
  gap: 8px;
`

export const SwitchLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.baseBlack.light40};
  user-select: none;
`

export const SwitchContainer = styled.button<{ $isChecked?: boolean }>`
  width: 44px;
  height: 24px;
  padding: 0;
  border-radius: 999px;
  position: relative;
  cursor: pointer;

  background-color: var(--mc-switch-track-off, ${({ theme }) => theme.colors.baseBlack.light20});
  border: 2px solid var(--mc-switch-border-off, ${({ theme }) => theme.colors.baseBlack.base});

  ${({ $isChecked, theme }) =>
    $isChecked &&
    `  
    background-color: var(--mc-switch-track-on, ${theme.colors.baseBlue.base});  
    border-color: var(--mc-switch-border-on, ${theme.colors.baseBlue.base});  
  `}

  ${transitions.slow}  
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 2px;
    transform: ${({ $isChecked }) => ($isChecked ? 'translate(20px, -50%)' : 'translate(0, -50%)')};
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: var(--mc-switch-knob-bg, ${({ theme }) => theme.colors.basePureWhite.base});
    box-shadow: var(--mc-switch-knob-shadow, 0 1px 3px rgba(0, 0, 0, 0.4));
    ${transitions.slow}
  }

  &:focus-visible {
    outline: 2px solid var(--mc-switch-ring-focus, ${({ theme }) => theme.colors.baseBlue.base});
    outline-offset: 2px;
  }

  &:hover:not(:disabled) {
    transform: scale(1.05);
  }
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`
