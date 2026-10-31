# Auditoria do masked-components-cli

Revisão completa do repositório (CLI + `templates/`) feita a partir do repomix. A meta que guiou a revisão: **uma lib universal de componentes TypeScript, que instala o código limpo no projeto do usuário, de forma segura, com ou sem React/Next**.

## Resumo

A arquitetura copy-in é a escolha certa, e a base de componentes tem bom nível. O problema estava no **instalador**: nove achados críticos faziam a instalação produzir um projeto que **não compila**, mesmo nos casos felizes. Quase todos têm a mesma causa: a CLI copiava arquivos sem saber o que eles importam.

A correção estrutural é o `src/registry.ts`, que declara para cada componente as pastas de template, os componentes exigidos e os pacotes npm. Um teste (`templates-integrity.test.ts`) compara esse registro com os imports reais dos templates e falha se algo ficar de fora. Daqui em diante, um import esquecido deixa de chegar ao usuário.

### O que foi verificado

| Verificação | Resultado |
| --- | --- |
| `tsc --noEmit` da CLI | limpo |
| Suíte de testes | 83 testes, 12 arquivos, passando |
| Utils de data/hora | testados em 3 fusos (UTC, America/Sao_Paulo, Pacific/Auckland) |
| Templates alterados | compilam em TypeScript 4.9.5 e na versão mais recente, com `strict` + `noUncheckedIndexedAccess` |
| Build (`tsup`) | ok, shebang preservado |
| CLI de verdade | projeto Next com alias (mantém `@/`), projeto Vite com pnpm sem alias (converte para relativo), instalação real de pacote via npm, execução repetida sem mudanças, erros com saída 1 |
| Teste de integridade no estado atual do repo | **falha** nos pontos C4–C6 abaixo; **passa** com as correções |

### Limites do que verifiquei

- O teste de integridade rodou contra **esqueletos** dos templates (arquivos que contêm só os imports reais, extraídos do repomix), não contra os arquivos completos. Rodar `npm test` no repo real é a verificação final. Se ele apontar algo novo, o registro ou o template precisa ajustar.
- Não compilei os componentes completos num projeto de teste. Isso é o Passo 7 do plano (matriz Next/Vite/Remix/CRA).
- Os testes dos utils que não mudei (`color`, `currency`, `error`, `name`, `number`, `weekday`) não foram reexecutados por mim; continuam como estão no repo.

---

## 1. Críticos: a instalação produz um projeto quebrado

| # | Achado | Corrigido? |
| --- | --- | --- |
| C1 | `installDeps([])` em 9 dos 10 instaladores: **nenhum pacote npm é instalado**. `styled-components`, `react-icons`, `react-hot-toast` e `formik` ficam faltando e o build quebra. | Sim: `registry.ts` + `installDeps.ts` (só instala o que falta, avisa major antiga) |
| C2 | Dependências **entre componentes** não eram resolvidas: botões e input importam animations/themes; cards e drawer importam themes. Escolher só "Masked Buttons" instalava arquivos que importam caminhos inexistentes. | Sim: campo `requires` no registro |
| C3 | Todos os templates usam alias `@/…`. Em Vite, CRA ou projeto sem alias, nada resolve. | Sim: `rewriteImports.ts` (modo `auto`: mantém `@/` só se o tsconfig mapeia `@/*` para a raiz certa) |
| C4 | `templates/hooks/useAnimationEngine.ts` importa `../animations/registerAnimationProperties`, que não existe. É copiado para o projeto do usuário e dá erro de TypeScript. | Sim: excluído no registro; **apague o arquivo** |
| C5 | A camada Formik (`formikVariants/` + `FormikMaskedInput.tsx`) é copiada junto de `masked-input`. Sem `formik` instalado: `Cannot find module 'formik'`. | Sim: vira o componente opcional `masked-input-formik` (**mover os arquivos**, comandos abaixo) |
| C6 | `masked-hooks/useSmartSearch.ts` importa `../masked-utils/string`, que resolve para um caminho que não existe no projeto do usuário. | Sim: arquivo reescrito, sem dependência externa |
| C7 | Botões default/ghost/outline/soft/toggle/checkbox leem `theme.colors…`. Sem `<ThemeProvider>`, quebram em tempo de execução (`theme.colors` indefinido). | **Mitigado**: aviso pós-instalação. A correção definitiva é o tema por CSS variables (Passo 4.1) |
| C8 | `peerDependencies` da CLI listam `execa`, `fs-extra`, `prompts` (são dependências de execução), mais `react-icons` e `react-input-mask` (a CLI não usa). `styled-components` está em `dependencies` da CLI. | Sim: `package.json` corrigido |
| C9 | Utils copiados soltos em `src/utils/` (`index.ts`, `date.ts`, `string.ts`, `time.ts`…). Nomes extremamente comuns: com `overwrite: false`, o arquivo do usuário vence **em silêncio** e a instalação fica incompleta. | Sim: vão para `src/utils/masked-utils/` |

## 2. Altos

| # | Achado | Situação |
| --- | --- | --- |
| H1 | `overwrite: false` sem nenhum relatório: o usuário não sabe o que foi criado, mantido ou ignorado, e não há como atualizar. | Corrigido: relatório (criados / idênticos / mantidos), `--force`, `--dry-run` |
| H2 | `injectAnimationProvider` edita o arquivo de providers do usuário por regex (só acha 3 caminhos; lança erro se não achar `{children}` e aborta a instalação no meio, depois de instalar pacotes). | Corrigido: o registro das propriedades CSS acontece sozinho ao importar `MaskedAnimation` (`registerAnimationProperties.ts`). A CLI não edita mais arquivos do usuário. `AnimationProvider` fica como opcional |
| H3 | `date.ts` regrediu em relação à lib: `formatDate` virou alias de `formatDateBR` e **ignora o `locale`** (quebra silenciosa para quem chamava `formatDate(v, 'en-US')`); sem validação (`31/02` passa); data com horário vira lixo. | Corrigido: assinatura da lib mantida (superconjunto), validação de calendário, datas "só dia" tratadas em UTC (sem deslocar com o fuso) |
| H4 | `getTimeUntil`, `timeAgo` e `formatDuration` casam o locale **só exato**: `en-US` cai em português. | Corrigido: `locale.ts` (`pickDictionary`: exato → idioma base → padrão) |
| H5 | `useSmartSearch` calcula "hoje" com `toISOString()` (UTC): depois das 21h no Brasil, "hoje/próximos/passados" erram o dia. Também recria `[]` a cada render, invalidando o `useMemo`. | Corrigido (data local, padrões estáveis, opção `locale`) |
| H6 | `buildGoogleCalendarUrl` envia o horário local como UTC (sufixo `Z`): o Google desloca a hora pelo fuso de quem abre o link (3 h de diferença no Brasil). Num SaaS de agendamento, isso é grave. | Corrigido, **com mudança de comportamento** (sem `Z`; novo `timeZone` opcional vira `ctz`) |
| H7 | `useSafeReturn` aceita `/\host`, que navegadores tratam como `//host` (open redirect). Não barrava barra invertida nem caracteres de controle. | Corrigido |
| H8 | `SearchInput.style.ts` usa `maskedTheme.colors.textMuted / borderColor / secondaryColor / textColor`, que só existem nos temas dark/light etc., não em `maskedTheme`. Resulta em `undefined` no CSS. | **Pendente** (Passo 4.5) |
| H9 | A CLI não valida o projeto (sem `package.json`, sem React, sem TypeScript) e instala assim mesmo. | Corrigido |
| H10 | O `tsconfig.json` da CLI era o de um app Next, e os templates nunca são compilados. | Corrigido o tsconfig e adicionado o teste de integridade (imports). Compilação real num projeto fixture: **pendente** (Passo 7) |

## 3. Médios (pendentes, com o passo do plano que cobre)

- **FileInput** mistura UI com domínio: `next/image`, `react-hot-toast`, `react-icons`, upload direto ao Cloudinary, textos em PT (Passo 4.6).
- **ids fixos** `#masked-select-trigger` / `#masked-time-trigger` e `getElementById` para clique-fora; quebram com duas instâncias (4.4).
- **PasswordToggle** é um `div` clicável sem teclado nem `aria-label`; `htmlFor` e `aria-describedby` usam `id` opcional e geram `"undefined-error"` (4.3).
- **MaskedTextInput** só aceita dígitos (`removeMask` apaga letras): não serve para placas, por exemplo (4.3).
- **CurrencyInput** ignora `currency` e `symbolPosition`; placeholder `0,00` fixo (4.3).
- **BaseButton**: `loadingText = 'Loading...'` fixo em inglês; tooltip com `nowrap`.
- **`declare module 'styled-components'`** (aumento de `DefaultTheme`) pode conflitar com o tema do próprio usuário (TS2717).
- **Duplicações** a unificar: `color-utils/colorUtils.ts` × `masked-utils/color.ts` × `ColorVariants` em `MaskedTheme.types.ts`; `useSmartSearch` (hooks × input); `useInView` (agora idênticos, e o teste de integridade garante que continuem).
- **Drawer/Popup** sem portal, `role="dialog"`, Esc, trava de foco (4.8/4.9, já nas decisões).
- **`'use client'`** em todos os templates: correto no Next; no Vite gera um aviso inofensivo do Rollup.

## 4. Correção ao DECISOES.md

O adendo provisório e a decisão I.8 falam de um "bug da sombra nos cards" (a lib usaria `boxShadow.xs` como string e "não renderiza"). **Isso está errado**: em `MaskedThemes.ts` a string é `box-shadow: …;` (com a propriedade) e é interpolada como regra dentro do `css`, então renderiza normalmente. Migrar `boxShadow` para função (B.7) continua sendo uma boa decisão de design (aceitar `color`), mas **não é correção de bug**. Remova o item "bug da sombra" do adendo e reescreva I.8 como decisão de design.

---

## 5. O que está neste pacote

Estrutura espelhando o repositório (copie por cima, mesmos caminhos). **41 arquivos.**

| Arquivo | Ação |
| --- | --- |
| `package.json`, `tsconfig.json`, `vitest.config.ts`, `README.md` | substitui (vitest.config.ts é novo) |
| `src/cli.ts` | substitui (flags, plano, relatório, saída com código) |
| `src/registry.ts`, `src/types.ts`, `src/installer.ts` | novos |
| `src/prompts/selectComponents.ts` | substitui |
| `src/utils/copyTemplate.ts`, `src/utils/installDeps.ts` | substituem |
| `src/utils/detectProject.ts`, `projectPaths.ts`, `rewriteImports.ts`, `logger.ts`, `ownPackage.ts` | novos |
| `src/tests/cli/*.test.ts` (7 arquivos) | novos |
| `src/tests/date|time|duration.test.ts` | substituem (mantêm as asserções originais e acrescentam casos) |
| `src/tests/calendar.test.ts`, `locale.test.ts` | novos |
| `templates/masked-utils/locale.ts` | novo |
| `templates/masked-utils/time.ts`, `duration.ts`, `date.ts`, `calendar.ts` | substituem |
| `templates/masked-hooks/useSmartSearch.ts`, `templates/masked-input/MaskedInput/hooks/useSmartSearch.ts` | substituem |
| `templates/masked-hooks/useInView.ts`, `templates/hooks/useInView.ts` | substituem (idênticos entre si; corrige `noUncheckedIndexedAccess`) |
| `templates/masked-hooks-next/useSafeReturn.ts` | substitui |
| `templates/masked-animations/MaskedAnimations/registerAnimationProperties.ts` | novo |
| `.../AnimationProvider.tsx`, `.../MaskedAnimation.tsx` | substituem |

### O que apagar e mover (PowerShell, na raiz do repo)

```powershell
# 1) apagar o que foi substituído ou é código morto
Remove-Item src\installers -Recurse
Remove-Item src\utils\detectFramework.ts, src\utils\findNextProviders.ts, src\utils\getProjectPaths.ts, src\utils\injectAnimationProvider.ts
Remove-Item templates\hooks\useAnimationEngine.ts, templates\masked-utils\dateTime.ts

# 2) separar a camada Formik do masked-input
New-Item -ItemType Directory -Force templates\masked-input-formik\MaskedInput | Out-Null
Move-Item templates\masked-input\MaskedInput\formikVariants templates\masked-input-formik\MaskedInput\formikVariants
Move-Item templates\masked-input\MaskedInput\FormikMaskedInput.tsx templates\masked-input-formik\MaskedInput\FormikMaskedInput.tsx
```

Depois de copiar o pacote por cima:

```powershell
npm install
npm run typecheck
npm test
npm run build
```

Se `npm test` falhar no `templates-integrity`, a mensagem diz qual arquivo importa o quê. É o teste cumprindo a função: atualize o registro ou o template.

Para testar a CLI de verdade: `node dist\cli.js masked-buttons --dry-run --cwd C:\caminho\do\projeto-teste`.

### Quem já instalou uma versão antiga

Os utils soltos em `src/utils/` (`date.ts`, `index.ts`…) passam a ir para `src/utils/masked-utils/`. Quem atualizar fica com cópias duplicadas e precisa apagar as antigas e ajustar os imports. Vale registrar no guia de migração e no changelog.

---

## 6. O que continua pendente (e quem cuida)

| Item | Onde |
| --- | --- |
| Tema por CSS variables (elimina o ThemeProvider obrigatório, C7), tokens `--mc-*`, `colorTheme` | Passos 3.2 e 4.1–4.3 |
| FileInput sem `next/image`/toast/react-icons, `onUpload` por arquivo | 4.6 |
| Dropdowns: ids, clique-fora por ref, teclado, a11y; SearchInput (H8) | 4.4, 4.5 |
| Drawer e Popup com portal e a11y de diálogo | 4.8, 4.9 |
| Compilar os templates completos num projeto fixture em Next, Vite, Remix e CRA | 7 |
| Site: nomenclatura `Masked*`, receitas (Cloudinary, máscaras BR) | 6 |
| Comando de atualização com diff (`masked-components-cli diff`) | futuro: o relatório e o `--dry-run` já dão a base |
| Decidir o nome público do pacote (`npx masked-components` não existe; o pacote é `masked-components-cli`) | você |

**Regra daqui em diante:** toda mudança nos templates que adicione um import novo precisa atualizar o `registry.ts` no mesmo commit. O teste de integridade cobra isso.
