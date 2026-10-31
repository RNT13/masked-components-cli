import { describe, expect, it } from "vitest";
import { pickDictionary } from "../../templates/masked-utils/locale";

describe("pickDictionary", () => {
  const dicts = { "pt-BR": "PT", en: "EN" } as Record<string, string>;

  it("exato, idioma base e fallback", () => {
    expect(pickDictionary(dicts, "pt-BR", "FB")).toBe("PT");
    expect(pickDictionary(dicts, "en", "FB")).toBe("EN");
    expect(pickDictionary(dicts, "en-US", "FB")).toBe("EN");
    expect(pickDictionary(dicts, "EN-gb", "FB")).toBe("EN");
    expect(pickDictionary(dicts, "pt", "FB")).toBe("PT");
    expect(pickDictionary(dicts, "pt-PT", "FB")).toBe("PT");
    expect(pickDictionary(dicts, "ja", "FB")).toBe("FB");
    expect(pickDictionary(dicts, undefined, "FB")).toBe("FB");
  });
});
