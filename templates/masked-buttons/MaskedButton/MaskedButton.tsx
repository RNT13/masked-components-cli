'use client'  
  
import type { ComponentProps } from 'react'  
  
import { ButtonProps, ButtonState } from './MaskedButton.types'  
import DefaultButton from './variants/Default/DefaultButton'  
import OutlineButton from './variants/Outline/OutlineButton'  
import GhostButton from './variants/Ghost/GhostButton'  
import LinkButton from './variants/Link/LinkButton'  
import GradientButton from './variants/Gradient/GradientButton'  
import NeonButton from './variants/Neon/NeonButton'  
import ToggleButton from './variants/Toggle/ToggleButton'  
import SoftButton from './variants/Soft/SoftButton'  
import CheckboxButton from './variants/Checkbox/CheckboxButton'  
  
export function MaskedButton(props: ButtonProps) {  
  const {  
    // API pública (sem $)  
    variant,  
    position,  
    active,  
    disabled,  
    shape,  
    state,  
  
    // aliases depreciados (com $)  
    $variant,  
    $position,  
    $isActive,  
    $toggleLabel,  
    $checkboxLabel,  
  
    // API pública de labels/handlers  
    toggleLabel,  
    checkboxLabel,  
  
    // props específicas de toggle/checkbox (não devem vazar p/ DOM das demais)  
    onToggle,  
    checked,  
    defaultChecked,  
    onCheckedChange,  
  
    ...rest  
  } = props  
  
  // 1) resolve a variante (público tem prioridade, cai no alias depreciado)  
  const resolvedVariant = variant ?? $variant  
  
  // 2) resolve o estado (o atalho `disabled` vira state='disabled')  
  const resolvedState: ButtonState = disabled ? 'disabled' : state ?? 'default'  
  
  // 3) props internas compartilhadas por TODAS as variantes de estilo.  
  //    $variant já entra aqui — NÃO repetir como prop explícita nos cases.  
  const internal = {  
    ...rest,  
    $variant: resolvedVariant,  
    state: resolvedState,  
    shapes: shape ?? rest.shapes,  
    $position: position ?? $position ?? 'center',  
    $isActive: active ?? $isActive ?? false,  
  }  
  
  switch (resolvedVariant) {  
    case 'default':  
      return <DefaultButton {...(internal as ComponentProps<typeof DefaultButton>)} />  
  
    case 'outline':  
      return <OutlineButton {...(internal as ComponentProps<typeof OutlineButton>)} />  
  
    case 'ghost':  
      return <GhostButton {...(internal as ComponentProps<typeof GhostButton>)} />  
  
    case 'link':  
      return <LinkButton {...(internal as ComponentProps<typeof LinkButton>)} />  
  
    case 'gradient':  
      return <GradientButton {...(internal as ComponentProps<typeof GradientButton>)} />  
  
    case 'neon':  
      return <NeonButton {...(internal as ComponentProps<typeof NeonButton>)} />  
  
    case 'soft':  
      return <SoftButton {...(internal as ComponentProps<typeof SoftButton>)} />  
  
    case 'toggle':  
      return (  
        <ToggleButton  
          {...(internal as ComponentProps<typeof ToggleButton>)}  
          $toggleLabel={toggleLabel ?? $toggleLabel}  
          onToggle={onToggle}  
        />  
      )  
  
    case 'checkbox':  
      return (  
        <CheckboxButton  
          {...(internal as ComponentProps<typeof CheckboxButton>)}  
          $checkboxLabel={checkboxLabel ?? $checkboxLabel}  
          checked={checked}  
          defaultChecked={defaultChecked}  
          onCheckedChange={onCheckedChange}  
        />  
      )  
  
    default:  
      return null  
  }  
}