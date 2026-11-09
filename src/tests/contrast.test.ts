import { describe, expect, it } from 'vitest'
import { contrastRatio, parseColor, readableTextOn } from '../../templates/masked-utils/color'

describe('parseColor', () => {
  it('hex curto, longo e com alpha', () => {
    expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255 })
    expect(parseColor('#1a1d26')).toEqual({ r: 26, g: 29, b: 38 })
    expect(parseColor('#ff000080')).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('rgb e hsl (vírgulas ou espaços)', () => {
    expect(parseColor('rgb(10, 20, 30)')).toEqual({ r: 10, g: 20, b: 30 })
    expect(parseColor('rgba(10 20 30 / 0.5)')).toEqual({ r: 10, g: 20, b: 30 })
    expect(parseColor('hsl(0, 100%, 50%)')).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('inválido -> null', () => {
    expect(parseColor('var(--x)')).toBeNull()
    expect(parseColor('#12')).toBeNull()
  })
})

describe('contrastRatio / readableTextOn', () => {
  it('preto sobre branco = 21', () => {
    expect(contrastRatio('#000', '#fff')).toBeCloseTo(21, 0)
  })

  it('texto claro sobre fundo escuro e vice-versa', () => {
    expect(readableTextOn('#000000')).toBe('#ffffff')
    expect(readableTextOn('#ffffff')).toBe('#111111')
    expect(readableTextOn('hsl(220, 80%, 50%)')).toBe('#ffffff')
  })

  it('fundo não analisável cai no escuro', () => {
    expect(readableTextOn('var(--mc-x)')).toBe('#111111')
  })
})
