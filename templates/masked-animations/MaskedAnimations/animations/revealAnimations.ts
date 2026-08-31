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
  softRevealDown,  
  softRevealLeft,  
  softRevealRight,  
  softRevealUp,  
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
  
export const revealAnimations = {  
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
  
  revealSlideBounceRight: revealHelper(css`  
    animation: ${slideBounceRight} 0.9s ${EASE_BOUNCE} forwards;  
  `),  
  
  revealSlideBounceLeft: revealHelper(css`  
    animation: ${slideBounceLeft} 0.9s ${EASE_BOUNCE} forwards;  
  `),  
  
  revealSlideBounceUp: revealHelper(css`  
    animation: ${slideBounceUp} 0.9s ${EASE_BOUNCE} forwards;  
  `),  
  
  revealSlideImpactRight: revealHelper(css`  
    animation: ${slideImpactRight} 1s ${EASE_OVERSHOOT} forwards;  
  `),  
  
  revealSlideImpactLeft: revealHelper(css`  
    animation: ${slideImpactLeft} 1s ${EASE_OVERSHOOT} forwards;  
  `),  
  
  revealSlideImpactUp: revealHelper(css`  
    animation: ${slideImpactUp} 1s ${EASE_OVERSHOOT} forwards;  
  `),  
  
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
  
  revealRotateDrop: revealHelper(css`  
    animation: ${rotateDrop} 0.9s ${EASE_BOUNCE} forwards;  
  `),  
  
  revealRotateSoftDrop: revealHelper(css`  
    animation: ${rotateSoftDrop} 0.75s ${EASE_BOUNCE} forwards;  
  `),  
  
  revealMagneticRise: revealHelper(css`  
    animation: ${magneticRise} 1s ${EASE_BOUNCE} forwards;  
  `),  
  
  revealFlipX: revealHelper(css`  
    animation: ${flipInX} 0.9s ${EASE_STANDARD} forwards;  
  `),  
  
  revealFlipY: revealHelper(css`  
    animation: ${flipInY} 0.9s ${EASE_STANDARD} forwards;  
  `),  
  
  revealSoftRevealLeft: revealHelper(css`  
    animation: ${softRevealLeft} 0.65s ${EASE_STANDARD} forwards;  
  `),  
  
  revealSoftRevealRight: revealHelper(css`  
    animation: ${softRevealRight} 0.65s ${EASE_STANDARD} forwards;  
  `),  
  
  revealSoftRevealDown: revealHelper(css`  
    animation: ${softRevealDown} 0.65s ${EASE_STANDARD} forwards;  
  `),  
  
  revealSoftRevealUp: revealHelper(css`  
    animation: ${softRevealUp} 0.65s ${EASE_STANDARD} forwards;  
  `),  
  
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
  
  /* Novos: reveal por máscara (clip-path), sem deslocar layout */  
  revealClipUp: revealHelper(css`  
    animation: ${clipRevealUp} 0.7s ${EASE_STANDARD} forwards;  
  `),  
  
  revealClipRight: revealHelper(css`  
    animation: ${clipRevealRight} 0.7s ${EASE_STANDARD} forwards;  
  `),  
  
  /* ----- Aliases depreciados (compatibilidade) ----- */  
  /** @deprecated use `revealFadeInDown` (o nome antigo era enganoso). */  
  revealFadeOutDown: revealHelper(css`  
    animation: ${fadeInDown} 1s ease forwards;  
  `)  
}