import styled, { css } from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedPaginationInternalProps } from './MaskedPagination.types'

export const MaskedPaginationRoot = styled.nav`
  font-size: ${maskedTheme.fontSize.md};
`

export const PaginationList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${maskedTheme.spacing.xs};
  margin: 0;
  padding: 0;
  list-style: none;
`

const controlStyles = css<MaskedPaginationInternalProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 44px;
  min-height: 44px;
  padding: 0 ${maskedTheme.spacing.sm};
  border: 1px solid
    ${({ $current }) => ($current ? 'var(--mc-pagination-accent, currentColor)' : 'transparent')};
  border-radius: ${maskedTheme.radius.md};
  background: ${({ $current }) => ($current ? 'var(--mc-pagination-accent, currentColor)' : 'transparent')};
  color: ${({ $current }) => ($current ? 'var(--mc-pagination-accent-fg, inherit)' : 'inherit')};
  font: inherit;
  font-weight: ${({ $current }) => ($current ? maskedTheme.fontWeight.semibold : maskedTheme.fontWeight.medium)};
  text-decoration: none;
  cursor: pointer;

  &:hover:not(:disabled):not([aria-disabled='true']) {
    border-color: var(--mc-pagination-border, currentColor);
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  &:disabled,
  &[aria-disabled='true'] {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
`

export const PageControl = styled.button<MaskedPaginationInternalProps>`
  ${controlStyles}
`

export const PageLink = styled.a<MaskedPaginationInternalProps>`
  ${controlStyles}
`

export const Ellipsis = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  opacity: 0.7;
`

export const PageStatus = styled.li`
  padding: 0 ${maskedTheme.spacing.md};
  font-weight: ${maskedTheme.fontWeight.medium};
`
