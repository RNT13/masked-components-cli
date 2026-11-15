'use client'

import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { maskedThemeConfig } from '../MaskedThemes/MaskedThemes'
import { useThemeEngine } from './ThemeEngineProvider'

const Root = styled.div`
  position: relative;
  display: inline-flex;
  /* impede que um pai flex/grid estique o Root: o menu (right: 0)
     ficaria ancorado na borda do container, não no botão */
  width: fit-content;
`

const SplitRoot = styled.div`
  display: inline-flex;
  align-items: stretch;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.borderColor ?? 'transparent'};
  background: ${({ theme }) => theme.colors.surfaceColor ?? 'transparent'};
  color: ${({ theme }) => theme.colors.textColor ?? 'inherit'};
  overflow: hidden;
`

const MainButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
  min-height: 36px;

  strong {
    text-transform: capitalize;
  }
`

const ChevronButton = styled.button<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  min-height: 36px;
  border: 0;
  border-left: 1px solid ${({ theme }) => theme.colors.borderColor ?? 'transparent'};
  background: transparent;
  color: inherit;
  cursor: pointer;

  svg {
    transition: transform 0.2s ease;
    transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'none')};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.tertiaryColor ?? 'rgba(128,128,128,.15)'};
  }
`

const Menu = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: ${({ theme }) => theme.zIndex?.dropdown ?? 100};
  min-width: 180px;
  max-width: calc(100vw - 24px);
  max-height: 320px;
  overflow-y: auto;
  margin: 0;
  padding: 6px;
  list-style: none;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.borderColor ?? 'transparent'};
  background: ${({ theme }) => theme.colors.surfaceColor ?? '#fff'};
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
`

const Item = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 40px;
  padding: 8px 10px;
  border: 0;
  border-radius: 8px;
  background: ${({ $active, theme }) =>
    $active ? (theme.colors.tertiaryColor ?? 'rgba(128,128,128,.15)') : 'transparent'};
  color: ${({ theme }) => theme.colors.textColor ?? 'inherit'};
  font: inherit;
  font-size: 14px;
  text-transform: capitalize;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.tertiaryColor ?? 'rgba(128,128,128,.15)'};
    outline: none;
  }
`

const Dot = styled.span<{ $themeName?: string }>`
  width: 12px;
  height: 12px;
  flex: none;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(128, 128, 128, 0.4);
  background: ${({ $themeName, theme }) => {
    if (!$themeName) return theme.colors.accentColor ?? '#888'
    const t = maskedThemeConfig[$themeName as keyof typeof maskedThemeConfig]
    return t?.colors.accentColor ?? '#888'
  }};
`

export type ThemeSwitcherProps = {
  label?: string
  className?: string
}

/**
 * Split button: o corpo mostra o tema atual; a seta abre a lista
 * de temas e clicar num item aplica na hora (persiste no storage).
 */
export function ThemeSwitcher({ label = 'Theme', className }: ThemeSwitcherProps) {
  const { themeName, availableThemes, setThemeName } = useThemeEngine()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <Root ref={rootRef} className={className}>
      <SplitRoot>
        <MainButton
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={`Current theme: ${themeName}`}
        >
          <Dot aria-hidden />
          <span>{label}</span>
          <strong>{themeName}</strong>
        </MainButton>
        <ChevronButton
          type="button"
          $open={open}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Choose theme"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </ChevronButton>
      </SplitRoot>

      {open && (
        <Menu role="listbox" aria-label="Themes" aria-activedescendant={themeName}>
          {availableThemes.map((name) => (
            <li key={name} role="presentation">
              <Item
                type="button"
                role="option"
                id={name}
                aria-selected={name === themeName}
                $active={name === themeName}
                onClick={() => {
                  setThemeName(name)
                  setOpen(false)
                }}
              >
                <Dot $themeName={name} aria-hidden />
                {name}
              </Item>
            </li>
          ))}
        </Menu>
      )}
    </Root>
  )
}
