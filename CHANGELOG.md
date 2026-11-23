# Changelog  
  
## Unreleased

### Added

- **Fundações de layout (Passo 2.1)**, todas com tokens `--mc-<comp>-*`, `colorTheme`,
  overrides granulares por prop `tokens`, polimorfismo `as` e funcionando sem
  `<ThemeProvider>` (caem no tema base da lib):
  - `masked-div` — `MaskedDiv`: container base (`plain`, `card`, `outlined`, `glass`),
    flex opcional (`direction`/`align`/`justify`/`wrap`) e `gap`/`padding` na escala da lib.
  - `masked-stack` — `MaskedStack`: fluxo flexível com gap semântico
    (`column`, `row`, `inline`, `spread`) e divisor automático (`divider`).
  - `masked-grid` — `MaskedGrid`: grid responsivo (`equal`, `auto`, `feature`, `sidebar`),
    colunas por breakpoint (número já é responsivo: desktop n, tablet min(n,2), mobile 1).
  - preset `masked-layout` — instala os três de uma vez (sem código próprio).
- **Fundações de layout (Passo 2.2)**: `masked-container` (`MaskedContainer`: `narrow`, `default`,
  `wide`, `full`, gutters responsivos), `masked-section` (`MaskedSection`: `plain`, `tinted`,
  `bordered`, `gradient`, cabeçalho slotável, rotulada pelo título) e `masked-divider`
  (`MaskedDivider`: `horizontal`, `vertical`, `labeled`, decorativo ou semântico). O preset
  `masked-layout` passa a instalar os seis.
- **Estrutura de página (Passo 3)**, também com `colorTheme`, `tokens` e funcionando sem
  `<ThemeProvider>`: `masked-header` (`MaskedHeader`: `static`, `sticky`, `transparent`, `blur`,
  menu mobile em `MaskedDrawer`), `masked-sidebar` (`MaskedSidebar`: `fixed`, `inline`,
  `floating`, `minimal`, colapso controlado ou não, modo mobile em `MaskedDrawer`),
  `masked-footer` (`MaskedFooter`: `simple`, `columns`, `centered`), `masked-page-header`
  (`MaskedPageHeader`: `simple`, `banner`, `gradient`) e `masked-shell` (`MaskedShell`: `app`,
  `site`, `split`, `centered`, com `<main>` e link "pular para o conteúdo"). O preset `masked-page`
  instala os cinco. Links usam o `linkComponent` do `MaskedConfigProvider`; textos fixos em pt-BR/en.
- **Marketing (Passo 4)**: nove componentes de seção, todos com `colorTheme`, `tokens`
  (`--mc-<componente>-*`), contraste WCAG AA e funcionando sem `<ThemeProvider>`:
  `masked-hero` (`MaskedHero`: `centered`, `split`, `gradient`, `minimal`), `masked-features`
  (`grid`, `split`, `spotlight`, `timeline`), `masked-stats` (`row`, `grid`, `highlight`; lista de
  definição, tendência com texto), `masked-cta` (`banner`, `gradient`, `split`), `masked-logo-cloud`
  (`row`, `grid`, `marquee` com `prefers-reduced-motion`), `masked-testimonials` (`grid`, `carousel`
  em CSS puro, `spotlight`), `masked-faq` (`list`, `two-columns`, `boxed`; `<details>` nativo),
  `masked-pricing` (`cards`, `table` acessível; alternador mensal/anual controlado ou não) e
  `masked-newsletter` (`inline`, `card`, `band`; estados de envio e região viva). Features, Stats,
  LogoCloud, Testimonials, FAQ e Pricing são compostos sobre `MaskedSection` (título, descrição e ações
  vêm das props dela; `sectionVariant`/`sectionTokens` controlam a seção). Botões entram por slot
  (`actions`) ou como link (`cta` do Pricing): nenhum depende de `masked-buttons`, `masked-animations`
  ou `masked-drawer`. O preset `masked-marketing` instala os nove.
- `masked-themes/surfaceTokens.ts`: `resolveSurface(kind, colorTheme, theme)` e `buildTokenStyle()` —
  superfícies (`plain`, `tinted`, `solid`, `gradient`, `outlined`) com texto por contraste, compartilhadas
  pelos componentes de marketing.
- **App/Dashboard (Passo 5)**: onze componentes de aplicação, todos com `colorTheme`, `tokens`
  (`--mc-<componente>-*`), contraste WCAG AA e funcionando sem `<ThemeProvider>`:
  `masked-tabs` (`MaskedTabs`: `line`, `pills`, `enclosed`, `vertical`; padrão WAI-ARIA com roving
  tabindex, setas, Home/End, `activation` automática ou manual), `masked-accordion` (`default`, `boxed`,
  `separated`; botão + region, controlado ou não), `masked-breadcrumb` (`default`, `compact`),
  `masked-pagination` (`default`, `compact`, `edges`; links reais com `hrefBuilder`), `masked-stepper`
  (`horizontal`, `vertical`, `dots`, `progress`; status em texto), `masked-table` (`simple`, `striped`,
  `bordered`, `card`; ordenação estável, `manualSort`, loading com `MaskedSkeleton`, estado vazio, linhas
  clicáveis), `masked-empty-state`, `masked-avatar` (imagem, iniciais, presença em texto, `imageComponent`
  do config), `masked-badge`, `masked-tooltip` (hover/foco/Escape, WCAG 1.4.13) e `masked-dashboard`
  (topbar + sidebar com Drawer mobile + cabeçalho de página sobre `MaskedShell`; `analytics`, `saas`,
  `minimal`). O preset `masked-app` instala os onze.
- **Complementos (Passo 6)**: seis componentes novos, todos com `colorTheme`, `tokens`
  (`--mc-<componente>-*`) e textos em pt-BR/en: `masked-slider` (`MaskedSlider`: `default`, `filled`,
  `steps`; `<input type="range">` nativo com label real, `<output>` e `aria-valuetext`), `masked-rating`
  (`stars`, `hearts`, `numbers`; rádios nativos, modo só leitura com nome acessível, `allowClear`),
  `masked-date-picker` (`popover`, `inline`; datas como "YYYY-MM-DD" sem fuso, teclado completo na
  grade, `min`/`max`/`isDateDisabled`, `weekStart`, campo oculto para `<form>`), `masked-command-palette`
  (`default`, `compact`; Ctrl/⌘+K, combobox + listbox sobre o `MaskedPopup`, busca sem acento e por
  relevância), `masked-team` (`grid`, `list`, `cards`) e `masked-contact` (`split`, `card`, `minimal`).
  O preset `masked-forms` instala os quatro primeiros; `masked-marketing` passa a incluir Team e Contact.
- `MaskedPopup` e `MaskedDrawer` ganham `ariaLabel` e `ariaLabelledBy` (opcionais): o `role="dialog"` agora
  pode ter nome acessível. O menu do `MaskedHeader`, a sidebar mobile e o `MaskedDashboard` já passam o nome.
- `ThemeSwitcher`: navegação do menu por teclado (↑/↓ com volta, Home/End, Tab fecha), foco inicial no tema
  atual e devolução do foco ao botão com Escape. **Este arquivo agora difere do site** (o site precisa receber
  a mesma versão).
- `masked-themes/semanticColors.ts`: `resolveSemanticColors(theme)` — superfície, texto, borda e
  destaque do tema ativo com fallback seguro, usados pelos componentes de estrutura.
- **Quando usar `MaskedDiv` × `MaskedStack`**: use `MaskedDiv` quando a caixa tem
  **aparência** (superfície, borda, sombra, vidro — `variant`, `colorTheme`) ou precisa
  de um flex pontual; use `MaskedStack` para **organizar uma lista de filhos em fluxo**
  com espaçamento uniforme e divisor entre itens. Combine: `<MaskedDiv variant="card">`
  com um `<MaskedStack>` dentro.
- `masked-utils/spacing.ts`: `resolveSpacing(value, scale)` — resolve gap/padding
  contra a escala recebida por parâmetro. A escala oficial é `theme.spacing` do
  MaskedThemes (`2xs`..`5xl`); o util não importa o MaskedThemes (evita ciclo
  masked-utils ↔ masked-themes). Props de gap/padding aceitam chave do tema,
  número (px) ou valor CSS.
- `masked-themes/useMaskedTheme.ts`: hook `useMaskedTheme()` — devolve o tema do
  `<ThemeProvider>` ou, sem provider, o `maskedTheme` (o `useTheme()` do
  styled-components v6 lança erro fora do provider). Usado por todos os componentes
  novos da V3; componentes existentes não foram migrados.
- `--list` separa **Componentes** e **Presets** em seções distintas.
- Testes: `containerTokens`, `dividerTokens`, `sectionTokens`, `pageTokens` (contraste WCAG AA em
  todos os temas), `layoutFoundations.render`, `pageStructure.render` e `layoutPresets`; e `spacing.test.ts`, `divTokens.test.ts` (inclui guard WCAG AA por tema),
  `stackTokens.test.ts`, `gridTokens.test.ts` (inclui contrato token × CSS) e
  `layout.render.test.tsx` (SSR, semântica via `as`, ARIA, divisor `aria-hidden`) e
  `useMaskedTheme.test.tsx` (com/sem provider; todo componente que usa o hook
  instala `masked-themes`; instalação granular).

### Fixed

- `MaskedPopup` abria com erro (`theme.colors` indefinido) fora de um `<ThemeProvider>`; os helpers de cor
  agora leem o tema com optional chaining e caem no tema base, como o `MaskedDrawer`. Com `ThemeProvider`,
  nada muda.
- `masked-themes`: descrição no `--list` atualizada para citar o `ThemeSwitcher`
  (o arquivo já era instalado pelo pack; a listagem não o citava por nome).
- `ThemeSwitcher` synced from the website: mobile breakpoints (40px touch
  targets, smaller font/padding/gap on mobile, mobile font from
  `theme.fontSize.sm`), menu z-index fallback raised to `1000` (was `100`,
  menu could render behind overlays), menu `max-height` 280px, and `Root` no
  longer stretches inside flex/grid parents.

## 2.0.0  
  
### Renamed  
  
- Package renamed from `masked-components-cli` to `masked-components`.  
  `npx masked-components` is now the install command. The old bin name  
  `masked-components-cli` still works after global install.  
  
### Breaking changes  
  
- `theme.boxShadow.*()` now returns only the shadow value (`none` returns  
  `'none'`). Callers must write `box-shadow: ${theme.boxShadow.md()};`.  
- `CurrencyInput` `onChange` now fires per digit typed (previously only on  
  complete values).  
- Removed internal barrel re-exports that duplicated hook entry points.  
- `useInView` ships exclusively with `masked-animations`; `useSmartSearch`  
  exclusively with `masked-input`. Installing `masked-hooks` no longer  
  provides them.  
  
### Added  
  
- `masked-config` package: `MaskedConfigProvider` for global defaults.  
- `ThemeSemanticColors`: `primaryGradient`, `surfaceGradient`,  
  `accentGradient` per theme.  
- `pickReadable` / `readableTextOn` tinted-dark option: text on accent  
  surfaces can resolve to a dark shade of the accent hue.  
- `themes-contrast.test.ts`: WCAG AA guard for all 17 themes.  
- `MaskedDrawer`/`MaskedPopup`: portal-based menus, `inert` support,  
  `100dvh` heights, first-open animation fix.  
  
### Fixed  
  
- Select/Time dropdowns styled and keyboard-navigable after CLI install.  
- Button text contrast on light themes (ghost/outline/link variants).  
- `borderColor` values too close to `surfaceColor` in light themes.  
- `textMuted` below 4.5:1 in `dark`, `slate`, `forest`, `dracula`.  
- Drawer/Popup flying in from the wrong side on first open.  
- Popup closing without exit animation.  
- SplitButton menu clipped behind sibling cards (now portaled).  
- `MaskedSkeleton` invisible on light themes.  
- `MaskedToaster` position variants documented; `toast` helpers exported.  
- Removed 3 empty `.styles.ts` files and duplicate hook sources.
