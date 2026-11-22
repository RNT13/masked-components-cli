import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import type { ModalTokenOverrides } from './MaskedModal.types'

export interface ResolveModalTokensInput {
  colorTheme?: ColorThemeName
  tokens?: ModalTokenOverrides
}

/**
 * Deriva tokens --mc-modal-*. Painel usa superfície sólida do tema (ou da  
 * paleta); overlay é sempre um scrim escuro translúcido.  
 * Precedência: tokens > colorTheme > tema.  
 */
export function resolveModalTokens(
  input: ResolveModalTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const surface = resolveSurface('solid', input.colorTheme, theme)

  const base: Record<string, string | undefined> = {
    bg: surface.bg,
    fg: surface.fg,
    muted: surface.muted,
    border: surface.border,
    overlayBg: 'color-mix(in srgb, black 55%, transparent)',
    radius: '12px',
    shadow: '0 20px 50px color-mix(in srgb, black 35%, transparent)'
  }

  return buildTokenStyle('modal', base, input.tokens)
}
