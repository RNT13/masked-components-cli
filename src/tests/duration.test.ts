// templates/masked-utils/duration.test.ts  
import { describe, expect, it } from 'vitest'   
import { formatDuration, averageDuration } from '../../templates/masked-utils'
  
describe('formatDuration', () => {  
  it('minutos curtos', () => {  
    expect(formatDuration(45)).toBe('45min')  
    expect(formatDuration(45, { locale: 'en' })).toBe('45min')  
  })  
  it('horas e minutos por dicionário', () => {  
    expect(formatDuration(90)).toBe('1h 30min')  
    expect(formatDuration(120)).toBe('2h')  
  })  
  it('vazio/inválido -> dash', () => {  
    expect(formatDuration(undefined)).toBe('—')  
    expect(formatDuration('abc')).toBe('—')  
    expect(formatDuration(undefined, { locale: 'en' })).toBe('—')  
  })  
})  
  
describe('averageDuration', () => {  
  it('média formatada; lista vazia -> dash', () => {  
    expect(averageDuration([{ duration: 30 }, { duration: 60 }])).toBe('45')  
    expect(averageDuration([])).toBe('—')  
  })  
})