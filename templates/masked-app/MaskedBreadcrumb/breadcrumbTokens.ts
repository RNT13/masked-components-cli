import { buildTokenStyle } from '@/styles/surfaceTokens'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'

/** Overrides granulares de tokens --mc-breadcrumb-* (chave = nome sem prefixo). */
export interface BreadcrumbTokenOverrides {
  fg?: string
  muted?: string
}

export interface ResolveBreadcrumbTokensInput {
  tokens?: BreadcrumbTokenOverrides
}

/**
 * Deriva tokens --mc-breadcrumb-*: texto atual e links/separadores em
 * `muted`, ambos do tema ativo (herdam o contraste do tema).
 * Precedência: tokens > tema.
 */
export function resolveBreadcrumbTokens(
  input: ResolveBreadcrumbTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const semantic = resolveSemanticColors(theme)
  return buildTokenStyle('breadcrumb', { fg: semantic.text, muted: semantic.muted }, input.tokens)
}

/** Resultado da colapsagem: itens reais e "…" no lugar dos escondidos. */
export type BreadcrumbEntry<T> = { kind: 'item'; item: T; index: number } | { kind: 'ellipsis' }

/**
 * Mantém o primeiro item e os `maxItems - 2` últimos; o miolo vira um "…".
 * Com `maxItems` indefinido, ou itens suficientes, devolve tudo.
 */
export function collapseBreadcrumb<T>(
  items: T[],
  maxItems: number | undefined
): BreadcrumbEntry<T>[] {
  const all: BreadcrumbEntry<T>[] = items.map((item, index) => ({ kind: 'item', item, index }))
  if (maxItems === undefined || maxItems < 3 || items.length <= maxItems) return all
  const tail = maxItems - 2
  return [all[0], { kind: 'ellipsis' }, ...all.slice(items.length - tail)]
}
