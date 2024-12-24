import { NextResponse } from 'next/server'
import { realtimeDB } from '@/firebase/server'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    if(!realtimeDB) return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    const body = await request.json()
    await realtimeDB.ref(`unavailablePeriods/${params.id}`).update(body)
    return NextResponse.json({ id: params.id, ...body })
  } catch (error) {
    console.error('Error updating unavailable period:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if(!realtimeDB) return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    await realtimeDB.ref(`unavailablePeriods/${params.id}`).remove()
    return NextResponse.json({ message: 'Unavailable period deleted successfully' })
  } catch (error) {
    console.error('Error deleting unavailable period:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

