// templates/masked-utils/time.test.ts
import { describe, expect, it } from "vitest";
import {
  addMinutes,
  addMinutesNoWrap,
  clockToMinutes,
  formatTime,
  getLocalDateString,
  getTimeUntil,
  minutesToClock,
  timeAgo,
} from "../../templates/masked-utils/time";

describe("minutesToClock / clockToMinutes", () => {
  it("converte e clampa em 0", () => {
    expect(minutesToClock(90)).toBe("01:30");
    expect(minutesToClock(-5)).toBe("00:00");
    expect(clockToMinutes("01:30")).toBe(90);
  });
});

describe("addMinutes (wrap 24h — comportamento publicado da lib)", () => {
  it("23:30 + 60 -> 00:30 (wrap)", () => {
    expect(addMinutes("23:30", 60)).toBe("00:30");
  });
  it("guard --:--", () => {
    expect(addMinutes("--:--", 30)).toBe("--:--");
  });
});

describe("addMinutesNoWrap (sem wrap — comportamento do Zandry)", () => {
  it("23:30 + 60 -> 24:30", () => {
    expect(addMinutesNoWrap("23:30", 60)).toBe("24:30");
  });
  it("clampa em 0 e guard --:--", () => {
    expect(addMinutesNoWrap("00:30", -60)).toBe("00:00");
    expect(addMinutesNoWrap("--:--", 30)).toBe("--:--");
  });
});

describe("formatTime", () => {
  it("remove segundos", () => {
    expect(formatTime("14:30:45")).toBe("14:30");
    expect(formatTime("14:30")).toBe("14:30");
  });
});

describe("getTimeUntil / timeAgo", () => {
  it("dicionários pt-BR e en", () => {
    const fixed = new Date(2026, 0, 1, 10, 0, 0);
    expect(getTimeUntil("12:30", { now: fixed })).toBe("em 2h 30min");
    expect(getTimeUntil("12:30", { now: fixed, locale: "en" })).toBe(
      "in 2h 30min",
    );
    expect(getTimeUntil("08:00", { now: fixed })).toBe("agora");
    expect(getTimeUntil("08:00", { now: fixed, locale: "en" })).toBe("now");
  });
  it("timeAgo por unidade", () => {
    const now = Date.now();
    const iso = (min: number) => new Date(now - min * 60000).toISOString();
    expect(timeAgo(iso(0))).toBe("agora");
    expect(timeAgo(iso(5))).toBe("5min");
    expect(timeAgo(iso(120))).toBe("2h");
    expect(timeAgo(iso(60 * 48))).toBe("2d");
  });
});

describe("getLocalDateString", () => {
  it("formato YYYY-MM-DD", () => {
    expect(getLocalDateString(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});
