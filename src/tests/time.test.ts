import { describe, expect, it } from "vitest";
import {
  addMinutes,
  addMinutesNoWrap,
  clockToMinutes,
  formatTime,
  getLocalDateString,
  getTimeUntil,
  minutesToClock,
  minutesToTime,
  timeAgo,
  timeToMinutes,
} from "../../templates/masked-utils/time";

describe("minutesToClock / clockToMinutes", () => {
  it("converte e clampa em 0", () => {
    expect(minutesToClock(90)).toBe("01:30");
    expect(minutesToClock(-5)).toBe("00:00");
    expect(clockToMinutes("01:30")).toBe(90);
    expect(clockToMinutes(null)).toBe(0);
    expect(timeToMinutes(undefined)).toBe(0);
    expect(minutesToTime(1500)).toBe("25:00");
  });
});

describe("addMinutes (wrap 24h — comportamento publicado da lib)", () => {
  it("23:30 + 60 -> 00:30 (wrap)", () => {
    expect(addMinutes("23:30", 60)).toBe("00:30");
  });
  it("negativos dão a volta em vez de gerar lixo", () => {
    expect(addMinutes("00:30", -60)).toBe("23:30");
    expect(addMinutes("10:00", -30)).toBe("09:30");
  });
  it("guard --:-- e minutos inválidos", () => {
    expect(addMinutes("--:--", 30)).toBe("--:--");
    expect(addMinutes("", 30)).toBe("--:--");
    expect(addMinutes("10:00", Number.NaN)).toBe("10:00");
    expect(addMinutes("10:00", 30.9)).toBe("10:30");
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
    expect(formatTime(null)).toBe("");
  });
});

describe("getTimeUntil / timeAgo", () => {
  const fixed = new Date(2026, 0, 1, 10, 0, 0);

  it("dicionários pt-BR e en", () => {
    expect(getTimeUntil("12:30", { now: fixed })).toBe("em 2h 30min");
    expect(getTimeUntil("12:30", { now: fixed, locale: "en" })).toBe("in 2h 30min");
    expect(getTimeUntil("08:00", { now: fixed })).toBe("agora");
    expect(getTimeUntil("08:00", { now: fixed, locale: "en" })).toBe("now");
    expect(getTimeUntil("10:45", { now: fixed })).toBe("em 45 min");
  });

  it("en-US / en-GB usam o dicionário en (não caem em português)", () => {
    expect(getTimeUntil("12:30", { now: fixed, locale: "en-US" })).toBe("in 2h 30min");
    expect(getTimeUntil("08:00", { now: fixed, locale: "en-GB" })).toBe("now");
    expect(getTimeUntil("12:30", { now: fixed, locale: "pt" })).toBe("em 2h 30min");
    expect(getTimeUntil("12:30", { now: fixed, locale: "xx-YY" })).toBe("em 2h 30min");
  });

  it("dict próprio vence o locale", () => {
    const dict = { now: "ya", prefix: "dentro de", min: "m", hour: "h" };
    expect(getTimeUntil("12:30", { now: fixed, dict, locale: "en" })).toBe("dentro de 2h 30m");
  });

  it("timeAgo por unidade, com now injetável", () => {
    const now = new Date("2026-01-01T15:00:00Z");
    expect(timeAgo("2026-01-01T14:59:40Z", { now })).toBe("agora");
    expect(timeAgo("2026-01-01T14:55:00Z", { now })).toBe("5min");
    expect(timeAgo("2026-01-01T12:00:00Z", { now })).toBe("3h");
    expect(timeAgo("2025-12-30T15:00:00Z", { now })).toBe("2d");
    expect(timeAgo("2026-01-02T15:00:00Z", { now })).toBe("agora");
    expect(timeAgo("2026-01-01T14:55:00Z", { now, locale: "en-US" })).toBe("5min");
    expect(timeAgo("2026-01-01T14:59:50Z", { now, locale: "en" })).toBe("now");
    expect(timeAgo("lixo")).toBe("");
  });
});

describe("getLocalDateString", () => {
  it("formato YYYY-MM-DD (local)", () => {
    expect(getLocalDateString(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(getLocalDateString(new Date(2026, 11, 31, 23, 59))).toBe("2026-12-31");
  });
});
