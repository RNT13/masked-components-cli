import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Overrides granulares de tokens --mc-menu-*. */
export interface MenuTokenOverrides {
  bg?: string
  fg?: string
  muted?: string
  border?: string
  /** Fundo do item destacado (hover/foco). */
  itemHoverBg?: string
  /** Texto do item destacado. */
  itemHoverFg?: string
  radius?: string
  shadow?: string
  minWidth?: string
}

export type MenuItem = {
  id: string
  label: ReactNode
  /** Ícone decorativo antes do rótulo (aria-hidden). */
  icon?: ReactNode
  /** Atalho decorativo à direita (ex.: "⌘K") — apenas visual. */
  shortcut?: ReactNode
  disabled?: boolean
  /** Marca o item como perigoso (cor destrutiva). */
  danger?: boolean
  onSelect?: () => void
}

/** Separador entre grupos de itens. */
export type MenuSeparator = { type: 'separator' }

export type MenuEntry = MenuItem | MenuSeparator

export function isSeparator(entry: MenuEntry): entry is MenuSeparator {
  return 'type' in entry && entry.type === 'separator'
}

/** Props próprias do MaskedDropdownMenu (API pública). */
export type MaskedDropdownMenuBaseProps = {
  /** Conteúdo do botão que abre o menu. */
  trigger: ReactNode
  items: MenuEntry[]
  /** Aberto (controlado). */
  open?: boolean
  /** Aberto inicial (não controlado). */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Lado do trigger onde o menu ancora. Default 'bottom-start'. */
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  /** Rótulo acessível do menu. Default: localizado via MaskedConfigProvider. */
  label?: string
  /** Desabilita o trigger. */
  disabled?: boolean
  colorTheme?: ColorThemeName
  tokens?: MenuTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedDropdownMenuInternalProps = {
  $placement: NonNullable<MaskedDropdownMenuBaseProps['placement']>
}

export type MaskedDropdownMenuProps = MaskedDropdownMenuBaseProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof MaskedDropdownMenuBaseProps | 'style' | 'children'>
