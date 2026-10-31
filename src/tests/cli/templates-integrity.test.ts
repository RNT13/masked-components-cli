import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { registry, resolveComponents } from "../../registry";

/**
 * Confere os templates REAIS contra o registro:
 *  1. toda pasta citada no registro existe;
 *  2. instalando cada componente (com suas dependências), todo import resolve
 *     para um arquivo que será instalado ou para um pacote declarado;
 *  3. instalando TUDO, dois templates nunca escrevem o mesmo arquivo com conteúdo diferente.
 *
 * Se falhar, o registro ou o template está desatualizado — é exatamente o tipo de erro que
 * deixa o projeto do usuário sem compilar depois de instalar.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const templatesRoot = path.resolve(here, "../../../templates");
const hasTemplates = fs.existsSync(templatesRoot);

const ROOTS = { components: "src/components/ui", styles: "src/styles", utils: "src/utils", hooks: "src/hooks" } as const;
const ALWAYS_ALLOWED = new Set(["react", "react-dom"]);
const CODE = /\.(ts|tsx)$/;
const IMPORT = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])([^"']+)\1/g;

interface VirtualFile {
  from: string;
  content: string;
}

function listFiles(dir: string, base = dir): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(abs, base);
    return entry.isFile() && entry.name !== ".DS_Store" ? [path.relative(base, abs).split(path.sep).join("/")] : [];
  });
}

function excluded(rel: string, exclude: string[] = []): boolean {
  return exclude.some((item) => rel === item || path.posix.basename(rel) === item);
}

const normalize = (text: string) => text.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "");

function buildLayout(ids: string[], problems: string[]): { files: Map<string, VirtualFile>; packages: Set<string> } {
  const { ordered } = resolveComponents(ids, "next");
  const files = new Map<string, VirtualFile>();
  const packages = new Set<string>(ALWAYS_ALLOWED);

  for (const entry of ordered) {
    for (const dep of entry.dependencies ?? []) packages.add(dep.name);
    for (const ext of entry.externals ?? []) packages.add(ext);

    for (const mapping of entry.templates) {
      const source = path.join(templatesRoot, mapping.dir);
      if (!fs.existsSync(source)) {
        problems.push(`${entry.id}: templates/${mapping.dir} não existe`);
        continue;
      }
      for (const rel of listFiles(source)) {
        if (excluded(rel, mapping.exclude)) continue;
        const dest = path.posix.join(ROOTS[mapping.to], mapping.subdir ?? "", rel);
        const content = fs.readFileSync(path.join(source, rel), "utf8");
        const previous = files.get(dest);
        if (previous && normalize(previous.content) !== normalize(content)) {
          problems.push(`conflito em ${dest}: templates/${previous.from} e templates/${mapping.dir}/${rel} têm conteúdo diferente`);
        }
        if (!previous) files.set(dest, { from: `${mapping.dir}/${rel}`, content });
      }
    }
  }
  return { files, packages };
}

function aliasToVirtual(spec: string): string {
  for (const [prefix, root] of [
    ["styles/", ROOTS.styles],
    ["utils/", ROOTS.utils],
    ["hooks/", ROOTS.hooks],
    ["components/ui/", ROOTS.components],
  ] as const) {
    if (spec.startsWith(prefix)) return path.posix.join(root, spec.slice(prefix.length));
  }
  return path.posix.join("src", spec);
}

function resolves(files: Map<string, VirtualFile>, target: string): boolean {
  return [target, `${target}.ts`, `${target}.tsx`, `${target}/index.ts`, `${target}/index.tsx`].some((c) => files.has(c));
}

function packageName(spec: string): string {
  const parts = spec.split("/");
  return spec.startsWith("@") ? parts.slice(0, 2).join("/") : (parts[0] ?? spec);
}

function checkImports(id: string, files: Map<string, VirtualFile>, packages: Set<string>, problems: string[]): void {
  for (const [dest, file] of files) {
    if (!CODE.test(dest)) continue;
    for (const match of file.content.matchAll(IMPORT)) {
      const spec = match[2] ?? "";
      if (spec.startsWith("node:")) continue;

      if (spec.startsWith("@/")) {
        if (!resolves(files, aliasToVirtual(spec.slice(2)))) problems.push(`${id}: ${dest} importa "${spec}", que não será instalado`);
      } else if (spec.startsWith(".")) {
        if (!resolves(files, path.posix.normalize(path.posix.join(path.posix.dirname(dest), spec)))) {
          problems.push(`${id}: ${dest} importa "${spec}", que não existe após a instalação`);
        }
      } else if (!packages.has(packageName(spec))) {
        problems.push(`${id}: ${dest} importa o pacote "${packageName(spec)}", que não está declarado no registro`);
      }
    }
  }
}

describe.skipIf(!hasTemplates)("integridade templates × registro", () => {
  it("toda pasta citada no registro existe em templates/", () => {
    const missing = registry.flatMap((entry) =>
      entry.templates.filter((m) => !fs.existsSync(path.join(templatesRoot, m.dir))).map((m) => `${entry.id}: templates/${m.dir}`),
    );
    expect(missing).toEqual([]);
  });

  for (const entry of registry) {
    it(`${entry.id}: todo import resolve após instalar (com dependências)`, () => {
      const problems: string[] = [];
      const { files, packages } = buildLayout([entry.id], problems);
      checkImports(entry.id, files, packages, problems);
      expect(problems).toEqual([]);
    });
  }

  it("instalando tudo, nenhum arquivo é escrito por dois templates com conteúdo diferente", () => {
    const problems: string[] = [];
    buildLayout(registry.map((entry) => entry.id), problems);
    expect(problems).toEqual([]);
  });
});
