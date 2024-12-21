"use client"

import { useState } from 'react'
import { NewProductForm } from '@/features/admin/marketplace/products/new/components/NewProductForm'
import { ProductPreview } from '@/features/admin/marketplace/products/new/components/ProductPreview'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function NewProductPage() {
  const [productData, setProductData] = useState({
    name: '',
    details: '',
    images: [],
    description: '',
  })

  const handleFormChange = (data: Partial<typeof productData>) => {
    setProductData(prev => ({ ...prev, ...data }))
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="form">
        <TabsList>
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="form">
          <NewProductForm onChange={handleFormChange} />
        </TabsContent>
        <TabsContent value="preview">
          <ProductPreview product={productData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

