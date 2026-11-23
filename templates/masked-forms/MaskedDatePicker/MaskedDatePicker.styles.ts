import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedDatePickerInternalProps } from './MaskedDatePicker.types'

export const MaskedDatePickerRoot = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.xs};
  max-width: 100%;
`

export const FieldLabel = styled.span`
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${maskedTheme.fontWeight.medium};
`

export const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: ${maskedTheme.spacing.md};
  min-width: 14rem;
  min-height: 44px;
  padding: ${maskedTheme.spacing.xs} ${maskedTheme.spacing.md};
  border: 1px solid var(--mc-date-picker-border, ${maskedTheme.colors.baseGray.light40});
  border-radius: ${maskedTheme.radius.md};
  background: var(--mc-date-picker-bg, transparent);
  color: var(--mc-date-picker-fg, inherit);
  font: inherit;
  font-size: ${maskedTheme.fontSize.md};
  text-align: start;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const Panel = styled.div<MaskedDatePickerInternalProps>`
  box-sizing: border-box;
  width: 19rem;
  max-width: calc(100vw - ${maskedTheme.spacing.lg});
  padding: ${maskedTheme.spacing.md};
  border: 1px solid var(--mc-date-picker-border, ${maskedTheme.colors.baseGray.light40});
  border-radius: ${maskedTheme.radius.lg};
  background: var(--mc-date-picker-bg, transparent);
  color: var(--mc-date-picker-fg, inherit);

  ${({ $inline }) =>
    !$inline &&
    css`
      position: absolute;
      top: calc(100% + 4px);
      inset-inline-start: 0;
      z-index: ${maskedTheme.zIndex.popover};
      box-shadow: ${maskedTheme.boxShadow.lg()};
    `}

  ${media.mobile} {
    width: min(19rem, calc(100vw - ${maskedTheme.spacing.lg}));
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${maskedTheme.spacing.sm};
  margin-bottom: ${maskedTheme.spacing.sm};
`

export const MonthTitle = styled.div`
  font-weight: ${maskedTheme.fontWeight.semibold};
  text-transform: capitalize;
`

export const NavButton = styled.button`
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
  font-size: ${maskedTheme.fontSize.xl};
  cursor: pointer;

  &:hover {
    background: color-mix(in srgb, currentColor 10%, transparent);
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`

export const Grid = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th {
    padding-bottom: ${maskedTheme.spacing.xs};
    font-size: ${maskedTheme.fontSize.xs};
    font-weight: ${maskedTheme.fontWeight.medium};
    text-align: center;
    opacity: 0.75;
  }

  td {
    padding: 1px;
    text-align: center;
  }
`

export const DayButton = styled.button<MaskedDatePickerInternalProps>`
  width: 100%;
  min-height: 40px;
  padding: 0;
  border: 1px solid
    ${({ $today, $selected }) => ($today && !$selected ? 'currentColor' : 'transparent')};
  border-radius: ${maskedTheme.radius.md};
  background: ${({ $selected }) => ($selected ? 'var(--mc-date-picker-accent, currentColor)' : 'transparent')};
  color: ${({ $selected }) => ($selected ? 'var(--mc-date-picker-accent-fg, inherit)' : 'inherit')};
  font: inherit;
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${({ $selected }) => ($selected ? maskedTheme.fontWeight.semibold : maskedTheme.fontWeight.normal)};
  font-variant-numeric: tabular-nums;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};

  &:hover {
    background: ${({ $selected, $disabled }) =>
      $selected || $disabled ? undefined : 'color-mix(in srgb, currentColor 10%, transparent)'};
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 1px;
  }

  ${media.mobile} {
    min-height: 44px;
  }
`

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${maskedTheme.spacing.sm};
  margin-top: ${maskedTheme.spacing.sm};
`

export const TextButton = styled.button`
  min-height: 44px;
  padding: 0 ${maskedTheme.spacing.sm};
  border: 0;
  border-radius: ${maskedTheme.radius.sm};
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.medium};
  text-decoration: underline;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`
