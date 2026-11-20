import { describe, expect, it } from 'vitest'
import { contrastRatio } from '../../templates/masked-utils/color'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { resolveAlertTokens } from '../../templates/masked-app/MaskedAlert/alertTokens'

const AA = 4.5

describe('resolveAlertTokens', () => {
  it('solid: texto com contraste AA sobre o fundo em todos os tones', () => {
    for (const tone of ['info', 'success', 'warning', 'error'] as const) {
      const s = resolveAlertTokens({ tone, variant: 'solid' }, maskedTheme)
      expect(contrastRatio(s['--mc-alert-fg'], s['--mc-alert-bg'])!).toBeGreaterThanOrEqual(AA)
    }
  })

  it('soft: fundo tintado e ícone na cor do tone', () => {
    const s = resolveAlertTokens({ tone: 'error' }, maskedTheme)
    expect(s['--mc-alert-bg']).toContain('color-mix')
    expect(s['--mc-alert-icon']).toBe('#b91c1c')
  })

  it('outline: sem fundo, borda na cor do tone', () => {
    const s = resolveAlertTokens({ tone: 'info', variant: 'outline' }, maskedTheme)
    expect(s['--mc-alert-bg']).toBeUndefined()
    expect(s['--mc-alert-border']).toBe('#2563eb')
  })

  it('colorTheme vence o tone; tokens vencem tudo', () => {
    const themed = resolveAlertTokens({ tone: 'error', colorTheme: 'baseBlue' }, maskedTheme)
    expect(themed['--mc-alert-icon']).not.toBe('#b91c1c')
    const custom = resolveAlertTokens({ tokens: { bg: '#000000' } }, maskedTheme)
    expect(custom['--mc-alert-bg']).toBe('#000000')
    expect(contrastRatio(custom['--mc-alert-fg'], '#000000')!).toBeGreaterThanOrEqual(AA)
  })
})
