import fs from "node:fs";
import path from "node:path";
import type { ProjectInfo } from "./detectProject";

/** Caminhos de destino, relativos à raiz do projeto, em formato posix. */
export interface ProjectPaths {
  srcRoot: string;
  components: string;
  styles: string;
  utils: string;
  hooks: string;
  /** true quando nenhum caminho foi customizado em masked.config.json */
  isDefault: boolean;
}

export interface MaskedConfig {
  paths?: Partial<Record<"components" | "styles" | "utils" | "hooks", string>>;
}

export const CONFIG_FILE = "masked.config.json";

export function loadConfig(cwd: string): MaskedConfig | null {
  const file = path.join(cwd, CONFIG_FILE);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as MaskedConfig;
  } catch {
    throw new Error(`${CONFIG_FILE} inválido: não é um JSON válido.`);
  }
}

function normalizeRelative(cwd: string, value: string, key: string): string {
  const posix = value.replace(/\\/g, "/").replace(/^\.\//, "").replace(/\/+$/, "");
  const abs = path.resolve(cwd, posix);
  const rel = path.relative(cwd, abs);
  if (path.isAbsolute(value) || rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`${CONFIG_FILE}: paths.${key} precisa ficar dentro do projeto ("${value}").`);
  }
  return posix === "" ? "." : posix;
}

export function resolveProjectPaths(info: ProjectInfo, config: MaskedConfig | null = null): ProjectPaths {
  const src = info.srcRoot;
  const defaults = {
    components: path.posix.join(src, "components/ui"),
    styles: path.posix.join(src, "styles"),
    utils: path.posix.join(src, "utils"),
    hooks: path.posix.join(src, "hooks"),
  };

  const overrides = config?.paths ?? {};
  const resolved = { ...defaults };
  let isDefault = true;

  for (const key of Object.keys(defaults) as Array<keyof typeof defaults>) {
    const value = overrides[key];
    if (typeof value === "string" && value.trim() !== "") {
      resolved[key] = normalizeRelative(info.cwd, value.trim(), key);
      if (resolved[key] !== defaults[key]) isDefault = false;
    }
  }

  return { srcRoot: src, ...resolved, isDefault };
}
