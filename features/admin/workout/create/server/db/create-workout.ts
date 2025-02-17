import "server-only"

import { firestore } from "@/firebase/server";
import { WorkoutGroup } from "@/features/admin/workout/create/components/dnd/workout-data";

interface CreateWorkoutResponse {
    success: boolean;
    workoutId?: string;
    error?: string;
}

export async function createWorkout(userId: string, workoutGroups: WorkoutGroup[]): Promise<CreateWorkoutResponse> {
    try {
        // Validate workout plan
        if (workoutGroups.length === 0) {
            return {
                success: false,
                error: "Please add at least one exercise to the workout plan"
            };
        }

        // Validate each group has exercises
        const hasEmptyGroups = workoutGroups.some(group => 
            group.exercises.length === 0 || 
            group.exercises.some(exercise => 
                !exercise.bodyPart || !exercise.subPart || !exercise.exercise
            )
        );

        if (hasEmptyGroups) {
            return {
                success: false,
                error: "Please complete all exercise details"
            };
        }

        if (!firestore) {
            throw new Error("Firestore is not initialized");
        }

        const workoutRef = firestore
            .collection("user-details")
            .doc(userId)
            .collection("workout-details");

        // Get all existing workouts to determine the next ID
        const workouts = await workoutRef.get();
        const nextId = (workouts.size + 1).toString();

        // Create a new document with sequential ID
        await workoutRef.doc(nextId).set({
            createdAt: new Date(),
            workoutPlan: workoutGroups,
            workoutNumber: parseInt(nextId)
        });

        return { 
            success: true, 
            workoutId: nextId 
        };
    } catch (error) {
        console.error("Error creating workout:", error);
        return {
            success: false,
            error: "Failed to create workout plan"
        };
    }
}