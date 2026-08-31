import { continuousAnimations } from './animations/continuousAnimations'
import { controlledAnimations } from './animations/controlledAnimations'
import { oneShotAnimations } from './animations/oneShotAnimations'
import { revealAnimations } from './animations/revealAnimations'

export const animationRegistry = {
  ...revealAnimations,
  ...continuousAnimations,
  ...controlledAnimations,
  ...oneShotAnimations  
} as const

export type AnimationName = keyof typeof animationRegistry
