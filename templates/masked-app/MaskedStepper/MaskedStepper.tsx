'use client'

import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  MaskedStepperRoot,
  ProgressFill,
  ProgressText,
  ProgressTrack,
  SrOnly,
  StepButton,
  StepDescription,
  StepIndicator,
  StepItemEl,
  StepLabel,
  StepList,
  StepText
} from './MaskedStepper.styles'
import { getStepProgress, getStepStatus, resolveStepperTokens } from './stepperTokens'
import type { MaskedStepperProps } from './MaskedStepper.types'

const DICT = {
  pt: {
    list: 'Etapas',
    complete: 'Concluído',
    current: 'Atual',
    upcoming: 'Pendente',
    progress: (n: number, count: number, label: string) => `Passo ${n} de ${count}: ${label}`
  },
  en: {
    list: 'Steps',
    complete: 'Completed',
    current: 'Current',
    upcoming: 'Upcoming',
    progress: (n: number, count: number, label: string) => `Step ${n} of ${count}: ${label}`
  }
} as const

/**
 * Indicador de etapas (fluxos de cadastro, checkout, onboarding).
 *
 * Semântica: lista ordenada; o passo atual recebe `aria-current="step"` e
 * todo passo diz o status em texto oculto ("Concluído", "Atual", "Pendente"),
 * então cor e ✓ nunca são a única informação. Com `onStepClick`, os passos já
 * alcançados viram botões. O variant 'progress' expõe `role="progressbar"`
 * com `aria-valuetext` ("Passo 2 de 4: Pagamento").
 *
 * @example
 * <MaskedStepper steps={[{ label: 'Dados' }, { label: 'Pagamento' }, { label: 'Confirmação' }]} current={1} />
 */
export function MaskedStepper(props: MaskedStepperProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const {
    variant = 'horizontal',
    steps,
    current,
    onStepClick,
    label,
    colorTheme,
    tokens,
    className,
    style,
    ...rest
  } = props

  const dict = DICT[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']
  const tokenStyle = resolveStepperTokens({ colorTheme, tokens }, theme)
  const safeCurrent = Math.min(Math.max(0, Math.floor(current)), Math.max(0, steps.length - 1))
  const currentLabel = steps[safeCurrent]?.label ?? ''

  return (
    <MaskedStepperRoot className={className} style={{ ...tokenStyle, ...style }} {...rest}>
      {variant === 'progress' && (
        <>
          <ProgressText>{dict.progress(safeCurrent + 1, steps.length, currentLabel)}</ProgressText>
          <ProgressTrack
            role="progressbar"
            aria-label={label ?? dict.list}
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-valuenow={safeCurrent + 1}
            aria-valuetext={dict.progress(safeCurrent + 1, steps.length, currentLabel)}
          >
            <ProgressFill style={{ width: `${getStepProgress(safeCurrent, steps.length)}%` }} />
          </ProgressTrack>
        </>
      )}

      {variant !== 'progress' && (
        <StepList $variant={variant} aria-label={label ?? dict.list}>
          {steps.map((step, index) => {
            const status = getStepStatus(index, safeCurrent, steps.length)
            const clickable = Boolean(onStepClick) && index <= safeCurrent
            const showText = variant !== 'dots' || status === 'current'
            const body = (
              <>
                <StepIndicator $variant={variant} $status={status} aria-hidden="true">
                  {variant === 'dots' ? null : status === 'complete' ? '✓' : index + 1}
                </StepIndicator>
                {showText ? (
                  <StepText>
                    <StepLabel $status={status}>{step.label}</StepLabel>
                    {step.description && variant !== 'dots' && (
                      <StepDescription>{step.description}</StepDescription>
                    )}
                  </StepText>
                ) : (
                  <SrOnly>{step.label}</SrOnly>
                )}
                <SrOnly>{dict[status]}</SrOnly>
              </>
            )

            return (
              <StepItemEl
                key={step.id ?? step.label}
                $variant={variant}
                aria-current={status === 'current' ? 'step' : undefined}
              >
                {clickable ? (
                  <StepButton type="button" onClick={() => onStepClick?.(index)}>
                    {body}
                  </StepButton>
                ) : (
                  body
                )}
              </StepItemEl>
            )
          })}
        </StepList>
      )}
    </MaskedStepperRoot>
  )
}
