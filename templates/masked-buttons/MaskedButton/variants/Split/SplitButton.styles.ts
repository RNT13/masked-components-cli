import styled, { css } from 'styled-components'  
import { BaseButton } from '../../Base/BaseButton'  
import { ButtonPosition } from '../../MaskedButton.types'  
import { resolveButtonTokens } from '../../buttonTokens'  
import type { BaseButtonProps } from '../../MaskedButton.types'  
  
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
  
/* lado esquerdo: ação principal — border-radius só à esquerda */  
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
  
/* lado direito: trigger do menu — border-radius só à direita.  
   Não usa BaseButton (não precisa de label/loading); resolve os mesmos tokens. */  
export const SplitMenuButton = styled.button<  
  Props & Pick<BaseButtonProps, 'colorTheme' | 'tokens' | 'size' | 'state'>  
>`  
  display: inline-flex;  
  align-items: center;  
  justify-content: center;  
  padding: 0 ${({ theme }) => theme.spacing.sm};  
  cursor: pointer;  
  color: var(--mc-btn-fg, ${({ theme }) => theme.colors.baseBlue.dark20});  
  background-color: var(--mc-btn-bg, ${({ theme }) => theme.colors.baseBlue.light20});  
  border: 2px solid var(--mc-btn-border, ${({ theme }) => theme.colors.baseBlue.dark20});  
  border-left-width: 1px;  
  border-top-right-radius: var(--mc-btn-radius, ${({ theme }) => theme.radius.md});  
  border-bottom-right-radius: var(--mc-btn-radius, ${({ theme }) => theme.radius.md});  
  transition: background-color 0.15s ease, color 0.15s ease;  
  
  ${({ colorTheme, tokens }) => resolveButtonTokens({ colorTheme, tokens })}  
  
  &:hover:not(:disabled) {  
    background-color: var(--mc-btn-bg-hover, ${({ theme }) => theme.colors.baseBlue.light20});  
    color: var(--mc-btn-fg-hover, ${({ theme }) => theme.colors.baseBlue.base});  
  }  
  
  &:focus-visible {  
    outline: 2px solid var(--mc-btn-ring, ${({ theme }) => theme.colors.baseBlue.base});  
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
  top: calc(100% + 4px);  
  right: 0;  
  min-width: 200px;  
  z-index: ${({ theme }) => theme.zIndex.dropdown};  
  display: flex;  
  flex-direction: column;  
  padding: ${({ theme }) => theme.spacing.xs};  
  background: ${({ theme }) => theme.colors.surfaceColor ?? theme.colors.baseBlack.light08};  
  border: 1px solid ${({ theme }) => theme.colors.borderColor ?? theme.colors.baseBlack.light20};  
  border-radius: ${({ theme }) => theme.radius.md};  
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);  
`  
  
export const SplitMenuItem = styled.button`  
  display: flex;  
  flex-direction: column;  
  gap: 2px;  
  width: 100%;  
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};  
  background: transparent;  
  border: none;  
  border-radius: ${({ theme }) => theme.radius.sm};  
  cursor: pointer;  
  text-align: left;  
  color: ${({ theme }) => theme.colors.textColor ?? theme.colors.baseBlack.light40};  
  font-size: ${({ theme }) => theme.fontSize.sm};  
  
  &:hover {  
    background: ${({ theme }) => theme.colors.baseBlack.light08};  
  }  
  
  &:focus-visible {  
    outline: 2px solid var(--mc-btn-ring, ${({ theme }) => theme.colors.baseBlue.base});  
    outline-offset: -2px;  
  }  
`  
  
export const SplitMenuItemLabel = styled.span`  
  font-weight: 500;  
`  
  
export const SplitMenuItemDescription = styled.span`  
  font-size: ${({ theme }) => theme.fontSize.xs};  
  color: ${({ theme }) => theme.colors.textMuted ?? theme.colors.baseGray.base};  
`