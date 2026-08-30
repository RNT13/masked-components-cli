import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import styled from 'styled-components'
import { BaseCard } from '../../Base/BaseCard'
import { CardIconBadge } from '../../Base/BaseCard.styles'
import { CardTrend } from '../../MaskedCards.types'

export const CompareCardContainer = styled(BaseCard)`
  min-width: 180px;
`
export const CompareIcon = styled(CardIconBadge)``

export const CompareValue = styled.strong`
  font-size: ${maskedTheme.fontSize['2xl']};
  font-weight: 700;
  color: ${maskedTheme.colors.baseBlack.dark40};
  margin-top: ${maskedTheme.spacing.sm};
`

export const CompareLabel = styled.span`
  font-size: ${maskedTheme.fontSize.sm};
  color: ${maskedTheme.colors.baseBlack.dark20};
`

export const CompareTrend = styled.span<{ $trend?: CardTrend }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: 600;
  margin-top: ${maskedTheme.spacing.xs};
  color: ${({ $trend }) => {
    if ($trend === 'up') return maskedTheme.colors.baseGreen.base
    if ($trend === 'down') return maskedTheme.colors.baseRed.base
    return maskedTheme.colors.baseBlue.base
  }};
`
