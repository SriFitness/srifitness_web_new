//features/root/indoor/server/db/create-schedule.ts

import { User } from "firebase/auth";
import Cookies from "js-cookie";

type ReceiveDataType = {
    startTime: Date;
    endTime: Date;
    user: User;
};

interface SendingDataType {
    id: string;
    scheduleNumber: string;
}

export const createSchedule = async (data: ReceiveDataType): Promise<SendingDataType> => {
    try {
        const response = await fetch(`/api/indoor/schedules/create/${data.user.uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get("firebaseIdToken")}`,
            },
            body: JSON.stringify({
                startTime: data.startTime.toISOString(),
                endTime: data.endTime.toISOString(),
            }),
        });

        if (response.ok) {
            const responseData: SendingDataType = await response.json();
            if (!responseData.id || !responseData.scheduleNumber) {
                throw new Error("Invalid response data");
            }
            return responseData;
        } else {
            throw new Error('Failed to book');
        }
    } catch (error) {
        console.error("Error in createSchedule:", error);
        throw new Error("Failed to book");
    }
};

