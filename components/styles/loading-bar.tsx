//components/styles/loading-bar.tsx
"use client"

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLoading } from '@/components/providers/LoadingContext'

export function LoadingBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isLoading, progress } = useLoading()

  useEffect(() => {
    // Reset progress when route changes
    return () => {
      // Clean up or reset if necessary
    }
  }, [pathname, searchParams])

  return (
    <Suspense>
      {isLoading && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-[#E96A25] z-50"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      )}
    </Suspense>
  )
}

