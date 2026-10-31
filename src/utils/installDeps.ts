import { execa } from "execa";
import type { NpmDep, PackageManager } from "../types";

export interface DepClassification {
  toInstall: NpmDep[];
  present: string[];
  warnings: string[];
}

/** Primeiro número de um range ("^6.1.0" → 6). */
export function parseMajor(range: string): number | null {
  const match = /(\d+)/.exec(range);
  return match ? Number(match[1]) : null;
}

export function dedupeDeps(deps: NpmDep[]): NpmDep[] {
  const byName = new Map<string, NpmDep>();
  for (const dep of deps) if (!byName.has(dep.name)) byName.set(dep.name, dep);
  return [...byName.values()];
}

/** Separa o que falta instalar do que o projeto já tem (avisando versão major antiga). */
export function classifyDeps(required: NpmDep[], installed: Record<string, string>): DepClassification {
  const toInstall: NpmDep[] = [];
  const present: string[] = [];
  const warnings: string[] = [];

  for (const dep of required) {
    const current = installed[dep.name];
    if (current === undefined) {
      toInstall.push(dep);
      continue;
    }
    present.push(dep.name);

    const have = parseMajor(current);
    const need = parseMajor(dep.range);
    if (have !== null && need !== null && have < need) {
      warnings.push(`${dep.name} ${current} detectado; os templates foram escritos para ${dep.range}. Atualize manualmente.`);
    }
  }

  return { toInstall, present, warnings };
}

export function buildInstallCommand(packageManager: PackageManager, specs: string[]): { command: string; args: string[] } {
  switch (packageManager) {
    case "npm":
      return { command: "npm", args: ["install", ...specs] };
    case "pnpm":
      return { command: "pnpm", args: ["add", ...specs] };
    case "yarn":
      return { command: "yarn", args: ["add", ...specs] };
    case "bun":
      return { command: "bun", args: ["add", ...specs] };
  }
}

export function depSpec(dep: NpmDep): string {
  return `${dep.name}@${dep.range}`;
}

export async function installPackages(packageManager: PackageManager, deps: NpmDep[], cwd: string): Promise<void> {
  if (deps.length === 0) return;

  const { command, args } = buildInstallCommand(packageManager, deps.map(depSpec));
  try {
    await execa(command, args, { cwd, stdio: "inherit" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    throw new Error(`Falha ao instalar dependências com ${packageManager}: ${message}`);
  }
}
