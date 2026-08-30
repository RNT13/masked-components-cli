import { ReactNode } from 'react'

export type CardSize = 'sm' | 'md' | 'lg' | 'xl'
export type CardTrend = 'up' | 'down' | 'neutral'
export type CardStatus = 'active' | 'inactive' | 'warning' | 'error'

export type CardDirection = 'row' | 'column'

export type BaseCardProps = {
  href?: string
  onClick?: React.MouseEventHandler
  size?: CardSize
  fullWidth?: boolean
  cardBg?: string
  direction?: CardDirection
  className?: string
  children?: React.ReactNode
}

type WithIcon = {
  icon?: ReactNode
  iconTextColor?: string
  iconBgColor?: string
  iconSize?: number
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
      value: string | number | string[] | null | undefined
      value2?: string | number | string[] | null | undefined
      label: string | number | string[] | null | undefined
      label2?: string | number | string[] | null | undefined
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
    title: string
    description?: string
    price?: string | number
    originalPrice?: string | number
    badge?: string
    status?: CardStatus
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
      $active?: boolean
      statusLabel?: string
      description?: string
      renewalDate?: string
      action?: ReactNode
    }
}

export type CardProps = {
  [K in keyof CardVariantMap]: { $variant: K } & CardVariantMap[K]
}[keyof CardVariantMap]
