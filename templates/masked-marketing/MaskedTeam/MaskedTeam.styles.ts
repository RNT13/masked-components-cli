import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedTeamInternalProps } from './MaskedTeam.types'

export const TeamList = styled.ul<MaskedTeamInternalProps>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: ${maskedTheme.spacing.xl} ${maskedTheme.spacing.lg};
  margin: 0;
  padding: 0;
  list-style: none;

  ${({ $variant }) =>
    $variant === 'cards' &&
    css`
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    `}

  ${({ $variant }) =>
    $variant === 'list' &&
    css`
      grid-template-columns: minmax(0, 1fr);
      max-width: 44rem;
      gap: ${maskedTheme.spacing.lg};
    `}
`

export const MemberItem = styled.li<MaskedTeamInternalProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${maskedTheme.spacing.md};
  min-width: 0;
  text-align: center;

  ${({ $variant }) =>
    $variant === 'cards' &&
    css`
      padding: ${maskedTheme.spacing.lg};
      border: 1px solid var(--mc-team-border, ${maskedTheme.colors.baseGray.light40});
      border-radius: ${maskedTheme.radius.lg};
    `}

  ${({ $variant }) =>
    $variant === 'list' &&
    css`
      flex-direction: row;
      align-items: flex-start;
      text-align: start;

      ${media.mobile} {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    `}
`

export const MemberBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${maskedTheme.spacing.xs};
  min-width: 0;
`

export const MemberName = styled.h3`
  margin: 0;
  color: inherit;
  font-size: ${maskedTheme.fontSize.lg};
  font-weight: ${maskedTheme.fontWeight.semibold};
  line-height: ${maskedTheme.lineHeight.tight};
`

export const MemberRole = styled.p`
  margin: 0;
  color: var(--mc-team-accent, inherit);
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.medium};
`

export const MemberBio = styled.p`
  margin: 0;
  font-size: ${maskedTheme.fontSize.md};
  line-height: ${maskedTheme.lineHeight.relaxed};
  opacity: 0.85;
`

export const MemberLinks = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: inherit;
  gap: ${maskedTheme.spacing.sm};
  margin: ${maskedTheme.spacing.xs} 0 0;
  padding: 0;
  list-style: none;
`

export const MemberLink = styled.a`
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: inherit;
  font-size: ${maskedTheme.fontSize.sm};
  text-decoration: underline;

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
    border-radius: ${maskedTheme.radius.xs};
  }
`
