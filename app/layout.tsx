import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import { MSWProvider } from "@/components/msw-provider"
import SiteFooter from "@/components/site-footer"
import FloatingSidebar from "@/components/floating-sidebar"

const geistSans = Inter({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

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
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable}`}>
        <MSWProvider>
          <Suspense>
            <FloatingSidebar />
            {children}
            <SiteFooter />
          </Suspense>
        </MSWProvider>
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
