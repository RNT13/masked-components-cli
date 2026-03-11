import { css } from 'styled-components'
import {
  bounce,
  float,
  glowDiagonalLoop,
  horizontalLine,
  jumpRotate,
  lightningStrikeMove,
  pulse,
  pulseGlow,
  rocketTrajectory,
  rotateGoldAngle,
  rotateSilverAngle,
  shakeX,
  shimmer,
  shineLoop,
  spin,
  starFlash
} from './keyframes'
import { overlayBase } from './transitions'

export const continuousAnimations = {
  spin: css`
    animation: ${spin} 1s linear infinite;
  `,
  pulse: css`
    animation: ${pulse} 1.2s ease-in-out infinite;
  `,
  bounce: css`
    animation: ${bounce} 1.6s cubic-bezier(0.28, 0.84, 0.42, 1) infinite;
  `,
  float: css`
    animation: ${float} 3s ease-in-out infinite;
  `,
  jumpRotate: css`
    animation: ${jumpRotate} 0.6s ease-in-out;
  `,
  horizontalLine: css`
    animation: ${horizontalLine} 1.2s ease-in-out infinite;
  `,
  shakeX: css`
    animation: ${shakeX} 0.4s ease-in-out;
  `,

  skeleton: css`
    ${overlayBase}
    background: rgba(255,255,255,0.06);

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
      transform: translateX(-100%);
      animation: ${shimmer} 1.4s ease-in-out infinite;
    }
  `,

  glow: css`
    ${overlayBase}
    &::before {
      content: '';

      position: absolute;
      top: -60%;
      left: -60%;
      width: 220%;
      height: 220%;
      border-radius: inherit;

      background: linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.6), transparent 70%);

      filter: blur(16px);
      mix-blend-mode: screen;

      animation: ${glowDiagonalLoop} 1.2s ease-out forwards;
    }
  `,

  InfinityGlowDiagonal: css`
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
        rgba(200, 200, 200, 0.25) 40%,
        rgba(255, 255, 255, 0.9) 48%,
        #f5f5f5 50%,
        rgba(255, 255, 255, 0.9) 52%,
        rgba(200, 200, 200, 0.25) 60%,
        transparent 70%
      );

      filter: blur(16px);
      mix-blend-mode: screen;

      animation: ${glowDiagonalLoop} 4s ease-in-out infinite;
    }
  `,

  InfinityGlowGold: css`
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
        rgba(255, 215, 0, 0.25) 40%,
        rgba(255, 215, 0, 0.9) 48%,
        #ffffff 50%,
        rgba(255, 215, 0, 0.9) 52%,
        rgba(255, 215, 0, 0.25) 60%,
        transparent 70%
      );

      filter: blur(16px);
      mix-blend-mode: screen;

      animation: ${glowDiagonalLoop} 4s ease-in-out infinite;
    }
  `,

  InfinityGlowPurple: css`
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
        rgba(170, 0, 255, 0.25) 40%,
        rgba(170, 0, 255, 0.9) 48%,
        #ffffff 50%,
        rgba(170, 0, 255, 0.9) 52%,
        rgba(170, 0, 255, 0.25) 60%,
        transparent 70%
      );

      filter: blur(16px);
      mix-blend-mode: screen;

      animation: ${glowDiagonalLoop} 4s ease-in-out infinite;
    }
  `,

  shineInfinite: css`
    ${overlayBase}
    &::before {
      content: '';
      position: absolute;
      inset: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(90deg, transparent 30%, rgba(255, 255, 255, 0.45), transparent 70%);
      animation: ${shineLoop} 5s ease-in-out infinite;
    }
  `,

  goldBorderPremium: css`
    position: relative;
    isolation: isolate;

    &::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: inherit;
      padding: 2px;

      --gold-angle: 0deg;

      background: conic-gradient(
        from var(--gold-angle),
        transparent 0deg,
        transparent 270deg,

        rgba(255, 215, 0, 0.15) 285deg,
        rgba(255, 215, 0, 0.6) 295deg,

        #ffd700 302deg,

        #ffffff 308deg,
        #ffffff 312deg,
        #ffffff 316deg,

        #ffd700 322deg,

        rgba(255, 215, 0, 0.7) 330deg,
        rgba(255, 215, 0, 0.25) 340deg,

        transparent 360deg
      );

      animation: ${rotateGoldAngle} 6s linear infinite;

      -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;

      mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
      mask-composite: exclude;

      pointer-events: none;

      filter: drop-shadow(0 0 8px rgba(255, 215, 0, 1)) drop-shadow(0 0 24px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 60px rgba(255, 215, 0, 0.6));
    }

    &::after {
      content: '';
      position: absolute;

      width: 18px;
      height: 18px;

      top: 0;
      right: 0;

      transform: translate(50%, -50%);
      pointer-events: none;

      background:
        radial-gradient(circle, #ffffff 0%, #ffd700 40%, transparent 70%), linear-gradient(#ffffff, #ffffff), linear-gradient(#ffffff, #ffffff);

      background-size:
        100% 100%,
        2px 18px,
        18px 2px;

      background-position: center;
      background-repeat: no-repeat;

      filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 12px rgba(255, 215, 0, 0.6));

      opacity: 0;

      animation: ${starFlash} 6s linear infinite;
    }
  `,

  silverBorderPremium: css`
    position: relative;
    isolation: isolate;

    &::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: inherit;
      padding: 2px;

      --silver-angle: 0deg;

      background: conic-gradient(
        from var(--silver-angle),
        transparent 0deg,
        transparent 280deg,

        rgba(255, 255, 255, 0.2) 295deg,

        #e6e6e6 305deg,
        #ffffff 312deg,
        #ffffff 318deg,
        #dcdcdc 325deg,

        rgba(255, 255, 255, 0.25) 340deg,
        transparent 360deg
      );

      animation: ${rotateSilverAngle} 7s linear infinite;

      -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;

      mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
      mask-composite: exclude;

      pointer-events: none;

      filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 14px rgba(255, 255, 255, 0.4))
        drop-shadow(0 0 24px rgba(255, 255, 255, 0.2));
    }
  `,

  rocketLaunchLoop: css`
    animation: ${rocketTrajectory} 6s ease-in-out infinite;
  `,

  lightningStrikeLoop: css`
    animation: ${lightningStrikeMove} 5s ease-in-out infinite;
  `,

  backGlow: css`
    position: relative;
    z-index: 1;

    &::after {
      content: '';
      position: absolute;
      inset: -8px;
      border-radius: inherit;

      background: rgba(0, 200, 255, 0.6);
      filter: blur(18px);

      z-index: -1;

      animation: ${pulseGlow} 2.4s ease-in-out infinite;
    }
  `,

  rocketLaunch: css`
    animation: ${rocketTrajectory} 4s cubic-bezier(0.22, 1.4, 0.36, 1);
  `
}
