//app/api/indoor/schedules/create/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { realtimeDB, auth } from '@/firebase/server'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    if (request.method !== "POST") {
        return new NextResponse(`Method ${request.method} not allowed`, { status: 405 });
    }

    try {
        if (!realtimeDB || !auth) return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

        // Verify authentication
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

        // Fetch the existing schedules for the user to determine the next schedule number
        const schedulesRef = realtimeDB.ref(`schedules/${userId}`);
        const schedulesSnapshot = await schedulesRef.once('value');
        const schedules = schedulesSnapshot.val();

        // Determine the next schedule number
        const nextScheduleNumber = schedules ? Object.keys(schedules).length + 1 : 1;

        // Construct the new schedule
        const newBooking = {
            ...body,
            userId: userId,
            userName: decodedToken.email || 'Anonymous',
            scheduleNumber: nextScheduleNumber
        };

        // Save the new schedule under the correct path
        const newScheduleRef = schedulesRef.child(nextScheduleNumber.toString());
        await newScheduleRef.set(newBooking);

        return NextResponse.json({ id: id, scheduleNumber: nextScheduleNumber, ...newBooking });
    } catch (error) {
        console.error('Error creating schedule:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
