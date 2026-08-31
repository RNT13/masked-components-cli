'use client'  
  
import { ButtonVariantMap } from '../../MaskedButton.types'  
import { SoftButtonContainer, SoftButtonWrapper } from './SoftButton.styles'  
  
type Props = { $variant: 'soft' } & ButtonVariantMap['soft']  
  
export default function SoftButton(props: Props) {  
  return (  
    <SoftButtonWrapper $position={props.$position}>  
      <SoftButtonContainer  
        {...props}  
        $isActive={props.$isActive}  
        $isError={props.state === 'error'}  
        $isDisabled={props.state === 'disabled'}  
      />  
    </SoftButtonWrapper>  
  )  
}