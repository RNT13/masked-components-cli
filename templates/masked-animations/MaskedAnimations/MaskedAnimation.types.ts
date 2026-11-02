import { AnimationName } from './AnimationRegistry'
import { MaskedAnimationPosition } from './MaskedAnimation'

export type AnimationTrigger = 'scroll' | 'hover' | 'mount' | 'controlled' | 'always'

export type MaskedAnimationProps = {
  children: React.ReactNode

  variant: AnimationName
  trigger?: AnimationTrigger

  isOn?: boolean
  position?: MaskedAnimationPosition
  delay?: number
  once?: boolean
  threshold?: number
  width?: string
  as?: React.ElementType
}

/* ----- Aliases depreciados (remover na 3.0) ----- */
/** @deprecated use `MaskedAnimationProps` */
export type MAnimationProps = MaskedAnimationProps
/** @deprecated use `AnimationTrigger` */
export type TriggerType = AnimationTrigger
