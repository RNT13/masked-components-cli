"use client";

import { useEffect } from "react";
import { registerAnimationProperties } from "../animations/registerAnimationProperties";

export function useAnimationEngine() {
  useEffect(() => {
    registerAnimationProperties();
  }, []);
}
