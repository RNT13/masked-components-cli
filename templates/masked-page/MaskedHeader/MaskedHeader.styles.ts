import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedHeaderInternalProps } from './MaskedHeader.types'

export const MaskedHeaderRoot = styled.header<Pick<MaskedHeaderInternalProps, '$variant'>>`
  box-sizing: border-box;
  width: 100%;
  color: var(--mc-header-fg, inherit);
  background: var(--mc-header-bg, transparent);
  border-bottom: 1px solid var(--mc-header-border, ${maskedTheme.colors.baseGray.light40});

  ${({ $variant }) =>
    ($variant === 'sticky' || $variant === 'blur') &&
    css`
      position: sticky;
      top: 0;
      z-index: ${maskedTheme.zIndex.sticky};
    `}

  ${({ $variant }) =>
    $variant === 'blur' &&
    css`
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    `}
`

export const HeaderBar = styled.div<Pick<MaskedHeaderInternalProps, '$contained'>>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.lg};
  min-height: var(--mc-header-height, 64px);
  width: 100%;
  padding-inline: ${maskedTheme.spacing.lg};

  ${({ $contained }) =>
    $contained &&
    css`
      max-width: 1120px;
      margin-inline: auto;
    `}

  ${media.mobile} {
    padding-inline: ${maskedTheme.spacing.md};
  }
`

export const HeaderBrand = styled.div`
  display: flex;
  align-items: center;
  flex: none;
  font-weight: ${maskedTheme.fontWeight.bold};
`

/** Navegação e ações do desktop: somem abaixo do breakpoint do menu. */
export const HeaderNav = styled.nav<Pick<MaskedHeaderInternalProps, '$breakpoint'>>`
  display: flex;
  flex: 1;
  align-items: center;
  gap: ${maskedTheme.spacing.md};
  min-width: 0;

  ${({ $breakpoint }) => media[$breakpoint]} {
    display: none;
  }
`

export const HeaderActions = styled.div<Pick<MaskedHeaderInternalProps, '$breakpoint'>>`
  display: flex;
  align-items: center;
  flex: none;
  gap: ${maskedTheme.spacing.sm};
  margin-inline-start: auto;

  ${({ $breakpoint }) => media[$breakpoint]} {
    display: none;
  }
`

export const NavList = styled.ul<{ $vertical?: boolean }>`
  display: flex;
  flex-direction: ${({ $vertical }) => ($vertical ? 'column' : 'row')};
  align-items: ${({ $vertical }) => ($vertical ? 'stretch' : 'center')};
  gap: ${({ $vertical }) => ($vertical ? maskedTheme.spacing.xs : maskedTheme.spacing.sm)};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const NavLinkItem = styled.a<{ $active?: boolean; $menu?: boolean }>`
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: ${maskedTheme.spacing.xs} ${maskedTheme.spacing.md};
  border-radius: ${maskedTheme.radius.sm};
  color: ${({ $menu }) => ($menu ? 'var(--mc-header-menu-fg, inherit)' : 'inherit')};
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${({ $active }) =>
    $active ? maskedTheme.fontWeight.semibold : maskedTheme.fontWeight.medium};
  text-decoration: none;
  background: ${({ $active }) =>
    $active ? 'color-mix(in srgb, currentColor 14%, transparent)' : 'transparent'};

  &:hover {
    background: color-mix(in srgb, currentColor 10%, transparent);
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`

/** Botão hambúrguer: só aparece abaixo do breakpoint do menu. */
export const MenuButton = styled.button<Pick<MaskedHeaderInternalProps, '$breakpoint'>>`
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-inline-start: auto;
  padding: 0;
  border: 0;
  border-radius: ${maskedTheme.radius.sm};
  background: transparent;
  color: inherit;
  cursor: pointer;

  ${({ $breakpoint }) => media[$breakpoint]} {
    display: inline-flex;
  }

  &:hover {
    background: color-mix(in srgb, currentColor 10%, transparent);
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`

/** Botão de fechar dentro do painel do Drawer (sempre visível). */
export const MenuCloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: ${maskedTheme.radius.sm};
  background: transparent;
  color: inherit;
  cursor: pointer;

  &:hover {
    background: color-mix(in srgb, currentColor 10%, transparent);
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`

/** Conteúdo do painel do Drawer (portal): recebe os tokens inline. */
export const MenuPanel = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.lg};
  height: 100%;
  padding: ${maskedTheme.spacing.md};
  color: var(--mc-header-menu-fg, inherit);
`

export const MenuPanelTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${maskedTheme.spacing.md};
  font-weight: ${maskedTheme.fontWeight.bold};
`

export const MenuActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.sm};
  margin-top: auto;
`
