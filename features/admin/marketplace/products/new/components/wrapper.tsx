'use client'

import React from 'react'

import { useState } from 'react'
import { NewProductForm } from '@/features/admin/marketplace/products/new/components/NewProductForm'
import { ProductPreview } from '@/features/admin/marketplace/products/new/components/ProductPreview'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'



const Wrapper = () => {

    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        discount: 0,
        pitch: '',
        images: [] as File[],
        thumbnail: undefined as File | undefined,
        category: '',
        brand: '',
        dimensions: '',
        weight: '',
        manufacturer: '',
        productId: '',
    })

    const handleFormChange = (data: Partial<typeof productData>) => {
        setProductData(prev => ({ ...prev, ...data }))
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Add New Product</h1>
            <Tabs defaultValue="form">
                <TabsList>
                    <TabsTrigger value="form">Form</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="form">
                    <NewProductForm onChange={handleFormChange} initialData={productData} />
                </TabsContent>
                <TabsContent value="preview">
                    <ProductPreview product={productData} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Wrapper