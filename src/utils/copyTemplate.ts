import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";

const IGNORED_FILES = new Set([".DS_Store", "Thumbs.db"]);
const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const TEXT_EXTENSIONS = new Set([...CODE_EXTENSIONS, ".json", ".css", ".md", ".txt"]);

/**
 * Sobe a partir de `startDir` até achar a pasta `templates` do pacote
 * (funciona tanto rodando de `dist/` quanto de `src/`).
 */
export function findTemplatesRoot(startDir: string = path.dirname(fileURLToPath(import.meta.url))): string {
  let dir = startDir;
  for (;;) {
    const candidate = path.join(dir, "templates");
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error("Pasta 'templates' não encontrada. A instalação da CLI parece incompleta.");
}

export interface CopyOptions {
  /** pasta de origem (um diretório dentro de templates/) */
  sourceDir: string;
  /** pasta de destino absoluta */
  targetDir: string;
  /** base para os caminhos exibidos no relatório */
  cwd: string;
  /** sobrescreve arquivos diferentes que já existem */
  force: boolean;
  /** não escreve nada; só classifica */
  dryRun: boolean;
  exclude?: string[];
  /** transforma o conteúdo de arquivos de código antes de escrever */
  transform?: (content: string, destAbs: string) => string;
}

export interface CopyReport {
  created: string[];
  overwritten: string[];
  /** já existia com o mesmo conteúdo */
  unchanged: string[];
  /** já existia com conteúdo diferente e foi mantido */
  skipped: string[];
}

export function emptyReport(): CopyReport {
  return { created: [], overwritten: [], unchanged: [], skipped: [] };
}

export function mergeReports(target: CopyReport, extra: CopyReport): void {
  target.created.push(...extra.created);
  target.overwritten.push(...extra.overwritten);
  target.unchanged.push(...extra.unchanged);
  target.skipped.push(...extra.skipped);
}

async function listFiles(dir: string, base: string = dir): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(abs, base)));
    else if (entry.isFile() && !IGNORED_FILES.has(entry.name)) files.push(path.relative(base, abs));
  }
  return files.sort();
}

function isExcluded(rel: string, exclude: string[]): boolean {
  const posix = rel.split(path.sep).join("/");
  return exclude.some((item) => posix === item || path.posix.basename(posix) === item);
}

/** Ignora diferenças de fim de linha e espaços no fim da linha. */
function normalizeText(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "");
}

export async function copyTemplateDir(options: CopyOptions): Promise<CopyReport> {
  const report = emptyReport();
  const files = await listFiles(options.sourceDir);

  for (const rel of files) {
    if (options.exclude && isExcluded(rel, options.exclude)) continue;

    const src = path.join(options.sourceDir, rel);
    const dest = path.join(options.targetDir, rel);
    const shown = path.relative(options.cwd, dest).split(path.sep).join("/");
    const ext = path.extname(rel).toLowerCase();
    const exists = await fs.pathExists(dest);

    let next: string | Buffer;
    let same = false;

    if (TEXT_EXTENSIONS.has(ext)) {
      let content = await fs.readFile(src, "utf8");
      if (options.transform && CODE_EXTENSIONS.has(ext)) content = options.transform(content, dest);
      next = content;
      if (exists) same = normalizeText(await fs.readFile(dest, "utf8")) === normalizeText(content);
    } else {
      const buffer = await fs.readFile(src);
      next = buffer;
      if (exists) same = buffer.equals(await fs.readFile(dest));
    }

    if (exists && same) {
      report.unchanged.push(shown);
      continue;
    }
    if (exists && !options.force) {
      report.skipped.push(shown);
      continue;
    }

    if (!options.dryRun) {
      await fs.ensureDir(path.dirname(dest));
      await fs.writeFile(dest, next);
    }
    (exists ? report.overwritten : report.created).push(shown);
  }

  return report;
}
