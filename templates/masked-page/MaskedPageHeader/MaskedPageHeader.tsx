'use client'

import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  MaskedPageHeaderRoot,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderInner,
  PageHeaderRow,
  PageHeaderText,
  PageHeaderTitle
} from './MaskedPageHeader.styles'
import { resolvePageHeaderTokens } from './pageHeaderTokens'
import type { MaskedPageHeaderProps } from './MaskedPageHeader.types'

/**
 * Cabeçalho de página interna: breadcrumbs, título, descrição e ações.
 *
 * O título é um <h1> por padrão (um por página); em páginas que já têm h1
 * use `headingLevel={2}`.
 *
 * @example
 * <MaskedPageHeader title="Clientes" description="Gerencie sua base" actions={<button>Novo</button>} />
 */
export function MaskedPageHeader(props: MaskedPageHeaderProps) {
  const theme = useMaskedTheme()
  const {
    as,
    variant = 'simple',
    title,
    headingLevel = 1,
    description,
    breadcrumbs,
    actions,
    colorTheme,
    tokens,
    className,
    style,
    children,
    ...rest
  } = props

  const tokenStyle = resolvePageHeaderTokens({ variant, colorTheme, tokens }, theme)

  return (
    <MaskedPageHeaderRoot
      as={as}
      $variant={variant}
      className={className}
      style={{ ...tokenStyle, ...style }}
      {...rest}
    >
      <PageHeaderInner>
        {breadcrumbs}
        <PageHeaderRow>
          <PageHeaderText>
            <PageHeaderTitle as={`h${headingLevel}` as 'h1'}>{title}</PageHeaderTitle>
            {description && <PageHeaderDescription>{description}</PageHeaderDescription>}
          </PageHeaderText>
          {actions && <PageHeaderActions>{actions}</PageHeaderActions>}
        </PageHeaderRow>
        {children}
      </PageHeaderInner>
    </MaskedPageHeaderRoot>
  )
}
