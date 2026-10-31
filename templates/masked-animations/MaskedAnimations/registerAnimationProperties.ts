/**
 * Registra as propriedades CSS (`@property`) usadas pelas bordas animadas
 * premium (gold/silver). Idempotente e seguro no servidor.
 *
 * É chamado automaticamente ao importar o MaskedAnimation: não é preciso
 * montar um <AnimationProvider> nem alterar o arquivo de providers do projeto.
 */

type CssWithRegisterProperty = {
  registerProperty?: (definition: { name: string; syntax: string; inherits: boolean; initialValue: string }) => void
}

const PROPERTIES = ['--gold-angle', '--silver-angle']

let registered = false

export function registerAnimationProperties(): void {
  if (registered || typeof window === 'undefined') return
  registered = true

  const css = (typeof CSS !== 'undefined' ? CSS : undefined) as unknown as CssWithRegisterProperty | undefined
  if (!css || typeof css.registerProperty !== 'function') return

  for (const name of PROPERTIES) {
    try {
      css.registerProperty({ name, syntax: '<angle>', inherits: false, initialValue: '0deg' })
    } catch {
      // já registrado
    }
  }
}

// Registra assim que o módulo é carregado no navegador (no servidor não faz nada).
registerAnimationProperties()
