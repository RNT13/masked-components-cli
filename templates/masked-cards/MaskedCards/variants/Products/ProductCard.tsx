'use client'

import { formatCurrency } from '@/utils/masked-utils'
import { CardVariantMap } from '../../MaskedCards.types'
import {
  ProductActions,
  ProductBadge,
  ProductCardContainer,
  ProductDescription,
  ProductHeader,
  ProductImage,
  ProductImagePlaceholder,
  ProductOriginalPrice,
  ProductPrice,
  ProductPriceRow,
  ProductStatus,
  ProductTitle
} from './ProductCard.styles'

type Props = { $variant: 'product' } & CardVariantMap['product']

const STATUS_LABELS: Record<string, string> = {
  active: 'ativo',
  inactive: 'inativo',
  warning: 'atenção',
  error: 'erro'
}

function formatPrice(value: string | number, format?: { locale?: string; currency?: string }) {
  if (!format) return value
  const n = Number(value)
  return Number.isFinite(n)
    ? formatCurrency(n, {
        locale: format.locale ?? 'pt-BR',
        currency: format.currency ?? 'BRL'
      })
    : value
}

export default function ProductCard({
  image,
  imageAlt,
  imagePlaceholder,
  title,
  description,
  price,
  originalPrice,
  priceFormat,
  badge,
  status,
  statusLabels,
  actions,
  size,
  fullWidth,
  cardBg,
  direction,
  colorTheme,
  tokens,
  style,
  href,
  onClick,
  className
}: Props) {
  return (
    <ProductCardContainer
      size={size}
      fullWidth={fullWidth}
      cardBg={cardBg}
      direction={direction}
      colorTheme={colorTheme}
      tokens={tokens}
      style={style}
      href={href}
      onClick={onClick}
      className={className}
    >
      {image ? (
        <ProductImage src={image} alt={imageAlt ?? title} />
      ) : (
        <ProductImagePlaceholder aria-hidden="true">{imagePlaceholder}</ProductImagePlaceholder>
      )}

      <ProductHeader>
        <ProductTitle>{title}</ProductTitle>
        {badge && <ProductBadge>{badge}</ProductBadge>}
        {status && (
          <ProductStatus $status={status}>
            {statusLabels?.[status] ?? STATUS_LABELS[status] ?? status}
          </ProductStatus>
        )}
      </ProductHeader>

      {description && <ProductDescription>{description}</ProductDescription>}

      {(price !== undefined || originalPrice !== undefined) && (
        <ProductPriceRow>
          {price !== undefined && <ProductPrice>{formatPrice(price, priceFormat)}</ProductPrice>}
          {originalPrice !== undefined && (
            <ProductOriginalPrice>{formatPrice(originalPrice, priceFormat)}</ProductOriginalPrice>
          )}
        </ProductPriceRow>
      )}

      {actions && <ProductActions>{actions}</ProductActions>}
    </ProductCardContainer>
  )
}
