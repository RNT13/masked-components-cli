import { installDeps } from "@/utils/installDeps.js";
import { copyTemplate } from "../utils/copyTemplate.js";

export async function installMaskedButtons() {
  console.log("📦 Instalando Masked Buttons...");

  await installDeps(["react-input-mask"]);

  await copyTemplate({
    templateDir: "masked-buttons",
    targetDir: "src/components/ui",
  });
}
