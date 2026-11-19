import styled from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedContainerInternalProps } from './MaskedContainer.types'

/**
 * Largura de página + gutters. Todo valor cai em var(--mc-container-*, fallback).
 * Gutter padrão responsivo: lg no desktop, md no mobile.
 */
export const MaskedContainerRoot = styled.div<MaskedContainerInternalProps>`
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: var(--mc-container-max-width, 1120px);
  padding-inline: var(--mc-container-padding-x, ${maskedTheme.spacing.lg});
  padding-block: var(--mc-container-padding-y, 0px);

  ${({ $centered }) =>
    $centered &&
    `
      margin-inline: auto;
    `}

  ${media.mobile} {
    padding-inline: var(--mc-container-padding-x, ${maskedTheme.spacing.md});
  }
`
