export type Framework = "next" | "remix" | "vite" | "cra" | "unknown";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

/** Raízes de destino no projeto do usuário. */
export type PathRoot = "components" | "styles" | "utils" | "hooks";

/**
 * Como tratar imports com alias `@/...` nos arquivos copiados:
 * - auto:     mantém `@/` só se o tsconfig/jsconfig do projeto já aponta `@/*` para a raiz certa; senão converte para relativo
 * - keep:     nunca altera
 * - relative: sempre converte para caminho relativo
 */
export type AliasMode = "auto" | "keep" | "relative";

export interface NpmDep {
  name: string;
  range: string;
}
