import { describe, expect, it } from 'vitest'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { listColorThemes } from '../../templates/masked-themes/MaskedThemes/ColorThemes'
import { buildTokenStyle, resolveSurface } from '../../templates/masked-themes/surfaceTokens'
import { contrastRatio } from '../../templates/masked-utils/color'

const THEMES = [...listColorThemes(), 'baseBlue', 'baseRose', 'baseLilac']
const AA = 4.5
const gradientFrom = (bg: string) =>
  /linear-gradient\(135deg, ((?:hsla?|rgba?)\([^)]*\)|#[0-9a-f]+),/i.exec(bg)?.[1] ?? ''

describe('resolveSurface', () => {
  it('plain: não pinta; accent legível (accentFg com contraste sobre o accent)', () => {
    const s = resolveSurface('plain', undefined, maskedTheme)
    expect(s.bg).toBeUndefined()
    expect(s.fg).toBeUndefined()
    expect(contrastRatio(s.accentFg, s.accent)!).toBeGreaterThanOrEqual(AA)
  })

  for (const colorTheme of THEMES) {
    it(`${colorTheme}: solid e gradient com texto AA; accent = texto em superfícies pintadas`, () => {
      const solid = resolveSurface('solid', colorTheme, maskedTheme)
      expect(contrastRatio(solid.fg!, solid.bg!)!).toBeGreaterThanOrEqual(AA)
      expect(solid.accent).toBe(solid.fg)

      const gradient = resolveSurface('gradient', colorTheme, maskedTheme)
      expect(contrastRatio(gradient.fg!, gradientFrom(gradient.bg!))!).toBeGreaterThanOrEqual(AA)
      expect(gradient.accent).toBe(gradient.fg)

      const plain = resolveSurface('plain', colorTheme, maskedTheme)
      expect(contrastRatio(plain.accentFg, plain.accent)!).toBeGreaterThanOrEqual(AA)
    })
  }

  it('tinted: fundo suave (colorTheme) ou subtle do tema; outlined: só borda', () => {
    expect(resolveSurface('tinted', 'baseBlue', maskedTheme).bg).toContain('color-mix')
    expect(resolveSurface('tinted', undefined, maskedTheme).bg).toBe(
      maskedTheme.colors.tertiaryColor
    )
    expect(resolveSurface('outlined', 'baseBlue', maskedTheme).bg).toBeUndefined()
  })

  it('solid sem colorTheme usa superfície e texto do tema', () => {
    const s = resolveSurface('solid', undefined, maskedTheme)
    expect(s.bg).toBe(maskedTheme.colors.surfaceColor)
    expect(s.fg).toBe(maskedTheme.colors.textColor)
  })
})

describe('buildTokenStyle', () => {
  it('prefixa, converte camelCase em kebab e ignora undefined', () => {
    expect(buildTokenStyle('x', { cardBg: '#fff', gone: undefined })).toEqual({
      '--mc-x-card-bg': '#fff'
    })
  })

  it('overrides vencem a base', () => {
    expect(buildTokenStyle('x', { bg: '#000' }, { bg: '#123456' })['--mc-x-bg']).toBe('#123456')
  })

  it('fg explícito leva o muted junto', () => {
    expect(buildTokenStyle('x', { muted: 'gray' }, { fg: '#ffffff' })['--mc-x-muted']).toContain(
      '#ffffff'
    )
  })

  it('bg simples sem fg re-deriva o texto por contraste; gradiente não', () => {
    const s = buildTokenStyle('x', {}, { bg: '#000000' })
    expect(contrastRatio(s['--mc-x-fg'], '#000000')!).toBeGreaterThanOrEqual(AA)
    expect(
      buildTokenStyle('x', {}, { bg: 'linear-gradient(red, blue)' })['--mc-x-fg']
    ).toBeUndefined()
  })
})
