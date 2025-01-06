//features/root/marketplace/server/db/get-products.ts
import 'server-only'
import { firestore } from '@/firebase/server'
import { Product } from '@/types/product'

export async function getProducts(): Promise<Product[]> {
  try {
    if (!firestore) {
      console.error('Firestore is not initialized.')
      throw new Error('Firestore is not available')
    }
    const productsCollection = firestore.collection('products')
    const productsSnapshot = await productsCollection.get()
    const products = productsSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name,
        quantity: data.quantity,
        image: data.thumbnail || '',
        price: data.price,
        category: data.category,
      } as Product
    })

    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }
}


// import 'server-only'


// import { firestore } from '@/firebase/server';
// import { Product } from '@/types/product';

// // Function to fetch initial products
// export async function fetchInitialProducts(batchSize: number): Promise<Product[]> {
//   try {
//     if (!firestore) {
//       console.error('Firestore is not initialized.')
//       throw new Error('Firestore is not available')
//     }
//     const productsCollection = firestore.collection('products');
//     const productsSnapshot = await productsCollection
//       .select('name', 'quantity', 'thumbnail', 'price', 'category') // Only fetch necessary fields
//       .limit(batchSize)
//       .get();

//     const products = productsSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     })) as Product[];

//     return products;
//   } catch (error) {
//     console.error('Error fetching initial products:', error);
//     throw new Error('Failed to fetch initial products');
//   }
// }

// // Function to fetch the next batch of products
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export async function fetchNextProducts(lastVisible: any, batchSize: number): Promise<Product[]> {
//   try {
//     if (!firestore) {
//       console.error('Firestore is not initialized.')
//       throw new Error('Firestore is not available')
//     }
//     const productsCollection = firestore.collection('products');
//     const nextSnapshot = await productsCollection
//       .select('name', 'quantity', 'thumbnail', 'price', 'category')
//       .startAfter(lastVisible) // Start after the last visible document
//       .limit(batchSize)
//       .get();

//     const nextProducts = nextSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     })) as Product[];

//     return nextProducts;
//   } catch (error) {
//     console.error('Error fetching next products:', error);
//     throw new Error('Failed to fetch next products');
//   }
// }

// // Function to fetch detailed product information
// export async function fetchProductDetails(productId: string): Promise<Product> {
//   try {
//     if (!firestore) {
//       console.error('Firestore is not initialized.')
//       throw new Error('Firestore is not available')
//     }
//     const productDoc = await firestore.collection('products').doc(productId).get();
    
//     if (!productDoc.exists) {
//       throw new Error('Product not found');
//     }

//     return {
//       id: productDoc.id,
//       ...productDoc.data(),
//     } as Product;
//   } catch (error) {
//     console.error('Error fetching product details:', error);
//     throw new Error('Failed to fetch product details');
//   }
// }

// // Caching implementation (example using local storage)
// export function cacheProducts(products: Product[]) {
//   localStorage.setItem('cachedProducts', JSON.stringify(products));
// }

// export function getCachedProducts(): Product[] | null {
//   const cached = localStorage.getItem('cachedProducts');
//   return cached ? JSON.parse(cached) : null;
// }




