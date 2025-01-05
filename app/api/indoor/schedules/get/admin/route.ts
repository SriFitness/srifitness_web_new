import { NextRequest, NextResponse } from 'next/server'
import { realtimeDB, auth } from '@/firebase/server'

export async function GET(request: NextRequest) {
    try {
        if (!realtimeDB || !auth) return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

        // Verify authentication
        const token = request.headers.get('Authorization')?.split('Bearer ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const verifyResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify-admin`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        if (!verifyResponse.ok) {
            return new NextResponse("Unauthorized access", { status: 401 });
        }

        const { role } = await verifyResponse.json();

        // Allow only 'admin' or 'subadmin' to create users
        if (role !== "admin" && role !== "subadmin") {
            return new NextResponse("Forbidden: Only admins or subadmins can create users", { status: 403 });
        }

        //const decodedToken = await auth.verifyIdToken(token);
        // const userId = decodedToken.uid;
        const allowed = role === "admin" || role === "subadmin";

        const schedulesSnapshot = await realtimeDB.ref('schedules').once('value');
        const unavailablePeriodsSnapshot = await realtimeDB.ref('unavailablePeriods').once('value');

        const schedules = schedulesSnapshot.val() || {};
        const unavailablePeriods = unavailablePeriodsSnapshot.val() || {};

        // const currentDate = moment();
        // const oneWeekLater = moment().add(7, 'days');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filteredBookings: { id: string; userId: string; scheduleNumber: string; startTime: any; endTime: any; userName: any; }[] = [];

        if (allowed) {
            // For admin, fetch all bookings
            Object.entries(schedules).forEach(([userId, userSchedules]) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Object.entries(userSchedules as object).forEach(([scheduleNumber, booking]: [string, any]) => {
                    filteredBookings.push({
                        id: `${userId}_${scheduleNumber}`,
                        userId,
                        scheduleNumber,
                        startTime: booking.startTime,
                        endTime: booking.endTime,
                        userName: booking.userName
                    });
                });
            });
        }

        const filteredUnavailablePeriods = Object.entries(unavailablePeriods)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map(([id, period]: [string, any]) => ({
                id,
                startTime: period.startTime,
                endTime: period.endTime,
                reason: period.reason
            }));

        return NextResponse.json({
            bookings: filteredBookings,
            unavailablePeriods: filteredUnavailablePeriods,
        });
    } catch (error) {
        console.error('Error fetching schedules:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

