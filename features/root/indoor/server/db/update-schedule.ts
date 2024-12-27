import Cookies from 'js-cookie';

interface ScheduleData {
  startTime: Date;
  endTime: Date;
}

export const updateSchedule = async (userId: string, scheduleId: string, data: ScheduleData): Promise<void | Error> => {
  try {
    const token = Cookies.get('firebaseIdToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`/api/indoor/schedules/update/${userId}/${scheduleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update schedule');
    }
  } catch (error) {
    console.error("Error updating schedule:", error);
    return new Error("Failed to update schedule. Please try again later.");
  }
};

