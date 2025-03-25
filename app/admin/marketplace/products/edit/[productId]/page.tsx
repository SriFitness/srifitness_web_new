'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import Cookies from 'js-cookie'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductEditForm } from '@/features/admin/marketplace/products/edit/components/ProductEditForm'

interface Product {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  discount: number
  pitch: string
  images: string[]
  thumbnail: string
  category: string
  brand: string
  dimensions: string
  weight: string
  manufacturer: string
  productId: string
}

interface FormData {
  description: string
  name: string
  price: number
  quantity: number
  discount: number
  productId?: string
  category?: string
  pitch?: string
  brand?: string
  dimensions?: string
  weight?: string
  manufacturer?: string
  images?: string[]
  thumbnail?: string
}

const EditProductPage = () => {
  const params = useParams()
  const router = useRouter()
  const productId = params.productId as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('firebaseIdToken')}`,
          },
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }
        
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to load product details')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [productId])

  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('firebaseIdToken')}`,
        },
        body: JSON.stringify({
          ...formData,
          id: product?.id // Include the id from existing product
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update product')
      }
      
      toast.success('Product updated successfully')
      router.push(`/admin/marketplace/products/${productId}`)
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <p className="mt-2 text-gray-600">The product you&apos;re trying to edit doesn&apos;t exist or has been removed.</p>
          <Link href="/admin/marketplace/products">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <Link href={`/admin/marketplace/products/${productId}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Product
          </Button>
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Edit Product: {product.name}</h1>
      
      <ProductEditForm 
        product={product} 
        onSubmit={handleSubmit} 
      />
    </div>
  )
}

export default EditProductPage