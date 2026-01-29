'use client'

import { ButtonVariantMap } from '../../MaskedButton.types'
import { LinkButtonContainer } from './LinkButton.styles'

type props = { variant: 'link' } & ButtonVariantMap['link']

export default function LinkButton(props: props) {
  return <LinkButtonContainer data-testid="link-button" $isActive={props.$isActive} $isError={props.state === 'error'} {...props} />
}
