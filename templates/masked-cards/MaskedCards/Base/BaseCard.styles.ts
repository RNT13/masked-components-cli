import { css, styled } from 'styled-components'
import { CardAppearance, CardDirection, CardLayout, CardSize } from '../MaskedCards.types'
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

/**
 * Aparências: o mapa completo (filled, outlined, flat, gradient, glass)  
 * é centralizado em appearances.styles.ts (Passo 2). 'elevated' é o  
 * visual atual e default de compatibilidade.  
 */
const appearanceStyles: Record<CardAppearance, ReturnType<typeof css>> = {
  elevated: css``,
  filled: css``,
  outlined: css``,
  flat: css``,
  gradient: css``,
  glass: css``
}

export const BaseCardContainer = styled.div<{
  $size?: CardSize
  $fullWidth?: boolean
  $clickable?: boolean
  $cardBg?: string
  $direction?: CardDirection
  $appearance?: CardAppearance
  $layout?: CardLayout
  $disabled?: boolean
  $selected?: boolean
  $expanded?: boolean
  $stretched?: boolean
  $isButton?: boolean
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
  box-shadow: var(--mc-card-shadow, ${maskedTheme.boxShadow.xs()});
  transition: ${maskedTheme.transition.slow};

  ${({ $stretched }) => $stretched && 'position: relative;'}

  /* Reset quando o container é um <button> real */  
  ${({ $isButton }) =>
    $isButton &&
    css`
      margin: 0;
      border-style: solid;
      font: inherit;
      text-align: left;
      cursor: pointer;
    `}  
  
  ${({ $size = 'md', $layout }) =>
    $layout === 'compact'
      ? css`
          padding: ${maskedTheme.spacing.sm};
          gap: ${maskedTheme.spacing.sm};
        `
      : css`
          ${sizeStyles[$size]}
          ${gapStyles[$size]}
        `}  
  
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}  
  
  ${({ $appearance = 'elevated' }) => appearanceStyles[$appearance]}  
  
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
        outline: 2px solid var(--mc-card-focus-ring, ${maskedTheme.colors.baseBlue.base});
        outline-offset: 2px;
      }
    `}

  ${({ $selected }) =>
    $selected &&
    css`
      border-color: var(--mc-card-selected-border, ${maskedTheme.colors.baseBlue.base});
      background-color: var(
        --mc-card-selected-bg,
        var(--mc-card-bg, ${maskedTheme.colors.baseBlue.light50})
      );
      box-shadow: 0 0 0 1px var(--mc-card-selected-border, ${maskedTheme.colors.baseBlue.base});
    `}  
  
  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.55;
      background-color: var(
        --mc-card-disabled-bg,
        var(--mc-card-bg, ${maskedTheme.colors.baseBlue.light50})
      );
      color: var(--mc-card-disabled-fg, ${maskedTheme.colors.baseBlack.dark08});
      box-shadow: none;
      transform: none;

      &:hover,
      &:active {
        transform: none;
        box-shadow: none;
      }
    `}  
  
  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover,
    &:active {
      transform: none;
    }
  }
`

/* Cobre o card inteiro quando há href + actions (stretched-link). */
export const StretchedLink = styled.a`
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid var(--mc-card-focus-ring, ${maskedTheme.colors.baseBlue.base});
    outline-offset: 2px;
  }
`

/* Cobre o card inteiro quando há onClick + actions (stretched-button). */
export const StretchedButton = styled.button`
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--mc-card-focus-ring, ${maskedTheme.colors.baseBlue.base});
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
  }
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
