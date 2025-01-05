'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { collection, getDocs } from 'firebase/firestore'
import { firestore as db } from '@/firebase/client' // Make sure this import is correct
import { WaveSkeleton } from "@/components/ui/wave-skeleton" // Import Skeleton
import { Product } from "@/types/product"

interface ProductsTableProps {
  initialProducts: Product[]
}

export function ProductsTable({ initialProducts }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>(initialProducts)

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  width={50} 
                  height={50} 
                  className="rounded-md"
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>
                <Link href={`/admin/marketplace/products/${product.id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
