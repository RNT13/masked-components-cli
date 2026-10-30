import "styled-components";

/* =========================================  
   COLOR VARIANTS  
========================================= */
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

export interface AccentColorVariant {
  base: string;
  glow: string;
  soft: string;
  dark: string;
}

export interface ThemeGradient {
  primary: string;
  primarySoft: string;
  primaryVertical: string;
  lilac: string;
  sunset: string;
  ocean: string;
  forest: string;
}

/* =========================================  
   COLOR GROUPS  
========================================= */
export interface BaseColors {
  // Neutros
  baseBlack: ColorVariants;
  baseWhite: ColorVariants;
  basePureWhite: ColorVariants;
  baseGlass: ColorVariants;
  baseGray: ColorVariants;

  // Cores padrão
  baseBlue: ColorVariants;
  baseGreen: ColorVariants;
  baseRed: ColorVariants;
  baseCyan: ColorVariants;
  baseYellow: ColorVariants;
  basePurple: ColorVariants;
  baseOrange: ColorVariants;
  basePink: ColorVariants;

  // Extras
  baseIndigo: ColorVariants;
  baseTeal: ColorVariants;
  baseAmber: ColorVariants;
  baseLime: ColorVariants;
  baseRose: ColorVariants;
  baseSky: ColorVariants;
  baseViolet: ColorVariants;
  baseEmerald: ColorVariants;
  baseFuchsia: ColorVariants;
  baseBrown: ColorVariants;
  baseGold: ColorVariants;

  // Paleta primária/secundária (valores ex-Zandry, nomes neutros)
  basePrimary: ColorVariants;
  baseSecondary: ColorVariants;
  baseTertiary: ColorVariants;
}

export interface AccentColors {
  accentPink: AccentColorVariant;
  accentPurple: AccentColorVariant;
  accentBlue: AccentColorVariant;
  accentGreen: AccentColorVariant;
  accentRed: AccentColorVariant;
  accentYellow: AccentColorVariant;
  accentCyan: AccentColorVariant;
  accentOrange: AccentColorVariant;
  accentLime: AccentColorVariant;
  accentMagenta: AccentColorVariant;
}

export interface PastelColors {
  pastelPink: AccentColorVariant;
  pastelPurple: AccentColorVariant;
  pastelBlue: AccentColorVariant;
  pastelGreen: AccentColorVariant;
  pastelRed: AccentColorVariant;
  pastelYellow: AccentColorVariant;
  pastelCyan: AccentColorVariant;
  pastelOrange: AccentColorVariant;
  pastelMint: AccentColorVariant;
  pastelLilac: AccentColorVariant;
  pastelPeach: AccentColorVariant;
}

export interface ThemeSemanticColors {
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  surfaceColor?: string;
  textColor?: string;
  textMuted?: string;
  borderColor?: string;
  accentColor?: string;
  successColor?: string;
  warningColor?: string;
  dangerColor?: string;
  infoColor?: string;
}

/* =========================================  
   BOX SHADOW  
========================================= */

/**
 * Sombra reutilizável. O parâmetro `color` é opcional:
 *
 *   box-shadow: ${maskedTheme.boxShadow.lg()};
 *   box-shadow: ${maskedTheme.boxShadow.lg(maskedTheme.colors.baseBlue.light50)};
 *
 * BREAKING vs versões antigas: `boxShadow.lg` (string) virou `boxShadow.lg()` (função).
 */
export type BoxShadowToken = (color?: string) => string;

export interface ThemeBoxShadow {
  none: BoxShadowToken;
  xs: BoxShadowToken;
  sm: BoxShadowToken;
  md: BoxShadowToken;
  lg: BoxShadowToken;
  xl: BoxShadowToken;
  "2xl": BoxShadowToken;
  inner: BoxShadowToken;
}

/* =========================================  
   DEFAULT THEME (module augmentation)  
========================================= */
declare module "styled-components" {
  export interface DefaultTheme {
    colors: BaseColors &
      Partial<AccentColors> &
      Partial<PastelColors> &
      ThemeSemanticColors;

    spacing: {
      "2xs": string;
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      "2xl": string;
      "3xl": string;
      "4xl": string;
      "5xl": string;
    };

    radius: {
      none: string;
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      "2xl": string;
      "3xl": string;
      full: string;
    };

    boxShadow: ThemeBoxShadow;

    fontSize: {
      "2xs": string;
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      "2xl": string;
      "3xl": string;
      "4xl": string;
      "5xl": string;
      "6xl": string;
      "7xl": string;
    };

    fontWeight: {
      thin: string;
      light: string;
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
      extrabold: string;
      black: string;
    };

    lineHeight: {
      none: string;
      tight: string;
      snug: string;
      normal: string;
      relaxed: string;
      loose: string;
    };

    grid: {
      adaptive: string;
      adaptiveSm: string;
      adaptiveMd: string;
      adaptiveLg: string;
      autoFill: string;
      autoFillSm: string;
      autoFillLg: string;
      one: string;
      two: string;
      three: string;
      four: string;
      five: string;
      six: string;
      sidebarMain: string;
      mainSidebar: string;
      twoThirds: string;
      oneThird: string;
      golden: string;
      dashboard: string;
      maxWidth: string;
      maxWidthSm: string;
      maxWidthMd: string;
      maxWidthLg: string;
      maxWidthXl: string;
      maxWidth2xl: string;
    };

    transition: {
      fast: string;
      default: string;
      slow: string;
      bounce: string;
      smooth: string;
    };

    gradient: ThemeGradient;

    zIndex: {
      hide: number;
      base: number;
      raised: number;
      dropdown: number;
      sticky: number;
      overlay: number;
      modal: number;
      popover: number;
      toast: number;
      tooltip: number;
    };
  }
}
