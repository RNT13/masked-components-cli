import styled from 'styled-components'
import { DefaultTheme } from 'styled-components'
import { media } from '@/styles/MaskedThemes/MaskedThemes'
import type { PopupTransition } from './MaskedPopup.types'

const transitionMap: Record<PopupTransition, string> = {
  fade: 'opacity 0.3s ease, transform 0.3s ease',
  pop: 'opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
  'slide-up': 'opacity 0.3s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
  blur: 'opacity 0.3s ease, transform 0.3s ease, filter 0.3s ease'
}

const getTransform = (transition: PopupTransition, isOpen: boolean): string => {
  if (isOpen) return 'translate(-50%, -50%)'
  switch (transition) {
    case 'pop':
      return 'translate(-50%, -50%) scale(0.9)'
    case 'slide-up':
      return 'translate(-50%, calc(-50% + 24px))'
    case 'blur':
    case 'fade':
    default:
      return 'translate(-50%, -50%)'
  }
}

const surface = (theme: DefaultTheme) => theme.colors.surfaceColor ?? theme.colors.baseBlack.light08

const textColor = (theme: DefaultTheme) => theme.colors.textColor ?? theme.colors.basePureWhite.base

const borderColor = (theme: DefaultTheme) => theme.colors.borderColor ?? theme.colors.baseGlass.light08

export const PopupOverlay = styled.div<{
  $isOpen: boolean
  $blur: boolean
  $zIndex: number
}>`
  position: fixed;
  inset: 0;
  z-index: ${({ $zIndex }) => $zIndex};

  background: var(--mc-popup-overlay-bg, rgba(0, 0, 0, 0.55));
  backdrop-filter: ${({ $blur }) => ($blur ? 'blur(6px)' : 'none')};

  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};

  transition: opacity 0.3s ease;

  ${media.reducedMotion} {
    transition: opacity 0.15s ease;
  }
`

export const PopupPanel = styled.div<{
  $isOpen: boolean
  $instant?: boolean
  $width: string
  $maxWidth: string
  $transition: PopupTransition
  $zIndex: number
}>`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: ${({ $zIndex }) => $zIndex};

  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  width: ${({ $width }) => $width};
  max-width: ${({ $maxWidth }) => $maxWidth};
  max-height: 90dvh;

  overflow-y: auto;
  padding: var(--mc-popup-padding, 1.75rem);

  border-radius: var(--mc-popup-radius, 20px);
  border: 1px solid ${({ theme }) => borderColor(theme)};

  background: var(--mc-popup-panel-bg, ${({ theme }) => surface(theme)});
  color: var(--mc-popup-panel-fg, ${({ theme }) => textColor(theme)});

  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);

  transform: ${({ $transition, $isOpen }) => getTransform($transition, $isOpen)};

  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};

  filter: ${({ $transition, $isOpen }) => ($transition === 'blur' && !$isOpen ? 'blur(8px)' : 'blur(0px)')};

  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};

  /*
   * Sem transição quando o painel está morto ($instant):
   * mudanças de transform aplicam instantaneamente, então a
   * abertura sempre anima a partir da posição correta.
   */
  transition: ${({ $transition, $instant }) => ($instant ? 'none' : transitionMap[$transition])};

  ${media.reducedMotion} {
    transition: ${({ $instant }) => ($instant ? 'none' : 'opacity 0.2s ease')};

    transform: translate(-50%, -50%);
    filter: none;
  }
`
