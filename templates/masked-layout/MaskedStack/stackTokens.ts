import { resolveSpacing } from '@/utils/masked-utils'
import type { DefaultTheme } from 'styled-components'
import type { StackDirection, StackGap, StackVariant } from './MaskedStack.types'

/** Overrides granulares de tokens --mc-stack-*. */
export interface StackTokenOverrides {
  /** Gap entre itens (vence a prop gap). */
  gap?: string
  /** Cor da linha automática do divisor (divider={true}). */
  divider?: string
}

export interface ResolveStackTokensInput {
  variant?: StackVariant
  direction?: StackDirection
  gap?: StackGap
  tokens?: StackTokenOverrides
}

/** camelCase -> kebab-case (mesmo helper dos demais tokens, mantido por simetria). */
function toKebab(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
}

/**
 * Deriva tokens --mc-stack-*. Stack é neutro (não pinta superfície); do tema
 * usa só a escala de espaçamento (theme.spacing):
 * - gap: prop (default 'md' = theme.spacing.md); tokens.gap vence;
 * - tokens.divider: cor da linha automática.
 */
export function resolveStackTokens(
  input: ResolveStackTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const merged: Record<string, string | undefined> = {
    gap: resolveSpacing(input.gap ?? 'md', theme.spacing),
    ...input.tokens
  }

  const style: Record<string, string> = {}

  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined) style[`--mc-stack-${toKebab(key)}`] = value
  }

  return style
}

/** Direção efetiva: a prop direction vence o variant. */
export function resolveStackDirection(input: {
  variant?: StackVariant
  direction?: StackDirection
}): StackDirection {
  if (input.direction) return input.direction
  if (input.variant === 'row' || input.variant === 'inline' || input.variant === 'spread') {
    return 'row'
  }
  return 'column'
}
