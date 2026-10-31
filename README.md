# Masked Components CLI

Copy-in React + TypeScript components. The CLI **copies the source code into your project** (like shadcn/ui):
you own the files, you can edit anything, and there is no runtime dependency on this package.

```bash
npx masked-components-cli
```

Pick the components you want; the CLI figures out what else they need, installs the missing npm
packages with **your** package manager (npm, pnpm, yarn or bun) and copies the files.

## What it needs from your project

- A `package.json` at the project root (run the CLI there, or use `--cwd`).
- React and **TypeScript** (the templates are `.ts` / `.tsx`).
- Works in Next.js, Vite, Remix and CRA. Imports are rewritten to relative paths when your project has no `@/` alias.
- Exception: the `file` input variant uses `next/image` and only works in Next.js for now (the CLI warns you).

## Usage

```bash
npx masked-components-cli                          # interactive
npx masked-components-cli masked-buttons masked-cards
npx masked-components-cli --all
npx masked-components-cli --list
npx masked-components-cli masked-input --dry-run   # show what would happen, write nothing
```

| Option | What it does |
| --- | --- |
| `-l, --list` | List components |
| `-y, --yes` | Don't ask anything |
| `-f, --force` | Overwrite files that exist **and differ** (otherwise they are kept and reported) |
| `--dry-run` | Print the plan and the file report without writing |
| `--no-install` | Copy files only, don't touch `package.json` |
| `--pm <npm\|pnpm\|yarn\|bun>` | Force a package manager (default: from `packageManager`, lockfile or `npm_config_user_agent`) |
| `--alias <auto\|keep\|relative>` | How to treat `@/…` imports (default `auto`: keep it only if your tsconfig maps `@/*` to the right folder) |
| `--cwd <dir>` | Run in another folder |

Running it again is safe: identical files are reported as unchanged, and files you edited are never overwritten without `--force`.

## What gets installed, and where

| Component | Needs | npm packages |
| --- | --- | --- |
| `masked-themes` | – | styled-components |
| `masked-animations` | – | styled-components |
| `masked-skeleton` | – | styled-components |
| `masked-buttons` | animations, themes | styled-components, react-icons |
| `masked-cards` | themes | styled-components |
| `masked-drawer` | themes | styled-components |
| `masked-popup` | – | styled-components |
| `masked-input` | animations, themes | styled-components, react-icons, react-hot-toast |
| `masked-input-formik` | input | formik |
| `masked-utils` | – | – |
| `masked-hooks` | – | – |
| `masked-hooks-next` (Next.js only) | – | – |

Default destinations (with a `src` folder; without it, drop the `src/`):

```
src/components/ui/   components
src/styles/          themes, animations
src/utils/           color helpers; masked-utils/ (own sub-folder, never collides with your files)
src/hooks/           hooks
```

Change them in `masked.config.json` at the project root (paths must stay inside the project):

```json
{ "paths": { "components": "src/ui", "styles": "src/theme", "utils": "src/lib", "hooks": "src/hooks" } }
```

## Using the theme

Buttons read the styled-components `theme`, so wrap your app once:

```tsx
import { ThemeProvider } from "styled-components";
import { maskedTheme } from "@/styles/MaskedThemes/MaskedThemes";

<ThemeProvider theme={maskedTheme}>{children}</ThemeProvider>
```

Animations need no provider: the CSS properties for the premium borders are registered automatically.

## Updating

Run the CLI again with `--dry-run` to see what changed in the templates, then:

- keep your edits: run it without `--force` (changed files are listed as "kept");
- take the new version of a file: delete it or use `--force`.

If you installed an older version, loose files in `src/utils/` (e.g. `date.ts`, `index.ts`) are now installed under `src/utils/masked-utils/`; remove the old copies and update imports.

## Development

```bash
npm install
npm run typecheck
npm test        # unit tests + templates × registry integrity check
npm run build
```

`src/registry.ts` is the single source of truth (which template folder goes where, what each component requires, which npm packages it needs).
`src/tests/cli/templates-integrity.test.ts` fails if a template imports something the registry doesn't cover, so a missing dependency can't ship.

## License

MIT © Renato Minoita
