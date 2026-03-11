import { css } from 'styled-components'
import { transitions } from './transitions'

export const controlledAnimations = {
  fadeInOut: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    pointer-events: ${({ $isOn }) => ($isOn ? 'auto' : 'none')};
    ${transitions.drawer}
  `,

  slideFromLeft: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'translateX(0)' : 'translateX(-16px)')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    ${transitions.drawer}
  `,

  slideFromRight: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'translateX(0)' : 'translateX(16px)')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    ${transitions.drawer}
  `,

  slideFromTop: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'translateY(0)' : 'translateY(-16px)')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    ${transitions.drawer}
  `,

  slideFromBottom: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'translateY(0)' : 'translateY(16px)')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    ${transitions.drawer}
  `,

  zoomInOut: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'scale(1)' : 'scale(0.95)')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    ${transitions.drawer}
  `,

  drawer: css<{ $isOn?: boolean }>`
    overflow: hidden;
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    transform: ${({ $isOn }) => ($isOn ? 'translateY(0)' : 'translateY(-6px)')};

    ${transitions.drawer}

    pointer-events: ${({ $isOn }) => ($isOn ? 'auto' : 'none')};
  `,

  colapse: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'scaleY(1)' : 'scaleY(0)')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};

    ${transitions.drawer}
  `,

  hideLeft: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'translateX(0)' : 'translateX(-50%) scale(0.5)')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};

    ${transitions.drawer}

    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 50%;
      width: 50%;
      height: 100%;
      transform: ${({ $isOn }) => ($isOn ? 'translateX(0) scale(1)' : 'translateX(50%) scale(0.5)')};
      opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
      ${transitions.fast}
    }
  `
}
