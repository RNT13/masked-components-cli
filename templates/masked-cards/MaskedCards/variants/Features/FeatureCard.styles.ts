import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import styled, { css } from 'styled-components'
import { BaseCard } from '../../Base/BaseCard'
import { CardIconBadge } from '../../Base/BaseCard.styles'

export const FeatureCardContainer = styled(BaseCard)<{ $highlight?: boolean }>`
  ${({ $highlight }) =>
    $highlight &&
    css`
      border-color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
      background-image: var(
        --mc-card-accent-soft,
        linear-gradient(
          160deg,
          ${maskedTheme.colors.baseBlue.light30},
          ${maskedTheme.colors.baseBlue.light40}
        )
      );
      box-shadow: var(--mc-card-shadow-hover, ${maskedTheme.boxShadow.md()});
    `}
`
export const FeatureIcon = styled(CardIconBadge)``
export const FeatureTitle = styled.h3`
  font-size: ${maskedTheme.fontSize.md};
  font-weight: 700;
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
  margin: 0;
`
export const FeatureDescription = styled.p`
  font-size: ${maskedTheme.fontSize.sm};
  color: var(--mc-card-muted-fg, ${maskedTheme.colors.baseBlack.dark20});
  margin: 0;
  flex: 1;
`
export const FeatureAction = styled.div`
  margin-top: auto;
`
