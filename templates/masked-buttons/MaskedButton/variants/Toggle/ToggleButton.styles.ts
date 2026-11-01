import { transitions } from '@/styles/MaskedAnimations/animations/transitions'
import { styled } from 'styled-components'
import { BaseButtonContainer } from '../../Base/BaseButton.styles'

type Props = {
  $isActive?: boolean
}

export const ToggleWrapper = styled.div<{
  $position: 'left' | 'right' | 'center'
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ $position }) => $position};
  gap: 8px;
`

export const ToggleLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.baseBlack.light40};
  user-select: none;
`

export const ToggleButtonContainer = styled(BaseButtonContainer)<Props>`
  background-color: var(--mc-switch-track-off, ${({ theme }) => theme.colors.baseBlack.light20});

  border: 2px solid var(--mc-switch-border-off, ${({ theme }) => theme.colors.baseBlack.base});

  ${({ $isActive, theme }) =>
    $isActive &&
    `  
    background-color: var(--mc-switch-track-on, ${theme.colors.baseBlue.base});  
    border-color: var(--mc-switch-border-on, ${theme.colors.baseBlue.base});  
  `}

  width: 44px;
  height: 24px;
  border-radius: 999px;
  position: relative;
  padding: 0;

  ${transitions.slow}

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 2px;

    transform: ${({ $isActive }) => ($isActive ? 'translate(20px, -50%)' : 'translate(0, -50%)')};

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
    background-color: var(
      --mc-switch-track-hover,
      var(--mc-switch-track-off, ${({ theme }) => theme.colors.baseBlack.light20})
    );
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`
