import { CSSProperties, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import { CardTokenOverrides } from './cardTokens'

export type CardSize = 'sm' | 'md' | 'lg' | 'xl'
export type CardTrend = 'up' | 'down' | 'neutral'
export type CardStatus = 'active' | 'inactive' | 'warning' | 'error'
export type CardDirection = 'row' | 'column'

/** Aparência visual independente de $variant. Default 'elevated' = visual atual. */
export type CardAppearance = 'elevated' | 'filled' | 'outlined' | 'flat' | 'gradient' | 'glass'

/** Disposição do conteúdo. 'horizontal' implica direction row (direction explícito vence). */
export type CardLayout = 'vertical' | 'horizontal' | 'overlay' | 'split' | 'compact'

/** Proporção da área de mídia (usado por CardMedia e variantes com imagem). */
export type CardMediaRatio = '1:1' | '4:3' | '16:9' | '3:4' | 'auto'

/** 'single' → role="radio"; 'multiple' → role="checkbox". */
export type CardSelectionMode = 'single' | 'multiple'

export type BaseCardProps = {
  href?: string
  onClick?: React.MouseEventHandler
  size?: CardSize
  fullWidth?: boolean
  cardBg?: string
  direction?: CardDirection
  className?: string
  style?: CSSProperties
  children?: ReactNode

  /** Paleta registrada em colorThemes (ex.: 'ruby'). Deriva os tokens --mc-card-*. */
  colorTheme?: ColorThemeName
  /** Overrides diretos de tokens --mc-card-*. */
  tokens?: CardTokenOverrides

  /** Aparência visual (default 'elevated', equivalente ao visual atual). */
  appearance?: CardAppearance
  /** Disposição do conteúdo; 'horizontal' implica row salvo direction explícito. */
  layout?: CardLayout
  /** Proporção da mídia; efeito real em CardMedia e variantes com imagem. */
  mediaRatio?: CardMediaRatio

  /**
   * Nome acessível do link/botão principal quando o card usa o padrão  
   * stretched (href/onClick + actions ou expandable). Opcional — fallback  
   * pt-BR: 'Abrir' (link) ou 'Selecionar'/'Abrir' (botão). As variantes  
   * passam o título (title/planName) quando disponível.  
   */
  hrefLabel?: string

  /**
   * Seleção controlada. Ignorada quando `href` está presente (um <a> não  
   * pode ser radio/checkbox — o link navega e a seleção não se aplica).  
   * role="radio" fora de um radiogroup é limitado: para seleção exclusiva  
   * entre cards, controle `selected` externamente ou use MaskedCardGroup.  
   */
  selected?: boolean
  /** Seleção inicial não controlada. */
  defaultSelected?: boolean
  onSelectedChange?: (selected: boolean) => void
  /** 'single' → radio; 'multiple' → checkbox (default 'single'). */
  selectionMode?: CardSelectionMode

  /** Desabilita interações; mantém a semântica (button disabled / link sem href). */
  disabled?: boolean

  /** Expansão controlada. O controle é um botão dedicado (nunca o card inteiro). */
  expanded?: boolean
  /** Expansão inicial não controlada. */
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  /** Habilita o bloco de expansão (botão "Mostrar mais" + região colapsável). */
  expandable?: boolean
  /** Conteúdo da região colapsável. */
  expandContent?: ReactNode
  /** Rótulo do botão quando recolhido (default 'Mostrar mais'). */
  expandLabel?: string
  /** Rótulo do botão quando expandido (default 'Mostrar menos'). */
  collapseLabel?: string
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
