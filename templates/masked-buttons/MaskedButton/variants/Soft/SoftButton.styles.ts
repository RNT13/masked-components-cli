import styled, { css } from 'styled-components'  
import { BaseButton } from '../../Base/BaseButton'  
import { ButtonPosition } from '../../MaskedButton.types'  
  
type props = {  
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
  
const activeStyles = css`  
  color: ${({ theme }) => theme.colors.baseBlue.light20};  
  background-color: ${({ theme }) => theme.colors.baseBlue.dark02};  
  border: 2px solid ${({ theme }) => theme.colors.baseBlue.base};  
`  
  
const errorStyles = css`  
  background-color: ${({ theme }) => theme.colors.baseRed.light08};  
  color: ${({ theme }) => theme.colors.baseRed.light30};  
  border-color: ${({ theme }) => theme.colors.baseRed.light08};  
  
  &:hover {  
    background-color: ${({ theme }) => theme.colors.baseRed.dark};  
    color: ${({ theme }) => theme.colors.baseRed.dark30};  
    border-color: ${({ theme }) => theme.colors.baseRed.dark30};  
  }  
`  
  
export const SoftButtonWrapper = styled.div<props>`  
  display: flex;  
  align-items: center;  
  justify-content: ${({ $position }) => $position};  
`  
  
export const SoftButtonContainer = styled(BaseButton)<props>`  
  color: ${({ theme }) => theme.colors.baseBlue.light20};  
  background-color: ${({ theme }) => theme.colors.baseBlue.dark02};  
  border: 2px solid transparent;  
  
  &:hover {  
    background-color: ${({ theme }) => theme.colors.baseBlue.dark08};  
    color: ${({ theme }) => theme.colors.baseBlue.light30};  
    border-color: ${({ theme }) => theme.colors.baseBlue.dark08};  
  }  
  
  ${({ $isActive }) => $isActive && activeStyles}  
  ${({ $isError }) => $isError && errorStyles}  
  ${({ $isDisabled }) => $isDisabled && disabledStyles}  
`