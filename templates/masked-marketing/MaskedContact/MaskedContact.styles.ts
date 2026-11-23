import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedContactInternalProps } from './MaskedContact.types'

export const ContactLayout = styled.div<MaskedContactInternalProps>`
  display: grid;
  gap: ${maskedTheme.spacing.xl};
  min-width: 0;

  ${({ $variant }) =>
    $variant === 'split' &&
    css`
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-items: start;

      ${media.tablet} {
        grid-template-columns: minmax(0, 1fr);
      }
    `}

  ${({ $variant }) =>
    ($variant === 'card' || $variant === 'minimal') &&
    css`
      max-width: 36rem;
    `}
`

export const ContactInfo = styled.div`
  min-width: 0;
  font-size: ${maskedTheme.fontSize.md};
  line-height: ${maskedTheme.lineHeight.relaxed};
`

export const ContactForm = styled.form<MaskedContactInternalProps>`
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.md};
  min-width: 0;

  ${({ $variant }) =>
    $variant === 'card' &&
    css`
      padding: ${maskedTheme.spacing.xl};
      border: 1px solid var(--mc-contact-border, ${maskedTheme.colors.baseGray.light40});
      border-radius: ${maskedTheme.radius.lg};

      ${media.mobile} {
        padding: ${maskedTheme.spacing.lg};
      }
    `}
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.xs};
`

export const FieldLabel = styled.label`
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${maskedTheme.fontWeight.medium};
`

const control = css`
  box-sizing: border-box;
  width: 100%;
  padding: ${maskedTheme.spacing.sm} ${maskedTheme.spacing.md};
  border: 1px solid color-mix(in srgb, currentColor 35%, transparent);
  border-radius: ${maskedTheme.radius.md};
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: ${maskedTheme.fontSize.md};

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
  }
`

export const TextInput = styled.input`
  ${control}
  min-height: 44px;
`

export const TextArea = styled.textarea`
  ${control}
  min-height: 8rem;
  resize: vertical;
`

export const SubmitButton = styled.button`
  align-self: flex-start;
  min-height: 44px;
  padding: ${maskedTheme.spacing.xs} ${maskedTheme.spacing.xl};
  border: 0;
  border-radius: ${maskedTheme.radius.md};
  background: var(--mc-contact-accent, currentColor);
  color: var(--mc-contact-accent-fg, inherit);
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

  ${media.mobile} {
    align-self: stretch;
  }
`

export const Status = styled.p`
  margin: 0;
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.medium};
`
