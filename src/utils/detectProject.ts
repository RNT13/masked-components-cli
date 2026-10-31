import fs from "node:fs";
import path from "node:path";
import type { Framework, PackageManager } from "../types";

export interface ProjectInfo {
  cwd: string;
  hasPackageJson: boolean;
  framework: Framework;
  packageManager: PackageManager;
  hasReact: boolean;
  hasTypeScript: boolean;
  /** "src" quando existe, senão "." */
  srcRoot: string;
  /** o tsconfig/jsconfig do projeto já aponta `@/*` para a raiz de código (srcRoot) */
  aliasMatchesSrc: boolean;
  /** dependencies + devDependencies do package.json */
  deps: Record<string, string>;
}

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  packageManager?: string;
}

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return null;
  }
}

/**
 * Remove comentários de linha e de bloco (fora de strings) e vírgulas finais:
 * o formato "JSON com comentários" que o tsconfig aceita.
 */
export function stripJsonComments(text: string): string {
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

export function detectFramework(deps: Record<string, string>): Framework {
  if (deps["next"]) return "next";
  if (deps["@remix-run/react"] || deps["@react-router/dev"]) return "remix";
  if (deps["react-scripts"]) return "cra";
  if (deps["vite"]) return "vite";
  return "unknown";
}

export function detectPackageManager(
  cwd: string,
  pkg: PackageJson | null = null,
  env: NodeJS.ProcessEnv = process.env,
): PackageManager {
  const declared = /^(npm|pnpm|yarn|bun)@/.exec(pkg?.packageManager ?? "");
  if (declared) return declared[1] as PackageManager;

  const has = (file: string) => fs.existsSync(path.join(cwd, file));
  if (has("pnpm-lock.yaml")) return "pnpm";
  if (has("yarn.lock")) return "yarn";
  if (has("bun.lockb") || has("bun.lock")) return "bun";
  if (has("package-lock.json")) return "npm";

  const agent = /^(npm|pnpm|yarn|bun)\//.exec(env.npm_config_user_agent ?? "");
  if (agent) return agent[1] as PackageManager;

  return "npm";
}

/** `@/*` aponta para a raiz de código escolhida (src ou .)? */
function detectAlias(cwd: string, srcRoot: string): boolean {
  for (const file of ["tsconfig.json", "jsconfig.json"]) {
    const abs = path.join(cwd, file);
    if (!fs.existsSync(abs)) continue;

    let json: { compilerOptions?: { baseUrl?: string; paths?: Record<string, string[]> } } | null = null;
    try {
      json = JSON.parse(stripJsonComments(fs.readFileSync(abs, "utf8")));
    } catch {
      json = null;
    }

    const options = json?.compilerOptions;
    const targets = options?.paths?.["@/*"];
    if (!Array.isArray(targets)) continue;

    const base = path.resolve(cwd, options?.baseUrl ?? ".");
    const srcAbs = path.resolve(cwd, srcRoot);
    return targets.some((target) => path.resolve(base, target.replace(/\/\*$/, "")) === srcAbs);
  }
  return false;
}

export function detectProject(cwd: string = process.cwd(), env: NodeJS.ProcessEnv = process.env): ProjectInfo {
  const packageJsonPath = path.join(cwd, "package.json");
  const pkg = readJson<PackageJson>(packageJsonPath);
  const deps = { ...(pkg?.dependencies ?? {}), ...(pkg?.devDependencies ?? {}) };
  const srcRoot = fs.existsSync(path.join(cwd, "src")) ? "src" : ".";

  return {
    cwd,
    hasPackageJson: pkg !== null,
    framework: detectFramework(deps),
    packageManager: detectPackageManager(cwd, pkg, env),
    hasReact: Boolean(deps["react"]),
    hasTypeScript: Boolean(deps["typescript"]) || fs.existsSync(path.join(cwd, "tsconfig.json")),
    srcRoot,
    aliasMatchesSrc: detectAlias(cwd, srcRoot),
    deps,
  };
}
