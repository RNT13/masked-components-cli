import type { ReactNode } from 'react'
import type {
  MaskedSectionProps,
  SectionVariant
} from '@/components/ui/MaskedSection/MaskedSection.types'
import type { SectionTokenOverrides } from '@/components/ui/MaskedSection/sectionTokens'
import type { LogoCloudTokenOverrides } from './logoCloudTokens'

/** Layouts da nuvem de logos. Default 'row'. */
export type LogoCloudVariant = 'row' | 'grid' | 'marquee'

/** Props próprias do MaskedLogoCloud (API pública). */
export type MaskedLogoCloudOwnProps = {
  variant?: LogoCloudVariant
  /**
   * Logos (normalmente <img alt="Nome da empresa" />). Dê `alt` a cada  
   * imagem: é o nome acessível de cada logo.  
   */
  logos: ReactNode[]
  /** Duração (s) de uma volta completa no variant 'marquee'. Default 30. */
  speed?: number
  /** Aparência da seção que envolve os logos. Default 'plain'. */
  sectionVariant?: SectionVariant
  /** Overrides de tokens --mc-section-* da seção. */
  sectionTokens?: SectionTokenOverrides
  /** Overrides granulares de tokens --mc-logo-cloud-*. */
  tokens?: LogoCloudTokenOverrides
}

/** A seção (id, title, description, headingLevel, colorTheme…) usa as props do MaskedSection. */
export type MaskedLogoCloudProps = MaskedLogoCloudOwnProps &
  Omit<MaskedSectionProps, keyof MaskedLogoCloudOwnProps | 'variant' | 'tokens' | 'children'>

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedLogoCloudInternalProps = {
  $variant: LogoCloudVariant
}
