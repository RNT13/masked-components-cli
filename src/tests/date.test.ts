import { describe, expect, it } from "vitest";
import {
  brToIso,
  dayMonthLabel,
  dayMonthShortLabel,
  dayShortMonthLabel,
  formatDate,
  formatDateBR,
  formatDateLong,
  isoToBr,
  lastMonthKeys,
  monthKey,
  monthLabel,
  monthNameLong,
} from "../../templates/masked-utils/date";

describe("conversões ISO <-> BR", () => {
  it("isoToBr / formatDateBR", () => {
    expect(formatDateBR("2026-12-31")).toBe("31/12/2026");
    expect(isoToBr("2026-12-31")).toBe("31/12/2026");
    expect(formatDateBR("abc")).toBe("");
    expect(formatDateBR(null)).toBe("");
  });

  it("aceita data com horário e rejeita data inexistente", () => {
    expect(formatDateBR("2026-12-31T23:59:00Z")).toBe("31/12/2026");
    expect(formatDateBR("2026-02-30")).toBe("");
    expect(formatDateBR("2026-13-01")).toBe("");
  });

  it("formatDate mantém a assinatura da lib: o locale NÃO é ignorado", () => {
    expect(formatDate("2026-12-31")).toBe("31/12/2026");
    expect(formatDate("2026-12-31", "en-US")).toBe("12/31/2026");
    expect(formatDate("2026-12-31T10:00:00Z")).toBe("31/12/2026");
    expect(formatDate("lixo")).toBe("");
    expect(formatDate(undefined)).toBe("");
  });

  it("brToIso", () => {
    expect(brToIso("31/12/2025")).toBe("2025-12-31");
    expect(brToIso("1/1/2025")).toBe("2025-01-01");
    expect(brToIso("abc")).toBeNull();
    expect(brToIso("")).toBeNull();
    expect(brToIso("31/02/2025")).toBeNull();
    expect(brToIso("29/02/2024")).toBe("2024-02-29");
  });
});

describe("rótulos", () => {
  it("monthKey / monthLabel / dayMonthLabel", () => {
    expect(monthKey("2026-08-09")).toBe("2026-08");
    expect(dayMonthLabel("2026-08-09")).toBe("09/08");
    expect(dayMonthLabel("lixo")).toBe("");
    expect(monthLabel("2026-08")).toContain("ago");
    expect(monthLabel("lixo")).toBe("");
  });

  it("formatDateLong / monthNameLong por locale", () => {
    expect(formatDateLong("2026-08-09")).toContain("agosto");
    expect(formatDateLong("2026-08-09", { withYear: true })).toContain("2026");
    expect(formatDateLong("abc")).toBe("--");
    expect(formatDateLong("abc", { fallback: "n/d" })).toBe("n/d");
    expect(monthNameLong(8)).toBe("Agosto");
    expect(monthNameLong(8, { locale: "en" })).toBe("August");
    expect(monthNameLong(13)).toBe("");
  });

  it("rótulos curtos de dia/mês e o sinônimo histórico", () => {
    expect(dayMonthShortLabel("2026-09-08")).toContain("08");
    expect(dayShortMonthLabel("2026-09-08")).toBe(dayMonthShortLabel("2026-09-08"));
    expect(dayMonthShortLabel("lixo")).toBe("");
  });

  it("lastMonthKeys com now injetável", () => {
    const keys = lastMonthKeys(3, { now: new Date(2026, 9, 28) });
    expect(keys).toEqual(["2026-08", "2026-09", "2026-10"]);
    expect(lastMonthKeys(2, { now: new Date(2026, 0, 15) })).toEqual(["2025-12", "2026-01"]);
  });
});

describe("independe do fuso da máquina", () => {
  it("o dia nunca desloca (rode com TZ=America/Sao_Paulo e TZ=Pacific/Auckland)", () => {
    expect(formatDate("2026-01-01")).toBe("01/01/2026");
    expect(formatDateLong("2026-01-01")).toContain("1 de janeiro");
    expect(dayMonthShortLabel("2026-03-08")).toContain("08");
  });
});
