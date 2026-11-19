import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedStepperInternalProps } from './MaskedStepper.types'

export const MaskedStepperRoot = styled.div`
  min-width: 0;
`

export const StepList = styled.ol<Pick<MaskedStepperInternalProps, '$variant'>>`
  display: flex;
  gap: ${maskedTheme.spacing.md};
  margin: 0;
  padding: 0;
  list-style: none;

  ${({ $variant }) =>
    $variant === 'horizontal' &&
    css`
      align-items: flex-start;

      ${media.mobile} {
        flex-direction: column;
      }
    `}

  ${({ $variant }) =>
    $variant === 'vertical' &&
    css`
      flex-direction: column;
      gap: ${maskedTheme.spacing.lg};
    `}

  ${({ $variant }) =>
    $variant === 'dots' &&
    css`
      justify-content: center;
      gap: ${maskedTheme.spacing.sm};
    `}
`

export const StepItemEl = styled.li<MaskedStepperInternalProps>`
  display: flex;
  flex: ${({ $variant }) => ($variant === 'horizontal' ? 1 : 'none')};
  align-items: flex-start;
  gap: ${maskedTheme.spacing.sm};
  min-width: 0;
`

export const StepIndicator = styled.span<MaskedStepperInternalProps>`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  border: 2px solid
    ${({ $status }) => ($status === 'upcoming' ? 'var(--mc-stepper-border, currentColor)' : 'var(--mc-stepper-accent, currentColor)')};
  border-radius: ${maskedTheme.radius.full};
  background: ${({ $status }) => ($status === 'complete' ? 'var(--mc-stepper-accent, currentColor)' : 'transparent')};
  color: ${({ $status }) => ($status === 'complete' ? 'var(--mc-stepper-accent-fg, inherit)' : 'inherit')};
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.semibold};

  ${({ $variant, $status }) =>
    $variant === 'dots' &&
    css`
      width: 12px;
      height: 12px;
      border-width: 0;
      background: ${$status === 'upcoming' ? 'var(--mc-stepper-border, currentColor)' : 'var(--mc-stepper-accent, currentColor)'};
    `}
`

export const StepText = styled.span`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

export const StepLabel = styled.span<Pick<MaskedStepperInternalProps, '$status'>>`
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${({ $status }) => ($status === 'current' ? maskedTheme.fontWeight.semibold : maskedTheme.fontWeight.medium)};
`

export const StepDescription = styled.span`
  color: var(--mc-stepper-muted, inherit);
  font-size: ${maskedTheme.fontSize.sm};
`

export const StepButton = styled.button`
  display: inline-flex;
  align-items: flex-start;
  gap: ${maskedTheme.spacing.sm};
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
    border-radius: ${maskedTheme.radius.sm};
  }
`

export const ProgressTrack = styled.div`
  height: 8px;
  overflow: hidden;
  border-radius: ${maskedTheme.radius.full};
  background: var(--mc-stepper-border, ${maskedTheme.colors.baseGray.light40});
`

export const ProgressFill = styled.div`
  height: 100%;
  border-radius: inherit;
  background: var(--mc-stepper-accent, currentColor);
  transition: width 0.25s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const ProgressText = styled.p`
  margin: 0 0 ${maskedTheme.spacing.sm};
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${maskedTheme.fontWeight.medium};
`

export const SrOnly = styled.span`
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
