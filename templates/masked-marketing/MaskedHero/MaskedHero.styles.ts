import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedHeroInternalProps } from './MaskedHero.types'

export const MaskedHeroRoot = styled.section<MaskedHeroInternalProps>`
  box-sizing: border-box;
  width: 100%;
  color: var(--mc-hero-fg, inherit);
  background: var(--mc-hero-bg, transparent);
  padding-block: ${({ $variant }) =>
    $variant === 'minimal' ? maskedTheme.spacing['2xl'] : maskedTheme.spacing['4xl']};

  ${media.mobile} {
    padding-block: ${({ $variant }) =>
      $variant === 'minimal' ? maskedTheme.spacing.xl : maskedTheme.spacing['2xl']};
  }
`

export const HeroInner = styled.div<MaskedHeroInternalProps>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing['2xl']};
  width: 100%;
  max-width: 1120px;
  margin-inline: auto;
  padding-inline: ${maskedTheme.spacing.lg};

  ${media.mobile} {
    padding-inline: ${maskedTheme.spacing.md};
    gap: ${maskedTheme.spacing.xl};
  }

  ${({ $variant, $mediaPosition }) =>
    $variant === 'split' &&
    css`
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-items: center;

      ${
        $mediaPosition === 'start' &&
        css`
          > :first-child {
            order: 2;
          }
        `
      }

      ${media.tablet} {
        grid-template-columns: minmax(0, 1fr);

        > :first-child {
          order: 0;
        }
      }
    `}
`

export const HeroText = styled.div<Pick<MaskedHeroInternalProps, '$variant'>>`
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.md};
  min-width: 0;

  ${({ $variant }) =>
    ($variant === 'centered' || $variant === 'gradient') &&
    css`
      align-items: center;
      max-width: 48rem;
      margin-inline: auto;
      text-align: center;
    `}
`

export const HeroEyebrow = styled.p`
  margin: 0;
  color: var(--mc-hero-accent, inherit);
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.semibold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const HeroTitle = styled.h1<Pick<MaskedHeroInternalProps, '$variant'>>`
  margin: 0;
  color: inherit;
  font-size: ${({ $variant }) =>
    $variant === 'minimal' ? maskedTheme.fontSize['4xl'] : maskedTheme.fontSize['5xl']};
  font-weight: ${maskedTheme.fontWeight.bold};
  line-height: ${maskedTheme.lineHeight.tight};

  ${media.mobile} {
    font-size: ${maskedTheme.fontSize['3xl']};
  }
`

export const HeroDescription = styled.p`
  margin: 0;
  color: var(--mc-hero-muted, inherit);
  font-size: ${maskedTheme.fontSize.xl};
  line-height: ${maskedTheme.lineHeight.relaxed};

  ${media.mobile} {
    font-size: ${maskedTheme.fontSize.lg};
  }
`

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${maskedTheme.spacing.sm};
  margin-top: ${maskedTheme.spacing.sm};

  ${media.mobile} {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
`

export const HeroMedia = styled.div<Pick<MaskedHeroInternalProps, '$variant'>>`
  min-width: 0;

  img,
  video,
  svg {
    display: block;
    max-width: 100%;
    height: auto;
  }

  ${({ $variant }) =>
    $variant !== 'split' &&
    css`
      width: 100%;
      max-width: 56rem;
      margin-inline: auto;
    `}
`
