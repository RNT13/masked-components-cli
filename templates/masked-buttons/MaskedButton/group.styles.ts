import styled from 'styled-components'

/** Mensagem de erro de grupo — espelha o ErrorDiv do MaskedInput. */
export const ErrorDiv = styled.div.attrs({ role: 'alert' })`
  color: var(--mc-btn-error-color, ${({ theme }) => theme.colors?.baseRed?.dark30 ?? '#b91c1c'});
  font-size: ${({ theme }) => theme.fontSize?.xs ?? '12px'};
  margin-top: ${({ theme }) => theme.spacing?.xs ?? '4px'};
`

/** Texto auxiliar de grupo — espelha o HelperDiv do MaskedInput. */
export const HelperDiv = styled.div`
  color: var(--mc-btn-helper-color, ${({ theme }) => theme.colors?.textMuted ?? '#6b7280'});
  font-size: ${({ theme }) => theme.fontSize?.xs ?? '12px'};
  margin-top: ${({ theme }) => theme.spacing?.xs ?? '4px'};
`
