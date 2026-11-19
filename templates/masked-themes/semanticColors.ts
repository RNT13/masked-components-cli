import type { DefaultTheme } from 'styled-components'

/**
 * Cores semânticas do tema ativo (as que mudam entre light/dark/paletas),  
 * com fallback seguro — usadas pelos componentes de estrutura da V3 para  
 * pintar superfícies neutras sem exigir `colorTheme`.  
 *
 * Função pura: recebe o tema (de `useMaskedTheme()`), não importa o  
 * MaskedThemes, e funciona com ou sem <ThemeProvider>.  
 */
export interface SemanticColors {
  /** Fundo de superfície (header, sidebar, footer, página). */
  surface: string
  /** Texto principal sobre a superfície. */
  text: string
  /** Texto secundário. */
  muted: string
  /** Bordas e divisores. */
  border: string
  /** Cor de destaque (itens ativos, links). */
  accent: string
  /** Fundo sutil (hover, seção tinted sem colorTheme). */
  subtle: string
}

export function resolveSemanticColors(theme: DefaultTheme): SemanticColors {
  const c = theme.colors
  return {
    surface: c.surfaceColor ?? '#ffffff',
    text: c.textColor ?? '#111111',
    muted: c.textMuted ?? '#555555',
    border: c.borderColor ?? 'rgba(128, 128, 128, 0.3)',
    accent: c.accentColor ?? c.primaryColor ?? '#2563eb',
    subtle: c.tertiaryColor ?? 'rgba(128, 128, 128, 0.12)'
  }
}
