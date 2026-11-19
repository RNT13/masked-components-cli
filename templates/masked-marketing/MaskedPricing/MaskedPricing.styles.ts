import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedPricingInternalProps } from './MaskedPricing.types'

export const BillingToggle = styled.div`
  display: inline-flex;
  gap: ${maskedTheme.spacing['2xs']};
  margin-bottom: ${maskedTheme.spacing.xl};
  padding: ${maskedTheme.spacing['2xs']};
  border: 1px solid var(--mc-pricing-border, ${maskedTheme.colors.baseGray.light40});
  border-radius: ${maskedTheme.radius.full};
`

export const BillingButton = styled.button<MaskedPricingInternalProps>`
  display: inline-flex;
  align-items: center;
  gap: ${maskedTheme.spacing.xs};
  min-height: 40px;
  padding: ${maskedTheme.spacing.xs} ${maskedTheme.spacing.lg};
  border: 0;
  border-radius: ${maskedTheme.radius.full};
  background: ${({ $active }) => ($active ? 'var(--mc-pricing-accent, currentColor)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--mc-pricing-accent-fg, inherit)' : 'inherit')};
  font: inherit;
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${maskedTheme.fontWeight.semibold};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`

export const PlansList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: ${maskedTheme.spacing.lg};
  align-items: stretch;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const PlanCard = styled.article<MaskedPricingInternalProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.md};
  height: 100%;
  padding: ${maskedTheme.spacing.xl};
  border: ${({ $highlighted }) => ($highlighted ? '2px' : '1px')} solid
    ${({ $highlighted }) =>
      $highlighted
        ? 'var(--mc-pricing-accent, currentColor)'
        : `var(--mc-pricing-border, ${maskedTheme.colors.baseGray.light40})`};
  border-radius: ${maskedTheme.radius.lg};

  ${media.mobile} {
    padding: ${maskedTheme.spacing.lg};
  }
`

export const PlanBadge = styled.span`
  align-self: flex-start;
  padding: ${maskedTheme.spacing['2xs']} ${maskedTheme.spacing.sm};
  border-radius: ${maskedTheme.radius.full};
  background: var(--mc-pricing-accent, currentColor);
  color: var(--mc-pricing-accent-fg, inherit);
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: ${maskedTheme.fontWeight.semibold};
`

export const PlanName = styled.h3`
  margin: 0;
  color: inherit;
  font-size: ${maskedTheme.fontSize.xl};
  font-weight: ${maskedTheme.fontWeight.semibold};
`

export const PlanPrice = styled.p`
  display: flex;
  align-items: baseline;
  gap: ${maskedTheme.spacing.xs};
  margin: 0;
  font-size: ${maskedTheme.fontSize['4xl']};
  font-weight: ${maskedTheme.fontWeight.bold};
  line-height: ${maskedTheme.lineHeight.tight};

  small {
    font-size: ${maskedTheme.fontSize.md};
    font-weight: ${maskedTheme.fontWeight.normal};
    opacity: 0.78;
  }
`

export const PlanDescription = styled.p`
  margin: 0;
  font-size: ${maskedTheme.fontSize.md};
  line-height: ${maskedTheme.lineHeight.relaxed};
  opacity: 0.85;
`

export const FeatureList = styled.ul`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${maskedTheme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    gap: ${maskedTheme.spacing.sm};
    font-size: ${maskedTheme.fontSize.md};
  }
`

export const Check = styled.span`
  flex: none;
  color: var(--mc-pricing-accent, currentColor);
  font-weight: ${maskedTheme.fontWeight.bold};
`

export const PlanCta = styled.a<MaskedPricingInternalProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: ${maskedTheme.spacing.xs} ${maskedTheme.spacing.lg};
  border: 1px solid var(--mc-pricing-accent, currentColor);
  border-radius: ${maskedTheme.radius.md};
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${maskedTheme.fontWeight.semibold};
  text-decoration: none;
  color: inherit;

  ${({ $highlighted }) =>
    $highlighted &&
    css`
      background: var(--mc-pricing-accent, currentColor);
      color: var(--mc-pricing-accent-fg, inherit);
    `}

  &:hover {
    filter: brightness(1.08);
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`

/* ------------------------------ variant table ------------------------------ */

export const TableScroller = styled.div`
  overflow-x: auto;

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
    border-radius: ${maskedTheme.radius.sm};
  }
`

export const PlansTable = styled.table`
  width: 100%;
  min-width: 36rem;
  border-collapse: collapse;
  font-size: ${maskedTheme.fontSize.md};

  th,
  td {
    padding: ${maskedTheme.spacing.md};
    border-bottom: 1px solid var(--mc-pricing-border, ${maskedTheme.colors.baseGray.light40});
    text-align: center;
    vertical-align: middle;
  }

  th[scope='row'] {
    text-align: start;
    font-weight: ${maskedTheme.fontWeight.normal};
  }

  thead th {
    vertical-align: bottom;
  }
`

export const HighlightedCell = styled.span<MaskedPricingInternalProps>`
  display: inline-block;
  ${({ $highlighted }) =>
    $highlighted &&
    css`
      color: var(--mc-pricing-accent, inherit);
    `}
`

export const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`
