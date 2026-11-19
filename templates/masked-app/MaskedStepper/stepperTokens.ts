import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Overrides granulares de tokens --mc-stepper-* (chave = nome sem prefixo). */
export interface StepperTokenOverrides {
  accent?: string
  accentFg?: string
  border?: string
  muted?: string
}

export interface ResolveStepperTokensInput {
  colorTheme?: ColorThemeName
  tokens?: StepperTokenOverrides
}

/**
 * Deriva tokens --mc-stepper-*: o par accent/accentFg (com contraste WCAG)
 * pinta o indicador dos passos concluídos e do atual. Precedência:
 * tokens > colorTheme > tema.
 */
export function resolveStepperTokens(
  input: ResolveStepperTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const semantic = resolveSemanticColors(theme)
  const surface = resolveSurface('plain', input.colorTheme, theme)
  const useTheme = Boolean(input.colorTheme)
  return buildTokenStyle(
    'stepper',
    {
      accent: useTheme ? surface.accent : semantic.text,
      accentFg: useTheme ? surface.accentFg : semantic.surface,
      border: semantic.border,
      muted: semantic.muted
    },
    input.tokens
  )
}

export type StepStatus = 'complete' | 'current' | 'upcoming'

/** Status de cada passo a partir do índice atual (limitado ao intervalo válido). */
export function getStepStatus(index: number, current: number, count: number): StepStatus {
  const safe = Math.min(Math.max(0, Math.floor(current)), Math.max(0, count - 1))
  if (index < safe) return 'complete'
  if (index === safe) return 'current'
  return 'upcoming'
}

/** Percentual concluído para a barra do variant 'progress' (passo atual conta como em andamento). */
export function getStepProgress(current: number, count: number): number {
  if (count <= 1) return 100
  const safe = Math.min(Math.max(0, Math.floor(current)), count - 1)
  return Math.round((safe / (count - 1)) * 100)
}
