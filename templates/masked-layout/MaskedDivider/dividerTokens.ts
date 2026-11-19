import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { resolveSpacing } from '@/utils/masked-utils'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { SpacingKey } from './MaskedDivider.types'

/** Overrides granulares de tokens --mc-divider-*. */
export interface DividerTokenOverrides {
  color?: string
  label?: string
  thickness?: string
  spacing?: string
  gap?: string
}

export interface ResolveDividerTokensInput {
  colorTheme?: ColorThemeName
  spacing?: SpacingKey | number | (string & {})
  thickness?: string
  tokens?: DividerTokenOverrides
}

/**
 * Deriva tokens --mc-divider-*. A linha usa a borda do tema (ou a paleta do
 * colorTheme); o label usa o texto secundário do tema. Divisor é decorativo
 * por natureza, então não há exigência de contraste na linha — o label usa
 * sempre a cor de texto do tema. Precedência: tokens > props > colorTheme > tema.
 */
export function resolveDividerTokens(
  input: ResolveDividerTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const colors = resolveColorTheme(input.colorTheme, theme)
  const semantic = resolveSemanticColors(theme)

  const merged: Record<string, string | undefined> = {
    color: colors ? (colors.light40 ?? colors.base) : semantic.border,
    label: semantic.muted,
    thickness: input.thickness,
    spacing: resolveSpacing(input.spacing, theme.spacing),
    ...input.tokens
  }

  const style: Record<string, string> = {}

  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined) style[`--mc-divider-${key}`] = value
  }

  return style
}
