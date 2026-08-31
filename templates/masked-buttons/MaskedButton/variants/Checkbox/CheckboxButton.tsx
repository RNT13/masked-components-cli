'use client'  
  
import { MouseEvent, useState } from 'react'  
import { FaCheck } from 'react-icons/fa6'  
import { ButtonVariantMap } from '../../MaskedButton.types'  
import { CheckboxWrapper, CheckboxBox, CheckboxLabel } from './CheckboxButton.styles'
  
type Props = {  
  $variant: 'checkbox'  
} & ButtonVariantMap['checkbox']  
  
export default function CheckboxButton({  
  $position = 'left',  
  checked,  
  defaultChecked = false,  
  onCheckedChange,  
  onClick,  
  $checkboxLabel,  
  state = 'default',  
  ariaLabel,  
  className,  
}: Props) {  
  const isControlled = checked !== undefined  
  const [internal, setInternal] = useState(defaultChecked)  
  const isChecked = isControlled ? checked : internal  
  const isDisabled = state === 'disabled' || state === 'loading'  
  
  function handleClick(event: MouseEvent<HTMLButtonElement>) {  
    if (isDisabled) return  
    const next = !isChecked  
    if (!isControlled) setInternal(next)  
    onCheckedChange?.(next)  
    onClick?.(event)  
  }  
  
  return (  
    <CheckboxWrapper $position={$position}>  
      <CheckboxBox  
        type="button"  
        role="checkbox"  
        aria-checked={isChecked}  
        aria-label={ariaLabel ?? $checkboxLabel}  
        disabled={isDisabled}  
        onClick={handleClick}  
        className={className}  
        $isChecked={isChecked}  
      >  
        {isChecked && <FaCheck />}  
      </CheckboxBox>  
  
      {$checkboxLabel && <CheckboxLabel>{$checkboxLabel}</CheckboxLabel>}  
    </CheckboxWrapper>  
  )  
}