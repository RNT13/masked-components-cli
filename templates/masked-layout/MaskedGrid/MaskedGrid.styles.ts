import styled from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedGridInternalProps } from './MaskedGrid.types'

/**
 * Grid responsivo. As colunas por breakpoint vivem em tokens  
 * (--mc-grid-cols-mobile/tablet/desktop, emitidos por resolveGridTokens);  
 * variantes trocam o template de colunas. Breakpoints vêm do tema (media).  
 */
export const MaskedGridRoot = styled.div<MaskedGridInternalProps>`
  box-sizing: border-box;
  min-width: 0;
  display: grid;
  gap: var(--mc-grid-gap, ${maskedTheme.spacing.md});
  align-items: stretch;

  /* equal (default): colunas do token, responsivas por breakpoint */
  grid-template-columns: repeat(var(--mc-grid-cols-desktop, 3), minmax(0, 1fr));
  ${media.tablet} {
    grid-template-columns: repeat(var(--mc-grid-cols-tablet, 2), minmax(0, 1fr));
  }
  ${media.mobile} {
    grid-template-columns: repeat(var(--mc-grid-cols-mobile, 1), minmax(0, 1fr));
  }

  /* auto: encaixa pelo menor filho — responsivo sem media query */
  ${({ $variant }) =>
    $variant === 'auto' &&
    `  
      grid-template-columns: repeat(  
        auto-fit,  
        minmax(var(--mc-grid-min-child-width, 240px), 1fr)  
      );  
    `}

  /* feature: destaque 2/3 + complemento 1/3; empilha no mobile */  
  ${({ $variant }) =>
    $variant === 'feature' &&
    `  
      grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);  
      ${media.mobile} {  
        grid-template-columns: 1fr;  
      }  
    `}  
  
  /* sidebar: coluna fixa + conteúdo; colapsa no tablet */  
  ${({ $variant }) =>
    $variant === 'sidebar' &&
    `  
      grid-template-columns: var(--mc-grid-sidebar-width, 240px) minmax(0, 1fr);  
      ${media.tablet} {  
        grid-template-columns: 1fr;  
      }  
    `}
`
