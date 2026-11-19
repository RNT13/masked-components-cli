import { buildTokenStyle } from '@/styles/surfaceTokens'

/** Overrides granulares de tokens --mc-logo-cloud-* (chave = nome sem prefixo). */
export interface LogoCloudTokenOverrides {
  /** Opacidade dos logos em repouso (0 a 1). Default 0.7. */
  opacity?: string
  /** Altura máxima de cada logo. Default 40px. */
  logoHeight?: string
  gap?: string
}

export interface ResolveLogoCloudTokensInput {
  /** Duração (s) da volta do marquee. */
  speed?: number
  tokens?: LogoCloudTokenOverrides
}

/**
 * Deriva tokens --mc-logo-cloud-*. A nuvem de logos é neutra (não pinta):  
 * só opacidade, altura, espaçamento e a duração do marquee.  
 * Precedência: tokens > props > padrão.  
 */
export function resolveLogoCloudTokens(input: ResolveLogoCloudTokensInput): Record<string, string> {
  return buildTokenStyle(
    'logo-cloud',
    { duration: input.speed !== undefined ? `${input.speed}s` : undefined },
    input.tokens
  )
}
