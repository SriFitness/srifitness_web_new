//features/admin/workout/create/components/RepetitionSetter.tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RepetitionSetterProps {
  value: { times: number; sets: number }
  onChange: (value: { times: number; sets: number }) => void
}

export default function RepetitionSetter({ value, onChange }: RepetitionSetterProps) {
  return (
    <div className="flex space-x-4">
      <div className="space-y-2">
        <Label htmlFor="times">Times per set</Label>
        <Input
          id="times"
          type="number"
          value={value.times}
          onChange={(e) => onChange({ ...value, times: parseInt(e.target.value) })}
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
          onChange={(e) => onChange({ ...value, sets: parseInt(e.target.value) })}
          min={1}
          className="w-[100px]"
        />
      </div>
    </div>
  )
}

