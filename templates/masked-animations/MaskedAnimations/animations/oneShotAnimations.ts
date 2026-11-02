import { css } from 'styled-components'
import {
  glowDiagonalLoop,
  jumpRotate,
  lightningStrikeMove,
  rocketTrajectory,
  shakeX
} from './keyframes'
import { overlayBase } from './transitions'

/* ===========================================================  
   ONE-SHOT — disparam uma vez (feedback, entrada dramática).  
   Sem `infinite`: para loops use `continuousAnimations`.  
   Prefixo obrigatório: `oneShot*`  
=========================================================== */
export const oneShotAnimations = {
  oneShotJumpRotate: css`
    animation: ${jumpRotate} 0.6s ease-in-out;
  `,

  oneShotShakeX: css`
    animation: ${shakeX} 0.4s ease-in-out;
  `,

  oneShotRocketLaunch: css`
    animation: ${rocketTrajectory} 4s cubic-bezier(0.22, 1.4, 0.36, 1);
  `,

  oneShotLightningStrike: css`
    animation: ${lightningStrikeMove} 5s ease-in-out;
  `,

  /** Varredura de brilho diagonal única (movida de continuous —
   *  `forwards` sem infinite é one-shot, não loop). */
  oneShotGlowSweep: css`
    ${overlayBase}
    &::before {
      content: '';
      position: absolute;
      top: -60%;
      left: -60%;
      width: 220%;
      height: 220%;
      border-radius: inherit;

      background: linear-gradient(
        120deg,
        transparent 30%,
        rgba(255, 255, 255, 0.6),
        transparent 70%
      );

      filter: blur(16px);
      mix-blend-mode: screen;

      animation: ${glowDiagonalLoop} 1.2s ease-out forwards;
    }
  `
}
