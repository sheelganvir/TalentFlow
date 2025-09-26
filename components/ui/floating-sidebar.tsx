"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Briefcase, Users, ClipboardList, X } from "lucide-react"
import { cn } from "@/lib/utils"

type Item = {
  href: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const items: Item[] = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/assessments", label: "Assessments", icon: ClipboardList },
]

export function FloatingSidebar() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed left-2 top-1/2 -translate-y-1/2 z-40 w-8 h-8 bg-white dark:bg-black text-black dark:text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        aria-label="Show sidebar"
        title="Open sidebar"
      >
        <span className="relative flex h-2.5 w-2.5 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-30"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-current"></span>
        </span>
      </button>
    )
  }

  return (
    <nav aria-label="Primary" className="fixed left-2 top-1/2 -translate-y-1/2 z-40">
      <ul
        className="
          flex flex-col items-center
          bg-white dark:bg-black text-black dark:text-white
          rounded-full py-4 px-1.5 gap-4
          shadow-lg hover:shadow-xl
          transition-all duration-200
        "
        style={{ width: 48 }}
      >
        <li>
          <button
            onClick={() => setIsVisible(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Hide sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </li>

        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <li key={href} className="relative group">
              <Link
                href={href}
                aria-label={label}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  "transition-colors",
                  active
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800",
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "opacity-100" : "opacity-80 group-hover:opacity-100")} />
                <span className="sr-only">{label}</span>
              </Link>

              <span
                className="
                  pointer-events-none
                  absolute left-[48px] top-1/2 -translate-y-1/2
                  whitespace-nowrap
                  rounded-md px-2 py-1
                  bg-white dark:bg-black text-black dark:text-white
                  opacity-0 translate-x-1
                  group-hover:opacity-100 group-hover:translate-x-0
                  transition-all duration-200
                  shadow-lg
                "
              >
                {label}
              </span>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default FloatingSidebar
