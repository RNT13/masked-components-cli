/* ============================================================
 * SELECT
 * ============================================================ */

import { revealAnimations } from '@/styles/MaskedAnimations/animations/revealAnimations'
import styled from 'styled-components'

export const SelectTrigger = styled.button`
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`

export const SelectDropdown = styled.div`
  position: fixed;
  padding: 4px 4px 0px 4px;
  border-radius: 16px;
  overflow: auto;
  max-height: min(320px, 60vh);
  background: var(--mc-input-bg, ${({ theme }) => theme.colors.baseBlue.light30});
  border: 2px solid var(--mc-input-border-hover, ${({ theme }) => theme.colors.baseBlue.base});
  z-index: ${({ theme }) => theme.zIndex.tooltip};
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);

  ${revealAnimations.revealSmoothBounceUp}
`

export const SelectOption = styled.div`
  width: 100%;
  padding: 8px;
  border-radius: 14px;
  margin-bottom: 4px;
  background: var(--mc-input-bg-focus, ${({ theme }) => theme.colors.baseBlue.light20});
  color: var(--mc-input-label-fg, ${({ theme }) => theme.colors.baseBlue.dark40});
  border: 2px solid var(--mc-input-border, ${({ theme }) => theme.colors.baseBlue.dark20});
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: 800;
  transition: ${({ theme }) => theme.transition.default};

  &:hover,
  &[data-active='true'] {
    background: var(--mc-input-icon-fg, ${({ theme }) => theme.colors.baseBlue.dark20});
    color: ${({ theme }) => theme.colors.baseBlue.light50};
    border-color: var(--mc-input-bg-focus, ${({ theme }) => theme.colors.baseBlue.light20});
  }

  &[aria-selected='true'] {
    border-color: var(--mc-input-border-hover, ${({ theme }) => theme.colors.baseBlue.base});
  }
`
