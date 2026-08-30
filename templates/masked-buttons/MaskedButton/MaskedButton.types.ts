/* ================= BASE ================= */

export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonState = 'default' | 'disabled' | 'loading' | 'error'

export type ButtonShape = 'rounded' | 'circle' | 'square'

export type ButtonPosition = 'left' | 'right' | 'center'

export type BaseButtonProps = {
  size?: ButtonSize
  shapes?: ButtonShape
  state?: ButtonState

  fullWidth?: boolean
  $position?: ButtonPosition
  label?: string

  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children?: React.ReactNode

  className?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void

  href?: string
  target?: React.HTMLAttributeAnchorTarget
  rel?: string
}

/* ================= VARIANT MAP ================= */

export type ButtonVariantMap = {
  default: BaseButtonProps & {
    $isActive?: boolean
  }

  outline: BaseButtonProps & {
    $isActive?: boolean
  }

  ghost: BaseButtonProps & {
    $isActive?: boolean
  }

  link: BaseButtonProps & {
    $isActive?: boolean
  }

  gradient: BaseButtonProps & {
    $isActive?: boolean
  }

  neon: BaseButtonProps & {
    $isActive?: boolean
  }

  toggle: BaseButtonProps & {
    $isActive?: boolean
    $toggleLabel?: string
  }
}

/* ================= UNION AUTOMÁTICA ================= */

export type ButtonProps = {
  [K in keyof ButtonVariantMap]: { $variant: K } & ButtonVariantMap[K]
}[keyof ButtonVariantMap]
