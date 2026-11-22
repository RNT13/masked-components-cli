import { describe, expect, it } from 'vitest'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { resolveModalTokens } from '../../templates/masked-app/MaskedModal/modalTokens'
import { contrastRatio } from '../../templates/masked-utils/color'

const AA = 4.5

describe('resolveModalTokens', () => {
  it('sem colorTheme: painel na superfície do tema, overlay escuro', () => {
    const s = resolveModalTokens({}, maskedTheme)
    expect(s['--mc-modal-bg']).toBe(maskedTheme.colors.surfaceColor)
    expect(contrastRatio(s['--mc-modal-fg'], s['--mc-modal-bg'])!).toBeGreaterThanOrEqual(AA)
    expect(s['--mc-modal-overlay-bg']).toContain('black')
  })

  it('colorTheme pinta o painel mantendo contraste', () => {
    const s = resolveModalTokens({ colorTheme: 'baseBlue' }, maskedTheme)
    expect(s['--mc-modal-bg']).not.toBe(maskedTheme.colors.surfaceColor)
    expect(contrastRatio(s['--mc-modal-fg'], s['--mc-modal-bg'])!).toBeGreaterThanOrEqual(AA)
  })

  it('tokens vencem tudo', () => {
    const s = resolveModalTokens(
      { tokens: { overlayBg: 'rgba(0,0,0,0.8)', radius: '4px' } },
      maskedTheme
    )
    expect(s['--mc-modal-overlay-bg']).toBe('rgba(0,0,0,0.8)')
    expect(s['--mc-modal-radius']).toBe('4px')
  })
})
