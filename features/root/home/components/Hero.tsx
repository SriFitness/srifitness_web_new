'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useMotionValue, useTransform, animate } from 'framer-motion'
import main_cover_image from '@/public/hero_section/main_cover_image.png'
import Image from 'next/image'

const slides = [
  { image: main_cover_image },
  { image: main_cover_image },
  { image: main_cover_image },
]

const stats = [
  { label: 'Happy Customers', value: 400 },
  { label: 'Workout Plans', value: 200 },
  { label: 'Expert Trainers', value: 10 },
]

// Counter Component
const Counter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const controls = animate(count, value, {
      duration: duration,
      ease: 'easeOut',
    })

    const unsubscribe = rounded.onChange((latest) => setDisplayValue(latest))

    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [count, value, rounded, duration])

  return <span>{displayValue}</span>
}

// Hero Component
export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].image}
            alt={`Slide ${currentSlide + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </motion.div>
      </AnimatePresence>

      {/* Stats */}
      <div ref={ref} className="relative z-10 w-full">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-around">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center p-4"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#E96A25]">
                  {inView ? <Counter value={stat.value} /> : 0}
                  {stat.label === 'Happy Customers' && '+'}
                </div>
                <div className="text-sm md:text-base lg:text-lg text-white mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
