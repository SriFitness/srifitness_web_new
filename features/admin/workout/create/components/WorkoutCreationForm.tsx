'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DaySelector } from './DaySelector'
import ExerciseSelector from './ExerciseSelector'
import { Plus, X } from 'lucide-react'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge'
import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash'
import { flushSync } from 'react-dom'
import { Exercise, WorkoutGroup, isWorkoutData } from './dnd/workout-data'
import { ExerciseItem } from './dnd/exercise-item'
import { WorkoutList } from './WorkoutList'

const createEmptyExercise = (): Exercise => ({
  id: crypto.randomUUID(),
  bodyPart: '',
  subPart: '',
  exercise: '',
  times: 8,
  sets: 3,
})

const createEmptyGroup = (day: string): WorkoutGroup => ({
  id: crypto.randomUUID(),
  bodyPart: '',
  exercises: [createEmptyExercise()],
  day,
})

export default function WorkoutCreationForm() {
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [workoutGroups, setWorkoutGroups] = useState<WorkoutGroup[]>([])
  const [currentDay, setCurrentDay] = useState<string | null>(null)

  useEffect(() => {
    if (currentDay) {
      const existingGroup = workoutGroups.find(group => group.day === currentDay)
      if (!existingGroup) {
        const newGroup = createEmptyGroup(currentDay)
        setWorkoutGroups(prev => [...prev, newGroup])
      }
    }
  }, [currentDay, workoutGroups])

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isWorkoutData(source.data)
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0]
        if (!target) {
          return
        }

        const sourceData = source.data
        const targetData = target.data

        if (!isWorkoutData(sourceData) || !isWorkoutData(targetData)) {
          return
        }

        const sourceGroup = workoutGroups.find(g => g.id === sourceData.groupId)
        const targetGroup = workoutGroups.find(g => g.id === targetData.groupId)

        if (!sourceGroup || !targetGroup) {
          return
        }

        if (sourceData.exerciseId && targetData.exerciseId) {
          const sourceExercise = sourceGroup.exercises.find(e => e.id === sourceData.exerciseId)
          const targetExercise = targetGroup.exercises.find(e => e.id === targetData.exerciseId)

          if (!sourceExercise || !targetExercise) {
            return
          }

          const sourceIndex = sourceGroup.exercises.indexOf(sourceExercise)
          const targetIndex = targetGroup.exercises.indexOf(targetExercise)
          const closestEdge = extractClosestEdge(targetData)

          flushSync(() => {
            if (sourceGroup.id === targetGroup.id) {
              // Reordering within the same group
              const newExercises = reorderWithEdge({
                list: sourceGroup.exercises,
                startIndex: sourceIndex,
                indexOfTarget: targetIndex,
                closestEdgeOfTarget: closestEdge,
                axis: 'vertical',
              })

              setWorkoutGroups(groups =>
                groups.map(g =>
                  g.id === sourceGroup.id ? { ...g, exercises: newExercises } : g
                )
              )
            } else {
              // Moving between groups
              const newSourceExercises = sourceGroup.exercises.filter(e => e.id !== sourceExercise.id)
              const newTargetExercises = [...targetGroup.exercises]
              newTargetExercises.splice(
                closestEdge === 'bottom' ? targetIndex + 1 : targetIndex,
                0,
                sourceExercise
              )

              setWorkoutGroups(groups =>
                groups.map(g => {
                  if (g.id === sourceGroup.id) {
                    return { ...g, exercises: newSourceExercises }
                  }
                  if (g.id === targetGroup.id) {
                    return { ...g, exercises: newTargetExercises }
                  }
                  return g
                })
              )
            }
          })

          const element = document.querySelector(`[data-exercise-id="${sourceExercise.id}"]`)
          if (element instanceof HTMLElement) {
            triggerPostMoveFlash(element)
          }
        }
      },
    })
  }, [workoutGroups])

  const handleDaySelect = (day: string) => {
    if (!selectedDays.includes(day)) {
      setSelectedDays([...selectedDays, day])
      setCurrentDay(day)
    }
  }

  const handleDayRemove = (day: string) => {
    setSelectedDays(selectedDays.filter(d => d !== day))
    setWorkoutGroups(workoutGroups.filter(g => g.day !== day))
    if (currentDay === day) {
      setCurrentDay(null)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleExerciseChange = (day: string, exerciseIndex: number, field: keyof Exercise, value: any) => {
    setWorkoutGroups(groups =>
      groups.map(group =>
        group.day === day
          ? {
              ...group,
              exercises: group.exercises.map((exercise, index) =>
                index === exerciseIndex
                  ? { ...exercise, [field]: value }
                  : exercise
              ),
            }
          : group
      )
    )
  }

  const handleAddExercise = (day: string) => {
    setWorkoutGroups(groups =>
      groups.map(group =>
        group.day === day
          ? { ...group, exercises: [...group.exercises, createEmptyExercise()] }
          : group
      )
    )
  }

  const handleRemoveExercise = (day: string, exerciseId: string) => {
    setWorkoutGroups(groups =>
      groups.map(group =>
        group.day === day
          ? { ...group, exercises: group.exercises.filter(e => e.id !== exerciseId) }
          : group
      )
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Workout plan:', workoutGroups)
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 mb-6">
            {selectedDays.map(day => (
              <div key={day} className="flex items-center">
                <Button
                  variant={currentDay === day ? "default" : "outline"}
                  onClick={() => setCurrentDay(day)}
                >
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDayRemove(day)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <DaySelector
              value={null}
              onChange={handleDaySelect}
              excludeDays={selectedDays}
            />
          </div>
          {currentDay && (
            <div className="space-y-6">
              {workoutGroups.find(g => g.day === currentDay)?.exercises.map((exercise, index) => (
                <Card key={exercise.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">Exercise {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveExercise(currentDay, exercise.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <ExerciseSelector
                    value={exercise}
                    onChange={(field, value) => handleExerciseChange(currentDay, index, field as keyof Exercise, value)}
                    isFirstInGroup={index === 0}
                  />
                  <ExerciseItem
                    exercise={exercise}
                    group={workoutGroups.find(g => g.day === currentDay)!}
                    isFirstInGroup={index === 0}
                  />
                </Card>
              ))}
              <Button
                type="button"
                onClick={() => handleAddExercise(currentDay)}
                variant="outline"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Exercise
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <WorkoutList workoutGroups={workoutGroups} onReorder={setWorkoutGroups} />
      <Button type="submit" onClick={handleSubmit} className="w-full">Save Workout Plan</Button>
    </div>
  )
}

