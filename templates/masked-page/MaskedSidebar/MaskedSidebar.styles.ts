import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedSidebarInternalProps } from './MaskedSidebar.types'

export const MaskedSidebarRoot = styled.aside<MaskedSidebarInternalProps>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: none;
  gap: ${maskedTheme.spacing.md};
  min-width: 0;
  width: ${({ $collapsed }) =>
    $collapsed ? 'var(--mc-sidebar-collapsed-width, 72px)' : 'var(--mc-sidebar-width, 260px)'};
  padding: ${maskedTheme.spacing.md};
  color: var(--mc-sidebar-fg, inherit);
  background: var(--mc-sidebar-bg, transparent);
  border-right: 1px solid var(--mc-sidebar-border, transparent);
  overflow-x: hidden;
  overflow-y: auto;
  transition: width 0.2s ease;

  ${media.reducedMotion} {
    transition: none;
  }

  ${({ $variant }) =>
    $variant === 'fixed' &&
    css`
      position: sticky;
      top: 0;
      height: 100dvh;
    `}

  ${({ $variant }) =>
    $variant === 'floating' &&
    css`
      position: sticky;
      top: ${maskedTheme.spacing.md};
      align-self: flex-start;
      max-height: calc(100dvh - 2 * ${maskedTheme.spacing.md});
      margin: ${maskedTheme.spacing.md};
      border: 1px solid var(--mc-sidebar-border, transparent);
      border-radius: ${maskedTheme.radius.lg};
      box-shadow: ${maskedTheme.boxShadow.md()};
    `}  
  
  ${({ $hideOnMobile }) =>
    $hideOnMobile &&
    css`
      ${media.tablet} {
        display: none;
      }
    `}
`

export const SidebarTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${maskedTheme.spacing.sm};
  min-height: 40px;
`

export const SidebarNav = styled.nav`
  flex: 1;
  min-height: 0;
`

export const SidebarList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing['2xs']};
  margin: 0;
  padding: 0;
  list-style: none;
`

/** Estilo comum de item (link ou botão): alvo de toque 44px, foco visível. */
const itemStyles = css<{ $active?: boolean; $collapsed?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.sm};
  width: 100%;
  min-height: 44px;
  padding: ${maskedTheme.spacing.xs} ${maskedTheme.spacing.sm};
  border: 0;
  border-radius: ${maskedTheme.radius.sm};
  background: ${({ $active }) =>
    $active ? 'color-mix(in srgb, currentColor 14%, transparent)' : 'transparent'};
  color: inherit;
  font: inherit;
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${({ $active }) =>
    $active ? maskedTheme.fontWeight.semibold : maskedTheme.fontWeight.medium};
  text-align: start;
  text-decoration: none;
  cursor: pointer;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};

  ${({ $active }) =>
    $active &&
    css`
      &::before {
        content: '';
        position: absolute;
        inset-block: 8px;
        inset-inline-start: 0;
        width: 3px;
        border-radius: ${maskedTheme.radius.full};
        background: currentColor;
      }
    `}

  &:hover {
    background: color-mix(in srgb, currentColor 10%, transparent);
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  &:disabled,
  &[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
`

export const ItemLink = styled.a<{ $active?: boolean; $collapsed?: boolean }>`
  ${itemStyles}
`

export const ItemButton = styled.button<{ $active?: boolean; $collapsed?: boolean }>`
  ${itemStyles}
`

export const ItemIcon = styled.span`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`

/** Rótulo: some visualmente quando recolhida, mas segue lido por leitores de tela. */
export const ItemLabel = styled.span<{ $hidden: boolean }>`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ $hidden }) =>
    $hidden &&
    css`
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `}
`

export const ItemBadge = styled.span`
  flex: none;
  font-size: ${maskedTheme.fontSize.xs};
`

export const ToggleButton = styled.button<{ $collapsed: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-inline-start: ${({ $collapsed }) => ($collapsed ? 'auto' : '0')};
  margin-inline-end: ${({ $collapsed }) => ($collapsed ? 'auto' : '0')};
  padding: 0;
  border: 0;
  border-radius: ${maskedTheme.radius.sm};
  background: transparent;
  color: inherit;
  cursor: pointer;

  svg {
    transition: transform 0.2s ease;
    transform: ${({ $collapsed }) => ($collapsed ? 'rotate(180deg)' : 'none')};
  }

  ${media.reducedMotion} {
    svg {
      transition: none;
    }
  }

  &:hover {
    background: color-mix(in srgb, currentColor 10%, transparent);
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`

/** Painel do Drawer mobile (portal): recebe os tokens inline. */
export const SidebarDrawerPanel = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.md};
  height: 100%;
  padding: ${maskedTheme.spacing.md};
  overflow-y: auto;
  color: var(--mc-sidebar-fg, inherit);
`
