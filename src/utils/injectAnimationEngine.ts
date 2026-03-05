import fs from "fs-extra";
import { findNextLayout } from "./findNextLayout.js";

export async function injectAnimationEngine() {
  const layoutPath = findNextLayout();

  if (!layoutPath) {
    console.log("⚠️ layout.tsx do Next não encontrado.");
    return;
  }

  let content = await fs.readFile(layoutPath, "utf-8");

  if (content.includes("useAnimationEngine")) {
    console.log("✔ useAnimationEngine já instalado.");
    return;
  }

  // adiciona import
  content =
    `import { useAnimationEngine } from "@/animations/useAnimationEngine";\n` +
    content;

  // injeta hook dentro da função
  content = content.replace(
    /export default function [^{]+{/,
    (match) => `${match}\n  useAnimationEngine();\n`,
  );

  await fs.writeFile(layoutPath, content);

  console.log("✨ useAnimationEngine adicionado ao layout.");
}
