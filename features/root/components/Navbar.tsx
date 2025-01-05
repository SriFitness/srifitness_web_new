'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import logo from '@/public/logo.png'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import avatar from '@/public/avatar.png'
import { Button } from '@/components/ui/button'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Indoor Facilities', href: '/indoor' },
  { name: 'Marketplace', href: '/marketplace' },
  { name: 'Classes', href: '/classes' },
  { name: 'About', href: '/about' },
]




export default function Navbar() {                                        // Navbar component for the website
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter();

  const auth = useAuth();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, []);

  useEffect(() => {
    if(auth?.currentUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [auth?.currentUser]);

  const handleLogin = () => {
    router.push('/sign-in');
  }

  const handleLogout = () => {
    if(auth?.currentUser){
      auth?.logout()
      .then(() => {
        router.push('/')
      })
      .catch((error: unknown) => {
        console.log(`error: ${error}`);
      })
    }
  }

  const dropDown = [
    { name: 'Profile', action: () => router.push('/profile') },
    { name: 'Settings', action: () => router.push('/settings') },
    { name: 'Logout', action: handleLogout },
  ];
  


  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`glassmorphism rounded-full ${isScrolled ? 'py-2' : 'py-4'} px-6 flex items-center justify-between transition-all duration-300`}>
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10  rounded-full flex items-center justify-center"
              >
                <Image src={logo} alt='sri fitness logo' />
              </motion.div>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white hover:text-[#E96A25] px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                >
                  <motion.span whileHover={{ scale: 1.05 }}>
                    {link.name}
                  </motion.span>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            {isLoggedIn ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-sm focus:outline-none"
                >
                  <Image
                    className="h-8 w-8 rounded-full"
                    src={avatar} 
                    alt="User profile"
                  />
                  <ChevronDown className="ml-1 h-4 w-4 text-white" />
                </motion.button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg glassmorphism ring-1 ring-black ring-opacity-5"
                    >
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                        {dropDown.map((item) => (
                          <Button
                            key={item.name}
                            onClick={item.action}
                            className="block w-full px-4 py-2 text-sm text-white hover:bg-[#E96A25] hover:text-white transition duration-300 ease-in-out rounded-md"
                            role="menuitem"
                          >
                            {item.name}
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#F9A826' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogin}
                className="bg-[#E96A25] hover:bg-[#F9A826] text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Login
              </motion.button>
            )}
          </div>
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-[#E96A25] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#E96A25] focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glassmorphism mt-2 rounded-xl mx-4"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="text-white hover:bg-[#E96A25] hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-[#E96A25]">
              <div className="flex items-center px-5">
                {isLoggedIn ? (
                  <>
                    <div className="flex-shrink-0">
                      <Image className="h-10 w-10 rounded-full" src={avatar} alt="User profile" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">User Name</div>
                      <div className="text-sm font-medium leading-none text-gray-400">user@example.com</div>
                    </div>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#F9A826' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogin}
                    className="bg-[#E96A25] hover:bg-[#F9A826] text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                  >
                    Login
                  </motion.button>
                )}
              </div>
              {isLoggedIn && (
                <div className="mt-3 px-2 space-y-1" >
                  {dropDown.map((item) => (
                    <Button
                      key={item.name}
                      onClick={item.action}
                      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#E96A25] hover:text-white"
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

