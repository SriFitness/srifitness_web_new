import { realtimeDB } from "@/firebase/client";
import { ref, get } from "firebase/database";

interface Booking {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  userId: string;
  userName: string;
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
  if (!realtimeDB) {
    return new Error("Database hasn't been initialized. Try again.");
  }

  try {
    const bookingsRef = ref(realtimeDB, 'bookings');
    const unavailablePeriodsRef = ref(realtimeDB, 'unavailablePeriods');

    const [bookingsSnapshot, unavailablePeriodsSnapshot] = await Promise.all([
      get(bookingsRef),
      get(unavailablePeriodsRef)
    ]);

    const bookings: Booking[] = [];
    bookingsSnapshot.forEach((childSnapshot) => {
      bookings.push({
        id: childSnapshot.key as string,
        ...childSnapshot.val()
      });
    });

    const unavailablePeriods: UnavailablePeriod[] = [];
    unavailablePeriodsSnapshot.forEach((childSnapshot) => {
      unavailablePeriods.push({
        id: childSnapshot.key as string,
        ...childSnapshot.val()
      });
    });

    return { bookings, unavailablePeriods };
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return new Error("Failed to fetch schedules. Please try again later.");
  }
};

