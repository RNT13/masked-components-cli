import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import styled from 'styled-components'
import { BaseCard } from '../../Base/BaseCard'
import { CardIconBadge } from '../../Base/BaseCard.styles'

export const StatCardContainer = styled(BaseCard)`
  min-width: 140px;
`
export const StatIcon = styled(CardIconBadge)``

export const StatValue = styled.strong<{ $valueTextColor?: string }>`
  font-size: ${maskedTheme.fontSize['2xl']};
  font-weight: 700;
  color: ${({ $valueTextColor }) => $valueTextColor ?? maskedTheme.colors.baseBlack.dark40};
  margin-top: ${maskedTheme.spacing.sm};
`

export const StatLabel = styled.span<{ $labelTextColor?: string }>`
  font-size: ${maskedTheme.fontSize.sm};
  color: ${({ $labelTextColor }) => $labelTextColor ?? maskedTheme.colors.baseBlack.dark20};
`
