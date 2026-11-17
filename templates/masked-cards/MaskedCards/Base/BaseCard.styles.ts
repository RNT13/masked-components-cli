import styled, { css, RuleSet } from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import { CardAppearance, CardDirection, CardLayout, CardSize } from '../MaskedCards.types'
import { appearanceStyles } from './appearances.styles'

const sizeStyles: Record<CardSize, RuleSet<object>> = {
  sm: css`
    padding: ${maskedTheme.spacing.sm};
    font-size: ${maskedTheme.fontSize.sm};
  `,
  md: css`
    padding: ${maskedTheme.spacing.md};
    font-size: ${maskedTheme.fontSize.md};
  `,
  lg: css`
    padding: ${maskedTheme.spacing.lg};
    font-size: ${maskedTheme.fontSize.lg};
  `,
  xl: css`
    padding: ${maskedTheme.spacing.xl};
    font-size: ${maskedTheme.fontSize.xl};
  `
}

const gapStyles: Record<CardSize, RuleSet<object>> = {
  sm: css`
    gap: ${maskedTheme.spacing.xs};
  `,
  md: css`
    gap: ${maskedTheme.spacing.sm};
  `,
  lg: css`
    gap: ${maskedTheme.spacing.md};
  `,
  xl: css`
    gap: ${maskedTheme.spacing.lg};
  `
}

export const BaseCardContainer = styled.div<{
  $size: CardSize
  $fullWidth?: boolean
  $clickable?: boolean
  $cardBg?: string
  $direction?: CardDirection
  $appearance?: CardAppearance
  $layout?: CardLayout
  $disabled?: boolean
  $selected?: boolean
  $expanded?: boolean
  $isButton?: boolean
}>`
  /* --mc-card-bg-prop: ponte do cardBg (perde para tokens.bg → --mc-card-bg) */
  ${({ $cardBg }) => ($cardBg ? `--mc-card-bg-prop: ${$cardBg};` : '')}

  position: relative;
  display: flex;
  flex-direction: ${({ $direction }) => ($direction === 'row' ? 'row' : 'column')};
  align-items: ${({ $direction }) => ($direction === 'row' ? 'center' : 'stretch')};
  width: 100%;
  border-radius: var(--mc-card-radius, ${maskedTheme.radius.lg});
  background-color: var(
    --mc-card-bg,
    var(--mc-card-bg-prop, ${maskedTheme.colors.baseBlue.light50})
  );
  border: 1px solid var(--mc-card-border, ${maskedTheme.colors.baseBlue.light20});
  box-shadow: var(--mc-card-shadow, ${maskedTheme.boxShadow.xs()});
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
  text-align: left;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;

  ${({ $size }) => sizeStyles[$size]}
  ${({ $size }) => gapStyles[$size]}  
  ${({ $appearance }) => appearanceStyles[$appearance ?? 'elevated']}  
  
  ${({ $layout }) =>
    $layout === 'compact' &&
    css`
      padding: ${maskedTheme.spacing.xs};
      gap: ${maskedTheme.spacing.xs};
    `}  
  
  ${({ $isButton }) =>
    $isButton &&
    css`
      margin: 0;
      font: inherit;
      cursor: pointer;
    `}  
  
  ${({ $clickable, $disabled }) =>
    $clickable &&
    !$disabled &&
    css`
      cursor: pointer;

      @media (hover: hover) {
        &:hover {
          transform: translateY(-2px);
          box-shadow: var(--mc-card-shadow-hover, ${maskedTheme.boxShadow.md()});
        }
      }

      &:active {
        transform: scale(0.98);
      }
    `}  
  
  &:focus-visible {
    outline: 2px solid var(--mc-card-focus-ring, ${maskedTheme.colors.baseBlue.base});
    outline-offset: 2px;
  }

  ${({ $selected }) =>
    $selected &&
    css`
      border-color: var(--mc-card-selected-border, ${maskedTheme.colors.baseBlue.base});
      box-shadow:
        0 0 0 1px var(--mc-card-selected-border, ${maskedTheme.colors.baseBlue.base}),
        var(--mc-card-shadow, ${maskedTheme.boxShadow.xs()});
    `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      background-color: var(--mc-card-disabled-bg, ${maskedTheme.colors.baseBlack.light08});
      color: var(--mc-card-disabled-fg, ${maskedTheme.colors.baseBlack.dark20});
      border-color: var(--mc-card-disabled-bg, ${maskedTheme.colors.baseBlack.light08});
      box-shadow: none;
      opacity: 0.7;

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

/* Cobre o card inteiro quando há href + conteúdo interativo interno. */
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

/* Cobre o card inteiro quando há onClick/seleção + conteúdo interativo interno. */
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

/* Marcador visual de seleção (não depende só de cor: forma + posição). */
export const CardSelectedIndicator = styled.span`
  position: absolute;
  top: ${maskedTheme.spacing.sm};
  right: ${maskedTheme.spacing.sm};
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--mc-card-selected-border, ${maskedTheme.colors.baseBlue.base});
  color: var(--mc-card-selected-fg, #ffffff);
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: ${maskedTheme.fontWeight.bold};
  line-height: ${maskedTheme.lineHeight.none};
  pointer-events: none;

  &::before {
    content: '✓';
  }
`

/* Linha inteira abaixo do conteúdo: botão de expansão + região colapsável. */
export const CardExpandSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  z-index: 1;
`

export const CardExpandButton = styled.button`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: ${maskedTheme.spacing.xs};
  margin: 0;
  margin-top: ${maskedTheme.spacing.xs};
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.medium};
  color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--mc-card-focus-ring, ${maskedTheme.colors.baseBlue.base});
    outline-offset: 2px;
    border-radius: ${maskedTheme.radius.sm};
  }

  &:disabled {
    cursor: not-allowed;
    color: var(--mc-card-disabled-fg, ${maskedTheme.colors.baseBlack.dark20});
  }
`

export const CardExpandCaret = styled.span<{ $expanded?: boolean }>`
  display: inline-block;
  font-size: ${maskedTheme.fontSize.xs};
  transform: rotate(${({ $expanded }) => ($expanded ? '180deg' : '0deg')});
  transition: transform 0.2s ease;

  &::before {
    content: '▾';
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

/*
 * Região colapsável: grid-rows 0fr→1fr com visibility na transição,
 * para que o conteúdo recolhido saia da tabulação e da árvore de a11y.
 */
export const CardExpandRegion = styled.div<{ $expanded?: boolean }>`
  display: grid;
  grid-template-rows: ${({ $expanded }) => ($expanded ? '1fr' : '0fr')};
  visibility: ${({ $expanded }) => ($expanded ? 'visible' : 'hidden')};
  transition:
    grid-template-rows 0.25s ease,
    visibility 0.25s ease;

  > div {
    overflow: hidden;
    min-height: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
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
