import { buildTokenStyle } from '@/styles/surfaceTokens'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'
import type { TooltipVariant } from './MaskedTooltip.types'

/** Overrides granulares de tokens --mc-tooltip-* (chave = nome sem prefixo). */
export interface TooltipTokenOverrides {
  bg?: string
  fg?: string
  border?: string
}

export interface ResolveTooltipTokensInput {
  variant?: TooltipVariant
  tokens?: TooltipTokenOverrides
}

/**
 * Deriva tokens --mc-tooltip-*. 'dark' inverte o tema (fundo = texto do tema,
 * texto = superfície); 'light' usa a superfície do tema com borda. Os dois
 * pares são o par texto/superfície do próprio tema, então herdam o contraste
 * dele. Precedência: tokens > variante.
 */
export function resolveTooltipTokens(
  input: ResolveTooltipTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const semantic = resolveSemanticColors(theme)

  const base =
    input.variant === 'light'
      ? { bg: semantic.surface, fg: semantic.text, border: semantic.border }
      : { bg: semantic.text, fg: semantic.surface, border: semantic.text }

  return buildTokenStyle('tooltip', base, input.tokens)
}
