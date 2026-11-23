'use client'

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  DayButton,
  FieldLabel,
  Footer,
  Grid,
  Header,
  MaskedDatePickerRoot,
  MonthTitle,
  NavButton,
  Panel,
  TextButton,
  Trigger
} from './MaskedDatePicker.styles'
import {
  addDays,
  addMonths,
  addYears,
  buildMonthGrid,
  clampISO,
  compareISO,
  endOfWeek,
  formatISO,
  monthLabel,
  parseISO,
  startOfWeek,
  todayISO,
  weekdayLabels
} from './dateGrid'
import { resolveDatePickerTokens } from './datePickerTokens'
import type { MaskedDatePickerProps } from './MaskedDatePicker.types'

const DICT = {
  pt: {
    choose: 'Escolher data',
    placeholder: 'Selecione uma data',
    prev: 'Mês anterior',
    next: 'Próximo mês',
    today: 'Hoje',
    clear: 'Limpar'
  },
  en: {
    choose: 'Choose date',
    placeholder: 'Select a date',
    prev: 'Previous month',
    next: 'Next month',
    today: 'Today',
    clear: 'Clear'
  }
} as const

/**
 * Seletor de data acessível (calendário em grade).
 *
 * A data trafega como "YYYY-MM-DD" (mesmo formato do <input type="date">),
 * sem fuso: nada desloca um dia. Teclado na grade: ←/→ (±1 dia), ↑/↓ (±1
 * semana), Home/End (início/fim da semana), PageUp/PageDown (±1 mês) e
 * Shift+PageUp/PageDown (±1 ano); Enter/Espaço escolhem; Esc fecha e devolve
 * o foco ao botão. Dias bloqueados (`min`, `max`, `isDateDisabled`) continuam
 * focáveis com `aria-disabled` e não podem ser escolhidos. `variant="inline"`
 * mostra o calendário sempre aberto. Nomes de mês/dia vêm do `Intl` no locale
 * do MaskedConfigProvider.
 *
 * Limitação: o painel não usa portal; dentro de um ancestral com
 * `overflow: hidden` ele pode ser cortado.
 *
 * @example
 * <MaskedDatePicker label="Data da consulta" onChange={setData} min="2026-01-01" />
 * <MaskedDatePicker variant="inline" defaultValue="2026-11-20" aria-label="Agenda" />
 */
export function MaskedDatePicker(props: MaskedDatePickerProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const baseId = useId()
  const {
    variant = 'popover',
    value: valueProp,
    defaultValue = null,
    onChange,
    min,
    max,
    isDateDisabled,
    weekStart = 0,
    label,
    ariaLabel,
    placeholder,
    clearable = true,
    name,
    disabled = false,
    colorTheme,
    tokens,
    className,
    style
  } = props

  const locale = config.locale ?? 'pt-BR'
  const dict = DICT[locale.toLowerCase().startsWith('en') ? 'en' : 'pt']
  const inline = variant === 'inline'
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const gridRef = useRef<HTMLTableElement>(null)
  const pendingFocus = useRef(false)

  const [inner, setInner] = useState<string | null>(defaultValue)
  const value = valueProp !== undefined ? valueProp : inner
  const today = todayISO()
  const initialFocus = () => clampISO(value && parseISO(value) ? value : today, min, max)
  const [focusIso, setFocusIso] = useState<string>(initialFocus)
  const [open, setOpen] = useState(false)
  const visible = inline || open
  const tokenStyle = resolveDatePickerTokens({ colorTheme, tokens }, theme)

  const isDisabled = useCallback(
    (iso: string) =>
      Boolean(
        (min && compareISO(iso, min) < 0) ||
        (max && compareISO(iso, max) > 0) ||
        isDateDisabled?.(iso)
      ),
    [min, max, isDateDisabled]
  )

  /* foco real no dia ativo, depois que a grade renderizou */
  useEffect(() => {
    if (!visible || !pendingFocus.current) return
    pendingFocus.current = false
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-iso="${focusIso}"]`)?.focus()
  }, [visible, focusIso])

  /* fechar: clique fora, foco saindo do componente e Escape */
  useEffect(() => {
    if (!open || inline) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, inline])

  function commit(next: string | null) {
    setInner(next)
    onChange?.(next)
  }

  function select(iso: string) {
    if (isDisabled(iso)) return
    commit(iso)
    setFocusIso(iso)
    if (!inline) {
      setOpen(false)
      triggerRef.current?.focus()
    }
  }

  function openPicker() {
    setFocusIso(initialFocus())
    pendingFocus.current = true
    setOpen(true)
  }

  function moveFocus(next: string) {
    pendingFocus.current = true
    setFocusIso(clampISO(next, min, max))
  }

  /** Troca de mês pelos botões ‹ ›: o foco fica no botão (não vai para a grade). */
  function shiftMonth(amount: number) {
    setFocusIso(clampISO(addMonths(focusIso, amount), min, max))
  }

  function onGridKeyDown(event: KeyboardEvent<HTMLTableElement>) {
    const keys: Record<string, string> = {
      ArrowLeft: addDays(focusIso, -1),
      ArrowRight: addDays(focusIso, 1),
      ArrowUp: addDays(focusIso, -7),
      ArrowDown: addDays(focusIso, 7),
      Home: startOfWeek(focusIso, weekStart),
      End: endOfWeek(focusIso, weekStart),
      PageUp: event.shiftKey ? addYears(focusIso, -1) : addMonths(focusIso, -1),
      PageDown: event.shiftKey ? addYears(focusIso, 1) : addMonths(focusIso, 1)
    }
    const next = keys[event.key]
    if (!next) return
    event.preventDefault()
    moveFocus(next)
  }

  const ymd = parseISO(focusIso) ?? parseISO(today)!
  const weeks = buildMonthGrid(ymd.year, ymd.month, weekStart)
  const labels = weekdayLabels(locale, weekStart)
  const titleId = `${baseId}-title`
  const labelId = `${baseId}-label`
  const valueId = `${baseId}-value`
  const shown =
    value && parseISO(value) ? formatISO(value, locale) : (placeholder ?? dict.placeholder)

  const calendar = (
    <Panel
      $inline={inline}
      role={inline ? 'group' : 'dialog'}
      aria-label={ariaLabel ?? (typeof label === 'string' ? label : dict.choose)}
    >
      <Header>
        <NavButton type="button" aria-label={dict.prev} onClick={() => shiftMonth(-1)}>
          ‹
        </NavButton>
        <MonthTitle id={titleId} aria-live="polite">
          {monthLabel(ymd.year, ymd.month, locale)}
        </MonthTitle>
        <NavButton type="button" aria-label={dict.next} onClick={() => shiftMonth(1)}>
          ›
        </NavButton>
      </Header>
      <Grid ref={gridRef} role="grid" aria-labelledby={titleId} onKeyDown={onGridKeyDown}>
        <thead>
          <tr>
            {labels.map((day) => (
              <th key={day.long} scope="col" abbr={day.long}>
                {day.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, row) => (
            <tr key={row}>
              {week.map((iso, col) =>
                iso ? (
                  <td key={iso} role="gridcell" aria-selected={iso === value}>
                    <DayButton
                      type="button"
                      data-iso={iso}
                      tabIndex={iso === focusIso ? 0 : -1}
                      aria-label={formatISO(iso, locale, { dateStyle: 'full' })}
                      aria-current={iso === today ? 'date' : undefined}
                      aria-disabled={isDisabled(iso) || undefined}
                      $selected={iso === value}
                      $today={iso === today}
                      $disabled={isDisabled(iso)}
                      onFocus={() => iso !== focusIso && setFocusIso(iso)}
                      onClick={() => select(iso)}
                    >
                      {parseISO(iso)?.day}
                    </DayButton>
                  </td>
                ) : (
                  <td key={`empty-${row}-${col}`} role="gridcell" aria-hidden="true" />
                )
              )}
            </tr>
          ))}
        </tbody>
      </Grid>
      <Footer>
        <TextButton
          type="button"
          onClick={() => (isDisabled(today) ? moveFocus(today) : select(today))}
        >
          {dict.today}
        </TextButton>
        {clearable && value && (
          <TextButton
            type="button"
            onClick={() => {
              commit(null)
              if (!inline) setOpen(false)
              if (!inline) triggerRef.current?.focus()
            }}
          >
            {dict.clear}
          </TextButton>
        )}
      </Footer>
    </Panel>
  )

  return (
    <MaskedDatePickerRoot ref={rootRef} className={className} style={{ ...tokenStyle, ...style }}>
      {label && <FieldLabel id={labelId}>{label}</FieldLabel>}
      {name && <input type="hidden" name={name} value={value ?? ''} />}
      {!inline && (
        <Trigger
          ref={triggerRef}
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={label ? undefined : ariaLabel}
          aria-labelledby={label ? `${labelId} ${valueId}` : undefined}
          onClick={() => (open ? setOpen(false) : openPicker())}
        >
          <span id={valueId}>{shown}</span>
          <span aria-hidden="true">📅</span>
        </Trigger>
      )}
      {visible && calendar}
    </MaskedDatePickerRoot>
  )
}
