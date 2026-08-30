import { colorHSLVariants } from '@/utils/colorUtils'
import { DefaultTheme } from 'styled-components'

/* =========================================
   📱 BREAKPOINTS
========================================= */
export const breakpoints = {
  xs: 360,
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
  ultrawide: 1536
} as const

/* =========================================
   📱 MEDIA QUERIES
========================================= */
export const media = {
  // max-width — "abaixo de X"
  xs: `@media (max-width: ${breakpoints.xs}px)`,
  mobile: `@media (max-width: ${breakpoints.mobile}px)`,
  tablet: `@media (max-width: ${breakpoints.tablet}px)`,
  desktop: `@media (max-width: ${breakpoints.desktop}px)`,
  wide: `@media (max-width: ${breakpoints.wide}px)`,
  ultrawide: `@media (max-width: ${breakpoints.ultrawide}px)`,

  // min-width — "acima de X"
  aboveXs: `@media (min-width: ${breakpoints.xs + 1}px)`,
  aboveMobile: `@media (min-width: ${breakpoints.mobile + 1}px)`,
  aboveTablet: `@media (min-width: ${breakpoints.tablet + 1}px)`,
  aboveDesktop: `@media (min-width: ${breakpoints.desktop + 1}px)`,
  aboveWide: `@media (min-width: ${breakpoints.wide + 1}px)`,
  aboveUltrawide: `@media (min-width: ${breakpoints.ultrawide + 1}px)`,

  // ranges exatos
  onlyMobile: `@media (min-width: ${breakpoints.xs}px) and (max-width: ${breakpoints.mobile}px)`,
  onlyTablet: `@media (min-width: ${breakpoints.mobile + 1}px) and (max-width: ${breakpoints.tablet}px)`,
  onlyDesktop: `@media (min-width: ${breakpoints.tablet + 1}px) and (max-width: ${breakpoints.desktop}px)`,

  // acessibilidade
  reducedMotion: `@media (prefers-reduced-motion: reduce)`,
  darkOS: `@media (prefers-color-scheme: dark)`,
  lightOS: `@media (prefers-color-scheme: light)`,
  touch: `@media (hover: none) and (pointer: coarse)`,
  mouse: `@media (hover: hover) and (pointer: fine)`,
  print: `@media print`
} as const

/* =========================================
   🎨 BASE COLORS
========================================= */
const baseColors = {
  baseGlass: colorHSLVariants(210, 30, 90),
  baseBlack: colorHSLVariants(0, 0, 10),
  baseWhite: colorHSLVariants(0, 0, 98),
  baseBlue: colorHSLVariants(220, 80, 50),
  baseGreen: colorHSLVariants(145, 65, 42),
  baseRed: colorHSLVariants(0, 85, 55),
  baseCyan: colorHSLVariants(188, 78, 45),
  baseYellow: colorHSLVariants(42, 95, 52),
  basePurple: colorHSLVariants(258, 70, 55),
  baseOrange: colorHSLVariants(24, 90, 52),
  basePink: colorHSLVariants(335, 75, 58)
}

/* =========================================
   🌑 DARK THEME
========================================= */
const darkColors = {
  primaryColor: '#0f1117',
  secondaryColor: '#1a1d26',
  tertiaryColor: '#242836',
  surfaceColor: '#2e3347',
  textColor: '#e8eaf0',
  textMuted: '#8b90a4',
  borderColor: '#2e3347'
}

/* =========================================
   ☀️ LIGHT THEME
========================================= */
const lightColors = {
  primaryColor: '#ffffff',
  secondaryColor: '#f4f6fa',
  tertiaryColor: '#e8ecf4',
  surfaceColor: '#dde2ee',
  textColor: '#1a1d26',
  textMuted: '#6b7280',
  borderColor: '#dde2ee'
}

/* =========================================
   🌙 MIDNIGHT — azul escuro profundo
========================================= */
const midnightColors = {
  primaryColor: '#060b18',
  secondaryColor: '#0d1424',
  tertiaryColor: '#111c33',
  surfaceColor: '#172240',
  textColor: '#c8d8f0',
  textMuted: '#5a7aaa',
  borderColor: '#1e2e4a',
  accentColor: '#3d6ef5'
}

/* =========================================
   🌿 FOREST — verde escuro orgânico
========================================= */
const forestColors = {
  primaryColor: '#0a120d',
  secondaryColor: '#111a14',
  tertiaryColor: '#162219',
  surfaceColor: '#1e2e22',
  textColor: '#c4dcc8',
  textMuted: '#5a8262',
  borderColor: '#243328',
  accentColor: '#3db85a'
}

/* =========================================
   🌅 AURORA — sunset gradient base
========================================= */
const auroraColors = {
  primaryColor: '#12080f',
  secondaryColor: '#1c0f1a',
  tertiaryColor: '#261525',
  surfaceColor: '#321c32',
  textColor: '#f0d4ec',
  textMuted: '#9a6898',
  borderColor: '#3e2040',
  accentColor: '#d45ab8'
}

/* =========================================
   ⚪ SLATE — minimal cinza frio
========================================= */
const slateColors = {
  primaryColor: '#f8f9fb',
  secondaryColor: '#edf0f5',
  tertiaryColor: '#e1e6ef',
  surfaceColor: '#d4dae8',
  textColor: '#1e2533',
  textMuted: '#64748b',
  borderColor: '#cbd5e1',
  accentColor: '#3b5bdb'
}

/* =========================================
   🔥 NEON COLORS
========================================= */
const neonColors = {
  neonPink: { base: '#FF2DAA', glow: '#FF74D1', soft: '#FFD0EC', dark: '#C40078' },
  neonPurple: { base: '#B026FF', glow: '#D06CFF', soft: '#EBCBFF', dark: '#7A00CC' },
  neonBlue: { base: '#00E5FF', glow: '#66F4FF', soft: '#CCFBFF', dark: '#0099CC' },
  neonGreen: { base: '#2BFF88', glow: '#74FFB2', soft: '#D4FFE9', dark: '#00C95A' },
  neonRed: { base: '#FF1744', glow: '#FF5C77', soft: '#FFC2CC', dark: '#C4002B' },
  neonYellow: { base: '#FFE600', glow: '#FFF266', soft: '#FFF9C7', dark: '#C7A800' },
  neonCyan: { base: '#00FFF0', glow: '#66FFF7', soft: '#CCFFFC', dark: '#00BFAF' },
  neonOrange: { base: '#FF6B00', glow: '#FFA35C', soft: '#FFDFC7', dark: '#CC4A00' }
}

/* =========================================
   🍬 PASTEL COLORS
========================================= */
const pastelColors = {
  pastelPink: { base: '#F4A9C7', glow: '#F8C5DB', soft: '#FDEAF2', dark: '#E9C4D4' },
  pastelPurple: { base: '#C7B8EA', glow: '#DDD2F4', soft: '#F2EEFB', dark: '#B9A8E3' },
  pastelBlue: { base: '#A9D6F5', glow: '#C7E6FA', soft: '#EAF6FD', dark: '#8C9CF6' },
  pastelGreen: { base: '#B8E0C8', glow: '#D4F0DE', soft: '#EEF9F2', dark: '#7da88a' },
  pastelRed: { base: '#F2B6B6', glow: '#F7CDCD', soft: '#FDEEEE', dark: '#e08888' },
  pastelYellow: { base: '#F6E7A7', glow: '#FAF1C8', soft: '#FEF9E9', dark: '#E2D45C' },
  pastelCyan: { base: '#AEE3E3', glow: '#CFF1F1', soft: '#ECFAFA', dark: '#94E0E3' },
  pastelOrange: { base: '#F9C89A', glow: '#FBD9B8', soft: '#FEF2E6', dark: '#E8A870' },
  pastelMint: { base: '#A8ECD1', glow: '#C5F4E2', soft: '#EDFAF5', dark: '#78D4AA' }
}

/* =========================================
   🧱 STRUCTURE
========================================= */
const structure = {
  spacing: {
    '2xs': '0.125rem', // 2px
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
    '4xl': '6rem', // 96px
    '5xl': '8rem' // 128px
  },

  radius: {
    none: '0',
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '0.75rem', // 12px
    lg: '1rem', // 16px
    xl: '1.5rem', // 24px
    '2xl': '2rem', // 32px
    '3xl': '3rem', // 48px
    full: '9999px' // pill
  },

  boxShadow: {
    none: 'box-shadow: none;',
    xs: `
      box-shadow:
        0 1px 2px rgba(0,0,0,0.08),
        0 1px 4px rgba(0,0,0,0.05);
    `,
    sm: `
      box-shadow:
        0 2px 6px rgba(0,0,0,0.12),
        0 4px 12px rgba(0,0,0,0.08);
    `,
    md: `
      box-shadow:
        0 4px 12px rgba(0,0,0,0.16),
        0 8px 24px rgba(0,0,0,0.10),
        0 0 0 1px rgba(255,255,255,0.03);
    `,
    lg: `
      box-shadow:
        0 8px 20px rgba(0,0,0,0.20),
        0 16px 40px rgba(0,0,0,0.14),
        0 0 0 1px rgba(255,255,255,0.04);
    `,
    xl: `
      box-shadow:
        0 12px 30px rgba(0,0,0,0.26),
        0 24px 60px rgba(0,0,0,0.18),
        0 0 0 1px rgba(255,255,255,0.05);
    `,
    '2xl': `
      box-shadow:
        0 20px 50px rgba(0,0,0,0.32),
        0 40px 80px rgba(0,0,0,0.22),
        0 0 0 1px rgba(255,255,255,0.06);
    `,
    inner: 'box-shadow: inset 0 2px 6px rgba(0,0,0,0.12);'
  },

  fontSize: {
    '2xs': '0.625rem', // 10px
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    md: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem' // 72px
  },

  fontWeight: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },

  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },

  // ← grid melhorado com mais opções
  grid: {
    // auto-fit responsivo
    adaptive: 'repeat(auto-fit, minmax(280px, 1fr))',
    adaptiveSm: 'repeat(auto-fit, minmax(160px, 1fr))',
    adaptiveMd: 'repeat(auto-fit, minmax(220px, 1fr))',
    adaptiveLg: 'repeat(auto-fit, minmax(340px, 1fr))',

    // auto-fill (mantém colunas mesmo vazias)
    autoFill: 'repeat(auto-fill, minmax(260px, 320px))',
    autoFillSm: 'repeat(auto-fill, minmax(140px, 200px))',
    autoFillLg: 'repeat(auto-fill, minmax(300px, 400px))',

    // colunas fixas
    one: 'repeat(1, 1fr)',
    two: 'repeat(2, 1fr)',
    three: 'repeat(3, 1fr)',
    four: 'repeat(4, 1fr)',
    five: 'repeat(5, 1fr)',
    six: 'repeat(6, 1fr)',

    // layouts assimétricos
    sidebarMain: '240px 1fr', // sidebar + conteúdo
    mainSidebar: '1fr 240px', // conteúdo + sidebar
    twoThirds: '2fr 1fr', // 2/3 + 1/3
    oneThird: '1fr 2fr', // 1/3 + 2/3
    golden: '1.618fr 1fr', // proporção áurea
    dashboard: 'repeat(auto-fit, minmax(200px, 1fr))', // cards KPI

    // largura máxima de container
    maxWidth: '1200px',
    maxWidthSm: '640px',
    maxWidthMd: '768px',
    maxWidthLg: '1024px',
    maxWidthXl: '1280px',
    maxWidth2xl: '1536px'
  },

  // transições predefinidas
  transition: {
    fast: '0.15s ease',
    default: '0.25s ease',
    slow: '0.4s ease',
    bounce: '0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: '0.35s cubic-bezier(0.4, 0, 0.2, 1)'
  },

  // z-index escala
  zIndex: {
    hide: -1,
    base: 0,
    raised: 10,
    dropdown: 100,
    sticky: 200,
    overlay: 300,
    modal: 400,
    popover: 500,
    toast: 600,
    tooltip: 700
  }
}

/* =========================================
   🎨 THEMES
========================================= */
export const maskedTheme: DefaultTheme = {
  ...structure,
  colors: baseColors
}

export const darkTheme: DefaultTheme = {
  ...structure,
  colors: { ...baseColors, ...darkColors }
}

export const lightTheme: DefaultTheme = {
  ...structure,
  colors: { ...baseColors, ...lightColors }
}

export const midnightTheme: DefaultTheme = {
  ...structure,
  colors: { ...baseColors, ...midnightColors }
}

export const forestTheme: DefaultTheme = {
  ...structure,
  colors: { ...baseColors, ...forestColors }
}

export const auroraTheme: DefaultTheme = {
  ...structure,
  colors: { ...baseColors, ...auroraColors }
}

export const slateTheme: DefaultTheme = {
  ...structure,
  colors: { ...baseColors, ...slateColors }
}

export const neonTheme: DefaultTheme = {
  ...structure,
  colors: { ...baseColors, ...neonColors }
}

export const pastelTheme: DefaultTheme = {
  ...structure,
  colors: { ...baseColors, ...pastelColors }
}

/* =========================================
   📦 EXPORT
========================================= */
export const maskedThemeConfig = {
  default: maskedTheme,
  dark: darkTheme,
  light: lightTheme,
  midnight: midnightTheme,
  forest: forestTheme,
  aurora: auroraTheme,
  slate: slateTheme,
  neon: neonTheme,
  pastel: pastelTheme
} as const

export type ThemeKey = keyof typeof maskedThemeConfig
