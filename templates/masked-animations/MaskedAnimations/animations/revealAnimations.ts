import { css } from 'styled-components'
import {
  blurIn,
  blurRise,
  cinematicZoom,
  clipRevealRight,
  clipRevealUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  fadeInUp,
  fadeInUpRotate,
  flipInX,
  flipInY,
  magneticRise,
  popElastic,
  rotateDrop,
  rotateFullX,
  rotateFullY,
  rotateSoftDrop,
  scaleRise,
  slideBounceLeft,
  slideBounceRight,
  slideBounceUp,
  slideImpactLeft,
  slideImpactRight,
  slideImpactUp,
  smoothBounceDown,
  smoothBounceLeft,
  smoothBounceRight,
  smoothBounceUp,
  softInDown,
  softInLeft,
  softInRight,
  softInUp,
  zoomFromDeep
} from './keyframes'

const EASE_STANDARD = 'cubic-bezier(0.22, 1, 0.36, 1)'
const EASE_OVERSHOOT = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
const EASE_BOUNCE = 'cubic-bezier(0.22, 1.4, 0.36, 1)'

const revealHelper = (animation: ReturnType<typeof css>) => css`
  opacity: 1;
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform: translateZ(0);
  ${animation}
`

/* ===========================================================  
   REVEAL — entrada única, sempre com opacidade.  
   Direção no nome = direção do movimento.  
=========================================================== */
export const revealAnimations = {
  /* --- Fade simples --- */
  revealFadeInUp: revealHelper(css`
    animation: ${fadeInUp} 1s ease forwards;
  `),
  revealFadeInDown: revealHelper(css`
    animation: ${fadeInDown} 1s ease forwards;
  `),
  revealFadeInLeft: revealHelper(css`
    animation: ${fadeInLeft} 1s ease forwards;
  `),
  revealFadeInRight: revealHelper(css`
    animation: ${fadeInRight} 1s ease forwards;
  `),
  revealFadeInUpRotate: revealHelper(css`
    animation: ${fadeInUpRotate} 1s ease forwards;
  `),

  /* --- Slide com bounce / impacto --- */
  revealSlideBounceUp: revealHelper(css`
    animation: ${slideBounceUp} 0.9s ${EASE_BOUNCE} forwards;
  `),
  revealSlideBounceLeft: revealHelper(css`
    animation: ${slideBounceLeft} 0.9s ${EASE_BOUNCE} forwards;
  `),
  revealSlideBounceRight: revealHelper(css`
    animation: ${slideBounceRight} 0.9s ${EASE_BOUNCE} forwards;
  `),
  revealSlideImpactUp: revealHelper(css`
    animation: ${slideImpactUp} 1s ${EASE_OVERSHOOT} forwards;
  `),
  revealSlideImpactLeft: revealHelper(css`
    animation: ${slideImpactLeft} 1s ${EASE_OVERSHOOT} forwards;
  `),
  revealSlideImpactRight: revealHelper(css`
    animation: ${slideImpactRight} 1s ${EASE_OVERSHOOT} forwards;
  `),

  /* --- Soft (deslocamento curto, sutil) --- */
  revealSoftInUp: revealHelper(css`
    animation: ${softInUp} 0.65s ${EASE_STANDARD} forwards;
  `),
  revealSoftInDown: revealHelper(css`
    animation: ${softInDown} 0.65s ${EASE_STANDARD} forwards;
  `),
  revealSoftInLeft: revealHelper(css`
    animation: ${softInLeft} 0.65s ${EASE_STANDARD} forwards;
  `),
  revealSoftInRight: revealHelper(css`
    animation: ${softInRight} 0.65s ${EASE_STANDARD} forwards;
  `),

  /* --- Bounce suave (overshoot sutil) --- */
  revealSmoothBounceUp: revealHelper(css`
    animation: ${smoothBounceUp} 0.65s ${EASE_STANDARD} forwards;
  `),
  revealSmoothBounceDown: revealHelper(css`
    animation: ${smoothBounceDown} 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.15) forwards;
  `),
  revealSmoothBounceLeft: revealHelper(css`
    animation: ${smoothBounceLeft} 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.15) forwards;
  `),
  revealSmoothBounceRight: revealHelper(css`
    animation: ${smoothBounceRight} 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.15) forwards;
  `),

  /* --- Blur / scale / zoom --- */
  revealBlurIn: revealHelper(css`
    animation: ${blurIn} 0.9s ease forwards;
  `),
  revealBlurRise: revealHelper(css`
    animation: ${blurRise} 0.75s ${EASE_STANDARD} forwards;
  `),
  revealPopElastic: revealHelper(css`
    animation: ${popElastic} 0.8s ${EASE_OVERSHOOT} forwards;
  `),
  revealScaleRise: revealHelper(css`
    animation: ${scaleRise} 0.75s ${EASE_OVERSHOOT} forwards;
  `),
  revealZoomFromDeep: revealHelper(css`
    animation: ${zoomFromDeep} 1s ${EASE_BOUNCE} forwards;
  `),
  revealCinematicZoom: revealHelper(css`
    animation: ${cinematicZoom} 0.85s ${EASE_BOUNCE} forwards;
  `),

  /* --- Rotação --- */
  revealRotateDrop: revealHelper(css`
    animation: ${rotateDrop} 0.9s ${EASE_BOUNCE} forwards;
  `),
  revealRotateSoftDrop: revealHelper(css`
    animation: ${rotateSoftDrop} 0.75s ${EASE_BOUNCE} forwards;
  `),
  revealFlipX: revealHelper(css`
    animation: ${flipInX} 0.9s ${EASE_STANDARD} forwards;
  `),
  revealFlipY: revealHelper(css`
    animation: ${flipInY} 0.9s ${EASE_STANDARD} forwards;
  `),
  revealSpinX: revealHelper(css`
    animation: ${rotateFullX} 2s ease forwards;
  `),
  revealSpinY: revealHelper(css`
    animation: ${rotateFullY} 2s ease forwards;
  `),

  /* --- Magnético / clip-path --- */
  revealMagneticRise: revealHelper(css`
    animation: ${magneticRise} 1s ${EASE_BOUNCE} forwards;
  `),
  revealClipUp: revealHelper(css`
    animation: ${clipRevealUp} 0.7s ${EASE_STANDARD} forwards;
  `),
  revealClipRight: revealHelper(css`
    animation: ${clipRevealRight} 0.7s ${EASE_STANDARD} forwards;
  `),

  /* ----- Aliases depreciados (remover na 3.0) ----- */
  /** @deprecated use `revealFadeInDown` */
  revealFadeOutDown: revealHelper(css`
    animation: ${fadeInDown} 1s ease forwards;
  `)
}
