import { describe, expect, it } from 'vitest'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { listColorThemes } from '../../templates/masked-themes/MaskedThemes/ColorThemes'
import { contrastRatio } from '../../templates/masked-utils/color'
import { resolveCardTokens } from '../../templates/masked-cards/MaskedCards/cardTokens'
import type { CardAppearance } from '../../templates/masked-cards/MaskedCards/MaskedCards.types'

/* presets registrados (light, dark, ...) + amostra de chaves da paleta */
const THEMES = [...listColorThemes(), 'baseBlue', 'baseRose', 'baseLilac']
const SOFT: CardAppearance[] = ['filled', 'outlined', 'flat']
const RIGID: Array<CardAppearance | undefined> = ['elevated', 'gradient', 'glass', undefined]

describe('resolveCardTokens — aparências suaves × colorTheme', () => {
  for (const appearance of SOFT) {
    for (const colorTheme of THEMES) {
      it(`${appearance} + ${colorTheme}: fg × bg com contraste >= 4.5 quando ambos emitidos`, () => {
        const style = resolveCardTokens({ colorTheme, appearance }, maskedTheme)
        const bg = style['--mc-card-bg']
        const fg = style['--mc-card-fg']
        if (!bg || !fg) return // outlined/flat não emitem bg/fg: superfície neutra
        const ratio = contrastRatio(fg, bg)
        expect(ratio).not.toBeNull()
        expect(ratio!).toBeGreaterThanOrEqual(4.5)
      })
    }
  }

  it('filled emite bg suave (não a cor base saturada)', () => {
    const style = resolveCardTokens({ colorTheme: 'baseBlue', appearance: 'filled' }, maskedTheme)
    expect(style['--mc-card-bg']).toBe(maskedTheme.colors.baseBlue.light40)
    expect(style['--mc-card-bg']).not.toBe(maskedTheme.colors.baseBlue.base)
  })

  it('outlined/flat não emitem bg (superfície neutra)', () => {
    for (const appearance of ['outlined', 'flat'] as const) {
      const style = resolveCardTokens({ colorTheme: 'baseBlue', appearance }, maskedTheme)
      expect(style['--mc-card-bg']).toBeUndefined()
      expect(style['--mc-card-fg']).toBeUndefined()
    }
  })
})

describe('resolveCardTokens — elevated/gradient/glass inalterados', () => {
  for (const colorTheme of THEMES) {
    it(`${colorTheme}: resultado idêntico ao comportamento original`, () => {
      const baseline = resolveCardTokens({ colorTheme }, maskedTheme)
      for (const appearance of RIGID) {
        expect(resolveCardTokens({ colorTheme, appearance }, maskedTheme)).toEqual(baseline)
      }
    })
  }

  it('elevated mantém bg = base e fg = onBase|contraste', () => {
    const style = resolveCardTokens({ colorTheme: 'baseBlue', appearance: 'elevated' }, maskedTheme)
    expect(style['--mc-card-bg']).toBe(maskedTheme.colors.baseBlue.base)
    expect(style['--mc-card-fg']).toBeDefined()
  })
})

describe('resolveCardTokens — overrides do consumidor sempre vencem', () => {
  const appearances: CardAppearance[] = [
    'elevated',
    'filled',
    'outlined',
    'flat',
    'gradient',
    'glass'
  ]

  for (const appearance of appearances) {
    it(`${appearance}: tokens.bg/fg/border explícitos vencem o colorTheme`, () => {
      const style = resolveCardTokens(
        {
          colorTheme: 'baseBlue',
          appearance,
          tokens: { bg: '#123456', fg: '#ffffff', border: '#000000' }
        },
        maskedTheme
      )
      expect(style['--mc-card-bg']).toBe('#123456')
      expect(style['--mc-card-fg']).toBe('#ffffff')
      expect(style['--mc-card-border']).toBe('#000000')
    })
  }

  for (const appearance of SOFT) {
    it(`${appearance}: tokens.bg sem tokens.fg deriva fg por contraste`, () => {
      const style = resolveCardTokens({ appearance, tokens: { bg: '#0f172a' } }, maskedTheme)
      expect(style['--mc-card-bg']).toBe('#0f172a')
      const ratio = contrastRatio(style['--mc-card-fg'], '#0f172a')
      expect(ratio).not.toBeNull()
      expect(ratio!).toBeGreaterThanOrEqual(4.5)
    })
  }

  it('elevated: tokens.bg sem tokens.fg mantém comportamento atual (sem fg derivado)', () => {
    const style = resolveCardTokens(
      { appearance: 'elevated', tokens: { bg: '#0f172a' } },
      maskedTheme
    )
    expect(style['--mc-card-bg']).toBe('#0f172a')
    expect(style['--mc-card-fg']).toBeUndefined()
  })
})

describe('resolveCardTokens — sem colorTheme', () => {
  it('emite apenas os overrides do consumidor, em qualquer aparência', () => {
    for (const appearance of [...SOFT, ...RIGID]) {
      const style = resolveCardTokens({ appearance, tokens: { accent: '#ff0000' } }, maskedTheme)
      expect(style).toEqual({ '--mc-card-accent': '#ff0000' })
    }
  })

  it('sem colorTheme e sem tokens: objeto vazio (inalterado)', () => {
    expect(resolveCardTokens({}, maskedTheme)).toEqual({})
    expect(resolveCardTokens({ appearance: 'filled' }, maskedTheme)).toEqual({})
  })
})
