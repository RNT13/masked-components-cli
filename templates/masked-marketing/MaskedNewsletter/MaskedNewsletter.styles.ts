import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedNewsletterInternalProps } from './MaskedNewsletter.types'

export const MaskedNewsletterRoot = styled.section<MaskedNewsletterInternalProps>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.md};
  width: 100%;
  color: var(--mc-newsletter-fg, inherit);

  ${({ $variant }) =>
    $variant === 'card' &&
    css`
      max-width: 36rem;
      padding: ${maskedTheme.spacing.xl};
      border: 1px solid var(--mc-newsletter-border, ${maskedTheme.colors.baseGray.light40});
      border-radius: ${maskedTheme.radius.lg};
    `}

  ${({ $variant }) =>
    $variant === 'band' &&
    css`
      align-items: center;
      padding: ${maskedTheme.spacing['2xl']} ${maskedTheme.spacing.lg};
      background: var(--mc-newsletter-bg, transparent);
      text-align: center;

      ${media.mobile} {
        padding-inline: ${maskedTheme.spacing.md};
      }
    `}
`

export const NewsletterTitle = styled.h2`
  margin: 0;
  color: inherit;
  font-size: ${maskedTheme.fontSize['2xl']};
  font-weight: ${maskedTheme.fontWeight.bold};
  line-height: ${maskedTheme.lineHeight.tight};
`

export const NewsletterDescription = styled.p`
  margin: 0;
  color: var(--mc-newsletter-muted, inherit);
  font-size: ${maskedTheme.fontSize.md};
  line-height: ${maskedTheme.lineHeight.relaxed};
`

export const NewsletterForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: ${maskedTheme.spacing.sm};
  width: 100%;
  max-width: 32rem;

  ${media.mobile} {
    flex-direction: column;
  }
`

/** Rótulo visualmente oculto, lido por leitores de tela. */
export const VisuallyHidden = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

export const NewsletterInput = styled.input`
  flex: 1;
  min-width: 12rem;
  min-height: 44px;
  padding: ${maskedTheme.spacing.xs} ${maskedTheme.spacing.md};
  border: 1px solid color-mix(in srgb, currentColor 35%, transparent);
  border-radius: ${maskedTheme.radius.md};
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: ${maskedTheme.fontSize.md};

  &::placeholder {
    color: inherit;
    opacity: 0.6;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
  }
`

export const NewsletterButton = styled.button`
  min-height: 44px;
  padding: ${maskedTheme.spacing.xs} ${maskedTheme.spacing.lg};
  border: 0;
  border-radius: ${maskedTheme.radius.md};
  background: var(--mc-newsletter-accent, currentColor);
  color: var(--mc-newsletter-accent-fg, inherit);
  font: inherit;
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${maskedTheme.fontWeight.semibold};
  cursor: pointer;

  &:hover:not(:disabled) {
    filter: brightness(1.08);
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: progress;
  }
`

export const NewsletterStatus = styled.p<{ $error?: boolean }>`
  margin: 0;
  min-height: 1.25em;
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.medium};
  color: inherit;
`
