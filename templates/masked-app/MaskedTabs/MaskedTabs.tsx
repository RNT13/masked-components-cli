'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { MaskedTabsRoot, TabButton, TabList, TabPanel } from './MaskedTabs.styles'
import { edgeEnabledIndex, nextEnabledIndex, resolveTabsTokens } from './tabsTokens'
import type { MaskedTabsProps } from './MaskedTabs.types'

const DICT = {
  pt: { nav: 'Navegação por abas' },
  en: { nav: 'Tab navigation' }
} as const

/**
 * Abas acessíveis (padrão WAI-ARIA tabs).  
 *
 * Semântica: `role="tablist"` > `role="tab"` (aria-selected, aria-controls)  
 * e `role="tabpanel"` (aria-labelledby). Só a aba ativa entra na ordem de Tab  
 * (roving tabindex); setas ←/→ (↑/↓ no 'vertical'), Home e End movem entre  
 * abas habilitadas. `activation="manual"` separa foco de seleção. Os painéis  
 * inativos ficam `hidden`; use `lazy` para não renderizar o conteúdo deles.  
 *
 * `label` nomeia a tablist para leitores de tela; quando omitido, usa o  
 * padrão localizado do MaskedConfigProvider ('Navegação por abas'/'Tab  
 * navigation').  
 *
 * Nota: o estado de seleção é próprio do componente (ponto de unificação  
 * futura com `useSelectable`).  
 *
 * @example  
 * <MaskedTabs label="Cliente" items={[{ id: 'dados', label: 'Dados', content: <Dados /> }, { id: 'agenda', label: 'Agenda', content: <Agenda /> }]} />  
 */
export function MaskedTabs(props: MaskedTabsProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const dict = DICT[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']
  const baseId = useId()
  const refs = useRef(new Map<string, HTMLButtonElement>())
  const {
    variant = 'line',
    items,
    value,
    defaultValue,
    onChange,
    activation = 'automatic',
    lazy = false,
    label,
    colorTheme,
    tokens,
    className,
    style,
    ...rest
  } = props

  const firstEnabled = items.find((item) => !item.disabled)?.id
  const [inner, setInner] = useState(defaultValue ?? firstEnabled)
  const selected = value ?? inner
  const vertical = variant === 'vertical'
  const tokenStyle = resolveTabsTokens({ colorTheme, tokens }, theme)
  const disabled = items.map((item) => Boolean(item.disabled))

  function select(id: string) {
    setInner(id)
    onChange?.(id)
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = items.findIndex(
      (item) => item.id === document.activeElement?.getAttribute('data-tab-id')
    )
    const from =
      current === -1
        ? Math.max(
            0,
            items.findIndex((item) => item.id === selected)
          )
        : current
    const prev = vertical ? 'ArrowUp' : 'ArrowLeft'
    const next = vertical ? 'ArrowDown' : 'ArrowRight'
    let target: number | undefined

    if (event.key === next) target = nextEnabledIndex(disabled, from, 1)
    else if (event.key === prev) target = nextEnabledIndex(disabled, from, -1)
    else if (event.key === 'Home') target = edgeEnabledIndex(disabled, 'first')
    else if (event.key === 'End') target = edgeEnabledIndex(disabled, 'last')
    if (target === undefined) return

    event.preventDefault()
    const item = items[target]
    refs.current.get(item.id)?.focus()
    if (activation === 'automatic') select(item.id)
  }

  const tabId = (id: string) => `${baseId}-tab-${id}`
  const panelId = (id: string) => `${baseId}-panel-${id}`

  return (
    <MaskedTabsRoot
      $variant={variant}
      className={className}
      style={{ ...tokenStyle, ...style }}
      {...rest}
    >
      <TabList
        role="tablist"
        aria-label={label ?? dict.nav}
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
        $variant={variant}
        onKeyDown={onKeyDown}
      >
        {items.map((item) => {
          const active = item.id === selected
          return (
            <TabButton
              key={item.id}
              ref={(node) => {
                if (node) refs.current.set(item.id, node)
                else refs.current.delete(item.id)
              }}
              type="button"
              role="tab"
              id={tabId(item.id)}
              data-tab-id={item.id}
              aria-selected={active}
              aria-controls={panelId(item.id)}
              tabIndex={active ? 0 : -1}
              disabled={item.disabled}
              $variant={variant}
              $active={active}
              onClick={() => select(item.id)}
            >
              {item.icon && <span aria-hidden="true">{item.icon}</span>}
              {item.label}
            </TabButton>
          )
        })}
      </TabList>
      {items.map((item) => {
        const active = item.id === selected
        return (
          <TabPanel
            key={item.id}
            role="tabpanel"
            id={panelId(item.id)}
            aria-labelledby={tabId(item.id)}
            hidden={!active}
            tabIndex={0}
          >
            {lazy && !active ? null : item.content}
          </TabPanel>
        )
      })}
    </MaskedTabsRoot>
  )
}
