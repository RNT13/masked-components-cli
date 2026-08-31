'use client'  
  
import { ButtonVariantMap } from '../../MaskedButton.types'  
import { DefaultButtonContainer, DefaultButtonWrapper } from './DefaultButton.styles'  
  
type Props = { $variant: 'default' } & ButtonVariantMap['default']  
  
export default function DefaultButton(props: Props) {  
  return (  
    <DefaultButtonWrapper $position={props.$position}>  
      <DefaultButtonContainer  
        {...props}  
        $isActive={props.$isActive}  
        $isError={props.state === 'error'}  
        $isDisabled={props.state === 'disabled'}  
      />  
    </DefaultButtonWrapper>  
  )  
}