import fs from "fs-extra";
import { findProviders } from "./findNextProviders";

export async function injectAnimationProvider() {
  const providersPath = findProviders();

  if (!providersPath) {
    console.log("⚠️ Providers não encontrado.");
    return;
  }

  let content = await fs.readFile(providersPath, "utf-8");

  if (content.includes("AnimationProvider")) {
    console.log("✔ AnimationProvider já instalado.");
    return;
  }

  const importLine = `import { AnimationProvider } from "@/MaskedAnimations/AnimationProvider";\n`;

  // verifica se tem 'use client'
  if (content.includes("'use client'") || content.includes('"use client"')) {
    content = content.replace(
      /['"]use client['"]\s*/,
      (match) => `${match}\n${importLine}`,
    );
  } else {
    // se não tiver, adiciona no topo
    content = importLine + content;
  }

  // envolve children
  content = content.replace(
    /\{children\}/,
    `<AnimationProvider>
      {children}
    </AnimationProvider>`,
  );

  await fs.writeFile(providersPath, content);

  console.log("✨ AnimationProvider instalado com sucesso.");
}
