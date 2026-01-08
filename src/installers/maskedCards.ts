import { installDeps } from "@/utils/installDeps.js";
import { copyTemplate } from "../utils/copyTemplate.js";

export async function installMaskedCards() {
  console.log("📦 Instalando Masked Cards...");

  await installDeps(["react-input-mask"]);

  await copyTemplate({
    templateDir: "masked-cards",
    targetDir: "src/components/ui",
  });
}
