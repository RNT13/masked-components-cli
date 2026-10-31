import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { copyTemplateDir, findTemplatesRoot } from "../../utils/copyTemplate";

const dirs: string[] = [];
function tmp(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mcli-copy-"));
  dirs.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of dirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

function setup() {
  const root = tmp();
  const source = path.join(root, "templates/demo");
  const target = path.join(root, "project/src/components");
  fs.outputFileSync(path.join(source, "A.tsx"), "export const A = 1\n");
  fs.outputFileSync(path.join(source, "nested/B.ts"), "export const B = 2\n");
  fs.outputFileSync(path.join(source, "skip.ts"), "export const S = 3\n");
  fs.outputFileSync(path.join(source, ".DS_Store"), "lixo");
  return { root, source, target, cwd: path.join(root, "project") };
}

describe("copyTemplateDir", () => {
  it("cria arquivos, respeita exclude e ignora lixo do sistema", async () => {
    const { source, target, cwd } = setup();
    const report = await copyTemplateDir({ sourceDir: source, targetDir: target, cwd, force: false, dryRun: false, exclude: ["skip.ts"] });
    expect(report.created).toEqual(["src/components/A.tsx", "src/components/nested/B.ts"]);
    expect(fs.existsSync(path.join(target, "skip.ts"))).toBe(false);
    expect(fs.existsSync(path.join(target, ".DS_Store"))).toBe(false);
  });

  it("segunda rodada: tudo idêntico; arquivo editado pelo usuário é mantido; --force sobrescreve", async () => {
    const { source, target, cwd } = setup();
    const base = { sourceDir: source, targetDir: target, cwd, dryRun: false, exclude: ["skip.ts"] };
    await copyTemplateDir({ ...base, force: false });

    const again = await copyTemplateDir({ ...base, force: false });
    expect(again.unchanged).toHaveLength(2);
    expect(again.created).toHaveLength(0);

    fs.writeFileSync(path.join(target, "A.tsx"), "export const A = 'editado pelo usuário'\n");
    const kept = await copyTemplateDir({ ...base, force: false });
    expect(kept.skipped).toEqual(["src/components/A.tsx"]);
    expect(fs.readFileSync(path.join(target, "A.tsx"), "utf8")).toContain("editado");

    const forced = await copyTemplateDir({ ...base, force: true });
    expect(forced.overwritten).toEqual(["src/components/A.tsx"]);
    expect(fs.readFileSync(path.join(target, "A.tsx"), "utf8")).toBe("export const A = 1\n");
  });

  it("diferenças só de fim de linha ou espaço final contam como idêntico", async () => {
    const { source, target, cwd } = setup();
    const base = { sourceDir: source, targetDir: target, cwd, dryRun: false, force: false, exclude: ["skip.ts"] };
    await copyTemplateDir(base);
    fs.writeFileSync(path.join(target, "A.tsx"), "export const A = 1  \r\n");
    const report = await copyTemplateDir(base);
    expect(report.unchanged).toContain("src/components/A.tsx");
  });

  it("dry-run não escreve nada", async () => {
    const { source, target, cwd } = setup();
    const report = await copyTemplateDir({ sourceDir: source, targetDir: target, cwd, force: false, dryRun: true });
    expect(report.created.length).toBeGreaterThan(0);
    expect(fs.existsSync(target)).toBe(false);
  });

  it("aplica transform só em arquivos de código", async () => {
    const { source, target, cwd } = setup();
    fs.outputFileSync(path.join(source, "note.md"), "@x\n");
    await copyTemplateDir({ sourceDir: source, targetDir: target, cwd, force: false, dryRun: false, transform: (c) => c.replace("export", "EXPORT") });
    expect(fs.readFileSync(path.join(target, "A.tsx"), "utf8")).toContain("EXPORT const A");
    expect(fs.readFileSync(path.join(target, "note.md"), "utf8")).toBe("@x\n");
  });
});

describe("findTemplatesRoot", () => {
  it("sobe até achar templates/ e falha com mensagem clara se não existir", () => {
    const root = tmp();
    fs.ensureDirSync(path.join(root, "templates"));
    fs.ensureDirSync(path.join(root, "dist/deep"));
    expect(findTemplatesRoot(path.join(root, "dist/deep"))).toBe(path.join(root, "templates"));

    const empty = tmp();
    expect(() => findTemplatesRoot(empty)).toThrow(/templates/);
  });
});
