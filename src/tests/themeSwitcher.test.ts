import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

/**
 * Guarda da fase de sincronização site -> CLI do ThemeSwitcher.
 *
 * O site era a fonte desta sincronização (ajustes de mobile + correções de UI).
 * Estes testes impedem regressões no template do CLI: os três blocos
 * responsivos mobile, o fallback de z-index do menu e o uso exclusivo de
 * MaskedThemes (sem sistema de tema paralelo, sem react-icons, sem alias "@/").
 */
const here = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATE_PATH = path.resolve(
  here,
  '../../templates/masked-themes/ThemeEngine/ThemeSwitcher.tsx'
)
const source = fs.readFileSync(TEMPLATE_PATH, 'utf8')

describe('ThemeSwitcher — template sincronizado com o site', () => {
  it('é um client component e segue a convenção de imports dos templates', () => {
    expect(source.startsWith("'use client'")).toBe(true)
    // nenhum import por alias "@/": templates usam caminhos canônicos próprios/relativos
    expect(source).not.toMatch(/from\s+['"]@\//)
  })

  it('reaproveita MaskedThemes (media + config) — sem sistema de tema paralelo', () => {
    expect(source).toMatch(
      /import\s*\{\s*maskedThemeConfig,\s*media\s*\}\s*from\s*'\.\.\/MaskedThemes\/MaskedThemes'/
    )
    expect(source).toMatch(/import\s*\{\s*useThemeEngine\s*\}\s*from\s*'\.\/ThemeEngineProvider'/)
    // sem dependência de ícones externos
    expect(source).not.toMatch(/from\s+['"]react-icons/)
  })

  it('mantém os três blocos responsivos mobile (SplitRoot, MainButton, ChevronButton)', () => {
    expect(source.match(/\$\{media\.mobile\}/g)?.length).toBe(3)
    // fonte mobile do SplitRoot vem do tema, não de valor fixo
    expect(source).toContain('font-size: ${({ theme }) => theme.fontSize.sm};')
    for (const rule of [
      'min-height: 40px',
      'padding: 6px 10px',
      'gap: 6px',
      'font-size: 13px',
      'width: 40px'
    ]) {
      expect(source).toContain(rule)
    }
  })

  it('mantém as correções de UI vindas do site', () => {
    // menu não pode ficar atrás de overlays (fallback 100 era o bug)
    expect(source).toContain('z-index: ${({ theme }) => theme.zIndex?.dropdown ?? 1000};')
    expect(source).toContain('max-height: 280px;')
    // Root em inline-block: pai flex/grid não estica o switcher
    expect(source).toContain('display: inline-block;')
    expect(source).toContain('width: fit-content;')
  })

  it('preserva a acessibilidade do menu de temas', () => {
    for (const snippet of [
      'aria-haspopup="listbox"',
      'aria-expanded={open}',
      'role="listbox"',
      'role="option"',
      'aria-selected={name === themeName}',
      "e.key === 'Escape'"
    ]) {
      expect(source).toContain(snippet)
    }
  })

  it('navega o menu por teclado (setas, Home/End), foca o tema atual e devolve o foco ao fechar', () => {
    for (const snippet of [
      "e.key === 'ArrowDown'",
      "e.key === 'ArrowUp'",
      "e.key === 'Home'",
      "e.key === 'End'",
      'itemRefs.current[current >= 0 ? current : 0]?.focus()',
      'chevronRef.current?.focus()'
    ]) {
      expect(source).toContain(snippet)
    }
  })
})
