/* =========================================  
   COLOR THEME REGISTRY (compartilhado)  
  
   Um ColorTheme fornece o conjunto de cores de um tema  
   de cor (ex.: "ruby", "light", "dark"). Cada componente  
   deriva seus tokens --mc-<componente>-* a partir desses  
   valores — o registro é único, a derivação é por componente.  
  
   Dois tipos de tema na MESMA prop colorTheme:  
   - gerados da paleta: qualquer chave de BaseColors (ex.: "baseRose")  
   - presets manuais: registrados via registerColorTheme (ex.: "light", "dark")  
========================================= */
import { DefaultTheme } from "styled-components";
import { ColorVariants } from "../../masked-utils";
import { BaseColors } from "../types/MaskedTheme.types";

/**
 * Valores de cor que um colorTheme expõe para os componentes.
 * Campos opcionais: componentes caem nos defaults quando ausentes.
 */
export interface ColorThemeValues {
  /** Cor principal (fundo/acento). */
  base: string;
  /** Variações claras/escuras da cor principal. */
  light08?: string;
  light20?: string;
  light40?: string;
  light50?: string;
  dark08?: string;
  dark20?: string;
  /** Texto sobre a cor principal (quando o tema define). */
  onBase?: string;
  /** Brilho/glow para efeitos (ring, neon, shadow de active). */
  glow?: string;
}

export type PaletteColorName = keyof BaseColors;

/** Nome de tema aceito na prop colorTheme: chaves da paleta + temas registrados. */
export type ColorThemeName = PaletteColorName | (string & {});

/** Alias curto: "ruby" -> baseRose (cor de exemplo da lib). */
const COLOR_THEME_ALIASES: Record<string, PaletteColorName> = {
  ruby: "baseRose",
};

/* ---------- presets manuais ---------- */

const registry = new Map<string, ColorThemeValues>();

/**
 * Registra um preset de colorTheme (valores escritos à mão).
 * Use para temas próprios ou presets como "light"/"dark".
 *
 * @example
 * registerColorTheme('my-brand', {
 *   base: '#7c3aed',
 *   light40: '#c4b5fd',
 *   dark20: '#4c1d95',
 *   glow: 'rgba(124, 58, 237, 0.5)',
 * })
 */
export function registerColorTheme(
  name: string,
  values: ColorThemeValues,
): void {
  registry.set(name, values);
}

export function unregisterColorTheme(name: string): void {
  registry.delete(name);
}

export function listColorThemes(): string[] {
  return [...registry.keys()];
}

/**
 * Resolve um colorTheme para seus valores de cor.
 *
 * Ordem de resolução:
 * 1. preset registrado (registerColorTheme) — inclui "light"/"dark"
 * 2. alias curto ("ruby" -> baseRose)
 * 3. chave da paleta do tema ativo (ex.: "baseBlue")
 * 4. undefined -> componente usa seu tema default
 *
 * @example resolveColorTheme('ruby', theme)   // valores de baseRose
 * @example resolveColorTheme('light', theme)  // preset manual
 * @example resolveColorTheme(undefined, theme) // undefined
 */
export function resolveColorTheme(
  colorTheme: ColorThemeName | undefined,
  theme: DefaultTheme,
): ColorThemeValues | undefined {
  if (!colorTheme) return undefined;

  const preset = registry.get(colorTheme);
  if (preset) return preset;

  const alias = COLOR_THEME_ALIASES[colorTheme];
  const paletteKey = (alias ?? colorTheme) as PaletteColorName;
  const variants: ColorVariants | undefined = theme.colors[paletteKey];

  if (!variants) return undefined;

  return {
    base: variants.base,
    light08: variants.light08,
    light20: variants.light20,
    light40: variants.light40,
    light50: variants.light50,
    dark08: variants.dark08,
    dark20: variants.dark20,
    glow: variants.light50,
  };
}

/* ---------- presets embutidos ---------- */

/**
 * Preset "light": superfície branca para uso sobre fundos escuros
 * (valores equivalentes ao ex-$theme="light" do Zandry; refinados
 * por componente no PASSO 4 quando cada variante for materializada).
 */
registerColorTheme("light", {
  base: "#ffffff",
  onBase: "#1a1d26",
  light40: "rgba(255,255,255,0.4)",
  dark20: "#dde2ee",
  glow: "rgba(255,255,255,0.5)",
});

/**
 * Preset "dark": superfície escura para uso sobre fundos claros.
 */
registerColorTheme("dark", {
  base: "#1a1d26",
  onBase: "#e8eaf0",
  light40: "#2e3347",
  dark20: "#0f1117",
  glow: "rgba(26,29,38,0.5)",
});
