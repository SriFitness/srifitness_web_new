/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageUpload } from '@/components/ui/image-upload'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Product name must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number' }),
  quantity: z.coerce.number().int().nonnegative({ message: 'Quantity must be a non-negative integer' }),
  discount: z.coerce.number().min(0).max(100, { message: 'Discount must be between 0 and 100' }),
  pitch: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  manufacturer: z.string().optional(),
  productId: z.string().optional(),
  images: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

interface ProductEditFormProps {
  product: any
  onSubmit: (data: ProductFormValues) => void
}

export function ProductEditForm({ product, onSubmit }: ProductEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>(product.images || [])
  const [thumbnail, setThumbnail] = useState<string>(product.thumbnail || '')

  // Initialize the form with product data
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      quantity: product.quantity || 0,
      discount: product.discount || 0,
      pitch: product.pitch || '',
      category: product.category || '',
      brand: product.brand || '',
      dimensions: product.dimensions || '',
      weight: product.weight || '',
      manufacturer: product.manufacturer || '',
      productId: product.productId || '',
      images: product.images || [],
      thumbnail: product.thumbnail || '',
    },
  })

  const handleImageUpload = useCallback((urls: string[]) => {
    setImages(urls)
    form.setValue('images', urls)
    
    // If there's no thumbnail yet and we have images, set the first one as thumbnail
    if (!thumbnail && urls.length > 0) {
      setThumbnail(urls[0])
      form.setValue('thumbnail', urls[0])
    }
  }, [form, thumbnail])

  const handleThumbnailUpload = useCallback((urls: string[]) => {
    if (urls.length > 0) {
      setThumbnail(urls[0])
      form.setValue('thumbnail', urls[0])
    }
  }, [form])

  const handleFormSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true)
    try {
      // Make sure images and thumbnail are included
      data.images = images
      data.thumbnail = thumbnail || (images.length > 0 ? images[0] : '')
      
      await onSubmit(data)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to update product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the product" 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        A short summary that appears in product listings
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity in Stock</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" step="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="pitch"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Detailed Description (Markdown)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Full product description with markdown support" 
                          {...field} 
                          rows={10}
                        />
                      </FormControl>
                      <FormDescription>
                        You can use Markdown formatting for rich text
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="Product category" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input placeholder="Product brand" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="dimensions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dimensions</FormLabel>
                        <FormControl>
                          <Input placeholder="Product dimensions" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input placeholder="Product weight" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="manufacturer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manufacturer</FormLabel>
                        <FormControl>
                          <Input placeholder="Product manufacturer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product ID / SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="Product ID or SKU" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="images" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <FormLabel>Product Images</FormLabel>
                    <FormDescription className="mb-2">
                      Upload multiple images for your product. The first image will be used as the thumbnail by default.
                    </FormDescription>
                    <ImageUpload 
                      value={images} 
                      onChange={handleImageUpload}
                      multiple={true}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <FormLabel>Thumbnail Image</FormLabel>
                    <FormDescription className="mb-2">
                      Select a specific thumbnail image (optional)
                    </FormDescription>
                    <ImageUpload 
                      value={thumbnail ? [thumbnail] : []} 
                      onChange={handleThumbnailUpload}
                      multiple={false}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Product
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}