'use client'

import { useCallback, useState } from 'react'
import type { CardSelectionMode } from '../MaskedCards.types'

export interface UseSelectableOptions {
  /** Liga o comportamento de seleção. */
  selectable?: boolean
  /** Selecionado (controlado). */
  selected?: boolean
  /** Selecionado inicial (não controlado). */
  defaultSelected?: boolean
  onSelectedChange?: (selected: boolean) => void
  /** 'single' → role radio; 'multiple' → role checkbox. */
  selectionMode?: CardSelectionMode
  disabled?: boolean
}

export interface UseSelectableResult {
  selectable: boolean
  isSelected: boolean
  role: 'radio' | 'checkbox'
  toggle: () => void
}

export function useSelectable({
  selectable,
  selected,
  defaultSelected,
  onSelectedChange,
  selectionMode = 'multiple',
  disabled
}: UseSelectableOptions): UseSelectableResult {
  const [internalSelected, setInternalSelected] = useState(defaultSelected ?? false)
  const isSelected = selected ?? internalSelected

  const toggle = useCallback(() => {
    if (disabled || !selectable) return
    const next = !isSelected
    if (selected === undefined) setInternalSelected(next)
    onSelectedChange?.(next)
  }, [disabled, selectable, isSelected, selected, onSelectedChange])

  return {
    selectable: !!selectable,
    isSelected,
    role: selectionMode === 'single' ? 'radio' : 'checkbox',
    toggle
  }
}
