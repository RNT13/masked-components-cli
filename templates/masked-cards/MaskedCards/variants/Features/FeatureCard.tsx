'use client'  
  
import { CardVariantMap } from '../../MaskedCards.types'  
import {  
  FeatureAction,  
  FeatureCardContainer,  
  FeatureDescription,  
  FeatureIcon,  
  FeatureTitle  
} from './FeatureCard.styles'  
  
type Props = { $variant: 'feature' } & CardVariantMap['feature']  
  
export default function FeatureCard({  
  icon,  
  iconBgColor,  
  iconTextColor,  
  title,  
  description,  
  action,  
  highlight,  
  iconSize,  
  hrefLabel,  
  ...rest  
}: Props) {  
  return (  
    <FeatureCardContainer  
      $highlight={highlight}  
      hasActions={!!action}  
      hrefLabel={hrefLabel ?? title}  
      {...rest}  
    >  
      {icon && (  
        <FeatureIcon $bg={iconBgColor} $color={iconTextColor} $iconSize={iconSize}>  
          {icon}  
        </FeatureIcon>  
      )}  
      <FeatureTitle>{title}</FeatureTitle>  
      {description && <FeatureDescription>{description}</FeatureDescription>}  
      {action && <FeatureAction>{action}</FeatureAction>}  
    </FeatureCardContainer>  
  )  
}  