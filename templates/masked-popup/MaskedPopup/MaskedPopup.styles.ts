import { styled } from 'styled-components'
import { PopupTransition } from './MaskedPopup.types'

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
  background: rgba(0, 0, 0, 0.5);
  ${({ $blur }) => $blur && 'backdrop-filter: blur(6px);'}
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
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
  width: ${({ $width }) => $width};
  max-width: ${({ $maxWidth }) => $maxWidth};
  max-height: 90vh;
  overflow-y: auto;

  transform: ${({ $transition, $isOpen }) => getTransform($transition, $isOpen)};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  filter: ${({ $transition, $isOpen }) => ($transition === 'blur' && !$isOpen ? 'blur(8px)' : 'blur(0px)')};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: ${({ $transition }) => transitionMap[$transition]};
`
