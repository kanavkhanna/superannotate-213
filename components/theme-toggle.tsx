"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="rounded-full border-border/60 bg-background/50 w-9 h-9"
        disabled
        aria-label="Loading theme toggle"
      >
        <div className="h-[1.2rem] w-[1.2rem] opacity-50" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="rounded-full border-border/60 bg-background/50 w-9 h-9"
      title={resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {resolvedTheme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">{resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}</span>
    </Button>
  )
}

