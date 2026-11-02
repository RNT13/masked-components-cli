import { css, styled } from 'styled-components'
import { CardDirection, CardSize } from '../MaskedCards.types'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'

const sizeStyles: Record<CardSize, ReturnType<typeof css>> = {
  sm: css`
    padding: ${maskedTheme.spacing.sm};
  `,
  md: css`
    padding: ${maskedTheme.spacing.md};
  `,
  lg: css`
    padding: ${maskedTheme.spacing.lg};
  `,
  xl: css`
    padding: ${maskedTheme.spacing.xl};
  `
}

const gapStyles: Record<CardSize, ReturnType<typeof css>> = {
  sm: css`
    gap: ${maskedTheme.spacing.sm};
  `,
  md: css`
    gap: ${maskedTheme.spacing.md};
  `,
  lg: css`
    gap: ${maskedTheme.spacing.lg};
  `,
  xl: css`
    gap: ${maskedTheme.spacing.xl};
  `
}

export const BaseCardContainer = styled.div<{
  $size?: CardSize
  $gapStyles?: CardSize
  $fullWidth?: boolean
  $clickable?: boolean
  $cardBg?: string
  $direction?: CardDirection
}>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: ${({ $direction = 'column' }) => $direction};
  align-items: ${({ $direction = 'column' }) => ($direction === 'row' ? 'center' : 'stretch')};
  justify-content: ${({ $direction = 'column' }) =>
    $direction === 'row' ? 'space-between' : 'flex-start'};
  border-radius: var(--mc-card-radius, ${maskedTheme.radius.md});
  border: 1px solid var(--mc-card-border, ${maskedTheme.colors.baseBlue.light20});
  background-color: var(
    --mc-card-bg,
    ${({ $cardBg }) => $cardBg ?? maskedTheme.colors.baseBlue.light50}
  );
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
  ${({ $gapStyles = 'md' }) => gapStyles[$gapStyles]};
  box-shadow: var(--mc-card-shadow, ${maskedTheme.boxShadow.xs()});
  transition: ${maskedTheme.transition.slow};

  ${({ $size = 'md' }) => sizeStyles[$size]}
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}  
  
  &:hover {
    box-shadow: var(--mc-card-shadow-hover, ${maskedTheme.boxShadow.sm()});
  }

  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--mc-card-shadow-hover, ${maskedTheme.boxShadow.md()});
      }

      &:active {
        transform: scale(0.98);
      }

      &:focus-visible {
        outline: 2px solid var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
        outline-offset: 2px;
      }
    `}
`

export const MetricRowBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: ${maskedTheme.spacing.xs};
`

export const MetricColumnBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.sm};
`

export const CardIconBadge = styled.div<{
  $bg?: string
  $color?: string
  $size?: 'sm' | 'md'
  $iconSize?: number
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => ($size === 'sm' ? '32px' : '42px')};
  height: ${({ $size }) => ($size === 'sm' ? '32px' : '42px')};
  border-radius: ${maskedTheme.radius.sm};
  background-color: ${({ $bg }) =>
    $bg ?? `var(--mc-card-icon-bg, ${maskedTheme.colors.baseBlue.light20})`};
  color: ${({ $color }) => $color ?? `var(--mc-card-icon-fg, ${maskedTheme.colors.baseBlue.base})`};

  svg {
    width: ${({ $iconSize }) => ($iconSize ? `${$iconSize}px` : '18px')};
    height: ${({ $iconSize }) => ($iconSize ? `${$iconSize}px` : '18px')};
  }
`
