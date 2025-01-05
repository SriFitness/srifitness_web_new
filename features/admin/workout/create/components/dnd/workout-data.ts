export type Exercise = {
    id: string
    bodyPart: string
    subPart: string
    exercise: string
    times: number
    sets: number
  }
  
  export type WorkoutGroup = {
    id: string
    bodyPart: string
    exercises: Exercise[]
    day: string | null
  }
  
  const workoutDataKey = Symbol('workout')
  
  export type WorkoutData = {
    [workoutDataKey]: true
    groupId: string
    exerciseId?: string
  }
  
  export function getWorkoutData(group: WorkoutGroup, exercise?: Exercise): WorkoutData {
    return {
      [workoutDataKey]: true,
      groupId: group.id,
      exerciseId: exercise?.id,
    }
  }
  
  export function isWorkoutData(data: Record<string | symbol, unknown>): data is WorkoutData {
    return data[workoutDataKey] === true
  }
  
  