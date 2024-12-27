import Cookies from 'js-cookie';

export const deleteSchedule = async (userId: string, scheduleId: string): Promise<void | Error> => {
  try {
    const token = Cookies.get('firebaseIdToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`/api/indoor/schedules/delete/${userId}/${scheduleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete schedule');
    }
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return new Error("Failed to delete schedule. Please try again later.");
  }
};

