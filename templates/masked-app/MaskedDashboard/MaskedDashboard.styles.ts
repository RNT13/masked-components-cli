import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedDashboardInternalProps } from './MaskedDashboard.types'

export const Topbar = styled.header`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.md};
  min-height: 64px;
  padding-inline: ${maskedTheme.spacing.lg};
  color: var(--mc-dashboard-topbar-fg, inherit);
  background: var(--mc-dashboard-topbar-bg, transparent);
  border-bottom: 1px solid var(--mc-dashboard-topbar-border, ${maskedTheme.colors.baseGray.light40});
  position: sticky;
  top: 0;
  z-index: ${maskedTheme.zIndex.sticky};

  ${media.mobile} {
    padding-inline: ${maskedTheme.spacing.md};
  }
`

/** Botão que abre a sidebar no mobile: só aparece abaixo do tablet. */
export const MenuToggle = styled.button`
  display: none;
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

  ${media.tablet} {
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

/** Marca na barra superior: só aparece quando a sidebar está escondida. */
export const TopbarBrand = styled.div`
  display: none;
  font-weight: ${maskedTheme.fontWeight.bold};

  ${media.tablet} {
    display: flex;
    align-items: center;
  }
`

export const TopbarSlot = styled.div`
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.sm};
  margin-inline-start: auto;
`

export const DashboardContent = styled.div<MaskedDashboardInternalProps>`
  box-sizing: border-box;
  width: 100%;
  min-height: 100%;
  background: var(--mc-dashboard-content-bg, transparent);
  padding-block: ${maskedTheme.spacing.xl};

  ${media.mobile} {
    padding-block: ${maskedTheme.spacing.lg};
  }
`

export const DashboardInner = styled.div<Pick<MaskedDashboardInternalProps, '$width'>>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.lg};
  width: 100%;
  margin-inline: auto;
  padding-inline: ${maskedTheme.spacing.lg};

  ${({ $width }) =>
    $width === 'default'
      ? css`
          max-width: 1120px;
        `
      : $width === 'wide'
        ? css`
            max-width: 1440px;
          `
        : css`
            max-width: none;
          `}

  ${media.mobile} {
    padding-inline: ${maskedTheme.spacing.md};
  }
`
