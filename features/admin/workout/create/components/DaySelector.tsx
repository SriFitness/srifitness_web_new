import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const days = [
  { value: 'Day 1', label: 'Day 1' },
  { value: 'Day 2', label: 'Day 2' },
  { value: 'Day 3', label: 'Day 3' },
  { value: 'Day 4', label: 'Day 4' },
  { value: 'Day 5', label: 'Day 5' },
  { value: 'Day 6', label: 'Day 6' },
  { value: 'Day 7', label: 'Day 7' },
]

interface DaySelectorProps {
  value: string | null
  onChange: (value: string) => void
  excludeDays: string[]
}

export function DaySelector({ value, onChange, excludeDays }: DaySelectorProps) {
  const availableDays = days.filter(day => !excludeDays.includes(day.value))

  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select day" />
      </SelectTrigger>
      <SelectContent>
        {availableDays.map((day) => (
          <SelectItem key={day.value} value={day.value}>
            {day.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

