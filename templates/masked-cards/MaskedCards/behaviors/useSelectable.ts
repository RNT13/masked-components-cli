'use client'

import { useCallback, useState } from 'react'
import type { CardSelectionMode } from '../MaskedCards.types'

export interface UseSelectableOptions {
  selectable?: boolean
  selectionMode?: CardSelectionMode
  selected?: boolean
  defaultSelected?: boolean
  onSelectedChange?: (selected: boolean) => void
  disabled?: boolean
}

export interface UseSelectableResult {
  selectable: boolean
  isSelected: boolean
  /** 'checkbox' fora de grupo; dentro de MaskedCardGroup o useCardGroup sobrescreve. */
  role: 'checkbox' | 'radio'
  toggle: () => void
}

export function useSelectable({
  selectable,
  selectionMode = 'single',
  selected,
  defaultSelected,
  onSelectedChange,
  disabled
}: UseSelectableOptions): UseSelectableResult {
  const [internal, setInternal] = useState(!!defaultSelected)
  const isControlled = selected !== undefined
  const isSelected = isControlled ? !!selected : internal

  const toggle = useCallback(() => {
    if (disabled || !selectable) return
    const next = !isSelected
    if (!isControlled) setInternal(next)
    onSelectedChange?.(next)
  }, [disabled, selectable, isSelected, isControlled, onSelectedChange])

  return {
    selectable: !!selectable,
    isSelected,
    role: selectionMode === 'single' ? 'radio' : 'checkbox',  
    toggle
  }
}
