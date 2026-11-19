import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { ShellTokenOverrides } from './shellTokens'

/**
 * Layouts de página:
 * - 'app': header no topo, sidebar à esquerda, conteúdo e footer (dashboards/SaaS);
 * - 'site': header, conteúdo e footer em coluna única (a sidebar é ignorada);
 * - 'split': dois painéis lado a lado — `sidebar` vira o painel visual (login, onboarding);
 * - 'centered': conteúdo centralizado na tela (login simples, 404, manutenção).
 */
export type ShellVariant = 'app' | 'site' | 'split' | 'centered'

/** Props próprias do MaskedShell (API pública). */
export type MaskedShellBaseProps = {
  /** Elemento raiz (polimorfismo). Default 'div'. */
  as?: ElementType
  variant?: ShellVariant
  /** Slot do topo (normalmente <MaskedHeader />). */
  header?: ReactNode
  /** Slot lateral (normalmente <MaskedSidebar />; no variant 'split', o painel visual). */
  sidebar?: ReactNode
  /** Slot do rodapé (normalmente <MaskedFooter />). */
  footer?: ReactNode
  /** id do <main> e alvo do link "pular para o conteúdo". Default 'main-content'. */
  mainId?: string
  /** Texto do link de pular para o conteúdo. Default por locale. */
  skipLinkLabel?: string
  /** Paleta registrada ou chave da paleta; pinta o fundo da página com texto por contraste. */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-shell-*. */
  tokens?: ShellTokenOverrides
  className?: string
  style?: CSSProperties
  /** Conteúdo principal (renderizado dentro de <main>). */
  children?: ReactNode
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedShellInternalProps = {
  $variant: ShellVariant
}

export type MaskedShellProps = MaskedShellBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof MaskedShellBaseProps | 'style'>
