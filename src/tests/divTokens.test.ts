import { describe, expect, it } from 'vitest'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { listColorThemes } from '../../templates/masked-themes/MaskedThemes/ColorThemes'
import { contrastRatio } from '../../templates/masked-utils/color'
import { resolveDivTokens } from '../../templates/masked-layout/MaskedDiv/divTokens'

/* presets registrados (light, dark, ...) + amostra de chaves da paleta */
const THEMES = [...listColorThemes(), 'baseBlue', 'baseRose', 'baseLilac']

describe('resolveDivTokens — plain não pinta nada', () => {
  it('sem colorTheme e sem tokens: nenhum token emitido', () => {
    expect(resolveDivTokens({}, maskedTheme)).toEqual({})
  })

  it('plain com colorTheme: nenhum token de cor', () => {
    expect(resolveDivTokens({ variant: 'plain', colorTheme: 'baseBlue' }, maskedTheme)).toEqual({})
  })

  it('gap/padding viram tokens mesmo sem colorTheme', () => {
    const style = resolveDivTokens({ gap: 'sm', padding: 24 }, maskedTheme)
    expect(style['--mc-div-gap']).toBe(maskedTheme.spacing.sm)
    expect(style['--mc-div-padding']).toBe('24px')
  })
})

describe('resolveDivTokens — card pinta com contraste WCAG', () => {
  for (const colorTheme of THEMES) {
    it(`${colorTheme}: bg emitido com fg de contraste >= 4.5`, () => {
      const style = resolveDivTokens({ variant: 'card', colorTheme }, maskedTheme)
      const bg = style['--mc-div-bg']
      const fg = style['--mc-div-fg']
      expect(bg).toBeDefined()
      const ratio = contrastRatio(fg, bg)
      expect(ratio).not.toBeNull()
      expect(ratio!).toBeGreaterThanOrEqual(4.5)
    })
  }

  it('chaves da PALETA: bg = base do tema ativo (presets light/dark vêm do registry)', () => {
    for (const colorTheme of ['baseBlue', 'baseRose', 'baseLilac'] as const) {
      const style = resolveDivTokens({ variant: 'card', colorTheme }, maskedTheme)
      expect(style['--mc-div-bg']).toBe(maskedTheme.colors[colorTheme].base)
    }
  })
})

describe('resolveDivTokens — outlined/glass', () => {
  it('outlined: emite border, nunca bg/fg', () => {
    const style = resolveDivTokens({ variant: 'outlined', colorTheme: 'baseBlue' }, maskedTheme)
    expect(style['--mc-div-border']).toBeDefined()
    expect(style['--mc-div-bg']).toBeUndefined()
    expect(style['--mc-div-fg']).toBeUndefined()
  })

  it('glass: bg translúcido e borda suave', () => {
    const style = resolveDivTokens({ variant: 'glass', colorTheme: 'baseBlue' }, maskedTheme)
    expect(style['--mc-div-glass-bg']).toContain('color-mix')
    expect(style['--mc-div-glass-border']).toBeDefined()
    expect(style['--mc-div-fg']).toBeDefined()
  })
})

describe('resolveDivTokens — precedência: tokens > props > colorTheme > default', () => {
  it('tokens.bg vence o bg do colorTheme', () => {
    const style = resolveDivTokens(
      { variant: 'card', colorTheme: 'baseBlue', tokens: { bg: '#123456' } },
      maskedTheme
    )
    expect(style['--mc-div-bg']).toBe('#123456')
  })

  it('tokens.bg sem tokens.fg re-deriva o fg por contraste', () => {
    const style = resolveDivTokens(
      { variant: 'card', colorTheme: 'baseBlue', tokens: { bg: '#ffffff' } },
      maskedTheme
    )
    const fg = style['--mc-div-fg']
    const ratio = contrastRatio(fg, '#ffffff')
    expect(ratio).not.toBeNull()
    expect(ratio!).toBeGreaterThanOrEqual(4.5)
  })

  it('tokens.gap vence a prop gap', () => {
    const style = resolveDivTokens({ gap: 'sm', tokens: { gap: '2rem' } }, maskedTheme)
    expect(style['--mc-div-gap']).toBe('2rem')
  })
})
