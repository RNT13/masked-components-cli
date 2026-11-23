import styled, { css } from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedRatingInternalProps } from './MaskedRating.types'

const SIZES = { sm: '1.25rem', md: '1.75rem', lg: '2.25rem' } as const

export const MaskedRatingRoot = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${maskedTheme.spacing['2xs']};
`

export const RatingItem = styled.label<MaskedRatingInternalProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $interactive }) => ($interactive ? 'pointer' : 'default')};
`

/** Rádio nativo cobrindo o item: some visualmente, mas recebe foco e cliques. */
export const RatingRadio = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: inherit;

  &:focus-visible + span {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`

export const RatingGlyph = styled.span<MaskedRatingInternalProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ $size }) => SIZES[$size]};
  height: ${({ $size }) => SIZES[$size]};
  border-radius: ${maskedTheme.radius.sm};
  font-size: ${({ $size }) => SIZES[$size]};
  line-height: 1;
  color: ${({ $filled }) => ($filled ? 'var(--mc-rating-accent, currentColor)' : 'var(--mc-rating-empty, currentColor)')};
  user-select: none;

  ${({ $variant, $size, $filled }) =>
    $variant === 'numbers' &&
    css`
      min-width: calc(${SIZES[$size]} * 1.4);
      border: 1px solid
        ${$filled ? 'var(--mc-rating-accent, currentColor)' : 'var(--mc-rating-empty, currentColor)'};
      border-radius: ${maskedTheme.radius.full};
      background: ${$filled ? 'var(--mc-rating-accent, currentColor)' : 'transparent'};
      color: ${$filled ? 'var(--mc-rating-accent-fg, inherit)' : 'inherit'};
      font-size: calc(${SIZES[$size]} * 0.5);
      font-weight: ${maskedTheme.fontWeight.semibold};
    `}
`
