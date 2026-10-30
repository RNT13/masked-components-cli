// templates/masked-themes/MaskedThemes.ts
import { DefaultTheme } from "styled-components";
import { colorHSLVariants } from "../../masked-utils";
import { ThemeGradient } from "../types/MaskedTheme.types";

/* =========================================  
   BREAKPOINTS  
========================================= */
export const breakpoints = {
  xs: 360,
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
  ultrawide: 1536,
} as const;

/* =========================================  
   MEDIA QUERIES  
========================================= */
export const media = {
  xs: `@media (max-width: ${breakpoints.xs}px)`,
  mobile: `@media (max-width: ${breakpoints.mobile}px)`,
  tablet: `@media (max-width: ${breakpoints.tablet}px)`,
  desktop: `@media (max-width: ${breakpoints.desktop}px)`,
  wide: `@media (max-width: ${breakpoints.wide}px)`,
  ultrawide: `@media (max-width: ${breakpoints.ultrawide}px)`,

  aboveXs: `@media (min-width: ${breakpoints.xs + 1}px)`,
  aboveMobile: `@media (min-width: ${breakpoints.mobile + 1}px)`,
  aboveTablet: `@media (min-width: ${breakpoints.tablet + 1}px)`,
  aboveDesktop: `@media (min-width: ${breakpoints.desktop + 1}px)`,
  aboveWide: `@media (min-width: ${breakpoints.wide + 1}px)`,
  aboveUltrawide: `@media (min-width: ${breakpoints.ultrawide + 1}px)`,

  onlyMobile: `@media (min-width: ${breakpoints.xs}px) and (max-width: ${breakpoints.mobile}px)`,
  onlyTablet: `@media (min-width: ${breakpoints.mobile}px) and (max-width: ${breakpoints.tablet}px)`,
  onlyDesktop: `@media (min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop}px)`,

  reducedMotion: `@media (prefers-reduced-motion: reduce)`,
  darkOS: `@media (prefers-color-scheme: dark)`,
  lightOS: `@media (prefers-color-scheme: light)`,
  touch: `@media (hover: none) and (pointer: coarse)`,
  mouse: `@media (hover: hover) and (pointer: fine)`,
  print: `@media print`,
} as const;

/* =========================================  
   PALETA BASE  
   Cada cor gera .base, .light/.lightXX, .dark/.darkXX  
   (via colorHSLVariants — masked-utils/color)  
========================================= */
const baseColors = {
  // Neutros
  baseBlack: colorHSLVariants(0, 0, 10),
  baseWhite: colorHSLVariants(0, 0, 98),
  basePureWhite: colorHSLVariants(0, 0, 100),
  baseGlass: colorHSLVariants(210, 30, 90),
  baseGray: colorHSLVariants(220, 10, 50),

  // Cores padrão
  baseBlue: colorHSLVariants(220, 80, 50),
  baseGreen: colorHSLVariants(145, 65, 42),
  baseRed: colorHSLVariants(0, 85, 55),
  baseCyan: colorHSLVariants(188, 78, 45),
  baseYellow: colorHSLVariants(42, 95, 52),
  basePurple: colorHSLVariants(258, 70, 55),
  baseOrange: colorHSLVariants(24, 90, 52),
  basePink: colorHSLVariants(335, 75, 58),

  // Extras
  baseIndigo: colorHSLVariants(243, 75, 59),
  baseTeal: colorHSLVariants(173, 65, 40),
  baseAmber: colorHSLVariants(38, 92, 50),
  baseLime: colorHSLVariants(84, 70, 45),
  baseRose: colorHSLVariants(350, 80, 60),
  baseSky: colorHSLVariants(199, 89, 55),
  baseViolet: colorHSLVariants(270, 75, 60),
  baseEmerald: colorHSLVariants(152, 68, 40),
  baseFuchsia: colorHSLVariants(292, 80, 58),
  baseBrown: colorHSLVariants(25, 40, 35),
  baseGold: colorHSLVariants(45, 85, 48),

  // Paleta primária/secundária (nomes neutros; valores preservados)
  basePrimary: colorHSLVariants(224, 76, 33),
  baseSecondary: colorHSLVariants(214, 95, 62),
  baseTertiary: colorHSLVariants(258, 90, 66),
};

/* =========================================  
   DEFAULT — cores semânticas  
========================================= */
const defaultColors = {
  primaryColor: baseColors.basePureWhite.base,
  secondaryColor: baseColors.baseGlass.light20,
  tertiaryColor: baseColors.baseGlass.base,
  surfaceColor: baseColors.basePureWhite.base,
  textColor: baseColors.basePrimary.base,
  textMuted: baseColors.baseGray.base,
  borderColor: baseColors.baseGlass.dark02,
  accentColor: baseColors.baseBlue.base,
  successColor: baseColors.baseGreen.base,
  warningColor: baseColors.baseAmber.base,
  dangerColor: baseColors.baseRed.base,
  infoColor: baseColors.baseSky.base,
};

/* =========================================  
   DARK THEME  
========================================= */
const darkColors = {
  primaryColor: "#0f1117",
  secondaryColor: "#1a1d26",
  tertiaryColor: "#242836",
  surfaceColor: "#2e3347",
  textColor: "#e8eaf0",
  textMuted: "#8b90a4",
  borderColor: "#2e3347",
  accentColor: baseColors.baseSecondary.base,
  successColor: baseColors.baseGreen.base,
  warningColor: baseColors.baseAmber.base,
  dangerColor: baseColors.baseRed.base,
  infoColor: baseColors.baseSky.base,
};

/* =========================================  
   LIGHT THEME  
========================================= */
const lightColors = {
  primaryColor: "#ffffff",
  secondaryColor: "#f4f6fa",
  tertiaryColor: "#e8ecf4",
  surfaceColor: "#dde2ee",
  textColor: "#1a1d26",
  textMuted: "#6b7280",
  borderColor: "#dde2ee",
  accentColor: baseColors.baseBlue.base,
  successColor: baseColors.baseGreen.dark20,
  warningColor: baseColors.baseAmber.dark20,
  dangerColor: baseColors.baseRed.dark20,
  infoColor: baseColors.baseSky.dark20,
};

/* =========================================  
   MIDNIGHT — azul escuro profundo  
========================================= */
const midnightColors = {
  primaryColor: "#060b18",
  secondaryColor: "#0d1424",
  tertiaryColor: "#111c33",
  surfaceColor: "#172240",
  textColor: "#c8d8f0",
  textMuted: "#5a7aaa",
  borderColor: "#1e2e4a",
  accentColor: "#3d6ef5",
  successColor: baseColors.baseGreen.light20,
  warningColor: baseColors.baseAmber.light20,
  dangerColor: baseColors.baseRed.light20,
  infoColor: baseColors.baseSky.light20,
};

/* =========================================  
   FOREST — verde escuro orgânico  
========================================= */
const forestColors = {
  primaryColor: "#0a120d",
  secondaryColor: "#111a14",
  tertiaryColor: "#162219",
  surfaceColor: "#1e2e22",
  textColor: "#c4dcc8",
  textMuted: "#5a8262",
  borderColor: "#243328",
  accentColor: "#3db85a",
  successColor: baseColors.baseGreen.light30,
  warningColor: baseColors.baseAmber.light20,
  dangerColor: baseColors.baseRed.light20,
  infoColor: baseColors.baseSky.light20,
};

/* =========================================  
   AURORA — sunset base  
========================================= */
const auroraColors = {
  primaryColor: "#12080f",
  secondaryColor: "#1c0f1a",
  tertiaryColor: "#261525",
  surfaceColor: "#321c32",
  textColor: "#f0d4ec",
  textMuted: "#9a6898",
  borderColor: "#3e2040",
  accentColor: "#d45ab8",
  successColor: baseColors.baseGreen.light20,
  warningColor: baseColors.baseAmber.light20,
  dangerColor: baseColors.baseRed.light20,
  infoColor: baseColors.baseSky.light20,
};

/* =========================================  
   SLATE — minimal cinza frio  
========================================= */
const slateColors = {
  primaryColor: "#f8f9fb",
  secondaryColor: "#edf0f5",
  tertiaryColor: "#e1e6ef",
  surfaceColor: "#d4dae8",
  textColor: "#1e2533",
  textMuted: "#64748b",
  borderColor: "#cbd5e1",
  accentColor: "#3b5bdb",
  successColor: baseColors.baseGreen.dark20,
  warningColor: baseColors.baseAmber.dark20,
  dangerColor: baseColors.baseRed.dark20,
  infoColor: baseColors.baseSky.dark20,
};

/* =========================================  
   ACCENT COLORS (ex-neon; nomes neutros, valores iguais)  
========================================= */
const accentColors = {
  accentPink: {
    base: "#FF2DAA",
    glow: "#FF74D1",
    soft: "#FFD0EC",
    dark: "#C40078",
  },
  accentPurple: {
    base: "#B026FF",
    glow: "#D06CFF",
    soft: "#EBCBFF",
    dark: "#7A00CC",
  },
  accentBlue: {
    base: "#00E5FF",
    glow: "#66F4FF",
    soft: "#CCFBFF",
    dark: "#0099CC",
  },
  accentGreen: {
    base: "#2BFF88",
    glow: "#74FFB2",
    soft: "#D4FFE9",
    dark: "#00C95A",
  },
  accentRed: {
    base: "#FF1744",
    glow: "#FF5C77",
    soft: "#FFC2CC",
    dark: "#C4002B",
  },
  accentYellow: {
    base: "#FFE600",
    glow: "#FFF266",
    soft: "#FFF9C7",
    dark: "#C7A800",
  },
  accentCyan: {
    base: "#00FFF0",
    glow: "#66FFF7",
    soft: "#CCFFFC",
    dark: "#00BFAF",
  },
  accentOrange: {
    base: "#FF6B00",
    glow: "#FFA35C",
    soft: "#FFDFC7",
    dark: "#CC4A00",
  },
  accentLime: {
    base: "#C6FF00",
    glow: "#DFFF66",
    soft: "#F2FFCC",
    dark: "#96C400",
  },
  accentMagenta: {
    base: "#FF00E5",
    glow: "#FF66F0",
    soft: "#FFCCFA",
    dark: "#C400AF",
  },
};

/* =========================================  
   PASTEL COLORS  
========================================= */
const pastelColors = {
  pastelPink: {
    base: "#F4A9C7",
    glow: "#F8C5DB",
    soft: "#FDEAF2",
    dark: "#E9C4D4",
  },
  pastelPurple: {
    base: "#C7B8EA",
    glow: "#DDD2F4",
    soft: "#F2EEFB",
    dark: "#B9A8E3",
  },
  pastelBlue: {
    base: "#A9D6F5",
    glow: "#C7E6FA",
    soft: "#EAF6FD",
    dark: "#8C9CF6",
  },
  pastelGreen: {
    base: "#B8E0C8",
    glow: "#D4F0DE",
    soft: "#EEF9F2",
    dark: "#7da88a",
  },
  pastelRed: {
    base: "#F2B6B6",
    glow: "#F7CDCD",
    soft: "#FDEEEE",
    dark: "#e08888",
  },
  pastelYellow: {
    base: "#F6E7A7",
    glow: "#FAF1C8",
    soft: "#FEF9E9",
    dark: "#E2D45C",
  },
  pastelCyan: {
    base: "#AEE3E3",
    glow: "#CFF1F1",
    soft: "#ECFAFA",
    dark: "#94E0E3",
  },
  pastelOrange: {
    base: "#F9C89A",
    glow: "#FBD9B8",
    soft: "#FEF2E6",
    dark: "#E8A870",
  },
  pastelMint: {
    base: "#A8ECD1",
    glow: "#C5F4E2",
    soft: "#EDFAF5",
    dark: "#78D4AA",
  },
  pastelLilac: {
    base: "#D8C7F0",
    glow: "#E9DEF7",
    soft: "#F6F1FC",
    dark: "#C3ACE8",
  },
  pastelPeach: {
    base: "#FAD1B0",
    glow: "#FCE1C9",
    soft: "#FEF3E9",
    dark: "#F0B37E",
  },
};

/* =========================================  
   GRADIENTES — helper + presets  
========================================= */
export const createGradient = (
  colors: string[],
  angle: number = 135,
): string => {
  const stops = colors
    .map(
      (color, index) =>
        `${color} ${Math.round((index / Math.max(colors.length - 1, 1)) * 100)}%`,
    )
    .join(", ");

  return `linear-gradient(${angle}deg, ${stops})`;
};

const gradient: ThemeGradient = {
  primary: createGradient([
    baseColors.basePrimary.base,
    baseColors.baseBlue.base,
    baseColors.baseTertiary.light,
  ]),
  primarySoft: createGradient([
    baseColors.baseBlue.light40,
    baseColors.baseTertiary.light40,
  ]),
  primaryVertical: createGradient(
    [baseColors.basePrimary.base, baseColors.baseTertiary.base],
    180,
  ),
  lilac: createGradient([
    baseColors.baseTertiary.base,
    baseColors.baseBlue.light20,
  ]),
  sunset: createGradient([
    baseColors.baseOrange.base,
    baseColors.basePink.base,
    baseColors.basePurple.base,
  ]),
  ocean: createGradient([baseColors.baseCyan.base, baseColors.baseBlue.dark20]),
  forest: createGradient([
    baseColors.baseGreen.dark20,
    baseColors.baseGreen.light20,
  ]),
};

/* =========================================  
   BOX SHADOWS — função (BREAKING: boxShadow.lg -> boxShadow.lg())  
========================================= */
type ShadowLayer = {
  inset?: boolean;
  x: string;
  y: string;
  blur: string;
  spread?: string;
  opacity: number;
  defaultColor: string;
};

const createShadow =
  (layers: ShadowLayer[]) =>
  (color?: string): string => {
    const customColor = typeof color === "string" ? color : undefined;

    const colorWithOpacity = (
      resolvedColor: string,
      opacity: number,
    ): string => {
      if (customColor) {
        return `color-mix(in srgb, ${customColor} ${opacity * 100}%, transparent)`;
      }
      return resolvedColor;
    };

    return `box-shadow: ${layers
      .map((layer) => {
        const resolvedColor = customColor ?? layer.defaultColor;
        const shadowColor = colorWithOpacity(resolvedColor, layer.opacity);
        return `${layer.inset ? "inset " : ""}${layer.x} ${layer.y} ${layer.blur}${
          layer.spread ? ` ${layer.spread}` : ""
        } ${shadowColor}`;
      })
      .join(", ")};`;
  };

/* =========================================  
   STRUCTURE  
========================================= */
const structure = {
  spacing: {
    "2xs": "0.125rem",
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
    "4xl": "6rem",
    "5xl": "8rem",
  },

  radius: {
    none: "0",
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
    "3xl": "3rem",
    full: "9999px",
  },

  boxShadow: {
    none: () => "box-shadow: none;",
    xs: createShadow([
      {
        x: "0",
        y: "1px",
        blur: "2px",
        opacity: 0.08,
        defaultColor: "rgba(0,0,0,0.08)",
      },
      {
        x: "0",
        y: "1px",
        blur: "4px",
        opacity: 0.05,
        defaultColor: "rgba(0,0,0,0.05)",
      },
    ]),
    sm: createShadow([
      {
        x: "0",
        y: "2px",
        blur: "6px",
        opacity: 0.12,
        defaultColor: "rgba(0,0,0,0.12)",
      },
      {
        x: "0",
        y: "4px",
        blur: "12px",
        opacity: 0.08,
        defaultColor: "rgba(0,0,0,0.08)",
      },
    ]),
    md: createShadow([
      {
        x: "0",
        y: "4px",
        blur: "12px",
        opacity: 0.16,
        defaultColor: "rgba(0,0,0,0.16)",
      },
      {
        x: "0",
        y: "8px",
        blur: "24px",
        opacity: 0.1,
        defaultColor: "rgba(0,0,0,0.10)",
      },
      {
        x: "0",
        y: "0",
        blur: "0",
        spread: "1px",
        opacity: 0.03,
        defaultColor: "rgba(255,255,255,0.03)",
      },
    ]),
    lg: createShadow([
      {
        x: "0",
        y: "8px",
        blur: "20px",
        opacity: 0.2,
        defaultColor: "rgba(0,0,0,0.20)",
      },
      {
        x: "0",
        y: "16px",
        blur: "40px",
        opacity: 0.14,
        defaultColor: "rgba(0,0,0,0.14)",
      },
      {
        x: "0",
        y: "0",
        blur: "0",
        spread: "1px",
        opacity: 0.04,
        defaultColor: "rgba(255,255,255,0.04)",
      },
    ]),
    xl: createShadow([
      {
        x: "0",
        y: "12px",
        blur: "28px",
        opacity: 0.22,
        defaultColor: "rgba(0,0,0,0.22)",
      },
      {
        x: "0",
        y: "24px",
        blur: "56px",
        opacity: 0.16,
        defaultColor: "rgba(0,0,0,0.16)",
      },
      {
        x: "0",
        y: "0",
        blur: "0",
        spread: "1px",
        opacity: 0.05,
        defaultColor: "rgba(255,255,255,0.05)",
      },
    ]),
    "2xl": createShadow([
      {
        x: "0",
        y: "20px",
        blur: "48px",
        opacity: 0.24,
        defaultColor: "rgba(0,0,0,0.24)",
      },
      {
        x: "0",
        y: "32px",
        blur: "72px",
        opacity: 0.18,
        defaultColor: "rgba(0,0,0,0.18)",
      },
      {
        x: "0",
        y: "0",
        blur: "0",
        spread: "1px",
        opacity: 0.06,
        defaultColor: "rgba(255,255,255,0.06)",
      },
    ]),
    inner: createShadow([
      {
        inset: true,
        x: "0",
        y: "2px",
        blur: "6px",
        opacity: 0.12,
        defaultColor: "rgba(0,0,0,0.12)",
      },
    ]),
  },

  fontSize: {
    "2xs": "0.625rem",
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
  },

  fontWeight: {
    thin: "100",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },

  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },

  grid: {
    adaptive: "repeat(auto-fit, minmax(280px, 1fr))",
    adaptiveSm: "repeat(auto-fit, minmax(160px, 1fr))",
    adaptiveMd: "repeat(auto-fit, minmax(220px, 1fr))",
    adaptiveLg: "repeat(auto-fit, minmax(340px, 1fr))",
    autoFill: "repeat(auto-fill, minmax(260px, 320px))",
    autoFillSm: "repeat(auto-fill, minmax(140px, 200px))",
    autoFillLg: "repeat(auto-fill, minmax(300px, 400px))",
    one: "repeat(1, 1fr)",
    two: "repeat(2, 1fr)",
    three: "repeat(3, 1fr)",
    four: "repeat(4, 1fr)",
    five: "repeat(5, 1fr)",
    six: "repeat(6, 1fr)",
    sidebarMain: "240px 1fr",
    mainSidebar: "1fr 240px",
    twoThirds: "2fr 1fr",
    oneThird: "1fr 2fr",
    golden: "1.618fr 1fr",
    dashboard: "repeat(auto-fit, minmax(200px, 1fr))",
    maxWidth: "1200px",
    maxWidthSm: "640px",
    maxWidthMd: "768px",
    maxWidthLg: "1024px",
    maxWidthXl: "1280px",
    maxWidth2xl: "1536px",
  },

  transition: {
    fast: "0.15s ease",
    default: "0.25s ease",
    slow: "0.4s ease",
    bounce: "0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    smooth: "0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  gradient,

  // Escala única de camadas (drawer=modal, popup=popover,
  // dropdowns em portal=tooltip — sempre acima de overlays)
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
    tooltip: 700,
  },
};

/* =========================================  
   THEMES  
========================================= */
export const maskedTheme: DefaultTheme = {
  ...structure,
  colors: { ...baseColors, ...defaultColors },
};

export const darkTheme: DefaultTheme = {
  ...structure,
  colors: { ...baseColors, ...darkColors },
};

export const lightTheme: DefaultTheme = {
  ...structure,
  colors: { ...baseColors, ...lightColors },
};

export const midnightTheme: DefaultTheme = {
  ...structure,
  colors: { ...baseColors, ...midnightColors },
};

export const forestTheme: DefaultTheme = {
  ...structure,
  colors: { ...baseColors, ...forestColors },
};

export const auroraTheme: DefaultTheme = {
  ...structure,
  colors: { ...baseColors, ...auroraColors },
};

export const slateTheme: DefaultTheme = {
  ...structure,
  colors: { ...baseColors, ...slateColors },
};

export const accentTheme: DefaultTheme = {
  ...structure,
  colors: {
    ...baseColors,
    ...darkColors,
    ...accentColors,
    accentColor: accentColors.accentBlue.base,
  },
};

export const pastelTheme: DefaultTheme = {
  ...structure,
  colors: {
    ...baseColors,
    ...lightColors,
    ...pastelColors,
    accentColor: pastelColors.pastelBlue.base,
  },
};

/* =========================================  
   EXPORT  
========================================= */
export const maskedThemeConfig = {
  default: maskedTheme,
  dark: darkTheme,
  light: lightTheme,
  midnight: midnightTheme,
  forest: forestTheme,
  aurora: auroraTheme,
  slate: slateTheme,
  accent: accentTheme,
  pastel: pastelTheme,
} as const;

export type ThemeKey = keyof typeof maskedThemeConfig;
