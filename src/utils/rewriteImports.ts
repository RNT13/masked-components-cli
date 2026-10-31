import path from "node:path";

/** Caminhos ABSOLUTOS de cada raiz de destino. */
export interface AliasMap {
  /** raiz que o alias `@/` representa (srcRoot) */
  root: string;
  components: string;
  styles: string;
  utils: string;
  hooks: string;
}

// from '@/x' | import('@/x') | import '@/x' | require('@/x')
const SPECIFIER = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+|\brequire\s*\(\s*)(["'])@\/([^"'\n]+)\2/g;

/** Onde cada prefixo conhecido do alias cai no projeto (respeita caminhos customizados). */
export function resolveAliasTarget(spec: string, map: AliasMap): string {
  const rules: Array<[string, string]> = [
    ["styles/", map.styles],
    ["utils/", map.utils],
    ["hooks/", map.hooks],
    ["components/ui/", map.components],
  ];
  for (const [prefix, base] of rules) {
    if (spec.startsWith(prefix)) return path.join(base, spec.slice(prefix.length));
  }
  return path.join(map.root, spec);
}

export function toRelativeSpecifier(fromFileAbs: string, targetAbs: string): string {
  const rel = path.relative(path.dirname(fromFileAbs), targetAbs).split(path.sep).join("/");
  return /^\.\.?(\/|$)/.test(rel) ? rel : `./${rel}`;
}

/** Troca imports `@/...` por caminhos relativos ao arquivo que está sendo escrito. */
export function rewriteAliasImports(content: string, fileAbs: string, map: AliasMap): string {
  return content.replace(
    SPECIFIER,
    (_match, prefix: string, quote: string, spec: string) =>
      `${prefix}${quote}${toRelativeSpecifier(fileAbs, resolveAliasTarget(spec, map))}${quote}`,
  );
}
