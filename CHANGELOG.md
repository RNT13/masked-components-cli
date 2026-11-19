# Changelog

## Unreleased — V3

### Added

- **Preset `masked-layout`** — fundações de layout (instala os 6 de uma vez):
  - `masked-div`: container base polimórfico (`as`): `plain`, `card`,  
    `outlined`, `glass` — tokens `--mc-div-*`.
  - `masked-stack`: flex com gap semântico e divisor automático ou  
    customizado: `column`, `row`, `inline`, `spread` — tokens `--mc-stack-*`.
  - `masked-grid`: grid responsivo `equal`, `auto`, `feature`, `sidebar` —  
    `cols` numérico (desktop `n` / tablet `min(n,2)` / mobile `1`) ou mapa  
    parcial por breakpoint — tokens `--mc-grid-*`.
  - `masked-container`: largura de página + gutters responsivos:  
    `narrow` (720px), `default` (1120px), `wide` (1440px), `full` —  
    tokens `--mc-container-*`.
  - `masked-section`: seção semântica com cabeçalho slotável (título,  
    descrição, ações, `headingLevel`, `aria-labelledby` automático):  
    `plain`, `tinted`, `bordered`, `gradient` — tokens `--mc-section-*`.
  - `masked-divider`: divisor `horizontal`, `vertical` ou `labeled`;  
    decorativo por padrão, `role="separator"` quando semântico —  
    tokens `--mc-divider-*`.
- **Preset `masked-page`** — estrutura de página (instala os 5 de uma vez):
  - `masked-shell`: estrutura de aplicação `app`, `site`, `split`,  
    `centered` com skip link (pt/en) e `mainId` — tokens `--mc-shell-*`.
  - `masked-header`: navbar `static`, `sticky`, `transparent`, `blur` com  
    links, ações e menu mobile em `MaskedDrawer` — tokens `--mc-header-*`.
  - `masked-sidebar`: navegação lateral `fixed`, `inline`, `floating`,  
    `minimal` com colapso (controlado/não controlado), badges e modo  
    mobile em `MaskedDrawer` — tokens `--mc-sidebar-*`.
  - `masked-footer`: rodapé `simple`, `columns`, `centered` com marca,  
    colunas de links (`<nav>` rotulados), social e copyright —  
    tokens `--mc-footer-*`.
  - `masked-page-header`: cabeçalho de página interna com breadcrumbs,  
    título e ações: `simple`, `banner`, `gradient` —  
    tokens `--mc-page-header-*`.
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
- `useMaskedTheme` (em `masked-themes`): lê o tema do styled-components  
  com fallback para `maskedTheme` — componentes funcionam sem  
  `<ThemeProvider>`.
- `resolveSemanticColors` (em `masked-themes`): superfície/texto/borda/  
  accent do tema ativo com fallbacks seguros.
- `resolveSpacing` (em `masked-utils`): resolve chave da escala  
  `theme.spacing`, número (px) ou valor CSS — função pura, SSR-safe.
- `ThemeSwitcher` sincronizado com a versão do site (mobile, z-index,  
  `width: fit-content`).
- Registry: suporte a `preset: true` (agrupa ids sem copiar arquivos) e  
  seção "Presets" separada no `--list`.
- Componentes de página usam `linkComponent` e `locale` (pt/en) do  
  `MaskedConfigProvider`.
- 15 novos arquivos de teste: tokens por componente, contraste WCAG AA  
  em todos os temas, render SSR (semântica e a11y), grafo de presets,  
  `useMaskedTheme`, guarda de sincronização do ThemeSwitcher e  
  interação jsdom (Header/Sidebar).

### Notes

- Todos os componentes V3 seguem o padrão tokens: `colorTheme` pinta  
  superfícies com texto derivado por contraste WCAG; `tokens` sobrescreve  
  qualquer token `--mc-*`; `style` do usuário vence por último.
- `MaskedStack`, `MaskedGrid` e `MaskedContainer` não expõem `colorTheme`  
  nesta versão (divergência conhecida — sob revisão).

## 2.0.0
