'use client'

import { useId, useState } from 'react'
import { useControllable } from '@/hooks/useControllable'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { MaskedRatingRoot, RatingGlyph, RatingItem, RatingRadio } from './MaskedRating.styles'
import { RATING_GLYPHS, clampRating, resolveRatingTokens } from './ratingTokens'
import type { MaskedRatingProps } from './MaskedRating.types'

const DICT = {
  pt: {
    label: 'Avaliação',
    option: (n: number, max: number) => `${n} de ${max}`,
    value: (n: number, max: number) => (n > 0 ? `Nota ${n} de ${max}` : 'Sem avaliação')
  },
  en: {
    label: 'Rating',
    option: (n: number, max: number) => `${n} of ${max}`,
    value: (n: number, max: number) => (n > 0 ? `Rating: ${n} of ${max}` : 'No rating')
  }
} as const

/**
 * Avaliação por estrelas, corações ou números.
 *
 * Interativa: grupo de rádios nativos (`role="radiogroup"`) — as setas do
 * teclado escolhem a nota, cada opção diz "3 de 5" e participa de <form> via
 * `name`. Só leitura (`readOnly`): uma imagem com nome acessível ("Nota 4 de 5").
 * A nota marcada se distingue pela forma do glifo (★ × ☆), não só pela cor.
 * `allowClear` deixa limpar a nota clicando de novo nela.
 *
 * @example
 * <MaskedRating label="Atendimento" onChange={setNota} />
 * <MaskedRating readOnly value={4.6} />
 * <MaskedRating variant="numbers" max={10} />
 */
export function MaskedRating(props: MaskedRatingProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const generatedName = useId()
  const [hover, setHover] = useState<number | undefined>(undefined)
  const {
    variant = 'stars',
    size = 'md',
    max = 5,
    value: valueProp,
    onChange,
    readOnly = false,
    allowClear = false,
    name,
    label,
    colorTheme,
    tokens,
    className,
    style,
    ...rest
  } = props

  const [rawValue, setRawValue] = useControllable<number>({
    value: valueProp,
    defaultValue: props.defaultValue ?? 0,
    onChange
  })

  const total = Math.max(1, Math.floor(max))
  const value = clampRating(rawValue, total)
  const shown = hover ?? value
  const dict = DICT[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']
  const tokenStyle = resolveRatingTokens({ variant, colorTheme, tokens }, theme)
  const items = Array.from({ length: total }, (_, index) => index + 1)

  function choose(next: number) {
    setRawValue(next)
  }

  const glyphOf = (n: number, filled: boolean) =>
    variant === 'numbers' ? n : RATING_GLYPHS[variant][filled ? 'full' : 'empty']

  if (readOnly) {
    return (
      <MaskedRatingRoot
        role="img"
        aria-label={label ? `${label}: ${dict.value(value, total)}` : dict.value(value, total)}
        className={className}
        style={{ ...tokenStyle, ...style }}
        {...rest}
      >
        {items.map((n) => {
          const filled = variant === 'numbers' ? n === value : n <= value
          return (
            <RatingGlyph
              key={n}
              $variant={variant}
              $size={size}
              $filled={filled}
              aria-hidden="true"
            >
              {glyphOf(n, filled)}
            </RatingGlyph>
          )
        })}
      </MaskedRatingRoot>
    )
  }

  return (
    <MaskedRatingRoot
      role="radiogroup"
      aria-label={label ?? dict.label}
      className={className}
      style={{ ...tokenStyle, ...style }}
      onMouseLeave={() => setHover(undefined)}
      {...rest}
    >
      {items.map((n) => {
        const filled = variant === 'numbers' ? n === shown : n <= shown
        return (
          <RatingItem
            key={n}
            $variant={variant}
            $size={size}
            $interactive
            onMouseEnter={() => setHover(n)}
          >
            <RatingRadio
              type="radio"
              name={name ?? generatedName}
              value={n}
              checked={value === n}
              aria-label={dict.option(n, total)}
              onChange={() => choose(n)}
              onClick={() => {
                if (allowClear && value === n) choose(0)
              }}
            />
            <RatingGlyph $variant={variant} $size={size} $filled={filled} aria-hidden="true">
              {glyphOf(n, filled)}
            </RatingGlyph>
          </RatingItem>
        )
      })}
    </MaskedRatingRoot>
  )
}
