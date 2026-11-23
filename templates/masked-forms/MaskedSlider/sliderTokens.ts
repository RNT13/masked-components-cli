import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Overrides granulares de tokens --mc-slider-* (chave = nome sem prefixo). */
export interface SliderTokenOverrides {
  accent?: string
  track?: string
  thumbBorder?: string
}

export interface ResolveSliderTokensInput {
  colorTheme?: ColorThemeName
  /** Posição atual em % (0 a 100), usada pelo preenchimento. */
  percent: number
  tokens?: SliderTokenOverrides
}

/**
 * Deriva tokens --mc-slider-*: `accent` pinta o preenchimento e o marcador,
 * `track` é o trilho vazio, `thumbBorder` o contorno do marcador (texto do
 * tema, para o marcador não sumir sobre o fundo). `percent` vira
 * `--mc-slider-percent`. Precedência: tokens > colorTheme > tema.
 */
export function resolveSliderTokens(
  input: ResolveSliderTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const semantic = resolveSemanticColors(theme)
  const surface = resolveSurface('plain', input.colorTheme, theme)
  return buildTokenStyle(
    'slider',
    {
      accent: input.colorTheme ? surface.accent : semantic.accent,
      track: semantic.border,
      thumbBorder: semantic.text,
      percent: `${input.percent}%`
    },
    input.tokens
  )
}

/** Posição de `value` entre `min` e `max`, em %, limitada a [0, 100]. */
export function percentOf(value: number, min: number, max: number): number {
  if (max <= min) return 0
  const percent = ((value - min) / (max - min)) * 100
  return Math.round(Math.min(100, Math.max(0, percent)) * 100) / 100
}

/**
 * Marcas do variant 'steps': uma por passo; se houver mais de `limit`,
 * 11 marcas igualmente espaçadas (para não poluir o trilho).
 */
export function getStepMarks(min: number, max: number, step: number, limit = 21): number[] {
  if (max <= min || step <= 0) return []
  const count = Math.floor((max - min) / step) + 1
  if (count <= limit) return Array.from({ length: count }, (_, i) => min + i * step)
  return Array.from({ length: 11 }, (_, i) => min + ((max - min) * i) / 10)
}
