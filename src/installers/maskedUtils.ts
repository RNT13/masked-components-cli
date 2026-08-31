import { getProjectPaths } from "@/utils/getProjectPaths.js";  
import { copyTemplate } from "../utils/copyTemplate.js";  
import { installDeps } from "../utils/installDeps.js";  
  
export async function installMaskedUtils() {  
  const paths = getProjectPaths();  
  
  console.log("🧰 Instalando Masked Utils...");  
  console.log("Framework detectado:", paths.framework);  
  
  // Funções puras: nenhuma dependência externa.  
  await installDeps([]);  
  
  await copyTemplate({  
    templateDir: "masked-utils",  
    targetDir: paths.utilsDir,  
  });  
}