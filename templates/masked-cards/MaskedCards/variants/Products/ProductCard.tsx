'use client'

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

export default function ProductCard({
  image,
  title,
  description,
  price,
  originalPrice,
  badge,
  status,
  actions,
  size,
  fullWidth,
  href,
  onClick,
  className
}: Props) {
  return (
    <ProductCardContainer size={size} fullWidth={fullWidth} href={href} onClick={onClick} className={className}>
      {image ? <ProductImage src={image} alt={title} /> : <ProductImagePlaceholder>📦</ProductImagePlaceholder>}

      <ProductHeader>
        <ProductTitle>{title}</ProductTitle>
        {badge && <ProductBadge>{badge}</ProductBadge>}
        {status && <ProductStatus $status={status}>{status}</ProductStatus>}
      </ProductHeader>

      {description && <ProductDescription>{description}</ProductDescription>}

      {(price !== undefined || originalPrice !== undefined) && (
        <ProductPriceRow>
          {price !== undefined && <ProductPrice>R$ {price}</ProductPrice>}
          {originalPrice !== undefined && <ProductOriginalPrice>R$ {originalPrice}</ProductOriginalPrice>}
        </ProductPriceRow>
      )}

      {actions && <ProductActions>{actions}</ProductActions>}
    </ProductCardContainer>
  )
}
