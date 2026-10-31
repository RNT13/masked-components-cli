import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveAliasTarget, rewriteAliasImports, toRelativeSpecifier, type AliasMap } from "../../utils/rewriteImports";

const root = path.resolve("/proj");
const map: AliasMap = {
  root: path.join(root, "src"),
  components: path.join(root, "src/components/ui"),
  styles: path.join(root, "src/styles"),
  utils: path.join(root, "src/utils"),
  hooks: path.join(root, "src/hooks"),
};

describe("rewriteAliasImports", () => {
  const file = path.join(map.components, "MaskedButton/Base/BaseButton.styles.ts");

  it("converte imports @/ em relativos a partir do arquivo", () => {
    const input = `import { transitions } from '@/styles/MaskedAnimations/animations/transitions'\nimport styled from "styled-components"`;
    const output = rewriteAliasImports(input, file, map);
    expect(output).toContain("from '../../../../styles/MaskedAnimations/animations/transitions'");
    expect(output).toContain('from "styled-components"');
  });

  it("cobre export-from, import dinâmico e import de efeito colateral", () => {
    const input = [
      `export * from '@/utils/masked-utils'`,
      `const m = await import("@/hooks/useInView")`,
      `import '@/styles/global.css'`,
    ].join("\n");
    const output = rewriteAliasImports(input, file, map);
    expect(output).toContain("from '../../../../utils/masked-utils'");
    expect(output).toContain('import("../../../../hooks/useInView")');
    expect(output).toContain("import '../../../../styles/global.css'");
  });

  it("respeita caminhos customizados de cada raiz", () => {
    const custom: AliasMap = { ...map, styles: path.join(root, "lib/theme") };
    expect(resolveAliasTarget("styles/MaskedThemes/MaskedThemes", custom)).toBe(
      path.join(root, "lib/theme/MaskedThemes/MaskedThemes"),
    );
    expect(resolveAliasTarget("outra/coisa", custom)).toBe(path.join(root, "src/outra/coisa"));
  });

  it("gera './' quando o alvo está na mesma pasta", () => {
    expect(toRelativeSpecifier(path.join(root, "src/a/x.ts"), path.join(root, "src/a/y"))).toBe("./y");
    expect(toRelativeSpecifier(path.join(root, "src/a/x.ts"), path.join(root, "src/b/y"))).toBe("../b/y");
  });

  it("não mexe em imports sem alias", () => {
    const input = `import a from './a'\nimport b from '../b'\nimport c from 'react'`;
    expect(rewriteAliasImports(input, file, map)).toBe(input);
  });
});
