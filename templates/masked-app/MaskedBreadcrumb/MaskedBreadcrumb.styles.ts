import styled from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'

export const MaskedBreadcrumbRoot = styled.nav`
  color: var(--mc-breadcrumb-muted, inherit);
  font-size: ${maskedTheme.fontSize.sm};
`

export const BreadcrumbList = styled.ol<{ $compact: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ $compact }) => ($compact ? maskedTheme.spacing.xs : maskedTheme.spacing.sm)};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const BreadcrumbItemEl = styled.li`
  display: inline-flex;
  align-items: center;
  gap: inherit;
  min-width: 0;
`

export const BreadcrumbLink = styled.a`
  color: inherit;
  text-decoration: none;

  &:hover {
    color: var(--mc-breadcrumb-fg, inherit);
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
    border-radius: ${maskedTheme.radius.xs};
  }
`

export const BreadcrumbCurrent = styled.span`
  color: var(--mc-breadcrumb-fg, inherit);
  font-weight: ${maskedTheme.fontWeight.medium};
`

export const BreadcrumbSeparator = styled.span`
  opacity: 0.7;
`
