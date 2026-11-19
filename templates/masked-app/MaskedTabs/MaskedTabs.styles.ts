import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedTabsInternalProps } from './MaskedTabs.types'

export const MaskedTabsRoot = styled.div<Pick<MaskedTabsInternalProps, '$variant'>>`
  display: flex;
  flex-direction: ${({ $variant }) => ($variant === 'vertical' ? 'row' : 'column')};
  gap: ${maskedTheme.spacing.md};
  min-width: 0;

  ${media.mobile} {
    flex-direction: column;
  }
`

export const TabList = styled.div<Pick<MaskedTabsInternalProps, '$variant'>>`
  display: flex;
  flex: none;
  gap: ${maskedTheme.spacing['2xs']};
  max-width: 100%;
  overflow-x: auto;

  ${({ $variant }) =>
    $variant === 'line' &&
    css`
      border-bottom: 1px solid var(--mc-tabs-border, ${maskedTheme.colors.baseGray.light40});
    `}

  ${({ $variant }) =>
    $variant === 'enclosed' &&
    css`
      border-bottom: 1px solid var(--mc-tabs-border, ${maskedTheme.colors.baseGray.light40});
    `}

  ${({ $variant }) =>
    $variant === 'pills' &&
    css`
      gap: ${maskedTheme.spacing.xs};
    `}

  ${({ $variant }) =>
    $variant === 'vertical' &&
    css`
      flex-direction: column;
      min-width: 12rem;
      overflow-x: visible;
      border-inline-end: 1px solid var(--mc-tabs-border, ${maskedTheme.colors.baseGray.light40});
      padding-inline-end: ${maskedTheme.spacing.sm};

      ${media.mobile} {
        flex-direction: row;
        min-width: 0;
        overflow-x: auto;
        border-inline-end: 0;
        padding-inline-end: 0;
        border-bottom: 1px solid var(--mc-tabs-border, ${maskedTheme.colors.baseGray.light40});
      }
    `}
`

export const TabButton = styled.button<MaskedTabsInternalProps>`
  display: inline-flex;
  align-items: center;
  gap: ${maskedTheme.spacing.xs};
  flex: none;
  min-height: 44px;
  padding: ${maskedTheme.spacing.xs} ${maskedTheme.spacing.md};
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${({ $active }) => ($active ? maskedTheme.fontWeight.semibold : maskedTheme.fontWeight.medium)};
  white-space: nowrap;
  cursor: pointer;
  opacity: ${({ $active }) => ($active ? 1 : 0.78)};

  &:hover:not(:disabled) {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -2px;
    border-radius: ${maskedTheme.radius.sm};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  ${({ $variant, $active }) =>
    $variant === 'line' &&
    css`
      margin-bottom: -1px;
      border-bottom: 2px solid ${$active ? 'var(--mc-tabs-accent, currentColor)' : 'transparent'};
    `}

  ${({ $variant, $active }) =>
    $variant === 'pills' &&
    css`
      border-radius: ${maskedTheme.radius.full};
      background: ${$active ? 'var(--mc-tabs-accent, currentColor)' : 'transparent'};
      color: ${$active ? 'var(--mc-tabs-accent-fg, inherit)' : 'inherit'};
      opacity: 1;
    `}

  ${({ $variant, $active }) =>
    $variant === 'enclosed' &&
    css`
      margin-bottom: -1px;
      border: 1px solid ${$active ? 'var(--mc-tabs-border, currentColor)' : 'transparent'};
      border-bottom-color: ${$active ? 'var(--mc-tabs-surface, transparent)' : 'transparent'};
      border-radius: ${maskedTheme.radius.md} ${maskedTheme.radius.md} 0 0;
      background: ${$active ? 'var(--mc-tabs-surface, transparent)' : 'transparent'};
    `}

  ${({ $variant, $active }) =>
    $variant === 'vertical' &&
    css`
      justify-content: flex-start;
      border-inline-start: 3px solid
        ${$active ? 'var(--mc-tabs-accent, currentColor)' : 'transparent'};
      border-radius: ${maskedTheme.radius.sm};
    `}
`

export const TabPanel = styled.div`
  flex: 1;
  min-width: 0;

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
    border-radius: ${maskedTheme.radius.sm};
  }
`
