'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import styles from '@/app/(root)/marketplace/Marketplace.module.css'
import { Product } from '@/types/product'

interface ProductsTableProps {
  initialProducts: Product[]
}

const ProductCard = ({ product }: { product: Product }) => (
  <Link href={`/marketplace/product/${product.id}`} passHref>
    <Card className="cursor-pointer transition-shadow hover:shadow-lg">
      <CardContent className="p-4">
        <div className="relative h-[200px]"> {/* Set a fixed height for the image container */}
          <Image
            src={product.image}
            alt={product.name}
            fill // Use fill to make the image responsive
            sizes="(max-width: 768px) 100vw, 50vw" // Define sizes for responsive loading
            className="rounded-lg object-contain" // Ensures the full image is shown while maintaining aspect ratio
          />
        </div>
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <p className="text-muted-foreground mb-2">
          {product.quantity} in stock
        </p>
        <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
      </CardContent>
    </Card>
  </Link>
);
const MarketplacePage = ({ initialProducts }: ProductsTableProps) => {
  const equipmentProducts = initialProducts.filter(product => product.category === 'equipment')
  const supplementProducts = initialProducts.filter(product => product.category === 'supplement')

  return (
    <div className={styles.marketplacePage}>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <Image
          src="/placeholder.svg?height=600&width=1920"
          alt="Fitness Equipment and Supplements"
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
              {equipmentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="supplements">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {supplementProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
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

