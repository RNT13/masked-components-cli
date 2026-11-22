import { describe, expect, it } from 'vitest'
import { contrastRatio } from '../../templates/masked-utils/color'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import {
  edgeEnabledOption,
  findOptionByText,
  nextEnabledOption,
  resolveSelectTokens
} from '../../templates/masked-app/MaskedSelect/selectTokens'

const AA = 4.5

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta', disabled: true },
  { value: 'c', label: 'Charlie' },
  { value: 'd', label: 'Delta' }
]

describe('resolveSelectTokens', () => {
  it('sem colorTheme: superfície do tema, selected no accent', () => {
    const s = resolveSelectTokens({}, maskedTheme)
    expect(s['--mc-select-bg']).toBe(maskedTheme.colors.surfaceColor)
    expect(s['--mc-select-fg']).toBe(maskedTheme.colors.textColor)
    expect(s['--mc-select-selected-bg']).toBeTruthy()
    expect(s['--mc-select-placeholder']).toBeTruthy()
  })

  it('colorTheme pinta selected; tokens vencem tudo', () => {
    const themed = resolveSelectTokens({ colorTheme: 'baseBlue' }, maskedTheme)
    expect(themed['--mc-select-selected-bg']).not.toBe(
      resolveSelectTokens({}, maskedTheme)['--mc-select-selected-bg']
    )
    const custom = resolveSelectTokens({ tokens: { bg: '#000000' } }, maskedTheme)
    expect(custom['--mc-select-bg']).toBe('#000000')
    expect(contrastRatio(custom['--mc-select-fg'], '#000000')!).toBeGreaterThanOrEqual(AA)
  })
})

describe('navegação de options', () => {
  it('nextEnabledOption pula desabilitados e dá wrap', () => {
    expect(nextEnabledOption(options, 0, 1)).toBe(2)
    expect(nextEnabledOption(options, 3, 1)).toBe(0)
    expect(nextEnabledOption(options, 0, -1)).toBe(3)
  })

  it('edgeEnabledOption respeita desabilitados nas bordas', () => {
    expect(edgeEnabledOption(options, 'first')).toBe(0)
    expect(edgeEnabledOption(options, 'last')).toBe(3)
    expect(
      edgeEnabledOption([{ value: 'x', label: 'X', disabled: true }, ...options], 'first')
    ).toBe(1)
  })

  it('findOptionByText faz typeahead com wrap e ignora desabilitados', () => {
    expect(findOptionByText(options, 'c')).toBe(2)
    expect(findOptionByText(options, 'b')).toBe(-1)
    expect(findOptionByText(options, 'd', 0)).toBe(3)
    expect(findOptionByText(options, 'a', 2)).toBe(0)
  })
})
