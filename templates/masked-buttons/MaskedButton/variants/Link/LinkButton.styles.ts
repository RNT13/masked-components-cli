import { transitions } from '@/styles/MaskedAnimations/animations/transitions'
import { css, styled } from 'styled-components'
import { BaseButton } from '../../Base/BaseButton'
import { ButtonPosition } from '../../MaskedButton.types'

type props = {
  $isActive?: boolean
  $isError?: boolean
  $isDisabled?: boolean
  $position?: ButtonPosition
}

const disabledStyles = css`
  color: ${({ theme }) => theme.colors.baseBlack.light40};
  background-color: transparent;

  &:hover {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.baseBlack.light20};
    border-color: transparent;
  }
`

const activeStyles = css`
  color: var(--mc-btn-fg-active, ${({ theme }) => theme.colors.baseBlue.light20});
  text-decoration: underline;

  svg {
    color: inherit;
  }

  &:hover {
    color: var(--mc-btn-fg-hover, ${({ theme }) => theme.colors.baseBlue.light30});
  }
`

const errorStyles = css`
  color: var(--mc-btn-danger-fg, ${({ theme }) => theme.colors.baseRed.light30});

  &:hover {
    color: var(--mc-btn-danger-fg, ${({ theme }) => theme.colors.baseRed.light20});
    text-decoration: underline;
  }
`

export const LinkButtonWrapper = styled.div<props>`
  display: flex;
  align-items: center;
  justify-content: ${({ $position }) => $position};
`

export const LinkButtonContainer = styled(BaseButton)<props>`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  color: var(--mc-btn-fg, ${({ theme }) => theme.colors.baseBlue.base});
  background-color: transparent;
  border: none;

  &:hover {
    background-color: transparent;
    border: none;
    text-decoration: underline;
    color: var(--mc-btn-fg-hover, ${({ theme }) => theme.colors.baseBlue.light});
    ${transitions.fast}
  }

  ${({ $isActive }) => $isActive && activeStyles}
  ${({ $isError }) => $isError && errorStyles}  
  ${({ $isDisabled }) => $isDisabled && disabledStyles}
`
