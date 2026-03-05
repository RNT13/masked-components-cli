import { getProjectPaths } from "@/utils/getProjectPaths.js";
import { copyTemplate } from "../utils/copyTemplate.js";
import { installDeps } from "../utils/installDeps.js";

export async function installMaskedThemes() {
  const paths = getProjectPaths();

  console.log("📦 Instalando Masked Themes...");
  console.log("Framework detectado:", paths.framework);

  await installDeps([]);

  await copyTemplate({
    templateDir: "masked-themes",
    targetDir: paths.stylesDir,
  });

  await copyTemplate({
    templateDir: "color-utils",
    targetDir: paths.utilsDir,
  });
}
