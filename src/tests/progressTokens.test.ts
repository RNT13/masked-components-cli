import { describe, expect, it } from 'vitest'  
import { contrastRatio } from '../../templates/masked-utils/color'  
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'  
import { resolveProgressTokens } from '../../templates/masked-app/MaskedProgress/progressTokens'  
import { resolveSemanticColors } from '../../templates/masked-themes/semanticColors'  
  
const AA = 4.5  
  
describe('resolveProgressTokens', () => {  
    it('sem colorTheme: barra no accent do tema, trilha tintada', () => {  
    const s = resolveProgressTokens({}, maskedTheme)  
    const semantic = resolveSemanticColors(maskedTheme)  
    expect(s['--mc-progress-bar']).toBe(semantic.accent)  
    expect(s['--mc-progress-track']).toContain('color-mix')  
  })  
  
  it('colorTheme: barra usa a base da paleta', () => {  
    const s = resolveProgressTokens({ colorTheme: 'baseBlue' }, maskedTheme)  
    expect(s['--mc-progress-bar']).not.toBe(maskedTheme.colors.primaryColor)  
    expect(s['--mc-progress-track']).toContain('color-mix')  
  })  
  
  it('tokens vencem tudo; bar customizado não afeta fg', () => {  
    const s = resolveProgressTokens(  
      { tokens: { bar: '#ff0000', track: '#eee', fg: '#111111' } },  
      maskedTheme  
    )  
    expect(s['--mc-progress-bar']).toBe('#ff0000')  
    expect(s['--mc-progress-track']).toBe('#eee')  
    expect(  
      contrastRatio(s['--mc-progress-fg']!, maskedTheme.colors.surfaceColor)!
    ).toBeGreaterThanOrEqual(AA)  
  })  
})  