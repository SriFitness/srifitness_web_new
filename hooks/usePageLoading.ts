// "use client"

// import { useEffect } from 'react'
// import { usePathname, useSearchParams } from 'next/navigation'
// import { useLoading } from '@/components/providers/LoadingContext'

// export function usePageLoading() {
//   const pathname = usePathname()
//   const searchParams = useSearchParams()
//   const { setIsLoading, setProgress } = useLoading()

//   useEffect(() => {
//     const handleStart = () => {
//       setIsLoading(true)
//       setProgress(20)
//     }

//     const handleComplete = () => {
//       setProgress(100)
//       setTimeout(() => {
//         setIsLoading(false)
//         setProgress(0)
//       }, 500)
//     }

//     handleStart()

//     // Simulate progress
//     // const interval = setInterval(() => {
//     //   setProgress((prevProgress) => {
//     //     const newProgress = prevProgress + 20
//     //     return newProgress > 90 ? 90 : newProgress
//     //   })
//     // }, 500)

//     let progress = 20
//     const interval = setInterval(() => {
//       progress += 20
//       setProgress(progress > 90 ? 90 : progress)
//     }, 500)

//     // Check for the custom header to determine when middleware processing is complete
//     const checkMiddleware = async () => {
//       const response = await fetch(window.location.href, { method: 'HEAD' })
//       if (response.headers.get('x-middleware-processed') === 'true') {
//         clearInterval(interval)
//         handleComplete()
//       } else {
//         setTimeout(checkMiddleware, 100)
//       }
//     }

//     checkMiddleware()

//     return () => {
//       clearInterval(interval)
//     }
//   }, [pathname, searchParams, setIsLoading, setProgress])
// }

