import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import styled from 'styled-components'
import { BaseCard } from '../../Base/BaseCard'
import { CardIconBadge } from '../../Base/BaseCard.styles'
import { CardTrend } from '../../MaskedCards.types'

export const MetricCardContainer = styled(BaseCard)`
  min-width: 160px;
`
export const MetricTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const MetricIcon = styled(CardIconBadge)``

export const MetricBadge = styled.span<{ $bg?: string; $color?: string }>`
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: 600;
  padding: 2px 10px;
  border-radius: ${maskedTheme.radius.xl};
  background-color: ${({ $bg }) =>
    $bg ?? `var(--mc-card-icon-bg, ${maskedTheme.colors.baseBlue.light20})`};
  color: ${({ $color }) => $color ?? `var(--mc-card-icon-fg, ${maskedTheme.colors.baseBlue.base})`};
`

export const MetricTrend = styled.span<{ $trend?: CardTrend }>`
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 2px;
  color: ${({ $trend }) => {
    if ($trend === 'up') return `var(--mc-card-success, ${maskedTheme.colors.baseGreen.base})`
    if ($trend === 'down') return `var(--mc-card-danger, ${maskedTheme.colors.baseRed.base})`
    return `var(--mc-card-neutral-trend, ${maskedTheme.colors.baseBlue.base})`
  }};
`

export const MetricRightIcon = styled.span`
  display: flex;
  align-items: center;
  font-size: ${maskedTheme.fontSize.lg};
`
export const MetricValue = styled.strong`
  font-size: ${maskedTheme.fontSize['2xl']};
  font-weight: 700;
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
`
export const MetricLabel = styled.span`
  font-size: ${maskedTheme.fontSize.sm};
  color: var(--mc-card-muted-fg, ${maskedTheme.colors.baseBlack.dark20});
`
