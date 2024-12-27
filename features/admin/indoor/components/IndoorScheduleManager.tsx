//features/admin/indoor/components/IndoorScheduleManager.tsx
'use client'

import { useState, useEffect } from 'react'
import { ScheduleCalendar } from './ScheduleCalendar'
import { ScheduleForm } from './ScheduleForm'
import { ScheduleList } from './ScheduleList'
import { Button } from '@/components/ui/button'
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
  start: string
  end: string
  reason: string
}

export default function IndoorScheduleManager() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [unavailablePeriods, setUnavailablePeriods] = useState<UnavailablePeriod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Booking | UnavailablePeriod | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchBookingsAndUnavailablePeriods()
  }, [])

  const fetchBookingsAndUnavailablePeriods = async () => {
    try {
      const token = Cookies.get('firebaseIdToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await fetch('/api/indoor/schedules/get/admin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Transform the bookings
        const transformedBookings = data.bookings.map((booking: any) => ({
          id: booking.id,
          title: `Schedule ${booking.scheduleNumber}`, // Add a meaningful title
          start: new Date(booking.startTime),
          end: new Date(booking.endTime),
          userId: booking.userId,
          userName: booking.userName,
          type: 'booking',
        }));
  
        // Transform unavailable periods
        const transformedUnavailablePeriods = data.unavailablePeriods.map(
          (period: any) => ({
            id: period.id,
            title: 'Unavailable',
            start: new Date(period.startTime),
            end: new Date(period.endTime),
            reason: period.reason,
            type: 'unavailable',
          })
        );
  
        setBookings(transformedBookings);
        setUnavailablePeriods(transformedUnavailablePeriods);
      } else {
        throw new Error('Failed to fetch schedules');
      }
  
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error fetching schedules',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };
  
  const handleAddUnavailablePeriod = async (newPeriod: Omit<UnavailablePeriod, 'id'>) => {
    try {
      const response = await fetch('/api/indoor/unavailable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPeriod),
      })
      if (response.ok) {
        toast({ title: 'Unavailable period added successfully' })
        fetchBookingsAndUnavailablePeriods()
      } else {
        throw new Error('Failed to add unavailable period')
      }
    } catch (error) {
      toast({
        title: 'Error adding unavailable period',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    }
    setIsFormOpen(false)
  }

  const handleUpdateUnavailablePeriod = async (updatedPeriod: UnavailablePeriod) => {
    try {
      const response = await fetch(`/api/indoor/unavailable/${updatedPeriod.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPeriod),
      })
      if (response.ok) {
        toast({ title: 'Unavailable period updated successfully' })
        fetchBookingsAndUnavailablePeriods()
      } else {
        throw new Error('Failed to update unavailable period')
      }
    } catch (error) {
      toast({
        title: 'Error updating unavailable period',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    }
    setIsFormOpen(false)
    setEditingItem(null)
  }

  const handleDeleteUnavailablePeriod = async (id: string) => {
    try {
      const response = await fetch(`/api/indoor/unavailable/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        toast({ title: 'Unavailable period deleted successfully' })
        fetchBookingsAndUnavailablePeriods()
      } else {
        throw new Error('Failed to delete unavailable period')
      }
    } catch (error) {
      toast({
        title: 'Error deleting unavailable period',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    }
  }

  const handleEditItem = (item: Booking | UnavailablePeriod) => {
    setEditingItem(item)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* <Button onClick={() => setIsFormOpen(true)}>Add Unavailable Period</Button> */}
      <div>
        <ScheduleCalendar bookings={bookings} unavailablePeriods={unavailablePeriods} />
        {/* <ScheduleList
          bookings={bookings}
          unavailablePeriods={unavailablePeriods}
          onEdit={handleEditItem}
          onDeleteUnavailable={handleDeleteUnavailablePeriod}
        /> */}
      </div>
      {isFormOpen && (
        <ScheduleForm
          onSubmit={editingItem ? handleUpdateUnavailablePeriod : handleAddUnavailablePeriod}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingItem(null)
          }}
          initialData={editingItem as UnavailablePeriod}
        />
      )}
    </div>
  )
}

