'use client'

import { CardIconBadge } from '../../Base/BaseCard.styles'
import { CardVariantMap } from '../../MaskedCards.types'
import {
  PlanAction,
  PlanCardContainer,
  PlanDescription,
  PlanHeader,
  PlanName,
  PlanRenewal,
  PlanStatus
} from './PlanCard.styles'

type Props = { $variant: 'plan' } & CardVariantMap['plan']

export default function PlanCard({
  icon,
  planName,
  active,
  $active,
  statusLabel,
  description,
  renewalDate,
  renewalLabel = 'Renovação em',
  action,
  iconSize,
  iconBgColor,
  iconTextColor,
  hrefLabel,
  ...rest
}: Props) {
  return (
    <PlanCardContainer
      $active={active ?? $active ?? false}
      hasActions={!!action}
      hrefLabel={hrefLabel ?? planName}
      {...rest}
    >
      <PlanHeader>
        {icon && (
          <CardIconBadge $bg={iconBgColor} $color={iconTextColor} $iconSize={iconSize}>
            {icon}
          </CardIconBadge>
        )}
        <PlanName>{planName}</PlanName>
      </PlanHeader>

      {statusLabel && <PlanStatus>{statusLabel}</PlanStatus>}
      {description && <PlanDescription>{description}</PlanDescription>}
      {renewalDate && (
        <PlanRenewal>
          {renewalLabel} {renewalDate}
        </PlanRenewal>
      )}
      {action && <PlanAction>{action}</PlanAction>}
    </PlanCardContainer>
  )
}
