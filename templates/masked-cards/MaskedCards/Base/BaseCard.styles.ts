import styled, { css } from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import { CardAppearance, CardDirection, CardSize } from '../MaskedCards.types'
import { appearanceStyles } from './appearances.styles'

const sizeStyles: Record<CardSize, ReturnType<typeof css>> = {
  sm: css`
    padding: ${maskedTheme.spacing.sm};
    font-size: ${maskedTheme.fontSize.xs};
  `,
  md: css`
    padding: ${maskedTheme.spacing.md};
    font-size: ${maskedTheme.fontSize.sm};
  `,
  lg: css`
    padding: ${maskedTheme.spacing.lg};
    font-size: ${maskedTheme.fontSize.md};
  `,
  xl: css`
    padding: ${maskedTheme.spacing.xl};
    font-size: ${maskedTheme.fontSize.lg};
  `
}

const gapStyles: Record<CardSize, string> = {
  sm: maskedTheme.spacing.xs,
  md: maskedTheme.spacing.sm,
  lg: maskedTheme.spacing.md,
  xl: maskedTheme.spacing.lg
}

export const BaseCardContainer = styled.div<{
  $size: CardSize
  $fullWidth?: boolean
  $direction?: CardDirection
  $clickable?: boolean
  $isButton?: boolean
  $appearance?: CardAppearance
  $disabled?: boolean
  $selected?: boolean
}>`
  position: relative;
  display: flex;
  flex-direction: ${({ $direction }) => ($direction === 'row' ? 'row' : 'column')};
  gap: ${({ $size }) => gapStyles[$size]};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  border-radius: ${maskedTheme.radius.md};
  border: 1px solid var(--mc-card-border, ${maskedTheme.colors.baseBlue.light20});
  background-color: var(--mc-card-bg, ${maskedTheme.colors.baseBlue.light50});
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
  box-shadow: var(--mc-card-shadow, ${maskedTheme.boxShadow.xs()});
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    background-color 0.2s ease;

  ${({ $size }) => sizeStyles[$size]}
  ${({ $appearance }) => appearanceStyles[$appearance ?? 'elevated']}  
  
  /* Layout horizontal/split: mídia vira lateral */  
  &[data-layout='horizontal'] .mc-card-media,  
  &[data-layout='split'] .mc-card-media {
    flex: 0 0 40%;
    margin: 0;
    border-radius: 0;
    aspect-ratio: auto;
    min-height: 100%;
  }

  &[data-layout='horizontal'],
  &[data-layout='split'] {
    flex-direction: row;
    align-items: stretch;
  }

  &[data-layout='horizontal'] .mc-card-media {
    border-radius: ${maskedTheme.radius.md} 0 0 ${maskedTheme.radius.md};
  }

  &[data-layout='split'] .mc-card-media {
    flex-basis: 50%;
  }

  /* Layout overlay: mídia absoluta + conteúdo sobre gradiente */
  &[data-layout='overlay'] {
    overflow: hidden;
  }

  &[data-layout='overlay'] .mc-card-media {
    position: absolute;
    inset: 0;
    margin: 0;
    border-radius: 0;
    aspect-ratio: auto;
    z-index: 0;
  }

  &[data-layout='overlay'] .mc-card-media img {
    height: 100%;
  }

  &[data-layout='overlay'] > *:not(.mc-card-media) {
    position: relative;
    z-index: 1;
  }

  &[data-layout='overlay']::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background: var(
      --mc-card-overlay-gradient,
      linear-gradient(to top, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.08) 60%, transparent)
    );
    pointer-events: none;
  }

  &[data-layout='overlay'] {
    color: var(--mc-card-overlay-fg, #ffffff);
  }

  /* Layout compact: densidade reduzida */
  &[data-layout='compact'] {
    padding: ${maskedTheme.spacing.sm};
    gap: ${maskedTheme.spacing.xs};
  }

  &[data-layout='compact'] .mc-card-media {
    margin: calc(${maskedTheme.spacing.sm} * -1) calc(${maskedTheme.spacing.sm} * -1) 0;
  }

  &[data-highlighted='true'] {
    border-color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
    box-shadow:
      var(--mc-card-shadow, ${maskedTheme.boxShadow.xs()}),
      0 0 0 1px var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
  }

  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;

      &:hover {
        box-shadow: var(--mc-card-shadow-hover, ${maskedTheme.boxShadow.md()});
        transform: translateY(-1px);
      }
    `}

  ${({ $isButton }) =>
    $isButton &&
    css`
      appearance: none;
      font: inherit;
      text-align: left;
      cursor: pointer;
    `}  
  
  &:focus-visible {
    outline: 2px solid var(--mc-card-focus-ring, ${maskedTheme.colors.baseBlue.base});
    outline-offset: 2px;
  }

  ${({ $selected }) =>
    $selected &&
    css`
      border-color: var(--mc-card-selected-border, ${maskedTheme.colors.baseBlue.base});
      background-color: var(
        --mc-card-selected-bg,
        var(--mc-card-bg, ${maskedTheme.colors.baseBlue.light50})
      );
      box-shadow:
        var(--mc-card-shadow, ${maskedTheme.boxShadow.xs()}),
        0 0 0 1px var(--mc-card-selected-border, ${maskedTheme.colors.baseBlue.base});
    `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.6;
      background-color: var(
        --mc-card-disabled-bg,
        var(--mc-card-bg, ${maskedTheme.colors.baseBlue.light50})
      );
      color: var(--mc-card-disabled-fg, var(--mc-card-fg, ${maskedTheme.colors.baseBlack.base}));

      &:hover {
        box-shadow: var(--mc-card-shadow, ${maskedTheme.boxShadow.xs()});
        transform: none;
      }
    `}
`

export const StretchedLink = styled.a`
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  text-decoration: none;
  color: inherit;

  &:focus-visible {
    outline: 2px solid var(--mc-card-focus-ring, ${maskedTheme.colors.baseBlue.base});
    outline-offset: 2px;
  }
`

export const StretchedButton = styled.button`
  position: absolute;
  inset: 0;
  z-index: 0;
  border: none;
  padding: 0;
  margin: 0;
  background: transparent;
  border-radius: inherit;
  cursor: pointer;
  font: inherit;
  color: inherit;

  &:focus-visible {
    outline: 2px solid var(--mc-card-focus-ring, ${maskedTheme.colors.baseBlue.base});
    outline-offset: 2px;
  }
`

export const CardExpandSection = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.xs};
  width: 100%;
`

export const CardExpandButton = styled.button`
  appearance: none;
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

  &:focus-visible {
    outline: 2px solid var(--mc-card-focus-ring, ${maskedTheme.colors.baseBlue.base});
    outline-offset: 2px;
    border-radius: ${maskedTheme.radius.sm};
  }
`

export const CardExpandCaret = styled.span<{ $expanded?: boolean }>`
  display: inline-block;
  font-size: 0.75em;
  line-height: 1;
  transform: ${({ $expanded }) => ($expanded ? 'rotate(180deg)' : 'none')};
  transition: transform 0.2s ease;

  &::before {
    content: '▾';
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const CardExpandRegion = styled.div<{ $expanded?: boolean }>`
  display: ${({ $expanded }) => ($expanded ? 'block' : 'none')};
  width: 100%;
`

export const CardSelectedIndicator = styled.span`
  position: absolute;
  top: ${maskedTheme.spacing.xs};
  right: ${maskedTheme.spacing.xs};
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: ${maskedTheme.radius.full};
  background-color: var(--mc-card-selected-border, ${maskedTheme.colors.baseBlue.base});
  color: var(--mc-card-selected-fg, #ffffff);
  font-size: ${maskedTheme.fontSize['2xs']};
  line-height: 1;
  pointer-events: none;

  &::before {
    content: '✓';
  }
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

export const MetricRowBody = styled.div`
  flex: 1;
  min-width: 0;
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
