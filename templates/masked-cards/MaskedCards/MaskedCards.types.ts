import type { CSSProperties, MouseEventHandler, ReactNode } from 'react'

export type CardSize = 'sm' | 'md' | 'lg' | 'xl'
export type CardDirection = 'row' | 'column'
export type CardTrend = 'up' | 'down' | 'neutral'
export type CardStatus = 'active' | 'inactive' | 'warning' | 'error'

/** Aparência visual independente de $variant. */
export type CardAppearance = 'elevated' | 'filled' | 'outlined' | 'flat' | 'gradient' | 'glass'

/** Disposição estrutural do conteúdo. */
export type CardLayout = 'vertical' | 'horizontal' | 'overlay' | 'split' | 'compact'

/** Proporção da mídia dentro do card. */
export type CardMediaRatio = '1:1' | '4:3' | '16:9' | '21:9' | '3:4' | '9:16' | 'auto'

/** Modo de seleção: 'single' → role radio; 'multiple' → role checkbox. */
export type CardSelectionMode = 'single' | 'multiple'

/** Formatação de preço via Intl.NumberFormat. */
export type PriceFormat = {
  locale: string
  currency: string
}

/** Item da lista de features do pricing. */
export type PricingFeature = {
  label: string
  included?: boolean
}

/** Props de ícone compartilhadas pelas variantes com ícone. */
export type WithIcon = {
  icon?: ReactNode
  iconSize?: number
  iconBgColor?: string
  iconTextColor?: string
}

export type BaseCardProps = {
  href?: string
  /** Rótulo acessível do link/botão esticado. */
  hrefLabel?: string
  onClick?: MouseEventHandler
  size?: CardSize
  fullWidth?: boolean
  cardBg?: string
  direction?: CardDirection
  className?: string
  style?: CSSProperties
  children?: ReactNode

  /** Aparência visual (default 'elevated'). */
  appearance?: CardAppearance
  /** Layout estrutural (default 'vertical'). */
  layout?: CardLayout
  /** Proporção da mídia; encaminhado via --mc-card-media-ratio. */
  mediaRatio?: CardMediaRatio

  /** Paleta registrada em colorThemes (ex.: 'ruby'). Deriva os tokens --mc-card-*. */
  colorTheme?: string
  /** Overrides diretos de tokens --mc-card-*. */
  tokens?: import('./cardTokens').CardTokenOverrides

  /** Desabilita interação e aplica visual de disabled. */
  disabled?: boolean

  /** Torna o card selecionável (role checkbox/radio). */
  selectable?: boolean
  selectionMode?: CardSelectionMode
  /** Selecionado (controlado). */
  selected?: boolean
  /** Selecionado inicial (não controlado). */
  defaultSelected?: boolean
  onSelectedChange?: (selected: boolean) => void
  /** Valor do card dentro de um MaskedCardGroup. */
  selectionValue?: string

  /** Permite expandir para revelar expandContent. */
  expandable?: boolean
  expandContent?: ReactNode
  /** Expandido (controlado). */
  expanded?: boolean
  /** Expandido inicial (não controlado). */
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  expandLabel?: string
  collapseLabel?: string
}

export type CardVariantMap = {
  metric: BaseCardProps &
    WithIcon & {
      value: string | number
      label: string
      trend?: CardTrend
      trendValue?: string
      badge?: string
      badgeBgColor?: string
      badgeTextColor?: string
      rightIcon?: ReactNode
      value2?: string | number
      label2?: string
    }

  stat: BaseCardProps &
    WithIcon & {
      label: string
      value: string | number
      label2?: string
      value2?: string | number
      labelTextColor?: string
      valueTextColor?: string
    }

  compare: BaseCardProps &
    WithIcon & {
      value: string | number
      label: string
      compareText?: string
      compareTrend?: CardTrend
    }

  product: BaseCardProps & {
    title: string
    image?: string
    imageAlt?: string
    /** Conteúdo exibido quando não há imagem. */
    imagePlaceholder?: ReactNode
    description?: string
    price?: string | number
    priceFormat?: PriceFormat
    badge?: string
    originalPrice?: string | number
    status?: CardStatus
    /** Rótulos por status (ex.: { active: 'Disponível' }). */
    statusLabels?: Partial<Record<CardStatus, string>>
    rating?: number
    action?: ReactNode
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
      /** Cartão ativo (gradiente). */
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

  profile: BaseCardProps & {
    name: string
    role?: string
    company?: string
    avatar?: string
    avatarFallback?: string
    avatarAlt?: string
    bio?: string
    location?: string
    stats?: Array<{ label: string; value: string | number }>
    actions?: ReactNode
  }

  article: BaseCardProps & {
    title: string
    excerpt?: string
    image?: string
    imageAlt?: string
    author?: string
    authorAvatar?: string
    date?: string
    readTime?: string
    category?: string
    actions?: ReactNode
  }

  service: BaseCardProps &
    WithIcon & {
      title: string
      description?: string
      image?: string
      imageAlt?: string
      price?: string | number
      /** Prefixo do preço (default 'A partir de'). */
      pricePrefix?: string
      priceFormat?: PriceFormat
      duration?: string
      badge?: string
      actions?: ReactNode
    }

  testimonial: BaseCardProps & {
    quote: string
    author: string
    role?: string
    authorRole?: string
    company?: string
    avatar?: string
    avatarAlt?: string
    /** Iniciais/texto quando não há avatar. */
    avatarFallback?: string
    rating?: number
    /** Rótulo acessível do rating (ex.: '4 de 5'). */
    ratingLabel?: string
    actions?: ReactNode
  }

  pricing: BaseCardProps & {
    planName: string
    price?: string | number
    originalPrice?: string | number
    period?: string
    description?: string
    features?: PricingFeature[]
    highlighted?: boolean
    badge?: string
    action?: ReactNode
    footnote?: string
    priceFormat?: PriceFormat
  }
}

export type CardProps = {
  [K in keyof CardVariantMap]: { $variant: K } & CardVariantMap[K]
}[keyof CardVariantMap]
