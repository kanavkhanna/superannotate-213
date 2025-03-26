import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import Providers from "./providers"

export const metadata: Metadata = {
  title: "Volunteer Connect",
  description: "Find and bookmark local volunteer opportunities",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}



import './globals.css'