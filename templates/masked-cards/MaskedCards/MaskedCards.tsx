'use client'

import { CardProps } from './MaskedCards.types'
import MetricCard from './variants/Metrics/MetricCard'
import StatCard from './variants/Stats/StatCard'
import CompareCard from './variants/Compare/CompareCard'
import ProductCard from './variants/Products/ProductCard'
import FeatureCard from './variants/Features/FeatureCard'
import PlanCard from './variants/Plans/PlanCard'
import { ProfileCard } from './variants/Profile/ProfileCard'
import { ArticleCard } from './variants/Article/ArticleCard'
import { ServiceCard } from './variants/Service/ServiceCard'
import { TestimonialCard } from './variants/Testimonial/TestimonialCard'
import { PricingCard } from './variants/Pricing/PricingCard'

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
      return <PlanCard {...props} active={props.active ?? props.$active ?? false} />
    case 'profile':
      return <ProfileCard {...props} />
    case 'article':
      return <ArticleCard {...props} />
    case 'service':
      return <ServiceCard {...props} />
    case 'testimonial':
      return <TestimonialCard {...props} />
    case 'pricing':
      return <PricingCard {...props} />
    default:
      return null
  }
}
