import { describe, expect, it } from 'vitest'  
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'  
import { resolveMenuTokens, nextEnabledItem, edgeEnabledItem } from '../../templates/masked-app/MaskedDropdownMenu/menuTokens'  

describe('resolveMenuTokens', () => {
  it('emite superfície sólida e item destacado no accent', () => {
    const s = resolveMenuTokens({}, maskedTheme)
    expect(s['--mc-menu-bg']).toBe(maskedTheme.colors.surfaceColor)
    expect(s['--mc-menu-fg']).toBe(maskedTheme.colors.textColor)
    expect(s['--mc-menu-item-hover-bg']).toBeDefined()
    expect(s['--mc-menu-item-hover-fg']).toBeDefined()
  })

  it('tokens vencem a base', () => {
    const s = resolveMenuTokens({ tokens: { bg: '#000', itemHoverBg: '#123456' } }, maskedTheme)
    expect(s['--mc-menu-bg']).toBe('#000')
    expect(s['--mc-menu-item-hover-bg']).toBe('#123456')
  })
})

describe('navegação do menu', () => {
  const items = [
    { separator: false, disabled: false },
    { separator: true },
    { separator: false, disabled: true },
    { separator: false, disabled: false }
  ]

  it('pula separadores e desabilitados, com wrap', () => {
    expect(nextEnabledItem(items, 0, 1)).toBe(3)
    expect(nextEnabledItem(items, 3, 1)).toBe(0)
    expect(nextEnabledItem(items, 0, -1)).toBe(3)
  })

  it('edge: primeiro e último habilitado', () => {
    expect(edgeEnabledItem(items, 'first')).toBe(0)
    expect(edgeEnabledItem(items, 'last')).toBe(3)
  })

  it('sem itens habilitados retorna -1', () => {
    expect(nextEnabledItem([{ separator: true }, { disabled: true }], 0, 1)).toBe(-1)
  })
})
