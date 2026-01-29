import { theme } from '@/styles/theme'
import { css, styled } from 'styled-components'
import { BaseButton } from '../../Base/BaseButton'

type props = {
  $isActive?: boolean
  $isError?: boolean
}

export const activeStyles = css`
  color: ${({ theme }) => theme.colors.baseBlue.light40};
  background-image: linear-gradient(180deg, ${theme.colors.baseBlue.light30}, ${theme.colors.baseBlue.dark30});
  border: 2px solid ${theme.colors.baseBlue.light30};

  svg {
    color: inherit;
  }

  &:hover {
    background-image: linear-gradient(180deg, ${theme.colors.baseBlue.dark30}, ${theme.colors.baseBlue.light30});
    color: ${theme.colors.baseBlue.dark40};
    border-color: ${theme.colors.baseBlue.base};
  }
`

export const errorStyles = css`
  background-image: linear-gradient(180deg, ${theme.colors.baseRed.light08}, ${theme.colors.baseRed.dark});
  color: ${({ theme }) => theme.colors.baseRed.light30};
  border-color: ${({ theme }) => theme.colors.baseRed.light08};

  &:hover {
    background-image: linear-gradient(180deg, ${theme.colors.baseRed.dark}, ${theme.colors.baseRed.light08});
    color: ${({ theme }) => theme.colors.baseRed.light40};
    border-color: ${({ theme }) => theme.colors.baseRed.light40};
  }
`

export const GradientButtonContainer = styled(BaseButton)<props>`
  color: ${({ theme }) => theme.colors.baseBlue.light30};
  background-image: linear-gradient(180deg, ${theme.colors.baseBlue.light}, ${theme.colors.baseBlue.dark});
  border: 2px solid ${theme.colors.baseBlue.light02};

  &:hover {
    background-image: linear-gradient(180deg, ${theme.colors.baseBlue.dark}, ${theme.colors.baseBlue.light});
    color: ${theme.colors.baseBlue.dark30};
    border-color: ${theme.colors.baseBlue.base};
  }

  ${({ $isActive }) => $isActive && activeStyles}

  ${({ $isError }) => $isError && errorStyles}
`
