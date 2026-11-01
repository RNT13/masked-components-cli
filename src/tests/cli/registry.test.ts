import { describe, expect, it } from "vitest";
import {
  registry,
  RegistryError,
  resolveComponents,
  type ComponentEntry,
} from "../../registry";

describe("registry", () => {
  it("ids são únicos e todo `requires` aponta para um componente existente", () => {
    const ids = registry.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const entry of registry) {
      for (const required of entry.requires ?? [])
        expect(ids).toContain(required);
    }
  });

  it("botões puxam animations, utils, themes e config antes de si", () => {
    const { ordered, addedByDependency } = resolveComponents(
      ["masked-buttons"],
      "next",
    );
    expect(ordered.map((entry) => entry.id)).toEqual([
      "masked-animations",
      "masked-utils",
      "masked-themes",
      "masked-config",
      "masked-buttons",
    ]);
    expect(addedByDependency).toEqual([
      "masked-animations",
      "masked-utils",
      "masked-themes",
      "masked-config",
    ]);
  });

  it("não repete componente pedido e exigido ao mesmo tempo", () => {
    const { ordered, addedByDependency } = resolveComponents(
      ["masked-themes", "masked-cards", "masked-themes"],
      "vite",
    );
    // utils vem antes de themes porque o MaskedThemes importa colorHSLVariants
    expect(ordered.map((entry) => entry.id)).toEqual([
      "masked-utils",
      "masked-themes",
      "masked-config",
      "masked-cards",
    ]);
    // nenhum id aparece duas vezes
    const ids = ordered.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
    // themes foi pedido, então não conta como "adicionado por dependência"
    expect(addedByDependency).not.toContain("masked-themes");
    expect(addedByDependency).not.toContain("masked-cards");
    expect([...addedByDependency].sort()).toEqual([
      "masked-config",
      "masked-utils",
    ]);
  });

  it("a camada Formik exige o Masked Input", () => {
    const { ordered } = resolveComponents(["masked-input-formik"], "next");
    expect(ordered.map((entry) => entry.id)).toContain("masked-input");
    expect(ordered.at(-1)?.id).toBe("masked-input-formik");
  });

  it("rejeita id desconhecido", () => {
    expect(() => resolveComponents(["nao-existe"], "next")).toThrow(
      RegistryError,
    );
  });

  it("rejeita componente fora do framework permitido", () => {
    expect(() => resolveComponents(["masked-hooks-next"], "vite")).toThrow(
      /next/,
    );
    expect(() =>
      resolveComponents(["masked-hooks-next"], "next"),
    ).not.toThrow();
  });

  it("detecta dependência circular", () => {
    const entries: ComponentEntry[] = [
      { id: "a", label: "A", description: "", templates: [], requires: ["b"] },
      { id: "b", label: "B", description: "", templates: [], requires: ["a"] },
    ];
    expect(() => resolveComponents(["a"], "next", entries)).toThrow(/circular/);
  });
});
