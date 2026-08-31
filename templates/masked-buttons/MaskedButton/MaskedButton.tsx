'use client'  
  
import type { ComponentProps } from 'react'  
  
import DefaultButton from './variants/Default/DefaultButton'  
import OutlineButton from './variants/Outline/OutlineButton'  
import GhostButton from './variants/Ghost/GhostButton'  
import LinkButton from './variants/Link/LinkButton'  
import GradientButton from './variants/Gradient/GradientButton'  
import NeonButton from './variants/Neon/NeonButton'  
import ToggleButton from './variants/Toggle/ToggleButton'  
import SoftButton from './variants/Soft/SoftButton'  
import CheckboxButton from './variants/Checkbox/CheckboxButton'  
import { ButtonProps } from './MaskedButton.types'  
  
export function MaskedButton(props: ButtonProps) {  
  switch (props.$variant) {  
    case 'default':  
      return <DefaultButton {...(props as ComponentProps<typeof DefaultButton>)} />  
  
    case 'outline':  
      return <OutlineButton {...(props as ComponentProps<typeof OutlineButton>)} />  
  
    case 'ghost':  
      return <GhostButton {...(props as ComponentProps<typeof GhostButton>)} />  
  
    case 'link':  
      return <LinkButton {...(props as ComponentProps<typeof LinkButton>)} />  
  
    case 'gradient':  
      return <GradientButton {...(props as ComponentProps<typeof GradientButton>)} />  
  
    case 'neon':  
      return <NeonButton {...(props as ComponentProps<typeof NeonButton>)} />  
  
    case 'toggle':  
      return <ToggleButton {...(props as ComponentProps<typeof ToggleButton>)} />  
  
    case 'soft':  
      return <SoftButton {...(props as ComponentProps<typeof SoftButton>)} />  
  
    case 'checkbox':  
      return <CheckboxButton {...(props as ComponentProps<typeof CheckboxButton>)} />  
  
    default:  
      return null  
  }  
}