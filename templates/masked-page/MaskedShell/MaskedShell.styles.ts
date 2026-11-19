import styled, { css } from 'styled-components'
import { maskedTheme, media } from '@/styles/MaskedThemes/MaskedThemes'
import type { MaskedShellInternalProps } from './MaskedShell.types'

/**
 * Estrutura da página por grid areas. O mobile empilha tudo em uma coluna;  
 * a largura da sidebar vem dela mesma (coluna `auto`), então colapsar a  
 * sidebar reflui o conteúdo sem JS.  
 */
export const MaskedShellRoot = styled.div<MaskedShellInternalProps>`
  box-sizing: border-box;
  display: grid;
  min-height: 100dvh;
  width: 100%;
  color: var(--mc-shell-fg, inherit);
  background: var(--mc-shell-bg, transparent);

  ${({ $variant }) =>
    $variant === 'app' &&
    css`
      grid-template-columns: auto minmax(0, 1fr);
      grid-template-rows: auto 1fr auto;
      grid-template-areas:
        'header header'
        'sidebar main'
        'footer footer';

      ${media.tablet} {
        grid-template-columns: minmax(0, 1fr);
        grid-template-areas:
          'header'
          'sidebar'
          'main'
          'footer';
      }
    `}

  ${({ $variant }) =>
    ($variant === 'site' || $variant === 'centered') &&
    css`
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto 1fr auto;
      grid-template-areas:
        'header'
        'main'
        'footer';
    `}  
  
  ${({ $variant }) =>
    $variant === 'split' &&
    css`
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-template-rows: auto 1fr auto;
      grid-template-areas:
        'header header'
        'sidebar main'
        'footer footer';

      ${media.tablet} {
        grid-template-columns: minmax(0, 1fr);
        grid-template-areas:
          'header'
          'main'
          'footer';
      }
    `}
`

export const ShellHeaderSlot = styled.div`
  grid-area: header;
  min-width: 0;
`

export const ShellSidebarSlot = styled.div<MaskedShellInternalProps>`
  grid-area: sidebar;
  min-width: 0;

  ${({ $variant }) =>
    $variant === 'split' &&
    css`
      display: flex;

      > * {
        flex: 1;
      }

      /* painel visual: some quando o conteúdo precisa de toda a largura */
      ${media.tablet} {
        display: none;
      }
    `}
`

export const ShellMain = styled.main<MaskedShellInternalProps>`
  grid-area: main;
  min-width: 0;

  &:focus {
    outline: none;
  }

  ${({ $variant }) =>
    $variant === 'centered' &&
    css`
      display: grid;
      place-items: center;
      padding: ${maskedTheme.spacing.lg};
    `}
`

export const ShellFooterSlot = styled.div`
  grid-area: footer;
  min-width: 0;
`

/** Link "pular para o conteúdo": invisível até receber foco do teclado. */
export const SkipLink = styled.a`
  position: absolute;
  top: ${maskedTheme.spacing.sm};
  left: ${maskedTheme.spacing.sm};
  z-index: ${maskedTheme.zIndex.tooltip};
  padding: ${maskedTheme.spacing.sm} ${maskedTheme.spacing.md};
  border-radius: ${maskedTheme.radius.sm};
  background: var(--mc-shell-fg, #111111);
  color: var(--mc-shell-bg, #ffffff);
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.semibold};
  text-decoration: none;
  transform: translateY(-200%);

  &:focus {
    transform: translateY(0);
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`
