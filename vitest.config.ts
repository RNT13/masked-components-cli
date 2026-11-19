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
        find: /^@\/styles\//,
        replacement: path.resolve(__dirname, 'templates/masked-themes') + '/'
      },
      {
        find: /^@\/components\/ui\/MaskedConfigProvider/,
        replacement: path.resolve(__dirname, 'templates/masked-config/MaskedConfigProvider')
      },
      {
        find: /^@\/components\/ui\/MaskedSection\//,
        replacement: path.resolve(__dirname, 'templates/masked-layout/MaskedSection') + '/'
      },
      {
        find: /^@\/components\/ui\/MaskedShell\//,
        replacement: path.resolve(__dirname, 'templates/masked-page/MaskedShell') + '/'
      },
      {
        find: /^@\/components\/ui\/MaskedSidebar\//,
        replacement: path.resolve(__dirname, 'templates/masked-page/MaskedSidebar') + '/'
      },
      {
        find: /^@\/components\/ui\/MaskedPageHeader\//,
        replacement: path.resolve(__dirname, 'templates/masked-page/MaskedPageHeader') + '/'
      },
      {
        find: /^@\/components\/ui\/MaskedSkeleton\//,
        replacement: path.resolve(__dirname, 'templates/masked-skeleton/MaskedSkeleton') + '/'
      },
      {
        find: /^@\/components\/ui\/MaskedDrawer\//,
        replacement: path.resolve(__dirname, 'templates/masked-drawer/MaskedDrawer') + '/'
      }
    ]
  },
  test: { include: ['src/tests/**/*.test.{ts,tsx}'] }
})
