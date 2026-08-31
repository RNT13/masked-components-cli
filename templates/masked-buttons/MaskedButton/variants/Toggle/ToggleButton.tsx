'use client'  
  
import { MouseEvent, useState } from 'react'  
import { ButtonVariantMap } from '../../MaskedButton.types'  
import { ToggleButtonContainer, ToggleLabel, ToggleWrapper } from './ToggleButton.styles'  
  
type Props = {  
  $variant: 'toggle'  
} & ButtonVariantMap['toggle']  
  
export default function ToggleButton({ $position = 'center', $isActive = false, $toggleLabel, onToggle, onClick, state = 'default', ariaLabel, className }: Props) {  
  const [active, setActive] = useState($isActive)  
  const isDisabled = state === 'disabled' || state === 'loading'  
  
  function handleClick(event: MouseEvent<HTMLButtonElement>) {  
    if (isDisabled) return  
    const next = !active  
    setActive(next)  
    onToggle?.(next)  
    onClick?.(event)  
  }  
  
  return (  
    <ToggleWrapper $position={$position}>  
      <ToggleButtonContainer  
        type="button"  
        role="switch"  
        aria-checked={active}  
        aria-label={ariaLabel ?? $toggleLabel}  
        disabled={isDisabled}  
        onClick={handleClick}  
        className={className}  
        $isActive={active}  
      />  
  
      {$toggleLabel && <ToggleLabel>{$toggleLabel}</ToggleLabel>}  
    </ToggleWrapper>  
  )  
}