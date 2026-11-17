import styled from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'

/**
 * Grid adaptável: auto-fill com largura mínima por item.  
 * Mobile → 1 coluna; desktop → N colunas conforme o espaço.  
 */
export const CardGroupGrid = styled.div<{
  $minItemWidth: number
  $gap?: string
}>`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(min(${({ $minItemWidth }) => $minItemWidth}px, 100%), 1fr)
  );
  gap: ${({ $gap }) => $gap ?? maskedTheme.spacing.md};
  width: 100%;
`
