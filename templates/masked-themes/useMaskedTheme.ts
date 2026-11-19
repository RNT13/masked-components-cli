import { useContext } from 'react'
import { ThemeContext, type DefaultTheme } from 'styled-components'
import { maskedTheme } from './MaskedThemes/MaskedThemes'

/**
 * Tema ativo para componentes da lib, com fallback seguro.  
 *
 * `useTheme()` do styled-components v6 lança erro fora de um  
 * <ThemeProvider>. Este hook lê o contexto direto e, sem provider,  
 * devolve o tema base da lib (`maskedTheme`) — os componentes funcionam  
 * com ou sem ThemeProvider.  
 *
 * Usado pelos componentes novos da V3. Componentes que o importam devem  
 * declarar `requires: ['masked-themes']` no registry (conferido por teste).  
 */
export function useMaskedTheme(): DefaultTheme {
  return useContext(ThemeContext) ?? maskedTheme
}
