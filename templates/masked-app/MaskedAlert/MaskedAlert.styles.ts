import styled, { css } from 'styled-components'
import type { MaskedAlertInternalProps } from './MaskedAlert.types'

export const AlertRoot = styled.div<MaskedAlertInternalProps>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: var(--mc-alert-radius, 0.5rem);
  background: var(--mc-alert-bg, transparent);
  color: var(--mc-alert-fg, inherit);
  border: 1px solid var(--mc-alert-border, transparent);
  font-size: 0.875rem;
  line-height: 1.45;

  ${({ $variant }) =>
    $variant === 'outline' &&
    css`
      background: transparent;
    `}
`

export const AlertIcon = styled.span`
  flex: none;
  display: inline-flex;
  margin-top: 0.125rem;
  color: var(--mc-alert-icon, currentColor);

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`

export const AlertBody = styled.div`
  flex: 1;
  min-width: 0;
`

export const AlertTitle = styled.strong`
  display: block;
  font-weight: 600;
  margin-bottom: 0.125rem;
`

export const AlertAction = styled.span`
  flex: none;
  display: inline-flex;
  align-items: center;
`

export const AlertClose = styled.button`
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  margin: -0.125rem -0.25rem 0 0;
  border: 0;
  border-radius: 0.375rem;
  background: transparent;
  color: inherit;
  cursor: pointer;
  opacity: 0.7;

  &:hover {
    opacity: 1;
    background: color-mix(in srgb, currentColor 10%, transparent);
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 1px;
    opacity: 1;
  }
`
