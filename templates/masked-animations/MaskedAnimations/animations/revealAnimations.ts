import { css } from 'styled-components'
import {
  blurIn,
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
  slideBounceLeft,
  slideBounceRight,
  slideBounceUp,
  slideImpactLeft,
  slideImpactRight,
  slideImpactUp,
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
  fadeInUp: revealHelper(css`
    animation: ${fadeInUp} 1s ease forwards;
  `),

  fadeInLeft: revealHelper(css`
    animation: ${fadeInLeft} 1s ease forwards;
  `),

  fadeInRight: revealHelper(css`
    animation: ${fadeInRight} 1s ease forwards;
  `),

  fadeOutDown: revealHelper(css`
    animation: ${fadeOutDown} 1s ease forwards;
  `),

  fadeInUpRotate: revealHelper(css`
    animation: ${fadeInUpRotate} 1s ease forwards;
  `),

  slideBounceRight: revealHelper(css`
    animation: ${slideBounceRight} 0.9s cubic-bezier(0.22, 1.4, 0.36, 1) forwards;
  `),

  slideBounceLeft: revealHelper(css`
    animation: ${slideBounceLeft} 0.9s cubic-bezier(0.22, 1.4, 0.36, 1) forwards;
  `),

  slideBounceUp: revealHelper(css`
    animation: ${slideBounceUp} 0.9s cubic-bezier(0.22, 1.4, 0.36, 1) forwards;
  `),

  slideImpactRight: revealHelper(css`
    animation: ${slideImpactRight} 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `),

  slideImpactLeft: revealHelper(css`
    animation: ${slideImpactLeft} 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `),

  slideImpactUp: revealHelper(css`
    animation: ${slideImpactUp} 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `),

  blurIn: revealHelper(css`
    animation: ${blurIn} 0.9s ease forwards;
  `),

  popElastic: revealHelper(css`
    animation: ${popElastic} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `),

  zoomFromDeep: revealHelper(css`
    animation: ${zoomFromDeep} 1s cubic-bezier(0.22, 1.4, 0.36, 1) forwards;
  `),

  rotateDrop: revealHelper(css`
    animation: ${rotateDrop} 0.9s cubic-bezier(0.22, 1.4, 0.36, 1) forwards;
  `),

  magneticRise: revealHelper(css`
    animation: ${magneticRise} 1s cubic-bezier(0.22, 1.4, 0.36, 1) forwards;
  `),

  flipX: revealHelper(css`
    animation: ${rotateFullX} 2s ease forwards;
  `),

  flipY: revealHelper(css`
    animation: ${rotateFullY} 2s ease forwards;
  `)
}
