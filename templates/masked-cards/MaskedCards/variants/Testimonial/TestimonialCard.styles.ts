import styled from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'

export const TestimonialQuote = styled.blockquote`
  margin: 0;
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.normal};
  line-height: ${maskedTheme.lineHeight.relaxed};
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});

  &::before {
    content: '“';
    display: block;
    font-size: ${maskedTheme.fontSize['3xl']};
    line-height: ${maskedTheme.lineHeight.none};
    color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
    margin-bottom: ${maskedTheme.spacing['2xs']};
  }
`

export const TestimonialRating = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${maskedTheme.spacing['2xs']};
  font-size: ${maskedTheme.fontSize.sm};
  color: var(--mc-card-warning, ${maskedTheme.colors.baseYellow.base});
  letter-spacing: 1px;
`

export const TestimonialRatingValue = styled.span`
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: ${maskedTheme.fontWeight.medium};
  color: var(--mc-card-muted-fg, ${maskedTheme.colors.baseBlack.base});
  letter-spacing: normal;
`

export const TestimonialFooter = styled.footer`
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.sm};
  margin-top: auto;
`

export const TestimonialAvatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${maskedTheme.radius.full};
  overflow: hidden;
  flex-shrink: 0;
  background-color: var(--mc-card-icon-bg, ${maskedTheme.colors.baseBlue.light20});
  color: var(--mc-card-icon-fg, ${maskedTheme.colors.baseBlue.base});
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: ${maskedTheme.fontWeight.semibold};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const TestimonialAuthor = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

export const TestimonialAuthorName = styled.span`
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.semibold};
  line-height: ${maskedTheme.lineHeight.snug};
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
`

export const TestimonialAuthorRole = styled.span`
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: ${maskedTheme.fontWeight.normal};
  line-height: ${maskedTheme.lineHeight.normal};
  color: var(--mc-card-muted-fg, ${maskedTheme.colors.baseBlack.base});
`
