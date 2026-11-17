'use client'

import { forwardRef } from 'react'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { BaseCard } from './BaseCard'
import type { BaseCardInternalProps } from './BaseCard'
import type { CardMediaRatio } from '../MaskedCards.types'
import {
  CardActionsContainer,
  CardContentContainer,
  CardFooterContainer,
  CardHeaderContainer,
  CardMediaContainer
} from './CardParts.styles'

/* ------------------------------------------------------------------ */
/* Card — wrapper de composição sobre o BaseCard.                      */
/* Aceita todas as props do BaseCard (appearance, layout, seleção,     */
/* expansão, tokens, href, onClick etc.) e renderiza children livre.   */
/* ------------------------------------------------------------------ */

export type CardProps = Omit<BaseCardInternalProps, 'hasActions'>

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(props, ref) {
  return <BaseCard ref={ref} {...props} />
})

/* ------------------------------------------------------------------ */
/* CardHeader — topo do card (título, subtítulo, avatar, ações de topo) */
/* ------------------------------------------------------------------ */

export type CardHeaderProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function CardHeader({ children, className, style }: CardHeaderProps) {
  return (
    <CardHeaderContainer className={className} style={style}>
      {children}
    </CardHeaderContainer>
  )
}

/* ------------------------------------------------------------------ */
/* CardMedia — imagem de topo com proporção fixa.                      */
/* Usa imageComponent do MaskedConfigProvider quando disponível        */
/* (permite next/image no projeto do consumidor).                      */
/* ------------------------------------------------------------------ */

export type CardMediaProps = {
  src: string
  /** Alt text (obrigatório para acessibilidade; use '' para imagem decorativa). */
  alt: string
  /** Proporção da mídia (default '16:9'; 'auto' = altura natural da imagem). */
  ratio?: CardMediaRatio
  className?: string
  style?: React.CSSProperties
}

export function CardMedia({ src, alt, ratio = '16:9', className, style }: CardMediaProps) {
  const { imageComponent } = useMaskedConfig()
  const ImageTag = (imageComponent ?? 'img') as 'img'

  return (
    <CardMediaContainer $ratio={ratio} className={className} style={style}>
      <ImageTag src={src} alt={alt} />
    </CardMediaContainer>
  )
}

/* ------------------------------------------------------------------ */
/* CardContent — corpo principal (coluna com gap).                     */
/* ------------------------------------------------------------------ */

export type CardContentProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function CardContent({ children, className, style }: CardContentProps) {
  return (
    <CardContentContainer className={className} style={style}>
      {children}
    </CardContentContainer>
  )
}

/* ------------------------------------------------------------------ */
/* CardFooter — rodapé separado por borda, alinhado ao final.          */
/* ------------------------------------------------------------------ */

export type CardFooterProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function CardFooter({ children, className, style }: CardFooterProps) {
  return (
    <CardFooterContainer className={className} style={style}>
      {children}
    </CardFooterContainer>
  )
}

/* ------------------------------------------------------------------ */
/* CardActions — zona de botões/links; fica acima do stretched-link/   */
/* button para que as ações continuem clicáveis.                       */
/* ------------------------------------------------------------------ */

export type CardActionsProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function CardActions({ children, className, style }: CardActionsProps) {
  return (
    <CardActionsContainer className={className} style={style}>
      {children}
    </CardActionsContainer>
  )
}
