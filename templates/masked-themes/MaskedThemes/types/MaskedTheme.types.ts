import 'styled-components'

/* =========================================
   🎨 COLOR VARIANTS
========================================= */
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

export interface NeonColorVariant {
  base: string
  glow: string
  soft: string
  dark: string
}

export interface PastelColorVariant {
  base: string
  glow: string
  soft: string
  dark: string
}

/* =========================================
   🎨 COLOR GROUPS
========================================= */
export interface BaseColors {
  baseGlass: ColorVariants
  baseBlack: ColorVariants
  baseWhite: ColorVariants
  baseBlue: ColorVariants
  baseGreen: ColorVariants
  baseRed: ColorVariants
  baseCyan: ColorVariants
  baseYellow: ColorVariants
  basePurple: ColorVariants
  baseOrange: ColorVariants
  basePink: ColorVariants
}

export interface NeonColors {
  neonPink: NeonColorVariant
  neonPurple: NeonColorVariant
  neonBlue: NeonColorVariant
  neonGreen: NeonColorVariant
  neonRed: NeonColorVariant
  neonYellow: NeonColorVariant
  neonCyan: NeonColorVariant
  neonOrange: NeonColorVariant
}

export interface PastelColors {
  pastelPink: PastelColorVariant
  pastelPurple: PastelColorVariant
  pastelBlue: PastelColorVariant
  pastelGreen: PastelColorVariant
  pastelRed: PastelColorVariant
  pastelYellow: PastelColorVariant
  pastelCyan: PastelColorVariant
  pastelOrange: PastelColorVariant
  pastelMint: PastelColorVariant
}

// cores semânticas dos temas com superfície
export interface ThemeSemanticColors {
  primaryColor?: string
  secondaryColor?: string
  tertiaryColor?: string
  surfaceColor?: string
  textColor?: string
  textMuted?: string
  borderColor?: string
  accentColor?: string
}

/* =========================================
   🔌 DEFAULT THEME (UNIFICADO)
========================================= */
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: BaseColors & Partial<NeonColors> & Partial<PastelColors> & ThemeSemanticColors

    spacing: {
      '2xs': string
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
      '4xl': string
      '5xl': string
    }

    radius: {
      none: string
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
      full: string
    }

    boxShadow: {
      none: string
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
      '2xl': string
      inner: string
    }

    fontSize: {
      '2xs': string
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
      '4xl': string
      '5xl': string
      '6xl': string
      '7xl': string
    }

    fontWeight: {
      thin: string
      light: string
      normal: string
      medium: string
      semibold: string
      bold: string
      extrabold: string
      black: string
    }

    lineHeight: {
      none: string
      tight: string
      snug: string
      normal: string
      relaxed: string
      loose: string
    }

    grid: {
      // auto-fit responsivo
      adaptive: string
      adaptiveSm: string
      adaptiveMd: string
      adaptiveLg: string

      // auto-fill
      autoFill: string
      autoFillSm: string
      autoFillLg: string

      // colunas fixas
      one: string
      two: string
      three: string
      four: string
      five: string
      six: string

      // assimétricos
      sidebarMain: string
      mainSidebar: string
      twoThirds: string
      oneThird: string
      golden: string
      dashboard: string

      // largura máxima
      maxWidth: string
      maxWidthSm: string
      maxWidthMd: string
      maxWidthLg: string
      maxWidthXl: string
      maxWidth2xl: string
    }

    transition: {
      fast: string
      default: string
      slow: string
      bounce: string
      smooth: string
    }

    zIndex: {
      hide: number
      base: number
      raised: number
      dropdown: number
      sticky: number
      overlay: number
      modal: number
      popover: number
      toast: number
      tooltip: number
    }
  }
}
