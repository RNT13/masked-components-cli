'use client'

import { useEffect, useId, useMemo, useState, type KeyboardEvent } from 'react'
import { useControllable } from '@/hooks/useControllable'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { MaskedPopup } from '@/components/ui/MaskedPopup/MaskedPopup'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  Empty,
  GroupLabel,
  Option,
  OptionDescription,
  OptionIcon,
  OptionLabel,
  OptionText,
  PaletteBody,
  Results,
  SearchInput,
  SearchRow,
  Shortcut,
  SrOnly
} from './MaskedCommandPalette.styles'
import {
  filterCommands,
  firstEnabled,
  groupCommands,
  moveActive,
  resolveCommandPaletteTokens
} from './commandPaletteTokens'
import type { CommandItem, MaskedCommandPaletteProps } from './MaskedCommandPalette.types'

const DICT = {
  pt: {
    label: 'Paleta de comandos',
    input: 'Buscar comando',
    placeholder: 'Digite um comando ou busque…',
    empty: 'Nenhum resultado',
    count: (n: number) => (n === 1 ? '1 resultado' : `${n} resultados`)
  },
  en: {
    label: 'Command palette',
    input: 'Search commands',
    placeholder: 'Type a command or search…',
    empty: 'No results',
    count: (n: number) => (n === 1 ? '1 result' : `${n} results`)
  }
} as const

/**
 * Paleta de comandos (busca rápida de ações), aberta por Ctrl/⌘ + K.
 *
 * Acessibilidade: diálogo modal nomeado (MaskedPopup: portal, foco preso,
 * Escape fecha) com o padrão combobox + listbox — o foco fica no campo e o
 * item ativo é anunciado por `aria-activedescendant`. ↑/↓ (com volta),
 * Home/End movem entre itens habilitados, Enter executa, o mouse também
 * ativa/clica. A contagem de resultados e o "nenhum resultado" são
 * anunciados em região viva. A busca ignora acentos e caixa, aceita vários
 * termos e ordena por relevância (rótulo, sinônimos, grupo, descrição).
 *
 * @example
 * <MaskedCommandPalette items={[{ id: 'novo', label: 'Novo cliente', group: 'Clientes', onSelect: criarCliente }]} />
 */
export function MaskedCommandPalette(props: MaskedCommandPaletteProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const listId = useId()
  const {
    variant = 'default',
    items,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    onSelect,
    hotkey = 'k',
    label,
    placeholder,
    emptyMessage,
    width = '36rem',
    colorTheme,
    tokens,
    className,
    style
  } = props

  const [open, setOpen] = useControllable<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange
  })
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const dict = DICT[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']
  const tokenStyle = resolveCommandPaletteTokens({ colorTheme, tokens }, theme)

  const groups = useMemo(() => groupCommands(filterCommands(items, query)), [items, query])
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups])
  const optionId = (index: number) => `${listId}-option-${index}`

  /* abrir: busca limpa e primeiro item habilitado ativo */
  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(Math.max(0, firstEnabled(items)))
    }
  }, [open])

  /* atalho global Ctrl/⌘ + tecla */
  useEffect(() => {
    if (hotkey === false) return
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === hotkey.toLowerCase()) {
        event.preventDefault()
        setOpen(!open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hotkey, open])

  /* manter o item ativo visível na lista com rolagem */
  useEffect(() => {
    if (!open) return
    document.getElementById(optionId(active))?.scrollIntoView?.({ block: 'nearest' })
  }, [active, open])

  function choose(item: CommandItem) {
    if (item.disabled) return
    item.onSelect?.(item)
    onSelect?.(item)
    setOpen(false)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((index) => moveActive(flat, index, 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((index) => moveActive(flat, index, -1))
    } else if (event.key === 'Home') {
      event.preventDefault()
      setActive(Math.max(0, firstEnabled(flat)))
    } else if (event.key === 'End') {
      event.preventDefault()
      const last = [...flat].reverse().findIndex((item) => !item.disabled)
      setActive(last === -1 ? 0 : flat.length - 1 - last)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const item = flat[active]
      if (item) choose(item)
    }
  }

  const activeItem = flat[active]
  let counter = -1

  return (
    <MaskedPopup
      isOpen={open}
      onClose={() => setOpen(false)}
      width={width}
      maxWidth="calc(100vw - 2rem)"
      ariaLabel={label ?? dict.label}
      colorTheme={colorTheme}
      className={className}
      style={{ ['--mc-popup-padding' as string]: '0', ...tokenStyle, ...style }}
    >
      <PaletteBody>
        <SearchRow>
          <SearchInput
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeItem ? optionId(active) : undefined}
            aria-label={dict.input}
            autoComplete="off"
            spellCheck={false}
            placeholder={placeholder ?? dict.placeholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
          />
        </SearchRow>
        <Results>
          <div id={listId} role="listbox" aria-label={dict.input}>
            {groups.map((group, groupIndex) => {
              const titleId = `${listId}-group-${groupIndex}`
              const options = group.items.map((item) => {
                counter += 1
                const index = counter
                return (
                  <Option
                    key={item.id}
                    id={optionId(index)}
                    role="option"
                    aria-selected={index === active}
                    aria-disabled={item.disabled || undefined}
                    $variant={variant}
                    $active={index === active}
                    $disabled={item.disabled}
                    onMouseMove={() => !item.disabled && setActive(index)}
                    onClick={() => choose(item)}
                  >
                    {variant === 'default' && item.icon && (
                      <OptionIcon aria-hidden="true">{item.icon}</OptionIcon>
                    )}
                    <OptionText>
                      <OptionLabel>{item.label}</OptionLabel>
                      {variant === 'default' && item.description && (
                        <OptionDescription>{item.description}</OptionDescription>
                      )}
                    </OptionText>
                    {item.shortcut && <Shortcut>{item.shortcut}</Shortcut>}
                  </Option>
                )
              })
              return group.group ? (
                <div key={group.group} role="group" aria-labelledby={titleId}>
                  <GroupLabel id={titleId}>{group.group}</GroupLabel>
                  {options}
                </div>
              ) : (
                <div key="ungrouped" role="presentation">
                  {options}
                </div>
              )
            })}
          </div>
          {flat.length === 0 && <Empty>{emptyMessage ?? dict.empty}</Empty>}
        </Results>
        <SrOnly role="status" aria-live="polite">
          {flat.length === 0 ? (emptyMessage ?? dict.empty) : dict.count(flat.length)}
        </SrOnly>
      </PaletteBody>
    </MaskedPopup>
  )
}
