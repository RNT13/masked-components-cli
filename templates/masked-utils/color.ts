// Variações HSL de uma cor base. Domínio: cor.
// Funções puras, SSR-safe, sem dependências. TS >= 4.9.

/**
 * Escala de variações de uma cor em HSL.
 * `light*`/`dark` são HSL opacos; `*02`/`*04`/`*08` são HSLA translúcidos.
 */
export interface ColorVariants {
  base: string;
  light: string;
  light02: string;
  light04: string;
  light08: string;
  light20: string;
  light30: string;
  light40: string;
  light50: string;
  dark: string;
  dark02: string;
  dark04: string;
  dark08: string;
  dark20: string;
  dark30: string;
  dark40: string;
  dark50: string;
}

/**
 * Gera a escala completa de variações de uma cor HSL.
 * Lightness é clampado em [0, 100].
 * @example colorHSLVariants(215, 95, 50).base    // 'hsl(215, 95%, 50%)'
 * @example colorHSLVariants(215, 95, 50).light30 // 'hsl(215, 95%, 80%)'
 */
export function colorHSLVariants(
  h: number,
  s: number,
  l: number,
): ColorVariants {
  const clamp = (val: number) => Math.min(100, Math.max(0, val));
  return {
    base: `hsl(${h}, ${s}%, ${clamp(l)}%)`,
    light: `hsl(${h}, ${s}%, ${clamp(l + 10)}%)`,
    light02: `hsla(${h}, ${s}%, ${clamp(l + 2)}%, 0.2)`,
    light04: `hsla(${h}, ${s}%, ${clamp(l + 4)}%, 0.4)`,
    light08: `hsla(${h}, ${s}%, ${clamp(l + 6)}%, 0.8)`,
    light20: `hsl(${h}, ${s}%, ${clamp(l + 20)}%)`,
    light30: `hsl(${h}, ${s}%, ${clamp(l + 30)}%)`,
    light40: `hsl(${h}, ${s}%, ${clamp(l + 40)}%)`,
    light50: `hsl(${h}, ${s}%, ${clamp(l + 50)}%)`,
    dark: `hsl(${h}, ${s}%, ${clamp(l - 10)}%)`,
    dark02: `hsla(${h}, ${s}%, ${clamp(l - 2)}%, 0.2)`,
    dark04: `hsla(${h}, ${s}%, ${clamp(l - 4)}%, 0.4)`,
    dark08: `hsla(${h}, ${s}%, ${clamp(l - 6)}%, 0.8)`,
    dark20: `hsl(${h}, ${s}%, ${clamp(l - 20)}%)`,
    dark30: `hsl(${h}, ${s}%, ${clamp(l - 30)}%)`,
    dark40: `hsl(${h}, ${s}%, ${clamp(l - 40)}%)`,
    dark50: `hsl(${h}, ${s}%, ${clamp(l - 50)}%)`,
  };
}
