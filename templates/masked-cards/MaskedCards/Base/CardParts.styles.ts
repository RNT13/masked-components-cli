import styled from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import { CardMediaRatio } from '../MaskedCards.types'

const ratioMap: Record<Exclude<CardMediaRatio, 'auto'>, string> = {
  '1:1': '1 / 1',
  '4:3': '4 / 3',
  '16:9': '16 / 9',
  '21:9': '21 / 9',
  '3:4': '3 / 4',
  '9:16': '9 / 16'
}

/**
 * Cabeçalho do card: linha com espaço entre título e ações.  
 * Fica acima do stretched-link/button (z-index) para não bloquear cliques  
 * em elementos interativos internos.  
 */
export const CardHeaderContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${maskedTheme.spacing.sm};
  width: 100%;
`

/**
 * Mídia do card: respeita mediaRatio via aspect-ratio; imagem cobre a área.  
 * Margens negativas compensam o padding do BaseCard para a mídia "sangrar"  
 * até as bordas (comportamento comum de card com imagem no topo).  
 */
export const CardMediaContainer = styled.div<{
  $ratio?: CardMediaRatio
}>`
  position: relative;
  z-index: 0;
  width: calc(100% + ${maskedTheme.spacing.md} * 2);
  margin: calc(${maskedTheme.spacing.md} * -1) calc(${maskedTheme.spacing.md} * -1) 0;
  overflow: hidden;
  border-radius: ${maskedTheme.radius.md} ${maskedTheme.radius.md} 0 0;
  background-color: var(--mc-card-media-bg, ${maskedTheme.colors.baseBlack.light08});
  aspect-ratio: ${({ $ratio }) => ($ratio && $ratio !== 'auto' ? ratioMap[$ratio] : 'auto')};

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

/** Corpo principal do card: coluna com gap entre blocos de conteúdo. */
export const CardContentContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.xs};
  width: 100%;
  flex: 1;
`

/** Rodapé: separado por borda superior sutil, alinhado ao final. */
export const CardFooterContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${maskedTheme.spacing.sm};
  width: 100%;
  padding-top: ${maskedTheme.spacing.sm};
  border-top: 1px solid var(--mc-card-border, ${maskedTheme.colors.baseBlack.light20});
  margin-top: auto;
`

/**
 * Zona de ações: sempre acima do stretched-link/button para que botões  
 * internos continuem clicáveis quando o card inteiro é clicável.  
 */
export const CardActionsContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.xs};
  flex-wrap: wrap;
`
