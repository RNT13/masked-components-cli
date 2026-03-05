import fs from "fs";
import { detectFramework } from "./detectFramework";

export function getProjectPaths() {
  const framework = detectFramework();

  const hasSrc = fs.existsSync("src");

  const base = hasSrc ? "src" : ".";

  return {
    framework,
    srcDir: base,
    componentsDir: `${base}/components/ui`,
    animationsDir: `${base}/styles/`,
    stylesDir: `${base}/styles`,
    utilsDir: `${base}/utils`,
    hooksDir: `${base}/hooks`,
  };
}
