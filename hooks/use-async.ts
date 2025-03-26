"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"

interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

export function useAsync<T, P extends any[]>(
  asyncFunction: (...args: P) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
    showErrorToast?: boolean
    errorMessage?: string
  },
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: P) => {
      setState({ data: null, isLoading: true, error: null })
      try {
        const data = await asyncFunction(...args)
        setState({ data, isLoading: false, error: null })
        options?.onSuccess?.(data)
        return data
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error))
        setState({ data: null, isLoading: false, error: errorObj })
        options?.onError?.(errorObj)

        if (options?.showErrorToast !== false) {
          toast.error(options?.errorMessage || "An error occurred", {
            description: errorObj.message || "Please try again later",
          })
        }

        throw errorObj
      }
    },
    [asyncFunction, options],
  )

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

