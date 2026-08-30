'use client'

import { ButtonVariantMap } from '../../MaskedButton.types'
import { LinkButtonContainer, LinkButtonWrapper } from './LinkButton.styles'

type props = { $variant: 'link' } & ButtonVariantMap['link']

export default function LinkButton(props: props) {
  return (
    <LinkButtonWrapper $position={props.$position}>
      <LinkButtonContainer
        data-testid="link-button"
        $isActive={props.$isActive}
        $isError={props.state === 'error'}
        $isDisabled={props.state === 'disabled'}
        {...props}
      />
    </LinkButtonWrapper>
  )
}
