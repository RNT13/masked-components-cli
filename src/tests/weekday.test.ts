import { describe, expect, it } from "vitest";
import {
  getTodayKey,
  translateWeekday,
  weekdayLabel,
} from "../../templates/masked-utils/weekday";

describe("weekday", () => {
  it("weekdayLabel pt-BR / en / short", () => {
    expect(weekdayLabel("monday")).toBe("Segunda-feira");
    expect(weekdayLabel("monday", { short: true })).toBe("seg");
    expect(weekdayLabel("monday", { locale: "en" })).toBe("Monday");
    expect(weekdayLabel("sábado")).toBe("Sábado"); // normaliza nome pt-BR
    expect(weekdayLabel("xyz")).toBe("xyz"); // desconhecido passa direto
  });

  it("translateWeekday (alias @deprecated)", () => {
    expect(translateWeekday("monday")).toBe("Segunda-feira");
    expect(translateWeekday("monday", true)).toBe("seg");
  });

  it("getTodayKey com now injetável", () => {
    // 2026-10-28 é quarta-feira
    expect(getTodayKey({ now: new Date(2026, 9, 28) })).toBe("wednesday");
  });
});
