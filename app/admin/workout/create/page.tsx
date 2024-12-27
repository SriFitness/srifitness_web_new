import WorkoutCreationForm from '@/features/admin/workout/create/components/WorkoutCreationForm'

export default function CreateWorkoutPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create Workout</h1>
      <WorkoutCreationForm />
    </div>
  )
}

