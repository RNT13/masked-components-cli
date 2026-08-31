'use client'  
  
import CheckboxButton from './variants/Checkbox/CheckboxButton'  
import DefaultButton from './variants/Default/DefaultButton'  
import GhostButton from './variants/Ghost/GhostButton'  
import GradientButton from './variants/Gradient/GradientButton'  
import LinkButton from './variants/Link/LinkButton'  
import NeonButton from './variants/Neon/NeonButton'  
import OutlineButton from './variants/Outline/OutlineButton'  
import SoftButton from './variants/Soft/SoftButton'  
import ToggleButton from './variants/Toggle/ToggleButton'  
import { ButtonProps, ButtonVariant, ButtonVariantMap } from './MaskedButton.types'  
  
export function MaskedButton(props: ButtonProps) {  
  const {  
    // ---- API pública ----  
    variant,  
    position,  
    active,  
    disabled,  
    shape,  
    toggleLabel,  
    checkboxLabel,  
    // ---- aliases depreciados ----  
    $variant,  
    $position,  
    $isActive,  
    $toggleLabel,  
    $checkboxLabel,  
    // ---- já internos / compartilhados ----  
    state,  
    shapes,  
    ...rest  
  } = props  
  
  const resolvedVariant: ButtonVariant = variant ?? $variant ?? 'default'  
  
  // mapeia os nomes públicos para os nomes internos que as variantes consomem  
  const internal = {  
    ...rest,  
    state: disabled ? 'disabled' : (state ?? 'default'),  
    shapes: shape ?? shapes ?? 'rounded',  
    $position: position ?? $position ?? 'center',  
    $isActive: active ?? $isActive ?? false,  
    $toggleLabel: toggleLabel ?? $toggleLabel,  
    $checkboxLabel: checkboxLabel ?? $checkboxLabel,  
  }  
  
  switch (resolvedVariant) {  
    case 'default':  
      return <DefaultButton $variant="default" {...(internal as ButtonVariantMap['default'])} />  
  
    case 'outline':  
      return <OutlineButton $variant="outline" {...(internal as ButtonVariantMap['outline'])} />  
  
    case 'ghost':  
      return <GhostButton $variant="ghost" {...(internal as ButtonVariantMap['ghost'])} />  
  
    case 'link':  
      return <LinkButton $variant="link" {...(internal as ButtonVariantMap['link'])} />  
  
    case 'gradient':  
      return <GradientButton $variant="gradient" {...(internal as ButtonVariantMap['gradient'])} />  
  
    case 'neon':  
      return <NeonButton $variant="neon" {...(internal as ButtonVariantMap['neon'])} />  
  
    case 'soft':  
      return <SoftButton $variant="soft" {...(internal as ButtonVariantMap['soft'])} />  
  
    case 'toggle':  
      return <ToggleButton $variant="toggle" {...(internal as ButtonVariantMap['toggle'])} />  
  
    case 'checkbox':  
      return <CheckboxButton $variant="checkbox" {...(internal as ButtonVariantMap['checkbox'])} />  
  
    default:  
      return null  
  }  
}