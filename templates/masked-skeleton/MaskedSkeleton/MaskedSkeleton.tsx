"use client";

import { forwardRef } from "react";
import { css, styled } from "styled-components";

/* ---------------------------------------------------------------
 * Tokens CSS (sobrescrevíveis via colorTheme/registry ou manualmente):
 *   --mc-skeleton-base        -> cor de fundo do bloco
 *   --mc-skeleton-highlight   -> faixa do shimmer
 *   --mc-skeleton-duration    -> velocidade (default 1.35s)
 * Defaults: rgba branco (visual atual do Zandry, pensado para dark).
 * Para fundo claro, defina no wrapper ou no :root:
 *   --mc-skeleton-base: rgba(0,0,0,0.08);
 *   --mc-skeleton-highlight: rgba(0,0,0,0.12);
 * --------------------------------------------------------------- */

type SkeletonBoxProps = {
  $width?: string | number;
  $height?: string | number;
  $radius?: string | number;
  $animation: "shimmer" | "pulse" | "none";
};

const mcSkeletonPulse = css`
  animation: mcSkeletonPulse 1.6s ease-in-out infinite;

  @keyframes mcSkeletonPulse {
    0%,
    100% {
      opacity: 0.72;
    }
    50% {
      opacity: 1;
    }
  }
`;

const mcSkeletonShimmer = css`
  @keyframes mcSkeletonShimmer {
    0% {
      transform: translateX(-120%);
    }
    100% {
      transform: translateX(120%);
    }
  }
`;

const SkeletonBox = styled.div<SkeletonBoxProps>`
  position: relative;
  overflow: hidden;
  isolation: isolate;

  width: ${({ $width }) =>
    typeof $width === "number" ? `${$width}px` : ($width ?? "100%")};
  height: ${({ $height }) =>
    typeof $height === "number" ? `${$height}px` : ($height ?? "16px")};
  border-radius: ${({ $radius }) =>
    typeof $radius === "number" ? `${$radius}px` : ($radius ?? "12px")};

  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0.04)
    ),
    linear-gradient(
      90deg,
      var(--mc-skeleton-base, rgba(255, 255, 255, 0.04)) 0%,
      var(--mc-skeleton-highlight, rgba(255, 255, 255, 0.16)) 50%,
      var(--mc-skeleton-base, rgba(255, 255, 255, 0.04)) 100%
    );

  ${({ $animation }) => $animation === "pulse" && mcSkeletonPulse}

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--mc-skeleton-highlight, rgba(255, 255, 255, 0.22)) 50%,
      transparent 100%
    );
    animation: ${({ $animation }) =>
      $animation === "shimmer"
        ? "mcSkeletonShimmer var(--mc-skeleton-duration, 1.35s) ease-in-out infinite"
        : "none"};
    pointer-events: none;
  }

  ${mcSkeletonShimmer}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    &::before {
      animation: none;
    }
  }
`;

export interface MaskedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Largura (número = px). Default: '100%'. */
  width?: string | number;
  /** Altura (número = px). Default: 16. */
  height?: string | number;
  /** Raio de borda (número = px). Ignorado quando `circle`. Default: 12. */
  radius?: string | number;
  /** Atalho para um círculo (use width=height para o diâmetro). */
  circle?: boolean;
  /** Tipo de animação. 'shimmer' (faixa varrendo) | 'pulse' | 'none'. Default: 'shimmer'. */
  animation?: "shimmer" | "pulse" | "none";
}

/**
 * Placeholder de carregamento autossuficiente (sem deps externas).
 * Componha com `flex`/`gap` para simular o layout real.
 * @example <MaskedSkeleton height={20} width="60%" />                 // linha de texto
 * @example <MaskedSkeleton circle width={48} height={48} />          // avatar
 * @example <MaskedSkeleton height={200} radius={16} animation="pulse" /> // imagem
 */
export const MaskedSkeleton = forwardRef<HTMLDivElement, MaskedSkeletonProps>(
  (
    {
      width = "100%",
      height = 16,
      radius = 12,
      circle = false,
      animation = "shimmer",
      ...rest
    },
    ref,
  ) => (
    <SkeletonBox
      ref={ref}
      $width={circle ? (width === "100%" ? height : width) : width}
      $height={height}
      $radius={circle ? "999px" : radius}
      $animation={animation}
      aria-hidden="true"
      {...rest}
    />
  ),
);
MaskedSkeleton.displayName = "MaskedSkeleton";
