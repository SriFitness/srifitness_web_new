'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BookingCalendar } from './BookingCalendar'
import { UpcomingBookings } from './UpcomingBookings'
import { BookingModal } from './BookingModal'
import { BookingInstructions } from './BookingInstructions'
import { SupportChat } from './SupportChat'
import { Button } from '@/components/ui/button'
import { useToast } from "@/hooks/use-toast"
import moment from 'moment'
import { useAuth } from '@/components/providers/auth-provider'
import { User } from 'firebase/auth'
import { getSchedules, createSchedule, deleteSchedule, updateSchedule } from '@/features/root/indoor/server/actions/Indoor'
import { useSocket } from '@/hooks/useSocket'
import { useBookingService } from '@/hooks/useBookingService'
import { CreateBookingDTO, UpdateBookingDTO } from '@/types/booking'

interface Booking {
  id: string
  scheduleNumber?: string
  startTime: Date
  endTime: Date
  userId?: string
  userName?: string
}

interface UnavailablePeriod {
  id: string
  startTime: Date
  endTime: Date
  reason: string
}

type AuthContextType = {
  currentUser: User | null;
}

export default function IndoorBookingPage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isReschedulingModalOpen, setIsReschedulingModalOpen] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [unavailablePeriods, setUnavailablePeriods] = useState<UnavailablePeriod[]>([])
  const [userBookings, setUserBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const { toast } = useToast()
  const { currentUser } = useAuth() as AuthContextType
  const socket = useSocket()
  const bookingService = useBookingService()

  useEffect(() => {
    fetchBookingsAndUnavailablePeriods()

    if (!socket) return

    const handleBookingCreated = (booking: Booking) => {
      setBookings(prev => [...prev, booking])
    }

    const handleBookingUpdated = ({ bookingId, updatedBooking }: { bookingId: string, updatedBooking: Booking }) => {
      setBookings(prev => prev.map(booking =>
        booking.id === bookingId ? updatedBooking : booking
      ))
    }

    const handleBookingDeleted = (bookingId: string) => {
      setBookings(prev => prev.filter(booking => booking.id !== bookingId))
    }

    socket.on('booking:created', handleBookingCreated)
    socket.on('booking:updated', handleBookingUpdated)
    socket.on('booking:deleted', handleBookingDeleted)

    return () => {
      socket.off('booking:created', handleBookingCreated)
      socket.off('booking:updated', handleBookingUpdated)
      socket.off('booking:deleted', handleBookingDeleted)
    }
  }, [socket, currentUser])

  const fetchBookingsAndUnavailablePeriods = async () => {
    try {
      const result = await getSchedules()
      if (result instanceof Error) {
        throw result
      }

      const { bookings: fetchedBookings, unavailablePeriods: fetchedUnavailablePeriods } = result

      setBookings(fetchedBookings.map(booking => ({
        ...booking,
        startTime: new Date(booking.startTime),
        endTime: new Date(booking.endTime)
      })))

      setUnavailablePeriods(fetchedUnavailablePeriods.map(period => ({
        ...period,
        startTime: new Date(period.startTime),
        endTime: new Date(period.endTime)
      })))

      if (currentUser) {
        const userBookings = fetchedBookings
          .filter(booking => booking.id?.replace(/_[^_]*$/, '') === currentUser.uid)
          .map(booking => ({
            ...booking,
            id: `${currentUser.uid}_${booking.scheduleNumber}`,
            startTime: new Date(booking.startTime),
            endTime: new Date(booking.endTime)
          }))
        setUserBookings(userBookings)
      }
    } catch (error) {
      console.error('Error fetching schedules:', error)
      toast({
        title: "Error fetching schedules",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleBookingSubmit = async (date: Date, startTime: string, endTime: string) => {
    if (!currentUser || !bookingService) {
      toast({
        title: "Error",
        description: "You must be logged in to book",
        variant: "destructive",
      })
      return
    }

    const newBooking: CreateBookingDTO = {
      startTime: new Date(moment(date).set({
        hour: parseInt(startTime.split(':')[0]),
        minute: parseInt(startTime.split(':')[1]),
        second: 0,
        millisecond: 0
      }).toDate()),
      endTime: new Date(moment(date).set({
        hour: parseInt(endTime.split(':')[0]),
        minute: parseInt(endTime.split(':')[1]),
        second: 0,
        millisecond: 0
      }).toDate()),
      user: currentUser
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const createdBooking = await createSchedule(newBooking)
      await bookingService.createBooking(newBooking)
      toast({
        title: "Success",
        description: "Booking created successfully",
      })
    } catch (error) {
      console.error("Error creating booking:", error)
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive",
      })
    }

    setIsBookingModalOpen(false)
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!currentUser || !bookingService) return

    try {
      const [userId, scheduleId] = bookingId.split('_')
      await deleteSchedule(userId, scheduleId)
      await bookingService.deleteBooking(bookingId)
      toast({
        title: "Success",
        description: "Booking cancelled successfully",
      })
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      })
    }
  }

  const handleRescheduleBooking = async (bookingId: string, newStartTime: Date, newEndTime: Date) => {
    if (!currentUser || !bookingService) return

    try {
      const [userId, scheduleId] = bookingId.split('_')
      const updatedBookingData: UpdateBookingDTO = { startTime: newStartTime, endTime: newEndTime }
      const updatedBooking = await updateSchedule(userId, scheduleId, updatedBookingData)
      if (updatedBooking instanceof Error) {
        throw updatedBooking
      }
      await bookingService.updateBooking(bookingId, updatedBookingData)
      toast({
        title: "Success",
        description: "Booking rescheduled successfully",
      })
    } catch (error) {
      console.error("Error rescheduling booking:", error)
      toast({
        title: "Error",
        description: "Failed to reschedule booking",
        variant: "destructive",
      })
    }

    setIsReschedulingModalOpen(false)
    setSelectedBooking(null)
  }

  const filteredBookings = useMemo(() =>
    bookings.filter(booking => moment(booking.startTime).isSameOrAfter(moment(), 'day')),
    [bookings]
  )

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen mt-24">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <BookingCalendar
          events={[
            ...filteredBookings.map((booking) => ({
              id: booking.id,
              start: booking.startTime,
              end: booking.endTime,
              title: "Booked"
            })),
            ...unavailablePeriods.map((period) => ({
              id: period.id,
              title: period.reason,
              start: period.startTime,
              end: period.endTime,
            })),
          ]}
        />
        <div className="lg:col-span-1 space-y-8">
          <BookingInstructions />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full"
              disabled={!currentUser}
            >
              Book Now
            </Button>
          </motion.div>
          <UpcomingBookings
            bookings={userBookings.map((booking) => ({
              id: booking.id,
              date: moment(booking.startTime).format('YYYY-MM-DD'),
              startTime: moment(booking.startTime).format('HH:mm'),
              endTime: moment(booking.endTime).format('HH:mm'),
            }))}
            onCancel={handleCancelBooking}
            onReschedule={(bookingId) => {
              const booking = userBookings.find(b => b.id === bookingId)
              if (booking) {
                setSelectedBooking(booking)
                setIsReschedulingModalOpen(true)
              }
            }}
          />
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmit={handleBookingSubmit}
        bookedSlots={filteredBookings}
        unavailablePeriods={unavailablePeriods}
      />

      {selectedBooking && (
        <BookingModal
          isOpen={isReschedulingModalOpen}
          onClose={() => {
            setIsReschedulingModalOpen(false)
            setSelectedBooking(null)
          }}
          onSubmit={(date, startTime, endTime) => {
            const newStartTime = new Date(moment(date).set({
              hour: parseInt(startTime.split(':')[0]),
              minute: parseInt(startTime.split(':')[1]),
              second: 0,
              millisecond: 0
            }).toDate())
            const newEndTime = new Date(moment(date).set({
              hour: parseInt(endTime.split(':')[0]),
              minute: parseInt(endTime.split(':')[1]),
              second: 0,
              millisecond: 0
            }).toDate())
            handleRescheduleBooking(selectedBooking.id, newStartTime, newEndTime)
          }}
          bookedSlots={filteredBookings.filter(booking => booking.id !== selectedBooking.id)}
          unavailablePeriods={unavailablePeriods}
          initialDate={selectedBooking.startTime}  // Pass initialDate here
          initialStartTime={moment(selectedBooking.startTime).format('HH:mm')} // Pass initialStartTime here
          initialEndTime={moment(selectedBooking.endTime).format('HH:mm')}  // Pass initialEndTime here
        />
      )}

      <SupportChat />
    </div>
  )
}

