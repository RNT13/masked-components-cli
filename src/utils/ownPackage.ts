import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Versão da própria CLI, lida do package.json empacotado. */
export function readOwnVersion(startDir: string = path.dirname(fileURLToPath(import.meta.url))): string {
  let dir = startDir;
  for (;;) {
    const file = path.join(dir, "package.json");
    if (fs.existsSync(file)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(file, "utf8")) as { name?: string; version?: string };
        if (pkg.name === "masked-components-cli" && pkg.version) return pkg.version;
      } catch {
        // package.json ilegível: segue subindo
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) return "desconhecida";
    dir = parent;
  }
}
