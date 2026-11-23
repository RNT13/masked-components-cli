import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedCommandPaletteInternalProps } from './MaskedCommandPalette.types'

export const PaletteBody = styled.div`
  display: flex;
  flex-direction: column;
  max-height: min(28rem, 70dvh);
  color: inherit;
`

export const SearchRow = styled.div`
  padding: ${maskedTheme.spacing.sm} ${maskedTheme.spacing.md};
  border-bottom: 1px solid var(--mc-command-palette-border, ${maskedTheme.colors.baseGray.light40});
`

export const SearchInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: ${maskedTheme.fontSize.lg};

  &::placeholder {
    color: inherit;
    opacity: 0.6;
  }

  &:focus-visible {
    outline: none;
  }

  ${media.mobile} {
    font-size: ${maskedTheme.fontSize.md};
  }
`

export const Results = styled.div`
  flex: 1;
  min-height: 0;
  padding: ${maskedTheme.spacing.xs};
  overflow-y: auto;
`

export const GroupLabel = styled.div`
  padding: ${maskedTheme.spacing.sm} ${maskedTheme.spacing.sm} ${maskedTheme.spacing.xs};
  color: var(--mc-command-palette-muted, inherit);
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: ${maskedTheme.fontWeight.semibold};
  letter-spacing: 0.04em;
  text-transform: uppercase;
`

export const Option = styled.div<MaskedCommandPaletteInternalProps>`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.sm};
  min-height: ${({ $variant }) => ($variant === 'compact' ? '36px' : '48px')};
  padding: ${maskedTheme.spacing.xs} ${maskedTheme.spacing.sm};
  border-radius: ${maskedTheme.radius.md};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.45 : 1)};

  ${({ $active }) =>
    $active &&
    css`
      background: color-mix(in srgb, currentColor 12%, transparent);

      &::before {
        content: '';
        position: absolute;
        inset-block: 8px;
        inset-inline-start: 0;
        width: 3px;
        border-radius: ${maskedTheme.radius.full};
        background: var(--mc-command-palette-accent, currentColor);
      }
    `}

  ${media.mobile} {
    min-height: 48px;
  }
`

export const OptionIcon = styled.span`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
`

export const OptionText = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
`

export const OptionLabel = styled.span`
  overflow: hidden;
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${maskedTheme.fontWeight.medium};
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const OptionDescription = styled.span`
  overflow: hidden;
  color: var(--mc-command-palette-muted, inherit);
  font-size: ${maskedTheme.fontSize.sm};
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Shortcut = styled.kbd`
  flex: none;
  padding: ${maskedTheme.spacing['2xs']} ${maskedTheme.spacing.xs};
  border: 1px solid var(--mc-command-palette-border, currentColor);
  border-radius: ${maskedTheme.radius.sm};
  color: var(--mc-command-palette-muted, inherit);
  font: inherit;
  font-size: ${maskedTheme.fontSize.xs};
`

export const Empty = styled.div`
  padding: ${maskedTheme.spacing.xl} ${maskedTheme.spacing.md};
  color: var(--mc-command-palette-muted, inherit);
  font-size: ${maskedTheme.fontSize.md};
  text-align: center;
`

export const SrOnly = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`
