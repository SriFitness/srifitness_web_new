'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { WorkoutGroup, Exercise } from './dnd/workout-data'
import { ExerciseItem } from './dnd/exercise-item'

interface WorkoutListProps {
  workoutGroups: WorkoutGroup[]
  onReorder: (newGroups: WorkoutGroup[]) => void
}

export function WorkoutList({ workoutGroups, onReorder }: WorkoutListProps) {
  const [activeTab, setActiveTab] = useState<string>(workoutGroups[0]?.day || '')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const handleDragEnd = (result: any) => {
    const { source, destination } = result
    if (!destination) return

    const sourceDay = source.droppableId
    const destDay = destination.droppableId
    const sourceIndex = source.index
    const destIndex = destination.index

    const newGroups = [...workoutGroups]
    const sourceGroup = newGroups.find(group => group.day === sourceDay)
    const destGroup = newGroups.find(group => group.day === destDay)

    if (sourceGroup && destGroup) {
      const [removed] = sourceGroup.exercises.splice(sourceIndex, 1)
      destGroup.exercises.splice(destIndex, 0, removed)
      onReorder(newGroups)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {workoutGroups.map((group) => (
              <TabsTrigger
                key={group.day || 'unknown'}
                value={group.day || 'unknown'}
              >
                {group.day
                  ? group.day.charAt(0).toUpperCase() + group.day.slice(1)
                  : 'Unknown'}
              </TabsTrigger>
            ))}
          </TabsList>
          {workoutGroups.map((group) => (
            <TabsContent key={group.day || 'unknown'} value={group.day || 'unknown'}>
              <div className="space-y-4">
                {group.exercises.map((exercise, index) => (
                  <Card key={exercise.id} className="p-4">
                    <ExerciseItem
                      exercise={exercise}
                      group={group}
                      isFirstInGroup={index === 0}
                    />
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

