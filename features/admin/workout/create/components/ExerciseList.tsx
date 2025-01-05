'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Exercise, WorkoutGroup, isWorkoutData } from './dnd/workout-data'
import { ExerciseItem } from './dnd/exercise-item'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge'
import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash'
import { flushSync } from 'react-dom'

interface ExerciseListProps {
  exercises: Exercise[]
  onExercisesChange: (exercises: Exercise[]) => void
  onExerciseDraggedToGroup: (exercise: Exercise, groupId: string) => void
}

export function ExerciseList({ exercises, onExercisesChange, onExerciseDraggedToGroup }: ExerciseListProps) {
  const [localExercises, setLocalExercises] = useState(exercises)

  useEffect(() => {
    setLocalExercises(exercises)
  }, [exercises])

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

        if (sourceData.groupId === 'exerciseList' && targetData.groupId !== 'exerciseList') {
          // Exercise dragged from list to a group
          const exercise = localExercises.find(e => e.id === sourceData.exerciseId)
          if (exercise) {
            onExerciseDraggedToGroup(exercise, targetData.groupId)
          }
        } else if (sourceData.groupId !== 'exerciseList' && targetData.groupId === 'exerciseList') {
          // Exercise dragged from a group to the list
          // This case is handled in the WorkoutCreationForm component
        } else if (sourceData.groupId === 'exerciseList' && targetData.groupId === 'exerciseList') {
          // Reordering within the exercise list
          const sourceExercise = localExercises.find(e => e.id === sourceData.exerciseId)
          const targetExercise = localExercises.find(e => e.id === targetData.exerciseId)

          if (!sourceExercise || !targetExercise) {
            return
          }

          const sourceIndex = localExercises.indexOf(sourceExercise)
          const targetIndex = localExercises.indexOf(targetExercise)
          const closestEdge = extractClosestEdge(targetData)

          flushSync(() => {
            const newExercises = reorderWithEdge({
              list: localExercises,
              startIndex: sourceIndex,
              indexOfTarget: targetIndex,
              closestEdgeOfTarget: closestEdge,
              axis: 'vertical',
            })

            setLocalExercises(newExercises)
            onExercisesChange(newExercises)
          })

          const element = document.querySelector(`[data-exercise-id="${sourceExercise.id}"]`)
          if (element instanceof HTMLElement) {
            triggerPostMoveFlash(element)
          }
        }
      },
    })
  }, [localExercises, onExercisesChange, onExerciseDraggedToGroup])

  const dummyGroup: WorkoutGroup = {
    id: 'exerciseList',
    bodyPart: '',
    exercises: [],
    day: null,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercise List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {localExercises.map((exercise) => (
            <ExerciseItem
              key={exercise.id}
              exercise={exercise}
              group={dummyGroup}
              isFirstInGroup={false}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

