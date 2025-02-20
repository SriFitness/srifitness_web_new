// app/admin/users/[userId]/page.tsx

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PersonalDetails } from "@/features/admin/users/user/components/PersonalDetails";
import { MedicalInquiries } from "@/features/admin/users/user/components/MedicalInquiries";
import { UserImage } from "@/features/admin/users/user/components/UserImage";
import { getUserDetails } from "@/features/admin/users/user/server/db/get-user-details";
import { getUserWorkouts } from "@/features/admin/users/user/server/db/get-user-workouts";

import Loading from "./loading";

import styles from './User.module.css'
import { WorkoutTable } from "@/features/admin/users/user/components/WorkoutTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

const Page = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params;

  let userDetails;
  let workouts;

  try {
    [userDetails, workouts] = await Promise.all([
      getUserDetails(userId),
      getUserWorkouts(userId)
    ]);
  } catch (error) {
    console.error("Error fetching data:", error);
    notFound();
  }

  if (!userDetails) {
    notFound();
  }

  const { personalDetails, medicalInquiries } = userDetails;

  // Transform workouts data for the WorkoutTable
  const workoutPlans = workouts.map(workout => ({
    workoutNumber: workout.workoutNumber,
    createdDate: workout.createdAt.toISOString().split('T')[0],
    status: workout.status,
    id: workout.id
  }));

  return (
    <Suspense fallback={<Loading />}>
      <div className={`container mx-auto py-10 px-4 ${styles["futuristic-container"]}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`md:col-span-1 ${styles.futuristicCard}`}>
            <UserImage />
          </div>
          <div className={`md:col-span-2 space-y-8 ${styles["futuristic-card"]}`}>
            <PersonalDetails personalDetails={personalDetails} />
            <MedicalInquiries medicalInquiries={medicalInquiries} />
          </div>
          <div className="md:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Workout Plans</h2>
              <Button asChild size="sm">
                <Link href={`/admin/workout/create/${userId}`}>Create Workout</Link>
              </Button>
            </div>
            <WorkoutTable workoutPlans={workoutPlans} />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Page;
