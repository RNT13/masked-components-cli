'use client'

import { forwardRef, useCallback } from 'react'
import { useTheme } from 'styled-components'
import { BaseCardProps, CardDirection } from '../MaskedCards.types'
import { resolveCardTokens, CardTokenOverrides } from '../cardTokens'
import { useSelectable } from '../behaviors/useSelectable'
import { useExpandable } from '../behaviors/useExpandable'
import { useCardGroup } from '../behaviors/useCardGroup'
import {
  BaseCardContainer,
  CardExpandButton,
  CardExpandCaret,
  CardExpandRegion,
  CardExpandSection,
  CardSelectedIndicator,
  StretchedButton,
  StretchedLink
} from './BaseCard.styles'

export type BaseCardInternalProps = BaseCardProps & {
  /** Interno: a variante informa se renderiza actions/botões próprios. */
  hasActions?: boolean
}

export const BaseCard = forwardRef<HTMLDivElement, BaseCardInternalProps>(function BaseCard(
  {
    href,
    onClick,
    size = 'md',
    fullWidth,
    cardBg,
    direction = 'column',
    colorTheme,
    tokens,
    style,
    children,
    className,
    appearance = 'elevated',
    layout = 'vertical',
    mediaRatio,
    disabled,
    selectable,
    selectionMode,
    selected,
    defaultSelected,
    onSelectedChange,
    selectionValue,
    expandable,
    expandContent,
    expanded,
    defaultExpanded,
    onExpandedChange,
    expandLabel,
    collapseLabel,
    hrefLabel,
    hasActions
  },
  ref
) {
  const theme = useTheme()
  const group = useCardGroup(selectionValue, disabled)
  const selectableState = useSelectable({
    selectable,
    selectionMode,
    selected,
    defaultSelected,
    onSelectedChange,
    disabled: disabled || group.effectiveDisabled
  })
  const expand = useExpandable({
    expandable,
    expanded,
    defaultExpanded,
    onExpandedChange,
    disabled: disabled || group.effectiveDisabled
  })

  const effectiveDisabled = disabled || group.effectiveDisabled
  const interactive = !!href || !!onClick || selectableState.selectable || group.grouped

  // cardBg vira tokens.bg; tokens.bg explícito vence cardBg.
  const tokenStyle = resolveCardTokens(
    {
      colorTheme,
      tokens: {
        ...(cardBg ? { bg: cardBg } : {}),
        ...(tokens as CardTokenOverrides | undefined)
      }
    },
    theme
  )

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (effectiveDisabled) return
      if (group.grouped) {
        group.select()
        return
      }
      if (selectableState.selectable) selectableState.toggle()
      else if (expand.expandable && !href) expand.toggle()
      onClick?.(event)
    },
    [effectiveDisabled, group, selectableState, expand, href, onClick]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (group.grouped) group.onKeyDown(event)
    },
    [group]
  )

  const isSelected = group.grouped ? group.isSelected : selectableState.isSelected
  const ariaChecked = group.grouped || selectableState.selectable ? isSelected : undefined
  const ariaRole = group.grouped
    ? group.role
    : selectableState.selectable
      ? selectableState.role
      : undefined

  const common = {
    className,
    style: { ...tokenStyle, ...style },
    $size: size,
    $fullWidth: fullWidth,
    $direction: direction as CardDirection,
    $appearance: appearance,
    'data-appearance': appearance,
    'data-layout': layout,
    'data-media-ratio': mediaRatio,
    'aria-disabled': effectiveDisabled || undefined,
    $selected: isSelected,
    $disabled: effectiveDisabled
  } as const

  const selectableAria =
    ariaRole !== undefined ? { role: ariaRole, 'aria-checked': ariaChecked } : {}

  const expandRegion = expand.expandable ? (
    <CardExpandRegion
      id={expand.regionId}
      role="region"
      aria-label={
        expand.isExpanded ? (collapseLabel ?? 'Mostrar menos') : (expandLabel ?? 'Mostrar mais')
      }
      hidden={!expand.isExpanded}
    >
      <CardExpandSection $direction={direction}>{expandContent}</CardExpandSection>
    </CardExpandRegion>
  ) : null

  const expandButton = expand.expandable ? (
    <CardExpandButton
      type="button"
      aria-expanded={expand.isExpanded}
      aria-controls={expand.regionId}
      aria-label={
        expand.isExpanded ? (collapseLabel ?? 'Mostrar menos') : (expandLabel ?? 'Mostrar mais')
      }
      disabled={effectiveDisabled}
      onClick={(e) => {
        e.stopPropagation()
        expand.toggle()
      }}
    >
      <CardExpandCaret $open={expand.isExpanded} aria-hidden="true" />
    </CardExpandButton>
  ) : null

  const selectedIndicator = isSelected ? <CardSelectedIndicator aria-hidden="true" /> : null

  const content = (
    <>
      {selectedIndicator}
      {children}
      {expandButton}
      {expandRegion}
    </>
  )

  // Stretched: card interativo que contém actions/expansão próprios.
  // O elemento interativo vira um overlay absoluto IRMÃO dos demais —
  // role/aria-checked/tabIndex vão nele, nunca no container, para que
  // nenhum interativo fique aninhado dentro de outro.
  const stretched = interactive && (!!hasActions || expand.expandable)

  if (stretched) {
    const stretchedEl = href ? (
      <StretchedLink
        href={effectiveDisabled ? undefined : href}
        aria-label={hrefLabel}
        aria-disabled={effectiveDisabled || undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={group.grouped ? group.tabIndex : undefined}
        ref={group.registerRef ?? (ref as React.Ref<HTMLAnchorElement>)}
        {...selectableAria}
      />
    ) : (
      <StretchedButton
        type="button"
        aria-label={hrefLabel}
        aria-disabled={effectiveDisabled || undefined}
        disabled={effectiveDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={group.grouped ? group.tabIndex : undefined}
        ref={group.registerRef ?? (ref as React.Ref<HTMLButtonElement>)}
        {...selectableAria}
      />
    )

    return (
      <BaseCardContainer ref={ref} {...common} $stretched>
        {stretchedEl}
        {content}
      </BaseCardContainer>
    )
  }

  if (href) {
    return (
      <BaseCardContainer
        as="a"
        href={effectiveDisabled ? undefined : href}
        aria-label={hrefLabel}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...common}
        {...selectableAria}
      >
        {content}
      </BaseCardContainer>
    )
  }

  if (interactive) {
    return (
      <BaseCardContainer
        as="button"
        type="button"
        disabled={effectiveDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={group.grouped ? group.tabIndex : undefined}
        ref={group.registerRef ?? (ref as React.Ref<HTMLButtonElement>)}
        {...common}
        $isButton
        {...selectableAria}
      >
        {content}
      </BaseCardContainer>
    )
  }

  return (
    <BaseCardContainer ref={ref} {...common}>
      {content}
    </BaseCardContainer>
  )
})
