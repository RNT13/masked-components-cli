'use client'  
  
import { CardVariantMap } from '../../MaskedCards.types'  
import { BaseCard } from '../../Base/BaseCard'  
import { CardIconBadge } from '../../Base/BaseCard.styles'  
import {  
  ServiceActions,  
  ServiceBadge,  
  ServiceBody,  
  ServiceDescription,  
  ServiceDuration,  
  ServiceMedia,  
  ServiceMeta,  
  ServicePrice,  
  ServicePricePrefix,  
  ServicePriceRow,  
  ServiceTitle  
} from './ServiceCard.styles'  
  
type Props = CardVariantMap['service']  
  
function formatPrice(  
  price: string | number | undefined,  
  format: Props['priceFormat']  
): string | number | undefined {  
  if (price === undefined) return undefined  
  if (typeof price === 'number' && format) {  
    return new Intl.NumberFormat(format.locale, {  
      style: 'currency',  
      currency: format.currency  
    }).format(price)  
  }  
  return price  
}  
  
export function ServiceCard({  
  icon,  
  iconSize,  
  iconBgColor,  
  iconTextColor,  
  image,  
  imageAlt,  
  title,  
  description,  
  price,  
  pricePrefix = 'A partir de',  
  priceFormat,  
  duration,  
  badge,  
  actions,  
  ...rest  
}: Props) {  
  const formattedPrice = formatPrice(price, priceFormat)  
  
  return (  
    <BaseCard  
      {...rest}  
      hasActions={!!actions}  
      hrefLabel={rest.hrefLabel ?? title}  
    >  
      {image ? (  
        <ServiceMedia>  
          <img src={image} alt={imageAlt ?? title} />  
          {badge ? <ServiceBadge>{badge}</ServiceBadge> : null}  
        </ServiceMedia>  
      ) : null}  
  
      <ServiceBody>  
        {!image && (icon || badge) ? (  
          <ServiceMeta>  
            {icon ? (  
              <CardIconBadge  
                $bg={iconBgColor}  
                $color={iconTextColor}  
                $iconSize={iconSize}  
              >  
                {icon}  
              </CardIconBadge>  
            ) : null}  
            {badge ? <ServiceBadge style={{ position: 'static' }}>{badge}</ServiceBadge> : null}  
          </ServiceMeta>  
        ) : null}  
  
        <ServiceTitle>{title}</ServiceTitle>  
        {description ? <ServiceDescription>{description}</ServiceDescription> : null}  
  
        {formattedPrice !== undefined || duration ? (  
          <ServicePriceRow>  
            {formattedPrice !== undefined ? (  
              <ServicePrice>  
                {pricePrefix ? <ServicePricePrefix>{pricePrefix} </ServicePricePrefix> : null}  
                {formattedPrice}  
              </ServicePrice>  
            ) : null}  
            {duration ? <ServiceDuration>{duration}</ServiceDuration> : null}  
          </ServicePriceRow>  
        ) : null}  
  
        {actions ? <ServiceActions>{actions}</ServiceActions> : null}  
      </ServiceBody>  
    </BaseCard>  
  )  
}  