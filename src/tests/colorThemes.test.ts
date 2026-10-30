import { describe, expect, it } from "vitest";
import { maskedTheme } from "../../templates/masked-themes/MaskedThemes/MaskedThemes";
import {
  resolveColorTheme,
  registerColorTheme,
  unregisterColorTheme,
  listColorThemes,
} from "../../templates/masked-themes/MaskedThemes/ColorThemes";

describe("resolveColorTheme", () => {
  it("undefined -> undefined (componente usa default)", () => {
    expect(resolveColorTheme(undefined, maskedTheme)).toBeUndefined();
  });

  it("alias 'ruby' resolve para baseRose", () => {
    const t = resolveColorTheme("ruby", maskedTheme);
    expect(t?.base).toBe(maskedTheme.colors.baseRose.base);
  });

  it("chave da paleta resolve direto", () => {
    const t = resolveColorTheme("baseBlue", maskedTheme);
    expect(t?.base).toBe(maskedTheme.colors.baseBlue.base);
    expect(t?.light40).toBe(maskedTheme.colors.baseBlue.light40);
  });

  it("preset registrado tem prioridade sobre a paleta", () => {
    registerColorTheme("baseBlue", { base: "#000" });
    expect(resolveColorTheme("baseBlue", maskedTheme)?.base).toBe("#000");
    unregisterColorTheme("baseBlue");
    expect(resolveColorTheme("baseBlue", maskedTheme)?.base).toBe(
      maskedTheme.colors.baseBlue.base,
    );
  });

  it("presets light/dark embutidos", () => {
    expect(listColorThemes()).toEqual(
      expect.arrayContaining(["light", "dark"]),
    );
    expect(resolveColorTheme("light", maskedTheme)?.base).toBe("#ffffff");
  });

  it("tema inexistente -> undefined", () => {
    expect(resolveColorTheme("nao-existe", maskedTheme)).toBeUndefined();
  });
});

describe("maskedTheme", () => {
  it("boxShadow é função e aceita cor customizada (color-mix)", () => {
    expect(maskedTheme.boxShadow.lg()).toContain("box-shadow:");
    expect(maskedTheme.boxShadow.lg("#ff0000")).toContain(
      "color-mix(in srgb, #ff0000",
    );
  });

  it("tokens neutros preservam valores da paleta de marca", () => {
    expect(maskedTheme.colors.basePrimary.base).toBe("hsl(224, 76%, 33%)");
    expect(maskedTheme.colors.baseSecondary.base).toBe("hsl(214, 95%, 62%)");
    expect(maskedTheme.colors.baseTertiary.base).toBe("hsl(258, 90%, 66%)");
  });

  it("gradient.primary existe (ex-brand)", () => {
    expect(maskedTheme.gradient.primary).toContain("linear-gradient");
  });
});
