import 'server-only'
import { firestore as db } from '@/firebase/server'
import { Product } from '@/types/product'

export async function getProducts(): Promise<Product[]> {
  try {
    if (!db) {
      console.error('Firestore is not initialized.')
      throw new Error('Firestore is not available')
    }
    const productsCollection = db.collection('products')
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
