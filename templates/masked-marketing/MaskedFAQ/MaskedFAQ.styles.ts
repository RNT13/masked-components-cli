import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedFAQInternalProps } from './MaskedFAQ.types'

export const FAQList = styled.div<MaskedFAQInternalProps>`
  display: flex;
  flex-direction: column;
  max-width: 48rem;
  margin-inline: auto;

  ${({ $variant }) =>
    $variant === 'two-columns' &&
    css`
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-items: start;
      gap: 0 ${maskedTheme.spacing['2xl']};
      max-width: none;

      ${media.tablet} {
        grid-template-columns: minmax(0, 1fr);
      }
    `}

  ${({ $variant }) =>
    $variant === 'boxed' &&
    css`
      gap: ${maskedTheme.spacing.sm};
    `}
`

export const FAQDetails = styled.details<MaskedFAQInternalProps>`
  border-bottom: 1px solid var(--mc-faq-border, ${maskedTheme.colors.baseGray.light40});

  ${({ $variant }) =>
    $variant === 'boxed' &&
    css`
      border: 1px solid var(--mc-faq-border, ${maskedTheme.colors.baseGray.light40});
      border-radius: ${maskedTheme.radius.lg};
    `}
`

export const FAQSummary = styled.summary<MaskedFAQInternalProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${maskedTheme.spacing.md};
  min-height: 56px;
  padding: ${maskedTheme.spacing.md}
    ${({ $variant }) => ($variant === 'boxed' ? maskedTheme.spacing.lg : '0')};
  font-size: ${maskedTheme.fontSize.lg};
  font-weight: ${maskedTheme.fontWeight.semibold};
  line-height: ${maskedTheme.lineHeight.snug};
  list-style: none;
  cursor: pointer;

  &::-webkit-details-marker {
    display: none;
  }

  /* indicador: + que vira − quando aberto (acompanha o estado nativo) */
  &::after {
    content: '+';
    flex: none;
    color: var(--mc-faq-accent, currentColor);
    font-size: ${maskedTheme.fontSize['2xl']};
    font-weight: ${maskedTheme.fontWeight.normal};
    line-height: 1;
  }

  details[open] > &::after {
    content: '−';
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
    border-radius: ${maskedTheme.radius.sm};
  }
`

export const FAQAnswer = styled.div<MaskedFAQInternalProps>`
  padding: 0 ${({ $variant }) => ($variant === 'boxed' ? maskedTheme.spacing.lg : '0')}
    ${maskedTheme.spacing.md};
  font-size: ${maskedTheme.fontSize.md};
  line-height: ${maskedTheme.lineHeight.relaxed};
  opacity: 0.88;
`
