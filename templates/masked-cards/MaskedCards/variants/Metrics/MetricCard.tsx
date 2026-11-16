'use client'

import { CardIconBadge, MetricColumnBody, MetricRowBody } from '../../Base/BaseCard.styles'
import { CardVariantMap } from '../../MaskedCards.types'
import {
  MetricBadge,
  MetricCardContainer,
  MetricLabel,
  MetricRightIcon,
  MetricTop,
  MetricTrend,
  MetricValue
} from './MetricCard.styles'

type Props = { $variant: 'metric' } & CardVariantMap['metric']

export default function MetricCard({
  direction,
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
  colorTheme,
  tokens,
  style,
  href,
  onClick,
  className,
  iconSize
}: Props) {
  const effectiveDirection = direction ?? (layout === 'horizontal' ? 'row' : 'column')

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
    <MetricCardContainer
      direction={direction}
      layout={layout}
      size={size}
      fullWidth={fullWidth}
      cardBg={cardBg}
      appearance={appearance}
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
      colorTheme={colorTheme}
      tokens={tokens}
      style={style}
      href={href}
      hrefLabel={hrefLabel}
      onClick={onClick}
      className={className}
    >
      {effectiveDirection === 'row' ? (
        <>
          <CardIconBadge $color={iconTextColor} $iconSize={iconSize}>
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
