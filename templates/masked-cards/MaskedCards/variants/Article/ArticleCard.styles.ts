import styled from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import type { CardMediaRatio } from '../../MaskedCards.types'

const ratioMap: Record<CardMediaRatio, string> = {
  '1:1': '1 / 1',
  '4:3': '4 / 3',
  '16:9': '16 / 9',
  '21:9': '21 / 9',
  '3:4': '3 / 4',
  '9:16': '9 / 16',
  auto: 'auto'
}

export const ArticleMedia = styled.div.attrs({ className: 'mc-card-media' })<{
  $ratio?: CardMediaRatio
}>`
  position: relative;
  margin: calc(${maskedTheme.spacing.md} * -1) calc(${maskedTheme.spacing.md} * -1) 0;
  overflow: hidden;
  border-radius: ${maskedTheme.radius.md} ${maskedTheme.radius.md} 0 0;
  background-color: var(--mc-card-media-bg, ${maskedTheme.colors.baseBlack.light08});
  aspect-ratio: ${({ $ratio }) => ($ratio ? ratioMap[$ratio] : 'var(--mc-card-media-ratio, 16 / 9)')};

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
  padding: ${maskedTheme.spacing['2xs']} ${maskedTheme.spacing.xs};
  border-radius: ${maskedTheme.radius.sm};
  font-size: ${maskedTheme.fontSize['2xs']};
  font-weight: ${maskedTheme.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background-color: var(--mc-card-accent-soft, ${maskedTheme.colors.baseBlue.light20});
  color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
`

export const ArticleTitle = styled.h3`
  margin: 0;
  font-size: ${maskedTheme.fontSize.lg};
  font-weight: ${maskedTheme.fontWeight.semibold};
  line-height: ${maskedTheme.lineHeight.snug};
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
`

export const ArticleExcerpt = styled.p`
  margin: 0;
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.normal};
  line-height: ${maskedTheme.lineHeight.normal};
  color: var(--mc-card-muted-fg, currentColor);
`

export const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.xs};
  margin-top: auto;
`

export const ArticleAvatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${maskedTheme.radius.full};
  overflow: hidden;
  flex-shrink: 0;
  font-size: ${maskedTheme.fontSize['2xs']};
  font-weight: ${maskedTheme.fontWeight.semibold};
  background-color: var(--mc-card-icon-bg, ${maskedTheme.colors.baseBlue.light20});
  color: var(--mc-card-icon-fg, ${maskedTheme.colors.baseBlue.base});

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const ArticleAuthorAvatar = ArticleAvatar

export const ArticleAuthor = styled.span`
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: ${maskedTheme.fontWeight.medium};
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
`

export const ArticleDate = styled.span`
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: ${maskedTheme.fontWeight.normal};
  color: var(--mc-card-muted-fg, currentColor);
`

export const ArticleReadTime = styled.span`
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: ${maskedTheme.fontWeight.normal};
  color: var(--mc-card-muted-fg, currentColor);
`

export const ArticleActions = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.xs};
  flex-wrap: wrap;
  margin-top: ${maskedTheme.spacing.xs};
`

export const ArticleFooter = styled.div`
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
