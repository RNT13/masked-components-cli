'use client'

import {
  createContext,
  useContext,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode
} from 'react'
import { styled, type DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import { readableTextOn } from '@/utils/masked-utils'
import { MaskedButton } from './MaskedButton'
import { resolveButtonTokens } from './buttonTokens'
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
  /**
   * 'segmented' (padrão): controle segmentado com indicador deslizante.
   * Os demais renderizam um grupo de campos (toggle/checkbox/radio/switch).
   */
  variant?: 'segmented' | 'toggle' | 'checkbox' | 'radio' | 'switch'
  /** direção dos grupos de campos (padrão: horizontal) */
  orientation?: 'horizontal' | 'vertical'
  colorTheme?: ColorThemeName
  tokens?: Record<string, string | number>
  fullWidth?: boolean
  className?: string
  role?: 'radiogroup' | 'group'
  ariaLabel?: string
}

/* ================= Helpers de tema (funcionam sem ThemeProvider) ================= */

const accentOf = (theme: DefaultTheme) => theme.colors?.accentColor ?? '#2563eb'

/* ================= Estilos: segmented ================= */

const SegmentedRoot = styled.div<{ $fullWidth?: boolean }>`
  --_pad: 4px;
  position: relative;
  display: ${({ $fullWidth }) => ($fullWidth ? 'grid' : 'inline-grid')};
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
  padding: var(--_pad);
  border-radius: var(--mc-btn-radius, 14px);
  background: ${({ theme }) => theme.colors?.tertiaryColor ?? 'rgba(128, 128, 128, 0.16)'};
  border: 1px solid ${({ theme }) => theme.colors?.borderColor ?? 'rgba(128, 128, 128, 0.3)'};
`

const SegmentedThumb = styled.span<{ $visible: boolean }>`
  position: absolute;
  top: var(--_pad);
  bottom: var(--_pad);
  left: var(--_pad);
  width: calc((100% - 2 * var(--_pad)) / var(--mc-seg-count, 1));
  border-radius: calc(var(--mc-btn-radius, 14px) - 4px);
  background: var(--mc-btn-bg, ${({ theme }) => accentOf(theme)});
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transform: translateX(calc(var(--mc-seg-index, 0) * 100%));
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition:
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.15s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const Segment = styled.button<{ $selected: boolean }>`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 18px;
  border: 0;
  border-radius: calc(var(--mc-btn-radius, 14px) - 4px);
  background: transparent;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  color: ${({ $selected, theme }) =>
    $selected
      ? `var(--mc-btn-fg, ${readableTextOn(accentOf(theme))})`
      : (theme.colors?.textMuted ?? 'inherit')};
  transition: color 0.2s ease;

  &:hover:not(:disabled) {
    color: ${({ $selected, theme }) =>
    $selected
      ? `var(--mc-btn-fg, ${readableTextOn(accentOf(theme))})`
      : (theme.colors?.textColor ?? 'inherit')};
  }

  &:focus-visible {
    outline: 2px solid var(--mc-btn-ring-focus, ${({ theme }) => accentOf(theme)});
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

/* ================= Estilos: grupo de campos ================= */

const FieldsContainer = styled.div<{ $vertical?: boolean; $fullWidth?: boolean }>`
  display: inline-flex;
  flex-wrap: wrap;
  flex-direction: ${({ $vertical }) => ($vertical ? 'column' : 'row')};
  align-items: ${({ $vertical }) => ($vertical ? 'flex-start' : 'center')};
  gap: 16px 24px;
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
`

/* ================= Segmented ================= */

function Segmented(props: {
  options: ButtonGroupOption[]
  current?: string
  select: (value: string) => void
  tokenStyle: CSSProperties
  fullWidth?: boolean
  className?: string
  ariaLabel?: string
}) {
  const { options, current, select, tokenStyle, fullWidth, className, ariaLabel } = props
  const refs = useRef<Array<HTMLButtonElement | null>>([])

  const count = options.length
  const found = options.findIndex((o) => o.value === current)
  const hasSelection = found >= 0
  const index = hasSelection ? found : 0

  const isDisabled = (i: number) => Boolean(options[i]?.buttonProps?.disabled)

  function nextEnabled(from: number, step: 1 | -1): number {
    for (let n = 1; n <= count; n++) {
      const i = (((from + step * n) % count) + count) % count
      if (!isDisabled(i)) return i
    }
    return from
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (count === 0) return

    let next: number | null = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      next = nextEnabled(hasSelection ? index : -1, 1)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      next = nextEnabled(hasSelection ? index : 0, -1)
    } else if (e.key === 'Home') {
      next = nextEnabled(-1, 1)
    } else if (e.key === 'End') {
      next = nextEnabled(count, -1)
    }

    if (next === null) return
    e.preventDefault()
    select(options[next].value)
    refs.current[next]?.focus()
  }

  return (
    <SegmentedRoot
      role="radiogroup"
      aria-label={ariaLabel}
      $fullWidth={fullWidth}
      className={className}
      onKeyDown={onKeyDown}
      style={
        {
          ...tokenStyle,
          '--mc-seg-count': count,
          '--mc-seg-index': index
        } as CSSProperties
      }
    >
      <SegmentedThumb aria-hidden="true" $visible={hasSelection} />

      {options.map((opt, i) => {
        const selected = hasSelection && i === index
        return (
          <Segment
            key={opt.value}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={i === index ? 0 : -1}
            disabled={opt.buttonProps?.disabled}
            $selected={selected}
            onClick={() => select(opt.value)}
          >
            {opt.buttonProps?.leftIcon}
            {opt.label ?? opt.value}
          </Segment>
        )
      })}
    </SegmentedRoot>
  )
}

/* ================= Contexto dos grupos de campos ================= */

const GroupContext = createContext<{
  value?: string
  select: (v: string) => void
  variant: Exclude<NonNullable<MaskedButtonGroupProps['variant']>, 'segmented'>
  colorTheme?: ColorThemeName
  tokens?: Record<string, string | number>
} | null>(null)

function GroupItem({ option }: { option: ButtonGroupOption }) {
  const ctx = useContext(GroupContext)
  if (!ctx) return null

  const checked = ctx.value === option.value
  const label = option.label ?? option.value
  const textLabel =
    typeof label === 'string' || typeof label === 'number' ? String(label) : option.value

  /* as variants de campo não renderizam children: o rótulo vai pela prop de cada uma */
  const labelProps =
    ctx.variant === 'switch'
      ? { switchLabel: textLabel }
      : ctx.variant === 'checkbox'
        ? { checkboxLabel: textLabel }
        : ctx.variant === 'radio'
          ? { radioLabel: textLabel }
          : { toggleLabel: textLabel }

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

/* ================= Componente ================= */

export function MaskedButtonGroup(props: MaskedButtonGroupProps) {
  const {
    options,
    value,
    defaultValue,
    onChange,
    variant = 'segmented',
    orientation = 'horizontal',
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

  if (variant === 'segmented') {
    return (
      <Segmented
        options={options}
        current={current}
        select={select}
        tokenStyle={resolveButtonTokens({ colorTheme, tokens })}
        fullWidth={fullWidth}
        className={className}
        ariaLabel={ariaLabel}
      />
    )
  }

  const resolvedRole = role ?? (variant === 'radio' ? 'radiogroup' : 'group')

  return (
    <GroupContext.Provider value={{ value: current, select, variant, colorTheme, tokens }}>
      <FieldsContainer
        role={resolvedRole}
        aria-label={ariaLabel}
        $vertical={orientation === 'vertical'}
        $fullWidth={fullWidth}
        className={className}
      >
        {options.map((opt) => (
          <GroupItem key={opt.value} option={opt} />
        ))}
      </FieldsContainer>
    </GroupContext.Provider>
  )
}
