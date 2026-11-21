import type { Framework, NpmDep, PathRoot } from './types'

/**
 * Registro único de tudo que a CLI instala.
 * Fonte da verdade: pastas de templates/, dependências entre componentes,
 * pacotes npm e avisos. Conferido por templates-integrity.test.ts.
 */

export interface TemplateMapping {
  dir: string
  to: PathRoot
  subdir?: string
  exclude?: string[]
}

export interface ComponentWarning {
  unlessFramework?: Framework[]
  message: string
}

export interface ComponentEntry {
  id: string
  label: string
  description: string
  templates: TemplateMapping[]
  requires?: string[]
  dependencies?: NpmDep[]
  externals?: string[]
  frameworks?: Framework[]
  warnings?: ComponentWarning[]
  notes?: string[]
  /**
   * Preset: não copia arquivos — apenas agrupa ids em `requires` e instala
   * o conjunto de uma vez. Exibido em seção separada no --list.
   */
  preset?: true
}

const STYLED: NpmDep = { name: 'styled-components', range: '^6.1.0' }
const FORMIK: NpmDep = { name: 'formik', range: '^2.4.0' }

const THEME_PROVIDER_NOTE =
  'Envolva a aplicação com <ThemeProvider theme={maskedTheme}> (styled-components), ' +
  'importando de styles/MaskedThemes/MaskedThemes.'

const CONFIG_PROVIDER_NOTE =
  'Opcional: <MaskedConfigProvider> configura linkComponent, imageComponent, ' +
  'toasts e locale padrão uma única vez para toda a lib.'

export const registry: ComponentEntry[] = [
  {
    id: 'masked-utils',
    label: 'Masked Utils',
    description:
      'Funções puras: moeda, número, data, hora, duração, nomes, cores, erros e espaçamento',
    templates: [{ dir: 'masked-utils', to: 'utils', subdir: 'masked-utils' }]
  },
  {
    id: 'masked-themes',
    label: 'Masked Themes',
    description:
      'Tema base, temas prontos (light/dark/paleta), registro de colorTheme e ThemeSwitcher',
    // color.ts agora mora dentro de masked-utils — sem pasta color-utils separada
    templates: [{ dir: 'masked-themes', to: 'styles' }],
    requires: ['masked-utils'],
    dependencies: [STYLED],
    notes: [THEME_PROVIDER_NOTE]
  },
  {
    id: 'masked-animations',
    label: 'Masked Animations',
    description: 'Animações reveal, contínuas e controladas + useInView',
    templates: [
      { dir: 'masked-animations', to: 'styles' },
      { dir: 'hooks', to: 'hooks', exclude: ['useAnimationEngine.ts'] }
    ],
    dependencies: [STYLED]
  },
  {
    id: 'masked-config',
    label: 'Masked Config Provider',
    description: 'Provider global opcional: linkComponent, imageComponent, toasts, locale',
    templates: [{ dir: 'masked-config', to: 'components' }]
  },
  {
    id: 'masked-skeleton',
    label: 'Masked Skeleton',
    description: 'Placeholder de carregamento (autossuficiente, tokens --mc-skeleton-*)',
    templates: [{ dir: 'masked-skeleton', to: 'components' }],
    dependencies: [STYLED]
  },
  {
    id: 'masked-div',
    label: 'Masked Div',
    description:
      'Container base polimórfico (as): plain, card, outlined, glass — tokens --mc-div-*',
    templates: [{ dir: 'masked-layout/MaskedDiv', to: 'components', subdir: 'MaskedDiv' }],
    requires: ['masked-themes'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-stack',
    label: 'Masked Stack',
    description:
      'Flex com gap semântico e divisor: column, row, inline, spread — tokens --mc-stack-*',
    templates: [{ dir: 'masked-layout/MaskedStack', to: 'components', subdir: 'MaskedStack' }],
    requires: ['masked-themes'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-grid',
    label: 'Masked Grid',
    description:
      'Grid responsivo: equal, auto, feature, sidebar — colunas por breakpoint, tokens --mc-grid-*',
    templates: [{ dir: 'masked-layout/MaskedGrid', to: 'components', subdir: 'MaskedGrid' }],
    requires: ['masked-themes'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-container',
    label: 'Masked Container',
    description:
      'Largura de página + gutters responsivos: narrow, default, wide, full — tokens --mc-container-*',
    templates: [
      { dir: 'masked-layout/MaskedContainer', to: 'components', subdir: 'MaskedContainer' }
    ],
    requires: ['masked-themes'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-section',
    label: 'Masked Section',
    description:
      'Seção semântica com cabeçalho slotável: plain, tinted, bordered, gradient — tokens --mc-section-*',
    templates: [{ dir: 'masked-layout/MaskedSection', to: 'components', subdir: 'MaskedSection' }],
    requires: ['masked-themes'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-divider',
    label: 'Masked Divider',
    description:
      'Divisor horizontal, vertical ou com texto (decorativo ou semântico) — tokens --mc-divider-*',
    templates: [{ dir: 'masked-layout/MaskedDivider', to: 'components', subdir: 'MaskedDivider' }],
    requires: ['masked-themes'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-layout',
    label: 'Masked Layout (preset)',
    description: 'Preset de fundações de layout: instala o conjunto de uma vez',
    // preset não copia arquivos próprios: só agrega os ids em `requires`
    templates: [],
    preset: true,
    requires: [
      'masked-div',
      'masked-stack',
      'masked-grid',
      'masked-container',
      'masked-section',
      'masked-divider'
    ]
  },
  {
    id: 'masked-footer',
    label: 'Masked Footer',
    description:
      'Rodapé com marca, colunas de links, redes e copyright: simple, columns, centered — tokens --mc-footer-*',
    templates: [{ dir: 'masked-page/MaskedFooter', to: 'components', subdir: 'MaskedFooter' }],
    requires: ['masked-themes', 'masked-config'],
    dependencies: [STYLED],
    notes: [CONFIG_PROVIDER_NOTE]
  },
  {
    id: 'masked-page-header',
    label: 'Masked Page Header',
    description:
      'Cabeçalho de página interna (breadcrumbs, título, ações): simple, banner, gradient — tokens --mc-page-header-*',
    templates: [
      { dir: 'masked-page/MaskedPageHeader', to: 'components', subdir: 'MaskedPageHeader' }
    ],
    requires: ['masked-themes'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-header',
    label: 'Masked Header',
    description:
      'Navbar com links, ações e menu mobile em Drawer: static, sticky, transparent, blur — tokens --mc-header-*',
    templates: [{ dir: 'masked-page/MaskedHeader', to: 'components', subdir: 'MaskedHeader' }],
    requires: ['masked-themes', 'masked-config', 'masked-drawer'],
    dependencies: [STYLED],
    notes: [CONFIG_PROVIDER_NOTE]
  },
  {
    id: 'masked-sidebar',
    label: 'Masked Sidebar',
    description:
      'Navegação lateral com colapso e modo mobile em Drawer: fixed, inline, floating, minimal — tokens --mc-sidebar-*',
    templates: [{ dir: 'masked-page/MaskedSidebar', to: 'components', subdir: 'MaskedSidebar' }],
    requires: ['masked-themes', 'masked-config', 'masked-drawer'],
    dependencies: [STYLED],
    notes: [CONFIG_PROVIDER_NOTE]
  },
  {
    id: 'masked-shell',
    label: 'Masked Shell',
    description:
      'Estrutura de página (header, sidebar, conteúdo, footer): app, site, split, centered — tokens --mc-shell-*',
    templates: [{ dir: 'masked-page/MaskedShell', to: 'components', subdir: 'MaskedShell' }],
    requires: ['masked-themes', 'masked-config'],
    dependencies: [STYLED],
    notes: [CONFIG_PROVIDER_NOTE]
  },
  {
    id: 'masked-page',
    label: 'Masked Page (preset)',
    description: 'Preset de estrutura de página: instala o conjunto de uma vez',
    // preset não copia arquivos próprios: só agrega os ids em `requires`
    templates: [],
    preset: true,
    requires: [
      'masked-shell',
      'masked-header',
      'masked-sidebar',
      'masked-footer',
      'masked-page-header'
    ]
  },
  {
    id: 'masked-hero',
    label: 'Masked Hero',
    description:
      'Hero de página (eyebrow, título, descrição, botões, mídia): centered, split, gradient, minimal — tokens --mc-hero-*',
    templates: [{ dir: 'masked-marketing/MaskedHero', to: 'components', subdir: 'MaskedHero' }],
    requires: ['masked-themes'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-features',
    label: 'Masked Features',
    description:
      'Lista de recursos em seção: grid, split, spotlight, timeline — tokens --mc-features-*',
    templates: [
      { dir: 'masked-marketing/MaskedFeatures', to: 'components', subdir: 'MaskedFeatures' }
    ],
    requires: ['masked-themes', 'masked-section'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-stats',
    label: 'Masked Stats',
    description:
      'Números de destaque em seção (dl acessível, tendência com texto): row, grid, highlight — tokens --mc-stats-*',
    templates: [{ dir: 'masked-marketing/MaskedStats', to: 'components', subdir: 'MaskedStats' }],
    requires: ['masked-themes', 'masked-config', 'masked-section'],
    dependencies: [STYLED],
    notes: [CONFIG_PROVIDER_NOTE]
  },
  {
    id: 'masked-cta',
    label: 'Masked CTA',
    description: 'Chamada para ação: banner, gradient, split — tokens --mc-cta-*',
    templates: [{ dir: 'masked-marketing/MaskedCTA', to: 'components', subdir: 'MaskedCTA' }],
    requires: ['masked-themes'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-logo-cloud',
    label: 'Masked Logo Cloud',
    description:
      'Nuvem de logos em seção: row, grid, marquee (respeita reduced-motion) — tokens --mc-logo-cloud-*',
    templates: [
      { dir: 'masked-marketing/MaskedLogoCloud', to: 'components', subdir: 'MaskedLogoCloud' }
    ],
    requires: ['masked-themes', 'masked-section'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-testimonials',
    label: 'Masked Testimonials',
    description:
      'Depoimentos em seção (figure/blockquote): grid, carousel (CSS puro), spotlight — tokens --mc-testimonials-*',
    templates: [
      { dir: 'masked-marketing/MaskedTestimonials', to: 'components', subdir: 'MaskedTestimonials' }
    ],
    requires: ['masked-themes', 'masked-config', 'masked-section'],
    dependencies: [STYLED],
    notes: [CONFIG_PROVIDER_NOTE]
  },
  {
    id: 'masked-faq',
    label: 'Masked FAQ',
    description:
      'Perguntas frequentes com details nativo: list, two-columns, boxed — tokens --mc-faq-*',
    templates: [{ dir: 'masked-marketing/MaskedFAQ', to: 'components', subdir: 'MaskedFAQ' }],
    requires: ['masked-themes', 'masked-section'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-pricing',
    label: 'Masked Pricing',
    description:
      'Planos e preços com alternador mensal/anual: cards, table (tabela acessível) — tokens --mc-pricing-*',
    templates: [
      { dir: 'masked-marketing/MaskedPricing', to: 'components', subdir: 'MaskedPricing' }
    ],
    requires: ['masked-themes', 'masked-config', 'masked-section'],
    dependencies: [STYLED],
    notes: [CONFIG_PROVIDER_NOTE]
  },
  {
    id: 'masked-newsletter',
    label: 'Masked Newsletter',
    description:
      'Inscrição de e-mail com estados e região viva: inline, card, band — tokens --mc-newsletter-*',
    templates: [
      { dir: 'masked-marketing/MaskedNewsletter', to: 'components', subdir: 'MaskedNewsletter' }
    ],
    requires: ['masked-themes', 'masked-config'],
    dependencies: [STYLED],
    notes: [CONFIG_PROVIDER_NOTE]
  },
  {
    id: 'masked-marketing',
    label: 'Masked Marketing (preset)',
    description: 'Preset de seções de marketing: instala o conjunto de uma vez',
    // preset não copia arquivos próprios: só agrega os ids em `requires`
    templates: [],
    preset: true,
    requires: [
      'masked-hero',
      'masked-features',
      'masked-stats',
      'masked-cta',
      'masked-logo-cloud',
      'masked-testimonials',
      'masked-faq',
      'masked-pricing',
      'masked-newsletter'
    ]
  },
  {
    id: 'masked-badge',
    label: 'Masked Badge',
    description: 'Selo curto de status/contador: solid, soft, outline, dot — tokens --mc-badge-*',
    templates: [{ dir: 'masked-app/MaskedBadge', to: 'components', subdir: 'MaskedBadge' }],
    requires: ['masked-themes'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-avatar',
    label: 'Masked Avatar',
    description:
      'Avatar com imagem, iniciais e presença acessível: circle, rounded, square — tokens --mc-avatar-*',
    templates: [{ dir: 'masked-app/MaskedAvatar', to: 'components', subdir: 'MaskedAvatar' }],
    requires: ['masked-themes', 'masked-config'],
    dependencies: [STYLED],
    notes: [CONFIG_PROVIDER_NOTE]
  },
  {
    id: 'masked-tooltip',
    label: 'Masked Tooltip',
    description: 'Tooltip por hover e teclado (WCAG 1.4.13): dark, light — tokens --mc-tooltip-*',
    templates: [{ dir: 'masked-app/MaskedTooltip', to: 'components', subdir: 'MaskedTooltip' }],
    requires: ['masked-themes'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-breadcrumb',
    label: 'Masked Breadcrumb',
    description: 'Trilha de navegação com colapso: default, compact — tokens --mc-breadcrumb-*',
    templates: [
      { dir: 'masked-app/MaskedBreadcrumb', to: 'components', subdir: 'MaskedBreadcrumb' }
    ],
    requires: ['masked-themes', 'masked-config'],
    dependencies: [STYLED],
    notes: [CONFIG_PROVIDER_NOTE]
  },
  {
    id: 'masked-empty-state',
    label: 'Masked Empty State',
    description:
      'Estado vazio (ícone, título, ação): default, compact, error, search — tokens --mc-empty-state-*',
    templates: [
      { dir: 'masked-app/MaskedEmptyState', to: 'components', subdir: 'MaskedEmptyState' }
    ],
    requires: ['masked-themes'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-alert',
    label: 'Masked Alert',
    description:
      'Alerta inline acessível (role alert/status): info, success, warning, error — tokens --mc-alert-*',
    templates: [{ dir: 'masked-app/MaskedAlert', to: 'components', subdir: 'MaskedAlert' }],
    requires: ['masked-themes', 'masked-config', 'masked-utils'],
    dependencies: [STYLED],
    notes: [CONFIG_PROVIDER_NOTE]
  },
  {
    id: 'masked-tabs',
    label: 'Masked Tabs',
    description:
      'Abas WAI-ARIA com roving tabindex: line, pills, enclosed, vertical — tokens --mc-tabs-*',
    templates: [{ dir: 'masked-app/MaskedTabs', to: 'components', subdir: 'MaskedTabs' }],
    requires: ['masked-themes', 'masked-config'],
    dependencies: [STYLED],
    notes: [CONFIG_PROVIDER_NOTE]
  },
  {
    id: 'masked-accordion',
    label: 'Masked Accordion',
    description:
      'Accordion WAI-ARIA controlado ou não: default, boxed, separated — tokens --mc-accordion-*',
    templates: [{ dir: 'masked-app/MaskedAccordion', to: 'components', subdir: 'MaskedAccordion' }],
    requires: ['masked-themes'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-pagination',
    label: 'Masked Pagination',
    description:
      'Paginação acessível com links reais opcionais: default, compact, edges — tokens --mc-pagination-*',
    templates: [
      { dir: 'masked-app/MaskedPagination', to: 'components', subdir: 'MaskedPagination' }
    ],
    requires: ['masked-themes', 'masked-config'],
    dependencies: [STYLED],
    notes: [CONFIG_PROVIDER_NOTE]
  },
  {
    id: 'masked-stepper',
    label: 'Masked Stepper',
    description:
      'Etapas com status em texto: horizontal, vertical, dots, progress — tokens --mc-stepper-*',
    templates: [{ dir: 'masked-app/MaskedStepper', to: 'components', subdir: 'MaskedStepper' }],
    requires: ['masked-themes', 'masked-config'],
    dependencies: [STYLED],
    notes: [CONFIG_PROVIDER_NOTE]
  },
  {
    id: 'masked-progress',
    label: 'Masked Progress',
    description:
      'Progresso acessível (role progressbar): linear e circle, determinado/indeterminado — tokens --mc-progress-*',
    templates: [{ dir: 'masked-app/MaskedProgress', to: 'components', subdir: 'MaskedProgress' }],
    requires: ['masked-themes', 'masked-config'],
    dependencies: [STYLED],
    notes: [CONFIG_PROVIDER_NOTE]
  },
  {
    id: 'masked-table',
    label: 'Masked Table',
    description:
      'Tabela com ordenação, loading e estado vazio: simple, striped, bordered, card — tokens --mc-table-*',
    templates: [{ dir: 'masked-app/MaskedTable', to: 'components', subdir: 'MaskedTable' }],
    requires: [
      'masked-themes',
      'masked-config',
      'masked-skeleton',
      'masked-utils',
      'masked-pagination',
      'masked-empty-state'
    ],
    dependencies: [STYLED],
    notes: [CONFIG_PROVIDER_NOTE]
  },
  {
    id: 'masked-dashboard',
    label: 'Masked Dashboard',
    description:
      'Painel pronto (topbar, sidebar com Drawer mobile, cabeçalho de página): analytics, saas, minimal — tokens --mc-dashboard-*',
    templates: [{ dir: 'masked-app/MaskedDashboard', to: 'components', subdir: 'MaskedDashboard' }],
    requires: [
      'masked-themes',
      'masked-config',
      'masked-shell',
      'masked-sidebar',
      'masked-page-header'
    ],
    dependencies: [STYLED],
    notes: [CONFIG_PROVIDER_NOTE]
  },
  {
    id: 'masked-app',
    label: 'Masked App (preset)',
    description: 'Preset de componentes de aplicação/dashboard: instala o conjunto de uma vez',
    // preset não copia arquivos próprios: só agrega os ids em `requires`
    templates: [],
    preset: true,
    requires: [
      'masked-dashboard',
      'masked-tabs',
      'masked-breadcrumb',
      'masked-table',
      'masked-pagination',
      'masked-stepper',
      'masked-empty-state',
      'masked-avatar',
      'masked-badge',
      'masked-tooltip',
      'masked-accordion'
    ]
  },
  {
    id: 'masked-toaster',
    label: 'Masked Toaster',
    description:
      'Notificações (toast) sem dependências: success/error/info/warning/loading/promise, acessível e SSR-safe',
    templates: [{ dir: 'masked-toaster', to: 'components' }],
    notes: [
      'Renderize <MaskedToaster /> uma vez na raiz do app e dispare com toast.success("...").',
      'Opcional: <MaskedConfigProvider config={maskedToastHandlers}> liga os callbacks onSuccess/onError da lib ao toaster.'
    ]
  },
  {
    id: 'masked-buttons',
    label: 'Masked Buttons',
    description:
      'default, outline, ghost, soft, link, gradient, neon, split, toggle, switch, checkbox, radio, group',
    templates: [{ dir: 'masked-buttons', to: 'components' }],
    requires: ['masked-animations', 'masked-themes', 'masked-config'],
    dependencies: [STYLED],
    notes: [THEME_PROVIDER_NOTE, CONFIG_PROVIDER_NOTE]
  },
  {
    id: 'masked-cards',
    label: 'Masked Cards',
    description: 'Cards métricas/stats/compare/product/feature/plan com tokens --mc-card-*',
    templates: [{ dir: 'masked-cards', to: 'components' }],
    requires: ['masked-utils', 'masked-themes', 'masked-config'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-drawer',
    label: 'Masked Drawer',
    description: 'Painel lateral/superior/inferior com overlay, portal SSR-safe e focus-trap',
    templates: [{ dir: 'masked-drawer', to: 'components' }],
    requires: ['masked-themes'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-popup',
    label: 'Masked Popup',
    description: 'Modal centralizado com overlay, portal SSR-safe e focus-trap',
    templates: [{ dir: 'masked-popup', to: 'components' }],
    requires: ['masked-themes'],
    dependencies: [STYLED]
  },
  {
    id: 'masked-input',
    label: 'Masked Input',
    description: 'texto, textarea, senha, máscara, moeda, select, hora, arquivo, busca',
    templates: [{ dir: 'masked-input', to: 'components' }],
    requires: ['masked-animations', 'masked-themes', 'masked-config', 'masked-utils'],
    dependencies: [STYLED]
    // sem next/image e sem react-hot-toast: upload/imagem/erros são injetáveis
  },
  {
    id: 'masked-input-formik',
    label: 'Masked Input — camada Formik',
    description: 'Versões ligadas ao Formik (useField) de cada variante do Masked Input',
    templates: [{ dir: 'masked-input-formik', to: 'components' }],
    requires: ['masked-input'],
    dependencies: [FORMIK]
  },
  {
    id: 'masked-hooks',
    label: 'Masked Hooks',
    description: 'useDebounce, useLocalStorage, useMediaQuery, useScrollToTop',
    templates: [{ dir: 'masked-hooks', to: 'hooks' }]
    // useInView sai com masked-animations; useSmartSearch sai com masked-input
  },
  {
    id: 'masked-hooks-next',
    label: 'Masked Hooks (Next.js)',
    description: 'useSafeReturn: voltar para a rota de origem com segurança (só Next.js)',
    templates: [{ dir: 'masked-hooks-next', to: 'hooks' }],
    frameworks: ['next'],
    externals: ['next']
  }
]

export class RegistryError extends Error {}

export interface ResolvedComponents {
  ordered: ComponentEntry[]
  addedByDependency: string[]
}

export function getEntry(
  id: string,
  entries: ComponentEntry[] = registry
): ComponentEntry | undefined {
  return entries.find((entry) => entry.id === id)
}

export function resolveComponents(
  ids: string[],
  framework: Framework,
  entries: ComponentEntry[] = registry
): ResolvedComponents {
  const byId = new Map(entries.map((entry) => [entry.id, entry]))
  const ordered: ComponentEntry[] = []
  const done = new Set<string>()
  const visiting: string[] = []

  const visit = (id: string): void => {
    if (done.has(id)) return
    const entry = byId.get(id)
    if (!entry) {
      throw new RegistryError(
        `Componente desconhecido: "${id}". Disponíveis: ${[...byId.keys()].join(', ')}`
      )
    }
    if (visiting.includes(id)) {
      throw new RegistryError(`Dependência circular: ${[...visiting, id].join(' → ')}`)
    }
    if (entry.frameworks && !entry.frameworks.includes(framework)) {
      throw new RegistryError(
        `"${id}" só está disponível para: ${entry.frameworks.join(', ')} (detectado: ${framework}).`
      )
    }
    visiting.push(id)
    for (const dep of entry.requires ?? []) visit(dep)
    visiting.pop()
    done.add(id)
    ordered.push(entry)
  }

  const requested = [...new Set(ids)]
  for (const id of requested) visit(id)

  const requestedSet = new Set(requested)
  return {
    ordered,
    addedByDependency: ordered
      .filter((entry) => !requestedSet.has(entry.id))
      .map((entry) => entry.id)
  }
}
