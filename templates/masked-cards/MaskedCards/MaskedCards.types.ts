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

/** Semântica de seleção. */
export type CardSelectionMode = 'single' | 'multiple'

export type WithIcon = {
  icon?: ReactNode
  iconSize?: number
  iconBgColor?: string
  iconTextColor?: string
}

/** Formatação de preço via Intl.NumberFormat. */
export type PriceFormat = {
  /** Locale BCP 47 (ex.: 'pt-BR'). */
  locale: string
  /** Moeda ISO 4217 (ex.: 'BRL'). */
  currency: string
}

export type ProfileStat = {
  label: string
  value: string | number
}

export type PricingFeature = {
  label: string
  /** false → item riscado/indisponível (default true). */
  included?: boolean
}

export type BaseCardProps = {
  size?: CardSize
  fullWidth?: boolean
  cardBg?: string
  direction?: CardDirection

  /** Aparência visual (default 'elevated'). */
  appearance?: CardAppearance

  /** Layout estrutural (default 'vertical'). */
  layout?: CardLayout

  /** Proporção da mídia quando a variante/composição renderiza imagem. */
  mediaRatio?: CardMediaRatio

  /** Tema de cor do card. */
  colorTheme?: string

  /** Overrides de tokens --mc-card-*. */
  tokens?: import('./cardTokens').CardTokenOverrides

  /** Torna o card inteiro um link. */
  href?: string

  /** Nome acessível do link/botão do card. */
  hrefLabel?: string

  /** Clique no card inteiro. */
  onClick?: MouseEventHandler

  /** Desabilita interação e aplica visual de disabled. */
  disabled?: boolean

  /** Selecionado (controlado). */
  selected?: boolean

  /** Selecionado inicialmente (não controlado). */
  defaultSelected?: boolean

  onSelectedChange?: (selected: boolean) => void

  /** 'single' → radio; 'multiple' → checkbox. */
  selectionMode?: CardSelectionMode

  /** Valor do card dentro de um MaskedCardGroup. */
  selectionValue?: string

  /** Expandido (controlado). */
  expanded?: boolean

  /** Expandido inicialmente (não controlado). */
  defaultExpanded?: boolean

  onExpandedChange?: (expanded: boolean) => void

  /** Habilita o botão de expansão. */
  expandable?: boolean

  /** Conteúdo revelado ao expandir. */
  expandContent?: ReactNode

  /** Rótulo do botão quando recolhido. */
  expandLabel?: string

  /** Rótulo do botão quando expandido. */
  collapseLabel?: string

  className?: string
  style?: CSSProperties
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
      value2?: string | number
      label?: string
      label2?: string
      valueTextColor?: string
      labelTextColor?: string
      description?: string
    }

  stat: BaseCardProps &
    WithIcon & {
      value: string | number
      label?: string
      value2?: string | number
      label2?: string
      valueTextColor?: string
      labelTextColor?: string
      trend?: CardTrend
      trendValue?: string
      description?: string
    }

  compare: BaseCardProps &
    WithIcon & {
      value: string | number
      label?: string
      compareText?: string
      compareTrend?: CardTrend
      valueTextColor?: string
      labelTextColor?: string
      description?: string
    }

  product: BaseCardProps & {
    image?: string
    imageAlt?: string
    imagePlaceholder?: ReactNode
    title: string
    description?: string
    price?: string | number
    originalPrice?: string | number

    /** Formata o preço usando Intl.NumberFormat. */
    priceFormat?: PriceFormat

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

      /** Cartão ativo. */
      active?: boolean

      statusLabel?: string
      description?: string
      renewalDate?: string

      /** Prefixo do rótulo de renovação. */
      renewalLabel?: string

      action?: ReactNode

      /** @deprecated use active */
      $active?: boolean
    }

  profile: BaseCardProps & {
    /** Foto/avatar. Sem ela, renderiza iniciais do nome. */
    avatar?: string

    /** Alt do avatar (default: name). */
    avatarAlt?: string

    /** Texto alternativo exibido quando não há avatar. */
    avatarFallback?: string

    name: string

    /** Cargo/função. */
    role?: string

    /** Empresa/organização. */
    company?: string

    /** Localização ou cidade do perfil. */
    location?: string

    /** Bio curta. */
    bio?: string

    /** Métricas do perfil. */
    stats?: ProfileStat[]

    /** Ações do perfil. */
    actions?: ReactNode
  }

  article: BaseCardProps & {
    /** Imagem de capa. */
    image?: string

    /** Alt da imagem (default: title). */
    imageAlt?: string

    /** Categoria/editoria. */
    category?: string

    title: string

    /** Resumo/chamada. */
    excerpt?: string

    /** Nome do autor. */
    author?: string

    /** Avatar do autor. */
    authorAvatar?: string

    /** Data formatada. */
    date?: string

    /** Tempo de leitura. */
    readTime?: string

    /** Ações do artigo. */
    actions?: ReactNode
  }

  service: BaseCardProps &
    WithIcon & {
      /** Imagem do serviço (alternativa ao icon). */
      image?: string

      /** Alt da imagem (default: title). */
      imageAlt?: string

      title: string
      description?: string

      /** Preço exibido. */
      price?: string | number

      /** Prefixo do preço (default 'A partir de'). */
      pricePrefix?: string

      /** Formatação monetária. */
      priceFormat?: PriceFormat

      /** Duração estimada. */
      duration?: string

      /** Selo curto. */
      badge?: string

      /** Ações do serviço. */
      actions?: ReactNode
    }

  testimonial: BaseCardProps & {
    /** Texto do depoimento. */
    quote: string

    /** Nome do autor. */
    author: string

    /** Cargo do autor. */
    role?: string

    /** @deprecated use role */
    authorRole?: string

    /** Empresa do autor. */
    company?: string

    /** Avatar do autor. */
    avatar?: string

    /** Alt do avatar (default: author). */
    avatarAlt?: string

    /** Fallback quando avatar não é passado. */
    avatarFallback?: ReactNode

    /** Nota de 0 a 5. */
    rating?: number

    /** Nome acessível do rating. */
    ratingLabel?: string

    /** Ações opcionais. */
    actions?: ReactNode
  }

  pricing: BaseCardProps & {
    /** Nome do plano. */
    planName: string

    /** Preço. */
    price?: string | number

    /** Preço original riscado. */
    originalPrice?: string | number

    /** Período de cobrança. */
    period?: string

    /** Formatação monetária. */
    priceFormat?: PriceFormat

    /** Descrição curta do plano. */
    description?: string

    /** Lista de funcionalidades. */
    features?: PricingFeature[]

    /** Destaque visual do plano. */
    highlighted?: boolean

    /** Selo do plano. */
    badge?: string

    /** CTA principal. */
    action?: ReactNode

    /** Nota de rodapé. */
    footnote?: string
  }
}

export type CardProps = {
  [K in keyof CardVariantMap]: { $variant: K } & CardVariantMap[K]
}[keyof CardVariantMap]
