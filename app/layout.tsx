import type React from "react"
import "@/app/globals.css"
import type { Metadata, Viewport } from "next"
import Providers from "./providers"

export const metadata: Metadata = {
  title: "Volunteer Connect",
  description: "Find and bookmark local volunteer opportunities",
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Ensure users can zoom the page for accessibility
  minimumScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="overscroll-none">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}



import './globals.css'