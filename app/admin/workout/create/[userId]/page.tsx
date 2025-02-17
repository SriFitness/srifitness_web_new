import WorkoutCreationForm from '@/features/admin/workout/create/components/WorkoutCreationForm'
import { Suspense } from 'react'

async function Page({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create Workout</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <WorkoutCreationForm userId={userId}/>
      </Suspense>
    </div>
  )
}

export default Page