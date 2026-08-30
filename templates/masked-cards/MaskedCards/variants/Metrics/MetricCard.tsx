'use client'

import { CardIconBadge, MetricColumnBody, MetricRowBody } from '../../Base/BaseCard.styles'
import { CardVariantMap } from '../../MaskedCards.types'
import { MetricBadge, MetricCardContainer, MetricLabel, MetricRightIcon, MetricTop, MetricTrend, MetricValue } from './MetricCard.styles'

type Props = { $variant: 'metric' } & CardVariantMap['metric']

export default function MetricCard({
  direction = 'column',
  icon,
  iconBgColor,
  iconTextColor,
  badge,
  badgeBgColor,
  badgeTextColor,
  trendValue,
  trend,
  rightIcon,
  value,
  value2,
  label,
  label2,
  size,
  fullWidth,
  cardBg,
  href,
  onClick,
  className,
  iconSize
}: Props) {
  const topRight = rightIcon ? (
    <MetricRightIcon>{rightIcon}</MetricRightIcon>
  ) : badge ? (
    <MetricBadge $color={badgeTextColor} $bg={badgeBgColor}>
      {badge}
    </MetricBadge>
  ) : trendValue ? (
    <MetricTrend $trend={trend}>{trendValue}</MetricTrend>
  ) : null

  return (
    <MetricCardContainer direction={direction} size={size} fullWidth={fullWidth} cardBg={cardBg} href={href} onClick={onClick} className={className}>
      {direction === 'row' ? (
        <>
          <CardIconBadge $bg={iconBgColor} $color={iconTextColor} $iconSize={iconSize}>
            {icon}
          </CardIconBadge>

          <MetricRowBody>
            <MetricColumnBody>
              <MetricValue>{value}</MetricValue>
              {value2 && <MetricValue>{value2}</MetricValue>}
              <MetricLabel>{label}</MetricLabel>
              {label2 && <MetricLabel>{label2}</MetricLabel>}
            </MetricColumnBody>

            {topRight}
          </MetricRowBody>
        </>
      ) : (
        <>
          <MetricTop>
            <CardIconBadge $bg={iconBgColor} $color={iconTextColor}>
              {icon}
            </CardIconBadge>
            {topRight}
          </MetricTop>

          <MetricValue>{value}</MetricValue>
          {value2 && <MetricValue>{value2}</MetricValue>}
          <MetricLabel>{label}</MetricLabel>
          {label2 && <MetricLabel>{label2}</MetricLabel>}
        </>
      )}
    </MetricCardContainer>
  )
}
