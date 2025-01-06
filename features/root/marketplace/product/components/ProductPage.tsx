//features/root/marketplace/product/components/ProductPage.tsx

"use client";

import Image from 'next/image';
import MarkdownPreview from '@uiw/react-markdown-preview';
import rehypeSanitize from "rehype-sanitize";
import { useState } from 'react';
import { Carousel } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Import your Button component
import { useCart } from '@/components/providers/CartContext';

interface ProductPreviewProps {
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
        quantity: number;
        discount: number;
        pitch: string;
        images: string[];
        thumbnail?: string;
        category: string;
        brand: string;
        dimensions: string;
        weight: string;
        manufacturer: string;
        productId: string;
    };
}

export function ProductPage({ product }: ProductPreviewProps) {
    const [selectedImage, setSelectedImage] = useState<number>(0);
    const rehypePlugins = [rehypeSanitize];
    const { addToCart, setIsCartOpen } = useCart()

    const discountedPrice = product.price - (product.price * (product.discount / 100));

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: discountedPrice,
            quantity: 1,
            image: product.images[0] || product.thumbnail || '',
        })
        setIsCartOpen(true)
    }

    return (
        <div className="max-w-4xl mx-auto p-4 mt-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <Carousel className="w-full max-w-xs">
                        {/* Show only the selected image in the main view */}
                        <Image
                            key={selectedImage}
                            src={product.images[selectedImage]} // Use image URL directly
                            alt={`Product image ${selectedImage + 1}`}
                            width={600}
                            height={600}
                            className="rounded-lg object-cover"
                        />
                    </Carousel>
                    <div className="flex mt-4 space-x-2 overflow-x-auto">
                        {/* Thumbnail images */}
                        {product.images.map((image, index) => (
                            <Image
                                key={index}
                                src={image} // Use image URL directly
                                alt={`Thumbnail ${index + 1}`}
                                width={60}
                                height={60}
                                className={`rounded-md cursor-pointer ${selectedImage === index ? 'border-2 border-blue-500' : ''}`}
                                onClick={() => setSelectedImage(index)}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="mb-4">
                        <span className="text-2xl font-bold">${discountedPrice.toFixed(2)}</span>
                        {product.discount > 0 && (
                            <span className="ml-2 text-red-500 line-through">${product.price.toFixed(2)}</span>
                        )}
                    </div>
                    {product.discount > 0 && (
                        <p className="text-green-600 mb-4">You save ${(product.price * (product.discount / 100)).toFixed(2)} ({product.discount}%)</p>
                    )}
                    <p className="mb-4">In Stock: {product.quantity}</p>

                    {/* Add to Cart Button */}
                    <Button size="lg" onClick={handleAddToCart} disabled={product.quantity === 0} className='mb-2'>
                        Add to Cart
                    </Button>

                    <Card className="mb-4">
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold mb-2">Product Details</h2>
                            <ul className="list-disc list-inside">
                                <li>Category: {product.category}</li>
                                <li>Brand: {product.brand}</li>
                                <li>Dimensions: {product.dimensions}</li>
                                <li>Weight: {product.weight}</li>
                                <li>Manufacturer: {product.manufacturer}</li>
                                <li>Product ID: {product.productId}</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Product Description</h2>
                <MarkdownPreview
                    rehypePlugins={rehypePlugins}
                    className="prose max-w-none"
                    source={product.pitch}
                />
            </div>
        </div>
    );
}
