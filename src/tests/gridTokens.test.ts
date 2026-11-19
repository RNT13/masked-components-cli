import { describe, expect, it } from 'vitest'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import {
  resolveGridCols,
  resolveGridTokens
} from '../../templates/masked-layout/MaskedGrid/gridTokens'

describe('resolveGridCols — colunas responsivas por padrão', () => {
  it('número vira desktop n, tablet min(n, 2), mobile 1', () => {
    expect(resolveGridCols(3)).toEqual({ desktop: 3, tablet: 2, mobile: 1 })
    expect(resolveGridCols(4)).toEqual({ desktop: 4, tablet: 2, mobile: 1 })
  })

  it('n <= 2 mantém as colunas no tablet', () => {
    expect(resolveGridCols(2)).toEqual({ desktop: 2, tablet: 2, mobile: 1 })
  })

  it('default sem cols: 3 / 2 / 1', () => {
    expect(resolveGridCols(undefined)).toEqual({ desktop: 3, tablet: 2, mobile: 1 })
  })

  it('mapa parcial: chaves dadas vencem, restantes caem no padrão', () => {
    expect(resolveGridCols({ desktop: 4, mobile: 2 })).toEqual({
      desktop: 4,
      tablet: 2,
      mobile: 2
    })
    expect(resolveGridCols({ mobile: 2 })).toEqual({ desktop: 3, tablet: 2, mobile: 2 })
  })
})

describe('resolveGridTokens — tokens --mc-grid-*', () => {
  it('emite colunas por breakpoint + gap default md', () => {
    const style = resolveGridTokens({ cols: 3 }, maskedTheme)
    expect(style['--mc-grid-cols-desktop']).toBe('3')
    expect(style['--mc-grid-cols-tablet']).toBe('2')
    expect(style['--mc-grid-cols-mobile']).toBe('1')
    expect(style['--mc-grid-gap']).toBe(maskedTheme.spacing.md)
  })

  it('minChildWidth alimenta a variante auto; sidebarWidth alimenta a variante sidebar', () => {
    const style = resolveGridTokens({ minChildWidth: '220px', sidebarWidth: '280px' }, maskedTheme)
    expect(style['--mc-grid-min-child-width']).toBe('220px')
    expect(style['--mc-grid-sidebar-width']).toBe('280px')
  })

  it('gap por escala/número e tokens vencem tudo', () => {
    expect(resolveGridTokens({ gap: 'sm' }, maskedTheme)['--mc-grid-gap']).toBe(
      maskedTheme.spacing.sm
    )
    expect(resolveGridTokens({ gap: 32 }, maskedTheme)['--mc-grid-gap']).toBe('32px')
    expect(
      resolveGridTokens({ cols: 3, tokens: { colsDesktop: '6' } }, maskedTheme)[
        '--mc-grid-cols-desktop'
      ]
    ).toBe('6')
  })
})

describe('contrato tokens × CSS — todo token emitido é lido pelo styled', () => {
  it('cada override de GridTokenOverrides vira uma variável que o CSS consome', async () => {
    const fs = await import('node:fs')
    const path = await import('node:path')
    const css = fs.readFileSync(
      path.resolve(__dirname, '../../templates/masked-layout/MaskedGrid/MaskedGrid.styles.ts'),
      'utf8'
    )
    const style = resolveGridTokens(
      {
        tokens: {
          gap: '1px',
          minChildWidth: '1px',
          sidebarWidth: '1px',
          colsMobile: '1',
          colsTablet: '1',
          colsDesktop: '1'
        }
      },
      maskedTheme
    )
    for (const name of Object.keys(style)) {
      expect(css, `${name} é emitido mas o CSS não lê`).toContain(`var(${name}`)
    }
  })
})
