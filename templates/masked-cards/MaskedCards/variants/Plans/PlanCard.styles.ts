import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import styled, { css } from 'styled-components'
import { BaseCard } from '../../Base/BaseCard'

export const PlanCardContainer = styled(BaseCard)<{ $active?: boolean }>`
  ${({ $active }) =>
    $active
      ? css`
          background-image: var(
            --mc-card-plan-active-bg,
            linear-gradient(
              160deg,
              ${maskedTheme.colors.accentX.base},
              ${maskedTheme.colors.baseBlue.dark20}
            )
          );
          border: 2px solid var(--mc-card-plan-active-border, ${maskedTheme.colors.accentX.base});
        `
      : css`
          background-image: var(
            --mc-card-plan-inactive-bg,
            linear-gradient(
              160deg,
              ${maskedTheme.colors.baseBlack.light40},
              ${maskedTheme.colors.baseBlack.dark}
            )
          );
          border: 2px solid
            var(--mc-card-plan-inactive-border, ${maskedTheme.colors.baseBlack.dark});
        `}
`
export const PlanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--mc-card-fg, ${maskedTheme.colors.textColor.light});
`

export const PlanStatus = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.light});
`

export const PlanRenewal = styled.span`
  font-size: 12px;
  color: var(--mc-card-muted-fg, ${maskedTheme.colors.textColor.dark});
`

export const PlanAction = styled.div``
