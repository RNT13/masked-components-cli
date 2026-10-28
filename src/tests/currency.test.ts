// templates/masked-utils/currency.test.ts
import { describe, expect, it } from "vitest";
import { formatCurrency, fromCents, parseCurrency, toCents } from "../../templates/masked-utils/currency";

describe("formatCurrency", () => {
  it("formata por locale", () => {
    expect(formatCurrency(1234.5)).toBe("R$\u00a01.234,50");
    expect(formatCurrency(1234.5, { locale: "en-US", currency: "USD" })).toBe(
      "$1,234.50",
    );
  });
  it("aceita string e trata inválido como 0", () => {
    expect(formatCurrency("10")).toBe("R$\u00a010,00");
    expect(formatCurrency("abc")).toBe("R$\u00a00,00");
  });
});

describe("parseCurrency", () => {
  it("pt-BR: separadores brasileiros", () => {
    expect(parseCurrency("R$ 1.234,56")).toBe(1234.56);
    expect(parseCurrency("10,5")).toBe(10.5);
  });
  it("en-US: separadores americanos", () => {
    expect(parseCurrency("$1,234.56", { locale: "en-US" })).toBe(1234.56);
  });
  it("inválido/vazio -> 0", () => {
    expect(parseCurrency("")).toBe(0);
    expect(parseCurrency("abc")).toBe(0);
  });
});

describe("toCents / fromCents", () => {
  it("converte reais <-> centavos", () => {
    expect(toCents(10.5)).toBe(1050);
    expect(toCents("10,5")).toBe(1050);
    expect(fromCents(1050)).toBe(10.5);
  });
});
