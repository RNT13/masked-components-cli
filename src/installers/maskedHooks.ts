import { getProjectPaths } from "@/utils/getProjectPaths.js";  
import { copyTemplate } from "../utils/copyTemplate.js";  
import { installDeps } from "../utils/installDeps.js";  
  
export async function installMaskedHooks() {  
  const paths = getProjectPaths();  
  
  console.log("🪝 Instalando Masked Hooks...");  
  console.log("Framework detectado:", paths.framework);  
  
  // Hooks base usam apenas react.  
  await installDeps([]);  
  
  // 1) Hooks stateful: useDebounce, useMediaQuery, useLocalStorage,  
  //    useScrollToTop, useSmartSearch.  
  await copyTemplate({  
    templateDir: "masked-hooks",  
    targetDir: paths.hooksDir,  
  });  
  
  // 2) useInView compartilhado (fonte única). overwrite:false evita  
  //    conflito se masked-animations já o instalou.  
  await copyTemplate({  
    templateDir: "hooks",  
    targetDir: paths.hooksDir,  
  });  
  
  // 3) masked-utils: useSmartSearch depende de normalizeText (stringUtils).  
  await copyTemplate({  
    templateDir: "masked-utils",  
    targetDir: paths.utilsDir,  
  });  
}