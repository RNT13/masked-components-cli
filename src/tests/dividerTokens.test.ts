import { describe, expect, it } from 'vitest'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { resolveDividerTokens } from '../../templates/masked-layout/MaskedDivider/dividerTokens'

describe('resolveDividerTokens', () => {
  it('sem colorTheme: linha = borda do tema, label = texto secundário do tema', () => {
    const style = resolveDividerTokens({}, maskedTheme)
    expect(style['--mc-divider-color']).toBe(maskedTheme.colors.borderColor)
    expect(style['--mc-divider-label']).toBe(maskedTheme.colors.textMuted)
  })

  it('colorTheme pinta só a linha; o label segue o texto do tema', () => {
    const style = resolveDividerTokens({ colorTheme: 'baseBlue' }, maskedTheme)
    expect(style['--mc-divider-color']).toBe(maskedTheme.colors.baseBlue.light40)
    expect(style['--mc-divider-label']).toBe(maskedTheme.colors.textMuted)
  })

  it('spacing e thickness viram tokens; tokens vencem tudo', () => {
    const style = resolveDividerTokens(
      { spacing: 'lg', thickness: '2px', tokens: { color: '#f00', thickness: '4px' } },
      maskedTheme
    )
    expect(style['--mc-divider-spacing']).toBe(maskedTheme.spacing.lg)
    expect(style['--mc-divider-thickness']).toBe('4px')
    expect(style['--mc-divider-color']).toBe('#f00')
  })
})
