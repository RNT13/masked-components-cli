import { execa } from "execa";

export type InstallDepsOptions = {
  cwd?: string;
  packageManager?: "npm" | "pnpm" | "yarn";
  dev?: boolean;
};

function normalizeDependencies(deps: string[]): string[] {
  return [...new Set(deps.map((dep) => dep.trim()).filter(Boolean))];
}

function buildInstallArgs(
  packageManager: "npm" | "pnpm" | "yarn",
  deps: string[],
  dev: boolean,
): string[] {
  const devFlag = dev ? ["-D"] : [];

  switch (packageManager) {
    case "npm":
      return ["install", ...devFlag, ...deps];

    case "pnpm":
      return ["add", ...devFlag, ...deps];

    case "yarn":
      return ["add", ...devFlag, ...deps];

    default:
      return ["install", ...devFlag, ...deps];
  }
}

export async function installDeps(
  deps: string[],
  options: InstallDepsOptions = {},
): Promise<void> {
  const normalizedDeps = normalizeDependencies(deps);

  if (normalizedDeps.length === 0) {
    throw new Error("Nenhuma dependência foi informada para instalação.");
  }

  const packageManager = options.packageManager ?? "npm";
  const args = buildInstallArgs(
    packageManager,
    normalizedDeps,
    options.dev ?? false,
  );

  try {
    await execa(packageManager, args, {
      cwd: options.cwd,
      stdio: "inherit",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao instalar dependências.";

    throw new Error(
      `Falha ao instalar dependências com ${packageManager}: ${message}`,
    );
  }
}
