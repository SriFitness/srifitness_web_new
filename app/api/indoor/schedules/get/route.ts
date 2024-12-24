import { NextResponse } from 'next/server'
import { realtimeDB } from '@/firebase/server'

export async function GET() {
  try {
    if(!realtimeDB) return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    const bookingsSnapshot = await realtimeDB.ref('bookings').once('value')
    const unavailablePeriodsSnapshot = await realtimeDB.ref('unavailablePeriods').once('value')

    const bookings = bookingsSnapshot.val() || {}
    const unavailablePeriods = unavailablePeriodsSnapshot.val() || {}

    return NextResponse.json({
      bookings: Object.entries(bookings).map(([id, booking]) => ({ id, ...booking })),
      unavailablePeriods: Object.entries(unavailablePeriods).map(([id, period]) => ({ id, ...period })),
    })
  } catch (error) {
    console.error('Error fetching schedules:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

