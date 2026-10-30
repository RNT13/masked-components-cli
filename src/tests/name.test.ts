import { describe, expect, it } from "vitest";
import {
  abbreviateName,
  getFirstName,
  getInitial,
  getInitials,
  normalizeDisplayName,
  truncateByWord,
  truncateText,
} from "../../templates/masked-utils/name";

describe("name", () => {
  it("normalização e partes", () => {
    expect(normalizeDisplayName("  Ana   Souza ")).toBe("Ana Souza");
    expect(getFirstName("Ana Souza Lima")).toBe("Ana");
    expect(getInitials("Ana Souza Lima")).toBe("AS");
    expect(getInitials("")).toBe("?");
    expect(getInitial("ana")).toBe("A");
    expect(abbreviateName("Ana Souza Lima")).toBe("Ana L.");
    expect(abbreviateName("Ana")).toBe("Ana");
  });

  it("truncamento", () => {
    expect(truncateText("texto longo", 8)).toBe("texto...");
    expect(truncateByWord("Empresa Muito Grande SA", 15)).toBe("Empresa...");
    expect(truncateByWord("Curto", 22)).toBe("Curto");
  });
});
