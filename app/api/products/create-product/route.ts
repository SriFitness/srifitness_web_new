//root/app/api/products/create-product/route.ts

import { auth, firestore, storage } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

interface FormDataType {
    name: string;
    description: string;
    price: number;
    quantity: number;
    discount: number;
    pitch: string;
    images?: string[];
    thumbnail?: string;
    category: string;
    brand?: string;
    dimensions?: string;
    weight?: string;
    manufacturer?: string;
    productId: string;
}

async function uploadFile(file: File, path: string): Promise<string> {
    console.log("upload file calling");

    if (!storage) {
        throw new Error("Firebase Storage not initialized!");
    }

    try {
        const bucket = storage.bucket(); // Get the default storage bucket
        const fileRef = bucket.file(path);

        // Convert ArrayBuffer to Node.js Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Convert Buffer to a readable stream
        const stream = Readable.from(buffer);

        // Upload the file using a writable stream
        const writeStream = fileRef.createWriteStream({
            metadata: {
                contentType: file.type, // Ensure proper content type
            },
        });

        await new Promise((resolve, reject) => {
            stream
                .pipe(writeStream)
                .on("finish", resolve)
                .on("error", reject);
        });

        // Use getDownloadURL instead of getSignedUrl
        const [metadata] = await fileRef.getMetadata();
        const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${metadata.md5Hash}`;
        
        return downloadUrl;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Failed to upload file to Firebase Storage.");
    }
}

export async function POST(request: NextRequest) {
    if (request.method !== "POST") {
        return new NextResponse(`Method ${request.method} not allowed`, { status: 405 });
    }

    try {
        if (!firestore || !auth || !storage) {
            return new NextResponse("Internal Error: Firebase services not initialized", { status: 500 });
        } else {
            const authToken = request.headers.get("authorization")?.split("Bearer ")[1] || null;

            if (!authToken) {
                return new NextResponse("Unauthorized: Missing auth token", { status: 401 });
            }

            const verifyResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify-admin`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!verifyResponse.ok) {
                return new NextResponse("Unauthorized access", { status: 401 });
            }

            const { role } = await verifyResponse.json();

            if (role !== "admin") {
                return new NextResponse("Forbidden: Only admins can create products", { status: 403 });
            }

            const formData = await request.formData();
            const userData: FormDataType = JSON.parse(formData.get('data') as string);
            const {
                name,
                description,
                price,
                quantity,
                discount,
                pitch,
                category,
                brand,
                dimensions,
                weight,
                manufacturer,
                productId,
            } = userData;

            if (!name || !description || price == null || quantity == null || discount == null || !pitch || !productId) {
                return new NextResponse("Invalid input: Some required fields are missing", { status: 400 });
            }

            const batch = firestore.batch();

            // Handle file uploads
            const thumbnailFile = formData.get('thumbnail') as File;

            const imageFiles: File[] = [];
            let i = 0;
            while (formData.has(`images[${i}]`)) {
                const file = formData.get(`images[${i}]`) as File;
                if (file) {
                    imageFiles.push(file);
                }
                i++;
            }
            console.log(`imageFiles: ${imageFiles}`);

            let thumbnailUrl: string | undefined = undefined;
            if (thumbnailFile) {
                thumbnailUrl = await uploadFile(thumbnailFile, `products/${productId}/thumbnail`);
            }

            const imageUrls: string[] | undefined = await Promise.all(
                imageFiles.map((file, index) => uploadFile(file, `products/${productId}/images/${index}`))
            );

            const productData: FormDataType = {
                name,
                description,
                price,
                quantity,
                discount,
                pitch,
                images: imageUrls,
                thumbnail: thumbnailUrl,
                category,
                brand,
                dimensions,
                weight,
                manufacturer,
                productId,
            };

            const productRef = firestore.collection("products").doc(productId);
            batch.set(productRef, productData);

            await batch.commit();

            return new NextResponse(JSON.stringify({ success: true, message: "Product created successfully" }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        console.error("Error adding product:", error);
        return new NextResponse(JSON.stringify({ success: false, message: "Error creating product" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}


