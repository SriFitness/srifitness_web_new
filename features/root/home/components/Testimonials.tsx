'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const testimonials = [
  {
    name: 'John Doe',
    text: 'This gym has completely transformed my fitness journey. The trainers are amazing!',
    image: '',
  },
  {
    name: 'Jane Smith',
    text: 'I love the variety of classes offered. There\'s always something new to try!',
    image: '',
  },
  {
    name: 'Mike Johnson',
    text: 'The facilities are top-notch, and the community is so supportive. Best gym ever!',
    image: '',
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">What Our Members Say</h2>
        <div className="relative h-64">
          <AnimatePresence>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-20 h-20 rounded-full mb-4"
              />
              <p className="text-xl mb-2">{testimonials[currentIndex].text}</p>
              <p className="font-semibold">{testimonials[currentIndex].name}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

