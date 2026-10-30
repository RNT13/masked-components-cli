// Keyframes compartilhados das animações Masked.
// Regras: dots -> dotsLoop (canônico), fadeOutDown -> fadeInDown (canônico),
// ambos com alias @deprecated removidos na próxima major (E.20/E.21).
// Compatível com TypeScript >= 4.9.

import { keyframes } from "styled-components";

export const spin = keyframes`  
  to { transform: rotate(360deg); }  
`;

export const skeletonPulse = keyframes`  
  0%, 100% { opacity: 0.72; }  
  50% { opacity: 1; }  
`;

export const skeletonShimmer = keyframes`  
  0% { transform: translateX(-120%); }  
  100% { transform: translateX(120%); }  
`;

export const pulseGlow = keyframes`  
  0% { transform: scale(0.95); opacity: 0.4; }  
  50% { transform: scale(1.12); opacity: 0.9; }  
  100% { transform: scale(0.95); opacity: 0.4; }  
`;

export const rotateFullX = keyframes`  
  0% { transform: rotateX(0deg); }  
  100% { transform: rotateX(360deg); }  
`;

export const rotateFullY = keyframes`  
  0% { transform: rotateY(0deg); }  
  100% { transform: rotateY(360deg); }  
`;

export const pulse = keyframes`  
  0% { opacity: 0.6; }  
  50% { opacity: 1; }  
  100% { opacity: 0.6; }  
`;

export const bounce = keyframes`  
  0% { transform: translateY(0) scaleY(1); }  
  15% { transform: translateY(-14px) scaleY(1.05); }  
  30% { transform: translateY(0) scaleY(0.92); }  
  40% { transform: translateY(-6px) scaleY(1.02); }  
  55% { transform: translateY(0) scaleY(0.97); }  
  65% { transform: translateY(-2px) scaleY(1.01); }  
  75%, 100% { transform: translateY(0) scaleY(1); }  
`;

export const float = keyframes`  
  0% { transform: translateY(0px); }  
  50% { transform: translateY(-8px); }  
  100% { transform: translateY(0px); }  
`;

export const jumpRotate = keyframes`  
  0% { transform: rotate(0deg); }  
  25% { transform: rotate(12deg); }  
  50% { transform: rotate(-12deg); }  
  75% { transform: rotate(6deg); }  
  100% { transform: rotate(0deg); }  
`;

export const shimmer = keyframes`  
  0% { transform: translateX(-100%); }  
  100% { transform: translateX(100%); }  
`;

export const glowDiagonalLoop = keyframes`  
  0% { transform: translate(-120%, -120%) rotate(45deg) scale(0.9); opacity: 0; }  
  10% { opacity: 1; }  
  50% { transform: translate(40%, 40%) rotate(45deg) scale(2); opacity: 0.7; }  
  100% { transform: translate(120%, 120%) rotate(45deg) scale(0.9); opacity: 0; }  
`;

export const shineLoop = keyframes`  
  0% { transform: translateX(-120%); opacity: 0; }  
  10% { opacity: 1; }  
  30%, 100% { transform: translateX(120%); opacity: 0; }  
`;

export const fadeInUp = keyframes`  
  from { opacity: 0; transform: translateY(16px); }  
  to { opacity: 1; transform: translateY(0); }  
`;

export const fadeInLeft = keyframes`  
  from { opacity: 0; transform: translateX(-16px); }  
  to { opacity: 1; transform: translateX(0); }  
`;

export const fadeInRight = keyframes`  
  from { opacity: 0; transform: translateX(16px); }  
  to { opacity: 1; transform: translateX(0); }  
`;

/**
 * Fade-in descendo de cima (translateY -16px -> 0). Nome canônico.
 * @example animation: ${fadeInDown} 0.4s ease;
 */
export const fadeInDown = keyframes`  
  from { opacity: 0; transform: translateY(-16px); }  
  to { opacity: 1; transform: translateY(0); }  
`;

/**
 * @deprecated Use `fadeInDown` — o nome antigo descrevia a direção errada.
 * Removido na próxima versão major.
 */
export const fadeOutDown = fadeInDown;

export const fadeInUpRotate = keyframes`  
  from { opacity: 0; transform: translateY(16px) rotate(10deg); }  
  to { opacity: 1; transform: translateY(0) rotate(0); }  
`;

export const horizontalLine = keyframes`  
  0% { width: 0%; }  
  50% { width: 60%; }  
  100% { width: 100%; }  
`;

export const shakeX = keyframes`  
  0% { transform: translateX(0); }  
  15% { transform: translateX(-4px); }  
  30% { transform: translateX(4px); }  
  45% { transform: translateX(-3px); }  
  60% { transform: translateX(3px); }  
  75% { transform: translateX(-2px); }  
  90% { transform: translateX(2px); }  
  100% { transform: translateX(0); }  
`;

/**
 * Reticências animadas ("." -> ".." -> "...") para uso em pseudo-elementos.
 * @example &::after { content: ''; animation: ${dotsLoop} 1.2s steps(1) infinite; }
 */
export const dotsLoop = keyframes`  
  0% { content: ''; }  
  25% { content: '.'; }  
  50% { content: '..'; }  
  75% { content: '...'; }  
  100% { content: ''; }  
`;

/**
 * @deprecated Use `dotsLoop`. Removido na próxima versão major.
 */
export const dots = dotsLoop;

export const slideBounceRight = keyframes`  
  0% { opacity: 0; transform: translateX(-80px); }  
  60% { opacity: 1; transform: translateX(12px); }  
  80% { transform: translateX(-6px); }  
  100% { transform: translateX(0); }  
`;

export const slideBounceLeft = keyframes`  
  0% { opacity: 0; transform: translateX(80px); }  
  60% { opacity: 1; transform: translateX(-12px); }  
  80% { transform: translateX(6px); }  
  100% { transform: translateX(0); }  
`;

export const slideBounceUp = keyframes`  
  0% { opacity: 0; transform: translateY(80px); }  
  60% { opacity: 1; transform: translateY(-12px); }  
  80% { transform: translateY(6px); }  
  100% { transform: translateY(0); }  
`;

export const slideImpactRight = keyframes`  
  0% { opacity: 0; transform: translateX(-160px) scaleX(0.92); }  
  45% { opacity: 1; transform: translateX(0px) scaleX(1.08); }  
  60% { transform: translateX(-14px) scaleX(0.97); }  
  72% { transform: translateX(6px) scaleX(1.02); }  
  85% { transform: translateX(-2px); }  
  100% { transform: translateX(0) scaleX(1); }  
`;

export const slideImpactLeft = keyframes`  
  0% { opacity: 0; transform: translateX(160px) scaleX(0.92); }  
  45% { opacity: 1; transform: translateX(0px) scaleX(1.08); }  
  60% { transform: translateX(14px) scaleX(0.97); }  
  72% { transform: translateX(-6px) scaleX(1.02); }  
  85% { transform: translateX(2px); }  
  100% { transform: translateX(0) scaleX(1); }  
`;

export const slideImpactUp = keyframes`  
  0% { opacity: 0; transform: translateY(160px) scaleY(0.9); }  
  45% { opacity: 1; transform: translateY(0px) scaleY(1.08); }  
  60% { transform: translateY(14px) scaleY(0.96); }  
  72% { transform: translateY(-6px) scaleY(1.02); }  
  85% { transform: translateY(2px); }  
  100% { transform: translateY(0) scaleY(1); }  
`;

export const blurIn = keyframes`  
  0% { opacity: 0; filter: blur(12px); transform: scale(0.98); }  
  100% { opacity: 1; filter: blur(0); transform: scale(1); }  
`;

export const popElastic = keyframes`  
  0% { opacity: 0; transform: scale(0.6); }  
  60% { opacity: 1; transform: scale(1.12); }  
  75% { transform: scale(0.96); }  
  100% { transform: scale(1); }  
`;

export const zoomFromDeep = keyframes`  
  0% { opacity: 0; transform: scale(0.7) translateY(40px); }  
  70% { opacity: 1; transform: scale(1.05) translateY(-8px); }  
  100% { transform: scale(1) translateY(0); }  
`;

export const rotateDrop = keyframes`  
  0% { opacity: 0; transform: translateY(-40px) rotate(-8deg); }  
  60% { opacity: 1; transform: translateY(8px) rotate(4deg); }  
  100% { transform: translateY(0) rotate(0); }  
`;

export const magneticRise = keyframes`  
  0% { opacity: 0; transform: translateY(60px) scale(0.9); }  
  80% { opacity: 1; transform: translateY(-6px) scale(1.02); }  
  100% { transform: translateY(0) scale(1); }  
`;

export const softRevealLeft = keyframes`  
  from { opacity: 0; transform: translateX(-22px); }  
  to { opacity: 1; transform: translateX(0); }  
`;

export const softRevealRight = keyframes`  
  from { opacity: 0; transform: translateX(22px); }  
  to { opacity: 1; transform: translateX(0); }  
`;

export const softRevealDown = keyframes`  
  from { opacity: 0; transform: translateY(22px); }  
  to { opacity: 1; transform: translateY(0); }  
`;

export const softRevealUp = keyframes`  
  from { opacity: 0; transform: translateY(-22px); }  
  to { opacity: 1; transform: translateY(0); }  
`;

export const smoothBounceUp = keyframes`  
  0% { opacity: 0; transform: translateY(-34px); }  
  70% { opacity: 1; transform: translateY(4px); }  
  100% { transform: translateY(0); }  
`;

export const smoothBounceDown = keyframes`  
  0% { opacity: 0; transform: translateY(34px); }  
  70% { opacity: 1; transform: translateY(-4px); }  
  100% { transform: translateY(0); }  
`;

export const smoothBounceLeft = keyframes`  
  0% { opacity: 0; transform: translateX(34px); }  
  70% { opacity: 1; transform: translateX(-4px); }  
  100% { transform: translateX(0); }  
`;

export const smoothBounceRight = keyframes`  
  0% { opacity: 0; transform: translateX(-34px); }  
  70% { opacity: 1; transform: translateX(4px); }  
  100% { transform: translateX(0); }  
`;

export const blurRise = keyframes`  
  0% { opacity: 0; filter: blur(10px); transform: translateY(18px) scale(0.97); }  
  100% { opacity: 1; filter: blur(0); transform: translateY(0) scale(1); }  
`;

export const scaleRise = keyframes`  
  0% { opacity: 0; transform: scale(0.82) translateY(20px); }  
  70% { opacity: 1; transform: scale(1.03) translateY(-2px); }  
  100% { transform: scale(1) translateY(0); }  
`;

export const rotateSoftDrop = keyframes`  
  0% { opacity: 0; transform: translateY(-24px) rotate(-5deg); }  
  70% { opacity: 1; transform: translateY(3px) rotate(1deg); }  
  100% { transform: translateY(0) rotate(0); }  
`;

export const cinematicZoom = keyframes`  
  0% { opacity: 0; transform: scale(0.72) translateY(30px); }  
  65% { opacity: 1; transform: scale(1.04) translateY(-4px); }  
  100% { transform: scale(1) translateY(0); }  
`;
