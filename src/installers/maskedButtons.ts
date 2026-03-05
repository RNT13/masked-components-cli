import { getProjectPaths } from "@/utils/getProjectPaths.js";
import { installDeps } from "@/utils/installDeps.js";
import { copyTemplate } from "../utils/copyTemplate.js";

export async function installMaskedButtons() {
  const paths = getProjectPaths();

  console.log("📦 Instalando Masked Buttons...");
  console.log("Framework detectado:", paths.framework);

  await installDeps([]);

  await copyTemplate({
    templateDir: "masked-buttons",
    targetDir: paths.componentsDir,
  });
}
