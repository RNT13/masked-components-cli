/* ============================================================
 * TIME
 * Cores via tokens --mc-input-* (colorTheme/tokens), com fallback
 * na paleta do tema ativo — mesmo padrão do SelectInput.
 * ============================================================ */

import styled from 'styled-components'

export const TimeTrigger = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  gap: ${({ theme }) => theme.spacing.xs};

  &:hover:not(:disabled) {
    border-color: var(--mc-input-border-hover, ${({ theme }) => theme.colors.baseBlue.base});
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.error {
    border-color: var(--mc-input-error-border, ${({ theme }) => theme.colors.baseRed.base});
  }
`

export const TimeTriggerValue = styled.span<{ $isPlaceholder?: boolean }>`
  font-weight: 800;
  color: ${({ $isPlaceholder, theme }) =>
    $isPlaceholder
      ? `var(--mc-input-placeholder, ${theme.colors.baseBlue.light08})`
      : `var(--mc-input-fg, ${theme.colors.baseBlue.base})`};
`

export const TimeDropdown = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.xs};
  overflow: hidden;
  background: var(--mc-input-bg, ${({ theme }) => theme.colors.baseBlue.light30});
  border: 2px solid var(--mc-input-border-hover, ${({ theme }) => theme.colors.baseBlue.base});
  z-index: ${({ theme }) => theme.zIndex.tooltip};
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
  scrollbar-color: var(--mc-input-border, ${({ theme }) => theme.colors.baseBlue.light20}) transparent;
`

export const TimeColumnLabel = styled.span`
  padding: 6px 0 8px 0;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: var(--mc-input-label-fg, ${({ theme }) => theme.colors.baseBlue.dark20});
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

export const TimeOption = styled.button<{ $selected?: boolean }>`
  width: 100%;
  padding: 8px 0;
  border-radius: 14px;
  margin-bottom: 4px;
  background: ${({ $selected, theme }) =>
    $selected
      ? `var(--mc-input-icon-fg, ${theme.colors.baseBlue.dark20})`
      : theme.colors.baseBlue.light02};
  color: ${({ $selected, theme }) =>
    $selected
      ? theme.colors.baseBlue.light50
      : `var(--mc-input-label-fg, ${theme.colors.baseBlue.dark40})`};
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected
        ? theme.colors.baseBlue.light02
        : `var(--mc-input-border, ${theme.colors.baseBlue.dark20})`};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  transition: ${({ theme }) => theme.transition.default};

  &:hover {
    background: var(--mc-input-icon-fg, ${({ theme }) => theme.colors.baseBlue.dark08});
    color: ${({ theme }) => theme.colors.baseBlue.light50};
    border-color: var(--mc-input-border, ${({ theme }) => theme.colors.baseBlue.dark20});
  }
`

export const TimeSeparator = styled.span`
  align-self: center;
  padding-top: 22px;
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--mc-input-label-fg, ${({ theme }) => theme.colors.baseBlue.dark20});
`

export const TimeDropdownFooter = styled.div`
  padding: 8px;
`

export const TimeClearButton = styled.button`
  width: 100%;
  padding: 8px;
  border-radius: 14px;
  background: transparent;
  border: 2px solid var(--mc-input-error-border, ${({ theme }) => theme.colors.baseRed.dark});
  color: var(--mc-input-error-border, ${({ theme }) => theme.colors.baseRed.dark});
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.default};

  &:hover {
    border-color: var(--mc-input-error-border, ${({ theme }) => theme.colors.baseRed.base});
    background: ${({ theme }) => theme.colors.baseRed.light02};
    color: var(--mc-input-error-border, ${({ theme }) => theme.colors.baseRed.base});
  }
`