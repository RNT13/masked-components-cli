import styled from 'styled-components'
import { BaseCard } from '../../Base/BaseCard'
import { CardIconBadge } from '../../Base/BaseCard.styles'
import { CardTrend } from '../../MaskedCards.types'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'

export const CompareCardContainer = styled(BaseCard)`
  min-width: 180px;
`
export const CompareIcon = styled(CardIconBadge)``

export const CompareValue = styled.strong`
  font-size: ${maskedTheme.fontSize['2xl']};
  font-weight: 700;
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
  margin-top: ${maskedTheme.spacing.sm};
`
export const CompareLabel = styled.span`
  font-size: ${maskedTheme.fontSize.sm};
  color: var(--mc-card-muted-fg, ${maskedTheme.colors.baseBlack.dark20});
`
export const CompareTrend = styled.span<{ $trend?: CardTrend }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: 600;
  margin-top: ${maskedTheme.spacing.xs};
  color: ${({ $trend }) => {
    if ($trend === 'up') return `var(--mc-card-success, ${maskedTheme.colors.baseGreen.base})`
    if ($trend === 'down') return `var(--mc-card-danger, ${maskedTheme.colors.baseRed.base})`
    return `var(--mc-card-neutral-trend, ${maskedTheme.colors.baseBlue.base})`
  }};
`
