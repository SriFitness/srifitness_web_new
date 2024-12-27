import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const days = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
]

interface DaySelectorProps {
  value: number | null
  onChange: (value: number) => void
}

export default function DaySelector({ value, onChange }: DaySelectorProps) {
  return (
    <Select value={value?.toString()} onValueChange={(val) => onChange(parseInt(val))}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select day" />
      </SelectTrigger>
      <SelectContent>
        {days.map((day) => (
          <SelectItem key={day.value} value={day.value.toString()}>
            {day.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

