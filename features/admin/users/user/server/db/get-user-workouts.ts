import { firestore } from "firebase-admin/firestore";

export async function getAllWorkouts() {
    try {
        if (!firestore) {
            throw new Error("Internal Error: Firestore is not initialized");
        }

        const workoutSnapshot = await firestore.collection("workout-details").get();

        if (workoutSnapshot.empty) {
            return [];
        }

        const workouts: Workout[] = workoutSnapshot.docs.map((doc) => {
            const data = doc.data() as Omit<Workout, 'id'>;
            const workoutId = doc.id;

            return {
                ...data,
                id: workoutId
            };
        });

        return workouts;

    } catch (error) {
        console.error("Error fetching workouts:", error);
        return [];
    }
}