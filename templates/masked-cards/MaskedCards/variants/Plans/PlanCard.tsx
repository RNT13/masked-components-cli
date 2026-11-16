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
  size,
  fullWidth,
  cardBg,
  direction,
  appearance,
  layout,
  mediaRatio,
  disabled,
  selected,
  defaultSelected,
  onSelectedChange,
  selectionMode,
  expanded,
  defaultExpanded,
  onExpandedChange,
  expandable,
  expandContent,
  hrefLabel,
  href,
  onClick,
  className,
  iconSize,
  iconBgColor,
  iconTextColor,
  colorTheme,
  tokens,
  style
}: Props) {
  return (
    <PlanCardContainer
      size={size}
      fullWidth={fullWidth}
      cardBg={cardBg}
      direction={direction}
      appearance={appearance}
      layout={layout}
      mediaRatio={mediaRatio}
      disabled={disabled}
      selected={selected}
      defaultSelected={defaultSelected}
      onSelectedChange={onSelectedChange}
      selectionMode={selectionMode}
      expanded={expanded}
      defaultExpanded={defaultExpanded}
      onExpandedChange={onExpandedChange}
      expandable={expandable}
      expandContent={expandContent}
      href={href}
      hrefLabel={hrefLabel ?? planName}
      onClick={onClick}
      className={className}
      hasActions={!!action}
      $active={active ?? $active ?? false}
      colorTheme={colorTheme}
      tokens={tokens}
      style={style}
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
