import styled, { css } from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedTableInternalProps } from './MaskedTable.types'

export const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.sm};
  min-width: 0;
  max-width: 100%;
`

export const TableToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${maskedTheme.spacing.sm};
`

export const ToolbarSpacer = styled.span`
  flex: 1;
`

const fieldStyles = css`
  box-sizing: border-box;
  min-height: 40px;
  padding: ${maskedTheme.spacing.xs} ${maskedTheme.spacing.sm};
  border: 1px solid var(--mc-table-border, ${maskedTheme.colors.baseGray.light40});
  border-radius: ${maskedTheme.radius.md};
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: ${maskedTheme.fontSize.sm};

  &:focus-visible {
    outline: 2px solid var(--mc-table-accent, currentColor);
    outline-offset: 1px;
  }
`

export const TableSearchInput = styled.input`
  ${fieldStyles}
  flex: 1;
  min-width: 160px;
  max-width: 320px;
`

export const TableFilterSelect = styled.select`
  ${fieldStyles}
`

export const ColumnsToggle = styled.details`
  position: relative;

  > summary {
    ${fieldStyles}
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    list-style: none;
    user-select: none;

    &::-webkit-details-marker {
      display: none;
    }
  }
`

export const ColumnsMenu = styled.div`
  position: absolute;
  inset-inline-end: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.xs};
  min-width: 180px;
  margin-top: ${maskedTheme.spacing['2xs']};
  padding: ${maskedTheme.spacing.sm};
  border: 1px solid var(--mc-table-border, ${maskedTheme.colors.baseGray.light40});
  border-radius: ${maskedTheme.radius.md};
  background: var(--mc-table-head-bg, ${maskedTheme.colors.surfaceColor});
  box-shadow: ${maskedTheme.boxShadow.md()};
`

export const ColumnsOption = styled.label`
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.sm};
  font-size: ${maskedTheme.fontSize.sm};
  cursor: pointer;
`

export const BulkBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${maskedTheme.spacing.sm};
  padding: ${maskedTheme.spacing.xs} ${maskedTheme.spacing.sm};
  border: 1px solid var(--mc-table-border, ${maskedTheme.colors.baseGray.light40});
  border-radius: ${maskedTheme.radius.md};
  background: var(--mc-table-head-bg, ${maskedTheme.colors.surfaceColor});
  font-size: ${maskedTheme.fontSize.sm};
`

export const BulkCount = styled.span`
  font-weight: ${maskedTheme.fontWeight.semibold};
`

export const TableFooter = styled.div`
  display: flex;
  justify-content: center;
`

export const SelectCell = styled.td`
  width: 44px;
  text-align: center;
`

export const SelectHeadCell = styled.th<{ $sticky?: boolean }>`
  width: 44px;
  text-align: center;
  background: var(--mc-table-head-bg, transparent);

  ${({ $sticky }) =>
    $sticky &&
    css`
      position: sticky;
      top: 0;
      z-index: 1;
    `}
`

export const RowCheckbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: var(--mc-table-accent, currentColor);
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--mc-table-accent, currentColor);
    outline-offset: 2px;
  }
`

export const TableScroller = styled.div<Pick<MaskedTableInternalProps, '$variant'>>`
  overflow: auto;
  max-width: 100%;

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
    border-radius: ${maskedTheme.radius.sm};
  }

  ${({ $variant }) =>
    $variant === 'card' &&
    css`
      border: 1px solid var(--mc-table-border, ${maskedTheme.colors.baseGray.light40});
      border-radius: ${maskedTheme.radius.lg};
      box-shadow: ${maskedTheme.boxShadow.sm()};
    `}
`

export const MaskedTableRoot = styled.table<Pick<MaskedTableInternalProps, '$variant'>>`
  width: 100%;
  border-collapse: collapse;
  font-size: ${maskedTheme.fontSize.md};

  th,
  td {
    padding: ${maskedTheme.spacing.sm} ${maskedTheme.spacing.md};
    border-bottom: 1px solid var(--mc-table-border, ${maskedTheme.colors.baseGray.light40});
    vertical-align: middle;
  }

  ${({ $variant }) =>
    $variant === 'bordered' &&
    css`
      th,
      td {
        border: 1px solid var(--mc-table-border, ${maskedTheme.colors.baseGray.light40});
      }
    `}

  ${({ $variant }) =>
    $variant === 'striped' &&
    css`
      tbody tr:nth-child(even) {
        background: var(--mc-table-stripe, transparent);
      }
    `}  
  
  ${({ $variant }) =>
    $variant === 'card' &&
    css`
      tbody tr:last-child td,
      tbody tr:last-child th {
        border-bottom: 0;
      }
    `}
`

export const TableCaption = styled.caption<{ $visible: boolean }>`
  ${({ $visible }) =>
    $visible
      ? css`
          padding: ${maskedTheme.spacing.sm} ${maskedTheme.spacing.md};
          font-weight: ${maskedTheme.fontWeight.semibold};
          text-align: start;
        `
      : css`
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

export const HeadCell = styled.th<MaskedTableInternalProps>`
  background: var(--mc-table-head-bg, transparent);
  font-weight: ${maskedTheme.fontWeight.semibold};
  text-align: ${({ $align }) => $align ?? 'start'};
  white-space: nowrap;

  ${({ $sticky }) =>
    $sticky &&
    css`
      position: sticky;
      top: 0;
      z-index: 1;
    `}
`

export const SortButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${maskedTheme.spacing.xs};
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
    border-radius: ${maskedTheme.radius.xs};
  }
`

export const SortIcon = styled.span<{ $active: boolean }>`
  color: ${({ $active }) => ($active ? 'var(--mc-table-accent, currentColor)' : 'inherit')};
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  font-size: ${maskedTheme.fontSize.xs};
`

export const BodyRow = styled.tr<MaskedTableInternalProps>`
  ${({ $selected }) =>
    $selected &&
    css`
      background: color-mix(in srgb, var(--mc-table-accent, currentColor) 10%, transparent);
    `}

  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;

      &:hover {
        background: color-mix(in srgb, currentColor 6%, transparent);
      }

      &:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: -2px;
      }
    `}
`

export const BodyCell = styled.td<MaskedTableInternalProps>`
  text-align: ${({ $align }) => $align ?? 'start'};
`

export const BodyRowHeader = styled.th<MaskedTableInternalProps>`
  font-weight: ${maskedTheme.fontWeight.medium};
  text-align: ${({ $align }) => $align ?? 'start'};
`

export const EmptyCell = styled.td`
  padding: ${maskedTheme.spacing['2xl']} ${maskedTheme.spacing.md};
  text-align: center;
  opacity: 0.8;
`
