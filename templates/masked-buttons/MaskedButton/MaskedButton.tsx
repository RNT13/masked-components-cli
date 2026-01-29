'use client'

import { ButtonProps } from './MaskedButton.types'
import DefaultButton from './variants/Default/DefaultButton'
import GhostButton from './variants/Ghost/GhostButton'
import GradientButton from './variants/Gradient/GradientButton'
import LinkButton from './variants/Link/LinkButton'
import NeonButton from './variants/Neon/NeonButton'
import OutlineButton from './variants/Outline/OutlineButton'
import TobbleButton from './variants/Toggle/ToggleButton'

export function MButton(props: ButtonProps) {
  switch (props.variant) {
    case 'default':
      return <DefaultButton {...props} />

    case 'outline':
      return <OutlineButton {...props} />

    case 'ghost':
      return <GhostButton {...props} />

    case 'link':
      return <LinkButton {...props} />

    case 'gradient':
      return <GradientButton {...props} />

    case 'neon':
      return <NeonButton {...props} />

    case 'toggle':
      return <TobbleButton {...props} />

    default:
      return null
  }
}
