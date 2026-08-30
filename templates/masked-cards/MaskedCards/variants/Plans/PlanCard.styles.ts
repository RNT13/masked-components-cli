import { maskedTheme, neonTheme } from '@/styles/MaskedThemes/MaskedThemes'
import styled, { css } from 'styled-components'
import { BaseCard } from '../../Base/BaseCard'

export const PlanCardContainer = styled(BaseCard)<{ $active?: boolean }>`
  ${({ $active }) =>
    $active
      ? css`
          background-image: linear-gradient(160deg, ${neonTheme.colors.neonBlue?.base}, ${maskedTheme.colors.baseBlue.dark20});
          border: 2px solid ${neonTheme.colors.neonBlue?.base};
        `
      : css`
          background-image: linear-gradient(160deg, ${maskedTheme.colors.baseBlack.light40}, ${maskedTheme.colors.baseBlack.dark});
          border: 2px solid ${maskedTheme.colors.baseBlack.dark};
        `}
`

export const PlanHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.xs};
  font-size: ${maskedTheme.fontSize.lg};
  font-weight: 700;
  color: ${maskedTheme.colors.baseBlue.dark30};
`

export const PlanStatus = styled.span`
  font-size: ${maskedTheme.fontSize.sm};
  color: ${maskedTheme.colors.baseBlue.dark20};
`

export const PlanRenewal = styled.span`
  font-size: ${maskedTheme.fontSize.xs};
  color: ${maskedTheme.colors.baseBlue.light20};
`

export const PlanAction = styled.div``
