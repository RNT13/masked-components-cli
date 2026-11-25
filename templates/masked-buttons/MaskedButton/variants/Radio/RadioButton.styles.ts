import { transitions } from '@/styles/MaskedAnimations/animations/transitions'
import { styled } from 'styled-components'

export const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
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

export const RadioLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.baseBlack?.light40 ?? '#4b5563'};
  user-select: none;
  cursor: pointer;
`

export const RadioDot = styled.label<{ $isChecked?: boolean; $hasError?: boolean }>`
  position: relative;
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
    ${({ theme, $isChecked, $hasError }) =>
      $hasError
        ? `var(--mc-input-error, ${theme.colors?.baseRed?.base ?? '#ef4444'})`
        : $isChecked
          ? `var(--mc-switch-border-on, ${theme.colors?.baseBlue?.base ?? '#3b82f6'})`
          : `var(--mc-switch-border-off, ${theme.colors?.borderColor ?? theme.colors?.baseBlack?.light20 ?? '#9ca3af'})`};

  ${transitions.fast}

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transform: ${({ $isChecked }) => ($isChecked ? 'scale(1)' : 'scale(0)')};
    background-color: var(--mc-switch-track-on, ${({ theme }) => theme.colors?.baseBlue?.base ?? '#3b82f6'});
    ${transitions.fast}
  }

  &:has(${HiddenInput}:focus-visible) {
    outline: 2px solid var(--mc-switch-ring-focus, ${({ theme }) => theme.colors?.baseBlue?.base ?? '#3b82f6'});
    outline-offset: 2px;
  }

  &:has(${HiddenInput}:not(:disabled)):hover {
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
