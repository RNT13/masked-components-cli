import fs from "fs";
import path from "path";

export type Framework = "next" | "vite" | "cra" | "unknown";

export function detectFramework(): Framework {
  const packagePath = path.join(process.cwd(), "package.json");

  if (!fs.existsSync(packagePath)) {
    return "unknown";
  }

  const pkg = JSON.parse(fs.readFileSync(packagePath, "utf-8"));

  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  if (deps["next"]) {
    return "next";
  }

  if (deps["vite"]) {
    return "vite";
  }

  if (deps["react-scripts"]) {
    return "cra";
  }

  return "unknown";
}
