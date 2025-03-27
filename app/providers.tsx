"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import NetworkStatus from "@/components/network-status"
import ErrorBoundary from "@/components/error-boundary"

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme="light"
      disableTransitionOnChange
      storageKey="volunteer-theme"
    >
      <ErrorBoundary>
        {children}
        <NetworkStatus />
        <Toaster
          position="top-right"
          closeButton
          theme="light"
          richColors
          toastOptions={{
            classNames: {
              toast: "rounded-lg border border-border/60 bg-card/95 backdrop-blur-sm",
              title: "text-foreground font-medium",
              description: "text-muted-foreground",
            },
          }}
        />
      </ErrorBoundary>
    </ThemeProvider>
  )
}

