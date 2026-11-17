import styled, { css } from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import { appearanceStyles } from './appearances.styles'
import type { CardAppearance, CardDirection, CardLayout, CardSize } from '../MaskedCards.types'

const sizeStyles: Record<CardSize, ReturnType<typeof css>> = {
  sm: css`
    padding: ${maskedTheme.spacing.sm};
    border-radius: ${maskedTheme.radius.sm};
  `,
  md: css`
    padding: ${maskedTheme.spacing.md};
    border-radius: ${maskedTheme.radius.md};
  `,
  lg: css`
    padding: ${maskedTheme.spacing.lg};
    border-radius: ${maskedTheme.radius.lg};
  `,
  xl: css`
    padding: ${maskedTheme.spacing.xl};
    border-radius: ${maskedTheme.radius.lg};
  `
}

const gapStyles: Record<CardSize, string> = {
  sm: maskedTheme.spacing.xs,
  md: maskedTheme.spacing.sm,
  lg: maskedTheme.spacing.md,
  xl: maskedTheme.spacing.md
}

export const BaseCardContainer = styled.div<{
  $size: CardSize
  $fullWidth?: boolean
  $direction?: CardDirection
  $appearance?: CardAppearance
  $layout?: CardLayout
  $clickable?: boolean
  $disabled?: boolean
  $selected?: boolean
  $expanded?: boolean
  $isButton?: boolean
}>`
  position: relative;
  display: flex;
  flex-direction: ${({ $direction }) => ($direction === 'row' ? 'row' : 'column')};
  align-items: ${({ $direction }) => ($direction === 'row' ? 'center' : 'stretch')};
  gap: ${({ $size }) => gapStyles[$size]};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'fit-content')};
  text-align: left;
  font-family: inherit;
  text-decoration: none;

  ${({ $size }) => sizeStyles[$size]}
  ${({ $appearance }) => appearanceStyles[$appearance ?? 'elevated']}  
  
  /* Reset quando o card inteiro é um <button> */  
  ${({ $isButton }) =>
    $isButton &&
    css`
      border-style: solid;
      border-width: 1px;
      font: inherit;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
    `}  
  
  /* Card em destaque (ex.: pricing highlighted) */  
  &[data-highlighted='true'] {
    border-color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
    box-shadow:
      0 0 0 1px var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base}),
      var(--mc-card-shadow, ${maskedTheme.boxShadow.md()});
  }

  /* Seleção: anel + borda + fundo sutil — perceptível em qualquer aparência */
  ${({ $selected }) =>
    $selected &&
    css`
      border-color: var(
        --mc-card-selected-border,
        var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base})
      );
      background-color: var(
        --mc-card-selected-bg,
        var(--mc-card-bg, ${maskedTheme.colors.baseBlue.light50})
      );
      box-shadow:
        0 0 0 1px
          var(--mc-card-selected-border, var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base})),
        var(--mc-card-shadow, ${maskedTheme.boxShadow.xs()});
    `}

  /* Hover/focus só em dispositivos com hover real e quando clicável */  
  @media (hover: hover) {
    ${({ $clickable }) =>
      $clickable &&
      css`
        &:hover {
          box-shadow: var(--mc-card-shadow-hover, ${maskedTheme.boxShadow.md()});
        }
      `}
  }

  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;

      &:focus-visible {
        outline: 2px solid var(--mc-card-focus-ring, ${maskedTheme.colors.baseBlue.base});
        outline-offset: 2px;
      }
    `}

  /* Disabled: mantém semântica (button disabled / a sem href) + visual atenuado */  
  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      background-color: var(
        --mc-card-disabled-bg,
        var(--mc-card-bg, ${maskedTheme.colors.baseBlack.light08})
      );
      color: var(--mc-card-disabled-fg, ${maskedTheme.colors.baseBlack.light40});
      box-shadow: none;

      * {
        color: var(--mc-card-disabled-fg, ${maskedTheme.colors.baseBlack.light40}) !important;
      }
    `}
`

/** Link "esticado": cobre o card inteiro sem aninhar interativos. */
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

/** Botão "esticado": mesma técnica para onClick/seleção com actions internas. */
export const StretchedButton = styled.button`
  position: absolute;
  inset: 0;
  z-index: 0;
  border: none;
  background: transparent;
  border-radius: inherit;
  cursor: pointer;
  padding: 0;
  font: inherit;
  appearance: none;
  -webkit-appearance: none;

  &:disabled {
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid var(--mc-card-focus-ring, ${maskedTheme.colors.baseBlue.base});
    outline-offset: 2px;
  }
`

/** Marcador visual de seleção (canto superior direito). */
export const CardSelectedIndicator = styled.span`
  position: absolute;
  top: ${maskedTheme.spacing.xs};
  right: ${maskedTheme.spacing.xs};
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: ${maskedTheme.radius.full};
  background-color: var(
    --mc-card-selected-border,
    var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base})
  );
  color: var(--mc-card-selected-fg, #ffffff);
  font-size: 12px;
  line-height: 1;

  &::before {
    content: '✓';
  }
`

/** Seção de expansão: botão dedicado + região colapsável. */
export const CardExpandSection = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.xs};
  width: 100%;
`

export const CardExpandButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${maskedTheme.spacing['2xs']};
  align-self: flex-start;
  border: none;
  background: transparent;
  padding: ${maskedTheme.spacing['2xs']} 0;
  font: inherit;
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: ${maskedTheme.fontWeight.medium};
  color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;

  &:disabled {
    cursor: not-allowed;
    color: var(--mc-card-disabled-fg, ${maskedTheme.colors.baseBlack.light40});
  }

  &:focus-visible {
    outline: 2px solid var(--mc-card-focus-ring, ${maskedTheme.colors.baseBlue.base});
    outline-offset: 2px;
    border-radius: ${maskedTheme.radius.sm};
  }
`

export const CardExpandCaret = styled.span<{ $expanded?: boolean }>`
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid currentColor;
  transform: ${({ $expanded }) => ($expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 160ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

/**
 * Região colapsável: oculta de verdade quando fechada (display:none),  
 * com transição suave quando aberta — respeitando reduced-motion.  
 */
export const CardExpandRegion = styled.div<{ $expanded?: boolean }>`
  display: ${({ $expanded }) => ($expanded ? 'block' : 'none')};
  width: 100%;
`

/* ------------------------------------------------------------------ */
/* Primitivos compartilhados pelas variantes                            */
/* ------------------------------------------------------------------ */

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
