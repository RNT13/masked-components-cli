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
  shineLoop,
  skeletonPulse,
  skeletonShimmer,
  spin,
  starFlash
} from './keyframes'
import { overlayBase } from './transitions'

export const continuousAnimations = {
  continuousSpin: css`
    animation: ${spin} 1s linear infinite;
  `,
  continuousPulse: css`
    animation: ${pulse} 1.2s ease-in-out infinite;
  `,
  continuousBounce: css`
    animation: ${bounce} 1.6s cubic-bezier(0.28, 0.84, 0.42, 1) infinite;
  `,
  continuousFloat: css`
    animation: ${float} 3s ease-in-out infinite;
  `,
  continuousJumpRotate: css`
    animation: ${jumpRotate} 0.6s ease-in-out;
  `,
  continuousHorizontalLine: css`
    animation: ${horizontalLine} 1.2s ease-in-out infinite;
  `,
  continuousShakeX: css`
    animation: ${shakeX} 0.4s ease-in-out;
  `,

  continuousSkeleton: css`
    position: relative;
    overflow: hidden;
    isolation: isolate;
    border-radius: inherit;

    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
      linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.04) 0%,
        rgba(255, 255, 255, 0.08) 20%,
        rgba(255, 255, 255, 0.16) 50%,
        rgba(255, 255, 255, 0.08) 80%,
        rgba(255, 255, 255, 0.04) 100%
      );

    background-size:
      100% 100%,
      220% 100%;
    animation: ${skeletonPulse} 1.6s ease-in-out infinite;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      transform: translateX(-120%);
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.08) 35%,
        rgba(255, 255, 255, 0.22) 50%,
        rgba(255, 255, 255, 0.08) 65%,
        transparent 100%
      );
      animation: ${skeletonShimmer} 1.35s ease-in-out infinite;
      pointer-events: none;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08), transparent 70%);
      opacity: 0.45;
      pointer-events: none;
    }

    @media (prefers-reduced-motion: reduce) {
      animation: none;

      &::before {
        animation: none;
      }
    }
  `,

  continuousGlow: css`
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

  continuousGlowDiagonal: css`
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

  continuousGlowGold: css`
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

  continuousGlowPurple: css`
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

  continuousShine: css`
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

  continuousGoldBorderPremium: css`
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

      animation: ${starFlash} 6s reverse infinite;
    }
  `,

  continuousSilverBorderPremium: css`
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

  continuousRocketLaunchLoop: css`
    animation: ${rocketTrajectory} 6s ease-in-out infinite;
  `,

  continuousLightningStrikeLoop: css`
    animation: ${lightningStrikeMove} 5s ease-in-out infinite;
  `,

  continuousBackGlow: css`
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

  continuousRocketLaunch: css`
    animation: ${rocketTrajectory} 4s cubic-bezier(0.22, 1.4, 0.36, 1);
  `
}
