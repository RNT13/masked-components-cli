import { describe, expect, it } from 'vitest'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import {
  CONTAINER_MAX_WIDTH,
  resolveContainerTokens
} from '../../templates/masked-layout/MaskedContainer/containerTokens'

describe('resolveContainerTokens', () => {
  it('uso mínimo: só a largura máxima do variant default', () => {
    expect(resolveContainerTokens({}, maskedTheme)).toEqual({
      '--mc-container-max-width': CONTAINER_MAX_WIDTH.default
    })
  })

  it('cada variant tem a sua largura', () => {
    expect(
      resolveContainerTokens({ variant: 'narrow' }, maskedTheme)['--mc-container-max-width']
    ).toBe('720px')
    expect(
      resolveContainerTokens({ variant: 'wide' }, maskedTheme)['--mc-container-max-width']
    ).toBe('1440px')
    expect(
      resolveContainerTokens({ variant: 'full' }, maskedTheme)['--mc-container-max-width']
    ).toBe('100%')
  })

  it('paddingX/paddingY: escala do tema, número (px) e valor CSS', () => {
    const style = resolveContainerTokens({ paddingX: 'xl', paddingY: 24 }, maskedTheme)
    expect(style['--mc-container-padding-x']).toBe(maskedTheme.spacing.xl)
    expect(style['--mc-container-padding-y']).toBe('24px')
    expect(
      resolveContainerTokens({ paddingX: '5%' }, maskedTheme)['--mc-container-padding-x']
    ).toBe('5%')
  })

  it('tokens vencem as props e o variant', () => {
    const style = resolveContainerTokens(
      { variant: 'narrow', paddingX: 'sm', tokens: { maxWidth: '900px', paddingX: '3rem' } },
      maskedTheme
    )
    expect(style['--mc-container-max-width']).toBe('900px')
    expect(style['--mc-container-padding-x']).toBe('3rem')
  })

  it('não emite padding sem prop (o CSS usa o gutter responsivo padrão)', () => {
    const style = resolveContainerTokens({}, maskedTheme)
    expect(style['--mc-container-padding-x']).toBeUndefined()
    expect(style['--mc-container-padding-y']).toBeUndefined()
  })
})
