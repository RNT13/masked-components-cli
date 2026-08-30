'use client'

import React from 'react'
import { css, styled, type RuleSet } from 'styled-components'

import { animationRegistry } from './AnimationRegistry'
import { useScrollTrigger } from './animations/triggers/useScrollTrigger'
import { MAnimationProps } from './MaskedAnimation.types'

export type MAnimationPosition = 'left' | 'center' | 'right' | 'top' | 'bottom'

const positionStyles: Record<MAnimationPosition, ReturnType<typeof css>> = {
  left: css`
    display: flex;
    justify-content: flex-start;
    align-items: center;
  `,
  right: css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
  `,
  center: css`
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  top: css`
    display: flex;
    justify-content: center;
    align-items: flex-start;
  `,
  bottom: css`
    display: flex;
    justify-content: center;
    align-items: flex-end;
  `
}

type ContainerProps = {
  $animationCSS?: RuleSet<object>
  $delay?: number
  $position?: MAnimationPosition
  $hidden?: boolean
  $hover?: RuleSet<object>
  $isOn?: boolean
  $isControlled?: boolean
  $width?: string
}

const Container = styled.div<ContainerProps>`
  width: ${({ $width }) => $width ?? '100%'};

  ${({ $isControlled, $isOn }) =>
    $isControlled &&
    !$isOn &&
    css`
      pointer-events: none;
    `}

  ${({ $hidden }) =>
    $hidden &&
    css`
      opacity: 0;
      pointer-events: none;
    `}

  ${({ $position }) => $position && positionStyles[$position]}

  ${({ $hover }) =>
    $hover &&
    css`
      &:hover > * {
        ${$hover}
      }
    `}

  ${({ $animationCSS }) => $animationCSS}

  ${({ $delay }) =>
    $delay !== undefined &&
    css`
      animation-delay: ${$delay}s;
      animation-fill-mode: backwards;
    `}
`

export function MaskedAnimation({
  children,
  variant: animation,
  trigger = 'mount',
  isOn,
  position,
  delay,
  threshold,
  once,
  width,
  as
}: MAnimationProps) {
  const scroll = useScrollTrigger(threshold, once)
  const animationCSS = animationRegistry[animation]

  let active = false
  let ref: React.Ref<HTMLDivElement> | undefined
  let hoverCSS: RuleSet<object> | undefined

  switch (trigger) {
    case 'mount':
      active = true
      break
    case 'scroll':
      active = scroll.active
      ref = scroll.ref
      break
    case 'hover':
      hoverCSS = animationCSS
      break
    case 'controlled':
      active = Boolean(isOn)
      break
    case 'always':
      active = true
      break
  }

  const isStateAnimation = trigger === 'controlled'

  return (
    <Container
      as={as}
      ref={ref}
      $delay={delay}
      $width={width}
      $position={position}
      $hidden={!active && trigger === 'scroll'}
      $animationCSS={isStateAnimation ? animationCSS : active ? animationCSS : undefined}
      $hover={hoverCSS}
      $isOn={active}
      $isControlled={isStateAnimation}
    >
      {children}
    </Container>
  )
}
