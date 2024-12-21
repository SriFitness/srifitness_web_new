"use client"

//root/features/admin/marketplace/products/new/components/NewProductForm.tsx

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
// import { RichTextEditor } from '@/features/admin/marketplace/products/new/components/RichTextEditor'
import MarkdownEditor from '@uiw/react-markdown-editor';


const formSchema = z.object({
    name: z.string().min(2, {
        message: "Product name must be at least 2 characters.",
    }),
    details: z.string().min(10, {
        message: "Product details must be at least 10 characters.",
    }),
    price: z.number().min(0.001, {
        message: "Enter valid price value."
    }),
    quantity: z.number().min(1, {
        message: "Quantity must be at least 1."
    }),
    discount: z.number().min(0, {
        message: "Discount should be a valid number"
    }),
    description: z.string().min(20, {
        message: "Description must be at least 20 characters.",
    }),
    images: z.array(z.any()).optional(),
})

interface NewProductFormProps {
    onChange: (data: Partial<z.infer<typeof formSchema>>) => void
}



export function NewProductForm({ onChange }: NewProductFormProps) {

    const [images, setImages] = useState<File[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            quantity: 0,
            details: "",
            description: "",
            price: 0,
            discount:0,
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
        // Here you would typically send the data to your backend
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newImages = Array.from(event.target.files);
            setImages(prev => [...prev, ...newImages]);
            onChange({ images: [...images, ...newImages] });
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" >
                <div className='md:flex md:flex-row w-full h-[70vh] md:overflow-hidden'>
                    <div className="w-full p-4 md:flex md:overflow-x-auto">
                        <div className='w-full'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter product name"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    onChange({ name: e.target.value })
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="md:flex md:flex-row md:w-full gap-2">
                                <div className="md:flex-1">
                                    <FormField
                                        control={form.control}
                                        name="quantity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Quantity</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter product quantity"
                                                        {...field}
                                                        type='number'
                                                        onChange={(e) => {
                                                            const value = e.target.value ? parseInt(e.target.value) : 0;
                                                            field.onChange(value)
                                                            onChange({ quantity: value })
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="md:flex-1">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter product price"
                                                        type='number'
                                                        {...field}
                                                        onChange={(e) => {
                                                            const value = e.target.value ? parseFloat(e.target.value) : 0.0;
                                                            field.onChange(value)
                                                            onChange({ price: value })
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <FormField
                                control={form.control}
                                name="discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Discount</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) => {
                                                    const value = e.target.value ? parseFloat(e.target.value) : 0.0;
                                                    field.onChange(value)
                                                    onChange({ discount: value })
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="details"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Details</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter product details"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    onChange({ details: e.target.value })
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <MarkdownEditor
                                                className="wmde-markdown-var"
                                                height="300px"
                                                width="30vw"
                                                onPreviewMode={(isHide) => {
                                                    console.log("Preview mode status:", isHide); // Example: Log the preview mode state
                                                }}
                                                onChange={(value) => {
                                                    field.onChange(value); // Update React Hook Form
                                                    onChange({ description: value }); // Update parent component state
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>


                    <div className="p-4">
                        <FormItem>
                            <FormLabel>Product Images</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                />
                            </FormControl>
                            <FormDescription>
                                You can upload multiple images for the product.
                            </FormDescription>
                        </FormItem>
                        <Button type="submit">Add Product</Button>
                    </div>
                </div>



            </form>
        </Form>
    )
}

