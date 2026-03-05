import { continuousAnimations } from "./animations/continuousAnimations";
import { controlledAnimations } from "./animations/controlledAnimations";
import { revealAnimations } from "./animations/revealAnimations";

export const registry = {
  reveal: revealAnimations,
  controlled: controlledAnimations,
  continuous: continuousAnimations,
};

export type Registry = typeof registry;
export type AnimationType = keyof Registry;
export type AnimationName<T extends AnimationType> = keyof Registry[T];

export type Props<T extends AnimationType> = {
  children: React.ReactNode;
  type: T;
  animation: AnimationName<T>;
  isOn?: boolean;
  center?: boolean;
};
