'use client'

import { useState, type ReactNode } from 'react'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  Ellipsis,
  MaskedPaginationRoot,
  PageControl,
  PageLink,
  PageStatus,
  PaginationList
} from './MaskedPagination.styles'
import { clampPage, getPageRange, resolvePaginationTokens } from './paginationTokens'
import type { MaskedPaginationProps } from './MaskedPagination.types'

const DICT = {
  pt: {
    nav: 'Paginação',
    page: (n: number) => `Página ${n}`,
    prev: 'Página anterior',
    next: 'Próxima página',
    first: 'Primeira página',
    last: 'Última página',
    status: (page: number, count: number) => `Página ${page} de ${count}`
  },
  en: {
    nav: 'Pagination',
    page: (n: number) => `Page ${n}`,
    prev: 'Previous page',
    next: 'Next page',
    first: 'First page',
    last: 'Last page',
    status: (page: number, count: number) => `Page ${page} of ${count}`
  }
} as const

/**
 * Paginação acessível.
 *
 * Semântica: <nav aria-label> com lista; a página atual recebe
 * `aria-current="page"`; cada item tem rótulo completo ("Página 3", "Próxima
 * página"); anterior/próxima ficam desabilitadas nos extremos. Controlada
 * (`page`/`onChange`) ou não (`defaultPage`). Com `hrefBuilder` os itens
 * viram links reais (usam o `linkComponent` do MaskedConfigProvider).
 *
 * @example
 * <MaskedPagination pageCount={20} defaultPage={3} onChange={setPage} />
 * <MaskedPagination variant="compact" pageCount={20} page={page} onChange={setPage} />
 */
export function MaskedPagination(props: MaskedPaginationProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const {
    variant = 'default',
    pageCount,
    page: pageProp,
    defaultPage = 1,
    onChange,
    siblingCount = 1,
    hrefBuilder,
    label,
    colorTheme,
    tokens,
    className,
    style,
    ...rest
  } = props

  const [inner, setInner] = useState(defaultPage)
  const total = Math.max(1, Math.floor(pageCount))
  const page = clampPage(pageProp ?? inner, total)
  const dict = DICT[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']
  const tokenStyle = resolvePaginationTokens({ colorTheme, tokens }, theme)

  function go(next: number) {
    const target = clampPage(next, total)
    if (target === page) return
    setInner(target)
    onChange?.(target)
  }

  /** Item que navega: link real com hrefBuilder, botão sem ele. */
  const control = (
    target: number,
    content: ReactNode,
    ariaLabel: string,
    options: { current?: boolean; disabled?: boolean } = {}
  ) => {
    const { current = false, disabled = false } = options
    if (hrefBuilder && !disabled) {
      return (
        <PageLink
          as={config.linkComponent}
          href={hrefBuilder(target)}
          aria-label={ariaLabel}
          aria-current={current ? 'page' : undefined}
          $current={current}
          onClick={() => go(target)}
        >
          {content}
        </PageLink>
      )
    }
    return (
      <PageControl
        type="button"
        aria-label={ariaLabel}
        aria-current={current ? 'page' : undefined}
        aria-disabled={hrefBuilder && disabled ? true : undefined}
        disabled={!hrefBuilder && disabled}
        $current={current}
        onClick={() => go(target)}
      >
        {content}
      </PageControl>
    )
  }

  const atStart = page <= 1
  const atEnd = page >= total

  return (
    <MaskedPaginationRoot
      aria-label={label ?? dict.nav}
      className={className}
      style={{ ...tokenStyle, ...style }}
      {...rest}
    >
      <PaginationList>
        {variant === 'edges' && <li>{control(1, '«', dict.first, { disabled: atStart })}</li>}
        <li>{control(page - 1, '‹', dict.prev, { disabled: atStart })}</li>

        {variant === 'compact' ? (
          <PageStatus aria-live="polite">{dict.status(page, total)}</PageStatus>
        ) : (
          getPageRange(page, total, siblingCount).map((item) =>
            typeof item === 'number' ? (
              <li key={item}>{control(item, item, dict.page(item), { current: item === page })}</li>
            ) : (
              <li key={item}>
                <Ellipsis aria-hidden="true">…</Ellipsis>
              </li>
            )
          )
        )}

        <li>{control(page + 1, '›', dict.next, { disabled: atEnd })}</li>
        {variant === 'edges' && <li>{control(total, '»', dict.last, { disabled: atEnd })}</li>}
      </PaginationList>
    </MaskedPaginationRoot>
  )
}
