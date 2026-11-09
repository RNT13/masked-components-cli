#!/usr/bin/env node

// src/cli.ts
import path7 from "path";
import { parseArgs } from "util";

// src/installer.ts
import fs2 from "fs-extra";
import path3 from "path";

// src/registry.ts
var STYLED = { name: "styled-components", range: "^6.1.0" };
var FORMIK = { name: "formik", range: "^2.4.0" };
var THEME_PROVIDER_NOTE = "Envolva a aplica\xE7\xE3o com <ThemeProvider theme={maskedTheme}> (styled-components), importando de styles/MaskedThemes/MaskedThemes.";
var CONFIG_PROVIDER_NOTE = "Opcional: <MaskedConfigProvider> configura linkComponent, imageComponent, toasts e locale padr\xE3o uma \xFAnica vez para toda a lib.";
var registry = [
  {
    id: "masked-utils",
    label: "Masked Utils",
    description: "Fun\xE7\xF5es puras: moeda, n\xFAmero, data, hora, dura\xE7\xE3o, nomes, cores, erros",
    templates: [{ dir: "masked-utils", to: "utils", subdir: "masked-utils" }]
  },
  {
    id: "masked-themes",
    label: "Masked Themes",
    description: "Tema base, temas prontos (light/dark/paleta) e registro de colorTheme",
    // color.ts agora mora dentro de masked-utils — sem pasta color-utils separada
    templates: [{ dir: "masked-themes", to: "styles" }],
    requires: ["masked-utils"],
    dependencies: [STYLED],
    notes: [THEME_PROVIDER_NOTE]
  },
  {
    id: "masked-animations",
    label: "Masked Animations",
    description: "Anima\xE7\xF5es reveal, cont\xEDnuas e controladas + useInView",
    templates: [
      { dir: "masked-animations", to: "styles" },
      { dir: "hooks", to: "hooks", exclude: ["useAnimationEngine.ts"] }
    ],
    dependencies: [STYLED]
  },
  {
    id: "masked-config",
    label: "Masked Config Provider",
    description: "Provider global opcional: linkComponent, imageComponent, toasts, locale",
    templates: [{ dir: "masked-config", to: "components" }]
  },
  {
    id: "masked-skeleton",
    label: "Masked Skeleton",
    description: "Placeholder de carregamento (autossuficiente, tokens --mc-skeleton-*)",
    templates: [{ dir: "masked-skeleton", to: "components" }],
    dependencies: [STYLED]
  },
  {
    id: "masked-toaster",
    label: "Masked Toaster",
    description: "Notifica\xE7\xF5es (toast) sem depend\xEAncias: success/error/info/warning/loading/promise, acess\xEDvel e SSR-safe",
    templates: [{ dir: "masked-toaster", to: "components" }],
    notes: [
      'Renderize <MaskedToaster /> uma vez na raiz do app e dispare com toast.success("...").',
      "Opcional: <MaskedConfigProvider config={maskedToastHandlers}> liga os callbacks onSuccess/onError da lib ao toaster."
    ]
  },
  {
    id: "masked-buttons",
    label: "Masked Buttons",
    description: "default, outline, ghost, soft, link, gradient, neon, split, toggle, switch, checkbox, radio, group",
    templates: [{ dir: "masked-buttons", to: "components" }],
    requires: ["masked-animations", "masked-themes", "masked-config"],
    dependencies: [STYLED],
    notes: [THEME_PROVIDER_NOTE, CONFIG_PROVIDER_NOTE]
  },
  {
    id: "masked-cards",
    label: "Masked Cards",
    description: "Cards m\xE9tricas/stats/compare/product/feature/plan com tokens --mc-card-*",
    templates: [{ dir: "masked-cards", to: "components" }],
    requires: ["masked-utils", "masked-themes", "masked-config"],
    dependencies: [STYLED]
  },
  {
    id: "masked-drawer",
    label: "Masked Drawer",
    description: "Painel lateral/superior/inferior com overlay, portal SSR-safe e focus-trap",
    templates: [{ dir: "masked-drawer", to: "components" }],
    requires: ["masked-themes"],
    dependencies: [STYLED]
  },
  {
    id: "masked-popup",
    label: "Masked Popup",
    description: "Modal centralizado com overlay, portal SSR-safe e focus-trap",
    templates: [{ dir: "masked-popup", to: "components" }],
    requires: ["masked-themes"],
    dependencies: [STYLED]
  },
  {
    id: "masked-input",
    label: "Masked Input",
    description: "texto, textarea, senha, m\xE1scara, moeda, select, hora, arquivo, busca",
    templates: [{ dir: "masked-input", to: "components" }],
    requires: ["masked-animations", "masked-themes", "masked-config", "masked-utils"],
    dependencies: [STYLED]
    // sem next/image e sem react-hot-toast: upload/imagem/erros são injetáveis
  },
  {
    id: "masked-input-formik",
    label: "Masked Input \u2014 camada Formik",
    description: "Vers\xF5es ligadas ao Formik (useField) de cada variante do Masked Input",
    templates: [{ dir: "masked-input-formik", to: "components" }],
    requires: ["masked-input"],
    dependencies: [FORMIK]
  },
  {
    id: "masked-hooks",
    label: "Masked Hooks",
    description: "useDebounce, useLocalStorage, useMediaQuery, useScrollToTop",
    templates: [{ dir: "masked-hooks", to: "hooks" }]
    // useInView sai com masked-animations; useSmartSearch sai com masked-input
  },
  {
    id: "masked-hooks-next",
    label: "Masked Hooks (Next.js)",
    description: "useSafeReturn: voltar para a rota de origem com seguran\xE7a (s\xF3 Next.js)",
    templates: [{ dir: "masked-hooks-next", to: "hooks" }],
    frameworks: ["next"],
    externals: ["next"]
  }
];
var RegistryError = class extends Error {
};
function resolveComponents(ids, framework, entries = registry) {
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const ordered = [];
  const done = /* @__PURE__ */ new Set();
  const visiting = [];
  const visit = (id) => {
    if (done.has(id)) return;
    const entry = byId.get(id);
    if (!entry) {
      throw new RegistryError(
        `Componente desconhecido: "${id}". Dispon\xEDveis: ${[...byId.keys()].join(", ")}`
      );
    }
    if (visiting.includes(id)) {
      throw new RegistryError(`Depend\xEAncia circular: ${[...visiting, id].join(" \u2192 ")}`);
    }
    if (entry.frameworks && !entry.frameworks.includes(framework)) {
      throw new RegistryError(
        `"${id}" s\xF3 est\xE1 dispon\xEDvel para: ${entry.frameworks.join(", ")} (detectado: ${framework}).`
      );
    }
    visiting.push(id);
    for (const dep of entry.requires ?? []) visit(dep);
    visiting.pop();
    done.add(id);
    ordered.push(entry);
  };
  const requested = [...new Set(ids)];
  for (const id of requested) visit(id);
  const requestedSet = new Set(requested);
  return {
    ordered,
    addedByDependency: ordered.filter((entry) => !requestedSet.has(entry.id)).map((entry) => entry.id)
  };
}

// src/utils/copyTemplate.ts
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
var IGNORED_FILES = /* @__PURE__ */ new Set([".DS_Store", "Thumbs.db"]);
var CODE_EXTENSIONS = /* @__PURE__ */ new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
var TEXT_EXTENSIONS = /* @__PURE__ */ new Set([...CODE_EXTENSIONS, ".json", ".css", ".md", ".txt"]);
function findTemplatesRoot(startDir = path.dirname(fileURLToPath(import.meta.url))) {
  let dir = startDir;
  for (; ; ) {
    const candidate = path.join(dir, "templates");
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error("Pasta 'templates' n\xE3o encontrada. A instala\xE7\xE3o da CLI parece incompleta.");
}
function emptyReport() {
  return { created: [], overwritten: [], unchanged: [], skipped: [] };
}
function mergeReports(target, extra) {
  target.created.push(...extra.created);
  target.overwritten.push(...extra.overwritten);
  target.unchanged.push(...extra.unchanged);
  target.skipped.push(...extra.skipped);
}
async function listFiles(dir, base = dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(abs, base));
    else if (entry.isFile() && !IGNORED_FILES.has(entry.name)) files.push(path.relative(base, abs));
  }
  return files.sort();
}
function isExcluded(rel, exclude) {
  const posix = rel.split(path.sep).join("/");
  return exclude.some((item) => posix === item || path.posix.basename(posix) === item);
}
function normalizeText(text) {
  return text.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "");
}
async function copyTemplateDir(options) {
  const report = emptyReport();
  const files = await listFiles(options.sourceDir);
  for (const rel of files) {
    if (options.exclude && isExcluded(rel, options.exclude)) continue;
    const src = path.join(options.sourceDir, rel);
    const dest = path.join(options.targetDir, rel);
    const shown = path.relative(options.cwd, dest).split(path.sep).join("/");
    const ext = path.extname(rel).toLowerCase();
    const exists = await fs.pathExists(dest);
    let next;
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
    ;
    (exists ? report.overwritten : report.created).push(shown);
  }
  return report;
}

// src/utils/installDeps.ts
import { execa } from "execa";
function parseMajor(range) {
  const match = /(\d+)/.exec(range);
  return match ? Number(match[1]) : null;
}
function dedupeDeps(deps) {
  const byName = /* @__PURE__ */ new Map();
  for (const dep of deps) if (!byName.has(dep.name)) byName.set(dep.name, dep);
  return [...byName.values()];
}
function classifyDeps(required, installed) {
  const toInstall = [];
  const present = [];
  const warnings = [];
  for (const dep of required) {
    const current = installed[dep.name];
    if (current === void 0) {
      toInstall.push(dep);
      continue;
    }
    present.push(dep.name);
    const have = parseMajor(current);
    const need = parseMajor(dep.range);
    if (have !== null && need !== null && have < need) {
      warnings.push(
        `${dep.name} ${current} detectado; os templates foram escritos para ${dep.range}. Atualize manualmente.`
      );
    }
  }
  return { toInstall, present, warnings };
}
function buildInstallCommand(packageManager, specs) {
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
function depSpec(dep) {
  return `${dep.name}@${dep.range}`;
}
async function installPackages(packageManager, deps, cwd) {
  if (deps.length === 0) return;
  const { command, args } = buildInstallCommand(packageManager, deps.map(depSpec));
  try {
    await execa(command, args, { cwd, stdio: "inherit" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro desconhecido";
    throw new Error(`Falha ao instalar depend\xEAncias com ${packageManager}: ${message}`);
  }
}

// src/utils/rewriteImports.ts
import path2 from "path";
var SPECIFIER = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+|\brequire\s*\(\s*)(["'])@\/([^"'\n]+)\2/g;
function resolveAliasTarget(spec, map) {
  const rules = [
    ["styles/", map.styles],
    ["utils/", map.utils],
    ["hooks/", map.hooks],
    ["components/ui/", map.components]
  ];
  for (const [prefix, base] of rules) {
    if (spec.startsWith(prefix)) return path2.join(base, spec.slice(prefix.length));
  }
  return path2.join(map.root, spec);
}
function toRelativeSpecifier(fromFileAbs, targetAbs) {
  const rel = path2.relative(path2.dirname(fromFileAbs), targetAbs).split(path2.sep).join("/");
  return /^\.\.?(\/|$)/.test(rel) ? rel : `./${rel}`;
}
function rewriteAliasImports(content, fileAbs, map) {
  return content.replace(
    SPECIFIER,
    (_match, prefix, quote, spec) => `${prefix}${quote}${toRelativeSpecifier(fileAbs, resolveAliasTarget(spec, map))}${quote}`
  );
}

// src/installer.ts
function planInstall(info, requested) {
  const { ordered, addedByDependency } = resolveComponents(requested, info.framework);
  const required = dedupeDeps(ordered.flatMap((entry) => entry.dependencies ?? []));
  const { toInstall, present, warnings: depWarnings } = classifyDeps(required, info.deps);
  const warnings = [];
  if (!info.hasReact) warnings.push('"react" n\xE3o foi encontrado no package.json deste projeto.');
  if (!info.hasTypeScript)
    warnings.push("Projeto sem TypeScript: os templates s\xE3o arquivos .ts/.tsx.");
  for (const entry of ordered) {
    for (const warning of entry.warnings ?? []) {
      if (!warning.unlessFramework?.includes(info.framework))
        warnings.push(`${entry.label}: ${warning.message}`);
    }
  }
  const notes = [...new Set(ordered.flatMap((entry) => entry.notes ?? []))];
  const reactMajor = parseMajor(info.deps["react"] ?? "");
  if (reactMajor !== null && reactMajor < 18) {
    warnings.push("Os templates exigem React 18 ou superior (useSyncExternalStore).");
  }
  return {
    requested: [...new Set(requested)],
    entries: ordered,
    addedByDependency,
    toInstall,
    presentDeps: present,
    depWarnings,
    warnings,
    notes
  };
}
function shouldRewriteAlias(info, paths, mode) {
  if (mode === "relative") return true;
  if (mode === "keep") return false;
  return !(info.aliasMatchesSrc && paths.isDefault);
}
function buildAliasMap(cwd, paths) {
  return {
    root: path3.resolve(cwd, paths.srcRoot),
    components: path3.resolve(cwd, paths.components),
    styles: path3.resolve(cwd, paths.styles),
    utils: path3.resolve(cwd, paths.utils),
    hooks: path3.resolve(cwd, paths.hooks)
  };
}
async function executeInstall(plan, info, paths, options, templatesRoot) {
  const rewrite = shouldRewriteAlias(info, paths, options.alias);
  const aliasMap = buildAliasMap(info.cwd, paths);
  const files = emptyReport();
  for (const entry of plan.entries) {
    for (const mapping of entry.templates) {
      const sourceDir = path3.join(templatesRoot, mapping.dir);
      if (!await fs2.pathExists(sourceDir)) {
        throw new Error(`Template ausente para "${entry.id}": templates/${mapping.dir}`);
      }
      const report = await copyTemplateDir({
        sourceDir,
        targetDir: path3.resolve(info.cwd, paths[mapping.to], mapping.subdir ?? ""),
        cwd: info.cwd,
        force: options.force,
        dryRun: options.dryRun,
        exclude: mapping.exclude,
        transform: rewrite ? (content, destAbs) => rewriteAliasImports(content, destAbs, aliasMap) : void 0
      });
      mergeReports(files, report);
    }
  }
  let installedDeps = [];
  if (!options.dryRun && !options.noInstall && plan.toInstall.length > 0) {
    await installPackages(info.packageManager, plan.toInstall, info.cwd);
    installedDeps = plan.toInstall;
  }
  return { files, installedDeps, aliasRewritten: rewrite };
}

// src/prompts/selectComponents.ts
import prompts from "prompts";
async function selectComponents(entries, framework) {
  const choices = entries.filter((entry) => !entry.frameworks || entry.frameworks.includes(framework)).map((entry) => ({
    title: entry.label,
    value: entry.id,
    description: entry.description
  }));
  let cancelled = false;
  const answer = await prompts(
    {
      type: "multiselect",
      name: "ids",
      message: "Quais componentes deseja instalar?",
      hint: "espa\xE7o seleciona \xB7 enter confirma",
      instructions: false,
      min: 1,
      choices
    },
    {
      onCancel: () => {
        cancelled = true;
        return false;
      }
    }
  );
  return cancelled ? [] : answer.ids ?? [];
}
async function confirm(message, initial = true) {
  let cancelled = false;
  const answer = await prompts(
    { type: "confirm", name: "ok", message, initial },
    {
      onCancel: () => {
        cancelled = true;
        return false;
      }
    }
  );
  return !cancelled && Boolean(answer.ok);
}

// src/utils/detectProject.ts
import fs3 from "fs";
import path4 from "path";
function readJson(file) {
  try {
    return JSON.parse(fs3.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}
function stripJsonComments(text) {
  let out = "";
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charAt(i);
    const next = text.charAt(i + 1);
    if (inString) {
      out += ch;
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      out += ch;
      continue;
    }
    if (ch === "/" && next === "/") {
      while (i < text.length && text.charAt(i) !== "\n") i++;
      out += "\n";
      continue;
    }
    if (ch === "/" && next === "*") {
      i += 2;
      while (i < text.length && !(text.charAt(i) === "*" && text.charAt(i + 1) === "/")) i++;
      i++;
      continue;
    }
    out += ch;
  }
  return out.replace(/,(\s*[}\]])/g, "$1");
}
function detectFramework(deps) {
  if (deps["next"]) return "next";
  if (deps["@remix-run/react"] || deps["@react-router/dev"]) return "remix";
  if (deps["react-scripts"]) return "cra";
  if (deps["vite"]) return "vite";
  return "unknown";
}
function detectPackageManager(cwd, pkg = null, env = process.env) {
  const declared = /^(npm|pnpm|yarn|bun)@/.exec(pkg?.packageManager ?? "");
  if (declared) return declared[1];
  const has = (file) => fs3.existsSync(path4.join(cwd, file));
  if (has("pnpm-lock.yaml")) return "pnpm";
  if (has("yarn.lock")) return "yarn";
  if (has("bun.lockb") || has("bun.lock")) return "bun";
  if (has("package-lock.json")) return "npm";
  const agent = /^(npm|pnpm|yarn|bun)\//.exec(env.npm_config_user_agent ?? "");
  if (agent) return agent[1];
  return "npm";
}
function detectAlias(cwd, srcRoot) {
  for (const file of ["tsconfig.json", "jsconfig.json"]) {
    const abs = path4.join(cwd, file);
    if (!fs3.existsSync(abs)) continue;
    let json = null;
    try {
      json = JSON.parse(stripJsonComments(fs3.readFileSync(abs, "utf8")));
    } catch {
      json = null;
    }
    const options = json?.compilerOptions;
    const targets = options?.paths?.["@/*"];
    if (!Array.isArray(targets)) continue;
    const base = path4.resolve(cwd, options?.baseUrl ?? ".");
    const srcAbs = path4.resolve(cwd, srcRoot);
    return targets.some((target) => path4.resolve(base, target.replace(/\/\*$/, "")) === srcAbs);
  }
  return false;
}
function detectProject(cwd = process.cwd(), env = process.env) {
  const packageJsonPath = path4.join(cwd, "package.json");
  const pkg = readJson(packageJsonPath);
  const deps = { ...pkg?.dependencies ?? {}, ...pkg?.devDependencies ?? {} };
  const srcRoot = fs3.existsSync(path4.join(cwd, "src")) ? "src" : ".";
  return {
    cwd,
    hasPackageJson: pkg !== null,
    framework: detectFramework(deps),
    packageManager: detectPackageManager(cwd, pkg, env),
    hasReact: Boolean(deps["react"]),
    hasTypeScript: Boolean(deps["typescript"]) || fs3.existsSync(path4.join(cwd, "tsconfig.json")),
    srcRoot,
    aliasMatchesSrc: detectAlias(cwd, srcRoot),
    deps
  };
}

// src/utils/logger.ts
var colorEnabled = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;
var wrap = (code) => (text) => colorEnabled ? `\x1B[${code}m${text}\x1B[0m` : text;
var paint = {
  bold: wrap(1),
  dim: wrap(2),
  red: wrap(31),
  green: wrap(32),
  yellow: wrap(33),
  cyan: wrap(36)
};
var log = {
  info: (message) => console.log(message),
  step: (message) => console.log(`${paint.cyan("\u203A")} ${message}`),
  success: (message) => console.log(`${paint.green("\u2714")} ${message}`),
  warn: (message) => console.warn(`${paint.yellow("\u26A0")} ${message}`),
  error: (message) => console.error(`${paint.red("\u2716")} ${message}`),
  blank: () => console.log("")
};

// src/utils/ownPackage.ts
import fs4 from "fs";
import path5 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
function readOwnVersion(startDir = path5.dirname(fileURLToPath2(import.meta.url))) {
  let dir = startDir;
  for (; ; ) {
    const file = path5.join(dir, "package.json");
    if (fs4.existsSync(file)) {
      try {
        const pkg = JSON.parse(fs4.readFileSync(file, "utf8"));
        if (pkg.name === "masked-components-cli" && pkg.version) return pkg.version;
      } catch {
      }
    }
    const parent = path5.dirname(dir);
    if (parent === dir) return "desconhecida";
    dir = parent;
  }
}

// src/utils/projectPaths.ts
import fs5 from "fs";
import path6 from "path";
var CONFIG_FILE = "masked.config.json";
function loadConfig(cwd) {
  const file = path6.join(cwd, CONFIG_FILE);
  if (!fs5.existsSync(file)) return null;
  try {
    return JSON.parse(fs5.readFileSync(file, "utf8"));
  } catch {
    throw new Error(`${CONFIG_FILE} inv\xE1lido: n\xE3o \xE9 um JSON v\xE1lido.`);
  }
}
function normalizeRelative(cwd, value, key) {
  const posix = value.replace(/\\/g, "/").replace(/^\.\//, "").replace(/\/+$/, "");
  const abs = path6.resolve(cwd, posix);
  const rel = path6.relative(cwd, abs);
  if (path6.isAbsolute(value) || rel.startsWith("..") || path6.isAbsolute(rel)) {
    throw new Error(`${CONFIG_FILE}: paths.${key} precisa ficar dentro do projeto ("${value}").`);
  }
  return posix === "" ? "." : posix;
}
function resolveProjectPaths(info, config = null) {
  const src = info.srcRoot;
  const defaults = {
    components: path6.posix.join(src, "components/ui"),
    styles: path6.posix.join(src, "styles"),
    utils: path6.posix.join(src, "utils"),
    hooks: path6.posix.join(src, "hooks")
  };
  const overrides = config?.paths ?? {};
  const resolved = { ...defaults };
  let isDefault = true;
  for (const key of Object.keys(defaults)) {
    const value = overrides[key];
    if (typeof value === "string" && value.trim() !== "") {
      resolved[key] = normalizeRelative(info.cwd, value.trim(), key);
      if (resolved[key] !== defaults[key]) isDefault = false;
    }
  }
  return { srcRoot: src, ...resolved, isDefault };
}

// src/cli.ts
var PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun"];
var ALIAS_MODES = ["auto", "keep", "relative"];
var HELP = `  
${paint.bold("masked-components-cli")} \u2014 instala componentes React + TypeScript no seu projeto  
  
${paint.bold("Uso")}  
  npx masked-components-cli                       escolhe os componentes de forma interativa  
  npx masked-components-cli masked-buttons ...    instala componentes espec\xEDficos  
  npx masked-components-cli --all                 instala tudo  
  
${paint.bold("Op\xE7\xF5es")}  
  -l, --list           lista os componentes dispon\xEDveis  
  -y, --yes            n\xE3o pergunta nada (aceita o plano)  
  -f, --force          sobrescreve arquivos que j\xE1 existem e s\xE3o diferentes  
      --dry-run        mostra o que seria feito, sem escrever nada  
      --no-install     n\xE3o instala pacotes npm (s\xF3 copia os arquivos)  
      --pm <gerenciador>   npm | pnpm | yarn | bun (padr\xE3o: detectado pelo lockfile)  
      --alias <modo>   auto | keep | relative \u2014 como tratar imports "@/..." (padr\xE3o: auto)  
      --cwd <pasta>    roda em outra pasta (padr\xE3o: pasta atual)  
  -h, --help           mostra esta ajuda  
  -v, --version        mostra a vers\xE3o  
  
Arquivos existentes e diferentes nunca s\xE3o sobrescritos sem --force.  
Caminhos de destino podem ser ajustados em ${CONFIG_FILE}.  
`;
function printList() {
  log.info(paint.bold("Componentes dispon\xEDveis:"));
  for (const entry of registry) {
    const requires = entry.requires?.length ? paint.dim(`  (requer: ${entry.requires.join(", ")})`) : "";
    log.info(`  ${entry.id.padEnd(22)} ${entry.description}${requires}`);
  }
}
function printPlan(plan, info, paths) {
  const framework = info.framework === "unknown" ? "framework n\xE3o detectado" : info.framework;
  log.info(
    `${paint.bold("Projeto:")} ${framework} \xB7 ${info.packageManager} \xB7 ${info.hasTypeScript ? "TypeScript" : "sem TypeScript"}`
  );
  log.info(`${paint.bold("Componentes:")}`);
  for (const entry of plan.entries) {
    const extra = plan.addedByDependency.includes(entry.id) ? paint.dim(" (depend\xEAncia)") : "";
    log.info(`  \u2022 ${entry.id}${extra}`);
  }
  log.info(
    `${paint.bold("Destino:")} ${[paths.components, paths.styles, paths.utils, paths.hooks].join(", ")}`
  );
  log.info(
    `${paint.bold("Pacotes npm:")} ${plan.toInstall.length ? plan.toInstall.map(depSpec).join(", ") : "nada a instalar"}`
  );
  for (const warning of [...plan.warnings, ...plan.depWarnings]) log.warn(warning);
}
function printReport(report, plan, dryRun) {
  const { created, overwritten, unchanged, skipped } = report.files;
  const verb = dryRun ? "seriam criados" : "criados";
  log.blank();
  if (created.length) log.success(`${created.length} arquivo(s) ${verb}`);
  if (overwritten.length)
    log.success(
      `${overwritten.length} arquivo(s) ${dryRun ? "seriam sobrescritos" : "sobrescritos"}`
    );
  if (unchanged.length)
    log.info(`${paint.dim("\u2022")} ${unchanged.length} arquivo(s) j\xE1 estavam id\xEAnticos`);
  if (skipped.length) {
    log.warn(
      `${skipped.length} arquivo(s) j\xE1 existiam com conte\xFAdo diferente e foram mantidos (use --force para sobrescrever):`
    );
    for (const file of skipped) log.info(`    ${file}`);
  }
  if (report.aliasRewritten)
    log.info(`${paint.dim("\u2022")} imports "@/..." convertidos para caminhos relativos`);
  if (report.installedDeps.length)
    log.success(`pacotes instalados: ${report.installedDeps.map(depSpec).join(", ")}`);
  if (!dryRun && plan.notes.length) {
    log.blank();
    log.info(paint.bold("Pr\xF3ximos passos:"));
    for (const note of plan.notes) log.info(`  \u2022 ${note}`);
  }
}
async function main() {
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
        cwd: { type: "string" }
      }
    });
  } catch (error) {
    log.error(error instanceof Error ? error.message : String(error));
    log.info("Use --help para ver as op\xE7\xF5es.");
    return 1;
  }
  const { values } = parsed;
  const positionals = parsed.positionals.filter((item, index) => !(index === 0 && item === "add"));
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
  const alias = values.alias ?? "auto";
  if (!ALIAS_MODES.includes(alias)) {
    log.error(`--alias inv\xE1lido: "${values.alias}". Use: ${ALIAS_MODES.join(" | ")}.`);
    return 1;
  }
  if (values.pm !== void 0 && !PACKAGE_MANAGERS.includes(values.pm)) {
    log.error(`--pm inv\xE1lido: "${values.pm}". Use: ${PACKAGE_MANAGERS.join(" | ")}.`);
    return 1;
  }
  const cwd = path7.resolve(values.cwd ?? process.cwd());
  const info = detectProject(cwd);
  if (!info.hasPackageJson) {
    log.error(
      `package.json n\xE3o encontrado em ${cwd}. Rode a CLI na raiz do seu projeto (ou use --cwd).`
    );
    return 1;
  }
  if (values.pm) info.packageManager = values.pm;
  const paths = resolveProjectPaths(info, loadConfig(cwd));
  const dryRun = Boolean(values["dry-run"]);
  const interactive = Boolean(process.stdin.isTTY) && !values.yes;
  let ids = values.all ? registry.filter((entry) => !entry.frameworks || entry.frameworks.includes(info.framework)).map((entry) => entry.id) : positionals;
  if (ids.length === 0) {
    if (!process.stdin.isTTY) {
      log.error(
        "Nenhum componente informado. Passe os ids (ex.: masked-buttons), use --all ou rode em um terminal interativo."
      );
      return 1;
    }
    ids = await selectComponents(registry, info.framework);
    if (ids.length === 0) {
      log.info("Nenhum componente selecionado.");
      return 0;
    }
  }
  const plan = planInstall(info, ids);
  printPlan(plan, info, paths);
  if (interactive && !dryRun) {
    log.blank();
    if (!await confirm("Continuar com a instala\xE7\xE3o?")) {
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
      alias
    },
    findTemplatesRoot()
  );
  printReport(report, plan, dryRun);
  if (dryRun) log.info(`
${paint.dim("(--dry-run: nada foi escrito)")}`);
  else log.success("Pronto!");
  return 0;
}
main().then((code) => {
  process.exitCode = code;
}).catch((error) => {
  log.error(
    error instanceof RegistryError || error instanceof Error ? error.message : String(error)
  );
  process.exitCode = 1;
});
