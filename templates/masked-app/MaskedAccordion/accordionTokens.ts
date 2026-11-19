import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Overrides granulares de tokens --mc-accordion-* (chave = nome sem prefixo). */
export interface AccordionTokenOverrides {
  accent?: string
  border?: string
}

export interface ResolveAccordionTokensInput {
  colorTheme?: ColorThemeName
  tokens?: AccordionTokenOverrides
}

/**
 * Deriva tokens --mc-accordion-*: destaque (indicador) e borda. O texto
 * herda do contexto. Precedência: tokens > colorTheme > tema.
 */
export function resolveAccordionTokens(
  input: ResolveAccordionTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const semantic = resolveSemanticColors(theme)
  const surface = resolveSurface('plain', input.colorTheme, theme)
  return buildTokenStyle(
    'accordion',
    { accent: input.colorTheme ? surface.accent : semantic.text, border: semantic.border },
    input.tokens
  )
}

/**
 * Próximo estado de abertos ao alternar `id`:
 * - múltiplo: adiciona/remove;
 * - único: abre só esse; se já estava aberto e `collapsible`, fecha.
 */
export function toggleOpen(
  open: string[],
  id: string,
  options: { multiple: boolean; collapsible: boolean }
): string[] {
  const isOpen = open.includes(id)
  if (options.multiple) return isOpen ? open.filter((x) => x !== id) : [...open, id]
  if (isOpen) return options.collapsible ? [] : open
  return [id]
}
