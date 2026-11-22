'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import {
  SelectCheck,
  SelectChevron,
  SelectListbox,
  SelectOptionIcon,
  SelectOptionItem,
  SelectRoot,
  SelectTrigger
} from './MaskedSelect.styles'
import {
  edgeEnabledOption,
  findOptionByText,
  nextEnabledOption,
  resolveSelectTokens
} from './selectTokens'
import type { MaskedSelectProps } from './MaskedSelect.types'

const DICT = {
  pt: { select: 'Selecionar', selected: 'selecionado' },
  en: { select: 'Select', selected: 'selected' }
} as const

/**
 * Select acessível (padrão WAI-ARIA listbox).  
 *
 * Semântica: trigger `aria-haspopup="listbox"` + `aria-expanded`; popup  
 * `role="listbox"` com `role="option"` (`aria-selected`). Setas ↑/↓ abrem e  
 * navegam, Home/End vão às bordas, Enter/Espaço selecionam, Escape fecha e  
 * devolve foco ao trigger, Tab fecha. Typeahead: digitar letras salta para a  
 * opção correspondente. Clique fora fecha.  
 *
 * `label` nomeia o select para leitores de tela (default localizado via  
 * MaskedConfigProvider). `placeholder` aparece quando nada está selecionado.  
 */
export function MaskedSelect({
  options,
  value,
  defaultValue,
  onChange,
  placeholder,
  label,
  size = 'md',
  disabled = false,
  colorTheme,
  tokens,
  className,
  style,
  ...rest
}: MaskedSelectProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const dict = DICT[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']

  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const typeaheadRef = useRef('')
  const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const [internal, setInternal] = useState<string | undefined>(defaultValue)
  const selected = value !== undefined ? value : internal
  const selectedIndex = options.findIndex((o) => o.value === selected)
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined

  const tokenStyle = resolveSelectTokens({ colorTheme, tokens }, theme)

  const close = (focusTrigger = true) => {
    setOpen(false)
    setHighlighted(-1)
    if (focusTrigger) triggerRef.current?.focus()
  }

  const select = (index: number) => {
    const opt = options[index]
    if (!opt || opt.disabled) return
    if (value === undefined) setInternal(opt.value)
    onChange?.(opt.value)
    close()
  }

  const openListbox = (startAt?: number) => {
    if (disabled) return
    setOpen(true)
    setHighlighted(
      startAt ??
        (selectedIndex >= 0 && !options[selectedIndex].disabled
          ? selectedIndex
          : edgeEnabledOption(options, 'first'))
    )
  }

  /* Clique fora fecha */
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  /* Scroll até a opção destacada */
  useEffect(() => {
    if (!open || highlighted < 0) return
    document.getElementById(`${listboxId}-opt-${highlighted}`)?.scrollIntoView({ block: 'nearest' })
  }, [highlighted, open, listboxId])

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openListbox(e.key === 'ArrowUp' ? edgeEnabledOption(options, 'last') : undefined)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlighted((h) => nextEnabledOption(options, h, 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlighted((h) => nextEnabledOption(options, h, -1))
        break
      case 'Home':
        e.preventDefault()
        setHighlighted(edgeEnabledOption(options, 'first'))
        break
      case 'End':
        e.preventDefault()
        setHighlighted(edgeEnabledOption(options, 'last'))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (highlighted >= 0) select(highlighted)
        break
      case 'Escape':
        e.preventDefault()
        e.stopPropagation()
        close()
        break
      case 'Tab':
        close(false)
        break
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          typeaheadRef.current += e.key
          clearTimeout(typeaheadTimer.current)
          typeaheadTimer.current = setTimeout(() => (typeaheadRef.current = ''), 500)
          const idx = findOptionByText(options, typeaheadRef.current, highlighted)
          if (idx >= 0) setHighlighted(idx)
        }
    }
  }

  return (
    <SelectRoot ref={rootRef} className={className} style={{ ...tokenStyle, ...style }} {...rest}>
      <SelectTrigger
        ref={triggerRef}
        type="button"
        $size={size}
        $disabled={disabled}
        disabled={disabled}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={label ?? dict.select}
        aria-activedescendant={
          open && highlighted >= 0 ? `${listboxId}-opt-${highlighted}` : undefined
        }
        data-placeholder={selectedOption ? 'false' : 'true'}
        onClick={() => (open ? close() : openListbox())}
        onKeyDown={onTriggerKeyDown}
      >
        <span>{selectedOption ? selectedOption.label : (placeholder ?? dict.select)}</span>
        <SelectChevron $size={size} $open={open} aria-hidden="true">
          ▼
        </SelectChevron>
      </SelectTrigger>

      {open && (
        <SelectListbox role="listbox" id={listboxId} aria-label={label ?? dict.select}>
          {options.map((opt, i) => (
            <SelectOptionItem
              key={opt.value}
              id={`${listboxId}-opt-${i}`}
              role="option"
              aria-selected={opt.value === selected}
              aria-disabled={opt.disabled || undefined}
              $size={size}
              $highlighted={i === highlighted}
              $selected={opt.value === selected}
              $disabled={opt.disabled}
              onMouseEnter={() => !opt.disabled && setHighlighted(i)}
              onClick={() => select(i)}
            >
              {opt.icon && <SelectOptionIcon aria-hidden="true">{opt.icon}</SelectOptionIcon>}
              {opt.label}
              {opt.value === selected && <SelectCheck aria-label={dict.selected}>✓</SelectCheck>}
            </SelectOptionItem>
          ))}
        </SelectListbox>
      )}
    </SelectRoot>
  )
}
