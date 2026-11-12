import { describe, expect, it } from 'vitest'  
import { contrastRatio } from '../../templates/masked-utils/color'  
import { maskedThemeConfig } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'  
  
const themes = Object.entries(maskedThemeConfig)  
  
describe('contraste WCAG AA dos temas', () => {  
  it('encontrou os 17 temas exportados', () => {  
    expect(themes).toHaveLength(17)  
  })  
  
  it.each(themes)('%s: textColor >= 4.5:1 sobre primaryColor', (_name, theme) => {  
    const { textColor, primaryColor } = theme.colors  
    expect(contrastRatio(textColor!, primaryColor!)).toBeGreaterThanOrEqual(4.5)  
  })  
  
  it.each(themes)('%s: textMuted >= 4.5:1 sobre primaryColor', (_name, theme) => {  
    const { textMuted, primaryColor } = theme.colors  
    expect(contrastRatio(textMuted!, primaryColor!)).toBeGreaterThanOrEqual(4.5)  
  })  
  
  it.each(themes)('%s: textMuted >= 4.5:1 sobre surfaceColor', (_name, theme) => {  
    const { textMuted, surfaceColor } = theme.colors  
    expect(contrastRatio(textMuted!, surfaceColor!)).toBeGreaterThanOrEqual(4.5)  
  })  
})