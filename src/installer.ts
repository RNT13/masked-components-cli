import fs from "fs-extra";
import path from "node:path";
import type { AliasMode, NpmDep } from "./types";
import { resolveComponents, type ComponentEntry } from "./registry";
import type { ProjectInfo } from "./utils/detectProject";
import type { ProjectPaths } from "./utils/projectPaths";
import { copyTemplateDir, emptyReport, mergeReports, type CopyReport } from "./utils/copyTemplate";
import { classifyDeps, dedupeDeps, installPackages } from "./utils/installDeps";
import { rewriteAliasImports, type AliasMap } from "./utils/rewriteImports";

export interface InstallPlan {
  requested: string[];
  /** em ordem de instalação (dependências primeiro) */
  entries: ComponentEntry[];
  addedByDependency: string[];
  toInstall: NpmDep[];
  presentDeps: string[];
  depWarnings: string[];
  warnings: string[];
  notes: string[];
}

export interface InstallOptions {
  force: boolean;
  dryRun: boolean;
  noInstall: boolean;
  alias: AliasMode;
}

export interface InstallReport {
  files: CopyReport;
  installedDeps: NpmDep[];
  aliasRewritten: boolean;
}

/** Calcula o que seria instalado, sem tocar em nada. */
export function planInstall(info: ProjectInfo, requested: string[]): InstallPlan {
  const { ordered, addedByDependency } = resolveComponents(requested, info.framework);

  const required = dedupeDeps(ordered.flatMap((entry) => entry.dependencies ?? []));
  const { toInstall, present, warnings: depWarnings } = classifyDeps(required, info.deps);

  const warnings: string[] = [];
  if (!info.hasReact) warnings.push('"react" não foi encontrado no package.json deste projeto.');
  if (!info.hasTypeScript) warnings.push("Projeto sem TypeScript: os templates são arquivos .ts/.tsx.");
  for (const entry of ordered) {
    for (const warning of entry.warnings ?? []) {
      if (!warning.unlessFramework?.includes(info.framework)) warnings.push(`${entry.label}: ${warning.message}`);
    }
  }

  const notes = [...new Set(ordered.flatMap((entry) => entry.notes ?? []))];

  return {
    requested: [...new Set(requested)],
    entries: ordered,
    addedByDependency,
    toInstall,
    presentDeps: present,
    depWarnings,
    warnings,
    notes,
  };
}

export function shouldRewriteAlias(info: ProjectInfo, paths: ProjectPaths, mode: AliasMode): boolean {
  if (mode === "relative") return true;
  if (mode === "keep") return false;
  return !(info.aliasMatchesSrc && paths.isDefault);
}

export function buildAliasMap(cwd: string, paths: ProjectPaths): AliasMap {
  return {
    root: path.resolve(cwd, paths.srcRoot),
    components: path.resolve(cwd, paths.components),
    styles: path.resolve(cwd, paths.styles),
    utils: path.resolve(cwd, paths.utils),
    hooks: path.resolve(cwd, paths.hooks),
  };
}

/** Copia os templates e instala os pacotes npm que faltam. */
export async function executeInstall(
  plan: InstallPlan,
  info: ProjectInfo,
  paths: ProjectPaths,
  options: InstallOptions,
  templatesRoot: string,
): Promise<InstallReport> {
  const rewrite = shouldRewriteAlias(info, paths, options.alias);
  const aliasMap = buildAliasMap(info.cwd, paths);
  const files = emptyReport();

  for (const entry of plan.entries) {
    for (const mapping of entry.templates) {
      const sourceDir = path.join(templatesRoot, mapping.dir);
      if (!(await fs.pathExists(sourceDir))) {
        throw new Error(`Template ausente para "${entry.id}": templates/${mapping.dir}`);
      }

      const report = await copyTemplateDir({
        sourceDir,
        targetDir: path.resolve(info.cwd, paths[mapping.to], mapping.subdir ?? ""),
        cwd: info.cwd,
        force: options.force,
        dryRun: options.dryRun,
        exclude: mapping.exclude,
        transform: rewrite ? (content, destAbs) => rewriteAliasImports(content, destAbs, aliasMap) : undefined,
      });
      mergeReports(files, report);
    }
  }

  let installedDeps: NpmDep[] = [];
  if (!options.dryRun && !options.noInstall && plan.toInstall.length > 0) {
    await installPackages(info.packageManager, plan.toInstall, info.cwd);
    installedDeps = plan.toInstall;
  }

  return { files, installedDeps, aliasRewritten: rewrite };
}
