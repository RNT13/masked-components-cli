import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Overrides granulares de tokens --mc-select-*. */
export interface SelectTokenOverrides {
  bg?: string
  fg?: string
  muted?: string
  border?: string
  /** Fundo da opção destacada (hover/foco). */
  itemBg?: string
  /** Texto da opção destacada. */
  itemFg?: string
  /** Fundo da opção selecionada. */
  selectedBg?: string
  /** Texto da opção selecionada. */
  selectedFg?: string
  /** Cor do placeholder. */
  placeholder?: string
  /** Raio de borda do trigger e do listbox. */
  radius?: string
  /** Sombra do listbox. */
  shadow?: string
}

export type SelectSize = 'sm' | 'md' | 'lg'

export interface SelectOption {
  /** Valor único da opção. */
  value: string
  /** Rótulo visível. */
  label: ReactNode
  /** Ícone antes do rótulo (aria-hidden). */
  icon?: ReactNode
  disabled?: boolean
}

/** Props próprias do MaskedSelect (API pública). */
export type MaskedSelectBaseProps = {
  options: SelectOption[]
  /** Valor selecionado (controlado). */
  value?: string
  /** Valor inicial (não controlado). */
  defaultValue?: string
  onChange?: (value: string) => void
  /** Texto quando nada está selecionado. */
  placeholder?: string
  /** Rótulo acessível do select. */
  label?: string
  size?: SelectSize
  disabled?: boolean
  /** Paleta registrada ou chave da paleta. */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-select-*. */
  tokens?: SelectTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedSelectInternalProps = {
  $size: SelectSize
  $open?: boolean
  $highlighted?: boolean
  $selected?: boolean
  $disabled?: boolean
}

export type MaskedSelectProps = MaskedSelectBaseProps &
  Omit<
    HTMLAttributes<HTMLDivElement>,
    keyof MaskedSelectBaseProps | 'style' | 'children' | 'onChange'
  >
