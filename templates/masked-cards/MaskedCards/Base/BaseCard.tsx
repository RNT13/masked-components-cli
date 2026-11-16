'use client'

import { forwardRef } from 'react'
import { useTheme } from 'styled-components'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { BaseCardProps, CardDirection } from '../MaskedCards.types'
import { resolveCardTokens, CardTokenOverrides } from '../cardTokens'
import { useSelectable } from '../behaviors/useSelectable'
import { useExpandable } from '../behaviors/useExpandable'
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
    toggle: toggleSelected,
    ariaProps: selectableAria
  } = useSelectable({ selected, defaultSelected, onSelectedChange, selectionMode, disabled })

  const {
    expandable: isExpandable,
    isExpanded,
    toggle: toggleExpanded,
    buttonId,
    regionId
  } = useExpandable({ expandable, expanded, defaultExpanded, onExpandedChange, disabled })

  /*
   * interactive = o card TEM comportamento (href, onClick ou seleção).
   * clickable  = interactive && !disabled (só estilo: cursor/hover).
   * Desabilitado mantém a semântica: <button disabled> / <a> sem href.
   */
  const interactive = !!href || !!onClick || selectable
  const clickable = interactive && !disabled

  /*
   * Stretched sempre que o elemento interativo principal não pode conter
   * outros interativos: actions OU expansão (o botão de expandir e a
   * região nunca ficam dentro de <a>/<button>).
   */
  const stretched = interactive && !!(hasActions || isExpandable)

  // Precedência: direction explícito do consumidor vence o implícito do layout.
  const effectiveDirection: CardDirection =
    direction ?? (layout === 'horizontal' ? 'row' : 'column')

  const tokenStyle = resolveCardTokens(
    {
      colorTheme,
      tokens: tokens as CardTokenOverrides | undefined,
      appearance
    },
    theme
  )

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return
    if (selectable) toggleSelected()
    onClick?.(e)
  }

  /*
   * Regra documentada: href + seleção → o link navega e a seleção é
   * ignorada (um <a> não pode ser radio/checkbox). Os atributos de
   * seleção só vão para elementos <button>.
   */
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
    'data-selected': (selectable && isSelected) || undefined,
    'data-disabled': disabled || undefined,
    'data-media-ratio': mediaRatio,
    className,
    style: { ...tokenStyle, ...style },
    ...props
  }

  /*
   * Bloco de expansão: botão dedicado + região. Sempre FORA do elemento
   * interativo principal (z-index acima do stretched). A região fica
   * sempre montada para a transição de grid-rows; quando recolhida,
   * visibility:hidden a remove da tabulação e da árvore de acessibilidade.
   */
  const expandSection = isExpandable ? (
    <CardExpandSection>
      <CardExpandButton
        type="button"
        id={buttonId}
        onClick={toggleExpanded}
        disabled={disabled}
        aria-expanded={isExpanded}
        aria-controls={regionId}
        $open={isExpanded}
      >
        {isExpanded ? collapseLabel : expandLabel}
      </CardExpandButton>
      <CardExpandRegion id={regionId} role="region" aria-labelledby={buttonId} $open={isExpanded}>
        <div>{expandContent}</div>
      </CardExpandRegion>
    </CardExpandSection>
  ) : null

  const selectionIndicator =
    selectable && isSelected ? (
      <CardSelectedIndicator aria-hidden="true">✓</CardSelectedIndicator>
    ) : null

  const content = (
    <>
      {children}
      {selectionIndicator}
      {expandSection}
    </>
  )

  // href + (actions|expandable): wrapper div + stretched-link.
  if (href && stretched) {
    return (
      <BaseCardContainer ref={ref} {...common}>
        <StretchedLink
          as={LinkTag}
          href={disabled ? undefined : href}
          aria-label={hrefLabel ?? 'Abrir'}
          tabIndex={disabled ? -1 : undefined}
          aria-disabled={disabled || undefined}
        />
        {content}
      </BaseCardContainer>
    )
  }

  // href sem actions/expandable: o próprio card é o link (comportamento original).
  if (href) {
    return (
      <BaseCardContainer
        as={LinkTag}
        href={disabled ? undefined : href}
        tabIndex={disabled ? -1 : undefined}
        aria-disabled={disabled || undefined}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...common}
      >
        {content}
      </BaseCardContainer>
    )
  }

  // onClick/seleção + (actions|expandable): wrapper div + stretched-button.
  if (interactive && stretched) {
    return (
      <BaseCardContainer ref={ref} {...common}>
        <StretchedButton
          type="button"
          onClick={handleClick}
          disabled={disabled}
          aria-label={hrefLabel ?? (selectable ? 'Selecionar' : 'Abrir')}
          {...selectableAria}
        />
        {content}
      </BaseCardContainer>
    )
  }

  // onClick/seleção sem actions/expandable: o card é um <button> real.
  if (interactive) {
    return (
      <BaseCardContainer
        as="button"
        type="button"
        disabled={disabled}
        onClick={handleClick}
        $isButton
        ref={ref as React.Ref<HTMLButtonElement>}
        {...selectableAria}
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
