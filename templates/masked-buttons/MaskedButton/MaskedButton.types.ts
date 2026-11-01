import type { HTMLAttributeAnchorTarget, MouseEvent, ReactNode } from 'react'

/* ================= BASE ================= */

export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonState = 'default' | 'disabled' | 'loading' | 'error'
export type ButtonShape = 'rounded' | 'circle' | 'square'
export type ButtonPosition = 'left' | 'right' | 'center'

/**
 * Variantes. 'radio' entra no grupo dos campos (toggle/checkbox/switch visual);
 * consome apenas tokens --mc-switch-* (decisão 2B/3A).
 */
export type ButtonVariant =
  | 'default'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'gradient'
  | 'neon'
  | 'soft'
  | 'toggle'
  | 'checkbox'
  | 'switch'
  | 'radio'

export type ButtonClickEvent = MouseEvent<HTMLButtonElement | HTMLAnchorElement>

/* ================= PROPS INTERNAS ================= */

export type BaseButtonProps = {
  size?: ButtonSize
  /** @deprecated grafia interna — use `shape` na API pública */
  shapes?: ButtonShape
  state?: ButtonState

  linkComponent?: React.ElementType

  fullWidth?: boolean
  $position?: ButtonPosition

  /** texto de tooltip exibido no hover */
  label?: string
  /** nome acessível — essencial para botões só com ícone */
  ariaLabel?: string
  /** texto exibido no estado loading (default vem do dicionário/locale, J) */
  loadingText?: string

  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children?: ReactNode

  className?: string
  type?: 'button' | 'submit' | 'reset'
  name?: string
  value?: string
  onClick?: (event: ButtonClickEvent) => void

  href?: string
  target?: HTMLAttributeAnchorTarget
  rel?: string

  /* ---- temas ---- */

  /**
   * Nome de uma paleta registrada via `registerColorTheme()` (masked-themes/colorThemes).
   * Deriva os tokens --mc-btn-bg/-fg/-border/-ring (e --mc-switch-*) do botão.
   * 'default' ou ausente = paleta neutra da lib.
   */
  colorTheme?: string

  /**
   * Overrides granulares de tokens do botão (prop > colorTheme > default).
   * Chaves = nomes de token sem prefixo, ex.: { 'bg-hover': '#222', 'fg': '#fff' }
   */
  tokens?: Record<string, string | number>
}

/* ================= VARIANT MAP (interno) ================= */

type WithActive = BaseButtonProps & { $isActive?: boolean }

type FieldButtonProps = WithActive & {
  /** valor quando usado dentro de MaskedButtonGroup */
  optionValue?: string
}

export type ButtonVariantMap = {
  default: WithActive
  outline: WithActive
  ghost: WithActive
  link: WithActive
  gradient: WithActive
  neon: WithActive
  soft: WithActive

  switch: FieldButtonProps & {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
    defaultChecked?: boolean
    switchLabel?: string
  }

  toggle: FieldButtonProps & {
    $toggleLabel?: string
    onToggle?: (active: boolean) => void
  }

  checkbox: FieldButtonProps & {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
    $checkboxLabel?: string
    defaultChecked?: boolean
  }

  /** radio visual: mesmo conjunto de tokens --mc-switch-* do checkbox */
  radio: FieldButtonProps & {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
    radioLabel?: string
    defaultChecked?: boolean
  }
}

/* ================= API PÚBLICA ================= */

export type ButtonProps = BaseButtonProps & {
  /** variante do botão (padrão: 'default') */
  variant?: ButtonVariant
  /** posição do botão no wrapper (padrão: 'center') */
  position?: ButtonPosition
  /** estado ativo (selecionado) */
  active?: boolean
  /** desabilita o botão (atalho para state='disabled') */
  disabled?: boolean
  /** forma: 'rounded' | 'circle' | 'square' */
  shape?: ButtonShape

  /* ---- toggle ---- */
  toggleLabel?: string
  switchLabel?: string
  onToggle?: (active: boolean) => void

  /* ---- checkbox / radio ---- */
  checkboxLabel?: string
  radioLabel?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void

  /* ---- MaskedButtonGroup ---- */
  /** valor do botão quando usado dentro de um grupo */
  optionValue?: string

  /* ---- aliases depreciados ---- */
  /** @deprecated use `variant` */
  $variant?: ButtonVariant
  /** @deprecated use `active` */
  $isActive?: boolean
  /** @deprecated use `position` */
  $position?: ButtonPosition
  /** @deprecated use `toggleLabel` */
  $toggleLabel?: string
  /** @deprecated use `checkboxLabel` */
  $checkboxLabel?: string
}
