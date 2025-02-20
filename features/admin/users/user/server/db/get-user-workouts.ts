import { firestore } from "@/firebase/server";

interface Workout {
    id: string;
    workoutNumber: number;
    createdAt: Date;
    status: 'ok' | 'attention' | 'expired' | 'old';
    workoutPlan: any[]; // Replace with your workout plan type
}

function calculateStatus(createdAt: Date, isLatest: boolean): Workout['status'] {
    if (!isLatest) return 'old';

    const now = new Date();
    const diffInMonths = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30);

    if (diffInMonths <= 1) return 'ok';
    if (diffInMonths <= 2) return 'attention';
    return 'expired';
}

export async function getUserWorkouts(userId: string): Promise<Workout[]> {
    try {
        if (!firestore) {
            throw new Error("Internal Error: Firestore is not initialized");
        }

        const workoutSnapshot = await firestore
            .collection("user-details")
            .doc(userId)
            .collection("workout-details")
            .orderBy("workoutNumber", "desc")
            .get();

        if (workoutSnapshot.empty) {
            return [];
        }

        const workouts: Workout[] = workoutSnapshot.docs.map((doc, index) => {
            const data = doc.data();
            const createdAt = data.createdAt.toDate();
            const isLatest = index === 0; // First document is the latest due to desc ordering

            return {
                id: doc.id,
                workoutNumber: data.workoutNumber,
                createdAt,
                status: calculateStatus(createdAt, isLatest),
                workoutPlan: data.workoutPlan
            };
        });

        return workouts;

    } catch (error) {
        console.error("Error fetching workouts:", error);
        return [];
    }
}