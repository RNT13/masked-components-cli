'use client'

import { css, styled } from 'styled-components'

type SkeletonBoxProps = {
  $width?: string | number
  $height?: string | number
  $radius?: string | number
}

const skeletonPulse = css`
  animation: skeletonPulse 1.6s ease-in-out infinite;

  @keyframes skeletonPulse {
    0%,
    100% {
      opacity: 0.72;
    }

    50% {
      opacity: 1;
    }
  }
`

const skeletonShimmer = css`
  @keyframes skeletonShimmer {
    0% {
      transform: translateX(-120%);
    }

    100% {
      transform: translateX(120%);
    }
  }
`

const SkeletonBox = styled.div<SkeletonBoxProps>`
  position: relative;
  overflow: hidden;
  isolation: isolate;

  width: ${({ $width }) => (typeof $width === 'number' ? `${$width}px` : ($width ?? '100%'))};

  height: ${({ $height }) => (typeof $height === 'number' ? `${$height}px` : ($height ?? '16px'))};

  border-radius: ${({ $radius }) => (typeof $radius === 'number' ? `${$radius}px` : ($radius ?? '12px'))};

  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.04) 0%,
      rgba(255, 255, 255, 0.08) 20%,
      rgba(255, 255, 255, 0.16) 50%,
      rgba(255, 255, 255, 0.08) 80%,
      rgba(255, 255, 255, 0.04) 100%
    );

  ${skeletonPulse}

  &::before {
    content: '';
    position: absolute;
    inset: 0;

    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.08) 35%,
      rgba(255, 255, 255, 0.22) 50%,
      rgba(255, 255, 255, 0.08) 65%,
      transparent 100%
    );

    animation: skeletonShimmer 1.35s ease-in-out infinite;
    pointer-events: none;
  }

  ${skeletonShimmer}
`

type MSkeletonProps = {
  width?: string | number
  height?: string | number
  radius?: string | number
  circle?: boolean
}

export function MaskedSkeleton({ width = '100%', height = 16, radius = 12, circle = false }: MSkeletonProps) {
  return <SkeletonBox $width={width} $height={height} $radius={circle ? '999px' : radius} aria-hidden="true" />
}
