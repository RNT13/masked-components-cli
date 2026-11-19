import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedEmptyStateInternalProps } from './MaskedEmptyState.types'

export const MaskedEmptyStateRoot = styled.div<MaskedEmptyStateInternalProps>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${maskedTheme.spacing.md};
  width: 100%;
  padding: ${maskedTheme.spacing['2xl']} ${maskedTheme.spacing.lg};
  text-align: center;

  ${media.mobile} {
    padding: ${maskedTheme.spacing.xl} ${maskedTheme.spacing.md};
  }

  ${({ $variant }) =>
    $variant === 'compact' &&
    css`
      flex-direction: row;
      align-items: center;
      gap: ${maskedTheme.spacing.md};
      padding: ${maskedTheme.spacing.md};
      text-align: start;
    `}

  ${({ $variant }) =>
    $variant === 'error' &&
    css`
      border: 1px dashed var(--mc-empty-state-border, ${maskedTheme.colors.baseGray.light40});
      border-radius: ${maskedTheme.radius.lg};
    `}
`

export const EmptyStateIcon = styled.span`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: ${maskedTheme.radius.full};
  background: var(--mc-empty-state-accent, ${maskedTheme.colors.baseGray.light40});
  color: var(--mc-empty-state-accent-fg, inherit);
  font-size: ${maskedTheme.fontSize['3xl']};
`

export const EmptyStateBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.xs};
  min-width: 0;
  max-width: 28rem;
`

export const EmptyStateTitle = styled.h3`
  margin: 0;
  color: inherit;
  font-size: ${maskedTheme.fontSize.xl};
  font-weight: ${maskedTheme.fontWeight.semibold};
  line-height: ${maskedTheme.lineHeight.tight};
`

export const EmptyStateDescription = styled.p`
  margin: 0;
  color: var(--mc-empty-state-muted, inherit);
  font-size: ${maskedTheme.fontSize.md};
  line-height: ${maskedTheme.lineHeight.relaxed};
`

export const EmptyStateAction = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${maskedTheme.spacing.sm};
  margin-top: ${maskedTheme.spacing.sm};
`
