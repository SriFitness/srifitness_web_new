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
import { getSchedules } from '../server/db/get-schedules'
import Cookies from "js-cookie"; 

interface Booking {
  id: string
  title: string
  startTime: Date
  endTime: Date
  userId: string
  userName: string
}

interface UnavailablePeriod {
  id: string
  startTime: Date
  endTime: Date
  reason: string
}

export default function IndoorBookingPage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [unavailablePeriods, setUnavailablePeriods] = useState<UnavailablePeriod[]>([])
  const [userBookings, setUserBookings] = useState<Booking[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchBookingsAndUnavailablePeriods()
  }, [])

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

      // Fetch user bookings (assuming we have a logged-in user)
      // This would typically be filtered on the server side
      setUserBookings(fetchedBookings.filter(booking => booking.userId === 'current-user-id').map(booking => ({
        ...booking,
        startTime: new Date(booking.startTime),
        endTime: new Date(booking.endTime)
      })))
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
    const newBooking = {
      title: 'New Booking',
      startTime: moment(date).set({
        hour: parseInt(startTime.split(':')[0]),
        minute: parseInt(startTime.split(':')[1]),
        second: 0,
        millisecond: 0
      }).toDate(),
      endTime: moment(date).set({
        hour: parseInt(endTime.split(':')[0]),
        minute: parseInt(endTime.split(':')[1]),
        second: 0,
        millisecond: 0
      }).toDate()
    }

    try {
      const response = await fetch('/api/indoor/schedules/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get("firebaseIdToken")}`, 
        },
        body: JSON.stringify(newBooking),
      })

      if (response.ok) {
        const data = await response.json()
        setBookings([...bookings, { ...newBooking, id: data.id }])
        setUserBookings([...userBookings, { ...newBooking, id: data.id }])
        toast({
          title: "Booking successful",
          description: "Your indoor facility has been booked.",
        })
      } else {
        throw new Error('Failed to book')
      }
    } catch (error) {
      console.error('Error booking:', error)
      toast({
        title: "Booking failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    }

    setIsBookingModalOpen(false)
  }

  const filteredBookings = useMemo(() =>
    bookings.filter(booking => moment(booking.startTime).isSameOrAfter(moment(), 'day')),
    [bookings]
  )

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center text-gray-800"
      >
        Indoor Facility Booking
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <BookingCalendar
          events={[
            ...filteredBookings.map((booking) => ({
              id: parseInt(booking.id, 10), // Convert string ID to number
              start: booking.startTime,
              end: booking.endTime,
            })),
            ...unavailablePeriods.map((period) => ({
              id: parseInt(period.id, 10), // Convert string ID to number
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
            >
              Book Now
            </Button>
          </motion.div>
          <UpcomingBookings
            bookings={userBookings.map((booking) => ({
              id: parseInt(booking.id, 10),
              date: moment(booking.startTime).format('YYYY-MM-DD'),
              startTime: moment(booking.startTime).format('HH:mm'),
              endTime: moment(booking.endTime).format('HH:mm'),
            }))}
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

      <SupportChat />
    </div>
  )
}

