import { describe, expect, it } from "vitest";
import { colorHSLVariants } from "../../templates/masked-utils/color";

describe("colorHSLVariants", () => {
  it("gera base e variações HSL/HSLA", () => {
    const v = colorHSLVariants(215, 95, 50);
    expect(v.base).toBe("hsl(215, 95%, 50%)");
    expect(v.light30).toBe("hsl(215, 95%, 80%)");
    expect(v.dark20).toBe("hsl(215, 95%, 30%)");
    expect(v.light08).toBe("hsla(215, 95%, 56%, 0.8)");
  });

  it("clampeia lightness em [0, 100]", () => {
    const v = colorHSLVariants(0, 85, 95);
    expect(v.light50).toBe("hsl(0, 85%, 100%)");
    const d = colorHSLVariants(0, 85, 5);
    expect(d.dark50).toBe("hsl(0, 85%, 0%)");
  });
});
