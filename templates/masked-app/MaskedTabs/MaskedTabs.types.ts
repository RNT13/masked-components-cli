import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { TabsTokenOverrides } from './tabsTokens'

/** Aparência das abas. Default 'line'. */
export type TabsVariant = 'line' | 'pills' | 'enclosed' | 'vertical'

export type TabItem = {
  id: string
  label: ReactNode
  content: ReactNode
  /** Ícone decorativo antes do rótulo (aria-hidden). */
  icon?: ReactNode
  disabled?: boolean
}

/** Props próprias do MaskedTabs (API pública). */
export type MaskedTabsBaseProps = {
  variant?: TabsVariant
  items: TabItem[]
  /** Aba selecionada (controlado). */
  value?: string
  /** Aba inicial (não controlado). Default: a primeira habilitada. */
  defaultValue?: string
  onChange?: (id: string) => void
  /**
   * 'automatic' (padrão): as setas já selecionam a aba. 'manual': as setas só
   * movem o foco e Enter/Espaço selecionam (bom para painéis pesados).
   */
  activation?: 'automatic' | 'manual'
  /** Renderiza o conteúdo só da aba ativa (os painéis inativos ficam vazios). */
  lazy?: boolean
  /** Rótulo acessível da lista de abas. */
  label?: string
  /** Paleta registrada ou chave da paleta (aba ativa). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-tabs-*. */
  tokens?: TabsTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedTabsInternalProps = {
  $variant: TabsVariant
  $active?: boolean
}

export type MaskedTabsProps = MaskedTabsBaseProps &
  Omit<
    HTMLAttributes<HTMLDivElement>,
    keyof MaskedTabsBaseProps | 'style' | 'children' | 'onChange'
  >
