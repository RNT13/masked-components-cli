import { describe, expect, it } from 'vitest'
import { contrastRatio } from '../../templates/masked-utils/color'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { listColorThemes } from '../../templates/masked-themes/MaskedThemes/ColorThemes'
import { resolveCardTokens } from '../../templates/masked-cards/MaskedCards/cardTokens'
import type { CardAppearance } from '../../templates/masked-cards/MaskedCards/MaskedCards.types'

const theme = maskedTheme as never
const SOFT: CardAppearance[] = ['filled', 'outlined', 'flat']
const SOLID: CardAppearance[] = ['elevated', 'filled', 'outlined', 'flat']

describe('resolveCardTokens — aparências suaves × colorTheme', () => {
  for (const appearance of SOFT) {
    for (const name of listColorThemes()) {
      it(`${appearance} + ${name}: fg × bg >= 4.5:1 quando ambos emitidos`, () => {
        const style = resolveCardTokens({ colorTheme: name, appearance }, theme)
        const bg = style['--mc-card-bg']
        const fg = style['--mc-card-fg']
        // outlined/flat não emitem bg/fg (superfície neutra) — nada a checar
        if (bg === undefined || fg === undefined) return
        expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5)
      })
    }
  }

  it('filled emite bg suave e fg derivado', () => {
    const style = resolveCardTokens({ colorTheme: 'baseBlue', appearance: 'filled' }, theme)
    expect(style['--mc-card-bg']).toBeDefined()
    expect(style['--mc-card-fg']).toBeDefined()
  })

  it('outlined não emite bg/fg, mas emite border e accent do tema', () => {
    const style = resolveCardTokens({ colorTheme: 'baseBlue', appearance: 'outlined' }, theme)
    expect(style['--mc-card-bg']).toBeUndefined()
    expect(style['--mc-card-fg']).toBeUndefined()
    expect(style['--mc-card-border']).toBeDefined()
    expect(style['--mc-card-accent']).toBeDefined()
  })

  it('flat não emite bg/fg, mas emite accent e accentSoft', () => {
    const style = resolveCardTokens({ colorTheme: 'baseBlue', appearance: 'flat' }, theme)
    expect(style['--mc-card-bg']).toBeUndefined()
    expect(style['--mc-card-accent']).toBeDefined()
    expect(style['--mc-card-accent-soft']).toBeDefined()
  })
})

describe('resolveCardTokens — elevated/gradient/glass inalterados', () => {
  for (const appearance of ['elevated', 'gradient', 'glass'] as const) {
    it(`${appearance}: com colorTheme emite o mesmo conjunto de antes`, () => {
      const withAppearance = resolveCardTokens({ colorTheme: 'baseBlue', appearance }, theme)
      const without = resolveCardTokens({ colorTheme: 'baseBlue' }, theme)
      expect(withAppearance['--mc-card-bg']).toBe(without['--mc-card-bg'])
      expect(withAppearance['--mc-card-fg']).toBe(without['--mc-card-fg'])
      expect(withAppearance['--mc-card-border']).toBe(without['--mc-card-border'])
    })

    it(`${appearance}: tokens.bg sem tokens.fg NÃO deriva fg`, () => {
      const style = resolveCardTokens(
        { colorTheme: 'baseBlue', appearance, tokens: { bg: '#0f172a' } },
        theme
      )
      expect(style['--mc-card-bg']).toBe('#0f172a')
      // fg permanece o do tema (comportamento histórico preservado)
      const base = resolveCardTokens({ colorTheme: 'baseBlue' }, theme)
      expect(style['--mc-card-fg']).toBe(base['--mc-card-fg'])
    })
  }
})

describe('resolveCardTokens — overrides do consumidor sempre vencem', () => {
  for (const appearance of SOLID) {
    it(`${appearance}: tokens.bg/fg/border explícitos vencem o colorTheme`, () => {
      const style = resolveCardTokens(
        {
          colorTheme: 'baseBlue',
          appearance,
          tokens: { bg: '#123456', fg: '#abcdef', border: '#ff0000' }
        },
        theme
      )
      expect(style['--mc-card-bg']).toBe('#123456')
      expect(style['--mc-card-fg']).toBe('#abcdef')
      expect(style['--mc-card-border']).toBe('#ff0000')
    })

    it(`${appearance}: tokens.bg sem tokens.fg deriva fg por contraste`, () => {
      const style = resolveCardTokens({ appearance, tokens: { bg: '#0f172a' } }, theme)
      expect(style['--mc-card-bg']).toBe('#0f172a')
      expect(style['--mc-card-fg']).toBeDefined()
      expect(contrastRatio(style['--mc-card-fg'] as string, '#0f172a')).toBeGreaterThanOrEqual(4.5)
    })
  }
})

describe('resolveCardTokens — elevated: derivação condicional de fg', () => {
  it('bg claro sem fg: fg padrão já passa no contraste, nada muda', () => {
    const style = resolveCardTokens({ appearance: 'elevated', tokens: { bg: '#ffffff' } }, theme)
    expect(style['--mc-card-bg']).toBe('#ffffff')
    // sem colorTheme, fg não é emitido (default da biblioteca já contrasta)
    expect(style['--mc-card-fg']).toBeUndefined()
  })

  it('bg escuro sem fg: deriva fg claro', () => {
    const style = resolveCardTokens({ appearance: 'elevated', tokens: { bg: '#0f172a' } }, theme)
    expect(style['--mc-card-fg']).toBeDefined()
    expect(contrastRatio(style['--mc-card-fg'] as string, '#0f172a')).toBeGreaterThanOrEqual(4.5)
  })

  it('bg + fg explícito: fg do consumidor vence', () => {
    const style = resolveCardTokens(
      { appearance: 'elevated', tokens: { bg: '#0f172a', fg: '#ff00ff' } },
      theme
    )
    expect(style['--mc-card-fg']).toBe('#ff00ff')
  })
})

describe('resolveCardTokens — sem colorTheme, sem mudança', () => {
  for (const appearance of [...SOFT, 'elevated', 'gradient', 'glass'] as const) {
    it(`${appearance} sem colorTheme emite apenas tokens do consumidor`, () => {
      const style = resolveCardTokens({ appearance }, theme)
      expect(style['--mc-card-bg']).toBeUndefined()
      expect(style['--mc-card-fg']).toBeUndefined()
      expect(style['--mc-card-accent']).toBeUndefined()
    })
  }
})
