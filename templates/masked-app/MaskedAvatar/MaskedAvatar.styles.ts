import styled, { css } from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedAvatarInternalProps } from './MaskedAvatar.types'

export const MaskedAvatarRoot = styled.span<MaskedAvatarInternalProps>`
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  background: var(--mc-avatar-bg, ${maskedTheme.colors.baseGray.light40});
  color: var(--mc-avatar-fg, inherit);
  font-size: ${({ $size }) => Math.max(10, Math.round($size * 0.38))}px;
  font-weight: ${maskedTheme.fontWeight.semibold};
  line-height: 1;
  user-select: none;

  ${({ $variant, $size }) =>
    $variant === 'circle'
      ? css`
          border-radius: ${maskedTheme.radius.full};
        `
      : $variant === 'rounded'
        ? css`
            border-radius: ${Math.round($size * 0.25)}px;
          `
        : css`
            border-radius: 0;
          `}
`

export const AvatarImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover;
`

export const AvatarStatusDot = styled.span<{ $status: string; $size: number }>`
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 0;
  width: ${({ $size }) => Math.max(8, Math.round($size * 0.28))}px;
  height: ${({ $size }) => Math.max(8, Math.round($size * 0.28))}px;
  border: 2px solid var(--mc-avatar-ring, ${maskedTheme.colors.baseGray.light40});
  border-radius: ${maskedTheme.radius.full};
  background: var(--mc-avatar-status-${({ $status }) => $status});
`

export const SrOnly = styled.span`
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
