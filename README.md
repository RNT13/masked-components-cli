# Masked Components CLI

Copy-in React + TypeScript components. The CLI **copies the source code into your project** (like shadcn/ui): you own the files, you can edit anything, and there is no runtime dependency on this package.

```bash
npx masked-components-cli
```

Pick the components you want; the CLI figures out what else they need, installs the missing npm packages with **your** package manager (npm, pnpm, yarn or bun) and copies the files.

---

**## 📖 Índice**

1. [**Como Funciona**](#-1-como-funciona)
2. [**Requisitos do Projeto**](#-2-requisitos-do-projeto)
3. [**Como Usar**](#-3-como-usar)
4. [**Componentes, Dependências e Destinos**](#-4-componentes-dependências-e-destinos)
5. [**Migrando para a Versão 2.x**](#-5-migrando-para-a-versão-2x)
6. [**Configuração do Tema**](#-6-configuração-do-tema)
7. [**Atualizando os Componentes**](#-7-atualizando-os-componentes)
8. [**Desenvolvimento**](#-8-desenvolvimento)
9. [**Licença**](#-9-licença)

---

**# ✅ 1. Como Funciona**

O Masked Components CLI permite instalar componentes React com TypeScript diretamente no código-fonte do seu projeto.

Diferentemente de bibliotecas tradicionais, os componentes são copiados para dentro da sua aplicação, seguindo uma abordagem semelhante ao **shadcn/ui**.

**Principais características:**

- **Copy-in:** O código-fonte dos componentes é copiado diretamente para o seu projeto.
- **Controle total:** Você pode editar, personalizar e adaptar qualquer componente.
- **Sem dependência em runtime:** Depois da instalação, não existe dependência de execução com o pacote `masked-components-cli`.
- **Instalação inteligente:** O CLI identifica automaticamente os componentes necessários e suas dependências.
- **Gerenciamento de pacotes:** Instala os pacotes npm utilizando o gerenciador de pacotes do seu projeto.

---

**# ✅ 2. Requisitos do Projeto**

Antes de utilizar o CLI, seu projeto precisa atender aos seguintes requisitos.

**## 📋 Requisitos obrigatórios**

- Um arquivo `package.json` na raiz do projeto. Execute o CLI nessa pasta ou utilize `--cwd`.
- React e **TypeScript**, pois os templates utilizam arquivos `.ts` e `.tsx`.

**## 🌐 Compatibilidade**

O CLI funciona com:

- Next.js
- Vite
- Remix
- Create React App (CRA)

**Resolução de imports:**

Quando o projeto não possui o alias `@/`, os imports são automaticamente convertidos para caminhos relativos.

**Exceção:**

A variante `file` do componente de input utiliza `next/image` e, atualmente, funciona somente com Next.js. O CLI exibe um aviso quando essa variante é utilizada em outro ambiente.

---

**# ✅ 3. Como Usar**

**## 🚀 Instalação e execução**

Execute o comando abaixo na raiz do seu projeto:

```bash
npx masked-components-cli
```

O CLI apresentará uma interface interativa para selecionar os componentes desejados.

**## 💻 Exemplos de utilização**

```bash
# Execução interativa
npx masked-components-cli

# Instalar componentes específicos
npx masked-components-cli masked-buttons masked-cards

# Instalar todos os componentes
npx masked-components-cli --all

# Listar componentes disponíveis
npx masked-components-cli --list

# Simular a instalação sem modificar arquivos
npx masked-components-cli masked-input --dry-run
```

**## ⚙️ Opções disponíveis**

| Opção                            | Ação                                                                                                                    |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `-l, --list`                     | Lista os componentes disponíveis                                                                                        |
| `-y, --yes`                      | Executa sem solicitar confirmações                                                                                      |
| `-f, --force`                    | Sobrescreve arquivos existentes que apresentam diferenças. Sem essa opção, eles são mantidos e reportados               |
| `--dry-run`                      | Exibe o plano de instalação e o relatório de arquivos sem escrever nada                                                 |
| `--no-install`                   | Copia os arquivos sem modificar o `package.json`                                                                        |
| `--pm <npm\|pnpm\|yarn\|bun>`    | Força o uso de um gerenciador de pacotes específico                                                                     |
| `--alias <auto\|keep\|relative>` | Define como tratar imports `@/`. O padrão `auto` mantém o alias somente quando o `tsconfig` aponta para a pasta correta |
| `--cwd <dir>`                    | Executa o CLI em outra pasta                                                                                            |

**Detecção automática do gerenciador de pacotes:**

Por padrão, o CLI identifica o gerenciador de pacotes utilizando esta ordem de informações:

1. Campo `packageManager` do `package.json`.
2. Lockfile existente no projeto.
3. Variável `npm_config_user_agent`.

**## 🔄 Instalação segura**

Executar o CLI novamente é seguro:

- Arquivos idênticos são identificados como inalterados.
- Arquivos que foram modificados manualmente são mantidos.
- Arquivos diferentes são reportados ao usuário.
- A sobrescrita de arquivos existentes exige a opção `--force`.

---

**# ✅ 4. Componentes, Dependências e Destinos**

O CLI identifica automaticamente as dependências necessárias para cada componente e instala os pacotes npm correspondentes.

**## 📦 Componentes e dependências**

| Componente                         | Dependências internas | Pacotes npm                                           |
| ---------------------------------- | --------------------- | ----------------------------------------------------- |
| `masked-themes`                    | –                     | `styled-components`                                   |
| `masked-animations`                | –                     | `styled-components`                                   |
| `masked-skeleton`                  | –                     | `styled-components`                                   |
| `masked-buttons`                   | animations, themes    | `styled-components`, `react-icons`                    |
| `masked-cards`                     | themes                | `styled-components`                                   |
| `masked-drawer`                    | themes                | `styled-components`                                   |
| `masked-popup`                     | –                     | `styled-components`                                   |
| `masked-input`                     | animations, themes    | `styled-components`, `react-icons`, `react-hot-toast` |
| `masked-input-formik`              | input                 | `formik`                                              |
| `masked-utils`                     | –                     | –                                                     |
| `masked-hooks`                     | –                     | –                                                     |
| `masked-hooks-next` (Next.js only) | –                     | –                                                     |

**## 📁 Diretórios padrão**

Os arquivos são organizados nos seguintes diretórios, considerando que o projeto possui uma pasta `src`.

Sem uma pasta `src`, basta remover esse prefixo dos caminhos.

```text
src/components/ui/   components
src/styles/          themes, animations
src/utils/           color helpers; masked-utils/ (own sub-folder, never collides with your files)
src/hooks/            hooks
```

**## ⚙️ Personalizando os diretórios**

É possível alterar os destinos dos arquivos utilizando o arquivo `masked.config.json` na raiz do projeto.

Exemplo:

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

**Importante:** Todos os caminhos configurados devem permanecer dentro do diretório do projeto.

---

**# ✅ 5. Migrando para a Versão 2.x**

A versão 2.0 traz **breaking changes** pequenos, mas importantes.

A compatibilidade retroativa é mantida por meio de **aliases depreciados**. Dessa forma, o código antigo continua funcionando, mas apresenta warnings.

**## 🔄 Props renomeadas (aliases `$*` depreciados)**

| Antes (depreciado)   | Depois          |
| -------------------- | --------------- |
| `$variant`           | `variant`       |
| `$isActive`          | `active`        |
| `$position`          | `position`      |
| `$toggleLabel`       | `toggleLabel`   |
| `$checkboxLabel`     | `checkboxLabel` |
| `$active` (PlanCard) | `active`        |

**## 🎨 Novos tokens de componente (`--mc-*`)**

Todos os componentes respondem a `colorTheme` e `tokens` (inline CSS vars), com fallback para `maskedTheme`.

**Tokens disponíveis:**

- `--mc-btn-*`: bg, fg, radius, border, hover, active, gradient-_, neon-_, switch-*.
- `--mc-card-*`: bg, fg, muted-fg, border, accent-_, placeholder-bg, plan-_.
- `--mc-input-*`: bg, border, focus-ring, placeholder, label-fg, error-*, disabled-bg.
- `--mc-drawer-*` / `--mc-popup-*`: overlay-bg, panel-bg.

**Exemplo de utilização:**

```tsx
<MaskedButton colorTheme="dark" tokens={{ bg: 'rebeccapurple' }} />
```

---

**# ✅ 6. Configuração do Tema**

Os componentes utilizam o tema do `styled-components`.

Para que os botões tenham acesso às configurações de tema, envolva sua aplicação com `ThemeProvider` uma única vez.

**## 🎨 Configurando o ThemeProvider**

```tsx
import { ThemeProvider } from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'

;<ThemeProvider theme={maskedTheme}>{children}</ThemeProvider>
```

**## ✨ Animações**

As animações não precisam de um provider.

As propriedades CSS utilizadas pelas bordas premium são registradas automaticamente.

---

**# ✅ 7. Atualizando os Componentes**

Para atualizar os componentes, execute o CLI novamente com `--dry-run` para visualizar as alterações nos templates antes de aplicar qualquer modificação.

**## 🔍 Verificando atualizações**

```bash
npx masked-components-cli --dry-run
```

**## 📋 Aplicando as atualizações**

Existem duas maneiras de atualizar os arquivos:

1. **Manter suas modificações:**

   Execute o CLI sem `--force`. Os arquivos que apresentam diferenças serão listados como mantidos (`kept`).

2. **Instalar a nova versão de um arquivo:**

   Exclua o arquivo antigo antes de executar novamente ou utilize `--force` para sobrescrevê-lo.

**## 📂 Alteração na estrutura de diretórios**

Se você instalou uma versão anterior, alguns arquivos que ficavam diretamente em `src/utils/` agora são instalados em:

```text
src/utils/masked-utils/
```

Exemplos:

- `date.ts`
- `index.ts`

Remova as cópias antigas e atualize os imports correspondentes para evitar conflitos.

---

**# ✅ 8. Desenvolvimento**

**## 💻 Instalação e execução local**

Para trabalhar no desenvolvimento do CLI, utilize os comandos abaixo:

```bash
# Instalar dependências
npm install

# Verificar os tipos TypeScript
npm run typecheck

# Executar os testes unitários e verificações de integridade
npm test

# Gerar o build
npm run build
```

**## 🧪 Integridade dos templates**

O arquivo `src/registry.ts` é a única fonte de verdade (_single source of truth_) para:

- Definir em qual pasta cada template deve ser instalado.
- Determinar as dependências internas de cada componente.
- Identificar os pacotes npm necessários.

O teste `src/tests/cli/templates-integrity.test.ts` verifica se os imports utilizados pelos templates estão contemplados no registry.

Caso um template importe uma dependência que não esteja registrada, o teste falha, impedindo que uma dependência ausente seja distribuída.

---

**# ✅ 9. Licença**

MIT © Renato Minoita
