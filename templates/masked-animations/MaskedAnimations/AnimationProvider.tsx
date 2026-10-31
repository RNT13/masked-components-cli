'use client'

import { ReactNode, useEffect } from 'react'
import { registerAnimationProperties } from './registerAnimationProperties'

/**
 * OPCIONAL. O registro das propriedades CSS agora acontece sozinho quando o
 * MaskedAnimation é importado, então este provider não é mais necessário.
 * Foi mantido para não quebrar projetos que já o usam.
 */
export function AnimationProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerAnimationProperties()
  }, [])

  return <>{children}</>
}
