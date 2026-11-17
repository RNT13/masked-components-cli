'use client'

import { useCallback, useContext, useRef } from 'react'
import { CardGroupContext } from '../Group/CardGroupContext'

export interface UseCardGroupResult {
  grouped: boolean
  isSelected: boolean
  role: 'radio' | 'checkbox'
  tabIndex: number | undefined
  select: () => void
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void
  registerRef: (el: HTMLElement | null) => void
  effectiveDisabled: boolean
}

export function useCardGroup(selectionValue: string | number | undefined, cardDisabled?: boolean): UseCardGroupResult {
  const group = useContext(CardGroupContext)
  const cleanups = useRef(new Map<HTMLElement, () => void>())
  const lastEl = useRef<HTMLElement | null>(null)

  const registerRef = useCallback(
    (el: HTMLElement | null) => {
      if (!group || selectionValue === undefined) return
      const key = String(selectionValue)
      if (lastEl.current && lastEl.current !== el) {
        cleanups.current.get(lastEl.current)?.()
        cleanups.current.delete(lastEl.current)
      }
      if (el) {
        cleanups.current.get(el)?.()
        cleanups.current.set(el, group.register(key, el, group.disabled || !!cardDisabled))
        lastEl.current = el
      } else if (lastEl.current) {
        cleanups.current.get(lastEl.current)?.()
        cleanups.current.delete(lastEl.current)
        lastEl.current = null
      }
    },
    [group, selectionValue, cardDisabled]
  )

  if (!group || selectionValue === undefined) {
    return { grouped: false } as UseCardGroupResult
  }

  const key = String(selectionValue)
  const effectiveDisabled = group.disabled || !!cardDisabled

  return {
    grouped: true,
    isSelected: group.isSelected(key),
    role: group.mode === 'multiple' ? 'checkbox' : 'radio',
    tabIndex: group.tabIndexFor(key, effectiveDisabled),
    select: () => {
      if (!effectiveDisabled) group.select(key)
    },
    onKeyDown: event => group.onCardKeyDown(key, event),
    registerRef,
    effectiveDisabled
  }
}
