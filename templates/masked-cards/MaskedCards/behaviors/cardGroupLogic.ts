import type { CardSelectionMode } from '../MaskedCards.types'

/** Item registrado no grupo (ordem = ordem de registro no DOM). */
export interface GroupItem {
  value: string
  disabled: boolean
  el: HTMLElement
}

/**
 * Alternância de seleção.  
 * single (radio): sempre retorna `value` — clicar no selecionado NÃO desmarca.  
 * multiple (checkbox): adiciona/remove `value` da lista.  
 */
export function toggleGroupValue(
  current: string | string[] | undefined,
  value: string,
  mode: CardSelectionMode
): string | string[] {
  if (mode === 'multiple') {
    const list = Array.isArray(current) ? current : []
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
  }
  return value
}

/**
 * Próximo índice habilitado a partir de `from`, andando `dir` (+1/-1) com wrap.  
 * Retorna -1 se a lista for vazia ou todos estiverem desabilitados.  
 */
export function nextEnabledIndex(items: readonly GroupItem[], from: number, dir: 1 | -1): number {
  const n = items.length
  if (n === 0) return -1
  for (let step = 1; step <= n; step++) {
    const i = (((from + dir * step) % n) + n) % n
    if (!items[i].disabled) return i
  }
  return -1
}

/** Valor do item no índice, ou null fora da faixa. */
export function resolveGroupValue(items: readonly GroupItem[], index: number): string | null {
  if (index < 0 || index >= items.length) return null
  return items[index].value
}

/**
 * Resolve tecla de navegação do radiogroup/grupo:  
 * setas (as 4) movem com wrap pulando desabilitados; Home/End vão às pontas  
 * habilitadas; demais teclas retornam null.  
 */
export function resolveGroupKey(
  items: readonly GroupItem[],
  from: number,
  key: string
): string | null {
  let index = -1
  if (key === 'ArrowDown' || key === 'ArrowRight') {
    index = nextEnabledIndex(items, from, 1)
  } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
    index = nextEnabledIndex(items, from, -1)
  } else if (key === 'Home') {
    index = nextEnabledIndex(items, -1, 1)
  } else if (key === 'End') {
    index = nextEnabledIndex(items, items.length, -1)
  } else {
    return null
  }
  return resolveGroupValue(items, index)
}

/** Atalho: valor do próximo item habilitado para uma tecla (ou null). */
export function nextEnabledValue(
  items: readonly GroupItem[],
  from: number,
  key: string
): string | null {
  return resolveGroupKey(items, from, key)
}
