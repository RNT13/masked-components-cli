'use client'

import { useState } from 'react'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import {
  AlertAction,
  AlertBody,
  AlertClose,
  AlertIcon,
  AlertRoot,
  AlertTitle
} from './MaskedAlert.styles'
import { resolveAlertTokens } from './alertTokens'
import type { AlertTone, MaskedAlertProps } from './MaskedAlert.types'

const DICT = {
  pt: { close: 'Fechar alerta' },
  en: { close: 'Dismiss alert' }
} as const

const TONE_ICON: Record<AlertTone, string> = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  error: '✕'
}

/**
 * Alerta inline de feedback (padrão WAI-ARIA alert/status).  
 *
 * `error` e `warning` usam `role="alert"` (anunciado imediatamente);  
 * `info` e `success` usam `role="status"` (polite). `dismissible` adiciona  
 * um botão de fechar rotulado por locale; sem `onClose` o alerta se esconde  
 * sozinho (não controlado). `colorTheme` substitui a cor do tone.  
 *
 * @example  
 * <MaskedAlert tone="success" title="Salvo" dismissible>Alterações aplicadas.</MaskedAlert>  
 */
export function MaskedAlert(props: MaskedAlertProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const dict = DICT[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']
  const [dismissed, setDismissed] = useState(false)
  const {
    tone = 'info',
    variant = 'soft',
    title,
    icon,
    dismissible = false,
    onClose,
    action,
    colorTheme,
    tokens,
    className,
    style,
    children,
    ...rest
  } = props

  if (dismissed) return null

  const tokenStyle = resolveAlertTokens({ tone, variant, colorTheme, tokens }, theme)
  const role = tone === 'error' || tone === 'warning' ? 'alert' : 'status'

  const handleClose = () => {
    onClose?.()
    if (!onClose) setDismissed(true)
  }

  return (
    <AlertRoot
      role={role}
      $variant={variant}
      className={className}
      style={{ ...tokenStyle, ...style }}
      {...rest}
    >
      <AlertIcon aria-hidden="true">{icon ?? TONE_ICON[tone]}</AlertIcon>
      <AlertBody>
        {title ? <AlertTitle>{title}</AlertTitle> : null}
        {children}
      </AlertBody>
      {action ? <AlertAction>{action}</AlertAction> : null}
      {dismissible ? (
        <AlertClose type="button" aria-label={dict.close} onClick={handleClose}>
          <span aria-hidden="true">×</span>
        </AlertClose>
      ) : null}
    </AlertRoot>
  )
}
