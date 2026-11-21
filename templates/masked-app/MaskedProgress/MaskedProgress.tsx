'use client'

import { useId } from 'react'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import {
  CircleBar,
  CircleSvg,
  CircleTrack,
  LinearBar,
  LinearTrack,
  ProgressHeader,
  ProgressRoot,
  ProgressValue
} from './MaskedProgress.styles'
import { resolveProgressTokens } from './progressTokens'
import type { MaskedProgressProps } from './MaskedProgress.types'

const DICT = {
  pt: { progress: 'Progresso' },
  en: { progress: 'Progress' }
} as const

/**
 * Indicador de progresso acessível (`role="progressbar"`).  
 *
 * Determinado: informe `value`/`max` — `aria-valuenow/min/max` são emitidos e  
 * `showValue` exibe a porcentagem. Indeterminado: omita `value` ou use  
 * `indeterminate` — os atributos de valor são omitidos (padrão ARIA) e a  
 * animação respeita `prefers-reduced-motion`.  
 *
 * `label` nomeia o progressbar; sem ele, usa o padrão localizado do  
 * MaskedConfigProvider ('Progresso'/'Progress').  
 *
 * @example  
 * <MaskedProgress label="Upload" value={progress} showValue />  
 * <MaskedProgress variant="circle" indeterminate label="Carregando" />  
 */
export function MaskedProgress(props: MaskedProgressProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const dict = DICT[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']

  const {
    variant = 'linear',
    value,
    max = 100,
    indeterminate = false,
    label,
    showValue = false,
    size,
    colorTheme,
    tokens,
    className,
    style,
    ...rest
  } = props

  const labelId = useId()
  const tokenStyle = resolveProgressTokens({ colorTheme, tokens }, theme)

  const isDeterminate = !indeterminate && typeof value === 'number'
  const clamped = isDeterminate ? Math.min(Math.max(value, 0), max) : undefined
  const percent = clamped !== undefined && max > 0 ? Math.round((clamped / max) * 100) : undefined

  const ariaProps = {
    role: 'progressbar' as const,
    'aria-label': typeof label === 'string' ? label : dict.progress,
    ...(label ? { 'aria-labelledby': labelId } : {}),
    ...(isDeterminate ? { 'aria-valuenow': clamped, 'aria-valuemin': 0, 'aria-valuemax': max } : {})
  }

  const header = (label || (showValue && percent !== undefined)) && (
    <ProgressHeader>
      <span id={labelId}>{label}</span>
      {showValue && percent !== undefined && <ProgressValue>{percent}%</ProgressValue>}
    </ProgressHeader>
  )

  if (variant === 'circle') {
    const diameter = size ?? 40
    const stroke = Math.max(2, Math.round(diameter / 10))
    const radius = (diameter - stroke) / 2
    const circumference = 2 * Math.PI * radius
    const offset =
      percent !== undefined ? circumference * (1 - percent / 100) : circumference * 0.75

    return (
      <ProgressRoot className={className} style={{ ...tokenStyle, ...style }} {...rest}>
        {header}
        <CircleSvg
          $indeterminate={!isDeterminate}
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter} ${diameter}`}
          {...ariaProps}
        >
          <CircleTrack cx={diameter / 2} cy={diameter / 2} r={radius} strokeWidth={stroke} />
          <CircleBar
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${diameter / 2} ${diameter / 2})`}
          />
        </CircleSvg>
      </ProgressRoot>
    )
  }

  return (
    <ProgressRoot className={className} style={{ ...tokenStyle, ...style }} {...rest}>
      {header}
      <LinearTrack $size={size ?? 8} {...ariaProps}>
        <LinearBar
          $indeterminate={!isDeterminate}
          style={isDeterminate ? { width: `${percent}%` } : undefined}
        />
      </LinearTrack>
    </ProgressRoot>
  )
}
