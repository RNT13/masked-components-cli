import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ThemeProvider, type DefaultTheme } from 'styled-components'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { useMaskedTheme } from '../../templates/masked-themes/useMaskedTheme'
import { registry, resolveComponents } from '../registry'

function Probe() {
  const theme = useMaskedTheme()
  return <output>{theme === maskedTheme ? 'base' : `custom:${theme.spacing.md}`}</output>
}

describe('useMaskedTheme', () => {
  it('sem ThemeProvider: devolve o tema base da lib (não lança erro)', () => {
    expect(renderToStaticMarkup(<Probe />)).toBe('<output>base</output>')
  })

  it('com ThemeProvider: devolve o tema do provider', () => {
    const custom: DefaultTheme = {
      ...maskedTheme,
      spacing: { ...maskedTheme.spacing, md: '2rem' }
    }
    const out = renderToStaticMarkup(
      <ThemeProvider theme={custom}>
        <Probe />
      </ThemeProvider>
    )
    expect(out).toBe('<output>custom:2rem</output>')
  })
})

/* ---------- registry: quem usa o hook puxa masked-themes ---------- */

const here = path.dirname(fileURLToPath(import.meta.url))
const templatesRoot = path.resolve(here, '../../templates')

function listCode(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  if (fs.statSync(dir).isFile()) return /\.(ts|tsx)$/.test(dir) ? [dir] : []
  return fs.readdirSync(dir).flatMap((name) => listCode(path.join(dir, name)))
}

describe('registry × useMaskedTheme', () => {
  const users = registry.filter(
    (entry) =>
      entry.id !== 'masked-themes' &&
      entry.templates.some((m) =>
        listCode(path.join(templatesRoot, m.dir)).some((file) =>
          fs.readFileSync(file, 'utf8').includes('useMaskedTheme')
        )
      )
  )

  it('os componentes novos de layout usam o hook', () => {
    expect(users.map((e) => e.id)).toEqual(
      expect.arrayContaining(['masked-div', 'masked-stack', 'masked-grid'])
    )
  })

  for (const entry of users) {
    it(`${entry.id}: instala masked-themes como dependência interna`, () => {
      const { ordered } = resolveComponents([entry.id], 'next')
      expect(ordered.map((e) => e.id)).toContain('masked-themes')
    })
  }

  it('instalação granular: masked-grid não arrasta Div nem Stack', () => {
    const ids = resolveComponents(['masked-grid'], 'next').ordered.map((e) => e.id)
    expect(ids).toEqual(['masked-utils', 'masked-themes', 'masked-grid'])
  })
})
