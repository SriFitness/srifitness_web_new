import Hero from '@/features/root/home/components/Hero'
import Features from '@/features/root/home/components/Features'
import Testimonials from '@/features/root/home/components/Testimonials'
import MobileAppShowcase from '@/features/root/home/components/MobileAppShowcase'
import { Suspense } from 'react'

export default function Home() {
  return (
    <Suspense>
      <main className="min-h-screen bg-gray-900 text-white">
        <Hero />
        <Features />
        <Testimonials />
        <MobileAppShowcase />
      </main>
    </Suspense>
  )
}

