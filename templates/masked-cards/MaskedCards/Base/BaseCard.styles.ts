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

const gapStyles: Record<CardSize, ReturnType<typeof css>> = {
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

type ContainerProps = {
  $size: CardSize
  $direction: CardDirection
  $appearance: CardAppearance
  $fullWidth?: boolean
  $selected?: boolean
  $isButton?: boolean
  $stretched?: boolean
}

export const BaseCardContainer = styled.div<ContainerProps>`
  position: relative;
  display: flex;
  flex-direction: ${({ $direction }) => ($direction === 'row' ? 'row' : 'column')};
  ${({ $size }) => gapStyles[$size]}
  ${({ $size }) => sizeStyles[$size]}
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  border-radius: var(--mc-card-radius, ${maskedTheme.radius.lg});
  border: 1px solid var(--mc-card-border, transparent);
  background-color: var(--mc-card-bg, var(--mc-card-bg-prop, ${maskedTheme.colors.baseWhite.base}));
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.base});
  box-shadow: var(--mc-card-shadow, ${maskedTheme.boxShadow.xs()});
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.15s ease;
  overflow: hidden;
  text-align: left;
  font-family: inherit;

  ${({ $appearance }) => appearanceStyles[$appearance]}

  ${({ $isButton }) =>
    $isButton &&
    css`
      cursor: pointer;
      padding: ${maskedTheme.spacing.md};

      &:disabled {
        cursor: not-allowed;
        opacity: 0.55;
        pointer-events: none;
      }

      &:focus-visible {
        outline: 2px solid var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
        outline-offset: 2px;
      }
    `}

  ${({ $stretched }) =>
    $stretched &&
    css`
      cursor: pointer;

      &:focus-within {
        outline: 2px solid var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
        outline-offset: 2px;
      }
    `}

  ${({ $selected }) =>
    $selected &&
    css`
      border-color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
      box-shadow:
        var(--mc-card-shadow, ${maskedTheme.boxShadow.xs()}),
        0 0 0 1px var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
    `}

  /* ---------- layout: horizontal / split ---------- */
  &[data-layout='horizontal'],
&[data-layout='split'] {
    flex-direction: row;
    align-items: stretch;

    > .mc-card-media {
      margin: 0;
      position: static;
      aspect-ratio: auto;
      align-self: stretch;
      border-radius: ${maskedTheme.radius.md};
      overflow: hidden;
      flex: 0 1 40%;
      min-width: 96px;
      max-width: 45%;
    }

    > *:not(.mc-card-media) {
      flex: 1 1 0%;
      min-width: 0;
    }
  }

  &[data-layout='split'] > .mc-card-media {
    flex-basis: 50%;
    max-width: 50%;
    border-radius: ${maskedTheme.radius.md};
  }

  /*
   * Dupla classe no container (&&) sobe a especificidade acima dos
   * estilos de mídia das variantes (margin negativo, position, inset).
   */
  &&[data-layout='horizontal'] > .mc-card-media {
    max-height: 180px;
    align-self: center;
  }
  &&[data-layout='split'] > .mc-card-media {
    margin: 0;
    position: relative;
    inset: auto;
    flex: 1 1 140px;
    min-width: 140px;
    max-width: 45%;
    aspect-ratio: auto;
    align-self: stretch;
    border-radius: calc(var(--mc-card-radius, ${maskedTheme.radius.lg}) - ${maskedTheme.spacing.xs});
    overflow: hidden;
  }

  &&[data-layout='split'] > .mc-card-media {
    flex: 1 1 50%;
    min-width: 160px;
    max-width: 50%;
    border-radius: calc(var(--mc-card-radius, ${maskedTheme.radius.lg}) - ${maskedTheme.spacing.xs});
  }

  /*
   * Quando a mídia quebra de linha (card estreito), ela ocupa a
   * largura toda e volta a ter proporção — vira banner no topo.
   */
  &&[data-layout='horizontal'] > .mc-card-media:nth-child(1):nth-last-child(n + 2),
  &&[data-layout='split'] > .mc-card-media {
    /* sem regra extra — o wrap + flex-basis já resolvem */
  }

  &&[data-layout='horizontal'] > .mc-card-media img,
  &&[data-layout='split'] > .mc-card-media img,
  &&[data-layout='horizontal'] > .mc-card-media picture,
  &&[data-layout='split'] > .mc-card-media picture {
    width: 100%;
    height: 100%;
    min-height: 100%;
    object-fit: cover;
    display: block;
  }

  /* o conteúdo ao lado da mídia pode encolher e quebrar texto */
  &[data-layout='horizontal'] > *:not(.mc-card-media),
  &[data-layout='split'] > *:not(.mc-card-media) {
    min-width: 0;
    flex: 1 1 160px;
  }

  /* mídia quebrada para cima (wrap) vira banner com proporção */
  &&[data-layout='horizontal'] > .mc-card-media:first-child:last-child,
  &&[data-layout='horizontal'] > .mc-card-media:not(:only-child) {
    /* quando wrapada, flex-basis 100% é decidido pelo min-width vs container */
  }

  /* em cards estreitos (size sm) o horizontal vira coluna */
  &&[data-layout='horizontal'][data-size='sm'] {
    flex-direction: column;
    flex-wrap: nowrap;
  }

  &&[data-layout='horizontal'][data-size='sm'] > .mc-card-media {
    flex: none;
    width: 100%;
    min-width: 0;
    max-width: none;
    aspect-ratio: var(--mc-card-media-ratio, 16 / 9);
    border-radius: ${maskedTheme.radius.md};
  }

  /* ---------- layout: overlay ---------- */
  &[data-layout='overlay'] {
    position: relative;
  }

  &&[data-layout='overlay'] > .mc-card-media {
    position: absolute;
    inset: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    aspect-ratio: auto;
    border-radius: 0;
    z-index: 0;
    border-radius: ${maskedTheme.radius.md};
  }

  &&[data-layout='overlay'] > .mc-card-media img,
  &&[data-layout='overlay'] > .mc-card-media picture {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* gradiente de legibilidade: escuro na base onde fica o texto */
  &[data-layout='overlay']::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background: linear-gradient(
      to top,
      var(--mc-card-overlay-gradient, rgba(0, 0, 0, 1)) 0%,
      rgba(0, 0, 0, 0.6) 45%,
      rgba(0, 0, 0, 0.3) 75%,
      transparent 100%
    );
    pointer-events: none;
  }

  &[data-layout='overlay'] > *:not(.mc-card-media) {
    position: relative;
    z-index: 1;
    color: var(--mc-card-overlay-fg, #ffffff);
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  }

  /* ---------- layout: compact ---------- */
  &[data-layout='compact'] {
    padding: ${maskedTheme.spacing.xs} ${maskedTheme.spacing.sm};
    gap: ${maskedTheme.spacing['2xs']};
  }

  /* ---------- mediaRatio via var ---------- */
  & > .mc-card-media {
    aspect-ratio: var(--mc-card-media-ratio, auto);
    border-radius: ${maskedTheme.radius.md};
  }
`

export const StretchedLink = styled.a`
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: inherit;
  text-decoration: none;
  color: inherit;

  &:focus-visible {
    outline: 2px solid var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
    outline-offset: 2px;
  }
`

export const StretchedButton = styled.button`
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: inherit;
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-align: inherit;

  &:focus-visible {
    outline: 2px solid var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    pointer-events: none;
  }
`

export const CardSelectedIndicator = styled.span`
  position: absolute;
  top: ${maskedTheme.spacing.sm};
  right: ${maskedTheme.spacing.sm};
  z-index: 2;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
  color: var(--mc-card-selected-indicator-fg, #ffffff);
  border: 2px solid var(--mc-card-selected-indicator-ring, #ffffff);
  box-shadow: ${maskedTheme.boxShadow.lg()};
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.bold};
  line-height: 1;
  pointer-events: none;

  &::before {
    content: '✓';
  }
`

export const CardExpandButton = styled.button`
  position: relative;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${maskedTheme.spacing['2xs']};
  align-self: flex-start;
  margin-top: ${maskedTheme.spacing.xs};
  padding: ${maskedTheme.spacing['2xs']} ${maskedTheme.spacing.sm};
  border: 1px solid var(--mc-card-border, ${maskedTheme.colors.baseBlack.light20});
  border-radius: ${maskedTheme.radius.full};
  background: transparent;
  color: var(--mc-card-muted-fg, ${maskedTheme.colors.baseBlack.light40});
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: ${maskedTheme.fontWeight.medium};
  line-height: 1;
  cursor: pointer;
  font-family: inherit;
  transition:
    color 0.15s ease,
    border-color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
    border-color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
    background-color: var(--mc-card-accent-soft, ${maskedTheme.colors.baseBlue.light40});
  }

  &:focus-visible {
    outline: 2px solid var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
    outline-offset: 2px;
  }
`

export const CardExpandCaret = styled.span<{ $open?: boolean }>`
  display: inline-block;
  font-size: ${maskedTheme.fontSize.xs};
  line-height: 1;
  transition: transform 0.2s ease;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};

  &::before {
    content: '▾';
  }
`

export const CardExpandRegion = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;

  &[hidden] {
    display: none;
  }
`

export const CardExpandSection = styled.div<{ $direction?: CardDirection }>`
  display: flex;
  flex-direction: ${({ $direction }) => ($direction === 'row' ? 'row' : 'column')};
  flex-wrap: wrap;
  gap: ${maskedTheme.spacing.sm};
  padding-top: ${maskedTheme.spacing.sm};
  border-top: 1px solid var(--mc-card-border, ${maskedTheme.colors.baseBlack.light20});
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
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.sm};
  flex: 1;
  min-width: 0;
`

export const MetricColumnBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.xs};
`
