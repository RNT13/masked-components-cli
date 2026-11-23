import type { CSSProperties, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { CommandPaletteTokenOverrides } from './commandPaletteTokens'

/** Densidade da paleta. Default 'default'. */
export type CommandPaletteVariant = 'default' | 'compact'

export type CommandItem = {
  /** Identificador estável. */
  id: string
  label: string
  /** Texto de apoio (só no variant 'default'). Também entra na busca. */
  description?: string
  /** Ícone decorativo (aria-hidden; só no variant 'default'). */
  icon?: ReactNode
  /** Agrupa itens sob um título. Itens sem grupo ficam soltos. */
  group?: string
  /** Palavras extras que encontram o item (sinônimos). */
  keywords?: string[]
  /** Atalho mostrado à direita (ex.: "G D"). Só exibição. */
  shortcut?: string
  disabled?: boolean
  /** Executado ao escolher o item (Enter ou clique). */
  onSelect?: (item: CommandItem) => void
}

/** Props próprias do MaskedCommandPalette (API pública). */
export type MaskedCommandPaletteProps = {
  variant?: CommandPaletteVariant
  items: CommandItem[]
  /** Abertura controlada. */
  open?: boolean
  /** Abertura inicial (não controlado). */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Chamado para qualquer item escolhido (além do `onSelect` do item). */
  onSelect?: (item: CommandItem) => void
  /**
   * Tecla do atalho global (Ctrl/⌘ + tecla) que abre e fecha a paleta.
   * Default 'k'. `false` desliga o atalho.
   */
  hotkey?: string | false
  /** Nome acessível do diálogo. Default por locale ("Paleta de comandos"/"Command palette"). */
  label?: string
  placeholder?: string
  /** Texto quando a busca não acha nada. Default por locale. */
  emptyMessage?: string
  /** Largura do painel (CSS). Default '36rem'. */
  width?: string
  /** Paleta registrada ou chave da paleta (painel pintado, texto por contraste). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-command-palette-*. */
  tokens?: CommandPaletteTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedCommandPaletteInternalProps = {
  $variant: CommandPaletteVariant
  $active?: boolean
  $disabled?: boolean
}
