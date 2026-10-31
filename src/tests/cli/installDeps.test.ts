import { describe, expect, it } from "vitest";
import { buildInstallCommand, classifyDeps, dedupeDeps, depSpec, parseMajor } from "../../utils/installDeps";

describe("installDeps", () => {
  it("comando por gerenciador", () => {
    expect(buildInstallCommand("npm", ["a@1"])).toEqual({ command: "npm", args: ["install", "a@1"] });
    expect(buildInstallCommand("pnpm", ["a@1"])).toEqual({ command: "pnpm", args: ["add", "a@1"] });
    expect(buildInstallCommand("yarn", ["a@1"])).toEqual({ command: "yarn", args: ["add", "a@1"] });
    expect(buildInstallCommand("bun", ["a@1"])).toEqual({ command: "bun", args: ["add", "a@1"] });
  });

  it("só instala o que falta e avisa major antiga", () => {
    const required = [
      { name: "styled-components", range: "^6.1.0" },
      { name: "react-icons", range: "^5.0.0" },
      { name: "formik", range: "^2.4.0" },
    ];
    const result = classifyDeps(required, { "styled-components": "^5.3.0", "react-icons": "^5.2.1" });
    expect(result.toInstall.map((dep) => dep.name)).toEqual(["formik"]);
    expect(result.present).toEqual(["styled-components", "react-icons"]);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]).toMatch(/styled-components \^5\.3\.0/);
  });

  it("utilitários", () => {
    expect(parseMajor("^6.1.0")).toBe(6);
    expect(parseMajor("latest")).toBeNull();
    expect(depSpec({ name: "x", range: "^1.0.0" })).toBe("x@^1.0.0");
    expect(dedupeDeps([{ name: "a", range: "1" }, { name: "a", range: "2" }])).toEqual([{ name: "a", range: "1" }]);
  });
});
