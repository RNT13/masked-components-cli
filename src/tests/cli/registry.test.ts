import { describe, expect, it } from "vitest";
import { registry, RegistryError, resolveComponents, type ComponentEntry } from "../../registry";

describe("registry", () => {
  it("ids são únicos e todo `requires` aponta para um componente existente", () => {
    const ids = registry.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const entry of registry) {
      for (const required of entry.requires ?? []) expect(ids).toContain(required);
    }
  });

  it("botões puxam animations e themes antes de si", () => {
    const { ordered, addedByDependency } = resolveComponents(["masked-buttons"], "next");
    expect(ordered.map((entry) => entry.id)).toEqual(["masked-animations", "masked-themes", "masked-buttons"]);
    expect(addedByDependency).toEqual(["masked-animations", "masked-themes"]);
  });

  it("não repete componente pedido e exigido ao mesmo tempo", () => {
    const { ordered, addedByDependency } = resolveComponents(["masked-themes", "masked-cards", "masked-themes"], "vite");
    expect(ordered.map((entry) => entry.id)).toEqual(["masked-themes", "masked-cards"]);
    expect(addedByDependency).toEqual([]);
  });

  it("a camada Formik exige o Masked Input", () => {
    const { ordered } = resolveComponents(["masked-input-formik"], "next");
    expect(ordered.map((entry) => entry.id)).toContain("masked-input");
    expect(ordered.at(-1)?.id).toBe("masked-input-formik");
  });

  it("rejeita id desconhecido", () => {
    expect(() => resolveComponents(["nao-existe"], "next")).toThrow(RegistryError);
  });

  it("rejeita componente fora do framework permitido", () => {
    expect(() => resolveComponents(["masked-hooks-next"], "vite")).toThrow(/next/);
    expect(() => resolveComponents(["masked-hooks-next"], "next")).not.toThrow();
  });

  it("detecta dependência circular", () => {
    const entries: ComponentEntry[] = [
      { id: "a", label: "A", description: "", templates: [], requires: ["b"] },
      { id: "b", label: "B", description: "", templates: [], requires: ["a"] },
    ];
    expect(() => resolveComponents(["a"], "next", entries)).toThrow(/circular/);
  });
});
