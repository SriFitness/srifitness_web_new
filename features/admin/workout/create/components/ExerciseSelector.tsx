import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const exerciseData = {
  bodyParts: ['chest', 'shoulder', 'lats', 'biceps', 'trapezius', 'triceps', 'cardio', 'abdominals', 'legs'],
  subParts: {
    chest: ['incline', 'incline dumbbell', 'bench', 'dumbbell', 'decline', 'decline dumbbell'],
    // Add other body parts' sub-parts here
  },
  exercises: {
    incline: ['press', 'machine', 'smith', 'close', 'wide'],
    // Add other sub-parts' exercises here
  }
}

interface ExerciseSelectorProps {
  value: { bodyPart: string; subPart: string; exercise: string; times: number; sets: number }
  onChange: (field: string, value: string | number) => void
  isFirstInGroup: boolean
}

export default function ExerciseSelector({ value, onChange, isFirstInGroup }: ExerciseSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        {isFirstInGroup && (
          <Select value={value.bodyPart} onValueChange={(val) => onChange('bodyPart', val)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select body part" />
            </SelectTrigger>
            <SelectContent>
              {exerciseData.bodyParts.map((part) => (
                <SelectItem key={part} value={part}>
                  {part}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {value.bodyPart && (
          <Select value={value.subPart} onValueChange={(val) => onChange('subPart', val)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select sub-part" />
            </SelectTrigger>
            <SelectContent>
              {exerciseData.subParts[value.bodyPart as keyof typeof exerciseData.subParts]?.map((part) => (
                <SelectItem key={part} value={part}>
                  {part}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {value.subPart && (
          <Select value={value.exercise} onValueChange={(val) => onChange('exercise', val)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select exercise" />
            </SelectTrigger>
            <SelectContent>
              {exerciseData.exercises[value.subPart as keyof typeof exerciseData.exercises]?.map((ex) => (
                <SelectItem key={ex} value={ex}>
                  {ex}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {value.exercise && (
        <div className="flex space-x-4">
          <div className="space-y-2">
            <Label htmlFor="times">Times per set</Label>
            <Input
              id="times"
              type="number"
              value={value.times}
              onChange={(e) => onChange('times', parseInt(e.target.value))}
              min={1}
              className="w-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sets">Number of sets</Label>
            <Input
              id="sets"
              type="number"
              value={value.sets}
              onChange={(e) => onChange('sets', parseInt(e.target.value))}
              min={1}
              className="w-[100px]"
            />
          </div>
        </div>
      )}
    </div>
  )
}

