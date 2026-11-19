import type { CSSProperties, HTMLAttributes } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { AvatarTokenOverrides } from './avatarTokens'

/** Formato do avatar. Default 'circle'. */
export type AvatarVariant = 'circle' | 'rounded' | 'square'

export type AvatarSizeName = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline'

/** Props próprias do MaskedAvatar (API pública). */
export type MaskedAvatarBaseProps = {
  variant?: AvatarVariant
  /** Tamanho nomeado (xs 24, sm 32, md 40, lg 56, xl 80) ou número em px. Default 'md'. */
  size?: AvatarSizeName | number
  /** URL da imagem. Se faltar ou falhar ao carregar, mostra as iniciais de `name`. */
  src?: string
  /**
   * Texto alternativo da imagem. Default: `name`. Passe `alt=""` quando o nome
   * já aparece como texto ao lado do avatar (evita leitura duplicada).
   */
  alt?: string
  /** Nome da pessoa: gera as iniciais e o nome acessível. */
  name?: string
  /** Presença: pontinho + texto oculto para leitores de tela. */
  status?: AvatarStatus
  /** Paleta registrada ou chave da paleta (fundo das iniciais, com texto por contraste). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-avatar-*. */
  tokens?: AvatarTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedAvatarInternalProps = {
  $variant: AvatarVariant
  $size: number
}

export type MaskedAvatarProps = MaskedAvatarBaseProps &
  Omit<HTMLAttributes<HTMLSpanElement>, keyof MaskedAvatarBaseProps | 'style' | 'children'>
