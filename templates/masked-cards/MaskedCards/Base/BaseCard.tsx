'use client'

import { forwardRef, useState } from 'react'
import { useTheme } from 'styled-components'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { BaseCardProps, CardDirection } from '../MaskedCards.types'
import { resolveCardTokens, CardTokenOverrides } from '../cardTokens'
import { BaseCardContainer, StretchedButton, StretchedLink } from './BaseCard.styles'

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
    selectionMode = 'single',
    expanded,
    defaultExpanded,
    onExpandedChange,
    expandable,
    expandContent,
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

  // Seleção controlada/não controlada (será extraída para behaviors/useSelectable no Passo 3)
  const selectable =
    selected !== undefined || defaultSelected !== undefined || onSelectedChange !== undefined
  const [internalSelected, setInternalSelected] = useState(defaultSelected ?? false)
  const isSelected = selected ?? internalSelected

  // Expansão controlada/não controlada (será extraída para behaviors/useExpandable no Passo 3)
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded ?? false)
  const isExpanded = expanded ?? internalExpanded

  const clickable = !disabled && (!!href || !!onClick || selectable)
  const stretched = clickable && !!hasActions

  // Precedência: direction explícito do consumidor vence o implícito do layout.
  const effectiveDirection: CardDirection =
    direction ?? (layout === 'horizontal' ? 'row' : 'column')

  const tokenStyle = resolveCardTokens(
    {
      colorTheme,
      tokens: tokens as CardTokenOverrides | undefined
    },
    theme
  )

  const handleClick: React.MouseEventHandler = (e) => {
    if (disabled) return
    if (selectable) {
      const next = !isSelected
      if (selected === undefined) setInternalSelected(next)
      onSelectedChange?.(next)
    } else if (expandable && !href) {
      const next = !isExpanded
      if (expanded === undefined) setInternalExpanded(next)
      onExpandedChange?.(next)
    }
    onClick?.(e)
  }

  const selectableAria = selectable
    ? {
        role: selectionMode === 'multiple' ? ('checkbox' as const) : ('radio' as const),
        'aria-checked': isSelected
      }
    : {}

  const common = {
    $size: size,
    $fullWidth: fullWidth,
    $clickable: clickable,
    $cardBg: cardBg,
    $direction: effectiveDirection,
    $appearance: appearance,
    $layout: layout,
    $disabled: disabled,
    $selected: isSelected,
    $expanded: isExpanded,
    $stretched: stretched,
    'aria-disabled': disabled || undefined,
    'data-media-ratio': mediaRatio,
    className,
    style: { ...tokenStyle, ...style },
    ...selectableAria,
    ...props
  }

  const content = (
    <>
      {children}
      {expandable && isExpanded ? expandContent : null}
    </>
  )

  // href + actions: wrapper div + stretched-link; actions ficam fora do link (z-index).
  if (href && stretched) {
    return (
      <BaseCardContainer ref={ref} {...common}>
        <StretchedLink
          as={LinkTag}
          href={disabled ? undefined : href}
          aria-label={hrefLabel ?? 'Abrir'}
          tabIndex={disabled ? -1 : undefined}
        />
        {content}
      </BaseCardContainer>
    )
  }

  // href sem actions: o próprio card é o link (comportamento original).
  if (href) {
    return (
      <BaseCardContainer
        as={LinkTag}
        href={disabled ? undefined : href}
        tabIndex={disabled ? -1 : undefined}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...common}
      >
        {content}
      </BaseCardContainer>
    )
  }

  // onClick/seleção + actions: wrapper div + stretched-button; actions fora do botão.
  if (clickable && stretched) {
    return (
      <BaseCardContainer ref={ref} {...common}>
        <StretchedButton
          type="button"
          onClick={handleClick}
          disabled={disabled}
          aria-label={hrefLabel}
          aria-expanded={expandable ? isExpanded : undefined}
          {...selectableAria}
        />
        {content}
      </BaseCardContainer>
    )
  }

  // onClick/seleção sem actions: o card é um <button> real (P1 — sem div role="button").
  if (clickable) {
    return (
      <BaseCardContainer
        as="button"
        type="button"
        disabled={disabled}
        onClick={handleClick}
        aria-expanded={expandable ? isExpanded : undefined}
        $isButton
        ref={ref as React.Ref<HTMLButtonElement>}
        {...common}
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
