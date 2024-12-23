//root/features/admin/marketplace/products/new/server/db/product.ts

import Cookies from "js-cookie";

type FormDataType = {
    name: string;
    description: string;
    price: number;
    quantity: number;
    discount: number;
    pitch: string;
    images: File[];
    thumbnail: File;
    category: string;
    brand?: string;
    dimensions?: string;
    weight?: string;
    manufacturer?: string;
    productId: string;
};

export async function addNewProduct(formData: FormDataType) {
    try {
        const formDataToSend = new FormData();

        // Append JSON data
        formDataToSend.append('data', JSON.stringify({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            quantity: formData.quantity,
            discount: formData.discount,
            pitch: formData.pitch,
            category: formData.category,
            brand: formData.brand,
            dimensions: formData.dimensions,
            weight: formData.weight,
            manufacturer: formData.manufacturer,
            productId: formData.productId,
        }));

        // Append files
        if (formData.thumbnail) {
            formDataToSend.append('thumbnail', formData.thumbnail);
        }
        if (formData.images) {
            formData.images.forEach((image, index) => {
                formDataToSend.append(`images[${index}]`, image);
            });
        }
        
        const token = Cookies.get("firebaseIdToken");
        if (!token) {
            throw new Error("Authentication token missing");
        }

        const response = await fetch('/api/products/create-product', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formDataToSend, // Do NOT set Content-Type manually
        });

        const result = await response.json();

        if (response.ok) {
            return {
                success: true,
                message: `${formData.name} was created successfully.`,
            };
        }

        return {
            success: false,
            message: result.message || 'An error occurred while creating the product.',
        };
    } catch (error) {
        console.error("Error adding product:", error);
        return {
            success: false,
            message: 'An unexpected error occurred.',
        };
    }
}
