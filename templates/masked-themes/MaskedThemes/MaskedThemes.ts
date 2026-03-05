import { colorHSLVariants } from "@/utils/colorUtils";
import { MaskedThemeTypes } from "./types/MaskedTheme.types";

export const media = {
  pc: "@media (max-width: 1024px)",
  tablet: "@media (max-width: 768px)",
  mobile: "@media (max-width: 480px)",
};

export const baseGlass = colorHSLVariants(210, 30, 90);
export const baseBlack = colorHSLVariants(0, 0, 10);
export const baseBlue = colorHSLVariants(220, 80, 50);
export const baseGreen = colorHSLVariants(100, 100, 50);
export const baseRed = colorHSLVariants(0, 100, 50);
export const baseCyan = colorHSLVariants(180, 150, 50);
export const baseYellow = colorHSLVariants(60, 100, 50);

export const maskedTheme: MaskedThemeTypes = {
  colors: {
    baseGlass,
    baseBlack,
    baseBlue,
    baseGreen,
    baseRed,
    baseCyan,
    baseYellow,
  },

  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "2rem",
    xl: "3rem",
    "2xl": "4rem",
  },

  radius: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "2rem",
    xl: "3rem",
    "2xl": "4rem",
  },

  boxShadow: {
    sm: "0 2px 4px rgba(0, 0, 0, 0.1)",
    md: "0 4px 8px rgba(0, 0, 0, 0.2)",
    lg: "0 8px 16px rgba(0, 0, 0, 0.3)",
  },

  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
    "2xl": "2rem",
    "3xl": "3rem",
  },

  grid: {
    adaptive: "repeat(auto-fit, minmax(280px, 1fr))",
    autoFit: "repeat(auto-fit, minmax(260px, 320px))",
    one: "repeat(1, 1fr)",
    two: "repeat(2, 1fr)",
    three: "repeat(3, 1fr)",
    four: "repeat(4, 1fr)",
    compact: "repeat(auto-fit, minmax(200px, 1fr))",
    maxWidth: "1100px",
  },
};

export const darkTheme = {
  colors: {
    primaryColor: "#13161b",
    secondaryColor: "#1c1f25",
    background: "#2F2F2F",
    inputColor: "#0d0e12",
    white: "#121212",
    blue: "#0d6efd",
    blue2: "#0000FF",
    red: "#FF3347",
    green: "#28a745",
    orange: "#ff4500",
    yellow: "#fffF00",
    shadow: "#000",
    grey: "#a1a1a1",
    textColor: "#f1f1f1",
  },
};

export const lightTheme = {
  colors: {
    primaryColor: "#666666",
    secondaryColor: "#a1a1a1",
    background: "#808080",
    inputColor: "#f1f1f1",
    white: "#ffffff",
    blue: "#3a86ff",
    blue2: "#0000FF",
    red: "#FF0000",
    green: "#34d399",
    orange: "#ff4500",
    yellow: "#ffff00",
    shadow: "#000",
    grey: "#a1a1a1",
    textColor: "#13161b",
  },
};

export const neonTheme = {
  colors: {
    neonPink: {
      base: "#FF2DAA",
      glow: "#FF5FCC",
      soft: "#FFB3E6",
    },

    neonPurple: {
      base: "#B026FF",
      glow: "#D26CFF",
      soft: "#E6C2FF",
    },

    neonBlue: {
      base: "#00E5FF",
      glow: "#5DF4FF",
      soft: "#B3FBFF",
    },

    neonGreen: {
      base: "#2BFF88",
      glow: "#6DFFB3",
      soft: "#C7FFE5",
    },

    neonRed: {
      base: "#FF1744",
      glow: "#FF5252",
      soft: "#FF9E9E",
    },

    neonYellow: {
      base: "#FFE600",
      glow: "#FFF066",
      soft: "#FFF6B3",
    },

    neonCyan: {
      base: "#00FFF0",
      glow: "#66FFF7",
      soft: "#B3FFFB",
    },
  },
};

export const pastelTheme = {
  colors: {
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
  },
};

export const maskedThemeConfig = {
  maskedTheme: maskedTheme,
  light: lightTheme,
  dark: darkTheme,
  neon: neonTheme,
  pastel: pastelTheme,
};
