'use client'  
  
import React, { createContext, useContext, useState, type ReactNode } from 'react'  
import { styled } from 'styled-components'  
import { MaskedButton } from './MaskedButton'  
import type { ButtonProps } from './MaskedButton.types'  
  
/* ================= Tipos ================= */  
  
export type ButtonGroupOption = {  
  value: string  
  label?: ReactNode  
  /** repassa props ao MaskedButton interno (ícone, disabled etc.) */  
  buttonProps?: Omit<ButtonProps, 'variant' | 'active' | 'onClick' | 'optionValue'>  
}  
  
export type MaskedButtonGroupProps = {  
  options: ButtonGroupOption[]  
  /** valor selecionado (controlado) */  
  value?: string  
  /** valor inicial (não controlado) */  
  defaultValue?: string  
  onChange?: (value: string) => void  
  /** variante dos botões do grupo (padrão: 'toggle') */  
  variant?: 'toggle' | 'checkbox' | 'radio' | 'switch'  
  /** repassa colorTheme/tokens a todos os botões */  
  colorTheme?: string  
  tokens?: Record<string, string | number>  
  fullWidth?: boolean  
  className?: string  
  /** role do grupo: 'radiogroup' (seleção única) | 'group' */  
  role?: 'radiogroup' | 'group'  
  ariaLabel?: string  
}  
  
/* ================= Contexto interno ================= */  
  
const GroupContext = createContext<{  
  value?: string  
  select: (v: string) => void  
  variant: NonNullable<MaskedButtonGroupProps['variant']>  
  colorTheme?: string  
  tokens?: Record<string, string | number>  
} | null>(null)  
  
/* ================= Estilos ================= */  
  
const GroupContainer = styled.div<{ $fullWidth?: boolean }>`  
  display: inline-flex;  
  align-items: stretch;  
  gap: 0;  
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}  
  
  /* botões adjacentes compartilham borda (segmented control) */  
  & > *:not(:first-child) {  
    margin-left: -1px;  
  }  
  & > *:first-child,  
  & > *:first-child > * {  
    border-top-left-radius: var(--mc-btn-radius, 8px);  
    border-bottom-left-radius: var(--mc-btn-radius, 8px);  
  }  
  & > *:last-child,  
  & > *:last-child > * {  
    border-top-right-radius: var(--mc-btn-radius, 8px);  
    border-bottom-right-radius: var(--mc-btn-radius, 8px);  
  }  
`  
  
/* ================= Componente ================= */  
  
export function MaskedButtonGroup(props: MaskedButtonGroupProps) {  
  const {  
    options,  
    value,  
    defaultValue,  
    onChange,  
    variant = 'toggle',  
    colorTheme,  
    tokens,  
    fullWidth,  
    className,  
    role,  
    ariaLabel  
  } = props  
  
  const isControlled = value !== undefined  
  const [internal, setInternal] = useState(defaultValue)  
  const current = isControlled ? value : internal  
  
  const select = (v: string) => {  
    if (!isControlled) setInternal(v)  
    onChange?.(v)  
  }  
  
  const resolvedRole = role ?? (variant === 'radio' ? 'radiogroup' : 'group')  
  
  return (  
    <GroupContext.Provider value={{ value: current, select, variant, colorTheme, tokens }}>  
      <GroupContainer  
        role={resolvedRole}  
        aria-label={ariaLabel}  
        $fullWidth={fullWidth}  
        className={className}  
      >  
        {options.map((opt) => (  
          <GroupItem key={opt.value} option={opt} />  
        ))}  
      </GroupContainer>  
    </GroupContext.Provider>  
  )  
}  
  
function GroupItem({ option }: { option: ButtonGroupOption }) {  
  const ctx = useContext(GroupContext)  
  if (!ctx) return null  
  
  const checked = ctx.value === option.value  
  const label = option.label ?? option.value  
  const textLabel =
    typeof label === 'string' || typeof label === 'number' || typeof label === 'bigint'
      ? String(label)
      : option.value
  
  /* As variants de campo não renderizam children — o label precisa ir  
     pela prop específica de cada uma (switchLabel/checkboxLabel/  
     radioLabel/$toggleLabel). */  
  const labelProps =  
    ctx.variant === 'switch'  
      ? { switchLabel: textLabel }
      : ctx.variant === 'checkbox'  
        ? { $checkboxLabel: textLabel }
        : ctx.variant === 'radio'  
          ? { $radioLabel: textLabel }
          : { $toggleLabel: textLabel }
  
  return (  
    <MaskedButton  
      variant={ctx.variant}  
      optionValue={option.value}  
      name={ctx.variant === 'radio' ? 'masked-button-group' : undefined}  
      active={checked}  
      checked={checked}  
      colorTheme={ctx.colorTheme}  
      tokens={ctx.tokens}  
      onCheckedChange={() => ctx.select(option.value)}  
      onToggle={() => ctx.select(option.value)}  
      {...labelProps}  
      {...option.buttonProps}  
    />  
  )  
}