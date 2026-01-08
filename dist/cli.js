#!/usr/bin/env node

// src/utils/installDeps.ts
import { execa } from "execa";
async function installDeps(deps) {
  await execa("npm", ["install", ...deps], {
    stdio: "inherit"
  });
}

// src/utils/copyTemplate.ts
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
async function copyTemplate({ templateDir, targetDir }) {
  const packageFile = fileURLToPath(import.meta.url);
  const packageDir = path.dirname(packageFile);
  let currentDir = packageDir;
  let source = null;
  while (currentDir !== path.dirname(currentDir)) {
    const possible = path.join(currentDir, "templates", templateDir);
    if (fs.existsSync(possible)) {
      source = possible;
      break;
    }
    currentDir = path.dirname(currentDir);
  }
  if (!source) {
    throw new Error(`Template n\xE3o encontrado: ${templateDir}`);
  }
  const target = path.resolve(process.cwd(), targetDir);
  await fs.ensureDir(target);
  await fs.copy(source, target, {
    overwrite: false,
    errorOnExist: false
  });
}

// src/installers/maskedButtons.ts
async function installMaskedButtons() {
  console.log("\u{1F4E6} Instalando Masked Buttons...");
  await installDeps(["react-input-mask"]);
  await copyTemplate({
    templateDir: "masked-buttons",
    targetDir: "src/components/ui"
  });
}

// src/installers/maskedCards.ts
async function installMaskedCards() {
  console.log("\u{1F4E6} Instalando Masked Cards...");
  await installDeps(["react-input-mask"]);
  await copyTemplate({
    templateDir: "masked-cards",
    targetDir: "src/components/ui"
  });
}

// src/installers/maskedInput.ts
async function installMaskedInput() {
  console.log("\u{1F4E6} Instalando Masked Input...");
  await installDeps(["react-input-mask"]);
  await copyTemplate({
    templateDir: "masked-input",
    targetDir: "src/components/ui"
  });
}

// src/prompts/selectComponents.ts
import prompts from "prompts";
async function selectComponents() {
  const response = await prompts({
    type: "multiselect",
    name: "components",
    message: "Quais componentes deseja instalar?",
    choices: [
      { title: "Masked Input", value: "masked-input" },
      { title: "Masked Cards", value: "masked-cards" },
      { title: "Masked Buttons", value: "masked-buttons" }
    ]
  });
  return response.components ?? [];
}

// src/cli.ts
async function main() {
  const components = await selectComponents();
  if (!components.length) {
    console.log("Nenhum componente selecionado.");
    return;
  }
  if (components.includes("masked-input")) {
    await installMaskedInput();
  }
  if (components.includes("masked-cards")) {
    await installMaskedCards();
  }
  if (components.includes("masked-buttons")) {
    await installMaskedButtons();
  }
  console.log("\u2705 Componentes instalados com sucesso!");
}
main();
