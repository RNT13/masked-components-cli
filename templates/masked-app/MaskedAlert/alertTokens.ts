import type { DefaultTheme } from 'styled-components'  
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'  
import { readableTextOn } from '@/utils/masked-utils'
import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { resolveSemanticColors } from '@/styles/semanticColors'
import { buildTokenStyle } from '@/styles/surfaceTokens'
import type { AlertTone, AlertVariant } from './MaskedAlert.types'

/** Overrides granulares de tokens --mc-alert-* (chave = nome sem prefixo). */
export interface AlertTokenOverrides {
  bg?: string
  fg?: string
  border?: string
  icon?: string
}

export interface ResolveAlertTokensInput {
  tone?: AlertTone
  variant?: AlertVariant
  colorTheme?: ColorThemeName
  tokens?: AlertTokenOverrides
}

/*
 * Cores-base por tone. Fixas (não vêm do tema) porque carregam significado
 * semântico universal; o texto sempre passa por readableTextOn (WCAG AA).
 */
const TONE_BASE: Record<AlertTone, string> = {
  info: '#2563eb',
  success: '#15803d',
  warning: '#b45309',
  error: '#b91c1c'
}

/**
 * Deriva tokens --mc-alert-*. `colorTheme` vence o tone (base da paleta).  
 * - soft: fundo tintado (color-mix 12%) + texto/borda na cor do tone;  
 * - solid: fundo na cor do tone + texto por contraste WCAG;  
 * - outline: sem fundo, borda e texto na cor do tone.  
 * Precedência: tokens > colorTheme > tone.  
 */
export function resolveAlertTokens(
  input: ResolveAlertTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const colors = resolveColorTheme(input.colorTheme, theme)
  const semantic = resolveSemanticColors(theme)

  const base = colors?.base ?? TONE_BASE[input.tone ?? 'info']
  const onBase = colors?.onBase ?? readableTextOn(base)
  const variant = input.variant ?? 'soft'

  const themed: Record<string, string | undefined> =
    variant === 'solid'
      ? { bg: base, fg: onBase, border: 'transparent', icon: onBase }
      : variant === 'outline'
        ? {
            bg: undefined,
            fg: colors ? onBase : base,
            border: base,
            icon: colors ? onBase : base
          }
        : {
            bg: `color-mix(in srgb, ${base} 12%, ${semantic.surface})`,
            fg: colors ? onBase : semantic.text,
            border: `color-mix(in srgb, ${base} 35%, transparent)`,
            icon: base
          }

  return buildTokenStyle('alert', themed, input.tokens)
}
