import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { AlertTokenOverrides } from './alertTokens'

/** Tom semântico do alerta. Default 'info'. */
export type AlertTone = 'info' | 'success' | 'warning' | 'error'

/** Aparência. Default 'soft'. */
export type AlertVariant = 'soft' | 'solid' | 'outline'

/** Props próprias do MaskedAlert (API pública). */
export type MaskedAlertBaseProps = {
  tone?: AlertTone
  variant?: AlertVariant
  /** Título em destaque (opcional). */
  title?: ReactNode
  /** Ícone decorativo antes do conteúdo (aria-hidden). Default: ícone do tone. */
  icon?: ReactNode
  /** Mostra o botão de fechar. */
  dismissible?: boolean
  /** Chamado ao fechar (o componente se esconde sozinho se não controlado). */
  onClose?: () => void
  /** Ação opcional no fim do alerta (ex.: botão "Desfazer"). */
  action?: ReactNode
  /** Paleta registrada ou chave da paleta (vence o tone). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-alert-*. */
  tokens?: AlertTokenOverrides
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedAlertInternalProps = {
  $variant: AlertVariant
}

export type MaskedAlertProps = MaskedAlertBaseProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof MaskedAlertBaseProps | 'style'>
