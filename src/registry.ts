type Framework = string;
type PathRoot = "components" | "hooks" | "styles" | "utils";

interface NpmDep {
  name: string;
  range: string;
}

/**
 * Registro único de tudo que a CLI instala.
 * Fonte da verdade: pastas de templates/, dependências entre componentes,
 * pacotes npm e avisos. Conferido por templates-integrity.test.ts.
 */

export interface TemplateMapping {
  dir: string;
  to: PathRoot;
  subdir?: string;
  exclude?: string[];
}

export interface ComponentWarning {
  unlessFramework?: Framework[];
  message: string;
}

export interface ComponentEntry {
  id: string;
  label: string;
  description: string;
  templates: TemplateMapping[];
  requires?: string[];
  dependencies?: NpmDep[];
  externals?: string[];
  frameworks?: Framework[];
  warnings?: ComponentWarning[];
  notes?: string[];
}

const STYLED: NpmDep = { name: "styled-components", range: "^6.1.0" };
const FORMIK: NpmDep = { name: "formik", range: "^2.4.0" };

const THEME_PROVIDER_NOTE =
  "Envolva a aplicação com <ThemeProvider theme={maskedTheme}> (styled-components), " +
  "importando de styles/MaskedThemes/MaskedThemes.";

const CONFIG_PROVIDER_NOTE =
  "Opcional: <MaskedConfigProvider> configura linkComponent, imageComponent, " +
  "toasts e locale padrão uma única vez para toda a lib.";

export const registry: ComponentEntry[] = [
  {
    id: "masked-utils",
    label: "Masked Utils",
    description:
      "Funções puras: moeda, número, data, hora, duração, nomes, cores, erros",
    templates: [{ dir: "masked-utils", to: "utils", subdir: "masked-utils" }],
  },
  {
    id: "masked-themes",
    label: "Masked Themes",
    description:
      "Tema base, temas prontos (light/dark/paleta) e registro de colorTheme",
    // color.ts agora mora dentro de masked-utils — sem pasta color-utils separada
    templates: [{ dir: "masked-themes", to: "styles" }],
    requires: ["masked-utils"],
    dependencies: [STYLED],
    notes: [THEME_PROVIDER_NOTE],
  },
  {
    id: "masked-animations",
    label: "Masked Animations",
    description: "Animações reveal, contínuas e controladas + useInView",
    templates: [
      { dir: "masked-animations", to: "styles" },
      { dir: "hooks", to: "hooks", exclude: ["useAnimationEngine.ts"] },
    ],
    dependencies: [STYLED],
  },
  {
    id: "masked-config",
    label: "Masked Config Provider",
    description:
      "Provider global opcional: linkComponent, imageComponent, toasts, locale",
    templates: [{ dir: "masked-config", to: "components" }],
  },
  {
    id: "masked-skeleton",
    label: "Masked Skeleton",
    description:
      "Placeholder de carregamento (autossuficiente, tokens --mc-skeleton-*)",
    templates: [{ dir: "masked-skeleton", to: "components" }],
    dependencies: [STYLED],
  },
  {
    id: "masked-buttons",
    label: "Masked Buttons",
    description:
      "default, outline, ghost, soft, link, gradient, neon, toggle, switch, checkbox, radio, group",
    templates: [{ dir: "masked-buttons", to: "components" }],
    requires: ["masked-animations", "masked-themes", "masked-config"],
    dependencies: [STYLED],
    notes: [THEME_PROVIDER_NOTE, CONFIG_PROVIDER_NOTE],
  },
  {
    id: "masked-cards",
    label: "Masked Cards",
    description: "plain, metric, stat, compare, product, feature, plan",
    templates: [{ dir: "masked-cards", to: "components" }],
    requires: ["masked-themes", "masked-config", "masked-utils"],
    dependencies: [STYLED],
  },
  {
    id: "masked-drawer",
    label: "Masked Drawer",
    description:
      "Painel lateral/superior/inferior com overlay, portal SSR-safe e focus-trap",
    templates: [{ dir: "masked-drawer", to: "components" }],
    requires: ["masked-themes"],
    dependencies: [STYLED],
  },
  {
    id: "masked-popup",
    label: "Masked Popup",
    description: "Modal centralizado com overlay, portal SSR-safe e focus-trap",
    templates: [{ dir: "masked-popup", to: "components" }],
    requires: ["masked-themes"],
    dependencies: [STYLED],
  },
  {
    id: "masked-input",
    label: "Masked Input",
    description:
      "texto, textarea, senha, máscara, moeda, select, hora, arquivo, busca",
    templates: [{ dir: "masked-input", to: "components" }],
    requires: [
      "masked-animations",
      "masked-themes",
      "masked-config",
      "masked-utils",
    ],
    dependencies: [STYLED],
    // sem next/image e sem react-hot-toast: upload/imagem/erros são injetáveis
  },
  {
    id: "masked-input-formik",
    label: "Masked Input — camada Formik",
    description:
      "Versões ligadas ao Formik (useField) de cada variante do Masked Input",
    templates: [{ dir: "masked-input-formik", to: "components" }],
    requires: ["masked-input"],
    dependencies: [FORMIK],
  },
  {
    id: "masked-hooks",
    label: "Masked Hooks",
    description: "useDebounce, useLocalStorage, useMediaQuery, useScrollToTop",
    templates: [{ dir: "masked-hooks", to: "hooks" }],
    // useInView sai com masked-animations; useSmartSearch sai com masked-input
  },
  {
    id: "masked-hooks-next",
    label: "Masked Hooks (Next.js)",
    description:
      "useSafeReturn: voltar para a rota de origem com segurança (só Next.js)",
    templates: [{ dir: "masked-hooks-next", to: "hooks" }],
    frameworks: ["next"],
    externals: ["next"],
  },
];

export class RegistryError extends Error {}

export interface ResolvedComponents {
  ordered: ComponentEntry[];
  addedByDependency: string[];
}

export function getEntry(
  id: string,
  entries: ComponentEntry[] = registry,
): ComponentEntry | undefined {
  return entries.find((entry) => entry.id === id);
}

export function resolveComponents(
  ids: string[],
  framework: Framework,
  entries: ComponentEntry[] = registry,
): ResolvedComponents {
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const ordered: ComponentEntry[] = [];
  const done = new Set<string>();
  const visiting: string[] = [];

  const visit = (id: string): void => {
    if (done.has(id)) return;
    const entry = byId.get(id);
    if (!entry) {
      throw new RegistryError(
        `Componente desconhecido: "${id}". Disponíveis: ${[...byId.keys()].join(", ")}`,
      );
    }
    if (visiting.includes(id)) {
      throw new RegistryError(
        `Dependência circular: ${[...visiting, id].join(" → ")}`,
      );
    }
    if (entry.frameworks && !entry.frameworks.includes(framework)) {
      throw new RegistryError(
        `"${id}" só está disponível para: ${entry.frameworks.join(", ")} (detectado: ${framework}).`,
      );
    }
    visiting.push(id);
    for (const dep of entry.requires ?? []) visit(dep);
    visiting.pop();
    done.add(id);
    ordered.push(entry);
  };

  const requested = [...new Set(ids)];
  for (const id of requested) visit(id);

  const requestedSet = new Set(requested);
  return {
    ordered,
    addedByDependency: ordered
      .filter((entry) => !requestedSet.has(entry.id))
      .map((entry) => entry.id),
  };
}
