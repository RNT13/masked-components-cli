import { getProjectPaths } from "@/utils/getProjectPaths.js";
import { installDeps } from "@/utils/installDeps.js";
import { copyTemplate } from "../utils/copyTemplate.js";

export async function installMaskedSkeleton() {
  const paths = getProjectPaths();

  console.log("📦 Instalando Masked Skeleton...");
  console.log("Framework detectado:", paths.framework);

  await installDeps([]);

  await copyTemplate({
    templateDir: "masked-skeleton",
    targetDir: paths.componentsDir,
  });
}
