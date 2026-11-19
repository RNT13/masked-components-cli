import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedTestimonialsInternalProps } from './MaskedTestimonials.types'

/** Região rolável do carousel (foco por teclado) ou wrapper neutro. */
export const TestimonialsScroller = styled.div<MaskedTestimonialsInternalProps>`
  ${({ $variant }) =>
    $variant === 'carousel' &&
    css`
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-padding-inline: ${maskedTheme.spacing.md};
      padding-bottom: ${maskedTheme.spacing.sm};

      &:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 4px;
        border-radius: ${maskedTheme.radius.sm};
      }
    `}
`

export const TestimonialsList = styled.ul<MaskedTestimonialsInternalProps>`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${maskedTheme.spacing.lg};
  margin: 0;
  padding: 0;
  list-style: none;

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.mobile} {
    grid-template-columns: minmax(0, 1fr);
  }

  ${({ $variant }) =>
    $variant === 'carousel' &&
    css`
      display: flex;
      gap: ${maskedTheme.spacing.md};

      > li {
        flex: 0 0 min(24rem, 85%);
        scroll-snap-align: start;
      }
    `}

  ${({ $variant }) =>
    $variant === 'spotlight' &&
    css`
      > li:first-child {
        grid-column: 1 / -1;
        padding: ${maskedTheme.spacing['2xl']};
        text-align: center;
        align-items: center;
      }

      > li:first-child blockquote {
        font-size: ${maskedTheme.fontSize['2xl']};
      }
    `}
`

export const TestimonialItemEl = styled.li`
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: ${maskedTheme.spacing.lg};
  border: 1px solid var(--mc-testimonials-border, ${maskedTheme.colors.baseGray.light40});
  border-radius: ${maskedTheme.radius.lg};
`

export const TestimonialFigure = styled.figure`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${maskedTheme.spacing.md};
  margin: 0;
`

export const TestimonialQuote = styled.blockquote`
  position: relative;
  flex: 1;
  margin: 0;
  color: inherit;
  font-size: ${maskedTheme.fontSize.lg};
  line-height: ${maskedTheme.lineHeight.relaxed};

  &::before {
    content: '“';
    display: block;
    color: var(--mc-testimonials-accent, currentColor);
    font-size: ${maskedTheme.fontSize['4xl']};
    line-height: 1;
  }
`

export const TestimonialCaption = styled.figcaption`
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.sm};
`

export const TestimonialAvatar = styled.span`
  display: inline-flex;
  flex: none;
  width: 44px;
  height: 44px;
  overflow: hidden;
  border-radius: ${maskedTheme.radius.full};

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const TestimonialAuthor = styled.span`
  display: flex;
  flex-direction: column;
  font-weight: ${maskedTheme.fontWeight.semibold};
  line-height: ${maskedTheme.lineHeight.tight};

  small {
    font-weight: ${maskedTheme.fontWeight.normal};
    font-size: ${maskedTheme.fontSize.sm};
    opacity: 0.78;
  }
`
