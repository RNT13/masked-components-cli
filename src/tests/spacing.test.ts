import { describe, expect, it } from 'vitest'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { resolveSpacing } from '../../templates/masked-utils/spacing'

/** A escala oficial é theme.spacing (MaskedThemes); o util só a recebe por parâmetro. */
const scale = maskedTheme.spacing

describe('resolveSpacing — escala recebida por parâmetro (theme.spacing)', () => {
  it('toda chave de theme.spacing (2xs..5xl) resolve para o valor do tema', () => {
    for (const [key, value] of Object.entries(scale)) {
      expect(resolveSpacing(key, scale)).toBe(value)
    }
    expect(Object.keys(scale)).toEqual(
      expect.arrayContaining(['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'])
    )
  })

  it('número vira px; string CSS fora da escala passa direto', () => {
    expect(resolveSpacing(24, scale)).toBe('24px')
    expect(resolveSpacing(0, scale)).toBe('0px')
    expect(resolveSpacing('1.5rem', scale)).toBe('1.5rem')
    expect(resolveSpacing('10%', scale)).toBe('10%')
  })

  it('undefined cai no fallback — ou não emite valor', () => {
    expect(resolveSpacing(undefined, scale)).toBeUndefined()
    expect(resolveSpacing(undefined, scale, '1rem')).toBe('1rem')
  })

  it('não confunde chaves herdadas de Object.prototype com chaves da escala', () => {
    expect(resolveSpacing('toString', scale)).toBe('toString')
    expect(resolveSpacing('constructor', scale)).toBe('constructor')
  })

  it('a escala é injetável: outra escala, outro resultado (sem acoplamento ao tema)', () => {
    expect(resolveSpacing('md', { md: '20px' })).toBe('20px')
  })
})
