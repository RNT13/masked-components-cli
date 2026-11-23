'use client'

import { useState, type ReactNode } from 'react'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { MaskedDrawer } from '@/components/ui/MaskedDrawer/MaskedDrawer'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  ItemBadge,
  ItemButton,
  ItemIcon,
  ItemLabel,
  ItemLink,
  MaskedSidebarRoot,
  SidebarDrawerPanel,
  SidebarList,
  SidebarNav,
  SidebarTop,
  ToggleButton
} from './MaskedSidebar.styles'
import { resolveSidebarTokens } from './sidebarTokens'
import type { MaskedSidebarProps, SidebarItem } from './MaskedSidebar.types'

const DICT = {
  pt: { nav: 'Navegação lateral', collapse: 'Recolher menu', expand: 'Expandir menu' },
  en: { nav: 'Sidebar', collapse: 'Collapse menu', expand: 'Expand menu' }
} as const

function Chevron() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 6l-6 6 6 6" />
    </svg>
  )
}

/**
 * Navegação lateral com itens, colapso e modo mobile (Drawer).
 *
 * Estado: `activeId` e `collapsed` funcionam controlados ou não
 * (`defaultActiveId`/`defaultCollapsed`). Recolhida, os rótulos continuam
 * acessíveis a leitores de tela e o `title` mostra o nome no hover.
 * Passe `mobileOpen` para esconder a sidebar abaixo do tablet e abri-la num
 * MaskedDrawer. O item ativo recebe aria-current="page".
 *
 * Nota: seleção e colapso são implementações mínimas deste componente —
 * ponto de unificação futura com useSelectable/useExpandable.
 *
 * @example
 * <MaskedSidebar items={[{ id: 'home', label: 'Início', href: '/' }]} activeId="home" />
 */
export function MaskedSidebar(props: MaskedSidebarProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const {
    as,
    variant = 'fixed',
    items,
    activeId,
    defaultActiveId,
    onActiveChange,
    collapsed,
    defaultCollapsed = false,
    onCollapsedChange,
    collapsible = true,
    width,
    collapsedWidth,
    header,
    footer,
    mobileOpen,
    onMobileClose,
    navLabel,
    colorTheme,
    tokens,
    className,
    style,
    ...rest
  } = props

  const [innerActive, setInnerActive] = useState(defaultActiveId)
  const [innerCollapsed, setInnerCollapsed] = useState(defaultCollapsed)

  const currentActive = activeId ?? innerActive
  const isCollapsed = collapsed ?? innerCollapsed

  const dict = DICT[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']
  const label = navLabel ?? dict.nav
  const tokenStyle = resolveSidebarTokens(
    { variant, colorTheme, width, collapsedWidth, tokens },
    theme
  )
  const hasMobile = mobileOpen !== undefined

  function select(item: SidebarItem) {
    if (item.disabled) return
    setInnerActive(item.id)
    onActiveChange?.(item.id)
    item.onClick?.()
    onMobileClose?.()
  }

  function toggleCollapsed() {
    const next = !isCollapsed
    setInnerCollapsed(next)
    onCollapsedChange?.(next)
  }

  /** Lista de itens; `compact` = recolhida (só no aside, nunca no drawer). */
  const renderItems = (compact: boolean): ReactNode => (
    <SidebarNav aria-label={label}>
      <SidebarList>
        {items.map((item) => {
          const active = item.id === currentActive
          const content = (
            <>
              {item.icon && <ItemIcon aria-hidden="true">{item.icon}</ItemIcon>}
              <ItemLabel $hidden={compact && Boolean(item.icon)}>{item.label}</ItemLabel>
              {item.badge && !compact && <ItemBadge>{item.badge}</ItemBadge>}
            </>
          )
          const common = {
            $active: active,
            $collapsed: compact,
            title: compact ? item.label : undefined,
            'aria-current': active ? ('page' as const) : undefined,
            onClick: () => select(item)
          }

          return (
            <li key={item.id}>
              {item.href && !item.disabled ? (
                <ItemLink as={config.linkComponent} href={item.href} {...common}>
                  {content}
                </ItemLink>
              ) : (
                <ItemButton type="button" disabled={item.disabled} {...common}>
                  {content}
                </ItemButton>
              )}
            </li>
          )
        })}
      </SidebarList>
    </SidebarNav>
  )

  return (
    <>
      <MaskedSidebarRoot
        as={as}
        $variant={variant}
        $collapsed={isCollapsed}
        $hideOnMobile={hasMobile}
        className={className}
        style={{ ...tokenStyle, ...style }}
        {...rest}
      >
        {(header || collapsible) && (
          <SidebarTop>
            {!isCollapsed && header}
            {collapsible && (
              <ToggleButton
                type="button"
                $collapsed={isCollapsed}
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? dict.expand : dict.collapse}
                onClick={toggleCollapsed}
              >
                <Chevron />
              </ToggleButton>
            )}
          </SidebarTop>
        )}
        {renderItems(isCollapsed)}
        {footer && !isCollapsed && <div>{footer}</div>}
      </MaskedSidebarRoot>

      {hasMobile && (
        <MaskedDrawer
          isOpen={Boolean(mobileOpen)}
          onClose={() => onMobileClose?.()}
          side="left"
          width={{ mobile: '85%', tablet: '300px' }}
          colorTheme={colorTheme}
          ariaLabel={label}
        >
          <SidebarDrawerPanel style={tokenStyle}>
            {header}
            {renderItems(false)}
            {footer}
          </SidebarDrawerPanel>
        </MaskedDrawer>
      )}
    </>
  )
}
