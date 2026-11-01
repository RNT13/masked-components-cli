import { transitions } from '@/styles/MaskedAnimations/animations/transitions'
import { styled } from 'styled-components'

export const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const RadioLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.baseBlack.light40};
  user-select: none;
`

export const RadioDot = styled.button<{ $isChecked?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;
  background-color: transparent;

  border: 2px solid
    var(
      --mc-switch-border-off,
      ${({ theme, $isChecked }) =>
        $isChecked ? theme.colors.baseBlue.base : theme.colors.baseBlack.base}
    );

  ${({ $isChecked, theme }) =>
    $isChecked && `border-color: var(--mc-switch-border-on, ${theme.colors.baseBlue.base});`}

  ${transitions.fast}  
  
  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transform: ${({ $isChecked }) => ($isChecked ? 'scale(1)' : 'scale(0)')};
    background-color: var(--mc-switch-track-on, ${({ theme }) => theme.colors.baseBlue.base});
    ${transitions.fast}
  }

  &:focus-visible {
    outline: 2px solid var(--mc-switch-ring-focus, ${({ theme }) => theme.colors.baseBlue.base});
    outline-offset: 2px;
  }

  &:hover:not(:disabled) {
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
