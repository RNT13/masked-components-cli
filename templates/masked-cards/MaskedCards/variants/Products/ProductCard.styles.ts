import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import styled from 'styled-components'
import { BaseCard } from '../../Base/BaseCard'
import { CardStatus } from '../../MaskedCards.types'

const statusVar: Record<CardStatus, string> = {
  active: `var(--mc-card-success, ${maskedTheme.colors.baseGreen.base})`,
  inactive: `var(--mc-card-muted-fg, ${maskedTheme.colors.baseBlack.dark08})`,
  warning: `var(--mc-card-warning, ${maskedTheme.colors.baseYellow.base})`,
  error: `var(--mc-card-danger, ${maskedTheme.colors.baseRed.base})`
}

export const ProductCardContainer = styled(BaseCard)``

export const ProductImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: ${maskedTheme.radius.sm};
`

export const ProductImagePlaceholder = styled.div`
  width: 100%;
  height: 180px;
  border-radius: ${maskedTheme.radius.sm};
  background-color: var(--mc-card-placeholder-bg, ${maskedTheme.colors.baseBlue.light20});
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${maskedTheme.fontSize['3xl']};
  color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
`

export const ProductHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${maskedTheme.spacing.xs};
`

export const ProductTitle = styled.h3`
  font-size: ${maskedTheme.fontSize.md};
  font-weight: 700;
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
  margin: 0;
`

export const ProductBadge = styled.span`
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: 600;
  padding: 2px 8px;
  border-radius: ${maskedTheme.radius.xl};
  background-color: var(--mc-card-accent-soft, ${maskedTheme.colors.baseBlue.light20});
  color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
  white-space: nowrap;
`

export const ProductStatus = styled.span<{ $status: CardStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: 600;
  color: ${({ $status }) => statusVar[$status]};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: currentColor;
  }
`

export const ProductDescription = styled.p`
  font-size: ${maskedTheme.fontSize.sm};
  color: var(--mc-card-muted-fg, ${maskedTheme.colors.baseBlack.dark20});
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const ProductPriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${maskedTheme.spacing.xs};
  margin-top: auto;
`

export const ProductPrice = styled.strong`
  font-size: ${maskedTheme.fontSize.xl};
  font-weight: 700;
  color: var(--mc-card-accent-fg, ${maskedTheme.colors.baseBlue.dark20});
`

export const ProductOriginalPrice = styled.span`
  font-size: ${maskedTheme.fontSize.sm};
  color: var(--mc-card-faint-fg, ${maskedTheme.colors.baseBlack.dark08});
  text-decoration: line-through;
`

export const ProductActions = styled.div`
  display: flex;
  gap: ${maskedTheme.spacing.sm};
`
