import styled, { css } from 'styled-components'
import { BaseButton } from '../../Base/BaseButton'
import { ButtonPosition } from '../../MaskedButton.types'

type Props = {
  $isActive?: boolean
  $isError?: boolean
  $isDisabled?: boolean
  $position?: ButtonPosition
}

const disabledStyles = css`
  color: ${({ theme }) => theme.colors.baseBlack.light40};
  background-color: transparent;
  &:hover {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.baseBlack.light20};
    border-color: transparent;
  }
`

const errorStyles = css`
  background-color: var(--mc-btn-danger-bg, ${({ theme }) => theme.colors.baseRed.light08});
  color: var(--mc-btn-danger-fg, ${({ theme }) => theme.colors.baseRed.light30});
  border-color: var(--mc-btn-danger-border, ${({ theme }) => theme.colors.baseRed.light08});
`

/* o wrapper recebe as CSS vars --mc-btn-*, então o menu também as enxerga */
export const SplitButtonWrapper = styled.div<Props>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: ${({ $position }) => $position};
`

export const SplitGroup = styled.div`
  display: inline-flex;
  align-items: stretch;
`

/* lado esquerdo: ação principal — raio só à esquerda */
export const SplitMainButton = styled(BaseButton)<Props>`
  color: var(--mc-btn-fg, ${({ theme }) => theme.colors.baseBlue.dark20});
  background-color: var(--mc-btn-bg, ${({ theme }) => theme.colors.baseBlue.light20});
  border: 2px solid var(--mc-btn-border, ${({ theme }) => theme.colors.baseBlue.dark20});
  border-right-width: 1px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;

  &:hover {
    background-color: var(--mc-btn-bg-hover, ${({ theme }) => theme.colors.baseBlue.light20});
    color: var(--mc-btn-fg-hover, ${({ theme }) => theme.colors.baseBlue.base});
    border-color: var(--mc-btn-border-hover, ${({ theme }) => theme.colors.baseBlue.base});
  }

  ${({ $isError }) => $isError && errorStyles}
  ${({ $isDisabled }) => $isDisabled && disabledStyles}
`

/* lado direito: seta do menu — raio só à direita (igual ao do botão base) */
export const SplitMenuButton = styled.button<Props>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  color: var(--mc-btn-fg, ${({ theme }) => theme.colors.baseBlue.dark20});
  background-color: var(--mc-btn-bg, ${({ theme }) => theme.colors.baseBlue.light20});
  border: 2px solid var(--mc-btn-border, ${({ theme }) => theme.colors.baseBlue.dark20});
  border-left-width: 1px;
  border-top-right-radius: var(--mc-btn-radius, 18px);
  border-bottom-right-radius: var(--mc-btn-radius, 18px);
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover:not(:disabled) {
    background-color: var(--mc-btn-bg-hover, ${({ theme }) => theme.colors.baseBlue.light20});
    color: var(--mc-btn-fg-hover, ${({ theme }) => theme.colors.baseBlue.base});
  }

  &:focus-visible {
    outline: 2px solid var(--mc-btn-ring-focus, ${({ theme }) => theme.colors.baseBlue.base});
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${({ $isError }) => $isError && errorStyles}
  ${({ $isDisabled }) => $isDisabled && disabledStyles}
`

export const ChevronIcon = styled.span<{ $open?: boolean }>`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid currentColor;
  transition: transform 0.15s ease;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'none')};
`

export const SplitMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 260px;
  max-width: min(340px, 90vw);
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.surfaceColor ?? theme.colors.baseBlack.light08};
  border: 1px solid ${({ theme }) => theme.colors.borderColor ?? theme.colors.baseBlack.light20};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
`

export const SplitMenuItem = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  text-align: left;
  font-size: ${({ theme }) => theme.fontSize.sm};
  background: ${({ $selected, theme }) => ($selected ? `var(--mc-btn-bg, ${theme.colors.baseBlue.base})` : 'transparent')};
  color: ${({ $selected, theme }) =>
    $selected ? `var(--mc-btn-fg, ${theme.colors.baseBlue.light50})` : (theme.colors.textColor ?? theme.colors.baseBlack.light40)};

  &:hover,
  &:focus-visible {
    background: ${({ $selected, theme }) =>
      $selected ? `var(--mc-btn-bg-hover, ${theme.colors.baseBlue.base})` : (theme.colors.tertiaryColor ?? theme.colors.baseBlack.light08)};
    outline: none;
  }

  &:focus-visible {
    box-shadow: inset 0 0 0 2px var(--mc-btn-ring-focus, ${({ theme }) => theme.colors.baseBlue.base});
  }
`

export const SplitMenuCheck = styled.span`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 20px;

  svg {
    width: 14px;
    height: 14px;
  }
`

export const SplitMenuText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const SplitMenuItemLabel = styled.span`
  font-weight: 600;
`

export const SplitMenuItemDescription = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  opacity: 0.8;
`
