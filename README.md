# ✨ Masked Components CLI

Componentes **React + TypeScript** no modelo _copy-in_. O CLI **copia o código-fonte para dentro do seu projeto** (como o shadcn/ui): os arquivos passam a ser seus, você edita o que quiser e não existe dependência de runtime deste pacote.

```bash
npx masked-components-cli
```

Escolha os componentes. O CLI descobre o que mais eles precisam, instala os pacotes npm que faltam com o **seu** gerenciador (npm, pnpm, yarn ou bun) e copia os arquivos.

🌐 **Site e playground:** https://masked-components.vercel.app/

---

## 📖 Índice

1. [Como Funciona](#-1-como-funciona)
2. [Requisitos do Projeto](#-2-requisitos-do-projeto)
3. [Como Usar](#-3-como-usar)
4. [Componentes, Dependências e Destinos](#-4-componentes-dependências-e-destinos)
5. [Migrando para a Versão 2.x](#-5-migrando-para-a-versão-2x)
6. [Configuração Inicial](#-6-configuração-inicial)
7. [Personalização com Tokens](#-7-personalização-com-tokens)
8. [Atualizando os Componentes](#-8-atualizando-os-componentes)
9. [Solução de Problemas](#-9-solução-de-problemas)
10. [Desenvolvimento](#-10-desenvolvimento)
11. [Licença](#-11-licença)

---

## ✅ 1. Como Funciona

Diferentemente de bibliotecas tradicionais, os componentes são copiados para dentro da sua aplicação, e não importados de `node_modules`.

**Principais características:**

- **Copy-in:** o código-fonte vai direto para o seu projeto.
- **Controle total:** edite, personalize e adapte qualquer componente.
- **Sem dependência em runtime:** depois da instalação, nada depende do pacote `masked-components-cli`.
- **Instalação inteligente:** o CLI resolve as dependências internas (ex.: botões precisam de tema, animações e config).
- **Gerenciador de pacotes:** instala os pacotes npm com o que o seu projeto já usa.
- **Independentes:** cada componente é instalável sozinho, com imports sempre por arquivo.
- **Seguro para rodar de novo:** nunca sobrescreve edições suas sem `--force`.

---

## ✅ 2. Requisitos do Projeto

### 📋 Obrigatórios

- Node.js **18.19 ou superior** (para rodar o CLI).
- Um `package.json` na raiz do projeto. Rode o CLI nessa pasta ou use `--cwd`.
- **React 18 ou superior** (os templates usam `useSyncExternalStore`).
- **TypeScript**, pois os templates são arquivos `.ts` e `.tsx`.

### 🌐 Compatibilidade

Funciona com **Next.js**, **Vite**, **Remix** e **Create React App**. O framework é detectado pelo `package.json`.

Se o projeto não tiver o alias `@/`, os imports são convertidos automaticamente para caminhos relativos (veja `--alias`).

### 🔗 Sobre `next`

Apenas o `masked-hooks-next` (`useSafeReturn`) depende de `next`, e por isso só pode ser instalado em projetos Next.js. Os demais componentes não dependem de framework: imagens e links são injetáveis via `MaskedConfigProvider`.

---

## ✅ 3. Como Usar

### 🚀 Execução

Na raiz do seu projeto:

```bash
npx masked-components-cli
```

O CLI abre uma lista interativa. Marque com `espaço` e confirme com `enter`.

### 💻 Exemplos

```bash
# Execução interativa
npx masked-components-cli

# Componentes específicos (o prefixo "add" é opcional)
npx masked-components-cli masked-buttons masked-cards
npx masked-components-cli add masked-toaster

# Instalar tudo (ignora o que é de outro framework)
npx masked-components-cli --all

# Listar componentes e suas dependências
npx masked-components-cli --list

# Simular, sem escrever nada
npx masked-components-cli masked-input --dry-run

# Instalar ignorando o package.json (só copia arquivos)
npx masked-components-cli masked-popup --no-install
```

### ⚙️ Opções

| Opção                            | Ação                                                                                                      |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `-l, --list`                     | Lista os componentes disponíveis                                                                          |
| `--all`                          | Instala todos os componentes compatíveis com o framework detectado                                        |
| `-y, --yes`                      | Não pergunta nada (aceita o plano). Obrigatório em ambientes sem terminal interativo (CI)                 |
| `-f, --force`                    | Sobrescreve arquivos existentes que sejam diferentes. Sem isso, eles são mantidos e reportados            |
| `--dry-run`                      | Mostra o plano e o relatório de arquivos sem escrever nada                                                |
| `--no-install`                   | Copia os arquivos sem instalar pacotes npm                                                                |
| `--pm <npm\|pnpm\|yarn\|bun>`    | Força um gerenciador de pacotes                                                                           |
| `--alias <auto\|keep\|relative>` | Como tratar imports `@/`. O padrão `auto` mantém o alias só quando o `tsconfig` aponta para a pasta certa |
| `--cwd <dir>`                    | Roda o CLI em outra pasta                                                                                 |
| `-h, --help`                     | Mostra a ajuda                                                                                            |
| `-v, --version`                  | Mostra a versão                                                                                           |

### 🔍 Detecção automática

**Gerenciador de pacotes**, em ordem de prioridade:

1. Campo `packageManager` do `package.json`.
2. Lockfile existente (`pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`/`bun.lock`, `package-lock.json`).
3. Variável `npm_config_user_agent`.
4. Padrão: `npm`.

**Alias `@/`:** o CLI lê `tsconfig.json`/`jsconfig.json` (aceita comentários) e verifica se `@/*` aponta para a raiz de código (`src` ou `.`).

### 🔄 Execução segura

Rodar o CLI de novo é seguro:

- Arquivos idênticos são marcados como inalterados (diferenças só de fim de linha ou espaço final são ignoradas).
- Arquivos que você editou são **mantidos** e listados no relatório.
- A sobrescrita exige `--force`.
- Com `--dry-run`, nada é escrito e nenhum pacote é instalado.

---

## ✅ 4. Componentes, Dependências e Destinos

O CLI resolve as dependências internas na ordem certa e instala só os pacotes npm que ainda não estão no seu `package.json`. Se o projeto já tem uma versão major mais antiga de um pacote, ele avisa em vez de alterar.

### 📦 Componentes

| Componente                       | O que entrega                                                                                       | Deps internas                       | Pacotes npm         |
| -------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------- |
| `masked-utils`                   | Funções puras: moeda, número, data, hora, duração, nomes, cores, erros                              | –                                   | –                   |
| `masked-themes`                  | Tema base, 9 temas prontos, `ThemeEngine`, `colorTheme`                                             | utils                               | `styled-components` |
| `masked-animations`              | Animações reveal, contínuas, controladas e one-shot + `useInView`                                   | –                                   | `styled-components` |
| `masked-config`                  | `MaskedConfigProvider` global e opcional (link, imagem, toasts, locale)                             | –                                   | –                   |
| `masked-skeleton`                | Placeholder de carregamento (shimmer/pulse)                                                         | –                                   | `styled-components` |
| `masked-toaster`                 | Notificações `toast.success/error/info/warning/loading/promise`, sem libs                           | –                                   | **nenhum**          |
| `masked-buttons`                 | default, outline, ghost, soft, link, gradient, neon, split, toggle, switch, checkbox, radio e group | animations, themes, config (+utils) | `styled-components` |
| `masked-cards`                   | metric, stat, compare, product, feature e plan                                                      | utils, themes, config               | `styled-components` |
| `masked-drawer`                  | Painel lateral/superior/inferior com overlay e focus-trap                                           | themes (+utils)                     | `styled-components` |
| `masked-popup`                   | Modal centralizado com overlay e focus-trap                                                         | themes (+utils)                     | `styled-components` |
| `masked-input`                   | texto, textarea, senha, máscara, moeda, select, hora, arquivo e busca                               | animations, themes, config, utils   | `styled-components` |
| `masked-input-formik`            | Versões ligadas ao Formik (`useField`) de cada variante do input                                    | input                               | `formik`            |
| `masked-hooks`                   | `useDebounce`, `useLocalStorage`, `useMediaQuery`, `useScrollToTop`                                 | –                                   | –                   |
| `masked-hooks-next` (só Next.js) | `useSafeReturn`: voltar para a rota de origem com segurança                                         | –                                   | (usa `next`)        |

> A coluna "Deps internas" mostra as dependências diretas. As transitivas entram sozinhas. Rode `npx masked-components-cli --list` para ver a lista atual.

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

Quando o alias `@/` do `tsconfig` não bate com os destinos escolhidos, o CLI converte os imports dos arquivos copiados para caminhos relativos.

---

## ✅ 5. Migrando para a Versão 2.x

A versão 2.0 traz **breaking changes** pequenos, mas importantes. Os nomes antigos continuam funcionando como **aliases depreciados** (com aviso), então o código existente não quebra de imediato.

### 🔄 Props renomeadas (aliases `$*` depreciados)

| Antes (depreciado)   | Depois          |
| -------------------- | --------------- |
| `$variant`           | `variant`       |
| `$isActive`          | `active`        |
| `$position`          | `position`      |
| `$toggleLabel`       | `toggleLabel`   |
| `$checkboxLabel`     | `checkboxLabel` |
| `$active` (PlanCard) | `active`        |

> `MaskedCards` ainda usa `$variant` na API pública; a renomeação para `variant` está prevista.

### ⚠️ Mudanças de comportamento

- **`boxShadow.*()` devolve só o valor** da sombra (ex.: `0 1px 2px rgba(...)`), sem o prefixo `box-shadow:`. Troque `box-shadow: ${boxShadow.md()}` por `box-shadow: ${theme.boxShadow.md()};` e remova usos que dependiam da declaração completa.
- **`CurrencyInput` emite `onChange` a cada dígito** (antes só no `blur`) e passou a funcionar com teclado virtual de celular.
- **Sem barrels.** `masked-hooks` e `masked-config` não instalam mais `index.ts`. Importe por arquivo (`@/hooks/useDebounce`, `@/components/ui/MaskedConfigProvider`).
- **`react-icons`, `next/image` e `react-hot-toast` não são mais dependências** dos templates. Ícones são internos e a imagem do `FileInput` é injetável.
- **`useSmartSearch`** continua instalado por `masked-input` e também por `masked-hooks`.

---

## ✅ 6. Configuração Inicial

Todos os componentes funcionam **sem provider** (com fallbacks nativos), mas dois providers valem a pena na raiz do app.

### 🎨 Tema (styled-components)

Os componentes leem o tema do `styled-components`. Para trocar de tema em runtime, use o `ThemeEngineProvider` (vem com `masked-themes`):

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

- Temas disponíveis: `default`, `dark`, `light`, `midnight`, `forest`, `aurora`, `slate`, `accent`, `pastel`.
- A escolha é persistida em `localStorage` (passe `storageKey={null}` para desativar).
- Troque de tema com o hook ou com o botão pronto:

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

### 🔧 Config global (opcional)

O `MaskedConfigProvider` configura, uma única vez, o link, a imagem, os toasts e o locale:

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { MaskedConfigProvider } from '@/components/ui/MaskedConfigProvider'

;<MaskedConfigProvider
  config={{
    linkComponent: Link, // MaskedButton / MaskedCards com href
    imageComponent: Image, // preview do FileInput
    locale: 'pt-BR'
  }}
>
  {children}
</MaskedConfigProvider>
```

### 🔔 Toaster (sem dependências)

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
toast.promise(save(), { loading: 'Enviando...', success: 'Pronto', error: 'Falhou' })
```

Com `maskedToastHandlers`, os avisos do `FileInput` (tipo inválido, arquivo grande, upload) passam a aparecer como toasts.

### ✨ Animações

Não precisam de provider. As propriedades CSS usadas pelas bordas premium (gold/silver) são registradas automaticamente quando `MaskedAnimation` é importado.

---

## ✅ 7. Personalização com Tokens

Todo componente responde a duas props:

- `colorTheme`: nome de uma paleta (ex.: `baseBlue`, `baseLilac`, `ruby`) ou de um preset (`light`, `dark`).
- `tokens`: overrides granulares, que viram variáveis CSS `--mc-*` na instância.

Precedência: **`tokens` > `colorTheme` > tema ativo**.

```tsx
<MaskedButton variant="default" colorTheme="baseLilac" tokens={{ radius: 999, 'bg-hover': '#222' }}>
  Salvar
</MaskedButton>
```

| Prefixo                          | Componentes                     | Exemplos de tokens                                               |
| -------------------------------- | ------------------------------- | ---------------------------------------------------------------- |
| `--mc-btn-*`                     | Botões                          | `bg`, `fg`, `border`, `radius`, `gradient`, `neon-*`, `danger-*` |
| `--mc-switch-*`                  | toggle, switch, checkbox, radio | `track-on`, `track-off`, `knob-bg`, `ring-focus`                 |
| `--mc-card-*`                    | Cards                           | `bg`, `fg`, `muted-fg`, `border`, `accent`, `plan-*`             |
| `--mc-input-*`                   | Inputs                          | `bg`, `fg`, `border`, `focus-ring`, `placeholder`, `error-*`     |
| `--mc-drawer-*` / `--mc-popup-*` | Drawer e Popup                  | `overlay-bg`, `panel-bg`                                         |
| `--mc-skeleton-*`                | Skeleton                        | `base`, `highlight`, `duration`                                  |
| `--mc-toast-*`                   | Toaster                         | `bg`, `fg`, `border`, `radius`, `success`, `error`, `z`          |

Você também pode registrar a sua própria paleta:

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

## ✅ 8. Atualizando os Componentes

Como os arquivos são seus, atualizar é uma escolha consciente.

### 🔍 Ver o que mudou

```bash
npx masked-components-cli --dry-run
```

O relatório lista, por arquivo, o que seria criado, sobrescrito, mantido (por já ter edições suas) ou ignorado (já idêntico).

### 📋 Aplicar

1. **Preservar suas edições:** rode o CLI sem `--force`. Arquivos diferentes são **mantidos** e listados para você comparar manualmente.
2. **Receber a versão nova de um arquivo:** apague o arquivo antigo e rode de novo, ou use `--force` para sobrescrever tudo que for diferente.

Dica: faça `git commit` antes de usar `--force`, para revisar o diff depois.

### 📂 Mudança de estrutura

Se você instalou uma versão antiga, os arquivos de utils agora ficam em `src/utils/masked-utils/` (ex.: `date.ts`, `index.ts`). Remova as cópias antigas de `src/utils/` e atualize os imports para evitar duplicação.

---

## ✅ 9. Solução de Problemas

| Sintoma                                                      | Causa provável e solução                                                                            |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `package.json não encontrado`                                | Rode na raiz do projeto ou use `--cwd <pasta>`                                                      |
| `Nenhum componente informado` em CI                          | Sem terminal interativo é preciso passar ids ou `--all`, junto com `--yes`                          |
| `Componente desconhecido`                                    | Veja os ids válidos com `--list`                                                                    |
| `"masked-hooks-next" só está disponível para: next`          | Esse componente só existe para Next.js                                                              |
| Imports `@/...` não resolvem                                 | Use `--alias relative`, ou configure `paths` no `tsconfig`: `"@/*": ["./src/*"]`                    |
| Arquivos listados como "mantidos"                            | Eles já existiam com conteúdo diferente. Compare à mão ou use `--force`                             |
| Aviso de versão do `styled-components`                       | Os templates foram escritos para a v6. Atualize manualmente; o CLI não altera versões já instaladas |
| Estilos aparecem sem tema ou em tom claro sobre fundo escuro | Envolva o app com `ThemeEngineProvider` (seção 6) e use um fundo compatível                         |
| Warnings de props `$...` no console                          | São aliases depreciados. Veja a tabela da seção 5                                                   |

---

## ✅ 10. Desenvolvimento

### 💻 Comandos

```bash
npm install          # dependências
npm run typecheck    # verificação de tipos do CLI
npm test             # testes unitários e integridade dos templates
npm run lint         # eslint
npm run format       # prettier
npm run build        # gera dist/ (tsup)
```

`npm publish` roda `typecheck`, `test` e `build` automaticamente (`prepublishOnly`).

### 🧪 Registry e integridade dos templates

O arquivo `src/registry.ts` é a **única fonte de verdade** para:

- em qual pasta cada template é instalado;
- as dependências internas entre componentes;
- os pacotes npm necessários;
- avisos e notas de uso por componente.

O teste `src/tests/cli/templates-integrity.test.ts` simula a instalação de cada componente (com suas dependências) e confere que:

1. toda pasta citada no registry existe em `templates/`;
2. todo import resolve para um arquivo que será instalado ou para um pacote declarado;
3. instalando tudo, dois templates nunca escrevem o mesmo arquivo com conteúdos diferentes.

Se um template importar algo não registrado, o teste falha, o que impede publicar uma dependência esquecida.

### ➕ Adicionando um componente

1. Crie a pasta em `templates/<nome>/`.
2. Registre em `src/registry.ts` (`id`, `templates`, `requires`, `dependencies`, `notes`).
3. Se precisar de um pacote npm novo, declare em `dependencies` (ou `externals`, quando for do framework).
4. Escreva ou ajuste um teste em `src/tests/` e rode `npm test`.
5. Documente na tabela da seção 4 deste README.

---

## ✅ 11. Licença

MIT © Renato Minoita
