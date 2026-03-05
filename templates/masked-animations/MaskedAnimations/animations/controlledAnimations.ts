import { css } from "styled-components";
import { rocketTrajectory } from "./keyframes";
import { transitions } from "./transitions";

export const controlledAnimations = {
  fadeInOut: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    pointer-events: ${({ $isOn }) => ($isOn ? "auto" : "none")};
    ${transitions.fast}
  `,

  slideFromLeft: css<{ $isOn?: boolean }>`
    transform: ${({ $isOn }) =>
      $isOn ? "translateX(0)" : "translateX(-16px)"};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    ${transitions.default}
  `,

  slideFromRight: css<{ $isOn?: boolean }>`
    transform: ${({ $isOn }) => ($isOn ? "translateX(0)" : "translateX(16px)")};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    ${transitions.default}
  `,

  slideFromTop: css<{ $isOn?: boolean }>`
    transform: ${({ $isOn }) =>
      $isOn ? "translateY(0)" : "translateY(-16px)"};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    ${transitions.fast}
  `,

  slideFromBottom: css<{ $isOn?: boolean }>`
    transform: ${({ $isOn }) => ($isOn ? "translateY(0)" : "translateY(16px)")};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    ${transitions.default}
  `,

  zoomInOut: css<{ $isOn?: boolean }>`
    transform: ${({ $isOn }) => ($isOn ? "scale(1)" : "scale(0.95)")};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    ${transitions.fast}
  `,

  drawer: css<{ $isOn?: boolean; $maxHeight?: string }>`
    overflow: hidden;
    max-height: ${({ $isOn, $maxHeight }) =>
      $isOn ? $maxHeight || "500px" : "0"};
    transition: max-height 0.35s ease;
  `,

  rocketLaunch: css`
    animation: ${rocketTrajectory} 4s cubic-bezier(0.22, 1.4, 0.36, 1);
  `,
};
