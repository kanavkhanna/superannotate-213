"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun } from "lucide-react"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    // Always set theme to light
    setTheme("light")
  }, [setTheme])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="rounded-full border-border/60 bg-background/50 w-9 h-9"
        disabled
        aria-label="Light theme"
      >
        <div className="h-[1.2rem] w-[1.2rem] opacity-50" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full border-border/60 bg-background/50 w-9 h-9"
      aria-label="Light theme"
      title="Light theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Light theme</span>
    </Button>
  )
}

