import styled from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import { CardMediaRatio } from '../../MaskedCards.types'

const ratioMap: Record<Exclude<CardMediaRatio, 'auto'>, string> = {
  '1:1': '1 / 1',
  '4:3': '4 / 3',
  '16:9': '16 / 9',
  '21:9': '21 / 9',
  '3:4': '3 / 4',
  '9:16': '9 / 16'
}

export const ArticleMedia = styled.div<{ $ratio?: CardMediaRatio }>`
  position: relative;
  width: calc(100% + ${maskedTheme.spacing.md} * 2);
  margin: calc(${maskedTheme.spacing.md} * -1) calc(${maskedTheme.spacing.md} * -1) 0;
  overflow: hidden;
  border-radius: ${maskedTheme.radius.md} ${maskedTheme.radius.md} 0 0;
  background-color: var(--mc-card-media-bg, ${maskedTheme.colors.baseBlack.light08});
  aspect-ratio: ${({ $ratio }) => ($ratio && $ratio !== 'auto' ? ratioMap[$ratio] : '16 / 9')};

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const ArticleCategory = styled.span`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  padding: 2px ${maskedTheme.spacing.xs};
  border-radius: ${maskedTheme.radius.sm};
  background-color: var(--mc-card-accent-soft, ${maskedTheme.colors.baseBlue.light40});
  color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: ${maskedTheme.fontWeight.bold};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

export const ArticleTitle = styled.h3`
  margin: 0;
  font-size: ${maskedTheme.fontSize.lg};
  font-weight: ${maskedTheme.fontWeight.bold};
  line-height: ${maskedTheme.lineHeight.tight};
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
`

export const ArticleExcerpt = styled.p`
  margin: 0;
  font-size: ${maskedTheme.fontSize.sm};
  line-height: ${maskedTheme.lineHeight.normal};
  color: var(--mc-card-muted-fg, ${maskedTheme.colors.baseBlack.base});
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const ArticleFooter = styled.div`
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.xs};
  width: 100%;
  margin-top: auto;
`

export const ArticleAuthorAvatar = styled.span`
  width: 24px;
  height: 24px;
  border-radius: ${maskedTheme.radius.full};
  overflow: hidden;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--mc-card-icon-bg, ${maskedTheme.colors.baseBlue.light20});
  color: var(--mc-card-icon-fg, ${maskedTheme.colors.baseBlue.base});
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: ${maskedTheme.fontWeight.bold};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

export const ArticleMeta = styled.span`
  font-size: ${maskedTheme.fontSize.xs};
  color: var(--mc-card-muted-fg, ${maskedTheme.colors.baseBlack.light40});
`

export const ArticleActions = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  gap: ${maskedTheme.spacing.xs};
  margin-left: auto;
`
