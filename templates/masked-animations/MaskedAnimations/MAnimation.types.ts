import { AnimationName } from './AnimationRegistry'

export type TriggerType = 'scroll' | 'hover' | 'mount' | 'controlled' | 'always'

export type MAnimationProps = {
  children: React.ReactNode

  variant: AnimationName
  trigger?: TriggerType

  isOn?: boolean

  center?: boolean

  delay?: number

  once?: boolean

  threshold?: number
}
