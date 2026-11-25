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
        find: /^@\/hooks\/masked-primitives/,
        replacement: path.resolve(__dirname, 'templates/masked-primitives')
      },
      {
        find: /^@\/hooks\//,
        replacement: path.resolve(__dirname, 'templates/masked-hooks') + '/'
      },
      {
        find: /^@\/styles\/MaskedAnimations\//,
        replacement: path.resolve(__dirname, 'templates/masked-animations/MaskedAnimations') + '/'
      },
      {
        find: /^@\/styles\//,
        replacement: path.resolve(__dirname, 'templates/masked-themes') + '/'
      },
      {
        find: /^@\/themes\//,
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
        find: /^@\/components\/ui\/MaskedEmptyState\/MaskedEmptyState$/,
        replacement: path.resolve(
          __dirname,
          'templates/masked-app/MaskedEmptyState/MaskedEmptyState.tsx'
        )
      },
      {
        find: /^@\/components\/ui\/MaskedPagination\/MaskedPagination$/,
        replacement: path.resolve(
          __dirname,
          'templates/masked-app/MaskedPagination/MaskedPagination.tsx'
        )
      },
      {
        find: /^@\/components\/ui\/MaskedAvatar\//,
        replacement: path.resolve(__dirname, 'templates/masked-app/MaskedAvatar') + '/'
      },
      {
        find: /^@\/components\/ui\/MaskedSkeleton\/MaskedSkeleton$/,
        replacement: path.resolve(
          __dirname,
          'templates/masked-skeleton/MaskedSkeleton/MaskedSkeleton.tsx'
        )
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
      },
      {
        find: /^@\/components\/ui\/MaskedPopup\//,
        replacement: path.resolve(__dirname, 'templates/masked-popup/MaskedPopup') + '/'
      },
      {
        find: /^@\/components\/ui\/MaskedSlider\//,
        replacement: path.resolve(__dirname, 'templates/masked-forms/MaskedSlider') + '/'
      },
      {
        find: /^@\/components\/ui\/MaskedRating\//,
        replacement: path.resolve(__dirname, 'templates/masked-forms/MaskedRating') + '/'
      },
      {
        find: /^@\/components\/ui\/MaskedDatePicker\//,
        replacement: path.resolve(__dirname, 'templates/masked-forms/MaskedDatePicker') + '/'
      },
      {
        find: /^@\/components\/ui\/MaskedCommandPalette\//,
        replacement: path.resolve(__dirname, 'templates/masked-forms/MaskedCommandPalette') + '/'
      }
    ]
  },
  test: { include: ['src/tests/**/*.test.{ts,tsx}'] }
})
