import styled, { css } from 'styled-components'
import { BaseCard } from '../../Base/BaseCard'

/* os dois estados são gradientes escuros: texto branco sempre legível */
export const PlanCardContainer = styled(BaseCard)<{ $active?: boolean }>`
  color: var(--mc-card-plan-fg, #ffffff);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);

  ${({ $active, theme }) =>
    $active
      ? css`
          background-image: var(
            --mc-card-plan-active-bg,
            linear-gradient(160deg, ${theme.colors?.accentColor ?? theme.colors.baseBlue.base}, ${theme.colors.baseBlue.dark20})
          );
          border: 2px solid var(--mc-card-plan-active-border, ${theme.colors?.accentColor ?? theme.colors.baseBlue.base});
        `
      : css`
          background-image: var(
            --mc-card-plan-inactive-bg,
            linear-gradient(160deg, ${theme.colors.baseBlack.light20}, ${theme.colors.baseBlack.dark})
          );
          border: 2px solid var(--mc-card-plan-inactive-border, ${theme.colors.baseBlack.light20});
        `}
`

export const PlanHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const PlanName = styled.span`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 700;
`

export const PlanStatus = styled.span`
  align-self: flex-start;
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 12px;
  font-weight: 700;
`

export const PlanDescription = styled.p`
  margin: 0;
  line-height: 1.5;
  opacity: 0.92;
`

export const PlanRenewal = styled.span`
  font-size: 12px;
  opacity: 0.8;
`

/* margin-top:auto empurra a ação para o fim do card, qualquer que seja a altura */
export const PlanAction = styled.div`
  display: flex;
  justify-content: center;
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.md};
`
