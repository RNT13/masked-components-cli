#!/usr/bin/env node

/* ============================================================
 * masked-components-cli — entrypoint
 *
 * Fluxo geral:
 *   1. Parse das flags e posicionais
 *   2. Atalhos: --help / --version / --list
 *   3. Validação de --alias e --pm
 *   4. Detecção do projeto (framework, PM, TS, alias "@/")
 *   5. Resolução dos diretórios de destino (masked.config.json)
 *   6. Seleção de componentes (--all | posicionais | prompt)
 *   7. Planejamento (deps internas + pacotes npm + warnings)
 *   8. Confirmação interativa (quando TTY e não --dry-run)
 *   9. Execução (copia templates + instala pacotes)
 *  10. Relatório final
 * ============================================================ */

import path from 'node:path'
import { parseArgs } from 'node:util'

// Orquestração da instalação: plano (sem escrever) + execução
import { executeInstall, planInstall, type InstallPlan, type InstallReport } from './installer'

// Prompts interativos (multiselect de componentes + confirm)
import { confirm, selectComponents } from './prompts/selectComponents'

// Registry: fonte única de verdade dos componentes e dependências
import { RegistryError, registry } from './registry'

import type { AliasMode, PackageManager } from './types'

// Utils internas
import { findTemplatesRoot } from './utils/copyTemplate'
import { detectProject, type ProjectInfo } from './utils/detectProject'
import { depSpec } from './utils/installDeps'
import { log, paint } from './utils/logger'
import { readOwnVersion } from './utils/ownPackage'
import {
  CONFIG_FILE,
  loadConfig,
  resolveProjectPaths,
  type ProjectPaths
} from './utils/projectPaths'

/* ============================================================
 * Constantes de validação das flags
 * ============================================================ */

const PACKAGE_MANAGERS: PackageManager[] = ['npm', 'pnpm', 'yarn', 'bun']
const ALIAS_MODES: AliasMode[] = ['auto', 'keep', 'relative']

/* ============================================================
 * Texto de ajuda (--help)
 * ============================================================ */

const HELP = `  
${paint.bold('masked-components-cli')} — instala componentes React + TypeScript no seu projeto  
  
${paint.bold('Uso')}  
  npx masked-components-cli                       escolhe os componentes de forma interativa  
  npx masked-components-cli masked-buttons ...    instala componentes específicos  
  npx masked-components-cli --all                 instala tudo  
  
${paint.bold('Opções')}  
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
`

/* ============================================================
 * Saídas de terminal
 * ============================================================ */

/** --list: imprime todos os componentes do registry (+ dependências internas). */
function printList(): void {
  log.info(paint.bold('Componentes disponíveis:'))
  for (const entry of registry) {
    const requires = entry.requires?.length
      ? paint.dim(`  (requer: ${entry.requires.join(', ')})`)
      : ''
    log.info(`  ${entry.id.padEnd(22)} ${entry.description}${requires}`)
  }
}

/** Imprime o plano de instalação antes de executar (ou no --dry-run). */
function printPlan(plan: InstallPlan, info: ProjectInfo, paths: ProjectPaths): void {
  const framework = info.framework === 'unknown' ? 'framework não detectado' : info.framework

  // Resumo do projeto detectado
  log.info(
    `${paint.bold('Projeto:')} ${framework} · ${info.packageManager} · ${info.hasTypeScript ? 'TypeScript' : 'sem TypeScript'}`
  )

  // Componentes que serão instalados (marcando os puxados como dependência)
  log.info(`${paint.bold('Componentes:')}`)
  for (const entry of plan.entries) {
    const extra = plan.addedByDependency.includes(entry.id) ? paint.dim(' (dependência)') : ''
    log.info(`  • ${entry.id}${extra}`)
  }

  // Diretórios de destino resolvidos
  log.info(
    `${paint.bold('Destino:')} ${[paths.components, paths.styles, paths.utils, paths.hooks].join(', ')}`
  )

  // Pacotes npm que faltam no package.json do projeto
  log.info(
    `${paint.bold('Pacotes npm:')} ${plan.toInstall.length ? plan.toInstall.map(depSpec).join(', ') : 'nada a instalar'}`
  )

  // Warnings do projeto + warnings por componente (ex.: FileInput fora do Next)
  for (const warning of [...plan.warnings, ...plan.depWarnings]) log.warn(warning)
}

/** Relatório final após a execução (ou simulação, em --dry-run). */
function printReport(report: InstallReport, plan: InstallPlan, dryRun: boolean): void {
  const { created, overwritten, unchanged, skipped } = report.files
  const verb = dryRun ? 'seriam criados' : 'criados'

  log.blank()

  // Contadores por tipo de resultado de arquivo
  if (created.length) log.success(`${created.length} arquivo(s) ${verb}`)
  if (overwritten.length)
    log.success(
      `${overwritten.length} arquivo(s) ${dryRun ? 'seriam sobrescritos' : 'sobrescritos'}`
    )
  if (unchanged.length)
    log.info(`${paint.dim('•')} ${unchanged.length} arquivo(s) já estavam idênticos`)

  // Arquivos diferentes mantidos sem --force: listar todos
  if (skipped.length) {
    log.warn(
      `${skipped.length} arquivo(s) já existiam com conteúdo diferente e foram mantidos (use --force para sobrescrever):`
    )
    for (const file of skipped) log.info(`    ${file}`)
  }

  // Imports "@/" reescritos para relativos (modo --alias relative / auto sem tsconfig)
  if (report.aliasRewritten)
    log.info(`${paint.dim('•')} imports "@/..." convertidos para caminhos relativos`)

  // Pacotes npm efetivamente instalados
  if (report.installedDeps.length)
    log.success(`pacotes instalados: ${report.installedDeps.map(depSpec).join(', ')}`)

  // "Próximos passos" por componente — só faz sentido fora de dry-run
  if (!dryRun && plan.notes.length) {
    log.blank()
    log.info(paint.bold('Próximos passos:'))
    for (const note of plan.notes) log.info(`  • ${note}`)
  }
}

/* ============================================================
 * main — retorna o exit code em vez de chamar process.exit()
 * (mantém o processo testável e deixa o Node flushar stdout)
 * ============================================================ */

async function main(): Promise<number> {
  /* ---------- 1. Parse das flags e posicionais ---------- */

  let parsed
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      allowPositionals: true,
      options: {
        all: { type: 'boolean' },
        yes: { type: 'boolean', short: 'y' },
        'no-install': { type: 'boolean' },
        force: { type: 'boolean', short: 'f' },
        'dry-run': { type: 'boolean' },
        list: { type: 'boolean', short: 'l' },
        help: { type: 'boolean', short: 'h' },
        version: { type: 'boolean', short: 'v' },
        pm: { type: 'string' },
        alias: { type: 'string' },
        cwd: { type: 'string' }
      }
    })
  } catch (error: unknown) {
    // Flag desconhecida, valor ausente, etc.
    log.error(error instanceof Error ? error.message : String(error))
    log.info('Use --help para ver as opções.')
    return 1
  }

  const { values } = parsed

  // "add" como primeiro posicional é açúcar sintático:
  // `masked-components-cli add masked-buttons` ≡ `... masked-buttons`
  const positionals = parsed.positionals.filter((item, index) => !(index === 0 && item === 'add'))

  /* ---------- 2. Atalhos que encerram cedo ---------- */

  if (values.help) {
    log.info(HELP)
    return 0
  }
  if (values.version) {
    log.info(readOwnVersion())
    return 0
  }
  if (values.list) {
    printList()
    return 0
  }

  /* ---------- 3. Validação de --alias e --pm ---------- */

  const alias = (values.alias ?? 'auto') as AliasMode
  if (!ALIAS_MODES.includes(alias)) {
    log.error(`--alias inválido: "${values.alias}". Use: ${ALIAS_MODES.join(' | ')}.`)
    return 1
  }
  if (values.pm !== undefined && !PACKAGE_MANAGERS.includes(values.pm as PackageManager)) {
    log.error(`--pm inválido: "${values.pm}". Use: ${PACKAGE_MANAGERS.join(' | ')}.`)
    return 1
  }

  /* ---------- 4. Detecção do projeto ---------- */

  const cwd = path.resolve(values.cwd ?? process.cwd())
  const info = detectProject(cwd)

  // Sem package.json não há o que fazer
  if (!info.hasPackageJson) {
    log.error(
      `package.json não encontrado em ${cwd}. Rode a CLI na raiz do seu projeto (ou use --cwd).`
    )
    return 1
  }

  // --pm explícito sobrescreve a detecção automática
  if (values.pm) info.packageManager = values.pm as PackageManager

  /* ---------- 5. Destinos (masked.config.json ou defaults) ---------- */

  const paths = resolveProjectPaths(info, loadConfig(cwd))
  const dryRun = Boolean(values['dry-run'])
  const interactive = Boolean(process.stdin.isTTY) && !values.yes

  /* ---------- 6. Seleção de componentes ---------- */

  // Ordem de precedência: --all → posicionais → prompt interativo.
  // --all filtra entries restritos a outros frameworks (ex.: masked-hooks-next
  // só aparece em projetos Next).
  let ids = values.all
    ? registry
        .filter((entry) => !entry.frameworks || entry.frameworks.includes(info.framework))
        .map((entry) => entry.id)
    : positionals

  if (ids.length === 0) {
    // Sem TTY não dá para perguntar — exige ids ou --all
    if (!process.stdin.isTTY) {
      log.error(
        'Nenhum componente informado. Passe os ids (ex.: masked-buttons), use --all ou rode em um terminal interativo.'
      )
      return 1
    }

    // Prompt multiselect; o filtro por framework acontece dentro dele
    ids = await selectComponents(registry, info.framework)
    if (ids.length === 0) {
      log.info('Nenhum componente selecionado.')
      return 0
    }
  }

  /* ---------- 7. Planejamento (não escreve nada) ---------- */

  // planInstall resolve o grafo de deps internas, classifica pacotes npm
  // faltantes e coleta warnings/notas — tudo puro, sem IO de escrita.
  const plan = planInstall(info, ids)
  printPlan(plan, info, paths)

  /* ---------- 8. Confirmação (TTY, sem --yes, sem --dry-run) ---------- */

  if (interactive && !dryRun) {
    log.blank()
    if (!(await confirm('Continuar com a instalação?'))) {
      log.info('Cancelado.')
      return 1
    }
  }

  /* ---------- 9. Execução ---------- */

  // executeInstall: copia templates (respeitando --force/--dry-run),
  // opcionalmente reescreve "@/" → relativos e instala pacotes npm.
  const report = await executeInstall(
    plan,
    info,
    paths,
    {
      force: Boolean(values.force),
      dryRun,
      noInstall: Boolean(values['no-install']),
      alias
    },
    findTemplatesRoot()
  )

  /* ---------- 10. Relatório ---------- */

  printReport(report, plan, dryRun)
  if (dryRun) log.info(`\n${paint.dim('(--dry-run: nada foi escrito)')}`)
  else log.success('Pronto!')
  return 0
}

/* ============================================================
 * Bootstrap: exit code via process.exitCode (não process.exit)
 * e captura de erros — RegistryError recebe tratamento igual
 * a erros comuns (mensagem limpa, sem stack trace).
 * ============================================================ */

main()
  .then((code) => {
    process.exitCode = code
  })
  .catch((error: unknown) => {
    log.error(
      error instanceof RegistryError || error instanceof Error ? error.message : String(error)
    )
    process.exitCode = 1
  })
