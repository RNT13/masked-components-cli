'use client'

import type { ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import { MaskedButtonGroup, type ButtonGroupOption } from './MaskedButtonGroup'

export type MaskedRadioGroupProps = {
  options: ButtonGroupOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** name compartilhado — obrigatório para submit de <form> */
  name: string
  label?: ReactNode
  error?: string
  helperText?: string
  required?: boolean
  orientation?: 'horizontal' | 'vertical'
  colorTheme?: ColorThemeName
  tokens?: Record<string, string | number>
  className?: string
  ariaLabel?: string
}

/**
 * Grupo de radios nativos com fieldset/legend, name compartilhado e  
 * erro/helper de grupo. Submete o valor selecionado em <form> nativo.  
 */
export function MaskedRadioGroup({ required, options, ...rest }: MaskedRadioGroupProps) {
  const opts = required
    ? options.map((o) => ({
        ...o,
        buttonProps: { ...o.buttonProps, required: true }
      }))
    : options

  return <MaskedButtonGroup variant="radio" role="radiogroup" options={opts} {...rest} />
}
