import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { HeaderTokenOverrides } from './headerTokens'

/** Comportamento/aparência do header. Default 'static'. */
export type HeaderVariant = 'static' | 'sticky' | 'transparent' | 'blur'

/** Abaixo desta largura (breakpoint do tema) a navegação vira menu mobile. Default 'tablet'. */
export type HeaderMenuBreakpoint = 'mobile' | 'tablet' | 'desktop'

export type HeaderLink = {
  label: string
  href: string
  /** Marca o link da página atual (aria-current="page"). */
  active?: boolean
}

/** Props próprias do MaskedHeader (API pública). */
export type MaskedHeaderBaseProps = {
  /** Elemento renderizado (polimorfismo). Default 'header'. */
  as?: ElementType
  variant?: HeaderVariant
  /** Marca/logo (à esquerda). Envolva em link se quiser que leve à home. */
  brand?: ReactNode
  /** Links de navegação principal. */
  links?: HeaderLink[]
  /** Slot de ações (botões de login, tema, CTA). No mobile vai para dentro do menu. */
  actions?: ReactNode
  /** Breakpoint abaixo do qual a navegação vira menu mobile. Default 'tablet'. */
  menuBreakpoint?: HeaderMenuBreakpoint
  /** Rótulo acessível da navegação. Default por locale ("Principal"/"Main"). */
  navLabel?: string
  /** Limita o conteúdo a uma largura de página, centralizado. Default true. */
  contained?: boolean
  /** Paleta registrada ou chave da paleta; pinta o fundo (e o menu mobile) com texto por contraste. */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-header-*. */
  tokens?: HeaderTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedHeaderInternalProps = {
  $variant: HeaderVariant
  $breakpoint: HeaderMenuBreakpoint
  $contained: boolean
}

export type MaskedHeaderProps = MaskedHeaderBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof MaskedHeaderBaseProps | 'style' | 'children'>
