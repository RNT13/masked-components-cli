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
  /** Interno: a variante informa se renderiza actions/action interativo. */
  hasActions?: boolean
  children?: React.ReactNode
}

export const BaseCard = forwardRef<HTMLDivElement, BaseCardInternalProps>(function BaseCard(
  {
    href,
    hrefLabel,
    onClick,
    size = 'md',
    fullWidth,
    cardBg,
    direction,
    appearance = 'elevated',
    layout,
    mediaRatio,
    disabled,
    selected,
    defaultSelected,
    onSelectedChange,
    selectionMode,
    selectionValue,
    expanded,
    defaultExpanded,
    onExpandedChange,
    expandable,
    expandContent,
    expandLabel,
    collapseLabel,
    colorTheme,
    tokens,
    style,
    className,
    hasActions,
    children,
    ...rest
  },
  ref
) {
  const theme = useTheme()

  const group = useCardGroup(selectionValue, disabled)

  const selectable = useSelectable({
    selected,
    defaultSelected,
    onSelectedChange,
    selectionMode,
    disabled
  })

  const expand = useExpandable({
    expandable,
    expanded,
    defaultExpanded,
    onExpandedChange,
    disabled
  })

  const effectiveDisabled = group.grouped ? group.effectiveDisabled : disabled
  const effectiveSelectable = group.grouped || selectable.selectable

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (effectiveDisabled) return
      if (group.grouped) {
        group.select()
      } else if (selectable.selectable) {
        selectable.toggle()
      }
      onClick?.(event)
    },
    [effectiveDisabled, group, selectable, onClick]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (group.grouped) group.onKeyDown(event)
    },
    [group]
  )

  const tokenStyle = resolveCardTokens(
    {
      colorTheme,
      appearance,
      // cardBg (legado) vira tokens.bg; tokens do consumidor têm prioridade.
      tokens: {
        ...(cardBg ? { bg: cardBg } : {}),
        ...(tokens as CardTokenOverrides | undefined)
      }
    },
    theme
  )

  const interactive = !!href || !!onClick || effectiveSelectable
  const clickable = interactive && !effectiveDisabled
  const stretched = interactive && (!!hasActions || expand.expandable)

  const resolvedDirection: CardDirection =
    direction ?? (layout === 'horizontal' || layout === 'split' ? 'row' : 'column')

  const common = {
    $size: size,
    $fullWidth: fullWidth,
    $direction: resolvedDirection,
    $appearance: appearance,
    $layout: layout,
    $clickable: clickable,
    $disabled: effectiveDisabled,
    $selected: group.grouped ? group.isSelected : selectable.isSelected,
    $expanded: expand.isExpanded,
    'data-media-ratio': mediaRatio,
    'data-appearance': appearance,
    'data-layout': layout,
    'aria-disabled': effectiveDisabled || undefined,
    style: { ...tokenStyle, ...style } as React.CSSProperties,
    className,
    ...rest
  }

  const groupAriaProps = group.grouped ? { role: group.role, 'aria-checked': group.isSelected } : {}

  const selectableAria =
    !group.grouped && selectable.selectable
      ? {
          role: selectionMode === 'multiple' ? 'checkbox' : 'radio',
          'aria-checked': selectable.isSelected
        }
      : {}

  const expandSection = expand.expandable ? (
    <CardExpandSection>
      <CardExpandButton
        type="button"
        id={expand.buttonId}
        aria-expanded={expand.isExpanded}
        aria-controls={expand.regionId}
        disabled={effectiveDisabled}
        onClick={expand.toggle}
      >
        {expand.isExpanded ? (collapseLabel ?? 'Mostrar menos') : (expandLabel ?? 'Mostrar mais')}
        <CardExpandCaret $expanded={expand.isExpanded} aria-hidden="true" />
      </CardExpandButton>
      <CardExpandRegion
        id={expand.regionId}
        role="region"
        aria-labelledby={expand.buttonId}
        $expanded={expand.isExpanded}
      >
        {expandContent}
      </CardExpandRegion>
    </CardExpandSection>
  ) : null

  const selectedIndicator =
    (group.grouped ? group.isSelected : selectable.isSelected) && effectiveSelectable ? (
      <CardSelectedIndicator aria-hidden="true" />
    ) : null

  const content = (
    <>
      {selectedIndicator}
      {children}
      {expandSection}
    </>
  )

  const groupTabIndex = group.grouped ? group.tabIndex : undefined
  const registerRef = group.grouped ? group.registerRef : undefined

  // href + conteúdo interativo interno: stretched-link (sem aninhamento).
  if (href && stretched) {
    return (
      <BaseCardContainer {...common}>
        <StretchedLink
          href={effectiveDisabled ? undefined : href}
          aria-disabled={effectiveDisabled || undefined}
          aria-label={hrefLabel}
          tabIndex={effectiveDisabled ? -1 : groupTabIndex}
          ref={registerRef as React.Ref<HTMLAnchorElement>}
          onKeyDown={handleKeyDown}
        />
        {content}
      </BaseCardContainer>
    )
  }

  // href sem conteúdo interativo interno: o card inteiro é o link.
  if (href) {
    return (
      <BaseCardContainer
        as="a"
        href={effectiveDisabled ? undefined : href}
        aria-label={hrefLabel}
        tabIndex={effectiveDisabled ? -1 : groupTabIndex}
        ref={registerRef ?? (ref as React.Ref<HTMLAnchorElement>)}
        onKeyDown={handleKeyDown}
        {...common}
      >
        {content}
      </BaseCardContainer>
    )
  }

  // onClick/seleção + conteúdo interativo interno: wrapper + botão stretched.
  if (stretched) {
    return (
      <BaseCardContainer {...common}>
        <StretchedButton
          type="button"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          disabled={effectiveDisabled}
          tabIndex={groupTabIndex}
          aria-label={hrefLabel ?? (effectiveSelectable ? 'Selecionar' : 'Ação do cartão')}
          ref={registerRef as React.Ref<HTMLButtonElement>}
          {...groupAriaProps}
          {...selectableAria}
        />
        {content}
      </BaseCardContainer>
    )
  }

  // onClick/seleção sem conteúdo interativo interno: o card é um <button> real.
  if (interactive) {
    return (
      <BaseCardContainer
        as="button"
        type="button"
        disabled={effectiveDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={groupTabIndex}
        ref={registerRef ?? (ref as React.Ref<HTMLButtonElement>)}
        {...common}
        $isButton
        {...groupAriaProps}
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
