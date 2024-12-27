'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ExerciseSelector from './ExerciseSelector'
import DaySelector from './DaySelector'
import ExerciseTable from './ExerciseTable'
import { Plus } from 'lucide-react'

interface Exercise {
  id: string;
  bodyPart: string;
  subPart: string;
  exercise: string;
  times: number;
  sets: number;
}

interface WorkoutGroup {
  id: string;
  bodyPart: string;
  exercises: Exercise[];
  day: number | null;
}

export default function WorkoutCreationForm() {
  const [workoutGroups, setWorkoutGroups] = useState<WorkoutGroup[]>([])

  const handleAddExercise = () => {
    setWorkoutGroups([...workoutGroups, {
      id: Date.now().toString(),
      bodyPart: '',
      exercises: [{
        id: Date.now().toString(),
        bodyPart: '',
        subPart: '',
        exercise: '',
        times: 8,
        sets: 3
      }],
      day: null
    }])
  }

  const handleExerciseChange = (groupIndex: number, exerciseIndex: number, field: keyof Exercise, value: any) => {
    const updatedGroups = [...workoutGroups]
    if (field === 'bodyPart') {
      updatedGroups[groupIndex].bodyPart = value
    }
    updatedGroups[groupIndex].exercises[exerciseIndex] = { ...updatedGroups[groupIndex].exercises[exerciseIndex], [field]: value }
    setWorkoutGroups(updatedGroups)
  }

  const handleAddExerciseToGroup = (groupIndex: number) => {
    const updatedGroups = [...workoutGroups]
    updatedGroups[groupIndex].exercises.push({
      id: Date.now().toString(),
      bodyPart: updatedGroups[groupIndex].bodyPart,
      subPart: '',
      exercise: '',
      times: 8,
      sets: 3
    })
    setWorkoutGroups(updatedGroups)
  }

  const handleDayChange = (groupIndex: number, day: number) => {
    const updatedGroups = [...workoutGroups]
    updatedGroups[groupIndex].day = day
    setWorkoutGroups(updatedGroups)
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const sourceGroupId = result.source.droppableId
    const destGroupId = result.destination.droppableId
    const sourceIndex = result.source.index
    const destIndex = result.destination.index

    const updatedGroups = [...workoutGroups]
    const sourceGroupIndex = updatedGroups.findIndex(group => group.id === sourceGroupId)
    const destGroupIndex = updatedGroups.findIndex(group => group.id === destGroupId)

    const [reorderedItem] = updatedGroups[sourceGroupIndex].exercises.splice(sourceIndex, 1)
    updatedGroups[destGroupIndex].exercises.splice(destIndex, 0, reorderedItem)

    setWorkoutGroups(updatedGroups)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (workoutGroups.some(group => group.exercises.some(ex => !ex.bodyPart || !ex.subPart || !ex.exercise || !ex.times || !ex.sets))) {
      alert('Please fill in all exercise fields')
      return
    }
    if (workoutGroups.some(group => group.day === null)) {
      alert('Please assign a day to all workout groups')
      return
    }
    console.log('Workout created:', workoutGroups)
    // Here you would typically send this data to your backend
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-6">
          {workoutGroups.map((group, groupIndex) => (
            <div key={group.id} className="space-y-4 border p-4 rounded">
              <h3 className="text-lg font-semibold">{group.bodyPart || 'New Workout Group'}</h3>
              {group.exercises.map((exercise, exerciseIndex) => (
                <ExerciseSelector
                  key={exercise.id}
                  value={exercise}
                  onChange={(field, value) => handleExerciseChange(groupIndex, exerciseIndex, field, value)}
                  isFirstInGroup={exerciseIndex === 0}
                />
              ))}
              <Button type="button" onClick={() => handleAddExerciseToGroup(groupIndex)} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Exercise to Group
              </Button>
              <DaySelector value={group.day} onChange={(day) => handleDayChange(groupIndex, day)} />
            </div>
          ))}
          <Button type="button" onClick={handleAddExercise} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add New Workout Group
          </Button>
          <ExerciseTable workoutGroups={workoutGroups} onDragEnd={handleDragEnd} />
          <Button type="submit">Create Workout</Button>
        </CardContent>
      </Card>
    </form>
  )
}

