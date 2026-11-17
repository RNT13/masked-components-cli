import styled from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'

export const ServiceMedia = styled.div.attrs({ className: 'mc-card-media' })`
  position: relative;
  margin: calc(${maskedTheme.spacing.md} * -1) calc(${maskedTheme.spacing.md} * -1) 0;
  overflow: hidden;
  border-radius: ${maskedTheme.radius.md} ${maskedTheme.radius.md} 0 0;
  background-color: var(--mc-card-media-bg, ${maskedTheme.colors.baseBlack.light08});
  aspect-ratio: var(--mc-card-media-ratio, 16/9);

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const ServiceBadge = styled.span`
  position: absolute;
  top: ${maskedTheme.spacing.xs};
  left: ${maskedTheme.spacing.xs};
  padding: ${maskedTheme.spacing['2xs']} ${maskedTheme.spacing.xs};
  border-radius: ${maskedTheme.radius.sm};
  font-size: ${maskedTheme.fontSize['2xs']};
  font-weight: ${maskedTheme.fontWeight.semibold};
  line-height: ${maskedTheme.lineHeight.none};
  background-color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
  color: var(--mc-card-accent-fg, #ffffff);
`

export const ServiceBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.xs};
`

export const ServiceTitle = styled.h3`
  margin: 0;
  font-size: ${maskedTheme.fontSize.md};
  font-weight: ${maskedTheme.fontWeight.semibold};
  line-height: ${maskedTheme.lineHeight.tight};
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
`

export const ServiceDescription = styled.p`
  margin: 0;
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.normal};
  line-height: ${maskedTheme.lineHeight.normal};
  color: var(--mc-card-muted-fg, currentColor);
`

export const ServiceMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.xs};
  flex-wrap: wrap;
`

export const ServicePriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${maskedTheme.spacing['2xs']};
`

export const ServicePrice = styled.span`
  font-size: ${maskedTheme.fontSize.lg};
  font-weight: ${maskedTheme.fontWeight.bold};
  color: var(--mc-card-fg, ${maskedTheme.colors.baseBlack.dark40});
`

export const ServicePricePrefix = styled.span`
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: ${maskedTheme.fontWeight.normal};
  color: var(--mc-card-muted-fg, currentColor);
`

export const ServiceDuration = styled.span`
  font-size: ${maskedTheme.fontSize.xs};
  font-weight: ${maskedTheme.fontWeight.medium};
  color: var(--mc-card-muted-fg, currentColor);
`

export const ServiceActions = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: ${maskedTheme.spacing.xs};
  flex-wrap: wrap;
  margin-top: ${maskedTheme.spacing.xs};
`
