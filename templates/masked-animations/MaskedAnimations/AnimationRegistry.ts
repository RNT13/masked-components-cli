import { continuousAnimations } from './animations/continuousAnimations'
import { controlledAnimations } from './animations/controlledAnimations'
import { revealAnimations } from './animations/revealAnimations'

export const animationRegistry = {
  ...revealAnimations,
  ...continuousAnimations,
  ...controlledAnimations
} as const

export type AnimationName = keyof typeof animationRegistry
