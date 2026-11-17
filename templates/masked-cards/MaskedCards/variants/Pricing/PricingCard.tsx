'use client'

import { BaseCard } from '../../Base/BaseCard'
import { CardVariantMap, PriceFormat } from '../../MaskedCards.types'
import {
  PricingBadge,
  PricingDescription,
  PricingFeatureItem,
  PricingFeatureList,
  PricingFootnote,
  PricingName,
  PricingPeriod,
  PricingPrice,
  PricingPriceRow,
  PricingOriginalPrice,
  PricingActionArea
} from './PricingCard.styles'

type Props = CardVariantMap['pricing']

function formatPrice(value: string | number, format?: PriceFormat): string {
  if (typeof value === 'number' && format) {
    try {
      return new Intl.NumberFormat(format.locale, {
        style: 'currency',
        currency: format.currency
      }).format(value)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

export function PricingCard({
  planName,
  price,
  originalPrice,
  period,
  priceFormat,
  description,
  features,
  highlighted,
  badge,
  action,
  footnote,
  ...rest
}: Props) {
  return (
    <BaseCard
      {...rest}
      hrefLabel={rest.hrefLabel ?? planName}
      hasActions={!!action}
      data-highlighted={highlighted || undefined}
    >
      {badge ? <PricingBadge>{badge}</PricingBadge> : null}

      <PricingName>{planName}</PricingName>

      {description ? <PricingDescription>{description}</PricingDescription> : null}

      {price !== undefined && price !== null ? (
        <PricingPriceRow>
          {originalPrice !== undefined && originalPrice !== null ? (
            <PricingOriginalPrice>{formatPrice(originalPrice, priceFormat)}</PricingOriginalPrice>
          ) : null}
          <PricingPrice>{formatPrice(price, priceFormat)}</PricingPrice>
          {period ? <PricingPeriod>{period}</PricingPeriod> : null}
        </PricingPriceRow>
      ) : null}

      {features && features.length > 0 ? (
        <PricingFeatureList>
          {features.map((feature, index) => (
            <PricingFeatureItem key={index} $included={feature.included !== false}>
              <span aria-hidden="true">{feature.included === false ? '✕' : '✓'}</span>
              {feature.label}
            </PricingFeatureItem>
          ))}
        </PricingFeatureList>
      ) : null}

      {action ? <PricingActionArea>{action}</PricingActionArea> : null}

      {footnote ? <PricingFootnote>{footnote}</PricingFootnote> : null}
    </BaseCard>
  )
}
