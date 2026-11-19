import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Overrides granulares de tokens --mc-pagination-* (chave = nome sem prefixo). */
export interface PaginationTokenOverrides {
  accent?: string
  accentFg?: string
  border?: string
}

export interface ResolvePaginationTokensInput {
  colorTheme?: ColorThemeName
  tokens?: PaginationTokenOverrides
}

/**
 * Deriva tokens --mc-pagination-*: o par accent/accentFg (com contraste
 * WCAG) pinta a página atual. Precedência: tokens > colorTheme > tema.
 */
export function resolvePaginationTokens(
  input: ResolvePaginationTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const semantic = resolveSemanticColors(theme)
  const surface = resolveSurface('plain', input.colorTheme, theme)
  const useTheme = Boolean(input.colorTheme)
  return buildTokenStyle(
    'pagination',
    {
      accent: useTheme ? surface.accent : semantic.text,
      accentFg: useTheme ? surface.accentFg : semantic.surface,
      border: semantic.border
    },
    input.tokens
  )
}

export type PageItem = number | 'ellipsis-start' | 'ellipsis-end'

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i)

/**
 * Páginas a exibir, com "…" quando há salto. Sempre mostra a primeira e a
 * última; a quantidade de itens é constante (2*siblingCount + 5) para a barra
 * não "pular" ao navegar. Com poucas páginas, mostra todas.
 */
export function getPageRange(page: number, pageCount: number, siblingCount = 1): PageItem[] {
  const total = Math.max(1, Math.floor(pageCount))
  const current = Math.min(Math.max(1, Math.floor(page)), total)
  const sibling = Math.max(0, Math.floor(siblingCount))
  const slots = sibling * 2 + 5

  if (total <= slots) return range(1, total)

  const left = Math.max(current - sibling, 1)
  const right = Math.min(current + sibling, total)
  const showLeftDots = left > 2
  const showRightDots = right < total - 1
  const edgeCount = 3 + 2 * sibling

  if (!showLeftDots && showRightDots) return [...range(1, edgeCount), 'ellipsis-end', total]
  if (showLeftDots && !showRightDots) {
    return [1, 'ellipsis-start', ...range(total - edgeCount + 1, total)]
  }
  return [1, 'ellipsis-start', ...range(left, right), 'ellipsis-end', total]
}

/** Mantém a página dentro de [1, pageCount]. */
export function clampPage(page: number, pageCount: number): number {
  return Math.min(Math.max(1, Math.floor(page)), Math.max(1, Math.floor(pageCount)))
}
