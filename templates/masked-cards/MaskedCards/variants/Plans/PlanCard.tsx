'use client'

import { CardIconBadge } from '../../Base/BaseCard.styles'
import { CardVariantMap } from '../../MaskedCards.types'
import { PlanAction, PlanCardContainer, PlanHeader, PlanRenewal, PlanStatus } from './PlanCard.styles'

type Props = { $variant: 'plan' } & CardVariantMap['plan']

export default function PlanCard({
  icon,
  planName,
  $active,
  statusLabel,
  description,
  renewalDate,
  action,
  size,
  fullWidth,
  href,
  onClick,
  className,
  iconSize,
  iconBgColor,
  iconTextColor
}: Props) {
  return (
    <PlanCardContainer size={size} fullWidth={fullWidth} href={href} onClick={onClick} className={className} $active={$active}>
      <PlanHeader>
        <CardIconBadge $bg={iconBgColor} $color={iconTextColor} $iconSize={iconSize}>
          {icon}
        </CardIconBadge>

        {planName}
      </PlanHeader>
      {statusLabel && <PlanStatus>{statusLabel}</PlanStatus>}
      {description && <p>{description}</p>}
      {renewalDate && <PlanRenewal>Renovação em {renewalDate}</PlanRenewal>}
      {action && <PlanAction>{action}</PlanAction>}
    </PlanCardContainer>
  )
}
