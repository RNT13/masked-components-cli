import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import { readableTextOn } from '@/utils/masked-utils'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { DashboardVariant } from './MaskedDashboard.types'

/** Overrides granulares de tokens --mc-dashboard-* (chave = nome sem prefixo). */
export interface DashboardTokenOverrides {
  topbarBg?: string
  topbarFg?: string
  topbarBorder?: string
  contentBg?: string
}

export interface ResolveDashboardTokensInput {
  variant?: DashboardVariant
  colorTheme?: ColorThemeName
  tokens?: DashboardTokenOverrides
}

/** Mapeia o variant do painel nos variants dos componentes que ele compõe. */
export function getDashboardParts(variant: DashboardVariant | undefined) {
  switch (variant) {
    case 'saas':
      return { sidebar: 'floating', pageHeader: 'banner', tintedContent: false } as const
    case 'minimal':
      return { sidebar: 'minimal', pageHeader: 'simple', tintedContent: false } as const
    default:
      return { sidebar: 'fixed', pageHeader: 'simple', tintedContent: true } as const
  }
}

/**
 * Deriva tokens --mc-dashboard-*: a barra superior usa a superfície do tema
 * (ou, com colorTheme, base + texto por contraste WCAG); a área de conteúdo
 * recebe um fundo levemente tingido só no 'analytics'.
 * Precedência: tokens > colorTheme > tema.
 */
export function resolveDashboardTokens(
  input: ResolveDashboardTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const surface = resolveSurface('solid', input.colorTheme, theme)
  const tinted = getDashboardParts(input.variant).tintedContent

  const overrides = { ...input.tokens }
  /* topbarBg simples sem topbarFg: o texto acompanha o novo fundo por contraste */
  if (overrides.topbarBg && !overrides.topbarFg && /^(#|hsl|rgb)/i.test(overrides.topbarBg)) {
    overrides.topbarFg = readableTextOn(overrides.topbarBg)
  }

  return buildTokenStyle(
    'dashboard',
    {
      topbarBg: surface.bg,
      topbarFg: surface.fg,
      topbarBorder: surface.border,
      contentBg: tinted ? 'color-mix(in srgb, currentColor 4%, transparent)' : undefined
    },
    overrides
  )
}
