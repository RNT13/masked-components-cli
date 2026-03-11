import { keyframes } from 'styled-components'

export const spin = keyframes`
    to { transform: rotate(360deg); }
`

export const starFlash = keyframes`
  0%,70% {
    opacity:0;
    transform:translate(50%,-50%) scale(.2);
  }

  74% {
    opacity:1;
    transform:translate(50%,-50%) scale(1);
  }

  78% {
    opacity:1;
    transform:translate(50%,-50%) scale(1.2);
  }

  82%,100% {
    opacity:0;
    transform:translate(50%,-50%) scale(.3);
  }
`

export const pulseGlow = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.4;
  }

  50% {
    transform: scale(1.12);
    opacity: 0.9;
  }

  100% {
    transform: scale(0.95);
    opacity: 0.4;
  }
`

export const rocketTrajectory = keyframes`
  /* Surge do canto inferior esquerdo */
  0% {
    transform: translate(-700px, 700px) scale(0.85) rotate(-8deg);
    opacity: 0;
  }

  /* Entrada suave até o centro */
  10% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 1;
  }

  /* Fica no centro respirando levemente */
  15% { transform: translate(-8px, -4px) rotate(-5deg); }
  25% { transform: translate(6px, 3px) rotate(-5deg); }
  36% { transform: translate(-8px, -4px) rotate(-5deg); }
  45% { transform: translate(6px, 3px) rotate(-5deg); }
  55% { transform: translate(-4px, -2px) rotate(-5deg); }
  60% { transform: translate(4px, 2px) rotate(-5deg); }

  /* Volta para posição neutra antes da ignição */
  70% {
    transform: translate(-10px, 0) scale(1.05) rotate(-6deg);
  }

  /* Aceleração progressiva */
  80% {
    transform: translate(150px, -150px) scale(1.5) rotate(8deg);
  }

  /* Disparo final */
  100% {
    transform: translate(100px, -100px) scale(2) rotate(18deg);
    opacity: 1;
  }
`

export const lightningStrikeMove = keyframes`
  /* Começa fora da tela */
  0% {
    transform: translate(150px, -150px) rotate(15deg);
    opacity: 0;
  }

  /* Cai já tremendo */
  10% {
    transform: translate(0px, 0px) rotate(0deg);
    opacity: 1;
  }

  /* Tremida FORTE e longa */
  12% { transform: translate(-8px, 3px) rotate(-3deg); }
  15% { transform: translate(8px, -3px) rotate(3deg); }
  18% { transform: translate(-4px, 2px) rotate(-2deg); }
  21% { transform: translate(4px, -2px) rotate(2deg); }
  24% { transform: translate(-3px, 1px) rotate(-3deg); }
  27% { transform: translate(3px, -1px) rotate(3deg); }

  /* Continua tremendo até 65% */
  35% { transform: translate(-5px, 0px) rotate(-2deg) scale(0.98); }
  40% { transform: translate(3px, 0px) rotate(2deg) scale(1.02); }
  45% { transform: translate(-4px, 1px) rotate(-1deg) scale(0.99); }
  50% { transform: translate(2px, -1px) rotate(1deg) scale(1.01); }
  55% { transform: translate(-3px, 0px) rotate(-1deg) scale(0.98); }
  60% { transform: translate(1px, 0px) rotate(1deg) scale(1.03); }
  65% { transform: translate(0, 0) rotate(0deg) scale(1); }

  /* Começa a desaparecer */
  75% {
    opacity: 0.6;
    transform: scale(0.9);
  }

  85% {
    opacity: 0.0;
    transform: scale(0.8);
  }

  /* Quase nada de tempo invisível */
  100% {
    opacity: 0;
    transform: translate(150px, -150px) scale(0.8);
  }
`

export const rotateFullX = keyframes`
  0% {
    transform: rotateX(0deg);
  }

  100% {
    transform: rotateX(360deg);
  }
`

export const rotateFullY = keyframes`
  0% {
    transform: rotateY(0deg);
  }

  100% {
    transform: rotateY(360deg);
  }
`

export const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`

export const rotateGoldAngle = keyframes`
  from {
    --gold-angle: 0deg;
  }
  to {
    --gold-angle: 360deg;
  }
`

export const rotateSilverAngle = keyframes`
  from {
    --silver-angle: 0deg;
  }
  to {
    --silver-angle: 360deg;
  }
`

export const bounce = keyframes`
  0% {
    transform: translateY(0) scaleY(1);
  }

  15% {
    transform: translateY(-14px) scaleY(1.05);
  }

  30% {
    transform: translateY(0) scaleY(0.92);
  }

  40% {
    transform: translateY(-6px) scaleY(1.02);
  }

  55% {
    transform: translateY(0) scaleY(0.97);
  }

  65% {
    transform: translateY(-2px) scaleY(1.01);
  }

  75%,
  100% {
    transform: translateY(0) scaleY(1);
  }
`

export const float = keyframes`
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-8px);
  }

  100% {
    transform: translateY(0px);
  }
`

export const jumpRotate = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(12deg); }
  50% { transform: rotate(-12deg); }
  75% { transform: rotate(6deg); }
  100% { transform: rotate(0deg); }
`

export const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`

export const glowDiagonalLoop = keyframes`
  0% {
    transform: translate(-120%, -120%) rotate(45deg) scale(0.9);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translate(40%, 40%) rotate(45deg) scale(2);
    opacity: 0.7;
  }
  100% {
    transform: translate(120%, 120%) rotate(45deg) scale(0.9);
    opacity: 0;
  }
`

export const shineLoop = keyframes`
  0% { transform: translateX(-120%); opacity: 0; }
  10% { opacity: 1; }
  30%,100% { transform: translateX(120%); opacity: 0; }
`

export const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`

export const fadeInLeft = keyframes`
  from { opacity: 0; transform: translateX(-16px); }
  to { opacity: 1; transform: translateX(0); }
`

export const fadeInRight = keyframes`
  from { opacity: 0; transform: translateX(16px); }
  to { opacity: 1; transform: translateX(0); }
`

export const fadeOutDown = keyframes`
  from { opacity: 0; transform: translateY(-16px); }
  to { opacity: 1; transform: translateY(0); }
`

export const fadeInUpRotate = keyframes`
  from { opacity: 0; transform: translateY(16px) rotate(10deg); }
  to { opacity: 1; transform: translateY(0) rotate(0); }
`

export const horizontalLine = keyframes`
  0% { width: 0%; }
  50% { width: 60%; }
  100% { width: 100%; }
`

export const shakeX = keyframes`
  0% { transform: translateX(0); }
  15% { transform: translateX(-4px); }
  30% { transform: translateX(4px); }
  45% { transform: translateX(-3px); }
  60% { transform: translateX(3px); }
  75% { transform: translateX(-2px); }
  90% { transform: translateX(2px); }
  100% { transform: translateX(0); }
`

export const dots = keyframes`
  0% { content: ''; }
  25% { content: '.'; }
  50% { content: '..'; }
  75% { content: '...'; }
  100% { content: ''; }
`

export const slideBounceRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-80px);
  }

  60% {
    opacity: 1;
    transform: translateX(12px);
  }

  80% {
    transform: translateX(-6px);
  }

  100% {
    transform: translateX(0);
  }
`

export const slideBounceLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(80px);
  }

  60% {
    opacity: 1;
    transform: translateX(-12px);
  }

  80% {
    transform: translateX(6px);
  }

  100% {
    transform: translateX(0);
  }
`

export const slideBounceUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(80px);
  }

  60% {
    opacity: 1;
    transform: translateY(-12px);
  }

  80% {
    transform: translateY(6px);
  }

  100% {
    transform: translateY(0);
  }
`

export const slideImpactRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-160px) scaleX(0.92);
  }

  45% {
    opacity: 1;
    transform: translateX(0px) scaleX(1.08);
  }

  60% {
    transform: translateX(-14px) scaleX(0.97);
  }

  72% {
    transform: translateX(6px) scaleX(1.02);
  }

  85% {
    transform: translateX(-2px);
  }

  100% {
    transform: translateX(0) scaleX(1);
  }
`

export const slideImpactLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(160px) scaleX(0.92);
  }

  45% {
    opacity: 1;
    transform: translateX(0px) scaleX(1.08);
  }

  60% {
    transform: translateX(14px) scaleX(0.97);
  }

  72% {
    transform: translateX(-6px) scaleX(1.02);
  }

  85% {
    transform: translateX(2px);
  }

  100% {
    transform: translateX(0) scaleX(1);
  }
`

export const slideImpactUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(160px) scaleY(0.9);
  }

  45% {
    opacity: 1;
    transform: translateY(0px) scaleY(1.08);
  }

  60% {
    transform: translateY(14px) scaleY(0.96);
  }

  72% {
    transform: translateY(-6px) scaleY(1.02);
  }

  85% {
    transform: translateY(2px);
  }

  100% {
    transform: translateY(0) scaleY(1);
  }
`

export const blurIn = keyframes`
  0% {
    opacity: 0;
    filter: blur(12px);
    transform: scale(0.98);
  }

  100% {
    opacity: 1;
    filter: blur(0);
    transform: scale(1);
  }
`

export const popElastic = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.6);
  }

  60% {
    opacity: 1;
    transform: scale(1.12);
  }

  75% {
    transform: scale(0.96);
  }

  100% {
    transform: scale(1);
  }
`

export const zoomFromDeep = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.7) translateY(40px);
  }

  70% {
    opacity: 1;
    transform: scale(1.05) translateY(-8px);
  }

  100% {
    transform: scale(1) translateY(0);
  }
`

export const rotateDrop = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-40px) rotate(-8deg);
  }

  60% {
    opacity: 1;
    transform: translateY(8px) rotate(4deg);
  }

  100% {
    transform: translateY(0) rotate(0);
  }
`

export const magneticRise = keyframes`
  0% {
    opacity: 0;
    transform: translateY(60px) scale(0.9);
  }

  80% {
    opacity: 1;
    transform: translateY(-6px) scale(1.02);
  }

  100% {
    transform: translateY(0) scale(1);
  }
`
