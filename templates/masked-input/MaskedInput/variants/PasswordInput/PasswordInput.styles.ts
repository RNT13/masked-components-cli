/* ============================================================
 * PASSWORD TOGGLE
 * ============================================================ */

import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import styled from 'styled-components'

export const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 44px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--mc-input-icon-fg, ${maskedTheme.colors.baseBlue.dark});

  svg {
    font-size: 1.5rem;
  }
`
