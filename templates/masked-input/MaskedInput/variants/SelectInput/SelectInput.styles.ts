/* ============================================================
 * SELECT
 * ============================================================ */

import { revealAnimations } from '@/styles/MaskedAnimations/animations/revealAnimations'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import styled from 'styled-components'

export const SelectTrigger = styled.button`
  cursor: pointer;
`

export const SelectDropdown = styled.div`
  position: fixed;
  padding: 4px 4px 0px 4px;
  border-radius: 16px;
  overflow: hidden;
  background: ${maskedTheme.colors.baseBlue.light30};
  border: 2px solid ${maskedTheme.colors.baseBlue.base};
  z-index: 999999;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);

  transition: ${maskedTheme.transition.slow};

  ${revealAnimations.revealSmoothBounceUp}

  @keyframes selectFade {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export const SelectOption = styled.div`
  width: 100%;
  padding: 8px;
  border-radius: 14px;
  margin-bottom: 4px;
  background: ${maskedTheme.colors.baseBlue.light20};
  color: ${maskedTheme.colors.baseBlue.dark40};
  border: 2px solid ${maskedTheme.colors.baseBlue.dark20};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: 800;
  transition: ${maskedTheme.transition.slow};

  &:hover {
    background: ${maskedTheme.colors.baseBlue.dark20};
    color: ${maskedTheme.colors.baseBlue.light50};
    border-color: ${maskedTheme.colors.baseBlue.light20};
  }
`
