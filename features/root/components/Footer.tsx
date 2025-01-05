'use client'

import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Send } from 'lucide-react'

export default function Footer() {                                  // Footer component for the website
  return (
    <footer className="bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h3 className="text-2xl font-bold mb-4">Stay Connected</h3>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  className="text-white hover:text-red-500 transition-colors duration-300"
                >
                  <Icon size={24} />
                </motion.a>
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h3>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-r-md transition duration-300 ease-in-out"
              >
                <Send size={20} />
              </motion.button>
            </form>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <p>&copy; 2025 Sri Fitness. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

