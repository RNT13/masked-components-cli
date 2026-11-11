// Resolve colorTheme + overrides em CSS vars --mc-btn-*/--mc-switch-*.
// Padrão F.26: --mc-<componente>-<propriedade>[-<estado>]

import type { CSSProperties } from 'react'
import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import { readableTextOn } from '@/utils/masked-utils'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Paleta neutra da lib (F.25). */
const NEUTRAL = {
  bg: '#1a1a1a',
  fg: '#fafafa',
  border: '#1a1a1a',
  ring: '#1a1a1a'
}

const TOKEN_PROPS = [
  'bg',
  'bg-hover',
  'bg-active',
  'fg',
  'fg-hover',
  'fg-active',
  'border',
  'border-hover',
  'border-active',
  'ring',
  'ring-focus',
  'shadow',
  'shadow-active',
  'radius',
  'gradient',
  'gradient-hover',
  'gradient-active',
  'neon-color',
  'neon-glow',
  'neon-shadow',
  'neon-shadow-hover',
  'danger-bg',
  'danger-bg-hover',
  'danger-fg',
  'danger-border',
  'danger-ring',
  'danger-gradient',
  'danger-gradient-hover',
  'disabled-opacity'
] as const

const SWITCH_TOKEN_PROPS = [
  'track-on',
  'track-off',
  'knob-bg',
  'knob-shadow',
  'border-on',
  'border-off',
  'ring-focus'
] as const

/**
 * Tokens cujo valor numérico é unitless (não recebem sufixo 'px').
 * Qualquer outro número vira '<n>px' — ex.: radius: 999 -> '999px'.
 */
const UNITLESS_TOKENS = new Set<string>(['disabled-opacity'])

const toCssValue = (key: string, value: string | number): string | number =>
  typeof value === 'number' && !UNITLESS_TOKENS.has(key) ? `${value}px` : value

export type ButtonTokensStyle = CSSProperties

/**
 * Gera o objeto de style com as CSS vars do botão.
 * Precedência: tokens (prop) > colorTheme (registro) > nada (CSS usa fallback do tema).
 * O texto sobre `bg` é escolhido por contraste (WCAG) quando o tema não define `onBase`.
 *
 * @example <button style={resolveButtonTokens({ colorTheme: 'ruby' })} />
 */
export function resolveButtonTokens(opts: {
  colorTheme?: ColorThemeName
  tokens?: Record<string, string | number>
}): ButtonTokensStyle {
  const vars: Record<string, string | number> = {}

  const c =
    opts.colorTheme && opts.colorTheme !== 'default'
      ? resolveColorTheme(opts.colorTheme, maskedTheme)
      : undefined

  if (c) {
    const bg = c.base
    const bgHover = c.dark08 ?? c.base
    const bgActive = c.dark20 ?? bgHover
    const fg = c.onBase ?? readableTextOn(bg)
    const ring = c.glow ?? c.light50 ?? c.base

    vars['--mc-btn-bg'] = bg
    vars['--mc-btn-bg-hover'] = bgHover
    vars['--mc-btn-bg-active'] = bgActive
    vars['--mc-btn-fg'] = fg
    vars['--mc-btn-fg-hover'] = fg
    vars['--mc-btn-fg-active'] = fg
    vars['--mc-btn-border'] = bg
    vars['--mc-btn-border-hover'] = bgHover
    vars['--mc-btn-border-active'] = bgActive
    vars['--mc-btn-ring'] = ring
    vars['--mc-btn-ring-focus'] = ring

    // gradient: derivado da rampa clara -> base
    const top = c.light20 ?? bgHover
    vars['--mc-btn-gradient'] = `linear-gradient(180deg, ${top}, ${bg})`
    vars['--mc-btn-gradient-hover'] = `linear-gradient(180deg, ${bg}, ${bgHover})`
    vars['--mc-btn-gradient-active'] = `linear-gradient(180deg, ${bgActive}, ${bgHover})`

    // neon: glow da paleta
    vars['--mc-btn-neon-color'] = c.light20 ?? bg
    vars['--mc-btn-neon-glow'] = ring

    // switch/checkbox/radio herdam o colorTheme
    vars['--mc-switch-track-on'] = bg
    vars['--mc-switch-border-on'] = bg
    vars['--mc-switch-ring-focus'] = ring
  }

  // overrides granulares (prop `tokens`): maior precedência.
  // Números viram '<n>px' (exceto tokens unitless como disabled-opacity).
  for (const key of TOKEN_PROPS) {
    const v = opts.tokens?.[key]
    if (v !== undefined) vars[`--mc-btn-${key}`] = toCssValue(key, v)
  }
  for (const key of SWITCH_TOKEN_PROPS) {
    const v = opts.tokens?.[`switch-${key}`]
    if (v !== undefined) vars[`--mc-switch-${key}`] = toCssValue(`switch-${key}`, v)
  }

  return vars as ButtonTokensStyle
}

export { NEUTRAL as BUTTON_NEUTRAL_PALETTE }
