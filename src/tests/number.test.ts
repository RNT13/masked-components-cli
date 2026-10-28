// templates/masked-utils/number.test.ts  
import { describe, expect, it } from 'vitest'  
import { formatDecimal, formatNumber, formatPercent, getPercentage, toNumber } from '../../templates/masked-utils'
  
describe('toNumber', () => {  
  it('inválido -> 0', () => {  
    expect(toNumber('abc')).toBe(0)  
    expect(toNumber(undefined)).toBe(0)  
    expect(toNumber('12,5')).toBe(12) // string pt-BR não é número JS  
  })  
})  
  
describe('formatNumber', () => {  
  it('pt-BR com casas decimais', () => {  
    expect(formatNumber(12345.678)).toBe('12.345,678')  
    expect(formatNumber(12345.678, 1)).toBe('12.345,7')  
    expect(formatNumber(12345.678, 1, { locale: 'en-US' })).toBe('12,345.7')  
  })  
})  
  
describe('formatDecimal / formatPercent', () => {  
  it('separador do locale', () => {  
    expect(formatDecimal(12.345, 1)).toBe('12,3')  
    expect(formatDecimal(12.345, 1, { locale: 'en-US' })).toBe('12.3')  
    expect(formatPercent(12.345)).toBe('12,3%')  
    expect(formatPercent(12.345, 1, { showSign: true })).toBe('+12,3%')  
    expect(formatPercent(12.345, 1, { locale: 'en-US' })).toBe('12.3%')  
  })  
})  
  
describe('getPercentage', () => {  
  it('limita 0–100 e protege max inválido', () => {  
    expect(getPercentage(50, 200)).toBe(25)  
    expect(getPercentage(300, 200)).toBe(100)  
    expect(getPercentage(10, 0)).toBe(0)  
  })  
})