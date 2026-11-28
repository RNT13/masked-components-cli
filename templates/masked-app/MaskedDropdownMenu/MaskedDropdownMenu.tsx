'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { useControllable } from '@/hooks/useControllable'
import { useClickOutside } from '@/hooks/masked-primitives/useClickOutside'
import {
  MenuItemButton,
  MenuItemIcon,
  MenuItemShortcut,
  MenuPopup,
  MenuRoot,
  MenuSeparatorLine,
  MenuTrigger
} from './MaskedDropdownMenu.styles'
import { edgeEnabledItem, nextEnabledItem, resolveMenuTokens } from './menuTokens'
import { isSeparator, type MaskedDropdownMenuProps } from './MaskedDropdownMenu.types'

const DICT = {
  pt: { menu: 'Menu de ações' },
  en: { menu: 'Actions menu' }
} as const

/**
 * Menu de ações suspenso (padrão WAI-ARIA menu/menuitem).  
 *
 * O trigger tem `aria-haspopup="menu"` e `aria-expanded`; o popup é  
 * `role="menu"` com itens `role="menuitem"`. Setas ↑/↓ navegam (wrap),  
 * Home/End vão às bordas, Enter/Espaço selecionam, Escape fecha e devolve o  
 * foco ao trigger, clique fora fecha. Separadores e itens desabilitados são  
 * pulados na navegação.  
 *
 * `label` nomeia o menu para leitores de tela; quando omitido, usa o padrão  
 * localizado do MaskedConfigProvider.  
 */
export function MaskedDropdownMenu({
  trigger,
  items,
  open,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom-start',
  label,
  disabled = false,
  colorTheme,
  tokens,
  className,
  style,
  ...rest
}: MaskedDropdownMenuProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const dict = DICT[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']

  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

  const [isOpen, setIsOpen] = useControllable<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange
  })
  const [highlighted, setHighlighted] = useState(-1)

  /* Modelo plano para navegação: separadores contam como posição. */
  const navModel = items.map((entry) => ({
    separator: isSeparator(entry),
    disabled: !isSeparator(entry) && entry.disabled === true
  }))

  const setOpen = (next: boolean) => {
    setIsOpen(next)
    if (!next) setHighlighted(-1)
  }

  const openMenu = (highlight: 'first' | 'last' | 'none' = 'first') => {
    setOpen(true)
    if (highlight !== 'none') {
      setHighlighted(edgeEnabledItem(navModel, highlight))
    }
  }

  /* Clique fora fecha. */
  useClickOutside(rootRef, isOpen, () => setOpen(false))

  /* Foco acompanha o item destacado. */
  useEffect(() => {
    if (highlighted >= 0) itemRefs.current[highlighted]?.focus()
  }, [highlighted])

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      openMenu('first')
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      openMenu('last')
    }
  }

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setHighlighted((h) => nextEnabledItem(navModel, h, 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setHighlighted((h) => nextEnabledItem(navModel, h, -1))
        break
      case 'Home':
        event.preventDefault()
        setHighlighted(edgeEnabledItem(navModel, 'first'))
        break
      case 'End':
        event.preventDefault()
        setHighlighted(edgeEnabledItem(navModel, 'last'))
        break
      case 'Escape':
        event.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  const tokenStyle = resolveMenuTokens({ colorTheme, tokens }, theme)

  let itemIndex = -1

  return (
    <MenuRoot ref={rootRef} className={className} style={{ ...tokenStyle, ...style }} {...rest}>
      <MenuTrigger
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        disabled={disabled}
        onClick={() => (isOpen ? setOpen(false) : openMenu('first'))}
        onKeyDown={onTriggerKeyDown}
      >
        {trigger}
      </MenuTrigger>

      {isOpen && (
        <MenuPopup
          id={menuId}
          role="menu"
          aria-label={label ?? dict.menu}
          $placement={placement}
          onKeyDown={onMenuKeyDown}
        >
          {items.map((entry, i) => {
            if (isSeparator(entry)) {
              return <MenuSeparatorLine key={`sep-${i}`} role="separator" />
            }
            itemIndex += 1
            const idx = itemIndex
            return (
              <MenuItemButton
                key={entry.id}
                ref={(el) => {
                  itemRefs.current[idx] = el
                }}
                role="menuitem"
                tabIndex={-1}
                disabled={entry.disabled}
                $danger={entry.danger}
                data-highlighted={highlighted === idx ? '' : undefined}
                onMouseEnter={() => !entry.disabled && setHighlighted(idx)}
                onClick={() => {
                  entry.onSelect?.()
                  setOpen(false)
                  triggerRef.current?.focus()
                }}
              >
                {entry.icon && <MenuItemIcon aria-hidden="true">{entry.icon}</MenuItemIcon>}
                <span>{entry.label}</span>
                {entry.shortcut && (
                  <MenuItemShortcut aria-hidden="true">{entry.shortcut}</MenuItemShortcut>
                )}
              </MenuItemButton>
            )
          })}
        </MenuPopup>
      )}
    </MenuRoot>
  )
}
