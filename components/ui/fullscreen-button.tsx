// "use client"

// import { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Maximize, Minimize } from 'lucide-react'

// export function FullscreenButton() {
//   const [isFullscreen, setIsFullscreen] = useState(false)
//   const [isClient, setIsClient] = useState(false)

//   useEffect(() => {
//     setIsClient(true)
//   }, [])

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen()
//       setIsFullscreen(true)
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen()
//         setIsFullscreen(false)
//       }
//     }
//   }

//   if (!isClient) {
//     return null // Don't render anything on the server side
//   }

//   return (
//     <Button onClick={toggleFullscreen} variant="outline" size="icon">
//       {isFullscreen ? (
//         <Minimize className="h-4 w-4" />
//       ) : (
//         <Maximize className="h-4 w-4" />
//       )}
//     </Button>
//   )
// }

