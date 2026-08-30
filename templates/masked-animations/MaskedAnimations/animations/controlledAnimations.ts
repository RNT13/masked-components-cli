import { css } from 'styled-components'
import { transitions } from './transitions'

export const controlledAnimations = {
  controlledFadeInOut: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    pointer-events: ${({ $isOn }) => ($isOn ? 'auto' : 'none')};
    ${transitions.drawer}
  `,

  controlledSlideFromLeft: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'translateX(0)' : 'translateX(-16px)')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    pointer-events: ${({ $isOn }) => ($isOn ? 'auto' : 'none')};
    ${transitions.drawer}
  `,

  controlledSlideFromRight: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'translateX(0)' : 'translateX(16px)')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    pointer-events: ${({ $isOn }) => ($isOn ? 'auto' : 'none')};
    ${transitions.drawer}
  `,

  controlledSlideFromTop: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'translateY(0)' : 'translateY(-16px)')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    pointer-events: ${({ $isOn }) => ($isOn ? 'auto' : 'none')};
    ${transitions.drawer}
  `,

  controlledSlideFromBottom: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'translateY(0)' : 'translateY(16px)')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    pointer-events: ${({ $isOn }) => ($isOn ? 'auto' : 'none')};
    ${transitions.drawer}
  `,

  controlledZoomInOut: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'scale(1)' : 'scale(0.95)')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    ${transitions.drawer}
  `,

  controlledDrawer: css<{ $isOn?: boolean }>`
    overflow: hidden;
    max-height: ${({ $isOn }) => ($isOn ? '1500px' : '0')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    transform: ${({ $isOn }) => ($isOn ? 'translateY(0)' : 'translateY(-6px)')};
    pointer-events: ${({ $isOn }) => ($isOn ? 'auto' : 'none')};
    ${transitions.drawer}
  `,

  controlledColapse: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'scaleY(1)' : 'scaleY(0)')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    pointer-events: ${({ $isOn }) => ($isOn ? 'auto' : 'none')};
    ${transitions.drawer}
  `,

  controlledHideLeft: css<{ $isOn?: boolean }>`
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
  `,

  controlledFromLeftSoft: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    transform: ${({ $isOn }) => ($isOn ? 'translateX(0px)' : 'translateX(-22px)')};

    ${transitions.bounce}
  `,

  controlledFromRightSoft: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    transform: ${({ $isOn }) => ($isOn ? 'translateX(0px)' : 'translateX(22px)')};

    ${transitions.bounce}
  `,

  controlledFromTopSoft: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    transform: ${({ $isOn }) => ($isOn ? 'translateY(0px)' : 'translateY(-18px)')};

    ${transitions.bounce}
  `,

  controlledFromBottomSoft: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    transform: ${({ $isOn }) => ($isOn ? 'translateY(0px)' : 'translateY(18px)')};

    ${transitions.bounce}
  `,

  controlledFloatLeft: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'translateX(0)' : 'translateX(-30px)')};

    ${transitions.premium}
  `,

  controlledFloatRight: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'translateX(0)' : 'translateX(30px)')};

    ${transitions.premium}
  `,

  controlledFloatTop: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'translateY(-20px)' : 'translateY(0)')};

    ${transitions.premium}
  `,

  controlledFloatBottom: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'translateY(0)' : 'translateY(20px)')};

    ${transitions.premium}
  `,

  controlledPopSoft: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'scale(1)' : 'scale(0.92)')};

    ${transitions.premium}
  `,

  controlledPopBounce: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    max-height: ${({ $isOn }) => ($isOn ? '600px' : '0')};
    transform: ${({ $isOn }) => ($isOn ? 'scale(1)' : 'scale(0.86)')};

    ${transitions.bounce}
  `,

  controlledBlurIn: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    filter: ${({ $isOn }) => ($isOn ? 'blur(0px)' : 'blur(8px)')};
    transform: ${({ $isOn }) => ($isOn ? 'scale(1)' : 'scale(0.96)')};

    ${transitions.premium}
  `,

  controlledFadeLift: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    transform: ${({ $isOn }) => ($isOn ? 'translateY(0px)' : 'translateY(12px)')};

    ${transitions.premium}
  `,

  controlledDrawerSoft: css<{ $isOn?: boolean }>`
    overflow: hidden;
    max-height: ${({ $isOn }) => ($isOn ? '1500px' : '0')};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    transform: ${({ $isOn }) => ($isOn ? 'translateY(0)' : 'translateY(-10px)')};

    pointer-events: ${({ $isOn }) => ($isOn ? 'auto' : 'none')};

    ${transitions.premium}
  `
}
