import styled, { css } from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedDividerInternalProps } from './MaskedDivider.types'

/** Linha reutilizável (fundo = cor do token, espessura = token). */
const line = css`
  background-color: var(--mc-divider-color, ${maskedTheme.colors.baseGray.light40});
`

export const MaskedDividerRoot = styled.div<MaskedDividerInternalProps>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: var(--mc-divider-gap, ${maskedTheme.spacing.md});
  color: var(--mc-divider-label, inherit);
  font-size: ${maskedTheme.fontSize.sm};

  ${({ $variant }) =>
    $variant === 'horizontal' &&
    css`
      ${line}
      width: 100%;
      height: var(--mc-divider-thickness, 1px);
      margin-block: var(--mc-divider-spacing, 0px);
    `}

  ${({ $variant }) =>
    $variant === 'vertical' &&
    css`
      ${line}
      align-self: stretch;
      width: var(--mc-divider-thickness, 1px);
      min-height: 1em;
      margin-inline: var(--mc-divider-spacing, 0px);
    `}  
  
  ${({ $variant }) =>
    $variant === 'labeled' &&
    css`
      width: 100%;
      margin-block: var(--mc-divider-spacing, 0px);
    `}
`

/** Linha de cada lado do label (variant 'labeled'). */
export const DividerLine = styled.span`
  ${line}
  flex: 1;
  min-width: 0;
  height: var(--mc-divider-thickness, 1px);
`

export const DividerLabel = styled.span`
  flex: none;
  max-width: 80%;
`
