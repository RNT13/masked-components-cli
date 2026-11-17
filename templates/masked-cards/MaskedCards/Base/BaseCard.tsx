'use client'

import { forwardRef, useCallback } from 'react'
import { useTheme } from 'styled-components'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { BaseCardProps, CardDirection } from '../MaskedCards.types'
import { resolveCardTokens, CardTokenOverrides } from '../cardTokens'
import { useSelectable } from '../behaviors/useSelectable'
import { useExpandable } from '../behaviors/useExpandable'
import { useCardGroup } from '../behaviors/useCardGroup'
import {
  BaseCardContainer,
  CardExpandButton,
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
    expanded,
    defaultExpanded,
    onExpandedChange,
    expandable,
    expandContent,
    expandLabel = 'Mostrar mais',
    collapseLabel = 'Mostrar menos',
    selectionValue,
    colorTheme,
    tokens,
    style,
    children,
    className,
    hasActions,
    ...props
  },
  ref
) {
  const { linkComponent } = useMaskedConfig()
  const theme = useTheme()
  const LinkTag = (linkComponent ?? 'a') as 'a'

  const group = useCardGroup(selectionValue, disabled)
  const grouped = group.grouped

  const standalone = useSelectable({
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

  // Dentro de um grupo, props avulsas de seleção são ignoradas.
  const effectiveSelectable = grouped ? true : standalone.selectable
  const isSelected = grouped ? group.isSelected : standalone.isSelected
  const effectiveDisabled = grouped ? group.effectiveDisabled : !!disabled

  // href + seleção: o link navega; seleção é ignorada (regra documentada).
  const selectable = !href && effectiveSelectable

  const selectableAria =
    selectable && !grouped
      ? standalone.ariaProps
      : selectable && grouped
        ? { role: group.role, 'aria-checked': isSelected }
        : {}

  const interactive = !effectiveDisabled && (!!href || !!onClick || selectable)
  const stretched = interactive && (!!hasActions || expand.expandable)

  const effectiveDirection: CardDirection =
    direction ?? (layout === 'horizontal' ? 'row' : 'column')

  const tokenStyle = resolveCardTokens(
    {
      colorTheme,
      appearance,
      tokens: tokens as CardTokenOverrides | undefined
    },
    theme
  )

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (grouped) {
        group.select()
        ;(onClick as React.MouseEventHandler<HTMLElement> | undefined)?.(event)
        return
      }
      if (selectable) standalone.toggle()
      ;(onClick as React.MouseEventHandler<HTMLElement> | undefined)?.(event)
    },
    [grouped, group, selectable, standalone, onClick]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (grouped) group.onKeyDown(event)
    },
    [grouped, group]
  )

  const registerRef = grouped ? group.registerRef : undefined
  const groupTabIndex = grouped ? group.tabIndex : undefined

  const common = {
    $size: size,
    $fullWidth: fullWidth,
    $clickable: interactive,
    $cardBg: cardBg,
    $direction: effectiveDirection,
    $appearance: appearance,
    $layout: layout,
    $disabled: effectiveDisabled,
    $selected: isSelected,
    $expanded: expand.isExpanded,
    'data-selected': isSelected || undefined,
    'data-disabled': effectiveDisabled || undefined,
    'data-media-ratio': mediaRatio,
    className,
    style: { ...tokenStyle, ...style },
    ...props
  }

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
        {expand.isExpanded ? collapseLabel : expandLabel}
      </CardExpandButton>
      <CardExpandRegion
        id={expand.regionId}
        role="region"
        aria-labelledby={expand.buttonId}
        $expanded={expand.isExpanded}
      >
        <div>{expandContent}</div>
      </CardExpandRegion>
    </CardExpandSection>
  ) : null

  const content = (
    <>
      {children}
      {selectable && isSelected ? <CardSelectedIndicator aria-hidden="true" /> : null}
      {expandSection}
    </>
  )

  // href + conteúdo interativo interno: wrapper div + stretched-link.
  if (href && stretched) {
    return (
      <BaseCardContainer ref={ref} {...common}>
        <StretchedLink
          as={LinkTag}
          href={effectiveDisabled ? undefined : href}
          aria-label={hrefLabel ?? 'Abrir'}
          tabIndex={effectiveDisabled ? -1 : undefined}
          aria-disabled={effectiveDisabled || undefined}
        />
        {content}
      </BaseCardContainer>
    )
  }

  // href sem conteúdo interativo interno: o próprio card é o link.
  if (href) {
    return (
      <BaseCardContainer
        as={LinkTag}
        href={effectiveDisabled ? undefined : href}
        tabIndex={effectiveDisabled ? -1 : undefined}
        aria-disabled={effectiveDisabled || undefined}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...common}
      >
        {content}
      </BaseCardContainer>
    )
  }

  // onClick/seleção + conteúdo interativo interno: wrapper + stretched-button.
  if (interactive && stretched) {
    return (
      <BaseCardContainer ref={ref} {...common}>
        <StretchedButton
          ref={registerRef as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          disabled={effectiveDisabled}
          tabIndex={groupTabIndex}
          aria-label={hrefLabel ?? (selectable ? 'Selecionar' : 'Ação do cartão')}
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
