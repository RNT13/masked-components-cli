import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedStatsInternalProps } from './MaskedStats.types'

export const StatsList = styled.dl<MaskedStatsInternalProps>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: ${maskedTheme.spacing.lg};
  margin: 0;
  color: var(--mc-stats-fg, inherit);

  ${({ $variant }) =>
    $variant === 'row' &&
    css`
      gap: ${maskedTheme.spacing.xl};
    `}

  ${({ $variant }) =>
    $variant === 'highlight' &&
    css`
      padding: ${maskedTheme.spacing.xl};
      border-radius: ${maskedTheme.radius.xl};
      background: var(--mc-stats-bg, transparent);
      border: 1px solid var(--mc-stats-border, transparent);

      ${media.mobile} {
        padding: ${maskedTheme.spacing.lg};
      }
    `}
`

export const StatItemEl = styled.div<MaskedStatsInternalProps>`
  /* número visualmente primeiro; no DOM o rótulo (dt) vem antes do valor (dd) */
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
  gap: ${maskedTheme.spacing.xs};
  min-width: 0;

  ${({ $variant }) =>
    $variant === 'grid' &&
    css`
      padding: ${maskedTheme.spacing.lg};
      border: 1px solid var(--mc-stats-border, ${maskedTheme.colors.baseGray.light40});
      border-radius: ${maskedTheme.radius.lg};
    `}

  ${({ $variant }) =>
    $variant === 'row' &&
    css`
      align-items: center;
      text-align: center;
    `}
`

export const StatLabel = styled.dt`
  color: var(--mc-stats-muted, inherit);
  font-size: ${maskedTheme.fontSize.md};
  line-height: ${maskedTheme.lineHeight.normal};
`

export const StatValue = styled.dd`
  margin: 0;
  color: var(--mc-stats-accent, inherit);
  font-size: ${maskedTheme.fontSize['4xl']};
  font-weight: ${maskedTheme.fontWeight.bold};
  line-height: ${maskedTheme.lineHeight.tight};

  ${media.mobile} {
    font-size: ${maskedTheme.fontSize['3xl']};
  }
`

export const StatTrendEl = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${maskedTheme.spacing['2xs']};
  margin-inline-start: ${maskedTheme.spacing.sm};
  color: var(--mc-stats-muted, inherit);
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.medium};
  vertical-align: middle;
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
