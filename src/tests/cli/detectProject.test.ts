import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { detectFramework, detectPackageManager, detectProject, stripJsonComments } from "../../utils/detectProject";
import { resolveProjectPaths } from "../../utils/projectPaths";

const dirs: string[] = [];
function tmp(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mcli-detect-"));
  dirs.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of dirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

describe("detectFramework", () => {
  it("next > remix > cra > vite", () => {
    expect(detectFramework({ next: "15", vite: "5" })).toBe("next");
    expect(detectFramework({ "@remix-run/react": "2", vite: "5" })).toBe("remix");
    expect(detectFramework({ "react-scripts": "5" })).toBe("cra");
    expect(detectFramework({ vite: "5" })).toBe("vite");
    expect(detectFramework({})).toBe("unknown");
  });
});

describe("detectPackageManager", () => {
  it("lockfile vence o user agent; campo packageManager vence o lockfile", () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, "pnpm-lock.yaml"), "");
    expect(detectPackageManager(dir, null, { npm_config_user_agent: "npm/10 node/20" })).toBe("pnpm");
    expect(detectPackageManager(dir, { packageManager: "yarn@4.1.0" }, {})).toBe("yarn");
  });

  it("sem lockfile usa o user agent, e por fim npm", () => {
    const dir = tmp();
    expect(detectPackageManager(dir, null, { npm_config_user_agent: "bun/1.1 npm/? node/v20" })).toBe("bun");
    expect(detectPackageManager(dir, null, {})).toBe("npm");
  });
});

describe("stripJsonComments", () => {
  it("remove comentários e vírgulas finais sem estragar URLs em strings", () => {
    const text = `{
      // comentário
      "$schema": "https://json.schemastore.org/tsconfig", /* bloco */
      "a": [1, 2,],
    }`;
    expect(JSON.parse(stripJsonComments(text))).toEqual({ $schema: "https://json.schemastore.org/tsconfig", a: [1, 2] });
  });
});

describe("detectProject", () => {
  function project(files: Record<string, string>): string {
    const dir = tmp();
    for (const [name, content] of Object.entries(files)) {
      fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
      fs.writeFileSync(path.join(dir, name), content);
    }
    return dir;
  }

  it("Next com src e alias @/* → src: mantém alias", () => {
    const dir = project({
      "package.json": JSON.stringify({ dependencies: { next: "15", react: "19" }, devDependencies: { typescript: "5" } }),
      "tsconfig.json": `{ // padrão do create-next-app\n "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }`,
      "src/app/page.tsx": "",
    });
    const info = detectProject(dir, {});
    expect(info).toMatchObject({ framework: "next", hasReact: true, hasTypeScript: true, srcRoot: "src", aliasMatchesSrc: true });
  });

  it("Vite sem alias: aliasMatchesSrc é false", () => {
    const dir = project({
      "package.json": JSON.stringify({ dependencies: { react: "19" }, devDependencies: { vite: "5", typescript: "5" } }),
      "tsconfig.json": `{ "compilerOptions": { "strict": true } }`,
      "src/main.tsx": "",
    });
    const info = detectProject(dir, {});
    expect(info.framework).toBe("vite");
    expect(info.aliasMatchesSrc).toBe(false);
  });

  it("alias @/* → ./* sem pasta src", () => {
    const dir = project({
      "package.json": JSON.stringify({ dependencies: { next: "15", react: "19" } }),
      "tsconfig.json": `{ "compilerOptions": { "paths": { "@/*": ["./*"] } } }`,
    });
    const info = detectProject(dir, {});
    expect(info.srcRoot).toBe(".");
    expect(info.aliasMatchesSrc).toBe(true);
  });

  it("sem package.json", () => {
    expect(detectProject(tmp(), {}).hasPackageJson).toBe(false);
  });
});

describe("resolveProjectPaths", () => {
  it("padrão com e sem src; override via config; bloqueia caminho fora do projeto", () => {
    const base = { cwd: "/p", hasPackageJson: true, framework: "next", packageManager: "npm", hasReact: true, hasTypeScript: true, aliasMatchesSrc: false, deps: {} } as const;
    const withSrc = resolveProjectPaths({ ...base, srcRoot: "src" });
    expect(withSrc).toMatchObject({ components: "src/components/ui", styles: "src/styles", utils: "src/utils", hooks: "src/hooks", isDefault: true });

    const noSrc = resolveProjectPaths({ ...base, srcRoot: "." });
    expect(noSrc.components).toBe("components/ui");

    const custom = resolveProjectPaths({ ...base, srcRoot: "src" }, { paths: { styles: "./lib/theme/" } });
    expect(custom).toMatchObject({ styles: "lib/theme", isDefault: false });

    expect(() => resolveProjectPaths({ ...base, srcRoot: "src" }, { paths: { hooks: "../fora" } })).toThrow(/dentro do projeto/);
  });
});
