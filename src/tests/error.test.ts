import { describe, expect, it } from "vitest";
import { extractFirstError } from "../../templates/masked-utils/error";

describe("extractFirstError", () => {
  it("string passa direto; falsy retorna null", () => {
    expect(extractFirstError("Falha")).toBe("Falha");
    expect(extractFirstError(null)).toBeNull();
    expect(extractFirstError(undefined)).toBeNull();
    expect(extractFirstError("")).toBeNull();
  });

  it("arrays e objetos aninhados", () => {
    expect(extractFirstError(["Primeiro", "Segundo"])).toBe("Primeiro");
    expect(extractFirstError({ errors: { name: ["Obrigatório"] } })).toBe(
      "Obrigatório",
    );
  });

  it("pula skipKeys e retorna null sem nada legível", () => {
    expect(extractFirstError({ success: false, code: 400 })).toBeNull();
    expect(
      extractFirstError({ success: false, msg: "Erro" }, ["success"]),
    ).toBe("Erro");
  });
});
