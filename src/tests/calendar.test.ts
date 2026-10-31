import { describe, expect, it } from "vitest";
import { buildGoogleCalendarUrl } from "../../templates/masked-utils/calendar";

const base = { title: "Corte + barba", date: "2026-03-10", startTime: "14:30", durationMinutes: 45 };

describe("buildGoogleCalendarUrl", () => {
  it("horário local, sem 'Z': o Google não desloca a hora pelo fuso de quem abre", () => {
    const url = new URL(buildGoogleCalendarUrl(base));
    expect(url.searchParams.get("dates")).toBe("20260310T143000/20260310T151500");
    expect(url.searchParams.get("text")).toBe("Corte + barba");
    expect(url.searchParams.get("ctz")).toBeNull();
  });

  it("aceita o fuso IANA do evento", () => {
    const url = new URL(buildGoogleCalendarUrl({ ...base, timeZone: "America/Sao_Paulo" }));
    expect(url.searchParams.get("ctz")).toBe("America/Sao_Paulo");
  });

  it("evento que atravessa a meia-noite muda o dia do fim", () => {
    const url = new URL(buildGoogleCalendarUrl({ ...base, startTime: "23:30", durationMinutes: 60 }));
    expect(url.searchParams.get("dates")).toBe("20260310T233000/20260311T003000");
  });

  it("entrada inválida devolve string vazia em vez de URL quebrada", () => {
    expect(buildGoogleCalendarUrl({ ...base, date: "10/03/2026" })).toBe("");
    expect(buildGoogleCalendarUrl({ ...base, startTime: "25:00" })).toBe("");
    expect(buildGoogleCalendarUrl({ ...base, date: "2026-02-30" })).toBe("");
  });

  it("duração inválida ou negativa vira 0 (início = fim)", () => {
    const url = new URL(buildGoogleCalendarUrl({ ...base, durationMinutes: Number.NaN }));
    expect(url.searchParams.get("dates")).toBe("20260310T143000/20260310T143000");
  });
});
