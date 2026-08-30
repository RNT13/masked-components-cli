/* ============================================================
 * TIME
 * ============================================================ */

import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import styled from 'styled-components'

export const TimeTrigger = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  gap: ${maskedTheme.spacing.xs};

  &:hover:not(:disabled) {
    border-color: ${maskedTheme.colors.baseBlue.base};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.error {
    border-color: ${maskedTheme.colors.baseRed.base};
  }
`

export const TimeTriggerValue = styled.span<{ $isPlaceholder?: boolean }>`
  font-weight: 800;
  color: ${({ $isPlaceholder }) => ($isPlaceholder ? maskedTheme.colors.baseBlue.light08 : maskedTheme.colors.baseBlue.base)};
`

export const TimeDropdown = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: ${maskedTheme.radius.lg};
  padding: ${maskedTheme.spacing.xs};
  overflow: hidden;
  background: ${maskedTheme.colors.baseBlue.light30};
  border: 2px solid ${maskedTheme.colors.baseBlue.base};
  z-index: 999999;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);

  animation: timeFade 0.18s ease;

  @keyframes timeFade {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export const TimeColumnsRow = styled.div`
  display: flex;
  gap: 4px;
  padding: 4px 4px 0 4px;
`

export const TimeColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 64px;
  max-height: 220px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: ${maskedTheme.colors.baseBlue.light20} transparent;
`

export const TimeColumnLabel = styled.span`
  padding: 6px 0 8px 0;
  text-align: center;
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.bold};
  color: ${maskedTheme.colors.baseBlue.light20};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

export const TimeOption = styled.button<{ $selected?: boolean }>`
  width: 100%;
  padding: 8px 0;
  border-radius: 14px;
  margin-bottom: 4px;
  background: ${({ $selected }) => ($selected ? maskedTheme.colors.baseBlue.dark20 : maskedTheme.colors.baseBlue.light02)};
  color: ${({ $selected }) => ($selected ? maskedTheme.colors.baseBlue.light50 : maskedTheme.colors.baseBlue.dark40)};
  border: 2px solid ${({ $selected }) => ($selected ? maskedTheme.colors.baseBlue.light02 : maskedTheme.colors.baseBlue.dark20)};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  transition: ${maskedTheme.transition.default};

  &:hover {
    background: ${maskedTheme.colors.baseBlue.dark08};
    color: ${maskedTheme.colors.baseBlue.light50};
    border-color: ${maskedTheme.colors.baseBlue.dark20};
  }
`

export const TimeSeparator = styled.span`
  align-self: center;
  padding-top: 22px;
  font-size: 1.4rem;
  font-weight: 900;
  color: ${maskedTheme.colors.baseBlue.light20};
`

export const TimeDropdownFooter = styled.div`
  padding: 8px;
`

export const TimeClearButton = styled.button`
  width: 100%;
  padding: 8px;
  border-radius: 14px;
  background: transparent;
  border: 2px solid ${maskedTheme.colors.baseRed.light};
  color: ${maskedTheme.colors.baseRed.light};
  font-weight: ${maskedTheme.fontWeight.bold};
  font-size: ${maskedTheme.fontSize.sm};
  cursor: pointer;
  transition: ${maskedTheme.transition.default};

  &:hover {
    border-color: ${maskedTheme.colors.baseRed.base};
    background: ${maskedTheme.colors.baseRed.light02};
    color: ${maskedTheme.colors.baseRed.base};
  }
`
