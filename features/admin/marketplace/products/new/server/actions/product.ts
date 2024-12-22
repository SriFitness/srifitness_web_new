import { addNewProduct as addNewProductFn } from "@/features/admin/marketplace/products/new/server/db/product";

type FormDataType = {
    name: string;
    description: string;
    price: number;
    quantity: number;
    discount: number;
    pitch: string;
    images?: File[];
    thumbnail?: File;
    category: string;
    brand?: string;
    dimensions?: string;
    weight?: string;
    manufacturer?: string;
    productId: string;
};

export const addNewProduct = (formData: FormDataType) => {
    return addNewProductFn(formData);
}