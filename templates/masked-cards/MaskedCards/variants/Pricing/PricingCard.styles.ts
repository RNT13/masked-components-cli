import styled, { css } from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'

export const PricingHeader = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing['2xs']};
`

export const PricingBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  padding: ${maskedTheme.spacing['2xs']} ${maskedTheme.spacing.xs};
  border-radius: ${maskedTheme.radius.sm};
  font-size: ${maskedTheme.fontSize['2xs']};
  font-weight: ${maskedTheme.fontWeight.semibold};
  line-height: ${maskedTheme.lineHeight.none};
  background-color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
  color: var(--mc-card-accent-fg, #ffffff);
`

export const PricingName = styled.h3`
  margin: 0;
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${maskedTheme.fontWeight.semibold};
  line-height: ${maskedTheme.lineHeight.snug};
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
`

export const PricingDescription = styled.p`
  margin: 0;
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: ${maskedTheme.fontWeight.normal};
  line-height: ${maskedTheme.lineHeight.normal};
  color: var(--mc-card-muted-fg, ${maskedTheme.colors.baseBlack.base});
`

export const PricingPriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${maskedTheme.spacing.xs};
  flex-wrap: wrap;
`

export const PricingPrice = styled.span`
  font-size: ${maskedTheme.fontSize['3xl']};
  font-weight: ${maskedTheme.fontWeight.bold};
  line-height: ${maskedTheme.lineHeight.tight};
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
`

export const PricingPeriod = styled.span`
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.normal};
  color: var(--mc-card-muted-fg, ${maskedTheme.colors.baseBlack.base});
`

export const PricingOriginalPrice = styled.span`
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.normal};
  color: var(--mc-card-muted-fg, ${maskedTheme.colors.baseBlack.base});
  text-decoration: line-through;
`

export const PricingFeatureList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.xs};
`

export const PricingFeatureItem = styled.li<{ $included: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${maskedTheme.spacing.xs};
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.normal};
  line-height: ${maskedTheme.lineHeight.normal};
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});

  &::before {
    flex-shrink: 0;
    font-weight: ${maskedTheme.fontWeight.bold};
    ${({ $included }) =>
      $included
        ? css`
            content: '✓';
            color: var(--mc-card-success, ${maskedTheme.colors.baseGreen.base});
          `
        : css`
            content: '✕';
            color: var(--mc-card-muted-fg, ${maskedTheme.colors.baseBlack.light40});
          `}
  }

  ${({ $included }) =>
    !$included &&
    css`
      color: var(--mc-card-muted-fg, ${maskedTheme.colors.baseBlack.base});
    `}
`

export const PricingActionArea = styled.div`
  position: relative;
  z-index: 1;
  margin-top: auto;

  /* CTA ocupa a largura toda quando é um único botão/link */
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
  color: var(--mc-card-muted-fg, ${maskedTheme.colors.baseBlack.base});
`
