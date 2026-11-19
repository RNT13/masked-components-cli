import styled, { css } from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedDivInternalProps } from './MaskedDiv.types'

/**
 * Caixa base. Todo valor visual cai em var(--mc-div-*, fallback):  
 * colorTheme/tokens preenchem as variáveis via resolveDivTokens (inline  
 * style), e o fallback é o visual neutro do tema ativo.  
 */
export const MaskedDivRoot = styled.div<MaskedDivInternalProps>`
  box-sizing: border-box;
  min-width: 0;
  display: block;
  color: var(--mc-div-fg, inherit);
  background-color: var(--mc-div-bg, transparent);
  border: 1px solid var(--mc-div-border, transparent);
  border-radius: var(--mc-div-radius, 0px);
  box-shadow: var(--mc-div-shadow, none);
  gap: var(--mc-div-gap, 0px);
  padding: var(--mc-div-padding, 0px);

  /* flex sob demanda: qualquer prop de fluxo ativa o display flex */
  ${({ $direction, $align, $justify, $wrap }) =>
    ($direction || $align || $justify || $wrap) &&
    css`
      display: flex;
      flex-direction: ${$direction ?? 'row'};
      align-items: ${$align ?? 'stretch'};
      justify-content: ${$justify ?? 'flex-start'};
      flex-wrap: ${$wrap ?? 'nowrap'};
    `}

  ${({ $variant }) =>
    $variant === 'card' &&
    css`
      border-radius: var(--mc-div-radius, ${maskedTheme.radius.md});
      box-shadow: var(--mc-div-shadow, ${maskedTheme.boxShadow.sm()});
    `}  
  
  ${({ $variant }) =>
    $variant === 'outlined' &&
    css`
      border-color: var(--mc-div-border, ${maskedTheme.colors.baseGray.dark20});
      border-radius: var(--mc-div-radius, ${maskedTheme.radius.md});
    `}  
  
  ${({ $variant }) =>
    $variant === 'glass' &&
    css`
      background-color: var(--mc-div-glass-bg, color-mix(in srgb, currentColor 6%, transparent));
      border: 1px solid
        var(--mc-div-glass-border, color-mix(in srgb, currentColor 14%, transparent));
      border-radius: var(--mc-div-radius, ${maskedTheme.radius.md});
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    `}  
  
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}
`
