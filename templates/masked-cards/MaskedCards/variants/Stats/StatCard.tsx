'use client'

import { CardVariantMap } from '../../MaskedCards.types'
import { StatCardContainer, StatIcon, StatLabel, StatValue } from './StatCard.styles'

type Props = { $variant: 'stat' } & CardVariantMap['stat']

export default function StatCard({
  icon,
  iconBgColor,
  iconTextColor,
  labelTextColor,
  valueTextColor,
  value,
  value2,
  label,
  label2,
  size,
  fullWidth,
  direction,
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
  iconSize,
  href,
  onClick,
  className
}: Props) {
  return (
    <StatCardContainer
      size={size}
      fullWidth={fullWidth}
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
      colorTheme={colorTheme}
      tokens={tokens}
      style={style}
      href={href}
      hrefLabel={hrefLabel}
      onClick={onClick}
      className={className}
      cardBg={cardBg}
    >
      {icon && (
        <StatIcon $bg={iconBgColor} $color={iconTextColor} $iconSize={iconSize}>
          {icon}
        </StatIcon>
      )}
      <StatValue $valueTextColor={valueTextColor}>{value}</StatValue>
      {value2 && <StatValue>{value2}</StatValue>}
      <StatLabel $labelTextColor={labelTextColor}>{label}</StatLabel>
      {label2 && <StatLabel>{label2}</StatLabel>}
    </StatCardContainer>
  )
}
