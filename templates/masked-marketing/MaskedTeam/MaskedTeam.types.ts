import type {
  MaskedSectionProps,
  SectionVariant
} from '@/components/ui/MaskedSection/MaskedSection.types'
import type { SectionTokenOverrides } from '@/components/ui/MaskedSection/sectionTokens'
import type { TeamTokenOverrides } from './teamTokens'

/** Layouts da equipe. Default 'grid'. */
export type TeamVariant = 'grid' | 'list' | 'cards'

export type TeamLink = {
  /** Texto do link (ex.: "LinkedIn"). O nome da pessoa é anexado ao nome acessível. */
  label: string
  href: string
}

export type TeamMember = {
  /** Chave estável (default: o nome). */
  id?: string
  name: string
  role?: string
  /** Mini biografia (aparece em 'list' e 'cards'). */
  bio?: string
  /** URL da foto. Sem ela (ou se falhar), o avatar mostra as iniciais. */
  avatar?: string
  links?: TeamLink[]
}

/** Props próprias do MaskedTeam (API pública). */
export type MaskedTeamOwnProps = {
  variant?: TeamVariant
  members: TeamMember[]
  /** Aparência da seção que envolve a equipe. Default 'plain'. */
  sectionVariant?: SectionVariant
  /** Overrides de tokens --mc-section-* da seção. */
  sectionTokens?: SectionTokenOverrides
  /** Overrides granulares de tokens --mc-team-*. */
  tokens?: TeamTokenOverrides
}

/** A seção (id, title, description, headingLevel, colorTheme…) usa as props do MaskedSection. */
export type MaskedTeamProps = MaskedTeamOwnProps &
  Omit<MaskedSectionProps, keyof MaskedTeamOwnProps | 'variant' | 'tokens' | 'children'>

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedTeamInternalProps = {
  $variant: TeamVariant
}
