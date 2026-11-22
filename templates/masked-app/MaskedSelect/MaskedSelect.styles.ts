import styled, { css, keyframes } from 'styled-components'
import type { MaskedSelectInternalProps } from './MaskedSelect.types'

const fadeIn = keyframes`  
  from { opacity: 0; transform: translateY(-4px) }  
  to { opacity: 1; transform: translateY(0) }  
`

export const SelectRoot = styled.div`
  position: relative;
  display: inline-block;
  min-width: 12rem;
  font-family: inherit;
`

export const SelectTrigger = styled.button<MaskedSelectInternalProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  padding: ${({ $size }) =>
    $size === 'sm' ? '0.375rem 0.625rem' : $size === 'lg' ? '0.75rem 1rem' : '0.5rem 0.75rem'};
  font-size: ${({ $size }) => ($size === 'sm' ? '0.8125rem' : $size === 'lg' ? '1rem' : '0.875rem')};
  line-height: 1.4;
  color: var(--mc-select-fg);
  background: var(--mc-select-bg);
  border: 1px solid var(--mc-select-border);
  border-radius: var(--mc-select-radius, 0.5rem);
  cursor: pointer;
  text-align: left;
  transition:
    border-color 120ms ease,
    box-shadow 120ms ease;

  &:focus-visible {
    outline: 2px solid var(--mc-select-selected-bg);
    outline-offset: 2px;
  }

  &[data-placeholder='true'] {
    color: var(--mc-select-placeholder);
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
`

export const SelectChevron = styled.span<MaskedSelectInternalProps>`
  flex-shrink: 0;
  font-size: 0.625em;
  color: var(--mc-select-muted);
  transition: transform 150ms ease;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'none')};
`

export const SelectListbox = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 1000;
  max-height: 16rem;
  overflow-y: auto;
  margin: 0;
  padding: 0.25rem;
  list-style: none;
  background: var(--mc-select-bg);
  border: 1px solid var(--mc-select-border);
  border-radius: var(--mc-select-radius, 0.5rem);
  box-shadow: var(--mc-select-shadow, 0 8px 24px rgba(0, 0, 0, 0.16));
  animation: ${fadeIn} 120ms ease;
`

export const SelectOptionItem = styled.li<MaskedSelectInternalProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.625rem;
  font-size: 0.875rem;
  border-radius: calc(var(--mc-select-radius, 0.5rem) - 2px);
  cursor: pointer;
  user-select: none;
  color: var(--mc-select-item-fg);

  ${({ $highlighted }) =>
    $highlighted &&
    css`
      background: var(--mc-select-item-bg);
    `}

  ${({ $selected }) =>
    $selected &&
    css`
      background: var(--mc-select-selected-bg);
      color: var(--mc-select-selected-fg);
      font-weight: 600;
    `}  
  
  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.45;
      cursor: not-allowed;
    `}
`

export const SelectOptionIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
`

export const SelectCheck = styled.span`
  margin-left: auto;
  font-size: 0.75em;
`
