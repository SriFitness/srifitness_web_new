"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
}

export function ProductList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulating an API call
    const fetchProducts = async () => {
      try {
        // Replace this with your actual API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        setProducts([
          { id: 1, name: "Product 1", category: "Category A", price: 19.99, stock: 100 },
          { id: 2, name: "Product 2", category: "Category B", price: 29.99, stock: 50 },
          { id: 3, name: "Product 3", category: "Category A", price: 39.99, stock: 75 },
          { id: 4, name: "Product 4", category: "Category C", price: 49.99, stock: 25 },
          { id: 5, name: "Product 5", category: "Category B", price: 59.99, stock: 60 },
        ])
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button>Add New Product</Button>
      </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  )
}

