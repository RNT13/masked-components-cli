import { css } from 'styled-components'
import {
  blurIn,
  blurRise,
  cinematicZoom,
  fadeInLeft,
  fadeInRight,
  fadeInUp,
  fadeInUpRotate,
  fadeOutDown,
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
  softRevealDown,
  softRevealLeft,
  softRevealRight,
  softRevealUp,
  zoomFromDeep
} from './keyframes'

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

  revealFadeInLeft: revealHelper(css`
    animation: ${fadeInLeft} 1s ease forwards;
  `),

  revealFadeInRight: revealHelper(css`
    animation: ${fadeInRight} 1s ease forwards;
  `),

  revealFadeOutDown: revealHelper(css`
    animation: ${fadeOutDown} 1s ease forwards;
  `),

  revealFadeInUpRotate: revealHelper(css`
    animation: ${fadeInUpRotate} 1s ease forwards;
  `),

  revealSlideBounceRight: revealHelper(css`
    animation: ${slideBounceRight} 0.9s cubic-bezier(0.22, 1.4, 0.36, 1) forwards;
  `),

  revealSlideBounceLeft: revealHelper(css`
    animation: ${slideBounceLeft} 0.9s cubic-bezier(0.22, 1.4, 0.36, 1) forwards;
  `),

  revealSlideBounceUp: revealHelper(css`
    animation: ${slideBounceUp} 0.9s cubic-bezier(0.22, 1.4, 0.36, 1) forwards;
  `),

  revealSlideImpactRight: revealHelper(css`
    animation: ${slideImpactRight} 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `),

  revealSlideImpactLeft: revealHelper(css`
    animation: ${slideImpactLeft} 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `),

  revealSlideImpactUp: revealHelper(css`
    animation: ${slideImpactUp} 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `),

  revealBlurIn: revealHelper(css`
    animation: ${blurIn} 0.9s ease forwards;
  `),

  revealPopElastic: revealHelper(css`
    animation: ${popElastic} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `),

  revealZoomFromDeep: revealHelper(css`
    animation: ${zoomFromDeep} 1s cubic-bezier(0.22, 1.4, 0.36, 1) forwards;
  `),

  revealRotateDrop: revealHelper(css`
    animation: ${rotateDrop} 0.9s cubic-bezier(0.22, 1.4, 0.36, 1) forwards;
  `),

  revealMagneticRise: revealHelper(css`
    animation: ${magneticRise} 1s cubic-bezier(0.22, 1.4, 0.36, 1) forwards;
  `),

  revealFlipX: revealHelper(css`
    animation: ${rotateFullX} 2s ease forwards;
  `),

  revealFlipY: revealHelper(css`
    animation: ${rotateFullY} 2s ease forwards;
  `),

  revealSoftRevealLeft: revealHelper(css`
    animation: ${softRevealLeft} 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  `),

  revealSoftRevealRight: revealHelper(css`
    animation: ${softRevealRight} 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  `),

  revealSoftRevealDown: revealHelper(css`
    animation: ${softRevealDown} 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  `),

  revealSoftRevealUp: revealHelper(css`
    animation: ${softRevealUp} 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  `),

  revealSmoothBounceUp: revealHelper(css`
    animation: ${smoothBounceUp} 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
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

  revealBlurRise: revealHelper(css`
    animation: ${blurRise} 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  `),

  revealScaleRise: revealHelper(css`
    animation: ${scaleRise} 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `),

  revealRotateSoftDrop: revealHelper(css`
    animation: ${rotateSoftDrop} 0.75s cubic-bezier(0.22, 1.4, 0.36, 1) forwards;
  `),

  revealCinematicZoom: revealHelper(css`
    animation: ${cinematicZoom} 0.85s cubic-bezier(0.22, 1.4, 0.36, 1) forwards;
  `)
}
