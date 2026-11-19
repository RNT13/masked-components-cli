'use client'

import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { DividerLabel, DividerLine, MaskedDividerRoot } from './MaskedDivider.styles'
import { resolveDividerTokens } from './dividerTokens'
import type { MaskedDividerProps } from './MaskedDivider.types'

/**
 * Divisor horizontal, vertical ou com texto.
 *
 * Acessibilidade: decorativo por padrão (aria-hidden). Com `decorative={false}`
 * vira um separador semântico (role="separator" + aria-orientation). O
 * variant 'labeled' expõe o texto como conteúdo e esconde só as linhas.
 *
 * @example
 * <MaskedDivider />
 * <MaskedDivider variant="labeled" label="ou" spacing="lg" />
 * <MaskedStack variant="row"><A /><MaskedDivider variant="vertical" /><B /></MaskedStack>
 */
export function MaskedDivider(props: MaskedDividerProps) {
  const theme = useMaskedTheme()
  const {
    variant = 'horizontal',
    label,
    decorative = true,
    spacing,
    thickness,
    colorTheme,
    tokens,
    className,
    style,
    ...rest
  } = props

  const tokenStyle = resolveDividerTokens({ colorTheme, spacing, thickness, tokens }, theme)

  const common = {
    className,
    style: { ...tokenStyle, ...style },
    $variant: variant
  }

  if (variant === 'labeled') {
    return (
      <MaskedDividerRoot {...common} {...rest}>
        <DividerLine aria-hidden="true" />
        {label !== undefined && label !== null && <DividerLabel>{label}</DividerLabel>}
        <DividerLine aria-hidden="true" />
      </MaskedDividerRoot>
    )
  }

  const semantics = decorative
    ? ({ 'aria-hidden': true } as const)
    : ({
        role: 'separator',
        'aria-orientation': variant === 'vertical' ? 'vertical' : 'horizontal'
      } as const)

  return <MaskedDividerRoot {...common} {...semantics} {...rest} />
}
