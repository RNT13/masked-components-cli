'use client'

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement
} from 'react'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { TooltipBubble, TooltipWrapper } from './MaskedTooltip.styles'
import { resolveTooltipTokens } from './tooltipTokens'
import type { MaskedTooltipProps } from './MaskedTooltip.types'

/**
 * Tooltip acessível por hover e teclado.
 *
 * - abre ao passar o mouse e ao focar o filho (com `delay`); fecha ao sair,
 *   ao perder o foco e com Escape (WCAG 1.4.13: dispensável, "hoverable" e
 *   persistente enquanto o ponteiro estiver sobre o gatilho ou o balão);
 * - o filho recebe `aria-describedby` apontando para o balão (`role="tooltip"`)
 *   somente enquanto ele está aberto.
 *
 * Limitação: o balão não usa portal; dentro de um ancestral com
 * `overflow: hidden` ele pode ser cortado. Para esses casos, mova o gatilho
 * para fora do container recortado.
 *
 * @example
 * <MaskedTooltip content="Excluir cliente"><button aria-label="Excluir">🗑</button></MaskedTooltip>
 */
export function MaskedTooltip(props: MaskedTooltipProps) {
  const theme = useMaskedTheme()
  const id = useId()
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const {
    content,
    variant = 'dark',
    side = 'top',
    delay = 150,
    disabled = false,
    tokens,
    className,
    style,
    children
  } = props

  useEffect(() => () => clearTimeout(timer.current), [])

  const show = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(true), delay)
  }
  const hide = () => {
    clearTimeout(timer.current)
    setOpen(false)
  }
  const onKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Escape' && open) {
      hide()
      event.stopPropagation()
    }
  }

  if (disabled) return <>{children}</>

  const tokenStyle = resolveTooltipTokens({ variant, tokens }, theme)
  const child = Children.only(children)
  const described = isValidElement(child)
    ? cloneElement(child as ReactElement<{ 'aria-describedby'?: string }>, {
        'aria-describedby': open
          ? id
          : (child.props as { 'aria-describedby'?: string })['aria-describedby']
      })
    : child

  return (
    <TooltipWrapper
      className={className}
      style={style}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={onKeyDown}
    >
      {described}
      {open && (
        <TooltipBubble id={id} role="tooltip" $side={side} $variant={variant} style={tokenStyle}>
          {content}
        </TooltipBubble>
      )}
    </TooltipWrapper>
  )
}
