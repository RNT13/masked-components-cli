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
    expandLabel = 'Mostrar mais',
    collapseLabel = 'Mostrar menos',
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
  // hooks incondicionais; linkComponent prop-level não existe em card — provider > <a>
  const { linkComponent } = useMaskedConfig()
  const theme = useTheme()
  const LinkTag = (linkComponent ?? 'a') as 'a'

  const {
    selectable,
    isSelected,
    toggle,
    ariaProps: selectableAria
  } = useSelectable({
    selected,
    defaultSelected,
    onSelectedChange,
    selectionMode,
    disabled
  })

  const {
    expandable: isExpandable,
    isExpanded,
    toggle: toggleExpanded,
    buttonId: expandButtonId,
    regionId: expandRegionId
  } = useExpandable({
    expandable,
    expanded,
    defaultExpanded,
    onExpandedChange,
    disabled
  })

  // Grupo (MaskedCardGroup): fora de grupo retorna { grouped: false }.
  const group = useCardGroup(selectionValue, disabled)
  const grouped = group.grouped

  const effectiveDisabled = grouped ? group.effectiveDisabled : !!disabled
  const effectiveSelected = grouped ? group.isSelected : isSelected
  const effectiveSelectable = grouped || selectable

  // Semântica preservada mesmo desabilitado: <button disabled> / <a> sem href.
  const interactive = !!href || !!onClick || effectiveSelectable
  // Estilo "clicável" (hover/cursor) só quando de fato habilitado.
  const clickable = interactive && !effectiveDisabled
  const stretched = interactive && !!hasActions

  // Precedência: direction explícito do consumidor vence o implícito do layout.
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
      if (effectiveDisabled) return
      if (grouped) {
        group.select()
      } else if (selectable) {
        toggle()
      }
      onClick?.(event)
    },
    [effectiveDisabled, grouped, group, selectable, toggle, onClick]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (grouped) group.onKeyDown(event)
    },
    [grouped, group]
  )

  const groupTabIndex = grouped ? group.tabIndex : undefined
  const registerRef = grouped ? group.registerRef : undefined

  const groupAriaProps = grouped ? { role: group.role, 'aria-checked': group.isSelected } : {}

  const common = {
    $size: size,
    $fullWidth: fullWidth,
    $clickable: clickable,
    $cardBg: cardBg,
    $direction: effectiveDirection,
    $appearance: appearance,
    $layout: layout,
    $disabled: effectiveDisabled,
    $selected: effectiveSelected,
    $expanded: isExpanded,
    'data-media-ratio': mediaRatio,
    'data-selected': effectiveSelected || undefined,
    'data-disabled': effectiveDisabled || undefined,
    'aria-disabled': effectiveDisabled || undefined,
    className,
    style: { ...tokenStyle, ...style },
    ...props
  } as const

  const expandSection = isExpandable ? (
    <CardExpandSection>
      <CardExpandButton
        id={expandButtonId}
        type="button"
        onClick={toggleExpanded}
        disabled={effectiveDisabled}
        aria-expanded={isExpanded}
        aria-controls={expandRegionId}
      >
        {isExpanded ? collapseLabel : expandLabel}
        <CardExpandCaret $expanded={isExpanded} aria-hidden="true" />
      </CardExpandButton>
      <CardExpandRegion
        id={expandRegionId}
        role="region"
        aria-labelledby={expandButtonId}
        $expanded={isExpanded}
      >
        <div>{expandContent}</div>
      </CardExpandRegion>
    </CardExpandSection>
  ) : null

  const selectedIndicator = effectiveSelectable ? (
    <CardSelectedIndicator aria-hidden="true" $visible={effectiveSelected} />
  ) : null

  const content = (
    <>
      {selectedIndicator}
      {children}
      {expandSection}
    </>
  )

  // href + conteúdo interativo interno: wrapper + stretched-link (sem aninhar).
  if (href && stretched) {
    return (
      <BaseCardContainer ref={ref} {...common}>
        <StretchedLink
          as={LinkTag}
          href={effectiveDisabled ? undefined : href}
          aria-label={hrefLabel ?? 'Abrir'}
          tabIndex={effectiveDisabled ? -1 : undefined}
        />
        {content}
      </BaseCardContainer>
    )
  }

  // href sem conteúdo interativo interno: o próprio card é o link.
  // 'aria-disabled' já vem em common — não repetir aqui.
  if (href) {
    return (
      <BaseCardContainer
        as={LinkTag}
        href={effectiveDisabled ? undefined : href}
        tabIndex={effectiveDisabled ? -1 : undefined}
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
          aria-label={hrefLabel ?? (effectiveSelectable ? 'Selecionar' : 'Ação do cartão')}
          {...(grouped ? groupAriaProps : selectableAria)}
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
        {...(grouped ? groupAriaProps : selectableAria)}
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
