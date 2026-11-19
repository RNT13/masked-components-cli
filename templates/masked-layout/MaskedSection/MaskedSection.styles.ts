import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedSectionInternalProps } from './MaskedSection.types'

/**
 * Seção semântica com ritmo vertical. Todo valor cai em
 * var(--mc-section-*, fallback); o gradiente vive em --mc-section-bg.
 */
export const MaskedSectionRoot = styled.section<MaskedSectionInternalProps>`
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  color: var(--mc-section-fg, inherit);
  background: var(--mc-section-bg, transparent);
  padding-block: var(--mc-section-padding-y, ${maskedTheme.spacing['3xl']});

  ${media.mobile} {
    padding-block: var(--mc-section-padding-y, ${maskedTheme.spacing['2xl']});
  }

  ${({ $variant }) =>
    $variant === 'bordered' &&
    css`
      border-block: 1px solid var(--mc-section-border, ${maskedTheme.colors.baseGray.light40});
    `}
`

/** Conteúdo alinhado a uma largura de página; `contained={false}` desliga. */
export const SectionInner = styled.div<{ $contained: boolean }>`
  box-sizing: border-box;
  min-width: 0;

  ${({ $contained }) =>
    $contained &&
    css`
      width: 100%;
      max-width: var(--mc-section-max-width, 1120px);
      margin-inline: auto;
      padding-inline: ${maskedTheme.spacing.lg};

      ${media.mobile} {
        padding-inline: ${maskedTheme.spacing.md};
      }
    `}
`

export const SectionHeader = styled.div<{ $align: MaskedSectionInternalProps['$align'] }>`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${maskedTheme.spacing.md};
  margin-bottom: ${maskedTheme.spacing.xl};

  ${({ $align }) =>
    $align === 'center' &&
    css`
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    `}
`

export const SectionHeading = styled.div`
  min-width: 0;
  max-width: 48rem;
`

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: ${maskedTheme.fontSize['3xl']};
  font-weight: ${maskedTheme.fontWeight.bold};
  line-height: ${maskedTheme.lineHeight.tight};
  color: inherit;

  ${media.mobile} {
    font-size: ${maskedTheme.fontSize['2xl']};
  }
`

export const SectionDescription = styled.p`
  margin: ${maskedTheme.spacing.sm} 0 0;
  font-size: ${maskedTheme.fontSize.lg};
  line-height: ${maskedTheme.lineHeight.relaxed};
  color: var(--mc-section-muted, inherit);
  opacity: 1;
`

export const SectionActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${maskedTheme.spacing.sm};
`
