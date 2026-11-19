import { resolveSpacing } from '@/utils/masked-utils'
import type { DefaultTheme } from 'styled-components'
import type { ContainerVariant, SpacingKey } from './MaskedContainer.types'

/** Overrides granulares de tokens --mc-container-*. */
export interface ContainerTokenOverrides {
  maxWidth?: string
  paddingX?: string
  paddingY?: string
}

export interface ResolveContainerTokensInput {
  variant?: ContainerVariant
  paddingX?: SpacingKey | number | (string & {})
  paddingY?: SpacingKey | number | (string & {})
  tokens?: ContainerTokenOverrides
}

/** Largura máxima por variante. 'full' ocupa todo o espaço do pai. */
export const CONTAINER_MAX_WIDTH: Record<ContainerVariant, string> = {
  narrow: '720px',
  default: '1120px',
  wide: '1440px',
  full: '100%'
}

/** "paddingX" -> "padding-x": o CSS lê --mc-container-padding-x. */
function toKebab(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
}

/**
 * Deriva tokens --mc-container-*. Container é neutro (não pinta): largura  
 * máxima por variante + gutters opcionais (escala theme.spacing).  
 * Precedência: tokens > props > default da variante.  
 */
export function resolveContainerTokens(
  input: ResolveContainerTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const merged: Record<string, string | undefined> = {
    maxWidth: CONTAINER_MAX_WIDTH[input.variant ?? 'default'],
    paddingX: resolveSpacing(input.paddingX, theme.spacing),
    paddingY: resolveSpacing(input.paddingY, theme.spacing),
    ...input.tokens
  }

  const style: Record<string, string> = {}

  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined) style[`--mc-container-${toKebab(key)}`] = value
  }

  return style
}
