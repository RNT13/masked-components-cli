import styled from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.sm};
  width: 100%;
`

export const ProfileAvatar = styled.div<{ $size?: number }>`
  width: ${({ $size }) => `${$size ?? 56}px`};
  height: ${({ $size }) => `${$size ?? 56}px`};
  border-radius: ${maskedTheme.radius.full};
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--mc-card-icon-bg, ${maskedTheme.colors.baseBlue.light20});
  color: var(--mc-card-icon-fg, ${maskedTheme.colors.baseBlue.base});
  font-size: ${maskedTheme.fontSize.lg};
  font-weight: ${maskedTheme.fontWeight.bold};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

export const ProfileIdentity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const ProfileName = styled.h3`
  margin: 0;
  font-size: ${maskedTheme.fontSize.lg};
  font-weight: ${maskedTheme.fontWeight.bold};
  line-height: ${maskedTheme.lineHeight.tight};
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
`

export const ProfileRole = styled.span`
  font-size: ${maskedTheme.fontSize.sm};
  color: var(--mc-card-muted-fg, currentColor);
`

export const ProfileMeta = styled.span`
  font-size: ${maskedTheme.fontSize.xs};
  color: var(--mc-card-muted-fg, currentColor);
`

export const ProfileBio = styled.p`
  margin: 0;
  font-size: ${maskedTheme.fontSize.sm};
  line-height: ${maskedTheme.lineHeight.normal};
  color: var(--mc-card-muted-fg, currentColor);
`

export const ProfileStats = styled.div`
  display: flex;
  gap: ${maskedTheme.spacing.md};
  width: 100%;
`

export const ProfileStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const ProfileStatValue = styled.span`
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${maskedTheme.fontWeight.bold};
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
`

export const ProfileStatLabel = styled.span`
  font-size: ${maskedTheme.fontSize.xs};
  color: var(--mc-card-muted-fg, currentColor);
`

export const ProfileActions = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  gap: ${maskedTheme.spacing.xs};
  flex-wrap: wrap;
  width: 100%;
`
