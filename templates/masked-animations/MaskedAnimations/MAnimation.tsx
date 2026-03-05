import styled, { css } from "styled-components";
import { AnimationType, Props, registry } from "./MAnimation.types";
import { useInView } from "./hooks/useInView";

const Container = styled.div<{
  $type: AnimationType;
  $animation: string;
  $isOn?: boolean;
  $active: boolean;
  $center?: boolean;
}>`
  width: 100%;

  ${({ $center }) =>
    $center &&
    css`
      display: flex;
      justify-content: center;
      align-items: center;
    `}

  ${({ $type, $active }) =>
    $type === "reveal" &&
    css`
      opacity: ${$active ? 1 : 0};
    `}

    ${({ $type, $animation, $active }) => {
    const group = registry[$type];
    const animationCSS = group[$animation as keyof typeof group];

    if ($type === "reveal") {
      return $active ? animationCSS : "";
    }

    if ($type === "controlled") {
      return animationCSS;
    }

    return animationCSS;
  }}
`;

export function MAnimation<T extends AnimationType>({
  children,
  type,
  animation,
  isOn,
  center,
}: Props<T>) {
  const { ref, isVisible } = useInView<HTMLDivElement>();

  return (
    <Container
      ref={type === "reveal" ? ref : undefined}
      $type={type}
      $animation={animation as string}
      $isOn={isOn}
      $active={isVisible}
      $center={center}
    >
      {children}
    </Container>
  );
}
