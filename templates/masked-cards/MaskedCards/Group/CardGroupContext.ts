'use client'

import { createContext, useContext } from 'react'
import type { CardSelectionMode } from '../MaskedCards.types'
import type { KeyboardEvent } from 'react'

export interface CardGroupContextValue {
  mode: CardSelectionMode
  disabled: boolean
  isSelected: (value: string) => boolean
  select: (value: string) => void
  /** tabIndex do card (roving tabindex: só o selecionado/primeiro habilitado é 0). */
  tabIndexFor: (value: string, cardDisabled: boolean) => number
  /** Navegação por setas/Home/End a partir do card `value`. */
  onCardKeyDown: (value: string, event: KeyboardEvent<HTMLElement>) => void
  /**
   * Registra o elemento interativo do card (button/stretched-button).  
   * Retorna função de cleanup. Ordem de registro = ordem de montagem.  
   */
  register: (value: string, el: HTMLElement, cardDisabled: boolean) => () => void
}

export const CardGroupContext = createContext<CardGroupContextValue | null>(null)

/** Dentro de um MaskedCardGroup retorna o contexto; fora, null. */
export function useCardGroupContext(): CardGroupContextValue | null {
  return useContext(CardGroupContext)
}
