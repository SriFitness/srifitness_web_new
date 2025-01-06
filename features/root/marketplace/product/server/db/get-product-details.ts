// features/root/marketplace/product/server/db/get-product-details.ts
import 'server-only';
import { firestore } from '@/firebase/server'; // Adjust the import based on your project structure

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    discount: number;
    pitch: string;
    images: string[]; // Change from File[] to string[]
    thumbnail: string | undefined; // Change from File to string
    category: string;
    brand: string;
    dimensions: string;
    weight: string;
    manufacturer: string;
    productId: string;
}

export const getProductDetails = async (productId: string): Promise<Product | null> => {
    try {
        if (!firestore) {
            console.error('Firestore is not initialized.');
            throw new Error('Firestore is not available');
        }
        
        const productDoc = await firestore.collection('products').doc(productId).get();

        if (!productDoc.exists) {
            return null; // Return null if the product does not exist
        }

        const data = productDoc.data(); // This can be DocumentData | undefined

        if (!data) {
            console.error('No data found for the product document.');
            return null; // Handle the case where data is undefined
        }

        return {
            id: productDoc.id,
            name: data.name,
            description: data.description,
            price: data.price,
            quantity: data.quantity,
            discount: data.discount || 0, // Default to 0 if no discount is provided
            pitch: data.pitch || '',
            images: data.images || [], // Ensure it's an array of strings
            thumbnail: data.thumbnail || undefined,
            category: data.category,
            brand: data.brand,
            dimensions: data.dimensions,
            weight: data.weight,
            manufacturer: data.manufacturer,
            productId: productDoc.id, // Use Firestore document ID as productId
        } as Product;

    } catch (error) {
        console.error('Error fetching product details:', error);
        throw new Error('Failed to fetch product details');
    }
};
