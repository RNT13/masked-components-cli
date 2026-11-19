import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedCTAInternalProps } from './MaskedCTA.types'

export const MaskedCTARoot = styled.section`
  box-sizing: border-box;
  width: 100%;
  padding-block: ${maskedTheme.spacing['2xl']};
  padding-inline: ${maskedTheme.spacing.lg};

  ${media.mobile} {
    padding-inline: ${maskedTheme.spacing.md};
  }
`

export const CTABox = styled.div<MaskedCTAInternalProps>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${maskedTheme.spacing.lg};
  width: 100%;
  max-width: 1120px;
  margin-inline: auto;
  padding: ${maskedTheme.spacing['2xl']};
  border: 1px solid var(--mc-cta-border, transparent);
  border-radius: ${maskedTheme.radius.xl};
  color: var(--mc-cta-fg, inherit);
  background: var(--mc-cta-bg, transparent);
  text-align: center;

  ${media.mobile} {
    padding: ${maskedTheme.spacing.xl} ${maskedTheme.spacing.md};
  }

  ${({ $variant }) =>
    $variant === 'split' &&
    css`
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      text-align: start;

      ${media.tablet} {
        flex-direction: column;
        align-items: flex-start;
      }
    `}
`

export const CTAText = styled.div`
  min-width: 0;
  max-width: 40rem;
`

export const CTATitle = styled.h2`
  margin: 0;
  color: inherit;
  font-size: ${maskedTheme.fontSize['3xl']};
  font-weight: ${maskedTheme.fontWeight.bold};
  line-height: ${maskedTheme.lineHeight.tight};

  ${media.mobile} {
    font-size: ${maskedTheme.fontSize['2xl']};
  }
`

export const CTADescription = styled.p`
  margin: ${maskedTheme.spacing.sm} 0 0;
  color: var(--mc-cta-muted, inherit);
  font-size: ${maskedTheme.fontSize.lg};
  line-height: ${maskedTheme.lineHeight.relaxed};
`

export const CTAActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${maskedTheme.spacing.sm};

  ${media.mobile} {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
`
