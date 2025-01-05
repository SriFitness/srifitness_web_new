import Link from 'next/link'
import { ProductsTable } from '@/features/admin/marketplace/products/components/ProductsTable'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { getProducts } from '@/features/admin/marketplace/products/server/actions/products'
import { Product } from '@/types/product'



export default async function AdminProductsPage() {
  const products: Product[] = await getProducts()

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
      <ProductsTable initialProducts={products} />
    </div>
  )
}

