// templates/masked-buttons/MaskedButton/buttonTokens.ts
//
// Resolve colorTheme + overrides em CSS vars --mc-btn-*/--mc-switch-*.
// Padrão F.26: --mc-<componente>-<propriedade>[-<estado>]

import type { CSSProperties } from "react";
import { resolveColorTheme } from "@/theme/ColorThemes";

/** Paleta neutra da lib (F.25): usa a rampa baseBlack do tema default. */
const NEUTRAL = {
  bg: "#1a1a1a",
  fg: "#fafafa",
  border: "#1a1a1a",
  ring: "#1a1a1a",
};

const TOKEN_PROPS = [
  "bg",
  "bg-hover",
  "bg-active",
  "fg",
  "fg-hover",
  "fg-active",
  "border",
  "border-hover",
  "border-active",
  "ring",
  "ring-focus",
  "shadow",
  "shadow-active",
  "radius",
  "gradient",
  "gradient-hover",
  "gradient-active",
  "neon-color",
  "neon-glow",
  "neon-shadow",
  "neon-shadow-hover",
  "danger-bg",
  "danger-bg-hover",
  "danger-fg",
  "danger-border",
  "danger-ring",
  "danger-gradient",
  "danger-gradient-hover",
  "disabled-opacity",
] as const;

const SWITCH_TOKEN_PROPS = [
  "track-on",
  "track-off",
  "knob-bg",
  "knob-shadow",
  "border-on",
  "border-off",
  "ring-focus",
] as const;

export type ButtonTokensStyle = CSSProperties;

/**
 * Gera o objeto de style com as CSS vars do botão.
 * Precedência: tokens (prop) > colorTheme (registro) > nada (CSS usa fallback do tema).
 *
 * @example
 * <button style={resolveButtonTokens({ colorTheme: 'ruby' })} />
 */
export function resolveButtonTokens(opts: {
  colorTheme?: string;
  tokens?: Record<string, string | number>;
}): ButtonTokensStyle {
  const vars: Record<string, string | number> = {};
  const palette =
    opts.colorTheme && opts.colorTheme !== "default"
      ? resolveColorTheme(opts.colorTheme)?.palette
      : undefined;

  if (palette) {
    vars["--mc-btn-bg"] = palette.bg;
    vars["--mc-btn-bg-hover"] = palette.bgHover;
    vars["--mc-btn-bg-active"] = palette.bgActive;
    vars["--mc-btn-fg"] = palette.fg;
    vars["--mc-btn-fg-hover"] = palette.fgHover ?? palette.fg;
    vars["--mc-btn-fg-active"] = palette.fgActive ?? palette.fg;
    vars["--mc-btn-border"] = palette.border ?? palette.bg;
    vars["--mc-btn-border-hover"] = palette.borderHover ?? palette.bgHover;
    vars["--mc-btn-border-active"] = palette.borderActive ?? palette.bgActive;
    vars["--mc-btn-ring"] = palette.ring;
    vars["--mc-btn-ring-focus"] = palette.ring;

    // gradiente (variantes gradient/neon): a paleta deriva duas cores
    vars["--mc-btn-gradient"] =
      `linear-gradient(180deg, ${palette.bgHover}, ${palette.bg})`;
    vars["--mc-btn-gradient-hover"] =
      `linear-gradient(180deg, ${palette.bg}, ${palette.bgHover})`;
    vars["--mc-btn-gradient-active"] =
      `linear-gradient(180deg, ${palette.bgActive}, ${palette.bgHover})`;

    // neon: cor do glow = border/ring da paleta
    vars["--mc-btn-neon-color"] = palette.ring;

    // campos (switch/checkbox/radio) herdam o colorTheme
    vars["--mc-switch-track-on"] = palette.bg;
    vars["--mc-switch-border-on"] = palette.border ?? palette.bg;
    vars["--mc-switch-ring-focus"] = palette.ring;
  }

  // overrides granulares (prop `tokens`) — maior precedência
  for (const key of TOKEN_PROPS) {
    const v = opts.tokens?.[key];
    if (v !== undefined) vars[`--mc-btn-${key}`] = v;
  }
  for (const key of SWITCH_TOKEN_PROPS) {
    const v = opts.tokens?.[`switch-${key}`];
    if (v !== undefined) vars[`--mc-switch-${key}`] = v;
  }

  return vars as ButtonTokensStyle;
}

export { NEUTRAL as BUTTON_NEUTRAL_PALETTE };
