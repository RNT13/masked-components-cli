import styled from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedPageHeaderInternalProps } from './MaskedPageHeader.types'

export const MaskedPageHeaderRoot = styled.header<MaskedPageHeaderInternalProps>`
  box-sizing: border-box;
  width: 100%;
  color: var(--mc-page-header-fg, inherit);
  background: var(--mc-page-header-bg, transparent);
  border-bottom: 1px solid var(--mc-page-header-border, ${maskedTheme.colors.baseGray.light40});
  padding-block: ${({ $variant }) =>
    $variant === 'simple' ? maskedTheme.spacing.lg : maskedTheme.spacing['2xl']};

  ${media.mobile} {
    padding-block: ${({ $variant }) =>
      $variant === 'simple' ? maskedTheme.spacing.md : maskedTheme.spacing.xl};
  }
`

export const PageHeaderInner = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.md};
  width: 100%;
  max-width: 1120px;
  margin-inline: auto;
  padding-inline: ${maskedTheme.spacing.lg};

  ${media.mobile} {
    padding-inline: ${maskedTheme.spacing.md};
  }
`

export const PageHeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${maskedTheme.spacing.md};
`

export const PageHeaderText = styled.div`
  min-width: 0;
  max-width: 48rem;
`

export const PageHeaderTitle = styled.h1`
  margin: 0;
  font-size: ${maskedTheme.fontSize['4xl']};
  font-weight: ${maskedTheme.fontWeight.bold};
  line-height: ${maskedTheme.lineHeight.tight};
  color: inherit;

  ${media.mobile} {
    font-size: ${maskedTheme.fontSize['2xl']};
  }
`

export const PageHeaderDescription = styled.p`
  margin: ${maskedTheme.spacing.sm} 0 0;
  font-size: ${maskedTheme.fontSize.lg};
  line-height: ${maskedTheme.lineHeight.relaxed};
  color: var(--mc-page-header-muted, inherit);
`

export const PageHeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${maskedTheme.spacing.sm};
`
