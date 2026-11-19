import styled from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedStackInternalProps } from './MaskedStack.types'

/**
 * Fluxo flexível com gap semântico. Todo valor cai em var(--mc-stack-*, fallback).  
 * 'inline' troca display; 'spread' distribui no eixo principal.  
 */
export const MaskedStackRoot = styled.div<MaskedStackInternalProps>`
  box-sizing: border-box;
  min-width: 0;
  display: flex;
  flex-direction: ${({ $direction }) => $direction};
  align-items: ${({ $variant, $align }) => $align ?? ($variant === 'spread' ? 'center' : 'stretch')};
  justify-content: ${({ $variant, $justify }) =>
    $justify ?? ($variant === 'spread' ? 'space-between' : 'flex-start')};
  gap: var(--mc-stack-gap, ${maskedTheme.spacing.md});

  ${({ $variant }) =>
    $variant === 'inline' &&
    `  
      display: inline-flex;  
    `}

  ${({ $wrap }) =>
    $wrap &&
    `  
      flex-wrap: wrap;  
    `}  
  
  ${({ $fullWidth }) =>
    $fullWidth &&
    `  
      width: 100%;  
    `}
`

/**
 * Divisor entre itens. $auto = linha automática do tema (cor via  
 * --mc-stack-divider); custom node = wrapper neutro que só distribui.  
 */
export const StackDivider = styled.span<{
  $axis: MaskedStackInternalProps['$direction']
  $auto: boolean
}>`
  flex: none;
  display: flex;

  ${({ $axis }) => ($axis === 'row' ? 'align-self: stretch;' : 'width: 100%;')}

  ${({ $auto, $axis }) =>
    $auto
      ? $axis === 'row'
        ? `width: 1px; min-height: 100%; background: var(  
            --mc-stack-divider,  
            ${maskedTheme.colors.baseGray.light40}  
          );`
        : `height: 1px; background: var(--mc-stack-divider, ${maskedTheme.colors.baseGray.light40});`
      : ''}
`
