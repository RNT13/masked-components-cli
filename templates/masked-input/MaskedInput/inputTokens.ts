// templates/masked-input/MaskedInput/inputTokens.ts
// Resolve os tokens --mc-input-* (prop `tokens` > preset `colorTheme` > fallback do tema).
import type { CSSProperties } from 'react'
import { getColorThemeTokens } from '@/styles/MaskedThemes/ColorThemes'

export type InputColorTheme = Parameters<typeof getColorThemeTokens>[0]

export type InputTokenOverrides = Partial<
  Record<
    | 'bg'
    | 'bgFocus'
    | 'fg'
    | 'border'
    | 'borderHover'
    | 'focusRing'
    | 'placeholder'
    | 'labelFg'
    | 'iconFg'
    | 'errorBg'
    | 'errorBorder'
    | 'errorFg'
    | 'errorRing'
    | 'disabledBg',
    string
  >
>

const TOKEN_KEYS: Record<keyof Required<InputTokenOverrides>, string> = {
  bg: '--mc-input-bg',
  bgFocus: '--mc-input-bg-focus',
  fg: '--mc-input-fg',
  border: '--mc-input-border',
  borderHover: '--mc-input-border-hover',
  focusRing: '--mc-input-focus-ring',
  placeholder: '--mc-input-placeholder',
  labelFg: '--mc-input-label-fg',
  iconFg: '--mc-input-icon-fg',
  errorBg: '--mc-input-error-bg',
  errorBorder: '--mc-input-error-border',
  errorFg: '--mc-input-error-fg',
  errorRing: '--mc-input-error-ring',
  disabledBg: '--mc-input-disabled-bg'
}

export function resolveInputTokens(opts: {
  colorTheme?: InputColorTheme
  tokens?: InputTokenOverrides
}): CSSProperties | undefined {
  const preset =
    (opts.colorTheme != null
      ? (
          getColorThemeTokens(opts.colorTheme) as
            Record<string, Record<string, string> | undefined> | undefined
        )?.input
      : undefined) ?? {}

  const merged: Record<string, string> = { ...preset, ...(opts.tokens ?? {}) }
  const style: Record<string, string> = {}
  for (const [key, cssVar] of Object.entries(TOKEN_KEYS)) {
    const v = merged[key]
    if (v != null) style[cssVar] = v
  }
  return Object.keys(style).length ? (style as CSSProperties) : undefined
}
