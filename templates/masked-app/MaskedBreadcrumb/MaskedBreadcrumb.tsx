'use client'

import { Fragment } from 'react'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  BreadcrumbCurrent,
  BreadcrumbItemEl,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  MaskedBreadcrumbRoot
} from './MaskedBreadcrumb.styles'
import { collapseBreadcrumb, resolveBreadcrumbTokens } from './breadcrumbTokens'
import type { MaskedBreadcrumbProps } from './MaskedBreadcrumb.types'

const LABEL = { pt: 'Trilha de navegação', en: 'Breadcrumb' } as const

/**
 * Trilha de navegação (breadcrumb).
 *
 * Semântica: <nav aria-label> com <ol>; o último item é a página atual
 * (`aria-current="page"`, sem link). Separadores são decorativos
 * (aria-hidden). Links usam o `linkComponent` do MaskedConfigProvider.
 * O variant 'compact' (ou `maxItems`) troca os itens do meio por "…".
 *
 * @example
 * <MaskedBreadcrumb items={[{ label: 'Início', href: '/' }, { label: 'Clientes', href: '/clientes' }, { label: 'Ana' }]} />
 */
export function MaskedBreadcrumb(props: MaskedBreadcrumbProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const {
    variant = 'default',
    items,
    separator = '/',
    maxItems,
    label,
    tokens,
    className,
    style,
    ...rest
  } = props

  const aria =
    label ?? LABEL[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']
  const entries = collapseBreadcrumb(items, maxItems ?? (variant === 'compact' ? 3 : undefined))
  const tokenStyle = resolveBreadcrumbTokens({ tokens }, theme)

  return (
    <MaskedBreadcrumbRoot
      aria-label={aria}
      className={className}
      style={{ ...tokenStyle, ...style }}
      {...rest}
    >
      <BreadcrumbList $compact={variant === 'compact'}>
        {entries.map((entry, position) => {
          const last = position === entries.length - 1
          return (
            <Fragment key={entry.kind === 'item' ? entry.index : 'ellipsis'}>
              <BreadcrumbItemEl>
                {entry.kind === 'ellipsis' ? (
                  <span aria-hidden="true">…</span>
                ) : last || !entry.item.href ? (
                  <BreadcrumbCurrent aria-current={last ? 'page' : undefined}>
                    {entry.item.label}
                  </BreadcrumbCurrent>
                ) : (
                  <BreadcrumbLink as={config.linkComponent} href={entry.item.href}>
                    {entry.item.label}
                  </BreadcrumbLink>
                )}
                {!last && <BreadcrumbSeparator aria-hidden="true">{separator}</BreadcrumbSeparator>}
              </BreadcrumbItemEl>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </MaskedBreadcrumbRoot>
  )
}
