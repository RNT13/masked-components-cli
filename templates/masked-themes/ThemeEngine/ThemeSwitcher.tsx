'use client'

import styled from 'styled-components'
import { useThemeEngine } from './ThemeEngineProvider'

const SwitcherButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.borderColor ?? theme.colors.baseGray.light40};

  background: ${({ theme }) => theme.colors.surfaceColor ?? 'transparent'};
  color: ${({ theme }) => theme.colors.textColor ?? 'inherit'};

  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    transform 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accentColor ?? theme.colors.baseBlue.base};
  }

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accentColor ?? theme.colors.baseBlue.base};
    outline-offset: 2px;
  }
`

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentColor ?? theme.colors.baseBlue.base};
`

export type ThemeSwitcherProps = {
  /** rótulo antes do nome do tema. Default: 'Theme' */
  label?: string
  className?: string
}

/**
 * Botão pronto que cicla pelos temas registrados no ThemeEngine.  
 * Basta renderizar <ThemeSwitcher /> em qualquer lugar dentro do provider.  
 */
export function ThemeSwitcher({ label = 'Theme', className }: ThemeSwitcherProps) {
  const { themeName, availableThemes, setThemeName } = useThemeEngine()

  const next = () => {
    const i = availableThemes.indexOf(themeName)
    const nextName = availableThemes[(i + 1) % availableThemes.length]
    setThemeName(nextName)
  }

  return (
    <SwitcherButton
      type="button"
      onClick={next}
      className={className}
      aria-label={`Switch theme (current: ${themeName})`}
      title={`Switch theme (current: ${themeName})`}
    >
      <Dot aria-hidden />
      <span>{label}</span>
      <strong>{themeName}</strong>
    </SwitcherButton>
  )
}
