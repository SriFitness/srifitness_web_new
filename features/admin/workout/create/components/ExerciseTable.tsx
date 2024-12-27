import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

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

interface ExerciseTableProps {
  workoutGroups: WorkoutGroup[];
  onDragEnd: (result: any) => void;
}

export default function ExerciseTable({ workoutGroups, onDragEnd }: ExerciseTableProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Body Part</TableHead>
            <TableHead>Sub Part</TableHead>
            <TableHead>Exercise</TableHead>
            <TableHead>Times</TableHead>
            <TableHead>Sets</TableHead>
            <TableHead>Day</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workoutGroups.map((group) => (
            <Droppable droppableId={group.id} key={group.id}>
              {(provided) => (
                <TableRow {...provided.droppableProps} ref={provided.innerRef}>
                  <TableCell colSpan={6}>
                    {group.exercises.map((exercise, index) => (
                      <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center space-x-4 p-2 bg-white border-b last:border-b-0"
                          >
                            <span className="w-1/6">{exercise.bodyPart}</span>
                            <span className="w-1/6">{exercise.subPart}</span>
                            <span className="w-1/6">{exercise.exercise}</span>
                            <span className="w-1/6">{exercise.times}</span>
                            <span className="w-1/6">{exercise.sets}</span>
                            <span className="w-1/6">{group.day}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableCell>
                </TableRow>
              )}
            </Droppable>
          ))}
        </TableBody>
      </Table>
    </DragDropContext>
  )
}

