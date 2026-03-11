"use client";

import React from "react";
import { css, styled, type RuleSet } from "styled-components";

import { animationRegistry } from "./AnimationRegistry";
import { useScrollTrigger } from "./animations/triggers/useScrollTrigger";
import { MAnimationProps } from "./MAnimation.types";

type ContainerProps = {
  $animationCSS?: RuleSet<object>;
  $delay?: number;
  $center?: boolean;
  $hidden?: boolean;
  $hover?: RuleSet<object>;
  $isOn?: boolean;
};

const Container = styled.div<ContainerProps>`
  width: 100%;

  ${({ $hidden }) =>
    $hidden &&
    css`
      opacity: 0;
      pointer-events: none;
    `}

  ${({ $center }) =>
    $center &&
    css`
      display: flex;
      justify-content: center;
      align-items: center;
    `}

  ${({ $delay }) =>
    $delay &&
    css`
      animation-delay: ${$delay}s;
    `}

  ${({ $hover }) =>
    $hover &&
    css`
      &:hover > * {
        ${$hover}
      }
    `}

  ${({ $animationCSS }) => $animationCSS}
`;

export function MAnimation({
  children,
  variant: animation,
  trigger = "mount",
  isOn,
  center,
  delay,
  threshold,
  once,
}: MAnimationProps) {
  const scroll = useScrollTrigger(threshold, once);

  const animationCSS = animationRegistry[animation];

  let active = false;
  let ref: React.Ref<HTMLDivElement> | undefined;
  let hoverCSS: RuleSet<object> | undefined;

  switch (trigger) {
    case "mount":
      active = true;
      break;

    case "scroll":
      active = scroll.active;
      ref = scroll.ref;
      break;

    case "hover":
      hoverCSS = animationCSS;
      break;

    case "controlled":
      active = Boolean(isOn);
      break;

    case "always":
      active = true;
      break;
  }

  const isStateAnimation = trigger === "controlled";

  return (
    <Container
      ref={ref}
      $center={center}
      $delay={delay}
      $hidden={!active && trigger === "scroll"}
      $animationCSS={
        isStateAnimation ? animationCSS : active ? animationCSS : undefined
      }
      $hover={hoverCSS}
      $isOn={active}
    >
      {children}
    </Container>
  );
}
