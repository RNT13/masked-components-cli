'use client'

import { useCallback, useRef } from 'react'
import { useCardGroupContext } from '../Group/CardGroupContext'
import type { KeyboardEvent } from 'react'

export interface GroupedCardBehavior {
  grouped: true
  isSelected: boolean
  role: 'radio' | 'checkbox'
  tabIndex: number
  select: () => void
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void
  /** Callback ref para o elemento interativo (button/stretched-button). */
  registerRef: (el: HTMLElement | null) => void
  /** disabled efetivo: grupo desabilitado OU card desabilitado. */
  effectiveDisabled: boolean
}

export type CardGroupBehavior = GroupedCardBehavior | { grouped: false }

/**
 * Adapta o card ao MaskedCardGroup. Fora de grupo (ou sem selectionValue),  
 * retorna { grouped: false } e o BaseCard usa o comportamento avulso.  
 * Dentro do grupo, as props de seleção avulsas do card são ignoradas.  
 */
export function useCardGroup(
  selectionValue: string | undefined,
  cardDisabled: boolean | undefined
): CardGroupBehavior {
  const group = useCardGroupContext()
  const cleanupRef = useRef<(() => void) | null>(null)

  const registerRef = useCallback(
    (el: HTMLElement | null) => {
      cleanupRef.current?.()
      cleanupRef.current = null
      if (el && group && selectionValue !== undefined) {
        cleanupRef.current = group.register(selectionValue, el, group.disabled || !!cardDisabled)
      }
    },
    [group, selectionValue, cardDisabled]
  )

  if (!group || selectionValue === undefined) return { grouped: false }

  const effectiveDisabled = group.disabled || !!cardDisabled

  return {
    grouped: true,
    isSelected: group.isSelected(selectionValue),
    role: group.mode === 'multiple' ? 'checkbox' : 'radio',
    tabIndex: group.tabIndexFor(selectionValue, effectiveDisabled),
    select: () => {
      if (!effectiveDisabled) group.select(selectionValue)
    },
    onKeyDown: (event) => group.onCardKeyDown(selectionValue, event),
    registerRef,
    effectiveDisabled
  }
}
