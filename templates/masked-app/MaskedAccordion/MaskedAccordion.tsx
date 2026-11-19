'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  AccordionHeading,
  AccordionItemEl,
  AccordionPanel,
  AccordionTrigger,
  MaskedAccordionRoot
} from './MaskedAccordion.styles'
import { resolveAccordionTokens, toggleOpen } from './accordionTokens'
import type { MaskedAccordionProps } from './MaskedAccordion.types'

/**
 * Accordion acessível (padrão WAI-ARIA accordion).
 *
 * Semântica: cada título é um heading com um <button aria-expanded
 * aria-controls> e o painel é `role="region"` rotulado pelo botão (`hidden`
 * quando fechado). ↑/↓, Home e End movem o foco entre os títulos. Funciona
 * controlado (`value`/`onChange`) ou não (`defaultValue`); `multiple` abre
 * vários ao mesmo tempo. O indicador não anima com `prefers-reduced-motion`.
 *
 * Nota: o estado de expansão é próprio do componente (ponto de unificação
 * futura com `useExpandable`). Para perguntas frequentes sem estado
 * controlado, veja o MaskedFAQ (<details> nativo).
 *
 * @example
 * <MaskedAccordion multiple items={[{ id: 'a', title: 'Plano', content: '…' }]} defaultValue={['a']} />
 */
export function MaskedAccordion(props: MaskedAccordionProps) {
  const theme = useMaskedTheme()
  const baseId = useId()
  const triggers = useRef(new Map<string, HTMLButtonElement>())
  const {
    variant = 'default',
    items,
    multiple = false,
    collapsible = true,
    value,
    defaultValue,
    onChange,
    headingLevel = 3,
    colorTheme,
    tokens,
    className,
    style,
    ...rest
  } = props

  const [inner, setInner] = useState<string[]>(defaultValue ?? [])
  const open = value ?? inner
  const tokenStyle = resolveAccordionTokens({ colorTheme, tokens }, theme)

  function toggle(id: string) {
    const next = toggleOpen(open, id, { multiple, collapsible })
    setInner(next)
    onChange?.(next)
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const enabled = items.filter((item) => !item.disabled).map((item) => item.id)
    const active = document.activeElement?.getAttribute('data-accordion-id') ?? ''
    const index = enabled.indexOf(active)
    if (index === -1) return
    let target: number | undefined
    if (event.key === 'ArrowDown') target = (index + 1) % enabled.length
    else if (event.key === 'ArrowUp') target = (index - 1 + enabled.length) % enabled.length
    else if (event.key === 'Home') target = 0
    else if (event.key === 'End') target = enabled.length - 1
    if (target === undefined) return
    event.preventDefault()
    triggers.current.get(enabled[target])?.focus()
  }

  return (
    <MaskedAccordionRoot
      $variant={variant}
      className={className}
      style={{ ...tokenStyle, ...style }}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {items.map((item) => {
        const isOpen = open.includes(item.id)
        const triggerId = `${baseId}-trigger-${item.id}`
        const panelId = `${baseId}-panel-${item.id}`
        return (
          <AccordionItemEl key={item.id} $variant={variant}>
            <AccordionHeading as={`h${headingLevel}` as 'h3'}>
              <AccordionTrigger
                ref={(node) => {
                  if (node) triggers.current.set(item.id, node)
                  else triggers.current.delete(item.id)
                }}
                type="button"
                id={triggerId}
                data-accordion-id={item.id}
                aria-expanded={isOpen}
                aria-controls={panelId}
                disabled={item.disabled}
                $variant={variant}
                $open={isOpen}
                onClick={() => toggle(item.id)}
              >
                <span>{item.title}</span>
              </AccordionTrigger>
            </AccordionHeading>
            <AccordionPanel
              role="region"
              id={panelId}
              aria-labelledby={triggerId}
              hidden={!isOpen}
              $variant={variant}
            >
              {item.content}
            </AccordionPanel>
          </AccordionItemEl>
        )
      })}
    </MaskedAccordionRoot>
  )
}
