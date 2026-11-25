'use client'

import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useMounted } from './useMounted'

export interface PortalProps {
  children: ReactNode
  /** Container alvo. Default: document.body. */
  container?: Element | null
  /** Desliga o portal e renderiza inline. Default: true. */
  enabled?: boolean
}

/**
 * Portal — renderiza `children` em `container` (default: body), SSR-safe.  
 *
 * No servidor (ou antes da hidratação) renderiza inline — mesmo  
 * comportamento de `portal`/`mounted` em MaskedPopup e MaskedDrawer.  
 */
export function Portal({ children, container, enabled = true }: PortalProps) {
  const mounted = useMounted()

  if (!enabled || !mounted) return <>{children}</>

  return createPortal(children, container ?? document.body)
}
