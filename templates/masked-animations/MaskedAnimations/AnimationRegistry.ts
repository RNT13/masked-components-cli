import { continuousAnimations } from './animations/continuousAnimations'
import { controlledAnimations } from './animations/controlledAnimations'
import { extraAnimations } from './animations/extraAnimations'
import { oneShotAnimations } from './animations/oneShotAnimations'
import { revealAnimations } from './animations/revealAnimations'

export const animationRegistry = {
  ...revealAnimations,
  ...continuousAnimations,
  ...controlledAnimations,
  ...oneShotAnimations,
  ...extraAnimations
} as const

export type AnimationName = keyof typeof animationRegistry
