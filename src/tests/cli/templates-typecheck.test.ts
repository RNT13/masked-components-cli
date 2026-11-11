import { execa } from 'execa'
import fs from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { executeInstall, planInstall } from '../../installer'
import { registry } from '../../registry'
import { detectProject } from '../../utils/detectProject'
import { resolveProjectPaths } from '../../utils/projectPaths'

/**
 * Type-check REAL dos templates: instala tudo (alias "@/" mantido) em uma pasta
 * temporária DENTRO do repo (para resolver react/styled-components/formik/next
 * a partir do node_modules do CLI) e roda `tsc --noEmit`.
 *
 * Pule com SKIP_TYPECHECK=1 (ex.: iteração rápida local).
 */

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../../..')
const templatesRoot = path.join(root, 'templates')
const tscBin = path.join(root, 'node_modules/typescript/bin/tsc')

const enabled = fs.existsSync(templatesRoot) && fs.existsSync(tscBin) && !process.env.SKIP_TYPECHECK

describe.skipIf(!enabled)('type-check dos templates', () => {
  it('todos os componentes instalados juntos compilam com tsc --noEmit (strict)', async () => {
    const dir = fs.mkdtempSync(path.join(root, '.tmp-typecheck-'))

    try {
      fs.writeJsonSync(path.join(dir, 'package.json'), {
        name: 'tmp-typecheck',
        dependencies: { next: '15.0.0', react: '19.0.0' },
        devDependencies: { typescript: '5.0.0' }
      })
      fs.writeJsonSync(path.join(dir, 'tsconfig.json'), {
        compilerOptions: {
          target: 'ES2022',
          lib: ['dom', 'dom.iterable', 'esnext'],
          jsx: 'react-jsx',
          module: 'esnext',
          moduleResolution: 'bundler',
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          esModuleInterop: true,
          isolatedModules: true,
          baseUrl: '.',
          paths: { '@/*': ['./src/*'] }
        },
        include: ['src']
      })
      fs.ensureDirSync(path.join(dir, 'src'))

      const info = detectProject(dir, {})
      const paths = resolveProjectPaths(info)
      const ids = registry
        .filter((entry: (typeof registry)[number]) => !entry.frameworks || entry.frameworks.includes(info.framework))
        .map((entry: (typeof registry)[number]) => entry.id)

      await executeInstall(
        planInstall(info, ids),
        info,
        paths,
        { force: true, dryRun: false, noInstall: true, alias: 'auto' },
        templatesRoot
      )

      const result = await execa(
        process.execPath,
        [tscBin, '-p', path.join(dir, 'tsconfig.json')],
        { reject: false, cwd: dir }
      )

      expect(result.exitCode, `${result.stdout}\n${result.stderr}`).toBe(0)
    } finally {
      fs.removeSync(dir)
    }
  }, 180_000)
})
