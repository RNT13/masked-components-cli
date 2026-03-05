#!/usr/bin/env node

// src/utils/getProjectPaths.ts
import fs2 from "fs";

// src/utils/detectFramework.ts
import fs from "fs";
import path from "path";
function detectFramework() {
  const packagePath = path.join(process.cwd(), "package.json");
  if (!fs.existsSync(packagePath)) {
    return "unknown";
  }
  const pkg = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies
  };
  if (deps["next"]) {
    return "next";
  }
  if (deps["vite"]) {
    return "vite";
  }
  if (deps["react-scripts"]) {
    return "cra";
  }
  return "unknown";
}

// src/utils/getProjectPaths.ts
function getProjectPaths() {
  const framework = detectFramework();
  const hasSrc = fs2.existsSync("src");
  const base = hasSrc ? "src" : ".";
  return {
    framework,
    srcDir: base,
    componentsDir: `${base}/components/ui`,
    animationsDir: `${base}/styles/`,
    stylesDir: `${base}/styles`,
    utilsDir: `${base}/utils`,
    hooksDir: `${base}/hooks`
  };
}

// src/utils/injectAnimationProvider.ts
import fs4 from "fs-extra";

// src/utils/findNextProviders.ts
import fs3 from "fs";
function findProviders() {
  const possiblePaths = [
    "src/components/providers.tsx",
    "components/providers.tsx",
    "src/providers.tsx"
  ];
  for (const p of possiblePaths) {
    if (fs3.existsSync(p)) {
      return p;
    }
  }
  return null;
}

// src/utils/injectAnimationProvider.ts
async function injectAnimationProvider() {
  const providersPath = findProviders();
  if (!providersPath) {
    console.log("\u26A0\uFE0F Providers n\xE3o encontrado.");
    return;
  }
  let content = await fs4.readFile(providersPath, "utf-8");
  if (content.includes("AnimationProvider")) {
    console.log("\u2714 AnimationProvider j\xE1 instalado.");
    return;
  }
  const importLine = `import { AnimationProvider } from '@/styles/MaskedAnimations/AnimationProvider';
`;
  if (content.includes("'use client'") || content.includes('"use client"')) {
    content = content.replace(
      /['"]use client['"]\s*/,
      (match) => `${match}
${importLine}`
    );
  } else {
    content = importLine + content;
  }
  content = content.replace(
    /\{children\}/,
    `<AnimationProvider>
      {children}
    </AnimationProvider>`
  );
  await fs4.writeFile(providersPath, content);
  console.log("\u2728 AnimationProvider instalado com sucesso.");
}

// src/utils/installDeps.ts
import { execa } from "execa";
async function installDeps(deps) {
  await execa("npm", ["install", ...deps], {
    stdio: "inherit"
  });
}

// src/utils/copyTemplate.ts
import fs5 from "fs-extra";
import path2 from "path";
import { fileURLToPath } from "url";
async function copyTemplate({ templateDir, targetDir }) {
  const packageFile = fileURLToPath(import.meta.url);
  const packageDir = path2.dirname(packageFile);
  let currentDir = packageDir;
  let source = null;
  while (currentDir !== path2.dirname(currentDir)) {
    const possible = path2.join(currentDir, "templates", templateDir);
    if (fs5.existsSync(possible)) {
      source = possible;
      break;
    }
    currentDir = path2.dirname(currentDir);
  }
  if (!source) {
    throw new Error(`Template n\xE3o encontrado: ${templateDir}`);
  }
  const target = path2.resolve(process.cwd(), targetDir);
  await fs5.ensureDir(target);
  await fs5.copy(source, target, {
    overwrite: false,
    errorOnExist: false
  });
}

// src/installers/maskedAnimations.ts
async function installMaskedAnimations() {
  const paths = getProjectPaths();
  console.log("\u{1F680} Instalando Masked Animations...");
  console.log("Framework detectado:", paths.framework);
  await installDeps(["styled-components"]);
  await injectAnimationProvider();
  await copyTemplate({
    templateDir: "masked-animations",
    targetDir: paths.stylesDir
  });
  await copyTemplate({
    templateDir: "hooks",
    targetDir: paths.hooksDir
  });
}

// src/installers/maskedButtons.ts
async function installMaskedButtons() {
  const paths = getProjectPaths();
  console.log("\u{1F4E6} Instalando Masked Buttons...");
  console.log("Framework detectado:", paths.framework);
  await installDeps([]);
  await copyTemplate({
    templateDir: "masked-buttons",
    targetDir: paths.componentsDir
  });
}

// src/installers/maskedCards.ts
async function installMaskedCards() {
  const paths = getProjectPaths();
  console.log("\u{1F4E6} Instalando Masked Cards...");
  console.log("Framework detectado:", paths.framework);
  await installDeps([]);
  await copyTemplate({
    templateDir: "masked-cards",
    targetDir: paths.componentsDir
  });
}

// src/installers/maskedInput.ts
async function installMaskedInput() {
  const paths = getProjectPaths();
  console.log("\u{1F4E6} Instalando Masked Input...");
  console.log("Framework detectado:", paths.framework);
  await installDeps([]);
  await copyTemplate({
    templateDir: "masked-input",
    targetDir: paths.componentsDir
  });
}

// src/installers/maskedThemes.ts
async function installMaskedThemes() {
  const paths = getProjectPaths();
  console.log("\u{1F4E6} Instalando Masked Themes...");
  console.log("Framework detectado:", paths.framework);
  await installDeps([]);
  await copyTemplate({
    templateDir: "masked-themes",
    targetDir: paths.stylesDir
  });
  await copyTemplate({
    templateDir: "color-utils",
    targetDir: paths.utilsDir
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
      { title: "Masked Buttons", value: "masked-buttons" },
      { title: "Masked Animations", value: "masked-animations" },
      { title: "Masked Themes", value: "masked-themes" }
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
  if (components.includes("masked-animations")) {
    await installMaskedAnimations();
  }
  if (components.includes("masked-themes")) {
    await installMaskedThemes();
  }
  console.log("\u2705 Componentes instalados com sucesso!");
}
main();
