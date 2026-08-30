
import { AnimationName } from './AnimationRegistry'
import { MAnimationPosition } from './MaskedAnimation'

export type TriggerType = 'scroll' | 'hover' | 'mount' | 'controlled' | 'always'

export type MAnimationProps = {
  children: React.ReactNode

  variant: AnimationName
  trigger?: TriggerType

  isOn?: boolean

  position?: MAnimationPosition

  delay?: number

  once?: boolean

  threshold?: number

  width?: string

  as?: React.ElementType
}
