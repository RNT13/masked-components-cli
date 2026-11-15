import { describe, expect, it } from 'vitest'
import {
  contrastRatio,
  parseColor,
  pickReadable,
  readableTextOn
} from '../../templates/masked-utils/color'

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

describe('pickReadable', () => {
  it('devolve o primeiro candidato que atinge AA', () => {
    // fundo escuro: #fff5f7 atinge AA antes do branco puro
    expect(pickReadable('#111111', ['#fff5f7', '#ffffff', '#111111'])).toBe('#fff5f7')
  })

  it('candidatos do tema abaixo de AA -> cai no branco/preto', () => {
    // rose: #fff5f7 (~4.38) e #4a1424 (~3.19) não atingem 4.5 sobre #e11d48
    expect(pickReadable('#e11d48', ['#fff5f7', '#4a1424', '#ffffff', '#111111'])).toBe('#ffffff')
  })

  it('pula candidatos sem contraste suficiente', () => {
    // branco sobre branco não atinge; cai no escuro
    expect(pickReadable('#ffffff', ['#eeeeee', '#111111'])).toBe('#111111')
  })

  it('nenhum candidato atinge AA -> devolve o de maior contraste', () => {
    const picked = pickReadable('#777777', ['#888888', '#999999', '#aaaaaa'])
    expect(picked).toBe('#aaaaaa')
  })

  it('ignora candidatos undefined e cores inválidas', () => {
    expect(pickReadable('#000000', [undefined, 'var(--x)', '#ffffff'])).toBe('#ffffff')
  })

  it('lista vazia -> fallback escuro', () => {
    expect(pickReadable('#000000', [])).toBe('#111111')
    expect(pickReadable('#000000', [undefined])).toBe('#111111')
  })

  it('fundo inválido -> primeiro candidato válido', () => {
    expect(pickReadable('var(--x)', ['#aabbcc', '#112233'])).toBe('#aabbcc')
  })
})
