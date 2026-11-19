'use client'

import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  MaskedShellRoot,
  ShellFooterSlot,
  ShellHeaderSlot,
  ShellMain,
  ShellSidebarSlot,
  SkipLink
} from './MaskedShell.styles'
import { resolveShellTokens } from './shellTokens'
import type { MaskedShellProps } from './MaskedShell.types'

const SKIP_LABEL = { pt: 'Pular para o conteúdo', en: 'Skip to content' } as const

/**
 * Estrutura de página (header + sidebar + conteúdo + footer) por grid areas.  
 *
 * Acessibilidade: o conteúdo vai num <main id="main-content"> e há um link  
 * "pular para o conteúdo" (visível só com foco do teclado). Use <MaskedHeader>  
 * e <MaskedFooter> nos slots — eles já trazem os landmarks banner e contentinfo.  
 *
 * @example  
 * <MaskedShell variant="app" header={<MaskedHeader … />} sidebar={<MaskedSidebar … />}>  
 *   <MaskedPageHeader title="Painel" />  
 * </MaskedShell>  
 */
export function MaskedShell(props: MaskedShellProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const {
    as,
    variant = 'app',
    header,
    sidebar,
    footer,
    mainId = 'main-content',
    skipLinkLabel,
    colorTheme,
    tokens,
    className,
    style,
    children,
    ...rest
  } = props

  const label =
    skipLinkLabel ??
    SKIP_LABEL[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']
  const tokenStyle = resolveShellTokens({ colorTheme, tokens }, theme)
  const showSidebar = Boolean(sidebar) && variant !== 'site' && variant !== 'centered'

  return (
    <MaskedShellRoot
      as={as}
      $variant={variant}
      className={className}
      style={{ ...tokenStyle, ...style }}
      {...rest}
    >
      <SkipLink href={`#${mainId}`}>{label}</SkipLink>
      {header && <ShellHeaderSlot>{header}</ShellHeaderSlot>}
      {showSidebar && <ShellSidebarSlot $variant={variant}>{sidebar}</ShellSidebarSlot>}
      <ShellMain id={mainId} tabIndex={-1} $variant={variant}>
        {children}
      </ShellMain>
      {footer && <ShellFooterSlot>{footer}</ShellFooterSlot>}
    </MaskedShellRoot>
  )
}
