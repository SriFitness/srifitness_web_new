import { NextRequest, NextResponse } from 'next/server'
import { realtimeDB, auth } from '@/firebase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
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

    const schedulesRef = realtimeDB.ref(`schedules/${userId}`);
    const schedulesSnapshot = await schedulesRef.once('value');
    const schedules = schedulesSnapshot.val();

    const nextScheduleNumber = schedules ? Object.keys(schedules).length + 1 : 1;

    const newBooking = {
      ...body,
      userId: userId,
      userName: decodedToken.email || 'Anonymous',
      scheduleNumber: nextScheduleNumber
    };

    const newScheduleRef = schedulesRef.child(nextScheduleNumber.toString());
    await newScheduleRef.set(newBooking);

    return NextResponse.json({ id: id, scheduleNumber: nextScheduleNumber, ...newBooking });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

