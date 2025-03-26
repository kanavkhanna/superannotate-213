"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface RetryButtonProps {
  onRetry: () => Promise<void>
  className?: string
  label?: string
}

export default function RetryButton({ onRetry, className = "", label = "Try Again" }: RetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await onRetry()
      toast.success("Successfully refreshed", {
        description: "The content has been updated",
      })
    } catch (error) {
      console.error("Retry failed:", error)
      toast.error("Retry failed", {
        description: error instanceof Error ? error.message : "Please try again later",
      })
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <Button
      onClick={handleRetry}
      disabled={isRetrying}
      className={`rounded-full flex items-center gap-2 ${className}`}
      aria-label={isRetrying ? "Retrying..." : label}
    >
      <RefreshCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
      {isRetrying ? "Retrying..." : label}
    </Button>
  )
}

