'use client'  
  
import { CardVariantMap } from '../../MaskedCards.types'  
import { StatCardContainer, StatIcon, StatLabel, StatValue } from './StatCard.styles'  
  
type Props = { $variant: 'stat' } & CardVariantMap['stat']  
  
export default function StatCard({  
  icon,  
  iconBgColor,  
  iconTextColor,  
  labelTextColor,  
  valueTextColor,  
  value,  
  value2,  
  label,  
  label2,  
  iconSize,  
  hrefLabel,  
  ...rest  
}: Props) {  
  return (  
    <StatCardContainer hrefLabel={hrefLabel ?? String(label ?? 'Ver detalhes')} {...rest}>  
      {icon && (  
        <StatIcon $bg={iconBgColor} $color={iconTextColor} $iconSize={iconSize}>  
          {icon}  
        </StatIcon>  
      )}  
      <StatValue $valueTextColor={valueTextColor}>{value}</StatValue>  
      {value2 && <StatValue>{value2}</StatValue>}  
      <StatLabel $labelTextColor={labelTextColor}>{label}</StatLabel>  
      {label2 && <StatLabel>{label2}</StatLabel>}  
    </StatCardContainer>  
  )  
}  