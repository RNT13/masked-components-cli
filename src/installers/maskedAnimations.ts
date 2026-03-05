import { getProjectPaths } from "@/utils/getProjectPaths.js";
import { injectAnimationProvider } from "@/utils/injectAnimationProvider.js";
import { installDeps } from "@/utils/installDeps.js";
import { copyTemplate } from "../utils/copyTemplate.js";

export async function installMaskedAnimations() {
  const paths = getProjectPaths();

  console.log("🚀 Instalando Masked Animations...");
  console.log("Framework detectado:", paths.framework);

  await installDeps(["styled-components"]);
  await injectAnimationProvider();

  await copyTemplate({
    templateDir: "masked-animations",
    targetDir: paths.stylesDir,
  });

  await copyTemplate({
    templateDir: "hooks",
    targetDir: paths.hooksDir,
  });
}
