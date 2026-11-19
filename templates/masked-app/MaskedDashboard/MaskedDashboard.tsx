'use client'

import { useState } from 'react'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { MaskedPageHeader } from '@/components/ui/MaskedPageHeader/MaskedPageHeader'
import { MaskedShell } from '@/components/ui/MaskedShell/MaskedShell'
import { MaskedSidebar } from '@/components/ui/MaskedSidebar/MaskedSidebar'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  DashboardContent,
  DashboardInner,
  MenuToggle,
  Topbar,
  TopbarBrand,
  TopbarSlot
} from './MaskedDashboard.styles'
import { getDashboardParts, resolveDashboardTokens } from './dashboardTokens'
import type { MaskedDashboardProps } from './MaskedDashboard.types'

const DICT = {
  pt: { open: 'Abrir menu de navegação', close: 'Fechar menu de navegação' },
  en: { open: 'Open navigation menu', close: 'Close navigation menu' }
} as const

/**
 * Estrutura pronta de painel: barra superior + sidebar + cabeçalho de página +
 * área de widgets. Compõe MaskedShell, MaskedSidebar e MaskedPageHeader e
 * cuida do que dá mais trabalho: no mobile, o botão da barra superior abre a
 * sidebar num Drawer (estado interno, sem boilerplate).
 *
 * Os widgets são composição sua: use `children` com MaskedGrid, MaskedDiv,
 * MaskedTable, MaskedStats etc. A barra superior vem do slot `topbar`.
 *
 * Acessibilidade: herda do MaskedShell o `<main>` e o link "pular para o
 * conteúdo"; o botão do menu tem rótulo por locale e `aria-expanded`.
 *
 * @example
 * <MaskedDashboard variant="saas" brand="Zandry" navItems={items} title="Painel" topbar={<MaskedAvatar name="Ana" />}>
 *   <MaskedGrid cols={3}>…</MaskedGrid>
 * </MaskedDashboard>
 */
export function MaskedDashboard(props: MaskedDashboardProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const [mobileOpen, setMobileOpen] = useState(false)
  const {
    as,
    variant = 'analytics',
    brand,
    navItems,
    activeId,
    defaultActiveId,
    onActiveChange,
    sidebarFooter,
    topbar,
    title,
    description,
    breadcrumbs,
    actions,
    contentWidth = 'wide',
    skipLinkLabel,
    colorTheme,
    tokens,
    className,
    style,
    children,
    ...rest
  } = props

  const dict = DICT[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']
  const parts = getDashboardParts(variant)
  const tokenStyle = resolveDashboardTokens({ variant, colorTheme, tokens }, theme)

  return (
    <MaskedShell
      as={as}
      variant="app"
      skipLinkLabel={skipLinkLabel}
      className={className}
      style={{ ...tokenStyle, ...style }}
      header={
        <Topbar>
          <MenuToggle
            type="button"
            aria-label={mobileOpen ? dict.close : dict.open}
            aria-expanded={mobileOpen}
            aria-haspopup="dialog"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </MenuToggle>
          {brand && <TopbarBrand>{brand}</TopbarBrand>}
          {topbar && <TopbarSlot>{topbar}</TopbarSlot>}
        </Topbar>
      }
      sidebar={
        <MaskedSidebar
          variant={parts.sidebar}
          items={navItems}
          activeId={activeId}
          defaultActiveId={defaultActiveId}
          onActiveChange={onActiveChange}
          header={brand}
          footer={sidebarFooter}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          colorTheme={colorTheme}
        />
      }
      {...rest}
    >
      {title && (
        <MaskedPageHeader
          variant={parts.pageHeader}
          title={title}
          headingLevel={1}
          description={description}
          breadcrumbs={breadcrumbs}
          actions={actions}
          colorTheme={colorTheme}
        />
      )}
      <DashboardContent $variant={variant} $width={contentWidth}>
        <DashboardInner $width={contentWidth}>{children}</DashboardInner>
      </DashboardContent>
    </MaskedShell>
  )
}
