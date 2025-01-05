import { NextRequest, NextResponse } from 'next/server'
import { realtimeDB, auth } from '@/firebase/server'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ userId: string, scheduleId: string }> }) {
  const {  userId , scheduleId } = await params;
  const id = userId;
  try {
    if (!realtimeDB || !auth) return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    if (userId !== id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const scheduleRef = realtimeDB.ref(`schedules/${id}/${scheduleId}`);
    await scheduleRef.update(body)

    return NextResponse.json({ message: 'Schedule updated successfully' })
  } catch (error) {
    console.error('Error updating schedule:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

