import { CSSProperties, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import { CardTokenOverrides } from './cardTokens'

export type CardSize = 'sm' | 'md' | 'lg' | 'xl'
export type CardTrend = 'up' | 'down' | 'neutral'
export type CardStatus = 'active' | 'inactive' | 'warning' | 'error'
export type CardDirection = 'row' | 'column'

/** Aparência visual independente de $variant. Default 'elevated' = visual atual. */
export type CardAppearance = 'elevated' | 'filled' | 'outlined' | 'flat' | 'gradient' | 'glass'

/** Disposição de mídia/conteúdo. 'horizontal' implica direction row quando direction não é passado. */
export type CardLayout = 'vertical' | 'horizontal' | 'overlay' | 'split' | 'compact'

/** Proporção da mídia do card. */
export type CardMediaRatio = '1:1' | '4:3' | '16:9' | '3:4' | 'auto'

/** Semântica de seleção: 'single' = radio, 'multiple' = checkbox. */
export type CardSelectionMode = 'single' | 'multiple'

export type BaseCardProps = {
  href?: string
  /** Nome acessível do link quando o card usa stretched-link (href + actions). */
  hrefLabel?: string
  onClick?: React.MouseEventHandler
  size?: CardSize
  fullWidth?: boolean
  cardBg?: string
  /** Direção explícita do flex. Vence o direction implícito de layout='horizontal'. */
  direction?: CardDirection
  className?: string
  style?: CSSProperties
  children?: ReactNode

  /** Aparência visual (default 'elevated'). */
  appearance?: CardAppearance
  /** Disposição de mídia/conteúdo (default 'vertical'). */
  layout?: CardLayout
  /** Proporção da mídia (default 'auto'). */
  mediaRatio?: CardMediaRatio

  /** Desabilita interação e aplica estilo disabled. */
  disabled?: boolean

  /** Seleção controlada. */
  selected?: boolean
  /** Seleção inicial não controlada. */
  defaultSelected?: boolean
  onSelectedChange?: (selected: boolean) => void
  /** 'single' → role radio; 'multiple' → role checkbox (default 'single'). */
  selectionMode?: CardSelectionMode

  /** Expansão controlada. */
  expanded?: boolean
  /** Expansão inicial não controlada. */
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  /** Habilita botão de expandir/recolher. */
  expandable?: boolean
  /** Conteúdo exibido apenas quando expandido. */
  expandContent?: ReactNode

  /** Paleta registrada em colorThemes (ex.: 'ruby'). Deriva os tokens --mc-card-*. */
  colorTheme?: ColorThemeName
  /** Overrides diretos de tokens --mc-card-*. */
  tokens?: CardTokenOverrides
}

type WithIcon = {
  icon?: ReactNode
  iconTextColor?: string
  iconBgColor?: string
  iconSize?: number
}

/** Opções de formatação de preço (domínio 'product'). */
export type PriceFormat = {
  /** Locale Intl (default 'pt-BR'). */
  locale?: string
  /** Código ISO da moeda (default 'BRL'). */
  currency?: string
}

export type CardVariantMap = {
  metric: BaseCardProps &
    WithIcon & {
      badge?: string | ReactNode
      badgeBgColor?: string
      badgeTextColor?: string
      trendValue?: string
      trend?: CardTrend
      rightIcon?: ReactNode
      value: string | number | null | undefined
      value2?: string | number | null | undefined
      label: string | number | null | undefined
      label2?: string | number | null | undefined
    }

  stat: BaseCardProps &
    WithIcon & {
      value: string | number
      value2?: string | number
      valueTextColor?: string
      label: string | number
      label2?: string | number
      labelTextColor?: string
    }

  compare: BaseCardProps &
    WithIcon & {
      value: string | number
      label: string | number
      compareText: string
      compareTrend?: CardTrend
    }

  product: BaseCardProps & {
    image?: string
    /** Alt text da imagem (default: `title`). */
    imageAlt?: string
    /** Conteúdo do placeholder quando `image` é ausente (default: nada). */
    imagePlaceholder?: ReactNode
    /** Formata o preço via Intl; sem ela, o valor é exibido como veio. */
    priceFormat?: PriceFormat
    title: string
    description?: string
    price?: string | number
    originalPrice?: string | number
    badge?: string
    status?: CardStatus
    /** Rótulos de status por idioma (default pt-BR). */
    statusLabels?: Partial<Record<CardStatus, string>>
    actions?: ReactNode
  }

  feature: BaseCardProps &
    WithIcon & {
      title: string
      description?: string
      action?: ReactNode
      highlight?: boolean
    }

  plan: BaseCardProps &
    WithIcon & {
      planName: string
      /** Cartão ativo (gradiente). Prop pública nova. */
      active?: boolean
      statusLabel?: string
      description?: string
      renewalDate?: string
      /** Prefixo do rótulo de renovação (default 'Renovação em'). */
      renewalLabel?: string
      action?: ReactNode
      /** @deprecated use `active` */
      $active?: boolean
    }
}

export type CardProps = {
  [K in keyof CardVariantMap]: { $variant: K } & CardVariantMap[K]
}[keyof CardVariantMap]
