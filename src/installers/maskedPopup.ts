import { getProjectPaths } from "@/utils/getProjectPaths.js";
import { installDeps } from "@/utils/installDeps.js";
import { copyTemplate } from "../utils/copyTemplate.js";

export async function installMaskedPopup() {
  const paths = getProjectPaths();

  console.log("📦 Instalando Masked Popup...");
  console.log("Framework detectado:", paths.framework);

  await installDeps([]);

  await copyTemplate({
    templateDir: "masked-popup",
    targetDir: paths.componentsDir,
  });
}
