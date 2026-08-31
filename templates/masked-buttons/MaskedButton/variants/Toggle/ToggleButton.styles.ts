import { transitions } from '@/styles/MaskedAnimations/animations/transitions'  
import { css, styled } from 'styled-components'  
import { BaseButtonContainer } from '../../Base/BaseButton.styles'  
  
type Props = {  
  $isActive?: boolean  
}  
  
const activeStyles = css`  
  color: ${({ theme }) => theme.colors.baseBlue.light20};  
  background-color: ${({ theme }) => theme.colors.baseBlue.dark02};  
  border: 2px solid ${({ theme }) => theme.colors.baseBlue.light20};  
  
  box-shadow: 0px 0px 10px 1px ${({ theme }) => theme.colors.baseBlue.base};  
  
  svg {  
    color: inherit;  
  }  
  
  &:hover {  
    color: ${({ theme }) => theme.colors.baseBlue.dark20};  
    background-color: ${({ theme }) => theme.colors.baseBlue.light08};  
    border-color: ${({ theme }) => theme.colors.baseBlue.dark08};  
  }  
`  
  
export const ToggleWrapper = styled.div<{  
  $position: 'left' | 'right' | 'center'  
}>`  
  display: flex;  
  align-items: center;  
  justify-content: ${({ $position }) => $position};  
  gap: 8px;  
`  
  
export const ToggleLabel = styled.span`  
  font-size: 14px;  
  font-weight: 600;  
  color: ${({ theme }) => theme.colors.baseBlack.light40};  
  user-select: none;  
`  
  
export const ToggleButtonContainer = styled(BaseButtonContainer)<Props>`  
  background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.baseBlue.light30 : theme.colors.baseBlack.light20)};  
  
  border: 2px solid ${({ theme, $isActive }) => ($isActive ? theme.colors.baseBlue.base : theme.colors.baseBlack.base)};  
  
  width: 44px;  
  height: 24px;  
  border-radius: 999px;  
  position: relative;  
  padding: 0;  
  
  ${transitions.slow}  
  
  &::before {  
    content: '';  
    position: absolute;  
    top: 50%;  
    left: 2px;  
  
    transform: ${({ $isActive }) => ($isActive ? 'translate(20px, -50%)' : 'translate(0, -50%)')};  
  
    width: 18px;  
    height: 18px;  
    border-radius: 50%;  
  
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.baseBlue.dark : theme.colors.baseBlack.base)};  
  
    ${transitions.slow}  
  }  
  
  &:hover:not(:disabled) {  
    transform: scale(1.05);  
  
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.baseBlue.light04 : theme.colors.baseBlack.light20)};  
  }  
  
  &:active:not(:disabled) {  
    transform: scale(0.98);  
  }  
  
  ${({ $isActive }) => $isActive && activeStyles}  
`