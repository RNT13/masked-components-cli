import type { CSSProperties, ElementType, HTMLAttributes } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { BadgeTokenOverrides } from './badgeTokens'

/** Aparência do selo. Default 'soft'. */
export type BadgeVariant = 'solid' | 'soft' | 'outline' | 'dot'

export type BadgeSize = 'sm' | 'md'

/** Props próprias do MaskedBadge (API pública). */
export type MaskedBadgeBaseProps = {
  /** Elemento renderizado (polimorfismo). Default 'span'. */
  as?: ElementType
  variant?: BadgeVariant
  size?: BadgeSize
  /** Paleta registrada ou chave da paleta. Sem ela, o selo é neutro (cores do tema). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-badge-*. */
  tokens?: BadgeTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedBadgeInternalProps = {
  $variant: BadgeVariant
  $size: BadgeSize
}

export type MaskedBadgeProps = MaskedBadgeBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof MaskedBadgeBaseProps | 'style'>
