/* ============================================================
 * PASSWORD TOGGLE
 * ============================================================ */

import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import styled from 'styled-components'

export const PasswordToggle = styled.div`
  position: absolute;
  right: 12px;
  top: 44px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${maskedTheme.colors.baseBlue.dark};

  svg {
    font-size: 1.5rem;
  }
`
