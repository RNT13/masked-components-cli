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

  // adiciona import
  content =
    `import { AnimationProvider } from "@/providers/AnimationProvider"\n` +
    content;

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
