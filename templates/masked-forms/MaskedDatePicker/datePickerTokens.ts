import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Overrides granulares de tokens --mc-date-picker-* (chave = nome sem prefixo). */
export interface DatePickerTokenOverrides {
  accent?: string
  accentFg?: string
  bg?: string
  fg?: string
  border?: string
}

export interface ResolveDatePickerTokensInput {
  colorTheme?: ColorThemeName
  tokens?: DatePickerTokenOverrides
}

/**
 * Deriva tokens --mc-date-picker-*: o painel usa superfície e texto do tema
 * (par com contraste do próprio tema); o dia selecionado usa o par
 * accent/accentFg (contraste WCAG). Sem colorTheme, o selecionado é texto
 * sobre superfície invertidos. Precedência: tokens > colorTheme > tema.
 */
export function resolveDatePickerTokens(
  input: ResolveDatePickerTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const semantic = resolveSemanticColors(theme)
  const surface = resolveSurface('plain', input.colorTheme, theme)
  return buildTokenStyle(
    'date-picker',
    {
      accent: input.colorTheme ? surface.accent : semantic.text,
      accentFg: input.colorTheme ? surface.accentFg : semantic.surface,
      bg: semantic.surface,
      fg: semantic.text,
      border: semantic.border
    },
    input.tokens
  )
}
