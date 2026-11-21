import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'

export interface ProgressTokenOverrides {
  /** Cor do indicador (barra/arco). */
  bar?: string
  /** Trilha (fundo) do indicador. */
  track?: string
  /** Cor do rótulo e do valor. */
  fg?: string
}

export interface ResolveProgressTokensInput {
  colorTheme?: ColorThemeName
  tokens?: ProgressTokenOverrides
}

/**
 * Deriva tokens --mc-progress-*. O indicador usa o accent da superfície  
 * 'plain' (colorTheme.base ou accent do tema); a trilha é o accent a 16% —  
 * contraste de barra/trilha é decorativo (não-texto), o texto usa fg do tema.  
 * Precedência: tokens > colorTheme > tema.  
 */
export function resolveProgressTokens(
  input: ResolveProgressTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const surface = resolveSurface('plain', input.colorTheme, theme)

  return buildTokenStyle(
    'progress',
    {
      bar: surface.accent,
      track: `color-mix(in srgb, ${surface.accent} 16%, transparent)`,
      fg: surface.fg
    },
    input.tokens
  )
}
