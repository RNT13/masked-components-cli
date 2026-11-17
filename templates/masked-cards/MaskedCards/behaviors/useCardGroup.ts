'use client'

import { useCallback, useContext } from 'react'
import { CardGroupContext } from '../Group/CardGroupContext'

export interface UseCardGroupResult {
  grouped: boolean
  isSelected: boolean
  role: 'radio' | 'checkbox'
  /** tabIndex do card dentro do roving tabindex do grupo. */
  tabIndex: number | undefined
  select: () => void
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void
  /** Callback ref: registra o elemento interativo no grupo. */
  registerRef: (el: HTMLElement | null) => void
  effectiveDisabled: boolean
}

/**
 * Cleanup de registro por elemento. O callback ref do React é chamado  
 * com `null` na desmontagem — sem o elemento não dá para saber qual  
 * cleanup rodar, então guardamos por referência de elemento.  
 */
const cleanups = new WeakMap<HTMLElement, () => void>()

/**
 * Conecta um card ao MaskedCardGroup ancestral.  
 * Fora de grupo (ou sem selectionValue) retorna grouped: false.  
 */
export function useCardGroup(
  selectionValue: string | undefined,
  cardDisabled?: boolean
): UseCardGroupResult {
  const group = useContext(CardGroupContext)

  const registerRef = useCallback(
    (el: HTMLElement | null) => {
      if (!group || selectionValue === undefined) return
      if (el) {
        // Re-registro no mesmo elemento: limpa o anterior antes.
        cleanups.get(el)?.()
        cleanups.set(el, group.register(selectionValue, el, group.disabled || !!cardDisabled))
      }
    },
    [group, selectionValue, cardDisabled]
  )

  if (!group || selectionValue === undefined) {
    return { grouped: false } as UseCardGroupResult
  }

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
