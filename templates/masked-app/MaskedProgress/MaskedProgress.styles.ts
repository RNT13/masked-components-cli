'use client'

import styled, { css, keyframes } from 'styled-components'
import type { MaskedProgressInternalProps } from './MaskedProgress.types'

const indeterminateSlide = keyframes`  
  0% { transform: translateX(-100%); }  
  100% { transform: translateX(250%); }  
`

const indeterminateSpin = keyframes`  
  to { transform: rotate(360deg); }  
`

export const ProgressRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--mc-progress-fg);
`

export const ProgressHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.875rem;
`

export const ProgressValue = styled.span`
  font-variant-numeric: tabular-nums;
  opacity: 0.8;
`

export const LinearTrack = styled.div<Pick<MaskedProgressInternalProps, '$size'>>`
  position: relative;
  width: 100%;
  height: ${({ $size }) => $size}px;
  border-radius: 999px;
  background: var(--mc-progress-track);
  overflow: hidden;
`

export const LinearBar = styled.div<Pick<MaskedProgressInternalProps, '$indeterminate'>>`
  height: 100%;
  border-radius: inherit;
  background: var(--mc-progress-bar);
  transition: width 200ms ease;

  ${({ $indeterminate }) =>
    $indeterminate &&
    css`
      width: 40% !important;
      animation: ${indeterminateSlide} 1.2s ease-in-out infinite;
    `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    animation: none;
  }
`

export const CircleSvg = styled.svg<Pick<MaskedProgressInternalProps, '$indeterminate'>>`
  display: block;

  ${({ $indeterminate }) =>
    $indeterminate &&
    css`
      animation: ${indeterminateSpin} 1s linear infinite;
    `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const CircleTrack = styled.circle`
  fill: none;
  stroke: var(--mc-progress-track);
`

export const CircleBar = styled.circle`
  fill: none;
  stroke: var(--mc-progress-bar);
  stroke-linecap: round;
  transition: stroke-dashoffset 200ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
