//features/root/indoor/server/db/get-schedules.ts

import Cookies from 'js-cookie';

interface Booking {
  id: string;
  scheduleNumber?: string;
  startTime: string;
  endTime: string;
  userId?: string;
  userName?: string;
}

interface UnavailablePeriod {
  id: string;
  startTime: string;
  endTime: string;
  reason: string;
}

interface SchedulesData {
  bookings: Booking[];
  unavailablePeriods: UnavailablePeriod[];
}

export const getSchedules = async (): Promise<SchedulesData | Error> => {
  try {
    const token = Cookies.get('firebaseIdToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('/api/indoor/schedules/get/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch schedules');
    }

    const data: SchedulesData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return new Error("Failed to fetch schedules. Please try again later.");
  }
};

