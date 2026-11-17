import styled from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'

export const TestimonialQuote = styled.blockquote`
  margin: 0;
  padding: 0;
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${maskedTheme.fontWeight.normal};
  line-height: ${maskedTheme.lineHeight.relaxed};
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});

  &::before {
    content: '“';
    display: block;
    font-size: ${maskedTheme.fontSize['3xl']};
    line-height: 1;
    color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
    margin-bottom: ${maskedTheme.spacing['2xs']};
  }
`

export const TestimonialRating = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${maskedTheme.spacing['2xs']};
  font-size: ${maskedTheme.fontSize.sm};
  color: var(--mc-card-rating, ${maskedTheme.colors.baseYellow.base});
`

export const TestimonialRatingValue = styled.span`
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: ${maskedTheme.fontWeight.medium};
  color: var(--mc-card-muted-fg, currentColor);
`

export const TestimonialFooter = styled.footer`
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.sm};
  margin-top: auto;
`

export const TestimonialAvatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: ${maskedTheme.radius.full};
  object-fit: cover;
  flex-shrink: 0;
  background-color: var(--mc-card-media-bg, ${maskedTheme.colors.baseBlack.light08});
`

/** Fallback de iniciais quando não há avatar. */
export const TestimonialAvatarFallback = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: ${maskedTheme.radius.full};
  flex-shrink: 0;
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.semibold};
  background-color: var(--mc-card-icon-bg, ${maskedTheme.colors.baseBlue.light20});
  color: var(--mc-card-icon-fg, ${maskedTheme.colors.baseBlue.base});
`

export const TestimonialAuthorBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const TestimonialAuthor = styled.span`
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.semibold};
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
`

export const TestimonialRole = styled.span`
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: ${maskedTheme.fontWeight.normal};
  color: var(--mc-card-muted-fg, currentColor);
`

export const TestimonialActions = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.xs};
  flex-wrap: wrap;
`
