import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { HeaderVariant } from './MaskedHeader.types'

/** Overrides granulares de tokens --mc-header-* (chave = nome sem prefixo). */
export interface HeaderTokenOverrides {
  bg?: string
  fg?: string
  border?: string
  /** Cor do texto dos links no menu mobile (painel do Drawer). */
  menuFg?: string
  height?: string
}

export interface ResolveHeaderTokensInput {
  variant?: HeaderVariant
  colorTheme?: ColorThemeName
  tokens?: HeaderTokenOverrides
}

/**
 * Deriva tokens --mc-header-* sobre a superfície 'solid' compartilhada.  
 * Por variante:  
 * - static/sticky: superfície do tema (ou base do colorTheme) + texto por  
 *   contraste WCAG + borda inferior;  
 * - blur: igual, mas o fundo é 80% opaco (o blur vem do styled);  
 * - transparent: sem fundo e sem borda — texto herdado, a menos que  
 *   tokens.fg seja informado.  
 * `menuFg` (texto do menu mobile, que vive no painel do Drawer) acompanha o  
 * colorTheme; sem ele, usa o texto do tema. Precedência: tokens > colorTheme > tema.  
 */
export function resolveHeaderTokens(
  input: ResolveHeaderTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const surface = resolveSurface('solid', input.colorTheme, theme)
  const transparent = input.variant === 'transparent'

  const base: Record<string, string | undefined> = transparent
    ? /* sem bg/fg: o header transparente herda o texto do pai */
      { border: 'transparent' }
    : {
        bg:
          input.variant === 'blur'
            ? `color-mix(in srgb, ${surface.bg} 80%, transparent)`
            : surface.bg,
        fg: surface.fg,
        border: surface.border
      }

  const style = buildTokenStyle('header', { ...base, menuFg: surface.fg }, input.tokens)

  /*
   * No 'transparent', tokens.bg é emitido mas NÃO re-deriva o fg (o header
   * continua herdando o texto do pai) — desfaz a re-derivação do buildTokenStyle.
   */
  if (transparent && input.tokens?.bg && !input.tokens?.fg) {
    delete style['--mc-header-fg']
  }

  return style
}
