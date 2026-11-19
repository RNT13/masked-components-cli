import styled, { css, keyframes } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedLogoCloudInternalProps } from './MaskedLogoCloud.types'

const scroll = keyframes`  
  from { transform: translateX(0); }  
  to { transform: translateX(-50%); }  
`

export const LogoViewport = styled.div<MaskedLogoCloudInternalProps>`
  ${({ $variant }) =>
    $variant === 'marquee' &&
    css`
      overflow: hidden;
      mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
    `}
`

export const LogoTrack = styled.div<MaskedLogoCloudInternalProps>`
  ${({ $variant }) =>
    $variant === 'marquee' &&
    css`
      display: flex;
      width: max-content;
      animation: ${scroll} var(--mc-logo-cloud-duration, 30s) linear infinite;

      &:hover,
      &:focus-within {
        animation-play-state: paused;
      }

      /* sem animação: a segunda cópia (aria-hidden) some e a lista quebra linha */
      ${media.reducedMotion} {
        animation: none;
        width: auto;
        flex-wrap: wrap;

        > ul[aria-hidden='true'] {
          display: none;
        }
      }
    `}
`

export const LogoList = styled.ul<MaskedLogoCloudInternalProps>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--mc-logo-cloud-gap, ${maskedTheme.spacing.xl});
  margin: 0;
  padding: 0;
  list-style: none;

  ${({ $variant }) =>
    $variant === 'grid' &&
    css`
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
      justify-items: center;
    `}

  ${({ $variant }) =>
    $variant === 'marquee' &&
    css`
      flex-wrap: nowrap;
      flex: none;
      padding-inline-end: var(--mc-logo-cloud-gap, ${maskedTheme.spacing.xl});
    `}  
  
  ${media.mobile} {
    gap: var(--mc-logo-cloud-gap, ${maskedTheme.spacing.lg});
  }
`

export const LogoItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: var(--mc-logo-cloud-opacity, 0.7);
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }

  img,
  svg {
    display: block;
    width: auto;
    max-width: 100%;
    max-height: var(--mc-logo-cloud-logo-height, 40px);
  }

  ${media.reducedMotion} {
    transition: none;
  }
`
