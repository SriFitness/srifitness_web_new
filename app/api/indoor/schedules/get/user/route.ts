//app/api/indoor/schedules/get/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { realtimeDB, auth } from '@/firebase/server';
import moment from 'moment';

export async function GET(request: NextRequest) {
  try {
    if (!realtimeDB || !auth) return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

    // Verify authentication
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Fetch all schedules and unavailable periods
    const schedulesSnapshot = await realtimeDB.ref('schedules').once('value');
    const unavailablePeriodsSnapshot = await realtimeDB.ref('unavailablePeriods').once('value');

    const schedules = schedulesSnapshot.val() || {};
    const unavailablePeriods = unavailablePeriodsSnapshot.val() || {};

    const currentDate = moment();
    const oneWeekLater = moment().add(7, 'days');

    // Process schedules
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allBookings = Object.entries(schedules).flatMap(([scheduleOwnerId, userSchedules]: [string, any]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return Object.entries(userSchedules).map(([scheduleNumber, booking]: [string, any]) => {
        const isCurrentUser = scheduleOwnerId === userId;
        const bookingDate = moment(booking.startTime);

        if (bookingDate.isSameOrAfter(currentDate) && bookingDate.isBefore(oneWeekLater)) {
          return isCurrentUser
            ? {
                id: `${scheduleOwnerId}_${scheduleNumber}`,
                scheduleNumber,
                startTime: booking.startTime,
                endTime: booking.endTime,
                userName: booking.userName || null, // Include user details for the current user
              }
            : {
                id: null, // No ID for other users' bookings
                scheduleNumber: null, // Hide schedule number for other users
                startTime: booking.startTime,
                endTime: booking.endTime,
                userName: null, // No user details for other users
              };
        }
        return null;
      });
    }).filter(Boolean); // Remove null values

    // Process unavailable periods
    const filteredUnavailablePeriods = Object.entries(unavailablePeriods)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter(([, period]: [string, any]) => {
        const periodDate = moment(period.startTime);
        return periodDate.isSameOrAfter(currentDate) && periodDate.isBefore(oneWeekLater);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map(([id, period]: [string, any]) => ({
        id,
        startTime: period.startTime,
        endTime: period.endTime,
        reason: period.reason,
      }));

    return NextResponse.json({
      bookings: allBookings,
      unavailablePeriods: filteredUnavailablePeriods,
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
