export interface MaskedThemeTypes {
  colors: {
    baseGlass: ColorVariants;
    baseBlack: ColorVariants;
    baseBlue: ColorVariants;
    baseGreen: ColorVariants;
    baseRed: ColorVariants;
    baseCyan: ColorVariants;
    baseYellow: ColorVariants;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };
  radius: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };
  boxShadow: {
    sm: string;
    md: string;
    lg: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
  };
  grid: {
    adaptive: string;
    autoFit: string;
    one: string;
    two: string;
    three: string;
    four: string;
    compact: string;
    maxWidth: string;
  };
}

interface ColorVariants {
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
