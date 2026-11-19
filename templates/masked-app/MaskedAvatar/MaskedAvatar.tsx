'use client'

import { useState } from 'react'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { getInitials } from '@/utils/masked-utils'
import { AvatarImage, AvatarStatusDot, MaskedAvatarRoot, SrOnly } from './MaskedAvatar.styles'
import { resolveAvatarSize, resolveAvatarTokens } from './avatarTokens'
import type { MaskedAvatarProps } from './MaskedAvatar.types'

const STATUS = {
  pt: { online: 'Online', away: 'Ausente', busy: 'Ocupado', offline: 'Offline' },
  en: { online: 'Online', away: 'Away', busy: 'Busy', offline: 'Offline' }
} as const

/**
 * Avatar com imagem, iniciais de fallback e indicador de presença.
 *
 * Usa o `imageComponent` do MaskedConfigProvider (ex.: next/image) quando
 * definido. Se a imagem faltar ou falhar, mostra as iniciais de `name`.
 *
 * Acessibilidade: com imagem, o nome acessível é `alt` (default `name`); com
 * iniciais, `role="img"` + `aria-label={name}`; sem nome, o avatar é decorativo.
 * A presença é dita em texto oculto, não só em cor.
 *
 * @example
 * <MaskedAvatar name="Ana Souza" src="/ana.jpg" status="online" />
 * <MaskedAvatar name="Ana Souza" size="lg" colorTheme="baseBlue" />
 */
export function MaskedAvatar(props: MaskedAvatarProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const [failed, setFailed] = useState(false)
  const {
    variant = 'circle',
    size,
    src,
    alt,
    name,
    status,
    colorTheme,
    tokens,
    className,
    style,
    ...rest
  } = props

  const px = resolveAvatarSize(size)
  const tokenStyle = resolveAvatarTokens({ colorTheme, tokens }, theme)
  const showImage = Boolean(src) && !failed
  const dict = STATUS[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']
  const ImageTag = config.imageComponent ?? AvatarImage

  return (
    <MaskedAvatarRoot
      $variant={variant}
      $size={px}
      className={className}
      style={{ ...tokenStyle, ...style }}
      {...(!showImage && name ? { role: 'img', 'aria-label': name } : {})}
      {...(!showImage && !name ? { 'aria-hidden': true } : {})}
      {...rest}
    >
      {showImage ? (
        <ImageTag
          src={src as string}
          alt={alt ?? name ?? ''}
          width={px}
          height={px}
          onError={() => setFailed(true)}
          {...(config.imageComponent ? { className: undefined } : {})}
          style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }}
        />
      ) : (
        <span aria-hidden="true">{name ? getInitials(name) : ''}</span>
      )}
      {status && (
        <>
          <AvatarStatusDot $status={status} $size={px} aria-hidden="true" />
          <SrOnly>{dict[status]}</SrOnly>
        </>
      )}
    </MaskedAvatarRoot>
  )
}
