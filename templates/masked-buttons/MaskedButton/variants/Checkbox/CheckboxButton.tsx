'use client'  
  
import { MouseEvent, useState } from 'react'  
import { FaCheck } from 'react-icons/fa6'  
import { VscLoading } from 'react-icons/vsc'  
import { ButtonVariantMap } from '../../MaskedButton.types'  
import { CheckboxBox, CheckboxLabel, CheckboxWrapper } from './CheckboxButton.styles'  
  
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
  
  const isLoading = state === 'loading'  
  const isDisabled = state === 'disabled' || isLoading  
  
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
        aria-busy={isLoading || undefined}  
        aria-label={ariaLabel ?? $checkboxLabel}  
        disabled={isDisabled}  
        onClick={handleClick}  
        className={className}  
        $isChecked={isChecked}  
        $isLoading={isLoading}  
      >  
        {isLoading ? <VscLoading /> : isChecked && <FaCheck />}  
      </CheckboxBox>  
  
      {$checkboxLabel && <CheckboxLabel>{$checkboxLabel}</CheckboxLabel>}  
    </CheckboxWrapper>  
  )  
}