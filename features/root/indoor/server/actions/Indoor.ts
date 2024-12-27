import { createSchedule as createScheduleFn } from "../db/create-schedule";
import { getSchedules as getSchedulesFn } from "../db/get-schedules";
import { deleteSchedule as deleteScheduleFn } from "../db/delete-schedule";
import { updateSchedule as updateScheduleFn } from "../db/update-schedule";
import { useBookingService } from "@/hooks/useBookingService";

export const createSchedule = async (data: any) => {
  const result = await createScheduleFn(data);
  return result;
};

export const getSchedules = getSchedulesFn;

export const deleteSchedule = async (userId: string, scheduleId: string) => {
  await deleteScheduleFn(userId, scheduleId);
};

export const updateSchedule = async (userId: string, scheduleId: string, data: any) => {
  const result = await updateScheduleFn(userId, scheduleId, data);
  return result;
};

