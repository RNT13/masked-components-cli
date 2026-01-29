import styled, { css } from 'styled-components'
import { BaseButton } from '../../Base/BaseButton'

type props = {
  $isActive?: boolean
  $isError?: boolean
}

const activeStyles = css`
  color: ${({ theme }) => theme.colors.baseBlue.light20};
  background-color: ${({ theme }) => theme.colors.baseBlue.dark20};
  border: 2px solid ${({ theme }) => theme.colors.baseBlue.light20};

  box-shadow: 0px 0px 10px 1px ${({ theme }) => theme.colors.baseBlue.base};

  svg {
    color: inherit;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.baseBlue.dark20};
    background-color: ${({ theme }) => theme.colors.baseBlue.light};
    border-color: ${({ theme }) => theme.colors.baseBlue.dark20};
  }
`

const errorStyles = css`
  background-color: ${({ theme }) => theme.colors.baseRed.light08};
  color: ${({ theme }) => theme.colors.baseRed.light30};
  border-color: ${({ theme }) => theme.colors.baseRed.light08};

  &:hover {
    background-color: ${({ theme }) => theme.colors.baseRed.dark};
    color: ${({ theme }) => theme.colors.baseRed.dark30};
    border-color: ${({ theme }) => theme.colors.baseRed.dark30};
  }
`

export const DefaultButtonContainer = styled(BaseButton)<props>`
  color: ${({ theme }) => theme.colors.baseBlue.dark20};
  background-color: ${({ theme }) => theme.colors.baseBlue.light20};
  border: 2px solid ${({ theme }) => theme.colors.baseBlue.dark20};

  &:hover {
    background-color: ${({ theme }) => theme.colors.baseBlue.light20};
    color: ${({ theme }) => theme.colors.baseBlue.base};
    border-color: ${({ theme }) => theme.colors.baseBlue.base};
  }

  ${({ $isActive }) => $isActive && activeStyles}

  ${({ $isError }) => $isError && errorStyles}
`
