import type { HTMLAttributeAnchorTarget, MouseEvent, ReactNode } from 'react'  
  
/* ================= BASE ================= */  
  
export type ButtonSize = 'sm' | 'md' | 'lg'  
  
export type ButtonState = 'default' | 'disabled' | 'loading' | 'error'  
  
export type ButtonShape = 'rounded' | 'circle' | 'square'  
  
export type ButtonPosition = 'left' | 'right' | 'center'  
  
export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'link' | 'gradient' | 'neon' | 'toggle' | 'checkbox' | 'soft'  
  
export type ButtonClickEvent = MouseEvent<HTMLButtonElement | HTMLAnchorElement>  
  
/* ================= PROPS INTERNAS (consumidas pelas variantes) ================= */  
  
export type BaseButtonProps = {  
  size?: ButtonSize  
  /** @deprecated grafia interna — use `shape` na API pública */  
  shapes?: ButtonShape  
  state?: ButtonState  
  
  fullWidth?: boolean  
  $position?: ButtonPosition  
  
  /** texto de tooltip exibido no hover */  
  label?: string  
  /** nome acessível (screen readers) — essencial para botões só com ícone */  
  ariaLabel?: string  
  /** texto exibido no estado loading (padrão: "Loading...") */  
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
}  
  
/* ================= VARIANT MAP (interno) ================= */  
  
type WithActive = BaseButtonProps & { $isActive?: boolean }  
  
export type ButtonVariantMap = {  
  default: WithActive  
  outline: WithActive  
  ghost: WithActive  
  link: WithActive  
  gradient: WithActive  
  neon: WithActive  
  soft: WithActive  
  
  toggle: WithActive & {  
    $toggleLabel?: string  
    onToggle?: (active: boolean) => void  
  }  
  
  checkbox: WithActive & {  
    checked?: boolean  
    onCheckedChange?: (checked: boolean) => void  
    $checkboxLabel?: string  
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
  
  /** forma do botão: 'rounded' | 'circle' | 'square' */  
  shape?: ButtonShape  
  
  /* ---- toggle ---- */  
  toggleLabel?: string  
  onToggle?: (active: boolean) => void  
  
  /* ---- checkbox ---- */  
  checkboxLabel?: string  
  checked?: boolean  
  defaultChecked?: boolean  
  onCheckedChange?: (checked: boolean) => void  
  
  /* ---- aliases depreciados (retrocompatibilidade) ---- */  
  /** @deprecated use `variant` */  
  $variant?: ButtonVariant  
  /** @deprecated use `active` */  
  $isActive?: boolean  
  /** @deprecated use `toggleLabel` */  
  $toggleLabel?: string  
  /** @deprecated use `checkboxLabel` */  
  $checkboxLabel?: string  
}