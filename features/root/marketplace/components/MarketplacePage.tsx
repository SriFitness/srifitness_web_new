'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import styles from '@/app/(root)/marketplace/Marketplace.module.css'

const MarketplacePage = () => {
  return (
    <div className={styles.marketplacePage}>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <Image
          src="/placeholder.svg?height=600&width=1920"
          alt="Fitness Equipment"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative z-10 text-white">
          <h1 className="text-5xl font-bold mb-6">
            Premium Fitness Equipment & Supplements
          </h1>
          <p className="text-xl mb-8 max-w-2xl">
            Your one-stop shop for all your fitness needs. Quality equipment and
            supplements to help you achieve your fitness goals.
          </p>
          <Button size="lg" variant="default">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
        <Tabs defaultValue="equipment" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="equipment">Fitness Equipment</TabsTrigger>
            <TabsTrigger value="supplements">Supplements</TabsTrigger>
          </TabsList>
          <TabsContent value="equipment">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card>
                <CardContent className="p-4">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt="Treadmills"
                    width={300}
                    height={200}
                    className="rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Treadmills</h3>
                  <p className="text-muted-foreground">
                    Professional grade treadmills for home and commercial use
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt="Exercise Bikes"
                    width={300}
                    height={200}
                    className="rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Exercise Bikes</h3>
                  <p className="text-muted-foreground">
                    High-quality exercise bikes for effective cardio workouts
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt="Weights"
                    width={300}
                    height={200}
                    className="rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">
                    Weights & Dumbbells
                  </h3>
                  <p className="text-muted-foreground">
                    Complete range of free weights and dumbbells
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="supplements">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card>
                <CardContent className="p-4">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt="Protein"
                    width={300}
                    height={200}
                    className="rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Protein</h3>
                  <p className="text-muted-foreground">
                    Premium whey protein and mass gainers
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt="Pre-Workout"
                    width={300}
                    height={200}
                    className="rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Pre-Workout</h3>
                  <p className="text-muted-foreground">
                    Energy and focus supplements for maximum performance
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt="Vitamins"
                    width={300}
                    height={200}
                    className="rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">
                    Vitamins & Minerals
                  </h3>
                  <p className="text-muted-foreground">
                    Essential supplements for overall health
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Promotion Banner */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Special Offer</h2>
          <p className="text-xl mb-6">
            Get 20% off on all supplements with bank credit cards
          </p>
          <Button variant="secondary" size="lg">
            Shop Now
          </Button>
        </div>
      </section>
    </div>
  )
}

export default MarketplacePage