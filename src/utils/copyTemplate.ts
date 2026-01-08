import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

type Options = {
  templateDir: string;
  targetDir: string;
};

export async function copyTemplate({ templateDir, targetDir }: Options) {
  // caminho real do arquivo do pacote (node_modules ou cache do npx)
  const packageFile = fileURLToPath(import.meta.url);

  // pasta onde o arquivo do pacote vive
  const packageDir = path.dirname(packageFile);

  /**
   * Em bundle do tsup, TODOS os arquivos viram um só.
   * Então precisamos subir ATÉ encontrar a pasta "templates".
   */
  let currentDir = packageDir;
  let source: string | null = null;

  while (currentDir !== path.dirname(currentDir)) {
    const possible = path.join(currentDir, "templates", templateDir);
    if (fs.existsSync(possible)) {
      source = possible;
      break;
    }
    currentDir = path.dirname(currentDir);
  }

  if (!source) {
    throw new Error(`Template não encontrado: ${templateDir}`);
  }

  const target = path.resolve(process.cwd(), targetDir);

  await fs.ensureDir(target);

  await fs.copy(source, target, {
    overwrite: false,
    errorOnExist: false,
  });
}
