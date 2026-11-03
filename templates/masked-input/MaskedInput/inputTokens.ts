// Resolve colorTheme + overrides em CSS vars --mc-input-*.
// Padrão F.26: --mc-<componente>-<propriedade>[-<estado>]
// Precedência: tokens (prop) > colorTheme (registro) > fallback do CSS.

import type { CSSProperties } from 'react'  
import { resolveColorTheme, type ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'  
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'


export const INPUT_TOKEN_PROPS = [
  'bg',
  'bg-focus',
  'fg',
  'border',
  'border-hover',
  'focus-ring',
  'placeholder',
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

export function resolveInputTokens(opts: {
  colorTheme?: ColorThemeName
  tokens?: InputTokens | Record<string, string | number>
}): CSSProperties {
  const vars: Record<string, string | number> = {}

  const values =
    opts.colorTheme && opts.colorTheme !== 'default'
      ? resolveColorTheme(opts.colorTheme, maskedTheme)
      : undefined

  if (values) {
    const border = values.light20 ?? values.base
    const ring = values.glow ?? values.light40 ?? values.base

    vars['--mc-input-border'] = border
    vars['--mc-input-border-hover'] = values.base
    vars['--mc-input-focus-ring'] = ring
    vars['--mc-input-label-fg'] = values.dark20 ?? values.base
    vars['--mc-input-icon-fg'] = values.base
    if (values.light08) vars['--mc-input-bg-focus'] = values.light08
    if (values.onBase) vars['--mc-input-fg'] = values.onBase
  }

  const tokens = opts.tokens as Record<string, string | number> | undefined
  for (const key of INPUT_TOKEN_PROPS) {
    const v = tokens?.[key]
    if (v !== undefined) vars[`--mc-input-${key}`] = v
  }

  return vars as CSSProperties
}
