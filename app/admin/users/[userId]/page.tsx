// app/admin/users/[userId]/page.tsx

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PersonalDetails } from "@/features/admin/users/user/components/PersonalDetails";
import { MedicalInquiries } from "@/features/admin/users/user/components/MedicalInquiries";
import { UserImage } from "@/features/admin/users/user/components/UserImage";
import { getUserDetails } from "@/features/admin/users/user/server/db/get-user-details";
import Loading from "./loading";

import styles from './User.module.css'
import { WorkoutTable } from "@/features/admin/users/user/components/WorkoutTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

const Page = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params;

  let userDetails;
  try {
    userDetails = await getUserDetails(userId);
  } catch (error) {
    console.error("Error fetching user details:", error);
    notFound();  // Handle errors and show not found page if data is missing
  }

  if (!userDetails) {
    notFound();  // Additional fallback for missing details
  }

  const { personalDetails, medicalInquiries } = userDetails;

  // Example workout plans (replace with dynamic fetch if needed)
  const workoutPlans = [
    {
      workoutNumber: 1,
      createdDate: '2025-01-10',
      expireDate: '2025-01-20',
      isExpired: false,
    },
    {
      workoutNumber: 2,
      createdDate: '2025-01-01',
      expireDate: '2025-01-10',
      isExpired: true,
    },
    // Add more workout plans here...
  ];

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
          <Button asChild size="sm">
            <Link href={`/admin/workout/create/${userId}`}>Create Workout</Link>
          </Button>
          <WorkoutTable workoutPlans={workoutPlans} />
        </div>
      </div>
    </Suspense>
  );
};

export default Page;
