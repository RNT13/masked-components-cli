import { readableTextOn } from '@/utils/masked-utils'  
import { resolveColorTheme, type ColorThemeName } from './MaskedThemes/ColorThemes'  
import { resolveSemanticColors } from './semanticColors'  
import type { DefaultTheme } from 'styled-components'  
  
/**  
 * Tipos de superfície que os componentes de marketing e app compartilham.  
 * - plain: sem pintura (herda o fundo do pai); só destaque (accent);  
 * - tinted: fundo suave;  
 * - solid: cor cheia do colorTheme (ou superfície do tema) com texto por contraste;  
 * - gradient: base → base misturada com o texto (só aumenta o contraste);  
 * - outlined: só a borda.  
 */  
export type SurfaceKind = 'plain' | 'tinted' | 'solid' | 'gradient' | 'outlined'  
  
export interface SurfaceTokens {  
  bg?: string  
  fg?: string  
  /** Texto secundário (sempre derivado do fg quando a superfície é pintada). */  
  muted: string  
  border: string  
  /** Cor de destaque (selo, ícone, item ativo) que se lê sobre a superfície. */  
  accent: string  
  /** Texto legível sobre o accent. */  
  accentFg: string  
}  
  
/**  
 * Deriva as cores de uma superfície a partir do colorTheme e do tema ativo.  
 * Função pura, sem dependência de React. Texto sempre por contraste WCAG  
 * (`onBase` do tema ou `readableTextOn`); em superfícies pintadas o accent é  
 * o próprio texto, o que garante leitura.  
 */  
export function resolveSurface(  
  kind: SurfaceKind,  
  colorTheme: ColorThemeName | undefined,  
  theme: DefaultTheme  
): SurfaceTokens {  
  const colors = resolveColorTheme(colorTheme, theme)  
  const semantic = resolveSemanticColors(theme)  
  
  const accent = colors?.base ?? semantic.accent  
  const accentFg = colors?.onBase ?? readableTextOn(accent)  
  
  const plain: SurfaceTokens = {  
    muted: semantic.muted,  
    border: colors ? (colors.light40 ?? colors.base) : semantic.border,  
    accent,  
    accentFg  
  }  
  
  switch (kind) {  
    case 'tinted':  
      return {  
        ...plain,  
        bg: colors ? `color-mix(in srgb, ${colors.base} 10%, transparent)` : semantic.subtle  
      }  
    case 'solid': {  
      const bg = colors?.base ?? semantic.surface  
      const fg = colors ? (colors.onBase ?? readableTextOn(colors.base)) : semantic.text  
      return {  
        bg,  
        fg,  
        muted: colors ? `color-mix(in srgb, ${fg} 82%, transparent)` : semantic.muted,  
        border: colors ? `color-mix(in srgb, ${fg} 20%, transparent)` : semantic.border,  
        accent: colors ? fg : accent,  
        accentFg: colors ? bg : accentFg  
      }  
    }  
    case 'gradient': {  
      const from = colors?.base ?? semantic.accent  
      const fg = colors?.onBase ?? readableTextOn(from)  
      return {  
        bg: `linear-gradient(135deg, ${from}, color-mix(in srgb, ${from} 82%, ${fg}))`,  
        fg,  
        muted: `color-mix(in srgb, ${fg} 82%, transparent)`,  
        border: 'transparent',  
        accent: fg,  
        accentFg: from  
      }  
    }  
    default:  
      return plain  
  }  
}  
  
/** "cardBg" -> "card-bg". */  
function toKebab(key: string): string {  
  return key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)  
}  
  
/**  
 * Monta o objeto `style` com variáveis `--mc-<prefix>-*`. Os overrides do  
 * usuário vencem; `fg` explícito sem `muted` leva o muted junto, e `bg`  
 * explícito sem `fg` re-deriva o texto por contraste (só quando o bg é cor  
 * simples, não gradiente/color-mix).  
 */  
export function buildTokenStyle(  
  prefix: string,  
  base: Record<string, string | undefined>,  
  /** Overrides do usuário (qualquer interface de tokens com valores string). */  
  overrides?: object  
): Record<string, string> {  
  const custom = (overrides ?? {}) as Record<string, string | undefined>  
  const merged: Record<string, string | undefined> = { ...base, ...custom }  
  
  if (custom.fg && !custom.muted) {  
    merged.muted = `color-mix(in srgb, ${custom.fg} 82%, transparent)`  
  }  
  if (custom.bg && !custom.fg && /^(#|hsl|rgb)/i.test(custom.bg)) {  
    const fg = readableTextOn(custom.bg)  
    merged.fg = fg  
    if (!custom.muted) merged.muted = `color-mix(in srgb, ${fg} 82%, transparent)`  
  }  
  
  const style: Record<string, string> = {}  
  for (const [key, value] of Object.entries(merged)) {  
    if (value !== undefined) style[`--mc-${prefix}-${toKebab(key)}`] = value  
  }  
  return style  
}  