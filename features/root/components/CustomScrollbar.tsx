'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

export default function CustomScrollbar() {
  const [isScrolling, setIsScrolling] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const handleScroll = () => {
      setIsScrolling(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setIsScrolling(false), 1000)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <motion.div
      className="fixed top-0 right-0 w-2 h-full z-50"
      style={{
        opacity: 1, // Always visible
      }}
    >
      <motion.div
        className="bg-[#E96A25] h-full w-full rounded-full origin-top"
        style={{ 
          scaleY, 
          opacity: isScrolling ? 0.7 : 0.3 // More visible when scrolling
        }}
      />
    </motion.div>
  )
}

