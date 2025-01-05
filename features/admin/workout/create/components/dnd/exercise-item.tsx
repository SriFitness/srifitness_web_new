'use client'

import { useEffect, useRef, useState } from 'react'
import { GripVertical } from 'lucide-react'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview'
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { createPortal } from 'react-dom'
import { attachClosestEdge, type Edge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import invariant from 'tiny-invariant'
import { Exercise, WorkoutGroup, getWorkoutData, isWorkoutData } from './workout-data'
import { DropIndicator } from './drop-indicator'

type ExerciseState =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement }
  | { type: 'is-dragging' }
  | { type: 'is-dragging-over'; closestEdge: Edge | null }

const stateStyles: { [Key in ExerciseState['type']]?: string } = {
  'is-dragging': 'opacity-40',
}

const idle: ExerciseState = { type: 'idle' }

interface ExerciseItemProps {
  exercise: Exercise
  group: WorkoutGroup
  isFirstInGroup: boolean
}

export function ExerciseItem({ exercise, group, isFirstInGroup }: ExerciseItemProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [state, setState] = useState<ExerciseState>(idle)

  useEffect(() => {
    const element = ref.current
    invariant(element)

    return combine(
      draggable({
        element,
        getInitialData() {
          return getWorkoutData(group, exercise)
        },
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: '16px',
              y: '8px',
            }),
            render({ container }) {
              setState({ type: 'preview', container })
            },
          })
        },
        onDragStart() {
          setState({ type: 'is-dragging' })
        },
        onDrop() {
          setState(idle)
        },
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          if (source.element === element) {
            return false
          }
          return isWorkoutData(source.data)
        },
        getData({ input }) {
          const data = getWorkoutData(group, exercise)
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ['top', 'bottom'],
          })
        },
        getIsSticky() {
          return true
        },
        onDragEnter({ self }) {
          const closestEdge = extractClosestEdge(self.data)
          setState({ type: 'is-dragging-over', closestEdge })
        },
        onDrag({ self }) {
          const closestEdge = extractClosestEdge(self.data)
          setState((current) => {
            if (current.type === 'is-dragging-over' && current.closestEdge === closestEdge) {
              return current
            }
            return { type: 'is-dragging-over', closestEdge }
          })
        },
        onDragLeave() {
          setState(idle)
        },
        onDrop() {
          setState(idle)
        },
      })
    )
  }, [exercise, group])

  return (
    <>
      <div className="relative">
        <div
          ref={ref}
          data-exercise-id={exercise.id}
          className={`flex text-sm bg-white flex-row items-center border border-solid rounded p-2 pl-0 hover:bg-slate-100 hover:cursor-grab ${
            stateStyles[state.type] ?? ''
          }`}
        >
          <div className="w-6 flex justify-center">
            <GripVertical size={16} />
          </div>
          <div className="flex-grow">
            <div className="font-medium">{exercise.exercise}</div>
            <div className="text-sm text-muted-foreground">
              {exercise.times} reps × {exercise.sets} sets
            </div>
          </div>
        </div>
        {state.type === 'is-dragging-over' && state.closestEdge ? (
          <DropIndicator edge={state.closestEdge} gap="8px" />
        ) : null}
      </div>
      {state.type === 'preview'
        ? createPortal(
            <div className="border-solid rounded p-2 bg-white">
              {exercise.exercise} ({exercise.times} × {exercise.sets})
            </div>,
            state.container
          )
        : null}
    </>
  )
}

