import { useSyncExternalStore } from 'react'  
  
/**  
 * useMounted — true no client, false no servidor (SSR-safe).  
 *  
 * Usa useSyncExternalStore com getServerSnapshot retornando false:  
 * sem efeito, sem flash de conteúdo, sem warning de hidratação.  
 * Mesmo padrão já usado inline por MaskedPopup e MaskedDrawer.  
 */  
export function useMounted(): boolean {  
  return useSyncExternalStore(  
    () => () => {},  
    () => true, // client  
    () => false // server  
  )  
}  