'use client'

import { MaskedSection } from '@/components/ui/MaskedSection/MaskedSection'
import { LogoItem, LogoList, LogoTrack, LogoViewport } from './MaskedLogoCloud.styles'
import { resolveLogoCloudTokens } from './logoCloudTokens'
import type { MaskedLogoCloudProps } from './MaskedLogoCloud.types'

/**
 * Nuvem de logos (clientes, parceiros) dentro de uma MaskedSection.  
 *
 * Semântica: <ul> de itens. No 'marquee' a lista é duplicada para o loop  
 * contínuo e a cópia fica `aria-hidden`; a animação pausa no hover/foco e é  
 * desligada com `prefers-reduced-motion` (a lista volta a quebrar linha).  
 * Dê `alt` a cada imagem de logo.  
 *
 * @example  
 * <MaskedLogoCloud title="Quem confia" logos={[<img src="/a.svg" alt="Acme" />, <img src="/b.svg" alt="Globex" />]} />  
 */
export function MaskedLogoCloud(props: MaskedLogoCloudProps) {
  const {
    variant = 'row',
    logos,
    speed,
    sectionVariant,
    sectionTokens,
    tokens,
    colorTheme,
    ...section
  } = props

  const tokenStyle = resolveLogoCloudTokens({ speed, tokens })
  const renderList = (hidden?: boolean) => (
    <LogoList $variant={variant} aria-hidden={hidden ? true : undefined}>
      {logos.map((logo, index) => (
        <LogoItem key={index}>{logo}</LogoItem>
      ))}
    </LogoList>
  )

  return (
    <MaskedSection
      {...section}
      variant={sectionVariant}
      colorTheme={colorTheme}
      tokens={sectionTokens}
    >
      <LogoViewport $variant={variant} style={tokenStyle}>
        <LogoTrack $variant={variant}>
          {renderList()}
          {variant === 'marquee' && renderList(true)}
        </LogoTrack>
      </LogoViewport>
    </MaskedSection>
  )
}
