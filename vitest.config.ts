import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@\/utils\/masked-utils/,
        replacement: path.resolve(__dirname, 'templates/masked-utils')
      },
      {
        find: /^@\/masked-utils/,
        replacement: path.resolve(__dirname, 'templates/masked-utils') + '/'
      },
      {
        find: /^@\/styles\//,
        replacement: path.resolve(__dirname, 'templates/masked-themes') + '/'
      },
      {
        find: /^@\/components\/ui\/MaskedConfigProvider$/,
        replacement: path.resolve(__dirname, 'templates/masked-config/MaskedConfigProvider.tsx')
      }
    ]
  },
  test: { include: ['src/tests/**/*.test.{ts,tsx}'] }
})
