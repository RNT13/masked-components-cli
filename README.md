# ✨ Masked Components CLI

Componentes **React + TypeScript** no modelo _copy-in_. O CLI copia o código-fonte dos componentes para dentro do seu projeto, seguindo uma abordagem semelhante à do shadcn/ui: os arquivos passam a ser seus, você pode editá-los livremente e não existe dependência de runtime deste pacote depois da instalação.

```bash
npx masked-components
```

Escolha os componentes. O CLI identifica as dependências internas, instala os pacotes npm que faltam usando o gerenciador do seu projeto (npm, pnpm, yarn ou bun) e copia os arquivos para os diretórios configurados.

🌐 **Site e playground:** <https://masked-components.vercel.app/>

---

## 📖 Índice

1. [Como funciona](#-1-como-funciona)
2. [Requisitos do projeto](#-2-requisitos-do-projeto)
3. [Como usar](#-3-como-usar)
4. [Componentes, dependências e destinos](#-4-componentes-dependências-e-destinos)
   - [Referência completa do MaskedCards](#referência-completa-do-maskedcards)
5. [Migrando para a versão 2.x](#-5-migrando-para-a-versão-2x)
6. [Configuração inicial](#-6-configuração-inicial)
7. [Personalização com tokens](#-7-personalização-com-tokens)
8. [Atualizando os componentes](#-8-atualizando-os-componentes)
9. [Solução de problemas](#-9-solução-de-problemas)
10. [Desenvolvimento](#-10-desenvolvimento)
11. [Licença](#-11-licença)

---

## ✅ 1. Como funciona

Diferentemente de bibliotecas tradicionais, os componentes são copiados para dentro da sua aplicação, e não importados de `node_modules`.

**Principais características:**

- **Copy-in:** o código-fonte vai diretamente para o seu projeto.
- **Controle total:** edite, personalize e adapte qualquer componente.
- **Sem dependência em runtime:** depois da instalação, nada depende do pacote `masked-components`.
- **Instalação inteligente:** o CLI resolve dependências internas. Por exemplo, componentes que usam temas recebem os arquivos de tema necessários.
- **Gerenciador de pacotes:** instala os pacotes npm usando o gerenciador detectado no projeto.
- **Componentes independentes:** cada componente pode ser instalado sozinho, respeitando suas dependências internas.
- **Execução segura:** arquivos que você modificou não são sobrescritos sem `--force`.

---

## ✅ 2. Requisitos do projeto

### 📋 Obrigatórios

- Node.js **18.19 ou superior** para executar o CLI.
- Um `package.json` na raiz do projeto. Execute o CLI nessa pasta ou informe outra usando `--cwd`.
- **React 18 ou superior**. Os templates utilizam recursos como `useSyncExternalStore`.
- **TypeScript**, pois os templates são arquivos `.ts` e `.tsx`.

### 🌐 Compatibilidade

Funciona com **Next.js**, **Vite**, **Remix** e **Create React App**. O framework é detectado pelo `package.json`.

Se o projeto não tiver o alias `@/`, os imports podem ser convertidos automaticamente para caminhos relativos. Consulte a opção `--alias`.

### 🔗 Sobre `next`

Apenas o componente `masked-hooks-next` (`useSafeReturn`) depende de `next` e, por isso, só pode ser instalado em projetos Next.js. Os demais componentes não dependem de um framework específico: links e imagens podem ser injetados pelo `MaskedConfigProvider`.

---

## ✅ 3. Como usar

### 🚀 Execução

Na raiz do seu projeto:

```bash
npx masked-components
```

O CLI abre uma lista interativa. Marque os componentes com `espaço` e confirme com `enter`.

### 💻 Exemplos

```bash
# Execução interativa
npx masked-components

# Componentes específicos (o prefixo "add" é opcional)
npx masked-components masked-buttons masked-cards
npx masked-components add masked-toaster

# Instalar todos os componentes compatíveis com o framework detectado
npx masked-components --all

# Listar componentes e suas dependências
npx masked-components --list

# Simular a instalação, sem escrever arquivos
npx masked-components masked-input --dry-run

# Copiar arquivos sem instalar pacotes npm
npx masked-components masked-popup --no-install
```

### ⚙️ Opções

| Opção                            | Ação                                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `-l, --list`                     | Lista os componentes disponíveis.                                                                                         |
| `--all`                          | Instala todos os componentes compatíveis com o framework detectado.                                                       |
| `-y, --yes`                      | Não pergunta nada e aceita o plano. Obrigatório em ambientes sem terminal interativo (CI).                                |
| `-f, --force`                    | Sobrescreve arquivos existentes que sejam diferentes. Sem isso, eles são mantidos e reportados.                           |
| `--dry-run`                      | Mostra o plano e o relatório de arquivos sem escrever nada.                                                               |
| `--no-install`                   | Copia os arquivos sem instalar pacotes npm.                                                                               |
| `--pm <npm\|pnpm\|yarn\|bun>`    | Força um gerenciador de pacotes.                                                                                          |
| `--alias <auto\|keep\|relative>` | Define como tratar imports `@/`. O padrão `auto` mantém o alias quando o `tsconfig` aponta para a raiz de código correta. |
| `--cwd <dir>`                    | Executa o CLI em outra pasta.                                                                                             |
| `-h, --help`                     | Mostra a ajuda.                                                                                                           |
| `-v, --version`                  | Mostra a versão.                                                                                                          |

### 🔍 Detecção automática

**Gerenciador de pacotes**, em ordem de prioridade:

1. Campo `packageManager` do `package.json`.
2. Lockfile existente (`pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`/`bun.lock`, `package-lock.json`).
3. Variável `npm_config_user_agent`.
4. Padrão: `npm`.

**Alias `@/`:** o CLI lê `tsconfig.json` ou `jsconfig.json` (aceita comentários) e verifica se `@/*` aponta para a raiz de código (`src` ou `.`).

### 🔄 Execução segura

Rodar o CLI novamente é seguro:

- Arquivos idênticos são marcados como inalterados. Diferenças apenas de fim de linha ou espaços finais são ignoradas.
- Arquivos que você editou são **mantidos** e listados no relatório.
- A sobrescrita exige `--force`.
- Com `--dry-run`, nada é escrito e nenhum pacote é instalado.

---

## ✅ 4. Componentes, dependências e destinos

O CLI resolve as dependências internas na ordem correta e instala apenas os pacotes npm que ainda não estão no `package.json`. Se o projeto já tiver uma versão major mais antiga de um pacote, o CLI avisa em vez de alterar a versão automaticamente.

### 📦 Componentes

| Componente                       | O que entrega                                                                                                            | Dependências internas               | Pacotes npm         |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- | ------------------- |
| `masked-utils`                   | Funções puras para moeda, número, data, hora, duração, nomes, cores e erros.                                             | –                                   | –                   |
| `masked-themes`                  | Tema base, nove temas prontos, `ThemeEngine` e `colorTheme`.                                                             | utils                               | `styled-components` |
| `masked-animations`              | Animações reveal, contínuas, controladas e one-shot, além de `useInView`.                                                | –                                   | `styled-components` |
| `masked-config`                  | `MaskedConfigProvider` global e opcional para link, imagem, toasts e locale.                                             | –                                   | –                   |
| `masked-skeleton`                | Placeholders de carregamento com shimmer e pulse.                                                                        | –                                   | `styled-components` |
| `masked-toaster`                 | Notificações `toast.success/error/info/warning/loading/promise`, sem biblioteca externa.                                 | –                                   | **nenhum**          |
| `masked-buttons`                 | Botões default, outline, ghost, soft, link, gradient, neon, split, toggle, switch, checkbox, radio e group.              | animations, themes, config (+utils) | `styled-components` |
| `masked-cards`                   | Cards polimórficos com 11 variantes, seis aparências, cinco layouts, mídia, seleção, agrupamento, expansão e composição. | utils, themes, config               | `styled-components` |
| `masked-drawer`                  | Painel lateral, superior ou inferior com overlay e focus-trap.                                                           | themes (+utils)                     | `styled-components` |
| `masked-popup`                   | Modal centralizado com overlay e focus-trap.                                                                             | themes (+utils)                     | `styled-components` |
| `masked-input`                   | Texto, textarea, senha, máscara, moeda, select, hora, arquivo e busca.                                                   | animations, themes, config, utils   | `styled-components` |
| `masked-input-formik`            | Versões ligadas ao Formik (`useField`) de cada variante do input.                                                        | input                               | `formik`            |
| `masked-hooks`                   | `useDebounce`, `useLocalStorage`, `useMediaQuery` e `useScrollToTop`.                                                    | –                                   | –                   |
| `masked-hooks-next` (só Next.js) | `useSafeReturn`: voltar para a rota de origem com segurança.                                                             | –                                   | (usa `next`)        |

> A coluna "Dependências internas" mostra as dependências diretas. As dependências transitivas são resolvidas automaticamente. Rode `npx masked-components --list` para ver a lista atual.
>
> `useInView` é instalado junto com `masked-animations`, e `useSmartSearch` junto com `masked-input`.

### 📁 Diretórios padrão

Considerando que o projeto tem uma pasta `src`. Sem ela, remova o prefixo `src/`.

```text
src/components/ui/     componentes
src/styles/            temas e animações
src/utils/             masked-utils/ (subpasta própria, nunca colide com seus arquivos)
src/hooks/             hooks
```

### ⚙️ Personalizando os diretórios

Crie um `masked.config.json` na raiz do projeto:

```json
{
  "paths": {
    "components": "src/ui",
    "styles": "src/theme",
    "utils": "src/lib",
    "hooks": "src/hooks"
  }
}
```

**Importante:** todos os caminhos precisam ficar dentro do projeto. Caminhos fora dele são rejeitados.

Quando o alias `@/` do `tsconfig` não corresponde aos destinos escolhidos, o CLI converte os imports dos arquivos copiados para caminhos relativos.

---

### Referência completa do MaskedCards

`masked-cards` instala uma coleção de cards polimórficos em React + TypeScript + styled-components. Um único componente, `<MaskedCards>`, despacha para 11 variantes usando a propriedade discriminadora `$variant`.

A API também oferece seis aparências, cinco layouts, proporções de mídia, seleção individual e em grupo, expansão de conteúdo e composição livre com primitives.

#### Instalação

```bash
npx masked-components add masked-cards
```

#### Variantes

| `$variant`    | Uso                                   | Props-chave                                                                                                          |
| ------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `metric`      | KPI com tendência.                    | `value`, `label`, `trend`, `trendValue`, `icon`, `badge`                                                             |
| `stat`        | Estatística simples ou dupla.         | `value`, `label`, `value2`, `label2`, `icon`                                                                         |
| `compare`     | Valor comparado com um baseline.      | `value`, `label`, `compareText`, `compareTrend`, `icon`                                                              |
| `product`     | Produto/e-commerce.                   | `title`, `image`, `price`, `originalPrice`, `priceFormat`, `badge`, `status`, `rating`, `actions`                    |
| `feature`     | Feature ou benefício.                 | `icon`, `title`, `description`, `highlight`, `action`                                                                |
| `plan`        | Plano atual ou assinatura contratada. | `planName`, `active`, `statusLabel`, `renewalDate`, `action`                                                         |
| `profile`     | Pessoa ou time.                       | `name`, `role`, `company`, `avatar`, `avatarFallback`, `bio`, `socials`, `actions`                                   |
| `article`     | Blog ou conteúdo editorial.           | `title`, `excerpt`, `image`, `category`, `author`, `authorAvatar`, `date`, `readTime`, `tags`, `actions`             |
| `service`     | Serviços ou marketplace.              | `title`, `image`, `description`, `price`, `pricePrefix`, `priceFormat`, `duration`, `badge`, `actions`               |
| `testimonial` | Depoimento de cliente.                | `quote`, `author`, `role`, `authorRole`, `company`, `avatar`, `avatarFallback`, `rating`, `ratingLabel`              |
| `pricing`     | Oferta ou tabela de preços.           | `planName`, `price`, `originalPrice`, `period`, `priceFormat`, `features`, `highlighted`, `badge`, `cta`, `footnote` |

`plan` representa um plano já associado à conta/assinatura. `pricing` representa uma oferta comercial que o usuário pode escolher. Use a variante correspondente ao contexto.

#### Aparências (`appearance`)

As seis aparências controlam o tratamento visual da superfície, independentemente da variante:

- `elevated` (padrão): superfície elevada com sombra.
- `filled`: superfície preenchida e delimitada principalmente pela cor.
- `outlined`: superfície com borda visível e tratamento mais discreto.
- `flat`: superfície sem elevação pronunciada.
- `gradient`: superfície com gradiente e cores de texto próprias.
- `glass`: superfície translúcida com `backdrop-filter`.

```tsx
<MaskedCards
  $variant="feature"
  title="Glass"
  description="Uma superfície translúcida."
  appearance="glass"
/>
```

`glass` utiliza `backdrop-filter` e possui fallback opaco via `@supports`. As aparências `filled`, `outlined` e `flat` derivam a cor do texto por contraste quando `colorTheme` está ativo.

#### Layouts e mídia

`layout` controla a disposição estrutural do conteúdo:

- `vertical` (padrão): conteúdo em coluna.
- `horizontal`: mídia e conteúdo lado a lado.
- `split`: divide visualmente a área de mídia e a área de conteúdo.
- `overlay`: sobrepõe o conteúdo à mídia usando um gradiente para legibilidade.
- `compact`: reduz a densidade e o espaçamento interno.

`mediaRatio` controla a proporção da mídia:

`1:1` · `4:3` · `16:9` · `21:9` · `3:4` · `9:16` · `auto`

A propriedade legada `direction` aceita `column` (padrão) ou `row`.

```tsx
<MaskedCards
  $variant="article"
  title="Como criar interfaces melhores"
  excerpt="Princípios práticos de design de interface."
  image="/images/article-cover.jpg"
  layout="horizontal"
  mediaRatio="4:3"
/>
```

Nos layouts `horizontal` e `split`, a mídia (`.mc-card-media`) é posicionada lateralmente. `overlay` sobrepõe o conteúdo à imagem com gradiente; `compact` reduz a densidade visual.

#### Seleção individual

Um card pode manter seu próprio estado de seleção ou receber o estado de forma controlada:

```tsx
// Avulso: estado interno não controlado
<MaskedCards
  $variant="plan"
  planName="Pro"
  selectionMode="single"
/>

// Controlado pelo componente pai
<MaskedCards
  $variant="plan"
  planName="Pro"
  selectionMode="multiple"
  selected={isPro}
  onSelectedChange={setIsPro}
/>
```

- `selectionMode="single"` utiliza semântica de radio (`role="radio"`).
- `selectionMode="multiple"` utiliza semântica de checkbox (`role="checkbox"`).
- Enter e Espaço alternam a seleção.
- `disabled` impede interação e seleção.
- `selected`, `defaultSelected` e `onSelectedChange` permitem controle externo ou interno.

#### MaskedCardGroup

Use `MaskedCardGroup` quando várias opções precisarem compartilhar uma seleção. O grupo coordena o valor e evita que cada card mantenha uma seleção independente.

```tsx
'use client'

import { useState } from 'react'
import { MaskedCards } from '@/components/ui/MaskedCards/MaskedCards'
import { MaskedCardGroup } from '@/components/ui/MaskedCards/Group/MaskedCardGroup'

export function PlanPicker() {
  const [plan, setPlan] = useState('free')

  return (
    <MaskedCardGroup
      selectionMode="single"
      value={plan}
      onValueChange={setPlan}
      ariaLabel="Planos disponíveis"
    >
      <MaskedCards $variant="plan" planName="Free" selectionValue="free" />
      <MaskedCards $variant="plan" planName="Pro" selectionValue="pro" />
    </MaskedCardGroup>
  )
}
```

Comportamento do grupo:

- `selectionMode="single"` usa `role="radiogroup"` no grupo e `role="radio"` nos cards.
- `selectionMode="multiple"` usa `role="group"` e checkboxes nos cards.
- `value`, `defaultValue` e `onValueChange` controlam a seleção. Em modo `single`, o valor é `string`; em modo `multiple`, é `string[]`.
- Cada card filho precisa de um `selectionValue` único.
- Roving `tabIndex` e navegação por setas (`←`, `→`, `↑`, `↓`) são suportados entre cards habilitados. `Home` e `End` levam ao primeiro e ao último card habilitado.

#### Expansão

Ative a expansão para revelar conteúdo adicional sem navegar para outra página:

```tsx
<MaskedCards
  $variant="article"
  title="Como criar interfaces melhores"
  excerpt="Um resumo do artigo."
  expandable
  expandContent={<p>Este é o conteúdo adicional exibido ao expandir o card.</p>}
  expandLabel="Ler mais"
  collapseLabel="Ler menos"
/>
```

A expansão utiliza um botão dedicado com `aria-expanded` e `aria-controls`. A região fica realmente oculta quando fechada e a transição respeita `prefers-reduced-motion`.

#### Composição livre

Para layouts personalizados, use as primitives exportadas pelo arquivo `CardParts`:

```tsx
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardFooter,
  CardActions
} from '@/components/ui/MaskedCards/Base/CardParts'

export function ArticlePreview() {
  return (
    <Card appearance="outlined" href="/post/1" hrefLabel="Abrir artigo">
      <CardMedia src="/images/cover.jpg" alt="" ratio="16:9" />
      <CardHeader>
        <strong>Título do artigo</strong>
      </CardHeader>
      <CardContent>Resumo do conteúdo...</CardContent>
      <CardFooter>Publicado em 12 nov 2026</CardFooter>
      <CardActions>
        <button type="button">Salvar</button>
      </CardActions>
    </Card>
  )
}
```

`Card` aceita as propriedades de `BaseCardProps`, incluindo `href`, `onClick`, `appearance`, `tokens`, seleção e expansão. `CardMedia` utiliza o `imageComponent` configurado no `MaskedConfigProvider` (por exemplo, `next/image`) e tem fallback para `<img>`.

#### Tokens `--mc-card-*`

A prioridade de resolução é:

**`tokens` da instância > `colorTheme` > tema global.**

| Token                                                              | Efeito                                                   |
| ------------------------------------------------------------------ | -------------------------------------------------------- |
| `bg`, `fg`, `mutedFg`, `border`, `radius`, `shadow`, `shadowHover` | Superfície, texto, borda, arredondamento e elevação.     |
| `accent`, `accentSoft`                                             | Destaques, badges e estados de seleção.                  |
| `success`, `danger`, `warning`, `neutralTrend`                     | Status e tendências.                                     |
| `iconBg`, `iconFg`                                                 | Fundo e conteúdo do badge de ícone.                      |
| `mediaBg`, `placeholderBg`                                         | Fundo de mídia e placeholders.                           |
| `selectedBg`, `selectedBorder`, `selectedFg`                       | Superfície, borda e texto do estado selecionado.         |
| `gradientFrom`, `gradientTo`, `gradientFg`, `gradientMutedFg`      | Cores da aparência `gradient`.                           |
| `glassBg`, `glassBorder`                                           | Fundo e borda da aparência `glass`.                      |
| `overlayGradient`, `overlayFg`                                     | Gradiente e texto do layout `overlay`.                   |
| `mediaRatio`                                                       | Proporção da mídia, em conjunto com a prop `mediaRatio`. |

Exemplo de override por instância:

```tsx
<MaskedCards
  $variant="product"
  title="Produto X"
  colorTheme="ruby"
  tokens={{
    radius: '20px',
    accentSoft: '#ffe4e6'
  }}
/>
```

#### Interatividade

- `href` renderiza um `<a>` ou utiliza o `linkComponent` configurado no provider.
- `onClick`, sem `href`, utiliza um `<button>` real.
- Quando `href` ou `onClick` são usados junto com `actions`, a área principal utiliza um link/botão esticado (_stretched link/button_) e as ações internas permanecem interativas por meio de camadas próprias (`z-index`).
- `hrefLabel` fornece um nome acessível ao link ou botão esticado.
- `disabled` bloqueia clique, seleção e expansão e comunica o estado com os atributos ARIA apropriados.

#### Acessibilidade

- Não são criados controles interativos aninhados: expansão e ações não ficam dentro do link ou botão esticado.
- `aria-checked`, `aria-expanded`, `aria-controls` e `aria-disabled` são aplicados de acordo com o estado e o comportamento do card.
- O contraste do texto é derivado com `readableTextOn` nas aparências suaves e no gradiente.
- Os elementos interativos possuem foco visível via `:focus-visible`.
- A região expansível é ocultada quando fechada e respeita `prefers-reduced-motion`.

#### Estrutura de arquivos do MaskedCards

A estrutura funcional do template é organizada por responsabilidade:

```text
MaskedCards/
  MaskedCards.tsx             # dispatcher por $variant
  MaskedCards.types.ts        # BaseCardProps, CardVariantMap e CardProps
  cardTokens.ts               # resolveCardTokens (colorTheme -> --mc-card-*)
  Base/
    BaseCard.tsx              # container interativo (link, clique, seleção e expansão)
    BaseCard.styles.ts        # container, stretched link/button, indicadores e layouts
    appearances.styles.ts     # estilos das seis aparências
    CardParts.tsx             # Card, CardHeader, CardMedia, CardContent, CardFooter e CardActions
    CardParts.styles.ts       # estilos das primitives
  behaviors/
    useSelectable.ts          # estado e comportamento de seleção
    useExpandable.ts          # estado e comportamento de expansão
    useCardGroup.ts           # integração com grupo
  Group/
    MaskedCardGroup.tsx       # componente de agrupamento
    MaskedCardGroup.types.ts  # tipos do grupo
    MaskedCardGroup.styles.ts # estilos do grupo
    cardGroupLogic.ts         # lógica de seleção e navegação
  variants/
    ...                       # 11 variantes, cada uma em sua pasta
```

---

## ✅ 5. Migrando para a versão 2.x

A versão 2.0 traz breaking changes pequenos, mas importantes. Alguns nomes antigos continuam funcionando como aliases depreciados, com aviso, para permitir migração gradual.

### 🔄 Props renomeadas (aliases `$*` depreciados)

| Antes (depreciado)   | Depois          |
| -------------------- | --------------- |
| `$variant`           | `variant`       |
| `$isActive`          | `active`        |
| `$position`          | `position`      |
| `$toggleLabel`       | `toggleLabel`   |
| `$checkboxLabel`     | `checkboxLabel` |
| `$active` (PlanCard) | `active`        |

> **Exceção atual:** `MaskedCards` ainda usa `$variant` na API pública. A renomeação para `variant` está prevista; não troque essa propriedade até que a API seja atualizada.

### ⚠️ Mudanças de comportamento

- **`boxShadow.*()` devolve apenas o valor da sombra**, por exemplo `0 1px 2px rgba(...)`, sem o prefixo `box-shadow:`. Use `box-shadow: ${theme.boxShadow.md()};` e remova usos que dependiam da declaração completa.
- **`CurrencyInput` emite `onChange` a cada dígito**, e não apenas no `blur`; também funciona com teclado virtual de celular.
- **Sem barrels em alguns templates:** `masked-hooks` e `masked-config` não instalam mais `index.ts`. Importe por arquivo, por exemplo `@/hooks/useDebounce` e `@/components/ui/MaskedConfigProvider`.
- **`react-icons`, `next/image` e `react-hot-toast` não são dependências dos templates.** Os ícones são internos e os componentes que exibem imagens permitem injeção pelo provider.
- **`useSmartSearch`** é instalado apenas por `masked-input` (em `components/ui/MaskedInput/hooks/`); **`useInView`** é instalado apenas por `masked-animations` (em `hooks/`). `masked-hooks` não instala cópias duplicadas desses hooks.

---

## ✅ 6. Configuração inicial

Todos os componentes funcionam sem provider, com fallbacks nativos. Ainda assim, os providers abaixo são úteis para configurar o comportamento global da aplicação.

### 🎨 Tema (`styled-components`)

Os componentes leem o tema do `styled-components`. Para trocar de tema em runtime, use o `ThemeEngineProvider`, fornecido por `masked-themes`:

```tsx
'use client'

import type { ReactNode } from 'react'
import { ThemeEngineProvider } from '@/styles/ThemeEngine/ThemeEngineProvider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeEngineProvider defaultTheme="dark" storageKey="my-app-theme">
      {children}
    </ThemeEngineProvider>
  )
}
```

Temas disponíveis: `default`, `dark`, `light`, `midnight`, `forest`, `aurora`, `slate`, `accent` e `pastel`.

A escolha é persistida em `localStorage`. Passe `storageKey={null}` para desativar a persistência.

Troque de tema com o hook ou com o botão pronto:

```tsx
import { useThemeEngine } from '@/styles/ThemeEngine/ThemeEngineProvider'
import { ThemeSwitcher } from '@/styles/ThemeEngine/ThemeSwitcher'

const { themeName, availableThemes, setThemeName } = useThemeEngine()
setThemeName('dark')

<ThemeSwitcher label="Theme" />
```

Se preferir um tema fixo, use apenas o `ThemeProvider` do `styled-components`:

```tsx
import { ThemeProvider } from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'

;<ThemeProvider theme={maskedTheme}>{children}</ThemeProvider>
```

### 🔧 Configuração global (opcional)

O `MaskedConfigProvider` configura uma única vez o link, o componente de imagem, os toasts e o locale:

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { MaskedConfigProvider } from '@/components/ui/MaskedConfigProvider'

;<MaskedConfigProvider
  config={{
    linkComponent: Link, // MaskedButton / MaskedCards com href
    imageComponent: Image, // CardMedia e previews de arquivos
    locale: 'pt-BR'
  }}
>
  {children}
</MaskedConfigProvider>
```

`linkComponent` e `imageComponent` são opcionais. Sem eles, os componentes usam os elementos HTML nativos como fallback.

### 🔔 Toaster (sem dependências externas)

```tsx
import { MaskedToaster, toast, maskedToastHandlers } from '@/components/ui/MaskedToaster'
import { MaskedConfigProvider } from '@/components/ui/MaskedConfigProvider'

// Na raiz, uma vez:
;<MaskedConfigProvider config={maskedToastHandlers}>
  {children}
  <MaskedToaster position="bottom-right" />
</MaskedConfigProvider>

// Em qualquer lugar:
toast.success('Salvo!')
toast.promise(save(), {
  loading: 'Enviando...',
  success: 'Pronto',
  error: 'Falhou'
})
```

Com `maskedToastHandlers`, os avisos do `FileInput` (tipo inválido, arquivo grande e upload) passam a aparecer como toasts.

### ✨ Animações

As animações não precisam de provider. As propriedades CSS usadas pelas bordas premium (`gold`/`silver`) são registradas automaticamente quando `MaskedAnimation` é importado.

---

## ✅ 7. Personalização com tokens

Os componentes que oferecem suporte a temas respondem a duas propriedades:

- `colorTheme`: nome de uma paleta (por exemplo, `baseBlue`, `baseLilac`, `ruby`) ou de um preset (`light`, `dark`).
- `tokens`: overrides granulares que são convertidos em variáveis CSS `--mc-*` na instância.

Precedência: **`tokens` > `colorTheme` > tema ativo**.

```tsx
<MaskedButton variant="default" colorTheme="baseLilac" tokens={{ radius: 999, 'bg-hover': '#222' }}>
  Salvar
</MaskedButton>
```

| Prefixo                          | Componentes                      | Exemplos de tokens                                                                            |
| -------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------- |
| `--mc-btn-*`                     | Botões                           | `bg`, `fg`, `border`, `radius`, `gradient`, `neon-*`, `danger-*`                              |
| `--mc-switch-*`                  | toggle, switch, checkbox e radio | `track-on`, `track-off`, `knob-bg`, `ring-focus`                                              |
| `--mc-card-*`                    | Cards                            | `bg`, `fg`, `mutedFg`, `border`, `accent`, `selected-*`, `gradient-*`, `glass-*`, `overlay-*` |
| `--mc-input-*`                   | Inputs                           | `bg`, `fg`, `border`, `focus-ring`, `placeholder`, `error-*`                                  |
| `--mc-drawer-*` / `--mc-popup-*` | Drawer e Popup                   | `overlay-bg`, `panel-bg`                                                                      |
| `--mc-skeleton-*`                | Skeleton                         | `base`, `highlight`, `duration`                                                               |
| `--mc-toast-*`                   | Toaster                          | `bg`, `fg`, `border`, `radius`, `success`, `error`, `z`                                       |

### Tokens específicos do MaskedCards

O `MaskedCards` possui tokens próprios com prefixo `--mc-card-*`. Os nomes usados na API de `tokens` são:

| Token                                                              | Efeito                                                         |
| ------------------------------------------------------------------ | -------------------------------------------------------------- |
| `bg`, `fg`, `mutedFg`, `border`, `radius`, `shadow`, `shadowHover` | Superfície, texto, borda e elevação.                           |
| `accent`, `accentSoft`                                             | Destaques, badges e seleção.                                   |
| `success`, `danger`, `warning`, `neutralTrend`                     | Status e tendências.                                           |
| `iconBg`, `iconFg`                                                 | Badge de ícone.                                                |
| `mediaBg`, `placeholderBg`                                         | Fundo de mídia e placeholder.                                  |
| `selectedBg`, `selectedBorder`, `selectedFg`                       | Estado selecionado.                                            |
| `gradientFrom`, `gradientTo`, `gradientFg`, `gradientMutedFg`      | Aparência gradient.                                            |
| `glassBg`, `glassBorder`                                           | Aparência glass.                                               |
| `overlayGradient`, `overlayFg`                                     | Layout overlay.                                                |
| `mediaRatio`                                                       | Proporção da mídia em conjunto com a propriedade `mediaRatio`. |

Exemplo de personalização de um card:

```tsx
<MaskedCards
  $variant="product"
  title="Produto X"
  colorTheme="ruby"
  tokens={{
    radius: '20px',
    accentSoft: '#ffe4e6'
  }}
/>
```

Você também pode registrar sua própria paleta:

```ts
import { registerColorTheme } from '@/styles/MaskedThemes/ColorThemes'

registerColorTheme('my-brand', {
  base: '#7c3aed',
  light40: '#c4b5fd',
  dark20: '#4c1d95',
  glow: 'rgba(124, 58, 237, 0.5)'
})
```

---

## ✅ 8. Atualizando os componentes

Como os arquivos são seus, atualizar é uma escolha consciente.

### 🔍 Ver o que mudou

```bash
npx masked-components --dry-run
```

O relatório lista, por arquivo, o que seria criado, sobrescrito, mantido (por já ter edições suas) ou ignorado (já idêntico).

### 📋 Aplicar

1. **Preservar suas edições:** rode o CLI sem `--force`. Arquivos diferentes são mantidos e listados para você comparar manualmente.
2. **Receber a versão nova de um arquivo:** apague o arquivo antigo e rode novamente, ou use `--force` para sobrescrever todos os arquivos diferentes.

Dica: faça um `git commit` antes de usar `--force`, para revisar o diff depois.

### 📂 Mudança de estrutura

Se você instalou uma versão antiga, os arquivos de utils agora ficam em `src/utils/masked-utils/` (por exemplo, `date.ts` e `index.ts`). Remova cópias antigas que estejam diretamente em `src/utils/` e atualize os imports para evitar duplicação.

---

## ✅ 9. Solução de problemas

| Sintoma                                                      | Causa provável e solução                                                                                   |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `package.json` não encontrado                                | Rode na raiz do projeto ou use `--cwd <pasta>`.                                                            |
| `Nenhum componente informado` em CI                          | Sem terminal interativo, informe IDs ou `--all`, junto com `--yes`.                                        |
| `Componente desconhecido`                                    | Veja os IDs válidos com `npx masked-components --list`.                                                    |
| `masked-hooks-next` só está disponível para `next`           | Esse componente só existe para projetos Next.js.                                                           |
| Imports `@/...` não resolvem                                 | Use `--alias relative` ou configure `paths` no `tsconfig`: `"@/*": ["./src/*"]`.                           |
| Arquivos listados como "mantidos"                            | Eles já existiam com conteúdo diferente. Compare manualmente ou use `--force` depois de revisar.           |
| Aviso de versão do `styled-components`                       | Os templates foram escritos para a versão 6. Atualize manualmente; o CLI não altera versões já instaladas. |
| Estilos aparecem sem tema ou em tom claro sobre fundo escuro | Envolva o app com `ThemeEngineProvider` (seção 6) e use um fundo compatível.                               |
| Warnings de props `$...` no console                          | Alguns nomes são aliases depreciados. Consulte a tabela da seção 5.                                        |
| Imagem de `CardMedia` não usa `next/image`                   | Configure `imageComponent` no `MaskedConfigProvider`; sem ele, o componente utiliza o fallback nativo.     |
| A seleção de vários cards não é coordenada                   | Envolva as opções em `MaskedCardGroup` e forneça `selectionValue` único para cada card.                    |

---

## ✅ 10. Desenvolvimento

### 💻 Comandos

```bash
npm install             # instala dependências do CLI
npm run typecheck       # verifica os tipos do CLI
npm test                # testes unitários e integridade dos templates
npm run lint            # ESLint
npm run format          # Prettier
npm run build           # gera dist/ (tsup)
npm run prepublishOnly  # typecheck + lint + testes + build, conforme o script do package.json
```

### 🧪 Registry e integridade dos templates

O arquivo `src/registry.ts` é a **única fonte de verdade** para:

- em qual pasta cada template é instalado;
- as dependências internas entre componentes;
- os pacotes npm necessários;
- avisos e notas de uso por componente.

O teste `src/tests/cli/templates-integrity.test.ts` simula a instalação de cada componente (com suas dependências) e confere que:

1. toda pasta citada no registry existe em `templates/`;
2. todo import resolve para um arquivo que será instalado ou para um pacote declarado;
3. ao instalar tudo, dois templates nunca escrevem o mesmo arquivo com conteúdos diferentes.

Se um template importar algo não registrado, o teste falha, impedindo a publicação de uma dependência esquecida.

### ➕ Adicionando um componente

1. Crie a pasta em `templates/<nome>/`.
2. Registre o componente em `src/registry.ts` (`id`, `templates`, `requires`, `dependencies`, `notes`).
3. Se precisar de um pacote npm novo, declare-o em `dependencies` (ou em `externals`, quando pertencer ao framework).
4. Escreva ou ajuste um teste em `src/tests/` e rode `npm test`.
5. Documente o componente na tabela da seção 4 deste README.

---

## ✅ 11. Licença

MIT © Renato Minoita
