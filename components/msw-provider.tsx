"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface MSWProviderProps {
  children: React.ReactNode
}

export function MSWProvider({ children }: MSWProviderProps) {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined") {
        console.log("[v0] MSW: Starting initialization...")
        try {
          const { enableMocking } = await import("@/lib/msw/setup")
          await enableMocking()
          console.log("[v0] MSW: Successfully initialized")
          setMswReady(true)
        } catch (error) {
          console.error("[v0] MSW: Failed to initialize", error)
          setMswReady(true) // Still render the app even if MSW fails
        }
      } else {
        console.log("[v0] MSW: Server-side, skipping browser setup")
        setMswReady(true)
      }
    }

    init()
  }, [])

  if (!mswReady) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}
