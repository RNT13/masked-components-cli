import fs from "fs-extra";
import { findProviders } from "./findNextProviders";

const ANIMATION_PROVIDER_IMPORT =
  "import { AnimationProvider } from '@/styles/MaskedAnimations/AnimationProvider';";

function insertImport(content: string): string {
  if (content.includes(ANIMATION_PROVIDER_IMPORT)) {
    return content;
  }

  const useClientMatch = content.match(/^(["'])use client\1;?\s*\n?/);

  if (useClientMatch) {
    return content.replace(
      useClientMatch[0],
      `${useClientMatch[0]}${ANIMATION_PROVIDER_IMPORT}\n`,
    );
  }

  const importBlockMatch = content.match(/^(?:import[^\n]*\n)+/m);

  if (importBlockMatch && importBlockMatch.index === 0) {
    return content.replace(
      importBlockMatch[0],
      `${importBlockMatch[0]}${ANIMATION_PROVIDER_IMPORT}\n`,
    );
  }

  return `${ANIMATION_PROVIDER_IMPORT}\n${content}`;
}

function wrapChildren(content: string): string {
  if (content.includes("<AnimationProvider>")) {
    return content;
  }

  const childrenRegex = /(^|\n)([ \t]*)\{\s*children\s*\}/;

  const match = content.match(childrenRegex);

  if (!match) {
    throw new Error(
      "Não foi possível encontrar '{children}' para envolver com AnimationProvider.",
    );
  }

  const prefix = match[1] ?? "";
  const indent = match[2] ?? "";

  const replacement = `${prefix}${indent}<AnimationProvider>\n${indent}  {children}\n${indent}</AnimationProvider>`;

  return content.replace(childrenRegex, replacement);
}

export async function injectAnimationProvider(): Promise<void> {
  try {
    const providersPath = findProviders();

    if (!providersPath) {
      console.log("⚠️ Providers não encontrado.");
      return;
    }

    const exists = await fs.pathExists(providersPath);

    if (!exists) {
      throw new Error(
        `Arquivo de providers não encontrado em: ${providersPath}`,
      );
    }

    let content = await fs.readFile(providersPath, "utf-8");

    if (content.includes("AnimationProvider")) {
      console.log("✔ AnimationProvider já instalado.");
      return;
    }

    content = insertImport(content);
    content = wrapChildren(content);

    await fs.writeFile(providersPath, content, "utf-8");

    console.log("✨ AnimationProvider instalado com sucesso.");
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao injetar AnimationProvider.";

    console.error(`Erro ao injetar AnimationProvider: ${message}`);
    throw error;
  }
}
