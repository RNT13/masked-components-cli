'use client'

import { CardVariantMap } from '../../MaskedCards.types'
import { FeatureAction, FeatureCardContainer, FeatureDescription, FeatureIcon, FeatureTitle } from './FeatureCard.styles'

type Props = { $variant: 'feature' } & CardVariantMap['feature']

export default function FeatureCard({
  icon,
  iconBgColor,
  iconTextColor,
  title,
  description,
  action,
  highlight,
  size,
  fullWidth,
  href,
  onClick,
  className,
  cardBg,
  iconSize
}: Props) {
  return (
    <FeatureCardContainer
      size={size}
      fullWidth={fullWidth}
      href={href}
      onClick={onClick}
      className={className}
      $highlight={highlight}
      cardBg={cardBg}
    >
      <FeatureIcon $bg={iconBgColor} $color={iconTextColor} $iconSize={iconSize}>
        {icon}
      </FeatureIcon>
      <FeatureTitle>{title}</FeatureTitle>
      {description && <FeatureDescription>{description}</FeatureDescription>}
      {action && <FeatureAction>{action}</FeatureAction>}
    </FeatureCardContainer>
  )
}
