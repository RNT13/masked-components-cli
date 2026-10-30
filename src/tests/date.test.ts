import { describe, expect, it } from "vitest";
import {
  brToIso,
  dayMonthLabel,
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
  it("isoToBr / formatDate / formatDateBR", () => {
    expect(formatDateBR("2026-12-31")).toBe("31/12/2026");
    expect(isoToBr("2026-12-31")).toBe("31/12/2026");
    expect(formatDate("2026-12-31")).toBe("31/12/2026");
    expect(formatDateBR("abc")).toBe("");
    expect(formatDateBR(null)).toBe("");
  });

  it("brToIso", () => {
    expect(brToIso("31/12/2025")).toBe("2025-12-31");
    expect(brToIso("1/1/2025")).toBe("2025-01-01");
    expect(brToIso("abc")).toBeNull();
    expect(brToIso("")).toBeNull();
  });
});

describe("rótulos", () => {
  it("monthKey / monthLabel / dayMonthLabel", () => {
    expect(monthKey("2026-08-09")).toBe("2026-08");
    expect(dayMonthLabel("2026-08-09")).toBe("09/08");
    expect(monthLabel("2026-08")).toContain("ago");
  });

  it("formatDateLong / monthNameLong por locale", () => {
    expect(formatDateLong("2026-08-09")).toContain("agosto");
    expect(formatDateLong("abc")).toBe("--");
    expect(monthNameLong(8)).toBe("Agosto");
    expect(monthNameLong(8, { locale: "en" })).toBe("August");
  });

  it("lastMonthKeys com now injetável", () => {
    const keys = lastMonthKeys(3, { now: new Date(2026, 9, 28) });
    expect(keys).toEqual(["2026-08", "2026-09", "2026-10"]);
  });
});
