"use client"

import type React from "react"

import { useEffect, useState } from "react"
import FloatingSidebar from "@/components/ui/floating-sidebar"
import { cn } from "@/lib/utils"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    // Listen to sidebar open/close events dispatched by the sidebar component
    function onSidebarChange(e: Event) {
      const detail = (e as CustomEvent).detail as { open: boolean }
      if (typeof detail?.open === "boolean") {
        setSidebarOpen(detail.open)
      }
    }
    window.addEventListener("v0-sidebar:change", onSidebarChange as EventListener)
    // Initialize: ask sidebar to announce its current state
    window.dispatchEvent(new CustomEvent("v0-sidebar:request-sync"))
    return () => {
      window.removeEventListener("v0-sidebar:change", onSidebarChange as EventListener)
    }
  }, [])

  return (
    <>
      <FloatingSidebar />
      <main
        className={cn("min-h-dvh transition-[margin] duration-300 ease-out", sidebarOpen ? "ml-16 md:ml-20" : "ml-2")}
      >
        {children}
      </main>
    </>
  )
}
