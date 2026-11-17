import styled, { css } from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'

export const PricingHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${maskedTheme.spacing.sm};
`

export const PricingName = styled.h3`
  margin: 0;
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${maskedTheme.fontWeight.semibold};
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.base});
`

export const PricingBadge = styled.span`
  padding: ${maskedTheme.spacing['2xs']} ${maskedTheme.spacing.xs};
  border-radius: ${maskedTheme.radius.full};
  background-color: var(--mc-card-accent, ${maskedTheme.colors.basePrimary.base});
  color: var(--mc-card-accent-fg, #ffffff);
  font-size: ${maskedTheme.fontSize['2xs']};
  font-weight: ${maskedTheme.fontWeight.semibold};
  white-space: nowrap;
`

export const PricingPriceRow = styled.div`
  position: relative;
  display: flex;
  align-items: baseline;
  gap: ${maskedTheme.spacing.xs};
  flex-wrap: wrap;
`

export const PricingPrice = styled.span`
  font-size: ${maskedTheme.fontSize['2xl']};
  font-weight: ${maskedTheme.fontWeight.bold};
  line-height: 1;
  color: var(--mc-card-price-fg, var(--mc-card-fg, ${maskedTheme.colors.baseBlack.base}));
`

export const PricingOriginalPrice = styled.span`
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${maskedTheme.fontWeight.normal};
  color: var(--mc-card-muted-fg, currentColor);
  text-decoration: line-through;
`

export const PricingPeriod = styled.span`
  font-size: ${maskedTheme.fontSize.sm};
  color: var(--mc-card-muted-fg, currentColor);
`

export const PricingDescription = styled.p`
  margin: 0;
  font-size: ${maskedTheme.fontSize.sm};
  line-height: ${maskedTheme.lineHeight.normal};
  color: var(--mc-card-muted-fg, currentColor);
`

export const PricingFeatureList = styled.ul`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing['2xs']};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const PricingFeatureItem = styled.li<{ $included?: boolean }>`
  display: flex;
  align-items: baseline;
  gap: ${maskedTheme.spacing.xs};
  font-size: ${maskedTheme.fontSize.sm};
  line-height: ${maskedTheme.lineHeight.normal};
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.base});

  > span[aria-hidden='true'] {
    flex-shrink: 0;
    font-weight: ${maskedTheme.fontWeight.bold};
    color: var(--mc-card-success, ${maskedTheme.colors.baseGreen.base});
  }

  ${({ $included }) =>
    !$included &&
    css`
      color: var(--mc-card-muted-fg, currentColor);

      > span[aria-hidden='true'] {
        color: var(--mc-card-danger, ${maskedTheme.colors.baseRed.base});
      }
    `}
`

export const PricingActionArea = styled.div`
  position: relative;
  z-index: 1;
  margin-top: auto;

  > button,
  > a {
    width: 100%;
  }
`

export const PricingFootnote = styled.p`
  margin: 0;
  font-size: ${maskedTheme.fontSize['2xs']};
  font-weight: ${maskedTheme.fontWeight.normal};
  line-height: ${maskedTheme.lineHeight.normal};
  text-align: center;
  color: var(--mc-card-muted-fg, currentColor);
`
