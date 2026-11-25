/* ============================================================
 * PASSWORD FIELD
 * Wrapper relativo posiciona o toggle de forma absoluta dentro
 * do campo — sem margin-top negativo nem truque de sobreposição.
 * ============================================================ */

import styled from 'styled-components'

export const PasswordFieldWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  input {
    flex: 1;
    min-width: 0;
    /* espaço para o toggle não cobrir o texto */
    padding-right: 48px;
  }
`

export const PasswordToggle = styled.button.attrs<{ 'data-mc-password-toggle'?: string }>({
  'data-mc-password-toggle': ''
})`
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--mc-input-icon-fg, ${({ theme }) => theme.colors?.baseBlue?.dark ?? '#1e3a8a'});

  svg {
    font-size: 1.4rem;
  }

  &:focus-visible {
    outline: 2px solid
      var(--mc-input-focus-ring, ${({ theme }) => theme.colors?.baseBlue?.light ?? '#93c5fd'});
    outline-offset: -2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`
