"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error) => void
}

export default function ErrorBoundary({ children, fallback, onError }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Caught error:", error)
      setHasError(true)

      if (onError && error.error instanceof Error) {
        onError(error.error)
      }

      toast.error("An error occurred", {
        description: "Something went wrong. Please try refreshing the page.",
        action: {
          label: "Refresh",
          onClick: () => window.location.reload(),
        },
      })

      // Prevent the default error handling
      error.preventDefault()
    }

    window.addEventListener("error", errorHandler)

    return () => {
      window.removeEventListener("error", errorHandler)
    }
  }, [onError])

  if (hasError) {
    if (fallback) return <>{fallback}</>

    return (
      <Card className="w-full bg-card/50 border-border/60 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground text-center mb-6">We encountered an error while loading this content.</p>
          <Button onClick={() => window.location.reload()} className="rounded-full flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </Button>
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}

