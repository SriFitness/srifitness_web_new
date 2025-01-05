'use client'

import { useState, useEffect } from 'react'
import { ScheduleCalendar } from './ScheduleCalendar'
import { ScheduleForm } from './ScheduleForm'
import { useToast } from '@/hooks/use-toast'
import Cookies from 'js-cookie'

interface Booking {
  id: string
  title: string
  start: string
  end: string
  userId: string
  userName: string
}

interface UnavailablePeriod {
  id: string
  title: string
  start: string
  end: string
  reason: string
}

export default function IndoorScheduleManager() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [unavailablePeriods, setUnavailablePeriods] = useState<UnavailablePeriod[]>([])
  const [, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<UnavailablePeriod | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchBookingsAndUnavailablePeriods()
  }, [])

  const fetchBookingsAndUnavailablePeriods = async () => {
    try {
      const token = Cookies.get('firebaseIdToken')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch('/api/indoor/schedules/get/admin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedBookings = data.bookings.map((booking: any) => ({
          id: booking.id,
          title: `Schedule ${booking.scheduleNumber}`,
          start: new Date(booking.startTime).toISOString(),
          end: new Date(booking.endTime).toISOString(),
          userId: booking.userId,
          userName: booking.userName,
        }))

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedUnavailablePeriods = data.unavailablePeriods.map((period: any) => ({
          id: period.id,
          title: 'Unavailable',
          start: new Date(period.startTime).toISOString(),
          end: new Date(period.endTime).toISOString(),
          reason: period.reason,
        }))

        setBookings(transformedBookings)
        setUnavailablePeriods(transformedUnavailablePeriods)
      } else {
        throw new Error('Failed to fetch schedules')
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: 'Error fetching schedules',
        description: 'Please try again later.',
        variant: 'destructive',
      })
      setIsLoading(false)
    }
  }

  const handleAddOrUpdateUnavailablePeriod = async (data: {
    title: string
    start: string
    end: string
    reason?: string
  }) => {
    try {
      const method = editingItem ? 'PUT' : 'POST'
      const url = editingItem
        ? `/api/indoor/unavailable/${editingItem.id}`
        : '/api/indoor/unavailable'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({ title: editingItem ? 'Unavailable period updated' : 'Unavailable period added' })
        fetchBookingsAndUnavailablePeriods()
      } else {
        throw new Error(
          editingItem ? 'Failed to update unavailable period' : 'Failed to add unavailable period'
        )
      }
    } catch (error) {
      toast({
        title: editingItem ? 'Error updating' : 'Error adding',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    }
    setIsFormOpen(false)
    setEditingItem(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <ScheduleCalendar bookings={bookings} unavailablePeriods={unavailablePeriods} />
      </div>
      {isFormOpen && (
        <ScheduleForm
          onSubmit={handleAddOrUpdateUnavailablePeriod}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingItem(null)
          }}
          initialData={editingItem}
        />
      )}
    </div>
  )
}
