import { theme, themeConfig } from '@/styles/theme'
import { css, styled } from 'styled-components'
import { BaseButton } from '../../Base/BaseButton'

type props = {
  $isActive?: boolean
  $isError?: boolean
}

const activeStyles = css`
  color: ${theme.colors.baseBlue.dark50};
  background-image: linear-gradient(70deg, ${themeConfig.neon.colors.neonPink.base}, ${themeConfig.neon.colors.neonBlue.base});
  border: 2px solid ${themeConfig.neon.colors.neonBlue.base};

  box-shadow: 0 0 13px ${themeConfig.neon.colors.neonBlue.base};

  svg {
    color: inherit;
  }

  &:hover {
    background-image: linear-gradient(380deg, ${themeConfig.neon.colors.neonBlue.base}, ${themeConfig.neon.colors.neonPink.base});
    color: ${theme.colors.baseBlue.dark50};
    border-color: ${themeConfig.neon.colors.neonBlue.base};
    box-shadow: 0 0 10px ${themeConfig.neon.colors.neonBlue.base};
  }
`

const errorStyles = css`
  background-image: linear-gradient(70deg, ${themeConfig.neon.colors.neonBlue.base}, ${theme.colors.baseRed.dark});
  color: ${themeConfig.neon.colors.neonRed.soft};
  border-color: ${themeConfig.neon.colors.neonBlue.base};

  &:hover {
    background-image: linear-gradient(380deg, ${theme.colors.baseRed.dark}, ${themeConfig.neon.colors.neonBlue.base});
    color: ${theme.colors.baseRed.light40};
    border-color: ${themeConfig.neon.colors.neonRed.base};
    box-shadow: 0 0 15px ${themeConfig.neon.colors.neonRed.base};
  }
`

export const NeonButtonContainer = styled(BaseButton)<props>`
  color: ${theme.colors.baseBlue.dark50};
  background-image: linear-gradient(70deg, ${themeConfig.neon.colors.neonPink.base}, ${themeConfig.neon.colors.neonBlue.base});
  border: 2px solid ${themeConfig.neon.colors.neonBlue.base};

  &:hover {
    background-image: linear-gradient(380deg, ${themeConfig.neon.colors.neonBlue.base}, ${themeConfig.neon.colors.neonPink.base});
    color: ${theme.colors.baseBlue.dark50};
    border-color: ${themeConfig.neon.colors.neonBlue.base};
    box-shadow: 0 0 10px ${themeConfig.neon.colors.neonBlue.base};
  }

  ${({ $isActive }) => $isActive && activeStyles}

  ${({ $isError }) => $isError && errorStyles}
`
