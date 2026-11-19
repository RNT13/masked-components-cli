import styled, { css } from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedAccordionInternalProps } from './MaskedAccordion.types'

export const MaskedAccordionRoot = styled.div<Pick<MaskedAccordionInternalProps, '$variant'>>`
  display: flex;
  flex-direction: column;

  ${({ $variant }) =>
    $variant === 'separated' &&
    css`
      gap: ${maskedTheme.spacing.sm};
    `}

  ${({ $variant }) =>
    $variant === 'boxed' &&
    css`
      border: 1px solid var(--mc-accordion-border, ${maskedTheme.colors.baseGray.light40});
      border-radius: ${maskedTheme.radius.lg};
      overflow: hidden;
    `}
`

export const AccordionItemEl = styled.div<Pick<MaskedAccordionInternalProps, '$variant'>>`
  border-bottom: 1px solid var(--mc-accordion-border, ${maskedTheme.colors.baseGray.light40});

  ${({ $variant }) =>
    $variant === 'boxed' &&
    css`
      &:last-child {
        border-bottom: 0;
      }
    `}

  ${({ $variant }) =>
    $variant === 'separated' &&
    css`
      border: 1px solid var(--mc-accordion-border, ${maskedTheme.colors.baseGray.light40});
      border-radius: ${maskedTheme.radius.lg};
    `}
`

export const AccordionHeading = styled.h3`
  margin: 0;
  font-size: inherit;
`

export const AccordionTrigger = styled.button<MaskedAccordionInternalProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${maskedTheme.spacing.md};
  width: 100%;
  min-height: 56px;
  padding: ${maskedTheme.spacing.md}
    ${({ $variant }) => ($variant === 'default' ? '0' : maskedTheme.spacing.lg)};
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: ${maskedTheme.fontSize.lg};
  font-weight: ${maskedTheme.fontWeight.semibold};
  text-align: start;
  cursor: pointer;

  &::after {
    content: '';
    flex: none;
    width: 10px;
    height: 10px;
    margin-inline-end: 4px;
    border-right: 2px solid var(--mc-accordion-accent, currentColor);
    border-bottom: 2px solid var(--mc-accordion-accent, currentColor);
    transform: ${({ $open }) => ($open ? 'rotate(-135deg)' : 'rotate(45deg)')};
    transition: transform 0.2s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      transition: none;
    }
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -2px;
    border-radius: ${maskedTheme.radius.sm};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const AccordionPanel = styled.div<Pick<MaskedAccordionInternalProps, '$variant'>>`
  padding: 0 ${({ $variant }) => ($variant === 'default' ? '0' : maskedTheme.spacing.lg)}
    ${maskedTheme.spacing.md};
  font-size: ${maskedTheme.fontSize.md};
  line-height: ${maskedTheme.lineHeight.relaxed};
`
