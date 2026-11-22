import styled, { keyframes } from 'styled-components'
import type { MaskedModalInternalProps } from './MaskedModal.types'

const fadeIn = keyframes`  
  from { opacity: 0 }  
  to { opacity: 1 }  
`

const slideIn = keyframes`  
  from { opacity: 0; transform: translateY(12px) scale(0.98) }  
  to { opacity: 1; transform: translateY(0) scale(1) }  
`

const MAX_WIDTHS: Record<MaskedModalInternalProps['$size'], string> = {
  sm: '24rem',
  md: '32rem',
  lg: '48rem',
  full: 'calc(100vw - 2rem)'
}

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: var(--mc-modal-overlay-bg);
  animation: ${fadeIn} 160ms ease-out;
`

export const ModalPanel = styled.div<MaskedModalInternalProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${({ $size }) => MAX_WIDTHS[$size]};
  max-height: ${({ $size }) => ($size === 'full' ? 'calc(100vh - 2rem)' : 'calc(100vh - 4rem)')};
  overflow: auto;
  background: var(--mc-modal-bg);
  color: var(--mc-modal-fg);
  border: 1px solid var(--mc-modal-border);
  border-radius: var(--mc-modal-radius);
  box-shadow: var(--mc-modal-shadow);
  animation: ${slideIn} 180ms ease-out;

  &:focus {
    outline: none;
  }
`

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem 0;
`

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.4;
`

export const ModalDescription = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: var(--mc-modal-muted);
`

export const ModalBody = styled.div`
  flex: 1;
  padding: 1rem 1.5rem;
  overflow-y: auto;
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 0 1.5rem 1.25rem;
`

export const ModalCloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--mc-modal-muted);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: color-mix(in srgb, var(--mc-modal-fg) 8%, transparent);
    color: var(--mc-modal-fg);
  }

  &:focus-visible {
    outline: 2px solid var(--mc-modal-fg);
    outline-offset: 2px;
  }
`
