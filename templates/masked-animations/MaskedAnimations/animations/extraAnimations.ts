import { css, keyframes } from 'styled-components'
import { transitions } from './transitions'

/* Toda animação nova termina com este bloco: quem prefere menos movimento
   recebe o estado final quase instantâneo, sem loops. */
const reduced = css`
  @media (prefers-reduced-motion: reduce) {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
`

const reveal = (animation: ReturnType<typeof css>) => css`
  opacity: 1;
  will-change: transform, opacity;
  ${animation}
  ${reduced}
`
const loop = (animation: ReturnType<typeof css>) => css`
  ${animation}
  ${reduced}
`

const SOFT = 'cubic-bezier(0.22, 1, 0.36, 1)'
const OVERSHOOT = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

/* ---------- keyframes: reveal suave ---------- */
const softFade = keyframes`from{opacity:0}to{opacity:1}`
const glideUp = keyframes`from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}`
const glideDown = keyframes`from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}`
const glideLeft = keyframes`from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none}`
const glideRight = keyframes`from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:none}`
const softScale = keyframes`from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:none}`
const softBlur = keyframes`from{opacity:0;filter:blur(6px)}to{opacity:1;filter:blur(0)}`
const curtain = keyframes`from{opacity:0;clip-path:inset(0 50% 0 50%)}to{opacity:1;clip-path:inset(0 0 0 0)}`

/* ---------- keyframes: reveal marcante ---------- */
const dropBounce = keyframes`
  0%{opacity:0;transform:translateY(-120px)}
  55%{opacity:1;transform:translateY(0)}
  70%{transform:translateY(-22px)}
  85%{transform:translateY(0)}
  93%{transform:translateY(-8px)}
  100%{transform:translateY(0)}`
const swingIn = keyframes`
  0%{opacity:0;transform:perspective(700px) rotateX(-75deg)}
  60%{opacity:1;transform:perspective(700px) rotateX(10deg)}
  100%{transform:perspective(700px) rotateX(0)}`
const stretchIn = keyframes`
  0%{opacity:0;transform:scale(0.2,1.5)}
  50%{opacity:1;transform:scale(1.15,0.9)}
  75%{transform:scale(0.96,1.04)}
  100%{transform:scale(1)}`
const spiralIn = keyframes`
  0%{opacity:0;transform:rotate(-180deg) scale(0.2)}
  100%{opacity:1;transform:rotate(0) scale(1)}`
const tiltRise = keyframes`
  0%{opacity:0;transform:translateY(40px) rotate(-4deg)}
  100%{opacity:1;transform:translateY(0) rotate(0)}`
const zoomSnap = keyframes`
  0%{opacity:0;transform:scale(1.6)}
  70%{opacity:1;transform:scale(0.98)}
  100%{transform:scale(1)}`
const skewSlide = keyframes`
  0%{opacity:0;transform:translateX(-60px) skewX(20deg)}
  70%{opacity:1;transform:translateX(6px) skewX(-4deg)}
  100%{transform:translateX(0) skewX(0)}`

/* ---------- keyframes: contínuas ---------- */
const breathe = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.03)}`
const sway = keyframes`0%,100%{transform:rotate(-1.5deg)}50%{transform:rotate(1.5deg)}`
const wobble = keyframes`
  0%,100%{transform:translateX(0) rotate(0)}
  15%{transform:translateX(-6px) rotate(-4deg)}
  30%{transform:translateX(5px) rotate(3deg)}
  45%{transform:translateX(-4px) rotate(-2deg)}
  60%{transform:translateX(2px) rotate(1deg)}
  75%{transform:translateX(-1px) rotate(0)}`
const heartbeat = keyframes`
  0%,100%{transform:scale(1)}
  14%{transform:scale(1.08)}
  28%{transform:scale(1)}
  42%{transform:scale(1.08)}
  70%{transform:scale(1)}`
const hueShift = keyframes`from{filter:hue-rotate(0deg)}to{filter:hue-rotate(360deg)}`
const glowPulse = keyframes`
  0%{box-shadow:0 0 0 0 color-mix(in srgb, currentColor 45%, transparent)}
  70%{box-shadow:0 0 0 14px transparent}
  100%{box-shadow:0 0 0 0 transparent}`
const softFloat = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}`
const tilt = keyframes`
  0%,100%{transform:perspective(600px) rotateY(-8deg)}
  50%{transform:perspective(600px) rotateY(8deg)}`

/* ---------- keyframes: one-shot ---------- */
const rubberBand = keyframes`
  0%{transform:scale(1)}
  30%{transform:scale(1.25,0.75)}
  40%{transform:scale(0.75,1.25)}
  50%{transform:scale(1.15,0.85)}
  65%{transform:scale(0.95,1.05)}
  75%{transform:scale(1.05,0.95)}
  100%{transform:scale(1)}`
const tada = keyframes`
  0%{transform:scale(1)}
  10%,20%{transform:scale(0.9) rotate(-3deg)}
  30%,50%,70%,90%{transform:scale(1.1) rotate(3deg)}
  40%,60%,80%{transform:scale(1.1) rotate(-3deg)}
  100%{transform:scale(1) rotate(0)}`
const headShake = keyframes`
  0%{transform:translateX(0)}
  20%{transform:translateX(-6px) rotateY(-9deg)}
  40%{transform:translateX(5px) rotateY(7deg)}
  60%{transform:translateX(-3px) rotateY(-5deg)}
  80%{transform:translateX(2px) rotateY(3deg)}
  100%{transform:translateX(0)}`
const flash = keyframes`0%,50%,100%{opacity:1}25%,75%{opacity:0.2}`
const flipSpin = keyframes`from{transform:perspective(700px) rotateY(0)}to{transform:perspective(700px) rotateY(360deg)}`
const swing = keyframes`
  20%{transform:rotate(15deg)}
  40%{transform:rotate(-10deg)}
  60%{transform:rotate(5deg)}
  80%{transform:rotate(-5deg)}
  100%{transform:rotate(0)}`

export const extraAnimations = {
  /* ===== reveal suaves ===== */
  revealSoftFade: reveal(css`
    animation: ${softFade} 0.9s ease-out forwards;
  `),
  revealGlideUp: reveal(css`
    animation: ${glideUp} 1.1s ${SOFT} forwards;
  `),
  revealGlideDown: reveal(css`
    animation: ${glideDown} 1.1s ${SOFT} forwards;
  `),
  revealGlideLeft: reveal(css`
    animation: ${glideLeft} 1.1s ${SOFT} forwards;
  `),
  revealGlideRight: reveal(css`
    animation: ${glideRight} 1.1s ${SOFT} forwards;
  `),
  revealSoftScale: reveal(css`
    animation: ${softScale} 0.9s ${SOFT} forwards;
  `),
  revealSoftBlur: reveal(css`
    animation: ${softBlur} 1s ease-out forwards;
  `),
  revealCurtain: reveal(css`
    animation: ${curtain} 0.9s ${SOFT} forwards;
  `),

  /* ===== reveal marcantes ===== */
  revealDropBounce: reveal(css`
    animation: ${dropBounce} 1.1s ease-out forwards;
  `),
  revealSwingIn: reveal(css`
    transform-origin: top center;
    animation: ${swingIn} 0.9s ${SOFT} forwards;
  `),
  revealStretchIn: reveal(css`
    animation: ${stretchIn} 0.9s ${OVERSHOOT} forwards;
  `),
  revealSpiralIn: reveal(css`
    animation: ${spiralIn} 0.9s ${SOFT} forwards;
  `),
  revealTiltRise: reveal(css`
    animation: ${tiltRise} 0.8s ${OVERSHOOT} forwards;
  `),
  revealZoomSnap: reveal(css`
    animation: ${zoomSnap} 0.7s ${SOFT} forwards;
  `),
  revealSkewSlide: reveal(css`
    animation: ${skewSlide} 0.85s ${SOFT} forwards;
  `),

  /* ===== contínuas ===== */
  continuousBreathe: loop(css`
    animation: ${breathe} 6s ease-in-out infinite;
  `),
  continuousSway: loop(css`
    transform-origin: top center;
    animation: ${sway} 5s ease-in-out infinite;
  `),
  continuousWobble: loop(css`
    animation: ${wobble} 2.4s ease-in-out infinite;
  `),
  continuousHeartbeat: loop(css`
    animation: ${heartbeat} 1.8s ease-in-out infinite;
  `),
  continuousHueShift: loop(css`
    animation: ${hueShift} 10s linear infinite;
  `),
  continuousGlowPulse: loop(css`
    animation: ${glowPulse} 2s ease-out infinite;
  `),
  continuousSoftFloat: loop(css`
    animation: ${softFloat} 6s ease-in-out infinite;
  `),
  continuousTilt: loop(css`
    animation: ${tilt} 6s ease-in-out infinite;
  `),

  /* ===== one-shot ===== */
  oneShotRubberBand: loop(css`
    animation: ${rubberBand} 0.9s ease-out;
  `),
  oneShotTada: loop(css`
    animation: ${tada} 1s ease-in-out;
  `),
  oneShotHeadShake: loop(css`
    animation: ${headShake} 0.8s ease-in-out;
  `),
  oneShotFlash: loop(css`
    animation: ${flash} 0.9s linear;
  `),
  oneShotFlipSpin: loop(css`
    animation: ${flipSpin} 0.9s ${SOFT};
  `),
  oneShotSwing: loop(css`
    transform-origin: top center;
    animation: ${swing} 1s ease-in-out;
  `),

  /* ===== controladas (só opacidade/transform: não mexem em altura) ===== */
  controlledSoftFade: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    pointer-events: ${({ $isOn }) => ($isOn ? 'auto' : 'none')};
    ${transitions.premium}
  `,
  controlledSoftRise: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    transform: ${({ $isOn }) => ($isOn ? 'translateY(0)' : 'translateY(10px)')};
    pointer-events: ${({ $isOn }) => ($isOn ? 'auto' : 'none')};
    ${transitions.premium}
  `,
  controlledScaleSoft: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    transform: ${({ $isOn }) => ($isOn ? 'scale(1)' : 'scale(0.97)')};
    pointer-events: ${({ $isOn }) => ($isOn ? 'auto' : 'none')};
    ${transitions.premium}
  `
}
