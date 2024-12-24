import { NextResponse } from 'next/server'
import { realtimeDB } from '@/firebase/server'

export async function POST(request: Request) {
  try {
    if(!realtimeDB) return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    const body = await request.json()
    const newPeriodRef = realtimeDB.ref('unavailablePeriods').push()
    await newPeriodRef.set(body)
    return NextResponse.json({ id: newPeriodRef.key, ...body })
  } catch (error) {
    console.error('Error adding unavailable period:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

