import { describe, expect, it } from 'vitest'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import {
  resolveStackDirection,
  resolveStackTokens
} from '../../templates/masked-layout/MaskedStack/stackTokens'

describe('resolveStackTokens — gap semântico', () => {
  it('default md (theme.spacing.md) — uso mínimo em uma linha', () => {
    expect(resolveStackTokens({}, maskedTheme)['--mc-stack-gap']).toBe(maskedTheme.spacing.md)
  })

  it('escala e valores customizados', () => {
    expect(resolveStackTokens({ gap: 'sm' }, maskedTheme)['--mc-stack-gap']).toBe(
      maskedTheme.spacing.sm
    )
    expect(resolveStackTokens({ gap: '3xl' }, maskedTheme)['--mc-stack-gap']).toBe(
      maskedTheme.spacing['3xl']
    )
    expect(resolveStackTokens({ gap: 32 }, maskedTheme)['--mc-stack-gap']).toBe('32px')
    expect(resolveStackTokens({ gap: '1.25rem' }, maskedTheme)['--mc-stack-gap']).toBe('1.25rem')
  })

  it('tokens.gap vence a prop gap', () => {
    expect(
      resolveStackTokens({ gap: 'sm', tokens: { gap: '40px' } }, maskedTheme)['--mc-stack-gap']
    ).toBe('40px')
  })

  it('tokens.divider define a cor da linha automática', () => {
    expect(
      resolveStackTokens({ tokens: { divider: '#f00' } }, maskedTheme)['--mc-stack-divider']
    ).toBe('#f00')
  })

  it('não emite token de cor de superfície (stack é neutro)', () => {
    const style = resolveStackTokens({}, maskedTheme)
    expect(Object.keys(style)).toEqual(['--mc-stack-gap'])
  })
})

describe('resolveStackDirection — variant × direction', () => {
  it('variantes de fluxo horizontal', () => {
    expect(resolveStackDirection({ variant: 'row' })).toBe('row')
    expect(resolveStackDirection({ variant: 'inline' })).toBe('row')
    expect(resolveStackDirection({ variant: 'spread' })).toBe('row')
  })

  it('column é o default', () => {
    expect(resolveStackDirection({})).toBe('column')
    expect(resolveStackDirection({ variant: 'column' })).toBe('column')
  })

  it('a prop direction vence o variant', () => {
    expect(resolveStackDirection({ variant: 'row', direction: 'column' })).toBe('column')
    expect(resolveStackDirection({ variant: 'spread', direction: 'column' })).toBe('column')
  })
})
