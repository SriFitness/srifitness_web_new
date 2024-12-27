import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface LedgerFilterProps {
  setFilter: React.Dispatch<React.SetStateAction<{ type: string; dateRange: string }>>
}

export const LedgerFilter: React.FC<LedgerFilterProps> = ({ setFilter }) => {
  const handleTypeChange = (value: string) => {
    setFilter(prev => ({ ...prev, type: value }))
  }

  const handleDateRangeChange = (value: string) => {
    setFilter(prev => ({ ...prev, dateRange: value }))
  }

  return (
    <div className="flex space-x-4">
      <div className="w-1/2">
        <Label htmlFor="type-filter">Filter by Type</Label>
        <Select onValueChange={handleTypeChange}>
          <SelectTrigger id="type-filter">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="booking">Bookings</SelectItem>
            <SelectItem value="cancellation">Cancellations</SelectItem>
            <SelectItem value="rescheduling">Rescheduling</SelectItem>
            <SelectItem value="unavailable">Unavailable Periods</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-1/2">
        <Label htmlFor="date-filter">Filter by Date</Label>
        <Select onValueChange={handleDateRangeChange}>
          <SelectTrigger id="date-filter">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="day">Last 24 Hours</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

