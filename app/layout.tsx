import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import FloatingSidebar from "@/components/ui/floating-sidebar"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "TalentFlow",
  description: "A modern applicant tracking system (ATS) for startups and SMEs.",
  generator: "Sheel",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ml-16`}>
        <Suspense>
          <FloatingSidebar />
          {children}
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
