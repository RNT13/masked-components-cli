import { css, styled } from 'styled-components'
import { BaseButton } from '../../Base/BaseButton'

type props = {
  $isActive?: boolean
  $isError?: boolean
}

const activeStyles = css`
  color: ${({ theme }) => theme.colors.baseBlue.light20};
  background-color: transparent;
  border: 2px solid ${({ theme }) => theme.colors.baseBlue.light20};

  box-shadow: 0px 0px 10px 1px ${({ theme }) => theme.colors.baseBlue.light50};

  svg {
    color: inherit;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.baseBlue.dark20};
    background-color: ${({ theme }) => theme.colors.baseBlue.light};
    border-color: transparent;
  }
`

const errorStyles = css`
  color: ${({ theme }) => theme.colors.baseRed.light40};
  background-color: transparent;
  border: 2px solid transparent;

  &:hover {
    background-color: ${({ theme }) => theme.colors.baseRed.light04};
    color: ${({ theme }) => theme.colors.baseRed.light40};
    border-color: transparent;
  }
`

export const GhostButtonContainer = styled(BaseButton)<props>`
  color: ${({ theme }) => theme.colors.baseBlue.base};
  background-color: transparent;
  border: 2px solid transparent;

  &:hover {
    background-color: ${({ theme }) => theme.colors.baseBlue.base};
    color: ${({ theme }) => theme.colors.baseBlue.dark20};
    border-color: transparent;
  }

  ${({ $isActive }) => $isActive && activeStyles}
  ${({ $isError }) => $isError && errorStyles}
`
