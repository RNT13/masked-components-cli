#!/usr/bin/env node

import path from "node:path";
import { parseArgs } from "node:util";
import {
  executeInstall,
  planInstall,
  type InstallPlan,
  type InstallReport,
} from "./installer";
import { confirm, selectComponents } from "./prompts/selectComponents";
import { RegistryError, registry } from "./registry";
import type { AliasMode, PackageManager } from "./types";
import { findTemplatesRoot } from "./utils/copyTemplate";
import { detectProject, type ProjectInfo } from "./utils/detectProject";
import { log, paint } from "./utils/logger";
import { readOwnVersion } from "./utils/ownPackage";
import {
  CONFIG_FILE,
  loadConfig,
  resolveProjectPaths,
  type ProjectPaths,
} from "./utils/projectPaths";
import { depSpec } from "./utils/installDeps";

const PACKAGE_MANAGERS: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];
const ALIAS_MODES: AliasMode[] = ["auto", "keep", "relative"];

const HELP = `
${paint.bold("masked-components-cli")} — instala componentes React + TypeScript no seu projeto

${paint.bold("Uso")}
  npx masked-components-cli                       escolhe os componentes de forma interativa
  npx masked-components-cli masked-buttons ...    instala componentes específicos
  npx masked-components-cli --all                 instala tudo

${paint.bold("Opções")}
  -l, --list           lista os componentes disponíveis
  -y, --yes            não pergunta nada (aceita o plano)
  -f, --force          sobrescreve arquivos que já existem e são diferentes
      --dry-run        mostra o que seria feito, sem escrever nada
      --no-install     não instala pacotes npm (só copia os arquivos)
      --pm <gerenciador>   npm | pnpm | yarn | bun (padrão: detectado pelo lockfile)
      --alias <modo>   auto | keep | relative — como tratar imports "@/..." (padrão: auto)
      --cwd <pasta>    roda em outra pasta (padrão: pasta atual)
  -h, --help           mostra esta ajuda
  -v, --version        mostra a versão

Arquivos existentes e diferentes nunca são sobrescritos sem --force.
Caminhos de destino podem ser ajustados em ${CONFIG_FILE}.
`;

function printList(): void {
  log.info(paint.bold("Componentes disponíveis:"));
  for (const entry of registry) {
    const requires = entry.requires?.length
      ? paint.dim(`  (requer: ${entry.requires.join(", ")})`)
      : "";
    log.info(`  ${entry.id.padEnd(22)} ${entry.description}${requires}`);
  }
}

function printPlan(
  plan: InstallPlan,
  info: ProjectInfo,
  paths: ProjectPaths,
): void {
  const framework =
    info.framework === "unknown" ? "framework não detectado" : info.framework;
  log.info(
    `${paint.bold("Projeto:")} ${framework} · ${info.packageManager} · ${info.hasTypeScript ? "TypeScript" : "sem TypeScript"}`,
  );
  log.info(`${paint.bold("Componentes:")}`);
  for (const entry of plan.entries) {
    const extra = plan.addedByDependency.includes(entry.id)
      ? paint.dim(" (dependência)")
      : "";
    log.info(`  • ${entry.id}${extra}`);
  }
  log.info(
    `${paint.bold("Destino:")} ${[paths.components, paths.styles, paths.utils, paths.hooks].join(", ")}`,
  );
  log.info(
    `${paint.bold("Pacotes npm:")} ${plan.toInstall.length ? plan.toInstall.map(depSpec).join(", ") : "nada a instalar"}`,
  );
  for (const warning of [...plan.warnings, ...plan.depWarnings])
    log.warn(warning);
}

function printReport(
  report: InstallReport,
  plan: InstallPlan,
  dryRun: boolean,
): void {
  const { created, overwritten, unchanged, skipped } = report.files;
  const verb = dryRun ? "seriam criados" : "criados";

  log.blank();
  if (created.length) log.success(`${created.length} arquivo(s) ${verb}`);
  if (overwritten.length)
    log.success(
      `${overwritten.length} arquivo(s) ${dryRun ? "seriam sobrescritos" : "sobrescritos"}`,
    );
  if (unchanged.length)
    log.info(
      `${paint.dim("•")} ${unchanged.length} arquivo(s) já estavam idênticos`,
    );
  if (skipped.length) {
    log.warn(
      `${skipped.length} arquivo(s) já existiam com conteúdo diferente e foram mantidos (use --force para sobrescrever):`,
    );
    for (const file of skipped) log.info(`    ${file}`);
  }
  if (report.aliasRewritten)
    log.info(
      `${paint.dim("•")} imports "@/..." convertidos para caminhos relativos`,
    );
  if (report.installedDeps.length)
    log.success(
      `pacotes instalados: ${report.installedDeps.map(depSpec).join(", ")}`,
    );

  if (!dryRun && plan.notes.length) {
    log.blank();
    log.info(paint.bold("Próximos passos:"));
    for (const note of plan.notes) log.info(`  • ${note}`);
  }
}

async function main(): Promise<number> {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      allowPositionals: true,
      options: {
        all: { type: "boolean" },
        yes: { type: "boolean", short: "y" },
        "no-install": { type: "boolean" },
        force: { type: "boolean", short: "f" },
        "dry-run": { type: "boolean" },
        list: { type: "boolean", short: "l" },
        help: { type: "boolean", short: "h" },
        version: { type: "boolean", short: "v" },
        pm: { type: "string" },
        alias: { type: "string" },
        cwd: { type: "string" },
      },
    });
  } catch (error: unknown) {
    log.error(error instanceof Error ? error.message : String(error));
    log.info("Use --help para ver as opções.");
    return 1;
  }

  const { values } = parsed;
  const positionals = parsed.positionals.filter(
    (item, index) => !(index === 0 && item === "add"),
  );

  if (values.help) {
    log.info(HELP);
    return 0;
  }
  if (values.version) {
    log.info(readOwnVersion());
    return 0;
  }
  if (values.list) {
    printList();
    return 0;
  }

  const alias = (values.alias ?? "auto") as AliasMode;
  if (!ALIAS_MODES.includes(alias)) {
    log.error(
      `--alias inválido: "${values.alias}". Use: ${ALIAS_MODES.join(" | ")}.`,
    );
    return 1;
  }
  if (
    values.pm !== undefined &&
    !PACKAGE_MANAGERS.includes(values.pm as PackageManager)
  ) {
    log.error(
      `--pm inválido: "${values.pm}". Use: ${PACKAGE_MANAGERS.join(" | ")}.`,
    );
    return 1;
  }

  const cwd = path.resolve(values.cwd ?? process.cwd());
  const info = detectProject(cwd);
  if (!info.hasPackageJson) {
    log.error(
      `package.json não encontrado em ${cwd}. Rode a CLI na raiz do seu projeto (ou use --cwd).`,
    );
    return 1;
  }
  if (values.pm) info.packageManager = values.pm as PackageManager;

  const paths = resolveProjectPaths(info, loadConfig(cwd));
  const dryRun = Boolean(values["dry-run"]);
  const interactive = Boolean(process.stdin.isTTY) && !values.yes;

  let ids = values.all
    ? registry
        .filter(
          (entry) =>
            !entry.frameworks || entry.frameworks.includes(info.framework),
        )
        .map((entry) => entry.id)
    : positionals;
  if (ids.length === 0) {
    if (!process.stdin.isTTY) {
      log.error(
        "Nenhum componente informado. Passe os ids (ex.: masked-buttons), use --all ou rode em um terminal interativo.",
      );
      return 1;
    }
    ids = await selectComponents();
    if (ids.length === 0) {
      log.info("Nenhum componente selecionado.");
      return 0;
    }
  }

  const plan = planInstall(info, ids);
  printPlan(plan, info, paths);

  if (interactive && !dryRun) {
    log.blank();
    if (!(await confirm("Continuar com a instalação?"))) {
      log.info("Cancelado.");
      return 1;
    }
  }

  const report = await executeInstall(
    plan,
    info,
    paths,
    {
      force: Boolean(values.force),
      dryRun,
      noInstall: Boolean(values["no-install"]),
      alias,
    },
    findTemplatesRoot(),
  );

  printReport(report, plan, dryRun);
  if (dryRun) log.info(`\n${paint.dim("(--dry-run: nada foi escrito)")}`);
  else log.success("Pronto!");
  return 0;
}

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error: unknown) => {
    log.error(
      error instanceof RegistryError || error instanceof Error
        ? error.message
        : String(error),
    );
    process.exitCode = 1;
  });
