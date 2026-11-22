'use client'

import styled, { css } from 'styled-components'
import type { MaskedDropdownMenuInternalProps } from './MaskedDropdownMenu.types'

export const MenuRoot = styled.div`
  position: relative;
  display: inline-block;
`

export const MenuTrigger = styled.button`
  font: inherit;
  color: inherit;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

const placementStyles = {
  'bottom-start': css`
    top: calc(100% + 4px);
    left: 0;
  `,
  'bottom-end': css`
    top: calc(100% + 4px);
    right: 0;
  `,
  'top-start': css`
    bottom: calc(100% + 4px);
    left: 0;
  `,
  'top-end': css`
    bottom: calc(100% + 4px);
    right: 0;
  `
} as const

export const MenuPopup = styled.div<MaskedDropdownMenuInternalProps>`
  position: absolute;
  z-index: 50;
  min-width: var(--mc-menu-min-width, 180px);
  padding: 4px;
  background: var(--mc-menu-bg);
  color: var(--mc-menu-fg);
  border: 1px solid var(--mc-menu-border);
  border-radius: var(--mc-menu-radius, 8px);
  box-shadow: var(--mc-menu-shadow, 0 8px 24px rgb(0 0 0 / 0.16));

  ${({ $placement }) => placementStyles[$placement]}
`

export const MenuItemButton = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  font: inherit;
  text-align: left;
  color: ${({ $danger }) => ($danger ? 'var(--mc-menu-danger, #b91c1c)' : 'var(--mc-menu-fg)')};
  background: none;
  border: none;
  border-radius: calc(var(--mc-menu-radius, 8px) - 4px);
  cursor: pointer;

  &[data-highlighted] {
    background: var(--mc-menu-item-hover-bg);
    color: var(--mc-menu-item-hover-fg);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const MenuItemIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
`

export const MenuItemShortcut = styled.span`
  margin-left: auto;
  font-size: 0.75em;
  color: var(--mc-menu-muted);
`

export const MenuSeparatorLine = styled.div`
  height: 1px;
  margin: 4px -4px;
  background: var(--mc-menu-border);
`
