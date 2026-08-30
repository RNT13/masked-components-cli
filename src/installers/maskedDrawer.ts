import { getProjectPaths } from "@/utils/getProjectPaths.js";
import { installDeps } from "@/utils/installDeps.js";
import { copyTemplate } from "../utils/copyTemplate.js";

export async function installMaskedDrawer() {
  const paths = getProjectPaths();

  console.log("📦 Instalando Masked Drawer...");
  console.log("Framework detectado:", paths.framework);

  await installDeps([]);

  await copyTemplate({
    templateDir: "masked-drawer",
    targetDir: paths.componentsDir,
  });
}
