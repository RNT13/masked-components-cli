import { css, styled } from 'styled-components'
import { CardAppearance, CardDirection, CardLayout, CardSize } from '../MaskedCards.types'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import { appearanceStyles } from './appearances.styles'

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
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: ${({ $direction = 'column' }) => $direction};
  align-items: ${({ $direction = 'column' }) => ($direction === 'row' ? 'center' : 'stretch')};
  justify-content: ${({ $direction = 'column' }) =>
    $direction === 'row' ? 'space-between' : 'flex-start'};
  flex-wrap: wrap;
  border-radius: var(--mc-card-radius, ${maskedTheme.radius.md});
  border: 1px solid var(--mc-card-border, ${maskedTheme.colors.baseBlue.light20});
  background-color: var(
    --mc-card-bg,
    ${({ $cardBg }) => $cardBg ?? maskedTheme.colors.baseBlue.light50}
  );
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
  box-shadow: var(--mc-card-shadow, ${maskedTheme.boxShadow.xs()});
  transition: ${maskedTheme.transition.slow};

  /* Expõe cardBg para as aparências (prioridade: tokens.bg > cardBg > padrão) */
  ${({ $cardBg }) => $cardBg && `--mc-card-bg-prop: ${$cardBg};`}

  /* Reset quando o container é um <button> real */  
  ${({ $isButton }) =>
    $isButton &&
    css`
      margin: 0;
      padding: 0;
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
  
  @media (hover: hover) {
    &:hover {
      box-shadow: var(--mc-card-shadow-hover, ${maskedTheme.boxShadow.sm()});
    }
  }

  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;
      text-decoration: none;
      color: var(--mc-card-fg, inherit);
      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;

      @media (hover: hover) {
        &:hover {
          transform: translateY(-2px);
          box-shadow: var(--mc-card-shadow-hover, ${maskedTheme.boxShadow.md()});
        }
      }

      &:active {
        transform: scale(0.98);
      }

      &:focus-visible {
        outline: 2px solid var(--mc-card-focus-ring, ${maskedTheme.colors.baseBlue.base});
        outline-offset: 2px;
      }
    `}

  /* Aparência DEPOIS do hover/$clickable (vence sombra/translateY genéricos)  
     e ANTES de $selected/$disabled (estados vencem a aparência). */  
  ${({ $appearance = 'elevated' }) => appearanceStyles[$appearance]}  
  
  ${({ $selected }) =>
    $selected &&
    css`
      border-color: var(--mc-card-selected-border, ${maskedTheme.colors.baseBlue.base});
      box-shadow:
        0 0 0 1px var(--mc-card-selected-border, ${maskedTheme.colors.baseBlue.base}),
        var(--mc-card-shadow, ${maskedTheme.boxShadow.xs()});
    `}  
  
  /*  
   * Disabled: não depende só de opacity — combina fundo/texto/borda por  
   * tokens (--mc-card-disabled-*) com redução moderada de opacidade,  
   * mantendo o texto essencial legível.  
   */  
  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      background-color: var(
        --mc-card-disabled-bg,
        var(--mc-card-bg, ${maskedTheme.colors.baseBlue.light50})
      );
      color: var(--mc-card-disabled-fg, ${maskedTheme.colors.baseBlack.dark08});
      border-color: var(--mc-card-border, ${maskedTheme.colors.baseBlue.light20});
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

/* Cobre o card inteiro quando há href + (actions | expandable). */
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

/* Cobre o card inteiro quando há (onClick | seleção) + (actions | expandable). */
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

/* Indicador de seleção — não depende só de cor (marcador ✓ + anel). */
export const CardSelectedIndicator = styled.span`
  position: absolute;
  top: ${maskedTheme.spacing.xs};
  right: ${maskedTheme.spacing.xs};
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: var(--mc-card-selected-border, ${maskedTheme.colors.baseBlue.base});
  color: var(--mc-card-selected-fg, #ffffff);
  font-size: 12px;
  line-height: 1;
  pointer-events: none;
`

/*
 * Wrapper do bloco de expansão (botão + região).
 * Ocupa a largura toda mesmo com direction="row"/layout horizontal
 * e não adiciona espaço extra quando a região está fechada.
 */
export const CardExpandSection = styled.div`
  flex-basis: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  z-index: 1;
`

export const CardExpandButton = styled.button<{ $open?: boolean }>`
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-size: 0.875em;
  cursor: pointer;
  color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
  display: inline-flex;
  align-items: center;
  gap: ${maskedTheme.spacing.xs};

  &:focus-visible {
    outline: 2px solid var(--mc-card-focus-ring, ${maskedTheme.colors.baseBlue.base});
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    color: var(--mc-card-disabled-fg, ${maskedTheme.colors.baseBlack.dark08});
  }

  [data-expand-icon] {
    display: inline-block;
    transition: transform 0.2s ease;
    transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'none')};
  }

  @media (prefers-reduced-motion: reduce) {
    [data-expand-icon] {
      transition: none;
    }
  }
`

/*
 * Região colapsável: grid-template-rows 0fr→1fr (solução mais simples e
 * robusta que max-height — sem valor máximo arbitrário).
 * Fechada: visibility:hidden sai da árvore de acessibilidade e da tabulação;
 * a transição de visibility é atrasada até o fim da animação de fechamento
 * e é imediata ao abrir.
 */
export const CardExpandRegion = styled.div<{ $open?: boolean }>`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? '1fr' : '0fr')};
  width: 100%;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  margin-top: ${({ $open }) => ($open ? maskedTheme.spacing.xs : '0')};
  transition:
    grid-template-rows 0.25s ease,
    opacity 0.25s ease,
    margin-top 0.25s ease,
    visibility 0s linear ${({ $open }) => ($open ? '0s' : '0.25s')};

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
