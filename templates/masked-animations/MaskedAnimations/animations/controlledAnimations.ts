import { css } from "styled-components";
import { transitions } from "./transitions";

/* ======================================================  
   CONTROLLED ANIMATIONS  
   Estado controlado por $isOn (aberto/fechado, drawer,  
   collapse). Fidelidade 1:1 com o Zandry: drawers usam  
   teto de 75vh com área rolável (scrollArea), demais  
   usam teto fixo de 600px.  
   Backlog: tornar o teto do drawer configurável  
   (variável CSS / dvh) — não implementar agora.  
====================================================== */

/** Scrollbar sutil reaproveitável nos drawers roláveis. */
const scrollArea = css`
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.18);
    border-radius: 999px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const controlledAnimations = {
  controlledFadeInOut: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    pointer-events: ${({ $isOn }) => ($isOn ? "auto" : "none")};
    ${transitions.drawer}
  `,

  controlledSlideFromLeft: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    transform: ${({ $isOn }) =>
      $isOn ? "translateX(0)" : "translateX(-16px)"};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    pointer-events: ${({ $isOn }) => ($isOn ? "auto" : "none")};
    ${transitions.drawer}
  `,

  controlledSlideFromRight: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    transform: ${({ $isOn }) => ($isOn ? "translateX(0)" : "translateX(16px)")};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    pointer-events: ${({ $isOn }) => ($isOn ? "auto" : "none")};
    ${transitions.drawer}
  `,

  controlledSlideFromTop: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    transform: ${({ $isOn }) =>
      $isOn ? "translateY(0)" : "translateY(-16px)"};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    pointer-events: ${({ $isOn }) => ($isOn ? "auto" : "none")};
    ${transitions.drawer}
  `,

  controlledSlideFromBottom: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    transform: ${({ $isOn }) => ($isOn ? "translateY(0)" : "translateY(16px)")};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    pointer-events: ${({ $isOn }) => ($isOn ? "auto" : "none")};
    ${transitions.drawer}
  `,

  controlledZoomInOut: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    transform: ${({ $isOn }) => ($isOn ? "scale(1)" : "scale(0.95)")};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    ${transitions.drawer}
  `,

  /** DRAWER PRINCIPAL: rolável e adaptável a qualquer conteúdo. */
  controlledDrawer: css<{ $isOn?: boolean }>`
    /* aberto: teto relativo ao viewport -> lista pequena encolhe,  
       lista grande rola. fechado: max-height 0 + overflow hidden  
       garante o colapso suave. */
    max-height: ${({ $isOn }) => ($isOn ? "75vh" : "0")};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    transform: ${({ $isOn }) => ($isOn ? "translateY(0)" : "translateY(-6px)")};
    pointer-events: ${({ $isOn }) => ($isOn ? "auto" : "none")};

    ${({ $isOn }) =>
      $isOn
        ? scrollArea
        : css`
            overflow: hidden;
          `}

    ${transitions.drawer}
  `,

  controlledCollapse: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    transform: ${({ $isOn }) => ($isOn ? "scaleY(1)" : "scaleY(0)")};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    pointer-events: ${({ $isOn }) => ($isOn ? "auto" : "none")};
    ${transitions.drawer}
  `,

  /** @deprecated Use `controlledCollapse`. Removido na próxima major (E.20/E.21). */
  controlledColapse: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    transform: ${({ $isOn }) => ($isOn ? "scaleY(1)" : "scaleY(0)")};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    pointer-events: ${({ $isOn }) => ($isOn ? "auto" : "none")};
    ${transitions.drawer}
  `,

  controlledHideLeft: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    transform: ${({ $isOn }) =>
      $isOn ? "translateX(0)" : "translateX(-50%) scale(0.5)"};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};

    ${transitions.drawer}

    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      right: 50%;
      width: 50%;
      height: 100%;
      transform: ${({ $isOn }) =>
        $isOn ? "translateX(0) scale(1)" : "translateX(50%) scale(0.5)"};
      opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
      ${transitions.fast}
    }
  `,

  controlledFromLeftSoft: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    transform: ${({ $isOn }) =>
      $isOn ? "translateX(0px)" : "translateX(-22px)"};

    ${transitions.bounce}
  `,

  controlledFromRightSoft: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    transform: ${({ $isOn }) =>
      $isOn ? "translateX(0px)" : "translateX(22px)"};

    ${transitions.bounce}
  `,

  controlledFromTopSoft: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    transform: ${({ $isOn }) =>
      $isOn ? "translateY(0px)" : "translateY(-18px)"};

    ${transitions.bounce}
  `,

  controlledFromBottomSoft: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    transform: ${({ $isOn }) =>
      $isOn ? "translateY(0px)" : "translateY(18px)"};

    ${transitions.bounce}
  `,

  controlledFloatLeft: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    transform: ${({ $isOn }) =>
      $isOn ? "translateX(0)" : "translateX(-30px)"};

    ${transitions.premium}
  `,

  controlledFloatRight: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    transform: ${({ $isOn }) => ($isOn ? "translateX(0)" : "translateX(30px)")};

    ${transitions.premium}
  `,

  controlledFloatTop: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    transform: ${({ $isOn }) =>
      $isOn ? "translateY(-20px)" : "translateY(0)"};

    ${transitions.premium}
  `,

  controlledFloatBottom: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    transform: ${({ $isOn }) => ($isOn ? "translateY(0)" : "translateY(20px)")};

    ${transitions.premium}
  `,

  controlledPopSoft: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    transform: ${({ $isOn }) => ($isOn ? "scale(1)" : "scale(0.92)")};

    ${transitions.premium}
  `,

  controlledPopBounce: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    max-height: ${({ $isOn }) => ($isOn ? "600px" : "0")};
    transform: ${({ $isOn }) => ($isOn ? "scale(1)" : "scale(0.86)")};

    ${transitions.bounce}
  `,

  controlledBlurIn: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    filter: ${({ $isOn }) => ($isOn ? "blur(0px)" : "blur(8px)")};
    transform: ${({ $isOn }) => ($isOn ? "scale(1)" : "scale(0.96)")};

    ${transitions.premium}
  `,

  controlledFadeLift: css<{ $isOn?: boolean }>`
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    transform: ${({ $isOn }) =>
      $isOn ? "translateY(0px)" : "translateY(12px)"};

    ${transitions.premium}
  `,

  /** DRAWER SOFT: mesma lógica rolável, com easing premium. */
  controlledDrawerSoft: css<{ $isOn?: boolean }>`
    max-height: ${({ $isOn }) => ($isOn ? "75vh" : "0")};
    opacity: ${({ $isOn }) => ($isOn ? 1 : 0)};
    transform: ${({ $isOn }) =>
      $isOn ? "translateY(0)" : "translateY(-10px)"};
    pointer-events: ${({ $isOn }) => ($isOn ? "auto" : "none")};

    ${({ $isOn }) =>
      $isOn
        ? scrollArea
        : css`
            overflow: hidden;
          `}

    ${transitions.premium}
  `,
};
