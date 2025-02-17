import { NextRequest, NextResponse } from "next/server";
import { createWorkout } from "@/features/admin/workout/create/server/db/create-workout";

export async function POST(request: NextRequest) {
    try {
        const { userId, workoutGroups } = await request.json();

        if (!userId || !workoutGroups) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const result = await createWorkout(userId, workoutGroups);
        return NextResponse.json(result);

    } catch (error) {
        console.error("Error in workout creation:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}