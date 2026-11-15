// Variações HSL de uma cor base + utilitários de contraste. Domínio: cor.
// Funções puras, SSR-safe, sem dependências. TS >= 4.9.

/**
 * Escala de variações de uma cor em HSL.
 * `light*`/`dark` são HSL opacos; `*02`/`*04`/`*08` são HSLA translúcidos.
 */
export interface ColorVariants {
  base: string
  light: string
  light02: string
  light04: string
  light08: string
  light20: string
  light30: string
  light40: string
  light50: string
  dark: string
  dark02: string
  dark04: string
  dark08: string
  dark20: string
  dark30: string
  dark40: string
  dark50: string
}

/**
 * Gera a escala completa de variações de uma cor HSL.
 * Lightness é clampado em [0, 100].
 * @example colorHSLVariants(215, 95, 50).base    // 'hsl(215, 95%, 50%)'
 * @example colorHSLVariants(215, 95, 50).light30 // 'hsl(215, 95%, 80%)'
 */
export function colorHSLVariants(h: number, s: number, l: number): ColorVariants {
  const clamp = (val: number) => Math.min(100, Math.max(0, val))
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
    dark50: `hsl(${h}, ${s}%, ${clamp(l - 50)}%)`
  }
}

/* ──────────────── contraste (WCAG) ──────────────── */

export interface Rgb {
  r: number
  g: number
  b: number
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  const sat = Math.min(100, Math.max(0, s)) / 100
  const lig = Math.min(100, Math.max(0, l)) / 100
  const k = (n: number) => (n + h / 30) % 12
  const a = sat * Math.min(lig, 1 - lig)
  const f = (n: number) => lig - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255)
  }
}

const HSL_RE =
  /^hsla?\(\s*(-?[\d.]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%(?:\s*[,/]\s*[\d.]+%?)?\s*\)$/i
const RGB_RE =
  /^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)(?:\s*[,/]\s*[\d.]+%?)?\s*\)$/i

/**
 * Lê `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb()/rgba()` e `hsl()/hsla()`.
 * O canal alpha é ignorado (a cor é tratada como opaca). Inválido -> null.
 * @example parseColor('#fff') // { r: 255, g: 255, b: 255 }
 */
export function parseColor(input: string): Rgb | null {
  const value = input.trim()

  if (value.startsWith('#')) {
    let hex = value.slice(1)
    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('')
    }
    if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(hex)) return null
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16)
    }
  }

  const hsl = HSL_RE.exec(value)
  if (hsl) return hslToRgb(Number(hsl[1]), Number(hsl[2]), Number(hsl[3]))

  const rgb = RGB_RE.exec(value)
  if (rgb) {
    const clamp = (n: number) => Math.min(255, Math.max(0, Math.round(n)))
    return { r: clamp(Number(rgb[1])), g: clamp(Number(rgb[2])), b: clamp(Number(rgb[3])) }
  }

  return null
}

/** Luminância relativa WCAG (0 = preto, 1 = branco). */
export function relativeLuminance({ r, g, b }: Rgb): number {
  const lin = (channel: number) => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/**
 * Razão de contraste WCAG entre duas cores (1 a 21). Cor inválida -> null.
 * AA exige 4.5 para texto normal e 3 para texto grande.
 * @example contrastRatio('#000', '#fff') // 21
 */
export function contrastRatio(a: string, b: string): number | null {
  const ca = parseColor(a)
  const cb = parseColor(b)
  if (!ca || !cb) return null
  const la = relativeLuminance(ca)
  const lb = relativeLuminance(cb)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/* ──────────────── texto legível ──────────────── */

function toHex({ r, g, b }: Rgb): string {
  const h = (n: number) =>
    Math.min(255, Math.max(0, Math.round(n)))
      .toString(16)
      .padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}`
}

/**
 * Escurece `color` misturando-a com preto.
 * `amount` = peso do preto (0 = cor intacta, 1 = preto puro).
 * Preserva o matiz da cor original — é o que gera o "rosa bem escuro".
 */
export function darken(color: string, amount: number): string | null {
  const c = parseColor(color)
  if (!c) return null
  const t = Math.min(1, Math.max(0, amount))
  return toHex({ r: c.r * (1 - t), g: c.g * (1 - t), b: c.b * (1 - t) })
}

export interface ReadableTextOptions {
  /** candidato claro (default '#ffffff') */
  light?: string
  /** candidato escuro neutro (default '#111111') */
  dark?: string
  /**
   * Quando true (default), um terceiro candidato entra na disputa:
   * o próprio `background` escurecido ~78% (preserva o matiz — ex.: rosa
   * vira rosa-escuro). A escolha final continua sendo o maior contraste
   * WCAG, então em fundos escuros o `light` segue vencendo.
   * Passe `tintedDark: false` para voltar ao comportamento antigo.
   */
  tintedDark?: boolean
  /** peso do preto no candidato tingido (default 0.78) */
  tintAmount?: number
}

/**
 * Escolhe a cor de texto mais legível sobre `background`.
 * Candidatos: `light`, `dark` e (opcional) o background escurecido —
 * este último produz texto "da cor do tema, bem escura" em temas claros.
 * Fundo inválido (ex.: `var(--x)`) -> `dark`.
 * @example readableTextOn('hsl(220, 80%, 50%)') // '#ffffff'
 * @example readableTextOn('#e11d48')             // rosa bem escuro
 * @example readableTextOn('#ffffff')             // '#111111'
 */
export function readableTextOn(background: string, options: ReadableTextOptions = {}): string {
  const { light = '#ffffff', dark = '#111111', tintedDark = true, tintAmount = 0.78 } = options
  const bg = parseColor(background)
  if (!bg) return dark

  const l1 = relativeLuminance(bg)
  const ratio = (fgColor: string, fallback: Rgb): number => {
    const fg = parseColor(fgColor) ?? fallback
    const l2 = relativeLuminance(fg)
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  }

  const candidates: Array<{ color: string; score: number }> = [
    { color: light, score: ratio(light, { r: 255, g: 255, b: 255 }) },
    { color: dark, score: ratio(dark, { r: 17, g: 17, b: 17 }) }
  ]

  if (tintedDark) {
    const tinted = toHex({
      r: bg.r * (1 - tintAmount),
      g: bg.g * (1 - tintAmount),
      b: bg.b * (1 - tintAmount)
    })
    candidates.push({ color: tinted, score: ratio(tinted, bg) })
  }

  candidates.sort((a, b) => b.score - a.score)
  return candidates[0].color
}

/**
 * Escolhe a cor de texto mais legível sobre `background` entre `candidates`.
 * Ordem de decisão:
 *  1. primeiro candidato que atinge AA (4.5:1) — respeita a ordem da lista;
 *  2. se nenhum atingir, o de maior contraste (light/dark entram no pool
 *     como rede de segurança);
 *  3. fundo inválido (ex.: `var(--x)`) -> primeiro candidato válido;
 *  4. lista vazia/sem válidos -> `dark`.
 * @example pickReadable('#111111', ['#fff5f7', '#ffffff']) // '#fff5f7'
 */
export function pickReadable(
  background: string,
  candidates: Array<string | undefined>,
  options: { light?: string; dark?: string } = {}
): string {
  const { light = '#ffffff', dark = '#111111' } = options

  const valid = candidates.filter(
    (c): c is string => typeof c === 'string' && parseColor(c) !== null
  )

  const bg = parseColor(background)
  if (!bg) return valid[0] ?? dark
  if (valid.length === 0) return dark

  /* 1) primeiro que atinge AA — light/dark entram como rede de segurança */
  for (const color of [...valid, light, dark]) {
    const ratio = contrastRatio(color, background)
    if (ratio !== null && ratio >= 4.5) return color
  }

  /* 2) nenhum atingiu AA -> maior contraste APENAS entre os candidatos */
  let best = valid[0]
  let bestRatio = -1
  for (const color of valid) {
    const ratio = contrastRatio(color, background)
    if (ratio !== null && ratio > bestRatio) {
      bestRatio = ratio
      best = color
    }
  }
  return best
}
