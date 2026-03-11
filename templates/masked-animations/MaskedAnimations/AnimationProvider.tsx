'use client'

import { ReactNode, useEffect } from "react"

function registerAnimationProperties() {
  if (typeof window === "undefined") return

  if ("registerProperty" in CSS) {
    try {
      CSS.registerProperty({
        name: "--gold-angle",
        syntax: "<angle>",
        inherits: false,
        initialValue: "0deg",
      })

      CSS.registerProperty({
        name: "--silver-angle",
        syntax: "<angle>",
        inherits: false,
        initialValue: "0deg",
      })
    } catch {
      // evita erro se já estiver registrado
    }
  }
}

export function AnimationProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerAnimationProperties()
  }, [])

  return <>{children}</>
}
