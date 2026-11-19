'use client'

import { useId } from 'react'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  FooterBottom,
  FooterBrand,
  FooterColumn,
  FooterColumnTitle,
  FooterColumns,
  FooterDescription,
  FooterInner,
  FooterLinkItem,
  FooterList,
  FooterTop,
  MaskedFooterRoot
} from './MaskedFooter.styles'
import { resolveFooterTokens } from './footerTokens'
import type { FooterColumn as FooterColumnData, MaskedFooterProps } from './MaskedFooter.types'

const NAV_LABEL = { pt: 'Rodapé', en: 'Footer' } as const

/**
 * Rodapé com marca, colunas de links, redes sociais e copyright.  
 *
 * Links usam o `linkComponent` do MaskedConfigProvider (ex.: next/link) ou  
 * `<a>` nativo. Cada coluna é um <nav> rotulado pelo próprio título.  
 *
 * @example  
 * <MaskedFooter variant="columns" brand="Acme" columns={[{ title: 'Produto', links: [{ label: 'Preços', href: '/precos' }] }]} copyright="© 2026 Acme" />  
 */
export function MaskedFooter(props: MaskedFooterProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const baseId = useId()
  const {
    as,
    variant = 'simple',
    brand,
    description,
    columns,
    social,
    copyright,
    navLabel,
    colorTheme,
    tokens,
    className,
    style,
    children,
    ...rest
  } = props

  const locale = (config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt'
  const label = navLabel ?? NAV_LABEL[locale]
  const tokenStyle = resolveFooterTokens({ colorTheme, tokens }, theme)
  const hasColumns = Boolean(columns?.length)

  const renderLinks = (column: FooterColumnData, inline = false) => (
    <FooterList $inline={inline}>
      {column.links.map((link) => (
        <li key={`${link.href}-${link.label}`}>
          <FooterLinkItem as={config.linkComponent} href={link.href}>
            {link.label}
          </FooterLinkItem>
        </li>
      ))}
    </FooterList>
  )

  const showTitles = variant === 'columns'
  const flatLinks: FooterColumnData = {
    title: label,
    links: (columns ?? []).flatMap((c) => c.links)
  }

  return (
    <MaskedFooterRoot
      as={as}
      $variant={variant}
      className={className}
      style={{ ...tokenStyle, ...style }}
      {...rest}
    >
      <FooterInner>
        <FooterTop $variant={variant}>
          {(brand || description) && (
            <FooterBrand>
              {brand}
              {description && <FooterDescription>{description}</FooterDescription>}
            </FooterBrand>
          )}

          {hasColumns && showTitles && (
            <FooterColumns>
              {columns!.map((column, index) => {
                const titleId = `${baseId}-col-${index}`
                return (
                  <FooterColumn key={column.title} aria-labelledby={titleId}>
                    <FooterColumnTitle id={titleId}>{column.title}</FooterColumnTitle>
                    {renderLinks(column)}
                  </FooterColumn>
                )
              })}
            </FooterColumns>
          )}

          {hasColumns && !showTitles && (
            <nav aria-label={label}>{renderLinks(flatLinks, true)}</nav>
          )}

          {children}
        </FooterTop>

        {(copyright || social) && (
          <FooterBottom>
            {copyright && <small>{copyright}</small>}
            {social}
          </FooterBottom>
        )}
      </FooterInner>
    </MaskedFooterRoot>
  )
}
