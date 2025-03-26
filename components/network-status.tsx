"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Wifi, WifiOff } from "lucide-react"

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.success("You're back online", {
        description: "Your connection has been restored",
        icon: <Wifi className="h-4 w-4" />,
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.error("You're offline", {
        description: "Please check your internet connection",
        icon: <WifiOff className="h-4 w-4" />,
        duration: Number.POSITIVE_INFINITY,
        id: "offline-toast",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Initial check
    if (!navigator.onLine) {
      handleOffline()
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // This component doesn't render anything visible
  // It just handles network status notifications
  return null
}

