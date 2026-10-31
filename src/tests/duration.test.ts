import { describe, expect, it } from "vitest";
import { averageDuration, formatDuration } from "../../templates/masked-utils";

describe("formatDuration", () => {
  it("minutos curtos", () => {
    expect(formatDuration(45)).toBe("45min");
    expect(formatDuration(45, { locale: "en" })).toBe("45min");
  });
  it("horas e minutos por dicionário", () => {
    expect(formatDuration(90)).toBe("1h 30min");
    expect(formatDuration(120)).toBe("2h");
  });
  it("vazio/inválido -> dash", () => {
    expect(formatDuration(undefined)).toBe("—");
    expect(formatDuration("abc")).toBe("—");
    expect(formatDuration(undefined, { locale: "en" })).toBe("—");
    expect(formatDuration(0.4)).toBe("—");
  });
  it("en-US usa o dicionário en e dict próprio vence", () => {
    expect(formatDuration(90, { locale: "en-US" })).toBe("1h 30min");
    expect(formatDuration(90, { dict: { min: "m", hour: "hr", minute: "m", empty: "n/d" } })).toBe("1hr 30m");
    expect(formatDuration(0, { dict: { min: "m", hour: "hr", minute: "m", empty: "n/d" } })).toBe("n/d");
  });
});

describe("averageDuration", () => {
  it("média formatada; lista vazia -> dash", () => {
    expect(averageDuration([{ duration: 30 }, { duration: 60 }])).toBe("45");
    expect(averageDuration([])).toBe("—");
    expect(averageDuration([{ duration: 10 }, { duration: 15 }], 1)).toBe("12.5");
  });
});
