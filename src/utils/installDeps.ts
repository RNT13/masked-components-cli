import { execa } from "execa";

export async function installDeps(deps: string[]) {
  await execa("npm", ["install", ...deps], {
    stdio: "inherit",
  });
}
