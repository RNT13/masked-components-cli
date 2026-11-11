import { styled } from 'styled-components'

export const SwitchWrapper = styled.div<{
  $position: 'left' | 'right' | 'center'
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ $position }) => $position};
  gap: 10px;
`

export const SwitchLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textColor ?? theme.colors.baseBlack.light40};
  user-select: none;
`

/**
 * Interruptor elétrico (rocker) na vertical.
 *  - ::before = a tecla (paddle): em cima = ligado, embaixo = desligado
 *  - ::after  = marcação "I" (ligado) / "O" (desligado) sobre a tecla
 * Cores: --mc-switch-track-on / --mc-switch-track-off / --mc-switch-knob-bg
 */
export const SwitchContainer = styled.button<{ $isChecked?: boolean }>`
  position: relative;
  flex: none;
  width: 34px;
  height: 56px;
  padding: 0;
  border-radius: 9px;
  cursor: pointer;
  background-color: var(--mc-switch-housing, rgba(0, 0, 0, 0.45));
  border: 2px solid
    ${({ $isChecked, theme }) =>
      $isChecked ? `var(--mc-switch-border-on, ${theme.colors.baseBlue.base})` : `var(--mc-switch-border-off, ${theme.colors.baseBlack.base})`};
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.5);
  transition:
    border-color 0.2s ease,
    filter 0.15s ease,
    transform 0.1s ease;

  &::before {
    content: '';
    position: absolute;
    left: 2px;
    right: 2px;
    height: 26px;
    top: ${({ $isChecked }) => ($isChecked ? '2px' : 'calc(100% - 28px)')};
    border-radius: 6px;
    background: ${({ $isChecked, theme }) =>
      $isChecked ? `var(--mc-switch-track-on, ${theme.colors.baseBlue.base})` : `var(--mc-switch-track-off, ${theme.colors.baseBlack.light20})`};
    box-shadow:
      inset 0 ${({ $isChecked }) => ($isChecked ? '3px' : '-3px')} 0 rgba(255, 255, 255, 0.22),
      0 ${({ $isChecked }) => ($isChecked ? '3px' : '-3px')} 6px rgba(0, 0, 0, 0.45);
    transition:
      top 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
      background-color 0.18s ease,
      box-shadow 0.18s ease;
  }

  &::after {
    content: ${({ $isChecked }) => ($isChecked ? "'I'" : "'O'")};
    position: absolute;
    left: 2px;
    right: 2px;
    height: 26px;
    top: ${({ $isChecked }) => ($isChecked ? '2px' : 'calc(100% - 28px)')};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 900;
    line-height: 1;
    pointer-events: none;
    color: ${({ $isChecked, theme }) =>
      $isChecked ? `var(--mc-switch-knob-bg, ${theme.colors.basePureWhite.base})` : theme.colors.baseGray.light30};
    transition: top 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  &:focus-visible {
    outline: 2px solid var(--mc-switch-ring-focus, ${({ theme }) => theme.colors.baseBlue.base});
    outline-offset: 3px;
  }

  &:hover:not(:disabled) {
    filter: brightness(1.12);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after {
      transition: none;
    }
  }
`
