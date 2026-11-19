import { describe, expect, it } from 'vitest'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { listColorThemes } from '../../templates/masked-themes/MaskedThemes/ColorThemes'
import { contrastRatio } from '../../templates/masked-utils/color'
import { resolveSectionTokens } from '../../templates/masked-layout/MaskedSection/sectionTokens'

const THEMES = [...listColorThemes(), 'baseBlue', 'baseRose', 'baseLilac']

/** Pega a primeira cor do `linear-gradient(135deg, FROM, ...)`. */
const gradientFrom = (bg: string) =>
  /linear-gradient\(135deg, ((?:hsla?|rgba?)\([^)]*\)|#[0-9a-f]+),/i.exec(bg)?.[1] ?? ''

describe('resolveSectionTokens — plain não pinta', () => {
  it('sem props: nenhum token', () => {
    expect(resolveSectionTokens({}, maskedTheme)).toEqual({})
  })

  it('paddingY vira token (escala, número, CSS)', () => {
    expect(resolveSectionTokens({ paddingY: 'xl' }, maskedTheme)['--mc-section-padding-y']).toBe(
      maskedTheme.spacing.xl
    )
    expect(resolveSectionTokens({ paddingY: 40 }, maskedTheme)['--mc-section-padding-y']).toBe(
      '40px'
    )
  })
})

describe('resolveSectionTokens — variantes', () => {
  it('tinted: fundo suave do colorTheme, ou o subtle do tema', () => {
    expect(
      resolveSectionTokens({ variant: 'tinted', colorTheme: 'baseBlue' }, maskedTheme)[
        '--mc-section-bg'
      ]
    ).toContain('color-mix')
    expect(resolveSectionTokens({ variant: 'tinted' }, maskedTheme)['--mc-section-bg']).toBe(
      maskedTheme.colors.tertiaryColor
    )
  })

  it('bordered: emite só a borda', () => {
    const style = resolveSectionTokens({ variant: 'bordered', colorTheme: 'baseBlue' }, maskedTheme)
    expect(style['--mc-section-border']).toBeDefined()
    expect(style['--mc-section-bg']).toBeUndefined()
    expect(style['--mc-section-fg']).toBeUndefined()
  })

  for (const colorTheme of THEMES) {
    it(`gradient (${colorTheme}): texto com contraste >= 4.5 sobre a base`, () => {
      const style = resolveSectionTokens({ variant: 'gradient', colorTheme }, maskedTheme)
      const ratio = contrastRatio(style['--mc-section-fg'], gradientFrom(style['--mc-section-bg']))
      expect(ratio).not.toBeNull()
      expect(ratio!).toBeGreaterThanOrEqual(4.5)
    })
  }

  it('gradient sem colorTheme usa o accent do tema (ainda com contraste)', () => {
    const style = resolveSectionTokens({ variant: 'gradient' }, maskedTheme)
    const ratio = contrastRatio(style['--mc-section-fg'], gradientFrom(style['--mc-section-bg']))
    expect(ratio!).toBeGreaterThanOrEqual(4.5)
  })

  it('tokens.fg explícito leva o muted junto; tokens vencem o colorTheme', () => {
    const style = resolveSectionTokens(
      { variant: 'gradient', colorTheme: 'baseBlue', tokens: { fg: '#ffffff' } },
      maskedTheme
    )
    expect(style['--mc-section-fg']).toBe('#ffffff')
    expect(style['--mc-section-muted']).toContain('#ffffff')
  })
})
