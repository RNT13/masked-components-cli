'use client'

import { useState } from 'react'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { MaskedDrawer } from '@/components/ui/MaskedDrawer/MaskedDrawer'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  HeaderActions,
  HeaderBar,
  HeaderBrand,
  HeaderNav,
  MaskedHeaderRoot,
  MenuActions,
  MenuButton,
  MenuCloseButton,
  MenuPanel,
  MenuPanelTop,
  NavLinkItem,
  NavList
} from './MaskedHeader.styles'
import { resolveHeaderTokens } from './headerTokens'
import type { HeaderLink, MaskedHeaderProps } from './MaskedHeader.types'

const DICT = {
  pt: { nav: 'Principal', open: 'Abrir menu', close: 'Fechar menu' },
  en: { nav: 'Main', open: 'Open menu', close: 'Close menu' }
} as const

function MenuIcon({ open }: { open: boolean }) {
  return (
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
      {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  )
}

/**
 * Navbar com marca, links, ações e menu mobile (Drawer).
 *
 * Abaixo de `menuBreakpoint` (default 'tablet') os links e as ações vão para
 * um MaskedDrawer aberto pelo botão hambúrguer (aria-expanded + rótulo por
 * locale). Links usam o `linkComponent` do MaskedConfigProvider (ex.:
 * next/link) ou <a> nativo; o link da página atual recebe aria-current.
 *
 * Atenção: `brand` e `actions` são renderizados duas vezes — na barra e
 * dentro do menu mobile (o painel fechado fica no DOM, mas com aria-hidden
 * e inert). Evite `id` fixo nesses slots.
 *
 * @example
 * <MaskedHeader variant="sticky" brand="Acme" links={[{ label: 'Preços', href: '/precos' }]} actions={<button>Entrar</button>} />
 */
export function MaskedHeader(props: MaskedHeaderProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const [menuOpen, setMenuOpen] = useState(false)
  const {
    as,
    variant = 'static',
    brand,
    links,
    actions,
    menuBreakpoint = 'tablet',
    navLabel,
    contained = true,
    colorTheme,
    tokens,
    className,
    style,
    ...rest
  } = props

  const dict = DICT[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']
  const label = navLabel ?? dict.nav
  const tokenStyle = resolveHeaderTokens({ variant, colorTheme, tokens }, theme)
  const hasLinks = Boolean(links?.length)
  const hasMenu = hasLinks || Boolean(actions)

  const renderLinks = (menu: boolean) =>
    links?.map((link: HeaderLink) => (
      <li key={`${link.href}-${link.label}`}>
        <NavLinkItem
          as={config.linkComponent}
          href={link.href}
          $active={link.active}
          $menu={menu}
          aria-current={link.active ? 'page' : undefined}
          onClick={menu ? () => setMenuOpen(false) : undefined}
        >
          {link.label}
        </NavLinkItem>
      </li>
    ))

  return (
    <MaskedHeaderRoot
      as={as}
      $variant={variant}
      className={className}
      style={{ ...tokenStyle, ...style }}
      {...rest}
    >
      <HeaderBar $contained={contained}>
        {brand && <HeaderBrand>{brand}</HeaderBrand>}

        {hasLinks && (
          <HeaderNav $breakpoint={menuBreakpoint} aria-label={label}>
            <NavList>{renderLinks(false)}</NavList>
          </HeaderNav>
        )}

        {actions && <HeaderActions $breakpoint={menuBreakpoint}>{actions}</HeaderActions>}

        {hasMenu && (
          <MenuButton
            type="button"
            $breakpoint={menuBreakpoint}
            aria-label={menuOpen ? dict.close : dict.open}
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MenuIcon open={menuOpen} />
          </MenuButton>
        )}
      </HeaderBar>

      {hasMenu && (
        <MaskedDrawer
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          side="right"
          width={{ mobile: '85%', tablet: '320px' }}
          colorTheme={colorTheme}
        >
          <MenuPanel style={tokenStyle}>
            <MenuPanelTop>
              {brand}
              <MenuCloseButton
                type="button"
                aria-label={dict.close}
                onClick={() => setMenuOpen(false)}
              >
                <MenuIcon open />
              </MenuCloseButton>
            </MenuPanelTop>
            {hasLinks && (
              <nav aria-label={label}>
                <NavList $vertical>{renderLinks(true)}</NavList>
              </nav>
            )}
            {actions && <MenuActions>{actions}</MenuActions>}
          </MenuPanel>
        </MaskedDrawer>
      )}
    </MaskedHeaderRoot>
  )
}
