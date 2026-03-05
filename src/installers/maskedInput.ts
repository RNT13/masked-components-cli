import { getProjectPaths } from "@/utils/getProjectPaths.js";
import { copyTemplate } from "../utils/copyTemplate.js";
import { installDeps } from "../utils/installDeps.js";

export async function installMaskedInput() {
  const paths = getProjectPaths();

  console.log("📦 Instalando Masked Input...");
  console.log("Framework detectado:", paths.framework);

  await installDeps([]);

  await copyTemplate({
    templateDir: "masked-input",
    targetDir: paths.componentsDir,
  });

  console.log("✅ Componentes instalados com sucesso!");
}
