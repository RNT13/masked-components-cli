import { describe, expect, it } from 'vitest'
import {
  nextEnabledIndex,
  nextEnabledValue,
  resolveGroupKey,
  resolveGroupValue,
  toggleGroupValue,
  type GroupItem
} from '../../templates/masked-cards/MaskedCards/behaviors/cardGroupLogic'

const items = (...defs: [string, boolean?][]): GroupItem[] =>
  defs.map(([value, disabled]) => ({ value, disabled: !!disabled }))

describe('toggleGroupValue', () => {
  it('single: seleciona valor novo', () => {
    expect(toggleGroupValue('a', 'b', 'single')).toBe('b')
  })

  it('single: clicar no mesmo mantém (radio não desmarca)', () => {
    expect(toggleGroupValue('a', 'a', 'single')).toBe('a')
  })

  it('multiple: alterna valores', () => {
    expect(toggleGroupValue(['a'], 'b', 'multiple')).toEqual(['a', 'b'])
    expect(toggleGroupValue(['a', 'b'], 'a', 'multiple')).toEqual(['b'])
  })
})

describe('nextEnabledIndex', () => {
  const list = items(['a'], ['b', true], ['c'], ['d'])

  it('move para o próximo índice habilitado', () => {
    expect(nextEnabledIndex(list, 0, 1)).toBe(2)
  })

  it('move para o índice anterior habilitado', () => {
    expect(nextEnabledIndex(list, 2, -1)).toBe(0)
  })

  it('faz wrap nas pontas', () => {
    expect(nextEnabledIndex(list, 3, 1)).toBe(0)
    expect(nextEnabledIndex(list, 0, -1)).toBe(3)
  })

  it('retorna -1 com lista vazia', () => {
    expect(nextEnabledIndex([], 0, 1)).toBe(-1)
  })

  it('retorna -1 quando todos estão desabilitados', () => {
    expect(nextEnabledIndex(items(['a', true], ['b', true]), 0, 1)).toBe(-1)
  })
})

describe('resolveGroupKey', () => {
  const list = items(['a'], ['b', true], ['c'], ['d'])

  it('setas horizontais e verticais movem', () => {
    expect(resolveGroupKey(list, 0, 'ArrowDown')).toBe('c')
    expect(resolveGroupKey(list, 0, 'ArrowRight')).toBe('c')
    expect(resolveGroupKey(list, 2, 'ArrowUp')).toBe('a')
    expect(resolveGroupKey(list, 2, 'ArrowLeft')).toBe('a')
  })

  it('Home e End vão às pontas habilitadas', () => {
    expect(resolveGroupKey(list, 2, 'Home')).toBe('a')
    expect(resolveGroupKey(list, 0, 'End')).toBe('d')
  })

  it('Home/End com primeiro/último desabilitado pulam', () => {
    const l = items(['x', true], ['a'], ['b'], ['y', true])
    expect(resolveGroupKey(l, 1, 'Home')).toBe('a')
    expect(resolveGroupKey(l, 1, 'End')).toBe('b')
  })

  it('teclas não relacionadas retornam null', () => {
    expect(resolveGroupKey(list, 0, 'Enter')).toBeNull()
    expect(resolveGroupKey(list, 0, 'Tab')).toBeNull()
    expect(resolveGroupKey(list, 0, 'a')).toBeNull()
  })

  it('retorna null quando não há destino habilitado', () => {
    expect(resolveGroupKey(items(['a', true]), 0, 'ArrowDown')).toBeNull()
  })
})

describe('resolveGroupValue', () => {
  it('retorna o valor do índice', () => {
    expect(resolveGroupValue(items(['a'], ['b']), 1)).toBe('b')
  })

  it('índice fora da faixa retorna null', () => {
    expect(resolveGroupValue(items(['a']), 5)).toBeNull()
    expect(resolveGroupValue(items(['a']), -1)).toBeNull()
  })
})

describe('nextEnabledValue', () => {
  const list = items(['a'], ['b', true], ['c'])

  it('resolve o valor do próximo habilitado', () => {
    expect(nextEnabledValue(list, 0, 'ArrowDown')).toBe('c')
  })
})
