import { css, styled } from 'styled-components'
import { BaseButton } from '../../Base/BaseButton'

type props = {
  $isActive?: boolean
  $isError?: boolean
}

const activeStyles = css`
  color: ${({ theme }) => theme.colors.baseBlue.light20};
  background-color: ${({ theme }) => theme.colors.baseBlue.dark02};
  border: 2px solid ${({ theme }) => theme.colors.baseBlue.light20};

  box-shadow: 0px 0px 10px 1px ${({ theme }) => theme.colors.baseBlue.base};

  svg {
    color: inherit;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.baseBlue.dark20};
    background-color: ${({ theme }) => theme.colors.baseBlue.light08};
    border-color: ${({ theme }) => theme.colors.baseBlue.dark08};
  }
`

const errorStyles = css`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.baseRed.light30};
  border-color: ${({ theme }) => theme.colors.baseRed.light08};

  &:hover {
    background-color: ${({ theme }) => theme.colors.baseRed.light04};
    color: ${({ theme }) => theme.colors.baseRed.light40};
    border-color: ${({ theme }) => theme.colors.baseRed.light40};
  }
`

export const OutlineButtonContainer = styled(BaseButton)<props>`
  color: ${({ theme }) => theme.colors.baseBlue.base};
  background-color: transparent;
  border: 2px solid ${({ theme }) => theme.colors.baseBlue.base};

  &:hover {
    background-color: ${({ theme }) => theme.colors.baseBlue.base};
    color: ${({ theme }) => theme.colors.baseBlue.dark20};
    border-color: ${({ theme }) => theme.colors.baseBlue.dark20};
  }

  ${({ $isActive }) => $isActive && activeStyles}

  ${({ $isError }) => $isError && errorStyles}
`
