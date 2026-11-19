import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { FooterTokenOverrides } from './footerTokens'

/** Layouts do rodapé. Default 'simple'. */
export type FooterVariant = 'simple' | 'columns' | 'centered'

export type FooterLink = {
  label: string
  href: string
}

export type FooterColumn = {
  title: string
  links: FooterLink[]
}

/** Props próprias do MaskedFooter (API pública). */
export type MaskedFooterBaseProps = {
  /** Elemento renderizado (polimorfismo). Default 'footer'. */
  as?: ElementType
  variant?: FooterVariant
  /** Marca/logo. */
  brand?: ReactNode
  /** Texto curto sob a marca. */
  description?: ReactNode
  /** Colunas de links. 'simple' e 'centered' as exibem numa única lista. */
  columns?: FooterColumn[]
  /** Slot de redes sociais (ícones/links). */
  social?: ReactNode
  /** Texto de copyright (renderizado em <small>). */
  copyright?: ReactNode
  /** Rótulo acessível da navegação do rodapé. Default por locale ("Rodapé"/"Footer"). */
  navLabel?: string
  /** Paleta registrada ou chave da paleta; pinta o fundo com texto por contraste. */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-footer-*. */
  tokens?: FooterTokenOverrides
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedFooterInternalProps = {
  $variant: FooterVariant
}

export type MaskedFooterProps = MaskedFooterBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof MaskedFooterBaseProps | 'style'>
