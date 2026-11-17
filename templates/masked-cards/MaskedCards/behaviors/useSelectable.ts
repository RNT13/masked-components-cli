'use client'

import { useCallback, useState } from 'react'
import type { CardSelectionMode } from '../MaskedCards.types'

export interface UseSelectableOptions {
  selected?: boolean
  defaultSelected?: boolean
  onSelectedChange?: (selected: boolean) => void
  /**
   * 'single' → role="radio" (uso avulso; dentro de um MaskedCardGroup o  
   * grupo assume o controle — ver useCardGroup).  
   * 'multiple' → role="checkbox".  
   */
  selectionMode?: CardSelectionMode
  disabled?: boolean
}

export interface UseSelectableResult {
  /** true quando alguma prop de seleção foi fornecida. */
  selectable: boolean
  isSelected: boolean
  /** Alterna a seleção (respeita disabled e modo controlado). */
  toggle: () => void
  /**
   * ARIA do elemento interativo único (button/stretched-button).  
   * NUNCA aplicar ao wrapper div nem a <a>.  
   */
  ariaProps: {
    role?: 'radio' | 'checkbox'
    'aria-checked'?: boolean
  }
}

/**
 * Seleção controlada ou não controlada, para uso AVULSO (fora de grupo).  
 * 'single' sem grupo: a exclusividade entre cards é responsabilidade de  
 * quem renderiza (controle externo via `selected`/`onSelectedChange`).  
 * role="radio" fora de um radiogroup é limitado — prefira MaskedCardGroup.  
 */
export function useSelectable({
  selected,
  defaultSelected,
  onSelectedChange,
  selectionMode = 'single',
  disabled
}: UseSelectableOptions): UseSelectableResult {
  const selectable =
    selected !== undefined || defaultSelected !== undefined || onSelectedChange !== undefined

  const [internalSelected, setInternalSelected] = useState(defaultSelected ?? false)
  const isSelected = selected ?? internalSelected

  const toggle = useCallback(() => {
    if (disabled || !selectable) return
    const next = !isSelected
    if (selected === undefined) setInternalSelected(next)
    onSelectedChange?.(next)
  }, [disabled, selectable, isSelected, selected, onSelectedChange])

  return {
    selectable,
    isSelected,
    toggle,
    ariaProps: selectable
      ? {
          role: selectionMode === 'multiple' ? 'checkbox' : 'radio',
          'aria-checked': isSelected
        }
      : {}
  }
}
