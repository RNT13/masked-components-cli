import type { CSSProperties } from 'react'
import type { DefaultTheme } from 'styled-components'

import { resolveColorTheme, type ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'

/**
 * Propriedades disponíveis para os tokens CSS dos inputs.
 *
 * Padrão F.26:
 * --mc-input-<propriedade>[-<estado>]
 */
export const INPUT_TOKEN_PROPS = [
  'bg',
  'bg-focus',
  'fg',
  'border',
  'border-hover',
  'focus-ring',
  'placeholder',
  'helper-fg',
  'label-fg',
  'icon-fg',
  'error-bg',
  'error-border',
  'error-fg',
  'error-ring',
  'disabled-bg'
] as const

export type InputTokenProp = (typeof INPUT_TOKEN_PROPS)[number]

export type InputTokens = Partial<Record<InputTokenProp, string | number>>

/** Tema de cor aceito pela prop `colorTheme` dos inputs. */
export type InputColorTheme = ColorThemeName

/** Overrides de tokens `--mc-input-*` aceitos pela prop `tokens`. */
export type InputTokenOverrides = InputTokens

/**
 * Resolve os tokens CSS dos inputs.
 *
 * Precedência:
 * 1. Overrides recebidos pela prop `tokens`.
 * 2. Valores derivados do `colorTheme`.
 * 3. Fallbacks definidos no CSS do componente.
 *
 * O parâmetro `theme` permite utilizar um tema customizado.
 * Quando omitido, utiliza `maskedTheme` para manter a retrocompatibilidade.
 */
export function resolveInputTokens(
  input: {
    colorTheme?: ColorThemeName
    tokens?: InputTokens | Record<string, string | number>
  },
  theme: DefaultTheme = maskedTheme
): CSSProperties {
  const vars: Record<string, string | number> = {}

  const values =
    input.colorTheme && input.colorTheme !== 'default'
      ? resolveColorTheme(input.colorTheme, theme)
      : undefined

  if (values) {
    const border = values.light20 ?? values.base
    const ring = values.glow ?? values.light40 ?? values.base

    vars['--mc-input-border'] = border
    vars['--mc-input-border-hover'] = values.base
    vars['--mc-input-focus-ring'] = ring
    vars['--mc-input-label-fg'] = values.dark20 ?? values.base
    vars['--mc-input-icon-fg'] = values.base

    const muted = (values as unknown as { semantic?: { muted?: string } }).semantic?.muted

    if (muted) {
      vars['--mc-input-helper-fg'] = muted
    }

    if (values.light08) {
      vars['--mc-input-bg-focus'] = values.light08
    }

    if (values.onBase) {
      vars['--mc-input-fg'] = values.onBase
    }
  }

  const tokens = input.tokens as Record<string, string | number> | undefined

  for (const key of INPUT_TOKEN_PROPS) {
    const value = tokens?.[key]

    if (value !== undefined) {
      vars[`--mc-input-${key}`] = value
    }
  }

  return vars as CSSProperties
}
