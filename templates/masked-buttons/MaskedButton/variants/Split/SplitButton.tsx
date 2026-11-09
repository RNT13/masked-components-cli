'use client'

import { useEffect, useRef, useState } from 'react'
import { resolveButtonTokens } from '../../buttonTokens'
import { ButtonVariantMap } from '../../MaskedButton.types'
import {
  ChevronIcon,
  SplitButtonWrapper,
  SplitGroup,
  SplitMainButton,
  SplitMenu,
  SplitMenuButton,
  SplitMenuItem,
  SplitMenuItemDescription,
  SplitMenuItemLabel
} from './SplitButton.styles'

type Props = { $variant: 'split' } & ButtonVariantMap['split']

export default function SplitButton(props: Props) {
  const {
    options,
    onOptionSelect,
    menuLabel = 'More options',
    onClick,
    children,
    state = 'default',
    $position,
    $variant: _variant,
    colorTheme,
    tokens,
    size,
    ...buttonProps
  } = props
  void _variant

  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const isDisabled = state === 'disabled' || state === 'loading'

  /* fecha ao clicar fora / Escape */
  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const select = (value: string) => {
    setOpen(false)
    onOptionSelect?.(value)
  }

  return (
    <SplitButtonWrapper $position={$position} ref={rootRef}>
      <SplitGroup>
        <SplitMainButton
          {...buttonProps}
          colorTheme={colorTheme}
          tokens={tokens}
          size={size}
          state={state}
          data-testid="split-button-main"
          onClick={onClick}
          $isError={state === 'error'}
          $isDisabled={state === 'disabled'}
        >
          {children}
        </SplitMainButton>

        <SplitMenuButton
          type="button"
          data-testid="split-button-menu"
          aria-label={menuLabel}
          aria-haspopup="menu"
          aria-expanded={open}
          disabled={isDisabled}
          onClick={() => setOpen((v) => !v)}
          $isError={state === 'error'}
          $isDisabled={state === 'disabled'}
          style={resolveButtonTokens({ colorTheme, tokens })}
        >
          <ChevronIcon $open={open} aria-hidden />
        </SplitMenuButton>
      </SplitGroup>

      {open && (
        <SplitMenu role="menu">
          {options.map((opt) => (
            <SplitMenuItem
              key={opt.value}
              type="button"
              role="menuitem"
              onClick={() => select(opt.value)}
            >
              <SplitMenuItemLabel>{opt.label}</SplitMenuItemLabel>
              {opt.description && (
                <SplitMenuItemDescription>{opt.description}</SplitMenuItemDescription>
              )}
            </SplitMenuItem>
          ))}
        </SplitMenu>
      )}
    </SplitButtonWrapper>
  )
}
