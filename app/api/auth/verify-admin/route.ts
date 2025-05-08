import { auth } from "@/firebase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await auth?.verifyIdToken(token)

    // Fetch user info
    const userInfoResponse = await fetch(
      `${request.nextUrl.origin}/api/users/${decodedToken?.uid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!userInfoResponse.ok) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const userInfo = await userInfoResponse.json()

    if (userInfo.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    return NextResponse.json({ status: 'authorized', role: userInfo.role })
  } catch (error) {
    console.error('Error verifying admin status:', error)
    return new NextResponse('Unauthorized', { status: 401 })
  }
}

