import { useCallback, useId, useState } from 'react'

export interface UseExpandableOptions {
  expandable?: boolean
  expanded?: boolean
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  disabled?: boolean
}

export interface UseExpandableResult {
  expandable: boolean
  isExpanded: boolean
  toggle: () => void
  /** id do botão de expansão (usado como aria-labelledby da região). */
  buttonId: string
  /** id da região colapsável (usado como aria-controls do botão). */
  regionId: string
}

/**
 * Expansão controlada ou não controlada.  
 * O controle é um <button> dedicado (aria-expanded/aria-controls) —  
 * o card inteiro NUNCA alterna expansão ao clique.  
 */
export function useExpandable({
  expandable,
  expanded,
  defaultExpanded,
  onExpandedChange,
  disabled
}: UseExpandableOptions): UseExpandableResult {
  const uid = useId()
  const buttonId = `mc-card-expand-btn-${uid}`
  const regionId = `mc-card-expand-region-${uid}`

  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded ?? false)
  const isExpanded = expanded ?? internalExpanded

  const toggle = useCallback(() => {
    if (disabled || !expandable) return
    const next = !isExpanded
    if (expanded === undefined) setInternalExpanded(next)
    onExpandedChange?.(next)
  }, [disabled, expandable, isExpanded, expanded, onExpandedChange])

  return { expandable: !!expandable, isExpanded, toggle, buttonId, regionId }
}
