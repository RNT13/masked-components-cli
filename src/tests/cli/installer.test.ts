import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { executeInstall, planInstall } from "../../installer";
import { detectProject } from "../../utils/detectProject";
import { resolveProjectPaths } from "../../utils/projectPaths";

const dirs: string[] = [];
function tmp(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mcli-install-"));
  dirs.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of dirs.splice(0))
    fs.rmSync(dir, { recursive: true, force: true });
});

/** Templates mínimos, com a mesma estrutura de dependência dos reais. */
function makeTemplates(root: string): string {
  const t = path.join(root, "templates");
  fs.outputFileSync(
    path.join(t, "masked-themes/MaskedThemes/MaskedThemes.ts"),
    "import { c } from '@/utils/colorUtils'\nexport const maskedTheme = c\n",
  );
  fs.outputFileSync(
    path.join(t, "color-utils/colorUtils.ts"),
    "export const c = 1\n",
  );
  fs.outputFileSync(
    path.join(
      t,
      "masked-animations/MaskedAnimations/animations/transitions.ts",
    ),
    "export const transitions = {}\n",
  );
  fs.outputFileSync(
    path.join(t, "hooks/useInView.ts"),
    "export const useInView = 1\n",
  );
  fs.outputFileSync(
    path.join(t, "hooks/useAnimationEngine.ts"),
    "import '../animations/nao-existe'\n",
  );
  fs.outputFileSync(
    path.join(t, "masked-buttons/MaskedButton/Base/BaseButton.styles.ts"),
    "import { transitions } from '@/styles/MaskedAnimations/animations/transitions'\nimport { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'\nexport const x = [transitions, maskedTheme]\n",
  );
  fs.outputFileSync(
    path.join(t, "masked-utils/index.ts"),
    "export * from './date'\n",
  );
  fs.outputFileSync(
    path.join(t, "masked-utils/date.ts"),
    "export const d = 1\n",
  );
  return t;
}

function makeProject(
  root: string,
  opts: { alias: boolean; deps?: Record<string, string> },
): string {
  const project = path.join(root, "project");
  fs.outputFileSync(
    path.join(project, "package.json"),
    JSON.stringify({
      dependencies: { next: "15", react: "19", ...(opts.deps ?? {}) },
      devDependencies: { typescript: "5" },
    }),
  );
  fs.outputFileSync(
    path.join(project, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: opts.alias ? { paths: { "@/*": ["./src/*"] } } : {},
    }),
  );
  fs.ensureDirSync(path.join(project, "src"));
  return project;
}

const base = {
  force: false,
  dryRun: false,
  noInstall: true,
  alias: "auto" as const,
};

describe("instalação ponta a ponta", () => {
  it("instala botões com dependências internas e converte alias para relativo (projeto sem alias)", async () => {
    const root = tmp();
    const templates = makeTemplates(root);
    const project = makeProject(root, { alias: false });
    const info = detectProject(project, {});
    const paths = resolveProjectPaths(info);

    const plan = planInstall(info, ["masked-buttons"]);
    expect(plan.entries.map((entry) => entry.id)).toEqual([
      "masked-animations",
      "masked-themes",
      "masked-buttons",
    ]);
    expect(plan.toInstall.map((dep) => dep.name)).toEqual([
      "styled-components",
      "react-icons",
    ]);

    const report = await executeInstall(plan, info, paths, base, templates);
    expect(report.aliasRewritten).toBe(true);
    expect(report.files.created.length).toBeGreaterThan(0);

    const styles = fs.readFileSync(
      path.join(
        project,
        "src/components/ui/MaskedButton/Base/BaseButton.styles.ts",
      ),
      "utf8",
    );
    expect(styles).toContain(
      "from '../../../../styles/MaskedAnimations/animations/transitions'",
    );
    expect(styles).toContain(
      "from '../../../../styles/MaskedThemes/MaskedThemes'",
    );
    expect(styles).not.toContain("@/");

    // dependência de tema também ficou relativa e aponta para o arquivo que existe
    const themes = fs.readFileSync(
      path.join(project, "src/styles/MaskedThemes/MaskedThemes.ts"),
      "utf8",
    );
    expect(themes).toContain("from '../../utils/colorUtils'");
    expect(fs.existsSync(path.join(project, "src/utils/colorUtils.ts"))).toBe(
      true,
    );

    // arquivo morto excluído pelo registro
    expect(
      fs.existsSync(path.join(project, "src/hooks/useAnimationEngine.ts")),
    ).toBe(false);
    expect(fs.existsSync(path.join(project, "src/hooks/useInView.ts"))).toBe(
      true,
    );
  });

  it("mantém o alias quando o tsconfig já mapeia @/* → src", async () => {
    const root = tmp();
    const templates = makeTemplates(root);
    const project = makeProject(root, { alias: true });
    const info = detectProject(project, {});
    const report = await executeInstall(
      planInstall(info, ["masked-buttons"]),
      info,
      resolveProjectPaths(info),
      base,
      templates,
    );

    expect(report.aliasRewritten).toBe(false);
    const styles = fs.readFileSync(
      path.join(
        project,
        "src/components/ui/MaskedButton/Base/BaseButton.styles.ts",
      ),
      "utf8",
    );
    expect(styles).toContain("'@/styles/MaskedThemes/MaskedThemes'");
  });

  it("utils vão para uma subpasta própria (sem colidir com index.ts do usuário)", async () => {
    const root = tmp();
    const templates = makeTemplates(root);
    const project = makeProject(root, { alias: false });
    fs.outputFileSync(
      path.join(project, "src/styles/MaskedThemes/MaskedThemes.ts"),
      "import { c } from '@/utils/masked-utils/color'\nexport const maskedTheme = c\n",
    );
    fs.outputFileSync(
      path.join(project, "src/utils/masked-utils/color.ts"),
      "export const c = 1\n",
    );
    fs.outputFileSync(
      path.join(project, "src/utils/masked-utils/index.ts"),
      "export * from './color'\nexport * from './date'\n",
    );
    const info = detectProject(project, {});
    await executeInstall(
      planInstall(info, ["masked-utils"]),
      info,
      resolveProjectPaths(info),
      base,
      templates,
    );

    expect(
      fs.readFileSync(path.join(project, "src/utils/index.ts"), "utf8"),
    ).toBe("export const meu = 1\n");
    expect(
      fs.existsSync(path.join(project, "src/utils/masked-utils/index.ts")),
    ).toBe(true);
  });

  it("é idempotente e não sobrescreve edição do usuário sem --force", async () => {
    const root = tmp();
    const templates = makeTemplates(root);
    const project = makeProject(root, { alias: false });
    const info = detectProject(project, {});
    const paths = resolveProjectPaths(info);
    const plan = planInstall(info, ["masked-utils"]);

    await executeInstall(plan, info, paths, base, templates);
    const second = await executeInstall(plan, info, paths, base, templates);
    expect(second.files.created).toHaveLength(0);
    expect(second.files.unchanged).toHaveLength(2);

    const file = path.join(project, "src/utils/masked-utils/date.ts");
    fs.writeFileSync(file, "export const d = 'meu'\n");
    const third = await executeInstall(plan, info, paths, base, templates);
    expect(third.files.skipped).toEqual(["src/utils/masked-utils/date.ts"]);
    expect(fs.readFileSync(file, "utf8")).toContain("meu");

    const forced = await executeInstall(
      plan,
      info,
      paths,
      { ...base, force: true },
      templates,
    );
    expect(forced.files.overwritten).toEqual([
      "src/utils/masked-utils/date.ts",
    ]);
  });

  it("dry-run não escreve nada", async () => {
    const root = tmp();
    const templates = makeTemplates(root);
    const project = makeProject(root, { alias: false });
    const info = detectProject(project, {});
    const report = await executeInstall(
      planInstall(info, ["masked-utils"]),
      info,
      resolveProjectPaths(info),
      { ...base, dryRun: true },
      templates,
    );
    expect(report.files.created.length).toBeGreaterThan(0);
    expect(fs.existsSync(path.join(project, "src/utils/masked-utils"))).toBe(
      false,
    );
  });

  it("avisa quando o projeto não é React/TS/Next e quando styled-components é antigo", () => {
    const root = tmp();
    const project = path.join(root, "p");
    fs.outputFileSync(
      path.join(project, "package.json"),
      JSON.stringify({
        dependencies: { vue: "3", "styled-components": "^5.3.0" },
      }),
    );
    const info = detectProject(project, {});
    const plan = planInstall(info, ["masked-input"]);

    expect(plan.warnings.join("\n")).toMatch(/react/);
    expect(plan.warnings.join("\n")).toMatch(/TypeScript/);
    expect(plan.warnings.join("\n")).toMatch(/next\/image/);
    expect(plan.depWarnings.join("\n")).toMatch(/styled-components \^5\.3\.0/);
    expect(plan.toInstall.map((dep) => dep.name)).not.toContain(
      "styled-components",
    );
  });

  it("falha com mensagem clara se um template do registro não existir", async () => {
    const root = tmp();
    const templates = path.join(root, "templates");
    fs.ensureDirSync(templates);
    const project = makeProject(root, { alias: false });
    const info = detectProject(project, {});
    await expect(
      executeInstall(
        planInstall(info, ["masked-popup"]),
        info,
        resolveProjectPaths(info),
        base,
        templates,
      ),
    ).rejects.toThrow(/templates\/masked-popup/);
  });
});
