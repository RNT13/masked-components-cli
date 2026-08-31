import { css } from 'styled-components'  
import { jumpRotate, lightningStrikeMove, rocketTrajectory, shakeX } from './keyframes'  
  
export const oneShotAnimations = {  
  jumpRotate: css`  
    animation: ${jumpRotate} 0.6s ease-in-out;  
  `,  
  shakeX: css`  
    animation: ${shakeX} 0.4s ease-in-out;  
  `,  
  rocketLaunch: css`  
    animation: ${rocketTrajectory} 4s cubic-bezier(0.22, 1.4, 0.36, 1);  
  `,  
  lightningStrike: css`  
    animation: ${lightningStrikeMove} 5s ease-in-out;  
  `  
}