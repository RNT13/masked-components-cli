'use client'

import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  EmptyStateAction,
  EmptyStateBody,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
  MaskedEmptyStateRoot
} from './MaskedEmptyState.styles'
import { resolveEmptyStateTokens } from './emptyStateTokens'
import type { MaskedEmptyStateProps } from './MaskedEmptyState.types'

/**
 * Estado vazio: ícone, título, descrição e ação (listas sem dados, busca sem
 * resultado, erro de carregamento).
 *
 * O ícone é decorativo (aria-hidden); o título é um heading (h3 por padrão,
 * ajuste com `headingLevel`). Para anunciar um erro que aparece dinamicamente,
 * passe `role="alert"` (é repassado ao elemento raiz).
 *
 * @example
 * <MaskedEmptyState icon="🔍" title="Nada encontrado" description="Tente outro termo" action={<button>Limpar busca</button>} />
 */
export function MaskedEmptyState(props: MaskedEmptyStateProps) {
  const theme = useMaskedTheme()
  const {
    as,
    variant = 'default',
    icon,
    title,
    headingLevel = 3,
    description,
    action,
    colorTheme,
    tokens,
    className,
    style,
    ...rest
  } = props

  const tokenStyle = resolveEmptyStateTokens({ colorTheme, tokens }, theme)

  return (
    <MaskedEmptyStateRoot
      as={as}
      $variant={variant}
      className={className}
      style={{ ...tokenStyle, ...style }}
      {...rest}
    >
      {icon && <EmptyStateIcon aria-hidden="true">{icon}</EmptyStateIcon>}
      <EmptyStateBody>
        <EmptyStateTitle as={`h${headingLevel}` as 'h3'}>{title}</EmptyStateTitle>
        {description && <EmptyStateDescription>{description}</EmptyStateDescription>}
        {action && <EmptyStateAction>{action}</EmptyStateAction>}
      </EmptyStateBody>
    </MaskedEmptyStateRoot>
  )
}
