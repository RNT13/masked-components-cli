'use client'

import { ButtonVariantMap } from '../../MaskedButton.types'
import { OutlineButtonContainer, OutlineButtonWrapper } from './OutlineButton.styles'

type Props = { $variant: 'outline' } & ButtonVariantMap['outline']

export default function OutlineButton(props: Props) {
  return (
    <OutlineButtonWrapper $position={props.$position}>
      <OutlineButtonContainer $isActive={props.$isActive} $isError={props.state === 'error'} $isDisabled={props.state === 'disabled'} {...props} />
    </OutlineButtonWrapper>
  )
}
