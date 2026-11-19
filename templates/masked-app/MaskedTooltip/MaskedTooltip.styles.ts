import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedTooltipInternalProps } from './MaskedTooltip.types'

export const TooltipWrapper = styled.span`
  position: relative;
  display: inline-flex;
`

const placement = {
  top: css`
    inset-block-end: calc(100% + 8px);
    inset-inline-start: 50%;
    transform: translateX(-50%);
  `,
  bottom: css`
    inset-block-start: calc(100% + 8px);
    inset-inline-start: 50%;
    transform: translateX(-50%);
  `,
  left: css`
    inset-inline-end: calc(100% + 8px);
    inset-block-start: 50%;
    transform: translateY(-50%);
  `,
  right: css`
    inset-inline-start: calc(100% + 8px);
    inset-block-start: 50%;
    transform: translateY(-50%);
  `
}

/**
 * O tooltip fica dentro do wrapper (sem portal): passar o mouse do gatilho
 * para o tooltip não o fecha (WCAG 1.4.13 "hoverable"), e a ponte invisível
 * (::before) cobre o vão de 8px entre os dois.
 */
export const TooltipBubble = styled.span<MaskedTooltipInternalProps>`
  position: absolute;
  z-index: ${maskedTheme.zIndex.tooltip};
  width: max-content;
  max-width: min(20rem, 80vw);
  padding: ${maskedTheme.spacing.xs} ${maskedTheme.spacing.sm};
  border: 1px solid var(--mc-tooltip-border, transparent);
  border-radius: ${maskedTheme.radius.md};
  background: var(--mc-tooltip-bg, ${maskedTheme.colors.baseGray.dark20});
  color: var(--mc-tooltip-fg, inherit);
  box-shadow: ${maskedTheme.boxShadow.md()};
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.normal};
  line-height: ${maskedTheme.lineHeight.snug};
  white-space: normal;
  ${({ $side }) => placement[$side]}

  &::before {
    content: '';
    position: absolute;
    inset: -8px;
    z-index: -1;
  }

  ${media.mobile} {
    max-width: 70vw;
  }
`
