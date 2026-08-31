'use client'

import { ButtonVariantMap } from '../../MaskedButton.types'
import { LinkButtonContainer, LinkButtonWrapper } from './LinkButton.styles'

type props = { $variant: 'link' } & ButtonVariantMap['link']

export default function LinkButton(props: props) {
  return (
    <LinkButtonWrapper $position={props.$position}>
      <LinkButtonContainer
        {...props} 
        data-testid="link-button"
        $isError={props.state === 'error'} 
        $isDisabled={props.state === 'disabled'} 
      />
    </LinkButtonWrapper>
  )
}
