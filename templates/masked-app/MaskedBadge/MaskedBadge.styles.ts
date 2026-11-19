import styled, { css } from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedBadgeInternalProps } from './MaskedBadge.types'

export const MaskedBadgeRoot = styled.span<MaskedBadgeInternalProps>`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: ${maskedTheme.spacing.xs};
  max-width: 100%;
  border: 1px solid var(--mc-badge-border, transparent);
  border-radius: ${maskedTheme.radius.full};
  background: var(--mc-badge-bg, transparent);
  color: var(--mc-badge-fg, inherit);
  font-weight: ${maskedTheme.fontWeight.medium};
  line-height: ${maskedTheme.lineHeight.tight};
  white-space: nowrap;

  ${({ $size }) =>
    $size === 'sm'
      ? css`
          padding: ${maskedTheme.spacing['2xs']} ${maskedTheme.spacing.sm};
          font-size: ${maskedTheme.fontSize.xs};
        `
      : css`
          padding: ${maskedTheme.spacing.xs} ${maskedTheme.spacing.md};
          font-size: ${maskedTheme.fontSize.sm};
        `}

  ${({ $variant }) =>
    $variant === 'dot' &&
    css`
      padding-inline-start: 0;
      border-color: transparent;

      &::before {
        content: '';
        flex: none;
        width: 8px;
        height: 8px;
        border-radius: ${maskedTheme.radius.full};
        background: var(--mc-badge-dot, currentColor);
      }
    `}
`
