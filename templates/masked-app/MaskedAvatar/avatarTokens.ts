import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { AvatarSizeName } from './MaskedAvatar.types'

/** Overrides granulares de tokens --mc-avatar-* (chave = nome sem prefixo). */
export interface AvatarTokenOverrides {
  bg?: string
  fg?: string
  ring?: string
  statusOnline?: string
  statusAway?: string
  statusBusy?: string
  statusOffline?: string
}

export interface ResolveAvatarTokensInput {
  colorTheme?: ColorThemeName
  tokens?: AvatarTokenOverrides
}

/** Tamanhos nomeados em px. */
export const AVATAR_SIZES: Record<AvatarSizeName, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80
}

export function resolveAvatarSize(size: AvatarSizeName | number | undefined): number {
  if (typeof size === 'number') return size
  return AVATAR_SIZES[size ?? 'md']
}

/**
 * Deriva tokens --mc-avatar-*: fundo/texto das iniciais (colorTheme = base +
 * texto por contraste WCAG; sem ele, fundo e texto neutros do tema) e as
 * cores de presença, que vêm da paleta do tema (verde, amarelo, vermelho, cinza).
 * Precedência: tokens > colorTheme > tema.
 */
export function resolveAvatarTokens(
  input: ResolveAvatarTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const semantic = resolveSemanticColors(theme)
  const surface = input.colorTheme ? resolveSurface('solid', input.colorTheme, theme) : undefined

  return buildTokenStyle(
    'avatar',
    {
      bg: surface?.bg ?? semantic.subtle,
      fg: surface?.fg ?? semantic.text,
      ring: semantic.surface,
      statusOnline: theme.colors.baseGreen.base,
      statusAway: theme.colors.baseYellow.base,
      statusBusy: theme.colors.baseRed.base,
      statusOffline: theme.colors.baseGray.base
    },
    input.tokens
  )
}
