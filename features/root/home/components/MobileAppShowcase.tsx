'use client'

import { motion } from 'framer-motion'

export default function MobileAppShowcase() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-1/2 mb-12 md:mb-0">
            <motion.img
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              alt="Mobile App Screenshot"
              className="mx-auto rounded-3xl shadow-2xl"
            />
          </div>
          <div className="w-full md:w-1/2">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold mb-6 text-white"
            >
              Take Your Fitness Journey Mobile
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl mb-8 text-gray-300"
            >
              Download our mobile app to track your workouts, set goals, and stay connected with your fitness community on the go.
            </motion.p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="bg-[#E96A25] hover:bg-[#F9A826] text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Download for iOS
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="bg-[#E96A25] hover:bg-[#F9A826] text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Download for Android
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

