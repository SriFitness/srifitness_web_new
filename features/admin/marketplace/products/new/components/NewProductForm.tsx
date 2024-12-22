"use client"

//root/features/admin/marketplace/products/new/components/NewProductForm.tsx

import { useState, useCallback, useMemo } from 'react'
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

import dynamic from 'next/dynamic';
import '@uiw/react-markdown-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import { Upload } from 'lucide-react'

import { useToast } from '@/hooks/use-toast'

import { toast as toastSonner } from 'sonner'

import { addNewProduct } from '@/features/admin/marketplace/products/new/server/actions/product';

type FormDataType = {
    name: string;
    description: string;
    price: number;
    quantity: number;
    discount: number;
    pitch: string;
    images: File[] | undefined;
    thumbnail: File | undefined;
    category: string;
    brand: string;
    dimensions: string;
    weight: string;
    manufacturer: string;
    productId: string;
}


const formSchema = z.object({
    name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
    description: z.string().min(10, { message: "Product description must be at least 10 characters." }),
    price: z.number().min(0.001, { message: "Enter valid price value." }),
    quantity: z.number().min(1, { message: "Quantity must be at least 1." }),
    discount: z.number().min(0, { message: "Discount should be a valid number" }),
    pitch: z.string().min(20, { message: "Pitch must be at least 20 characters." }),
    images: z.array(z
        .instanceof(File)
        .refine((file) => file.size < 2 * 1024 * 1024, 'Image size must be less than 2MB')
    ).min(1, 'At least 1 file is required')
        .refine(
            (files) => files.every((file) => file.size < 2 * 1024 * 1024),
            'Image size must be less than 2MB',
        ),
    thumbnail: z.instanceof(File)
        .refine((file) => file.size < 2 * 1024 * 1024, 'File size must be less than 2MB'),
    category: z.string().min(1, { message: "Category is required." }),
    brand: z.string().optional(),
    dimensions: z.string().optional(),
    weight: z.string().optional(),
    manufacturer: z.string().optional(),
    productId: z.string().min(5, { message: "Product ID must be at least 5 characters" }),
});

interface NewProductFormProps {
    onChange: (data: Partial<z.infer<typeof formSchema>>) => void
    initialData: FormDataType;
}



export const NewProductForm: React.FC<NewProductFormProps> = ({ onChange, initialData }) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
        try {
            toastSonner.promise(
                new Promise<{ name: string }>(async (resolve, reject) => {
                    const response = await addNewProduct(values);

                    if (response?.success) {
                        resolve({ name: values.name });
                    } else {
                        reject(response?.message);
                    }
                }), {
                loading: 'Loading...',
                success: (data) => {
                    return `${data.name} has been successfully added!`; // Customize success message
                },
                error: (error) => {
                    return `Error: ${error}`; // Customize error message
                },
            }
            );
        } catch (error: any) {
            console.error("User creation failed", error);
            toastSonner.error(`${error.message || "An error occurred during registration."}`)
        }
        // Here you would typically send the data to your backend
    }

    const { toast } = useToast();

    const MarkdownEditor = useMemo(() => dynamic(
        () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
        { ssr: false }
    ), []);



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
                                                value={field.value}
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
                                                        value={field.value}
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
                                                        value={field.value}
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
                                                value={field.value}
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
                                name="thumbnail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Thumbnail</FormLabel>
                                        <FormControl>
                                            <div className='flex flex-row'>
                                                <div className='flex items-center justify-center'>
                                                    <Upload />
                                                </div>
                                                <Input
                                                    style={{ cursor: 'pointer' }}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        if (e.target.files) {
                                                            if (e.target.files.length > 1) {
                                                                toast({
                                                                    title: "Unsuccessful Image Upload",
                                                                    description: "You can only upload one image for thumbnail.",
                                                                    variant: "destructive",
                                                                }
                                                                );

                                                            } else {
                                                                const file = e.target.files[0];
                                                                field.onChange(file);
                                                                onChange({ thumbnail: file });
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            You can only upload one image for the product thumbnail.
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter product category (optional)"
                                                {...field}
                                                value={field.value}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    onChange({ category: e.target.value });
                                                }}
                                            />
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
                                            <Input
                                                placeholder="Enter product brand (optional)"
                                                {...field}
                                                value={field.value}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    onChange({ brand: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dimensions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dimensions</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter product dimensions (e.g., 10x10x10 cm) (optional)"
                                                {...field}
                                                value={field.value}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    onChange({ dimensions: e.target.value });
                                                }}
                                            />
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
                                            <Input
                                                placeholder="Enter product weight (e.g., 500g) (optional)"
                                                {...field}
                                                value={field.value}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    onChange({ weight: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="manufacturer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Manufacturer</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter product manufacturer (optional)"
                                                {...field}
                                                value={field.value}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    onChange({ manufacturer: e.target.value });
                                                }}
                                            />
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
                                        <FormLabel>Product ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter product ID (optional)"
                                                {...field}
                                                value={field.value}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    onChange({ productId: e.target.value });
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
                                            <Textarea
                                                placeholder="Enter product description"
                                                {...field}
                                                value={field.value}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    onChange({ description: e.target.value })
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="pitch"
                                render={({ field }) => {
                                    const handleEditorChange = useCallback((value: string) => {
                                        field.onChange(value);
                                        onChange({ pitch: value });
                                    }, [field, onChange]);

                                    return (
                                        <FormItem>
                                            <FormLabel>Pitch</FormLabel>
                                            <FormControl>
                                                <MarkdownEditor
                                                    value={field.value}
                                                    onChange={handleEditorChange}
                                                    height="300px"
                                                    width="30vw"
                                                    style={{ overflow: 'hidden' }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>
                    </div>


                    <div className="p-4">
                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Images</FormLabel>
                                    <FormControl>
                                        <div className='flex flex-row'>
                                            <div className='flex items-center justify-center'>
                                                <Upload />
                                            </div>
                                            <Input
                                                style={{ cursor: 'pointer' }}
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => {
                                                    // Convert the FileList to an array and update the form state
                                                    const filesArray = Array.from(e.target.files || []);
                                                    field.onChange(filesArray);
                                                    onChange({ images: filesArray })
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        You can upload multiple images for the product.
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <br />
                        <Button type="submit" >Add Product</Button>
                    </div>
                </div>



            </form>
        </Form >
    )
}

