import styled, { css } from 'styled-components'
import { BaseCard } from '../../Base/BaseCard'

export const PlanCardContainer = styled(BaseCard)<{ $active?: boolean }>`
  ${({ $active, theme }) =>
    $active
      ? css`
          background-image: var(
            --mc-card-plan-active-bg,
            linear-gradient(160deg, ${theme.colors.accentColor}, ${theme.colors.baseBlue.dark20})
          );
          border: 2px solid var(--mc-card-plan-active-border, ${theme.colors.accentColor});
        `
      : css`
          background-image: var(
            --mc-card-plan-inactive-bg,
            linear-gradient(
              160deg,
              ${theme.colors.baseBlack.light40},
              ${theme.colors.baseBlack.dark}
            )
          );
          border: 2px solid var(--mc-card-plan-inactive-border, ${theme.colors.baseBlack.dark});
        `}
`

export const PlanHeader = styled.div`  
  display: flex;  
  justify-content: space-between;  
  align-items: center;  
  color: var(  
    --mc-card-fg,  
    ${({ theme }) => theme.colors.textColor ?? theme.colors.basePrimary.base}  
  );  
`  
  
export const PlanStatus = styled.span`  
  font-size: 12px;  
  font-weight: 600;  
  color: var(--mc-card-accent, ${({ theme }) => theme.colors.baseBlue.light20});  
`  
  
export const PlanRenewal = styled.span`  
  font-size: 12px;  
  color: var(  
    --mc-card-muted-fg,  
    ${({ theme }) => theme.colors.textMuted ?? theme.colors.baseGray.base}  
  );  
`  
  
export const PlanAction = styled.div``
