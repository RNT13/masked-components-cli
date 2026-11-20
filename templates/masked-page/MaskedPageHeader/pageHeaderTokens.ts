import { buildTokenStyle, resolveSurface, type SurfaceKind } from '@/styles/surfaceTokens'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { PageHeaderVariant } from './MaskedPageHeader.types'

/** Overrides granulares de tokens --mc-page-header-* (chave = nome sem prefixo). */
export interface PageHeaderTokenOverrides {
  bg?: string
  fg?: string
  muted?: string
  border?: string
}

export interface ResolvePageHeaderTokensInput {
  variant?: PageHeaderVariant
  colorTheme?: ColorThemeName
  tokens?: PageHeaderTokenOverrides
}

const VARIANT_SURFACE: Record<PageHeaderVariant, SurfaceKind> = {
  simple: 'plain',
  banner: 'tinted',
  gradient: 'gradient'
}

/**
 * Deriva tokens --mc-page-header-* mapeando cada variante para a superfície  
 * compartilhada equivalente:  
 * - simple -> plain: sem fundo, só a borda inferior (borda do tema ou do colorTheme);  
 * - banner -> tinted: fundo suave (10% da base do colorTheme, ou `subtle` do tema);  
 * - gradient -> gradient: base → base misturada com o texto, fg por contraste WCAG.  
 * Precedência: tokens > colorTheme > tema.  
 */
export function resolvePageHeaderTokens(
  input: ResolvePageHeaderTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const surface = resolveSurface(
    VARIANT_SURFACE[input.variant ?? 'simple'] ?? 'plain',
    input.colorTheme,
    theme
  )

  return buildTokenStyle(
    'page-header',
    {
      bg: surface.bg,
      fg: surface.fg,
      muted: surface.muted,
      border: surface.border
    },
    input.tokens
  )
}
