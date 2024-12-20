import { auth } from "@/firebase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const requestedUserId = request.headers.get('X-Requested-User-Id')

    if (!authHeader?.startsWith('Bearer ') || !requestedUserId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await auth?.verifyIdToken(token)

    // Check if the authenticated user is trying to access their own profile
    if (decodedToken?.uid !== requestedUserId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    return NextResponse.json({ status: 'authorized' })
  } catch (error) {
    console.error('Error verifying user access:', error)
    return new NextResponse('Unauthorized', { status: 401 })
  }
}

