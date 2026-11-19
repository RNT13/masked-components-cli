import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { StepperTokenOverrides } from './stepperTokens'

/** Layout do stepper. Default 'horizontal'. */
export type StepperVariant = 'horizontal' | 'vertical' | 'dots' | 'progress'

export type StepItem = {
  /** Chave estável (default: o rótulo). */
  id?: string
  label: string
  description?: ReactNode
}

/** Props próprias do MaskedStepper (API pública). */
export type MaskedStepperBaseProps = {
  variant?: StepperVariant
  steps: StepItem[]
  /** Índice do passo atual (base 0). Passos anteriores contam como concluídos. */
  current: number
  /**
   * Torna clicáveis os passos já alcançados (índice <= atual). Recebe o índice
   * clicado. Sem ele, o stepper é só informativo.
   */
  onStepClick?: (index: number) => void
  /** Rótulo acessível da lista de passos. Default por locale. */
  label?: string
  /** Paleta registrada ou chave da paleta (passos concluídos/atual). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-stepper-*. */
  tokens?: StepperTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedStepperInternalProps = {
  $variant: StepperVariant
  $status?: 'complete' | 'current' | 'upcoming'
}

export type MaskedStepperProps = MaskedStepperBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof MaskedStepperBaseProps | 'style' | 'children'>
