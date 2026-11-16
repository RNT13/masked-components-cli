'use client'

import { CardVariantMap } from '../../MaskedCards.types'
import {
  CompareCardContainer,
  CompareIcon,
  CompareLabel,
  CompareTrend,
  CompareValue
} from './CompareCard.styles'

type Props = { $variant: 'compare' } & CardVariantMap['compare']

export default function CompareCard({
  icon,
  iconBgColor,
  iconTextColor,
  value,
  label,
  compareText,
  compareTrend,
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
  colorTheme,
  tokens,
  style,
  href,
  onClick,
  className,
  iconSize
}: Props) {
  const arrow = compareTrend === 'up' ? '↗' : compareTrend === 'down' ? '↘' : '→'

  return (
    <CompareCardContainer
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
      colorTheme={colorTheme}
      tokens={tokens}
      style={style}
      href={href}
      hrefLabel={hrefLabel}
      onClick={onClick}
      className={className}
    >
      <CompareIcon $bg={iconBgColor} $color={iconTextColor} $iconSize={iconSize}>
        {icon}
      </CompareIcon>
      <CompareValue>{value}</CompareValue>
      <CompareLabel>{label}</CompareLabel>
      {compareText && (
        <CompareTrend $trend={compareTrend}>
          {arrow} {compareText}
        </CompareTrend>
      )}
    </CompareCardContainer>
  )
}
