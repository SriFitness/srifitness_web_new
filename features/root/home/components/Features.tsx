'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Dumbbell, Users, ShoppingBag } from 'lucide-react'

const features = [
  {
    title: 'MMA Training',
    description: 'Learn from professional fighters and get in the best shape of your life.',
    icon: Dumbbell,
  },
  {
    title: 'Indoor Cricket & Dance',
    description: 'Book sessions for indoor cricket or join our energetic dance classes.',
    icon: Users,
  },
  {
    title: 'Fitness Marketplace',
    description: 'Shop for the best fitness gear and supplements in our online store.',
    icon: ShoppingBag,
  },
]

export default function Features() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-red-500 mb-4"
              >
                <feature.icon size={48} />
              </motion.div>
              <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

