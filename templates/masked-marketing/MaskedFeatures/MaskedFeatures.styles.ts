import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedFeaturesInternalProps } from './MaskedFeatures.types'

export const FeaturesList = styled.ul<MaskedFeaturesInternalProps>`
  display: grid;
  gap: ${maskedTheme.spacing.lg};
  margin: 0;
  padding: 0;
  list-style: none;
  grid-template-columns: repeat(${({ $cols }) => $cols}, minmax(0, 1fr));

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.mobile} {
    grid-template-columns: minmax(0, 1fr);
  }

  ${({ $variant }) =>
    $variant === 'split' &&
    css`
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: ${maskedTheme.spacing.xl} ${maskedTheme.spacing['2xl']};

      ${media.mobile} {
        grid-template-columns: minmax(0, 1fr);
      }
    `}

  ${({ $variant }) =>
    $variant === 'spotlight' &&
    css`
      > li:first-child {
        grid-column: 1 / -1;
        padding: ${maskedTheme.spacing.xl};
      }
    `}

  ${({ $variant }) =>
    $variant === 'timeline' &&
    css`
      display: flex;
      flex-direction: column;
      gap: ${maskedTheme.spacing.xl};
      max-width: 44rem;
      padding-inline-start: ${maskedTheme.spacing.xl};
      border-inline-start: 2px solid
        var(--mc-features-border, ${maskedTheme.colors.baseGray.light40});
    `}
`

export const FeatureItemEl = styled.li<Pick<MaskedFeaturesInternalProps, '$variant'>>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${maskedTheme.spacing.sm};
  min-width: 0;

  ${({ $variant }) =>
    ($variant === 'grid' || $variant === 'spotlight') &&
    css`
      padding: ${maskedTheme.spacing.lg};
      border: 1px solid var(--mc-features-border, ${maskedTheme.colors.baseGray.light40});
      border-radius: ${maskedTheme.radius.lg};
    `}

  ${({ $variant }) =>
    $variant === 'split' &&
    css`
      flex-direction: row;
      gap: ${maskedTheme.spacing.md};
    `}

  ${({ $variant }) =>
    $variant === 'timeline' &&
    css`
      &::before {
        content: '';
        position: absolute;
        inset-block-start: 6px;
        inset-inline-start: calc(-${maskedTheme.spacing.xl} - 7px);
        width: 12px;
        height: 12px;
        border-radius: ${maskedTheme.radius.full};
        background: var(--mc-features-accent, currentColor);
      }
    `}
`

export const FeatureIcon = styled.span`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: ${maskedTheme.radius.md};
  background: var(--mc-features-accent, currentColor);
  color: var(--mc-features-accent-fg, inherit);
  font-size: ${maskedTheme.fontSize.xl};
`

export const FeatureBody = styled.div`
  min-width: 0;
`

export const FeatureTitle = styled.h3`
  margin: 0;
  color: inherit;
  font-size: ${maskedTheme.fontSize.lg};
  font-weight: ${maskedTheme.fontWeight.semibold};
  line-height: ${maskedTheme.lineHeight.tight};
`

export const FeatureDescription = styled.p`
  margin: ${maskedTheme.spacing.xs} 0 0;
  color: inherit;
  font-size: ${maskedTheme.fontSize.md};
  line-height: ${maskedTheme.lineHeight.relaxed};
  opacity: 0.82;
`
