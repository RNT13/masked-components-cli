import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
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
  color: ${maskedTheme.colors.baseBlue.light20};
  text-decoration: underline;

  svg {
    color: inherit;
  }

  &:hover {
    color: ${maskedTheme.colors.baseBlue.light30};
  }
`

const errorStyles = css`
  color: ${maskedTheme.colors.baseRed.light30};

  &:hover {
    color: ${maskedTheme.colors.baseRed.light20};
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

  color: ${maskedTheme.colors.baseBlue.base};
  background-color: transparent;
  border: none;

  &:hover {
    background-color: transparent;
    border: none;
    text-decoration: underline;

    color: ${maskedTheme.colors.baseBlue.light};
    transition: ${maskedTheme.transition.fast};
  }

  ${({ $isActive }) => $isActive && activeStyles}
  ${({ $isError }) => $isError && errorStyles}
  ${({ $isDisabled }) => $isDisabled && disabledStyles}
`
