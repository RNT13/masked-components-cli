import { describe, expect, it } from 'vitest'
import { toKebab } from '../../templates/masked-utils/string'

describe('toKebab', () => {
  it('camelCase -> kebab-case', () => {
    expect(toKebab('cardBg')).toBe('card-bg')
    expect(toKebab('collapsedWidth')).toBe('collapsed-width')
    expect(toKebab('menuFg')).toBe('menu-fg')
  })

  it('PascalCase e múltiplas maiúsculas', () => {
    expect(toKebab('CardBg')).toBe('-card-bg')
    expect(toKebab('aBC')).toBe('a-b-c')
  })

  it('sem maiúsculas: retorna igual', () => {
    expect(toKebab('bg')).toBe('bg')
    expect(toKebab('')).toBe('')
  })
})
