import { getProjectPaths } from "@/utils/getProjectPaths.js";
import { installDeps } from "@/utils/installDeps.js";
import { copyTemplate } from "../utils/copyTemplate.js";

export async function installMaskedCards() {
  const paths = getProjectPaths();

  console.log("📦 Instalando Masked Cards...");
  console.log("Framework detectado:", paths.framework);

  await installDeps([]);

  await copyTemplate({
    templateDir: "masked-cards",
    targetDir: paths.componentsDir,
  });

  console.log("✅ Componentes instalados com sucesso!");
}
