'use client'

import React, { useState, useEffect } from 'react'
import { ref, onValue, set } from 'firebase/database'
import { firestore as db } from '@/firebase/client'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TimeSlot {
  id: string
  start: string
  end: string
  status: 'available' | 'booked' | 'maintenance'
}

const IndoorScheduleManager: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  useEffect(() => {
    // if (date) {
    //   const formattedDate = date.toISOString().split('T')[0]
    //   const timeSlotsRef = ref(db, `indoorSchedule/${formattedDate}`)
      
    //   onValue(timeSlotsRef, (snapshot) => {
    //     const data = snapshot.val()
    //     if (data) {
    //       const slots = Object.entries(data).map(([id, slot]) => ({
    //         id,
    //         ...(slot as Omit<TimeSlot, 'id'>)
    //       }))
    //       setTimeSlots(slots)
    //     } else {
    //       setTimeSlots([])
    //     }
    //   })
    // }
  }, [date])

  const updateTimeSlot = (slotId: string, status: TimeSlot['status']) => {
    // if (date) {
    //   const formattedDate = date.toISOString().split('T')[0]
    //   const slotRef = ref(db, `indoorSchedule/${formattedDate}/${slotId}`)
    //   set(slotRef, { ...timeSlots.find(slot => slot.id === slotId), status })
    // }
  }

  return (
    <div className="flex space-x-4">
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Time Slots</CardTitle>
        </CardHeader>
        <CardContent>
          {timeSlots.map((slot) => (
            <div key={slot.id} className="flex items-center space-x-2 mb-2">
              <Label>{`${slot.start} - ${slot.end}`}</Label>
              <Select
                value={slot.status}
                onValueChange={(value) => updateTimeSlot(slot.id, value as TimeSlot['status'])}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
          {timeSlots.length === 0 && <p>No time slots available for this date.</p>}
        </CardContent>
      </Card>
    </div>
  )
}

export default IndoorScheduleManager

