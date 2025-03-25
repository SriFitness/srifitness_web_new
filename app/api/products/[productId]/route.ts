import { NextRequest, NextResponse } from 'next/server'
import { auth, firestore } from "@/firebase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    if (!firestore || !auth) {
      return new NextResponse("Internal Error: Firestore or Auth not initialized", { status: 500 })
    }
    
    const authToken = request.headers.get("authorization")?.split("Bearer ")[1] || null

    if (!authToken) {
      return new NextResponse("Unauthorized: Missing auth token", { status: 401 })
    }

    const verifyResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify-admin-subadmin`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    if (!verifyResponse.ok) {
      return new NextResponse("Unauthorized access", { status: 401 })
    }

    const { productId } = await params;
    
    const productDoc = await firestore
      .collection('products')
      .doc(productId)
      .get()
    
    if (!productDoc.exists) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    const productData = productDoc.data()
    
    return NextResponse.json({
      id: productDoc.id,
      ...productData,
    })
    
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}