import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedSliderInternalProps } from './MaskedSlider.types'

export const MaskedSliderRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.xs};
  min-width: 0;
`

export const SliderHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${maskedTheme.spacing.md};
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${maskedTheme.fontWeight.medium};
`

export const SliderValue = styled.output`
  font-weight: ${maskedTheme.fontWeight.semibold};
  font-variant-numeric: tabular-nums;
`

export const SliderTrack = styled.div`
  position: relative;
`

const trackBase = css`
  height: 6px;
  border-radius: ${maskedTheme.radius.full};
`

const thumbBase = css`
  box-sizing: border-box;
  width: 22px;
  height: 22px;
  border: 2px solid var(--mc-slider-thumb-border, currentColor);
  border-radius: ${maskedTheme.radius.full};
  background: var(--mc-slider-accent, currentColor);
`

/** Campo nativo estilizado: teclado, toque e leitor de tela vêm de graça. */
export const SliderInput = styled.input<MaskedSliderInternalProps>`
  display: block;
  width: 100%;
  height: 44px;
  margin: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;

  &::-webkit-slider-runnable-track {
    ${trackBase}
    background: ${({ $variant }) =>
      $variant === 'filled'
        ? 'linear-gradient(to right, var(--mc-slider-accent, currentColor) var(--mc-slider-percent, 0%), var(--mc-slider-track, #ccc) var(--mc-slider-percent, 0%))'
        : 'var(--mc-slider-track, #ccc)'};
  }

  &::-moz-range-track {
    ${trackBase}
    background: var(--mc-slider-track, #ccc);
  }

  &::-moz-range-progress {
    ${trackBase}
    background: ${({ $variant }) => ($variant === 'filled' ? 'var(--mc-slider-accent, currentColor)' : 'transparent')};
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    margin-top: -8px;
    ${thumbBase}
  }

  &::-moz-range-thumb {
    ${thumbBase}
  }

  &:focus-visible {
    outline: none;
  }

  &:focus-visible::-webkit-slider-thumb {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  &:focus-visible::-moz-range-thumb {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${media.reducedMotion} {
    &::-webkit-slider-thumb {
      transition: none;
    }
  }
`

/** Marcas do variant 'steps' (decorativas, alinhadas ao centro do marcador). */
export const SliderMarks = styled.div`
  position: relative;
  height: 14px;
  margin-inline: 11px;
`

export const SliderMark = styled.span`
  position: absolute;
  top: 0;
  width: 2px;
  height: 8px;
  margin-inline-start: -1px;
  border-radius: 1px;
  background: var(--mc-slider-track, currentColor);
`
