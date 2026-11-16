'use client'

import { CardVariantMap } from '../../MaskedCards.types'
import {
  FeatureAction,
  FeatureCardContainer,
  FeatureDescription,
  FeatureIcon,
  FeatureTitle
} from './FeatureCard.styles'

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
  return (
    <FeatureCardContainer
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
      hrefLabel={hrefLabel ?? title}
      onClick={onClick}
      className={className}
      hasActions={!!action}
      $highlight={highlight}
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
