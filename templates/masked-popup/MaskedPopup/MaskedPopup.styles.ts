import { styled, type DefaultTheme } from 'styled-components'
import { media } from '@/styles/MaskedThemes/MaskedThemes'
import { PopupTransition } from './MaskedPopup.types'

const surface = (t: DefaultTheme) => t.colors?.surfaceColor ?? '#ffffff'
const textColor = (t: DefaultTheme) => t.colors?.textColor ?? '#111111'
const borderColor = (t: DefaultTheme) => t.colors?.borderColor ?? 'rgba(128, 128, 128, 0.35)'

const getTransform = (transition: PopupTransition, isOpen: boolean) => {
  if (isOpen) return 'translate(-50%, -50%) scale(1)'
  switch (transition) {
    case 'pop':
      return 'translate(-50%, -50%) scale(0.88)'
    case 'slide-up':
      return 'translate(-50%, -40%)'
    case 'blur':
      return 'translate(-50%, -50%) scale(0.96)'
    case 'fade':
      return 'translate(-50%, -50%)'
  }
}

const transitionMap: Record<PopupTransition, string> = {
  pop: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
  fade: 'transform 0.35s ease, opacity 0.35s ease',
  'slide-up': 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease',
  blur: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease, filter 0.4s ease'
}

export const PopupOverlay = styled.div<{ $isOpen: boolean; $blur: boolean; $zIndex: number }>`
  position: fixed;
  inset: 0;
  z-index: ${({ $zIndex }) => $zIndex - 1};
  /* translúcido: o conteúdo da página continua visível por trás */
  background: var(--mc-popup-overlay-bg, rgba(0, 0, 0, 0.45));
  ${({ $blur }) => $blur && 'backdrop-filter: blur(6px);'}
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: opacity 0.3s ease;

  ${media.reducedMotion} {
    transition: opacity 0.15s ease;
  }
`

export const PopupPanel = styled.div<{
  $isOpen: boolean
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
  transition: ${({ $transition }) => transitionMap[$transition]};

  ${media.reducedMotion} {
    transition: opacity 0.2s ease;
    transform: translate(-50%, -50%);
    filter: none;
  }
`
