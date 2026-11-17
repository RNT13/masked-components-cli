'use client'

import { Children, isValidElement, useCallback, useMemo, useReducer, useRef, useState } from 'react'
import type { KeyboardEvent, ReactElement } from 'react'
import { CardGroupContext } from './CardGroupContext'
import type { CardGroupContextValue } from './CardGroupContext'
import { CardGroupGrid } from './MaskedCardGroup.styles'
import type { MaskedCardGroupProps } from './MaskedCardGroup.types'
import { nextEnabledValue, resolveGroupValue, toggleGroupValue } from '../behaviors/cardGroupLogic'
import type { GroupItem } from '../behaviors/cardGroupLogic'
import type { CardSelectionMode } from '../MaskedCards.types'

type RegisteredItem = GroupItem & { el: HTMLElement }

/**
 * Grupo de seleção de cards. Envolve MaskedCards com `selectionValue`.  
 * single → role="radiogroup" + radios com roving tabindex e setas.  
 * multiple → role="group" + checkboxes (Space alterna, sem roving).  
 */
export function MaskedCardGroup(props: MaskedCardGroupProps) {
  const {
    ariaLabel,
    ariaLabelledBy,
    disabled,
    minItemWidth = 240,
    gap,
    className,
    style,
    children
  } = props

  const mode: CardSelectionMode = props.selectionMode ?? 'single'

  const [internalValue, setInternalValue] = useState<string | string[]>(
    props.defaultValue ?? (mode === 'multiple' ? [] : '')
  )
  const isControlled = props.value !== undefined
  const current: string | string[] = isControlled
    ? (props.value as string | string[])
    : internalValue

  const itemsRef = useRef<Map<string, RegisteredItem>>(new Map())
  const orderRef = useRef<string[]>([])

  /**
   * Os itens se registram via callback ref (após o commit). Sem estado,  
   * o primeiro render calcula tabIndex com o mapa vazio e nunca  
   * recalcula — bump força um re-render a cada registro/desregistro.  
   */
  const [, bumpRegistration] = useReducer((x: number) => x + 1, 0)

  const emitChange = useCallback(
    (next: string | string[]) => {
      if (!isControlled) setInternalValue(next)
      if (mode === 'multiple') {
        ;(props.onValueChange as ((v: string[]) => void) | undefined)?.(next as string[])
      } else {
        ;(props.onValueChange as ((v: string) => void) | undefined)?.(next as string)
      }
    },
    [isControlled, mode, props]
  )

  const isSelected = useCallback(
    (value: string) =>
      mode === 'multiple' ? Array.isArray(current) && current.includes(value) : current === value,
    [mode, current]
  )

  const select = useCallback(
    (value: string) => {
      if (disabled) return
      emitChange(toggleGroupValue(current, value, mode))
    },
    [disabled, current, mode, emitChange]
  )

  const orderedItems = useCallback((): GroupItem[] => {
    return orderRef.current
      .map((v) => itemsRef.current.get(v))
      .filter((i): i is RegisteredItem => i !== undefined)
  }, [])

  const register = useCallback((value: string, el: HTMLElement, itemDisabled: boolean) => {
    itemsRef.current.set(value, { value, disabled: itemDisabled, el })
    if (!orderRef.current.includes(value)) orderRef.current.push(value)
    bumpRegistration()
    return () => {
      itemsRef.current.delete(value)
      orderRef.current = orderRef.current.filter((v) => v !== value)
      bumpRegistration()
    }
  }, [])

  const tabIndexFor = useCallback(
    (value: string, itemDisabled: boolean): number => {
      if (mode === 'multiple') return itemDisabled || disabled ? -1 : 0
      if (itemDisabled || disabled) return -1
      const items = orderedItems()
      const selected = items.find((i) => isSelected(i.value) && !i.disabled)
      if (selected) return selected.value === value ? 0 : -1
      const firstEnabled = items.find((i) => !i.disabled)
      return firstEnabled?.value === value ? 0 : -1
    },
    [mode, disabled, orderedItems, isSelected]
  )

  const onCardKeyDown = useCallback(
    (value: string, event: KeyboardEvent<HTMLElement>) => {
      if (disabled) return
      const items = orderedItems()
      const from = items.findIndex((i) => i.value === value)
      if (from === -1) return

      if (mode === 'multiple') {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          select(value)
        }
        return
      }

      const target = nextEnabledValue(items, from, event.key)
      if (target === null) return
      event.preventDefault()
      const item = itemsRef.current.get(target)
      item?.el.focus()
      select(target)
    },
    [disabled, mode, orderedItems, select]
  )

  const contextValue = useMemo<CardGroupContextValue>(
    () => ({
      mode,
      disabled: !!disabled,
      isSelected,
      select,
      tabIndexFor,
      onCardKeyDown,
      register
    }),
    [mode, disabled, isSelected, select, tabIndexFor, onCardKeyDown, register]
  )

  // resolveGroupValue: expõe o valor do item em um índice (uso futuro/testes).
  void resolveGroupValue

  const childArray = Children.toArray(children).filter(isValidElement) as ReactElement[]

  return (
    <CardGroupContext.Provider value={contextValue}>
      <CardGroupGrid
        role={mode === 'multiple' ? 'group' : 'radiogroup'}
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
        $minItemWidth={minItemWidth}
        $gap={gap}
        className={className}
        style={style}
      >
        {childArray}
      </CardGroupGrid>
    </CardGroupContext.Provider>
  )
}
