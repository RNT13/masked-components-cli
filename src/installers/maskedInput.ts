import { copyTemplate } from "../utils/copyTemplate.js";
import { installDeps } from "../utils/installDeps.js";

export async function installMaskedInput() {
  console.log("📦 Instalando Masked Input...");

  await installDeps(["react-input-mask"]);

  await copyTemplate({
    templateDir: "masked-input",
    targetDir: "src/components/ui",
  });
}
