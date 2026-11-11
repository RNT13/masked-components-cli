/* ============================================================
 * PASSWORD TOGGLE
 * Item de 44x44 colocado DEPOIS do input. margin-top: -50px
 * (6px de gap + 44px de altura) sobrepõe exatamente o campo e,
 * como a soma fecha em zero, não empurra o erro para baixo.
 * ============================================================ */

import styled from 'styled-components'

export const PasswordToggle = styled.button.attrs<{ 'data-mc-password-toggle'?: string }>({
  'data-mc-password-toggle': '',
})`
  position: relative;
  z-index: 1;
  align-self: flex-end;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-top: -50px;
  margin-right: 2px;
  padding: 0;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--mc-input-icon-fg, ${({ theme }) => theme.colors.baseBlue.dark});

  svg {
    font-size: 1.4rem;
  }

  &:focus-visible {
    outline: 2px solid var(--mc-input-focus-ring, ${({ theme }) => theme.colors.baseBlue.light});
    outline-offset: -2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`
