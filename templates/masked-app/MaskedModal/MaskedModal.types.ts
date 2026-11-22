import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Overrides granulares de tokens --mc-modal-*. */
export interface ModalTokenOverrides {
  bg?: string
  fg?: string
  muted?: string
  border?: string
  /** Cor do overlay (fundo escurecido). */
  overlayBg?: string
  /** Raio de borda do painel. */
  radius?: string
  /** Largura máxima do painel. */
  maxWidth?: string
  /** Sombra do painel. */
  shadow?: string
}

export type ModalSize = 'sm' | 'md' | 'lg' | 'full'

/** Props próprias do MaskedModal (API pública). */
export type MaskedModalBaseProps = {
  /** Controla a visibilidade. */
  open: boolean
  /** Chamado ao pedir fechamento (Escape, overlay, botão fechar). */
  onClose: () => void
  /** Título acessível (aria-labelledby). */
  title?: ReactNode
  /** Descrição acessível (aria-describedby). */
  description?: ReactNode
  /** Conteúdo do modal. */
  children?: ReactNode
  /** Rodapé (ações). */
  footer?: ReactNode
  /** Tamanho do painel. Default: 'md'. */
  size?: ModalSize
  /** Fecha ao clicar no overlay. Default: true. */
  closeOnOverlay?: boolean
  /** Fecha com Escape. Default: true. */
  closeOnEscape?: boolean
  /** Mostra o botão de fechar (×). Default: true. */
  showClose?: boolean
  /** Paleta registrada ou chave da paleta. */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-modal-*. */
  tokens?: ModalTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedModalInternalProps = {
  $size: ModalSize
}

export type MaskedModalProps = MaskedModalBaseProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof MaskedModalBaseProps | 'style' | 'children' | 'title'>
