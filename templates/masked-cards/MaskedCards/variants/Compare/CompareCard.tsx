'use client'  
  
import { CardVariantMap } from '../../MaskedCards.types'  
import {  
  CompareCardContainer,  
  CompareIcon,  
  CompareLabel,  
  CompareTrend,  
  CompareValue  
} from './CompareCard.styles'  
  
type Props = { $variant: 'compare' } & CardVariantMap['compare']  
  
export default function CompareCard({  
  icon,  
  iconBgColor,  
  iconTextColor,  
  value,  
  label,  
  compareText,  
  compareTrend,  
  iconSize,  
  hrefLabel,  
  ...rest  
}: Props) {  
  const arrow = compareTrend === 'up' ? '↗' : compareTrend === 'down' ? '↘' : '→'  
  
  return (  
    <CompareCardContainer hrefLabel={hrefLabel ?? String(label ?? 'Ver comparação')} {...rest}>  
      {icon && (  
        <CompareIcon $bg={iconBgColor} $color={iconTextColor} $iconSize={iconSize}>  
          {icon}  
        </CompareIcon>  
      )}  
      <CompareValue>{value}</CompareValue>  
      <CompareLabel>{label}</CompareLabel>  
      {compareText && (  
        <CompareTrend $trend={compareTrend}>  
          {arrow} {compareText}  
        </CompareTrend>  
      )}  
    </CompareCardContainer>  
  )  
}  