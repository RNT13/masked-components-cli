import { css, styled } from 'styled-components'
import { media } from '@/styles/MaskedThemes/MaskedThemes'
import { DrawerBreakpoint, DrawerSide, DrawerTransition, ResponsiveSize } from './MaskedDrawer.types'

const getTransform = (side: DrawerSide, isOpen: boolean) => {
  if (isOpen) return 'translate(0, 0)'
  switch (side) {
    case 'left':
      return 'translateX(-100%)'
    case 'right':
      return 'translateX(100%)'
    case 'top':
      return 'translateY(-100%)'
    case 'bottom':
      return 'translateY(100%)'
  }
}

/**
 * Resolve um ResponsiveSize num valor único de string pra um breakpoint.
 * String simples = mesmo valor em qualquer tela. Objeto = pega o valor do
 * breakpoint pedido, caindo pro próximo tamanho maior quando o breakpoint
 * específico não foi informado (mobile -> tablet -> desktop).
 */
function resolveSize(value: ResponsiveSize | undefined, breakpoint: DrawerBreakpoint, fallback: string): string {
  if (!value) return fallback
  if (typeof value === 'string') return value

  if (breakpoint === 'mobile') return value.mobile ?? value.tablet ?? value.desktop ?? fallback
  if (breakpoint === 'tablet') return value.tablet ?? value.desktop ?? fallback
  return value.desktop ?? fallback
}

const getPosition = (side: DrawerSide, desktopSize: string, tabletSize: string, mobileSize: string) => {
  const isHorizontal = side === 'left' || side === 'right'

  return css`
    ${side === 'left' &&
    css`
      top: 0;
      left: 0;
      height: 100vh;
    `}
    ${side === 'right' &&
    css`
      top: 0;
      right: 0;
      height: 100vh;
    `}
    ${side === 'top' &&
    css`
      top: 0;
      left: 0;
      width: 100vw;
    `}
    ${side === 'bottom' &&
    css`
      bottom: 0;
      left: 0;
      width: 100vw;
    `}

    ${isHorizontal
      ? css`
          width: ${desktopSize};
        `
      : css`
          height: ${desktopSize};
        `}

    ${media.tablet} {
      ${isHorizontal
        ? css`
            width: ${tabletSize};
          `
        : css`
            height: ${tabletSize};
          `}
    }

    ${media.mobile} {
      ${isHorizontal
        ? css`
            width: ${mobileSize};
          `
        : css`
            height: ${mobileSize};
          `}
    }
  `
}

const transitionMap: Record<DrawerTransition, string> = {
  slide: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease',
  bounce: 'transform 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.15), opacity 0.4s ease',
  premium: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1)'
}

export const DrawerPanel = styled.div<{
  $side: DrawerSide
  $isOpen: boolean
  $size: ResponsiveSize
  $fallback: string
  $transition: DrawerTransition
  $zIndex: number
}>`
  position: fixed;
  z-index: ${({ $zIndex }) => $zIndex};
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  ${({ $side, $size, $fallback }) =>
    getPosition($side, resolveSize($size, 'desktop', $fallback), resolveSize($size, 'tablet', $fallback), resolveSize($size, 'mobile', $fallback))}

  transform: ${({ $side, $isOpen }) => getTransform($side, $isOpen)};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: ${({ $transition }) => transitionMap[$transition]};

  /* Trava de segurança: mesmo se alguém passar um valor absurdo (ex: 800px
     fixo) sem pensar em mobile, o painel nunca extrapola a viewport. */
  max-width: 100vw;
  max-height: 100vh;
`

export const DrawerOverlay = styled.div<{
  $isOpen: boolean
  $blur: boolean
  $zIndex: number
}>`
  position: fixed;
  inset: 0;
  z-index: ${({ $zIndex }) => $zIndex - 1};
  background: rgba(0, 0, 0, 0.45);
  ${({ $blur }) => $blur && 'backdrop-filter: blur(4px);'}
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
`
