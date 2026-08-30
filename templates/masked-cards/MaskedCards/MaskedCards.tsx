'use client'

import { CardProps } from './MaskedCards.types'
import CompareCard from './variants/Compare/CompareCard'
import FeatureCard from './variants/Features/FeatureCard'
import MetricCard from './variants/Metrics/MetricCard'
import PlanCard from './variants/Plans/PlanCard'
import ProductCard from './variants/Products/ProductCard'
import StatCard from './variants/Stats/StatCard'

export function MaskedCards(props: CardProps) {
  switch (props.$variant) {
    case 'metric':
      return <MetricCard {...props} />
    case 'stat':
      return <StatCard {...props} />
    case 'compare':
      return <CompareCard {...props} />
    case 'product':
      return <ProductCard {...props} />
    case 'feature':
      return <FeatureCard {...props} />
    case 'plan':
      return <PlanCard {...props} $active={props.$active ?? false} />
    default:
      return null
  }
}
