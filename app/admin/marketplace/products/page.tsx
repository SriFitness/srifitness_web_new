import { Suspense } from 'react'
import Link from 'next/link'
import { ProductsTable } from '@/features/admin/marketplace/products/components/ProductsTable'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

async function getProducts() {
  // Simulating an API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  return [
    { id: 1, name: 'Protein Powder', quantity: 100, image: '/products/protein-powder.jpg', price: 29.99, category: 'Supplements' },
    { id: 2, name: 'Yoga Mat', quantity: 50, image: '/products/yoga-mat.jpg', price: 19.99, category: 'Equipment' },
    { id: 3, name: 'Resistance Bands', quantity: 200, image: '/products/resistance-bands.jpg', price: 14.99, category: 'Equipment' },
    { id: 4, name: 'Pre-Workout', quantity: 75, image: '/products/pre-workout.jpg', price: 34.99, category: 'Supplements' },
    { id: 5, name: 'Dumbbells Set', quantity: 30, image: '/products/dumbbells.jpg', price: 99.99, category: 'Equipment' },
  ]
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/marketplace/products/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductsTable products={products} />
      </Suspense>
    </div>
  )
}

