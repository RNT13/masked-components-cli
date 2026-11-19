import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedFooterInternalProps } from './MaskedFooter.types'

export const MaskedFooterRoot = styled.footer<MaskedFooterInternalProps>`
  box-sizing: border-box;
  width: 100%;
  color: var(--mc-footer-fg, inherit);
  background: var(--mc-footer-bg, transparent);
  border-top: 1px solid var(--mc-footer-border, ${maskedTheme.colors.baseGray.light40});
  font-size: ${maskedTheme.fontSize.sm};
`

export const FooterInner = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 1120px;
  margin-inline: auto;
  padding: ${maskedTheme.spacing.xl} ${maskedTheme.spacing.lg};

  ${media.mobile} {
    padding: ${maskedTheme.spacing.lg} ${maskedTheme.spacing.md};
  }
`

export const FooterTop = styled.div<MaskedFooterInternalProps>`
  display: flex;
  gap: ${maskedTheme.spacing.xl};

  ${({ $variant }) =>
    $variant === 'simple' &&
    css`
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
    `}

  ${({ $variant }) =>
    $variant === 'columns' &&
    css`
      justify-content: space-between;

      ${media.tablet} {
        flex-direction: column;
      }
    `}  
  
  ${({ $variant }) =>
    $variant === 'centered' &&
    css`
      flex-direction: column;
      align-items: center;
      text-align: center;
    `}
`

export const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.sm};
  max-width: 22rem;
  font-weight: ${maskedTheme.fontWeight.semibold};
`

export const FooterDescription = styled.p`
  margin: 0;
  font-weight: ${maskedTheme.fontWeight.normal};
  line-height: ${maskedTheme.lineHeight.relaxed};
  color: var(--mc-footer-muted, inherit);
`

export const FooterColumns = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${maskedTheme.spacing['2xl']};

  ${media.mobile} {
    gap: ${maskedTheme.spacing.xl};
  }
`

export const FooterColumn = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.sm};
  min-width: 8rem;
`

export const FooterColumnTitle = styled.h2`
  margin: 0;
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.semibold};
  color: inherit;
`

export const FooterList = styled.ul<{ $inline?: boolean }>`
  display: flex;
  flex-direction: ${({ $inline }) => ($inline ? 'row' : 'column')};
  flex-wrap: wrap;
  gap: ${({ $inline }) => ($inline ? maskedTheme.spacing.lg : maskedTheme.spacing.sm)};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const FooterLinkItem = styled.a`
  color: var(--mc-footer-muted, inherit);
  text-decoration: none;

  &:hover {
    color: var(--mc-footer-fg, inherit);
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
    border-radius: ${maskedTheme.radius.xs};
  }
`

export const FooterBottom = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${maskedTheme.spacing.md};
  margin-top: ${maskedTheme.spacing.xl};
  padding-top: ${maskedTheme.spacing.lg};
  border-top: 1px solid var(--mc-footer-border, ${maskedTheme.colors.baseGray.light40});
  color: var(--mc-footer-muted, inherit);
`
