'use client'

import type { ComponentProps } from 'react'

import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'

import { ButtonProps, ButtonState } from './MaskedButton.types'
import DefaultButton from './variants/Default/DefaultButton'
import OutlineButton from './variants/Outline/OutlineButton'
import GhostButton from './variants/Ghost/GhostButton'
import LinkButton from './variants/Link/LinkButton'
import GradientButton from './variants/Gradient/GradientButton'
import NeonButton from './variants/Neon/NeonButton'
import ToggleButton from './variants/Toggle/ToggleButton'
import SwitchButton from './variants/Switch/SwitchButton'
import SoftButton from './variants/Soft/SoftButton'
import CheckboxButton from './variants/Checkbox/CheckboxButton'
import RadioButton from './variants/Radio/RadioButton'
import SplitButton from './variants/Split/SplitButton'

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
    switchLabel,
    checkboxLabel,
    radioLabel,

    // props específicas de toggle/switch/checkbox/radio (não devem vazar p/ DOM)
    onToggle,
    checked,
    defaultChecked,
    onCheckedChange,
    name, // radio: agrupa inputs do mesmo name

    // linkComponent: prop > provider > <a> nativo (H.5)
    linkComponent,

    // colorTheme compartilhado (G.h) — derivado nos estilos
    colorTheme,

    ...rest
  } = props

  const config = useMaskedConfig()
  const resolvedLinkComponent = linkComponent ?? config.linkComponent

  const resolvedVariant = variant ?? $variant
  const resolvedState: ButtonState = disabled ? 'disabled' : (state ?? 'default')

  const internal = {
    ...rest,
    $variant: resolvedVariant,
    state: resolvedState,
    shapes: shape ?? rest.shapes,
    $position: position ?? $position ?? 'center',
    $isActive: active ?? $isActive ?? false,
    colorTheme,
    tokens: props.tokens,
    linkComponent: resolvedLinkComponent
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

    case 'split':
      return (
        <SplitButton
          {...{
            ...(internal as ComponentProps<typeof SplitButton>),
            options: rest.options ?? [],
            selectedValue: rest.selectedValue,
            onOptionSelect: rest.onOptionSelect,
            menuLabel: rest.menuLabel
          }}
        />
      )

    case 'toggle':
      return (
        <ToggleButton
          {...(internal as ComponentProps<typeof ToggleButton>)}
          $toggleLabel={toggleLabel ?? $toggleLabel}
          onToggle={onToggle}
        />
      )

    case 'switch':
      return (
        <SwitchButton
          {...(internal as ComponentProps<typeof SwitchButton>)}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          switchLabel={switchLabel}
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

    case 'radio':
      return (
        <RadioButton
          {...(internal as ComponentProps<typeof RadioButton>)}
          radioLabel={radioLabel}
          name={name}
          optionValue={rest.optionValue}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
        />
      )

    default:
      return null
  }
}
